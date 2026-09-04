---
title: ECCITE-seq 跨尺度虚拟细胞证据图
description: 在 SciForge 中审查 CRISPR 扰动、多模态响应、图表与证据边界。
sidebar_position: 2
---

# ECCITE-seq 跨尺度虚拟细胞证据图

本案例将 CRISPR 扰动、靶点注释、通路、转录响应、蛋白响应和细胞适应性组织成一条可检查的跨尺度证据链。SciForge 负责管理工作区、执行过程、图表、证据和人工审查；它不被描述成内置的虚拟细胞预测器。

:::info 当前验证状态
下列 5 张截图来自当前 SciForge 开发版，并在独立的 `cross-scale-data-demo` 工作区中打开真实产物。它们验证了产物浏览路径，但不冒充当前版本已经从同一会话完成了全部重跑。
:::

## 研究问题

> 当指定靶基因在特定细胞背景中受到 CRISPR 扰动后，转录、蛋白、通路和细胞适应性发生了什么变化？每项结论分别由哪些数据和方法支持？

案例必须同时回答“得到什么”和“还不能说什么”。表达差异、蛋白响应或表型关联不能自动升级为因果机制；跨层缺失也必须作为结果保留。

## 最终交付包

- 数据来源、Git commit、文件哈希和环境基线
- 保留对照与缺失状态的跨尺度扰动审阅表
- 从已验证派生表生成的一组版本化图表
- 质量审计报告、运行清单和产物清单
- 将主张、数据、脚本、图表与限制连接起来的 Evidence DAG
- 经人工审查的 Research Checkpoint 与 Research Dossier

## 已核对的数据快照

下面是公开演示副本 `cross-scale-data-demo@0696755` 的静态基线。正式运行时必须重新计算，而不是把这些数字写死到脚本中。

| 核对项 | 快照 | 运行时检查 |
| --- | ---: | --- |
| 审阅表总行数 | 35 | 从最终 TSV 重算 |
| 唯一靶基因 | 15 | 排除非靶向对照后去重 |
| 扰动 guide / 非靶向对照 | 27 / 8 | 显式检查扰动类型 |
| L1 靶点与 L2 通路注释 | 27/35 | 输出未命中识别符 |
| L3 转录响应 | 27/35 measured | 区分未测量与无显著响应 |
| L4 蛋白响应 | 35/35 measured | 声明 ADT 面板只有 4 个 marker |
| L5 适应性终点 | 27/35 | 8 条缺失不得填零 |
| 质量检查 | 42 pass, 1 warning | warning 指向 L5 缺失率 |
| 交付产物 | 22 | 逐类清点数据、结果、图、脚本、报告和清单 |

## 工作区与产物契约

```text
cross-scale-data-demo/
├── data/final/case45_cross_scale_integrated_dataset.tsv
├── data/processed/case45_l0_l5/case45_p0_20260708T1015Z/
└── run-output/
    ├── scripts/
    │   ├── stage01_source_inventory.py
    │   ├── stage02_reconstruct_dataset.py
    │   ├── stage03_quality_audit.py
    │   ├── stage04_context_expansion.py
    │   ├── stage05_generate_figures.py
    │   └── stage06_write_report.py
    ├── datasets/
    ├── results/
    ├── figures/
    └── reports/case45_local_demo_report.md
```

每个 Stage 都应记录输入、输出、返回码与停止条件。质量审计未通过时不得继续生成结论图；图表必须来自已验证派生表；最终报告不能隐藏 warning 和未验证项。

![SciForge 中的 ECCITE-seq 案例产物树](/img/docs/cases/virtual-cell-evidence-atlas/03-artifact-tree.jpg)
*图 1：SciForge 左侧保留案例工作区与任务，右侧文件面板展开 `run-output/figures` 产物树。*

## 开始前的权限与基线

本案例会创建脚本、表格、图表和研究记录，因此需要“可修改工作目录”，不适用快速开始中的只读沙箱。

开始前必须：

1. 使用可公开、可再分发的案例副本。
2. 检查 `git status --short` 并记录基线 commit。
3. 清点输入文件，记录哈希、来源和许可边界。
4. 检查 Agent 计划、输出路径和依赖需求。
5. 未经确认不安装依赖、不访问未列出的外部服务。

## 完整任务提示词

```text
请在当前工作区完成一次可复查的 ECCITE-seq 跨尺度扰动分析。

研究问题：对比指定靶基因与非靶向对照，检查靶点注释、通路、
转录响应、蛋白响应和细胞适应性之间的证据关系。

执行要求：
1. 先检查 Git 状态，清点数据、脚本和已有产物，不覆盖原文件。
2. 先给出计划、输出路径和数据质量检查项，再开始写入。
3. 保留非靶向对照和缺失数据；禁止将缺失值自动填成零。
4. 产生可追溯的扰动审阅表，每行列出来源和变换。
5. 从审阅表生成跨层覆盖图和关键响应图，保存图表版本。
6. 将主张、数据、方法、图表和限制连入 Evidence DAG。
7. 生成 Research Checkpoint 和 Research Dossier，并列出尚不支持的因果结论。

除非我明确允许，不要安装依赖、不要访问未列出的外部服务、
不要修改原始数据。对无法核验的数据或结论，标记为“未验证”。
```

## 阶段一：冻结来源与检查数据

Agent 首先清点数据、脚本和已有产物，并核对扰动标签、对照、细胞背景、测量模态与缺失值。这里的完成标志不是一句“检查通过”，而是可打开的 inventory、hash manifest 和质量审计报告。

特别检查：

- 非靶向对照没有在 join 或 filter 中丢失
- `missing` 与数值 `0` 没有混用
- “未测量”与“测量后无显著响应”分开表达
- 每个外部注释记录 Provider、查询条件和访问日期

![SciForge 中预览六层数据覆盖](/img/docs/cases/virtual-cell-evidence-atlas/06-layer-coverage-preview.jpg)
*图 2：在 SciForge 中查看 L0–L5 覆盖和测量状态；工作区和任务上下文仍保留在画面中。*

## 阶段二：组装扰动审阅表

把扰动、靶点注释、通路和多模态响应连接到一张逐行可追溯的表中。重算行数、唯一靶基因数、对照数和每层覆盖率，并输出未命中识别符清单。

如果只拿到现成派生表，而没有完整原始计数，必须把任务降级为“对现有派生结果做可追溯审查”，不能声称重新完成了完整差异表达分析。

## 阶段三：生成并检查版本化图表

所有图表都从通过审计的派生表生成，并记录输入哈希、脚本、参数和图表版本。同一输入与配方应能够重建相同结果。

![SciForge 中打开的 L3 与 L4 跨层证据图](/img/docs/cases/virtual-cell-evidence-atlas/04-cross-scale-evidence-preview.jpg)
*图 3：文件预览同时显示图表和实际产物路径，便于从结果回到输入。*

解读 L3 与 L4 时，不应优先选择“更符合预期”的一层。方向不一致可能来自时间尺度、测量噪声或 4-marker ADT 面板的覆盖限制，应保留为跨层分离结果。

![SciForge 中打开的因果准备度图](/img/docs/cases/virtual-cell-evidence-atlas/07-causal-readiness-preview.jpg)
*图 4：因果准备度、L3/L4 重叠和 L5 效应分布在 SciForge 中一起检查；该图不能单独支持因果声称。*

## 阶段四：审查证据与固化交付

将每条关键主张连接到原始记录、派生表、方法脚本和图表。反证、缺失与限制也应成为证据节点，而不是从最终叙述中删除。

审查通过后：

1. 打开 **变更** 核对写入范围。
2. 保存图表与关键文件的 Artifact Version。
3. 建立 Research Checkpoint。
4. 在 Research Dossier 中保留研究问题、输入、方法、结果、限制和复跑方式。

![SciForge 文件预览中的案例最终报告](/img/docs/cases/virtual-cell-evidence-atlas/05-final-report-preview.jpg)
*图 5：最终报告首屏显示 Stage 状态、数据基线、质量审计和产物数量。*

## 结论写作模板

```text
受支持的主张：
- 哪个扰动在什么细胞背景中影响了哪一层测量？
- 直接支持它的原始记录、派生表、方法和图表是什么？

候选解释：
- 哪条通路或机制可以解释结果？
- 它依赖什么假设，还缺少什么验证？

不能支持的声称：
- 为什么当前数据不足以支持因果、泛化或临床结论？
- 下一步需要哪种数据、实验或独立复现？
```

## 失败路径与恢复

| 问题 | 错误做法 | 正确处理 |
| --- | --- | --- |
| L5 缺失 | 填 0 后计入平均 | 保留 missing flag，分别报告总 N 与可评估 N |
| L3/L4 方向不一致 | 只保留更符合预期的一层 | 保留分离结果并检查时间尺度和 marker 范围 |
| 审计出现 error | 继续画图并写 Dossier | 在质量阶段停止，修复后从受影响 Stage 重跑 |
| 外部注释不可用 | 静默切换 Provider | 使用冻结快照或停止，并标注新鲜度 |
| 原始计数不完整 | 宣称重做完整分析 | 降级为现有派生表的可追溯审查 |

## 完成标志

- 基线 commit、输入哈希和环境记录可查
- 35 行审阅表、15 个靶基因与 8 个对照可以重算
- 缺失状态和 warning 没有被隐藏
- 图表可回到已验证派生表与生成脚本
- 关键主张有证据、反证或未决状态
- Checkpoint、Dossier 和 Git 变更同时完成审查

相关功能：[证据与可复现性](../features/evidence-and-reproducibility.md)。
