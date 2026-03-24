import { useEffect } from 'react';
import type { BaseModalProps } from '../typing';

/**
 * 弹窗内容组件 (主要作用是在内容挂载后触发afterOpen回调)
 */
const BaseModalContent = (props: Pick<BaseModalProps, 'children' | 'afterOpen'>) => {
  const { children, afterOpen } = props;

  useEffect(() => {
    afterOpen?.();
  }, []);

  return <>{children}</>;
};

export default BaseModalContent;
