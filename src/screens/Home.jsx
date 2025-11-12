import React, { useEffect, useState } from "react";
import MovieCard from "../components/MovieCard";
import { TopBar } from "../components/TopBar";
import fetchMovies from "../tools/fetchMovie";

const Home = () => {
  const [popularMovies, setPopularMovies] = useState([]);
  const [query, setQuery] = useState("");

  useEffect(() => {
    const fetchResults = async () => {
      if (query.trim() === "") {
        const url = "https://api.themoviedb.org/3/movie/popular";
        const data = await fetchMovies(url);
        setPopularMovies(data.results || []);
      } else {
        const url = `https://api.themoviedb.org/3/search/movie?query=${encodeURIComponent(
          query
        )}`;
        const data = await fetchMovies(url);
        setPopularMovies(data.results || []);
      }
    };
    setTimeout(() => {
      fetchResults();
    }, 0);
  }, [query, setPopularMovies]);
  const finalMovies = popularMovies.filter((n) => n.poster_path > "");
  return (
    <>
      <TopBar />

      <div className="w-full flex justify-center items-center h-10 mt-5">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search for a movie..."
          className="p-3 w-120 mt-6 rounded-xl border-2 border-violet-800 focus:outline-none focus:ring-2 focus:ring-violet-600 bg-white text-gray-800"
        />
      </div>
      <div className="mt-15">
        <h1 className="text-4xl font-bold mb-6 text-center">Popular Movies</h1>
      </div>
      <div className="flex flex-wrap justify-center items-center">
        {finalMovies.length > 0 ? (
          finalMovies.map((movie) => {
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

export default Home;
