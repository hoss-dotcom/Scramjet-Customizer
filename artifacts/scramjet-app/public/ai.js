// ============================
// THEME + PANIC
// ============================

(function () {
  const saved = localStorage.getItem("local-theme");
  if (saved) document.body.setAttribute("data-theme", saved);
})();

document.addEventListener("keydown", (e) => {
  if (e.altKey && e.key === "x") {
    window.location.href = localStorage.getItem("local-panic-url") || "https://classroom.google.com";
  }
});
document.getElementById("panic-btn").addEventListener("click", () => {
  window.location.href = localStorage.getItem("local-panic-url") || "https://classroom.google.com";
});

// ============================
// PARTICLES
// ============================

const canvas = document.getElementById("particle-canvas");
const ctx = canvas.getContext("2d");
let particles = [], animId = null;

function resizeCanvas() { canvas.width = window.innerWidth; canvas.height = window.innerHeight; }
resizeCanvas();
window.addEventListener("resize", resizeCanvas);

const THEME_COLOR = { midnight:[137,212,245], neon:[255,0,255], sunset:[255,107,53], ocean:[0,180,216], forest:[76,175,80] };

function makeParticle(theme) {
  const isOcean = theme === "ocean";
  return { x: Math.random()*canvas.width, y: isOcean?canvas.height+10:-10, size: Math.random()*3+1, speedY: isOcean?-(Math.random()*1.2+0.4):(Math.random()*1.4+0.4), speedX: (Math.random()-0.5)*0.6, opacity: Math.random()*0.6+0.2, drift: Math.random()*Math.PI*2, driftSpeed: Math.random()*0.018+0.005 };
}

function initParticles(theme) {
  if (animId) cancelAnimationFrame(animId);
  particles = [];
  const count = { midnight:70, neon:35, sunset:25, ocean:28, forest:22 }[theme] || 70;
  for (let i = 0; i < count; i++) { const p = makeParticle(theme); p.y = Math.random()*canvas.height; particles.push(p); }
  animateParticles(theme);
}

function animateParticles(theme) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  const [r,g,b] = THEME_COLOR[theme] || [137,212,245];
  const isOcean = theme === "ocean";
  particles.forEach((p, i) => {
    p.drift += p.driftSpeed; p.x += Math.sin(p.drift)*0.5+p.speedX; p.y += p.speedY;
    ctx.save(); ctx.globalAlpha = p.opacity;
    if (theme==="neon") { ctx.shadowBlur=10; ctx.shadowColor=`rgb(${r},${g},${b})`; ctx.fillStyle=`rgb(${r},${g},${b})`; ctx.beginPath(); ctx.arc(p.x,p.y,p.size*0.8,0,Math.PI*2); ctx.fill(); }
    else if (isOcean) { ctx.strokeStyle=`rgba(${r},${g},${b},${p.opacity})`; ctx.lineWidth=1; ctx.beginPath(); ctx.arc(p.x,p.y,p.size+1,0,Math.PI*2); ctx.stroke(); }
    else { ctx.fillStyle=`rgba(${r},${g},${b},${p.opacity})`; ctx.shadowBlur=4; ctx.shadowColor=`rgb(${r},${g},${b})`; ctx.beginPath(); ctx.arc(p.x,p.y,p.size,0,Math.PI*2); ctx.fill(); }
    ctx.restore();
    const gone = isOcean ? p.y<-10 : (p.y>canvas.height+10||p.x<-20||p.x>canvas.width+20);
    if (gone) { particles[i] = makeParticle(theme); particles[i].x = Math.random()*canvas.width; }
  });
  animId = requestAnimationFrame(() => animateParticles(theme));
}

initParticles(document.body.getAttribute("data-theme") || "midnight");

// ============================
// AI CHAT
// ============================

const STORAGE_KEY = "local-ai-history";
let messages = [];
let isStreaming = false;

function loadHistory() {
  try { messages = JSON.parse(localStorage.getItem(STORAGE_KEY)) || []; } catch { messages = []; }
}

function saveHistory() {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(messages.slice(-40))); } catch {}
}

function clearHistory() {
  messages = [];
  localStorage.removeItem(STORAGE_KEY);
  const container = document.getElementById("ai-messages");
  container.innerHTML = "";
  renderWelcome();
}

function renderWelcome() {
  const container = document.getElementById("ai-messages");
  container.innerHTML = `
    <div class="ai-welcome">
      <div class="ai-welcome-icon">🤖</div>
      <h2 class="ai-welcome-title">Local AI</h2>
      <p class="ai-welcome-sub">Your personal AI assistant — ask me anything. Homework, code, ideas, or just chat.</p>
      <div class="ai-suggestion-chips">
        <button class="ai-chip" data-msg="Explain how the internet works in simple terms">How does the internet work?</button>
        <button class="ai-chip" data-msg="Write a funny short story about a robot learning to cook">Write a funny story</button>
        <button class="ai-chip" data-msg="Give me 5 tips for studying more effectively">Study tips</button>
        <button class="ai-chip" data-msg="What are some cool game ideas I could build?">Game ideas</button>
      </div>
    </div>
  `;
  bindChips();
}

function bindChips() {
  document.querySelectorAll(".ai-chip").forEach((chip) => {
    chip.addEventListener("click", () => sendMessage(chip.dataset.msg));
  });
}

function renderMessage(role, text) {
  const container = document.getElementById("ai-messages");
  const welcome = container.querySelector(".ai-welcome");
  if (welcome) welcome.remove();

  const div = document.createElement("div");
  div.className = `ai-msg ${role}`;
  div.innerHTML = `
    <div class="ai-msg-role">${role === "user" ? "You" : "Local AI"}</div>
    <div class="ai-msg-bubble">${escHtml(text)}</div>
  `;
  container.appendChild(div);
  scrollBottom();
  return div;
}

function appendToLastBubble(text) {
  const container = document.getElementById("ai-messages");
  const bubbles = container.querySelectorAll(".ai-msg.assistant .ai-msg-bubble");
  if (bubbles.length) {
    bubbles[bubbles.length - 1].textContent += text;
    scrollBottom();
  }
}

function showTyping() {
  const container = document.getElementById("ai-messages");
  const div = document.createElement("div");
  div.className = "ai-msg assistant ai-typing";
  div.id = "ai-typing";
  div.innerHTML = `
    <div class="ai-msg-role">Local AI</div>
    <div class="ai-msg-bubble">
      <span class="ai-dot"></span>
      <span class="ai-dot"></span>
      <span class="ai-dot"></span>
    </div>
  `;
  container.appendChild(div);
  scrollBottom();
}

function removeTyping() {
  const t = document.getElementById("ai-typing");
  if (t) t.remove();
}

function scrollBottom() {
  const c = document.getElementById("ai-messages");
  c.scrollTop = c.scrollHeight;
}

function escHtml(s) {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

async function sendMessage(text) {
  text = (text || document.getElementById("ai-input").value).trim();
  if (!text || isStreaming) return;

  document.getElementById("ai-input").value = "";
  autoResize();

  messages.push({ role: "user", content: text });
  renderMessage("user", text);
  showTyping();
  setSending(true);

  try {
    const res = await fetch("/ai/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messages }),
    });

    if (!res.ok) throw new Error("Server error");

    removeTyping();
    const assistantDiv = renderMessage("assistant", "");
    const bubble = assistantDiv.querySelector(".ai-msg-bubble");
    let fullText = "";

    const reader = res.body.getReader();
    const decoder = new TextDecoder();
    let buf = "";

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      buf += decoder.decode(value, { stream: true });
      const lines = buf.split("\n");
      buf = lines.pop();
      for (const line of lines) {
        if (!line.startsWith("data: ")) continue;
        const data = line.slice(6).trim();
        try {
          const evt = JSON.parse(data);
          if (evt.content) {
            fullText += evt.content;
            bubble.textContent = fullText;
            scrollBottom();
          }
        } catch {}
      }
    }

    messages.push({ role: "assistant", content: fullText });
    saveHistory();
  } catch (err) {
    removeTyping();
    renderMessage("assistant", "Sorry, something went wrong. Please try again.");
  } finally {
    setSending(false);
  }
}

function setSending(sending) {
  isStreaming = sending;
  document.getElementById("ai-send-btn").disabled = sending;
}

function autoResize() {
  const ta = document.getElementById("ai-input");
  ta.style.height = "auto";
  ta.style.height = Math.min(ta.scrollHeight, 160) + "px";
}

// ============================
// INIT
// ============================

loadHistory();

if (messages.length > 0) {
  const container = document.getElementById("ai-messages");
  container.innerHTML = "";
  messages.forEach((m) => renderMessage(m.role, m.content));
} else {
  renderWelcome();
}

document.getElementById("ai-send-btn").addEventListener("click", () => sendMessage());
document.getElementById("ai-input").addEventListener("keydown", (e) => {
  if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(); }
});
document.getElementById("ai-input").addEventListener("input", autoResize);
document.getElementById("ai-clear-btn").addEventListener("click", clearHistory);
bindChips();
