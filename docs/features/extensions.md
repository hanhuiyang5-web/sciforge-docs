---
title: Skills、MCP 与扩展
description: 区分内置 Domain、本地签名扩展、Agent Skill 与 MCP Server，并安全启用它们。
sidebar_position: 4
---

# Skills、MCP 与扩展

SciForge 中的“扩展”并不是一个单一机制。理解对象类型，可以避免把文档方法、外部工具和应用内面板混为一谈。

## 扩展中心

打开左侧 **扩展**，可以查看内置领域扩展、本地安装包和 Skills。扩展详情应显示来源、发布者、版本、状态与贡献点。

![SciForge 扩展中心页面](/img/docs/guides/extensions-center.png)
*图 1：扩展中心区分内置与本地安装，并显示面板、工具栏、预览和智能体能力等贡献。*

本地扩展只接受 SciForge 官方签名包；安装会核对完整文件集、Ed25519 签名、发布者身份和 Host API。工作区内容不会自动安装或执行扩展。

## Agent Skill

Skill 是给 Codex 或 Claude Code 使用的专项方法与工作流，通常由 `SKILL.md` 和配套脚本、参考资料组成。启用前应阅读：

- Skill 的触发条件和适用范围
- 是否运行脚本、访问网络或写入文件
- 所需软件、数据和凭据
- 结果如何验证

![SciForge Skills 管理页面](/img/docs/guides/skills-center.png)
*图 2：Skills 页面用于查看、创建和管理项目级或全局 Skill。*

Skill 被识别不等于其脚本已被自动执行。第三方 Skill 的安装、依赖和脚本仍需要独立审查。

## MCP Server

MCP Server 向 Agent 提供外部工具或数据。配置时至少记录：

- 服务来源与版本
- 启动命令或服务地址
- 使用的环境变量与凭据范围
- 工具是否读取本地文件、写入外部系统或发送数据
- 失败时是否会重试，以及如何避免重复写入

外部系统的写入、发送、上传或删除不应因为 MCP 已连接而自动获得授权。

## Computer Use Backend

Computer Use 让支持的 Runtime 操作桌面应用。它还需要本地 Backend、屏幕录制与辅助功能权限。使用时应限制目标应用和任务范围，并在登录、授权、付款、发送或删除等关键动作前由用户确认。

![SciForge Computer Use 配置](/img/docs/guides/ai-assistants-computer-use.jpg)
*图 3：设置页分别显示 Runtime 接入、Backend 状态和 macOS 权限。*

## 故障排查顺序

1. 确认扩展或 Skill 的状态不是“需要重启”或“无效”。
2. 新建会话，让 Runtime 重新发现可用能力。
3. 检查目标工作区、Skill 目录和 MCP 配置。
4. 查看工具调用中的明确错误，不要依赖静默回退。
5. 对本地扩展核对签名、Host API 和版本。

相关页面：[权限与安全](../operations/security.md)。
