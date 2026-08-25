import React, { useState } from "react";
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

function App() {
  // ================= MOOD STATE =================

  const [selectedMood, setSelectedMood] = useState("Happy");

  // ================= MOVIE STATE =================

  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // ================= GET RECOMMENDATIONS =================

  const getRecommendations = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await fetch(
        `http://127.0.0.1:8000/api/recommendations/?mood=${encodeURIComponent(
          selectedMood
        )}`
      );

      if (!response.ok) {
        throw new Error("Failed to get recommendations");
      }

      const data = await response.json();

      setMovies(data.movies || []);
    } catch (err) {
      console.error("Recommendation error:", err);

      setError(
        "Unable to load recommendations. Please make sure the Django server is running."
      );

      setMovies([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app">

      {/* ================= SIDEBAR ================= */}

      <aside className="sidebar">

        <div className="logo">
          <div className="logo-icon">✣</div>
          <span>MoodFlix</span>
        </div>

        <nav className="navigation">

          <a className="nav-item">
            <span className="nav-icon">⌂</span>
            <span>Home</span>
          </a>

          <a className="nav-item active">
            <span className="nav-icon">☻</span>
            <span>Mood</span>
          </a>

          <a className="nav-item">
            <span className="nav-icon">♡</span>
            <span>My Ratings</span>
          </a>

          <a className="nav-item">
            <span className="nav-icon">♙</span>
            <span>Profile</span>
          </a>

        </nav>

        {/* ================= SIDEBAR DECORATION ================= */}

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

        {/* ================= HELP ================= */}

        <div className="help-card">

          <div className="help-icon">?</div>

          <div>
            <strong>Need help?</strong>
            <small>We're here to help</small>
          </div>

          <span className="help-arrow">›</span>

        </div>

        {/* ================= LOGOUT ================= */}

        <div className="logout">

          <span>⇥</span>
          <span>Logout</span>

        </div>

      </aside>

      {/* ================= MAIN CONTENT ================= */}

      <main className="main">

        {/* ================= TOP BAR ================= */}

        <header className="topbar">

          <div className="search-container">

            <span className="search-icon">⌕</span>

            <input
              type="text"
              placeholder="Search movies by title, genre, actor..."
            />

            <button className="filter-button">
              <span>☷</span>
              Filters
            </button>

          </div>

          <div className="profile-area">

            <div className="notification">
              ♧
              <span>3</span>
            </div>

            <div className="avatar">

              <img
                src="https://i.pravatar.cc/100?img=12"
                alt="Profile"
              />

            </div>

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

          {/* ================= RECOMMEND BUTTON ================= */}

          <button
            className="recommend-button"
            onClick={getRecommendations}
            disabled={loading}
          >

            ✨

            <span>
              {loading
                ? "Finding Movies..."
                : "Show Recommendations"}
            </span>

          </button>

        </section>

        {/* ================= MOVIE RECOMMENDATIONS ================= */}

        <section className="recommendations">

          <div className="section-header">

            <h2>
              Recommended for your mood
            </h2>

            <button className="view-all">
              View all
              <span>›</span>
            </button>

          </div>

          {/* ================= LOADING ================= */}

          {loading && (
            <p className="loading-message">
              Finding movies for your {selectedMood.toLowerCase()} mood...
            </p>
          )}

          {/* ================= ERROR ================= */}

          {error && (
            <p className="error-message">
              {error}
            </p>
          )}

          {/* ================= MOVIE WRAPPER ================= */}

          {!loading && !error && movies.length > 0 && (

            <div className="movie-wrapper">

              <div className="movie-grid">

                {movies.map((movie) => (

                  <div
                    className="movie-card"
                    key={movie.movie_id}
                  >

                    {/* ================= POSTER ================= */}

                    <div className="poster">

                      <div className="poster-placeholder">
                        🎬
                      </div>

                    </div>

                    {/* ================= MOVIE INFO ================= */}

                    <div className="movie-info">

                      <h3>
                        {movie.title}
                      </h3>

                      <div className="movie-bottom">

                        <span className="genre">
                          {movie.genres}
                        </span>

                      </div>

                    </div>

                  </div>

                ))}

              </div>

              <button className="next-button">
                ›
              </button>

            </div>

          )}

          {/* ================= NO MOVIES YET ================= */}

          {!loading &&
            !error &&
            movies.length === 0 && (

              <p className="no-movies">
                Select a mood and click
                <strong> "Show Recommendations"</strong>
                to find movies.
              </p>

            )}

        </section>

      </main>

    </div>
  );
}

export default App;