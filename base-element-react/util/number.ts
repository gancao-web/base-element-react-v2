/**
 * 真正的数字字符串转number (过滤空和非数字的NAN)
 */
export function toNumber(value: any) {
  return value && !isNaN(value) ? Number(value) : value;
}

/* 四舍五入保留2位小数 */
export function toFixed(n: number | string, m = 2) {
  return Number(n || 0).toFixed(m);
}

/* 数字转千分位 */
export function toThousandth(str: number | string) {
  return str.toString().replace(/\d{1,3}(?=(\d{3})+$)/g, (s: string) => {
    return `${s},`;
  });
}
