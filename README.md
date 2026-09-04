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

## 发布

推送到 `main` 后，`.github/workflows/deploy.yml` 会构建并部署 GitHub Pages。

仓库需要在 **Settings → Pages → Build and deployment** 中选择 **GitHub Actions**。

目标地址：`https://hanhuiyang5-web.github.io/sciforge-docs/`

## 内容原则

- 功能事实以当前 SciForge 源码和真实界面为准。
- 实验性或部分可用能力必须明确标注。
- 公开仓库只保存审核后的文档与脱敏截图，不包含 `SciForge_private` 源码。
- 操作型页面应说明权限、外部影响、完成标志和已知限制。
