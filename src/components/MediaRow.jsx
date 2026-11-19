import { Link } from "react-router-dom";
import PosterCard from "./PosterCard";

/** A titled, horizontally scrolling row of posters (home page, "More like this"). */
const MediaRow = ({ title, items, kind, loading = false, seeAllTo }) => {
  const list = (items ?? []).filter((i) => i.poster_path);
  if (!loading && list.length === 0) return null;

  return (
    <section className="mx-auto max-w-7xl px-4 sm:px-6" aria-labelledby={`row-${title}`}>
      <div className="flex items-baseline justify-between gap-4">
        <h2 id={`row-${title}`} className="font-display text-3xl font-extrabold">
          {title}
        </h2>
        {seeAllTo ? (
          <Link to={seeAllTo} className="text-sm font-medium text-muted transition-colors hover:text-bulb">
            See all
          </Link>
        ) : null}
      </div>
      <ul className="scroll-row -mx-4 mt-4 flex scroll-px-4 gap-4 overflow-x-auto px-4 pb-4 sm:-mx-6 sm:scroll-px-6 sm:px-6">
        {loading && list.length === 0
          ? Array.from({ length: 8 }, (_, i) => (
              <li key={i} className="w-36 shrink-0 animate-pulse sm:w-44" aria-hidden="true">
                <div className="aspect-[2/3] rounded-md bg-panel" />
                <div className="mt-3 h-3.5 w-3/4 rounded bg-panel" />
              </li>
            ))
          : list.map((item) => (
              <li key={`${item.media_type ?? kind}-${item.id}`} className="w-36 shrink-0 snap-start sm:w-44">
                <PosterCard item={item} kind={item.media_type ?? kind} />
              </li>
            ))}
      </ul>
    </section>
  );
};

export default MediaRow;
