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
  // =====================================================
  // STATE
  // =====================================================

  const [selectedMood, setSelectedMood] = useState("Happy");

  const [movies, setMovies] = useState([]);

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");

  // =====================================================
  // GET RECOMMENDATIONS FROM DJANGO
  // =====================================================

  const fetchRecommendations = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        "http://127.0.0.1:8000/api/recommendations/",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            mood: selectedMood,
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();

        throw new Error(
          errorData.error ||
            "Unable to get movie recommendations."
        );
      }

      const data = await response.json();

      console.log(
        "Recommendation API response:",
        data
      );

      setMovies(
        data.recommendations || []
      );
    } catch (err) {
      console.error(
        "Recommendation API error:",
        err
      );

      setMovies([]);

      setError(
        err.message ||
          "Could not load recommendations. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // MOOD SELECTION
  // =====================================================

  const handleMoodSelect = (moodName) => {
    setSelectedMood(moodName);

    // Remove old recommendations when mood changes
    setMovies([]);

    setError("");
  };

  return (
    <div className="app">

      {/* =================================================
          SIDEBAR
      ================================================= */}

      <aside className="sidebar">

        <div className="logo">
          <div className="logo-icon">
            ✣
          </div>

          <span>
            MoodFlix
          </span>
        </div>

        <nav className="navigation">

          <a className="nav-item">
            <span className="nav-icon">
              ⌂
            </span>

            <span>
              Home
            </span>
          </a>

          <a className="nav-item active">
            <span className="nav-icon">
              ☻
            </span>

            <span>
              Mood
            </span>
          </a>

          <a className="nav-item">
            <span className="nav-icon">
              ♡
            </span>

            <span>
              My Ratings
            </span>
          </a>

          <a className="nav-item">
            <span className="nav-icon">
              ♙
            </span>

            <span>
              Profile
            </span>
          </a>

        </nav>

        {/* Sidebar decoration */}

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
            <strong>
              Need help?
            </strong>

            <small>
              We're here to help
            </small>
          </div>

          <span className="help-arrow">
            ›
          </span>

        </div>

        {/* Logout */}

        <div className="logout">
          <span>
            ⇥
          </span>

          <span>
            Logout
          </span>
        </div>

      </aside>


      {/* =================================================
          MAIN CONTENT
      ================================================= */}

      <main className="main">

        {/* =================================================
            TOP BAR
        ================================================= */}

        <header className="topbar">

          <div className="search-container">

            <span className="search-icon">
              ⌕
            </span>

            <input
              type="text"
              placeholder="Search movies by title, genre, actor..."
            />

            <button className="filter-button">
              <span>
                ☷
              </span>

              Filters
            </button>

          </div>

          <div className="profile-area">

            <div className="notification">
              ♧

              <span>
                3
              </span>
            </div>

            <div className="avatar">

              <img
                src="https://i.pravatar.cc/100?img=12"
                alt="Profile"
              />

            </div>

            <span className="username">
              User
            </span>

            <span className="dropdown">
              ⌄
            </span>

          </div>

        </header>


        {/* =================================================
            HERO
        ================================================= */}

        <section className="hero">

          <div className="hero-text">

            <h1>
              How are you{" "}
              <span>
                feeling
              </span>{" "}
              today? 😊
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


        {/* =================================================
            MOOD SECTION
        ================================================= */}

        <section className="mood-section">

          <div className="mood-grid">

            {moods.map((mood) => (

              <button
                key={mood.name}

                className={`mood-card ${mood.className} ${
                  selectedMood === mood.name
                    ? "selected"
                    : ""
                }`}

                onClick={() =>
                  handleMoodSelect(
                    mood.name
                  )
                }
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


          {/* Show Recommendations */}

          <button
            className="recommend-button"

            onClick={
              fetchRecommendations
            }

            disabled={
              loading
            }
          >

            ✨

            <span>
              {
                loading
                  ? "Loading Recommendations..."
                  : "Show Recommendations"
              }
            </span>

          </button>

        </section>


        {/* =================================================
            ERROR
        ================================================= */}

        {error && (

          <div className="recommendation-error">
            {error}
          </div>

        )}


        {/* =================================================
            RECOMMENDATIONS
        ================================================= */}

        <section className="recommendations">

          <div className="section-header">

            <h2>
              Recommended for{" "}
              {selectedMood}
            </h2>

            {movies.length > 0 && (

              <button className="view-all">
                View all

                <span>
                  ›
                </span>
              </button>

            )}

          </div>


          {/* =================================================
              EMPTY STATE
          ================================================= */}

          {!loading &&
            movies.length === 0 &&
            !error && (

              <div className="empty-recommendations">

                <p>
                  Select your mood and click
                  <strong>
                    {" "}Show Recommendations
                  </strong>
                  {" "}to discover movies.
                </p>

              </div>

            )}


          {/* =================================================
              LOADING STATE
          ================================================= */}

          {loading && (

            <div className="loading-recommendations">
              Finding the best movies for your mood...
            </div>

          )}


          {/* =================================================
              MOVIE CARDS
          ================================================= */}

          {!loading &&
            movies.length > 0 && (

              <div className="movie-wrapper">

                <div className="movie-grid">

                  {movies.map((movie) => (

                    <div
                      className="movie-card"
                      key={movie.movieId}
                    >

                      {/* =====================================
                          POSTER
                      ===================================== */}

                      <div className="poster">

                        {movie.poster_url ? (

                          <img
                            src={
                              movie.poster_url
                            }

                            alt={`${movie.title} poster`}

                            loading="lazy"

                            onError={(event) => {
                              event.currentTarget.style.display =
                                "none";
                            }}
                          />

                        ) : (

                          <div className="poster-placeholder">

                            <span className="poster-icon">
                              🎬
                            </span>

                            <span className="poster-title">
                              {movie.title}
                            </span>

                          </div>

                        )}

                      </div>


                      {/* =====================================
                          MOVIE INFORMATION
                      ===================================== */}

                      <div className="movie-info">

                        <h3>
                          {movie.title}
                        </h3>

                        <div className="movie-bottom">

                          <span className="genre">

                            {movie.genres
                              ? movie.genres.replaceAll(
                                  "|",
                                  " • "
                                )
                              : "No genre"}

                          </span>

                          <span className="rating">

                            ★{" "}

                            {movie.average_rating !== null &&
                            movie.average_rating !== undefined
                              ? Number(
                                  movie.average_rating
                                ).toFixed(1)
                              : "N/A"}

                          </span>

                        </div>


                        {/* =====================================
                            AI DETAILS
                        ===================================== */}

                        <div className="recommendation-details">

                          <small>
                            Ratings:{" "}
                            {movie.rating_count ?? 0}
                          </small>

                          <small>
                            Match:{" "}

                            {Math.round(
                              Number(
                                movie.mood_similarity ||
                                  0
                              ) * 100
                            )}

                            %
                          </small>

                        </div>


                        {/* =====================================
                            IMDb link is already returned by
                            Django and will be used in the
                            Movie Details page next.
                        ===================================== */}

                      </div>

                    </div>

                  ))}

                </div>

                <button className="next-button">
                  ›
                </button>

              </div>

            )}

        </section>

      </main>

    </div>
  );
}

export default App;