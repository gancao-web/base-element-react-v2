import type { BaseObj } from '../../typing';
import type { BaseTableConfig } from '../BaseTable/typing';

/**
 * BaseTableDrag钩子
 */
export type BaseTableDragProps = {
  config: BaseTableDragConfig;
};

/**
 * BaseTableDrag拖动事件 (支持async await返回promise)
 */
export type BaseTableOnDrag = (e: {
  dragIndex: number;
  hoverIndex: number;
  dragRow: BaseObj;
  hoverRow: BaseObj;
  newList: any[];
  oldList: any[];
}) => Promise<any> | void;

/**
 * BaseTableDrag的配置类型
 */
export type BaseTableDragConfig = BaseTableConfig & {
  /** 拖拽排序事件 */
  onDrag: BaseTableOnDrag;
  /** 排序弹窗的标题 */
  sortDialogTitle?: (row?: BaseObj) => string;
};
