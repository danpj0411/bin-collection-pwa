// ---------------------------------------------
// COUNTDOWN TIMER
// ---------------------------------------------

export function updateCountdown(targetDateStr, element) {
    const targetDate = new Date(targetDateStr);
    targetDate.setHours(0, 0, 0, 0);

    function refresh() {
        const now = new Date();
        const diff = targetDate - now;

        if (diff <= 0) {
            element.textContent = "Collection is today";
            return;
        }

        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
        const minutes = Math.floor((diff / (1000 * 60)) % 60);

        let text = "";

        if (days > 0) {
            text += `${days} day${days !== 1 ? "s" : ""}`;
        }

        if (hours > 0) {
            text += (text ? ", " : "") + `${hours} hour${hours !== 1 ? "s" : ""}`;
        }

        if (minutes > 0 && days === 0) {
            text += (text ? ", " : "") + `${minutes} min`;
        }

        element.textContent = text || "Less than a minute";
    }

    // Initial call
    refresh();

    // Update every second
    setInterval(refresh, 1000);
}