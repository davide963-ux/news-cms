/**
 * Turns a title into a URL-safe slug, handling Albanian diacritics
 * (ë, ç, and their capitals) that a plain regex strip would otherwise
 * just delete rather than transliterate.
 */
export function slugify(input: string): string {
  return input
    .toLowerCase()
    .replace(/ë/g, "e")
    .replace(/ç/g, "c")
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "") // strip remaining accents
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}
