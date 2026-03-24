import React, { useImperativeHandle, useState } from 'react';
import { Form, message } from 'antd';
import { getItemRules } from '../../util/rule';
import BaseInput from '../BaseInput';
import BaseInputRange from '../BaseInputRange';
import BaseCascader from '../BaseCascader';
import BaseCheckbox from '../BaseCheckbox';
import BaseDatePicker from '../BaseDatePicker';
import BaseUpload from '../BaseUpload';
import BaseEditor from '../BaseEditor';
import BaseRadio from '../BaseRadio';
import BaseSelect from '../BaseSelect';
import BaseSelectInput from '../BaseSelectInput';
import BaseText from '../BaseText';
import BaseTitle from '../BaseTitle';
import BaseTags from '../BaseTags';
import BaseTabs from '../BaseTabs';
import BaseTimePicker from '../BaseTimePicker';
import BaseSwitch from '../BaseSwitch';
import BaseSegmented from '../BaseSegmented';
import { defItemBottom, defItemRight } from './def';
import { formToPropParam, getBaseItemProp, getFormItemProp, propParamToForm } from './util';
import type { BaseFormItemField, BaseObj } from '../../typing';
import type { BaseFormConfig, BaseFormItem, BaseFormProps, BaseFormRef } from './typing';
import type { FormInstance } from 'antd/es/form';
import './index.less';

// 表单项通过自定义组件方式实现,可减少valuesWatch引发的重绘
const BaseItem = (
  prop: BaseFormItemField & {
    item: BaseFormItem;
    formWatch: BaseObj;
    refForm: React.RefObject<FormInstance<any>>;
    configForm: BaseFormConfig;
  },
) => {
  const { item, formWatch, refForm, configForm } = prop;

  // 动态属性 (需要同步调用addWatchProps才能生效)
  const readonly =
    typeof item.readonly == 'function'
      ? item.readonly(formWatch)
      : item.readonly ?? configForm.readonly;
  const disabled =
    typeof item.disabled == 'function'
      ? item.disabled(formWatch)
      : item.disabled ?? configForm.disabled;
  const before = typeof item.before === 'function' ? item.before(formWatch) : item.before;
  const after = typeof item.after === 'function' ? item.after(formWatch) : item.after;
  const tip = typeof item.tip === 'function' ? item.tip(formWatch) : item.tip;
  const libParam = typeof item.libParam === 'function' ? item.libParam(formWatch) : item.libParam;

  // 基础钩子
  const baseProps = {
    value: prop.value,
    onChange: (value: any, selectItems?: any) => {
      // form表单自带的onChange
      prop.onChange?.(value, selectItems);
      // 配置项的onChange
      emitConfigChange({ item, refForm, configForm, selectItems });
    },
    disabled,
    readonly,
  };

  return (
    <div className="base-item">
      {/* 前缀 - 占位 */}
      {before && (
        <div className={`base-item-before ${React.isValidElement(before) && before.type}`}>
          {before}
        </div>
      )}
      {/* 子组件 */}
      {!item.comp || item.comp == 'input' ? (
        <BaseInput {...item} {...baseProps} />
      ) : item.comp == 'input-range' ? (
        <BaseInputRange {...item} {...baseProps} />
      ) : item.comp == 'select' ? (
        <BaseSelect {...item} {...baseProps} libParam={libParam} />
      ) : item.comp == 'select-input' ? (
        <BaseSelectInput lib={item.prop} {...item} {...baseProps} />
      ) : item.comp == 'text' ? (
        <BaseText
          {...item}
          value={item.value == undefined ? prop.value : item.value}
          onChange={undefined}
          disabled={undefined}
          readonly={undefined}
        />
      ) : item.comp == 'checkbox' ? (
        <BaseCheckbox {...item} {...baseProps} libParam={libParam} />
      ) : item.comp == 'radio' ? (
        <BaseRadio {...item} {...baseProps} libParam={libParam} />
      ) : item.comp == 'tags' ? (
        <BaseTags {...item} {...baseProps} />
      ) : item.comp == 'picker-date' ? (
        <BaseDatePicker {...item} {...baseProps} />
      ) : item.comp == 'picker-time' ? (
        <BaseTimePicker {...item} {...baseProps} />
      ) : item.comp == 'upload' ? (
        <BaseUpload {...item} {...baseProps} />
      ) : item.comp == 'editor' ? (
        <BaseEditor {...item} {...baseProps} />
      ) : item.comp == 'cascader' ? (
        <BaseCascader {...item} {...baseProps} />
      ) : item.comp == 'switch' ? (
        <BaseSwitch {...item} {...baseProps} />
      ) : item.comp == 'tabs' ? (
        <BaseTabs {...item} {...baseProps} />
      ) : item.comp == 'segmented' ? (
        <BaseSegmented {...item} {...baseProps} />
      ) : (
        <div />
      )}
      {/* 后缀 - 占位 */}
      {!readonly && after && (
        <div className={`base-item-after ${React.isValidElement(after) && after.type}`}>
          {after}
        </div>
      )}
      {/* 后缀 - 不占位 */}
      {!readonly && tip && <div className="base-item-tip">{tip}</div>}
    </div>
  );
};

/**
 * 获取表单初始值 (优先取回显的数据,没有则取配置的value)
 */
function getInitialValues(config: BaseFormConfig) {
  const { form, defaultValue } = config;
  const initialValues = propParamToForm(defaultValue || {}, form);
  for (const item of form) {
    if (item.value !== undefined) {
      const prop = getFormItemProp(item);
      if (prop && initialValues[prop] == null) initialValues[prop] = item.value;
    }
  }
  return initialValues;
}

/**
 * 配置化表单
 */
const BaseForm = (props: BaseFormProps) => {
  const config = props.config;

  // 初始值
  const initialValues = getInitialValues(config);

  // 需要监听的字段对象
  const valuesWatchDef: BaseObj = {};
  // 查找指定回调中使用了哪些字段, 用于监听
  function addWatchProps(fn: any) {
    if (typeof fn === 'function') {
      const fuStr = fn.toString();
      // 查找函数中使用了哪些字段, 用于监听
      for (const item of config.form) {
        if ('prop' in item && item.prop) {
          const propArr = getBaseItemProp(item.prop);
          const propKey = propArr.toString(); // 监听整个字段
          for (const prop of propArr) {
            if (fuStr.indexOf(prop) != -1) {
              valuesWatchDef[propKey] = initialValues[propKey];
            }
          }
        }
      }
    }
  }

  // 字段监听
  for (const item of config.form) {
    if ('vif' in item) addWatchProps(item.vif);
    if ('vshow' in item) addWatchProps(item.vshow);
    if ('render' in item) addWatchProps(item.render);
    if ('disabled' in item) addWatchProps(item.disabled);
    if ('before' in item) addWatchProps(item.before);
    if ('after' in item) addWatchProps(item.after);
    if ('tip' in item) addWatchProps(item.tip);
    if ('required' in item) addWatchProps(item.required);
    if ('label' in item) addWatchProps(item.label);
    if ('libParam' in item) addWatchProps(item.libParam);
  }
  const [valuesWatch, setValuesWatch] = useState(valuesWatchDef);
  const formWatch = formToPropParam(valuesWatch, config.form, config.isFilterEmpty);

  // 处理value变化的逻辑 (含render的item)
  const onValuesChange = (changedValues: BaseObj) => {
    for (const key in valuesWatch) {
      if (key in changedValues) {
        if (valuesWatch[key] !== changedValues[key]) {
          valuesWatch[key] = changedValues[key];
          setValuesWatch({ ...valuesWatch });
        }
      }
    }
  };

  // 手动操作的所触发的value变化 (含render的item)
  const handleValuesChange = (changedValues: BaseObj) => {
    // changedValues是组合的prop值 (key是逗号连接的字符串)
    onValuesChange(changedValues);

    // 触发render的item的change事件 (非render的item已经在BaseItem触发了)
    for (const key in changedValues) {
      const renderItem = config.form.find(
        (item) => item.render && 'prop' in item && String(item.prop) === key,
      );

      if (renderItem) {
        emitConfigChange({ item: renderItem, refForm, configForm: config });
      }
    }
  };

  // 当前表单ref
  const refForm = React.createRef<FormInstance>();
  // 父组件通过ref可访问的内容
  const propRef: BaseFormRef = {
    getParam: () => {
      // const form = refForm.current?.getFieldsValue(); // form表单本身有的字段 (无手动设置的额外字段)
      const form = refForm.current?.getFieldsValue(true); // form表单本身有的字段 + 手动设置的额外字段
      const param = formToPropParam(form, config.form, config.isFilterEmpty);
      return param;
    },
    getParamValid: () => {
      return new Promise((resolve, reject) => {
        refForm.current
          ?.validateFields()
          .then((form) => {
            // validateFields的form仅仅是本身存在的字段,不包含手动设置的额外字段
            const newParam = formToPropParam(form, config.form, config.isFilterEmpty);
            resolve(newParam);
          })
          .catch((e) => {
            // 提示第一个异常
            const errors = e?.errorFields?.[0]?.errors;
            if (errors) {
              const msg = errors[0];
              msg && message.error(msg);
            }
            reject(e);
          });
      });
    },
    setParam: (param: BaseObj) => {
      const form = propParamToForm(param, config.form);
      refForm.current?.setFieldsValue(form); // 不会触发form的onValuesChange
      onValuesChange(form); // 手动调用onValuesChange
    },
    reset: () => {
      refForm.current?.resetFields(); // 重置表单
      setValuesWatch(valuesWatchDef); // 重置valuesWatch
    },
  };
  useImperativeHandle(props.refForm, () => propRef);

  const itemRight = config.itemRight ?? defItemRight; // 每个item的右边距
  const itemBottom = config.itemBottom ?? defItemBottom; // 每个item的下边距

  // form样式
  let className = 'base-form';
  className += config.inline ? ' base-form-inline' : ' base-form-block';
  if (config.labelPosition) className += ` label-align-${config.labelPosition}`;
  if (config.labelWidth) className += ` label-width-${config.labelWidth}`;
  if (config.valueWidth) className += ` value-width-${config.valueWidth}`;
  if (config.itemCol) className += ' item-col';
  if (props.className) className += ` ${props.className}`;

  // item样式
  function getItemStyle(item: BaseFormItem) {
    const vshow = typeof item.vshow === 'function' ? item.vshow(formWatch) : item.vshow; // vshow的逻辑
    if (vshow === false) {
      return { display: 'none' };
    }
    const sty: React.CSSProperties = { ...item.sty };
    if (sty.marginRight == null && config.inline) sty.marginRight = itemRight;
    if (sty.marginBottom == null) sty.marginBottom = itemBottom;

    if (item.comp == 'editor') {
      // 当设置flex时,width失效,此时item单独占满一行
      if (config.labelPosition != 'top' && !sty.display) sty.display = 'flex';
    } else if (config.itemCol && sty.display != 'flex') {
      if (sty.width) {
        sty.width = `calc(${sty.width} - ${itemRight}px)`;
      } else {
        const itemCol = config.itemCol; // 一行几个
        sty.width = `calc(${100 / itemCol}% - ${itemRight}px)`;
      }
    }

    // 占一行
    if ((item.comp && ['radio', 'checkbox', 'tabs', 'tags'].includes(item.comp)) || item.render) {
      if (!sty.display) sty.display = 'flex';
    }

    // 减少tabs的间距
    if (item.comp === 'tabs' && !item.sty?.marginBottom) sty.marginBottom = 12;

    return sty;
  }

  return (
    <Form
      ref={refForm}
      className={className}
      style={props.style}
      autoComplete={config.autoComplete}
      layout="inline"
      initialValues={initialValues}
      onValuesChange={handleValuesChange}
      onFinish={config.onFinish}
    >
      {config.form.map((item, index) => {
        // vif的逻辑
        if (item.vif !== undefined) {
          if (typeof item.vif === 'function') {
            if (!item.vif(formWatch)) return null;
          } else if (!item.vif) {
            return null;
          }
        }

        // 标题组件
        if (item.comp == 'title') {
          return <BaseTitle key={item.label} {...item} />;
        }

        // label逻辑
        const isSelectInput = item.comp === 'select-input';
        const label = isSelectInput ? (
          <div style={{ width: 84 }} />
        ) : typeof item.label === 'function' ? (
          item.label(formWatch)
        ) : (
          item.label
        );

        // 冒号
        const colon = isSelectInput ? false : item.colon ?? config.colon;

        // item的字段
        const propKey = getBaseItemProp(item.prop).toString();

        // 支持label配置空串占位
        const isLabelHide = label === '';

        // 自定义校验规则
        const rules = getItemRules(item, formWatch, refForm, config);

        // item的style
        const sty = getItemStyle(item);
        // item的class
        const cls = `${sty.display ? `base-item-${sty.display}` : ''} ${
          sty.width ? `base-item-${sty.width}` : ''
        } ${isLabelHide ? 'base-item-label-hide' : ''}`.trim();

        return (
          <Form.Item
            key={`${label}${propKey || index}`}
            label={isLabelHide ? ' ' : label}
            name={propKey}
            rules={rules}
            style={sty}
            className={cls}
            colon={colon}
          >
            {item.render ? (
              // 自定义组件
              item.render(formWatch) || <div />
            ) : (
              <BaseItem item={item} formWatch={formWatch} refForm={refForm} configForm={config} />
            )}
          </Form.Item>
        );
      })}

      {/* 插槽 */}
      {props.children}
    </Form>
  );
};

// 触发BaseForm和BaseFormItem配置的onChange
function emitConfigChange(option: {
  item: BaseFormItem;
  refForm: React.RefObject<FormInstance<any>>;
  configForm: BaseFormConfig;
  selectItems?: any;
}) {
  const { item, refForm, configForm, selectItems } = option;

  if (configForm.onChange || item.onChange) {
    const form = refForm.current?.getFieldsValue(true);
    const newParam = formToPropParam(form, configForm.form, configForm.isFilterEmpty);
    configForm.onChange?.(newParam, item, selectItems); // BaseForm配置的onChange
    item.onChange?.(newParam, selectItems); // BaseFormItem配置的onChange
  }
}

export default BaseForm;
