# 表格配置

适用场景：

- 配置列表列
- 配置操作列
- 格式化状态、时间、备注等展示

## 基础表格列

```tsx
const config: BaseTableConfig = {
  rowKey: 'id',
  table: [
    { label: '选择', type: 'checkbox' },
    { label: 'ID', prop: 'id', width: 80 },
    { label: '名称', prop: 'name' },
    { label: '状态', prop: 'status', lib: STATUS_LIST },
    { label: '时间', prop: 'create_time', format: 'datetime' },
    { label: '备注', prop: 'remark', ellipsis: true },
  ],
  list: [],
};
```

## 列配置

```tsx
{
  label: '列名',
  prop: 'field',
  width: 120,
  fixed: 'left',
  align: 'center',
  lib: STATUS_LIST,
  format: 'datetime',
  ellipsis: true,
  copyable: true,
  render: (row, index) => <div>{row.name}</div>,
}
```

## 操作按钮

```tsx
{
  label: '操作',
  width: 200,
  btns: [
    { label: '编辑', dialog: dialogEdit },
    { label: '删除', api: apiDelete },
    { vif: (row) => row.status == 0, label: '启动', api: apiStart },
    {
      icon: 'more',
      more: [
        { label: '详情', dialog: dialogDetail },
        { label: '复制', click: (row) => {} },
      ],
    },
  ],
}
```

## 使用建议

- 状态值优先通过 `lib` 统一映射，不要在每列重复写判断。
- 文本截断、时间格式化、复制能力优先走列配置，不先写自定义 `render`。
- 操作列的弹窗、接口、权限判断尽量保持配置化。
