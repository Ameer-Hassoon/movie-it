import React, { useEffect } from "react";
import { useState } from "react";
import fetchMovies from "../tools/fetchMovie";
import { TopBar } from "../components/TopBar";
import Casting from "../components/Casting";

const People = () => {
  const [err, setErr] = useState("");
  const [popular, setPopular] = useState([]);
  const [query, setQuery] = useState("");
  useEffect(() => {
    const people = async () => {
      try {
        if (query.trim() === "") {
          const peopleUrl = `https://api.themoviedb.org/3/person/popular`;
          const peopleData = await fetchMovies(peopleUrl);
          setPopular(peopleData.results);
        } else {
          const personUrl = `https://api.themoviedb.org/3/search/person?query=${encodeURIComponent(
            query
          )}`;
          const personData = await fetchMovies(personUrl);
          setPopular(personData.results);
        }
      } catch (error) {
        setErr(error);
        console.log(err);
      }
    };
    people();
  }, [query]);
  const modifiedArray = popular.filter((e) => e.profile_path > "");
  return (
    <div>
      <TopBar />
      <div className="w-full flex justify-center items-center h-10 mt-5">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="search for someone..."
          className="p-3 w-120 mt-6 rounded-xl border-2 border-violet-800 focus:outline-none focus:ring-2 focus:ring-violet-600 bg-white text-gray-800"
        />
      </div>

      <div className="flex flex-wrap justify-center mt-15">
        {modifiedArray.length > 0 ? (
          modifiedArray.map((person) => {
            return (
              <Casting
                id={person.id}
                image={`https://image.tmdb.org/t/p/w185${person.profile_path}`}
                name={person.original_name}
                key={person.id}
                job={person.known_for_department}
              />
            );
          })
        ) : (
          <p>nobody was found</p>
        )}
      </div>
    </div>
  );
};

export default People;
