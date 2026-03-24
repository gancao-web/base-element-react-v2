import type { BaseLib, BaseItem, BaseColor, BaseItemField } from '../../typing';

/**
 * 钩子
 */
export type BaseTextField = {
  /** 枚举对象 */
  lib?: BaseLib;
  /** 默认值 */
  empty?: React.ReactNode;
  /** 颜色 */
  color?: BaseColor;
  /** 插槽 */
  children?: React.ReactNode;
  /** 点击事件 */
  onClick?: React.MouseEventHandler<HTMLDivElement>;
};

export type BaseTextProps = BaseItemField & BaseTextField;

/**
 * item配置
 */
export type BaseTextItem = {
  /** 组件名称 */
  comp: 'text';
} & BaseTextField &
  BaseItem;
