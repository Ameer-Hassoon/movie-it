import React, { useState, useEffect } from "react";
import fetchMovies from "../tools/fetchMovie";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export const TopBar = ({ onResults }) => {
  const [query, setQuery] = useState("");
  const { currentUser, isAuthenticated } = useAuth();

  useEffect(() => {
    const fetchResults = async () => {
      if (query.trim() === "") {
        const url = "https://api.themoviedb.org/3/movie/popular";
        const data = await fetchMovies(url);
        onResults(data.results || []);
      } else {
        const url = `https://api.themoviedb.org/3/search/movie?query=${encodeURIComponent(
          query
        )}`;
        const data = await fetchMovies(url);
        onResults(data.results || []);
      }
    };

    const timeoutId = setTimeout(() => {
      fetchResults();
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [query, onResults]);

  return (
    <div className="relative">
      <div className="bg-blue-950 w-full h-16">
        <h1 className="text-3xl font-bold text-white absolute top-4 left-5 ">
          movie it
        </h1>

        <div className="w-full flex justify-center items-center h-10">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search for a movie..."
            className="p-3 w-120 mt-6 rounded-xl border-2 border-violet-800 focus:outline-none focus:ring-2 focus:ring-violet-600 bg-white text-gray-800"
          />
        </div>

        <div className="absolute top-4 right-5 flex items-center gap-4">
          {isAuthenticated ? (
            <>
              <span className="text-white text-lg">
                Welcome, {currentUser?.name}
              </span>
              <Link to="/profile">
                <img
                  src="https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y"
                  alt="Profile"
                  className="w-10 h-10 rounded-full border-2 border-white hover:cursor-pointer"
                />
              </Link>
            </>
          ) : (
            <Link to="/login">
              <button className="text-xl text-gray-300 hover:text-white hover:bg-blue-900 px-3 py-1 rounded transition-colors">
                Login
              </button>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};
