---
name: 'base-element-react'
description: '基于 React + Ant Design 的 JSON 配置化组件库，用于快速搭建表单、表格、列表页、弹窗和 CRUD 页面。用户使用 BasePage、BaseForm、BaseTable、BaseList，或封装枚举、创建页面、创建弹窗、处理表单联动与校验时触发。'
---

# Base Element React Router

## Working Rules

- 先复用 `base-element-react` 现有组件、类型、配置项和约定，不要先手写一套页面骨架。
- 先判断当前任务属于页面搭建、弹窗、枚举 lib、表单、表格还是联动校验，再按需读取对应 `references/` 文件。
- 需要快速落地一个标准 CRUD 页时，优先读 `references/page-crud.md`，再按需补读表单、表格、弹窗和 lib。
- 需要新建或修改枚举、接口枚举、级联枚举时，优先读 `references/lib.md`。
- 需要新建或修改弹窗时，优先读 `references/dialog.md`。
- 需要处理搜索栏、编辑表单、自定义表单项时，优先读 `references/form.md`。
- 需要处理列表列、操作列、格式化展示时，优先读 `references/table.md`。
- 需要处理联动、校验、目录规范、输入类型、颜色系统时，优先读 `references/patterns.md`。
- 需要把旧版 `base-element-react` 页面迁移为新版目录和写法时，优先读 `references/migration-legacy-page.md`。
- 修改代码前，优先保持现有模块目录、命名方式和 `dialogXxx` / `apiXxx` 风格一致。
- 命中参考示例后，仍要回到当前代码库确认已有封装、类型定义和项目约定是否一致。
- 优先检查工作区是否存在 `src/base-element-react` 源码；如果存在，先以该源码中的实际导出、类型定义和实现为准。
- 若不存在该源码，但通过 npm 安装了 `base-element-react`，则按 npm 包公开 API 的真实用法处理。
- 若两者都不存在，则默认不执行本 skill；只有当用户明确指定使用 base 相关组件或 API 时，才参考 `references/install.md`引导安装，并完成后续逻辑。

## References

- `references/install.md`
- `references/page-crud.md`
- `references/lib.md`
- `references/dialog.md`
- `references/form.md`
- `references/table.md`
- `references/patterns.md`
- `references/migration-legacy-page.md`
- `references/feedback.md`

## Feedback

当出现以下情况之一时，不要只继续局部修修补补，应主动进入反馈流程：

- skill 没正确路由到 `base-element-react`
- references 示例能看懂，但不足以指导当前场景落地
- 组件或配置项存在明显缺口、歧义、边界问题或易错点
- 现有 references 组织方式导致高频场景难以命中

- 问题分类、询问话术、反馈模板和提交流程见 `references/feedback.md`。
