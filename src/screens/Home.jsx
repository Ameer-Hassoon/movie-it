import { useEffect } from "react";
import { getPopular, getTopRated, getTrending } from "../api/tmdb.js";
import { useAsync } from "../hooks/useAsync.js";
import MediaRow from "../components/MediaRow";
import Spotlight from "../components/Spotlight";
import { ErrorState } from "../components/States";

/** Landing page: one spotlight, then a few curated rows that lead into browsing. */
const Home = () => {
  const { data, loading, error } = useAsync(
    (signal) =>
      Promise.all([
        getTrending("all", "week", signal),
        getPopular("movie", 1, signal),
        getTopRated("movie", 1, signal),
        getPopular("tv", 1, signal),
      ]),
    []
  );

  useEffect(() => {
    document.title = "Movie It: find your next movie or show";
  }, []);

  if (error) return <ErrorState error={error} onRetry={() => window.location.reload()} />;

  const [trending, popularMovies, topRated, popularTv] = data ?? [];
  const trendingTitles = (trending?.results ?? []).filter(
    (i) => (i.media_type === "movie" || i.media_type === "tv") && i.backdrop_path
  );
  const [lead, ...rest] = trendingTitles;

  return (
    <div className="pb-20">
      <Spotlight item={lead} />
      <div className="space-y-12">
        <MediaRow title="Trending this week" items={rest} loading={loading} />
        <MediaRow title="Popular movies" items={popularMovies?.results} kind="movie" loading={loading} seeAllTo="/movies" />
        <MediaRow title="Highest rated movies" items={topRated?.results} kind="movie" loading={loading} seeAllTo="/movies?sort=top" />
        <MediaRow title="Popular shows" items={popularTv?.results} kind="tv" loading={loading} seeAllTo="/tv" />
      </div>
    </div>
  );
};

export default Home;
