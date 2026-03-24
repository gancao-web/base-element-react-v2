import BaseInput from '../BaseInput';
import type { BaseInputRangeProps, BaseInputRangeValue } from './typing';
import './index.less';

/**
 * 数字输入范围, 默认'digit'
 */
const BaseInputRange = (props: BaseInputRangeProps) => {
  const min = props.min || 0; // 输入限制-最小值
  const max = props.max || Number.MAX_SAFE_INTEGER; // 输入限制-最大值
  const minVal = props.value?.[0]; // 输入的最小值
  const maxVal = props.value?.[1]; // 输入的最大值
  const type = props.type || 'digit'; // 输入类型
  // 输入最小值
  function onChangeMin(e: any) {
    props.onChange && props.onChange([e, maxVal]);
  }
  // 输入最大值
  function onChangeMax(e: any) {
    props.onChange && props.onChange([minVal, e]);
  }
  // 禁用
  const disabled = props.disabled;
  // 回车
  const onPressEnter = (value: BaseInputRangeValue) => {
    props.onPressEnter && props.onPressEnter(value);
  };
  return (
    <div className={`base-input-range ${props.className || ''}`} style={props.style}>
      <BaseInput
        value={minVal}
        disabled={disabled}
        readonly={props.readonly}
        onChange={onChangeMin}
        min={min}
        type={type}
        placeholder="最小值"
        onPressEnter={(e) => onPressEnter([e, maxVal])}
        clearable={false}
      />
      <div className="separator">-</div>
      <BaseInput
        value={maxVal}
        disabled={disabled}
        readonly={props.readonly}
        onChange={onChangeMax}
        max={max}
        type={type}
        placeholder="最大值"
        onPressEnter={(e) => onPressEnter([minVal, e])}
        clearable={false}
      />
    </div>
  );
};

export default BaseInputRange;
