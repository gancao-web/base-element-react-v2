import { setObjValue } from '../../util';
import type { BaseObj, BaseProp } from '../../typing';
import type { BaseFormItem } from './typing';

// 获取表单字段数组
export const getBaseItemProp = (prop?: BaseProp) => {
  if (!prop) return [];
  if (typeof prop === 'string') {
    return [prop];
  } else {
    const arr: (string | string[])[] = [];
    for (const p of prop) {
      if (typeof p === 'string') {
        arr.push(p);
      } else {
        arr.push(p.value);
      }
    }
    return arr;
  }
};

// 获取表单项的组合字段
export const getFormItemProp = (item: BaseFormItem) => {
  if (!('prop' in item) || !item.prop) return undefined;

  if (typeof item.prop === 'string') {
    return item.prop;
  } else {
    return String(item.prop);
  }
};

// 格式化form字段 (form字段 --> prop字段)
export function formToPropParam(
  form: BaseObj = {},
  formItems: BaseFormItem[] = [],
  isFilterEmpty = false,
) {
  const param = { ...form };
  for (const item of formItems) {
    if (!('prop' in item && item.prop)) continue;

    if (typeof item.prop === 'string') {
      // prop为字符串
      const propKey = item.prop;
      const val = form[propKey];
      setObjValue(param, propKey, val);
    } else {
      // prop为数组
      const propArr = getBaseItemProp(item.prop);
      const propKey = propArr.toString();
      const values = form[propKey];
      propArr.forEach((prop, i) => {
        const val = values?.[i];
        if (typeof prop === 'string') {
          setObjValue(param, prop, val);
        } else {
          prop.forEach((p, j) => {
            setObjValue(param, p, val?.[j]);
          });
        }
      });
      delete param[propKey];
    }
  }

  // 再次遍历param, 因为不仅处理item的prop字段, 还需处理getParam的form, 里面包含手动setParam的额外字段
  for (const key in param) {
    const val = param[key];
    // 先去空格 (因为下一步会判断 val === '' 过滤空字符串)
    if (typeof val === 'string') param[key] = val.trim();

    // 过滤空字符串,null,undefined
    if (isFilterEmpty && (val == null || val === '')) delete param[key];
  }

  return param;
}

// 格式化prop字段 (prop字段 --> form字段)
export function propParamToForm(param: BaseObj, formItems: BaseFormItem[]) {
  const form: BaseObj = {};
  for (const key in param) {
    const val = param[key];
    // 需保留原param字段,以确保setParam的数据,可以通过getParam全部取到
    form[key] = val;
    // 找到配置中的字段
    for (const item of formItems) {
      if ('prop' in item && item.prop) {
        if (typeof item.prop === 'string') {
          // 字段string
          if (item.prop === key) form[key] = val;
        } else {
          // string[] | BasePropItems
          item.prop.forEach((prop, propIndex) => {
            const propArr = getBaseItemProp(item.prop);
            const propKey = propArr.toString();
            if (typeof prop === 'string') {
              // 字段string[]
              if (prop === key) {
                if (!form[propKey]) form[propKey] = []; // 需在赋值之前才判断创建,确保initialValues没有值时为undefined,而不是[]
                form[propKey][propIndex] = val;
              }
            } else {
              // BasePropItems
              if (typeof prop.value === 'string') {
                // 字段string
                if (prop.value === key) {
                  if (!form[propKey]) form[propKey] = [];
                  form[propKey][propIndex] = val;
                }
              } else {
                // 字段string[]
                const pIndex = prop.value.indexOf(key);
                if (pIndex !== -1) {
                  if (!form[propKey]) form[propKey] = [];
                  if (!form[propKey][propIndex]) form[propKey][propIndex] = [];
                  form[propKey][propIndex][pIndex] = val;
                }
              }
            }
          });
        }
      }
    }
  }

  return form;
}
