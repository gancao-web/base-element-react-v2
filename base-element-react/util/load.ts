import { getFileUrl } from './url';
import type { BaseObj } from '../typing';

/**
 * 下载文件
 * @param url 相对或完整的下载地址 | canvas.toDataURL('image/png')得到的base64字符串 | Blob对象
 * @param fileName 自定义文件名
 */
export async function download(url: string | Blob, fileName?: string) {
  console.log(`下载：fileName=${fileName}, url=`, url);
  if (!url) return;
  let blobUrl;
  if (typeof url === 'string') {
    if (url.includes(';base64,')) {
      // 过滤base64
      blobUrl = url;
    } else {
      if (fileName) {
        // 跨域的url无法自定义文件名,需转为blob
        const resFetch = await fetch(getFileUrl(url));
        const resBlob = await resFetch.blob();
        blobUrl = window.URL.createObjectURL(resBlob);
        // 转为blob的下载地址之后, fileName无法自动获取到后缀, 需手动拼接
        if (!fileName) {
          fileName = decodeURIComponent(url.split('?')[0].split('/').pop() || '');
        }
      } else {
        // url下载地址
        blobUrl = getFileUrl(url);
      }
    }
  } else {
    // 文件流
    blobUrl = window.URL.createObjectURL(url);
  }

  // window.location.href = blobUrl // 可能会关闭当前页面
  // window.open(blobUrl, '_blank') // 不支持下载图片
  const aDom = document.createElement('a'); // 通过a标签模拟点击下载
  aDom.href = blobUrl;
  aDom.download = fileName || ''; // 不传值,会自动取url的文件名 (跨域url无法自定义文件名,需转为blob; 但是转为blob之后无法自动取到拓展名,需手动拼接)
  document.body.appendChild(aDom);
  aDom.click();
  document.body.removeChild(aDom);
}

/**
 * 下载文件流
 * @param axiosResponse 配置响应头responseType:'blob'时的完整请求结果
 * @param fileName 指定下载的文件名, 默认取响应头'content-disposition'的文件名
 * @return 下载失败的时候返回错误信息的字符串或对象
 */
export function downloadBlob(axiosResponse: BaseObj, fileName?: string) {
  return new Promise<BaseObj>((resolve, reject) => {
    const result: Blob = axiosResponse.data;
    if (!result.type) {
      reject('downloadBlob: result is not a blob object');
      return;
    }
    if (result.type.includes('application/json')) {
      // 导出失败 (需解析出文件流的json错误信息)
      const reader = new FileReader();
      reader.onload = () => {
        const errObj = JSON.parse(reader.result as string);
        reject(errObj);
      };
      reader.onerror = (e) => {
        reject(JSON.stringify(e));
      };
      reader.readAsText(result);
    } else {
      // 导出成功 (直接下载,并返回原始数据)
      if (!fileName) {
        const code = axiosResponse.headers['content-disposition']?.split('=')[1];
        fileName = code ? decodeURIComponent(code) : undefined;
      }
      const blobType = axiosResponse.headers['content-type'];
      const blob = new Blob([result], { type: blobType });
      download(blob, fileName);
      resolve(axiosResponse);
    }
  });
}

/** 动态加载js (重复执行不会重复加载js,内部已排重) */
export function loadJs(url: string, success: () => void) {
  // 是否已加载 (排重)
  const jsList = document.getElementsByTagName('script');
  for (const js of jsList) {
    if (js.src == url) {
      success && success();
      return;
    }
  }

  // 异步加载
  const script: any = document.createElement('script');
  script.type = 'text/javascript';
  if (script.readyState) {
    script.onreadystatechange = function () {
      if (script.readyState == 'loaded' || script.readyState == 'complete') {
        script.onreadystatechange = null;
        success && success();
      }
    };
  } else {
    script.onload = function () {
      success && success();
    };
  }
  script.src = url;
  document.getElementsByTagName('head')[0].appendChild(script);
}
