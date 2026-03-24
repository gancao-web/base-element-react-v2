import type { required, BaseConfigProp } from './typing';

/**
 * 默认配置
 */
const baseConfig: required<
  BaseConfigProp,
  'imgType' | 'rowKey' | 'pageKey' | 'sizeKey' | 'listKey' | 'totalKey'
> = {
  imgType: 'OSS',
  rowKey: 'id',
  pageKey: 'pageNum',
  sizeKey: 'pageSize',
  listKey: 'list',
  totalKey: 'total',
  sticky: false,
};

// 使用 getter/setter 模式，确保所有地方访问的都是同一个实例 (避免发布到npm,数据共享失效)
export const getBaseConfig = () => baseConfig;

// 设置配置项
export const setBaseConfig = (config: Partial<BaseConfigProp>) => {
  for (const key in config) {
    baseConfig[key] = config[key];
  }

  // 图片域名以"/"结尾
  if (config.imgHost) {
    const lastChar = config.imgHost.charAt(config.imgHost.length - 1);
    if (lastChar !== '/') baseConfig.imgHost += '/';
  }
};
