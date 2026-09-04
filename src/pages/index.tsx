import type {ReactNode} from 'react';
import Link from '@docusaurus/Link';
import useBaseUrl from '@docusaurus/useBaseUrl';
import Layout from '@theme/Layout';
import Heading from '@theme/Heading';

import styles from './index.module.css';

const paths = [
  {
    number: '01',
    title: '先安全完成第一次任务',
    description: '配置 Runtime 和只读沙箱，在干净工作区中完成一次可验证的项目分析。',
    to: '/docs/getting-started/five-minute-quickstart',
  },
  {
    number: '02',
    title: '再跑通完整科研闭环',
    description: '从输入、分析和图表一路走到证据审查、检查点与科研档案。',
    to: '/docs/cases/virtual-cell-evidence-atlas',
  },
  {
    number: '03',
    title: '最后按目标学习功能',
    description: '围绕工作区、Agent、自动化、远程协作和扩展机制逐项深入。',
    to: '/docs/features/overview',
  },
];

export default function Home(): ReactNode {
  const heroImage = useBaseUrl('/img/docs/quickstart/quickstart-first-task.jpg');
  const atlasImage = useBaseUrl(
    '/img/docs/cases/virtual-cell-evidence-atlas/03-artifact-tree.jpg',
  );
  const dossierImage = useBaseUrl('/img/docs/guides/research-dossier.jpg');

  return (
    <Layout
      title="从科研问题到可复查证据"
      description="SciForge 官方中文使用文档：快速开始、虚拟细胞案例、功能与扩展、配置和故障排查。">
      <main>
        <section className={styles.hero}>
          <div className={styles.heroGlow} />
          <div className={`container ${styles.heroGrid}`}>
            <div className={styles.heroCopy}>
              <span className={styles.eyebrow}>SCIFORGE 使用文档</span>
              <Heading as="h1">把科研过程，变成可检查的证据链</Heading>
              <p>
                使用 Codex 或 Claude Code 组织本地与远程科研任务；保留输入、执行、图表、证据、人工审查和最终产物。
              </p>
              <div className={styles.actions}>
                <Link
                  className="button button--primary button--lg"
                  to="/docs/getting-started/five-minute-quickstart">
                  五分钟快速开始
                </Link>
                <Link
                  className="button button--outline button--lg"
                  to="/docs/cases/overview">
                  查看端到端案例
                </Link>
              </div>
              <div className={styles.trustLine}>
                <span>源码核验</span>
                <span>真实界面</span>
                <span>明确能力边界</span>
              </div>
            </div>
            <figure className={styles.heroFigure}>
              <img src={heroImage} alt="SciForge 工作台中的首次任务" />
              <figcaption>
                <strong>一个工作台，贯穿完整任务</strong>
                <span>工作区 · Agent 执行 · 工具过程 · 结果审查</span>
              </figcaption>
            </figure>
          </div>
        </section>

        <section className={styles.section}>
          <div className="container">
            <div className={styles.sectionLead}>
              <span className={styles.kicker}>推荐阅读路径</span>
              <Heading as="h2">先看完整结果，再深入单项能力</Heading>
              <p>文档按研究者的实际任务组织，而不是按源码包名罗列功能。</p>
            </div>
            <div className={styles.pathGrid}>
              {paths.map((path) => (
                <Link className={styles.pathCard} to={path.to} key={path.number}>
                  <span className={styles.pathNumber}>{path.number}</span>
                  <Heading as="h3">{path.title}</Heading>
                  <p>{path.description}</p>
                  <span className={styles.cardLink}>开始阅读 →</span>
                </Link>
              ))}
            </div>
          </div>
        </section>

        <section className={`${styles.section} ${styles.caseSection}`}>
          <div className="container">
            <div className={styles.sectionLead}>
              <span className={styles.kicker}>端到端科研案例</span>
              <Heading as="h2">围绕虚拟细胞，展示真正的 SciForge 页面</Heading>
              <p>案例图保留工作区、任务上下文和右侧工具，不用脱离产品的“结果截图”代替操作过程。</p>
            </div>
            <div className={styles.caseGrid}>
              <article className={styles.caseCard}>
                <img src={atlasImage} alt="SciForge 中打开的虚拟细胞跨尺度证据案例" />
                <div className={styles.caseBody}>
                  <span className={`${styles.badge} ${styles.badgeVerified}`}>首发主案例</span>
                  <Heading as="h3">ECCITE-seq 跨尺度虚拟细胞证据图</Heading>
                  <p>从 CRISPR 扰动和多模态响应，到版本化图表、Evidence DAG 与 Research Dossier。</p>
                  <Link to="/docs/cases/virtual-cell-evidence-atlas">进入案例 →</Link>
                </div>
              </article>
              <article className={styles.caseCard}>
                <img src={dossierImage} alt="SciForge 科研档案页面" />
                <div className={styles.caseBody}>
                  <span className={`${styles.badge} ${styles.badgeExperimental}`}>实验性路线</span>
                  <Heading as="h3">虚拟细胞扰动预测评测</Heading>
                  <p>连接用户已有模型，固定数据协议、运行环境和预测产物，分析失败并完成复跑。</p>
                  <Link to="/docs/cases/virtual-cell-benchmark">了解边界与计划 →</Link>
                </div>
              </article>
            </div>
          </div>
        </section>

        <section className={styles.boundarySection}>
          <div className={`container ${styles.boundaryInner}`}>
            <div>
              <span className={styles.kicker}>可信文档原则</span>
              <Heading as="h2">功能事实来自当前实现</Heading>
            </div>
            <p>
              每篇页面说明功能状态、用户可见入口、权限影响和已知限制。设计稿、历史 Wiki 或一次 Agent 声称，不能单独作为已发布功能的依据。
            </p>
            <Link className="button button--secondary" to="/docs/reference/feature-status">
              查看功能状态
            </Link>
          </div>
        </section>
      </main>
    </Layout>
  );
}
