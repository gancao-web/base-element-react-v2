// @ts-ignore
import type { BuiltInControlType, ExtendControlType } from 'braft-editor';
import type { BaseItem, BaseItemField } from '../../typing';

/**
 * 钩子
 */
type BaseEditorField = {
  /** 内容高度 */
  height?: number | string;
  /** 移除控件: https://www.yuque.com/braft-editor/be/gz44tn#bo49ph */
  excludeControls?: BuiltInControlType[];
  /** 自行添加控件: https://www.yuque.com/braft-editor/be/gz44tn#bo49ph */
  extendControls?: ExtendControlType[];
  /** 是否显示边框, 默认true */
  hasBorder?: boolean;
};
export type BaseEditorProps = BaseItemField & BaseEditorField;

/**
 * item配置
 */
export type BaseEditorItem = {
  /** 组件名称 */
  comp: 'editor';
} & BaseEditorField &
  BaseItem;

/**
 * ref对象
 */
export type BaseEditorRef = {
  /** 在光标处插入文本 */
  insertText: (text: string) => void;
};
