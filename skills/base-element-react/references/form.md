# 表单配置

适用场景：

- 搜索表单
- 新增编辑表单
- 自定义表单项

## 基础表单项

```tsx
const config: BaseFormConfig = {
  form: [
    { label: '文本', prop: 'name' },
    { label: '手机', prop: 'phone', type: 'phone' },
    { label: '小数', prop: 'money', type: 'digit' },
    { label: '整数', prop: 'count', type: 'num' },
    { label: '多行文本', prop: 'remark', type: 'textarea' },
    { label: '富文本', prop: 'rich', comp: 'editor' },
    { label: '下拉选择', prop: 'status', comp: 'select', lib: STATUS_LIST },
    { label: '自动补全', prop: 'doctor', comp: 'auto-complete', lib: DOCTOR_LIST },
    { label: '单选', prop: 'type', comp: 'radio', lib: TYPE_LIST },
    { label: '复选', prop: 'tags', comp: 'checkbox', lib: TAG_LIST },
    { label: '级联', prop: 'area', comp: 'cascader', lib: BASE_AREAS },
    { label: '日期', prop: 'date', comp: 'picker-date' },
    { label: '日期范围', prop: ['start_dt', 'end_dt'], comp: 'picker-date' },
    { label: '日期时间', prop: 'datetime', comp: 'picker-date', type: 'datetime' },
    { label: '上传图片', prop: 'images', comp: 'upload' },
    { label: '上传文件', prop: 'file', comp: 'upload', accept: 'pdf' },
    { label: '开关', prop: 'enabled', comp: 'switch', lib: BASE_YES },
  ],
};
```

## 公共配置

```tsx
{
  label: '姓名',
  prop: 'name',
  required: true,
  value: '默认值',
  sty: { width: 320 },
  style: { width: 240 },
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

## 多项同一行

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

## 下拉框和输入框组合

```tsx
// 方法一: (下拉选择和输入框不换行, 下拉选择无字段, 输入框字段对应类型, 无lib字段)
{
  prop: [
    { label: '医生姓名', value: 'doctor_name' },
    { label: '医生手机', value: 'doctor_phone' },
  ],
  comp: 'select-input',
},

// 方法二: (下拉选择和输入框可能会换行, 下拉选择和输入框分别有字段, lib支持Api)
{
  form: [
    {
      prop: 'xx1',
      comp: 'select',
      lib: ORDER_DOCTOR_INPUT,
      value: 1,
      clearable: false,
      sty: { width: '100px', marginRight: '-1px' },
    },
    { prop: 'xx2', sty: { width: '221px' } },
  ];
}
```

## 自定义表单项

```tsx
import { BaseFormItemProps } from 'base-element-react';

const CustomComp = (props: BaseFormItemProps) => {
  const { value, onChange } = props;

  const handleChange = (newValue) => {
    onChange?.(newValue);
  };

  return <Xxx value={value} onChange={handleChange} />;
};

{
  label: '自定义表单项',
  prop: 'custom',
  render: () => <CustomComp />,
}
```

## 使用建议

- 搜索栏优先保持轻量，复杂编辑逻辑放弹窗表单。
- 先用标准 `comp` / `type`，仅在确实不覆盖时再写自定义组件。
- `select` 和 `checkbox` 的值会按 item.value 回填，返回类型默认跟随初始值：初始值为字符串时返回逗号分隔字符串(默认)，初始值为 [] 时返回数组。
- `auto-complete` 支持 `{ comp: 'auto-complete', lib }` 的配置化写法；静态 `lib` 默认前端过滤，配置 `onSearch: true` 时会在输入时按关键字重新请求接口枚举。
- `upload` 的值默认返回逗号分隔的上传地址；如果 `value` 设置为 `[]`，则返回文件信息数组，可取到文件大小、名称、id 等。
- `select` 和 `cascader` 可通过 `showSearch: true` 开启前端搜索，默认匹配 `label`。如果还想匹配 `value`，建议把 `value` 一并展示到 `label` 中，例如在 `filterResult` 里处理为：`label:【${item.id}】${item.name}`。
- `select` 还支持 `onSearch: true`，可在输入时实时请求接口搜索选项。此时从 `lib` 的 `param` 中解构出 `keyword` 并传给后端即可。`onSearch` 适合单选场景，但不适合多选，因为无法回显已选项。
- `select` 和 `cascader` 在多选场景下，应一次性加载完整选项（可适当调大分页参数），选项较多时建议配置 `showSearch: true` 开启前端搜索。
- `vif`、`vshow`、`render`、`disabled`、`before`、`after`、`tip`、`required`、`label`、`libParam` 等动态函数的依赖字段，是通过函数 `toString()` 后做字符串匹配来推断监听的；被监听的字段名必须直接出现在该函数体内。
- 因此这类动态逻辑优先内联书写，例如直接写 `form.xxx`；不要只在外部另声明一个中转函数再间接调用，否则可能因为函数体内没有直接出现字段名而导致监听失效。
