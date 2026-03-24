import { Input } from 'antd';
import type { BaseInputProps } from './typing';

/**
 * 输入框 - 支持边输入边校验
 */
const BaseInput = (props: BaseInputProps) => {
  const { placeholder = '请输入', min = 0, max = Number.MAX_SAFE_INTEGER, isEnterBlur } = props;

  // 输入校验
  let oldVal = props.value || ''; // 记录本次输入的值 (需空字符串兜底,避免抛出undefined导致oldVal限制失效,如max:5,仍能直接输入6)
  function onChange(e: any) {
    let val = e.target.value;
    const type = props.type;
    if (val) {
      if (!type || type === 'text') {
        // 不限
      } else if (type === 'num') {
        // 整数
        if (min < 0) {
          val = val.replace(/[^\d-]/g, ''); // 清除数字,负号以外的字符 (支持负数)
        } else {
          val = val.replace(/[^\d]/g, ''); // 清除数字以外的字符 (不支持负数)
        }
        if (val && !isNaN(val)) {
          val = parseInt(val);
          if (val > max || (min <= 0 && val < min)) val = oldVal; // 大于0的最小值在onBlur判断,否则输入不进去
        }
      } else if (type === 'digit') {
        // 两位小数
        val = val.replace('。', '.'); // 兼容中文输入的情况 (避免mac中文状态下,无法输入小数)
        if (min < 0) {
          val = val.replace(/[^\d.-]/g, ''); // 清除数字,小数点,负号以外的字符 (支持负数)
        } else {
          val = val.replace(/[^\d.]/g, ''); // 清除数字,小数点以外的字符 (不支持负数)
        }
        const digitLen = props.digit || 2; // 小数位数
        const reg = new RegExp(`^(-)*(\\d+)\\.(\\d{${digitLen}}).*$`);
        val = val
          .replace(/\.{2,}/g, '.')
          .replace('.', '$#$')
          .replace(/\./g, '')
          .replace('$#$', '.') // 只保留第一个小数点
          .replace(reg, '$1$2.$3'); // 最多输入digit位小数
        if (val) {
          if (val == '.') val = '0.';
          if (val == '-.') val = '-0.';
          if (!isNaN(val)) {
            if (val.indexOf('.') == -1 && val !== '-0') val = parseFloat(val);
            if (val > max || (min <= 0 && val < min)) val = oldVal; // 大于0的最小值在onBlur判断,否则输入不进去
          }
        }
      } else if (type === 'phone') {
        // 手机号
        val = `1${val.substr(1)}`; // 必须为1开头
        val = val.replace(/[^0-9]/g, ''); // 只能输入数字
      } else if (type === 'tel') {
        // 座机: 数字和"-"
        val = val.replace(/[^\d\-\d]/g, '');
      } else if (type === 'idcard') {
        // 身份证号: 只能输入数字和大写 (港澳台身份证带字母+括号+中横线)
        val = val
          .toUpperCase()
          .replace('（', '(')
          .replace('）', ')')
          .replace(/[^0-9A-Z()]/g, '');
      } else if (type === 'en') {
        // 英文 (允许空格)
        val = val.replace(/[^a-zA-Z ]/g, '');
      } else if (type === 'en_num') {
        // 英文+数字 (允许空格)
        val = val.replace(/[^0-9a-zA-Z ]/g, '');
      } else if (type === 'bank_card') {
        // 银行卡
        val = val.replace(/[^\d]/g, '');
      } else if (type === 'tax') {
        // 税号 (20位数字+大写字母)
        val = val.replace(/[^0-9a-zA-Z]/g, '').toUpperCase();
      }
      // 自定义正则
      if (props.pattern) val = props.pattern(val);
    }
    oldVal = val; // 记录本次输入的值
    props.onChange && props.onChange(val); // 派发输入的值
  }

  function onBlur(e: any) {
    let val = e.target.value;
    if (val) {
      const type = props.type;
      // 中文限制在mac系统不可在input中实时处理,否则无法输入,只能在onBlur限制
      let newVal = val;
      if (type == 'zh') {
        // 中文 (允许空格)
        newVal = val.replace(/[^\u4E00-\u9FA5 ]/g, '');
      } else if (type == 'zh_en_num') {
        // 中文+字母+数字 (允许空格)
        newVal = val.replace(/[^0-9a-zA-Z\u4e00-\u9fa5 ]/g, '');
      } else if (type == 'num' || type == 'digit') {
        // 整数,小数 转为 Number类型
        if (!isNaN(val)) {
          newVal = parseFloat(val);
          if (newVal < min) newVal = min; // 大于0的最小值在onBlur判断,否则输入不进去
        }
      }
      // 自定义正则
      if (props.pattern) val = props.pattern(val);
      // 更新
      if (val != newVal) {
        val = newVal;
        props.onChange && props.onChange(val); // 派发输入的值
      }
    }
    props.onBlur && props.onBlur(val);
  }

  function onPressEnter(e: any) {
    props.onPressEnter && props.onPressEnter(e.target.value);
    isEnterBlur && e.currentTarget.blur();
  }

  // 粘贴的时候去空格(解决复制table文本出现多余空格或换行)
  function onPaste(e: any) {
    e.preventDefault();
    const text = e.clipboardData.getData('text/plain').trim();
    // document.execCommand('insertText', false, text); // 过时api,采用以下方式兼容
    const start = e.target.selectionStart;
    const end = e.target.selectionEnd;
    const newValue = e.target.value.slice(0, start) + text + e.target.value.slice(end);
    e.target.value = newValue;
    e.target.selectionStart = e.target.selectionEnd = start + text.length;
    onChange({ target: { value: newValue } });
  }

  // 最大长度
  function getMaxLength() {
    if (props.maxLength === -1) return undefined; // -1代表不限制
    if (props.maxLength) return props.maxLength;
    switch (props.type) {
      case 'phone':
        return 11;
      case 'tel':
        return 13;
      case 'idcard':
        return 18;
      case 'bank_card':
        return 19;
      case 'tax':
        return 20;
      default:
        return 500;
    }
  }

  // 基础属性
  const baseProps = {
    style: props.style,
    className: `base-input ${props.className || ''}`.trim(),
    value: props.value,
    defaultValue: props.defaultValue,
    disabled: props.disabled,
    bordered: props.bordered,
    name: props.name,
    autoComplete: props.autoComplete,
    addonBefore: props.addonBefore,
    addonAfter: props.addonAfter,
    placeholder,
    onChange,
    onBlur,
    onPaste,
    onPressEnter,
    maxLength: getMaxLength(),
    showCount: ![-1, undefined].includes(props.maxLength),
    allowClear: props.clearable != false,
  };

  const render = () => {
    const { readonly, type } = props;

    if (readonly) {
      return (
        <div className={props.className} style={props.style}>
          <div style={{ padding: '4px 0', whiteSpace: 'pre-wrap' }}>{props.value}</div>
        </div>
      );
    }

    if (type === 'textarea') {
      return (
        // 当showCount不显示的时候,base-textarea的样式将不在根元素,此处套一个div写className="base-textarea"
        <div className="base-textarea">
          <Input.TextArea
            {...baseProps}
            autoSize={{ minRows: props.minRows || 4, maxRows: 12 }}
            showCount={props.maxLength !== -1}
          />
        </div>
      );
    }

    if (type === 'password') {
      return <Input.Password {...baseProps} />;
    }

    return <Input {...baseProps} />;
  };

  return render();
};

export default BaseInput;
