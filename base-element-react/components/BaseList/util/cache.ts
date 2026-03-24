import type { BaseListTableItem } from '../typing';
import type { CheckboxValueType } from 'antd/es/checkbox/Group';

/** 所有表格列缓存的显示状态 */
const KEY_COLUMN_CACHE = 'baselist_cache_column';

/** 获取所有表格列缓存的map */
function getCacheColumnMap() {
  const str = localStorage.getItem(KEY_COLUMN_CACHE) || '{}';
  const map: Record<string, CheckboxValueType[]> = JSON.parse(str);

  return map;
}

/** 获取指定表格列缓存的key */
function getCacheColumnKey(table: BaseListTableItem[]) {
  const pathname =
    window.location.pathname === '/'
      ? window.location.hash.slice(1) || '/'
      : window.location.pathname;

  const tableProps = table.reduce((prv, cur) => `${prv},${cur.prop || ''}`, '');

  return `${pathname}${tableProps}`;
}

/** 获取指定表格的列缓存 */
export function getCacheColumns(table?: BaseListTableItem[]) {
  if (!table) return undefined;

  const key = getCacheColumnKey(table);
  const map = getCacheColumnMap();

  return map[key];
}

/** 设置指定表格的列缓存 */
export function setCacheColumns(table: BaseListTableItem[], column: CheckboxValueType[]) {
  const key = getCacheColumnKey(table);
  const map = getCacheColumnMap();

  map[key] = column;

  localStorage.setItem(KEY_COLUMN_CACHE, JSON.stringify(map));
}
