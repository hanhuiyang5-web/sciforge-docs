import {useRef, useState} from 'react';
import Link from '@docusaurus/Link';
import useBaseUrl from '@docusaurus/useBaseUrl';
import Layout from '@theme/Layout';
import tour from '@site/src/data/tour.json';
import styles from './guide.module.css';

type Chapter = {title: string; start: number; route: string};
const chapters = tour.chapters as Chapter[];
function time(seconds: number) { const whole = Math.floor(seconds + .001); return `${Math.floor(whole / 60).toString().padStart(2, '0')}:${(whole % 60).toString().padStart(2, '0')}`; }
export default function Guide() {
  const player = useRef<HTMLVideoElement>(null);
  const [active, setActive] = useState(0);
  const [playError, setPlayError] = useState(false);
  const media = useBaseUrl('/video/');
  function seek(seconds: number) {
    if (!player.current) return;
    setPlayError(false);
    player.current.currentTime = seconds;
    player.current.play().catch(() => setPlayError(true));
    const bounds = player.current.getBoundingClientRect();
    if (bounds.top < 68 || bounds.bottom > window.innerHeight) {
      player.current.scrollIntoView({behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth', block: 'center'});
    }
  }
  return <Layout title="视频导览" description="按章节学习 SciForge：快速开始、虚拟细胞案例、工作台、证据与扩展。配有中文旁白、字幕、原文与章节跳转。">
    <main className={styles.guide}>
      <div className={styles.heading}><span>WATCH & LEARN / 视频导览</span><h1>跟着一个研究流程，<br />认识 SciForge。</h1><p>案例、操作入口与能力边界，逐段展开。选一个章节开始，也可以随时回到使用手册。</p></div>
      <div className={styles.playerGrid}>
        <div>
          {tour.ready ? <video ref={player} className={styles.video} controls playsInline preload="metadata" poster={`${media}poster.jpg`} onTimeUpdate={() => { const now = player.current?.currentTime || 0; setActive(chapters.reduce((index, chapter, i) => now >= chapter.start ? i : index, 0)); }}>
            <source src={`${media}sciforge-guide-2026-09-05.mp4`} type="video/mp4" />
            <track src={`${media}captions.vtt`} label="简体中文" kind="captions" srcLang="zh" />
            你的浏览器暂不支持内嵌视频，请使用下方下载链接。
          </video> : <div className={styles.preparing}><span>SCIFORGE FIELD GUIDE</span><h2>分章节视频导览</h2><p>本页将与新版视频一同发布。</p></div>}
          <div className={styles.playerMeta}><span>中文旁白 · 中文字幕{tour.duration > 0 && ` · ${time(tour.duration)}`}</span><span>文档与界面讲解</span></div>
          {playError && <p role="status">点击播放器的播放按钮继续观看。</p>}
        </div>
        <aside className={styles.chapterNav} aria-label="视频章节"><h2>选择章节 <span>{String(chapters.length).padStart(2, '0')}</span></h2>{chapters.map((chapter, index) => <div key={chapter.title} className={`${styles.chapter} ${active === index ? styles.active : ''}`}><button type="button" onClick={() => seek(chapter.start)} aria-current={active === index ? 'true' : undefined}><span>{time(chapter.start)}</span><strong>{chapter.title}</strong><b aria-hidden="true">↗</b></button><Link to={chapter.route}>阅读对应手册 →</Link></div>)}</aside>
      </div>
      {tour.ready && <div className={styles.downloads}><span>带走这份指南</span><a href={`${media}sciforge-guide-2026-09-05.mp4`} download>下载视频 MP4 ↗</a><a href={`${media}captions.srt`} download>下载字幕 SRT ↗</a><a href={`${media}transcript.md`} download>旁白与时间线 ↗</a></div>}
      <section className={styles.next}><span>继续动手实践</span><h2>把看到的流程，<br />变成自己的第一项任务。</h2><div><Link to="/docs/getting-started/five-minute-quickstart">五分钟快速开始 →</Link><Link to="/docs/cases/virtual-cell-evidence-atlas">ECCITE-seq 证据案例 →</Link><Link to="/docs/features/overview">查找功能与扩展 →</Link></div></section>
    </main>
  </Layout>;
}
