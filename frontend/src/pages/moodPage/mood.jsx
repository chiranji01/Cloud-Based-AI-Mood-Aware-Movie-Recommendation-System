import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./mood.css";

const moods = [
  {
    name: "Happy",
    emoji: "😀",
    description: "Feel good and uplifting movies",
    className: "happy",
  },
  {
    name: "Sad",
    emoji: "😢",
    description: "Emotional and heart-touching movies",
    className: "sad",
  },
  {
    name: "Relaxed",
    emoji: "😌",
    description: "Calm and relaxing movies",
    className: "relaxed",
  },
  {
    name: "Excited",
    emoji: "🤩",
    description: "High energy and thrilling movies",
    className: "excited",
  },
  {
    name: "Romantic",
    emoji: "💗",
    description: "Love and romance movies",
    className: "romantic",
  },
  {
    name: "Stressed",
    emoji: "😰",
    description: "Movies to help you unwind",
    className: "stressed",
  },
];

const movies = [
  {
    title: "The Grand Budapest Hotel",
    genre: "Comedy • Drama",
    rating: "4.4",
    image:
      "https://image.tmdb.org/t/p/w500/eWdyYQreja6JGCzqHWXpWHDrrPo.jpg",
  },
  {
    title: "Toy Story 4",
    genre: "Animation • Family",
    rating: "4.3",
    image:
      "https://image.tmdb.org/t/p/w500/w9kR8qbmQ01HwnvK4alvnQ2ca0L.jpg",
  },
  {
    title: "The Intern",
    genre: "Comedy • Drama",
    rating: "4.2",
    image:
      "https://image.tmdb.org/t/p/w500/9Q3Ez2C2qjK0Y8M2q9zK7Y9bq5.jpg",
  },
  {
    title: "About Time",
    genre: "Romance • Drama",
    rating: "4.3",
    image:
      "https://image.tmdb.org/t/p/w500/iR1bVfURbN7r1C46oH1rXxD9R7G.jpg",
  },
  {
    title: "Chef",
    genre: "Comedy • Drama",
    rating: "4.1",
    image:
      "https://image.tmdb.org/t/p/w500/9a2sK2gYpL1QxQ0J7X2g8fK8gV0.jpg",
  },
  {
    title: "Paddington 2",
    genre: "Adventure • Family",
    rating: "4.5",
    image:
      "https://image.tmdb.org/t/p/w500/1OJ9VKbS4cQhJ2x1P9W8w6P8m4T.jpg",
  },
];

function Mood() {
  const navigate = useNavigate();

  const [selectedMood, setSelectedMood] = useState("Happy");

  const handleRecommendation = () => {
    navigate("/movies", {
      state: {
        mood: selectedMood,
      },
    });
  };

  return (
    <div className="app">

      {/* ================= SIDEBAR ================= */}
      <aside className="sidebar">

        {/* Logo */}
        <div className="logo">
          <div className="logo-icon">✣</div>
          <span>MoodFlix</span>
        </div>

        {/* Navigation */}
        <nav className="navigation">

          <button
            type="button"
            className="nav-item"
            onClick={() => navigate("/home")}
          >
            <span className="nav-icon">⌂</span>
            <span>Home</span>
          </button>

          <button
            type="button"
            className="nav-item active"
            onClick={() => navigate("/mood")}
          >
            <span className="nav-icon">☻</span>
            <span>Mood</span>
          </button>

          <button
            type="button"
            className="nav-item"
            onClick={() => navigate("/ratings")}
          >
            <span className="nav-icon">♡</span>
            <span>My Ratings</span>
          </button>

          <button
            type="button"
            className="nav-item"
            onClick={() => navigate("/profile")}
          >
            <span className="nav-icon">♙</span>
            <span>Profile</span>
          </button>

        </nav>

        {/* Decorative movie illustration */}
        <div className="sidebar-decoration">

          <div className="director-chair">
            <div className="chair-back"></div>
            <div className="chair-seat"></div>
            <div className="chair-leg left"></div>
            <div className="chair-leg right"></div>
          </div>

          <div className="popcorn">
            🍿
          </div>

          <div className="clapper">
            <div className="clapper-top"></div>

            <div className="clapper-body">
              🎬
            </div>
          </div>

        </div>

        {/* Help */}
        <div className="help-card">

          <div className="help-icon">
            ?
          </div>

          <div>
            <strong>Need help?</strong>
            <small>We're here to help</small>
          </div>

          <span className="help-arrow">
            ›
          </span>

        </div>

        {/* Logout */}
        <button
          type="button"
          className="logout"
          onClick={() => navigate("/login")}
        >
          <span>⇥</span>
          <span>Logout</span>
        </button>

      </aside>

      {/* ================= MAIN CONTENT ================= */}
      <main className="main">

        {/* ================= TOP BAR ================= */}
        <header className="topbar">

          <div className="search-container">

            <span className="search-icon">
              ⌕
            </span>

            <input
              type="text"
              placeholder="Search movies by title, genre, actor..."
            />

            <button
              type="button"
              className="filter-button"
            >
              <span>☷</span>
              Filters
            </button>

          </div>

          {/* Profile area */}
          <div className="profile-area">

            <div className="notification">
              ♧
              <span>3</span>
            </div>

            <button
              type="button"
              className="avatar"
              onClick={() => navigate("/profile")}
            >
              <img
                src="https://i.pravatar.cc/100?img=12"
                alt="Profile"
              />
            </button>

            <span className="username">
              Chiranjeevi
            </span>

            <span className="dropdown">
              ⌄
            </span>

          </div>

        </header>

        {/* ================= HERO ================= */}
        <section className="hero">

          <div className="hero-text">

            <h1>
              How are you <span>feeling</span> today? 😊
            </h1>

            <p>
              Choose your current mood and we'll
              <br />
              find movies that match it.
            </p>

          </div>

          <div className="hero-decoration">

            <div className="popcorn-large">
              🍿
            </div>

            <div className="film-reel">
              ◉
            </div>

            <div className="straw">
              ╱
            </div>

          </div>

        </section>

        {/* ================= MOOD SECTION ================= */}
        <section className="mood-section">

          <div className="mood-grid">

            {moods.map((mood) => (

              <button
                key={mood.name}
                type="button"
                className={`mood-card ${mood.className} ${
                  selectedMood === mood.name ? "selected" : ""
                }`}
                onClick={() => setSelectedMood(mood.name)}
              >

                <div className="mood-emoji">
                  {mood.emoji}
                </div>

                <h3>
                  {mood.name}
                </h3>

                <p>
                  {mood.description}
                </p>

              </button>

            ))}

          </div>

          {/* Recommendation button */}
          <button
            type="button"
            className="recommend-button"
            onClick={handleRecommendation}
          >
            ✨
            <span>
              Show Recommendations
            </span>
          </button>

        </section>

        {/* ================= MOVIE RECOMMENDATIONS ================= */}
        <section className="recommendations">

          <div className="section-header">

            <h2>
              Recommended for your mood
            </h2>

            <button
              type="button"
              className="view-all"
              onClick={() => navigate("/movies")}
            >
              View all
              <span>›</span>
            </button>

          </div>

          <div className="movie-wrapper">

            <div className="movie-grid">

              {movies.map((movie) => (

                <div
                  className="movie-card"
                  key={movie.title}
                >

                  <div className="poster">

                    <img
                      src={movie.image}
                      alt={movie.title}
                    />

                  </div>

                  <div className="movie-info">

                    <h3>
                      {movie.title}
                    </h3>

                    <div className="movie-bottom">

                      <span className="genre">
                        {movie.genre}
                      </span>

                      <span className="rating">
                        ★ {movie.rating}
                      </span>

                    </div>

                  </div>

                </div>

              ))}

            </div>

            <button
              type="button"
              className="next-button"
            >
              ›
            </button>

          </div>

        </section>

      </main>

    </div>
  );
}

export default Mood;