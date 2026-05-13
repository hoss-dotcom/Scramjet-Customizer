// ============================
// THEME + PANIC
// ============================

(function () {
  const saved = localStorage.getItem("local-theme");
  if (saved) document.body.setAttribute("data-theme", saved);
})();

// ============================
// PARTICLES
// ============================

const canvas = document.getElementById("particle-canvas");
const ctx = canvas.getContext("2d");
let particles = [];
let animId = null;

function resizeCanvas() { canvas.width = window.innerWidth; canvas.height = window.innerHeight; }
resizeCanvas();
window.addEventListener("resize", resizeCanvas);

const THEME_COLOR = {
  midnight:[137,212,245], neon:[255,0,255], sunset:[255,107,53],
  ocean:[0,180,216], forest:[76,175,80],
};

function makeParticle(theme) {
  const isOcean = theme === "ocean";
  return {
    x: Math.random() * canvas.width,
    y: isOcean ? canvas.height + 10 : -10,
    size: Math.random() * 3 + 1,
    speedY: isOcean ? -(Math.random() * 1.2 + 0.4) : (Math.random() * 1.4 + 0.4),
    speedX: (Math.random() - 0.5) * 0.6,
    opacity: Math.random() * 0.6 + 0.2,
    drift: Math.random() * Math.PI * 2,
    driftSpeed: Math.random() * 0.018 + 0.005,
  };
}

function initParticles(theme) {
  if (animId) { cancelAnimationFrame(animId); animId = null; }
  particles = [];
  const count = { midnight:70, neon:35, sunset:25, ocean:28, forest:22 }[theme] || 70;
  for (let i = 0; i < count; i++) {
    const p = makeParticle(theme); p.y = Math.random() * canvas.height; particles.push(p);
  }
  animateParticles(theme);
}

function animateParticles(theme) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  const [r,g,b] = THEME_COLOR[theme] || [137,212,245];
  const isOcean = theme === "ocean";
  particles.forEach((p, i) => {
    p.drift += p.driftSpeed; p.x += Math.sin(p.drift) * 0.5 + p.speedX; p.y += p.speedY;
    ctx.save(); ctx.globalAlpha = p.opacity;
    if (theme === "neon") {
      ctx.shadowBlur = 10; ctx.shadowColor = `rgb(${r},${g},${b})`;
      ctx.fillStyle = `rgb(${r},${g},${b})`; ctx.beginPath(); ctx.arc(p.x, p.y, p.size * 0.8, 0, Math.PI*2); ctx.fill();
    } else if (isOcean) {
      ctx.strokeStyle = `rgba(${r},${g},${b},${p.opacity})`; ctx.lineWidth = 1;
      ctx.beginPath(); ctx.arc(p.x, p.y, p.size+1, 0, Math.PI*2); ctx.stroke();
    } else {
      ctx.fillStyle = `rgba(${r},${g},${b},${p.opacity})`;
      ctx.shadowBlur = theme==="midnight" ? 4 : 0; ctx.shadowColor = `rgb(${r},${g},${b})`;
      ctx.beginPath(); ctx.arc(p.x, p.y, p.size, 0, Math.PI*2); ctx.fill();
    }
    ctx.restore();
    const gone = isOcean ? p.y < -10 : (p.y > canvas.height+10 || p.x < -20 || p.x > canvas.width+20);
    if (gone) { particles[i] = makeParticle(theme); particles[i].x = Math.random()*canvas.width; }
  });
  animId = requestAnimationFrame(() => animateParticles(theme));
}

initParticles(document.body.getAttribute("data-theme") || "midnight");

document.addEventListener("keydown", (e) => {
  if (e.altKey && e.key === "x") {
    window.location.href = localStorage.getItem("local-panic-url") || "https://classroom.google.com";
  }
});

document.getElementById("panic-btn").addEventListener("click", () => {
  window.location.href = localStorage.getItem("local-panic-url") || "https://classroom.google.com";
});

// ============================
// PROFANITY FILTER
// ============================

const BAD_WORDS = [
  "fuck","shit","ass","bitch","bastard","damn","cunt","cock","dick","pussy",
  "piss","nigger","nigga","faggot","fag","slut","whore","retard","kike","spic",
  "chink","gook","wetback","tranny","crap","twat","wanker","bollocks","motherfucker",
  "asshole","arsehole","douchebag","jackass","shithead","dipshit","bullshit",
  "horseshit","clusterfuck","mindfuck","fucked","fucker","fucking","fuckin",
  "shitting","shitty","bitchy","bitches","asses","dicks","cocks","cunts",
  "pussies","asswipe","asshat","assclown","dumbass","smartass","badass",
];

function filterProfanity(text) {
  let out = text;
  for (const word of BAD_WORDS) {
    const re = new RegExp(`\\b${word}\\b`, "gi");
    out = out.replace(re, (m) => "★".repeat(m.length));
  }
  return out;
}

// ============================
// NAME MODAL
// ============================

const NAME_KEY = "local-chat-name";
let myName = localStorage.getItem(NAME_KEY) || "";

const nameModal = document.getElementById("name-modal");
const nameInput = document.getElementById("name-input");
const nameJoinBtn = document.getElementById("name-join-btn");
const nameError = document.getElementById("name-error");
const chatRoot = document.getElementById("chat-root");

function openChat(name) {
  myName = name;
  localStorage.setItem(NAME_KEY, name);
  nameModal.classList.add("hidden");
  chatRoot.classList.remove("hidden");
  initChat();
}

function validateName(val) {
  const v = val.trim();
  if (!v) return "Please enter a display name.";
  if (v.length < 2) return "Name must be at least 2 characters.";
  if (v.length > 24) return "Name must be 24 characters or less.";
  if (!/^[\w\s\-_.!?]+$/.test(v)) return "Name contains invalid characters.";
  if (filterProfanity(v) !== v) return "Please choose an appropriate name.";
  return null;
}

nameJoinBtn.addEventListener("click", () => {
  const err = validateName(nameInput.value);
  if (err) { nameError.textContent = err; return; }
  openChat(nameInput.value.trim());
});

nameInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") nameJoinBtn.click();
  nameError.textContent = "";
});

if (myName) {
  nameInput.value = myName;
  openChat(myName);
} else {
  setTimeout(() => nameInput.focus(), 100);
}

// ============================
// WEBSOCKET CHAT
// ============================

let ws = null;

function initChat() {
  const proto = location.protocol === "https:" ? "wss:" : "ws:";
  const url = `${proto}//${location.host}/chat/`;

  ws = new WebSocket(url);

  ws.addEventListener("open", () => {
    ws.send(JSON.stringify({ type: "join", username: myName }));
  });

  ws.addEventListener("message", (evt) => {
    let data;
    try { data = JSON.parse(evt.data); } catch { return; }

    if (data.type === "history") {
      const container = document.getElementById("chat-messages");
      container.innerHTML = "";
      for (const msg of data.messages) renderMessage(msg);
      scrollBottom();
    } else if (data.type === "message") {
      renderMessage(data);
      scrollBottom();
    } else if (data.type === "system") {
      renderSystem(data.text);
      scrollBottom();
    } else if (data.type === "users") {
      document.getElementById("online-count").textContent = `● ${data.count} online`;
    }
  });

  ws.addEventListener("close", () => {
    renderSystem("Disconnected. Reconnecting in 3s...");
    setTimeout(initChat, 3000);
  });

  ws.addEventListener("error", () => ws.close());
}

// ============================
// RENDER
// ================================

function renderMessage(data) {
  const container = document.getElementById("chat-messages");
  const isOwn = data.username === myName;
  const time = new Date(data.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

  const div = document.createElement("div");
  div.className = "chat-msg" + (isOwn ? " own" : "");

  div.innerHTML = `
    <div class="chat-msg-header">
      <span class="chat-msg-name${isOwn ? " own" : ""}">${escHtml(data.username)}</span>
      <span class="chat-msg-time">${time}</span>
    </div>
    <div class="chat-msg-text">${escHtml(data.text)}</div>
  `;

  container.appendChild(div);
}

function renderSystem(text) {
  const container = document.getElementById("chat-messages");
  const div = document.createElement("div");
  div.className = "chat-sys-msg";
  div.textContent = text;
  container.appendChild(div);
}

function scrollBottom() {
  const c = document.getElementById("chat-messages");
  c.scrollTop = c.scrollHeight;
}

function escHtml(s) {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

// ============================
// SEND MESSAGE
// ============================

const chatInput = document.getElementById("chat-input");
const sendBtn = document.getElementById("chat-send-btn");

function sendMessage() {
  const raw = chatInput.value.trim();
  if (!raw || !ws || ws.readyState !== WebSocket.OPEN) return;
  const text = filterProfanity(raw);
  ws.send(JSON.stringify({ type: "message", username: myName, text }));
  chatInput.value = "";
}

sendBtn.addEventListener("click", sendMessage);
chatInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(); }
});
