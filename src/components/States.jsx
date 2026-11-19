import { gridClass } from "../lib/grid.js";

/** Placeholder grid shaped like the cards it stands in for. */
export const SkeletonGrid = ({ count = 12, ratio = "aspect-[2/3]" }) => (
  <div className={gridClass} aria-hidden="true">
    {Array.from({ length: count }, (_, i) => (
      <div key={i} className="animate-pulse">
        <div className={`${ratio} rounded-md bg-panel`} />
        <div className="mt-3 h-3.5 w-3/4 rounded bg-panel" />
        <div className="mt-2 h-3 w-1/3 rounded bg-panel" />
      </div>
    ))}
  </div>
);

export const ErrorState = ({ error, onRetry }) => (
  <div role="alert" className="mx-auto max-w-md py-16 text-center">
    <p className="font-display text-3xl font-bold">Couldn't load this</p>
    <p className="mt-2 text-muted">
      {error?.message?.includes("token")
        ? error.message
        : "TMDB didn't respond. Check your connection and try again."}
    </p>
    {onRetry ? (
      <button
        type="button"
        onClick={onRetry}
        className="mt-6 rounded-md bg-bulb px-5 py-2.5 font-semibold text-night transition-colors hover:bg-bulb-deep"
      >
        Try again
      </button>
    ) : null}
  </div>
);

export const EmptyState = ({ title, children }) => (
  <div className="mx-auto max-w-md py-16 text-center">
    <p className="font-display text-3xl font-bold">{title}</p>
    {children ? <p className="mt-2 text-muted">{children}</p> : null}
  </div>
);
