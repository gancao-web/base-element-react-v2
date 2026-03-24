export type BaseCopyProps = {
  /** 拷贝的内容 */
  text?: string | number;

  /** 拷贝内容的空提示 */
  empty?: React.ReactNode;

  /** 是否禁止拷贝 */
  disabled?: boolean;
};
