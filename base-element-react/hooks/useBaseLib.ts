import { useEffect, useState } from 'react';
import { getBaseLibApiItems, getItemsDefault } from '../util/lib';
import type { BaseLib, BaseLibItem, BaseObj } from '../typing';

/**
 * 获取静态枚举的默认值
 * @param lib 枚举配置
 * @param libApiDefault 动态api枚举的默认值
 * @returns 静态枚举
 */
export function useBaseLib(props: {
  value?: any;
  lib?: BaseLib;
  libParam?: BaseObj;
  libApiDefault?: BaseLibItem[];
  onLibInit?: (arr: BaseLibItem[]) => void;
}) {
  const { value, lib, libParam, libApiDefault, onLibInit } = props;
  const isArrayLib = Array.isArray(lib);
  const itemsDefault = getItemsDefault(lib, libApiDefault); // 默认值
  const [items, setItems] = useState<BaseLibItem[]>(itemsDefault);
  const [loading, setLoading] = useState(false); // 是否在加载中
  const initLibApiItems = (keyword?: string) => {
    if (!lib || isArrayLib) {
      setItems(itemsDefault);
    } else {
      const param = { value, keyword, ...libParam };
      const libApi = typeof lib == 'function' ? lib(param) : lib;
      setLoading(true);
      getBaseLibApiItems(libApi, param, libParam)
        .then((arr) => {
          setLoading(false);
          setItems(arr);
          // 配置项变化时才触发, 避免isShowReloadLib=true时,每次展开选项都回调
          if (onLibInit && JSON.stringify(items) != JSON.stringify(arr)) {
            onLibInit(arr);
          }
        })
        .catch(() => {
          setLoading(false);
        });
    }
  };

  // 首次加载和配置项变化都会重设枚举选项
  useEffect(() => {
    initLibApiItems();
  }, [lib, JSON.stringify(libParam)]);

  return { items, setItems, loading, initLibApiItems };
}
