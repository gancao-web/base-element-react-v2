import type { BaseLib, BaseItem, BaseItemField } from '../../typing';

/**
 * 钩子
 */
type BaseSegmentedField = {
  /** 枚举对象 */
  lib?: BaseLib;
};

export type BaseSegmentedProps = BaseItemField & BaseSegmentedField;

/**
 * item配置
 */
export type BaseSegmentedItem = {
  /** 组件名称 */
  comp: 'segmented';
} & BaseSegmentedField &
  BaseItem;
