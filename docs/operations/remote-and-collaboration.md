---
title: 远程资源与协作
description: 区分 Remote SSH 工作区与 SciForge Cloud 协作，并理解各自的数据和权限边界。
sidebar_position: 2
---

# 远程资源与协作

Remote SSH 解决“计算和数据在哪里”；Cloud 协作解决“谁围绕 Project 与 Task 一起工作”。两者可以组合，也可以独立使用。

## Remote SSH 工作区

当数据、代码或计算环境位于实验室 Linux 主机、GPU 节点或集群目录时，使用远程工作区。

1. 打开顶部或设置中的 **远程资源**。
2. 添加实验室环境与 SSH 目标。
3. 由用户完成 VPN 登录和 MFA；SciForge 不代填密码。
4. 测试连接与主机信任策略。
5. 从工作区位置菜单选择远程目标和项目目录。
6. 新建会话，先运行只读任务。

![SciForge 远程资源向导](/img/docs/guides/remote-resources.jpg)
*图 1：远程资源向导组织实验室、VPN 环境和 SSH 目标。*

远程文件、终端和 Agent 命令实际作用于远端目录。不要把“在本地窗口显示”误解成“数据已经复制到本机”。

:::note[当前边界]

远程工作区支持范围可能小于本地工作区。使用分支、快照、复杂文件操作或科学预览前，请先查阅当前版本的功能状态并在测试目录验证。

:::

## Cloud 协作

需要在手机继续个人 Session，或让团队围绕 Project 分配和验收 Task 时，使用 Cloud 协作。它需要管理员提供的 Cloud 服务地址、账号和协作服务配置。

![SciForge Cloud 连接页面](/img/docs/guides/cloud-collaboration-connect.png)
*图 2：Cloud 连接状态与本地工作区相互独立。*

统一登录包含三个不同状态：

| 状态 | 作用 |
| --- | --- |
| 本地账户 | 在本机标记当前使用者和归属 |
| Cloud 登录 | 确认云端用户身份 |
| Desktop 注册 | 授权当前桌面安装访问 Cloud 能力 |

本地账户不是云端认证；工作区连接也不等于加入了协作 Project。

![SciForge Cloud 协作项目页面](/img/docs/guides/cloud-collaboration-projects.png)
*图 3：团队协作围绕 Project、Task、负责人和验收结果展开。*

## 数据与凭据边界

- SSH 密钥、VPN 凭据和 MFA 由用户或系统安全设施管理。
- Cloud、协作服务和 Content Space 可能把数据发送到外部服务。
- 正式数据上传前确认目标、范围、保留策略和团队权限。
- 远程命令和协作任务仍应记录输入、输出、返回码与审批。
- 网络中断后，先确认远程进程状态，再决定是否重试，避免重复提交计算。

案例：[虚拟细胞扰动预测评测](../cases/virtual-cell-benchmark.md)。
