import type { BaseLib, BaseItem, BaseItemField, BaseLibItem, BaseObj } from '../../typing';

/**
 * 钩子
 */
type BaseSelectField = {
  /** 枚举对象 (接口枚举建议定义在组件外面,避免重绘多次调用接口;在BaseForm中支持通过libParam监听form字段) */
  lib: BaseLib;
  /** 接口枚举的参数 (接口枚举定义在组件外面避免重绘的时候,可通过此字段传入额外的参数;在BaseForm中支持监听form字段) */
  libParam?: BaseObj;
  /** 枚举api的默认选项 (常用于BaseLibApi多选状态下的手动回显) */
  libApiDefault?: BaseLibItem[];
  /** 输入提示 */
  placeholder?: string;
  /** 'multiple'多选 | 'tags'多选或输入标签 | undefined默认单选 */
  mode?: 'multiple' | 'tags';
  /** 是否显示全选按钮, 默认false */
  isShowAll?: boolean;
  /** 无边框样式 */
  bordered?: boolean;
  /** 是否可清除 */
  clearable?: boolean;
  /** 枚举加载成功的事件 */
  onLibInit?: (items: BaseLibItem[]) => void;
  /** 是否支持搜索选择,默认false */
  showSearch?: boolean;
  /** 是否开启节流搜索 (边输入边搜索,不输入值不搜索;配置了onSearch,则showSearch不用配) */
  onSearch?: boolean;
  /** 最多显示几个选中的项, 超过则显示缺省数量 */
  maxTagCount?: number;
  /** 自定义子项 */
  renderItem?: (item: BaseLibItem, value: any) => React.ReactNode;
  /** 是否展示下拉选项时刷新枚举, 默认false */
  isShowReloadLib?: boolean;
  /** 动态禁用某一项 */
  disabledItem?: (item: BaseLibItem) => boolean;
  /** 自定义的选择框后缀图标 */
  suffixIcon?: React.ReactNode;
  /** 默认选中的下标 (当defaultValue有值时,则defaultIndex无效) */
  defaultIndex?: number;
};

export type BaseSelectProps = BaseItemField & BaseSelectField;

/**
 * item配置
 */
export type BaseSelectCompField = {
  /** 组件名称 */
  comp: 'select';
} & Omit<BaseSelectField, 'libParam'>;

export type BaseSelectItem = BaseSelectCompField & BaseItem;
