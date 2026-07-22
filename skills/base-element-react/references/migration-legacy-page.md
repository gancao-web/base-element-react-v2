# 旧版页面迁移到新版 base-element-react

适用场景：

- 用户明确说明某个目录是 `base-element-react` 旧版本写法
- 需要参考现有新页面模块，把旧页面迁移成统一的新结构
- 常见于 `page/pageModal/service/Post` 风格迁移到 `BasePage config + dialog + api.ts`

## 迁移目标

- 页面结构统一成 `index.tsx + api.ts + lib.ts + dialog/`
- 页面主体改用 `BasePage` + `config`
- 弹窗从旧的 `pageAdd/pageEdit/pageModal` 改成 `dialog/*.tsx`
- 接口从 `service.ts + Post` 改成 `api.ts + requestApi`
- 枚举、下拉、级联等配置优先收口到 `lib.ts`

## 推荐目录结构

```tsx
src/pages/xxx/module/
  api.ts
  lib.ts
  index.tsx
  dialog/
    edit.tsx
    add.tsx
```

说明：

- `api.ts` 放当前模块全部接口
- `lib.ts` 放 `BaseLibApi`、静态枚举、状态映射
- `dialog/` 放新增、编辑、详情等弹窗
- `index.tsx` 尽量只保留页面配置和少量交互逻辑

## 常见旧版 -> 新版对照

### 1. 列表页

旧版：

- `BasePage page={pageList}`
- 类型常见为 `PageListConfig`
- 配置里常出现 `page: pageAdd`

新版：

- `BasePage config={config}`
- 类型改为 `BasePageConfig`
- 弹窗入口改为 `dialog: dialogEdit`

示例：

```tsx
const config: BasePageConfig = {
  btns: [{ label: '新增', dialog: dialogAdd }],
  table: [
    {
      label: '操作',
      btns: [{ label: '编辑', dialog: dialogEdit }],
    },
  ],
  apiSearch,
};

return <BasePage refPage={refPage} config={config} />;
```

### 2. 弹窗页

旧版：

- `add.tsx / edit.tsx`
- 返回 `PageModalConfig`
- 配置项常见 `apiInsert`、`apiUpdate`、`filterParam`

新版：

- 迁入 `dialog/`
- 返回 `BaseDialogConfig`
- 统一用 `apiSubmit`
- 新增/编辑通过 `isEdit` 或不同 dialog 文件区分

示例：

```tsx
const dialog: BaseDialog = ({ row, isEdit }): BaseDialogConfig => {
  return {
    form: [{ label: '名称', prop: 'name', required: true }],
    apiSubmit(form) {
      return isEdit ? apiUpdate({ id: row.id, ...form }) : apiInsert(form);
    },
  };
};
```

### 3. 接口层

旧版：

- `service.ts`
- `Post('', data)`

新版：

- `api.ts`
- `requestApi({ data })`

示例：

```tsx
import { requestApi } from '@/common/request';

export function apiDelete(param: any) {
  return requestApi('', {
    ...param,
    package: 'demo.package',
    class: 'DELETE_ITEM',
  });
}
```

## 迁移步骤

1. 先找一个同仓库里的新模块做参考，优先复用它的目录和命名风格。
2. 把旧 `service.ts` 改成 `api.ts`，统一替换为 `requestApi`。
3. 把旧 `add/edit/detail` 改到 `dialog/` 目录。
4. 把 `page={pageList}` 改成 `config={config}`，类型改成 `BasePageConfig`。
5. 把 `page: xxx` 改成 `dialog: xxx`。
6. 把散落在页面内的枚举和接口下拉提到 `lib.ts`。
7. 检查旧版钩子是否还能直接用，不能用就收口到 `apiSearch`、`render` 或 `apiSubmit` 中。
8. 最后运行 `tsc --noEmit` 做静态校验。

## 迁移时的重点判断

### 1. 能否直接使用标准 `BaseLibApi`

优先用标准 lib，不要多包一层函数。

推荐：

```tsx
export const SCENE_LIST: BaseLibApi = {
  label: 's_name',
  value: 'scene_id',
  param: {
    package: 'igc_biz.cms.manage.pull',
    class: 'GET_SCRNE_LIST',
  },
};
```

如果全局已经配置了：

```tsx
BaseElement.use({
  http: requestApi,
});
```

则 `BaseLibApi` 可以直接通过 `param` 发请求，不必额外写 `apiSceneList`。

### 2. 默认选中第一个下拉项

旧版常见做法是 `onLibInit + setParam + refresh`。

新版优先改成：

```tsx
{
  comp: 'select',
  lib: SCENE_LIST,
  defaultIndex: 0,
}
```

这样更标准，也更少副作用。

### 3. 旧版过滤钩子是否兼容

旧版页面里常有：

- `filterParam`
- `filterRow`

新版当前类型未必支持这些字段，迁移时不要直接照搬。

建议改法：

- 请求前拦截逻辑放进 `apiSearch`
- 行数据格式化放进 `apiSearch` 返回值处理，或列的 `render`

示例：

```tsx
export async function apiSearch(param: any) {
  if (!param.scene_id) return false;

  const res: any = await requestApi({ data });
  return {
    ...res,
    list: (res.list || []).map((item: any) => ({
      ...item,
      path_name: item.path_name?.replace(/,/g, ' / '),
    })),
  };
}
```

## 推荐编码风格

- 有结果加工的接口优先使用 `async/await`
- 纯透传接口保留普通函数即可
- 页面里尽量只留 `config`
- 复用逻辑优先抽到 `api.ts`、`lib.ts`、`dialog/`

## cms/category 迁移示例结论

这类旧页面迁移后，最终通常会整理成：

- `api.ts` 负责增删改查和结果二次处理
- `lib.ts` 负责 `SCENE_LIST` 这类标准接口枚举
- `dialog/add.tsx`、`dialog/addChild.tsx`、`dialog/edit.tsx` 负责弹窗
- `index.tsx` 仅保留 `BasePageConfig`

## 自检清单

- 是否已删除旧的 `service.ts`
- 是否已删除旧的 `add.tsx/edit.tsx` 页面弹窗文件
- 是否统一为 `api.ts`
- 是否统一为 `dialog/`
- 是否把 `page=` 改成了 `config=`
- 是否把 `page: xxx` 改成了 `dialog: xxx`
- 是否优先使用 `BaseLibApi`
- 是否避免继续使用不兼容的旧钩子
- 是否执行了 `tsc --noEmit`
