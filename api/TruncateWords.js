// utils/textUtils.js

export const truncateWords = (text, limit = 20, end = ' ...') => {
  if (!text) return '';
  // Remove HTML tags
  const plainText = text
  .replace(/<\/?[^>]+(>|$)/g, "")
  .replace(/&nbsp;/g, " ");
  // Split into words
  const words = plainText.split(/\s+/);
  // Limit to 'limit' words
  return words.length > limit ? words.slice(0, limit).join(' ') + end : plainText;
};
