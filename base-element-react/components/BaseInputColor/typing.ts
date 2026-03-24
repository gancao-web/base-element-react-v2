export type BaseInputColorProps = {
  /**
   * 颜色值
   */
  value?: string;

  /**
   * 颜色值改变事件
   */
  onChange?: (value?: string) => void;

  /**
   * 是否显示颜色值的输入框
   */
  isShowInput?: boolean;

  /**
   * 颜色值的输入框提示
   */
  placeholder?: string;

  /**
   * 预设的颜色值列表
   */
  colors?: string[];

  /**
   * 样式
   */
  style?: React.CSSProperties;

  /**
   * 类名
   */
  className?: string;
};
