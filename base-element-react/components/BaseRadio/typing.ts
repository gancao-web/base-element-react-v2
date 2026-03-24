import type { BaseLib, BaseItem, BaseLibItem, BaseItemField, BaseObj } from '../../typing';

/**
 * 钩子
 */
type BaseRadioField = {
  /** 枚举对象 (接口枚举建议定义在组件外面,避免重绘多次调用接口;在BaseForm中支持通过libParam监听form字段) */
  lib: BaseLib;
  /** 接口枚举的参数 (接口枚举定义在组件外面避免重绘的时候,可通过此字段传入额外的参数;在BaseForm中支持监听form字段) */
  libParam?: BaseObj;
  /** 枚举加载成功的事件 */
  onLibInit?: (arr: BaseLibItem[]) => void;
  /** 按钮类型 */
  isButton?: boolean;
  /** 自定义子项 */
  renderItem?: (item: BaseLibItem, value: any) => React.ReactNode;
};

export type BaseRadioProps = BaseItemField & BaseRadioField;
/**
 * item配置
 */
export type BaseRadioItem = {
  /** 组件名称 */
  comp: 'radio';
} & Omit<BaseRadioField, 'libParam'> &
  BaseItem;
