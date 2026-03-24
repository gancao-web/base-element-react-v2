import type { BaseLib, BaseItem, BaseItemField, BaseLibItem, BaseObj } from '../../typing';

/**
 * 钩子
 */
type BaseCheckboxField = {
  /** 枚举对象 (接口枚举建议定义在组件外面,避免重绘多次调用接口;在BaseForm中支持通过libParam监听form字段) */
  lib: BaseLib;
  /** 接口枚举的参数 (接口枚举定义在组件外面避免重绘的时候,可通过此字段传入额外的参数;在BaseForm中支持监听form字段) */
  libParam?: BaseObj;
  /** 枚举加载成功的事件 */
  onLibInit?: (arr: BaseLibItem[]) => void;
  /** 是否显示全选按钮, 默认false */
  isShowAll?: boolean;
  /** 自定义子项, value为当前选中的值 */
  renderItem?: (item: BaseLibItem, value: any) => React.ReactNode;
};

export type BaseCheckboxProps = BaseItemField & BaseCheckboxField;

/**
 * item配置
 * value默认返回逗号隔开的字符串, 如需返回数组则定义默认值value:[]
 * value若设置默认值为number或boolean, 则返回数字number或boolean, 此时仅支持单个选项
 */
export type BaseCheckboxItem = {
  /** 组件名称 */
  comp: 'checkbox';
} & Omit<BaseCheckboxField, 'libParam'> &
  BaseItem;
