---
title: 五分钟快速开始
description: 使用 SciForge 打开本地项目，并让 Agent 完成第一次只读分析。
sidebar_position: 1
---

# 五分钟快速开始

本指南带你打开一个本地项目，并让 Codex 或 Claude Code 分析项目顶层结构。整个过程使用**只读沙箱**，并在任务前后比较 Git 状态。

:::tip 完成目标
工作区正常打开、Runtime 能响应、Agent 给出项目概览，并且任务前后的文件状态没有变化。
:::

## 开始之前

请准备：

- 已安装并启动 SciForge
- 一个干净的 Git 工作区；非 Git 项目请先制作副本
- 已配置可用的模型接入方式
- 已安装并配置 Codex 或 Claude Code Runtime

Remote SSH 和 Cloud 协同需要额外配置。第一次使用建议从本地工作区开始。

## 第零步：记录项目基线

如果项目使用 Git，先在项目目录运行：

```bash
git status --short
```

保存输出。理想情况下没有任何内容；若已有改动，请先确认这些改动与你的演示无关。非 Git 项目应在副本上操作。

## 第一步：完成模型与 Runtime 配置

首次启动会引导你选择 **模型 API** 或 **Coding Plan**。模型接入决定请求从哪里获得模型能力，Runtime 决定由哪个 Agent 执行任务。

![SciForge 首次启动时的模型接入选择](/img/docs/quickstart/quickstart-model-access.jpg)
*图 1：首次启动引导中的模型接入选择；Coding Plan 与模型 API 是两条独立路径。*

进入工作台后，从左下角打开 **设置**，在 **AI 助手** 页面确认 Codex 或 Claude Code 的命令能够被识别。

## 第二步：设置只读沙箱

在 **设置 → AI 助手 → 权限范围** 中，把将要使用的 Runtime 的文件访问范围改为**只读**。如果界面显示“可修改工作目录”，不要直接开始本教程。

![SciForge AI 助手的文件访问范围设置](/img/docs/guides/ai-assistants.jpg)
*图 2：文件访问范围位于 AI 助手设置中。截图中的值为“可修改工作目录”；执行本教程前应在同一位置改为“只读”。*

仅在提示词中写“不要修改文件”并不能形成技术隔离。只读沙箱才是本教程的实际保护边界。

## 第三步：打开本地工作区

在工作区位置菜单中选择 **本地工作区**，然后打开准备好的项目目录。确认左侧项目区域显示了正确的目录名称。

新建会话后，输入区会显示在工作台底部。

![SciForge 新会话和本地工作区](/img/docs/quickstart/quickstart-new-session.jpg)
*图 3：左侧显示当前本地工作区，底部输入区用于发送第一次任务。*

## 第四步：选择执行 Runtime

在输入框右下角的执行设置区域，确认当前显示 `codex` 或 `claude`。这里选择“谁来执行”；上游模型仍由模型接入配置决定。

如果当前 Runtime 未连接，请先回到 **设置 → AI 助手** 检查命令和登录状态。

## 第五步：发送只读任务

输入下面的完整提示词：

> 查看当前工作区，只列出顶层文件和目录，并用一句话说明这个项目可能是什么。不要修改文件。

![SciForge 中准备发送的完整只读提示词](/img/docs/quickstart/quickstart-first-task.jpg)
*图 4：提示词、当前工作区和执行 Runtime 同时可见。*

发送后，Agent 会读取项目结构并执行只读检查。

![SciForge 中正在执行的只读任务](/img/docs/quickstart/quickstart-task-running.jpg)
*图 5：同一会话进入运行状态，任务原文和执行状态仍然可见。*

## 第六步：检查结果与文件状态

任务结束后，结果应列出项目顶层内容，并给出一条有边界的项目判断。

![SciForge 中完成的只读分析结果](/img/docs/quickstart/quickstart-task-result.jpg)
*图 6：同一会话中的最终回答；结果与发送的提示词保持一致。*

再次执行：

```bash
git status --short
```

将输出与任务前比较。只读任务不应新增、删除或修改项目文件。

## 完成标志

- 工作区能够正常打开
- 当前 Runtime 能正常响应
- 文件访问范围已设置为只读
- Agent 能读取并概括项目顶层结构
- 界面能展示发送、执行和最终结果
- 任务前后的 Git 状态一致

## 继续深入

完成第一次任务后，可以继续发送：

> 继续只读分析。请说明主要目录的职责、可能的入口文件和推荐的启动或测试方式；无法从源码确认的内容单独列出。不要修改文件，也不要安装依赖。

接下来阅读 [Runtime 与模型](./runtime-and-models.md) 或进入 [ECCITE-seq 虚拟细胞案例](../cases/virtual-cell-evidence-atlas.md)。
