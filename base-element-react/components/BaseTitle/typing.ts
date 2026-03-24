import type { BaseItem } from '../../typing';

/**
 * 钩子
 */
export type BaseTitleProps = {
  /** 标题名称 */
  label: string;
  /** 标题名称 */
  sty?: React.CSSProperties;
  /** 是否有分割线, 默认true */
  vline?: boolean;
};

/**
 * item配置
 */
export type BaseTitleItem = {
  /** 组件名称 */
  comp: 'title';
} & Omit<BaseTitleProps, 'sty'> &
  Omit<BaseItem, 'prop' | 'label'>;
