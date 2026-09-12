export const formatDateDisplay = (date) => {
    if (!date) return "";

    const dd = String(date.getDate()).padStart(2, "0");
    const mm = String(date.getMonth() + 1).padStart(2, "0");
    const yyyy = date.getFullYear();

    return `${dd}/${mm}/${yyyy}`;
};

export const formatDateForApi = (date) => {
    if (!date) return "";

    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, "0");
    const dd = String(date.getDate()).padStart(2, "0");

    return `${yyyy}-${mm}-${dd}`;
};

export const formatDateForFilter = (date) => {
    if (!date) return '';
    const dd = String(date.getDate()).padStart(2, '0');
    const mmm = date.toLocaleString('en-US', { month: 'short' });
    const yyyy = date.getFullYear();
    return `${dd} ${mmm} ${yyyy}`;
};
