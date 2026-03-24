import type { BaseItem, BaseItemField } from '../../typing';

/**
 * @name 日期类型 (默认:日期范围"daterange")
 * @example 日期范围"daterange" | 日期时间范围"datetimerange" | 月份范围"monthrange" | 年份范围"yearrange" | 日期时间"datetime" | 日期"date" | 月"month" | 年'year'
 */
export type BaseDatePickerType =
  | 'datetimerange'
  | 'daterange'
  | 'monthrange'
  | 'yearrange'
  | 'datetime'
  | 'date'
  | 'month'
  | 'year';

/**
 * 钩子
 */
type BaseDatePickerField = {
  /**
   * 日期类型 (默认:日期范围"daterange")
   * @example 日期范围"daterange" | 日期时间范围"datetimerange" | 月份范围"monthrange" | 年份范围"yearrange" | 日期时间"datetime" | 日期"date" | 月"month" | 年'year'
   */
  type?: BaseDatePickerType;
  /** 是否可清除 */
  clearable?: boolean;
  /** 不可用日期 */
  disabledDate?: (date: moment.Moment) => boolean;
  /**
   * 时间组件的格式化类型
   * @example 时间戳(秒)'second' | 毫秒'ms' | 0点到24点的日期范围'daterangefull' | 自定义格式,如"YYYY-MM-DD HH:mm:ss"
   */
  format?: 'second' | 'ms' | 'daterangefull' | (string & {});
  /** 时的步长 */
  hourStep?: number;
  /** 分的步长 */
  minuteStep?: number;
};
export type BaseDatePickerProps = BaseItemField & BaseDatePickerField;

/**
 * item配置
 */
export type BaseDatePickerCompField = {
  /** 组件名称 */
  comp: 'picker-date';
} & BaseDatePickerField;

export type BaseDatePickerItem = BaseDatePickerCompField &
  Omit<BaseItem, 'prop'> & { prop: [string, string] | string };
