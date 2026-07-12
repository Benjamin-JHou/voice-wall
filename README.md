# Voice Wall 语音便签墙

一个可部署到 GitHub Pages 的静态 PWA。用户通过浏览器录制 60 秒以内的语音便签，保存到本机便签墙，并可上传到 Supabase Storage 生成二维码，扫码后直接播放。

## 功能

- 60 秒录音、试听、重录和本地保存
- IndexedDB 本机便签墙
- 多种图案主题：信笺、丝带、唱片、票根、邮票、花纹
- Supabase Storage 上传音频
- 分享有效期：长期有效、7 天、30 天
- 二维码分享、复制链接、下载二维码图片
- PWA 安装到手机桌面

## Supabase 配置

### 1. 创建数据库表

在 Supabase 项目 SQL Editor 中执行 `supabase.sql`。

该脚本会创建：
- `shared_notes` 表（分享记录）
- `voice-notes` Storage bucket（音频文件）
- 对应的 RLS 策略

### 2. 配置本地开发

`config.js` 已写入当前 Supabase 项目凭据，本地预览即可使用。

### 3. 配置 GitHub Pages 部署

在 GitHub 仓库 Settings 中添加以下配置：

| 类型 | 名称 | 值 |
|------|------|-----|
| Variable | `SUPABASE_URL` | `https://rpszhuzixljcwvitbqdv.supabase.co` |
| Secret | `SUPABASE_ANON_KEY` | Supabase 项目的 publishable key |
| Variable | `SUPABASE_BUCKET` | `voice-notes` |
| Variable | `SUPABASE_TABLE` | `shared_notes` |

推送 `main` 分支后，GitHub Actions 会自动生成运行时 `config.js` 并部署。

## 技术说明

本项目是纯静态 PWA，通过 CDN 加载 `@supabase/supabase-js`。不需要 Next.js SSR、Server Components 或中间件。所有 Supabase 调用在浏览器端完成，使用 publishable key 即可。

## GitHub Pages 部署

仓库 Settings 中启用 Pages：

1. 打开 `Settings > Pages`
2. Source 选择 `GitHub Actions`
3. 推送 `main` 分支

## 本地预览

```bash
python3 -m http.server 4173
```

浏览器访问 `http://localhost:4173`。

## 文件结构

- `index.html`：应用入口
- `app.js`：录音、便签墙、分享和播放逻辑
- `styles.css`：界面视觉和响应式样式
- `config.js`：运行时的 Supabase 凭据
- `manifest.webmanifest`：PWA 配置
- `sw.js`：离线缓存 Service Worker
- `supabase.sql`：表、存储桶和 RLS 策略
- `.github/workflows/pages.yml`：GitHub Pages 部署流程
