import { useEffect, useState } from 'react';
import { message } from 'antd';
import BaseMap from '../BaseMap';
import BaseModal from '../BaseModal';
import type { BaseMapMarker } from '../BaseMap/typing';
import type { BaseMapAddressProps } from './typing';
import './index.less';

/**
 * 打开地图选择地址
 */
const BaseMapAddress = (props: BaseMapAddressProps) => {
  const [markerComplete, setMarkerComplete] = useState<BaseMapMarker>();
  const [isShow, setIsShow] = useState(props.isShow);

  function onShow() {
    setIsShow(true);
    props.onShow?.();
  }

  function onClose() {
    setIsShow(false);
    props.onClose?.();
  }

  function onOk() {
    if (!markerComplete) {
      message.error('请搜索并选择地址');
      return;
    }
    onClose();
    props.onSuccess(markerComplete);
  }

  useEffect(() => {
    setIsShow(props.isShow);
  }, [props.isShow]);

  return (
    <div className="base-map-address">
      {/* 内部通过插槽自动受控 */}
      <div
        style={{ cursor: 'pointer' }}
        onClick={() => {
          const canShow = props.onBeforeShow?.();
          canShow !== false && onShow();
        }}
      >
        {props.children}
      </div>

      {/* 弹窗显示地图 */}
      <BaseModal
        title="选择地址"
        open={isShow}
        onCancel={() => onClose()}
        onOk={onOk}
        width={960}
        bodyStyle={{ padding: 0 }}
      >
        <BaseMap
          height={540}
          {...props.mapProps}
          plugin={['AutoComplete']}
          markerComplete={markerComplete}
          onComplete={setMarkerComplete}
        />
      </BaseModal>
    </div>
  );
};

export default BaseMapAddress;
