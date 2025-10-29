import React, { useEffect, useState } from "react";
import MovieCard from "../components/MovieCard";
import fetchMovies from "../tools/fetchMovie";
import { TopBar } from "../components/TopBar";

const Trending = () => {
  const [trendingMovies, setTrendingMovies] = useState([]);

  useEffect(() => {
    const url = "https://api.themoviedb.org/3/movie/popular";
    fetchMovies(url).then((data) => {
      setTrendingMovies(data.results || []);
    });
  }, []);

  const handleSearchResults = (results) => {
    setTrendingMovies(results);
  };

  useEffect(() => {
    const key =
      "eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIzMTdiZGE3NDAwOGMyZTE1MmM0OGUwNmIwM2MxMjc2YSIsIm5iZiI6MTc1ODgyNTkwMy41MTAwMDAyLCJzdWIiOiI2OGQ1OGRhZjBlOTExMjNhOWY2OTZmNjQiLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.JerV6w_HRT42T_pjjn0cYn58_DkysWbXdT8HtYAgNlc";
    const url = `https://api.themoviedb.org/3/trending/movie/week?api_key=${key}
`;
    fetchMovies(url).then((data) => {
      setTrendingMovies(data.results || []);
    });
  }, []);

  return (
    <>
      <TopBar onResults={handleSearchResults} />

      <div className="mt-20">
        <h1 className="text-4xl font-bold mb-6 text-center">
          Trending Movies This Week
        </h1>
      </div>
      <div className="flex flex-wrap justify-center items-center">
        {trendingMovies.length > 0 ? (
          trendingMovies.map((movie) => {
            return (
              <MovieCard
                id={movie.id}
                key={movie.id}
                title={movie.title}
                rating={movie.vote_average}
                image={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                year={
                  movie.release_date ? movie.release_date.split("-")[0] : "N/A"
                }
              />
            );
          })
        ) : (
          <p>No movies found</p>
        )}
      </div>
    </>
  );
};

export default Trending;
