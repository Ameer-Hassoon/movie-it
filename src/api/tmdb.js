const BASE_URL = "https://api.themoviedb.org/3";

const token = import.meta.env.VITE_TMDB_TOKEN;

/**
 * Single entry point for TMDB requests.
 *
 * @param {string} path e.g. "/movie/603"
 * @param {Record<string, string | number>} params query params
 * @param {AbortSignal} [signal] optional abort signal
 */
export async function tmdbFetch(path, params = {}, signal) {
  if (!token) {
    throw new Error(
      "Missing TMDB token: copy .env.example to .env and set VITE_TMDB_TOKEN."
    );
  }

  const url = new URL(`${BASE_URL}${path}`);
  for (const [key, value] of Object.entries(params)) {
    if (value === undefined || value === null || value === "") continue;
    url.searchParams.set(key, String(value));
  }

  const response = await fetch(url, {
    signal,
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json;charset=utf-8",
    },
  });

  if (!response.ok) {
    throw new Error(
      `TMDB request failed: ${response.status} ${response.statusText}`
    );
  }

  return response.json();
}

export function getPopular(kind, page = 1, signal) {
  return tmdbFetch(`/${kind}/popular`, { page }, signal);
}

export function searchTmdb(kind, query, page = 1, signal) {
  return tmdbFetch(`/search/${kind}`, { query, page }, signal);
}

export function getMovie(id, signal) {
  return tmdbFetch(
    `/movie/${id}`,
    { append_to_response: "release_dates,videos,credits" },
    signal
  );
}

export function getTv(id, signal) {
  return tmdbFetch(
    `/tv/${id}`,
    { append_to_response: "content_ratings,videos,credits" },
    signal
  );
}

export function getPerson(id, signal) {
  return tmdbFetch(
    `/person/${id}`,
    { append_to_response: "movie_credits,tv_credits" },
    signal
  );
}
