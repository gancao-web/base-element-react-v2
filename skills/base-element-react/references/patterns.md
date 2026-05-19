# 联动、校验与约定

适用场景：

- 表单联动
- 自定义校验
- 输入类型选择
- 颜色系统和目录规范

## 表单联动

```tsx
form: [
  {
    label: '所属企业',
    prop: 'enterpriseNo',
    comp: 'select',
    showSearch: true,
    lib: ENTERPRISE_LIST,
    onChange() {
      // 所属企业变化时,置空关联产品
      refDialog.current?.setParam({ productNos: '' });
    },
  },
  {
    label: '关联产品',
    prop: 'productNos',
    comp: 'select',
    showSearch: true,
    lib: PRODUCT_LIST,
    // 所属企业变化时,重新获取产品列表
    libParam: (form) => ({ enterpriseNo: form.enterpriseNo }),
  },
],
```

## 校验规则

```tsx
{
  label: '手机号',
  prop: 'phone',
  type: 'phone',
  required: true,
},
{
  label: '验证码',
  prop: 'code',
  type: 'num',
  maxLength: 6,
  required: true,
},
{
  label: '价格',
  prop: 'price',
  type: 'digit',
  min: 0.01,
  max: 9999.99,
  required: true,
},
{
  label: '编号',
  prop: 'pill',
  required: true,
  rules: [
    {
      validator: (form, value) => {
        if (value && !value.startsWith('NO.')) {
          return Promise.reject('格式不正确');
        }
        return Promise.resolve();
      },
    },
  ],
}
```

## 输入类型

```tsx
type: 'num';
type: 'digit';
type: 'phone';
type: 'tel';
type: 'idcard';
type: 'bank_card';
type: 'zh';
type: 'en';
type: 'en_num';
type: 'zh_en_num';
type: 'http';
type: 'tax';
type: 'textarea';
type: 'password';
```

## 颜色系统

```tsx
type BaseColor = 'primary' | 'red' | 'green' | 'blue' | 'yellow' | 'gray' | string;

{ label: '成功', value: 1, color: 'green' }
{ label: '失败', value: 0, color: 'red' }
{ label: '警告', value: 2, color: 'yellow' }

{ label: '正常', value: 1, tag: 'green' }
{ label: '停用', value: 0, tag: 'red' }

{ label: '在线', value: 1, dot: 'green' }
```

## 目录规范

```ts
├── common
│   └── lib.ts // 仅放跨 2 个及以上模块复用的枚举/选项集
└── pages
    └── xx // 模块
        └── xxx // 子模块
            ├── index.tsx // 子模块入口页面
            ├── api.ts // 子模块接口
            ├── lib.ts // 子模块枚举/选项集
            ├── types.ts // 子模块级类型
            ├── dialog // 子模块的弹窗
            │   └── Edit.tsx
            └── components // 子模块的页面组件
                └── CustomList.tsx
```

- api、lib、types、dialog、components 若被多个子模块共用，应上提到它们最近的共同父级目录

## 使用建议

- 联动优先用 `onChange` + `libParam`，不要手动散写请求时机。
- 校验优先使用内置 `type`、`required`、`min`、`max`，只有特殊规则再补 `rules`。
- 新建模块时先贴合目录规范，避免页面代码把弹窗、lib、api 混写在一个文件里。
- `libParam`、`vif`、`vshow`、`render`、`disabled`、`before`、`after`、`tip`、`required`、`label` 等动态函数的依赖字段，是通过函数 `toString()` 后做字符串匹配来推断监听的；被监听字段名要直接出现在函数体内。
- 因此联动逻辑优先内联书写，例如直接使用 `form.enterpriseNo`；不要只在外部声明中转函数后再间接调用，否则可能导致监听失效。
