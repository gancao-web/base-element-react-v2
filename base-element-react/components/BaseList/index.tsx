import { useEffect, useState, useRef, useImperativeHandle } from 'react';
import { ColumnHeightOutlined, ReloadOutlined, UpOutlined } from '@ant-design/icons';
import { Dropdown, message, Tooltip } from 'antd';
import BaseForm from '../BaseForm';
import BaseTable from '../BaseTable';
import BaseTableDrag from '../BaseTableDrag';
import { getBaseConfig } from '../../config';
import { createUUID, getObjValue } from '../../util';
import { defItemBottom, defItemRight } from '../BaseForm/def';
import BaseButton from '../BaseButton';
import { getCacheColumns } from './util/cache';
import ToolBtns from './components/ToolBtns';
import DropdownSet from './components/DropdownSet';
import type { CheckboxValueType } from 'antd/es/checkbox/Group';
import type { BaseFormConfig, BaseFormItem, BaseFormRef } from '../BaseForm/typing';
import type { BaseInputItem } from '../BaseInput/typing';
import type {
  BaseTableBtn,
  BaseTableConfig,
  BaseTableItem,
  BaseTableSize,
  LastTdBtnIndex,
} from '../BaseTable/typing';
import type {
  BaseListBtn,
  BaseListProps,
  BaseListRef,
  BaseListRefData,
  BaseListTableBtn,
} from './typing';
import './index.less';

const pageNoDefault = 1;
const pageSizeDefault = 10;

/**
 * 配置化列表
 */
const BaseList = (props: BaseListProps) => {
  const baseConfig = getBaseConfig();

  // BaseList配置
  const listConfig = props.config;
  // 表格页码
  const [pageNo, setPageNo] = useState(listConfig.pageNo);
  // 表格页长
  const [pageSize, setPageSize] = useState(listConfig.pageSize);
  // 表格列表
  const [list, setList] = useState(listConfig.list);
  // 选中的key
  const [selectedRowKeys, setSelectedRowKeys] = useState(listConfig.selectedRowKeys);
  // 表格总数
  const [total, setTotal] = useState(listConfig.total);
  // 是否加载中 (在表格中显示)
  const [tableLoading, setTableLoading] = useState(false);
  // 是否加载中 (在搜索按钮中显示)
  const [btnSearching, setBtnSearching] = useState(false);
  // 是否为列表搜索
  const hasTable = !!listConfig.table?.length;
  // 需要展示的列
  const cacheColumns = getCacheColumns(listConfig.table); // 缓存显示的列
  const defaultClumnIndexs = getDefaultClumnIndexs(); // 默认显示的列
  const [clumnIndexs, setClumnIndexs] = useState<CheckboxValueType[]>([]);
  // 表单高度
  const [formMaxHeight, setFormMaxHeight] = useState<number>();
  // 当前需要高亮的操作按钮
  const [lastTdBtnIndex, setLastTdBtnIndex] = useState<LastTdBtnIndex>();
  // 列表dom对象
  const refFormWrap = useRef<HTMLDivElement>(null);
  // 重置搜索父元素的dom对象
  const refSearchWarp = useRef<HTMLDivElement>(null);
  // 按钮栏dom对象
  const refBtns = useRef<HTMLDivElement>(null);
  // 按钮栏高度
  const [btnsHeight, setBtnsHeight] = useState(0);
  // 是否显示按钮栏
  const hasBtns = !!listConfig.btns?.filter((item) => item.vif !== false).length;
  const isShowBtns = props.children || hasBtns || hasTable;

  // 缓存实时变量
  const refData = useRef<BaseListRefData>({
    pageNo: pageNoDefault,
    pageSize: pageSizeDefault,
    selectedRowKeys: [],
    selectedRows: [],
    isListInit: false,
    sorter: {},
  }).current;

  // 表单配置
  const refForm = useRef<BaseFormRef>();
  const autoComplete = listConfig.autoComplete ?? 'on';
  const formItems: BaseFormItem[] = [];
  if (listConfig.form) {
    for (const item of listConfig.form) {
      // 过滤不显示的form
      if (item.vif === false) continue;

      if (hasTable) {
        // 输入框
        if (!item.comp || item.comp == 'input') {
          const itemInput = item as BaseInputItem;
          if (autoComplete && itemInput.prop) {
            itemInput.name = itemInput.prop.toString();
            itemInput.autoComplete = 'on';
          }

          if (itemInput.isEnterBlur === undefined) {
            itemInput.isEnterBlur = true;
          }

          if (!itemInput.onPressEnter) {
            itemInput.onPressEnter = () => reload();
          }
        }

        // 选择输入
        if (item.comp === 'select-input') {
          if (!item.field) item.field = {};
          // 左边选项变化&有值
          if (!item.onLabelChange) {
            item.onLabelChange = (value, labelIndex) => {
              if (value[labelIndex]) {
                reload();
              }
            };
          }
          if (!item.field.comp || item.field.comp === 'input') {
            const itemInput = item.field as BaseInputItem;

            if (autoComplete && item.prop?.length) {
              itemInput.name = item.prop[0].value.toString();
              itemInput.autoComplete = 'on';
            }

            if (itemInput.isEnterBlur === undefined) {
              itemInput.isEnterBlur = true;
            }

            if (!itemInput.onPressEnter) {
              itemInput.onPressEnter = () => reload();
            }
          } else {
            // 其他选择框,输入变化就触发搜索
            item.onValueChange = () => reload();
          }
        }
      }
      formItems.push(item);
    }
  }

  // 当前配置了table属性,则labelWidth自动适配,inline默认true
  const formConfig: BaseFormConfig = {
    isFilterEmpty: hasTable,
    ...listConfig,
    autoComplete,
    form: formItems,
    labelWidth:
      listConfig.labelWidth || (hasTable ? (formItems.length > 4 ? 100 : 'auto') : undefined),
    inline: listConfig.inline ?? hasTable ? true : undefined,
    onChange(form, item) {
      // 选择类型的组件,自动搜索
      const isAutoItem =
        item.comp &&
        [
          'tabs',
          'segmented',
          'select',
          'cascader',
          'checkbox',
          'picker-date',
          'picker-time',
          'radio',
          'switch',
        ].includes(item.comp);
      // 显式设置自动搜索的也可以触发
      if (item.autoSearch || (isAutoItem && item.autoSearch !== false)) {
        reload();
      }
      // 对外派发onChange事件
      listConfig.onFormChange?.(form, item);
    },
  };

  // 每个item的下边距
  const itemRight = formConfig.itemRight ?? defItemRight;
  const itemBottom = formConfig.itemBottom ?? defItemBottom;

  // 吸顶悬浮配置 (按钮栏+表头)
  const { offsetHeader = 0, btnsSticky, tableSticky } = getStickyConfig();
  const stickyBtnsTop = btnsSticky ? offsetHeader : 0;
  const stickyTableTop = tableSticky ? stickyBtnsTop + btnsHeight : 0;

  // 表格行高
  const [tableSize, setTableSize] = useState<BaseTableSize>('middle');
  const tableSizeItems = [
    { label: '宽大', key: 'large' },
    { label: '默认', key: 'middle' },
    { label: '紧凑', key: 'small' },
  ];

  // 表格配置
  const tableConfig: BaseTableConfig = {
    ...listConfig,
    sticky: tableSticky ? { offsetHeader: stickyTableTop } : undefined,
    table: [],
    size: tableSize,
    list: list || [],
    pageNo,
    pageSize,
    total,
    loading: tableLoading,
    onChange(e) {
      toSetPageNo(e.pageNo);
      toSetPageSize(e.pageSize);
      refData.sorter = e.sorter;
      refresh();
      // 对外派发onChange
      listConfig.onTableChange?.(e);
    },
    selectedRowKeys,
    onRowSelectionChange(selectedRowKeys, selectedRows) {
      setSelectedRowKeys(selectedRowKeys);
      refData.selectedRowKeys = selectedRowKeys;
      setSelectedRow();
    },
    lastTdBtnIndex,
    onLastTdBtnIndexChange: (e) => setLastTdBtnIndex(e),
  };

  // 设置页码
  function toSetPageNo(pageNo: number) {
    setPageNo(pageNo);
    refData.pageNo = pageNo;
  }

  // 设置页长
  function toSetPageSize(pageSize: number) {
    setPageSize(pageSize);
    refData.pageSize = pageSize;
  }

  const rowKey = tableConfig.rowKey || baseConfig.rowKey;

  if (hasTable && listConfig.table) {
    for (let i = 0; i < listConfig.table.length; i++) {
      if (!clumnIndexs.includes(i)) continue;
      const item = listConfig.table[i];
      const tbItem: BaseTableItem = { label: '' };
      for (const key in item) {
        if (key === 'api') {
          // 接口请求
          tbItem.api = async (param, row) => {
            const res = await item.api?.(param, row);
            refList.refresh();
            return res;
          };
        } else if (key === 'btns' && item.btns) {
          // 按钮
          tbItem.btns = formatTableBtns(item.btns);
        } else {
          tbItem[key] = item[key];
        }
      }
      tableConfig.table.push(tbItem);
    }
  }

  // 设置父组件通过ref可访问的内容
  const refList: BaseListRef = {
    getParam: () => {
      return refForm.current?.getParam() || {};
    },
    getParamValid: () => {
      return refForm.current?.getParamValid() || Promise.resolve({});
    },
    setParam: (param) => {
      return refForm.current?.setParam(param);
    },
    setPageNo: toSetPageNo,
    setPageSize: toSetPageSize,
    reload,
    refresh,
    reset,
    getContext,
  };
  useImperativeHandle(props.refList, () => refList);

  // 按钮栏
  function btnFormClick(btn: BaseListBtn) {
    const ctx = getContext();
    if (btn.click) {
      // 自定义点击
      return btn.click(ctx);
    } else if (btn.api) {
      // 点击按钮调用api
      return btn.api(ctx).then(() => {
        refList.reload();
      });
    }
  }

  // 获取上下文数据
  function getContext() {
    const form = refForm.current?.getParam() || {};
    return { ...refData, form, list: list || [] };
  }

  // 刷新 (重置表单参数,重置页码为第一页)
  function reset() {
    refForm.current?.reset();
    listConfig.onReset?.();
    reload();
  }

  // 刷新 (保持表单参数,但是页码重置为第一页)
  function reload(pageNo = 1) {
    toSetPageNo(pageNo);
    refresh();
  }

  // 刷新 (保持表单参数和页码)
  async function refresh() {
    if (!listConfig.apiSearch) {
      stopSearching();
      return;
    }
    try {
      // 分页参数
      const param = (await refForm.current?.getParamValid()) || {};
      param[baseConfig.pageKey] = refData.pageNo;
      param[baseConfig.sizeKey] = refData.pageSize;
      // 请求列表数据
      setTableLoading(true);
      const res = await listConfig.apiSearch(param, refData.sorter);
      // 返回false,则不处理
      if (res === false) {
        stopSearching();
        return;
      }
      // 设置list和total
      const isResArray = Array.isArray(res);
      const list = isResArray ? res : getObjValue(res, baseConfig.listKey, []);
      const total = isResArray ? res.length : getObjValue(res, baseConfig.totalKey, 0);
      // 当前页空,则自动加载上一页数据
      if (list.length == 0 && refData.pageNo > 1) {
        reload(refData.pageNo - 1);
      } else {
        // 自动生成rowKey
        if (tableConfig.rowKeyRandom) {
          if (tableConfig.rowKeyRandom === true) {
            // 随机uuid
            for (const row of list) {
              row[rowKey] = createUUID();
            }
          } else if (tableConfig.rowKeyRandom.length) {
            // 字段组合
            for (const row of list) {
              row[rowKey] = tableConfig.rowKeyRandom.map((key) => row[key]).join('_');
            }
          }
        }

        // 更新数据
        setList(list);
        setTotal(total);
      }
    } catch (e) {
      console.error('BaseList refresh error:', e);
    } finally {
      stopSearching();
    }
  }

  // 刷新成功失败都关闭进度条
  function stopSearching() {
    setTableLoading(false);
    setBtnSearching(false);
  }

  // form表单是否收起
  const [isCallapseForm, setIsCallapseForm] = useState(false);
  const callapse =
    listConfig.callapse === undefined && formItems.length > 8 ? 2 : listConfig.callapse;

  const callapseHeight = isCallapseForm && callapse ? callapse * (32 + itemBottom) : formMaxHeight;

  // 在setSelectedRowKeys时更新selectedRows (注意: 'refData.selectedRowKeys = selectedRowKeys'需写在'setSelectedRow()'前面)
  function setSelectedRow() {
    refData.selectedRows = [];
    if (list && refData.selectedRowKeys.length) {
      for (const row of list) {
        if (refData.selectedRowKeys.includes(row[rowKey])) {
          refData.selectedRows.push(row);
        }
      }
    }
    // 触发外部rowSelection钩子
    listConfig.onRowSelectionChange?.(refData.selectedRowKeys, refData.selectedRows);
  }

  // 显示或隐藏收起时查询按钮底下的item
  function setCallapseItemStatus(isShow: boolean) {
    if (!refFormWrap.current || !refSearchWarp.current) return;
    refFormWrap.current.querySelectorAll('.base-form > .ant-form-item').forEach((item) => {
      if (!(item instanceof HTMLElement) || !refSearchWarp.current) return;

      item.style.opacity = '1';
      item.style.pointerEvents = 'auto';
      // item.style.visibility = 'visible'; // 占位&不接受事件 (因隐藏得有点慢,所以采用opacity的方式)

      if (
        !isShow &&
        item.offsetTop + item.clientHeight >= refSearchWarp.current.offsetTop &&
        item.offsetLeft + item.clientWidth > refSearchWarp.current.offsetLeft
      ) {
        item.style.opacity = '0';
        item.style.pointerEvents = 'none';
      }
    });
  }

  // table的btns特殊处理
  function formatTableBtns(btns?: BaseListTableBtn[]) {
    if (!btns) return undefined;
    const tbBtns: BaseTableBtn[] = [];
    for (const btn of btns) {
      const tbBtn: BaseTableBtn = { label: '' };
      for (const k in btn) {
        if (k == 'api') {
          // 调接口
          tbBtn.click = async function (row, index) {
            // 按钮标签
            const label = typeof btn.label == 'function' ? btn.label(row) : btn.label;
            const res = await btn.api!(row, index, getContext());
            if (res === false) return; // 返回false,则不处理
            message.success(btn.tipOk || `${label}成功`);
            refList.refresh();
          };

          // 默认提示
          if (!btn.tip) {
            const label = typeof btn.label == 'function' ? '操作' : btn.label;
            tbBtn.tip = `确定${label}吗？`;
          }
        } else if (k == 'more') {
          // 更多
          tbBtn.more = formatTableBtns(btn.more);
        } else if (k == 'click') {
          // 点击事件新增上下文
          tbBtn.click = function (row, index) {
            return btn.click!(row, index, getContext());
          };
        } else {
          tbBtn[k] = btn[k];
        }
      }
      tbBtns.push(tbBtn);
    }

    return tbBtns;
  }

  // 点击操作按钮的空白处,取消标记
  function cancelLastTdBtnIndex() {
    listConfig.isActLastTdBtn && setLastTdBtnIndex(undefined);
  }

  // 默认展示的列表
  function getDefaultClumnIndexs() {
    const clumnIndexs: CheckboxValueType[] = [];
    listConfig.table?.forEach((item, i) => {
      if (item.defaultShow !== false) {
        clumnIndexs.push(i);
      }
    });

    return clumnIndexs;
  }

  function getStickyConfig() {
    const sticky = listConfig.sticky ?? getBaseConfig().sticky;
    const btnsSticky = hasBtns ? undefined : false;
    if (!sticky) {
      return { btnsSticky: btnsSticky ?? false, tableSticky: false };
    }
    if (sticky === true) {
      return { btnsSticky: btnsSticky ?? true, tableSticky: true };
    }
    return { btnsSticky: btnsSticky ?? true, tableSticky: true, ...sticky };
  }

  useEffect(() => {
    // 显示或隐藏item
    setCallapseItemStatus(!isCallapseForm);

    if (isCallapseForm && refFormWrap.current) {
      // 收起的时候添加监听事件,实时隐藏被遮住的item
      refData.formResizeObserver = new ResizeObserver((entries) => {
        for (const entry of entries) {
          if (entry.target === refFormWrap.current) {
            setCallapseItemStatus(false);
          }
        }
      });
      refData.formResizeObserver.observe(refFormWrap.current);
    } else {
      // 展开的时候不需要监听
      refData.formResizeObserver?.disconnect();
    }

    // 组件销毁时移除监听
    return () => {
      refData.formResizeObserver?.disconnect();
    };
  }, [isCallapseForm]);

  useEffect(() => {
    if (btnsSticky && refBtns.current) {
      setBtnsHeight(refBtns.current.clientHeight);
      refData.btnsResizeObserver = new ResizeObserver((entries) => {
        for (const entry of entries) {
          if (entry.target === refBtns.current) {
            setBtnsHeight(entry.target.clientHeight);
          }
        }
      });
      refData.btnsResizeObserver.observe(refBtns.current);
    } else {
      setBtnsHeight(0);
      refData.btnsResizeObserver?.disconnect();
    }

    return () => {
      refData.btnsResizeObserver?.disconnect();
    };
  }, [btnsSticky]);

  // 组件内使用了useState,需useEffect同步外部的设置
  useEffect(() => {
    toSetPageNo(listConfig.pageNo || pageNoDefault);
  }, [listConfig.pageNo]);

  useEffect(() => {
    toSetPageSize(listConfig.pageSize || pageSizeDefault);
  }, [listConfig.pageSize]);

  useEffect(() => {
    setList(listConfig.list);
  }, [listConfig.list]);

  useEffect(() => {
    setTotal(listConfig.total);
  }, [listConfig.total]);

  useEffect(() => {
    setSelectedRowKeys(listConfig.selectedRowKeys);
    refData.selectedRowKeys = listConfig.selectedRowKeys || [];
    setSelectedRow();
  }, [listConfig.selectedRowKeys]);

  // 列变化的时候需更新缓存
  useEffect(() => {
    setClumnIndexs(cacheColumns || defaultClumnIndexs);
  }, [defaultClumnIndexs.toString()]);

  // 列表变化的时候置空选中的key
  useEffect(() => {
    const disSelectedRowKeys = listConfig.selectedRowKeys?.length && !refData.isListInit;
    // 当外部指定选中的key时,必须等list初始化完成之后才能更新
    if (!disSelectedRowKeys) {
      setSelectedRowKeys([]);
      refData.selectedRowKeys = [];
      setSelectedRow();
    }
    refData.isListInit = list !== undefined;
  }, [list]);

  useEffect(() => {
    // 加载列表
    reload();

    // 页面展示时,刷新列表
    const visibilitychange = () => {
      document.visibilityState == 'visible' && refresh();
    };

    if (listConfig.onShowRefresh) {
      document.addEventListener('visibilitychange', visibilitychange);
    }

    return () => {
      if (listConfig.onShowRefresh) {
        document.removeEventListener('visibilitychange', visibilitychange);
      }
    };
  }, []);

  return (
    <div className="base-list" style={props.style}>
      {/* 表单 */}
      {formItems.length > 0 && (
        <div
          ref={refFormWrap}
          className={hasTable ? `base-list-form ${isCallapseForm ? 'form-callapse-hide' : ''}` : ''}
          style={{ overflowX: hasTable ? 'hidden' : undefined }}
          onClick={() => cancelLastTdBtnIndex()}
        >
          {/* 每个表单项都向右和向下设置了margin,为保证右侧和下边对齐,需整体减去margin,然后父元素overflowX:hidden避免页面底部出现滚动条 */}
          <BaseForm
            refForm={refForm}
            style={{
              height: callapseHeight,
              marginBottom: -itemBottom,
              marginRight: hasTable ? -itemRight : undefined,
              ...listConfig.styleForm,
            }}
            config={formConfig}
          >
            {/* base-list-search是定位右下角的,此处需占位,避免遮住表单 */}
            {hasTable && (
              <div className="base-list-search-space" style={{ marginBottom: itemBottom }} />
            )}

            {hasTable && listConfig.isShowBtnSearch !== false && (
              <div ref={refSearchWarp} className="base-list-search">
                {!!callapse && (
                  <BaseButton
                    className="base-btn-callapse"
                    type="link"
                    onClick={() => {
                      // 收起之前,给form设置具体的高度,使'transition: height 0.3s'生效
                      if (!isCallapseForm) {
                        const h = refFormWrap.current?.querySelector('.base-form')?.clientHeight;
                        setFormMaxHeight(h);
                      }
                      // 等待setFormHeight渲染完成,再执行收起,就有过渡效果了
                      setTimeout(() => {
                        setIsCallapseForm(!isCallapseForm);
                      }, 16);
                    }}
                  >
                    <UpOutlined className="callapse-icon" />
                    {isCallapseForm ? '展开' : '收起'}
                  </BaseButton>
                )}
                <BaseButton
                  className="base-btn-reset"
                  type="default"
                  htmlType="reset"
                  onClick={(e) => {
                    e.currentTarget.blur(); // 避免长按回车一直触发onClick
                    reset();
                  }}
                >
                  重置
                </BaseButton>
                <BaseButton
                  className="base-btn-search"
                  htmlType="submit"
                  loading={btnSearching}
                  onClick={(e) => {
                    e.currentTarget.blur(); // 避免长按回车一直触发onClick
                    setBtnSearching(true);
                    reload();
                  }}
                >
                  查询
                </BaseButton>
              </div>
            )}
          </BaseForm>
        </div>
      )}

      {/* 工具栏按钮 */}
      {isShowBtns && (
        <div
          className={`base-list-tools ${btnsSticky ? 'base-list-tools-sticky' : ''}`}
          style={{ top: stickyBtnsTop }}
          ref={refBtns}
          onClick={() => cancelLastTdBtnIndex()}
        >
          {/* 左边 */}
          <div className="base-tool-left">
            {/* 插槽 */}
            {props.children}

            {/* 配置的按钮 */}
            <ToolBtns
              btns={listConfig.btns?.filter((btn) => btn.align === 'left')}
              onClick={btnFormClick}
            />
          </div>

          {/* 右边 */}
          <div className="base-tool-right">
            {/* 配置的按钮 */}
            <ToolBtns
              btns={listConfig.btns?.filter((btn) => btn.align !== 'left')}
              onClick={btnFormClick}
            />

            {/* 固定按钮 */}
            {listConfig.isShowBtnTools != false && (
              <div className="base-tool-ics">
                <Tooltip title="刷新">
                  <ReloadOutlined
                    className="base-tool-ic"
                    onClick={() => {
                      refresh();
                    }}
                  />
                </Tooltip>

                <Dropdown
                  trigger={['click']}
                  placement="bottom"
                  arrow
                  menu={{
                    items: tableSizeItems,
                    selectable: true,
                    selectedKeys: [tableSize],
                    onSelect: (e) => {
                      setTableSize(e.key as BaseTableSize);
                    },
                  }}
                >
                  <Tooltip title="行高">
                    <ColumnHeightOutlined className="base-tool-ic" />
                  </Tooltip>
                </Dropdown>

                <DropdownSet
                  className="base-tool-ic"
                  defaultValue={defaultClumnIndexs}
                  value={clumnIndexs}
                  table={listConfig.table}
                  onChange={setClumnIndexs}
                />
              </div>
            )}
          </div>
        </div>
      )}

      {/* 表格 */}
      {hasTable ? (
        listConfig.onDrag ? (
          <BaseTableDrag
            config={{
              ...tableConfig,
              async onDrag(e) {
                await listConfig.onDrag?.(e);
                refresh();
              },
            }}
          />
        ) : (
          <BaseTable config={tableConfig} />
        )
      ) : undefined}
    </div>
  );
};

export default BaseList;
