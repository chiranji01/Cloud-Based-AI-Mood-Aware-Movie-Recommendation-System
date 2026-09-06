import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import "./mood.css";
import Sidebar from "../../components/Sidebar";
import Topbar from "../../components/Topbar";

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

function Mood() {
  const navigate = useNavigate();

  const [selectedMood, setSelectedMood] = useState("");
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleMoodSelect = async (moodName) => {
    setSelectedMood(moodName);
    setMovies([]);
    setError("");
    setLoading(true);

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/recommendations/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            mood: moodName,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error ||
            "Unable to get movie recommendations."
        );
      }

      setMovies(
        Array.isArray(data.recommendations)
          ? data.recommendations
          : []
      );
    } catch (err) {
      console.error("Recommendation API error:", err);

      setMovies([]);

      setError(
        err.message ||
          "Could not load recommendations. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleMovieClick = (movie) => {
    if (!movie?.movieId) {
      console.error("Movie ID is missing:", movie);
      return;
    }

    navigate(`/movie/${movie.movieId}`);
  };

  return (
    <div className="moodflix">
      <Sidebar />

      <main className="main-content">
        <Topbar />

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
            <div className="popcorn-large">🍿</div>

            <div className="film-reel">◉</div>

            <div className="straw">╱</div>
          </div>
        </section>

        {/* ================= MOOD SELECTION ================= */}

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
                  handleMoodSelect(mood.name)
                }
              >
                <div className="mood-emoji">
                  {mood.emoji}
                </div>

                <h3>{mood.name}</h3>

                <p>{mood.description}</p>
              </button>
            ))}
          </div>
        </section>

        {/* ================= ERROR ================= */}

        {error && (
          <div className="recommendation-error">
            {error}
          </div>
        )}

        {/* ================= RECOMMENDATIONS ================= */}

        <section className="recommendations">
          <div className="section-header">
            <h2>
              {selectedMood
                ? `Recommended for ${selectedMood}`
                : "Recommended for"}
            </h2>

            {movies.length > 0 && (
              <button className="view-all">
                View all <span>›</span>
              </button>
            )}
          </div>

          {/* ================= EMPTY STATE ================= */}

          {!loading &&
            movies.length === 0 &&
            !error && (
              <div className="empty-recommendations">
                <p>
                  Select your mood to discover personalised
                  movie recommendations.
                </p>
              </div>
            )}

          {/* ================= LOADING ================= */}

          {loading && (
            <div className="loading-recommendations">
              <div className="cinema-loader">
                <div className="reel">🎞️</div>

                <div className="film-line"></div>
              </div>

              <p>
                Finding the best movies for your mood...
              </p>

              <div className="loading-dots">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
          )}

          {/* ================= MOVIE RESULTS ================= */}

          {!loading && movies.length > 0 && (
            <div className="movie-wrapper">
              <div className="movie-grid">
                {movies.map((movie) => (
                  <div
                    className="movie-card"
                    key={movie.movieId}
                    onClick={() =>
                      handleMovieClick(movie)
                    }
                  >
                    {/* POSTER */}

                    <div className="poster">
                      {movie.poster_url ? (
                        <img
                          src={movie.poster_url}
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

                    {/* MOVIE INFO */}

                    <div className="movie-info">
                      <h3>{movie.title}</h3>

                      <div className="genre">
                        {movie.genres ? (
                          movie.genres
                            .split("|")
                            .map(
                              (
                                genre,
                                index,
                                allGenres
                              ) => (
                                <React.Fragment
                                  key={index}
                                >
                                  {genre}

                                  {index <
                                    allGenres.length -
                                      1 && (
                                    <span> • </span>
                                  )}
                                </React.Fragment>
                              )
                            )
                        ) : (
                          "No genre"
                        )}
                      </div>

                      <div className="movie-meta">
                        <span className="rating">
                          ⭐{" "}
                          {movie.average_rating != null
                            ? Number(
                                movie.average_rating
                              ).toFixed(1)
                            : "N/A"}
                        </span>

                        <span className="meta-divider">
                          •
                        </span>

                        <span className="rating-count">
                          {movie.rating_count ?? 0} ratings
                        </span>
                      </div>

                      <div className="mood-match">
                        {Math.round(
                          Number(
                            movie.final_score || 0
                          ) * 100
                        )}
                        % Recommendation Match
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <button className="next-button">›</button>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

export default Mood;