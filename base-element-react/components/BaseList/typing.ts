import type { ButtonProps } from 'antd';
import type { SortOrder } from 'antd/es/table/interface';
import type { BaseDialog } from '../BasePage/typing';
import type { BaseFormConfig } from '../BaseForm/typing';
import type { BaseTableBtn, BaseTableItem } from '../BaseTable/typing';
import type { BaseTableDragConfig, BaseTableOnDrag } from '../BaseTableDrag/typing';
import type { partial, BaseNode, BaseObj } from '../../typing';

/**
 * BaseList钩子
 */
export type BaseListProps = {
  /** 配置 */
  config: BaseListConfig;
  /** ref对象 */
  refList?: BaseListRefObj;
  /** 插槽 */
  children?: React.ReactNode;
  /** 样式 */
  style?: React.CSSProperties;
};

/**
 * BaseList的配置类型
 */
export type BaseListConfig = {
  /** 表单样式 */
  styleForm?: React.CSSProperties;
  /** 搜索栏收起时显示的行数, 默认搜索表单项大于8个才显示 (设置0则不显示展开收起按钮) */
  callapse?: number;
  /** 按钮栏 */
  btns?: BaseListBtn[];
  /** 是否显示'重置'和'查询'按钮, 默认true */
  isShowBtnSearch?: boolean;
  /** 是否显示按钮栏的工具图标: 刷新,设置行高,设置列, 默认table有值就显示 */
  isShowBtnTools?: boolean;
  /** 搜索接口 (返回false,则不发请求)  */
  apiSearch?: (form: BaseObj, sorter: Record<string, SortOrder>) => Promise<any> | false;
  /** 页面onShow时是否自动刷新列表, 默认false */
  onShowRefresh?: boolean;
  /** 点击"重置"按钮的钩子 */
  onReset?: () => void;
  /** 表单项变化的监听 */
  onFormChange?: BaseListFormConfig['onChange'];
  /** 分页、排序、筛选变化事件 */
  onTableChange?: BaseListTableConfig['onChange'];
  /** 表头吸顶悬浮, 默认false */
  sticky?: boolean | { offsetHeader?: number; btnsSticky?: boolean; tableSticky?: boolean };
  /** 继承BaseForm和BaseList的属性. 当两者存在相同属性时应当区分或合并, 如'onChange' */
} & Omit<BaseListFormConfig, 'onChange'> &
  Omit<BaseListTableConfig, 'onChange' | 'sticky'>;

/**
 * BaseList.btns工具栏
 */
export type BaseListBtn = {
  /** 按钮文本 (string类型显示Button, 支持传入自定义的dom元素) */
  label: BaseNode;
  /** 弹窗配置 (arg参数可解构出 from, selectedRowKeys, selectedRows, refPage, row:{}, isEdit:false) */
  dialog?: BaseDialog;
  /** 按钮点击事件, 不会自动刷列表 */
  click?: (ctx: BaseListContext) => void;
  /** 按钮点击调用的接口,成功之后自动刷列表 (如: 导出接口) */
  api?: (ctx: BaseListContext) => Promise<any>;
  /** 动态渲染 */
  vif?: boolean;
  /** 对齐 (默认右对齐) */
  align?: 'left' | 'right';
} & Omit<ButtonProps, 'onClick'>;

/**
 * BaseList的ref对象
 */
export type BaseListRefObj = React.MutableRefObject<BaseListRef | undefined>;

/**
 * BaseList的ref类型
 */
export type BaseListRef = {
  /** 获取BaseForm参数 -- 不校验 */
  getParam: () => BaseObj;
  /** 获取BaseForm参数 -- 校验 */
  getParamValid: () => Promise<BaseObj>;
  /** 设置BaseForm参数 */
  setParam: (param: BaseObj) => void;
  /** 设置页码 */
  setPageNo: (pageNo: number) => void;
  /** 设置页长 */
  setPageSize: (pageSize: number) => void;
  /** 刷新 (保持表单参数,但是页码重置为第一页) */
  reload: (pageNo?: number) => void;
  /** 刷新 (保持表单参数和页码) */
  refresh: () => void;
  /** 刷新 (重置表单参数,重置页码为第一页) */
  reset: () => void;
  /** 上下文数据 */
  getContext: () => BaseListContext;
};

/**
 * BaseList的btn和api对外的参数
 */
export type BaseListContext = {
  /** 表单输入的数据 */
  form: BaseObj;
  /** 列表数据 */
  list: BaseObj[];
} & BaseListRefData;

/**
 * BaseList的ref临时缓存数据
 */
export type BaseListRefData = {
  /** 页码 */
  pageNo: number;
  /** 页长 */
  pageSize: number;
  /** 选中的key */
  selectedRowKeys: React.Key[];
  /** 选中的行 */
  selectedRows: BaseObj[];
  /** 排序字段 */
  sorter: BaseObj;
  /** 列表是否初始化 (初始化之后list不会为undefined, 至少会是空数组) */
  isListInit: boolean;
  /** 表单尺寸变化的监听 (需考虑侧边栏开展收起的情况,所以不使用window的resize) */
  formResizeObserver?: ResizeObserver;
  /** 按钮栏尺寸变化的监听 (用于动态更新吸顶位置) */
  btnsResizeObserver?: ResizeObserver;
};

/**
 * BaseForm的配置类型
 */
export type BaseListFormConfig = partial<BaseFormConfig, 'form'>;

/**
 * BaseList的BaseTable配置类型
 */
export type BaseListTableConfig = Omit<BaseTableDragConfig, 'table' | 'list' | 'onDrag'> & {
  /** 表格 */
  table?: BaseListTableItem[];
  /** 表格数据 */
  list?: BaseObj[];
  /** 拖拽排序事件 (配置了此项,则开启拖拽排序功能) */
  onDrag?: BaseTableOnDrag;
};

/**
 * BaseTable表单项的配置类型
 */
export type BaseListTableItem = Omit<BaseTableItem, 'btns'> & {
  /** 按钮组 */
  btns?: BaseListTableBtn[];
  /** 是否显示这个列,可在右上角的设置中控制显示隐藏, 默认true */
  defaultShow?: boolean;
};

/**
 * BaseTable.btns的配置类型
 */
export type BaseListTableBtn = Omit<BaseTableBtn, 'click' | 'more'> & {
  /** button的点击事件 | Popconfirm的onConfirm */
  click?: (row: BaseObj, index: number, ctx: BaseListContext) => void;
  /** 点击按钮调用的接口 (返回false则不请求) */
  api?: (row: BaseObj, index: number, ctx: BaseListContext) => Promise<any>;
  /** 更多 */
  more?: BaseListTableBtn[];
};
