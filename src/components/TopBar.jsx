import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import logo from "../assets/ChatGPT Image Oct 26, 2025, 05_12_47 PM.png";

export const TopBar = () => {
  const { currentUser, isAuthenticated } = useAuth();

  const pathName = window.location.pathname;

  return (
    <div className="relative">
      <div className="bg-blue-950 w-full h-16">
        <img
          src={logo}
          alt="Profile"
          className="h-27 w-auto mt-5 absolute rounded-full flex -top-8  left-0"
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

        {pathName !== "/Tv" ? (
          <Link to="/Tv">
            <div className="absolute left-50 h-16 top-0 hover:bg-blue-900 hover:cursor-pointer justify-center items-center flex w-18 align-middle transition-colors">
              <p>TVs</p>
            </div>
          </Link>
        ) : (
          <Link to="/Tv">
            <div className="absolute left-50 h-16 top-0 bg-blue-900 hover:cursor-pointer justify-center items-center flex w-18 align-middle ">
              <p>TVs</p>
            </div>
          </Link>
        )}

        <div className="absolute top-3 right-8 flex items-center gap-4">
          {isAuthenticated ? (
            <>
              <span className="text-white text-lg"></span>
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
