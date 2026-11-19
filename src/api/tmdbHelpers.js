const IMAGE_BASE = "https://image.tmdb.org/t/p";

export function imageUrl(path, size = "w500") {
  if (!path) return null;
  return `${IMAGE_BASE}/${size}${path}`;
}

export function year(item) {
  const date = item?.release_date || item?.first_air_date;
  return date ? String(date).split("-")[0] : "N/A";
}

export function uniqueById(list = []) {
  const seen = new Set();
  return list.filter((item) => {
    if (!item || seen.has(item.id)) return false;
    seen.add(item.id);
    return true;
  });
}

/**
 * US certification first, then the first available one. "N/A" when unknown.
 * @param {"movie" | "tv"} kind
 * @param {object} details a TMDB detail response with append_to_response
 */
export function certification(kind, details) {
  const entries =
    kind === "tv"
      ? details?.content_ratings?.results
      : details?.release_dates?.results;

  if (!Array.isArray(entries) || entries.length === 0) return "N/A";

  const read = (entry) => {
    if (!entry) return "";
    if (kind === "tv") return entry.rating || "";
    const match = (entry.release_dates ?? []).find((date) => date.certification);
    return match ? match.certification : "";
  };

  const us = entries.find((entry) => entry.iso_3166_1 === "US" && read(entry));
  if (us) return read(us);

  const fallback = entries.find((entry) => read(entry));
  return fallback ? read(fallback) : "N/A";
}

/** YouTube key of the best trailer (official trailer first), or "". */
export function trailerKey(videos) {
  const list = (videos?.results ?? []).filter((v) => v.site === "YouTube");
  const pick =
    list.find((v) => v.type === "Trailer" && v.official) ||
    list.find((v) => v.type === "Trailer") ||
    list.find((v) => v.type === "Teaser");
  return pick ? pick.key : "";
}

/** "2h 15m" from minutes. */
export function runtime(minutes) {
  if (!minutes) return "";
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return h ? `${h}h${m ? ` ${m}m` : ""}` : `${m}m`;
}
