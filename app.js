// Exact Winchester schedule for 19 Rotherley Gardens, SO22 6TN

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
const undoBtn = document.getElementById("undo-btn");
const toggleDaily = document.getElementById("toggle-daily");
const toggleStrong = document.getElementById("toggle-strong");

let lastCollectedIndex = parseInt(
  localStorage.getItem("lastCollectedIndex") ?? "-1",
  10
);
let undoPrevIndex = null;
let undoTimeoutId = null;
let swRegistration = null;
let notificationTimers = [];

function formatDate(date) {
  return date.toLocaleDateString("en-GB", {
    weekday: "short",
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
  const indexed = SCHEDULE.map((item, index) => ({
    ...item,
    index,
    dateObj: new Date(item.date)
  }));

  const upcoming = indexed
    .filter((item) => item.index > lastCollectedIndex)
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
    nextBinIcon.innerHTML = "";
    markCollectedBtn.disabled = true;
    return;
  }

  nextTypeEl.textContent = next.bins.join(", ");
  nextDateEl.textContent = formatDate(new Date(next.date));

  nextBinIcon.innerHTML = next.bins
    .map((type) => {
      const colourVar = BIN_COLOURS[type] || "general";
      return `<div class="bin-icon bin-${colourVar}"></div>`;
    })
    .join("");

  nextBinText.textContent = next.bins.join(", ");
  markCollectedBtn.disabled = false;
}

function updateUpcomingList(upcoming) {
  if (!upcoming.length) {
    upcomingList.innerHTML =
      '<div class="upcoming-row"><span>No upcoming collections</span></div>';
    return;
  }

  const limited = upcoming.slice(0, 5);

  upcomingList.innerHTML = limited
    .map((item) => {
      const icons = item.bins
        .map((type) => {
          const colourVar = BIN_COLOURS[type] || "general";
          return `<div class="bin-icon bin-${colourVar}"></div>`;
        })
        .join("");

      return `
        <div class="upcoming-row">
          <div class="upcoming-icons">${icons}</div>
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

function showUndo(prevIndex) {
  undoPrevIndex = prevIndex;
  undoBtn.hidden = false;

  if (undoTimeoutId) {
    clearTimeout(undoTimeoutId);
  }

  undoTimeoutId = setTimeout(() => {
    undoBtn.hidden = true;
    undoPrevIndex = null;
  }, 10000);
}

function clearNotificationTimers() {
  notificationTimers.forEach((id) => clearTimeout(id));
  notificationTimers = [];
}

function scheduleNotifications(next) {
  clearNotificationTimers();
  if (!next || !("Notification" in window)) return;

  const dailyEnabled =
    localStorage.getItem("dailyCountdownEnabled") !== "false";
  const strongEnabled =
    localStorage.getItem("strongRemindersEnabled") !== "false";

  Notification.requestPermission().then((permission) => {
    if (permission !== "granted") return;

    const dateObj = new Date(next.date);
    const now = new Date();
    const body = next.bins.join(", ");

    // Daily countdown from 7 days before at 23:00
    if (dailyEnabled) {
      for (let daysBefore = 7; daysBefore >= 1; daysBefore--) {
        const when = new Date(dateObj);
        when.setDate(when.getDate() - daysBefore);
        when.setHours(23, 0, 0, 0);

        const delay = when.getTime() - now.getTime();
        if (delay > 0) {
          const title =
            daysBefore === 1
              ? "Bins tomorrow"
              : `Bins in ${daysBefore} days`;
          const id = setTimeout(() => {
            if (swRegistration) {
              swRegistration.showNotification(title, {
                body,
                icon: "assets/icons/icon-192.png",
                badge: "assets/icons/icon-192.png"
              });
            } else {
              new Notification(title, { body });
            }
          }, delay);
          notificationTimers.push(id);
        }
      }
    }

    if (strongEnabled) {
      // Day before 19:00
      const dayBefore = new Date(dateObj);
      dayBefore.setDate(dayBefore.getDate() - 1);
      dayBefore.setHours(19, 0, 0, 0);

      // Day of 07:00
      const morning1 = new Date(dateObj);
      morning1.setHours(7, 0, 0, 0);

      // Day of 10:00
      const morning2 = new Date(dateObj);
      morning2.setHours(10, 0, 0, 0);

      const times = [
        { when: dayBefore, title: "Bins tomorrow" },
        { when: morning1, title: "Bins today" },
        { when: morning2, title: "Final reminder" }
      ];

      times.forEach(({ when, title }) => {
        const delay = when.getTime() - now.getTime();
        if (delay > 0) {
          const id = setTimeout(() => {
            if (swRegistration) {
              swRegistration.showNotification(title, {
                body,
                icon: "assets/icons/icon-192.png",
                badge: "assets/icons/icon-192.png"
              });
            } else {
              new Notification(title, { body });
            }
          }, delay);
          notificationTimers.push(id);
        }
      });
    }
  });
}

function markCollected(next) {
  if (!next) return;

  const now = new Date();
  localStorage.setItem("lastCollectedDate", now.toISOString());

  const prevIndex = lastCollectedIndex;
  lastCollectedIndex = next.index;
  localStorage.setItem("lastCollectedIndex", String(lastCollectedIndex));

  loadLastCollected();
  const { next: newNext, upcoming } = getNextAndUpcoming();
  updateHeader(newNext);
  updateNextCard(newNext);
  updateUpcomingList(upcoming);
  scheduleNotifications(newNext);
  showUndo(prevIndex);
}

function undoMarkCollected() {
  if (undoPrevIndex === null) return;

  lastCollectedIndex = undoPrevIndex;
  localStorage.setItem("lastCollectedIndex", String(lastCollectedIndex));
  undoPrevIndex = null;
  undoBtn.hidden = true;

  const { next, upcoming } = getNextAndUpcoming();
  updateHeader(next);
  updateNextCard(next);
  updateUpcomingList(upcoming);
  scheduleNotifications(next);
}

function loadNotificationSettings() {
  const daily =
    localStorage.getItem("dailyCountdownEnabled") !== "false"; // default true
  const strong =
    localStorage.getItem("strongRemindersEnabled") !== "false"; // default true

  toggleDaily.checked = daily;
  toggleStrong.checked = strong;
}

function init() {
  const { next, upcoming } = getNextAndUpcoming();
  updateHeader(next);
  updateNextCard(next);
  updateUpcomingList(upcoming);
  loadLastCollected();
  loadNotificationSettings();

  markCollectedBtn.addEventListener("click", () => markCollected(next));
  undoBtn.addEventListener("click", undoMarkCollected);

  toggleDaily.addEventListener("change", () => {
    localStorage.setItem(
      "dailyCountdownEnabled",
      toggleDaily.checked ? "true" : "false"
    );
    const { next } = getNextAndUpcoming();
    scheduleNotifications(next);
  });

  toggleStrong.addEventListener("change", () => {
    localStorage.setItem(
      "strongRemindersEnabled",
      toggleStrong.checked ? "true" : "false"
    );
    const { next } = getNextAndUpcoming();
    scheduleNotifications(next);
  });

  if ("serviceWorker" in navigator) {
    navigator.serviceWorker
      .register("service-worker.js")
      .then((reg) => {
        swRegistration = reg;
        scheduleNotifications(next);
      })
      .catch(() => {
        scheduleNotifications(next);
      });
  } else {
    scheduleNotifications(next);
  }
}

document.addEventListener("DOMContentLoaded", init);