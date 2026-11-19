import { Link } from "react-router-dom";
import { imageUrl } from "../api/tmdbHelpers.js";

/** A person: portrait, name, and one line of context (role or department). */
const PersonCard = ({ person, subtitle, compact = false }) => {
  const photo = imageUrl(person.profile_path, compact ? "w185" : "w342");

  return (
    <Link to={`/person/${person.id}`} className="group block rounded-md">
      <div className="aspect-[3/4] overflow-hidden rounded-md bg-panel ring-1 ring-line transition group-hover:ring-2 group-hover:ring-bulb">
        {photo ? (
          <img
            src={photo}
            alt=""
            loading="lazy"
            className="size-full object-cover object-top transition duration-300 group-hover:scale-[1.03]"
          />
        ) : (
          <div className="flex size-full items-center justify-center font-display text-4xl font-bold text-muted">
            {person.name?.[0]}
          </div>
        )}
      </div>
      <h3 className={`mt-2 line-clamp-1 font-medium leading-snug text-paper ${compact ? "text-sm" : ""}`}>
        {person.name}
      </h3>
      {subtitle ? (
        <p className={`line-clamp-1 text-muted ${compact ? "text-xs" : "text-sm"}`}>{subtitle}</p>
      ) : null}
    </Link>
  );
};

export default PersonCard;
