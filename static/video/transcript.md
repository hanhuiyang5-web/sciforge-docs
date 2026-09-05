# SciForge 使用导览

录制日期：2026-09-05。文档图文导览；界面截图不代表现场连续操作。

文档站：https://hanhuiyang5-web.github.io/sciforge-docs/

## 01 从科研任务开始

### 00:00:00.000 · SciForge · 科研工作台

页面：https://hanhuiyang5-web.github.io/sciforge-docs/

欢迎来到 SciForge。这份导览带你从一个研究问题出发，找到输入、执行过程和可以检查的交付物。

画面展示新版使用文档与其中的真实界面截图；它是一份功能讲解，不是一段连续实验操作录像。

### 00:00:11.533 · 首页案例 · 任务、产物与验证状态

页面：https://hanhuiyang5-web.github.io/sciforge-docs/

首页把案例的研究目标、核心产物和验证状态放在一起，方便先判断它是否适合自己的任务。

左侧从跨尺度数据走到证据审查，右侧展示外部模型评测路线，并明确保留实验性标记。

### 00:00:22.733 · 功能分类 · 按任务找到入口

页面：https://hanhuiyang5-web.github.io/sciforge-docs/

功能区按科研工作流、工作台、连接与扩展分类，帮助你从目标找到入口。

切换到工作台，可以继续学习会话、智能体协作和工具。

连接与扩展则集中提供运行时、远程资源和专项能力的指南。

### 00:00:34.600 · 先看完整案例，再学习具体功能

页面：https://hanhuiyang5-web.github.io/sciforge-docs/docs/cases/overview

建议先浏览两个虚拟细胞案例，理解一项任务怎样从数据走到证据和报告，再按需要查阅功能。

第一个案例展示已有产物的审查路径；第二个案例讲外部模型评测，当前仍是实验性流程。

## 02 完成第一次安全任务

### 00:00:45.533 · 模型接入与执行运行时

页面：https://hanhuiyang5-web.github.io/sciforge-docs/docs/getting-started/runtime-and-models

模型接入提供模型能力，执行运行时负责文件和工具。本次只读教程选择 Codex 运行时。

从左下角设置进入 AI 助手，在页面内的 AI 助手卡片找到 Codex 栏，检查命令与登录状态。

### 00:00:56.400 · 启用只读沙箱

页面：https://hanhuiyang5-web.github.io/sciforge-docs/docs/getting-started/read-only-sandbox

截图展示设置入口。请在 Codex 栏把可修改工作目录改为只能读取文件，应用后重启并新建会话。

Claude 的计划模式与这个沙箱不等效。只写不要修改文件，也不能保证技术上的隔离。

### 00:01:07.133 · 记录任务前的文件状态

页面：https://hanhuiyang5-web.github.io/sciforge-docs/docs/getting-started/five-minute-quickstart

使用干净的 Git 工作区，先运行页面中的状态检查命令并保存结果；非 Git 项目先制作副本。

随后打开本地项目，确认当前目录和会话，再开始发送任务。

### 00:01:16.733 · 发送文档中的完整提示词

页面：https://hanhuiyang5-web.github.io/sciforge-docs/docs/getting-started/five-minute-quickstart

把文档中的完整只读提示词复制到输入框。任务只查看顶层文件和目录，并简要判断项目用途。

明确任务范围、预期输出和禁止事项，能帮助你判断结果是否真正完成了要求。

### 00:01:27.400 · 检查执行过程

页面：https://hanhuiyang5-web.github.io/sciforge-docs/docs/getting-started/five-minute-quickstart

执行时观察文件读取、工具调用和命令返回结果。出现审批请求时，检查实际操作和目标路径。

这些截图来自指南记录的同一只读会话，可以对照发送、执行和完成三个阶段。

### 00:01:38.267 · 用结果与 Git 状态双重验收

页面：https://hanhuiyang5-web.github.io/sciforge-docs/docs/getting-started/five-minute-quickstart

完成后核对回答，并再次比较 Git 状态。它不会列出被忽略的文件；严格验收还要比较副本清单和哈希。

如果出现意外修改，先停止任务、保留现场，再根据只读沙箱和故障排查页面定位原因。

## 03 案例一 · 跨尺度证据审查

### 00:01:50.000 · ECCITE-seq · 从研究问题到交付

页面：https://hanhuiyang5-web.github.io/sciforge-docs/docs/cases/virtual-cell-evidence-atlas

第一个案例关注基因扰动之后，转录、蛋白、通路和细胞适应性之间的证据关系。

这里展示的是当前开发版中打开的真实产物，已经验证产物浏览路径；完整重跑仍需按步骤检查。

### 00:02:00.467 · 工作区中的输入、脚本与产物

页面：https://hanhuiyang5-web.github.io/sciforge-docs/docs/cases/virtual-cell-evidence-atlas

先在文件面板清点来源数据、重建脚本、派生表、图表和报告。每个阶段都要有明确的输入与输出。

写入前检查计划和输出目录，记录代码版本、输入哈希与环境；原始数据保持可追溯。

### 00:02:12.067 · 把研究任务写成可检查的要求

页面：https://hanhuiyang5-web.github.io/sciforge-docs/docs/cases/virtual-cell-evidence-atlas

完整提示词从清点文件开始，要求先列计划，再做质量检查、审阅表、图表和科研档案。

它同时规定保留对照与缺失数据、说明证据限制，并把需要确认的外部操作写清楚。

### 00:02:22.933 · 阶段一 · 冻结来源与审计质量

页面：https://hanhuiyang5-web.github.io/sciforge-docs/docs/cases/virtual-cell-evidence-atlas

来源清单和质量报告是第一阶段的交付。检查对照是否丢失，未测量是否被错误解释为没有响应。

图中保留各层覆盖和缺失状态。缺失值不能自动填成零，警告也必须进入最终报告。

### 00:02:34.067 · 阶段二 · 逐行追溯扰动与响应

页面：https://hanhuiyang5-web.github.io/sciforge-docs/docs/cases/virtual-cell-evidence-atlas

把扰动、靶点注释、通路和多模态响应连接成审阅表，为每一行保留来源与变换记录。

如果只有现成派生表，就将范围限定为审查派生结果，不能据此声称重新完成了原始数据分析。

### 00:02:45.400 · 阶段三 · 从审计结果生成图表

页面：https://hanhuiyang5-web.github.io/sciforge-docs/docs/cases/virtual-cell-evidence-atlas

图表从通过审计的派生表生成，记录输入、脚本、参数和版本。完整工作区让结果路径仍然可见。

转录与蛋白方向不一致时，应保留这一结果，并检查时间尺度与测量面板的范围。

### 00:02:56.400 · 区分观测、候选解释与因果结论

页面：https://hanhuiyang5-web.github.io/sciforge-docs/docs/cases/virtual-cell-evidence-atlas

跨层一致性可以帮助提出假设，但单张图不能自动支持因果结论。

写报告时分别说明受支持的主张、候选解释，以及当前数据仍然不能支持的声称。

### 00:03:05.467 · 阶段四 · 审查并固化交付

页面：https://hanhuiyang5-web.github.io/sciforge-docs/docs/cases/virtual-cell-evidence-atlas

最后核对文件变更，把关键主张连接到数据、方法、图表和限制，保存版本与研究检查点。

科研档案应同时包含结果、警告、失败路径和复跑方式，让另一位研究者能够继续检查。

## 04 案例二 · 外部模型预测评测

### 00:03:16.733 · 实验性 · 先确认模型与验证状态

页面：https://hanhuiyang5-web.github.io/sciforge-docs/docs/cases/virtual-cell-benchmark

第二个案例面向已有外部预测模型的研究者。SciForge 组织协议和运行记录，预测能力来自接入的模型。

案例当前标为实验性，完整模型运行和连续验证尚未完成；以下展示流程与验收要求。

### 00:03:28.067 · 分清离线评分与官方预检

页面：https://hanhuiyang5-web.github.io/sciforge-docs/docs/cases/virtual-cell-benchmark

离线路径在预测密封后打开预留参考答案，再做本地评分。官方路径使用当期工具完成提交前预检。

两条路径的真值与评分声明不能混用；预检通过也不代表已经上传或获得官方成绩。

### 00:03:39.333 · 预测前固定协议、模型和环境

页面：https://hanhuiyang5-web.github.io/sciforge-docs/docs/cases/virtual-cell-benchmark

首次预测之前固定数据切分、指标、聚合规则与停止条件，明确模型可以看到哪些内容。

每次运行记录代码、权重、环境、设备和随机种子，避免重跑时静默更换模型或预处理。

### 00:03:50.467 · 用小样本检查硬性契约

页面：https://hanhuiyang5-web.github.io/sciforge-docs/docs/cases/virtual-cell-benchmark

先用最小切片检查形状、基因顺序、背景标签、每条件细胞数和数值类型。

具体要求以运行时的官方数据包和命令行文档为准。任何硬性检查失败，都不能进入完整预测。

### 00:04:01.200 · 密封预测，保留独立运行记录

页面：https://hanhuiyang5-web.github.io/sciforge-docs/docs/cases/virtual-cell-benchmark

预测完成后计算文件哈希，将命令、返回码、日志和产物放进独立的运行目录。

离线参考答案只能在密封之后用于评分。重跑应创建新记录，保留与原运行的差异。

### 00:04:11.400 · 报告总分，也报告失败条件

页面：https://hanhuiyang5-web.github.io/sciforge-docs/docs/cases/virtual-cell-benchmark

将结果拆成契约检查、指标组件、按背景和扰动分层的表现，以及生物学解释。

保留失败条件和限制，避免把一个总分直接写成机制结论，再将记录汇入科研档案。

## 05 理解工作台与 Agent 协作

### 00:04:21.533 · 工作区限定输入，会话保留上下文

页面：https://hanhuiyang5-web.github.io/sciforge-docs/docs/workbench/workspaces-and-sessions

工作区承载项目文件，会话保留研究目标与执行过程。开始前确认项目名称和实际目录。

从文件面板查看产物、引用路径，让后续问题能够回到真实输入和生成脚本。

### 00:04:31.933 · 写清目标、边界、交付和停止条件

页面：https://hanhuiyang5-web.github.io/sciforge-docs/docs/workbench/agent-workflows

给智能体的任务至少说明目标、输入范围、交付物，以及权限与停止条件。

复杂任务先检查，再计划，最后执行与验证。结果不完整时，指出缺失的证据和验收标准。

### 00:04:42.333 · 检查工具结果与文件变更

页面：https://hanhuiyang5-web.github.io/sciforge-docs/docs/workbench/workspaces-and-sessions

核对工具调用、终端输出和返回码，再打开变更面板检查新增、修改与删除。

一次任务的交付包括实际文件和检查证据，最终回答应帮助你定位这些内容。

## 06 组织证据与可复现记录

### 00:04:52.067 · 按用途选择记录对象

页面：https://hanhuiyang5-web.github.io/sciforge-docs/docs/features/evidence-and-reproducibility

文件版本固定某个产物，研究检查点固定阶段状态，证据图连接主张与支持它的数据和方法。

科研档案把这些记录整理为可阅读的研究叙述，每个对象都有不同的职责。

### 00:05:02.067 · 让结论能够回到输入与过程

页面：https://hanhuiyang5-web.github.io/sciforge-docs/docs/features/evidence-and-reproducibility

科研档案应保留研究问题、输入、方法、结果、可信度、限制和复跑方式。

审查时沿着结论找到图表，再找到脚本、数据和运行记录，确认链路没有缺口。

## 07 安排重复任务与多步流程

### 00:05:12.133 · 定时任务 · 按频率重复执行

页面：https://hanhuiyang5-web.github.io/sciforge-docs/docs/features/automation

需要定期重复的独立任务，可以设置执行频率、工作区、输入和通知策略。

先手动验证一次最小任务，再检查定时运行的输出、日志和失败记录。

### 00:05:21.133 · Loop · 组织依赖、条件与检查

页面：https://hanhuiyang5-web.github.io/sciforge-docs/docs/features/automation

多个步骤存在依赖和分支时，使用流程画布组织节点、条件和人工检查。

为失败节点定义恢复路径和停止条件；自动化运行仍然遵守任务原有权限范围。

## 08 扩展能力与连接远程资源

### 00:05:30.667 · 按需要选择扩展能力

页面：https://hanhuiyang5-web.github.io/sciforge-docs/docs/features/extensions

扩展中心用于检查已安装扩展的来源、版本与状态。先找到需要的能力，再用最小任务验证输入和输出。

界面显示已启用，只说明配置状态；具体任务仍需检查实际运行结果。

### 00:05:41.333 · Skill、MCP 与图形界面工具

页面：https://hanhuiyang5-web.github.io/sciforge-docs/docs/features/extensions

技能提供专项方法与工作流；MCP 连接外部工具和数据；图形界面工具用于必须操作应用的步骤。

使用前了解脚本、依赖、凭据和外部影响，优先选择过程清楚、结果可检查的工具。

### 00:05:53.133 · 连接已有服务器与计算环境

页面：https://hanhuiyang5-web.github.io/sciforge-docs/docs/operations/remote-and-collaboration

需要实验室服务器或远程计算环境时，通过远程资源向导配置 SSH 工作区。

确认远端路径和环境，保留同样的输入、输出与运行记录，检查断线后的恢复方式。

### 00:06:03.933 · 协作前确认项目和数据范围

页面：https://hanhuiyang5-web.github.io/sciforge-docs/docs/operations/remote-and-collaboration

云端协作页面用于连接和查看协作项目，实际可用范围取决于当前服务与权限配置。

邀请成员、同步文件或上传数据前，确认目标项目、数据内容和访问范围。

## 09 安全、排障与下一步

### 00:06:14.267 · 让权限与任务范围一致

页面：https://hanhuiyang5-web.github.io/sciforge-docs/docs/operations/security

只读分析和写入任务使用不同的文件范围。审批时核对实际命令、路径和外部目标。

凭据不要进入截图和日志；科研数据的许可、去标识化与共享要求也要同时检查。

### 00:06:24.333 · 沿五层定位问题

页面：https://hanhuiyang5-web.github.io/sciforge-docs/docs/reference/troubleshooting

遇到问题，依次检查工作区、运行时与模型、工具与权限、外部服务，以及科研产物。

报告问题时附上版本、平台、复现步骤和脱敏日志，并说明期望结果与实际结果。

### 00:06:35.133 · 下一步 · 跑通只读任务，再选择案例

页面：https://hanhuiyang5-web.github.io/sciforge-docs/docs/intro

现在可以从五分钟快速开始亲自跑通只读任务，再选择与你的研究目标接近的案例。

随时对照功能状态与限制，把每次分析落实为可以打开、检查和复跑的交付物。
