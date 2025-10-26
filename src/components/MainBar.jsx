import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export const MainBar = () => {
  const { currentUser, isAuthenticated } = useAuth();

  return (
    <div className="relative">
      <div className="bg-blue-950 w-full h-16">
        <Link to="/">
          <button className="text-3xl font-bold text-white absolute top-4 left-5 hover:cursor-pointer hover:text-violet-200 ">
            movie it
          </button>
        </Link>

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
