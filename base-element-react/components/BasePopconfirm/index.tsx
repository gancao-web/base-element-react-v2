import { Button, Popconfirm } from 'antd';
import type { BasePopconfirmProps } from './typing';
import './index.less';

/**
 * 气泡确认框
 */
const BasePopconfirm = (props: BasePopconfirmProps) => {
  return (
    <>
      <Popconfirm
        title={props.title}
        onConfirm={props.onConfirm}
        overlayClassName="base-popconfirm"
        placement="topRight"
      >
        {typeof props.btn == 'string' ? <Button type="link">{props.btn}</Button> : props.btn}
      </Popconfirm>
    </>
  );
};

export default BasePopconfirm;
