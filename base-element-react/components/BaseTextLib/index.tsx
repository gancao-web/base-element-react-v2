import { Tag } from 'antd';
import BaseText from '../BaseText';
import type { BaseLibItem } from '../../typing';
import type { BaseTextLibProps } from './typing';
import './index.less';

/**
 * 递归查找lib
 */
const findLibItem = (lib: BaseLibItem[], value: any): BaseLibItem | undefined => {
  for (const item of lib) {
    if (item.value == value || item.label == value) {
      return item;
    } else if (Array.isArray(item.children)) {
      const childItem = findLibItem(item.children, value);
      if (childItem) return childItem;
    }
  }
  return undefined;
};

/**
 * 文本枚举组件: 支持枚举颜色标签tag, 枚举颜色文本color, 枚举小圆点dot
 * 内部统一逻辑用, 外部只需使用BaseText即可
 */
const BaseTextLib = (props: BaseTextLibProps) => {
  const { lib, value, empty } = props;
  const split = props.split || '、';
  if (lib.length && value != null) {
    const labelArr: React.ReactNode[] = []; // 标签数组
    const valueArr =
      typeof value === 'string'
        ? value.split(',')
        : ['number', 'boolean'].includes(typeof value)
        ? [value]
        : value;
    for (const value of valueArr) {
      const itemFind = findLibItem(lib, value);
      if (itemFind) {
        labelArr.push(
          itemFind.tag ? (
            <Tag color={itemFind.tag}>{itemFind.label}</Tag>
          ) : itemFind.dot ? (
            <span>
              <span className="base-text-lib-dot" style={{ background: itemFind.dot }} />
              <span>{itemFind.label}</span>
            </span>
          ) : itemFind.color ? (
            <BaseText color={itemFind.color}>{itemFind.label}</BaseText>
          ) : (
            itemFind.label
          ),
        );
      } else {
        empty && labelArr.push(empty);
      }
    }
    return (
      <>
        {labelArr.map((item, i) => {
          return (
            <span key={i}>
              {item}
              {i < labelArr.length - 1 ? split : ''}
            </span>
          );
        })}
      </>
    );
  }
  return <>{value}</>;
};

export default BaseTextLib;
