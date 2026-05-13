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
  /* 00 FNAE           */ "",
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
