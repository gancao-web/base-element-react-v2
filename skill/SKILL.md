---
name: 'base-element-react-v2'
description: '基于 React + Ant Design 的 JSON 配置化组件库，快速构建表单、表格、弹窗、CRUD页面'
---

## 核心组件

```tsx
import {
  BaseForm, // 表单
  BaseTable, // 表格
  BaseList, // 列表(表单搜索+按钮栏+分页表格)
  BasePage, // 页面(列表+弹窗)
} from 'base-element-react';
```

## 一、枚举配置

### 1. 静态枚举

```tsx
import { BaseLibItems } from 'base-element-react';
export const STATUS_LIST: BaseLibItems = [
  { label: '正常', value: 1, color: 'green' },
  { label: '停用', value: 0, color: 'red' },
];
```

### 2. 动态接口枚举

```tsx
import { BaseLibApi, BaseLibItems } from 'base-element-react';

/** 接口枚举 */
export const SCENE_LIST: BaseLibApi = {
  label: 'xname', // 取label的字段
  value: 'xid', // 取value的字段
  api: '/x/xx', // 接口
  param: { xx: 1 }, // 参数
};

/** 动态参数 + 结果过滤 */
export const STAFF_LIST: BaseLibApi = {
  label: 'label',
  param({ keyword }) {
    return {
      keyword, // 边输入边搜索
      package: 'xx',
      class: 'xx',
    };
  },
  filterResult(res) {
    return res.list.map((item) => ({
      label: `${item.name} (${item.phone})`,
      value: item.id,
    }));
  },
};

/** 自定义Promise */
export const DRUG_TAGS: BaseLibApi = {
  api: async () => {
    const res = await requestApi();
    return res.list.map((item) => ({ label: item.name, value: item.id }));
  },
};
```

### 3. 级联枚举

```tsx
import { BaseLibApi, BaseLibApiFn } from 'base-element-react';

/** 一次性返回所有层级 */
export const AREAS_ALL: BaseLibApi = {
  label: 'label',
  value: 'value',
  children: 'children',
  api: '/x/xx',
};

/** 逐级加载 */
export const AREAS_LAZY: BaseLibApiFn = (item) => {
  return {
    label: 'name',
    value: 'id',
    api: '/x/xx',
    isLeaf: () => item.level + 1 == 3,
    param: (p) => ({ id: p.id }),
  };
};
```

## 二、表单配置

### 基础表单项

```tsx
const config: BaseFormConfig = {
  form: [
    { label: '文本', prop: 'name' },
    { label: '手机', prop: 'phone', type: 'phone' },
    { label: '小数', prop: 'money', type: 'digit' },
    { label: '整数', prop: 'count', type: 'num', min: 0, max: 100 },
    { label: '多行文本', prop: 'remark', type: 'textarea', maxLength: 200 },
    { label: '下拉选择', prop: 'status', comp: 'select', lib: STATUS_LIST },
    { label: '单选', prop: 'type', comp: 'radio', lib: TYPE_LIST, value: 1 },
    { label: '复选', prop: 'tags', comp: 'checkbox', lib: TAG_LIST },
    { label: '级联', prop: 'area', comp: 'cascader', lib: BASE_AREAS },
    { label: '日期', prop: 'date', comp: 'picker-date' },
    { label: '日期范围', prop: ['start_dt', 'end_dt'], comp: 'picker-date' },
    { label: '日期时间', prop: 'datetime', comp: 'picker-date', type: 'datetime' },
    { label: '上传图片', prop: 'images', comp: 'upload', max: 5 },
    { label: '上传文件', prop: 'file', comp: 'upload', accept: 'pdf' },
    { label: '开关', prop: 'enabled', comp: 'switch', lib: BASE_YES, value: true },
  ],
};
```

### 表单项公共配置

```tsx
{
  label: '姓名',
  prop: 'name',
  required: true,
  value: '默认值',
  style: { width: '200px' },
  vif: (form) => form.type == 1,
  vshow: (form) => form.show,
  disabled: true,
  before: '前缀(占位)',
  after: '后缀(占位)',
  tip: '提示(不占位)',
  onChange: (form, selectItems) => {},
  render: (form) => <CustomComp />,
}
```

### 多个表单项一行

```tsx
form: [
  {
    label: '制作费',
    before: '小于等于1kg',
    prop: 'money_1',
    type: 'digit',
    after: '元',
    sty: { width: 'auto' },
    style: { width: '80px' },
  },
  {
    before: '大于1kg',
    prop: 'money_2',
    type: 'digit',
    after: '元/100g',
    sty: { width: 'auto' },
    style: { width: '80px' },
  },
],
```

### 下拉框和输入框组合

```tsx
// 方法一: select-input组件
{
  prop: [
    { label: '医生姓名', value: 'doctor_name' },
    { label: '医生手机', value: 'doctor_phone' },
  ],
  comp: 'select-input',
},

// 方法二: 设置两个组件的宽度
{
  prop: 'type',
  comp: 'select',
  lib: TYPE_LIST,
  sty: { width: '100px', marginRight: '-1px' },
},
{ prop: 'keyword', sty: { width: '221px' } },
```

### 自定义表单项

```tsx
import { BaseFormItemProps } from 'base-element-react';

const CustomComp = (props: BaseFormItemProps) => {
  const {value, onChange} = props;

  const handleChange = (newValue) => {
    onChange?.(newValue);
  };

  return (
    <div>
      <Xxx value={value} onChange={handleChange} />
    </div>
  );
};

// 使用
{
  label: '自定义表单项',
  prop: 'custom',
  render: () => <CustomComp />,
}
```

## 三、表格配置

### 基础表格列

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

### 表格列配置

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

### 操作按钮

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

## 四、列表页面

```tsx
import { useRef } from 'react';
import { BasePage, type BasePageConfig, type BasePageRef } from 'base-element-react';
import { STATUS_LIST } from '@/common/lib';

export default () => {
  const refPage = useRef<BasePageRef>();

  const config: BasePageConfig = {
    // 搜索栏
    form: [
      { label: '关键词', prop: 'kw' },
      { label: '状态', prop: 'status', comp: 'select', lib: STATUS_LIST },
      { label: '日期', prop: ['start_dt', 'end_dt'], comp: 'picker-date' },
    ],

    // 按钮栏
    btns: [
      { label: '新增', dialog: dialogEdit },
      { label: '导出', api: apiExport },
    ],

    // 分页表格
    rowKey: 'id',
    table: [
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

    // 搜索接口
    apiSearch,
  };

  return <BasePage refPage={refPage} config={config} />;
};
```

### BasePageRef 方法

```tsx
refPage.current?.getParam(); // 获取搜索参数(不校验)
refPage.current?.getParamValid(); // 获取搜索参数(校验)
refPage.current?.setParam({ kw: 'test' }); // 设置搜索参数
refPage.current?.refresh(); // 刷新(保持页码)
refPage.current?.reload(); // 刷新(重置页码)
refPage.current?.reset(); // 重置(清空参数和页码)
refPage.current?.openDialog(dialog, '标题', row); // 手动打开弹窗
refPage.current?.closeDialog(); // 关闭弹窗
```

## 五、弹窗配置

### 基础弹窗

```tsx
import type { BaseDialog, BaseDialogConfig } from 'base-element-react';

const dialog: BaseDialog = (ctx): BaseDialogConfig => {
  const { isEdit, row } = ctx;

  return {
    title: isEdit ? '编辑' : '新增',

    // 表单配置
    form: [
      { label: '名称', prop: 'name', required: true, disabled: isEdit },
      { label: '状态', prop: 'status', comp: 'radio', lib: STATUS_LIST, required: true },
    ],

    // 详情接口
    apiDetail: (form) => {
      return apiDetail(form);
    },

    // 提交接口
    apiSubmit: (form) => {
      return isEdit ? apiUpdate(form) : apiInsert(form);
    },
  };
};

export default dialog;
```

### 弹窗额外传参

```tsx
type DiyCtx = { isCopy?: boolean; readonly?: boolean };

const dialog: BaseDialog<DiyCtx> = (ctx): BaseDialogConfig => {
  const { isCopy, readonly } = ctx;
  return {
    title: isCopy ? '复制' : '编辑',
    // ...
  };
};

// 调用
btns: [
  { label: '复制', dialog: (ctx) => dialogEdit({ ...ctx, isCopy: true }) },
],
```

### 弹窗初始化异步数据

```tsx
const dialog: BaseDialog = (): BaseDialogConfig => {
  const data = {
    flowItems: [] as BaseLibItems,
  };

  return {
    beforeOpen: async () => {
      const res = await apiGetFlow();
      data.flowItems = res.list.map((item) => ({
        label: item.name,
        value: item.id,
      }));
    },
    form: [
      {
        label: '流程',
        prop: 'flow_id',
        comp: 'select',
        lib: data.flowItems,
      },
    ],
  };
};
```

### 自定义弹窗内容

```tsx
import type { BaseDialogContext } from 'base-element-react';

const DialogContent = ({ refPage, row }: BaseDialogContext) => {
  refPage.setDialogSubmit(() => {
    // ...
    // 关闭弹窗并刷新列表
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

## 六、表单联动

```tsx
form: [
  {
    label: '所属企业',
    prop: 'enterpriseNo',
    comp: 'select',
    lib: ENTERPRISE_LIST,
    onChange() {
      refDialog.current?.setParam({ productNos: '' }); // 清空关联字段,重新选择
    },
  },
  {
    label: '关联产品',
    prop: 'productNos',
    comp: 'select',
    lib: PRODUCT_LIST,
    libParam: (form) => ({ enterpriseNo: form.enterpriseNo }), // 监听依赖字段的变化,重新加载枚举
  },
],
```

## 七、校验规则

```tsx
{
  label: '手机号',
  prop: 'phone',
  type: 'phone', // 可设置类型约束
  required: true, // 可设置必填
  min: 11, // 可设置最小长度
  max: 11, // 可设置最大长度
  rules: [
    {
      validator: (form, value) => {
        // 可自定义校验规则
        if (value && !/^1\d{10}$/.test(value)) {
          return Promise.reject('手机号格式不正确');
        }
        return Promise.resolve();
      },
    },
  ],
}
```

## 八、输入类型

```tsx
type: 'num'; // 整数
type: 'digit'; // 两位小数
type: 'phone'; // 手机号
type: 'tel'; // 座机
type: 'idcard'; // 身份证
type: 'bank_card'; // 银行卡
type: 'zh'; // 中文
type: 'en'; // 英文
type: 'en_num'; // 英文+数字
type: 'zh_en_num'; // 中英文数字
type: 'http'; // 链接
type: 'tax'; // 税号
type: 'textarea'; // 多行文本
type: 'password'; // 密码
```

## 九、颜色系统

```tsx
type BaseColor = 'primary' | 'red' | 'green' | 'blue' | 'yellow' | 'gray' | string;

// 枚举使用
{ label: '成功', value: 1, color: 'green' }
{ label: '失败', value: 0, color: 'red' }
{ label: '警告', value: 2, color: 'yellow' }

// 标签样式
{ label: '正常', value: 1, tag: 'green' }
{ label: '停用', value: 0, tag: 'red' }

// 小圆点
{ label: '在线', value: 1, dot: 'green' }
```

## 十、目录规范

```
├── xx                          // 按模块分类
│   ├── dialog
│   │   └── edit.tsx            // 具体的弹窗 (导入时名称以 dialog 开头, 如 dialogEdit)
│   ├── component
│   │   └── CustomList.tsx      // 自定义组件 (大写驼峰)
│   ├── lib.ts                  // 枚举 (枚举名称大写, 如 STATUS_LIST)
│   ├── api.ts                  // 接口 (接口名称以 api 开头, 如 apiEdit)
│   └── index.tsx
```
