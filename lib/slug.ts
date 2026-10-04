/**
 * Heading anchors for post bodies. Vietnamese diacritics are folded to ASCII
 * ("Vì sao điều này" → "vi-sao-dieu-nay") so the anchors stay readable in a
 * shared link. Used both when listing a post's headings for its table of
 * contents and when rendering the `h2` itself, so the two always agree.
 */
export function slugify(text: string): string {
  return text
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
