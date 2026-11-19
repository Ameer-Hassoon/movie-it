import { useEffect, useState } from "react";
import { discover, getPopular, searchTmdb } from "../api/tmdb.js";
import { uniqueById } from "../api/tmdbHelpers.js";

const DEFAULT_SORT = "popularity.desc";

/**
 * Popular list when `query` is empty, search results otherwise, with
 * "load more" paging.
 *
 * When the query is empty and a genre/sort filter is active the results come
 * from /discover, otherwise from /popular. Search ignores filters (TMDB search
 * has no genre filter) and people never use discover.
 *
 * The reset key is built from primitive values only, so changing kind, query,
 * genre or sort resets to page 1 and aborts stale requests.
 *
 * @param {"movie" | "tv" | "person"} kind
 * @param {string} query
 * @param {{ genre?: number | "", sort?: string }} [filters]
 */
export function usePagedSearch(kind, query, filters = {}) {
  const genre = filters?.genre ?? "";
  const sort = filters?.sort ?? "";
  const text = String(query ?? "").trim();
  const key = `${kind}|${text}|${genre}|${sort}`;

  const [page, setPage] = useState(1);
  const [pageKey, setPageKey] = useState(key);
  const [attempt, setAttempt] = useState(0);
  const [state, setState] = useState({
    key: null,
    items: [],
    total: 0,
    totalPages: 1,
    loading: true,
    error: null,
  });

  // Reset paging during render when the search changes (no extra effect pass).
  if (pageKey !== key) {
    setPageKey(key);
    setPage(1);
  }

  useEffect(() => {
    const controller = new AbortController();
    setState((s) => ({ ...s, loading: true, error: null }));

    const filtered =
      kind !== "person" &&
      (genre !== "" || (sort !== "" && sort !== DEFAULT_SORT));

    let request;
    if (text) {
      request = searchTmdb(kind, text, page, controller.signal);
    } else if (filtered) {
      request = discover(
        kind,
        { genre, sort: sort || DEFAULT_SORT, page },
        controller.signal
      );
    } else {
      request = getPopular(kind, page, controller.signal);
    }

    request
      .then((data) => {
        const results = data?.results ?? [];
        setState((s) => ({
          key,
          items:
            page === 1 || s.key !== key
              ? results
              : uniqueById([...s.items, ...results]),
          total: data?.total_results ?? results.length,
          totalPages: Math.min(data?.total_pages ?? 1, 500), // TMDB caps at 500
          loading: false,
          error: null,
        }));
      })
      .catch((error) => {
        if (controller.signal.aborted || error?.name === "AbortError") return;
        setState((s) => ({ ...s, loading: false, error }));
      });

    return () => controller.abort();
  }, [kind, text, genre, sort, page, key, attempt]);

  const current = state.key === key;
  return {
    items: current ? state.items : [],
    total: current ? state.total : 0,
    loading: state.loading,
    error: state.error,
    hasMore: current && page < state.totalPages,
    loadMore: () => setPage((p) => p + 1),
    retry: () => setAttempt((n) => n + 1),
  };
}
