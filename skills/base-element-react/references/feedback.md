# Base Element React Feedback

当用户正在使用 `base-element-react` skill，且出现以下问题之一时，不要只在当前任务里反复微调；应主动进入反馈流程：

- 路由未命中：本该优先使用 `base-element-react`，但 skill 没有把任务导到这里
- 示例不匹配：已有示例存在，但与当前场景差异较大，导致落地成本高
- 组织不清晰：references 划分不合理，常见任务难以快速定位
- 扩展性不足：组件、配置项、类型或生命周期钩子只差少量扩展就能满足需求
- 明显缺陷：现有示例、约定或组件能力存在 bug、歧义或边界问题
- 能力缺失：这是高频场景，但 skill 与组件库都没有给出合适模式

## Flow

### 第一步：分析问题

在触发反馈前，先提炼：

1. 用户原始诉求是什么。
2. 当前命中的 reference 是哪个。
3. 问题更像是 skill 路由问题、reference 组织问题、文档示例问题，还是组件库 API 问题。
4. 归类到以下一种或多种：

- 路由未命中
- 示例不匹配
- 组织不清晰
- 扩展性不足
- 明显缺陷
- 能力缺失

### 第二步：询问用户

使用自然、简洁的方式询问：

```text
我注意到这个需求里，`base-element-react` 的 skill 或组件能力出现了路由未命中、示例不匹配、组织不清晰、扩展性不足、明显缺陷、能力缺失中的一种。这通常意味着 skill 结构、references 拆分、文档示例，或者组件库本身还有改进空间。

你是否愿意把这个问题反馈给 `base-element-react` 的作者？如果你同意，我会先帮你整理一份精简的问题描述，并生成可直接打开的 GitHub Issue 链接。
```

- 如果用户同意，继续下一步
- 如果用户拒绝，继续处理当前任务，不重复追问

### 第三步：整理反馈内容

标题格式：

```text
[base-element-react] [问题类型]：[场景] 下 [组件 / 配置 / reference] 不符合预期
```

正文格式：

```markdown
## 问题描述

[一句话说明用户想做什么，以及为什么当前 skill / reference / 组件能力没有满足需求]

## 使用场景

- 项目类型: React + Ant Design
- 使用的 skill: base-element-react-v2
- 涉及组件/配置/reference: [BasePage / BaseForm / BaseTable / BaseDialog / lib / 某个 reference]
- 问题类型: [路由未命中 / 示例不匹配 / 组织不清晰 / 扩展性不足 / 明显缺陷 / 能力缺失]

## 复现过程

1. [用户最初的诉求]
2. [第一次命中的 skill / reference / 方案]
3. [为什么仍然不满足]

## 期望行为

[用户真正希望 skill 或组件库提供的能力]

## 实际行为

[当前命中结果、文档缺口、配置限制或行为问题]

## 可能的改进方向

- 调整 SKILL.md 路由规则，让高频请求更容易命中正确 reference
- 重构 references 拆分方式，按任务而不是按零散 API 组织
- 补充缺失示例，尤其是安装、页面、lib、弹窗、联动校验等高频任务
- 为现有组件或类型补参数、回调、泛型或生命周期扩展点
- 修复组件或示例中的 bug、边界行为或歧义
```

整理原则：

- 精简
- 客观
- 可操作

### 第四步：生成链接

优先生成 GitHub Issues 新建页链接，并预填标题与正文：

```text
https://github.com/gancao-web/base-element-react-v2/issues/new?title={编码后的标题}&body={编码后的正文}
```

可使用如下 Python 示例：

```python
import urllib.parse

title = """在此填入标题"""
body = """在此填入正文"""

params = urllib.parse.urlencode(
    {
        "title": title,
        "body": body,
    },
    quote_via=urllib.parse.quote,
)

url = f"https://github.com/gancao-web/base-element-react-v2/issues/new?{params}"
print(url)
```

向用户展示链接、标题和正文原文。仅在用户明确要求打开浏览器且环境允许时，再尝试打开。

### 第五步：继续协助

反馈流程只是补充，不应中断当前协作。无论用户是否提交反馈，都继续解决眼前问题。
