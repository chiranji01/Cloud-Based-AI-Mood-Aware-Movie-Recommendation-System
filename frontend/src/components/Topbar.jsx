
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Topbar.css";

function Topbar() {
  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState("");
  const [user, setUser] = useState(null);

  // =========================================================
  // LOAD LOGGED-IN USER
  // =========================================================
  useEffect(() => {
    const loadUser = () => {
      try {
        const savedUser = localStorage.getItem("user");

        if (savedUser) {
          const parsedUser = JSON.parse(savedUser);
          setUser(parsedUser);
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error("Error loading user:", error);
        setUser(null);
      }
    };

    loadUser();

    // Update topbar if localStorage changes
    window.addEventListener("storage", loadUser);

    return () => {
      window.removeEventListener("storage", loadUser);
    };
  }, []);

  // =========================================================
  // SEARCH
  // =========================================================
  const handleSearch = (event) => {
    event.preventDefault();

    const trimmedSearch = searchTerm.trim();

    if (!trimmedSearch) {
      return;
    }

    navigate(`/search?q=${encodeURIComponent(trimmedSearch)}`);
  };

  // =========================================================
  // USERNAME
  // =========================================================
  const displayName =
    user?.name ||
    user?.username ||
    user?.email?.split("@")[0] ||
    "User";

  return (
    <header className="topbar">

      {/* SEARCH */}
      <form
        className="search-container"
        onSubmit={handleSearch}
      >
        <span className="search-icon">⌕</span>

        <input
          type="text"
          placeholder="Search movies by title or genre..."
          value={searchTerm}
          onChange={(event) =>
            setSearchTerm(event.target.value)
          }
        />
      </form>

      {/* PROFILE AREA */}
      <div className="profile-area">

        {/* NOTIFICATION */}
        <div className="notification">
          🔔
          <span>3</span>
        </div>

        {/* AVATAR */}
        <div className="avatar">
          <img
            src="https://i.pravatar.cc/100?img=12"
            alt="Profile"
          />
        </div>

        {/* LOGGED-IN USERNAME */}
        <div className="profile-text">
          <span className="username">
            {displayName}
          </span>
        </div>

      </div>

    </header>
  );
}

export default Topbar;
