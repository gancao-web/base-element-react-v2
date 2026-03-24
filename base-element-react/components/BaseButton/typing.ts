import type { ButtonProps } from 'antd';

/**
 * 钩子
 */
export type BaseButtonProps = Omit<ButtonProps, 'onClick'> & {
  /** 点击的节流时间, 默认至少间隔300ms才会再次派发click, 避免重复点击 */
  throttle?: number;
  /** 点击事件当返回时promise,自动显示loading,避免重复提交 */
  onClick?: (event: React.MouseEvent<HTMLElement, MouseEvent>) => void | Promise<any>;
  /** 回车后是否自动失焦,避免点击按钮后,长按回车连续触发onClick; 默认true */
  isEnterBlur?: boolean;
  /** 激活后的颜色值, 常用于标记是否已点击; 默认不设置 */
  keepActiveColor?: string;
};
