import React, { useEffect, useState } from "react";
import { TopBar } from "../components/TopBar";
import TvCard from "../components/TvCard";
import { Tools } from "../tools/utils";

const TvShows = () => {
  const [shows, setShows] = useState([]);
  const [query, setQuery] = useState("");
  const [err, setErr] = useState("");

  useEffect(() => {
    try {
      const fetchResults = async () => {
        const tools = new Tools("shows");
        const data = await tools.fetchSearch(query);
        setShows(data);
      };
      setTimeout(() => {
        fetchResults();
      }, 0);
    } catch (error) {
      setErr(error);
      console.log(err);
    }
  }, [query]);

  const finalTrendingMovies = shows.filter((n) => n.poster_path > "");
  return (
    <>
      <TopBar />

      <div className="w-full flex justify-center items-center h-10 mt-5">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="search for a show..."
          className="p-3 w-120 mt-6 rounded-xl border-2 border-[rgb(120,83,9)] focus:outline-none focus:ring-2 focus:ring-[rgb(173,149,83)] bg-white text-gray-800"
        />
      </div>
      <div className="mt-15">
        <h1 className="text-4xl font-bold mb-6 text-center  text-yellow-800">
          TV Shows
        </h1>
      </div>
      <div className="flex flex-wrap  items-center">
        {finalTrendingMovies.length > 0 ? (
          finalTrendingMovies.map((movie) => {
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
          <p>No shows found</p>
        )}
      </div>
    </>
  );
};

export default TvShows;
