import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Home from "./screens/Home.jsx";
import LogIn from "./screens/LogIn.jsx";
import SignUp from "./screens/SingUp.jsx";
import Profile from "./screens/profile.jsx";
import Movie from "./screens/Movie.jsx";
import Tv from "./screens/Tv.jsx";
import TvShow from "./screens/TvShows.jsx";

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<LogIn />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/movie/:id" element={<Movie />} />
          <Route path="/tv" element={<Tv />} />
          <Route path="/tvShows/:id" element={<TvShow />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;
