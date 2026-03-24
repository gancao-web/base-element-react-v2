import { useEffect, useRef, useState } from 'react';
import { Button } from 'antd';
import { cls } from '../../util';
import type { BaseButtonProps } from './typing';
import './index.less';

const THROTTLE = 300; // throttle默认值

/**
 * 按钮组件
 */
const BaseButton = (props: BaseButtonProps) => {
  const { keepActiveColor, throttle = THROTTLE, isEnterBlur = true, ...antdProps } = props;
  const {
    className,
    style,
    loading: loadingProp,
    onClick: onClickProp,
    children,
    ...otherProps
  } = antdProps;

  const [loading, setLoading] = useState(loadingProp);
  const [isActived, setIsActived] = useState(false);

  const refData = useRef({
    lastTime: 0,
  }).current;

  const onClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    // 标记已激活
    if (keepActiveColor) {
      setIsActived(true);
    }

    // 节流 (默认至少间隔300ms才会再次派发click, 避免重复点击)
    const now = Date.now();
    if (now - refData.lastTime < throttle) return;
    refData.lastTime = now;

    // 派发click事件
    if (onClickProp) {
      const api = onClickProp(e);
      // 如果返回promise则自动显示加载进度条
      if (api && api instanceof Promise) {
        setLoading(true);
        api.then().finally(() => {
          setLoading(false);
        });
      }

      isEnterBlur && e.currentTarget.blur();
    }
  };

  useEffect(() => {
    setLoading(loadingProp);
  }, [loadingProp]);

  return (
    <Button
      type="primary"
      {...otherProps}
      style={{ ...style, color: isActived && keepActiveColor ? keepActiveColor : style?.color }}
      className={cls('base-button', className)}
      loading={loading}
      onClick={onClick}
    >
      {children}
    </Button>
  );
};

export default BaseButton;
