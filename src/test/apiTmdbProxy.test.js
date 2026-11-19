import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import handler from "../../api/tmdb.js";

function mockRes() {
  const res = {
    statusCode: null,
    body: null,
    headers: {},
  };

  res.setHeader = vi.fn((name, value) => {
    res.headers[name] = value;
  });
  res.status = vi.fn((code) => {
    res.statusCode = code;
    return res;
  });
  res.json = vi.fn((body) => {
    res.body = body;
    return res;
  });

  return res;
}

function mockReq({ method = "GET", query = {} } = {}) {
  return { method, query, url: "/api/tmdb" };
}

function jsonResponse(body, { ok = true, status = 200 } = {}) {
  return {
    ok,
    status,
    text: async () => JSON.stringify(body),
  };
}

describe("serverless TMDB proxy", () => {
  beforeEach(() => {
    vi.stubEnv("TMDB_TOKEN", "test-token");
    vi.stubGlobal("fetch", vi.fn());
  });

  afterEach(() => {
    vi.unstubAllEnvs();
    vi.unstubAllGlobals();
  });

  it("rejects non-GET requests with 405", async () => {
    const res = mockRes();
    await handler(mockReq({ method: "POST" }), res);

    expect(res.statusCode).toBe(405);
    expect(res.headers.Allow).toBe("GET");
    expect(fetch).not.toHaveBeenCalled();
  });

  it("returns 500 { error: 'missing_token' } when TMDB_TOKEN is absent", async () => {
    vi.stubEnv("TMDB_TOKEN", "");
    const res = mockRes();

    await handler(mockReq({ query: { path: "movie/603" } }), res);

    expect(res.statusCode).toBe(500);
    expect(res.body).toEqual({ error: "missing_token" });
    expect(fetch).not.toHaveBeenCalled();
  });

  it("returns 403 for a path outside the allow-list", async () => {
    const res = mockRes();

    await handler(mockReq({ query: { path: "account/1/lists" } }), res);

    expect(res.statusCode).toBe(403);
    expect(res.body).toEqual({ error: "forbidden_path" });
    expect(fetch).not.toHaveBeenCalled();
  });

  it("forwards path and query params with the bearer token", async () => {
    fetch.mockResolvedValue(jsonResponse({ page: 1, results: [] }));
    const res = mockRes();

    await handler(
      mockReq({
        query: {
          path: "discover/movie",
          page: "2",
          sort_by: "popularity.desc",
          "vote_count.gte": "300",
        },
      }),
      res
    );

    expect(fetch).toHaveBeenCalledTimes(1);
    const [url, options] = fetch.mock.calls[0];
    const parsed = new URL(String(url));

    expect(parsed.origin + parsed.pathname).toBe(
      "https://api.themoviedb.org/3/discover/movie"
    );
    expect(parsed.searchParams.get("page")).toBe("2");
    expect(parsed.searchParams.get("sort_by")).toBe("popularity.desc");
    expect(parsed.searchParams.get("vote_count.gte")).toBe("300");
    expect(parsed.searchParams.has("path")).toBe(false);
    expect(options.headers.Authorization).toBe("Bearer test-token");

    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({ page: 1, results: [] });
    expect(res.headers["Cache-Control"]).toBe(
      "public, s-maxage=3600, stale-while-revalidate=86400"
    );
  });

  it("does not cache non-200 responses and keeps the TMDB status", async () => {
    fetch.mockResolvedValue(
      jsonResponse({ status_message: "Not found" }, { ok: false, status: 404 })
    );
    const res = mockRes();

    await handler(mockReq({ query: { path: "movie/999999999" } }), res);

    expect(res.statusCode).toBe(404);
    expect(res.body).toEqual({ status_message: "Not found" });
    expect(res.headers["Cache-Control"]).toBeUndefined();
  });

  it("returns 502 when the upstream request throws", async () => {
    fetch.mockRejectedValue(new Error("network down"));
    const res = mockRes();

    await handler(mockReq({ query: { path: "movie/603" } }), res);

    expect(res.statusCode).toBe(502);
    expect(res.body).toEqual({ error: "upstream_unreachable" });
  });

  it("reads the path from the URL when the rewrite is not applied", async () => {
    fetch.mockResolvedValue(jsonResponse({ id: 603 }));
    const res = mockRes();

    await handler(
      { method: "GET", query: {}, url: "/api/tmdb/movie/603?language=en-US" },
      res
    );

    const [url] = fetch.mock.calls[0];
    expect(String(url)).toBe("https://api.themoviedb.org/3/movie/603");
    expect(res.statusCode).toBe(200);
  });
});
