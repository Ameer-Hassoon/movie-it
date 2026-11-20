const API_BASE = "/api/tmdb";

const APPEND_MOVIE = "release_dates,videos,credits,recommendations,keywords,watch/providers,reviews,external_ids";
const APPEND_TV = "content_ratings,videos,credits,recommendations,keywords,watch/providers,reviews,external_ids";

/**
 * Single entry point for TMDB requests.
 *
 * The browser never sees the TMDB token: requests go to the same-origin proxy
 * (`/api/tmdb/...`), which is served by Vite in development and by the
 * serverless function in `api/tmdb.js` in production.
 *
 * @param {string} path e.g. "/movie/603"
 * @param {Record<string, string | number>} params query params
 * @param {AbortSignal} [signal] optional abort signal
 */
export async function tmdbFetch(path, params = {}, signal) {
  const cleanPath = String(path).replace(/^\/+/, "");
  const search = new URLSearchParams();

  for (const [key, value] of Object.entries(params)) {
    if (value === undefined || value === null || value === "") continue;
    search.set(key, String(value));
  }

  const query = search.toString();
  const url = `${API_BASE}/${cleanPath}${query ? `?${query}` : ""}`;

  const response = await fetch(url, { signal });

  if (!response.ok) {
    const body = await readJson(response);

    if (body?.error === "missing_token") {
      throw new Error(
        "Server is missing TMDB_TOKEN. Copy .env.example to .env and set TMDB_TOKEN."
      );
    }

    const status = [response.status, response.statusText].filter(Boolean).join(" ");
    throw new Error(`TMDB request failed: ${status}`);
  }

  return response.json();
}

async function readJson(response) {
  if (typeof response.json !== "function") return null;
  try {
    return await response.json();
  } catch {
    return null;
  }
}

export function getPopular(kind, page = 1, signal) {
  return tmdbFetch(`/${kind}/popular`, { page }, signal);
}

export function searchTmdb(kind, query, page = 1, signal) {
  return tmdbFetch(`/search/${kind}`, { query, page }, signal);
}

export function getTrending(kind = "all", window = "week", signal) {
  return tmdbFetch(`/trending/${kind}/${window}`, {}, signal);
}

export function getTopRated(kind, page = 1, signal) {
  return tmdbFetch(`/${kind}/top_rated`, { page }, signal);
}

const genreCache = new Map();

/**
 * Genre list for a kind ("movie" | "tv"). Results are cached in a module-level
 * Map, so repeat calls resolve from memory instead of refetching.
 *
 * @param {"movie" | "tv"} kind
 * @param {AbortSignal} [signal]
 * @returns {Promise<Array<{ id: number, name: string }>>}
 */
export function getGenres(kind, signal) {
  const cached = genreCache.get(kind);
  if (cached) return Promise.resolve(cached);

  return tmdbFetch(`/genre/${kind}/list`, {}, signal).then((data) => {
    const genres = (Array.isArray(data?.genres) ? data.genres : []).map(
      (genre) => ({ id: genre.id, name: genre.name })
    );
    genreCache.set(kind, genres);
    return genres;
  });
}

/**
 * @param {"movie" | "tv"} kind
 * @param {{ genre?: number | "", sort?: string, page?: number }} [options]
 * @param {AbortSignal} [signal]
 */
export function discover(
  kind,
  { genre = "", sort = "popularity.desc", page = 1 } = {},
  signal
) {
  const params = { page, sort_by: sort };

  if (genre !== "" && genre !== undefined && genre !== null) {
    params.with_genres = genre;
  }

  // Without a floor, "highest rated" returns titles with a handful of votes.
  if (sort === "vote_average.desc") {
    params["vote_count.gte"] = 300;
  }

  return tmdbFetch(`/discover/${kind}`, params, signal);
}

export function getMovie(id, signal) {
  return tmdbFetch(`/movie/${id}`, { append_to_response: APPEND_MOVIE }, signal);
}

export function getTv(id, signal) {
  return tmdbFetch(`/tv/${id}`, { append_to_response: APPEND_TV }, signal);
}

export function getPerson(id, signal) {
  return tmdbFetch(
    `/person/${id}`,
    { append_to_response: "movie_credits,tv_credits" },
    signal
  );
}
