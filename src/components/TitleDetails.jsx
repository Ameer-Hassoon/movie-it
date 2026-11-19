import { useEffect, useState } from "react";
import { certification, imageUrl, runtime, trailerKey, uniqueById, year } from "../api/tmdbHelpers.js";
import PersonCard from "./PersonCard";
import Score from "./Score";
import TrailerModal from "./TrailerModal";

function billing(kind, t) {
  const crew = t.credits?.crew ?? [];
  const names = (jobs) =>
    uniqueById(crew.filter((c) => jobs.includes(c.job)))
      .slice(0, 3)
      .map((c) => c.name);

  const rows =
    kind === "movie"
      ? [
          ["Directed by", names(["Director"])],
          ["Written by", names(["Screenplay", "Writer", "Story"])],
        ]
      : [["Created by", (t.created_by ?? []).slice(0, 3).map((c) => c.name)]];

  rows.push(["Studio", (t.production_companies ?? []).slice(0, 2).map((c) => c.name)]);
  return rows.filter(([, list]) => list.length > 0);
}

function facts(kind, t) {
  const cert = certification(kind, t);
  return [
    year(t),
    cert !== "N/A" ? cert : null,
    kind === "movie"
      ? runtime(t.runtime)
      : t.number_of_seasons
        ? `${t.number_of_seasons} ${t.number_of_seasons === 1 ? "season" : "seasons"}`
        : null,
  ].filter(Boolean);
}

/** The details page for a movie or a show. The backdrop hero is the one loud moment. */
const TitleDetails = ({ kind, title: t }) => {
  const [trailerOpen, setTrailerOpen] = useState(false);
  const name = t.title ?? t.name;
  const backdrop = imageUrl(t.backdrop_path, "w1280");
  const poster = imageUrl(t.poster_path, "w500");
  const video = trailerKey(t.videos);
  const cast = uniqueById(t.credits?.cast ?? []).slice(0, 20);

  useEffect(() => {
    document.title = `${name} (${year(t)}) · Movie It`;
  }, [name, t]);

  return (
    <article>
      {/* Hero */}
      <section className="relative isolate overflow-hidden">
        {backdrop ? (
          <img src={backdrop} alt="" className="absolute inset-0 -z-10 size-full object-cover object-top opacity-45" />
        ) : null}
        <div className="absolute inset-0 -z-10 bg-gradient-to-t from-night via-night/70 to-night/20" />
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-night/90 via-night/40 to-transparent" />

        <div className="mx-auto grid max-w-7xl gap-8 px-4 pb-12 pt-10 sm:px-6 md:grid-cols-[minmax(0,300px)_1fr] md:items-end md:gap-12 md:pb-16 md:pt-24">
          {poster ? (
            <img
              src={poster}
              alt={`${name} poster`}
              className="w-44 rounded-lg shadow-[0_24px_60px_-12px_rgb(0_0_0/0.7)] ring-1 ring-white/10 sm:w-56 md:w-full"
            />
          ) : null}

          <div className="max-w-3xl">
            <p className="flex flex-wrap gap-x-4 gap-y-1 text-muted">
              {facts(kind, t).map((f) => (
                <span key={f}>{f}</span>
              ))}
            </p>
            <h1 className="mt-2 font-display text-5xl font-black uppercase leading-[0.88] tracking-tight text-balance sm:text-7xl lg:text-8xl">
              {name}
            </h1>
            {t.tagline ? <p className="mt-4 text-lg italic text-paper/80">{t.tagline}</p> : null}

            <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-4">
              {video ? (
                <button
                  type="button"
                  onClick={() => setTrailerOpen(true)}
                  className="inline-flex items-center gap-2.5 rounded-md bg-bulb px-5 py-3 font-semibold text-night transition-colors hover:bg-bulb-deep"
                >
                  <svg viewBox="0 0 20 20" className="size-4" fill="currentColor" aria-hidden="true">
                    <path d="M6 4l10 6-10 6z" />
                  </svg>
                  Play trailer
                </button>
              ) : null}
              <Score value={t.vote_average} count={t.vote_count} className="text-lg" />
            </div>

            {t.genres?.length ? (
              <ul className="mt-6 flex flex-wrap gap-2" aria-label="Genres">
                {t.genres.map((g) => (
                  <li key={g.id} className="rounded-full border border-line bg-ink/60 px-3 py-1 text-sm text-paper/90">
                    {g.name}
                  </li>
                ))}
              </ul>
            ) : null}
          </div>
        </div>
      </section>

      {/* Story + billing block */}
      <section className="mx-auto grid max-w-7xl gap-10 px-4 py-10 sm:px-6 md:grid-cols-[minmax(0,1fr)_minmax(0,320px)] md:gap-16">
        <div className="max-w-[68ch]">
          <h2 className="font-display text-3xl font-extrabold">Story</h2>
          <p className="mt-3 text-lg leading-relaxed text-paper/85">
            {t.overview || "TMDB doesn't have a synopsis for this one yet."}
          </p>
        </div>
        {billing(kind, t).length ? (
          <dl className="space-y-4 border-l-2 border-bulb pl-5">
            {billing(kind, t).map(([label, list]) => (
              <div key={label}>
                <dt className="text-sm text-muted">{label}</dt>
                <dd className="font-display text-2xl font-bold leading-tight">{list.join(", ")}</dd>
              </div>
            ))}
          </dl>
        ) : null}
      </section>

      {/* Cast */}
      {cast.length ? (
        <section className="mx-auto max-w-7xl px-4 pb-20 sm:px-6">
          <h2 className="font-display text-3xl font-extrabold">Cast</h2>
          <ul className="scroll-row -mx-4 mt-4 flex scroll-px-4 gap-4 overflow-x-auto px-4 pb-4 sm:-mx-6 sm:scroll-px-6 sm:px-6">
            {cast.map((p) => (
              <li key={p.id} className="w-32 shrink-0 snap-start sm:w-36">
                <PersonCard person={p} subtitle={p.character || p.roles?.[0]?.character} compact />
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {video ? (
        <TrailerModal videoKey={video} title={name} open={trailerOpen} onClose={() => setTrailerOpen(false)} />
      ) : null}
    </article>
  );
};

export default TitleDetails;

/** Skeleton matching the hero layout. */
export const TitleDetailsSkeleton = () => (
  <div className="mx-auto grid max-w-7xl animate-pulse gap-8 px-4 pb-12 pt-10 sm:px-6 md:grid-cols-[300px_1fr] md:items-end md:gap-12 md:pt-24" aria-hidden="true">
    <div className="aspect-[2/3] w-44 rounded-lg bg-panel sm:w-56 md:w-full" />
    <div>
      <div className="h-4 w-40 rounded bg-panel" />
      <div className="mt-4 h-16 w-4/5 rounded bg-panel" />
      <div className="mt-6 h-12 w-44 rounded-md bg-panel" />
    </div>
  </div>
);
