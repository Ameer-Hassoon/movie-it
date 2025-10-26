import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import logo from "../assets/ChatGPT Image Oct 26, 2025, 05_12_47 PM.png";

export const MainBar = () => {
  const { currentUser, isAuthenticated } = useAuth();

  return (
    <div className="bg-blue-950 w-full h-16 flex items-center justify-between px-8">
      <Link to="/" className="flex items-center">
        <img src={logo} alt="logo" className="h-27 w-auto mt-5 " />
      </Link>

      {/* Right side */}
      <div className="flex items-center gap-5">
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
  );
};
