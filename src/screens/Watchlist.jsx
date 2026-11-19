import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useWatchlist } from "../context/useWatchlist";
import { useAuth } from "../context/useAuth";
import PosterCard from "../components/PosterCard";
import { gridClass } from "../lib/grid.js";

const tabs = [
  { key: "all", label: "All" },
  { key: "movie", label: "Movies" },
  { key: "tv", label: "Shows" },
];

const Watchlist = () => {
  const { items, remove } = useWatchlist();
  const { isAuthenticated } = useAuth();
  const [tab, setTab] = useState("all");

  useEffect(() => {
    document.title = "Watchlist · Movie It";
  }, []);

  const shown = tab === "all" ? items : items.filter((i) => i.kind === tab);
  const countOf = (key) => (key === "all" ? items.length : items.filter((i) => i.kind === key).length);

  return (
    <div className="mx-auto max-w-7xl px-4 pb-20 pt-8 sm:px-6 sm:pt-12">
      <h1 className="font-display text-6xl font-black leading-[0.9] sm:text-7xl">Watchlist</h1>
      <p className="mt-3 text-muted">
        {items.length
          ? `${items.length} saved ${items.length === 1 ? "title" : "titles"}, newest first.`
          : "Movies and shows you save will show up here."}
        {!isAuthenticated ? (
          <>
            {" "}
            Saved on this device.{" "}
            <Link to="/login" className="font-medium text-bulb hover:text-bulb-deep">
              Log in
            </Link>{" "}
            to keep a list per account.
          </>
        ) : null}
      </p>

      {items.length === 0 ? (
        <div className="mt-16 flex flex-col items-center rounded-xl border border-dashed border-line px-6 py-16 text-center">
          <p className="font-display text-3xl font-bold">Nothing saved yet</p>
          <p className="mt-2 max-w-sm text-muted">
            Open any movie or show and choose “Add to watchlist” to save it for later.
          </p>
          <Link
            to="/movies"
            className="mt-6 rounded-md bg-bulb px-5 py-3 font-semibold text-night transition-colors hover:bg-bulb-deep"
          >
            Browse movies
          </Link>
        </div>
      ) : (
        <>
          <div role="tablist" aria-label="Filter watchlist" className="mt-8 flex border-b border-line">
            {tabs.map((t) => (
              <button
                key={t.key}
                type="button"
                role="tab"
                aria-selected={tab === t.key}
                onClick={() => setTab(t.key)}
                className={`-mb-px border-b-2 px-4 pb-3 font-medium transition-colors ${
                  tab === t.key ? "border-bulb text-paper" : "border-transparent text-muted hover:text-paper"
                }`}
              >
                {t.label} <span className="text-muted">{countOf(t.key)}</span>
              </button>
            ))}
          </div>
          <ul className={`${gridClass} mt-8`} role="tabpanel">
            {shown.map((item) => (
              <li key={`${item.kind}-${item.id}`}>
                <PosterCard item={item} kind={item.kind} />
                <button
                  type="button"
                  onClick={() => remove(item.kind, item.id)}
                  className="mt-1.5 text-sm text-muted transition-colors hover:text-danger"
                >
                  Remove<span className="sr-only"> {item.title}</span>
                </button>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
};

export default Watchlist;
