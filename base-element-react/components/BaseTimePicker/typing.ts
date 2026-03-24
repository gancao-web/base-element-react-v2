import type { BaseItem, BaseItemField } from '../../typing';
type EventValue<DateType> = DateType | null;

/**
 * 钩子
 */
type BaseTimePickerField = {
  /** 是否可清除 */
  clearable?: boolean;
  /** 时间组件的格式化类型 (默认 "HH:mm:ss") */
  format?: string;
} & (
  | {
      /** 时间范围 */
      type: 'timerange';
      /** 不可用日期 */
      disabledTime?: (now: EventValue<moment.Moment>, type: 'start' | 'end') => DisabledTimes;
      /** 提示 */
      placeholder?: [string, string];
    }
  | {
      /** 时间 */
      type?: 'time';
      /** 不可用日期 */
      disabledTime?: (now: moment.Moment) => DisabledTimes;
      /** 提示 */
      placeholder?: string;
    }
);
export type BaseTimePickerProps = BaseItemField & BaseTimePickerField;

/**
 * item配置
 */
export type BaseTimePickerItem = {
  /** 组件名称 */
  comp: 'picker-time';
  /** 开始字段 */
  start?: string;
  /** 结束字段 */
  end?: string;
} & BaseTimePickerField &
  BaseItem;

/** 不可用日期 */
type DisabledTimes = {
  disabledHours?: () => number[];
  disabledMinutes?: (selectedHour: number) => number[];
  disabledSeconds?: (selectedHour: number, selectedMinute: number) => number[];
};
