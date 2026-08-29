import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/login/Login";
import Register from "./pages/register/Register";
import Home from "./pages/home/Home";
import Ratings from "./pages/ratings/Rating";
import MovieDetails from "./pages/movie details/movie details.jsx";
import Mood from "./pages/mood.jsx";
import Profile from "./pages/profile";
import Dashboard from "./pages/Dashboard.jsx";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        <Route path="/" element={<Home />} />
        <Route path="/home" element={<Home />} />

        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route path="/mood" element={<Mood />} />
        <Route path="/ratings" element={<Ratings />} />

        <Route
          path="/movie/:id"
          element={<MovieDetails />}
        />

        <Route path="/profile" element={<Profile />} />

        <Route path="/dashboard" element={<Dashboard />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;