"use strict";

// ============================
// THEME SYNC
// ============================

const savedTheme = localStorage.getItem("local-theme") || "snow";
document.documentElement.setAttribute("data-theme", savedTheme);

// ============================
// GAME DATA (100 games)
// ============================

const GAME_ICONS = ["🎮","👾","🕹️","⚔️","🏆","🎯","🧩","🚀","🐉","⚡","💎","🌟","🔥","🌊","🦅","🤖","🦁","🏹","🎲","🧙"];

const GAME_NAMES = [
  "Pixel Dash","Neon Runner","Space Blaster","Dragon Quest","Tower Defense",
  "Puzzle Master","Speed Racer","Zombie Slayer","Castle Siege","Ocean Explorer",
  "Sky Warriors","Dungeon Crawler","Battle Royale","Word Wizard","Block Builder",
  "Snake Classic","Pac Arena","Tetris Pro","Flappy Jump","Endless Runner",
  "Space Shooter","Alien Attack","Ninja Jump","Fire Escape","Ice Climber",
  "Desert Storm","Jungle Escape","Haunted House","Robot Wars","Star Battle",
  "Pirate Gold","Dino Run","Ski Slope","Bike Race","Car Chase",
  "Tank Battle","Laser Quest","Mind Maze","Color Bomb","Gem Collector",
  "Portal Jump","Gravity Flip","Time Warp","Echo Chamber","Neon Dash",
  "Pixel Wars","Retro Race","Arcade Blitz","Power Surge","Dark Portal",
  "Shadow Runner","Light Speed","Crystal Cave","Lava Leap","Storm Rider",
  "Thunder Strike","Void Walker","Nova Blast","Comet Crash","Orbit Shift",
  "Warp Drive","Cyber Chase","Digital Dash","Binary Jump","Code Breaker",
  "Matrix Run","Glitch Hop","Voxel Land","Chunk World","Block Drop",
  "Tower Fall","Ladder Climb","Rope Swing","Wall Jump","Hover Board",
  "Jet Pack","Wing Suit","Base Jump","Free Fall","Deep Dive",
  "Cave Swim","Rock Climb","Peak Rush","Valley Run","River Ride",
  "Wave Surf","Tide Pool","Coral Reef","Reef Race","Shark Dodge",
  "Whale Watch","Dolphin Dive","Sea Cave","Neon Arcade","Star Forge",
  "Ghost Hunt","Witch Run","Wizard Dash","Rune Quest","Dragon Ride",
  "Phoenix Fire","Thunder God","Storm Blade","Moon Race","Sun Sprint",
];

// ============================
// STORAGE
// ============================

const STORAGE_KEY = "local-game-urls";

function getGameUrls() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {};
  } catch {
    return {};
  }
}

function setGameUrl(index, url) {
  const urls = getGameUrls();
  urls[index] = url;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(urls));
}

// ============================
// STATE
// ============================

let currentGameIndex = null;
const urls = getGameUrls();

// ============================
// RENDER GAMES GRID
// ============================

function renderGrid() {
  const grid = document.getElementById("games-grid");
  const urls = getGameUrls();
  grid.innerHTML = "";

  GAME_NAMES.forEach((name, i) => {
    const url = urls[i] || "";
    const icon = GAME_ICONS[i % GAME_ICONS.length];
    const hasUrl = !!url;

    const card = document.createElement("div");
    card.className = "game-card" + (hasUrl ? " has-url" : " no-url");
    card.style.animationDelay = `${(i % 20) * 0.025}s`;
    card.dataset.index = i;

    card.innerHTML = `
      <div class="game-card-thumb">${icon}</div>
      <div class="game-card-body">
        <div class="game-card-name">${name}</div>
        <div class="game-card-status">${hasUrl ? "▶ Ready to play" : "No URL set"}</div>
      </div>
      <button class="game-edit-btn" data-index="${i}">✏️</button>
    `;

    // Click card → play or open edit
    card.addEventListener("click", (e) => {
      if (e.target.closest(".game-edit-btn")) return;
      const u = getGameUrls()[i];
      if (u) {
        openGame(i, name, u);
      } else {
        openEditModal(i);
      }
    });

    // Edit button
    card.querySelector(".game-edit-btn").addEventListener("click", (e) => {
      e.stopPropagation();
      openEditModal(i);
    });

    grid.appendChild(card);
  });
}

// ============================
// OPEN GAME IN OVERLAY
// ============================

function openGame(index, name, url) {
  const overlay = document.getElementById("game-overlay");
  const frame = document.getElementById("game-frame");
  const title = document.getElementById("overlay-game-title");

  currentGameIndex = index;
  title.textContent = name;
  frame.src = url;
  overlay.classList.remove("hidden");
  document.body.style.overflow = "hidden";
}

function closeGame() {
  const overlay = document.getElementById("game-overlay");
  const frame = document.getElementById("game-frame");
  frame.src = "about:blank";
  overlay.classList.add("hidden");
  document.body.style.overflow = "";
  currentGameIndex = null;
}

document.getElementById("game-close-btn").addEventListener("click", closeGame);

// ============================
// EDIT URL MODAL
// ============================

function openEditModal(index) {
  currentGameIndex = index;
  const modal = document.getElementById("edit-modal");
  const input = document.getElementById("game-url-input");
  input.value = getGameUrls()[index] || "";
  modal.classList.remove("hidden");
  setTimeout(() => input.focus(), 80);
}

function closeEditModal() {
  document.getElementById("edit-modal").classList.add("hidden");
}

document.getElementById("edit-url-btn").addEventListener("click", () => {
  if (currentGameIndex !== null) openEditModal(currentGameIndex);
});

document.getElementById("cancel-url-btn").addEventListener("click", closeEditModal);

document.getElementById("save-url-btn").addEventListener("click", () => {
  const url = document.getElementById("game-url-input").value.trim();
  if (currentGameIndex === null) return;

  setGameUrl(currentGameIndex, url);
  renderGrid();
  closeEditModal();

  if (url) {
    const name = GAME_NAMES[currentGameIndex];
    // Close existing overlay first if open
    const overlay = document.getElementById("game-overlay");
    if (!overlay.classList.contains("hidden")) {
      document.getElementById("game-frame").src = url;
      document.getElementById("overlay-game-title").textContent = name;
    } else {
      openGame(currentGameIndex, name, url);
    }
  }
});

// Enter key in modal
document.getElementById("game-url-input").addEventListener("keydown", (e) => {
  if (e.key === "Enter") document.getElementById("save-url-btn").click();
  if (e.key === "Escape") closeEditModal();
});

// Escape key closes overlays
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    if (!document.getElementById("edit-modal").classList.contains("hidden")) {
      closeEditModal();
    } else if (!document.getElementById("game-overlay").classList.contains("hidden")) {
      closeGame();
    }
  }
});

// ============================
// FLOATING TIPS
// ============================

const TIPS = [
  "boiiiiiiii",
];

const tipsContainer = document.getElementById("floating-tips");

function spawnTip() {
  const tip = document.createElement("div");
  tip.className = "floating-tip";
  tip.textContent = TIPS[Math.floor(Math.random() * TIPS.length)];
  tip.style.left = Math.random() * 78 + 5 + "%";
  tipsContainer.appendChild(tip);
  setTimeout(() => tip.remove(), 7500);
}

setInterval(spawnTip, 5000);
setTimeout(spawnTip, 2000);

// ============================
// PARTICLES
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

const THEME_COLOR = {
  snow:[137,212,245], neon:[255,0,255], sunset:[255,107,53],
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
  const count = { snow:70, neon:35, sunset:25, ocean:28, forest:22 }[theme] || 0;
  for (let i = 0; i < count; i++) {
    const p = makeParticle(theme);
    p.y = Math.random() * canvas.height;
    particles.push(p);
  }
  if (count > 0) animateParticles(theme);
}

function animateParticles(theme) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  const [r,g,b] = THEME_COLOR[theme] || [255,255,255];
  const isOcean = theme === "ocean";

  particles.forEach((p, i) => {
    p.drift += p.driftSpeed;
    p.x += Math.sin(p.drift) * 0.5 + p.speedX;
    p.y += p.speedY;

    ctx.save();
    ctx.globalAlpha = p.opacity;
    if (theme === "neon") {
      ctx.shadowBlur = 10; ctx.shadowColor = `rgb(${r},${g},${b})`;
      ctx.fillStyle = `rgb(${r},${g},${b})`;
      ctx.beginPath(); ctx.arc(p.x, p.y, p.size * 0.8, 0, Math.PI*2); ctx.fill();
    } else if (isOcean) {
      ctx.strokeStyle = `rgba(${r},${g},${b},${p.opacity})`;
      ctx.lineWidth = 1;
      ctx.beginPath(); ctx.arc(p.x, p.y, p.size+1, 0, Math.PI*2); ctx.stroke();
    } else {
      ctx.fillStyle = `rgba(${r},${g},${b},${p.opacity})`;
      ctx.shadowBlur = theme==="snow" ? 4 : 0;
      ctx.shadowColor = `rgb(${r},${g},${b})`;
      ctx.beginPath(); ctx.arc(p.x, p.y, p.size, 0, Math.PI*2); ctx.fill();
    }
    ctx.restore();

    const gone = isOcean ? p.y < -10 : (p.y > canvas.height+10 || p.x < -20 || p.x > canvas.width+20);
    if (gone) { particles[i] = makeParticle(theme); particles[i].x = Math.random()*canvas.width; }
  });

  animId = requestAnimationFrame(() => animateParticles(theme));
}

// ============================
// INIT
// ============================

renderGrid();
initParticles(savedTheme);
