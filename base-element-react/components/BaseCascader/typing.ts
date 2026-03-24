import type { BaseLib, BaseItem, BaseItemField, BaseLibItems } from '../../typing';

/**
 * 钩子
 */
type BaseCascaderField = {
  /** 枚举对象 */
  lib: BaseLib;
  /** 枚举api的默认选项 (常用于BaseLibApi多选状态下的手动回显) */
  // libApiDefault?: BaseLibItem[];
  /** 枚举加载成功的事件 */
  onLibInit?: (arr: BaseLibItems) => void;
  /** 输入提示 */
  placeholder?: string;
  /** 'multiple'多选 | undefined默认不支持选择 */
  mode?: 'multiple';
  /** 在mode:'multiple'多选模式中, 一级是否单选 (子级多选) */
  firstLevelSingle?: boolean;
  /** 在mode:'multiple'多选模式中, 点击即可选择(允许选择父级) */
  changeOnSelect?: boolean;
  /** 是否支持搜索选择,默认false */
  showSearch?: boolean;
  /** 在mode:'multiple'多选模式中, 选中项的回填方式: 缩略显示父级'SHOW_PARENT' | 展开显示子级'SHOW_CHILD'*/
  showCheckedStrategy?: 'SHOW_PARENT' | 'SHOW_CHILD';
  /** 最多显示几个选中的项, 超过则显示缺省数量 */
  maxTagCount?: number | 'responsive';
  /** 是否可清除 */
  clearable?: boolean;
};

export type BaseCascaderProps = BaseItemField & BaseCascaderField;

/**
 * item配置
 */
export type BaseCascaderItem = {
  /** 组件名称 */
  comp: 'cascader';
} & BaseCascaderField &
  BaseItem;
