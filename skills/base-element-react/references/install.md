# 安装与初始化

适用场景：

- 用户要求安装 `base-element-react`
- 项目首次接入，需要配置 `BaseElement.use`
- 需要确认哪些全局配置是必需项，哪些可按需省略

## 安装

```bash
npm install base-element-react --save
```

## 初始化

在 `main.tsx` 或等价入口设置全局配置：

```ts
import BaseElement from 'base-element-react';

BaseElement.use({
  http: xx,
  uploadApi: xx,
  uploadAction: xx,
  imgHost: xx,
  imgType: 'OSS',
  rowKey: 'id',
  pageKey: 'pageNum',
  sizeKey: 'pageSize',
  listKey: 'list',
  totalKey: 'total',
  gaodeKey: '',
  gaodeSecret: '',
});
```

## 使用建议

- 如果当前页面没有使用接口枚举，可暂不配置 `http`。
- 如果没有使用富文本、上传、图片视频、地图能力，对应配置可不填。
- 如果项目后端分页字段不是默认值，优先在这里统一映射，不要在每个页面重复兼容。
