import type { BaseItemField } from '../../typing';

/**
 * 钩子
 */
export type BaseRichTextField = {
  /** 只显示文本 */
  onlyText?: Boolean;
  /** 插槽 */
  children?: React.ReactNode;
};

export type BaseRichTextProps = BaseItemField & BaseRichTextField;
