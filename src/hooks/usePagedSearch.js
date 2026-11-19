import { useEffect, useState } from "react";
import { getPopular, searchTmdb } from "../api/tmdb.js";
import { uniqueById } from "../api/tmdbHelpers.js";

/**
 * Popular list when `query` is empty, search results otherwise, with
 * "load more" paging. Changing kind/query resets to page 1; stale responses
 * are aborted so they can never overwrite newer results.
 */
export function usePagedSearch(kind, query) {
  const key = `${kind}|${query}`;
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

    const request = query
      ? searchTmdb(kind, query, page, controller.signal)
      : getPopular(kind, page, controller.signal);

    request
      .then((data) => {
        const results = data?.results ?? [];
        setState((s) => ({
          key,
          items:
            page === 1 || s.key !== key ? results : uniqueById([...s.items, ...results]),
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
  }, [kind, query, page, key, attempt]);

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
