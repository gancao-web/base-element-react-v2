import type { BaseItem, BaseItemField, BaseInputType } from '../../typing';

/**
 * 钩子
 */
type BaseInputField = {
  /** 默认内容 */
  defaultValue?: any;
  /**
   * 输入类型
   * @example 整数"num" | 两位小数"digit" | 手机号"phone" | 座机"tel" | 身份证"idcard" | 银行卡"bank_card" | 中文(允许空格)"zh" | 英文(允许空格)"en" | 英文+数字(允许空格)"en_num" | 中英文数字(允许空格)"zh_en_num" | 链接"http" | 税号"tax"
   */
  type?: BaseInputType;
  /** 当type="num|digit"时的最大值, 默认Number.MAX_SAFE_INTEGER ( 其他type类型若需限制最大输入字符,则配置 rules:[{max: 50}] )  */
  max?: number;
  /** 当type="num|digit"时的最小值, 默认0 ( 其他type类型若需限制最少输入字符,则配置 rules:[{min: 2}] ) */
  min?: number;
  /** 输入长度: 普通输入框默认50, 若不限制则设置-1 */
  maxLength?: number;
  /** 小数位数,默认2 */
  digit?: number;
  /** name属性,使autoComplete生效 */
  name?: string;
  /** 记录最近输入的值 (input必须设置name,必须在form表单中,且必须点击了type="submit"按钮后才会记录) */
  autoComplete?: string;
  /** 输入提示 */
  placeholder?: string;
  /** 是否可清除 (默认true) */
  clearable?: boolean;
  /** 是否有边框 (默认true) */
  bordered?: boolean;
  /** 多行文本的最小高度, 默认4 */
  minRows?: number;
  /** 自定义输入的正则表达式 */
  pattern?: (value: string) => string;
  /** 失去焦点的事件 */
  onBlur?: (value: any) => void;
  /** 回车事件 (在BaseList中,回车默认会执行搜索,若配置了onPressEnter则覆盖默认的回车搜索行为) */
  onPressEnter?: (value: any) => void;
  /** 回车后是否自动失焦,避免长按回车连续触发回车事件; 默认false */
  isEnterBlur?: boolean;
  /** 后缀 */
  addonAfter?: React.ReactNode;
  /** 前缀 */
  addonBefore?: React.ReactNode;
};

export type BaseInputProps = BaseItemField & BaseInputField;

/**
 * item配置
 */
export type BaseInputCompField = {
  /** 组件名称 */
  comp?: 'input';
} & BaseInputField;

export type BaseInputItem = BaseInputCompField & BaseItem;
