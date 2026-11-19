import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getPerson } from "../api/tmdb.js";
import { imageUrl, uniqueById } from "../api/tmdbHelpers.js";
import { useAsync } from "../hooks/useAsync.js";
import PosterCard from "../components/PosterCard";
import { ErrorState, SkeletonGrid } from "../components/States";
import { gridClass } from "../lib/grid.js";

const byPopularity = (list) =>
  uniqueById(list.filter((w) => w.poster_path)).sort((a, b) => (b.popularity ?? 0) - (a.popularity ?? 0));

function formatDate(d) {
  return d ? new Date(d).toLocaleDateString("en", { year: "numeric", month: "long", day: "numeric" }) : "";
}

const Biography = ({ text }) => {
  const [open, setOpen] = useState(false);
  if (!text) return <p className="text-muted">TMDB doesn't have a biography for this person yet.</p>;
  const long = text.length > 600;
  return (
    <div>
      <p className={`whitespace-pre-line text-lg leading-relaxed text-paper/85 ${long && !open ? "line-clamp-6" : ""}`}>
        {text}
      </p>
      {long ? (
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          aria-expanded={open}
          className="mt-2 font-medium text-bulb hover:text-bulb-deep"
        >
          {open ? "Show less" : "Read full biography"}
        </button>
      ) : null}
    </div>
  );
};

const PersonDetails = () => {
  const { id } = useParams();
  const { data: p, loading, error } = useAsync((signal) => getPerson(id, signal), [id]);
  const [tab, setTab] = useState("movie");

  useEffect(() => {
    if (p?.name) document.title = `${p.name} · Movie It`;
  }, [p?.name]);

  if (error) return <ErrorState error={error} onRetry={() => window.location.reload()} />;
  if (loading || !p) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
        <SkeletonGrid count={6} />
      </div>
    );
  }

  const movies = byPopularity(p.movie_credits?.cast ?? []);
  const shows = byPopularity(p.tv_credits?.cast ?? []);
  const works = tab === "movie" ? movies : shows;
  const photo = imageUrl(p.profile_path, "h632");
  const facts = [
    ["Known for", p.known_for_department],
    ["Born", [formatDate(p.birthday), p.place_of_birth].filter(Boolean).join(" in ")],
    ["Died", formatDate(p.deathday)],
  ].filter(([, v]) => v);

  return (
    <article className="mx-auto max-w-7xl px-4 pb-20 pt-8 sm:px-6 sm:pt-12">
      <div className="grid gap-8 md:grid-cols-[minmax(0,300px)_1fr] md:gap-12">
        {photo ? (
          <img
            src={photo}
            alt={p.name}
            className="w-48 rounded-lg ring-1 ring-line sm:w-60 md:w-full"
          />
        ) : null}
        <div className="max-w-[68ch]">
          <h1 className="font-display text-5xl font-black uppercase leading-[0.88] tracking-tight text-balance sm:text-7xl">
            {p.name}
          </h1>
          {facts.length ? (
            <dl className="mt-6 grid gap-x-8 gap-y-3 sm:grid-cols-2">
              {facts.map(([label, value]) => (
                <div key={label}>
                  <dt className="text-sm text-muted">{label}</dt>
                  <dd>{value}</dd>
                </div>
              ))}
            </dl>
          ) : null}
          <div className="mt-8">
            <Biography text={p.biography} />
          </div>
        </div>
      </div>

      {movies.length || shows.length ? (
        <section className="mt-16">
          <div className="flex flex-wrap items-end justify-between gap-4 border-b border-line">
            <h2 className="pb-3 font-display text-3xl font-extrabold">Appears in</h2>
            <div role="tablist" aria-label="Credits" className="flex">
              {[
                ["movie", "Movies", movies.length],
                ["tv", "Shows", shows.length],
              ].map(([key, label, count]) => (
                <button
                  key={key}
                  role="tab"
                  type="button"
                  aria-selected={tab === key}
                  disabled={!count}
                  onClick={() => setTab(key)}
                  className={`-mb-px border-b-2 px-4 pb-3 font-medium transition-colors disabled:opacity-40 ${
                    tab === key ? "border-bulb text-paper" : "border-transparent text-muted hover:text-paper"
                  }`}
                >
                  {label} <span className="text-muted">{count}</span>
                </button>
              ))}
            </div>
          </div>
          <ul className={`${gridClass} mt-8`} role="tabpanel">
            {works.map((w) => (
              <li key={w.id}>
                <PosterCard item={w} kind={tab} />
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </article>
  );
};

export default PersonDetails;
