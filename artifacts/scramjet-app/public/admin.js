"use strict";

const savedTheme = localStorage.getItem("local-theme") || "snow";
document.documentElement.setAttribute("data-theme", savedTheme);

// ============================
// PARTICLES
// ============================

const canvas = document.getElementById("particle-canvas");
const ctx = canvas.getContext("2d");
let particles = [], animId = null;

function resizeCanvas() { canvas.width = window.innerWidth; canvas.height = window.innerHeight; }
resizeCanvas();
window.addEventListener("resize", resizeCanvas);

const THEME_COLOR = { snow:[137,212,245], neon:[255,0,255], sunset:[255,107,53], ocean:[0,180,216], forest:[76,175,80] };

function makeParticle(theme) {
  const isOcean = theme === "ocean";
  return { x: Math.random()*canvas.width, y: isOcean ? canvas.height+10 : -10,
    size: Math.random()*3+1, speedY: isOcean ? -(Math.random()*1.2+0.4) : (Math.random()*1.4+0.4),
    speedX: (Math.random()-0.5)*0.6, opacity: Math.random()*0.5+0.2,
    drift: Math.random()*Math.PI*2, driftSpeed: Math.random()*0.018+0.005 };
}

function initParticles(theme) {
  if (animId) { cancelAnimationFrame(animId); animId = null; }
  particles = [];
  const count = { snow:60, neon:30, sunset:20, ocean:24, forest:18 }[theme] || 0;
  for (let i = 0; i < count; i++) { const p = makeParticle(theme); p.y = Math.random()*canvas.height; particles.push(p); }
  if (count > 0) animate(theme);
}

function animate(theme) {
  ctx.clearRect(0,0,canvas.width,canvas.height);
  const [r,g,b] = THEME_COLOR[theme] || [255,255,255];
  particles.forEach((p,i) => {
    p.drift += p.driftSpeed; p.x += Math.sin(p.drift)*0.5+p.speedX; p.y += p.speedY;
    ctx.save(); ctx.globalAlpha = p.opacity;
    ctx.fillStyle = `rgba(${r},${g},${b},${p.opacity})`;
    ctx.beginPath(); ctx.arc(p.x,p.y,p.size,0,Math.PI*2); ctx.fill(); ctx.restore();
    const gone = theme==="ocean" ? p.y<-10 : (p.y>canvas.height+10||p.x<-20||p.x>canvas.width+20);
    if (gone) { particles[i] = makeParticle(theme); particles[i].x = Math.random()*canvas.width; }
  });
  animId = requestAnimationFrame(() => animate(theme));
}

initParticles(savedTheme);

// ============================
// STORAGE HELPERS
// ============================

const PASS_KEY = "local-admin-pass";
const ANN_KEY = "local-announcements";
const DL_KEY = "local-devlog";

function getAnnouncements() { try { return JSON.parse(localStorage.getItem(ANN_KEY)) || []; } catch { return []; } }
function saveAnnouncements(arr) { localStorage.setItem(ANN_KEY, JSON.stringify(arr)); }
function getDevlog() { try { return JSON.parse(localStorage.getItem(DL_KEY)) || []; } catch { return []; } }
function saveDevlog(arr) { localStorage.setItem(DL_KEY, JSON.stringify(arr)); }

// ============================
// AUTH
// ============================

const authGate = document.getElementById("auth-gate");
const adminPanel = document.getElementById("admin-panel");
const authInput = document.getElementById("auth-input");
const authBtn = document.getElementById("auth-btn");
const authErr = document.getElementById("auth-err");
const authDesc = document.getElementById("auth-desc");

const storedPass = localStorage.getItem(PASS_KEY);
if (!storedPass) {
  authDesc.textContent = "No password set. Create one now:";
}

authBtn.addEventListener("click", () => {
  const val = authInput.value.trim();
  if (!val) { authErr.textContent = "Please enter a password."; return; }
  const stored = localStorage.getItem(PASS_KEY);
  if (!stored) {
    localStorage.setItem(PASS_KEY, val);
    showPanel();
  } else if (val === stored) {
    showPanel();
  } else {
    authErr.textContent = "Wrong password.";
    authInput.value = "";
  }
});

authInput.addEventListener("keydown", (e) => { if (e.key === "Enter") authBtn.click(); });

function showPanel() {
  authGate.classList.add("hidden");
  adminPanel.classList.remove("hidden");
  renderAnnouncements();
  renderDevlog();
}

document.getElementById("logout-btn").addEventListener("click", () => {
  authGate.classList.remove("hidden");
  adminPanel.classList.add("hidden");
  authInput.value = "";
  authErr.textContent = "";
});

// ============================
// TABS
// ============================

document.querySelectorAll(".admin-tab").forEach(tab => {
  tab.addEventListener("click", () => {
    document.querySelectorAll(".admin-tab").forEach(t => t.classList.remove("active"));
    document.querySelectorAll(".tab-content").forEach(c => c.classList.add("hidden"));
    tab.classList.add("active");
    document.getElementById("tab-" + tab.dataset.tab).classList.remove("hidden");
  });
});

// ============================
// ANNOUNCEMENTS
// ============================

function renderAnnouncements() {
  const list = document.getElementById("ann-list");
  const anns = getAnnouncements();
  if (anns.length === 0) { list.innerHTML = '<p class="admin-empty">No announcements posted.</p>'; return; }
  list.innerHTML = anns.map(a => `
    <div class="ann-item ${a.type}">
      <div class="ann-item-body">
        <span class="ann-badge ${a.type}">${a.type === "info" ? "ℹ️" : a.type === "warning" ? "⚠️" : "✅"}</span>
        <span class="ann-item-text">${a.text}</span>
      </div>
      <button class="ann-delete-btn" data-id="${a.id}">✕</button>
    </div>
  `).join("");
  list.querySelectorAll(".ann-delete-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      const updated = getAnnouncements().filter(a => a.id !== btn.dataset.id);
      saveAnnouncements(updated);
      renderAnnouncements();
    });
  });
}

document.getElementById("ann-post-btn").addEventListener("click", () => {
  const text = document.getElementById("ann-text").value.trim();
  const type = document.getElementById("ann-type").value;
  if (!text) return;
  const anns = getAnnouncements();
  anns.push({ id: Date.now().toString(), text, type, timestamp: Date.now() });
  saveAnnouncements(anns);
  document.getElementById("ann-text").value = "";
  renderAnnouncements();
});

// ============================
// DEVLOG
// ============================

function renderDevlog() {
  const list = document.getElementById("dl-list");
  const entries = getDevlog().sort((a,b) => b.timestamp - a.timestamp);
  if (entries.length === 0) { list.innerHTML = '<p class="admin-empty">No devlog entries yet.</p>'; return; }
  list.innerHTML = entries.map(e => `
    <div class="ann-item">
      <div class="ann-item-body" style="flex-direction:column;gap:4px;align-items:flex-start;">
        <span style="font-weight:700;color:var(--accent)">${e.title}</span>
        <span style="font-size:12px;color:var(--text-muted)">${new Date(e.timestamp).toLocaleDateString("en-US",{month:"short",day:"numeric",year:"numeric"})}</span>
        <span style="font-size:13px;">${e.content.substring(0,80)}${e.content.length>80?"...":""}</span>
      </div>
      <button class="ann-delete-btn" data-id="${e.id}">✕</button>
    </div>
  `).join("");
  list.querySelectorAll(".ann-delete-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      const updated = getDevlog().filter(e => e.id !== btn.dataset.id);
      saveDevlog(updated);
      renderDevlog();
    });
  });
}

document.getElementById("dl-post-btn").addEventListener("click", () => {
  const title = document.getElementById("dl-title").value.trim();
  const content = document.getElementById("dl-content").value.trim();
  if (!title || !content) return;
  const entries = getDevlog();
  entries.push({ id: Date.now().toString(), title, content, timestamp: Date.now() });
  saveDevlog(entries);
  document.getElementById("dl-title").value = "";
  document.getElementById("dl-content").value = "";
  renderDevlog();
});

// ============================
// PASSWORD CHANGE
// ============================

document.getElementById("change-pass-btn").addEventListener("click", () => {
  const p1 = document.getElementById("new-pass-1").value;
  const p2 = document.getElementById("new-pass-2").value;
  const msg = document.getElementById("pass-msg");
  if (!p1) { msg.textContent = "Password cannot be empty."; msg.style.color = "#f87171"; return; }
  if (p1 !== p2) { msg.textContent = "Passwords do not match."; msg.style.color = "#f87171"; return; }
  localStorage.setItem(PASS_KEY, p1);
  msg.textContent = "Password updated!";
  msg.style.color = "#4ade80";
  document.getElementById("new-pass-1").value = "";
  document.getElementById("new-pass-2").value = "";
});
