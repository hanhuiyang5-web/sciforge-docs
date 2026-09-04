---
title: 故障排查
description: 从界面、Runtime、模型接入、权限和外部服务五层定位 SciForge 问题。
sidebar_position: 2
---

# 故障排查

先判断问题发生在哪一层，避免同时修改模型、Runtime、权限和工作区设置。

## 五层快速定位

| 层 | 首先检查 |
| --- | --- |
| 应用界面 | SciForge 是否正常启动，当前工作区是否正确 |
| Runtime | 当前选中 Codex 还是 Claude Code，命令能否找到，登录是否有效 |
| 模型接入 | 模型 API 或 Coding Plan 是否配置完整 |
| 权限与工具 | 文件访问范围、审批、Computer Use Backend 与系统权限 |
| 外部服务 | Remote SSH、Cloud、MCP、Worker 或 Provider 是否可达 |

## Runtime 显示未连接

1. 打开 **设置 → AI 助手**，确认当前 Runtime。
2. 在系统终端检查 `codex` 或 `claude` 是否可以找到。
3. 自动探测失败时填写可执行文件绝对路径。
4. 修改后重新连接或新建会话。
5. 不要期待失败后自动切换到另一个 Runtime。

## Runtime 已连接但没有模型响应

- 确认当前使用模型 API 还是 Coding Plan。
- 模型 API 需要 Base URL、API Key 和模型名称完整匹配。
- Coding Plan 需要有效的官方登录状态。
- 不要把 Provider API Key 填到 Runtime 登录位置。
- 先用不读取文件的最小提示词测试，再排查工具和沙箱。

## 只读任务仍出现文件变化

1. 立即停止任务。
2. 比较任务前后的 `git status --short`。
3. 打开 **变更** 面板核对文件。
4. 检查测试、解释器或工具是否生成缓存。
5. 不要自动删除任务前已经存在的用户改动。

## 科学文件没有被理解

- 核对扩展名、文件版本和工作区引用。
- 大文件不要直接粘贴进提示词。
- 检查对应预览、Domain 或 Worker 是否可用。
- 二进制格式未被当前 Provider 支持时，应明确降级或停止，不应猜测内容。

## Evidence DAG 或 Dossier 为空

这些面板不会从空白会话自动生成证据。先让任务明确记录研究问题、输入、方法、主张、来源、产物和限制，再刷新对应面板。

## Remote SSH 中断

- 先确认 VPN、SSH 目标和主机密钥状态。
- 检查远端命令是否仍在运行。
- 不要在未知状态下重复提交长计算。
- 恢复连接后核对日志、输出文件和返回码。

## 提交问题时附带

- SciForge 版本和操作系统
- 选中的 Runtime 与模型接入方式
- 工作区类型：本地或远程
- 最短复现步骤与发生时间
- 已脱敏的日志或截图
- 预期行为与实际行为

提交前删除 API Key、Authorization header、账号、服务器信息、样本隐私和真实敏感路径。
