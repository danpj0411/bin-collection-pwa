// ---------------------------------------------
// MAIN APP CONTROLLER
// ---------------------------------------------

import { getNextCollection } from "./components/next-collection.js";
import { updateCountdown } from "./components/countdown.js";
import { renderCollectionInfo } from "./components/ui.js";
import { setupMarkCollected } from "./components/mark-collected.js";

// DOM elements
const countdownEl = document.getElementById("countdown");
const collectionInfoEl = document.getElementById("collection-info");

// Load schedule + initialise app
async function init() {
    try {
        const response = await fetch("./data/schedule.json");
        const schedule = await response.json();

        const next = getNextCollection(schedule);

        // Update UI
        renderCollectionInfo(next, collectionInfoEl);

        // Start countdown timer
        updateCountdown(next.date, countdownEl);

        // Setup mark collected logic
        setupMarkCollected(next);

    } catch (err) {
        console.error("Error loading schedule:", err);
        collectionInfoEl.textContent = "Failed to load schedule.";
    }
}

init();

// ---------------------------------------------
// REGISTER SERVICE WORKER
// ---------------------------------------------
if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register("./service-worker.js")
        .catch(err => console.error("SW registration failed:", err));
}