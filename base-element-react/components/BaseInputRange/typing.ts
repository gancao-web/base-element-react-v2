import type { BaseItem, BaseItemField } from '../../typing';

/**
 * 输入输出的值
 */
export type BaseInputRangeValue = (number | undefined)[];

/**
 * 钩子
 */
type BaseInputRangeField = {
  /** 内容 */
  value?: BaseInputRangeValue;
  /** 输入类型: 整数"num" | 两位小数"digit", 默认"digit" */
  type?: 'num' | 'digit';
  /** 输入限制-最大值 (默认Number.MAX_SAFE_INTEGER) */
  max?: number;
  /** 输入限制-最小值 (默认0) */
  min?: number;
  /** 回车事件 */
  onPressEnter?: (value: BaseInputRangeValue) => void;
};

export type BaseInputRangeProps = BaseItemField & BaseInputRangeField;

/**
 * item配置
 */
export type BaseInputRangeItem = {
  /** 组件名称 */
  comp?: 'input-range';
} & BaseInputRangeField &
  BaseItem;
