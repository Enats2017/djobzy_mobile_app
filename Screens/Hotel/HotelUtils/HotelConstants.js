export const MAX_IMAGES = 10;

export const MAX_IMAGE_SIZE_BYTES = 3 * 1024 * 1024;

export const MAX_CANCELLATION_DAYS = 100;

export const MAX_ROOMS = 500;

export const MAX_PRICE = 100000;

export const DEFAULT_COMMISSION = 15;

export const FACILITY_OPTIONS = [
    'Security [24-hour]',
    'Free Wi-Fi',
    'Front desk [24-hour]',
    'Breakfast',
    'Room service',
    'Daily housekeeping',
    'Non-smoking rooms',
    'Air conditioning in public areas',
    'Hair Dryer',
    'Welcome Drinks',
];

// Keyword → Ionicons name. Matching is case-insensitive substring match,
// so this also covers custom/free-text facilities that aren't in FACILITY_OPTIONS,
// as long as they contain a matching keyword.
export const FACILITY_ICON_MAP = [
    { keywords: ['security'], icon: 'shield-checkmark-outline' },
    { keywords: ['wifi', 'wi-fi', 'internet'], icon: 'wifi-outline' },
    { keywords: ['front desk', 'reception'], icon: 'desktop-outline' },
    { keywords: ['breakfast'], icon: 'cafe-outline' },
    { keywords: ['room service'], icon: 'restaurant-outline' },
    { keywords: ['housekeeping', 'cleaning'], icon: 'sparkles-outline' },
    { keywords: ['non-smoking', 'no smoking'], icon: 'ban-outline' },
    { keywords: ['air condition', ' ac ', 'a/c'], icon: 'snow-outline' },
    { keywords: ['hair dryer'], icon: 'flash-outline' },
    { keywords: ['welcome drink'], icon: 'wine-outline' },
    { keywords: ['parking', 'valet'], icon: 'car-outline' },
    { keywords: ['pool', 'swimming'], icon: 'water-outline' },
    { keywords: ['gym', 'fitness'], icon: 'barbell-outline' },
    { keywords: ['spa', 'massage'], icon: 'flower-outline' },
    { keywords: ['laundry'], icon: 'shirt-outline' },
    { keywords: ['bar', 'lounge'], icon: 'wine-outline' },
    { keywords: ['pet'], icon: 'paw-outline' },
    { keywords: ['elevator', 'lift'], icon: 'swap-vertical-outline' },
    { keywords: ['tv', 'television'], icon: 'tv-outline' },
];

/**
 * Returns an Ionicons icon name for a facility string, or null if no
 * keyword matches (caller should fall back to initials in that case).
 */
export function getFacilityIcon(facility = '') {
    const lower = facility.toLowerCase();
    const match = FACILITY_ICON_MAP.find((entry) =>
        entry.keywords.some((k) => lower.includes(k))
    );
    return match ? match.icon : null;
}

/**
 * Fallback for facilities with no icon match — first letter of up to
 * the first 2 words, e.g. "Welcome Drinks" -> "WD", "Breakfast" -> "B".
 */
export function getFacilityInitials(facility = '') {
    return facility
        .trim()
        .split(/\s+/)
        .slice(0, 2)
        .map((w) => w[0]?.toUpperCase())
        .join('');
}