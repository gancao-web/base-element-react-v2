import { useState } from 'react';
import { PlayCircleOutlined } from '@ant-design/icons';
import { getImgUrl, getVideoPoster } from '../../util';
import BaseModal from '../BaseModal';
import type { BaseVideoProps } from './typing';
import './index.less';

/**
 * 视频组件,点击显示弹窗播放视频
 */
const BaseVideo = (props: BaseVideoProps) => {
  const w = props.width ? Number(props.width) * 2 : undefined; // 取2倍图
  const h = props.height ? Number(props.height) * 2 : undefined; // 取2倍图

  const srcArr = Array.isArray(props.src) ? props.src : props.src?.split(',') || []; // 视频地址数组
  const posterArr = Array.isArray(props.poster) ? props.poster : props.poster?.split(',') || []; // 封面地址数组

  const width = props.width || 'auto'; // 宽度自适应
  const height = props.height || 'auto'; // 高度自适应

  const [isPreview, setIsPreview] = useState(false); // 是否预览
  const [previewIndex, setPreviewIndex] = useState(0); // 预览索引

  const curVideoUrl = getImgUrl(srcArr[previewIndex]); // 当前预览的完整视频地址

  const showPreview = (i: number) => {
    if (!srcArr[i]) return;
    setPreviewIndex(i);
    setIsPreview(true);
  };

  const canclePreview = () => {
    setIsPreview(false);
  };
  return (
    <>
      {srcArr.map((src, i) => {
        const posterSrc = posterArr[i];
        const posterUrl = posterSrc ? getImgUrl(posterSrc, w, h) : getVideoPoster(src, w, h);
        return (
          <div className="base-video" key={i}>
            <img src={posterUrl} style={{ width, height }} onClick={() => showPreview(i)} />

            <PlayCircleOutlined className="base-video-play" />
          </div>
        );
      })}

      <BaseModal
        title="视频"
        width="1000px"
        open={isPreview}
        footer={false}
        onCancel={canclePreview}
      >
        <video className="base-video-preview" src={curVideoUrl} autoPlay={true} controls />
      </BaseModal>
    </>
  );
};

export default BaseVideo;
