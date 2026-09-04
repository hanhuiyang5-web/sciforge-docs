---
title: 功能与扩展总览
description: 按科研目标选择 SciForge 的工作台、科研、自动化、远程与扩展能力。
sidebar_position: 1
---

# 功能与扩展总览

SciForge 的功能文档按“你想完成什么”组织，而不是把源码中的 Domain、Worker 或 Action 名称直接列给普通用户。

## 按目标选择入口

| 目标 | 推荐入口 | 产生或读取的内容 |
| --- | --- | --- |
| 阅读项目、数据和论文 | 文件、预览、Paper Radar、浏览器 | 工作区文件、论文、网页与元数据 |
| 让 Agent 执行任务 | Codex 或 Claude Code、终端、Computer Use | 消息、工具调用、命令和文件变更 |
| 分析和绘制科研图表 | Scientific Plotting、图片审改 | 派生表、绘图脚本、图表和审改意见 |
| 固定结果与证据 | Artifact Versions、Checkpoint、Evidence DAG、Research Dossier | 版本、主张、来源、限制与复跑信息 |
| 重复执行任务 | 定时任务、Create Loop | 计划任务、多节点流程和运行记录 |
| 使用实验室计算资源 | Remote SSH、远程工作区、终端 | 远程文件、命令、日志和计算产物 |
| 增加专项能力 | 扩展中心、Skills、MCP | 内置 Domain、签名扩展、方法包和外部工具 |

![SciForge 论文雷达页面](/img/docs/guides/paper-radar.jpg)
*图 1：Paper Radar 是文献工作流的用户入口之一；检索结果仍需回到原文核验。*

## 四类扩展对象

| 类型 | 用户视角 | 文档和安全原则 |
| --- | --- | --- |
| **内置 Domain** | 随应用提供的面板、预览和能力 | 以真实入口、输入、输出和权限说明 |
| **本地安装扩展** | 从扩展中心安装的官方签名包 | 校验签名、发布者、Host API 和回滚状态 |
| **Agent Skill** | 为 Runtime 提供专项方法和工作流 | 阅读 Skill 内容，检查脚本、数据和权限影响 |
| **MCP Server** | 向 Agent 暴露外部工具或数据 | 明确连接、凭据、外部写入和审批边界 |

![SciForge 扩展中心](/img/docs/guides/extensions-center.png)
*图 2：扩展中心分开显示扩展与 Skills，并标注来源、版本和状态。*

## 推荐学习路线

1. 先完成 [五分钟快速开始](../getting-started/five-minute-quickstart.md)。
2. 用 [工作区与会话](../workbench/workspaces-and-sessions.md) 管理任务上下文。
3. 阅读 [证据与可复现性](./evidence-and-reproducibility.md)。
4. 有重复任务时再使用 [自动化](./automation.md)。
5. 最后按需接入 [Skills、MCP 与扩展](./extensions.md)。

所有能力的成熟度以 [功能状态](../reference/feature-status.md) 为准。
