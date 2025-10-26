import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { MainBar } from "../components/MainBar.jsx";

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
      <MainBar />
      <div className="max-w-md mx-auto p-8 bg-white rounded-lg shadow-md mt-20 border border-gray-200">
        <h1 className="text-4xl font-bold text-center mb-8 text-gray-800">
          Log In
        </h1>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <form className="mt-6" onSubmit={handleSubmit}>
          <div className="mb-6">
            <label
              className="block text-lg font-medium mb-2 text-gray-700"
              htmlFor="email"
            >
              Email
            </label>
            <input
              className="border border-gray-300 p-3 w-full rounded-lg text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="mb-6">
            <label
              className="block text-lg font-medium mb-2 text-gray-700"
              htmlFor="password"
            >
              Password
            </label>
            <input
              className="border border-gray-300 p-3 w-full rounded-lg text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
            className="bg-blue-600 text-white py-3 px-6 rounded-lg w-full font-semibold hover:bg-blue-700 transition-colors disabled:bg-blue-400 disabled:cursor-not-allowed"
          >
            {loading ? "Logging in..." : "Log In"}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-gray-600">
            Don't have an account?{" "}
            <Link to="/signup">
              <span className="text-blue-600 hover:text-blue-800 cursor-pointer font-semibold">
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
