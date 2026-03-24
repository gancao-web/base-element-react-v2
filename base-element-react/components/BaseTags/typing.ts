import type { BaseItem, BaseItemField, BaseColor, BaseObj } from '../../typing';

/**
 * 钩子
 */
type BaseTagsField = {
  /** 当value为数组时,取label的字段, 默认'label' */
  labelKey?: string;
  /** 颜色 */
  color?: BaseColor;
  /** 可编辑(显示删除,添加按钮), 默认false */
  editable?: boolean;
  /** 编辑时输入框的提示文本 */
  placeholder?: string;
  /** 删除回调 */
  onDel?: (delTag: string | BaseObj, tags: Array<string | BaseObj>) => void;
  /** 添加之前的回调 */
  onAddBefore?: (addTag: string, tags: Array<string | BaseObj>) => string;
  /** 添加回调 */
  onAdd?: (addTag: string, tags: Array<string | BaseObj>) => void;
};

export type BaseTagsProps = BaseItemField & BaseTagsField;
/**
 * item配置
 */
export type BaseTagsItem = {
  /** 组件名称 */
  comp: 'tags';
} & BaseTagsField &
  BaseItem;
