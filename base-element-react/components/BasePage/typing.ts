import type { BaseListConfig, BaseListContext, BaseListRef } from '../BaseList/typing';
import type { BaseObj } from '../../typing';

/**
 * BasePage的钩子
 */
export type BasePageProps = {
  style?: React.CSSProperties;
  className?: string;
  config: BasePageConfig;
  /** ref对象 */
  refPage?: BasePageRefObj;
  /** 插槽 */
  children?: React.ReactNode;
};

/**
 * BasePage的配置
 */
export type BasePageConfig = BaseListConfig;

/**
 * 弹窗
 * @param ctx 可解构出form, row, isEdit, selectedRowKeys, selectedRows, refPage, refDialog (开发者额外定义的参数, 使用泛型来约束)
 */
export type BaseDialog<T = BaseObj> = (
  ctx: BaseDialogContext & T,
) => BaseDialogConfig | Promise<BaseDialogConfig>;

/**
 * 弹窗配置
 */
export type BaseDialogConfig = BasePageConfig & {
  /** 弹窗的标题 */
  title?: string;
  /** 弹窗的宽度 */
  width?: number;
  /** 弹窗最小高 (表单使用vif,vshow时,加上最小高,可避免元素显示隐藏,导致弹窗忽高忽低) */
  minHeight?: number | string;
  /** 弹窗的左右内边距,表单弹窗默认72,表格弹窗默认4 */
  paddingX?: number;
  /** 弹窗打开之前的事件, 返回false则不打开 */
  beforeOpen?: () => boolean | Promise<boolean | void> | void;
  /** 弹窗打开事件 */
  onOpen?: () => void;
  /** 弹窗关闭事件 */
  onClose?: () => void;
  /** 表单弹窗异步回显接口 (点击操作列的按钮,显示弹窗时会触发.先用该行数据回显弹窗的表单,再通过apiDetail接口覆盖) */
  apiDetail?: (param: BaseObj) => Promise<any>;
  /** 点击弹窗'确定'按钮所调用的接口, 返回false则不发请求 */
  apiSubmit?: (form: BaseObj, selectedRowKeys: React.Key[]) => Promise<any> | false;
  /** 点击'确定'按钮,调接口成功之后的事件, 有值则覆盖'操作成功'的默认提示. (res:接口返回结果) => 是否关闭弹窗, 默认true关闭; 返回false则不关闭 */
  onSubmitOk?: (res: any) => boolean | Promise<boolean> | void;
  /** apiSubmit调用成功后刷新列表的方式: 默认'auto'编辑弹窗刷新列表,新增弹窗重置列表; 'reload'重置列表; 'refresh'刷新列表; 'none'不刷新 */
  submitReloadType?: 'auto' | 'reload' | 'refresh' | 'none';
  /** 是否以抽屉的方式展示 */
  drawer?: boolean;
  /** 弹窗是否可拖拽 */
  draggable?: boolean;
  /** 自定义弹窗内容 */
  render?: React.ReactNode;
  /** 底部按钮的布局 */
  footer?: React.ReactNode;
  /** 确定按钮 */
  okText?: React.ReactNode;
  /** 取消按钮 */
  cancelText?: React.ReactNode;
};

/**
 * BasePage的ref对象
 */
export type BasePageRefObj = React.MutableRefObject<BasePageRef | undefined>;

/**
 * BasePage的ref类型
 */
export type BasePageRef = BaseListRef & {
  /** 手动打开弹窗 */
  openDialog: (dialog: BaseDialog, title: string, row?: BaseObj) => void;
  /** 手动关闭弹窗 */
  closeDialog: () => void;
  /** 手动设置弹窗的提交事件,常用于自定义弹窗时,手动监听'确定'按钮的事件 */
  setDialogSubmit: (onSubmit: () => void) => void;
};

/**
 * 弹窗上下文
 */
export type BaseDialogContext = {
  /** 当前行数据 (从表格打开的弹窗会有当前行的数据, 从工具栏的则为{}空对象) */
  row: BaseObj;
  /** false:从工具栏打开的弹窗; true从表格打开的弹窗 (常用于区分是否为表格中的"编辑"还是工具栏的"新增") */
  isEdit: boolean;
  /** BasePage的ref对象, 常用于调用refresh刷新列表 */
  refPage: BasePageRef;
  /** 弹窗的ref对象, 常用于获取弹窗表单的数据 或 刷新列表弹窗 */
  refDialog: BasePageRefObj; // 弹窗挂载之后才能取到ref, 所以只能为BasePageRefObj类型, 如果BasePageRef类型只能取到undefined
} & BaseListContext;
