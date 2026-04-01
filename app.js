// Exact Winchester schedule for 19 Rotherley Gardens, SO22 6TN
// Derived from the council PDF calendar.

const SCHEDULE = [
  // 2026-03
  { date: "2026-03-18", bins: ["Food Waste", "Garden Waste", "General Waste"] },
  { date: "2026-03-25", bins: ["Food Waste", "Recycling"] },

  // 2026-04
  { date: "2026-04-01", bins: ["Food Waste", "Garden Waste", "General Waste"] },
  { date: "2026-04-08", bins: ["Glass"] },
  { date: "2026-04-09", bins: ["Food Waste", "Recycling"] },
  { date: "2026-04-15", bins: ["Food Waste", "Garden Waste", "General Waste"] },
  { date: "2026-04-22", bins: ["Food Waste", "Recycling"] },
  { date: "2026-04-29", bins: ["Food Waste", "Garden Waste", "General Waste"] },

  // 2026-05
  { date: "2026-05-07", bins: ["Food Waste", "Glass", "Recycling"] },
  { date: "2026-05-13", bins: ["Food Waste", "Garden Waste", "General Waste"] },
  { date: "2026-05-20", bins: ["Food Waste", "Recycling"] },
  { date: "2026-05-28", bins: ["Food Waste", "Garden Waste", "General Waste"] },

  // 2026-06
  { date: "2026-06-03", bins: ["Food Waste", "Glass", "Recycling"] },
  { date: "2026-06-10", bins: ["Food Waste", "Garden Waste", "General Waste"] },
  { date: "2026-06-17", bins: ["Food Waste", "Recycling"] },
  { date: "2026-06-24", bins: ["Food Waste", "Garden Waste", "General Waste"] },

  // 2026-07
  { date: "2026-07-01", bins: ["Food Waste", "Glass", "Recycling"] },
  { date: "2026-07-08", bins: ["Food Waste", "Garden Waste", "General Waste"] },
  { date: "2026-07-15", bins: ["Food Waste", "Recycling"] },
  { date: "2026-07-22", bins: ["Food Waste", "Garden Waste", "General Waste"] },
  { date: "2026-07-29", bins: ["Food Waste", "Glass", "Recycling"] },

  // 2026-08
  { date: "2026-08-05", bins: ["Food Waste", "Garden Waste", "General Waste"] },
  { date: "2026-08-12", bins: ["Food Waste", "Recycling"] },
  { date: "2026-08-19", bins: ["Food Waste", "Garden Waste", "General Waste"] },
  { date: "2026-08-26", bins: ["Food Waste", "Glass", "Recycling"] },

  // 2026-09
  { date: "2026-09-03", bins: ["Food Waste", "Garden Waste", "General Waste"] },
  { date: "2026-09-09", bins: ["Food Waste", "Recycling"] },
  { date: "2026-09-16", bins: ["Food Waste", "Garden Waste", "General Waste"] },
  { date: "2026-09-23", bins: ["Food Waste", "Glass", "Recycling"] },
  { date: "2026-09-30", bins: ["Food Waste", "Garden Waste", "General Waste"] },

  // 2026-10
  { date: "2026-10-07", bins: ["Food Waste", "Recycling"] },
  { date: "2026-10-14", bins: ["Food Waste", "Garden Waste", "General Waste"] },
  { date: "2026-10-21", bins: ["Food Waste", "Glass", "Recycling"] },
  { date: "2026-10-28", bins: ["Food Waste", "Garden Waste", "General Waste"] },

  // 2026-11
  { date: "2026-11-04", bins: ["Food Waste", "Recycling"] },
  { date: "2026-11-11", bins: ["Food Waste", "Garden Waste", "General Waste"] },
  { date: "2026-11-18", bins: ["Food Waste", "Glass", "Recycling"] },
  { date: "2026-11-25", bins: ["Food Waste", "Garden Waste", "General Waste"] },

  // 2026-12
  { date: "2026-12-02", bins: ["Food Waste", "Recycling"] },
  { date: "2026-12-09", bins: ["Food Waste", "Garden Waste", "General Waste"] },
  { date: "2026-12-16", bins: ["Food Waste", "Glass", "Recycling"] },
  { date: "2026-12-23", bins: ["Food Waste", "Garden Waste", "General Waste"] },
  { date: "2026-12-30", bins: ["Food Waste", "Recycling"] },

  // 2027-01
  { date: "2027-01-06", bins: ["Food Waste", "Garden Waste", "General Waste"] },
  { date: "2027-01-13", bins: ["Food Waste", "Glass", "Recycling"] },
  { date: "2027-01-20", bins: ["Food Waste", "Garden Waste", "General Waste"] },
  { date: "2027-01-27", bins: ["Food Waste", "Recycling"] },

  // 2027-02
  { date: "2027-02-03", bins: ["Food Waste", "Garden Waste", "General Waste"] },
  { date: "2027-02-10", bins: ["Food Waste", "Glass", "Recycling"] },
  { date: "2027-02-17", bins: ["Food Waste", "Garden Waste", "General Waste"] },
  { date: "2027-02-24", bins: ["Food Waste", "Recycling"] }
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
  const aMid = new Date(a.getFullYear(), a.getMonth(), a.getDate());
  const bMid = new Date(b.getFullYear(), b.getMonth(), b.getDate());
  const ms = bMid - aMid;
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
    nextBinIcon.className = "bin-icon";
    markCollectedBtn.disabled = true;
    return;
  }

  const mainType = next.bins[0];
  nextTypeEl.textContent = mainType;
  nextDateEl.textContent = formatDate(new Date(next.date));
  nextBinText.textContent = next.bins.join(", ");

  const colourVar = BIN_COLOURS[mainType] || "general";
  nextBinIcon.className = `bin-icon bin-${colourVar}`;
  markCollectedBtn.disabled = false;
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