import { Link } from "react-router-dom";
import { imageUrl, year } from "../api/tmdbHelpers.js";
import Score from "./Score";
import WatchlistButton from "./WatchlistButton";

/**
 * Home page lead: this week's most-watched title, staged like the details hero
 * so the landing page and the details page read as one family.
 */
const Spotlight = ({ item }) => {
  if (!item) {
    return (
      <div className="mx-auto max-w-7xl animate-pulse px-4 pb-14 pt-24 sm:px-6 md:pt-40" aria-hidden="true">
        <div className="h-4 w-48 rounded bg-panel" />
        <div className="mt-4 h-20 w-3/4 max-w-2xl rounded bg-panel" />
        <div className="mt-5 h-4 w-full max-w-xl rounded bg-panel" />
        <div className="mt-8 h-12 w-64 rounded-md bg-panel" />
      </div>
    );
  }

  const kind = item.media_type === "tv" ? "tv" : "movie";
  const name = item.title ?? item.name;
  const href = kind === "movie" ? `/movie/${item.id}` : `/tvShows/${item.id}`;
  const backdrop = imageUrl(item.backdrop_path, "original");

  return (
    <section className="relative isolate overflow-hidden" aria-label="Spotlight">
      {backdrop ? (
        <img src={backdrop} alt="" className="absolute inset-0 -z-10 size-full object-cover object-[center_20%] opacity-55" />
      ) : null}
      <div className="absolute inset-0 -z-10 bg-gradient-to-t from-night via-night/60 to-night/10" />
      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-night/95 via-night/50 to-transparent" />

      <div className="mx-auto max-w-7xl px-4 pb-14 pt-24 sm:px-6 md:pb-20 md:pt-44">
        <p className="text-muted">
          <span className="font-semibold text-bulb">#1 this week</span>
          <span className="ml-3">
            {kind === "movie" ? "Movie" : "Show"}, {year(item)}
          </span>
        </p>
        <h1 className="mt-2 max-w-4xl font-display text-6xl font-black uppercase leading-[0.86] tracking-tight text-balance sm:text-8xl lg:text-9xl">
          {name}
        </h1>
        {item.overview ? (
          <p className="mt-5 line-clamp-3 max-w-xl text-lg leading-relaxed text-paper/85">{item.overview}</p>
        ) : null}
        <div className="mt-7 flex flex-wrap items-center gap-x-4 gap-y-4">
          <Link
            to={href}
            className="inline-flex items-center rounded-md bg-bulb px-5 py-3 font-semibold text-night transition-colors hover:bg-bulb-deep"
          >
            See details
          </Link>
          <WatchlistButton item={item} kind={kind} />
          <Score value={item.vote_average} className="ml-1 text-lg" />
        </div>
      </div>
    </section>
  );
};

export default Spotlight;
