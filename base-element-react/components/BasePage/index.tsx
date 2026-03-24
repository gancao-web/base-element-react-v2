import { useState, useRef, useImperativeHandle } from 'react';
import { message } from 'antd';
import { getBaseConfig } from '../../config';
import BaseList from '../BaseList';
import BaseModal from '../BaseModal';
import { deepClone } from '../../util';
import type { BaseObj } from '../../typing';
import type { BaseListRef, BaseListTableBtn } from '../BaseList/typing';
import type {
  BasePageProps,
  BaseDialogConfig,
  BasePageRef,
  BaseDialogContext,
  BaseDialog,
} from './typing';
import './index.less';

/**
 * 配置化页面
 */
const BasePage = (props: BasePageProps) => {
  // 列表配置
  const listConfig = initListConfig();
  // 列表组件ref
  const refList = useRef<BaseListRef>();

  // 弹窗是否显示
  const [modalVisible, setModalVisible] = useState(false);
  // 弹窗回显的rowKey,可用来判断是否编辑
  const [modalRowKey, setModalRowKey] = useState<string | number>();
  // 弹窗标题
  const [modalTitle, setModalTitle] = useState<React.ReactNode>();
  // 弹窗是否可拖拽
  const [modalDraggable, setModalDraggable] = useState<boolean>();
  // 弹窗配置
  const [modalConfig, setModalConfig] = useState<BaseDialogConfig>();
  // 弹窗的ref
  const refDialog = useRef<BasePageRef>();

  // ref的数据
  const refData = useRef<{ onDialogSubmit?: () => void }>({
    onDialogSubmit: undefined,
  });

  // 是否为表单弹窗
  const isModalForm = modalConfig && !('table' in modalConfig);

  // 设置父组件通过ref可访问的内容
  const refPage: BasePageRef = {
    getParam: () => {
      return refList.current!.getParam();
    },
    getParamValid: () => {
      return refList.current!.getParamValid();
    },
    setParam: (param) => {
      return refList.current?.setParam(param);
    },
    reload: () => {
      return refList.current?.reload();
    },
    refresh: () => {
      return refList.current?.refresh();
    },
    reset: () => {
      return refList.current?.reset();
    },
    getContext: () => {
      return refList.current!.getContext();
    },
    setPageNo: (pageNo) => {
      return refList.current?.setPageNo(pageNo);
    },
    setPageSize: (pageSize) => {
      return refList.current?.setPageSize(pageSize);
    },
    openDialog,
    closeDialog,
    setDialogSubmit: (onSubmit) => {
      refData.current.onDialogSubmit = onSubmit;
    },
  };
  // 注册refPage
  useImperativeHandle(props.refPage, () => refPage);

  // 列表页的配置
  function initListConfig() {
    const pageConfig = props.config;
    // 列表的rowKey判断
    const rowKey = pageConfig.rowKey || getBaseConfig().rowKey;
    // 工具栏的特殊处理
    const btns = pageConfig.btns?.map((btn) => {
      if (btn.dialog) {
        return { ...btn, click: () => openDialog(btn.dialog!, btn.label) };
      } else {
        return btn;
      }
    });
    // 表格的特殊处理
    const table = pageConfig.table?.map((item) => {
      if (item.btns) {
        return { ...item, btns: formatTableBtns(item.btns) };
      } else {
        return item;
      }
    });

    return {
      ...pageConfig,
      rowKey,
      btns,
      table,
    };
  }

  // table的btns特殊处理
  function formatTableBtns(btns?: BaseListTableBtn[]): BaseListTableBtn[] | undefined {
    return btns?.map((btn) => {
      if (btn.dialog) {
        return {
          ...btn,
          click: (row: BaseObj) => {
            const title = typeof btn.label === 'function' ? btn.label(row) : btn.label;
            return openDialog(btn.dialog!, title, row);
          },
        };
      } else if (btn.more) {
        return {
          ...btn,
          more: formatTableBtns(btn.more),
        };
      } else {
        return btn;
      }
    });
  }

  // 打开弹窗
  async function openDialog(dialog: BaseDialog, title: React.ReactNode, row?: BaseObj) {
    const cloneRow = row ? deepClone(row) : {}; // 深拷贝,避免污染原数据
    const isEdit = row ? true : false; // 从表格进来的会带入当前行,为编辑表单
    const ctx: BaseDialogContext = {
      ...refPage.getContext(),
      row: cloneRow,
      isEdit,
      refPage,
      refDialog,
    };
    const config = await dialog(ctx);
    // 打开弹窗之前的回调
    if (config.beforeOpen) {
      const isOpen = await config.beforeOpen();
      if (isOpen === false) return;
    }
    const modalConfig = { ...config, defaultValue: { ...cloneRow, ...config.defaultValue } };
    setModalConfig(modalConfig);
    setModalRowKey(cloneRow[listConfig.rowKey]);
    setModalTitle(modalConfig.title || title);
    setModalDraggable(modalConfig.draggable);
    modalConfig.onOpen?.();
    if (isEdit) {
      // 通过接口回显详情 (先用列表数据回显,再通过接口数据回显)
      setModalVisible(true);
      if (modalConfig.apiDetail) {
        const param = { [listConfig.rowKey]: cloneRow[listConfig.rowKey] };
        modalConfig.apiDetail(param).then((res) => {
          // 方案1: 先请求数据再显示列表,如果网络慢会有卡顿现象 (非响应式的组件,参考富文本在内部通过ref处理首次回显)
          // setModalData(res);
          // setModalVisible(true);
          // 方案2: 组件初始化之后需通过ref动态改变 (先显示列表数据,再展示回显详情接口)
          refDialog.current?.setParam(res);
        });
      }
    } else {
      // 按钮栏弹窗直接显示
      setModalVisible(true);
    }
  }

  // 关闭弹窗
  function closeDialog() {
    setModalVisible(false);
    setModalTitle(undefined);
    setModalDraggable(undefined);
    setModalConfig(undefined);
    setModalRowKey(undefined);
    modalConfig?.onClose?.();
    refData.current.onDialogSubmit = undefined;
  }

  // 编辑页弹窗
  let dialogEdit: React.ReactNode;
  const [dialogEditting, setdialogEditting] = useState(false);
  if (modalConfig) {
    let footer: React.ReactNode = false;
    let onOk;
    if ('render' in modalConfig && modalConfig.render) {
      footer = undefined;
      onOk = () => {
        refData.current.onDialogSubmit?.();
      };
    } else if (modalConfig.apiSubmit) {
      footer = undefined;
      onOk = async () => {
        // 表单弹窗
        const param = await refDialog.current!.getParamValid();
        // 在过滤之前,把编辑的id添加进去
        if (modalRowKey !== undefined) param[listConfig.rowKey] = modalRowKey;
        // 加载中
        setdialogEditting(true);
        try {
          const { selectedRowKeys } = refDialog.current!.getContext();
          const apiSubmit = modalConfig.apiSubmit!(param, selectedRowKeys);

          // 直接返回false则不发请求
          if (apiSubmit === false) {
            throw new Error();
          }

          // async return false的情况 或 接口直接返回false
          const res = await apiSubmit;
          if (res === false) {
            throw new Error();
          }

          // 接口调用成功的回调
          if (modalConfig.onSubmitOk) {
            const isClose = await modalConfig.onSubmitOk(res);
            if (isClose === false) {
              setdialogEditting(false);
              return;
            }
          }
        } catch (e) {
          console.error('BasePage apiSubmit error:', e);
          // 捕获请求异常,关闭进度条
          setdialogEditting(false);
          return;
        }
        // 关闭弹窗
        setdialogEditting(false);
        closeDialog();
        if (!modalConfig.submitReloadType || modalConfig.submitReloadType === 'auto') {
          // 自动 (编辑弹窗刷新列表, 新增弹窗重置列表)
          if (modalRowKey) {
            refList.current?.refresh();
          } else {
            refList.current?.reload();
          }
        } else if (modalConfig.submitReloadType === 'refresh') {
          // 强制刷新列表
          refList.current?.refresh();
        } else if (modalConfig.submitReloadType === 'reload') {
          // 强制重置列表
          refList.current?.reload();
        }
        // 默认提示操作成功
        if (!modalConfig.onSubmitOk) {
          message.success('操作成功');
        }
      };
    }

    // 弹窗样式
    const modalWidth = modalConfig.width || 750;
    const modalPaddingX = modalConfig.paddingX || (isModalForm ? 72 : 4);
    const modalBodyStyle: React.CSSProperties = {
      maxHeight: 'calc(100vh - 230px)',
      overflowY: 'auto',
      padding: isModalForm ? `24px ${modalPaddingX}px` : `4px ${modalPaddingX}px`,
      minHeight: modalConfig.minHeight,
    };

    // 抽屉
    const isDrawer = modalConfig.drawer == true;

    dialogEdit = (
      <BaseModal
        wrapClassName={isDrawer ? 'base-page-modal-drawer' : ''}
        className="base-page-modal"
        transitionName={isDrawer ? '' : undefined}
        title={modalTitle}
        width={modalWidth}
        open={modalVisible}
        draggable={modalDraggable}
        bodyStyle={modalBodyStyle}
        footer={modalConfig.footer !== undefined ? modalConfig.footer : footer}
        onOk={onOk}
        confirmLoading={dialogEditting}
        onCancel={closeDialog}
        okText={modalConfig.okText}
        cancelText={modalConfig.cancelText}
      >
        {
          // 自定义弹窗
          'render' in modalConfig ? (
            modalConfig.render
          ) : (
            // 递归组件,弹窗中继续支持弹窗
            <BasePage refPage={refDialog} config={modalConfig} />
          )
        }
      </BaseModal>
    );
  }

  return (
    <div className={props.className} style={props.style}>
      {/* 列表页 */}
      <BaseList refList={refList} config={listConfig}>
        {/* 插槽 */}
        {props.children}
      </BaseList>

      {/* 编辑弹窗 */}
      {dialogEdit}
    </div>
  );
};

export default BasePage;
