import { SettingOutlined } from '@ant-design/icons';
import { Button, Checkbox, Dropdown, Tooltip } from 'antd';
import { setCacheColumns } from '../util/cache';
import type { CheckboxChangeEvent } from 'antd/es/checkbox';
import type { BaseListTableItem } from '../typing';
import type { CheckboxValueType } from 'antd/es/checkbox/Group';
import './DropdownSet.less';

type DropdownSetProps = {
  /** 样式 */
  className?: string;
  /** 列 */
  table?: BaseListTableItem[];
  /** 选中的下标 */
  value: CheckboxValueType[];
  /** 默认选中的下标 */
  defaultValue?: CheckboxValueType[];
  /** 选中下标的改变事件 */
  onChange: (checkedIndexs: CheckboxValueType[]) => void;
};

/**
 * 列设置的下拉浮窗
 */
const DropdownSet = (props: DropdownSetProps) => {
  const table = props.table || [];
  const checkedIndexs = props.value || [];
  const allIndexs = table.map((_, i) => i); // 全选的value (以下标为准,因为label可能为dom,然后prop可能没值)
  const indeterminate = checkedIndexs.length > 0 && checkedIndexs.length < allIndexs.length;
  const checkAll = checkedIndexs.length === allIndexs.length;

  // 选中变化
  const onChange = (indexs: CheckboxValueType[]) => {
    setCacheColumns(table, indexs);
    props.onChange && props.onChange(indexs);
  };

  // 全选
  function onCheckAllChange(e: CheckboxChangeEvent) {
    const arr = e.target.checked ? allIndexs : [];
    onChange(arr);
  }

  // 重置
  function reset() {
    onChange(props.defaultValue || allIndexs);
  }

  return (
    <Dropdown
      trigger={['click']}
      placement="bottomRight"
      arrow
      dropdownRender={() => (
        <div className="base-list-dropdown-set">
          <div className="set-checkall">
            <Checkbox indeterminate={indeterminate} onChange={onCheckAllChange} checked={checkAll}>
              列展示
            </Checkbox>
            <Button type="link" onClick={() => reset()}>
              重置
            </Button>
          </div>
          <Checkbox.Group className="set-checkgroup" value={checkedIndexs} onChange={onChange}>
            {table.map((item, i) => {
              return (
                <Checkbox
                  key={i}
                  value={i}
                  style={{ display: item.vif != false ? '' : 'none' }}
                  className="set-checkbox"
                >
                  {item.label}
                </Checkbox>
              );
            })}
          </Checkbox.Group>
        </div>
      )}
    >
      <Tooltip title="设置">
        <SettingOutlined className={props.className} />
      </Tooltip>
    </Dropdown>
  );
};

export default DropdownSet;
