"use strict";

// ============================
// PARTICLE CANVAS (declared first so initParticles works everywhere)
// ============================

const canvas = document.getElementById("particle-canvas");
const ctx = canvas.getContext("2d");
let particles = [];
let animId = null;

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener("resize", resizeCanvas);

const THEME_PARTICLE_COLOR = {
  snow:   [137, 212, 245],
  neon:   [255, 0, 255],
  sunset: [255, 107, 53],
  ocean:  [0, 180, 216],
  forest: [76, 175, 80],
};

function makeParticle(theme) {
  const isOcean = theme === "ocean";
  return {
    x: Math.random() * canvas.width,
    y: isOcean ? canvas.height + 10 : -10,
    size: Math.random() * 3.5 + 1,
    speedY: isOcean ? -(Math.random() * 1.2 + 0.4) : (Math.random() * 1.4 + 0.4),
    speedX: (Math.random() - 0.5) * 0.7,
    opacity: Math.random() * 0.6 + 0.25,
    drift: Math.random() * Math.PI * 2,
    driftSpeed: Math.random() * 0.018 + 0.005,
  };
}

function initParticles(theme) {
  if (animId) { cancelAnimationFrame(animId); animId = null; }
  particles = [];

  const counts = { snow: 90, neon: 45, sunset: 30, ocean: 35, forest: 28 };
  const count = counts[theme] || 0;

  for (let i = 0; i < count; i++) {
    const p = makeParticle(theme);
    p.y = Math.random() * canvas.height;
    particles.push(p);
  }

  if (count > 0) animateParticles(theme);
}

function animateParticles(theme) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  const [r, g, b] = THEME_PARTICLE_COLOR[theme] || [255, 255, 255];
  const isOcean = theme === "ocean";

  particles.forEach((p, i) => {
    p.drift += p.driftSpeed;
    p.x += Math.sin(p.drift) * 0.6 + p.speedX;
    p.y += p.speedY;

    ctx.save();
    ctx.globalAlpha = p.opacity;

    if (theme === "neon") {
      ctx.shadowBlur = 12;
      ctx.shadowColor = `rgb(${r},${g},${b})`;
      ctx.fillStyle = `rgb(${r},${g},${b})`;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size * 0.8, 0, Math.PI * 2);
      ctx.fill();
    } else if (isOcean) {
      ctx.strokeStyle = `rgba(${r},${g},${b},${p.opacity})`;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size + 1, 0, Math.PI * 2);
      ctx.stroke();
    } else {
      ctx.fillStyle = `rgba(${r},${g},${b},${p.opacity})`;
      ctx.shadowBlur = theme === "snow" ? 4 : 0;
      ctx.shadowColor = `rgb(${r},${g},${b})`;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.restore();

    const gone = isOcean
      ? p.y < -10
      : p.y > canvas.height + 10 || p.x < -20 || p.x > canvas.width + 20;
    if (gone) {
      particles[i] = makeParticle(theme);
      particles[i].x = Math.random() * canvas.width;
    }
  });

  animId = requestAnimationFrame(() => animateParticles(theme));
}

// ============================
// SCRAMJET SETUP
// ============================

const { ScramjetController } = $scramjetLoadController();

const scramjet = new ScramjetController({
  files: {
    wasm: "/scram/scramjet.wasm.wasm",
    all: "/scram/scramjet.all.js",
    sync: "/scram/scramjet.sync.js",
  },
});

scramjet.init();

const connection = new BareMux.BareMuxConnection("/baremux/worker.js");

let activeFrame = null;

// ============================
// PROXY LAUNCHER
// ============================

async function launchProxy(url) {
  const overlay = document.getElementById("proxy-overlay");
  const errorEl = document.getElementById("sj-error");
  const errorCode = document.getElementById("sj-error-code");

  errorEl.textContent = "";
  errorCode.textContent = "";

  try {
    await registerSW();
  } catch (err) {
    errorEl.textContent = "Failed to register service worker: " + err.message;
    return;
  }

  const wispUrl =
    (location.protocol === "https:" ? "wss" : "ws") +
    "://" + location.host + "/wisp/";

  if ((await connection.getTransport()) !== "/libcurl/index.mjs") {
    await connection.setTransport("/libcurl/index.mjs", [{ websocket: wispUrl }]);
  }

  if (activeFrame) {
    try { activeFrame.frame.remove(); } catch (e) {}
    activeFrame = null;
  }

  overlay.classList.remove("hidden");
  const frame = scramjet.createFrame();
  frame.frame.id = "sj-frame";
  overlay.appendChild(frame.frame);
  activeFrame = frame;
  frame.go(url);
}

function closeProxy() {
  const overlay = document.getElementById("proxy-overlay");
  if (activeFrame) {
    try { activeFrame.frame.remove(); } catch (e) {}
    activeFrame = null;
  }
  overlay.classList.add("hidden");
}

// ============================
// SEARCH FORM
// ============================

const form = document.getElementById("sj-form");
const address = document.getElementById("sj-address");
const searchEngine = document.getElementById("sj-search-engine");

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const val = address.value.trim();
  if (!val) return;
  await launchProxy(search(val, searchEngine.value));
});

document.getElementById("proxy-close").addEventListener("click", closeProxy);

// ============================
// MUSIC & MOVIES
// ============================

document.getElementById("music-btn").addEventListener("click", async () => {
  await launchProxy("https://music.youtube.com/");
});

document.getElementById("movies-btn").addEventListener("click", async () => {
  await launchProxy("https://dulo.cx/");
});

// ============================
// CLOCK
// ============================

function updateClock() {
  const now = new Date();
  const h = String(now.getHours()).padStart(2, "0");
  const m = String(now.getMinutes()).padStart(2, "0");
  const s = String(now.getSeconds()).padStart(2, "0");
  document.getElementById("clock-time").textContent = `${h}:${m}:${s}`;

  const days = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];
  const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  document.getElementById("clock-date").textContent =
    `${days[now.getDay()]}, ${months[now.getMonth()]} ${now.getDate()}`;
}

updateClock();
setInterval(updateClock, 1000);


// ============================
// SETTINGS PANEL
// ============================

const settingsBtn = document.getElementById("settings-btn");
const settingsOverlay = document.getElementById("settings-overlay");
const settingsClose = document.getElementById("settings-close");

settingsBtn.addEventListener("click", () =>
  settingsOverlay.classList.toggle("hidden")
);
settingsClose.addEventListener("click", () =>
  settingsOverlay.classList.add("hidden")
);
settingsOverlay.addEventListener("click", (e) => {
  if (e.target === settingsOverlay) settingsOverlay.classList.add("hidden");
});

// ============================
// BACKGROUND IMAGE
// ============================

const BG_KEY = "local-bg-image";

function applyBackground(url) {
  if (!url) {
    document.body.style.backgroundImage = "";
    document.body.classList.remove("has-bg");
    return;
  }
  document.body.style.backgroundImage = `url(${JSON.stringify(url)})`;
  document.body.classList.add("has-bg");
}

function loadBackground() {
  const saved = localStorage.getItem(BG_KEY);
  if (saved) {
    applyBackground(saved);
    document.getElementById("bg-url-input").value = saved.startsWith("data:") ? "" : saved;
    showBgPreview(saved);
  }
}

function showBgPreview(url) {
  const wrap = document.getElementById("bg-preview-wrap");
  const img  = document.getElementById("bg-preview-img");
  img.src = url;
  wrap.style.display = "block";
}

document.getElementById("bg-apply-btn").addEventListener("click", () => {
  const url = document.getElementById("bg-url-input").value.trim();
  if (!url) return;
  applyBackground(url);
  localStorage.setItem(BG_KEY, url);
  showBgPreview(url);
});

document.getElementById("bg-remove-btn").addEventListener("click", () => {
  applyBackground(null);
  localStorage.removeItem(BG_KEY);
  document.getElementById("bg-url-input").value = "";
  document.getElementById("bg-preview-wrap").style.display = "none";
});

document.getElementById("bg-file-input").addEventListener("change", (e) => {
  const file = e.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = (ev) => {
    const dataUrl = ev.target.result;
    applyBackground(dataUrl);
    localStorage.setItem(BG_KEY, dataUrl);
    showBgPreview(dataUrl);
    document.getElementById("bg-url-input").value = "";
  };
  reader.readAsDataURL(file);
});

loadBackground();

// ============================
// THEMES
// ============================

const THEME_KEY = "local-theme";

function applyTheme(theme) {
  document.documentElement.setAttribute("data-theme", theme);
  localStorage.setItem(THEME_KEY, theme);
  document.querySelectorAll(".theme-btn").forEach((btn) =>
    btn.classList.toggle("active", btn.dataset.theme === theme)
  );
  initParticles(theme);
}

document.querySelectorAll(".theme-btn").forEach((btn) =>
  btn.addEventListener("click", () => applyTheme(btn.dataset.theme))
);

// ============================
// TAB CLOAK
// ============================

const CLOAK_KEY = "local-cloak";

function applyCloak(title, favicon) {
  if (title) document.title = title;
  if (favicon) document.getElementById("favicon-link").href = favicon;
}

function loadCloak() {
  try {
    const c = JSON.parse(localStorage.getItem(CLOAK_KEY));
    if (c) {
      applyCloak(c.title, c.favicon);
      document.getElementById("cloak-title").value = c.title || "";
      document.getElementById("cloak-favicon").value = c.favicon || "";
    }
  } catch {}
}

document.getElementById("apply-cloak").addEventListener("click", () => {
  const title = document.getElementById("cloak-title").value.trim();
  const favicon = document.getElementById("cloak-favicon").value.trim();
  applyCloak(title, favicon);
  localStorage.setItem(CLOAK_KEY, JSON.stringify({ title, favicon }));
});

document.getElementById("reset-cloak").addEventListener("click", () => {
  document.title = "Local";
  document.getElementById("favicon-link").href = "favicon.ico";
  document.getElementById("cloak-title").value = "";
  document.getElementById("cloak-favicon").value = "";
  localStorage.removeItem(CLOAK_KEY);
});

document.querySelectorAll(".preset-btn").forEach((btn) => {
  btn.addEventListener("click", () => {
    document.getElementById("cloak-title").value = btn.dataset.title;
    document.getElementById("cloak-favicon").value = btn.dataset.favicon;
  });
});

loadCloak();

// ============================
// SEARCH ENGINE
// ============================

const SEARCH_KEY = "local-search-engine";
const searchEngineSelect = document.getElementById("search-engine-select");

function loadSearchEngine() {
  const saved = localStorage.getItem(SEARCH_KEY);
  if (saved) {
    searchEngine.value = saved;
    searchEngineSelect.value = saved;
  }
}

searchEngineSelect.addEventListener("change", () => {
  searchEngine.value = searchEngineSelect.value;
  localStorage.setItem(SEARCH_KEY, searchEngineSelect.value);
});

loadSearchEngine();

// ============================
// FLOATING TIPS
// ============================

const TIPS = [
  "better then someone elses webstie","bruh moment",
  "lowkey ","am i friggin tuff","joe mama","oh heck nah mr escobar",
  "locked and loaded dudee","lowkey though",
  "new school year", "better then US5", "Local serving you since may 2026",
  "me and da bois with le troll faces",
  "10 New Games Every Monday",
];

// Ticker above buttons
const tipsWord = document.getElementById("tips-word");
let tipIndex = Math.floor(Math.random() * TIPS.length);

function cycleTip() {
  tipsWord.classList.add("tip-out");
  setTimeout(() => {
    tipIndex = (tipIndex + 1) % TIPS.length;
    tipsWord.textContent = TIPS[tipIndex];
    tipsWord.classList.remove("tip-out");
    // Re-trigger tipIn by forcing reflow
    void tipsWord.offsetWidth;
    tipsWord.style.animation = "none";
    void tipsWord.offsetWidth;
    tipsWord.style.animation = "";
  }, 350);
}

setInterval(cycleTip, 2800);

// ============================
// PANIC KEY + BUTTON
// ============================

function panicNow() {
  const url = localStorage.getItem("local-panic-url") || "https://classroom.google.com";
  window.location.replace(url);
}

document.addEventListener("keydown", (e) => {
  if (e.altKey && e.key === "x") panicNow();
});

document.getElementById("panic-btn-main").addEventListener("click", panicNow);

const panicUrlInput = document.getElementById("panic-url-input");
panicUrlInput.value = localStorage.getItem("local-panic-url") || "";
document.getElementById("save-panic-url").addEventListener("click", () => {
  const val = panicUrlInput.value.trim();
  if (val) localStorage.setItem("local-panic-url", val);
});

// ============================
// ANNOUNCEMENTS
// ============================

function loadAnnouncements() {
  const banner = document.getElementById("announcement-banner");
  let anns = [];
  try { anns = JSON.parse(localStorage.getItem("local-announcements")) || []; } catch {}
  if (anns.length === 0) { banner.classList.add("hidden"); return; }
  banner.classList.remove("hidden");
  banner.innerHTML = anns.map(a => `
    <div class="announcement-item ann-${a.type}">
      <span>${a.type === "info" ? "ℹ️" : a.type === "warning" ? "⚠️" : "✅"}</span>
      <span>${a.text}</span>
    </div>
  `).join("");
}

loadAnnouncements();

// ============================
// TYPEWRITER TITLE
// ============================

const siteTitle = document.getElementById("site-title");
const titleText = "Local";
let titleIndex = 0;

function typeSiteTitle() {
  if (titleIndex >= titleText.length) return;
  siteTitle.textContent += titleText[titleIndex];
  titleIndex += 1;
  setTimeout(typeSiteTitle, 145);
}

setTimeout(typeSiteTitle, 450);

// ============================
// APPLY SAVED SETTINGS (must be last)
// ============================

const savedTheme = localStorage.getItem(THEME_KEY) || "snow";
applyTheme(savedTheme);
