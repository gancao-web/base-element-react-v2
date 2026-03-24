import type { BaseLibItem } from '../../typing';

/**
 * 钩子
 */
export type BaseTextLibProps = {
  /** 静态枚举对象 */
  lib: BaseLibItem[];
  /** 值 */
  value?: any;
  /** 分隔符,默认顿号 */
  split?: any;
  /** 默认值 */
  empty?: React.ReactNode;
};
