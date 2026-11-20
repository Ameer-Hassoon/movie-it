// Display formatters for details pages. Pure functions, locale-aware via Intl.

const safe = (fn, fallback) => {
  try {
    return fn();
  } catch {
    return fallback;
  }
};

/** $160M, $1.2B. Returns "" for 0/unknown (TMDB uses 0 for "not known"). */
export function money(amount) {
  if (!amount) return "";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    notation: "compact",
    maximumFractionDigits: 1,
  })
    .format(amount)
    .replace(/\.0(?=[KMBT]$)/, ""); // older ICU (Node 22) prints "$160.0M"
}

/** "July 15, 2010" from "2010-07-15" (parsed as a calendar date, not UTC midnight). */
export function longDate(iso) {
  if (!iso) return "";
  const [y, m, d] = iso.split("-").map(Number);
  if (!y) return "";
  return new Date(y, (m || 1) - 1, d || 1).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

const languageNames = safe(() => new Intl.DisplayNames(["en"], { type: "language" }), null);
const regionNames = safe(() => new Intl.DisplayNames(["en"], { type: "region" }), null);

export const languageName = (code) => (code && safe(() => languageNames?.of(code), code)) || code || "";
export const regionName = (code) => (code && safe(() => regionNames?.of(code), code)) || code || "";

/** Viewer's country from the browser locale (en-GB → GB), falling back to US. */
export function userRegion() {
  const langs = typeof navigator !== "undefined" ? (navigator.languages ?? [navigator.language]) : [];
  for (const tag of langs) {
    const region = safe(() => new Intl.Locale(tag).maximize().region, undefined);
    if (region) return region;
  }
  return "US";
}

/** Plain text from a TMDB review (they contain markdown and stray HTML). */
export function reviewText(content = "") {
  return content
    .replace(/<[^>]+>/g, "")
    .replace(/\*\*|__|\*/g, "")
    // _emphasis_ pairs only, so snake_case words keep their underscores
    .replace(/(^|[\s(])_(?=\S)([^_\n]*?\S)_(?=$|[\s).,!?;:])/gm, "$1$2")
    .replace(/\r\n/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}
