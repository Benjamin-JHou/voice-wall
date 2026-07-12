const MAX_SECONDS = 60;
const DB_NAME = "voice-wall-db";
const STORE_NAME = "notes";
const THEMES = [
  { id: "letter", name: "信笺", scene: "日常", accent: "#b53c49" },
  { id: "ribbon", name: "丝带", scene: "告白", accent: "#8f2f57" },
  { id: "record", name: "唱片", scene: "朋友", accent: "#262f25" },
  { id: "ticket", name: "票根", scene: "旅行", accent: "#b77b2e" },
  { id: "stamp", name: "邮票", scene: "纪念", accent: "#3f695a" },
  { id: "bloom", name: "花纹", scene: "生日", accent: "#9a4f32" }
];

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
  shareDialogNote: null
};

const app = document.querySelector("#app");
const config = window.VOICE_WALL_CONFIG || {};
const supabaseClient = createSupabaseClient();

init();

async function init() {
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
  const shareId = new URLSearchParams(location.search).get("share");
  if (shareId) {
    renderSharedNote(shareId);
    return;
  }
  app.innerHTML = `
    <header class="topbar">
      <a class="brand" href="./" aria-label="Voice Wall 首页">
        <span class="brand-mark"></span>
        <span>Voice Wall</span>
      </a>
      <div class="topbar-actions">
        <button class="ghost-button" data-action="install" ${state.installPrompt ? "" : "hidden"}>安装</button>
        <button class="ghost-button" data-action="settings">配置</button>
      </div>
    </header>
    <main>
      <section class="hero" id="record">
        <div class="hero-copy">
          <p class="eyebrow">60 秒以内的声音卡片</p>
          <h1>把一句话，留成能被扫码听见的便签。</h1>
          <p class="hero-text">录音、选图案、生成二维码。朋友扫描后直接播放，适合生日祝福、旅行留言、临别短句和日常心意。</p>
        </div>
        <div class="recorder-panel">
          ${recorderMarkup()}
        </div>
      </section>
      <section class="theme-strip" aria-label="便签图案">
        ${THEMES.map(themeButtonMarkup).join("")}
      </section>
      <section class="wall-heading">
        <div>
          <p class="eyebrow">Pinboard</p>
          <h2>本机便签墙</h2>
        </div>
        <p>${state.notes.length} 条声音便签</p>
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
    <label class="field-label" for="note-title">便签标题</label>
    <input id="note-title" class="title-input" maxlength="30" placeholder="给这条声音起个名字" />
    <div class="recorder-actions">
      <button class="primary-button" data-action="record">${state.recorder?.state === "recording" ? "停止" : "录音"}</button>
      <button class="secondary-button" data-action="play-current" ${ready ? "" : "disabled"}>试听</button>
      <button class="secondary-button" data-action="save-current" ${ready ? "" : "disabled"}>贴上墙</button>
    </div>
    <p class="panel-note">${supabaseClient ? "分享服务已连接" : "未配置 Supabase 时可录音和本地保存"}</p>
  `;
}

function themeButtonMarkup(theme) {
  return `
    <button class="theme-chip ${theme.id === state.selectedTheme ? "is-selected" : ""}" data-action="select-theme" data-theme="${theme.id}" style="--accent:${theme.accent}">
      <span></span>
      <strong>${theme.name}</strong>
      <em>${theme.scene}</em>
    </button>
  `;
}

function noteMarkup(note) {
  const theme = getTheme(note.theme);
  return `
    <article class="note-card theme-${theme.id}" style="--accent:${theme.accent}">
      <div class="note-ornament"></div>
      <p class="note-meta">${theme.scene} · ${formatTime(note.duration)}</p>
      <h3>${escapeHtml(note.title)}</h3>
      <p>${new Date(note.createdAt).toLocaleDateString("zh-CN", { month: "short", day: "numeric" })}</p>
      <div class="note-actions">
        <button data-action="play-note" data-id="${note.id}">播放</button>
        <button data-action="share-note" data-id="${note.id}">二维码</button>
        <button data-action="delete-note" data-id="${note.id}">删除</button>
      </div>
    </article>
  `;
}

function emptyWallMarkup() {
  return `
    <div class="empty-wall">
      <p>第一条声音便签会出现在这里。</p>
    </div>
  `;
}

function shareDialogMarkup(note) {
  return `
    <div class="modal-backdrop" data-action="close-share">
      <section class="share-modal" role="dialog" aria-modal="true" aria-label="分享二维码">
        <button class="modal-close" data-action="close-share" aria-label="关闭">×</button>
        <p class="eyebrow">Share Card</p>
        <h2>${escapeHtml(note.title)}</h2>
        <label class="field-label" for="expiry-select">分享有效期</label>
        <select id="expiry-select" class="title-input">
          <option value="forever">长期有效</option>
          <option value="7">7 天</option>
          <option value="30">30 天</option>
        </select>
        <button class="primary-button wide" data-action="create-share" data-id="${note.id}">生成二维码</button>
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
  if (action === "settings") showToast("在 GitHub Pages 变量中配置 Supabase 后即可生成公开二维码。");
}

async function toggleRecording() {
  if (state.recorder?.state === "recording") {
    state.recorder.stop();
    return;
  }
  if (!navigator.mediaDevices?.getUserMedia || !window.MediaRecorder) {
    showToast("当前浏览器缺少录音能力。");
    return;
  }
  let stream;
  try {
    stream = await navigator.mediaDevices.getUserMedia({ audio: true });
  } catch (error) {
    showToast("请允许浏览器使用麦克风。");
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
  const title = titleInput.value.trim() || "未命名声音";
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
  showToast("便签已贴上墙。");
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
  showToast("便签已删除。");
  render();
}

async function createShare(id) {
  if (!supabaseClient) {
    showToast("请先配置 Supabase URL 和 anon key。");
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
  const shareUrl = `${location.origin}${location.pathname}?share=${data.id}`;
  const canvas = app.querySelector("#qr-canvas");
  const link = app.querySelector(".share-link");
  await window.QRCode.toCanvas(canvas, shareUrl, { width: 220, margin: 1, color: { dark: "#101510", light: "#f4efe5" } });
  canvas.hidden = false;
  link.hidden = false;
  link.innerHTML = `<button data-copy="${shareUrl}">复制链接</button><a download="voice-wall-qr.png" href="${canvas.toDataURL("image/png")}">下载二维码</a>`;
  link.querySelector("button").addEventListener("click", async () => {
    await navigator.clipboard.writeText(shareUrl);
    showToast("链接已复制。");
  });
}

async function renderSharedNote(id) {
  app.innerHTML = sharedLoadingMarkup();
  if (!supabaseClient) {
    app.innerHTML = sharedMessageMarkup("分享服务尚未配置", "请检查 GitHub Pages 的 Supabase 配置。");
    return;
  }
  const { data, error } = await supabaseClient
    .from(config.SUPABASE_TABLE || "shared_notes")
    .select("title,theme,duration,audio_url,expires_at,created_at")
    .eq("id", id)
    .single();
  if (error || !data) {
    app.innerHTML = sharedMessageMarkup("没有找到这条声音", "二维码可能来自已删除的分享记录。");
    return;
  }
  if (data.expires_at && new Date(data.expires_at).getTime() < Date.now()) {
    app.innerHTML = sharedMessageMarkup("这条声音已经过期", "分享人设置了限时可听。");
    return;
  }
  const theme = getTheme(data.theme);
  app.innerHTML = `
    <main class="share-page">
      <article class="shared-card theme-${theme.id}" style="--accent:${theme.accent}">
        <p class="eyebrow">Voice Note</p>
        <h1>${escapeHtml(data.title)}</h1>
        <p>${theme.scene} · ${formatTime(data.duration)}</p>
        <audio controls src="${data.audio_url}"></audio>
        <a class="secondary-button" href="./">打开语音便签墙</a>
      </article>
    </main>
  `;
}

function sharedLoadingMarkup() {
  return `<main class="share-page"><section class="shared-card"><p class="eyebrow">Loading</p><h1>正在取出这条声音</h1></section></main>`;
}

function sharedMessageMarkup(title, message) {
  return `<main class="share-page"><section class="shared-card"><p class="eyebrow">Voice Wall</p><h1>${title}</h1><p>${message}</p><a class="secondary-button" href="./">返回首页</a></section></main>`;
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
