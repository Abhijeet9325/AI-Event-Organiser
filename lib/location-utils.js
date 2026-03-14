export function createLocationSlug(city, state) {
    if (!city || !state) return "";

    const citySlug = city.trim().toLowerCase().replace(/\s+/g, "-");
    const stateSlug = state.trim().toLowerCase().replace(/\s+/g, "-");

    return `${citySlug}-${stateSlug}`;
}