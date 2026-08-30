import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/login/Login";
import Register from "./pages/register/Register";
import Home from "./pages/home/Home";
import Ratings from "./pages/ratings/Rating";
import MovieDetails from "./pages/movie details/movie details";
import Mood from "./pages/moodPage/mood";
import Profile from "./pages/profile/profile";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/home" element={<Home />} />
        <Route path="/ratings" element={<Ratings />} />
        <Route path="/movie/:id" element={<MovieDetails />} />
        <Route path="/mood" element={<Mood />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;