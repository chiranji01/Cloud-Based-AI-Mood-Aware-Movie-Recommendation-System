import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/login/Login";
import Register from "./pages/register/register";
import Home from "./pages/home/home";
import Ratings from "./pages/ratings/Rating";
import MovieDetails from "./pages/movie details/movie details";
import Mood from "./pages/moodPage/mood";
import Profile from "./pages/profile/profile";
import Dashboard from "./pages/dashboard/Dashboard";

function ProtectedRoute({ children }) {
const user = localStorage.getItem("user");

if (!user) {
return <Navigate to="/login" replace />;
}

return children;
}

function App() {
return (
<BrowserRouter>
<Routes>

    <Route
      path="/"
      element={<Navigate to="/login" replace />}
    />

    <Route
      path="/login"
      element={<Login />}
    />

    <Route
      path="/register"
      element={<Register />}
    />

    <Route
      path="/home"
      element={
        <ProtectedRoute>
          <Home />
        </ProtectedRoute>
      }
    />

    <Route
      path="/ratings"
      element={
        <ProtectedRoute>
          <Ratings />
        </ProtectedRoute>
      }
    />

    <Route
      path="/movie/:id"
      element={
        <ProtectedRoute>
          <MovieDetails />
        </ProtectedRoute>
      }
    />
    <Route
    path="/mood"
    element={
    <ProtectedRoute>
      <Mood />
    </ProtectedRoute>
    }
   />

    <Route
      path="/mood/:mood"
      element={
        <ProtectedRoute>
          <Mood />
        </ProtectedRoute>
      }
    />

    <Route
      path="/profile"
      element={
        <ProtectedRoute>
          <Profile />
        </ProtectedRoute>
      }
    />

    <Route
      path="*"
      element={<Navigate to="/login" replace />}
    />

  </Routes>
</BrowserRouter>

);
}

export default App;