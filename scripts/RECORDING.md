# 制作文档导览视频

镜头内容在 `tour-plan.cjs`，制作流程在 `record-tour.cjs`。每个镜头的每句话单独合成旁白，并使用真实音频时长决定字幕和镜头的时间。章节不会平均切分旁白。

默认输出为 1600 × 900、30 fps、H.264 / AAC 的 MP4，包含烧录中文字幕、可选中文字幕轨和九个章节。网页占上方 784 像素；章节与字幕占下方独立区域，避免遮挡正文。案例截图以完整 SciForge 工作区展示，并标记为文档界面截图。

## 环境

- macOS `say`，默认中文声音 `Tingting`
- Google Chrome
- 已安装的 `playwright-core`
- `/opt/homebrew/bin/ffmpeg` 和 `ffprobe`

脚本不安装依赖。环境变量 `PLAYWRIGHT_CORE`、`CHROME`、`FFMPEG` 和 `FFPROBE` 可以指定现有工具路径。`TOUR_VOICE` 和 `TOUR_VOICE_RATE` 可以调整声音，默认速率为 230。

## 制作顺序

在文档项目根目录运行：

```sh
node scripts/record-tour.cjs --audio-only
npm run build
node scripts/record-tour.cjs --preflight
node scripts/record-tour.cjs
```

第一步提前生成可复用音频缓存、逐句 SRT、旁白稿与 `chapters.json`。预检只打开本地构建并核对每个镜头的标题或截图，不生成视频。正式录制必须在新页面构建完成之后运行。

默认结果在 `recordings/`：

- `sciforge-guide-2026-09-05.mp4`
- `sciforge-guide-2026-09-05-captions.srt`
- `sciforge-guide-2026-09-05-transcript.md`
- `sciforge-guide-2026-09-05-poster.jpg`
- `sciforge-guide-2026-09-05-manifest.json`
- `chapters.json`：`index`、`title`、`start`、`end`、`route`

`--output-dir <目录>` 和 `--build-dir <目录>` 可指定其他位置。视频不会自动上传或提交到 GitHub。

## 恢复与核验

音频、帧和分镜 MP4 保留在 `recordings/.cache/`。失败后运行相同命令，已完成的镜头会复用；更改声音或文字会生成对应的新音频。构建文件或录制脚本变化会使旧画面缓存失效。

`--refresh-frames` 强制重制画面，不影响音频缓存。正式导出前脚本检查音画总时长、分辨率、中文字幕轨与章节数，并把每个镜头的来源页面和精确时间保存到 manifest。

已完成一轮导出后，可用 `--finalize` 从现有 manifest 复用所有分镜，仅重新合流音频与字幕。最终 AAC 显式使用 48 kHz，避免响度处理改变采样率造成播放器兼容问题。

运行 `node scripts/check-tour.cjs` 可完整解码成片，核对音频采样率、字幕区间、章节数和末句余量，同时把七张关键帧与质量报告保存到 `recordings/quality/` 和 `recordings/sciforge-guide-2026-09-05-quality.json`。

人工验收时至少查看首页、只读设置、两个案例、扩展和结束画面，检查字幕与旁白一致、底条不遮正文、放大的截图仍保留完整工作区。案例二的实验性状态必须保留；该片不是完整模型运行的证明。
