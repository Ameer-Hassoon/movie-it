import { useState } from "react";
import { imageUrl } from "../api/tmdbHelpers.js";
import { regionName, userRegion } from "../lib/format.js";

const groups = [
  ["flatrate", "Stream"],
  ["free", "Free"],
  ["ads", "Free with ads"],
  ["rent", "Rent"],
  ["buy", "Buy"],
];

/** "Where to watch" for one country, with a picker for the others TMDB knows about. */
const WatchProviders = ({ data }) => {
  const results = data?.results ?? {};
  const regions = Object.keys(results).sort((a, b) => regionName(a).localeCompare(regionName(b)));
  const [region, setRegion] = useState(() => {
    const mine = userRegion();
    return results[mine] ? mine : results.US ? "US" : mine;
  });
  const current = results[region];
  const rows = groups
    .map(([key, label]) => [label, current?.[key] ?? []])
    .filter(([, list]) => list.length > 0);

  return (
    <section aria-labelledby="where-to-watch">
      <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2">
        <h2 id="where-to-watch" className="font-display text-3xl font-extrabold">
          Where to watch
        </h2>
        {regions.length > 1 ? (
          <label className="flex items-center gap-2 text-sm text-muted">
            <span>Country</span>
            <select
              value={region}
              onChange={(e) => setRegion(e.target.value)}
              className="max-w-48 rounded-md border border-line bg-panel px-2 py-1.5 text-paper focus:border-bulb focus:outline-none"
            >
              {!results[region] ? <option value={region}>{regionName(region)}</option> : null}
              {regions.map((r) => (
                <option key={r} value={r}>
                  {regionName(r)}
                </option>
              ))}
            </select>
          </label>
        ) : null}
      </div>

      {rows.length ? (
        <>
          <dl className="mt-4 space-y-4">
            {rows.map(([label, list]) => (
              <div key={label} className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-5">
                <dt className="w-28 shrink-0 text-sm text-muted">{label}</dt>
                <dd>
                  <ul className="flex flex-wrap gap-2">
                    {list.map((p) => (
                      <li key={p.provider_id}>
                        <a
                          href={current.link}
                          target="_blank"
                          rel="noreferrer"
                          title={p.provider_name}
                          className="block overflow-hidden rounded-lg ring-1 ring-line transition hover:ring-2 hover:ring-bulb"
                        >
                          <img src={imageUrl(p.logo_path, "w92")} alt={p.provider_name} className="size-11" loading="lazy" />
                        </a>
                      </li>
                    ))}
                  </ul>
                </dd>
              </div>
            ))}
          </dl>
          <p className="mt-4 text-xs text-muted">
            Availability in {regionName(region)} from JustWatch, via TMDB. Select a service to see all options.
          </p>
        </>
      ) : (
        <p className="mt-3 text-muted">
          Not available to stream, rent or buy in {regionName(region)} yet
          {regions.length ? ". Try another country." : "."}
        </p>
      )}
    </section>
  );
};

export default WatchProviders;
