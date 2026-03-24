import type { BaseLibItem } from '../typing';

/**
 * 将选中值转化为对应lib的value数组
 * 比如将字符串'1,true,YES'转为数组[1,true,'YES'], 用于多选组件回显
 */
export function checkedValueToKeys(value: any, lib: BaseLibItem[]) {
  if (value === undefined) return [];

  const values = [];
  const strArr = String(value).split(','); // null, number, boolean, array都转为字符串数组
  for (const str of strArr) {
    const item = lib.find((e) => String(e.value) === str);
    if (item) {
      // 支持null和空字符串的lib
      values.push(item.value);
    } else {
      // null和空字符串的lib没有匹配到,则不回显
      if (str === '' || str === 'null') continue;
      // 其他已选中的值,则继续保持选中 (主要是异步搜索多选组件的场景)
      const isNumber = typeof lib[0]?.value === 'number';
      values.push(isNumber ? Number(str) : str);
    }
  }

  return values;
}

/**
 * 将多选组件选中的数组转为与初始值一样的类型
 * 比如初始值是字符串,则把多选数组转为逗号隔开的字符串
 * 比如初始值是数组,则直接返回多选数组
 * 比如初始值是数字,则返回单个数字
 * 比如初始值是布尔,则返回单个布尔
 */
export function checkedKeysToValue(newValue: any, oldValue: any) {
  if (Array.isArray(newValue)) {
    if (oldValue == null || typeof oldValue == 'string') {
      // 默认返回逗号隔开的字符串
      return newValue.join(',');
    } else if (typeof oldValue === 'number') {
      // 初始值是数字,则返回单个数字 (若存在多个选项,依然转为逗号隔开的字符串)
      return newValue.length > 1 ? newValue.join(',') : newValue[0];
    } else if (typeof oldValue === 'boolean') {
      // 初始值是布尔,则返回单个布尔 (若存在多个选项,依然转为逗号隔开的字符串)
      return newValue.length > 1 ? newValue.join(',') : newValue[0];
    }
  }

  // 原始值
  return newValue;
}

/**
 * 拖拽排序
 * @param list 原始数组
 * @param oldIndex 要移动的元素的原始索引
 * @param newIndex 要移动到的目标索引
 * @returns 移动元素后的新数组
 */
export function arrayMove<T>(list: T[], oldIndex: number, newIndex: number) {
  const newList = [...list]; // 创建新数组副本
  const [removed] = newList.splice(oldIndex, 1); // 移除 oldIndex 处的元素
  newList.splice(newIndex, 0, removed); // 插入到 newIndex 处
  return newList;
}
