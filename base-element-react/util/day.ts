import type { BaseTime } from '../typing';

/* 将各种不规范的时间转为规范时间 */
export function formatSafeTime(time: BaseTime) {
  if (!time) return time;
  if (typeof time === 'string') {
    if (time.includes('-')) {
      return time.replace(/-/g, '/'); // 兼容iOS
    }
  }
  if (!isNaN(+time)) {
    // isNaN的判断是兼容字符串类型的时间戳, +time是转数字
    if (time.toString().length === 10) {
      return Number(time) * 1000; // 秒->毫秒
    }
  }
  return time;
}

/* 将各种不规范的时间转为规范时间 */
export function formatSafeMoment(time: BaseTime) {
  if (typeof time === 'string') {
    if (time.includes('/')) {
      return time.replace(/\//g, '-'); // Moment必须为'-',而不是'/'
    }
  } else if (typeof time === 'number') {
    if (time.toString().length === 10) {
      return time * 1000; // 秒->毫秒
    }
  }
  return time;
}

/* 获取Date对象 (兼容iOS) */
export function getDate(time: BaseTime) {
  const t = formatSafeTime(time);
  const d = t ? new Date(t) : new Date();
  return d;
}

/* 获取秒数 (兼容iOS) */
export function getSecond(time: BaseTime) {
  return Math.floor(getTime(time) / 1000);
}

/* 获取毫秒数 (兼容iOS) */
export function getTime(time: BaseTime) {
  const d = getDate(time);
  return d.getTime();
}

/* 格式时间, 默认'yyyy-MM-dd hh:mm:ss' */
export function dateFormat(time: BaseTime, fmt = 'yyyy-MM-dd hh:mm:ss') {
  if (!time) return '';
  const date = getDateGMT(time); // 获取中国标准时间
  if (date.toString() === 'Invalid Date') {
    return time.toString(); // 非法时间直接返回原始值
  }
  const o = {
    'M+': date.getMonth() + 1, // 月份
    'd+': date.getDate(), // 日
    'h+': date.getHours(), // 小时
    'm+': date.getMinutes(), // 分
    's+': date.getSeconds(), // 秒
    'q+': Math.floor((date.getMonth() + 3) / 3), // 季度
    S: date.getMilliseconds(), // 毫秒
  };
  if (/(y+)/.test(fmt))
    fmt = fmt.replace(RegExp.$1, `${date.getFullYear()}`.substr(4 - RegExp.$1.length));
  for (const k in o)
    if (new RegExp(`(${k})`).test(fmt))
      fmt = fmt.replace(
        RegExp.$1,
        RegExp.$1.length === 1 ? o[k] : `00${o[k]}`.substr(`${o[k]}`.length),
      );
  return fmt;
}

/* 格式时间: 1583044684000 -> 刚刚,x分钟前,x个小时前,x天前,x个月前 */
export function dateBefore(time: number) {
  const ss = Math.round((Date.now() - time) / 1000);
  const arrr = ['年', '个月', '星期', '天', '小时', '分钟', '秒'];
  const arrn = [31536000, 2592000, 604800, 86400, 3600, 60, 1];
  for (let i = 0; i < arrn.length; i++) {
    const inm = Math.floor(ss / arrn[i]);
    if (inm) return `${inm + arrr[i]}前`;
  }
}

/* 获取指定时间的月初0点时间, 默认本月 */
export function getMouthBeginTime(t: BaseTime) {
  const data: Date = getDate(t);
  data.setDate(1);
  data.setHours(0);
  data.setSeconds(0);
  data.setMinutes(0);
  return data.getTime();
}

/* 获取指定时间的月未23：59：59点时间, 默认本月 */
export function getMouthEndTime(t: BaseTime) {
  const data: Date = getDate(t);
  if (data.getMonth() === 11) {
    data.setMonth(0);
  } else {
    data.setMonth(data.getMonth() + 1);
  }
  data.setDate(1);
  data.setHours(0);
  data.setSeconds(0);
  data.setMinutes(0);
  const end = (Math.floor(data.getTime() / 1000) - 1) * 1000;
  return end;
}

/* 获取中国标准时间 */
export function getDateGMT(time: BaseTime) {
  const t: any = getTime(time); // 本地时间的毫秒数
  const offsetGMT = new Date().getTimezoneOffset(); // 本地时间的时间差，单位为分钟
  const timezone = 8; // 目标时区时间，东八区
  return new Date(t + offsetGMT * 60 * 1000 + timezone * 60 * 60 * 1000);
}

/**
 * 计算两个日期之间的天数
 */
export function getDaysBetween(t1: BaseTime, t2: BaseTime) {
  const diff = getTime(t1) / 1000 - getTime(t2) / 1000;
  if (diff < 0) return 0;
  return Math.ceil(diff / 60 / 60 / 24);
}

/**
 * 获取指定日期的前几天或者后几天的日期
 * @param diff {number} 天数 如：1 后几天 | -1 前几天
 * @param time {string} 指定日期 如：2021-06-21, 默认今天
 * @param fmt {string} 时间格式, 默认'yyyy-MM-dd'
 * @returns {string}
 */
export function getDiffDate(diff: number, time: BaseTime = new Date(), fmt = 'yyyy-MM-dd') {
  const d = getDate(time);
  const day = d.getDate();
  d.setDate(day + diff);
  return dateFormat(d, fmt);
}

/* 前几天或后几天的日期数组. diff>0后几天, diff<0前几天 */
export function getDiffDateArr(diff: number, format?: 'daterange' | 'daterangefull') {
  const date0 = getDiffDate(0);
  const dateDiff = getDiffDate(diff);
  const arr = diff > 0 ? [date0, dateDiff] : [dateDiff, date0];
  if (format === 'daterangefull') {
    arr[0] += ' 00:00:00';
    arr[1] += ' 23:59:59';
  }
  return arr;
}
