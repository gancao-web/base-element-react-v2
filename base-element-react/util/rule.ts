import { getBaseItemProp } from '../components/BaseForm/util';
import { isPhone, isIDCard, isUrl, isTax } from './verify';
import type { FormInstance, Rule } from 'antd/es/form';
import type { BaseFormConfig, BaseFormItem } from '../components/BaseForm/typing';
import type { BaseObj, BaseRule } from '../typing';

// 输入类型校验
const inputTypeCheckRules = {
  phone: isPhone,
  idcard: isIDCard,
  http: isUrl,
  tax: isTax,
};

// 获取配置项的输入框校验类型
function getItemInputType(item: BaseFormItem) {
  if (item.comp && item.comp != 'input') return undefined;
  if (item.type) return item.type;
  if (item.rules) {
    const validateRule = item.rules.find((val) => typeof val.type === 'string');
    return validateRule ? validateRule.type : undefined;
  }
  return undefined;
}

// 获取表单的数据和当前item输入的值
function getModelValue(item: BaseFormItem, refForm: React.RefObject<FormInstance>) {
  if ('prop' in item && item.prop) {
    const form = refForm.current?.getFieldsValue();
    const propKey = getBaseItemProp(item.prop).toString();
    const value = form[propKey];
    return { form, value };
  }
  return { form: {} };
}

// 获取配置项的校验规则
export function getItemRules(
  item: BaseFormItem,
  formWatch: BaseObj,
  refForm: React.RefObject<FormInstance>,
  configForm: BaseFormConfig,
) {
  const readonly =
    typeof item.readonly == 'function'
      ? item.readonly(formWatch)
      : item.readonly ?? configForm.readonly;
  const disabled =
    typeof item.disabled == 'function'
      ? item.disabled(formWatch)
      : item.disabled ?? configForm.disabled;
  if (readonly || disabled) return [];
  if (item.comp === 'title' || item.comp === 'text') return [];
  const itemRules: BaseRule[] = [];
  const required = typeof item.required === 'function' ? item.required(formWatch) : item.required;
  if (required) itemRules.push({ required }); // 支持在item中写入required
  const isInput = !item.comp || item.comp === 'input'; // comp不配置,默认为input组件
  if (isInput) {
    item.type !== undefined && itemRules.push({ type: item.type }); // 支持在item中写入type:"xx"
    item.min !== undefined && itemRules.push({ min: item.min }); // 支持在item中写入min:0
    item.max !== undefined && itemRules.push({ max: item.max }); // 支持在item中写入max:9
  }
  if (item.rules) {
    for (const rule of item.rules) {
      itemRules.push(rule); // 合并自定义的rule
    }
  }
  const rules = [];
  const label = (typeof item.label === 'function' ? item.label(formWatch) : item.label) || '';
  for (const val of itemRules) {
    const rule: Rule = {};
    const inputType = getItemInputType(item);
    if (val.required) {
      // 必填项
      rule.required = val.required;
      rule.message = val.message || `${label}不能为空`;
      // 上传组件
      if (item.comp === 'upload') {
        rule.validateTrigger = 'onBlur';
        rule.validator = () => {
          const value = refForm.current?.getFieldValue(item.prop!);
          if (value && value.length) {
            return Promise.resolve(); // value.length是兼容数组的情况
          } else {
            return Promise.reject(`${label}不能为空`);
          }
        };
      }
      // 输入范围组件的校验
      if (item.comp === 'input-range') {
        rule.validateTrigger = 'onBlur';
        rule.message = undefined;
        rule.validator = () => {
          const propKey = getBaseItemProp(item.prop).toString();
          const value = refForm.current?.getFieldValue(propKey);
          if (value) {
            const [min, max] = value;
            if (!min) {
              return Promise.reject(`${label}的最小值不能为空`);
            }
            if (!max) {
              return Promise.reject(`${label}的最大值不能为空`);
            }
            if (min > max) {
              return Promise.reject(`${label}的最小值需小于最大值`);
            }
            return Promise.resolve();
          } else {
            return Promise.reject(`${label}不能为空`);
          }
        };
      }
      // 富文本
      if (item.comp === 'editor') {
        rule.validateTrigger = 'onBlur';
        rule.message = undefined;
        rule.validator = () => {
          const value = refForm.current?.getFieldValue(item.prop!);
          if (!value || (value.indexOf('<img') === -1 && !value.replace(/<[^<>]+>/g, ''))) {
            return Promise.reject(`${label}不能为空`);
          }
          return Promise.resolve();
        };
      }
    } else if (val.min) {
      // 最小值 (val.min支持具体的数值 和 form的字段)
      rule.validator = () => {
        const { form, value } = getModelValue(item, refForm);
        if (value) {
          const min = typeof val.min === 'number' ? val.min : form[val.min!];
          if (inputType === 'digit' || inputType === 'num') {
            if (value < min) return Promise.reject(`${label}不可小于${min}`);
          } else {
            const str = item.comp === 'editor' ? value.replace(/<[^<>]+>/g, '') : value;
            if (str.length < min) return Promise.reject(`${label}至少${min}个字符`);
          }
        }
        return Promise.resolve();
      };
    } else if (val.max) {
      // 最大值 (val.max支持具体的数值 和 form的字段)
      rule.validator = () => {
        const { form, value } = getModelValue(item, refForm);
        if (value) {
          const max = typeof val.max === 'number' ? val.max : form[val.max!];
          if (inputType === 'digit' || inputType === 'num') {
            if (value > max) return Promise.reject(`${label}不可大于${max}`);
          } else {
            const str = item.comp === 'editor' ? value.replace(/<[^<>]+>/g, '') : value;
            if (str.length > max) return Promise.reject(`${label}至多${max}个字符`);
          }
        }
        return Promise.resolve();
      };
    } else if (val.validator) {
      // 自定义校验
      rule.validateTrigger = val.validateTrigger || 'onBlur';
      rule.validator = () => {
        const { form, value } = getModelValue(item, refForm);
        return val.validator!(form, value);
      };
    } else if (inputType && inputTypeCheckRules[inputType]) {
      // 输入校验 (需写在最后,避免没有单独声明rules:[{type}]导致替换了前面的规则)
      rule.validateTrigger = 'onBlur';
      rule.validator = () => {
        if (typeof item.prop !== 'string') return;
        const value = refForm.current?.getFieldValue(item.prop);
        if (value) {
          const check = inputTypeCheckRules[inputType];
          if (!check(value)) {
            return Promise.reject(`${label}不正确${inputType === 'http' ? ',必须以http开头' : ''}`);
          }
        }
        return Promise.resolve();
      };
    }
    // 不可加入空对象, 否则会提示"${label}不是一个有效的${type}
    Object.keys(rule).length && rules.push(rule);
  }
  return rules;
}
