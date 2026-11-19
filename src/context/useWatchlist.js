import { useContext } from "react";
import { WatchlistContext } from "./watchlistContext";

/** Watchlist state and actions. Must be used inside <WatchlistProvider>. */
export function useWatchlist() {
  return useContext(WatchlistContext);
}
