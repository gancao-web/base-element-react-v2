import type { BaseMapMarker, BaseMapProps } from '../BaseMap/typing';

/**
 * 钩子
 */
export type BaseMapAddressProps = {
  /** 是否显示弹窗, 与onShow或onClose实现外部受控; 默认使用最简单的插槽方式内部自动受控 */
  isShow?: boolean;
  /** 插槽 (点击插槽字段显示弹窗, 内部自动受控) */
  children?: React.ReactNode;
  /** 弹窗显示前的回调, return false不显示弹窗; 通常用来校验city是否为空 */
  onBeforeShow?: () => void | boolean;
  /** 弹窗显示的回调 */
  onShow?: () => void;
  /** 弹窗关闭的回调 */
  onClose?: () => void;
  /** 选中搜索的地址 */
  onSuccess: (address: BaseMapMarker) => void;
  /** 地图的配置 */
  mapProps?: BaseMapProps;
};
