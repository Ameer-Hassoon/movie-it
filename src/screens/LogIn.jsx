import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { TopBar } from "../components/TopBar.jsx";

const LogIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setError("");
      setLoading(true);
      await login(email, password);
      navigate("/");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <TopBar />
      <div className="max-w-md mx-auto p-8 mt-20  rounded-lg shadow-2xl  border-0 border-gray-200">
        <h1 className="text-4xl font-bold text-center mb-8 ">Log In</h1>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <form className="mt-6" onSubmit={handleSubmit}>
          <div className="mb-6">
            <label className="block text-lg font-medium mb-2 " htmlFor="email">
              Email
            </label>
            <input
              className="p-3 w-full rounded-lg border-2 text-gray-800 border-sky-800 focus:outline-none focus:ring-1 focus:ring-sky-600 bg-white"
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="mb-6">
            <label
              className="block text-lg font-medium mb-2 "
              htmlFor="password"
            >
              Password
            </label>
            <input
              className=" p-3 w-full rounded-lg  border-2 border-sky-800 focus:outline-none focus:ring-1 focus:ring-sky-600 bg-white"
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="bg-sky-900  py-3 px-6 rounded-lg w-full font-semibold hover:bg-sky-950 transition-colors hover:cursor-pointer disabled:bg-sky-800 disabled:cursor-not-allowed text-white"
          >
            {loading ? "Logging in..." : "Log In"}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p>
            Don't have an account?{" "}
            <Link to="/signup">
              <span className="text-sky-600 hover:text-sky-800 cursor-pointer font-semibold">
                Sign up
              </span>
            </Link>
          </p>
        </div>
      </div>
    </>
  );
};

export default LogIn;
