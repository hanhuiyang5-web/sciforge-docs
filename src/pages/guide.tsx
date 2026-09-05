import {useEffect, useRef, useState} from 'react';
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
  const pendingChapter = useRef<number | null>(null);
  const chapterList = useRef<HTMLOListElement>(null);
  const [active, setActive] = useState(0);
  const [playError, setPlayError] = useState(false);
  const [mediaError, setMediaError] = useState(false);
  const [cinema, setCinema] = useState(false);
  const [shareStatus, setShareStatus] = useState('');
  const [chaptersExpanded, setChaptersExpanded] = useState(false);
  const current = chapters[active];
  const media = useBaseUrl('/video/');
  function applyPendingChapter() {
    if (pendingChapter.current === null || !player.current || player.current.readyState < 1) return;
    player.current.currentTime = chapters[pendingChapter.current].start;
    pendingChapter.current = null;
  }
  useEffect(() => {
    function readChapterLink() {
      const match = /^#chapter-(\d+)$/.exec(window.location.hash);
      if (!match) return;
      const index = Number(match[1]) - 1;
      if (index < 0 || index >= chapters.length) return;
      pendingChapter.current = index;
      setActive(index);
      applyPendingChapter();
    }
    readChapterLink();
    window.addEventListener('hashchange', readChapterLink);
    return () => window.removeEventListener('hashchange', readChapterLink);
  }, []);
  useEffect(() => {
    const list = chapterList.current;
    const selected = list?.querySelector('[aria-current="true"]');
    if (!list || !selected || list.scrollHeight <= list.clientHeight) return;
    const bounds = list.getBoundingClientRect();
    const item = selected.getBoundingClientRect();
    if (item.top < bounds.top) list.scrollTop += item.top - bounds.top;
    else if (item.bottom > bounds.bottom) list.scrollTop += item.bottom - bounds.bottom;
  }, [active]);
  function seek(index: number) {
    if (!player.current || !chapters[index]) return;
    const restoreFocus = window.matchMedia('(max-width: 620px)').matches && chapterList.current?.contains(document.activeElement);
    pendingChapter.current = index;
    setActive(index);
    setChaptersExpanded(false);
    if (restoreFocus) requestAnimationFrame(() => player.current?.focus({preventScroll: true}));
    setShareStatus('');
    setPlayError(false);
    applyPendingChapter();
    window.history.replaceState(window.history.state, '', `#chapter-${index + 1}`);
    player.current.play().catch(() => setPlayError(true));
    const bounds = player.current.getBoundingClientRect();
    if (bounds.top < 90 || bounds.bottom > window.innerHeight) {
      player.current.scrollIntoView({behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth', block: 'center'});
    }
  }
  async function shareChapter() {
    const url = new URL(window.location.href);
    url.hash = `chapter-${active + 1}`;
    try {
      await navigator.clipboard.writeText(url.toString());
      setShareStatus('章节链接已复制');
    } catch {
      window.history.replaceState(window.history.state, '', url.toString());
      setShareStatus('请复制地址栏中的章节链接');
    }
  }
  return <Layout title="视频导览" description="按章节学习 SciForge：快速开始、虚拟细胞案例、工作台、证据与扩展。配有中文旁白、字幕、原文与章节跳转。">
    <main className={`${styles.guide} ${cinema ? styles.cinema : ''}`}>
      <header className={styles.heading}>
        <div><span className={styles.eyebrow}>SCIFORGE FIELD GUIDE / 观看与实践</span><h1>从研究问题，<br />到可检查的成果。</h1></div>
        <div className={styles.introduction}><p>跟着两个虚拟细胞案例，认识工作台、证据与扩展。<br />先看流程，再回到手册动手实践。</p><div className={styles.facts}><span><b>{time(tour.duration)}</b>分钟导览</span><span><b>{String(chapters.length).padStart(2, '0')}</b>个章节</span><span><b>中文</b>旁白与字幕</span></div></div>
      </header>
      <div className={styles.watchToolbar}><span><i aria-hidden="true" />文档与真实界面讲解</span><button type="button" onClick={() => setCinema(!cinema)} aria-pressed={cinema} aria-controls="guide-player-layout"><span aria-hidden="true">▣</span>{cinema ? '收起宽屏' : '宽屏观看'}</button></div>
      <div id="guide-player-layout" className={styles.playerGrid}>
        <div>
          {tour.ready ? <video ref={player} className={styles.video} aria-label="SciForge 中文使用导览" tabIndex={0} controls playsInline preload="metadata" poster={`${media}poster.jpg`} onLoadedMetadata={applyPendingChapter} onError={() => setMediaError(true)} onTimeUpdate={() => { if (pendingChapter.current !== null) return; const now = player.current?.currentTime || 0; setActive(chapters.reduce((index, chapter, i) => now + .001 >= chapter.start ? i : index, 0)); }}>
            <source src={`${media}sciforge-guide-2026-09-05.mp4`} type="video/mp4" onError={() => setMediaError(true)} />
            <track src={`${media}captions.vtt`} label="简体中文" kind="captions" srcLang="zh" />
            你的浏览器暂不支持内嵌视频，请使用下方下载链接。
          </video> : <div className={styles.preparing}><span>SCIFORGE FIELD GUIDE</span><h2>分章节视频导览</h2><p>本页将与新版视频一同发布。</p></div>}
          {current && <div className={styles.nowPlaying}><div><span>当前章节 <b>{String(active + 1).padStart(2, '0')} / {String(chapters.length).padStart(2, '0')}</b></span><h2 aria-live="polite" aria-atomic="true">{current.title}</h2></div><div className={styles.chapterControls}><button type="button" onClick={() => seek(active - 1)} disabled={active === 0} aria-label="上一章">←</button><button type="button" onClick={() => seek(active + 1)} disabled={active === chapters.length - 1} aria-label="下一章">→</button></div></div>}
          {current && <div className={styles.chapterActions}><Link to={current.route}>阅读本章手册 ↗</Link><button type="button" onClick={shareChapter}>复制章节链接 ↗</button><span role="status">{shareStatus}</span></div>}
          {(playError || mediaError) && <p className={styles.error} role="status">{mediaError ? '视频暂时无法加载。可以刷新页面重试，或使用下方的 MP4 下载链接。' : '点击播放器的播放按钮继续观看。'}</p>}
          <p className={styles.scopeNote}>画面包含文档演示与完整 SciForge 工作区截图，不代表一次连续实验运行。实验性能力在对应章节中单独说明。</p>
        </div>
        <aside className={styles.chapterNav} aria-label="视频章节"><div className={styles.chapterHeading}><h2>观看目录</h2><span>按需选择 · 点击即播</span><button className={styles.mobileChapterToggle} type="button" aria-expanded={chaptersExpanded} aria-controls="guide-chapters" onClick={() => setChaptersExpanded(!chaptersExpanded)}>{chaptersExpanded ? '收起目录 −' : `展开 ${chapters.length} 章 ＋`}</button></div><ol id="guide-chapters" ref={chapterList} className={`${styles.chapterList} ${chaptersExpanded ? '' : styles.collapsed}`}>{chapters.map((chapter, index) => <li key={chapter.title} className={`${styles.chapter} ${active === index ? styles.active : ''}`}><button type="button" onClick={() => seek(index)} aria-current={active === index ? 'true' : undefined} aria-label={`${time(chapter.start)} ${chapter.title}`}><span className={styles.chapterNumber}>{String(index + 1).padStart(2, '0')}</span><span className={styles.chapterInfo}><strong>{chapter.title}</strong><span>{time(chapter.start)}<span aria-hidden="true"> / </span>{time((chapters[index + 1]?.start ?? tour.duration) - chapter.start)} 时长</span></span><span className={styles.chapterPlay} aria-hidden="true">{active === index ? '●' : '↗'}</span></button></li>)}</ol></aside>
      </div>
      {tour.ready && <section className={styles.downloads} aria-labelledby="take-guide-title"><div><span className={styles.eyebrow}>KEEP A COPY</span><h2 id="take-guide-title">留一份，随时回看。</h2><p>下载视频离线观看，或用文字快速回顾。</p></div><div className={styles.downloadLinks}><a href={`${media}sciforge-guide-2026-09-05.mp4`} download><span>完整视频<small>MP4 · 中文旁白</small></span><span aria-hidden="true">↓</span></a><a href={`${media}captions.srt`} download><span>逐句字幕<small>SRT · 简体中文</small></span><span aria-hidden="true">↓</span></a><a href={`${media}transcript.md`} download><span>旁白与时间线<small>Markdown · 可检索</small></span><span aria-hidden="true">↓</span></a></div></section>}
      <section className={styles.next}><div><span className={styles.eyebrow}>YOUR FIRST TASK</span><h2>看过之后，<br />完成自己的第一项任务。</h2></div><div className={styles.nextLinks}><Link to="/docs/getting-started/five-minute-quickstart"><span>01</span>五分钟快速开始 <b aria-hidden="true">→</b></Link><Link to="/docs/cases/virtual-cell-evidence-atlas"><span>02</span>ECCITE-seq 证据案例 <b aria-hidden="true">→</b></Link><Link to="/docs/features/overview"><span>03</span>查找功能与扩展 <b aria-hidden="true">→</b></Link></div></section>
    </main>
  </Layout>;
}
