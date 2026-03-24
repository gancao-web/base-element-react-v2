import type { TabsProps } from 'antd';
import type { BaseItem, BaseItemField, BaseLib } from '../../typing';

/**
 * 钩子
 */
type BaseTabsField = TabsProps & {
  /** 枚举对象 (若配置了antd原始的items属性, 则优先以items为准) */
  lib: BaseLib;

  /** 是否开启拖拽排序, 默认false */
  draggable?: boolean;

  /** 排序事件 (顺序改变才触发, 设置draggable为true才生效) */
  onSort?: (oldIndex: number, newIndex: number) => void;
};

export type BaseTabsProps = Omit<BaseItemField, 'onChange'> & BaseTabsField;
/**
 * item配置
 */
export type BaseTabsItem = {
  /** 组件名称 */
  comp: 'tabs';
} & Omit<BaseTabsField, 'onChange'> &
  BaseItem;
