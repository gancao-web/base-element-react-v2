import type { BaseDatePickerCompField } from '../BaseDatePicker/typing';
import type { BaseSelectCompField } from '../BaseSelect/typing';
import type { BaseInputCompField } from '../BaseInput/typing';
import type { BaseItem, BaseItemField, BasePropItems } from '../../typing';

/**
 * 钩子
 */
type BaseSelectInputField = {
  /** 枚举字段配置 */
  lib: BasePropItems;
  /** 输入项的配置 'input' | 'select' | 'picker-date';*/
  field?: BaseInputCompField | BaseSelectCompField | BaseDatePickerCompField;
  /** 左边选项变化的监听 */
  onLabelChange?: (value: BaseSelectInputValue, labelIndex: number) => void;
  /** 右边选项值变化的监听 */
  onValueChange?: (value: BaseSelectInputValue, labelIndex: number) => void;
};

export type BaseSelectInputValue = any[];

export type BaseSelectInputProps = BaseItemField & BaseSelectInputField;

/**
 * item配置 (多字段组件都统一用prop字段, 不用lib配置项)
 */
export type BaseSelectInputItem = {
  /** 组件名称 */
  comp: 'select-input';
} & Omit<BaseSelectInputField, 'lib'> &
  Omit<BaseItem, 'prop'> & { prop: BasePropItems };
