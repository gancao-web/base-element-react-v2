# 封装 Lib

适用场景：

- 新增静态枚举
- 接口枚举需要封装成可复用 `lib`
- 级联枚举、动态搜索枚举、结果映射

## 内置枚举

当用户要表达通用二值状态时，先检查并优先复用 `base-element-react` 内置枚举，不要先在业务模块重复新建一份。

```tsx
import {
  BASE_USE, // 正常 / 停用
  BASE_SHOW, // 显示 / 隐藏
  BASE_SUPPORT, // 支持 / 不支持
  BASE_SHELF, // 上架 / 下架
  BASE_OPEN, // 开启 / 关闭
  BASE_YES, // 是 / 否
} from 'base-element-react';
```

优先复用规则：

- 启用、禁用、状态开关类字段，优先看是否能用 `BASE_USE`、`BASE_OPEN`、`BASE_SHOW`、`BASE_SUPPORT`、`BASE_SHELF`、`BASE_YES`。
- 只有当文案、值类型、颜色/tag 表达或业务语义明显不同，才新建业务枚举。
- 如果只是页面显示文案接近，不要机械复用；要先确认后端值是否一致，例如 `1/0`、`true/false`、`Y/N`。

## 静态枚举

```tsx
import { BaseLibItems } from 'base-element-react';

export const EXEC_TYPE: BaseLibItems = [
  { label: '手动启动', value: 2 },
  { label: '定时推送', value: 3 },
];

export const RUN_TYPE: BaseLibItems = [
  { label: '主色', value: 1, color: 'primary' },
  { label: '红色', value: 2, color: 'red' },
  { label: '绿色', value: 3, color: 'green' },
];

export const RUN_TYPE: BaseLibItems = [
  { label: '蓝标签', value: 4, tag: 'blue' },
  { label: '黄标签', value: 5, tag: 'yellow' },
  { label: '灰标签', value: 6, tag: 'gray' },
];
```

## 动态接口枚举

```tsx
import { BaseLibApi } from 'base-element-react';

export const SCENE_LIST: BaseLibApi = {
  label: 'label',
  value: 'id',
  api: '/x/xx',
  param: { xx: 'xx' },
};
```

## 动态参数与结果过滤

```tsx
export const STAFF_LIST: BaseLibApi = {
  label: 'label',
  value: 'id',
  param({ keyword }) {
    return {
      keyword, // 边输入边搜的关键词
      xx: 'xx',
    };
  },
  filterResult(res) {
    return res.list.map((item) => ({
      label: `${item.name} (${item.phone})`, // 支持name和phone前端过滤
      value: item.id,
    }));
  },
};
```

## 自定义 Promise

```tsx
export const DRUG_TAGS: BaseLibApi = {
  api: async () => {
    const res = await requestApi();
    return res.list.map((item) => ({ label: item.name, value: item.id }));
  },
};
```

## 级联枚举

```tsx
import { BaseLibApi, BaseLibApiFn } from 'base-element-react';

/** 级联 (BaseLibApi类型: 一次请求返回所有层级) */
export const BASE_AREAS_ALL: BaseLibApi = {
  label: 'label',
  value: 'value',
  children: 'children',
  api: '/xx/xx',
};

/** 级联 (BaseLibApiFn类型: 逐级加载) */
export const BASE_AREAS: BaseLibApiFn = (item) => {
  return {
    label: 'name',
    value: 'id',
    api: '/xx/xx',
    isLeaf: () => {
      return item.level + 1 == 3; // 显示3级
    },
    param: (param) => {
      return { district_id: param.id }; // 根据id查询下一级
    },
  };
};

/** 级联 (BaseLibApiFn类型: 每级的接口不一样) */
export const BASE_AREAS: BaseLibApiFn = ({ level }) => {
  if (!level) {
    // 一级
    return {
      label: 'name',
      api: 'xxx',
      isLeaf: false,
    };
  } else {
    // 其他级
    return {
      label: 'name',
      api: 'xxx',
      isLeaf: level == 2,
    };
  }
};
```

## 使用建议

- 先查 `base-element-react` 内置枚举；只有内置枚举不匹配时，才到 `lib.ts` 新增业务枚举。
- 枚举都统一定义到每个模块的 `lib.ts`；跨模块复用的枚举，放到`src/common/lib.ts`。
- 枚举名称使用全大写，下划线分割。
