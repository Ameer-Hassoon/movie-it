import { Link } from "react-router-dom";
import { imageUrl, year } from "../api/tmdbHelpers.js";
import Score from "./Score";

/** A movie or show: the poster carries the card, text sits underneath. */
const PosterCard = ({ item, kind }) => {
  const title = item.title ?? item.name;
  const href = kind === "movie" ? `/movie/${item.id}` : `/tvShows/${item.id}`;
  const poster = imageUrl(item.poster_path, "w342");

  return (
    <Link to={href} className="group block rounded-md">
      <div className="aspect-[2/3] overflow-hidden rounded-md bg-panel ring-1 ring-line transition group-hover:ring-2 group-hover:ring-bulb">
        {poster ? (
          <img
            src={poster}
            alt=""
            loading="lazy"
            className="size-full object-cover transition duration-300 group-hover:scale-[1.03]"
          />
        ) : (
          <div className="flex size-full items-center justify-center p-4 text-center font-display text-xl font-bold text-muted">
            {title}
          </div>
        )}
      </div>
      <h3 className="mt-2.5 line-clamp-1 font-medium leading-snug text-paper">{title}</h3>
      <p className="mt-0.5 flex items-center gap-2 text-sm text-muted">
        <span>{year(item)}</span>
        <Score value={item.vote_average} />
      </p>
    </Link>
  );
};

export default PosterCard;
