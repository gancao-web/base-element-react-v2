import { setBaseConfig } from './config';
import type { BaseConfigProp } from './typing';

/**
 * 统一导出, 快捷引入: import {xx} from 'base-element-react'
 */
export * from './components'; // 已经包含所有组件和类型
export * from './typing'; // 全局公共类型
export * from './util'; // 工具类
export * from './lib'; // 全局枚举

const BaseElement = {
  /**
   * 初始化配置项
   */
  use(config: BaseConfigProp) {
    setBaseConfig(config);
  },
};

export default BaseElement;
