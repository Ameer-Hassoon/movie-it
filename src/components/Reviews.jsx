import { useState } from "react";
import { longDate, reviewText } from "../lib/format.js";
import Avatar from "./Avatar";

const Review = ({ review }) => {
  const [open, setOpen] = useState(false);
  const text = reviewText(review.content);
  const long = text.length > 420;
  const name = review.author_details?.name || review.author;
  const rating = review.author_details?.rating;

  return (
    <li className="flex flex-col rounded-xl border border-line bg-ink p-5">
      <div className="flex items-center gap-3">
        <Avatar name={name} className="size-10 text-sm" />
        <div className="min-w-0 flex-1">
          <p className="truncate font-medium">{name}</p>
          <p className="text-sm text-muted">{longDate(review.created_at?.slice(0, 10))}</p>
        </div>
        {rating ? (
          <span className="shrink-0 rounded-md bg-panel px-2 py-1 text-sm">
            <span className="font-semibold text-bulb">{rating}</span>
            <span className="text-muted">/10</span>
          </span>
        ) : null}
      </div>
      <p className={`mt-4 whitespace-pre-line leading-relaxed text-paper/85 ${long && !open ? "line-clamp-6" : ""}`}>
        {text}
      </p>
      {long ? (
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          aria-expanded={open}
          className="mt-3 self-start font-medium text-bulb hover:text-bulb-deep"
        >
          {open ? "Show less" : "Read full review"}
        </button>
      ) : null}
    </li>
  );
};

/** Up to three TMDB user reviews, newest first. */
const Reviews = ({ reviews, href }) => {
  const list = [...(reviews?.results ?? [])]
    .sort((a, b) => (b.created_at ?? "").localeCompare(a.created_at ?? ""))
    .slice(0, 3);
  if (!list.length) return null;
  const total = reviews.total_results ?? list.length;

  return (
    <section className="mx-auto max-w-7xl px-4 pb-12 sm:px-6" aria-labelledby="reviews">
      <div className="flex items-baseline justify-between gap-4">
        <h2 id="reviews" className="font-display text-3xl font-extrabold">
          Reviews
        </h2>
        {total > list.length ? (
          <a href={href} target="_blank" rel="noreferrer" className="text-sm font-medium text-muted hover:text-bulb">
            All {total} reviews on TMDB
          </a>
        ) : null}
      </div>
      <ul className="mt-4 grid items-start gap-4 md:grid-cols-2 lg:grid-cols-3">
        {list.map((r) => (
          <Review key={r.id} review={r} />
        ))}
      </ul>
    </section>
  );
};

export default Reviews;
