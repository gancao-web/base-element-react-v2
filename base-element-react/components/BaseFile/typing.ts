import type { BaseUnit } from '../../typing';

/**
 * 钩子
 */
export type BaseFileProps = {
  /** 完整的url地址 */
  src?: any;
  /** 宽度 */
  width?: BaseUnit;
  /** 高度 */
  height?: BaseUnit;
  /** 内联样式 */
  style?: React.CSSProperties;
  /** 样式名称 */
  className?: string;
};

/** 文件类型 */
export type BASE_FILE_TYPE = 'img' | 'video' | 'voice' | 'excel' | 'word' | 'zip';
