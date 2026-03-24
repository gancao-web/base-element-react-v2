/**
 * 拖拽排序组件
 */
export type BaseSortableProps = {
  /** 插槽 */
  children: JSX.Element;

  /** 是否行内元素, 默认false (控制元素行内显示和左右拖动的指示线的位置) */
  inline?: boolean;

  /** 是否禁用 (整个组件不可拖动) */
  disabled?: boolean;
};

/**
 * 组件内可拖拽的元素
 */
export type BaseSortableItemProps = {
  /** 元素下标 */
  index: number;

  /** 插槽 */
  children: JSX.Element;

  /** 排序事件 (顺序改变才触发) */
  onSort: (oldIndex: number, newIndex: number) => void;

  /** 是否禁用 (当前元素不可拖动) */
  disabled?: boolean;

  /** 样式 */
  style?: React.CSSProperties;
};

/**
 * 拖动元素传递给放置元素的参数
 */
export type UseDragItem = {
  /** 元素下标 */
  index: number;
};

/**
 * 拖动元素的状态收集
 */
export type UseDragCollect = {
  /** 拖动样式 */
  dragClassName: string;
};

/**
 * 放置元素的状态收集
 */
export type UseDropCollect = {
  /** 放置样式 */
  dropClassName: string;
};
