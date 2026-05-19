# 创建页面

- 新建列表页、CRUD 页、搜索页

## 首选组件

- CRUD 页优先用 `BasePage`
- 纯表单用 `BaseForm`
- 纯表格用 `BaseTable`

## BasePage 基础模板

```tsx
import { useRef } from 'react';
import { BasePage, type BasePageConfig, type BasePageRef } from 'base-element-react';
import { STATUS_LIST } from '@/common/lib';
import { apiSearch, apiDelete, apiExport } from './api';

export default () => {
  const refPage = useRef<BasePageRef>();

  const config: BasePageConfig = {
    form: [
      { label: '关键词', prop: 'kw' },
      { label: '状态', prop: 'status', comp: 'select', lib: STATUS_LIST },
      { label: '日期', prop: ['start_dt', 'end_dt'], comp: 'picker-date' },
    ],
    btns: [
      { label: '新增', dialog: dialogEdit },
      { label: '导出', api: (ctx) => apiExport(ctx.form) },
      { label: '批量删除', click: ({ selectedRowKeys }) => apiDelete(selectedRowKeys) },
    ],
    rowKey: 'id',
    table: [
      { label: '全选', type: 'checkbox' },
      { label: 'ID', prop: 'id' },
      { label: '名称', prop: 'name' },
      { label: '状态', prop: 'status', lib: STATUS_LIST },
      {
        label: '操作',
        width: 200,
        btns: [
          { label: '编辑', dialog: dialogEdit },
          { label: '删除', api: apiDelete },
        ],
      },
    ],
    apiSearch,
  };

  return <BasePage refPage={refPage} config={config} />;
};
```

## BasePageRef 常用方法

```tsx
refPage.current?.getParam();
refPage.current?.getParamValid();
refPage.current?.setParam({ kw: 'test' });
refPage.current?.refresh();
refPage.current?.reload();
refPage.current?.reset();
refPage.current?.openDialog(dialog, '标题', row);
refPage.current?.closeDialog();
```

## 页面搭建顺序

1. 先确定搜索参数结构和 `apiSearch` 入参。
2. 再定义按钮栏和分页表格。
3. 最后接入新增/编辑/详情弹窗。

## 约束

- 搜索、表格、弹窗尽量共用同一模块目录下的 `api.ts`、`lib.ts` 和 `dialog/`。
- 优先把页面保持成配置驱动；只有配置无法表达的部分再写自定义 `render`。
