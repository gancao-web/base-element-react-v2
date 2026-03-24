import type { BaseLabelWidth, BaseLabelAlign } from '../../typing';

/**
 * 表单项组件的钩子
 */
export type BaseFormItemProps = {
  /** item的宽度 */
  width?: number;
  /** 标签名 */
  label?: React.ReactNode;
  /** 表单域标签的宽度 (默认120) */
  labelWidth?: BaseLabelWidth;
  /** 表单域标签的对齐方式 (默认居中) */
  align?: BaseLabelAlign;
  /** 必填(仅仅显示样式,无实际校验效果) */
  required?: boolean;
  /** 行内 */
  inline?: boolean;
  /** 插槽 */
  children?: React.ReactNode;
  /** item的表单项style */
  style?: React.CSSProperties;
};
