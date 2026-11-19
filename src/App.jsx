import { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Outlet, useLocation } from "react-router-dom";
import { AuthProvider } from "./context/AuthProvider.jsx";
import { WatchlistProvider } from "./context/WatchlistProvider.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import TopBar from "./components/TopBar.jsx";
import Logo from "./components/Logo.jsx";
import Home from "./screens/Home.jsx";
import Movies from "./screens/Movies.jsx";
import LogIn from "./screens/LogIn.jsx";
import SignUp from "./screens/SignUp.jsx";
import Profile from "./screens/Profile.jsx";
import MovieDetails from "./screens/MovieDetails.jsx";
import TvShows from "./screens/TvShows.jsx";
import TvDetails from "./screens/TvDetails.jsx";
import People from "./screens/People.jsx";
import PersonDetails from "./screens/PersonDetails.jsx";
import Watchlist from "./screens/Watchlist.jsx";
import NotFound from "./screens/NotFound.jsx";

const REPO_URL = "https://github.com/Ameer-Hassoon/movie-it";

const Footer = () => (
  <footer className="border-t border-line">
    <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-8 text-sm text-muted sm:flex-row sm:items-center sm:justify-between sm:px-6">
      <div className="flex items-center gap-3">
        <Logo className="size-6" />
        <p>
          Designed and built by{" "}
          <a href="https://github.com/Ameer-Hassoon" className="font-medium text-paper hover:text-bulb" target="_blank" rel="noreferrer">
            Ameer Hassoon
          </a>
          .{" "}
          <a href={REPO_URL} className="underline hover:text-paper" target="_blank" rel="noreferrer">
            Source on GitHub
          </a>
        </p>
      </div>
      <p className="max-w-md sm:text-right">
        Data and images from{" "}
        <a href="https://www.themoviedb.org" className="underline hover:text-paper" target="_blank" rel="noreferrer">
          TMDB
        </a>
        . This product uses the TMDB API but is not endorsed or certified by TMDB.
      </p>
    </div>
  </footer>
);

const Layout = () => {
  const { pathname } = useLocation();
  // New page starts at the top (React Router doesn't do this by itself).
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <div className="flex min-h-dvh flex-col">
      <TopBar />
      <main id="main" className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

const App = () => (
  <AuthProvider>
    <WatchlistProvider>
      <Router>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<Home />} />
            <Route path="/movies" element={<Movies />} />
            <Route path="/tv" element={<TvShows />} />
            <Route path="/people" element={<People />} />
            <Route path="/watchlist" element={<Watchlist />} />
            <Route path="/movie/:id" element={<MovieDetails />} />
            <Route path="/tvShows/:id" element={<TvDetails />} />
            <Route path="/person/:id" element={<PersonDetails />} />
            <Route path="/login" element={<LogIn />} />
            <Route path="/signup" element={<SignUp />} />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
            />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </Router>
    </WatchlistProvider>
  </AuthProvider>
);

export default App;
