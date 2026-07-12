# Voice Wall

[中文](README.zh-CN.md) | [한국어](README.ko-KR.md)

Voice Wall is a static PWA for recording voice notes under 60 seconds, pinning them to a local wall, and sharing them through QR codes. Friends can scan a QR code and play the voice note instantly in the browser.

## Features

- Record, preview, re-record, and save voice notes under 60 seconds
- Local voice wall powered by IndexedDB
- Six visual note themes: Letter, Ribbon, Record, Ticket, Stamp, and Bloom
- Supabase Storage uploads for shared audio files
- Sharing periods: no expiry, 7 days, or 30 days
- QR code generation, link copy, and QR image download
- Installable PWA for mobile home screens
- English, Chinese, and Korean UI, with English as the default language

## Supabase Setup

### 1. Create the database table and storage bucket

Run `supabase.sql` in your Supabase project.

The script creates:

- `shared_notes` table for share records
- `voice-notes` Storage bucket for audio files
- RLS policies for public share playback and anonymous uploads

### 2. Local development config

`config.js` contains the runtime Supabase configuration for local preview.

### 3. GitHub Pages deployment config

Add the following settings in `Settings > Secrets and variables > Actions`:

| Type | Name | Value |
|------|------|-------|
| Variable | `SUPABASE_URL` | `https://rpszhuzixljcwvitbqdv.supabase.co` |
| Secret | `SUPABASE_ANON_KEY` | Supabase publishable key |
| Variable | `SUPABASE_BUCKET` | `voice-notes` |
| Variable | `SUPABASE_TABLE` | `shared_notes` |

The GitHub Actions workflow generates `config.js` during deployment.

## GitHub Pages Deployment

Enable Pages in the repository:

1. Open `Settings > Pages`
2. Set Source to `GitHub Actions`
3. Push to the `master` branch

The live app is available at:

```text
https://benjamin-jhou.github.io/voice-wall/
```

## Local Preview

```bash
python3 -m http.server 4173
```

Open `http://localhost:4173` in your browser.

## Project Structure

- `index.html`: static app entry
- `app.js`: recording, local wall, sharing, QR, playback, and i18n logic
- `styles.css`: responsive visual design and note themes
- `config.js`: runtime Supabase config
- `manifest.webmanifest`: PWA manifest
- `sw.js`: offline cache service worker
- `supabase.sql`: table, bucket, and RLS setup
- `.github/workflows/pages.yml`: GitHub Pages deployment workflow
