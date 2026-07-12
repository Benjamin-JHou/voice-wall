const MAX_SECONDS = 60;
const DB_NAME = "voice-wall-db";
const STORE_NAME = "notes";
const LANGUAGE_KEY = "voice-wall-language";
const THEMES = [
  { id: "letter", accent: "#b53c49" },
  { id: "ribbon", accent: "#8f2f57" },
  { id: "record", accent: "#262f25" },
  { id: "ticket", accent: "#b77b2e" },
  { id: "stamp", accent: "#3f695a" },
  { id: "bloom", accent: "#9a4f32" }
];

const I18N = {
  en: {
    code: "en",
    htmlLang: "en",
    locale: "en-US",
    label: "EN",
    appName: "Voice Wall",
    install: "Install",
    settings: "Setup",
    heroEyebrow: "Voice cards under 60 seconds",
    heroTitle: "Turn one sentence into a note your friends can scan and hear.",
    heroText: "Record, choose a pattern, and generate a QR code. Friends can scan and play it instantly for birthdays, travel notes, farewells, and everyday affection.",
    themesLabel: "Note patterns",
    pinboard: "Pinboard",
    wallTitle: "Local Voice Wall",
    noteCount: (count) => `${count} voice ${count === 1 ? "note" : "notes"}`,
    titleLabel: "Note title",
    titlePlaceholder: "Name this voice note",
    record: "Record",
    stop: "Stop",
    preview: "Preview",
    pin: "Pin to wall",
    serviceConnected: "Sharing service connected",
    serviceMissing: "Recording and local saving work before Supabase is configured",
    play: "Play",
    qrCode: "QR code",
    delete: "Delete",
    emptyWall: "Your first voice note will appear here.",
    shareDialogLabel: "Share QR code",
    close: "Close",
    expiryLabel: "Sharing period",
    forever: "No expiry",
    days7: "7 days",
    days30: "30 days",
    createQr: "Create QR code",
    copyLink: "Copy link",
    downloadQr: "Download QR",
    noteDefaultTitle: "Untitled voice",
    settingsToast: "Configure Supabase variables in GitHub Pages to create public QR codes.",
    noRecorder: "This browser does not support recording.",
    micPermission: "Allow microphone access in your browser.",
    noteSaved: "Voice note pinned to the wall.",
    noteDeleted: "Voice note deleted.",
    supabaseMissing: "Configure Supabase URL and anon key first.",
    linkCopied: "Link copied.",
    shareNotConfiguredTitle: "Sharing is not configured",
    shareNotConfiguredText: "Check the Supabase configuration for GitHub Pages.",
    shareMissingTitle: "This voice note was not found",
    shareMissingText: "The QR code may point to a deleted share record.",
    shareExpiredTitle: "This voice note has expired",
    shareExpiredText: "The sender made this voice note available for a limited time.",
    sharedBack: "Open Voice Wall",
    loadingTitle: "Fetching this voice note",
    backHome: "Back home",
    themes: {
      letter: { name: "Letter", scene: "Everyday" },
      ribbon: { name: "Ribbon", scene: "Love" },
      record: { name: "Record", scene: "Friends" },
      ticket: { name: "Ticket", scene: "Travel" },
      stamp: { name: "Stamp", scene: "Memory" },
      bloom: { name: "Bloom", scene: "Birthday" }
    }
  },
  zh: {
    code: "zh",
    htmlLang: "zh-CN",
    locale: "zh-CN",
    label: "中文",
    appName: "Voice Wall",
    install: "安装",
    settings: "配置",
    heroEyebrow: "60 秒以内的声音卡片",
    heroTitle: "把一句话，留成能被扫码听见的便签。",
    heroText: "录音、选图案、生成二维码。朋友扫描后直接播放，适合生日祝福、旅行留言、临别短句和日常心意。",
    themesLabel: "便签图案",
    pinboard: "Pinboard",
    wallTitle: "本机便签墙",
    noteCount: (count) => `${count} 条声音便签`,
    titleLabel: "便签标题",
    titlePlaceholder: "给这条声音起个名字",
    record: "录音",
    stop: "停止",
    preview: "试听",
    pin: "贴上墙",
    serviceConnected: "分享服务已连接",
    serviceMissing: "未配置 Supabase 时可录音和本地保存",
    play: "播放",
    qrCode: "二维码",
    delete: "删除",
    emptyWall: "第一条声音便签会出现在这里。",
    shareDialogLabel: "分享二维码",
    close: "关闭",
    expiryLabel: "分享有效期",
    forever: "长期有效",
    days7: "7 天",
    days30: "30 天",
    createQr: "生成二维码",
    copyLink: "复制链接",
    downloadQr: "下载二维码",
    noteDefaultTitle: "未命名声音",
    settingsToast: "在 GitHub Pages 变量中配置 Supabase 后即可生成公开二维码。",
    noRecorder: "当前浏览器缺少录音能力。",
    micPermission: "请允许浏览器使用麦克风。",
    noteSaved: "便签已贴上墙。",
    noteDeleted: "便签已删除。",
    supabaseMissing: "请先配置 Supabase URL 和 anon key。",
    linkCopied: "链接已复制。",
    shareNotConfiguredTitle: "分享服务尚未配置",
    shareNotConfiguredText: "请检查 GitHub Pages 的 Supabase 配置。",
    shareMissingTitle: "没有找到这条声音",
    shareMissingText: "二维码可能来自已删除的分享记录。",
    shareExpiredTitle: "这条声音已经过期",
    shareExpiredText: "分享人设置了限时可听。",
    sharedBack: "打开语音便签墙",
    loadingTitle: "正在取出这条声音",
    backHome: "返回首页",
    themes: {
      letter: { name: "信笺", scene: "日常" },
      ribbon: { name: "丝带", scene: "告白" },
      record: { name: "唱片", scene: "朋友" },
      ticket: { name: "票根", scene: "旅行" },
      stamp: { name: "邮票", scene: "纪念" },
      bloom: { name: "花纹", scene: "生日" }
    }
  },
  ko: {
    code: "ko",
    htmlLang: "ko",
    locale: "ko-KR",
    label: "한국어",
    appName: "Voice Wall",
    install: "설치",
    settings: "설정",
    heroEyebrow: "60초 안의 보이스 카드",
    heroTitle: "한 문장을 스캔해서 들을 수 있는 메모로 남기세요.",
    heroText: "녹음하고 패턴을 고른 뒤 QR 코드를 만드세요. 친구는 스캔만 하면 바로 들을 수 있어 생일, 여행, 작별 인사, 일상 마음을 전하기 좋습니다.",
    themesLabel: "메모 패턴",
    pinboard: "Pinboard",
    wallTitle: "내 기기의 보이스 월",
    noteCount: (count) => `보이스 메모 ${count}개`,
    titleLabel: "메모 제목",
    titlePlaceholder: "이 보이스 메모의 이름",
    record: "녹음",
    stop: "정지",
    preview: "미리 듣기",
    pin: "벽에 붙이기",
    serviceConnected: "공유 서비스 연결됨",
    serviceMissing: "Supabase 설정 전에도 녹음과 로컬 저장을 사용할 수 있습니다",
    play: "재생",
    qrCode: "QR 코드",
    delete: "삭제",
    emptyWall: "첫 번째 보이스 메모가 여기에 표시됩니다.",
    shareDialogLabel: "QR 코드 공유",
    close: "닫기",
    expiryLabel: "공유 기간",
    forever: "기한 없음",
    days7: "7일",
    days30: "30일",
    createQr: "QR 코드 만들기",
    copyLink: "링크 복사",
    downloadQr: "QR 다운로드",
    noteDefaultTitle: "제목 없는 보이스",
    settingsToast: "GitHub Pages 변수에 Supabase를 설정하면 공개 QR 코드를 만들 수 있습니다.",
    noRecorder: "이 브라우저는 녹음을 지원하지 않습니다.",
    micPermission: "브라우저에서 마이크 접근을 허용하세요.",
    noteSaved: "보이스 메모를 벽에 붙였습니다.",
    noteDeleted: "보이스 메모를 삭제했습니다.",
    supabaseMissing: "Supabase URL과 anon key를 먼저 설정하세요.",
    linkCopied: "링크를 복사했습니다.",
    shareNotConfiguredTitle: "공유 설정이 필요합니다",
    shareNotConfiguredText: "GitHub Pages의 Supabase 설정을 확인하세요.",
    shareMissingTitle: "이 보이스 메모를 찾을 수 없습니다",
    shareMissingText: "QR 코드가 삭제된 공유 기록을 가리킬 수 있습니다.",
    shareExpiredTitle: "이 보이스 메모는 만료되었습니다",
    shareExpiredText: "보낸 사람이 제한된 기간만 들을 수 있게 설정했습니다.",
    sharedBack: "Voice Wall 열기",
    loadingTitle: "보이스 메모를 가져오는 중",
    backHome: "홈으로 돌아가기",
    themes: {
      letter: { name: "편지", scene: "일상" },
      ribbon: { name: "리본", scene: "고백" },
      record: { name: "레코드", scene: "친구" },
      ticket: { name: "티켓", scene: "여행" },
      stamp: { name: "우표", scene: "기념" },
      bloom: { name: "꽃무늬", scene: "생일" }
    }
  }
};

const state = {
  db: null,
  recorder: null,
  chunks: [],
  timer: null,
  seconds: 0,
  currentBlob: null,
  currentAudioUrl: "",
  selectedTheme: THEMES[0].id,
  notes: [],
  installPrompt: null,
  shareDialogNote: null,
  language: getInitialLanguage()
};

const app = document.querySelector("#app");
const config = window.VOICE_WALL_CONFIG || {};
const supabaseClient = createSupabaseClient();

init();

async function init() {
  document.documentElement.lang = currentCopy().htmlLang;
  state.db = await openDb();
  state.notes = await getAllNotes();
  window.addEventListener("hashchange", render);
  window.addEventListener("beforeinstallprompt", (event) => {
    event.preventDefault();
    state.installPrompt = event;
    render();
  });
  if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register("./sw.js");
  }
  render();
}

function createSupabaseClient() {
  const ready = config.SUPABASE_URL && config.SUPABASE_ANON_KEY && window.supabase;
  return ready ? window.supabase.createClient(config.SUPABASE_URL, config.SUPABASE_ANON_KEY) : null;
}

function render() {
  document.documentElement.lang = currentCopy().htmlLang;
  const shareId = new URLSearchParams(location.search).get("share");
  if (shareId) {
    renderSharedNote(shareId);
    return;
  }
  app.innerHTML = `
    <header class="topbar">
      <a class="brand" href="./" aria-label="${tr("appName")}">
        <span class="brand-mark"></span>
        <span>${tr("appName")}</span>
      </a>
      <div class="topbar-actions">
        ${languageSwitcherMarkup()}
        <button class="ghost-button" data-action="install" ${state.installPrompt ? "" : "hidden"}>${tr("install")}</button>
        <button class="ghost-button" data-action="settings">${tr("settings")}</button>
      </div>
    </header>
    <main>
      <section class="hero" id="record">
        <div class="hero-copy">
          <p class="eyebrow">${tr("heroEyebrow")}</p>
          <h1>${tr("heroTitle")}</h1>
          <p class="hero-text">${tr("heroText")}</p>
        </div>
        <div class="recorder-panel">
          ${recorderMarkup()}
        </div>
      </section>
      <section class="theme-strip" aria-label="${tr("themesLabel")}">
        ${THEMES.map(themeButtonMarkup).join("")}
      </section>
      <section class="wall-heading">
        <div>
          <p class="eyebrow">${tr("pinboard")}</p>
          <h2>${tr("wallTitle")}</h2>
        </div>
        <p>${currentCopy().noteCount(state.notes.length)}</p>
      </section>
      <section class="note-wall">
        ${state.notes.length ? state.notes.map(noteMarkup).join("") : emptyWallMarkup()}
      </section>
    </main>
    ${state.shareDialogNote ? shareDialogMarkup(state.shareDialogNote) : ""}
    <div class="toast" role="status" aria-live="polite"></div>
  `;
  bindEvents();
}

function languageSwitcherMarkup() {
  return `
    <div class="language-switcher" aria-label="Language">
      ${Object.values(I18N).map((language) => `
        <button class="language-button ${language.code === state.language ? "is-active" : ""}" data-action="set-language" data-language="${language.code}" type="button">${language.label}</button>
      `).join("")}
    </div>
  `;
}

function recorderMarkup() {
  const ready = Boolean(state.currentBlob);
  return `
    <div class="meter">
      <div class="meter-ring" style="--progress:${state.seconds / MAX_SECONDS}">
        <span>${formatTime(state.seconds)}</span>
      </div>
      <div class="waveform ${state.recorder?.state === "recording" ? "is-recording" : ""}">
        ${Array.from({ length: 24 }, (_, index) => `<i style="--i:${index}"></i>`).join("")}
      </div>
    </div>
    <label class="field-label" for="note-title">${tr("titleLabel")}</label>
    <input id="note-title" class="title-input" maxlength="30" placeholder="${tr("titlePlaceholder")}" />
    <div class="recorder-actions">
      <button class="primary-button" data-action="record">${state.recorder?.state === "recording" ? tr("stop") : tr("record")}</button>
      <button class="secondary-button" data-action="play-current" ${ready ? "" : "disabled"}>${tr("preview")}</button>
      <button class="secondary-button" data-action="save-current" ${ready ? "" : "disabled"}>${tr("pin")}</button>
    </div>
    <p class="panel-note">${supabaseClient ? tr("serviceConnected") : tr("serviceMissing")}</p>
  `;
}

function themeButtonMarkup(theme) {
  const text = getThemeText(theme.id);
  return `
    <button class="theme-chip ${theme.id === state.selectedTheme ? "is-selected" : ""}" data-action="select-theme" data-theme="${theme.id}" style="--accent:${theme.accent}">
      <span></span>
      <strong>${text.name}</strong>
      <em>${text.scene}</em>
    </button>
  `;
}

function noteMarkup(note) {
  const theme = getTheme(note.theme);
  const text = getThemeText(theme.id);
  return `
    <article class="note-card theme-${theme.id}" style="--accent:${theme.accent}">
      <div class="note-ornament"></div>
      <p class="note-meta">${text.scene} · ${formatTime(note.duration)}</p>
      <h3>${escapeHtml(note.title)}</h3>
      <p>${new Date(note.createdAt).toLocaleDateString(currentCopy().locale, { month: "short", day: "numeric" })}</p>
      <div class="note-actions">
        <button data-action="play-note" data-id="${note.id}">${tr("play")}</button>
        <button data-action="share-note" data-id="${note.id}">${tr("qrCode")}</button>
        <button data-action="delete-note" data-id="${note.id}">${tr("delete")}</button>
      </div>
    </article>
  `;
}

function emptyWallMarkup() {
  return `
    <div class="empty-wall">
      <p>${tr("emptyWall")}</p>
    </div>
  `;
}

function shareDialogMarkup(note) {
  return `
    <div class="modal-backdrop" data-action="close-share">
      <section class="share-modal" role="dialog" aria-modal="true" aria-label="${tr("shareDialogLabel")}">
        <button class="modal-close" data-action="close-share" aria-label="${tr("close")}">×</button>
        <p class="eyebrow">Share Card</p>
        <h2>${escapeHtml(note.title)}</h2>
        <label class="field-label" for="expiry-select">${tr("expiryLabel")}</label>
        <select id="expiry-select" class="title-input">
          <option value="forever">${tr("forever")}</option>
          <option value="7">${tr("days7")}</option>
          <option value="30">${tr("days30")}</option>
        </select>
        <button class="primary-button wide" data-action="create-share" data-id="${note.id}">${tr("createQr")}</button>
        <canvas id="qr-canvas" class="qr-canvas" hidden></canvas>
        <div class="share-link" hidden></div>
      </section>
    </div>
  `;
}

function bindEvents() {
  app.querySelectorAll("[data-action]").forEach((element) => {
    element.addEventListener("click", handleAction);
  });
}

async function handleAction(event) {
  const action = event.currentTarget.dataset.action;
  const id = event.currentTarget.dataset.id;
  if (action === "set-language") {
    setLanguage(event.currentTarget.dataset.language);
    return;
  }
  if (action === "record") await toggleRecording();
  if (action === "play-current") playBlob(state.currentBlob);
  if (action === "save-current") await saveCurrentNote();
  if (action === "select-theme") {
    state.selectedTheme = event.currentTarget.dataset.theme;
    render();
  }
  if (action === "play-note") await playSavedNote(id);
  if (action === "share-note") {
    state.shareDialogNote = state.notes.find((note) => note.id === id);
    render();
  }
  if (action === "delete-note") await deleteNote(id);
  if (action === "close-share" && event.target === event.currentTarget) {
    state.shareDialogNote = null;
    render();
  }
  if (action === "create-share") await createShare(id);
  if (action === "install") await installApp();
  if (action === "settings") showToast(tr("settingsToast"));
}

async function toggleRecording() {
  if (state.recorder?.state === "recording") {
    state.recorder.stop();
    return;
  }
  if (!navigator.mediaDevices?.getUserMedia || !window.MediaRecorder) {
    showToast(tr("noRecorder"));
    return;
  }
  let stream;
  try {
    stream = await navigator.mediaDevices.getUserMedia({ audio: true });
  } catch (error) {
    showToast(tr("micPermission"));
    return;
  }
  state.chunks = [];
  state.seconds = 0;
  state.currentBlob = null;
  const mimeType = pickMimeType();
  state.recorder = new MediaRecorder(stream, mimeType ? { mimeType } : undefined);
  state.recorder.addEventListener("dataavailable", (event) => {
    if (event.data.size) state.chunks.push(event.data);
  });
  state.recorder.addEventListener("stop", () => {
    stream.getTracks().forEach((track) => track.stop());
    clearInterval(state.timer);
    state.currentBlob = new Blob(state.chunks, { type: state.recorder.mimeType || "audio/webm" });
    state.currentAudioUrl = URL.createObjectURL(state.currentBlob);
    render();
  });
  state.recorder.start();
  state.timer = setInterval(() => {
    state.seconds += 1;
    if (state.seconds >= MAX_SECONDS) state.recorder.stop();
    render();
  }, 1000);
  render();
}

function pickMimeType() {
  const types = ["audio/webm;codecs=opus", "audio/webm", "audio/mp4"];
  return types.find((type) => MediaRecorder.isTypeSupported(type)) || "";
}

async function saveCurrentNote() {
  const titleInput = app.querySelector("#note-title");
  const title = titleInput.value.trim() || tr("noteDefaultTitle");
  const note = {
    id: crypto.randomUUID(),
    title,
    theme: state.selectedTheme,
    duration: Math.max(1, state.seconds),
    audioBlob: state.currentBlob,
    createdAt: new Date().toISOString()
  };
  await putNote(note);
  state.notes = await getAllNotes();
  state.currentBlob = null;
  state.currentAudioUrl = "";
  state.seconds = 0;
  showToast(tr("noteSaved"));
  render();
}

function playBlob(blob) {
  if (!blob) return;
  const audio = new Audio(URL.createObjectURL(blob));
  audio.play();
}

async function playSavedNote(id) {
  const note = state.notes.find((item) => item.id === id);
  if (note) playBlob(note.audioBlob);
}

async function deleteNote(id) {
  await deleteNoteById(id);
  state.notes = await getAllNotes();
  showToast(tr("noteDeleted"));
  render();
}

async function createShare(id) {
  if (!supabaseClient) {
    showToast(tr("supabaseMissing"));
    return;
  }
  const note = state.notes.find((item) => item.id === id);
  const expiry = app.querySelector("#expiry-select").value;
  const expiresAt = expiry === "forever" ? null : new Date(Date.now() + Number(expiry) * 86400000).toISOString();
  const fileExt = note.audioBlob.type.includes("mp4") ? "m4a" : "webm";
  const filePath = `${note.id}-${Date.now()}.${fileExt}`;
  const { error: uploadError } = await supabaseClient.storage
    .from(config.SUPABASE_BUCKET || "voice-notes")
    .upload(filePath, note.audioBlob, { contentType: note.audioBlob.type, upsert: false });
  if (uploadError) {
    showToast(uploadError.message);
    return;
  }
  const { data: publicData } = supabaseClient.storage
    .from(config.SUPABASE_BUCKET || "voice-notes")
    .getPublicUrl(filePath);
  const payload = {
    title: note.title,
    theme: note.theme,
    duration: note.duration,
    audio_url: publicData.publicUrl,
    expires_at: expiresAt
  };
  const { data, error } = await supabaseClient
    .from(config.SUPABASE_TABLE || "shared_notes")
    .insert(payload)
    .select("id")
    .single();
  if (error) {
    showToast(error.message);
    return;
  }
  const shareUrl = `${location.origin}${location.pathname}?share=${data.id}&lang=${state.language}`;
  const canvas = app.querySelector("#qr-canvas");
  const link = app.querySelector(".share-link");
  await window.QRCode.toCanvas(canvas, shareUrl, { width: 220, margin: 1, color: { dark: "#101510", light: "#f4efe5" } });
  canvas.hidden = false;
  link.hidden = false;
  link.innerHTML = `<button data-copy="${shareUrl}">${tr("copyLink")}</button><a download="voice-wall-qr.png" href="${canvas.toDataURL("image/png")}">${tr("downloadQr")}</a>`;
  link.querySelector("button").addEventListener("click", async () => {
    await navigator.clipboard.writeText(shareUrl);
    showToast(tr("linkCopied"));
  });
}

async function renderSharedNote(id) {
  app.innerHTML = sharedLoadingMarkup();
  if (!supabaseClient) {
    app.innerHTML = sharedMessageMarkup(tr("shareNotConfiguredTitle"), tr("shareNotConfiguredText"));
    return;
  }
  const { data, error } = await supabaseClient
    .from(config.SUPABASE_TABLE || "shared_notes")
    .select("title,theme,duration,audio_url,expires_at,created_at")
    .eq("id", id)
    .single();
  if (error || !data) {
    app.innerHTML = sharedMessageMarkup(tr("shareMissingTitle"), tr("shareMissingText"));
    return;
  }
  if (data.expires_at && new Date(data.expires_at).getTime() < Date.now()) {
    app.innerHTML = sharedMessageMarkup(tr("shareExpiredTitle"), tr("shareExpiredText"));
    return;
  }
  const theme = getTheme(data.theme);
  const text = getThemeText(theme.id);
  app.innerHTML = `
    <main class="share-page">
      <article class="shared-card theme-${theme.id}" style="--accent:${theme.accent}">
        <p class="eyebrow">Voice Note</p>
        <h1>${escapeHtml(data.title)}</h1>
        <p>${text.scene} · ${formatTime(data.duration)}</p>
        <audio controls src="${data.audio_url}"></audio>
        <a class="secondary-button" href="./">${tr("sharedBack")}</a>
      </article>
    </main>
  `;
}

function sharedLoadingMarkup() {
  return `<main class="share-page"><section class="shared-card"><p class="eyebrow">Loading</p><h1>${tr("loadingTitle")}</h1></section></main>`;
}

function sharedMessageMarkup(title, message) {
  return `<main class="share-page"><section class="shared-card"><p class="eyebrow">Voice Wall</p><h1>${title}</h1><p>${message}</p><a class="secondary-button" href="./">${tr("backHome")}</a></section></main>`;
}

function openDb() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, 1);
    request.onupgradeneeded = () => request.result.createObjectStore(STORE_NAME, { keyPath: "id" });
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

function runStore(mode, callback) {
  return new Promise((resolve, reject) => {
    const transaction = state.db.transaction(STORE_NAME, mode);
    const store = transaction.objectStore(STORE_NAME);
    const request = callback(store);
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

function putNote(note) {
  return runStore("readwrite", (store) => store.put(note));
}

function deleteNoteById(id) {
  return runStore("readwrite", (store) => store.delete(id));
}

async function getAllNotes() {
  const notes = await runStore("readonly", (store) => store.getAll());
  return notes.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
}

function getTheme(id) {
  return THEMES.find((theme) => theme.id === id) || THEMES[0];
}

function getThemeText(id) {
  return currentCopy().themes[id] || I18N.en.themes[id] || I18N.en.themes.letter;
}

function getInitialLanguage() {
  const requested = new URLSearchParams(location.search).get("lang");
  if (I18N[requested]) return requested;
  const saved = localStorage.getItem(LANGUAGE_KEY);
  return I18N[saved] ? saved : "en";
}

function setLanguage(language) {
  if (!I18N[language]) return;
  state.language = language;
  localStorage.setItem(LANGUAGE_KEY, language);
  render();
}

function currentCopy() {
  return I18N[state.language] || I18N.en;
}

function tr(key) {
  return currentCopy()[key] || I18N.en[key] || key;
}

function formatTime(seconds) {
  const value = Math.max(0, Math.min(MAX_SECONDS, seconds));
  return `0:${String(value).padStart(2, "0")}`;
}

function showToast(message) {
  const toast = app.querySelector(".toast");
  if (!toast) return;
  toast.textContent = message;
  toast.classList.add("is-visible");
  setTimeout(() => toast.classList.remove("is-visible"), 2600);
}

async function installApp() {
  if (!state.installPrompt) return;
  state.installPrompt.prompt();
  await state.installPrompt.userChoice;
  state.installPrompt = null;
  render();
}

function escapeHtml(value) {
  return String(value).replace(/[&<>"]/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[char]);
}
