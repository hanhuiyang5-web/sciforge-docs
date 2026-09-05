# SciForge Documentation

SciForge 中文使用文档，基于 Docusaurus 3 构建并通过 GitHub Pages 发布。

## 本地开发

```bash
npm install
npm start
```

默认开发地址为 `http://localhost:3000/sciforge-docs/`。

## 构建检查

```bash
npm run typecheck
npm run build
```

静态文件生成到 `build/`。

使用 `npm run preview` 在 `http://127.0.0.1:3025/sciforge-docs/` 检查静态构建。该预览服务支持视频 Range 请求。

## 页面与视频维护

首页围绕案例、快速开始与按目标分类的功能手册组织；文档页支持本地全文搜索、截图放大、键盘操作和暗色模式。

- 正文保存在 `docs/`。`npm start` 和 `npm run build` 前会自动生成全文搜索索引。
- 视频导览位于 `/guide`，支持章节跳转、中文字幕和文件下载。
- 重录流程见 [制作说明](scripts/RECORDING.md)。录制完成后运行 `npm run video:prepare`，将通过校验的视频、字幕与时间线准备到站点中，再重新构建。
- `recordings/` 是本地制作缓存，不进入版本库。网站仅发布 `static/video/` 中的最终文件。

## 发布

推送到 `main` 后，`.github/workflows/deploy.yml` 会构建并部署 GitHub Pages。

仓库需要在 **Settings → Pages → Build and deployment** 中选择 **GitHub Actions**。

目标地址：`https://hanhuiyang5-web.github.io/sciforge-docs/`

## 内容原则

- 功能事实以当前 SciForge 源码和真实界面为准。
- 实验性或部分可用能力必须明确标注。
- 公开仓库只保存审核后的文档与脱敏截图，不包含 `SciForge_private` 源码。
- 操作型页面应说明权限、外部影响、完成标志和已知限制。
