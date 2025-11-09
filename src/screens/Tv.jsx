import React, { useEffect, useState } from "react";
import MovieCard from "../components/MovieCard";
import { TopBar } from "../components/TopBar";
import TvCard from "../components/TvCard";
import fetchMovies from "../tools/fetchMovie";

const Tv = () => {
  const [trendingMovies, setTrendingMovies] = useState([]);
  const [query, setQuery] = useState("");
  useEffect(() => {
    const fetchResults = async () => {
      if (query.trim() === "") {
        const url = "https://api.themoviedb.org/3/tv/popular";
        const data = await fetchMovies(url);
        setTrendingMovies(data.results || []);
      } else {
        const url = `https://api.themoviedb.org/3/search/tv?query=${encodeURIComponent(
          query
        )}`;
        const data = await fetchMovies(url);
        setTrendingMovies(data.results || []);
      }
    };
    setTimeout(() => {
      fetchResults();
    }, 0);
  }, [query, setTrendingMovies]);

  return (
    <>
      <TopBar />
      <div className="w-full flex justify-center items-center h-10 mt-5">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="search for a show..."
          className="p-3 w-120 mt-6 rounded-xl border-2 border-violet-800 focus:outline-none focus:ring-2 focus:ring-violet-600 bg-white text-gray-800"
        />
      </div>
      <div className="mt-20">
        <h1 className="text-4xl font-bold mb-6 text-center">TV Shows</h1>
      </div>
      <div className="flex flex-wrap justify-center items-center">
        {trendingMovies.length > 0 ? (
          trendingMovies.map((movie) => {
            return (
              <TvCard
                id={movie.id}
                key={movie.id}
                title={movie.name}
                rating={movie.vote_average}
                image={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                year={
                  movie.first_air_date
                    ? movie.first_air_date.split("-")[0]
                    : "N/A"
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

export default Tv;
