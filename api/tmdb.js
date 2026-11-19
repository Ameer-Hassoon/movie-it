const TMDB_BASE = "https://api.themoviedb.org/3";

// First path segment allow-list: without it this would be an open proxy.
const ALLOWED_ROOTS = new Set([
  "movie",
  "tv",
  "person",
  "search",
  "trending",
  "discover",
  "genre",
]);

const CACHE_CONTROL = "public, s-maxage=3600, stale-while-revalidate=86400";

function pathSegments(req) {
  const fromQuery = req.query?.path;

  if (Array.isArray(fromQuery)) {
    return fromQuery
      .flatMap((part) => String(part).split("/"))
      .filter(Boolean);
  }

  if (typeof fromQuery === "string" && fromQuery) {
    return fromQuery.split("/").filter(Boolean);
  }

  // Direct hit on /api/tmdb/... (no rewrite), e.g. while testing locally.
  try {
    return new URL(req.url ?? "", "http://localhost").pathname
      .replace(/^\/api\/tmdb/, "")
      .split("/")
      .filter(Boolean);
  } catch {
    return [];
  }
}

/**
 * Vercel serverless TMDB proxy.
 *
 * vercel.json rewrites `/api/tmdb/:path*` to `/api/tmdb?path=:path*`, so the
 * requested TMDB path arrives in `req.query.path`. Only GET is supported and
 * only allow-listed top-level resources are forwarded.
 */
export default async function handler(req, res) {
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    res.status(405).json({ error: "method_not_allowed" });
    return;
  }

  const token = process.env.TMDB_TOKEN;
  if (!token) {
    res.status(500).json({ error: "missing_token" });
    return;
  }

  const segments = pathSegments(req);
  if (!segments.length || !ALLOWED_ROOTS.has(segments[0])) {
    res.status(403).json({ error: "forbidden_path" });
    return;
  }

  const url = new URL(`${TMDB_BASE}/${segments.map(encodeURIComponent).join("/")}`);

  for (const [key, value] of Object.entries(req.query ?? {})) {
    if (key === "path") continue;
    const values = Array.isArray(value) ? value : [value];
    for (const item of values) {
      if (item === undefined || item === null || item === "") continue;
      url.searchParams.append(key, String(item));
    }
  }

  let upstream;
  try {
    upstream = await fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
    });
  } catch {
    res.status(502).json({ error: "upstream_unreachable" });
    return;
  }

  const text = await upstream.text();
  let body;
  try {
    body = text ? JSON.parse(text) : {};
  } catch {
    body = { error: "invalid_upstream_response" };
  }

  if (upstream.ok) {
    res.setHeader("Cache-Control", CACHE_CONTROL);
  }

  res.status(upstream.status).json(body);
}
