import {useState, type ReactNode} from 'react';
import Link from '@docusaurus/Link';
import useBaseUrl from '@docusaurus/useBaseUrl';
import Layout from '@theme/Layout';
import Heading from '@theme/Heading';
import styles from './index.module.css';

const previews = [
  {name: '跨尺度证据', image: '/img/docs/cases/virtual-cell-evidence-atlas/04-cross-scale-evidence-preview.jpg', caption: '在同一个工作台，连接扰动、转录响应与蛋白响应。'},
  {name: '产物与文件', image: '/img/docs/cases/virtual-cell-evidence-atlas/03-artifact-tree.jpg', caption: '从图表回到真实文件、生成脚本与任务上下文。'},
  {name: '研究报告', image: '/img/docs/cases/virtual-cell-evidence-atlas/05-final-report-preview.jpg', caption: '交付结果，也保留数据基线、质量检查和限制。'},
];
const groups = ['科研工作流', '工作台', '连接与扩展'] as const;
const capabilities = [
  {group: '科研工作流', name: '证据与可复现性', detail: '版本、检查点、Evidence DAG 与科研档案。', to: '/docs/features/evidence-and-reproducibility'},
  {group: '科研工作流', name: '自动化与定时任务', detail: '为重复工作设置计划，使用 Loop 组织多步流程。', to: '/docs/features/automation'},
  {group: '科研工作流', name: '文献、分析与图表', detail: '按研究目标找到文件、论文与绘图工具。', to: '/docs/features/overview'},
  {group: '工作台', name: '工作区与会话', detail: '打开项目、引用文件，保留连续任务的上下文。', to: '/docs/workbench/workspaces-and-sessions'},
  {group: '工作台', name: '与 Agent 协作', detail: '从明确目标，到计划、执行与结果检查。', to: '/docs/workbench/agent-workflows'},
  {group: '工作台', name: '工作台工具', detail: '了解预览、终端、变更与 Computer Use 的使用场景。', to: '/docs/workbench/tools'},
  {group: '连接与扩展', name: 'Runtime 与模型', detail: '配置模型接入，选择 Codex 或 Claude Code。', to: '/docs/getting-started/runtime-and-models'},
  {group: '连接与扩展', name: '远程资源与协作', detail: '连接实验室服务器，管理远程工作区与云端协作。', to: '/docs/operations/remote-and-collaboration'},
  {group: '连接与扩展', name: 'Skills、MCP 与扩展', detail: '接入专项方法、外部工具与签名扩展包。', to: '/docs/features/extensions'},
];
function Arrow({diagonal = false}: {diagonal?: boolean}) { return <span aria-hidden="true">{diagonal ? '↗' : '→'}</span>; }
function ProductPreview() {
  const [active, setActive] = useState(0);
  const prefix = useBaseUrl('/');
  return <div className={styles.preview}>
    <div className={styles.previewTop}><span className={styles.liveDot} />SciForge 工作台<span className={styles.previewMeta}>真实界面 / 案例产物</span></div>
    <div aria-label="工作台预览" className={styles.previewTabs}>
      {previews.map((item, index) => <button key={item.name} type="button" aria-pressed={active === index} aria-controls="preview-panel" onClick={() => setActive(index)}>{item.name}</button>)}
    </div>
    <div id="preview-panel" className={styles.previewPanel}>
      <img src={prefix + previews[active].image.slice(1)} alt={`SciForge 工作台：${previews[active].name}`} fetchPriority="high" width="1600" height="1000" />
    </div>
    <p className={styles.previewCaption}><span>0{active + 1}</span>{previews[active].caption}</p>
  </div>;
}
export default function Home(): ReactNode {
  const [group, setGroup] = useState<(typeof groups)[number]>('科研工作流');
  const atlasImage = useBaseUrl('/img/docs/cases/virtual-cell-evidence-atlas/06-layer-coverage-preview.jpg');
  const workspaceImage = useBaseUrl('/img/docs/guides/workspace-files.jpg');
  return <Layout title="科研，从这里开始" description="SciForge 使用手册。通过虚拟细胞案例学习工作区、Agent、图表、证据与可复现研究，按目标找到工具与扩展。">
    <main className={styles.home}>
      <section className={styles.hero}><div className={styles.container}>
        <div className={styles.heroGrid}>
          <div className={styles.heroCopy}>
            <span className={styles.eyebrow}><span /> SCIFORGE / FIELD GUIDE</span>
            <Heading as="h1">让每一步科研，<br /><em>都有据可循。</em></Heading>
            <p>从一个问题、一份数据开始。<br />在 SciForge 中组织 Agent、分析与图表，<br />把研究过程沉淀为可检查、可复跑的成果。</p>
            <div className={styles.actions}><Link className={styles.primaryLink} to="/docs/cases/overview">从案例开始 <Arrow /></Link><Link className={styles.textLink} to="/docs/getting-started/five-minute-quickstart">五分钟快速上手 <Arrow /></Link></div>
            <Link className={styles.videoLink} to="/guide"><span className={styles.playIcon}>▶</span> 观看分章节视频导览 <Arrow diagonal /></Link>
            <div className={styles.heroFoot}><span>本地与远程工作区</span><span>Codex / Claude Code</span></div>
          </div><ProductPreview />
        </div>
        <div className={styles.workflow} aria-label="研究工作流"><span className={styles.workflowLabel}>一条完整的研究路径</span>{['准备工作区', '与 Agent 分析', '审查图表与证据', '固化研究交付'].map((label, i) => <span key={label}><small>0{i + 1}</small>{label}{i < 3 && <b aria-hidden="true">→</b>}</span>)}</div>
      </div></section>
      <section id="cases" className={styles.section}><div className={styles.container}>
        <div className={styles.sectionHeader}><div><span className={styles.eyebrow}>01 / END-TO-END CASES</span><Heading as="h2">先从一个完整案例开始</Heading><p>围绕虚拟细胞，串起输入、分析、检查与交付。</p></div><Link className={styles.textLink} to="/docs/cases/overview">案例阅读指南 <Arrow /></Link></div>
        <div className={styles.caseGrid}>
          <article className={styles.mainCase}>
            <div className={styles.caseCopy}><div className={styles.caseMeta}><span>CASE STUDY 01</span><span className={styles.status}>产物浏览已验证</span></div><Heading as="h3">ECCITE-seq<br />跨尺度虚拟细胞证据图</Heading><p>从 CRISPR 扰动出发，检查转录、蛋白和细胞适应性之间的证据关系。让每一张图，都能回到它的数据与方法。</p><div className={styles.tags}><span>质量审计</span><span>多模态响应</span><span>研究档案</span></div><Link className={styles.caseLink} to="/docs/cases/virtual-cell-evidence-atlas">阅读案例 <Arrow /></Link></div>
            <Link to="/docs/cases/virtual-cell-evidence-atlas" className={styles.caseVisual} aria-label="阅读 ECCITE-seq 证据案例"><img src={atlasImage} alt="SciForge 中查看六层数据覆盖及案例工作区" loading="lazy" width="1600" height="1000" /><span>工作区、任务与图表，一起保留在画面中。</span></Link>
          </article>
          <article className={styles.secondCase}><div className={styles.caseMeta}><span>CASE STUDY 02</span><span className={styles.experimental}>实验性路线</span></div><Heading as="h3">虚拟细胞<br />扰动预测评测</Heading><p>接入已有模型，固定数据协议与运行环境。从小样本预检，到预测、失败分析与复跑。</p><div className={styles.protocol}><span>01 协议与输入</span><span>02 预测与验证</span><span>03 分层分析与复跑</span></div><img src={workspaceImage} alt="SciForge 工作区文件面板，评测输入的检查入口" loading="lazy" width="1600" height="1000" /><small>模型来自用户接入；完整演示仍待验证。</small><Link className={styles.caseLink} to="/docs/cases/virtual-cell-benchmark">查看评测流程 <Arrow /></Link></article>
        </div>
      </div></section>
      <section id="start" className={`${styles.section} ${styles.startSection}`}><div className={`${styles.container} ${styles.startGrid}`}>
        <div><span className={styles.eyebrow}>02 / FIRST STEPS</span><Heading as="h2">第一次使用？<br />从一个小任务开始。</Heading><p>准备一个本地项目，用只读分析熟悉<br />工作区、执行过程与结果检查。</p><Link className={styles.primaryLink} to="/docs/getting-started/five-minute-quickstart">打开快速开始 <Arrow /></Link></div>
        <div className={styles.startSteps}>{[
          ['01', '连接你的模型与 Runtime', '理解模型接入与执行者，确认运行时可用。', '/docs/getting-started/runtime-and-models'],
          ['02', '确认只读范围与项目基线', '检查 Codex 访问范围，保存 Git 状态；非 Git 项目先使用副本。', '/docs/getting-started/read-only-sandbox'],
          ['03', '发送任务，核对过程与结果', '运行一次小范围分析，并比较执行前后的文件状态。', '/docs/getting-started/five-minute-quickstart'],
        ].map(([num, title, desc, to]) => <Link to={to} key={num} className={styles.step}><span>{num}</span><div><h3>{title}</h3><p>{desc}</p></div><Arrow /></Link>)}</div>
      </div></section>
      <section id="capabilities" className={styles.section}><div className={styles.container}>
        <div className={styles.sectionHeader}><div><span className={styles.eyebrow}>03 / TOOLBOX</span><Heading as="h2">按你想做的事，找到工具</Heading><p>从常用工作台，到科研流程，再到专项扩展。</p></div><Link className={styles.textLink} to="/docs/features/overview">完整功能手册 <Arrow /></Link></div>
        <div aria-label="功能分类" className={styles.toolTabs}>{groups.map((item) => <button type="button" key={item} aria-pressed={group === item} aria-controls="tool-panel" onClick={() => setGroup(item)}>{item}</button>)}</div>
        <div id="tool-panel" className={styles.toolGrid}>{capabilities.filter((item) => item.group === group).map((item, i) => <Link to={item.to} key={item.name} className={styles.tool}><span className={styles.toolMark}>0{i + 1} /</span><h3>{item.name}</h3><p>{item.detail}</p><span className={styles.toolRead}>阅读指南 <Arrow /></span></Link>)}</div>
        <div className={styles.referenceBar}><span>使用前，了解当前能力与边界。</span><Link to="/docs/reference/feature-status">功能状态 <Arrow diagonal /></Link><Link to="/docs/operations/security">权限与安全 <Arrow diagonal /></Link><Link to="/docs/reference/troubleshooting">故障排查 <Arrow diagonal /></Link></div>
      </div></section>
      <section className={styles.closing}><div className={styles.container}><span className={styles.eyebrow}>YOUR NEXT EXPERIMENT</span><Heading as="h2">把下一次研究，<br />放进可复查的工作流。</Heading><div><Link className={styles.closingButton} to="/docs/getting-started/five-minute-quickstart">开始第一个任务 <Arrow /></Link><Link to="/guide">观看完整导览 <Arrow /></Link></div><p>从清楚的输入，到有依据的结论。</p></div></section>
    </main>
  </Layout>;
}
