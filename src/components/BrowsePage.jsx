import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { getGenres } from "../api/tmdb.js";
import { useAsync } from "../hooks/useAsync.js";
import { useDebounce } from "../hooks/useDebounce.js";
import { usePagedSearch } from "../hooks/usePagedSearch.js";
import PosterCard from "./PosterCard";
import PersonCard from "./PersonCard";
import SearchField from "./SearchField";
import { EmptyState, ErrorState, SkeletonGrid } from "./States";
import { gridClass } from "../lib/grid.js";

const copy = {
  movie: { title: "Movies", search: "Search movies", noun: "movie", plural: "movies" },
  tv: { title: "Shows", search: "Search shows", noun: "show", plural: "shows" },
  person: { title: "People", search: "Search people", noun: "person", plural: "people" },
};

const sorts = [
  { key: "", label: "Most popular", api: "popularity.desc" },
  { key: "top", label: "Highest rated", api: "vote_average.desc" },
];

const chip = (active) =>
  `shrink-0 snap-start rounded-full border px-3.5 py-1.5 text-sm font-medium transition-colors ${
    active ? "border-bulb bg-bulb text-night" : "border-line text-paper/85 hover:border-paper/50"
  }`;

/** Filters for movies and shows: sort order + genre. State lives in the URL. */
const Filters = ({ kind, genres, genre, sort, onChange }) => (
  <div className="mt-8 space-y-4">
    <div role="radiogroup" aria-label="Sort" className="inline-flex rounded-md border border-line p-1">
      {sorts.map((s) => (
        <button
          key={s.key}
          type="button"
          role="radio"
          aria-checked={sort === s.key}
          onClick={() => onChange("sort", s.key)}
          className={`rounded px-3.5 py-1.5 text-sm font-medium transition-colors ${
            sort === s.key ? "bg-panel text-paper" : "text-muted hover:text-paper"
          }`}
        >
          {s.label}
        </button>
      ))}
    </div>
    <div
      role="group"
      aria-label={`Filter ${copy[kind].plural} by genre`}
      className="scroll-row -mx-4 flex scroll-px-4 gap-2 overflow-x-auto px-4 pb-2 sm:-mx-6 sm:scroll-px-6 sm:px-6"
    >
      <button type="button" aria-pressed={!genre} onClick={() => onChange("genre", "")} className={chip(!genre)}>
        All genres
      </button>
      {genres.map((g) => (
        <button
          key={g.id}
          type="button"
          aria-pressed={genre === String(g.id)}
          onClick={() => onChange("genre", genre === String(g.id) ? "" : String(g.id))}
          className={chip(genre === String(g.id))}
        >
          {g.name}
        </button>
      ))}
    </div>
  </div>
);

/** Shared layout for the Movies, Shows and People pages. */
const BrowsePage = ({ kind }) => {
  const text = copy[kind];
  const [params, setParams] = useSearchParams();
  const [query, setQuery] = useState(() => params.get("q") ?? "");
  const q = useDebounce(query).trim();
  const filterable = kind !== "person";
  const genre = filterable ? (params.get("genre") ?? "") : "";
  const sort = filterable && params.get("sort") === "top" ? "top" : "";
  const sortApi = sorts.find((s) => s.key === sort).api;

  const setParam = (name, value) =>
    setParams(
      (p) => {
        const next = new URLSearchParams(p);
        if (value) next.set(name, value);
        else next.delete(name);
        return next;
      },
      { replace: true }
    );

  // Mirror the (debounced) search into the URL so results can be shared.
  useEffect(() => {
    setParams(
      (p) => {
        if ((p.get("q") ?? "") === q) return p;
        const next = new URLSearchParams(p);
        if (q) next.set("q", q);
        else next.delete("q");
        return next;
      },
      { replace: true }
    );
  }, [q, setParams]);

  const { data: genres } = useAsync((signal) => (filterable ? getGenres(kind, signal) : Promise.resolve([])), [kind]);
  const { items, total, loading, error, hasMore, loadMore, retry } = usePagedSearch(kind, q, {
    genre: genre ? Number(genre) : "",
    sort: sortApi,
  });

  useEffect(() => {
    document.title = `${text.title} · Movie It`;
  }, [text.title]);

  const genreName = genres?.find((g) => String(g.id) === genre)?.name;
  const visible = items.filter((i) => (kind === "person" ? i.profile_path : i.poster_path));
  const firstLoad = loading && items.length === 0;

  let subtitle;
  if (q) {
    subtitle = firstLoad
      ? `Searching for “${q}”…`
      : `${total.toLocaleString()} ${total === 1 ? "result" : "results"} for “${q}”`;
  } else if (kind === "person") {
    subtitle = "Popular this week";
  } else {
    subtitle = `${sort === "top" ? "Highest rated" : "Most popular"} ${genreName ? `${genreName.toLowerCase()} ` : ""}${text.plural}`;
  }

  return (
    <div className="mx-auto max-w-7xl px-4 pb-20 pt-8 sm:px-6 sm:pt-12">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="font-display text-6xl font-black leading-[0.9] sm:text-7xl">{text.title}</h1>
          <p className="mt-3 text-muted" aria-live="polite">
            {subtitle}
          </p>
        </div>
        <SearchField value={query} onChange={setQuery} label={text.search} />
      </div>

      {filterable && !q && genres?.length ? (
        <Filters kind={kind} genres={genres} genre={genre} sort={sort} onChange={setParam} />
      ) : null}

      <div className="mt-8 sm:mt-10">
        {error && items.length === 0 ? (
          <ErrorState error={error} onRetry={retry} />
        ) : firstLoad ? (
          <SkeletonGrid ratio={kind === "person" ? "aspect-[3/4]" : "aspect-[2/3]"} />
        ) : visible.length === 0 ? (
          <EmptyState title={q ? `No ${text.noun} matches “${q}”` : `No ${text.plural} here yet`}>
            {q ? "Check the spelling, or try a shorter search." : "Try a different genre."}
          </EmptyState>
        ) : (
          <>
            <ul className={gridClass}>
              {visible.map((item) => (
                <li key={item.id}>
                  {kind === "person" ? (
                    <PersonCard person={item} subtitle={item.known_for_department} />
                  ) : (
                    <PosterCard item={item} kind={kind} />
                  )}
                </li>
              ))}
            </ul>
            {hasMore ? (
              <div className="mt-12 flex justify-center">
                <button
                  type="button"
                  onClick={loadMore}
                  disabled={loading}
                  className="rounded-md border border-line px-6 py-2.5 font-medium text-paper transition-colors hover:border-bulb hover:text-bulb disabled:cursor-wait disabled:opacity-60"
                >
                  {loading ? "Loading…" : "Show more"}
                </button>
              </div>
            ) : null}
          </>
        )}
      </div>
    </div>
  );
};

export default BrowsePage;
