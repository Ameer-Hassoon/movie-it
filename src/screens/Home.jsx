import React, { useEffect, useState } from "react";
import Card from "../components/Card.jsx";
import { TopBar } from "../components/TopBar";
import { Tools } from "../tools/utils.js";

const Home = () => {
  const [Movies, setMovies] = useState([]);
  const [query, setQuery] = useState("");
  const [err, setErr] = useState("");

  const tools = new Tools("movies");

  useEffect(() => {
    try {
      const fetchResults = async () => {
        const data = await tools.fetchSearch(query);
        setMovies(data);
      };

      setTimeout(() => {
        fetchResults();
      }, 500);
    } catch (error) {
      setErr(error);
      console.log(err);
    }
  }, [query]);
  const finalMovies = Movies.filter((n) => n.poster_path > "");
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
        <h1 className="text-4xl font-bold mb-6 text-center">Movies</h1>
      </div>
      <div className="flex flex-wrap justify-center items-center">
        {finalMovies.length > 0 ? (
          finalMovies.map((movie) => {
            return (
              <Card
                id={movie.id}
                key={movie.id}
                title={movie.title}
                rating={movie.vote_average}
                image={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                year={tools.releaseDate(movie)}
                type="movie"
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
