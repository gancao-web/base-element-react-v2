import type { BaseObj } from '../typing';

/**
 * 多级嵌套对象-取值
 * @example const val = getObjValue(obj, "a")
 * @example const val = getObjValue(obj, "a.b")
 * @example const val = getObjValue(obj, "a[0].b.c")
 */
export function getObjValue(obj: BaseObj, key?: string, defaultValue?: any) {
  if (!obj || !key || typeof obj !== 'object') return defaultValue;

  let val;

  if (obj[key] !== undefined) {
    val = obj[key];
  } else {
    const keys = getObjKeys(key);

    val = keys.reduce((o: any, k: string) => {
      if (o == null || typeof o !== 'object') return undefined;
      return o[k];
    }, obj);
  }

  return defaultValue != null && (val == null || val === '') ? defaultValue : val;
}

/**
 * 多级嵌套对象-赋值
 * @example setObjValue(obj, "a", 1) -> obj.a = 1
 * @example setObjValue(obj, "a.b", 1) -> obj.a.b = 1
 * @example setObjValue(obj, "a[0].b.c", 1) -> obj.a[0].b.c = 1
 */
export function setObjValue(obj: BaseObj, key: string, val: any) {
  if (!obj || typeof obj !== 'object') return;
  if (!key) return;

  if (!key.includes('.') && !key.includes('[')) {
    obj[key] = val; // 简单字段,直接赋值
    return;
  }

  const keys = getObjKeys(key);
  let current = obj;

  for (let i = 0; i < keys.length; i++) {
    const k = keys[i];

    if (i === keys.length - 1) {
      current[k] = val;
    } else {
      const currentVal = current[k];
      const isArray = Array.isArray(currentVal);
      const nextKey = keys[i + 1];
      const isNextArray = /^\d+$/.test(nextKey);

      if (currentVal == null) {
        current[k] = isNextArray ? [] : {}; // 若值不存在，则创建适当类型
      } else if (typeof currentVal !== 'object') {
        current[k] = isNextArray ? [] : {}; // 若值存在但不是对象，则需要覆盖
      } else if (isNextArray && !isArray) {
        current[k] = [currentVal]; // 需要数组但不是数组
      } else if (!isNextArray && isArray) {
        current[k] = { ...currentVal }; // 需要对象但不是对象
      }

      current = current[k];
    }
  }

  delete obj[key]; // 删除组合字段
}

/**
 * 获取对象键
 */
export function getObjKeys(key: string) {
  return key
    .replace(/\[(\w+)\]/g, '.$1')
    .replace(/^\./, '')
    .split('.');
}

/**
 * 一维数组转级联数组
 * @param list 一维数组[{id:1, parentId: 0}, {id:2, parentId: 1}]
 * @param idKey id字段, 默认"id"
 * @param parentIdKey 父id字段, 默认 "parentId"
 * @param rootVal 根id的值, 默认0
 * @return [{id:1, parentId: 0, children:[{id:2, parentId: 1}]}]
 */
export function listToTree(
  list: Array<any>,
  idKey = 'id',
  parentIdKey = 'parentId',
  rootVal: string | number = 0,
) {
  const tree = list.filter((item: any) => {
    item.children = list.filter((child: any) => {
      return item[idKey] === child[parentIdKey];
    });
    return item[parentIdKey] === rootVal;
  });
  return tree;
}

/**
 * 深拷贝对象
 */
export function deepClone(obj: any) {
  if (obj === null || typeof obj !== 'object') {
    return obj;
  }
  const clone = Array.isArray(obj) ? [] : {};
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      clone[key] = deepClone(obj[key]);
    }
  }
  return clone;
}
