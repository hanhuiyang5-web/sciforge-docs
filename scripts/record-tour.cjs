#!/usr/bin/env node
'use strict';

// Reproducible, sentence-timed documentation video. No new scientific run is implied.
// node scripts/record-tour.cjs --audio-only
// node scripts/record-tour.cjs --preflight
// node scripts/record-tour.cjs [--output-dir <path>] [--refresh-frames]
const fs = require('node:fs');
const path = require('node:path');
const http = require('node:http');
const crypto = require('node:crypto');
const {spawn} = require('node:child_process');
const plan = require('./tour-plan.cjs');
const root = path.resolve(__dirname, '..');
const argv = process.argv.slice(2);
const option = (name, fallback) => {
  const index = argv.indexOf(name);
  return index === -1 ? fallback : argv[index + 1];
};
const outputDir = path.resolve(option('--output-dir', path.join(root, 'recordings')));
const buildDir = path.resolve(option('--build-dir', path.join(root, 'build')));
const cacheDir = path.join(outputDir, '.cache', plan.slug);
const width = 1600;
const height = 900;
const viewportHeight = 784;
const fps = 15; // Divides output 30 fps, preventing cumulative per-shot rounding drift.
const prefix = '/sciforge-docs';
const voice = process.env.TOUR_VOICE || 'Tingting';
const rate = process.env.TOUR_VOICE_RATE || '230';
const ffmpeg = process.env.FFMPEG || '/opt/homebrew/bin/ffmpeg';
const ffprobe = process.env.FFPROBE || '/opt/homebrew/bin/ffprobe';
const chrome = process.env.CHROME || '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const audioOnly = argv.includes('--audio-only');
const preflightOnly = argv.includes('--preflight');
const refreshFrames = argv.includes('--refresh-frames');
const finalizeOnly = argv.includes('--finalize');
const paths = {
  video: path.join(outputDir, `${plan.slug}.mp4`),
  captions: path.join(outputDir, `${plan.slug}-captions.srt`),
  transcript: path.join(outputDir, `${plan.slug}-transcript.md`),
  poster: path.join(outputDir, `${plan.slug}-poster.jpg`),
  manifest: path.join(outputDir, `${plan.slug}-manifest.json`),
  chapters: path.join(outputDir, 'chapters.json'),
};
const hash = (value) => crypto.createHash('sha256').update(value).digest('hex');
const log = (message) => console.log(`[${new Date().toISOString().slice(11, 19)}] ${message}`);
const exists = (file) => fs.existsSync(file) && fs.statSync(file).size > 0;
const ensureDir = (dir) => fs.mkdirSync(dir, {recursive: true});
const quoteConcat = (file) => `file '${file.replaceAll("'", "'\\''")}'`;

function run(command, args) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, {stdio: ['ignore', 'pipe', 'pipe']});
    let stdout = '';
    let stderr = '';
    child.stdout.on('data', (data) => { stdout += data; });
    child.stderr.on('data', (data) => { stderr = (stderr + data).slice(-20000); });
    child.on('error', reject);
    child.on('close', (code) => code === 0 ? resolve(stdout) : reject(new Error(`${command} exited ${code}\n${stderr}`)));
  });
}

async function duration(file) {
  return Number((await run(ffprobe, ['-v', 'error', '-show_entries', 'format=duration', '-of', 'default=nw=1:nk=1', file])).trim());
}

function timestamp(seconds, separator = ',') {
  const ms = Math.round(seconds * 1000);
  const h = Math.floor(ms / 3600000);
  const m = Math.floor(ms / 60000) % 60;
  const s = Math.floor(ms / 1000) % 60;
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}${separator}${String(ms % 1000).padStart(3, '0')}`;
}

function wrapCaption(text, length = 43) {
  if (text.length <= length) return text;
  const nearby = [...text].map((char, i) => /[，；：、。]/.test(char) ? i + 1 : -1)
    .filter((i) => i > text.length * 0.35 && i <= length);
  const at = nearby.length ? nearby[nearby.length - 1] : length;
  return `${text.slice(0, at)}\n${wrapCaption(text.slice(at), length)}`;
}

function loadPlaywright() {
  const candidates = [
    process.env.PLAYWRIGHT_CORE,
    'playwright-core',
    path.join(root, '../SciForge_private/node_modules/playwright-core'),
    path.join(root, '../SciForge-test-colab-merged106/node_modules/playwright-core'),
  ].filter(Boolean);
  for (const candidate of candidates) {
    try { return require(candidate); } catch (error) {
      if (error.code !== 'MODULE_NOT_FOUND') throw error;
    }
  }
  throw new Error('Playwright is unavailable. Set PLAYWRIGHT_CORE to an installed playwright-core module.');
}

function buildFingerprint() {
  const files = [];
  const walk = (dir) => {
    for (const item of fs.readdirSync(dir, {withFileTypes: true})) {
      const file = path.join(dir, item.name);
      if (item.isDirectory()) walk(file);
      else files.push([path.relative(buildDir, file), fs.statSync(file).size, fs.statSync(file).mtimeMs]);
    }
  };
  walk(buildDir);
  return hash(JSON.stringify(files.sort()) + fs.readFileSync(__filename));
}

function serverForBuild() {
  const mimes = {'.html': 'text/html', '.css': 'text/css', '.js': 'text/javascript', '.json': 'application/json', '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.woff2': 'font/woff2'};
  return http.createServer((req, res) => {
    try {
      const pathname = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
      if (pathname !== prefix && !pathname.startsWith(`${prefix}/`)) { res.writeHead(404).end(); return; }
      const relative = pathname.slice(prefix.length) || '/';
      let file = path.resolve(buildDir, `.${relative}`);
      if (file !== buildDir && !file.startsWith(`${buildDir}${path.sep}`)) { res.writeHead(403).end(); return; }
      if (fs.existsSync(file) && fs.statSync(file).isDirectory()) file = path.join(file, 'index.html');
      if (!exists(file) && exists(`${file}.html`)) file += '.html';
      if (!exists(file)) { res.writeHead(404).end('Not found'); return; }
      res.writeHead(200, {'Content-Type': mimes[path.extname(file)] || 'application/octet-stream', 'Cache-Control': 'no-store'});
      fs.createReadStream(file).pipe(res);
    } catch (error) { res.writeHead(500).end(String(error)); }
  });
}

async function prepareAudio(shots) {
  const audioDir = path.join(cacheDir, 'audio');
  ensureDir(audioDir);
  for (const shot of shots) {
    log(`Audio ${shot.position}/${shots.length}: ${shot.title}`);
    let sentenceTime = 0.5;
    shot.captionCues = [];
    const chunks = [];
    for (const [index, sentence] of shot.sentences.entries()) {
      const key = hash(`${voice}|${rate}|${sentence}`).slice(0, 20);
      const raw = path.join(audioDir, `${key}.aiff`);
      const wav = path.join(audioDir, `${key}.wav`);
      if (!exists(raw)) {
        const temporary = `${raw}.part.aiff`;
        await run('/usr/bin/say', ['-v', voice, '-r', rate, '-o', temporary, sentence]);
        fs.renameSync(temporary, raw);
      }
      if (!exists(wav)) {
        const temporary = `${wav}.part.wav`;
        await run(ffmpeg, ['-y', '-loglevel', 'error', '-i', raw, '-ar', '48000', '-ac', '1', '-c:a', 'pcm_s16le', temporary]);
        fs.renameSync(temporary, wav);
      }
      const seconds = await duration(wav);
      shot.captionCues.push({start: sentenceTime, end: sentenceTime + seconds, text: sentence});
      sentenceTime += seconds;
      chunks.push(wav);
    }
    const key = hash(JSON.stringify({voice, rate, sentences: shot.sentences, lead: 0.5, tail: 0.6, fps})).slice(0, 20);
    const concatFile = path.join(audioDir, `${key}.txt`);
    const audio = path.join(audioDir, `${key}-padded.wav`);
    fs.writeFileSync(concatFile, `${chunks.map(quoteConcat).join('\n')}\n`);
    // Quantize every shot to the frame grid, so concatenation never accumulates drift.
    shot.duration = Math.ceil((sentenceTime + 0.6) * fps) / fps;
    shot.frameCount = Math.round(shot.duration * fps);
    shot.audio = audio;
    if (!exists(audio)) {
      const temporary = `${audio}.part.wav`;
      await run(ffmpeg, ['-y', '-loglevel', 'error', '-f', 'concat', '-safe', '0', '-i', concatFile, '-af', 'adelay=500:all=1,apad', '-t', String(shot.duration), '-ar', '48000', '-ac', '1', '-c:a', 'pcm_s16le', temporary]);
      fs.renameSync(temporary, audio);
    }
  }
}

function writeNarrative(shots) {
  let current = 0;
  let subtitleIndex = 0;
  const subtitles = [];
  const assCues = [];
  const chapters = [];
  const transcript = [`# ${plan.title}`, '', `录制日期：${plan.date}。文档图文导览；界面截图不代表现场连续操作。`, '', `文档站：${plan.publicUrl}`, ''];
  for (const shot of shots) {
    shot.start = current;
    shot.end = current + shot.duration;
    if (!chapters.length || chapters[chapters.length - 1].index !== shot.chapterIndex) {
      chapters.push({index: shot.chapterIndex, title: shot.chapterTitle, start: current, end: shot.end, route: shot.route});
      transcript.push(`## ${String(shot.chapterIndex).padStart(2, '0')} ${shot.chapterTitle}`, '');
    } else chapters[chapters.length - 1].end = shot.end;
    transcript.push(`### ${timestamp(current, '.')} · ${shot.title}`, '', `页面：${plan.publicUrl.replace(/\/$/, '')}${shot.route}`, '', ...shot.sentences.map((text) => `${text}\n`));
    for (const cue of shot.captionCues) {
      subtitles.push(`${++subtitleIndex}\n${timestamp(current + cue.start)} --> ${timestamp(current + cue.end)}\n${wrapCaption(cue.text)}\n`);
      const assTime = (seconds) => timestamp(seconds, '.').replace(/^0/, '').slice(0, -1);
      const assText = wrapCaption(cue.text).replaceAll('\n', '\\N').replaceAll('{', '（').replaceAll('}', '）');
      assCues.push(`Dialogue: 0,${assTime(current + cue.start)},${assTime(current + cue.end)},Default,,0,0,0,,${assText}`);
    }
    current = shot.end;
  }
  fs.writeFileSync(paths.captions, subtitles.join('\n'));
  const assStyle = '[Script Info]\nScriptType: v4.00+\nPlayResX: 1600\nPlayResY: 900\nWrapStyle: 2\nScaledBorderAndShadow: yes\n\n[V4+ Styles]\nFormat: Name, Fontname, Fontsize, PrimaryColour, SecondaryColour, OutlineColour, BackColour, Bold, Italic, Underline, StrikeOut, ScaleX, ScaleY, Spacing, Angle, BorderStyle, Outline, Shadow, Alignment, MarginL, MarginR, MarginV, Encoding\nStyle: Default,PingFang SC,28,&H00FFFFFF,&H00FFFFFF,&H00000000,&H00000000,0,0,0,0,100,100,0,0,1,0,0,2,70,70,17,1\n\n[Events]\nFormat: Layer, Start, End, Style, Name, MarginL, MarginR, MarginV, Effect, Text\n';
  fs.writeFileSync(path.join(cacheDir, 'captions.ass'), `${assStyle}${assCues.join('\n')}\n`);
  fs.writeFileSync(paths.transcript, `${transcript.join('\n').trimEnd()}\n`);
  fs.writeFileSync(paths.chapters, `${JSON.stringify(chapters, null, 2)}\n`);
  return {chapters, duration: current};
}

async function waitForVisuals(page) {
  await page.evaluate(async () => {
    await document.fonts.ready;
    for (const image of document.images) image.loading = 'eager';
    await Promise.all([...document.images].map(async (image) => {
      if (!image.complete) await new Promise((resolve) => { image.addEventListener('load', resolve, {once: true}); image.addEventListener('error', resolve, {once: true}); });
      if (image.naturalWidth) await image.decode().catch(() => {});
    }));
  });
}

async function locateShot(page, shot) {
  return page.evaluate(({targetText, targetImage, targetSelector}) => {
    if (!targetText && !targetImage && !targetSelector) return {y: 0, kind: 'page', title: document.title};
    let element;
    if (targetImage) element = [...document.images].find((image) => image.alt.includes(targetImage));
    else if (targetSelector) element = document.querySelector(targetSelector);
    else element = [...document.querySelectorAll('main h2, main h3, article h2, article h3')].find((item) => item.textContent.includes(targetText));
    if (!element) throw new Error(`Missing shot target: ${targetImage || targetText || targetSelector}`);
    if (targetImage && (!element.complete || !element.naturalWidth)) throw new Error(`Image failed: ${targetImage}`);
    return {y: Math.max(0, element.getBoundingClientRect().top + scrollY - 90), kind: targetImage ? 'image' : 'section', src: targetImage ? element.currentSrc : undefined, alt: targetImage ? element.alt : undefined};
  }, shot);
}

async function cleanup(page) {
  // Remove all old recording decorations on EVERY shot, including same-route shots.
  await page.evaluate(() => {
    for (const element of document.querySelectorAll('[data-tour-overlay], [id^="tour-"]')) element.remove();
  });
}

async function focusImage(page, target, shot) {
  await page.evaluate(({target, title}) => {
    const overlay = document.createElement('section');
    overlay.setAttribute('data-tour-overlay', 'image');
    overlay.style.cssText = 'position:fixed;inset:76px 24px 16px;z-index:99999;background:#f7f9fc;border:1px solid #dbe4ef;box-shadow:0 20px 70px #0f172a33;border-radius:12px;padding:14px 18px 12px;display:flex;flex-direction:column;gap:10px;color:#17263c;font-family:-apple-system,BlinkMacSystemFont,"PingFang SC",sans-serif';
    const heading = document.createElement('div');
    heading.style.cssText = 'display:flex;justify-content:space-between;align-items:center;gap:24px;font-size:15px;flex:none';
    const strong = document.createElement('strong'); strong.textContent = title;
    const label = document.createElement('span'); label.textContent = '文档界面截图 · 完整 SciForge 工作区'; label.style.cssText = 'font-size:12px;color:#5f6f84';
    heading.append(strong, label);
    const image = document.createElement('img'); image.src = target.src; image.alt = target.alt;
    image.style.cssText = 'display:block;flex:1;min-height:0;width:100%;object-fit:contain;object-position:center;filter:none;box-shadow:none;border:none;margin:0;background:#fff';
    overlay.append(heading, image); document.body.append(overlay);
  }, {target, title: shot.title});
  await page.locator('[data-tour-overlay] img').evaluate(async (image) => image.decode());
}

async function renderShots(shots, fingerprint, preflight) {
  const {chromium} = loadPlaywright();
  const server = serverForBuild();
  await new Promise((resolve, reject) => { server.once('error', reject); server.listen(0, '127.0.0.1', resolve); });
  const base = `http://127.0.0.1:${server.address().port}${prefix}`;
  const browser = await chromium.launch({executablePath: chrome, headless: true, args: ['--hide-scrollbars', '--force-device-scale-factor=1']});
  const context = await browser.newContext({viewport: {width, height: viewportHeight}, deviceScaleFactor: 1, colorScheme: 'light', locale: 'zh-CN'});
  const page = await context.newPage();
  // The bundled ffmpeg does not require optional drawtext/libass filters.
  // Chrome renders the chapter/caption strip below the page viewport.
  const compositor = await context.newPage();
  await compositor.setViewportSize({width, height});
  await compositor.setContent(`<!doctype html><html lang="zh-CN"><meta charset="utf-8"><style>
    *{box-sizing:border-box}html,body{margin:0;width:${width}px;height:${height}px;overflow:hidden;background:#102844;font-family:-apple-system,BlinkMacSystemFont,'PingFang SC',sans-serif}
    #frame{position:absolute;inset:0;display:block;width:${width}px;height:${viewportHeight}px;object-fit:cover}
    #footer{position:absolute;top:${viewportHeight}px;left:0;right:0;bottom:0;padding:10px 42px 14px;color:#fff;background:#102844}
    #chapter{font-size:18px;line-height:25px;color:#abd5ff;white-space:nowrap;text-overflow:ellipsis;overflow:hidden}
    #subtitle{font-size:28px;line-height:35px;position:absolute;bottom:14px;left:65px;right:65px;text-align:center;white-space:pre-line;margin:0}
  </style><body><img id="frame" alt="文档页面"><footer id="footer"><div id="chapter"></div><p id="subtitle"></p></footer></body></html>`);
  page.setDefaultTimeout(20000);
  const failures = [];
  let currentRoute = null;
  try {
    for (const shot of shots) {
      const shotKey = hash(JSON.stringify({fingerprint, id: shot.id, targetText: shot.targetText, targetImage: shot.targetImage, targetSelector: shot.targetSelector, actions: shot.actions, title: shot.title, width, viewportHeight, frames: shot.frameCount})).slice(0, 20);
      const shotDir = path.join(cacheDir, 'shots', `${shot.id}-${shotKey}`);
      const marker = path.join(shotDir, 'complete.json');
      const video = path.join(shotDir, 'video.mp4');
      shot.video = video;
      shot.poster = path.join(shotDir, 'poster.jpg');
      if (!preflight && !refreshFrames && exists(video) && exists(marker)) { log(`Cached shot ${shot.position}/${shots.length}: ${shot.title}`); continue; }
      log(`${preflight ? 'Preflight' : 'Capture'} ${shot.position}/${shots.length}: ${shot.title}`);
      try {
        if (currentRoute !== shot.route) {
          const response = await page.goto(`${base}${shot.route}`, {waitUntil: 'networkidle'});
          if (!response?.ok()) throw new Error(`HTTP ${response?.status()}: ${shot.route}`);
          await waitForVisuals(page);
          currentRoute = shot.route;
        }
        await cleanup(page);
        const target = await locateShot(page, shot);
        for (const action of shot.actions || []) {
          const scope = action.region ? page.getByLabel(action.region, {exact: true}) : page;
          if (await scope.getByRole('button', {name: action.button, exact: true}).count() !== 1) throw new Error(`Missing/ambiguous action button: ${action.region} / ${action.button}`);
        }
        if (preflight) continue;
        ensureDir(shotDir);
        const startY = await page.evaluate(() => scrollY);
        const transitionFrames = shot.targetImage ? 0 : Math.min(7, shot.frameCount);
        const chapterLabel = `${String(shot.chapterIndex).padStart(2, '0')} / ${String(plan.chapters.length).padStart(2, '0')}   ${shot.chapterTitle}   ·   ${shot.title}`;
        const composed = new Map();
        let stillBuffer;
        let visualVersion = 0;
        const appliedActions = new Set();
        if (shot.targetImage) {
          await page.evaluate((y) => scrollTo(0, y), target.y);
          await focusImage(page, target, shot);
        }
        for (let frame = 0; frame < shot.frameCount; frame++) {
          const destination = path.join(shotDir, `frame-${String(frame + 1).padStart(5, '0')}.jpg`);
          const time = frame / fps;
          const cue = shot.captionCues.find((item) => item.start <= time && item.end > time);
          const caption = cue ? wrapCaption(cue.text) : '';
          for (const [index, action] of (shot.actions || []).entries()) {
            if (!appliedActions.has(index) && time >= shot.captionCues[action.sentence].start) {
              const scope = action.region ? page.getByLabel(action.region, {exact: true}) : page;
              await scope.getByRole('button', {name: action.button, exact: true}).click();
              await waitForVisuals(page);
              stillBuffer = undefined;
              visualVersion++;
              appliedActions.add(index);
              log(`  Interaction: ${action.region} → ${action.button}`);
            }
          }
          const moving = frame < transitionFrames;
          let buffer;
          if (moving) {
            const eased = 0.5 - Math.cos(Math.PI * (frame + 1) / transitionFrames) / 2;
            await page.evaluate((y) => scrollTo(0, y), startY + (target.y - startY) * eased);
            buffer = await page.screenshot({type: 'jpeg', quality: 94});
          } else {
            if (!stillBuffer) {
              await page.evaluate((y) => scrollTo(0, y), target.y);
              stillBuffer = await page.screenshot({type: 'jpeg', quality: 94});
            }
            buffer = stillBuffer;
          }
          const key = moving ? `transition-${frame}` : `${visualVersion}|${caption}`;
          if (fs.existsSync(destination)) fs.unlinkSync(destination);
          if (composed.has(key)) fs.linkSync(composed.get(key), destination);
          else {
            await compositor.evaluate(async ({source, chapterLabel, caption}) => {
              const image = document.querySelector('#frame'); image.src = source;
              document.querySelector('#chapter').textContent = chapterLabel;
              document.querySelector('#subtitle').textContent = caption;
              await image.decode(); await document.fonts.ready;
            }, {source: `data:image/jpeg;base64,${buffer.toString('base64')}`, chapterLabel, caption});
            await compositor.screenshot({path: destination, type: 'jpeg', quality: 94});
            composed.set(key, destination);
            if (!moving && !exists(shot.poster)) fs.copyFileSync(destination, shot.poster);
          }
        }
        log(`Encode shot ${shot.position}/${shots.length}, ${shot.duration.toFixed(2)} sec`);
        await run(ffmpeg, ['-y', '-loglevel', 'error', '-framerate', String(fps), '-i', path.join(shotDir, 'frame-%05d.jpg'), '-c:v', 'libx264', '-preset', 'fast', '-crf', '20', '-pix_fmt', 'yuv420p', '-r', '30', '-an', video]);
        fs.writeFileSync(marker, JSON.stringify({shot: shot.id, fingerprint, duration: shot.duration, frames: shot.frameCount}, null, 2));
      } catch (error) {
        failures.push({shot: shot.id, route: shot.route, error: error.message});
        if (!preflight) throw error;
      }
    }
  } finally {
    await context.close(); await browser.close(); await new Promise((resolve) => server.close(resolve));
  }
  if (failures.length) throw new Error(`Preflight failed:\n${JSON.stringify(failures, null, 2)}`);
}

async function assemble(shots, timing, fingerprint) {
  const videoConcat = path.join(cacheDir, 'video-concat.txt');
  const audioConcat = path.join(cacheDir, 'audio-concat.txt');
  const metadata = path.join(cacheDir, 'chapters.ffmetadata');
  const tempVideo = path.join(cacheDir, 'assembled.mp4');
  fs.writeFileSync(videoConcat, `${shots.map((shot) => quoteConcat(shot.video)).join('\n')}\n`);
  fs.writeFileSync(audioConcat, `${shots.map((shot) => quoteConcat(shot.audio)).join('\n')}\n`);
  fs.writeFileSync(metadata, `;FFMETADATA1\ntitle=${plan.title}\ncomment=文档图文功能讲解，包含完整 SciForge 工作区截图。\n${timing.chapters.map((chapter) => `[CHAPTER]\nTIMEBASE=1/1000\nSTART=${Math.round(chapter.start * 1000)}\nEND=${Math.round(chapter.end * 1000)}\ntitle=${chapter.title}\n`).join('')}`);
  log(`Final encode: ${timing.duration.toFixed(2)} sec, ${timing.chapters.length} chapters`);
  // Captions are already burned into the frame strip; also keep a selectable track.
  await run(ffmpeg, ['-y', '-loglevel', 'error', '-f', 'concat', '-safe', '0', '-i', videoConcat, '-f', 'concat', '-safe', '0', '-i', audioConcat, '-i', paths.captions, '-f', 'ffmetadata', '-i', metadata, '-map', '0:v', '-map', '1:a', '-map', '2:0', '-map_metadata', '3', '-map_chapters', '3', '-af', 'loudnorm=I=-16:LRA=7:TP=-1.5', '-c:v', 'copy', '-c:a', 'aac', '-ar', '48000', '-b:a', '160k', '-c:s', 'mov_text', '-metadata:s:s:0', 'language=zho', '-disposition:s:0', '0', '-t', String(timing.duration), '-movflags', '+faststart', tempVideo]);
  const details = JSON.parse(await run(ffprobe, ['-v', 'error', '-show_format', '-show_streams', '-show_chapters', '-of', 'json', tempVideo]));
  const actualDuration = Number(details.format.duration);
  if (Math.abs(actualDuration - timing.duration) > 0.2) throw new Error(`Duration mismatch: expected ${timing.duration}, got ${actualDuration}`);
  if (details.chapters.length !== plan.chapters.length) throw new Error('Chapter metadata was not preserved.');
  fs.copyFileSync(tempVideo, paths.video);
  await run(ffmpeg, ['-y', '-loglevel', 'error', '-ss', '2', '-i', paths.video, '-frames:v', '1', '-q:v', '2', paths.poster]);
  const manifest = {title: plan.title, createdAt: new Date().toISOString(), publicUrl: plan.publicUrl, production: 'Sentence-timed narration over documentation pages and labelled whole-workspace screenshots; not a continuous scientific run.', buildFingerprint: fingerprint, voice, voiceRate: rate, width, height, duration: actualDuration, bytes: fs.statSync(paths.video).size, files: paths, chapters: timing.chapters, shots: shots.map(({id, chapterIndex, title, route, targetImage, targetText, targetSelector, actions, sentences, start, end, duration: seconds, captionCues, audio, video}) => ({id, chapterIndex, title, route, targetImage, targetText, targetSelector, actions, sentences, start, end, duration: seconds, captionCues, audio, video})), checks: {audioVideoDriftSeconds: actualDuration - timing.duration, chapterCount: details.chapters.length, subtitles: details.streams.some((stream) => stream.codec_type === 'subtitle'), video: details.streams.filter((stream) => stream.codec_type === 'video').map(({codec_name, width, height}) => ({codec_name, width, height}))}};
  fs.writeFileSync(paths.manifest, `${JSON.stringify(manifest, null, 2)}\n`);
  log(`Done: ${paths.video}`);
}

async function main() {
  ensureDir(outputDir); ensureDir(cacheDir);
  if (finalizeOnly) {
    if (!exists(paths.manifest)) throw new Error('--finalize needs a completed production manifest.');
    const manifest = JSON.parse(fs.readFileSync(paths.manifest, 'utf8'));
    const timing = {chapters: manifest.chapters, duration: manifest.shots.reduce((total, shot) => total + shot.duration, 0)};
    await assemble(manifest.shots, timing, manifest.buildFingerprint);
    return;
  }
  const shots = plan.chapters.flatMap((chapter, index) => chapter.shots.map((shot) => ({...shot, chapterIndex: index + 1, chapterTitle: chapter.title})));
  shots.forEach((shot, i) => { shot.position = i + 1; });
  if (preflightOnly) {
    if (!exists(path.join(buildDir, 'index.html'))) throw new Error('Build first: npm run build');
    await renderShots(shots, buildFingerprint(), true);
    log(`Preflight passed: ${shots.length} shots, ${plan.chapters.length} chapters`);
    return;
  }
  await prepareAudio(shots);
  const timing = writeNarrative(shots);
  fs.writeFileSync(path.join(cacheDir, 'audio-timing.json'), JSON.stringify({voice, rate, ...timing, shots}, null, 2));
  log(`Narration ready: ${(timing.duration / 60).toFixed(2)} minutes across ${shots.length} shots`);
  if (audioOnly) return;
  if (!exists(path.join(buildDir, 'index.html'))) throw new Error('Build first: npm run build');
  const fingerprint = buildFingerprint();
  await renderShots(shots, fingerprint, false);
  await assemble(shots, timing, fingerprint);
}

main().catch((error) => { console.error(error.stack || error); console.error(`Intermediate files retained for recovery: ${cacheDir}`); process.exitCode = 1; });
