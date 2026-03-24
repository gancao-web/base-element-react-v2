import type { BaseLib, BaseItem, BaseItemField } from '../../typing';

/**
 * 钩子
 */
type BaseSwitchField = {
  /** 枚举对象, 第一个item为选中的配置 */
  lib?: BaseLib;
  /** 是否在加载中 */
  loading?: boolean;
};

export type BaseSwitchProps = BaseItemField & BaseSwitchField;
/**
 * item配置
 */
export type BaseSwitchItem = {
  /** 组件名称 */
  comp: 'switch';
} & BaseSwitchField &
  BaseItem;
