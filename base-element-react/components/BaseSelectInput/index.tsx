import { CaretDownOutlined } from '@ant-design/icons';
import BaseInput from '../BaseInput';
import BaseSelect from '../BaseSelect';
import BaseDatePicker from '../BaseDatePicker';
import type { BaseSelectInputProps, BaseSelectInputValue } from './typing';
import './index.less';

/**
 * 下拉选择+(输入框|时间选择)
 */
const BaseSelectInput = (props: BaseSelectInputProps) => {
  const valArr: BaseSelectInputValue = props.value || []; // 数组中只会有一个下标有值,其他的都是undefined
  const valIndexFind = valArr.findIndex((val: any) => val != null); // 有值的下标就是select选中的下标
  const labelIndex = valIndexFind < 0 ? 0 : valIndexFind; // 默认选中第一个下标
  const valInput = valArr[labelIndex]; // 当前输入的值
  const valItem = props.lib[labelIndex]; // 当前选中的item

  const selectLibs: string[] = [];
  const selectValue = valItem.label; // 以label作为选项,因为value在时间范围选择时是数组
  for (const item of props.lib) {
    selectLibs.push(item.label);
  }

  // 左边选项变化的监听
  function onLabelChange(value: any, labelIndex: number) {
    props.onLabelChange?.(value, labelIndex);
    onChange(value, labelIndex);
  }

  // 右边选项值变化的监听
  function onValueChange(value: any) {
    props.onValueChange?.(value, labelIndex);
    onChange(value, labelIndex);
  }

  // 对外抛出的总体值
  function onChange(value: any, index: number) {
    const valNew: BaseSelectInputValue = [];
    valNew[index] = value;
    props.onChange?.(valNew);
  }
  return (
    <div className="base-select-input">
      <div className="select-label">
        <BaseSelect
          bordered={false}
          clearable={false}
          lib={selectLibs}
          value={selectValue}
          suffixIcon={<CaretDownOutlined />}
          onChange={(value) => {
            const newLabelIndex = props.lib.findIndex((item) => item.label === value);
            const newValItem = props.lib[newLabelIndex];
            const newValInput = newValItem.type === valItem.type ? valInput : ''; // 输入类型不一致的时候才置空输入的值
            onLabelChange(newValInput || '', newLabelIndex);
          }}
        />
      </div>
      {props.field?.comp === 'select' ? (
        <BaseSelect
          className="select-value"
          {...props.field}
          value={valInput}
          onChange={onValueChange}
        />
      ) : props.field?.comp === 'picker-date' ? (
        <BaseDatePicker
          className="select-value"
          {...props.field}
          value={valInput}
          onChange={onValueChange}
        />
      ) : (
        <BaseInput
          className="select-value"
          {...props.field}
          type={valItem.type}
          value={valInput}
          onChange={onValueChange}
        />
      )}
    </div>
  );
};

export default BaseSelectInput;
