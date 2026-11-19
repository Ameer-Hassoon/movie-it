// TMDB's 0–10 audience score, shown as-is with one decimal.
const Score = ({ value, count, className = "" }) => {
  if (!value) {
    return <span className={`text-muted ${className}`}>Not rated</span>;
  }
  return (
    <span className={`inline-flex items-center gap-1 ${className}`}>
      <svg viewBox="0 0 20 20" className="size-[1em] text-bulb" fill="currentColor" aria-hidden="true">
        <path d="M10 1.8l2.5 5.3 5.8.7-4.3 4 1.1 5.7L10 14.7l-5.1 2.8 1.1-5.7-4.3-4 5.8-.7z" />
      </svg>
      <span className="font-semibold text-paper">{Number(value).toFixed(1)}</span>
      <span className="sr-only">out of 10</span>
      {count ? (
        <span className="text-muted">({Intl.NumberFormat("en", { notation: "compact" }).format(count)} votes)</span>
      ) : null}
    </span>
  );
};

export default Score;
