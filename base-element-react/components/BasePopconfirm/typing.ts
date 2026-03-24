/**
 * 气泡确认框组件
 */
export type BasePopconfirmProps = {
  /** 气泡文本 */
  title: React.ReactNode;
  /** 按钮文本 */
  btn: React.ReactNode;
  /** 确认回调 */
  onConfirm: () => void;
};
