
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./home.css";

import Sidebar from "../../components/Sidebar";
import Topbar from "../../components/Topbar";

function Home() {
  const navigate = useNavigate();

  const API_URL =
    import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // =========================================================
  // FETCH MOVIES FROM DJANGO
  // =========================================================

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        setLoading(true);
        setError("");

        // IMPORTANT:
        // Use the lightweight popular endpoint instead of
        // /api/movies/ because /api/movies/ returns thousands
        // of movies and makes the Home page slow.

        const response = await fetch(
          `${API_URL}/api/movies/popular/`
        );

        if (!response.ok) {
          throw new Error("Could not load movies.");
        }

        const data = await response.json();

        console.log("Popular Movies API response:", data);

        // Django may return:
        // 1. an array
        // 2. { movies: [...] }
        // 3. { results: [...] }
        // 4. { popular_movies: [...] }

        let movieList = [];

        if (Array.isArray(data)) {
          movieList = data;
        } else if (Array.isArray(data.movies)) {
          movieList = data.movies;
        } else if (Array.isArray(data.results)) {
          movieList = data.results;
        } else if (Array.isArray(data.popular_movies)) {
          movieList = data.popular_movies;
        }

        setMovies(movieList);
      } catch (error) {
        console.error("Movie loading error:", error);

        setError(
          "Could not load movies from the server."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, [API_URL]);

  // =========================================================
  // FORMAT GENRES
  // =========================================================

  const formatGenres = (genres) => {
    if (!genres) {
      return "Movie";
    }

    if (Array.isArray(genres)) {
      return genres
        .slice(0, 2)
        .join(" • ");
    }

    return String(genres)
      .split("|")
      .slice(0, 2)
      .join(" • ");
  };

  // =========================================================
  // GET RATING
  // =========================================================

  const getRating = (movie) => {
    const rating =
      movie.average_rating ??
      movie.avg_rating ??
      movie.rating ??
      movie.vote_average;

    if (
      rating === undefined ||
      rating === null
    ) {
      return "N/A";
    }

    const numericRating = Number(rating);

    if (Number.isNaN(numericRating)) {
      return "N/A";
    }

    return numericRating.toFixed(1);
  };

  // =========================================================
  // GET POSTER
  // =========================================================

  const getPoster = (movie) => {
    // Django already provides poster_url
    if (movie.poster_url) {
      return movie.poster_url;
    }

    // Other possible poster fields
    if (movie.poster) {
      return movie.poster;
    }

    // TMDB poster path
    if (movie.poster_path) {
      if (
        String(movie.poster_path).startsWith("http")
      ) {
        return movie.poster_path;
      }

      return `https://image.tmdb.org/t/p/w500${movie.poster_path}`;
    }

    // Fallback
    return "/movies/default.jpg";
  };

  // =========================================================
  // RECOMMENDED MOVIES
  // =========================================================

  // Since this Home page does not have a selected mood yet,
  // we use the first 6 high-rated movies returned by Django.
  const recommendedMovies = [...movies]
    .sort((a, b) => {
      const ratingA = Number(
        a.average_rating ??
        a.avg_rating ??
        a.rating ??
        a.vote_average ??
        0
      );

      const ratingB = Number(
        b.average_rating ??
        b.avg_rating ??
        b.rating ??
        b.vote_average ??
        0
      );

      return ratingB - ratingA;
    })
    .slice(0, 6);

  // =========================================================
  // POPULAR MOVIES
  // =========================================================

  const popularMovies = movies
    .slice(0, 6);

  // =========================================================
  // MOVIE CLICK
  // =========================================================

  const openMovie = (movie) => {
    const movieId =
      movie.movie_id ??
      movie.movieId ??
      movie.id;

    if (!movieId) {
      console.error(
        "Movie ID not found:",
        movie
      );
      return;
    }

    navigate(`/movie/${movieId}`);
  };

  // =========================================================
  // RENDER
  // =========================================================

  return (
    <div className="moodflix">

      {/* ================= SIDEBAR ================= */}

      <Sidebar />

      {/* ================= MAIN CONTENT ================= */}

      <main className="main-content">

        {/* ================= TOPBAR ================= */}

        <Topbar />

        {/* ================= HERO ================= */}

        <section className="hero-section">

          <div className="hero-overlay"></div>

          <div className="hero-content">

            <h1>
              How are you{" "}
              <span>feeling</span> today? 😊
            </h1>

            <p>
              Select your mood to receive{" "}
              <strong>AI-powered</strong>
              <br />
              movie recommendations.
            </p>

            <button
              className="choose-mood-button"
              onClick={() =>
                navigate("/mood")
              }
            >
              ☻ &nbsp; Choose Your Mood
            </button>

          </div>

        </section>

        {/* ================= QUICK MOOD ================= */}

        <section className="quick-mood">

          <h3>
            Quick Mood Selection
          </h3>

          <div className="mood-list">

            <button
              className="mood happy"
              onClick={() =>
                navigate("/mood")
              }
            >
              😊 &nbsp; Happy
            </button>

            <button
              className="mood sad"
              onClick={() =>
                navigate("/mood")
              }
            >
              😢 &nbsp; Sad
            </button>

            <button
              className="mood relaxed"
              onClick={() =>
                navigate("/mood")
              }
            >
              😌 &nbsp; Relaxed
            </button>

            <button
              className="mood excited"
              onClick={() =>
                navigate("/mood")
              }
            >
              🤩 &nbsp; Excited
            </button>

            <button
              className="mood romantic"
              onClick={() =>
                navigate("/mood")
              }
            >
              ❤️ &nbsp; Romantic
            </button>

            <button
              className="mood stressed"
              onClick={() =>
                navigate("/mood")
              }
            >
              😰 &nbsp; Stressed
            </button>

          </div>

        </section>

        {/* =================================================
            RECOMMENDED FOR YOU
            ================================================= */}

        <section className="movie-section">

          <div className="section-title">

            <h2>
              Recommended for You
            </h2>

            <button
              className="view-all"
              onClick={() =>
                navigate("/mood")
              }
            >
              View all &nbsp; ›
            </button>

          </div>

          {/* ================= LOADING ================= */}

          {loading && (
            <p className="movie-status">
              Loading movies...
            </p>
          )}

          {/* ================= ERROR ================= */}

          {error && (
            <p className="movie-status error">
              {error}
            </p>
          )}

          {/* ================= EMPTY ================= */}

          {!loading &&
            !error &&
            recommendedMovies.length === 0 && (
              <p className="movie-status">
                No movies available.
              </p>
            )}

          {/* ================= MOVIES ================= */}

          {!loading &&
            !error &&
            recommendedMovies.length > 0 && (

              <div className="movie-row">

                {recommendedMovies.map(
                  (movie, index) => (

                    <div
                      className="movie-card"
                      key={
                        movie.movie_id ??
                        movie.movieId ??
                        movie.id ??
                        index
                      }
                      onClick={() =>
                        openMovie(movie)
                      }
                      style={{
                        cursor: "pointer",
                      }}
                    >

                      {/* POSTER */}

                      <div className="poster">

                        <img
                          src={getPoster(movie)}
                          alt={
                            movie.title ||
                            "Movie poster"
                          }
                          onError={(
                            event
                          ) => {
                            event.currentTarget.src =
                              "/movies/default.jpg";
                          }}
                        />

                      </div>

                      {/* MOVIE DETAILS */}

                      <div className="movie-details">

                        <h3>
                          {movie.title ||
                            "Untitled Movie"}
                        </h3>

                        <div className="movie-bottom">

                          <span>
                            {formatGenres(
                              movie.genres
                            )}
                          </span>

                          <strong>
                            ★{" "}
                            {getRating(movie)}
                          </strong>

                        </div>

                      </div>

                    </div>

                  )
                )}

                <button
                  className="next-button"
                  type="button"
                >
                  ›
                </button>

              </div>

            )}

        </section>

        {/* =================================================
            POPULAR MOVIES
            ================================================= */}

        <section className="movie-section popular-section">

          <div className="section-title">

            <h2>
              Popular Movies
            </h2>

            <button
              className="view-all"
              onClick={() =>
                navigate("/search?q=popular")
              }
            >
              View all &nbsp; ›
            </button>

          </div>

          {/* ================= LOADING ================= */}

          {loading && (
            <p className="movie-status">
              Loading movies...
            </p>
          )}

          {/* ================= ERROR ================= */}

          {error && (
            <p className="movie-status error">
              {error}
            </p>
          )}

          {/* ================= MOVIES ================= */}

          {!loading &&
            !error &&
            popularMovies.length > 0 && (

              <div className="movie-row">

                {popularMovies.map(
                  (movie, index) => (

                    <div
                      className="popular-card"
                      key={
                        movie.movie_id ??
                        movie.movieId ??
                        movie.id ??
                        index
                      }
                      onClick={() =>
                        openMovie(movie)
                      }
                      style={{
                        cursor: "pointer",
                      }}
                    >

                      <img
                        src={getPoster(movie)}
                        alt={
                          movie.title ||
                          "Movie poster"
                        }
                        onError={(
                          event
                        ) => {
                          event.currentTarget.src =
                            "/movies/default.jpg";
                        }}
                      />

                    </div>

                  )
                )}

                <button
                  className="next-button"
                  type="button"
                >
                  ›
                </button>

              </div>

            )}

          {!loading &&
            !error &&
            popularMovies.length === 0 && (
              <p className="movie-status">
                No popular movies available.
              </p>
            )}

        </section>

      </main>

    </div>
  );
}

export default Home;
