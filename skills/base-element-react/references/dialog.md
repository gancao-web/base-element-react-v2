# 创建弹窗

适用场景：

- 新建新增、编辑、详情、复制等弹窗
- 需要 `BaseDialog`、`BaseDialogConfig`、`beforeOpen`、自定义 `render`

## 基础弹窗

```tsx
import type { BaseDialog, BaseDialogConfig } from 'base-element-react';

const dialog: BaseDialog = ({ isEdit }): BaseDialogConfig => {
  return {
    // width: 960, // 默认 750；内容较多时再放大
    // drawer: true, // 默认 false；表单项较多时可改抽屉
    // title: isEdit ? '编辑' : '新增', // 默认取触发按钮文本
    form: [
      { label: '名称', prop: 'name', required: true, disabled: isEdit },
      { label: '状态', prop: 'status', comp: 'radio', lib: STATUS_LIST, required: true },
    ],
    apiDetail: (form) => apiDetail(form),
    apiSubmit: isEdit ? apiUpdate : apiInsert,
  };
};

export default dialog;
```

## 弹窗额外传参

```tsx
type DiyCtx = { isCopy?: boolean };

const dialog: BaseDialog<DiyCtx> = ({ isCopy }): BaseDialogConfig => {
  return {
    title: isCopy ? '复制' : '编辑',
  };
};

btns: [{ label: '复制', dialog: (ctx) => dialogEdit({ ...ctx, isCopy: true }) }];
```

## 初始化异步公用数据

- 方式 1: 采用 `beforeOpen`

```tsx
const dialog: BaseDialog = (): BaseDialogConfig => {
  const data = {
    flowItems: [] as BaseLibItems,
  };

  return {
    beforeOpen: async () => {
      const res = await apiGetFlow();
      data.flowItems = res.list.map((item) => ({ label: item.name, value: item.id }));
    },
    form: [
      {
        label: '流程1',
        prop: 'flow_id1',
        comp: 'select',
        lib: data.flowItems,
      },
      {
        label: '流程2',
        prop: 'flow_id2',
        comp: 'select',
        lib: data.flowItems,
      },
    ],
  };
};
```

- 方式 2: 从 2.5.88 版本开始，推荐使用 `BaseDialog` 的 promise 实现

```tsx
const dialog: BaseDialog = async () => {
  const res = await apiGetFlow();
  const flowItems: BaseLibItems = res.list.map((item) => ({ label: item.name, value: item.id }));

  return {
    form: [
      {
        label: '流程1',
        prop: 'flow_id1',
        comp: 'select',
        lib: data.flowItems,
      },
      {
        label: '流程2',
        prop: 'flow_id2',
        comp: 'select',
        lib: data.flowItems,
      },
    ],
  };
};
```

## 自定义弹窗内容

```tsx
import type { BaseDialogContext } from 'base-element-react';

const DialogContent = ({ refPage, row, selectedRowKeys }: BaseDialogContext) => {
  refPage.setDialogSubmit(() => {
    // TODO 弹窗提交按钮的逻辑...
    message.success('操作成功');
    refPage.closeDialog();
    refPage.refresh();
  });

  return <div>自定义内容</div>;
};

const dialog: BaseDialog = (ctx): BaseDialogConfig => {
  return {
    render: <DialogContent {...ctx} />,
  };
};
```

## 使用建议

- 标准增删改弹窗优先走 `form + apiDetail + apiSubmit`。
- 只有配置无法表达时，再使用自定义 `render`。
- 弹窗文件统一放 `dialog/` 目录，导入名以 `dialog` 开头。
