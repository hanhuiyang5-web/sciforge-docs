#!/usr/bin/env node
'use strict';
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const {spawnSync} = require('node:child_process');
const plan = require('./tour-plan.cjs');
const outputDir = path.resolve(__dirname, '../recordings');
const video = path.join(outputDir, `${plan.slug}.mp4`);
const manifest = JSON.parse(fs.readFileSync(path.join(outputDir, `${plan.slug}-manifest.json`), 'utf8'));
const ffmpeg = process.env.FFMPEG || '/opt/homebrew/bin/ffmpeg';
const ffprobe = process.env.FFPROBE || '/opt/homebrew/bin/ffprobe';
function run(command, args, useStderr = false) {
  const result = spawnSync(command, args, {encoding: 'utf8', maxBuffer: 5 * 1024 * 1024});
  if (result.status !== 0) throw new Error(`${command} failed: ${result.stderr}`);
  return useStderr ? result.stderr : result.stdout;
}
const details = JSON.parse(run(ffprobe, ['-v', 'error', '-show_format', '-show_streams', '-show_chapters', '-of', 'json', video]));
const videoStream = details.streams.find((stream) => stream.codec_type === 'video');
const audioStream = details.streams.find((stream) => stream.codec_type === 'audio');
if (videoStream.codec_name !== 'h264' || videoStream.width !== 1600 || videoStream.height !== 900) throw new Error('Unexpected video format');
if (audioStream.codec_name !== 'aac' || audioStream.sample_rate !== '48000') throw new Error('Expected 48 kHz AAC');
if (details.chapters.length !== plan.chapters.length) throw new Error('Chapter count mismatch');
const cues = manifest.shots.flatMap((shot) => shot.captionCues.map((cue) => ({...cue, start: shot.start + cue.start, end: shot.start + cue.end})));
for (let i = 0; i < cues.length; i++) {
  if (cues[i].end <= cues[i].start || (i > 0 && cues[i].start < cues[i - 1].end - 0.001)) throw new Error(`Invalid caption interval ${i}`);
}
console.log('Decoding the complete final video and audio…');
run(ffmpeg, ['-v', 'error', '-i', video, '-map', '0:v:0', '-map', '0:a:0', '-f', 'null', '-']);
const volumeLog = run(ffmpeg, ['-hide_banner', '-i', video, '-map', '0:a:0', '-af', 'volumedetect', '-f', 'null', '-'], true);
const meanVolumeDb = Number(volumeLog.match(/mean_volume: ([-\d.]+) dB/)?.[1]);
const maxVolumeDb = Number(volumeLog.match(/max_volume: ([-\d.]+) dB/)?.[1]);
const finalCue = cues.at(-1);
const finalVolumeLog = run(ffmpeg, ['-hide_banner', '-ss', String(finalCue.start), '-i', video, '-t', String(finalCue.end - finalCue.start), '-map', '0:a:0', '-af', 'volumedetect', '-f', 'null', '-'], true);
const finalSentenceMeanDb = Number(finalVolumeLog.match(/mean_volume: ([-\d.]+) dB/)?.[1]);
if (!Number.isFinite(meanVolumeDb) || meanVolumeDb < -50 || !Number.isFinite(finalSentenceMeanDb) || finalSentenceMeanDb < -50) throw new Error('Audio is silent or unexpectedly quiet.');
const imageDir = path.join(outputDir, 'quality');
fs.mkdirSync(imageDir, {recursive: true});
const keyframes = [];
for (const id of ['welcome', 'home-capabilities', 'sandbox', 'atlas-figure', 'benchmark-status', 'extensions', 'finish']) {
  const shot = manifest.shots.find((item) => item.id === id);
  const at = shot.start + Math.min(5, shot.duration / 2);
  const file = path.join(imageDir, `${id}.jpg`);
  run(ffmpeg, ['-y', '-loglevel', 'error', '-ss', String(at), '-i', video, '-frames:v', '1', '-q:v', '2', file]);
  keyframes.push({shot: id, at, file});
}
const report = {
  checkedAt: new Date().toISOString(),
  video,
  sha256: crypto.createHash('sha256').update(fs.readFileSync(video)).digest('hex'),
  fullDecodePassed: true,
  duration: Number(details.format.duration),
  bytes: Number(details.format.size),
  videoFormat: {codec: videoStream.codec_name, width: videoStream.width, height: videoStream.height, frameRate: videoStream.avg_frame_rate},
  audioFormat: {codec: audioStream.codec_name, sampleRate: Number(audioStream.sample_rate), channels: audioStream.channels},
  audioLevels: {meanVolumeDb, maxVolumeDb, finalSentenceMeanDb},
  finalSentenceEndsAt: finalCue.end,
  trailingPaddingSeconds: Number(details.format.duration) - finalCue.end,
  chapterCount: details.chapters.length,
  subtitleCueCount: cues.length,
  subtitleIntervalsValid: true,
  keyframes,
};
const output = path.join(outputDir, `${plan.slug}-quality.json`);
fs.writeFileSync(output, `${JSON.stringify(report, null, 2)}\n`);
console.log(JSON.stringify({report: output, ...report}, null, 2));
