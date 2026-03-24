import type { BaseFormItemProps } from './typing';
import './index.less';

/**
 * 表单项
 */
const BaseFormItem = (props: BaseFormItemProps) => {
  return (
    <div
      className={`base-form-item item-align-${props.align || 'middle'} ${
        props.inline ? 'item-inline' : ''
      }`}
      style={{ width: `${props.width}px`, ...props.style }}
    >
      {props.label != null && (
        <div className={`form-label label-width-${props.labelWidth || 120}`}>
          {props.required && <span className="required">*</span>}
          {props.label ? `${props.label}：` : null}
        </div>
      )}
      <div className="form-content">{props.children}</div>
    </div>
  );
};

export default BaseFormItem;
