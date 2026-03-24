import BaseImg from '../BaseImg';
import BaseVideo from '../BaseVideo';
import { getFileType } from './util';
import type { BaseFileProps } from './typing';

/**
 * 文件预览
 */
const BaseFile = (props: BaseFileProps) => {
  const src = props.src;
  const isUrl = src && typeof src === 'string' && src.indexOf('http') === 0;
  const fileType = getFileType(src);
  return (
    <div style={props.style} className={props.className}>
      {!isUrl ? (
        src
      ) : fileType === 'img' ? (
        <BaseImg width={props.width} height={props.height} src={src} />
      ) : fileType === 'video' ? (
        <BaseVideo width={props.width} height={props.height} src={src} />
      ) : fileType === 'voice' ? (
        <audio
          style={{ width: props.width, height: props.height, verticalAlign: 'middle' }}
          src={src}
          controls
        />
      ) : (
        <a href={src} style={{ wordBreak: 'break-all' }} target="_blank" rel="noreferrer">
          {src}
        </a>
      )}
    </div>
  );
};

export default BaseFile;
