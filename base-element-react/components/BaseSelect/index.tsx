import { useEffect, useRef } from 'react';
import { Checkbox, Select } from 'antd';
import { checkedKeysToValue, checkedValueToKeys } from '../../util';
import { useBaseLib } from '../../hooks/useBaseLib';
import BaseTextLib from '../BaseTextLib';
import type { BaseSelectProps } from './typing';
import type { BaseLibItem } from '../../typing';

const { Option } = Select;
const KEY_ALL = 'KEY_ALL';
const styleCheckAll: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
};

/**
 * 下拉选择
 */
const BaseSelect = (props: BaseSelectProps) => {
  // 提示
  const placeholder = props.placeholder || (props.onSearch ? '请搜索' : '请选择');

  // 选项
  const { items, loading, initLibApiItems } = useBaseLib(props);

  const ref = useRef<{ searchTimer?: NodeJS.Timeout }>({
    searchTimer: undefined, // 节流搜索定时器
  }).current;

  // value回显
  const checkedKeys = checkedValueToKeys(props.value, items);

  // 全选的key
  const isShowAll = props.isShowAll && props.mode === 'multiple';
  const checkableKeys = getCheckableKeys();
  const isCheckAll = checkedKeys.length === checkableKeys.length;

  // 默认选中的下标
  useEffect(() => {
    const { defaultIndex } = props;
    if (defaultIndex !== undefined && checkedKeys.length === 0 && items?.length) {
      const newItems = items[defaultIndex];
      onChange(newItems.value, newItems);
    }
  }, [items]);

  // 可被选中的key
  function getCheckableKeys() {
    return items.reduce<React.Key[]>((arr, cur) => {
      const disabled = props.disabledItem ? props.disabledItem(cur) : cur.disabled;
      if (!disabled) arr.push(cur.value);
      return arr;
    }, []);
  }

  // 可被选中的items
  function getCheckableItems() {
    return items.reduce<BaseLibItem[]>((arr, cur) => {
      const disabled = props.disabledItem ? props.disabledItem(cur) : cur.disabled;
      if (!disabled) arr.push(cur);
      return arr;
    }, []);
  }

  // change事件
  function onChange(newValues: any, newItems: any) {
    const originalValues = isShowAll ? newValues.filter((v: any) => v != KEY_ALL) : newValues;
    const value = checkedKeysToValue(originalValues, props.value); // 数组 --> value
    props.onChange && props.onChange(value, newItems);
  }

  // 根据输入项进行筛选
  const filterOption = (input: string, option: any) => {
    if (props.onSearch) return true; // 接口搜索不过滤选项,由接口过滤即可
    const word = input.toLowerCase();
    const hasLabel = word && option.label && option.label.toLowerCase().indexOf(word) >= 0; // 过滤label
    return hasLabel;
  };

  // 搜索事件
  const onSearch = props.onSearch
    ? (keyword: string) => {
        ref.searchTimer && clearTimeout(ref.searchTimer);
        ref.searchTimer = setTimeout(() => {
          initLibApiItems(keyword);
        }, 500);
      }
    : undefined;

  const showSearch = props.onSearch ? true : props.showSearch;

  return props.readonly ? (
    <BaseTextLib lib={items} value={checkedKeys} />
  ) : (
    <Select
      style={props.style}
      className={props.className}
      bordered={props.bordered}
      value={checkedKeys}
      showSearch={showSearch}
      optionFilterProp="children"
      placeholder={placeholder}
      filterOption={filterOption}
      onChange={onChange}
      onSearch={onSearch}
      onClear={() => onSearch?.('')}
      loading={loading}
      mode={props.mode}
      disabled={props.disabled}
      allowClear={props.clearable != false}
      maxTagCount={props.maxTagCount}
      suffixIcon={props.suffixIcon}
      onDropdownVisibleChange={(isShow) => {
        // 每次显示都刷新列表
        isShow && props.isShowReloadLib && initLibApiItems(props.value);
      }}
    >
      {isShowAll && (
        <Option key={KEY_ALL} value={KEY_ALL}>
          <div
            style={styleCheckAll}
            onClick={(e) => {
              e.stopPropagation();
              const checkedKeys = isCheckAll ? [] : checkableKeys;
              const items = isCheckAll ? [] : getCheckableItems();
              onChange(checkedKeys, items);
            }}
          >
            <span>全选</span>
            <Checkbox checked={isCheckAll} indeterminate={checkedKeys.length > 0 && !isCheckAll} />
          </div>
        </Option>
      )}

      {/* {...item}展开item的目的,确保onChange的第二个参数能够获取到item所有字段 */}
      {items?.map((item) => {
        return (
          <Option
            {...item}
            key={item.value}
            disabled={props.disabledItem ? props.disabledItem(item) : item.disabled}
          >
            {props.renderItem ? props.renderItem(item, props.value) : item.label}
          </Option>
        );
      })}
    </Select>
  );
};

export default BaseSelect;
