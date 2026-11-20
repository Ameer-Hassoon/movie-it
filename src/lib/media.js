const order = ["Trailer", "Teaser", "Clip", "Featurette", "Behind the Scenes", "Bloopers"];

/** Official trailers first, then teasers, clips, featurettes… YouTube only. */
export function pickVideos(videos, max = 12) {
  return (videos?.results ?? [])
    .filter((v) => v.site === "YouTube" && order.includes(v.type))
    .sort(
      (a, b) =>
        order.indexOf(a.type) - order.indexOf(b.type) ||
        Number(b.official) - Number(a.official) ||
        (b.published_at ?? "").localeCompare(a.published_at ?? "")
    )
    .slice(0, max);
}
