import React, { useEffect, useState } from "react";
import { TopBar } from "../components/TopBar";
import { Tools } from "../tools/utils";
import Card from "../components/Card";

const TvShows = () => {
  const tools = new Tools("shows");
  const [shows, setShows] = useState([]);
  const [query, setQuery] = useState("");
  const [err, setErr] = useState("");

  useEffect(() => {
    try {
      const fetchResults = async () => {
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

  const finalTrendingShows = shows.filter((n) => n.poster_path > "");
  return (
    <>
      <TopBar />

      <div className="w-full flex justify-center items-center h-10 mt-5">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="search for a show..."
          className="p-3 w-120 mt-6 rounded-xl border-2 border-sky-800 focus:outline-none focus:ring-1 focus:ring-sky-600 bg-white text-gray-800"
        />
      </div>
      <div className="mt-15">
        <h1 className="text-4xl font-bold mb-6 text-center">Shows</h1>
      </div>
      <div className="flex flex-wrap justify-center items-center">
        {finalTrendingShows.length > 0 ? (
          finalTrendingShows.map((show) => {
            return (
              <Card
                id={show.id}
                key={show.id}
                title={show.name}
                rating={show.vote_average}
                image={`https://image.tmdb.org/t/p/w500${show.poster_path}`}
                year={tools.releaseDate(show)}
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
