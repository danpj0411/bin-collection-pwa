// ---------------------------------------------
// MARK AS COLLECTED + UNDO LOGIC
// ---------------------------------------------

export function setupMarkCollected(next) {
    const markBtn = document.getElementById("mark-collected-btn");
    const undoBtn = document.getElementById("undo-btn");

    const STORAGE_KEY = "bin-collected";
    const UNDO_TIMEOUT = 15000; // 15 seconds
    let undoTimer = null;

    // Check if today's collection was already marked
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));

    if (saved && saved.date === next.date) {
        markBtn.textContent = "Collected ✔";
        markBtn.disabled = true;
    }

    // Handle mark as collected
    markBtn.addEventListener("click", () => {
        // Save to localStorage
        localStorage.setItem(
            STORAGE_KEY,
            JSON.stringify({
                date: next.date,
                bins: next.bins,
                timestamp: Date.now()
            })
        );

        // Update UI
        markBtn.textContent = "Collected ✔";
        markBtn.disabled = true;

        // Show undo button
        undoBtn.classList.remove("hidden");

        // Start undo timer
        undoTimer = setTimeout(() => {
            undoBtn.classList.add("hidden");
        }, UNDO_TIMEOUT);
    });

    // Handle undo
    undoBtn.addEventListener("click", () => {
        // Clear saved state
        localStorage.removeItem(STORAGE_KEY);

        // Reset UI
        markBtn.textContent = "Mark as Collected";
        markBtn.disabled = false;

        // Hide undo button
        undoBtn.classList.add("hidden");

        // Clear timer
        if (undoTimer) clearTimeout(undoTimer);
    });
}