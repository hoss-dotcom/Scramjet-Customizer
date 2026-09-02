"use strict";

const savedTheme = localStorage.getItem("local-theme") || "snow";
document.documentElement.setAttribute("data-theme", savedTheme);

const canvas = document.getElementById("particle-canvas");
const ctx = canvas.getContext("2d");
let particles = [];
let animationId = null;

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}

function initParticles() {
  if (animationId) cancelAnimationFrame(animationId);
  resizeCanvas();
  particles = Array.from({ length: 36 }, () => ({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    size: Math.random() * 3 + 1,
    speed: Math.random() * 0.5 + 0.2,
    opacity: Math.random() * 0.45 + 0.15,
  }));
  animateParticles();
}

function animateParticles() {
  const color = getComputedStyle(document.documentElement).getPropertyValue("--particle-color").trim() || "137,212,245";
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  particles.forEach((particle) => {
    particle.y += particle.speed;
    if (particle.y > canvas.height + 10) particle.y = -10;
    ctx.globalAlpha = particle.opacity;
    ctx.fillStyle = `rgb(${color})`;
    ctx.beginPath();
    ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
    ctx.fill();
  });
  ctx.globalAlpha = 1;
  animationId = requestAnimationFrame(animateParticles);
}

window.addEventListener("resize", resizeCanvas);
initParticles();

const form = document.getElementById("recommendation-form");
const list = document.getElementById("recommendation-list");
const count = document.getElementById("suggestion-count");
const status = document.getElementById("form-status");
const submitButton = form.querySelector("button[type='submit']");

function formatDate(timestamp) {
  return new Date(timestamp).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function renderRecommendations(items) {
  count.textContent = `${items.length} suggestion${items.length === 1 ? "" : "s"}`;
  list.innerHTML = "";

  if (items.length === 0) {
    list.innerHTML = '<div class="list-message">No suggestions yet. Be the first to add one.</div>';
    return;
  }

  items.forEach((item) => {
    const card = document.createElement("article");
    card.className = "recommendation-card";

    const header = document.createElement("div");
    header.className = "recommendation-card-header";

    const name = document.createElement("h3");
    name.className = "recommendation-name";
    name.textContent = item.name;

    const meta = document.createElement("span");
    meta.className = "recommendation-meta";
    meta.textContent = `${item.submittedBy || "Anonymous"} · ${formatDate(item.timestamp)}`;

    const reason = document.createElement("p");
    reason.className = "recommendation-reason";
    reason.textContent = item.reason || "No reason included.";

    header.append(name, meta);
    card.append(header, reason);
    list.appendChild(card);
  });
}

async function loadRecommendations() {
  try {
    const response = await fetch("/recommendations", { cache: "no-store" });
    if (!response.ok) throw new Error("Unable to load suggestions");
    renderRecommendations(await response.json());
  } catch {
    count.textContent = "Could not load suggestions";
    list.innerHTML = '<div class="list-message">The suggestion list is temporarily unavailable. Try refreshing.</div>';
  }
}

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  status.textContent = "";
  status.className = "form-status";
  submitButton.disabled = true;

  const payload = {
    name: document.getElementById("game-name").value.trim(),
    submittedBy: document.getElementById("submitted-by").value.trim(),
    reason: document.getElementById("game-reason").value.trim(),
  };

  try {
    const response = await fetch("/recommendations", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!response.ok) {
      const result = await response.json().catch(() => ({}));
      throw new Error(result.error || "Could not send suggestion");
    }
    form.reset();
    status.textContent = "Suggestion sent!";
    status.className = "form-status success";
    await loadRecommendations();
  } catch (error) {
    status.textContent = error.message;
    status.className = "form-status error";
  } finally {
    submitButton.disabled = false;
  }
});

document.getElementById("refresh-btn").addEventListener("click", loadRecommendations);
loadRecommendations();
setInterval(loadRecommendations, 15000);

document.addEventListener("keydown", (event) => {
  if (event.altKey && event.key.toLowerCase() === "x") {
    window.location.replace(localStorage.getItem("local-panic-url") || "https://classroom.google.com");
  }
});