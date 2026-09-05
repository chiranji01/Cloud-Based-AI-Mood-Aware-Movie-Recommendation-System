import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Topbar.css";

function Topbar() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearch = (event) => {
    event.preventDefault();

    const trimmedSearch = searchTerm.trim();

    if (!trimmedSearch) {
      return;
    }

    navigate(`/search?q=${encodeURIComponent(trimmedSearch)}`);
  };

  return (
    <header className="topbar">

      <form
        className="search-container"
        onSubmit={handleSearch}
      >
        <span className="search-icon">⌕</span>

        <input
          type="text"
          placeholder="Search movies by title or genre..."
          value={searchTerm}
          onChange={(event) => setSearchTerm(event.target.value)}
        />
      </form>

      <div className="profile-area">

        <div className="notification">
          🔔 
          <span>3</span>
        </div>

        <div className="avatar">
          <img
            src="https://i.pravatar.cc/100?img=12"
            alt="Profile"
          />
        </div>

        <div className="profile-text">
          <span className="username">User</span>
        </div>

      

      </div>

    </header>
  );
}

export default Topbar;