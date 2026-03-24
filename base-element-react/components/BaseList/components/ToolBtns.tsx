import BaseButton from '../../BaseButton';
import type { BaseListBtn } from '../typing';

type Props = {
  btns?: BaseListBtn[];
  onClick: (btn: BaseListBtn) => void;
};

/**
 * 工具栏按钮组
 */
const ToolBtns = (props: Props) => {
  const { btns, onClick } = props;
  return (
    <>
      {btns?.map((item, i) => {
        if (item.vif == false) return null;
        if (typeof item.label === 'string') {
          const { dialog, click, vif, api, ...btnProps } = item; // 删除非Button属性,避免ts提示添加了多余属性的警告
          return (
            <BaseButton
              {...btnProps}
              key={i}
              className="base-tool-btn"
              onClick={() => {
                return onClick(item);
              }}
            >
              {item.label}
            </BaseButton>
          );
        } else {
          return (
            <div
              key={i}
              className="base-tool-btn"
              onClick={() => {
                onClick(item);
              }}
            >
              {item.icon} {item.label}
            </div>
          );
        }
      })}
    </>
  );
};

export default ToolBtns;
