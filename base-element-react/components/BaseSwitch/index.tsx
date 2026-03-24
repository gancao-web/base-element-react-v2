import { Switch } from 'antd';
import { useBaseLib } from '../../hooks/useBaseLib';
import BaseTextLib from '../BaseTextLib';
import type { BaseSwitchProps } from './typing';

const libDefault = [
  { label: '', value: 1 },
  { label: '', value: 0 },
];

/**
 * 开关
 */
const BaseSwitch = (props: BaseSwitchProps) => {
  const lib = props.lib || libDefault;
  const { items } = useBaseLib({ lib });

  // 第一个为选中的item
  const checkItem = items[0];
  const unCheckItem = items[1];
  return props.readonly ? (
    <BaseTextLib lib={items} value={props.value} />
  ) : (
    <Switch
      style={props.style}
      className={props.className}
      disabled={props.disabled}
      loading={props.loading}
      checkedChildren={checkItem.label}
      unCheckedChildren={unCheckItem.label}
      checked={checkItem.value == props.value}
      onChange={(isCheck) => {
        const value = isCheck ? checkItem.value : unCheckItem.value;
        props.onChange && props.onChange(value);
      }}
    />
  );
};

export default BaseSwitch;
