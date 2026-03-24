import moment from 'moment';
import { DatePicker } from 'antd';
import { formatSafeMoment, getTime } from '../../util';
import type { BaseDatePickerProps } from './typing';
const { RangePicker } = DatePicker;

/**
 * 日期选择器
 */
const BaseDatePicker = (props: BaseDatePickerProps) => {
  let value = props.value;
  let picker = null;
  const clearable = props.clearable != false;
  // 只读
  if (props.readonly) {
    if (Array.isArray(value)) {
      const arr = valueFormatRange(value as [string, string], props.format);
      return <>{arr.join(' ~ ')}</>;
    } else {
      return <>{valueFormat(value, props.format)}</>;
    }
  }
  // value需转为moment类型
  if (value) {
    if (Array.isArray(value)) {
      // ["2022-05", "2022-09"] -> [Moment, Moment]
      let start = value[0];
      let end = value[1];
      if (start) start = moment(formatSafeMoment(start));
      if (end) end = moment(formatSafeMoment(end));
      value = [start, end];
    } else {
      // "2022-05" -> Moment
      value = moment(formatSafeMoment(value));
    }
  }

  // value格式化
  function valueFormat(t: string, fmt?: string) {
    if (!t || !fmt) return t;
    if (fmt === 'second') {
      return Math.floor(getTime(t) / 1000); // 秒数
    } else if (fmt === 'ms') {
      return getTime(t); // 毫秒数
    } else {
      return moment(t).format(fmt);
    }
  }

  function valueFormatRange(values: [string, string], fmt?: string) {
    if (values[0] && values[1]) {
      if (fmt === 'daterangefull') {
        const fmt = 'YYYY-MM-DD';
        return [
          `${valueFormat(values[0], fmt)} 00:00:00`,
          `${valueFormat(values[1], fmt)} 23:59:59`,
        ];
      } else {
        return [valueFormat(values[0], fmt), valueFormat(values[1], fmt)];
      }
    } else {
      return [];
    }
  }

  // 切换事件抛出value (非moment类型)
  function onChange(date: any, value: string) {
    props.onChange?.(valueFormat(value, props.format));
  }

  function onChangeRange(dates: any, values: [string, string]) {
    props.onChange?.(valueFormatRange(values, props.format));
  }

  switch (props.type) {
    case 'date':
      picker = (
        <DatePicker
          style={props.style}
          className={props.className}
          value={value}
          onChange={onChange}
          disabled={props.disabled}
          disabledDate={props.disabledDate}
          allowClear={clearable}
          showNow={false}
          picker="date"
        />
      );
      break;
    case 'datetime':
      picker = (
        <DatePicker
          style={props.style}
          className={props.className}
          value={value}
          onChange={onChange}
          disabled={props.disabled}
          disabledDate={props.disabledDate}
          allowClear={clearable}
          hourStep={props.hourStep}
          minuteStep={props.minuteStep}
          showNow={false}
          showTime={{
            format: 'HH:mm',
            defaultValue: moment('00:00:00', 'HH:mm:ss'),
          }}
        />
      );
      break;
    case 'datetimerange':
      picker = (
        <RangePicker
          style={props.style}
          className={props.className}
          value={value}
          onChange={onChangeRange}
          disabled={props.disabled}
          disabledDate={props.disabledDate}
          allowClear={clearable}
          hourStep={props.hourStep}
          minuteStep={props.minuteStep}
          showNow={false}
          showTime={{
            format: 'HH:mm',
            defaultValue: [moment('00:00:00', 'HH:mm:ss'), moment('00:00:00', 'HH:mm:ss')],
          }}
        />
      );
      break;
    case 'month':
      picker = (
        <DatePicker
          style={props.style}
          className={props.className}
          value={value}
          onChange={onChange}
          disabled={props.disabled}
          disabledDate={props.disabledDate}
          allowClear={clearable}
          picker="month"
        />
      );
      break;
    case 'monthrange':
      picker = (
        <RangePicker
          style={props.style}
          className={props.className}
          value={value}
          onChange={onChangeRange}
          disabled={props.disabled}
          disabledDate={props.disabledDate}
          allowClear={clearable}
          picker="month"
        />
      );
      break;
    case 'year':
      picker = (
        <DatePicker
          style={props.style}
          className={props.className}
          value={value}
          onChange={onChange}
          disabled={props.disabled}
          disabledDate={props.disabledDate}
          allowClear={clearable}
          picker="year"
        />
      );
      break;
    case 'yearrange':
      picker = (
        <RangePicker
          style={props.style}
          className={props.className}
          value={value}
          onChange={onChangeRange}
          disabled={props.disabled}
          disabledDate={props.disabledDate}
          allowClear={clearable}
          picker="year"
        />
      );
      break;
    default:
      picker = (
        <RangePicker
          style={props.style}
          className={props.className}
          value={value}
          onChange={onChangeRange}
          disabled={props.disabled}
          disabledDate={props.disabledDate}
          allowClear={clearable}
          showNow={false}
        />
      );
      break;
  }
  return picker;
};

export default BaseDatePicker;
