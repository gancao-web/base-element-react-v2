import { useBaseLib } from '../../hooks/useBaseLib';
import BaseTextLib from '../BaseTextLib';
import { cls } from '../../util';
import type { BaseTextProps } from './typing';
import './index.less';

/**
 * 文本组件
 * 配置color可使用统一的文本颜色
 * 配置value和lib可自动回显枚举值, lib支持枚举颜色标签tag, 枚举颜色文本color, 枚举小圆点dot
 */
const BaseText = (props: BaseTextProps) => {
  const { value, color, empty, children, style, className, onClick } = props;
  const { items } = useBaseLib(props);

  return (
    <div
      onClick={onClick}
      className={cls('base-text', color, className)}
      style={{ color, ...style }}
    >
      {/* null,undefined,空字符串显示empty (排除了0和false) */}
      {value === '' || value == null ? (
        empty
      ) : Array.isArray(value) ? (
        value.toString()
      ) : (
        <BaseTextLib lib={items} value={value} empty={empty} />
      )}
      {children}
    </div>
  );
};

export default BaseText;
