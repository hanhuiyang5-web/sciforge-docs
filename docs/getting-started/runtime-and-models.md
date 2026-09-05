---
title: Runtime 与模型接入
description: 区分模型 API、Coding Plan、Codex 与 Claude Code，并完成最小配置。
sidebar_position: 2
---

# Runtime 与模型接入

SciForge 把“模型从哪里来”和“谁来执行任务”分成两层配置。

| 层 | 决定什么 | 用户入口 |
| --- | --- | --- |
| 模型接入 | 请求通过模型 API 还是受支持的 Coding Plan | 首次启动引导或 **设置 → 通用** |
| AI 助手 Runtime | 由 Codex 或 Claude Code 规划并调用工具 | **设置 → AI 助手**，以及输入框右下角 |

## 选择模型接入

选择 **模型 API** 时，需要提供 Base URL、API Key 和模型名称；上游协议不确定时可以保留自动探测。

![SciForge 模型 API 配置](/img/docs/quickstart/quickstart-model-api.jpg)
*图 1：模型 API 的最小配置项。截图中的地址、密钥和模型名仅用于说明字段，不应照抄。*

选择 **Coding Plan** 时，按界面使用官方登录或设备码完成授权。当前实现支持 Codex 的 Coding Plan 路径；Claude Code 需要使用模型 API 接入。连接失败不会静默切换到模型 API。

## 配置 Codex 或 Claude Code

在 **设置 → AI 助手** 中分别配置两个 Runtime：

- **Codex**：默认选择，适合通用代码、文件和工具任务。
- **Claude Code**：需要显式选择，并配置模型 API，沿用 Claude Code 的执行方式。

通常保留默认命令 `codex` 或 `claude`。自动探测失败时，再填写可执行文件的绝对路径。

![SciForge AI 助手设置](/img/docs/guides/ai-assistants.jpg)
*图 2：AI 助手页面集中配置命令、工具确认策略和文件访问范围。*

两个 Runtime 的默认文件访问范围都是**可修改工作目录**。第一次只读分析请先调整 Codex 的范围；Claude 的“只能读取文件”对应 Plan 模式，不能当作同一种沙箱保证。配置步骤见 [配置只读沙箱](./read-only-sandbox.md)。

需要让 Agent 操作桌面应用时，继续在设置页面检查 **Computer Use** 的 Runtime 接入、Backend 和 macOS 权限。

![SciForge Computer Use 设置](/img/docs/guides/ai-assistants-computer-use.jpg)
*图 3：Computer Use 需要同时满足 Runtime、Backend 与系统权限条件。*

## 为当前会话选择执行者

回到工作台，在输入框右下角的执行设置区域查看当前 Runtime。切换 Runtime 不会自动迁移另一个 Runtime 的登录状态、配置或会话映射。

:::warning[不会静默回退]

选中的 Runtime 不可用时，SciForge 应显示错误，而不是自动改用另一个 Runtime。请修复当前配置或由你主动切换。

:::

## 最小验证

新建会话并发送：

> 只回答“连接成功”，不要读取或修改文件，也不要调用外部服务。

收到明确响应后，再进入 [五分钟快速开始](./five-minute-quickstart.md)。
