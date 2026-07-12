# Voice Wall 보이스 메모 월

[English](README.md) | [中文](README.zh-CN.md)

Voice Wall은 GitHub Pages에 배포할 수 있는 정적 PWA입니다. 브라우저에서 60초 이내의 보이스 메모를 녹음하고, 로컬 벽에 저장하며, QR 코드로 친구에게 공유할 수 있습니다. QR 코드를 스캔하면 브라우저에서 바로 재생됩니다.

## 기능

- 60초 이내 녹음, 미리 듣기, 다시 녹음, 로컬 저장
- IndexedDB 기반 로컬 보이스 월
- 여섯 가지 고유 패턴 테마: Letter (줄노트), Ribbon (리본), Record (바이닐), Ticket (티켓 홈), Stamp (우표 톱니), Bloom (꽃잎)
- Supabase Storage를 통한 공유 오디오 업로드
- 공유 기간: 1일, 2일, 7일
- QR 코드 생성, 링크 복사, QR 이미지 다운로드
- 모바일 홈 화면에 설치 가능한 PWA
- 영어, 중국어, 한국어 UI 지원, 기본 언어는 영어

## Supabase 설정

### 1. 데이터베이스 테이블과 스토리지 버킷 만들기

Supabase 프로젝트에서 `supabase.sql`을 실행합니다.

이 스크립트는 다음 항목을 생성합니다:

- 공유 기록을 저장하는 `shared_notes` 테이블
- 오디오 파일을 저장하는 `voice-notes` Storage bucket
- 공개 재생과 익명 업로드를 위한 RLS 정책

### 2. 로컬 개발 설정

`config.js`에는 로컬 미리보기에 필요한 Supabase 런타임 설정이 들어 있습니다.

### 3. GitHub Pages 배포 설정

저장소의 `Settings > Secrets and variables > Actions`에 다음 항목을 추가합니다:

| Type | Name | Value |
|------|------|-------|
| Variable | `SUPABASE_URL` | `https://rpszhuzixljcwvitbqdv.supabase.co` |
| Secret | `SUPABASE_ANON_KEY` | Supabase publishable key |
| Variable | `SUPABASE_BUCKET` | `voice-notes` |
| Variable | `SUPABASE_TABLE` | `shared_notes` |

GitHub Actions는 배포 중에 `config.js`를 생성합니다.

## GitHub Pages 배포

저장소에서 Pages를 활성화합니다:

1. `Settings > Pages`를 엽니다
2. Source를 `GitHub Actions`로 설정합니다
3. `master` 브랜치에 push합니다

배포 주소:

```text
https://benjamin-jhou.github.io/voice-wall/
```

## 로컬 미리보기

```bash
python3 -m http.server 4173
```

브라우저에서 `http://localhost:4173`을 엽니다.

## 프로젝트 구조

- `index.html`: 정적 앱 진입점
- `app.js`: 녹음, 로컬 월, 공유, QR, 재생, 다국어 로직
- `styles.css`: 반응형 시각 디자인과 메모 테마
- `config.js`: 런타임 Supabase 설정
- `manifest.webmanifest`: PWA manifest
- `sw.js`: 오프라인 캐시 Service Worker
- `supabase.sql`: 테이블, 버킷, RLS 설정
- `.github/workflows/pages.yml`: GitHub Pages 배포 워크플로
