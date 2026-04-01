// ---------------------------------------------
// FIND NEXT BIN COLLECTION
// ---------------------------------------------

export function getNextCollection(schedule) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const upcoming = [];

    // Loop through each bin type
    for (const [binType, dates] of Object.entries(schedule)) {
        dates.forEach(dateStr => {
            const date = new Date(dateStr);

            if (date >= today) {
                upcoming.push({
                    date: dateStr,
                    bin: binType
                });
            }
        });
    }

    // Sort by date
    upcoming.sort((a, b) => new Date(a.date) - new Date(b.date));

    // Find the earliest date
    const nextDate = upcoming[0].date;

    // Group all bins that share this date
    const binsForDate = upcoming
        .filter(item => item.date === nextDate)
        .map(item => item.bin);

    return {
        date: nextDate,
        bins: binsForDate
    };
}