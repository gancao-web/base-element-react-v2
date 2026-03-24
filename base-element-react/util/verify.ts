/* 非空判断(含空对象,空数组) */
export function isEmpty(val: any, allowZero: boolean) {
  if (allowZero && val === 0) return false; // 是否允许输入0, 默认不允许
  if (!val) {
    // null, undefined, 0, ""
    return true;
  } else {
    if (typeof val == 'string' && val.indexOf('[') == 0) {
      // 数组字符串
      val = JSON.parse(val);
    }
    if (Array.isArray(val)) {
      // []
      if (val.length === 0) {
        return true;
      } else {
        // [null,""]
        for (const item of val) {
          if (item === null || item === '') {
            return true;
          }
        }
        return false;
      }
    } else if (typeof val === 'object' && Object.keys(val).length === 0) {
      return true;
    } else {
      return false;
    }
  }
}

/* 手机号验证 */
export function isPhone(val: string) {
  return /^1[2|3|4|5|6|7|8|9]\d{9}$/.test(val);
}

/* 身份证宽松验证(大陆18位,台湾8位或18位,香港澳门11位) */
export function isIDCard(val: string) {
  const card = val.replace(/[-\s]/g, ''); // 移除 "-" 和空格
  const regex = /^[A-Za-z0-9()]{8,18}$/;
  return regex.test(card);
}

/* 链接校验规则 */
export function isUrl(url: string) {
  return url.indexOf('http') == 0;
}

/* 税号验证 */
export function isTax(val: string) {
  return /^[A-Z0-9]{15}$|^[A-Z0-9]{17}$|^[A-Z0-9]{18}$|^[A-Z0-9]{20}$/.test(val);
}
