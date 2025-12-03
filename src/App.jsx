import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Home from "./screens/Home.jsx";
import LogIn from "./screens/LogIn.jsx";
import SignUp from "./screens/SingUp.jsx";
import Profile from "./screens/profile.jsx";
import MovieDetails from "./screens/MovieDetails.jsx";
import TvShows from "./screens/TvShows.jsx";
import TvDetails from "./screens/TvDetails.jsx";
import People from "./screens/People.jsx";
import PersonDetails from "./screens/PersonDetails.jsx";

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<LogIn />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/movie/:id" element={<MovieDetails />} />
          <Route path="/tv" element={<TvShows />} />
          <Route path="/tvShows/:id" element={<TvDetails />} />
          <Route path="/person/:id" element={<PersonDetails />} />
          <Route path="people" element={<People />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;
