import React, { useEffect } from "react";
import { useState } from "react";
import { TopBar } from "../components/TopBar";
import Casting from "../components/Casting";
import { Tools } from "../tools/utils";

const People = () => {
  const [err, setErr] = useState("");
  const [peopleData, setPeopleData] = useState([]);
  const [query, setQuery] = useState("");
  const tools = new Tools("people");
  useEffect(() => {
    const people = async () => {
      try {
        const data = await tools.fetchSearch(query);
        setPeopleData(data);
      } catch (error) {
        setErr(error);
        console.log(err);
      }
    };
    people();
  }, [query]);
  const modifiedArray = peopleData.filter((e) => e.profile_path > "");
  return (
    <div>
      <TopBar />
      <div className="w-full flex justify-center items-center h-10 mt-5">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="search for someone..."
          className="p-3 w-120 mt-6 rounded-xl border-2 border-[rgb(120,83,9)] focus:outline-none focus:ring-2 focus:ring-[rgb(173,149,83)] bg-white text-gray-800"
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
