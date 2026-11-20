import { useEffect, useState } from "react";
import { certification, imageUrl, runtime, trailerKey, uniqueById, year } from "../api/tmdbHelpers.js";
import { languageName, longDate, money } from "../lib/format.js";
import { pickVideos } from "../lib/media.js";
import MediaRow from "./MediaRow";
import PersonCard from "./PersonCard";
import Reviews from "./Reviews";
import Score from "./Score";
import TrailerModal from "./TrailerModal";
import VideoRow from "./VideoRow";
import WatchProviders from "./WatchProviders";
import WatchlistButton from "./WatchlistButton";

const list = (items, n = 3) => (items ?? []).slice(0, n).map((i) => i.name ?? i.english_name).filter(Boolean);

/** Key creative credits, most important first. */
function billing(kind, t) {
  const crew = t.credits?.crew ?? [];
  const names = (jobs, n = 3) =>
    uniqueById(crew.filter((c) => jobs.includes(c.job)))
      .slice(0, n)
      .map((c) => c.name);

  const rows =
    kind === "movie"
      ? [
          ["Directed by", names(["Director"])],
          ["Screenplay", names(["Screenplay", "Writer"])],
          ["Story", names(["Story", "Novel", "Original Story", "Characters"])],
          ["Produced by", names(["Producer"])],
          ["Music", names(["Original Music Composer", "Music"], 2)],
          ["Cinematography", names(["Director of Photography"], 2)],
          ["Editing", names(["Editor"], 2)],
        ]
      : [
          ["Created by", list(t.created_by)],
          ["Executive producers", names(["Executive Producer"])],
          ["Music", names(["Original Music Composer", "Music", "Main Title Theme Composer"], 2)],
        ];

  return rows.filter(([, people]) => people.length > 0);
}

/** One-line facts under the hero title. */
function heroFacts(kind, t) {
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

/** The full "Details" grid. Every row is optional and hidden when TMDB has no data. */
function detailRows(kind, t) {
  const original = t.original_title ?? t.original_name;
  const name = t.title ?? t.name;
  const common = [
    ["Original title", original && original !== name ? original : ""],
    ["Original language", languageName(t.original_language)],
    ["Spoken languages", (t.spoken_languages ?? []).slice(0, 4).map((l) => l.english_name || l.name).join(", ")],
    ["Countries", list(t.production_countries, 3).join(", ")],
    ["Production", list(t.production_companies, 3).join(", ")],
  ];

  if (kind === "movie") {
    const multiple = t.budget && t.revenue ? t.revenue / t.budget : 0;
    return [
      ["Status", t.status],
      ["Release date", longDate(t.release_date)],
      ["Runtime", runtime(t.runtime)],
      ["Budget", money(t.budget)],
      [
        "Box office",
        t.revenue
          ? `${money(t.revenue)}${multiple ? ` (${multiple >= 1 ? `${multiple.toFixed(1)}× its budget` : "below its budget"})` : ""}`
          : "",
      ],
      ["Collection", t.belongs_to_collection?.name ?? ""],
      ...common,
    ];
  }

  const next = t.next_episode_to_air;
  const seasons = t.number_of_seasons;
  return [
    ["Status", t.status],
    ["First aired", longDate(t.first_air_date)],
    [t.in_production ? "Latest episode" : "Last aired", longDate(t.last_air_date)],
    ["Next episode", next ? `${longDate(next.air_date)}, S${next.season_number} E${next.episode_number}` : ""],
    ["Seasons", seasons ? `${seasons} ${seasons === 1 ? "season" : "seasons"}, ${t.number_of_episodes ?? "?"} episodes` : ""],
    ["Episode length", runtime(t.episode_run_time?.[0])],
    ["Network", list(t.networks, 3).join(", ")],
    ["Type", t.type],
    ...common,
  ];
}

function links(kind, t) {
  const imdb = t.imdb_id ?? t.external_ids?.imdb_id;
  return [
    t.homepage ? ["Official site", t.homepage] : null,
    imdb ? ["IMDb", `https://www.imdb.com/title/${imdb}/`] : null,
    ["TMDB", `https://www.themoviedb.org/${kind}/${t.id}`],
  ].filter(Boolean);
}

const sectionTitle = "font-display text-3xl font-extrabold";

/** The details page for a movie or a show. The backdrop hero is the one loud moment. */
const TitleDetails = ({ kind, title: t }) => {
  const [playing, setPlaying] = useState(null); // { key, name } of the video in the modal
  const name = t.title ?? t.name;
  const backdrop = imageUrl(t.backdrop_path, "w1280");
  const poster = imageUrl(t.poster_path, "w500");
  const trailer = trailerKey(t.videos);
  const cast = uniqueById(t.credits?.cast ?? []).slice(0, 20);
  const crew = billing(kind, t);
  const details = detailRows(kind, t).filter(([, value]) => value);
  const keywords = (t.keywords?.keywords ?? t.keywords?.results ?? []).slice(0, 14);

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
              {heroFacts(kind, t).map((f) => (
                <span key={f}>{f}</span>
              ))}
            </p>
            <h1 className="mt-2 font-display text-5xl font-black uppercase leading-[0.88] tracking-tight text-balance sm:text-7xl lg:text-8xl">
              {name}
            </h1>
            {t.tagline ? <p className="mt-4 text-lg italic text-paper/80">{t.tagline}</p> : null}

            <div className="mt-6 flex flex-wrap items-center gap-x-4 gap-y-4">
              {trailer ? (
                <button
                  type="button"
                  onClick={() => setPlaying({ key: trailer, name: `${name} trailer` })}
                  className="inline-flex items-center gap-2.5 rounded-md bg-bulb px-5 py-3 font-semibold text-night transition-colors hover:bg-bulb-deep"
                >
                  <svg viewBox="0 0 20 20" className="size-4" fill="currentColor" aria-hidden="true">
                    <path d="M6 4l10 6-10 6z" />
                  </svg>
                  Play trailer
                </button>
              ) : null}
              <WatchlistButton item={t} kind={kind} />
              <Score value={t.vote_average} count={t.vote_count} className="ml-1 text-lg" />
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

      {/* Story, where to watch, keywords | crew billing block */}
      <section className="mx-auto grid max-w-7xl gap-12 px-4 py-10 sm:px-6 md:grid-cols-[minmax(0,1fr)_minmax(0,320px)] md:gap-16">
        <div className="min-w-0 max-w-[68ch] space-y-12">
          <div>
            <h2 className={sectionTitle}>Story</h2>
            <p className="mt-3 text-lg leading-relaxed text-paper/85">
              {t.overview || "TMDB doesn't have a synopsis for this one yet."}
            </p>
          </div>

          <WatchProviders key={t.id} data={t["watch/providers"]} />

          {keywords.length ? (
            <div>
              <h2 className="text-sm text-muted">Keywords</h2>
              <ul className="mt-2 flex flex-wrap gap-2">
                {keywords.map((k) => (
                  <li key={k.id} className="rounded bg-panel px-2.5 py-1 text-sm text-paper/80">
                    {k.name}
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </div>

        {crew.length ? (
          <dl className="space-y-4 self-start border-l-2 border-bulb pl-5">
            {crew.map(([label, people], i) => (
              <div key={label}>
                <dt className="text-sm text-muted">{label}</dt>
                <dd className={`font-display font-bold leading-tight ${i === 0 ? "text-3xl" : "text-xl"}`}>
                  {people.join(", ")}
                </dd>
              </div>
            ))}
          </dl>
        ) : null}
      </section>

      {/* Cast */}
      {cast.length ? (
        <section className="mx-auto max-w-7xl px-4 pb-12 sm:px-6">
          <h2 className={sectionTitle}>Cast</h2>
          <ul className="scroll-row -mx-4 mt-4 flex scroll-px-4 gap-4 overflow-x-auto px-4 pb-4 sm:-mx-6 sm:scroll-px-6 sm:px-6">
            {cast.map((p) => (
              <li key={p.id} className="w-32 shrink-0 snap-start sm:w-36">
                <PersonCard person={p} subtitle={p.character || p.roles?.[0]?.character} compact />
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {/* Details */}
      {details.length ? (
        <section className="mx-auto max-w-7xl px-4 pb-12 sm:px-6" aria-labelledby="details">
          <h2 id="details" className={sectionTitle}>
            Details
          </h2>
          <dl className="mt-4 grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-line bg-line lg:grid-cols-4">
            {details.map(([label, value]) => (
              <div key={label} className="min-w-0 bg-night px-4 py-4 sm:px-5">
                <dt className="text-sm text-muted">{label}</dt>
                <dd className="mt-0.5 text-paper">{value}</dd>
              </div>
            ))}
            {/* Fill the last row (2 columns on phones, 4 on desktop) so no bare divider color shows. */}
            {[0, 1, 2].map((i) => {
              const pad2 = details.length % 2;
              const pad4 = (4 - (details.length % 4)) % 4;
              return (
                <div
                  key={`pad-${i}`}
                  aria-hidden="true"
                  className={`bg-night ${i < pad2 ? "block" : "hidden"} ${i < pad4 ? "lg:block" : "lg:hidden"}`}
                />
              );
            })}
          </dl>
          <ul className="mt-4 flex flex-wrap gap-x-6 gap-y-2">
            {links(kind, t).map(([label, href]) => (
              <li key={label}>
                <a
                  href={href}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 font-medium text-paper underline decoration-line underline-offset-4 transition-colors hover:text-bulb hover:decoration-bulb"
                >
                  {label}
                  <svg viewBox="0 0 20 20" className="size-3.5 text-muted" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                    <path d="M8 4H4v12h12v-4M11 3h6v6M17 3l-8 8" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  <span className="sr-only">(opens in a new tab)</span>
                </a>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      <VideoRow videos={pickVideos(t.videos)} onPlay={(v) => setPlaying({ key: v.key, name: v.name })} />

      <Reviews reviews={t.reviews} href={`https://www.themoviedb.org/${kind}/${t.id}/reviews`} />

      <div className="pb-20">
        <MediaRow title="More like this" items={(t.recommendations?.results ?? []).slice(0, 20)} kind={kind} />
      </div>

      <TrailerModal
        videoKey={playing?.key}
        title={playing?.name ?? name}
        open={Boolean(playing)}
        onClose={() => setPlaying(null)}
      />
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
