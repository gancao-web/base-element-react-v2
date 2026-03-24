import type { TooltipProps } from 'antd';
import type { BaseDialog } from '../BasePage/typing';
import type { BaseObj, BaseLibItems, BaseColor } from '../../typing';
import type { FilterValue, SortOrder, CompareFn } from 'antd/es/table/interface';

/**
 * BaseTable钩子
 */
export type BaseTableProps = {
  /** BaseTable配置 */
  config: BaseTableConfig;
};

/**
 * BaseTable的配置类型
 */
export type BaseTableConfig = {
  /** 表格列的配置 */
  table: BaseTableItem[];
  /** 表格数据 */
  list: BaseObj[];
  /** 子表格列的配置 */
  expandTable?: BaseTableItem[];
  /** 子表格数据源的key, 这个key能从row中取到子表格的二维数组 */
  expandListKey?: string;
  /** 当前选中的行 */
  selectedRowKeys?: React.Key[];
  /** 表格的行选择事件 */
  onRowSelectionChange?: (selectedRowKeys: React.Key[], selectedRows: BaseObj[]) => void;
  /** 禁止选中某行 */
  disableSelection?: (row: BaseObj) => boolean;
  /** 表格的key (默认"id") */
  rowKey?: string;
  /** 是否随机生成表格的key (默认false; 当设置为true时,自动生成uuid作为list的key; 也可以指定列表的字段拼接key) */
  rowKeyRandom?: boolean | string[];
  /** 单元格内容对齐方式 (默认居中对齐) */
  rowCellAlign?: 'top' | 'center';
  /** 添加表格行的类名 */
  rowClassName?: (row: BaseObj, index: number) => string;
  /** 是否显示分页 */
  showPagination?: boolean;
  /** 是否显示pageSize切换器 */
  showSizeChanger?: boolean;
  /** 只有一页时是否隐藏分页器 */
  hideOnSinglePage?: boolean;
  /** 是否为斑马纹表格, 默认true */
  stripe?: boolean;
  /** 表格大小, 默认'middle' */
  size?: BaseTableSize;
  /** 是否有边框 */
  bordered?: boolean;
  /** 是否加载中 */
  loading?: boolean;
  /** 页码 */
  pageNo?: number;
  /** 页长 */
  pageSize?: number;
  /** 总数 */
  total?: number;
  /** 滚动区域的高度 (固定表头) */
  scrollHeight?: number;
  /** 内容超出是否显示水平滚动条 (true显示滚动条, false则压缩空间不显示滚动条, 默认false) */
  scrollMaxContent?: boolean;
  /** 表头吸顶悬浮, 默认false */
  sticky?: boolean | { offsetHeader?: number };
  /** 分页、排序、筛选变化事件 */
  onChange?: (e: {
    pageNo: number;
    pageSize: number;
    filters: Record<string, FilterValue | null>;
    sorter: Record<string, SortOrder>;
  }) => void;
  /** 拖拽排序配置相关 (在BaseTableDrag中使用) */
  components?: any;
  onRow?: any;
  /** 样式 */
  style?: React.CSSProperties;
  /** 是否标记最近点击的操作按钮为背景灰色, 点击空白处恢复, 默认false */
  isActLastTdBtn?: boolean;
  /** 当前需要高亮的操作按钮 [rowIndex, btnIndex] */
  lastTdBtnIndex?: LastTdBtnIndex;
  /** 高亮的操作按钮 */
  onLastTdBtnIndexChange?: (lastTdBtnIndex?: LastTdBtnIndex) => void;
};

/**
 * BaseTable表单项的配置类型
 */
export type BaseTableItem = {
  /** 标签名 */
  label: React.ReactNode;
  /** 定位 */
  fixed?: boolean | 'left' | 'right';
  /** 类型 (当配置switch时,需配置prop,lib和api)*/
  type?: 'index' | 'checkbox' | 'radio' | 'img' | 'video' | 'tags' | 'switch';
  /** 自定义单元格渲染时机 */
  shouldCellUpdate?: (record: BaseObj, prevRecord: BaseObj) => boolean;
  /** 字段名 */
  prop?: string;
  /** 列分组 */
  children?: BaseTableItem[];
  /** 长文本缩略显示 (值为number时,可配置最多显示的字数) */
  ellipsis?: boolean | number;
  /** 枚举对象 */
  lib?: BaseLibItems;
  /** 视频封面字段名 */
  poster?: string;
  /** 颜色 */
  color?: BaseColor;
  /** 连续的数字或字母在空间不够时是否分隔换行,默认false */
  isBreakAll?: boolean;
  /** 元素强制不换行 */
  isNowrap?: boolean;
  /** 格式化: 'datetime'为'yyyy-MM-dd hh:mm:ss'格式, 'date'为'yyyy-MM-dd'格式 */
  format?: 'datetime' | 'date';
  /** 按钮组 */
  btns?: BaseTableBtn[];
  /** 空提示 */
  empty?: React.ReactNode;
  /** 是否可拷贝, 默认不可拷贝, 仅纯文本生效 */
  copyable?: boolean;
  /** 列宽, 支持数字,px单位,vw单位, 不支持百分比 */
  width?: number | string;
  /** 内容高度, 非行高, 目前可设定图片,视频 (默认50px) */
  height?: number;
  /** 对齐 */
  align?: 'left' | 'center' | 'right';
  /** 排序 */
  sorter?: /** 排序-单列 */
  | boolean
    /** 排序-单列-自定义排序算法 */
    | CompareFn<any>
    /** 排序-多列 (multiple为权重) */
    | {
        multiple?: number;
        compare?: CompareFn<any>;
      };
  /** 自定义 */
  render?: (row: BaseObj, rowIndex: number) => any;
  /** 点击switch所触发的接口请求 */
  api?: (param: BaseObj, row: BaseObj) => Promise<any>;
  /** 是否存在这个列, 包括右上角的设置列表也不存在 (相似配置: defaultShow) */
  vif?: boolean;
};

/**
 * BaseTable.btns的配置类型
 */
export type BaseTableBtn = {
  /** 按钮文本 (如: "编辑","删除") */
  label?: React.ReactNode | ((row: BaseObj) => React.ReactNode);
  /** 按钮图标 import {xx} from '@ant-design/icons' */
  icon?: BaseTableBtnIcon | ((row: BaseObj) => BaseTableBtnIcon);
  /** 按钮颜色 (按钮文本时,也可通过自定义label实现; 但按钮图标则不要自定义label了, 因为label会显示在tooltip) */
  color?: BaseColor | ((row: BaseObj) => BaseColor);
  /** 按钮背景 (按钮文本时,也可通过自定义label实现; 但按钮图标则不要自定义label了, 因为label会显示在tooltip)  */
  bg?: BaseColor | ((row: BaseObj) => BaseColor);
  /** 是否显示 */
  vif?: (row: BaseObj, index: number) => boolean;
  /** button的点击事件 | Popconfirm的onConfirm */
  click?: (row: BaseObj, index: number) => void;
  /** 先Popconfirm提示, 确定后触发click */
  tip?: React.ReactNode | ((row: BaseObj) => React.ReactNode);
  /** api调用成功的提示 */
  tipOk?: string;
  /** 页面配置 (仅在BasePage中生效, arg参数可解构出row, from, selectedRowKeys, selectedRows,refPage, isEdit:true) */
  dialog?: BaseDialog;
  /** 更多 */
  more?: BaseTableBtn[];
  /** 按钮图标的提示配置 */
  tooltip?: TooltipProps;
};

/**
 * 标记最后点击的按钮
 */
export type LastTdBtnIndex = {
  rowKey: number; // 哪条数据 (不使用rowIndex标记,因为列表数据会变化)
  rowIndex: number; // 第几行 (仅作为点击时的下标参数传递,不用来标记最后点击的按钮)
  colIndex: number; // 第几列
  btnIndex: number; // 第几个
};

/**
 * BaseTable.size的配置
 */
export type BaseTableSize = 'large' | 'middle' | 'small';

/**
 * BaseTable.btns.icon的配置
 */
export type BaseTableBtnIcon = 'edit' | 'detail' | 'del' | 'copy' | 'tags' | 'more' | JSX.Element; // 写React.ReactNode编码会没有提示
