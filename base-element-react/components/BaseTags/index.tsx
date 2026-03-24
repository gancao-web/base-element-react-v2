import { useState } from 'react';
import { PlusOutlined } from '@ant-design/icons';
import { Input, Tag } from 'antd';
import { checkedKeysToValue } from '../../util';
import type { BaseTagsProps } from './typing';
import './index.less';

/**
 * 标签 (支持value和onChange实现增删改查的受控)
 */
const BaseTags = (props: BaseTagsProps) => {
  const { value, labelKey = 'label' } = props;
  const [inputVisible, setInputVisible] = useState(false);
  const [inputValue, setInputValue] = useState('');

  // 标签数组
  const items = Array.isArray(value) ? value : String(value).split(',');

  // change事件
  const onChange = (newValues: string[]) => {
    const newVal = checkedKeysToValue(newValues, value);
    props.onChange?.(newVal);
  };

  // 获取label
  const getLabel = (item: any) => {
    const label = item && typeof item == 'object' ? item[labelKey] : item;
    return String(label);
  };

  // 可编辑
  const editable = !props.disabled && props.editable;

  // 添加
  const inputConfirm = () => {
    const newVal = props.onAddBefore
      ? props.onAddBefore(inputValue.trim(), items)
      : inputValue.trim();

    if (newVal && items.indexOf(newVal) === -1) {
      const newValues = [...items, newVal];
      onChange(newValues);
      props.onAdd && props.onAdd(newVal, newValues);
    }

    setInputVisible(false);
    setInputValue('');
  };

  return (
    <div className={`base-tags ${props.className || ''}`} style={props.style}>
      {/* tags */}
      {items.map((item: any, i: number) => {
        const label = getLabel(item);
        return (
          !['', 'undefined', 'null'].includes(label) && (
            <Tag
              key={`${label}${i}`}
              color={props.color}
              closable={editable}
              onClose={() => {
                // 删除
                const newValues = [...items];
                const delTags = newValues.splice(i, 1);
                props.onDel && props.onDel(delTags[0], newValues);
                onChange(newValues);
              }}
            >
              {label}
            </Tag>
          )
        );
      })}

      {/* 添加 */}
      {editable && inputVisible && (
        <Input
          type="text"
          size="small"
          className="base-tags-input"
          autoFocus
          placeholder={props.placeholder}
          value={inputValue}
          onChange={(e) => {
            setInputValue(e.target.value);
          }}
          onBlur={inputConfirm}
          onPressEnter={inputConfirm}
        />
      )}
      {editable && !inputVisible && (
        <Tag onClick={() => setInputVisible(true)} icon={<PlusOutlined />} color="blue">
          添加
        </Tag>
      )}
    </div>
  );
};

export default BaseTags;
