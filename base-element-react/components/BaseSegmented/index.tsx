import { Segmented } from 'antd';
import { useBaseLib } from '../../hooks/useBaseLib';
import type { BaseSegmentedProps } from './typing';

/**
 * 分段控制器
 */
const BaseSegmented = (props: BaseSegmentedProps) => {
  const { items } = useBaseLib(props);

  return <Segmented options={items} {...props} />;
};

export default BaseSegmented;
