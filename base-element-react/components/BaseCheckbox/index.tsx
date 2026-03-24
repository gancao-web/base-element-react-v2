import { Checkbox } from 'antd';
import { checkedKeysToValue, checkedValueToKeys } from '../../util';
import { useBaseLib } from '../../hooks/useBaseLib';
import BaseTextLib from '../BaseTextLib';
import type { CheckboxValueType } from 'antd/es/checkbox/Group';
import type { BaseCheckboxProps } from './typing';
import type { CheckboxChangeEvent } from 'antd/es/checkbox';

/**
 * 多选
 */
const BaseCheckbox = (props: BaseCheckboxProps) => {
  // 选项
  const { items } = useBaseLib(props);

  // 全选
  const disabled = props.disabled; // 是否禁用
  const onCheckAllChange = (e: CheckboxChangeEvent) => {
    const arr = [];
    if (e.target.checked) {
      for (const item of items) {
        arr.push(item.value);
      }
    }
    onChange(arr);
  };

  // value回显
  const checkedKeys = checkedValueToKeys(props.value, items);
  const isCheckAll = items.length === checkedKeys.length;

  // change事件
  const onChange = (newValues: CheckboxValueType[]) => {
    if (items.length === 1 && newValues.length === 0) {
      // 单选 && 未选中
      const checkValue = items[0].value;
      if (typeof checkValue === 'boolean') {
        props.onChange?.(!checkValue, []); // true | false
      } else if (typeof checkValue === 'number') {
        props.onChange?.(checkValue === 0 ? 1 : 0, []); // 0 | 1
      } else {
        props.onChange?.('', []); // ''
      }
    } else {
      // 正常多选的情况
      const value = checkedKeysToValue(newValues, props.value);
      const selectItems = items.filter((item) => newValues.includes(item.value));
      props.onChange?.(value, selectItems);
    }
  };

  return props.readonly ? (
    <BaseTextLib lib={items} value={checkedKeys} />
  ) : (
    <>
      {props.isShowAll ? (
        <Checkbox
          indeterminate={!isCheckAll && checkedKeys.length > 0}
          checked={isCheckAll}
          onChange={onCheckAllChange}
        >
          全选
        </Checkbox>
      ) : null}

      <Checkbox.Group
        style={props.style}
        className={props.className}
        value={checkedKeys}
        onChange={onChange}
        disabled={disabled}
      >
        {items.map((item) => {
          return (
            <Checkbox value={item.value} key={item.value} disabled={item.disabled}>
              {props.renderItem ? props.renderItem(item, props.value) : item.label}
            </Checkbox>
          );
        })}
      </Checkbox.Group>
    </>
  );
};

export default BaseCheckbox;
