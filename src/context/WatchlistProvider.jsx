import { useCallback, useEffect, useMemo, useState } from "react";
import { WatchlistContext } from "./watchlistContext";
import { useAuth } from "./useAuth";

const KEY_PREFIX = "movieItWatchlist:";

function storageKey(userId) {
  return `${KEY_PREFIX}${userId ?? "guest"}`;
}

function readList(key) {
  try {
    const raw = localStorage.getItem(key);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeList(key, items) {
  try {
    if (items.length === 0) localStorage.removeItem(key);
    else localStorage.setItem(key, JSON.stringify(items));
  } catch {
    // Storage can be unavailable (private mode, quota) — the list still works
    // for the current session.
  }
}

/** Shape stored in localStorage: flat, small, and stable across TMDB changes. */
function toEntry(item, kind) {
  return {
    id: item.id,
    kind,
    title: item.title ?? item.name ?? "",
    poster_path: item.poster_path ?? null,
    vote_average: item.vote_average ?? null,
    release_date: item.release_date ?? item.first_air_date ?? "",
    addedAt: Date.now(),
  };
}

const sameEntry = (entry, { kind, id }) =>
  entry.kind === kind && String(entry.id) === String(id);

export function WatchlistProvider({ children }) {
  const { currentUser } = useAuth() ?? {};
  const userId = currentUser?.id ?? "guest";
  const key = storageKey(userId);

  const [items, setItems] = useState(() => readList(key));
  const [loadedKey, setLoadedKey] = useState(key);

  // Reload during render when the signed-in user changes, so one account never
  // sees another's list even for a frame.
  if (loadedKey !== key) {
    setLoadedKey(key);
    setItems(readList(key));
  }

  // Persist on every change (including the first render for a user), so the
  // list survives reloads.
  useEffect(() => {
    writeList(key, items);
  }, [key, items]);

  // Keep two tabs in sync: storage events only fire in the other tab.
  useEffect(() => {
    const onStorage = (event) => {
      if (event.key !== null && event.key !== key) return;
      setItems(readList(key));
    };

    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, [key]);

  const has = useCallback(
    (kind, id) => items.some((entry) => sameEntry(entry, { kind, id })),
    [items]
  );

  const toggle = useCallback((item, kind = item?.media_type ?? "movie") => {
    if (!item) return;

    setItems((prev) => {
      const exists = prev.some((entry) => sameEntry(entry, { kind, id: item.id }));
      return exists
        ? prev.filter((entry) => !sameEntry(entry, { kind, id: item.id }))
        : [toEntry(item, kind), ...prev];
    });
  }, []);

  const remove = useCallback((kind, id) => {
    setItems((prev) => prev.filter((entry) => !sameEntry(entry, { kind, id })));
  }, []);

  const clear = useCallback(() => setItems([]), []);

  const value = useMemo(
    () => ({ items, count: items.length, has, toggle, remove, clear }),
    [items, has, toggle, remove, clear]
  );

  return (
    <WatchlistContext.Provider value={value}>
      {children}
    </WatchlistContext.Provider>
  );
}
