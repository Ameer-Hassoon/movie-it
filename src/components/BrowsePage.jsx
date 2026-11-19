import { useEffect, useState } from "react";
import { useDebounce } from "../hooks/useDebounce.js";
import { usePagedSearch } from "../hooks/usePagedSearch.js";
import PosterCard from "./PosterCard";
import PersonCard from "./PersonCard";
import SearchField from "./SearchField";
import { EmptyState, ErrorState, SkeletonGrid } from "./States";
import { gridClass } from "../lib/grid.js";

const copy = {
  movie: { title: "Movies", popular: "Popular right now", search: "Search movies", noun: "movie" },
  tv: { title: "Shows", popular: "Popular right now", search: "Search shows", noun: "show" },
  person: { title: "People", popular: "Popular this week", search: "Search people", noun: "person" },
};

/** Shared layout for the Movies, Shows and People pages. */
const BrowsePage = ({ kind }) => {
  const text = copy[kind];
  const [query, setQuery] = useState("");
  const q = useDebounce(query).trim();
  const { items, total, loading, error, hasMore, loadMore, retry } = usePagedSearch(kind, q);

  useEffect(() => {
    document.title = `${text.title} · Movie It`;
  }, [text.title]);

  const visible = items.filter((i) => (kind === "person" ? i.profile_path : i.poster_path));
  const firstLoad = loading && items.length === 0;

  return (
    <div className="mx-auto max-w-7xl px-4 pb-20 pt-8 sm:px-6 sm:pt-12">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="font-display text-6xl font-black leading-[0.9] sm:text-7xl">{text.title}</h1>
          <p className="mt-3 text-muted" aria-live="polite">
            {q
              ? loading && items.length === 0
                ? `Searching for “${q}”…`
                : `${total.toLocaleString()} ${total === 1 ? "result" : "results"} for “${q}”`
              : text.popular}
          </p>
        </div>
        <SearchField value={query} onChange={setQuery} label={text.search} />
      </div>

      <div className="mt-8 sm:mt-10">
        {error && items.length === 0 ? (
          <ErrorState error={error} onRetry={retry} />
        ) : firstLoad ? (
          <SkeletonGrid ratio={kind === "person" ? "aspect-[3/4]" : "aspect-[2/3]"} />
        ) : visible.length === 0 ? (
          <EmptyState title={`No ${text.noun} matches “${q}”`}>
            Check the spelling, or try a shorter search.
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
