import type { BaseRichTextProps } from './typing';
import './index.less';

/**
 * 富文本组件
 */
const BaseRichText = (props: BaseRichTextProps) => {
  const text = props.children || props.value || '';
  const __html = props.onlyText ? text.replace(/<[^<>]+>/g, '') : text;
  return (
    <div
      className={`base-richtext ${props.className || ''}`.trim()}
      style={props.style}
      dangerouslySetInnerHTML={{ __html }}
    />
  );
};

export default BaseRichText;
