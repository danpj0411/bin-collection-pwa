// Simple schedule model: edit this to match your real collections
const SCHEDULE = [
  { date: "2026-04-02", bins: ["Food Waste", "Recycling"] },
  { date: "2026-04-09", bins: ["Food Waste", "General Waste", "Garden Waste"] },
  { date: "2026-04-16", bins: ["Food Waste", "Recycling"] },
  { date: "2026-04-23", bins: ["Food Waste", "General Waste", "Garden Waste"] },
  { date: "2026-04-30", bins: ["Food Waste", "Recycling"] }
];

const BIN_COLOURS = {
  "Food Waste": "food",
  "Recycling": "recycling",
  "Glass": "glass",
  "General Waste": "general",
  "Garden Waste": "garden"
};

const todayLabel = document.getElementById("today-label");
const countdownLabel = document.getElementById("countdown-label");
const nextTypeEl = document.getElementById("next-type");
const nextDateEl = document.getElementById("next-date");
const nextBinIcon = document.getElementById("next-bin-icon");
const nextBinText = document.getElementById("next-bin-text");
const upcomingList = document.getElementById("upcoming-list");
const markCollectedBtn = document.getElementById("mark-collected-btn");
const lastCollectedLabel = document.getElementById("last-collected-label");

function formatDate(date) {
  return date.toLocaleDateString("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "short"
  });
}

function daysBetween(a, b) {
  const ms = b.setHours(0, 0, 0, 0) - a.setHours(0, 0, 0, 0);
  return Math.round(ms / 86400000);
}

function getNextAndUpcoming() {
  const today = new Date();
  const upcoming = SCHEDULE
    .map((item) => ({
      ...item,
      dateObj: new Date(item.date)
    }))
    .filter((item) => item.dateObj >= today)
    .sort((a, b) => a.dateObj - b.dateObj);

  return {
    next: upcoming[0] || null,
    upcoming
  };
}

function updateHeader(next) {
  const now = new Date();
  todayLabel.textContent = formatDate(now);

  if (!next) {
    countdownLabel.textContent = "No upcoming collections";
    return;
  }

  const diff = daysBetween(now, new Date(next.date));
  countdownLabel.textContent =
    diff === 0 ? "Today" : diff === 1 ? "1 day away" : `${diff} days away`;
}

function updateNextCard(next) {
  if (!next) {
    nextTypeEl.textContent = "No upcoming collections";
    nextDateEl.textContent = "";
    nextBinText.textContent = "";
    nextBinIcon.style.background = "#333";
    markCollectedBtn.disabled = true;
    return;
  }

  const mainType = next.bins[0];
  nextTypeEl.textContent = mainType;
  nextDateEl.textContent = formatDate(new Date(next.date));
  nextBinText.textContent = next.bins.join(", ");

  const colourVar = BIN_COLOURS[mainType] || "general";
  nextBinIcon.className = `bin-icon bin-${colourVar}`;
}

function updateUpcomingList(upcoming) {
  if (!upcoming.length) {
    upcomingList.innerHTML =
      '<div class="upcoming-row"><span>No upcoming collections</span></div>';
    return;
  }

  upcomingList.innerHTML = upcoming
    .map((item) => {
      const mainType = item.bins[0];
      const colourVar = BIN_COLOURS[mainType] || "general";
      return `
        <div class="upcoming-row">
          <div class="bin-icon bin-${colourVar}"></div>
          <div>
            <div class="upcoming-text-main">${formatDate(item.dateObj)}</div>
            <div class="upcoming-text-sub">${item.bins.join(", ")}</div>
          </div>
        </div>
      `;
    })
    .join("");
}

function loadLastCollected() {
  const value = localStorage.getItem("lastCollectedDate");
  if (!value) {
    lastCollectedLabel.textContent = "";
    return;
  }
  const d = new Date(value);
  lastCollectedLabel.textContent = `Last marked as collected: ${formatDate(d)}`;
}

function markCollected(next) {
  if (!next) return;
  const now = new Date();
  localStorage.setItem("lastCollectedDate", now.toISOString());
  loadLastCollected();
}

function init() {
  const { next, upcoming } = getNextAndUpcoming();
  updateHeader(next);
  updateNextCard(next);
  updateUpcomingList(upcoming);
  loadLastCollected();

  markCollectedBtn.addEventListener("click", () => markCollected(next));

  if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register("service-worker.js").catch(() => {});
  }
}

document.addEventListener("DOMContentLoaded", init);