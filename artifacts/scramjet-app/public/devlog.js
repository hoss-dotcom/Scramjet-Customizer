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
// PANIC KEY
// ============================

document.addEventListener("keydown", (e) => {
  if (e.altKey && e.key === "x") {
    const url = localStorage.getItem("local-panic-url") || "https://classroom.google.com";
    window.location.replace(url);
  }
});

// ============================
// RENDER DEVLOG
// ============================

function renderDevlog() {
  const list = document.getElementById("devlog-list");
  const empty = document.getElementById("devlog-empty");
  let entries = [];
  try { entries = JSON.parse(localStorage.getItem("local-devlog")) || []; } catch {}

  if (entries.length === 0) { empty.style.display = "block"; return; }
  empty.style.display = "none";

  entries.sort((a, b) => b.timestamp - a.timestamp).forEach(entry => {
    const el = document.createElement("div");
    el.className = "devlog-entry";
    const date = new Date(entry.timestamp);
    const dateStr = date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
    el.innerHTML = `
      <div class="devlog-entry-header">
        <span class="devlog-entry-title">${entry.title}</span>
        <span class="devlog-entry-date">${dateStr}</span>
      </div>
      <div class="devlog-entry-content">${entry.content.replace(/\n/g, "<br>")}</div>
    `;
    list.appendChild(el);
  });
}

renderDevlog();

// ============================
// WRITE FORM
// ============================

const writeToggle = document.getElementById("devlog-write-toggle");
const writeForm   = document.getElementById("devlog-write-form");
const cancelBtn   = document.getElementById("devlog-cancel-btn");
const saveBtn     = document.getElementById("devlog-save-btn");
const titleInput  = document.getElementById("devlog-title-input");
const contentInput= document.getElementById("devlog-content-input");

writeToggle.addEventListener("click", () => {
  writeForm.classList.toggle("hidden");
  if (!writeForm.classList.contains("hidden")) {
    writeToggle.textContent = "✕ Close";
    titleInput.focus();
  } else {
    writeToggle.textContent = "+ Write";
  }
});

cancelBtn.addEventListener("click", () => {
  writeForm.classList.add("hidden");
  writeToggle.textContent = "+ Write";
  titleInput.value = "";
  contentInput.value = "";
});

saveBtn.addEventListener("click", () => {
  const title   = titleInput.value.trim();
  const content = contentInput.value.trim();
  if (!title || !content) { return; }

  let entries = [];
  try { entries = JSON.parse(localStorage.getItem("local-devlog")) || []; } catch {}
  entries.push({ title, content, timestamp: Date.now() });
  localStorage.setItem("local-devlog", JSON.stringify(entries));

  titleInput.value = "";
  contentInput.value = "";
  writeForm.classList.add("hidden");
  writeToggle.textContent = "+ Write";

  // Re-render
  const list  = document.getElementById("devlog-list");
  const empty = document.getElementById("devlog-empty");
  list.innerHTML = "";
  list.appendChild(empty);
  renderDevlog();
});
