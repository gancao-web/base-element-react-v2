import { message } from 'antd';
import { getBaseConfig } from '../config';
import type { BaseLib, BaseLibApi, BaseLibItem, BaseObj } from '../typing';

/**
 * 获取静态枚举的默认值
 * @param lib 枚举配置
 * @param libApiDefault 动态api枚举的默认值
 * @returns 静态枚举
 */
export function getItemsDefault(lib?: BaseLib, libApiDefault?: BaseLibItem[]) {
  if (!lib) return [];
  const isArrayLib = Array.isArray(lib);
  if (isArrayLib) {
    // 空数组直接返回本身
    if (lib.length === 0) return lib as BaseLibItem[];
    // 静态枚举: BaseLibItem[]
    if (typeof lib[0] === 'object') {
      return lib as BaseLibItem[];
    }
    // 静态枚举: string[] | number[]
    const items: BaseLibItem[] = [];
    for (const value of lib) {
      if (typeof value !== 'object') {
        items.push({ label: value, value });
      }
    }
    return items;
  } else {
    // 动态api枚举: BaseLibApi和BaseLibApiFn
    return libApiDefault || [];
  }
}

/**
 * 获取配置化lib接口结果 (param返回false,将不请求)
 * 注: 接口是异步的,如果这时组件销毁,异步回调的setItems会报异常
 */
export function getBaseLibApiItems(
  lib: BaseLibApi,
  param?: BaseObj | false,
  libParam?: BaseObj | false,
) {
  return new Promise<BaseLibItem[]>((resolve, reject) => {
    if (param === false || libParam === false) {
      // param返回false,将不请求
      reject();
      return;
    }
    if (typeof lib.api == 'function') {
      // 自定义接口请求
      lib
        .api(param)
        .then((items) => {
          resolve(items);
        })
        .catch(() => {
          reject();
        });
    } else {
      const apiParam =
        typeof lib.param == 'function' ? lib.param(param || {}) : { ...lib.param, ...libParam };
      if (apiParam === false) {
        // param返回false,将不请求
        reject();
        return;
      }

      const baseConfig = getBaseConfig();

      if (!baseConfig.http) {
        message.error('接口枚举无法使用,请在main.tsx配置BaseElement的http选项');
        reject();
        return;
      }

      baseConfig
        .http(lib.api || '', apiParam, lib.requestConfig)
        .then((res) => {
          const listKey = baseConfig.listKey;
          const list = lib.filterResult
            ? lib.filterResult(res)
            : Array.isArray(res)
            ? res
            : res[listKey]
            ? res[listKey]
            : [];
          const itemList: BaseLibItem[] = [];
          const labelKey = lib.label || 'label'; // 取label的字段
          const valueKey = lib.value || 'id'; // 取value的字段
          for (const item of list) {
            if (item && typeof item === 'object') {
              // 对象类型
              let isLeaf; // 是否为子页
              if (typeof lib.isLeaf === 'boolean') {
                isLeaf = lib.isLeaf; // 直接指定
              } else if (typeof lib.isLeaf === 'string') {
                isLeaf = item[lib.isLeaf]; // 取对应的字段
              } else if (typeof lib.isLeaf === 'function') {
                isLeaf = lib.isLeaf(item); // 自行处理
              } else {
                // 没有配置, 则组件内部会根据children是否有值来判断是否有下一级
              }
              itemList.push({
                ...item,
                label: item[labelKey],
                value: item[valueKey],
                isLeaf,
              });
            } else {
              // string, number, boolean
              itemList.push({
                label: item,
                value: item,
              });
            }
          }
          resolve(itemList);
        })
        .catch((e) => {
          console.error('lib init error:', e);
          reject(e);
        });
    }
  });
}
