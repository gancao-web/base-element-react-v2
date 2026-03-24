import type { BaseObj, BaseLabelWidth, BaseValueWidth } from '../../typing';
import type { BaseCascaderItem } from '../BaseCascader/typing';
import type { BaseCheckboxItem } from '../BaseCheckbox/typing';
import type { BaseEditorItem } from '../BaseEditor/typing';
import type { BaseInputItem } from '../BaseInput/typing';
import type { BaseInputRangeItem } from '../BaseInputRange/typing';
import type { BaseDatePickerItem } from '../BaseDatePicker/typing';
import type { BaseTimePickerItem } from '../BaseTimePicker/typing';
import type { BaseSegmentedItem } from '../BaseSegmented/typing';
import type { BaseSelectItem } from '../BaseSelect/typing';
import type { BaseSelectInputItem } from '../BaseSelectInput/typing';
import type { BaseTextItem } from '../BaseText/typing';
import type { BaseRadioItem } from '../BaseRadio/typing';
import type { BaseTagsItem } from '../BaseTags/typing';
import type { BaseTabsItem } from '../BaseTabs/typing';
import type { BaseTitleItem } from '../BaseTitle/typing';
import type { BaseUploadItem } from '../BaseUpload/typing';
import type { BaseSwitchItem } from '../BaseSwitch/typing';

/**
 * BaseForm表单项的配置类型
 */
export type BaseFormItem =
  | BaseCascaderItem
  | BaseCheckboxItem
  | BaseEditorItem
  | BaseInputItem
  | BaseInputRangeItem
  | BaseDatePickerItem
  | BaseTimePickerItem
  | BaseRadioItem
  | BaseTagsItem
  | BaseTabsItem
  | BaseSegmentedItem
  | BaseSelectItem
  | BaseSelectInputItem
  | BaseTextItem
  | BaseTitleItem
  | BaseUploadItem
  | BaseSwitchItem;

/**
 * BaseForm的配置类型
 */
export type BaseFormConfig = {
  /** 记录最近输入的值 (input必须设置name,必须在form表单中,且必须点击了type="submit"按钮后才会记录) */
  autoComplete?: string;
  /** 表单项 */
  form: BaseFormItem[];
  /** 表单默认值 */
  defaultValue?: BaseObj;
  /** 是否显示冒号 */
  colon?: boolean;
  /** 行内表单模式, 默认false, 单独占一行 */
  inline?: boolean;
  /** 表单域标签的位置 */
  labelPosition?: 'right' | 'left' | 'top';
  /** 表单域标签的宽度 (单独BaseForm默认120; 在BaseList,BasePage中默认'auto', 大于4个item则默认100) */
  labelWidth?: BaseLabelWidth;
  /** 表单域的宽度 (240默认 | 330 | 420) */
  valueWidth?: BaseValueWidth;
  /** 每行item个数 */
  itemCol?: 2 | 3 | 4 | 5;
  /** 每个item的右边距, 默认40px */
  itemRight?: number;
  /** 每个item的下边距, 默认24px */
  itemBottom?: number;
  /** 批量只读,优先级高于disabled,以文本的样式渲染 */
  readonly?: boolean;
  /** 批量禁用表单 */
  disabled?: boolean;
  /** 是否过滤空字符串,null,undefined. 默认false */
  isFilterEmpty?: boolean;
  /**
   * @name 表单值变化的监听
   * @param form 表单所有的字段值
   * @param formItem 当前触发变化的组件
   * @param selectItems 单选,复选框,下拉选择,级联所选中的项 (单选是对象, 多选是数组)
   */
  onChange?: (form: BaseObj, formItem: BaseFormItem, selectItems?: any) => void;
  onFinish?: (values: any) => void;
};

/**
 * BaseForm钩子
 */
export type BaseFormProps = {
  /** BaseForm的配置 */
  config: BaseFormConfig;
  /** BaseForm的ref对象 */
  refForm?: BaseFormRefObj;
  /** 样式 */
  style?: React.CSSProperties;
  /** 样式 */
  className?: string;
  /** 插槽 */
  children?: React.ReactNode;
};

/**
 * BaseForm的ref对象
 */
export type BaseFormRefObj = React.MutableRefObject<BaseFormRef | undefined>;

/**
 * BaseForm的ref类型
 */
export type BaseFormRef = {
  /** 获取参数 -- 不校验 (返回表单全部字段,包括手动设置的额外字段) */
  getParam: () => BaseObj;
  /** 获取参数 -- 校验 (仅返回表单当前存在的字段,无手动设置的额外字段)*/
  getParamValid: () => Promise<BaseObj>;
  /** 设置参数 */
  setParam: (param: BaseObj) => void;
  /** 重置参数 */
  reset: () => void;
};
