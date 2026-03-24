import moment from 'moment';
import { TimePicker } from 'antd';
import type { BaseTimePickerProps } from './typing';
const { RangePicker } = TimePicker;
/**
 * 时间选择器
 */
const BaseTimePicker = (props: BaseTimePickerProps) => {
  let picker = null;
  let value = props.value;
  const clearable = props.clearable != false;
  const format = props.format || 'HH:mm';
  // 只读
  if (props.readonly) {
    return Array.isArray(value) ? value.join(' ~ ') : value;
  }
  // value需转为moment类型
  if (value) {
    if (Array.isArray(value)) {
      // ["11:05", "12:05"] -> [Moment, Moment]
      let start = value[0];
      let end = value[1];
      if (start) start = moment(start, format);
      if (end) end = moment(end, format);
      value = [start, end];
    } else {
      // "11:05" -> Moment
      value = moment(value, format);
    }
  }

  // 切换事件抛出value (非moment类型)
  function onChange(date: any, val: any) {
    props.onChange && props.onChange(val);
  }
  switch (props.type) {
    case 'timerange':
      picker = (
        <RangePicker
          style={props.style}
          className={props.className}
          value={value}
          onChange={onChange}
          disabled={props.disabled}
          disabledTime={props.disabledTime}
          allowClear={clearable}
          format={format}
          placeholder={props.placeholder || ['开始时间', '结束时间']}
        />
      );
      break;
    default:
      picker = (
        <TimePicker
          style={props.style}
          className={props.className}
          value={value}
          onChange={onChange}
          disabled={props.disabled}
          disabledTime={props.disabledTime}
          allowClear={clearable}
          format={format}
          placeholder={props.placeholder || '请选择'}
        />
      );
      break;
  }
  return picker;
};

export default BaseTimePicker;
