import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import fetchMovies from "../tools/fetchMovie";
import { useAuth } from "../context/AuthContext";
import logo from "../assets/ChatGPT Image Oct 26, 2025, 05_12_47 PM.png";
export const TopBar = ({ onResults }) => {
  const [query, setQuery] = useState("");
  const { currentUser, isAuthenticated } = useAuth();

  const pathName = window.location.pathname;

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
        <img
          src={logo}
          alt="Profile"
          className="h-27 w-auto mt-5 absolute rounded-full flex -top-8  left-3"
        />

        {pathName !== "/" ? (
          <Link to="/">
            <div className="absolute left-31 h-16 hover:bg-blue-900 hover:cursor-pointer justify-center items-center flex w-18 align-middle  transition-colors">
              <p>Home</p>
            </div>
          </Link>
        ) : (
          <Link to="/">
            <div className="absolute left-31 h-16 bg-blue-900 hover:cursor-pointer justify-center items-center flex w-18 align-middle">
              <p>Home</p>
            </div>
          </Link>
        )}

        {pathName !== "/trending" ? (
          <Link to="/trending">
            <div className="absolute left-50 h-16 top-0 hover:bg-blue-900 hover:cursor-pointer justify-center items-center flex w-18 align-middle transition-colors">
              <p>trending</p>
            </div>
          </Link>
        ) : (
          <Link to="/trending">
            <div className="absolute left-50 h-16 top-0 bg-blue-900 hover:cursor-pointer justify-center items-center flex w-18 align-middle ">
              <p>trending</p>
            </div>
          </Link>
        )}

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
              <button className="text-xl text-gray-300 hover:text-white hover:bg-blue-900 px-3 py-1 rounded transition-colors hover:cursor-pointer">
                Login
              </button>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};
