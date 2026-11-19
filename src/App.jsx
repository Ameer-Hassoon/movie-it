import { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Outlet, useLocation } from "react-router-dom";
import { AuthProvider } from "./context/AuthProvider.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import TopBar from "./components/TopBar.jsx";
import Home from "./screens/Home.jsx";
import LogIn from "./screens/LogIn.jsx";
import SignUp from "./screens/SignUp.jsx";
import Profile from "./screens/Profile.jsx";
import MovieDetails from "./screens/MovieDetails.jsx";
import TvShows from "./screens/TvShows.jsx";
import TvDetails from "./screens/TvDetails.jsx";
import People from "./screens/People.jsx";
import PersonDetails from "./screens/PersonDetails.jsx";
import NotFound from "./screens/NotFound.jsx";

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
      <footer className="border-t border-line px-4 py-6 text-center text-sm text-muted">
        Data and images from{" "}
        <a href="https://www.themoviedb.org" className="underline hover:text-paper" target="_blank" rel="noreferrer">
          TMDB
        </a>
        . This product uses the TMDB API but is not endorsed or certified by TMDB.
      </footer>
    </div>
  );
};

const App = () => (
  <AuthProvider>
    <Router>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/tv" element={<TvShows />} />
          <Route path="/people" element={<People />} />
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
  </AuthProvider>
);

export default App;
