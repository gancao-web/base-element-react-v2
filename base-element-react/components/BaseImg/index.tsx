import { Image } from 'antd';
import { getImgUrl } from '../../util';
import type { BaseImgProps } from './typing';
import './index.less';

/**
 * 图片组件,点击放大
 */
const BaseImg = (props: BaseImgProps) => {
  const w = props.width ? Number(props.width) * 2 : undefined; // 取2倍图
  const h = props.height ? Number(props.height) * 2 : undefined; // 取2倍图
  const arr = Array.isArray(props.src) ? props.src : props.src?.split(',') || [];
  const width = props.width || 'auto'; // 宽度自适应
  const height = props.height || 'auto'; // 高度自适应
  // 预览列表
  return (
    <Image.PreviewGroup>
      {arr.map((img, index) => {
        // 是否预览
        const preview = props.preview != false ? { src: getImgUrl(img) } : false;
        return (
          <Image
            className={props.className}
            rootClassName="base-img"
            style={props.style}
            src={getImgUrl(img, w, h)}
            preview={preview}
            width={width}
            height={height}
            key={index}
          />
        );
      })}
    </Image.PreviewGroup>
  );
};

export default BaseImg;
