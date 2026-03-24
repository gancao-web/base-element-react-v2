/**
 * 生成UUID
 */
export function createUUID() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0,
      v = c == 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

/**
 * 拼接className
 */
export function cls(...classes: (string | boolean | undefined)[]): string {
  return classes.filter(Boolean).join(' ');
}
