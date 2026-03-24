import { Radio } from 'antd';
import { useBaseLib } from '../../hooks/useBaseLib';
import BaseTextLib from '../BaseTextLib';
import type { RadioChangeEvent } from 'antd';
import type { BaseRadioProps } from './typing';

/**
 * 单选
 */
const BaseRadio = (props: BaseRadioProps) => {
  const { items } = useBaseLib(props);

  const onChange = (e: RadioChangeEvent) => {
    const value = e.target.value;
    const checkItem = items.find((item) => item.value === value);
    props.onChange?.(value, checkItem);
  };

  return props.readonly ? (
    <BaseTextLib lib={items} value={props.value} />
  ) : (
    <Radio.Group
      className={`base-radio ${props.className || ''}`}
      style={props.style}
      value={props.value}
      onChange={onChange}
      disabled={props.disabled}
      optionType={props.isButton ? 'button' : undefined}
      buttonStyle="solid"
    >
      {items?.map((item) => {
        return (
          <Radio key={item.value} value={item.value} disabled={item.disabled}>
            {props.renderItem ? props.renderItem(item, props.value) : item.label}
          </Radio>
        );
      })}
    </Radio.Group>
  );
};

export default BaseRadio;
