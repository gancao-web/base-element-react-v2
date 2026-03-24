import { getBaseConfig } from '../config';
import type { BaseObj } from '../typing';

/** 获取地址参数 (返回null接口请求会传入,有时候接口校验不通过,而undefined则不会带到接口) */
export function getUrlParam(key: string, url?: string) {
  const searchStr = (url || window.location.href).split('?')[1];
  if (!searchStr) return undefined;
  const searchParams = new URLSearchParams(searchStr);
  return searchParams.get(key) || undefined;
}

/** 获取地址参数,转为number类型 */
export function getUrlNumber(key: string, url?: string) {
  const str = getUrlParam(key, url);
  if (str) {
    const num = Number(str);
    return isNaN(num) ? undefined : num;
  } else {
    return undefined;
  }
}

/** 拼接地址和参数,已自动encodeURIComponent编码,所以中文需decodeURIComponent解码 */
export function getParamStr(url: string, param: BaseObj) {
  if (param && typeof param === 'object') {
    let pstr = '';
    for (const key in param) {
      let val = param[key];
      if (val != null) {
        if (typeof val === 'object') val = JSON.stringify(val);
        pstr += `${key}=${encodeURIComponent(val)}&`;
      }
    }
    if (pstr) {
      pstr = pstr.substring(0, pstr.length - 1); // 去掉最后一个&
      return url ? (url.indexOf('?') == -1 ? '?' : '&') + pstr : pstr;
    }
  }
  return url;
}

/** 拼接图片地址 */
export function getImgUrl(src: string, width?: number, height?: number) {
  if (src && src.indexOf('blob:') !== 0) {
    const baseConfig = getBaseConfig();

    if (src.indexOf('http') === 0 && baseConfig.imgHost && src.indexOf(baseConfig.imgHost) !== 0) {
      return src; // 过滤非其他云存储的图片
    }
    src = getFileUrl(src); // 拼接完整的文件地址
    if (src.includes('.svg')) return src; // svg无需裁切缩放,否则404
    const isOss = baseConfig.imgType == 'OSS'; // 图片类型: 阿里云"OSS", 七牛云"QiNiu"
    const scaleTag = isOss ? '?x-oss-process=image/resize,' : '?imageView2/'; // 裁切缩放的标记
    const isSet = src.indexOf(scaleTag) !== -1; // 是否已拼接图片地址
    if (isSet) {
      if (!width && !height) {
        return src; // 如果已拼接,但未指定宽高则直接返回;
      } else {
        src = src.split('?')[0]; // 重新设置宽高
      }
    }
    if (isOss) {
      // 拼接尺寸 OSS
      if (width && height) {
        src += `${scaleTag}m_fill,h_${height},w_${width}`; //指定宽高
      } else if (width) {
        src += `${scaleTag}w_${width}`; //指定宽
      } else if (height) {
        src += `${scaleTag}h_${height}`; //指定高
      }
    } else {
      // 拼接尺寸 七牛
      if (width && height) {
        src += `${scaleTag}1/w/${width}/h/${height}`; // 指定宽高
      } else if (width) {
        src += `${scaleTag}2/w/${width}`; // 等比例缩放
      } else if (height) {
        src += `${scaleTag}2/h/${height}`; // 等比例缩放
      }
    }
  }
  return src;
}

/** 拼接视频帧*/
export function getVideoPoster(src: string, width?: number, height?: number, offset?: number) {
  if (src && (src.indexOf('?vframe/') == -1 || src.indexOf('?x-oss-process') == -1)) {
    src = getFileUrl(src); // 拼接完整的文件地址
    const baseConfig = getBaseConfig();
    const isOss = baseConfig.imgType == 'OSS'; // 图片类型: 阿里云"OSS", 七牛云"QiNiu"
    if (isOss) {
      // 阿里云
      src += `?x-oss-process=video/snapshot,f_jpg,m_fast,t_${offset || 0}`;
      if (width) src += `,w_${width}`; // 宽
      if (height) src += `,h_${height}`; // 高
    } else {
      // 七牛云
      src += `?vframe/jpg/offset/${offset || 0}`; // 第几秒
      if (width) src += `/w/${width}`; // 宽
      if (height) src += `/h/${height}`; // 高
    }
  }
  return src;
}

/** 拼接完整的文件地址 */
export function getFileUrl(src: string) {
  const baseConfig = getBaseConfig();
  if (baseConfig.imgHost && src.indexOf('http') === -1) {
    if (src.substring(0, 1) === '/') src = src.substring(1); // 去掉前面的'/'
    src = baseConfig.imgHost + src; // 已在'base-element-react/index.ts'确保'imgHost'以'/'结尾
  }
  return src;
}
