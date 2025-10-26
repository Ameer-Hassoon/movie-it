import React, { useEffect, useState } from "react";
import MovieCard from "../components/MovieCard";
import fetchMovies from "../tools/fetchMovie";
import { TopBar } from "../components/TopBar";

const Home = () => {
  const [movies, setMovies] = useState([]);

  useEffect(() => {
    const url = "https://api.themoviedb.org/3/movie/popular";
    fetchMovies(url).then((data) => {
      setMovies(data.results || []);
    });
  }, []);

  const handleSearchResults = (results) => {
    setMovies(results);
  };

  return (
    <>
      <TopBar onResults={handleSearchResults} />
      <div className="m-20">
        <h1 className="text-4xl font-bold mb-6 text-center">Popular Movies</h1>
      </div>
      <div className="flex flex-wrap justify-center items-center">
        {movies.length > 0 ? (
          movies.map((movie) => {
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
                liked={false}
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
