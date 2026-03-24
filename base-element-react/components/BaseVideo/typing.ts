import type { BaseUnit } from '../../typing';
/**
 * 钩子
 */
export type BaseVideoProps = {
  /** 视频地址,支持数组或逗号隔开的地址 (相对或绝对路径) */
  src: string | string[];
  /** 视频封面,支持数组或逗号隔开的地址 (相对或绝对路径) */
  poster?: string | string[];
  /** 宽度 */
  width?: BaseUnit;
  /** 高度 */
  height?: BaseUnit;
};
