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

// ============================
// GAME IMAGES — paste image URLs here (one per game, matches order of GAME_NAMES)
// Leave blank "" to use the emoji icon instead
// ============================

const GAME_IMAGES = [
  /* 00 FNAE           */ "data:image/jpeg;base64,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",
  /* 01 Neon Runner    */ "",
  /* 02 Space Blaster  */ "",
  /* 03 Dragon Quest   */ "",
  /* 04 Tower Defense  */ "",
  /* 05 Puzzle Master  */ "",
  /* 06 Speed Racer    */ "",
  /* 07 Zombie Slayer  */ "",
  /* 08 Castle Siege   */ "",
  /* 09 Ocean Explorer */ "",
  /* 10 Sky Warriors   */ "",
  /* 11 Dungeon Crawlr */ "",
  /* 12 Battle Royale  */ "",
  /* 13 Word Wizard    */ "",
  /* 14 Block Builder  */ "",
  /* 15 Snake Classic  */ "",
  /* 16 Pac Arena      */ "",
  /* 17 Tetris Pro     */ "",
  /* 18 Flappy Jump    */ "",
  /* 19 Endless Runner */ "",
  /* 20 Space Shooter  */ "",
  /* 21 Alien Attack   */ "",
  /* 22 Ninja Jump     */ "",
  /* 23 Fire Escape    */ "",
  /* 24 Ice Climber    */ "",
  /* 25 Desert Storm   */ "",
  /* 26 Jungle Escape  */ "",
  /* 27 Haunted House  */ "",
  /* 28 Robot Wars     */ "",
  /* 29 Star Battle    */ "",
  /* 30 Pirate Gold    */ "",
  /* 31 Dino Run       */ "",
  /* 32 Ski Slope      */ "",
  /* 33 Bike Race      */ "",
  /* 34 Car Chase      */ "",
  /* 35 Tank Battle    */ "",
  /* 36 Laser Quest    */ "",
  /* 37 Mind Maze      */ "",
  /* 38 Color Bomb     */ "",
  /* 39 Gem Collector  */ "",
  /* 40 Portal Jump    */ "",
  /* 41 Gravity Flip   */ "",
  /* 42 Time Warp      */ "",
  /* 43 Echo Chamber   */ "",
  /* 44 Neon Dash      */ "",
  /* 45 Pixel Wars     */ "",
  /* 46 Retro Race     */ "",
  /* 47 Arcade Blitz   */ "",
  /* 48 Power Surge    */ "",
  /* 49 Dark Portal    */ "",
  /* 50 Shadow Runner  */ "",
  /* 51 Light Speed    */ "",
  /* 52 Crystal Cave   */ "",
  /* 53 Lava Leap      */ "",
  /* 54 Storm Rider    */ "",
  /* 55 Thunder Strike */ "",
  /* 56 Void Walker    */ "",
  /* 57 Nova Blast     */ "",
  /* 58 Comet Crash    */ "",
  /* 59 Orbit Shift    */ "",
  /* 60 Warp Drive     */ "",
  /* 61 Cyber Chase    */ "",
  /* 62 Digital Dash   */ "",
  /* 63 Binary Jump    */ "",
  /* 64 Code Breaker   */ "",
  /* 65 Matrix Run     */ "",
  /* 66 Glitch Hop     */ "",
  /* 67 Voxel Land     */ "",
  /* 68 Chunk World    */ "",
  /* 69 Block Drop     */ "",
  /* 70 Tower Fall     */ "",
  /* 71 Ladder Climb   */ "",
  /* 72 Rope Swing     */ "",
  /* 73 Wall Jump      */ "",
  /* 74 Hover Board    */ "",
  /* 75 Jet Pack       */ "",
  /* 76 Wing Suit      */ "",
  /* 77 Base Jump      */ "",
  /* 78 Free Fall      */ "",
  /* 79 Deep Dive      */ "",
  /* 80 Cave Swim      */ "",
  /* 81 Rock Climb     */ "",
  /* 82 Peak Rush      */ "",
  /* 83 Valley Run     */ "",
  /* 84 River Ride     */ "",
  /* 85 Wave Surf      */ "",
  /* 86 Tide Pool      */ "",
  /* 87 Coral Reef     */ "",
  /* 88 Reef Race      */ "",
  /* 89 Shark Dodge    */ "",
  /* 90 Whale Watch    */ "",
  /* 91 Dolphin Dive   */ "",
  /* 92 Sea Cave       */ "",
  /* 93 Neon Arcade    */ "",
  /* 94 Star Forge     */ "",
  /* 95 Ghost Hunt     */ "",
  /* 96 Witch Run      */ "",
  /* 97 Wizard Dash    */ "",
  /* 98 Rune Quest     */ "",
  /* 99 Dragon Ride    */ "",
  /* 100 Phoenix Fire  */ "",
  /* 101 Thunder God   */ "",
  /* 102 Storm Blade   */ "",
  /* 103 Moon Race     */ "",
  /* 104 Sun Sprint    */ "",
];

const GAME_NAMES = [
  "FNAE","Neon Runner","Space Blaster","Dragon Quest","Tower Defense",
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
// GAME URLS — fill in iframe URLs here
// ============================

const GAME_URLS = [
  /* 00 Pixel Dash       */ "https://fnae.n1yshi.dev/",
  /* 01 Neon Runner      */ "",
  /* 02 Space Blaster    */ "",
  /* 03 Dragon Quest     */ "",
  /* 04 Tower Defense    */ "",
  /* 05 Puzzle Master    */ "",
  /* 06 Speed Racer      */ "",
  /* 07 Zombie Slayer    */ "",
  /* 08 Castle Siege     */ "",
  /* 09 Ocean Explorer   */ "",
  /* 10 Sky Warriors     */ "",
  /* 11 Dungeon Crawler  */ "",
  /* 12 Battle Royale    */ "",
  /* 13 Word Wizard      */ "",
  /* 14 Block Builder    */ "",
  /* 15 Snake Classic    */ "",
  /* 16 Pac Arena        */ "",
  /* 17 Tetris Pro       */ "",
  /* 18 Flappy Jump      */ "",
  /* 19 Endless Runner   */ "",
  /* 20 Space Shooter    */ "",
  /* 21 Alien Attack     */ "",
  /* 22 Ninja Jump       */ "",
  /* 23 Fire Escape      */ "",
  /* 24 Ice Climber      */ "",
  /* 25 Desert Storm     */ "",
  /* 26 Jungle Escape    */ "",
  /* 27 Haunted House    */ "",
  /* 28 Robot Wars       */ "",
  /* 29 Star Battle      */ "",
  /* 30 Pirate Gold      */ "",
  /* 31 Dino Run         */ "",
  /* 32 Ski Slope        */ "",
  /* 33 Bike Race        */ "",
  /* 34 Car Chase        */ "",
  /* 35 Tank Battle      */ "",
  /* 36 Laser Quest      */ "",
  /* 37 Mind Maze        */ "",
  /* 38 Color Bomb       */ "",
  /* 39 Gem Collector    */ "",
  /* 40 Portal Jump      */ "",
  /* 41 Gravity Flip     */ "",
  /* 42 Time Warp        */ "",
  /* 43 Echo Chamber     */ "",
  /* 44 Neon Dash        */ "",
  /* 45 Pixel Wars       */ "",
  /* 46 Retro Race       */ "",
  /* 47 Arcade Blitz     */ "",
  /* 48 Power Surge      */ "",
  /* 49 Dark Portal      */ "",
  /* 50 Shadow Runner    */ "",
  /* 51 Light Speed      */ "",
  /* 52 Crystal Cave     */ "",
  /* 53 Lava Leap        */ "",
  /* 54 Storm Rider      */ "",
  /* 55 Thunder Strike   */ "",
  /* 56 Void Walker      */ "",
  /* 57 Nova Blast       */ "",
  /* 58 Comet Crash      */ "",
  /* 59 Orbit Shift      */ "",
  /* 60 Warp Drive       */ "",
  /* 61 Cyber Chase      */ "",
  /* 62 Digital Dash     */ "",
  /* 63 Binary Jump      */ "",
  /* 64 Code Breaker     */ "",
  /* 65 Matrix Run       */ "",
  /* 66 Glitch Hop       */ "",
  /* 67 Voxel Land       */ "",
  /* 68 Chunk World      */ "",
  /* 69 Block Drop       */ "",
  /* 70 Tower Fall       */ "",
  /* 71 Ladder Climb     */ "",
  /* 72 Rope Swing       */ "",
  /* 73 Wall Jump        */ "",
  /* 74 Hover Board      */ "",
  /* 75 Jet Pack         */ "",
  /* 76 Wing Suit        */ "",
  /* 77 Base Jump        */ "",
  /* 78 Free Fall        */ "",
  /* 79 Deep Dive        */ "",
  /* 80 Cave Swim        */ "",
  /* 81 Rock Climb       */ "",
  /* 82 Peak Rush        */ "",
  /* 83 Valley Run       */ "",
  /* 84 River Ride       */ "",
  /* 85 Wave Surf        */ "",
  /* 86 Tide Pool        */ "",
  /* 87 Coral Reef       */ "",
  /* 88 Reef Race        */ "",
  /* 89 Shark Dodge      */ "",
  /* 90 Whale Watch      */ "",
  /* 91 Dolphin Dive     */ "",
  /* 92 Sea Cave         */ "",
  /* 93 Neon Arcade      */ "",
  /* 94 Star Forge       */ "",
  /* 95 Ghost Hunt       */ "",
  /* 96 Witch Run        */ "",
  /* 97 Wizard Dash      */ "",
  /* 98 Rune Quest       */ "",
  /* 99 Dragon Ride      */ "",
  /* 100 Phoenix Fire    */ "",
  /* 101 Thunder God     */ "",
  /* 102 Storm Blade     */ "",
  /* 103 Moon Race       */ "",
  /* 104 Sun Sprint      */ "",
];

// ============================
// RENDER GAMES GRID
// ============================

let searchQuery = "";

function renderGrid() {
  const grid = document.getElementById("games-grid");
  grid.innerHTML = "";
  const q = searchQuery.toLowerCase();

  GAME_NAMES.forEach((name, i) => {
    if (q && !name.toLowerCase().includes(q)) return;

    const url = GAME_URLS[i] || "";
    const icon = GAME_ICONS[i % GAME_ICONS.length];
    const hasUrl = !!url;

    const card = document.createElement("div");
    card.className = "game-card" + (hasUrl ? " has-url" : " no-url");
    card.style.animationDelay = `${(i % 20) * 0.025}s`;
    card.dataset.index = i;

    const imgUrl = GAME_IMAGES[i] || "";
    const thumbHtml = imgUrl
      ? `<div class="game-card-thumb"><img src="${imgUrl}" class="game-card-img" alt="${name}" /></div>`
      : `<div class="game-card-thumb game-card-thumb-emoji">${icon}</div>`;

    card.innerHTML = `
      ${thumbHtml}
      <div class="game-card-body">
        <div class="game-card-name">${name}</div>
        <div class="game-card-status">${hasUrl ? "▶ Ready to play" : "No URL set"}</div>
      </div>
    `;

    card.addEventListener("click", () => {
      if (url) openGame(name, url);
    });

    grid.appendChild(card);
  });

  if (q && grid.children.length === 0) {
    grid.innerHTML = `<p class="games-no-results">No games match "${q}"</p>`;
  }
}

// ============================
// SEARCH FILTER
// ============================

document.getElementById("games-search").addEventListener("input", (e) => {
  searchQuery = e.target.value;
  renderGrid();
});

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

document.getElementById("panic-btn").addEventListener("click", panicNow);

// ============================
// GAME OVERLAY (via Scramjet proxy)
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

async function openGame(name, url) {
  document.getElementById("overlay-game-title").textContent = name;
  document.getElementById("game-overlay").classList.remove("hidden");
  document.body.style.overflow = "hidden";

  try {
    await registerSW();
  } catch (err) {
    console.error("SW registration failed:", err);
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

  const container = document.getElementById("game-frame-container");
  container.innerHTML = "";
  const frame = scramjet.createFrame();
  frame.frame.id = "sj-game-frame";
  container.appendChild(frame.frame);
  activeFrame = frame;
  frame.go(url);
}

function closeGame() {
  if (activeFrame) {
    try { activeFrame.frame.remove(); } catch (e) {}
    activeFrame = null;
  }
  document.getElementById("game-frame-container").innerHTML = "";
  document.getElementById("game-overlay").classList.add("hidden");
  document.body.style.overflow = "";
}

document.getElementById("game-close-btn").addEventListener("click", closeGame);

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") closeGame();
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
