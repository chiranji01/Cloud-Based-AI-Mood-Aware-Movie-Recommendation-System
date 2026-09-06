
import React from "react";
import { Home, Smile, Bookmark, User, LogOut } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";

import "./Sidebar.css";

function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();

  // =========================================================
  // LOGOUT
  // =========================================================
  const handleLogout = () => {
    // Remove logged-in user
    localStorage.removeItem("user");

    // Optional: remove any other login/session data
    localStorage.removeItem("token");

    // Go back to login page
    navigate("/login");
  };

  return (
    <aside className="sidebar">

      {/* LOGO */}
      <div className="logo">
        <div className="logo-icon">✣</div>

        <span>
          Mood<span>Flix</span>
        </span>
      </div>

      {/* NAVIGATION */}
      <nav className="sidebar-menu">

        <button
          className={`menu-item ${
            location.pathname === "/home" ? "active" : ""
          }`}
          onClick={() => navigate("/home")}
        >
          <Home size={18} />
          <span>Home</span>
        </button>

        <button
          className={`menu-item ${
            location.pathname === "/mood" ? "active" : ""
          }`}
          onClick={() => navigate("/mood")}
        >
          <Smile size={18} />
          <span>Mood</span>
        </button>

        <button
          className={`menu-item ${
            location.pathname === "/ratings" ? "active" : ""
          }`}
          onClick={() => navigate("/ratings")}
        >
          <Bookmark size={18} />
          <span>Ratings</span>
        </button>

        <button
          className={`menu-item ${
            location.pathname === "/profile" ? "active" : ""
          }`}
          onClick={() => navigate("/profile")}
        >
          <User size={18} />
          <span>Profile</span>
        </button>

      </nav>

      {/* SIDEBAR IMAGE */}
      <div className="sidebar-poster">
        <div className="movie-chair">🎬</div>
        <div className="popcorn">🍿</div>
      </div>

      {/* HELP */}
      <div className="help-box">

        <div className="help-icon">
          ?
        </div>

        <div>
          <strong>Need help?</strong>
          <small>We're here to help</small>
        </div>

        <span>›</span>

      </div>

      {/* LOGOUT */}
      <button
        className="logout"
        onClick={handleLogout}
      >
        <LogOut size={18} />
        <span>Logout</span>
      </button>

    </aside>
  );
}

export default Sidebar;
