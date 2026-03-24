import type { BaseUnit } from '../../typing';
/**
 * 图片组件的钩子
 */
export type BaseImgProps = {
  /** 图片地址,支持数组或逗号隔开的多张图片 (相对或绝对路径) */
  src?: string | string[];
  /** 宽度 */
  width?: BaseUnit;
  /** 高度 */
  height?: BaseUnit;
  /** 是否开启预览, 默认true*/
  preview?: boolean;
  /** 内联样式 */
  style?: React.CSSProperties;
  /** 样式名称 */
  className?: string;
};
