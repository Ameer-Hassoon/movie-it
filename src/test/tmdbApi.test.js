import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  discover,
  getGenres,
  getMovie,
  getPopular,
  getTopRated,
  getTrending,
  getTv,
  searchTmdb,
  tmdbFetch,
} from "../api/tmdb.js";

function ok(body = { page: 1, results: [] }) {
  return { ok: true, status: 200, json: async () => body };
}

function calledUrl(call = 0) {
  return String(fetch.mock.calls[call][0]);
}

describe("tmdbFetch", () => {
  beforeEach(() => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(ok()));
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("builds a same-origin proxy URL and skips empty params", async () => {
    await tmdbFetch("/movie/603", {
      page: 2,
      append_to_response: "videos",
      empty: "",
      missing: undefined,
    });

    expect(calledUrl()).toBe(
      "/api/tmdb/movie/603?page=2&append_to_response=videos"
    );
  });

  it("sends no credentials or auth header to the browser-side proxy", async () => {
    await tmdbFetch("/movie/603");

    const [url, options] = fetch.mock.calls[0];
    expect(String(url).startsWith("/api/tmdb/")).toBe(true);
    expect(JSON.stringify(options ?? {})).not.toMatch(/authorization|bearer/i);
  });

  it("surfaces the missing-token error from the proxy", async () => {
    fetch.mockResolvedValue({
      ok: false,
      status: 500,
      statusText: "Internal Server Error",
      json: async () => ({ error: "missing_token" }),
    });

    await expect(tmdbFetch("/movie/603")).rejects.toThrow(/token/i);
  });

  it("throws on other non-2xx responses", async () => {
    fetch.mockResolvedValue({
      ok: false,
      status: 404,
      statusText: "Not Found",
      json: async () => ({ status_message: "Not found" }),
    });

    await expect(tmdbFetch("/movie/1")).rejects.toThrow(/404/);
  });
});

describe("TMDB endpoint helpers", () => {
  beforeEach(() => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(ok()));
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("requests recommendations alongside the existing details data", async () => {
    await getMovie(603);
    expect(calledUrl(0)).toContain("/api/tmdb/movie/603?");
    expect(calledUrl(0)).toContain("release_dates");
    expect(calledUrl(0)).toContain("videos");
    expect(calledUrl(0)).toContain("credits");
    expect(calledUrl(0)).toContain("recommendations");

    await getTv(1396);
    expect(calledUrl(1)).toContain("/api/tmdb/tv/1396?");
    expect(calledUrl(1)).toContain("content_ratings");
    expect(calledUrl(1)).toContain("recommendations");
  });

  it("builds trending, top-rated, search and popular paths", async () => {
    await getTrending();
    expect(calledUrl(0)).toBe("/api/tmdb/trending/all/week");

    await getTrending("movie", "day");
    expect(calledUrl(1)).toBe("/api/tmdb/trending/movie/day");

    await getTopRated("tv", 3);
    expect(calledUrl(2)).toBe("/api/tmdb/tv/top_rated?page=3");

    await searchTmdb("movie", "dune", 2);
    expect(calledUrl(3)).toBe("/api/tmdb/search/movie?query=dune&page=2");

    await getPopular("person", 1);
    expect(calledUrl(4)).toBe("/api/tmdb/person/popular?page=1");
  });

  it("caches genre lists per kind", async () => {
    fetch.mockResolvedValue(
      ok({ genres: [{ id: 28, name: "Action", extra: "dropped" }] })
    );

    const first = await getGenres("movie");
    const second = await getGenres("movie");

    expect(first).toEqual([{ id: 28, name: "Action" }]);
    expect(second).toEqual(first);
    expect(fetch).toHaveBeenCalledTimes(1);
    expect(calledUrl(0)).toBe("/api/tmdb/genre/movie/list");

    await getGenres("tv");
    expect(fetch).toHaveBeenCalledTimes(2);
  });

  it("builds discover params, including the vote-count floor", async () => {
    await discover("movie", { genre: 28, sort: "vote_average.desc", page: 2 });

    const url = new URL(calledUrl(0), "http://localhost");
    expect(url.pathname).toBe("/api/tmdb/discover/movie");
    expect(url.searchParams.get("with_genres")).toBe("28");
    expect(url.searchParams.get("sort_by")).toBe("vote_average.desc");
    expect(url.searchParams.get("page")).toBe("2");
    expect(url.searchParams.get("vote_count.gte")).toBe("300");

    await discover("tv");
    const plain = new URL(calledUrl(1), "http://localhost");
    expect(plain.searchParams.has("with_genres")).toBe(false);
    expect(plain.searchParams.has("vote_count.gte")).toBe(false);
    expect(plain.searchParams.get("sort_by")).toBe("popularity.desc");
  });
});
