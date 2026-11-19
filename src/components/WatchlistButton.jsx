import { useWatchlist } from "../context/useWatchlist";

export const BookmarkIcon = ({ filled, className = "size-4" }) => (
  <svg viewBox="0 0 20 20" className={className} aria-hidden="true">
    <path
      d="M5.5 2.5h9a1 1 0 0 1 1 1v14l-5.5-3.6-5.5 3.6v-14a1 1 0 0 1 1-1z"
      fill={filled ? "currentColor" : "none"}
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinejoin="round"
    />
  </svg>
);

/** Save / unsave a movie or show. Secondary to "Play trailer", so it's outlined. */
const WatchlistButton = ({ item, kind }) => {
  const { has, toggle } = useWatchlist();
  const saved = has(kind, item.id);

  return (
    <button
      type="button"
      onClick={() => toggle(item, kind)}
      aria-pressed={saved}
      className={`inline-flex items-center gap-2.5 rounded-md border px-5 py-3 font-semibold transition-colors ${
        saved
          ? "border-bulb bg-bulb/10 text-bulb hover:bg-bulb/20"
          : "border-paper/30 bg-night/40 text-paper hover:border-bulb hover:text-bulb"
      }`}
    >
      <BookmarkIcon filled={saved} />
      {saved ? "On your watchlist" : "Add to watchlist"}
    </button>
  );
};

export default WatchlistButton;
