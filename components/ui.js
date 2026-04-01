// ---------------------------------------------
// UI RENDERING FOR NEXT COLLECTION
// ---------------------------------------------

// Map bin types to CSS classes
const BIN_CLASSES = {
    food: "bin-food",
    general: "bin-general",
    garden: "bin-garden",
    recycling: "bin-recycling",
    glass: "bin-glass"
};

export function renderCollectionInfo(next, element) {
    const { date, bins } = next;

    const dateObj = new Date(date);
    const formatted = dateObj.toLocaleDateString("en-GB", {
        weekday: "long",
        day: "numeric",
        month: "long"
    });

    // Clear previous content
    element.innerHTML = "";

    // Create container
    const wrapper = document.createElement("div");
    wrapper.classList.add("collection-box");

    // Add date
    const dateEl = document.createElement("p");
    dateEl.innerHTML = `<strong>${formatted}</strong>`;
    wrapper.appendChild(dateEl);

    // Add bin tags
    const binsContainer = document.createElement("div");
    binsContainer.style.marginTop = "10px";

    bins.forEach(bin => {
        const tag = document.createElement("span");
        tag.classList.add("bin-tag");

        // Apply colour class
        if (BIN_CLASSES[bin]) {
            tag.classList.add(BIN_CLASSES[bin]);
        }

        tag.textContent = bin;
        binsContainer.appendChild(tag);
    });

    wrapper.appendChild(binsContainer);

    // If multiple bins, apply multi-bin styling
    if (bins.length > 1) {
        wrapper.classList.add("bin-multi");
    }

    element.appendChild(wrapper);
}