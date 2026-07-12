# Voice Wall 语音便签墙

[English](README.md) | [한국어](README.ko-KR.md)

Voice Wall 是一个可部署到 GitHub Pages 的静态 PWA。用户可以通过浏览器录制 60 秒以内的语音便签，保存到本机便签墙，并通过二维码分享给朋友，扫描即可播放。

## 功能

- 60 秒以内录音、试听、重录和本地保存
- 使用 IndexedDB 保存本机便签墙
- 六种图案主题：信笺、丝带、唱片、票根、邮票、花纹
- 使用 Supabase Storage 上传分享音频
- 分享有效期：长期有效、7 天、30 天
- 生成二维码、复制链接、下载二维码图片
- 支持安装到手机桌面的 PWA
- 支持英文、中文、韩语界面，默认语言为英文

## Supabase 配置

### 1. 创建数据库表和存储桶

在 Supabase 项目中执行 `supabase.sql`。

该脚本会创建：

- `shared_notes` 表，用于保存分享记录
- `voice-notes` Storage bucket，用于保存音频文件
- 支持公开播放和匿名上传的 RLS 策略

### 2. 本地开发配置

`config.js` 包含本地预览所需的 Supabase 运行时配置。

### 3. GitHub Pages 部署配置

在仓库 `Settings > Secrets and variables > Actions` 中添加：

| 类型 | 名称 | 值 |
|------|------|-----|
| Variable | `SUPABASE_URL` | `https://rpszhuzixljcwvitbqdv.supabase.co` |
| Secret | `SUPABASE_ANON_KEY` | Supabase publishable key |
| Variable | `SUPABASE_BUCKET` | `voice-notes` |
| Variable | `SUPABASE_TABLE` | `shared_notes` |

GitHub Actions 会在部署时生成 `config.js`。

## GitHub Pages 部署

在仓库中启用 Pages：

1. 打开 `Settings > Pages`
2. Source 选择 `GitHub Actions`
3. 推送到 `master` 分支

线上地址：

```text
https://benjamin-jhou.github.io/voice-wall/
```

## 本地预览

```bash
python3 -m http.server 4173
```

浏览器访问 `http://localhost:4173`。

## 文件结构

- `index.html`：静态应用入口
- `app.js`：录音、本地便签墙、分享、二维码、播放和多语言逻辑
- `styles.css`：响应式视觉设计和便签主题
- `config.js`：运行时 Supabase 配置
- `manifest.webmanifest`：PWA manifest
- `sw.js`：离线缓存 Service Worker
- `supabase.sql`：表、存储桶和 RLS 配置
- `.github/workflows/pages.yml`：GitHub Pages 部署流程
