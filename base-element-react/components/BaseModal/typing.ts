import type { ModalProps } from 'antd';

/**
 * BaseModal的钩子
 */
export type BaseModalProps = {
  /** 弹窗是否可拖拽, 默认true */
  draggable?: boolean;

  /** 弹窗打开时的回调,可获取到弹窗的dom元素 */
  afterOpen?: () => void;
} & Omit<ModalProps, 'visible'>;
