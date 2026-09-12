import { MAX_PRICE } from "./HotelConstants";

export const sanitizeDecimalText = (text) => {
    let filtered = text.replace(/[^0-9.]/g, "");

    const parts = filtered.split(".");

    if (parts.length > 2) {
        filtered = parts[0] + "." + parts.slice(1).join("");
    }

    return filtered;
};

export const enforcePriceMax = (value) => {
    return value > MAX_PRICE ? MAX_PRICE : value;
};

export const finalFromBase = (base, commission) => {
    return base / (1 + commission / 100);
};

export const baseFromFinal = (final, commission) => {
    return final * (1 + commission / 100);
};