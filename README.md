# base-element 的 react 版本

## 基于 Ant Design 的管理后台配置化开发框架

文举 2023

## 快速开始

#### 1. 安装依赖

```bash
npm install base-element-react --save
```

#### 2. 初始化

在`main.tsx`中设置全局配置

```ts
import BaseElement from 'base-element-react';

BaseElement.use({
  http: xx, // 通用接口请求 (使用在接口枚举。若没有使用接口枚举,则不用配置)
  uploadApi: xx, // 单文件上传接口 (使用在富文本。若没有用富文本则不必配置)
  uploadAction: xx, // 上传组件的action配置 (使用在上传组件。若没有使用上传组件, 则不用配置)
  imgHost: xx, // 自动拼接图片和视频的域名地址 (若没有使用图片和视频组件, 则不用配置)
  imgType: 'OSS', // 云存储类型 (阿里云"OSS"|七牛云"QiNiu")
  rowKey: 'id', // table的唯一标识 (默认"id")
  pageKey: 'pageNum', // 分页页码的key (默认"pageNum")
  sizeKey: 'pageSize', // 分页页长的key (默认"pageSize")
  listKey: 'list', // 列表数据的key (默认"list")
  totalKey: 'total', // 列表总数的key (默认"total")
  gaodeKey: '', // 高德地图jsapi的key (没有使用地图组件, 则不用配置)
  gaodeSecret: '', // 高德地图jsapi的秘钥 (没有使用地图组件, 则不用配置)
});
```

#### 3. 使用

```tsx
import { apiSearch } from './api';
import dialogEdit from './dialog/edit';
import { BasePage, BaseText, BASE_USE, getDiffDateArr } from 'base-element-react';
import type { BasePageConfig } from 'base-element-react';

export default () => {
  /** 列表页的配置 */
  const config: BasePageConfig = {
    // 搜索栏
    form: [
      { label: '手机号', prop: 'phone', type: 'tel' },
      { label: '运行状态', prop: 'run_type', comp: 'select', lib: BASE_USE },
      {
        label: '搜索日期',
        prop: ['start_dt', 'end_dt'],
        comp: 'picker-date',
        value: getDiffDateArr(-90),
      },
    ],
    // 按钮栏
    btns: [{ label: '新增', dialog: dialogEdit }],
    // 分页表格
    table: [
      { label: '手机号', prop: 'phone_number' },
      { label: '发送时间', prop: 'send_time' },
      { label: '短信内容', prop: 'body_msg', ellipsis: true },
      {
        label: '状态码',
        width: 100,
        render(row) {
          return (
            <BaseText value={row.err_code} color={row.success == 1 ? 'green' : 'yellow'}></BaseText>
          );
        },
      },
      {
        label: '操作',
        btns: [
          {
            vif: (row) => row.run_type != 20,
            label: '编辑',
            dialog: dialogEdit,
          },
          {
            label: '详情',
            dialog: dialogDetail,
          },
        ],
      },
    ],
    // 搜索接口
    apiSearch,
  };

  return <BasePage config={config} />;
};
```

弹窗配置

```tsx
import { apiResetProtected } from '../api';
import type { BaseDialog, BaseDialogConfig } from 'base-element-react';
import { BASE_USE } from 'base-element-react';

const dialog: BaseDialog = (): BaseDialogConfig => {
  return {
    // 表单配置
    form: [
      { label: '手机号', prop: 'phone', type: 'tel', required: true },
      { label: '运行状态', prop: 'run_type', comp: 'select', lib: BASE_USE },
    ],
    // 点击确定按钮的接口
    apiSubmit: apiResetProtected,
  };
};

export default dialog;
```
