import type { BaseLibItems } from './typing';

/** 启用状态 */
export const BASE_USE: BaseLibItems = [
  { label: '正常', value: 1, tag: 'green' },
  { label: '停用', value: 0, tag: 'red' },
];

/** 是否显示 */
export const BASE_SHOW: BaseLibItems = [
  { label: '显示', value: 1, tag: 'green' },
  { label: '隐藏', value: 0, tag: 'red' },
];

/** 是否支持 */
export const BASE_SUPPORT: BaseLibItems = [
  { label: '支持', value: 1, tag: 'green' },
  { label: '不支持', value: 0, tag: 'red' },
];

/** 上架状态 */
export const BASE_SHELF: BaseLibItems = [
  { label: '上架', value: 1, tag: 'green' },
  { label: '下架', value: 0, tag: 'red' },
];

/** 开启关闭 */
export const BASE_OPEN: BaseLibItems = [
  { label: '开启', value: 1, tag: 'green' },
  { label: '关闭', value: 0, tag: 'red' },
];

/** 是/否 */
export const BASE_YES: BaseLibItems = [
  { label: '是', value: 1, tag: 'green' },
  { label: '否', value: 0, tag: 'red' },
];

/** 是否全选 */
export const BASE_CHECK_ALL: BaseLibItems = [{ label: '全部', value: true }];
