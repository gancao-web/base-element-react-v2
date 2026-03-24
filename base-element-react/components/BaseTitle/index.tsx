import type { BaseTitleProps } from './typing';
import './index.less';

/**
 * 标题组件
 */
const BaseTitle = (props: BaseTitleProps) => {
  const vline = props.vline !== false;
  return (
    <div className="base-title" style={props.sty}>
      {vline && <div className="vline before" />}
      <div className="title">{props.label}</div>
      {vline && <div className="vline after" />}
    </div>
  );
};

export default BaseTitle;
