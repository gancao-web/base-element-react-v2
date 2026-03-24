import type { BASE_FILE_TYPE } from './typing';

/** 文件类型枚举 */
export const BASE_FILE_LIB = {
  img: ['png', 'jpg', 'gif', 'jpeg', 'svg', 'webp'],
  video: ['mp4', 'mpg', 'webm'],
  voice: ['mp3', 'ogg', 'wav'],
  excel: ['csv', 'xls', 'xlsx'],
  word: ['txt', 'doc', 'docx', 'pdf'],
  zip: ['zip', 'gz', 'tar', 'rar'],
};

/** 根据文件地址后缀判断文件类型 */
export function getFileType(filePath?: unknown): BASE_FILE_TYPE | undefined {
  if (!filePath || typeof filePath !== 'string') return undefined;
  const suffix = filePath.slice(filePath.lastIndexOf('.') + 1).toLowerCase();
  const keyArr = Object.keys(BASE_FILE_LIB) as BASE_FILE_TYPE[];
  for (const key of keyArr) {
    const arr = BASE_FILE_LIB[key];
    if (arr.indexOf(suffix) >= 0) {
      return key;
    }
  }
  return undefined;
}
