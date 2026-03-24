/**
 * 组件属性
 */
export type BaseInputBgProps = {
  /**
   * 背景值
   */
  value?: string;

  /**
   * 背景值改变时触发
   */
  onChange?: (value?: string) => void;

  /**
   * 默认背景尺寸
   */
  defaultSize?: BaseBgSize;

  /**
   * 默认背景对齐方式
   */
  defaultAlign?: BaseBgAlign;

  /**
   * 默认背景重复方式
   */
  defaultRepeat?: BaseBgRepeat;

  /**
   * 样式
   */
  style?: React.CSSProperties;

  /**
   * 类名
   */
  className?: string;

  /**
   * 预设的颜色值列表
   */
  colors?: string[];
};

/**
 * 背景属性
 */
export type BaseBg = {
  /**
   * 背景颜色或第一个渐变色
   */
  color1?: string;

  /**
   * 第二个渐变色
   */
  color2?: string;

  /**
   * 渐变颜色的角度
   */
  deg?: string | null;

  /**
   * 背景图片
   */
  url?: string;

  /**
   * 背景图片尺寸,默认'cover'
   */
  size?: BaseBgSize;

  /**
   * 背景图片对齐方式, 默认'top'
   */
  align?: BaseBgAlign;

  /**
   * 背景图片重复方式, 默认'no-repeat'
   */
  repeat?: BaseBgRepeat;
};

/**
 * 背景图片尺寸
 */
export type BaseBgSize = 'contain' | 'cover';

/**
 * 背景图片对齐方式
 */
export type BaseBgAlign = 'top' | 'center' | 'bottom';

/**
 * 背景图片重复方式
 */
export type BaseBgRepeat = 'repeat' | 'no-repeat';
