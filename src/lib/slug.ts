/**
 * URL slug helpers for wishes. Slugs are assigned at draft creation so
 * preview links (/w/[slug]?preview=1) work before publish (4.11); the
 * first publish keeps whatever slug the draft has (4.12).
 */

const SLUG_MAX = 60;
const SUFFIX_LENGTH = 6;

/** Lowercase, ASCII-safe, hyphenated — non-Latin titles fall back to "wish". */
export const slugify = (input: string): string => {
  const base = input
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, SLUG_MAX)
    .replace(/-+$/g, "");
  return base || "wish";
};

/** Random lowercase-alphanumeric suffix (crypto-backed when available). */
export const randomSuffix = (length: number = SUFFIX_LENGTH): string => {
  const bytes = new Uint8Array(length);
  crypto.getRandomValues(bytes);
  return Array.from(bytes, (b) => (b % 36).toString(36)).join("");
};

/** e.g. "For Julia" -> "for-julia-x7k2p9". */
export const generateSlug = (title: string): string =>
  `${slugify(title)}-${randomSuffix()}`;
