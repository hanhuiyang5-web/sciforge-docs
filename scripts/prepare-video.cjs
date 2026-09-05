const fs = require('node:fs');
const path = require('node:path');
const {createHash} = require('node:crypto');
const root = path.resolve(__dirname, '..');
const plan = require('./tour-plan.cjs');
const source = path.join(root, 'recordings');
const destination = path.join(root, 'static/video');
const manifest = JSON.parse(fs.readFileSync(path.join(source, `${plan.slug}-manifest.json`), 'utf8'));
if (!manifest.checks.subtitles || manifest.checks.chapterCount !== plan.chapters.length || Math.abs(manifest.checks.audioVideoDriftSeconds) > .2) throw new Error('Video validation must pass before preparing website assets.');
const outputs = [
  [`${plan.slug}.mp4`, `${plan.slug}.mp4`],
  [`${plan.slug}-poster.jpg`, 'poster.jpg'],
  [`${plan.slug}-captions.srt`, 'captions.srt'],
  [`${plan.slug}-transcript.md`, 'transcript.md'],
];
for (const [file] of outputs) if (!fs.existsSync(path.join(source,file))) throw new Error(`Missing video asset: ${file}`);
fs.mkdirSync(destination,{recursive:true});
for (const [from,to] of outputs) fs.copyFileSync(path.join(source,from),path.join(destination,to));
const transcriptPath = path.join(destination,'transcript.md');
fs.writeFileSync(transcriptPath,fs.readFileSync(transcriptPath,'utf8').trimEnd()+'\n');
const srt = fs.readFileSync(path.join(destination,'captions.srt'),'utf8');
fs.writeFileSync(path.join(destination,'captions.vtt'),'WEBVTT\n\n'+srt.replace(/(\d{2}:\d{2}:\d{2}),(\d{3})/g,'$1.$2'));
const chapters = manifest.chapters.map(({title,start,route}) => ({title,start,route}));
const revision = createHash('sha256').update(fs.readFileSync(path.join(source,`${plan.slug}.mp4`))).digest('hex').slice(0,12);
fs.writeFileSync(path.join(root,'src/data/tour.json'),JSON.stringify({ready:true,revision,duration:manifest.duration,chapters},null,2)+'\n');
console.log(`Prepared ${chapters.length} chapters and ${(manifest.bytes/1024/1024).toFixed(1)} MiB video for /guide`);
