import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import "./home.css";

import Sidebar from "../../components/Sidebar";
import Topbar from "../../components/Topbar";
 

/* =========================================================
   LOADING SPINNER
========================================================= */

function LoadingSpinner({ size = 38, strokeWidth = 4 }) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      aria-label="Loading"
      role="status"
    >
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke="#ebe5ff"
        strokeWidth={strokeWidth}
      />

      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke="#6c2ee8"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeDasharray={`${circumference * 0.25} ${
          circumference * 0.75
        }`}
      >
        <animateTransform
          attributeName="transform"
          type="rotate"
          from={`0 ${size / 2} ${size / 2}`}
          to={`360 ${size / 2} ${size / 2}`}
          dur="0.8s"
          repeatCount="indefinite"
        />
      </circle>
    </svg>
  );
}


/* =========================================================
   LOADING DISPLAY
========================================================= */

function MovieLoading({ text }) {
  return (
    <div
      style={{
        minHeight: "170px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: "10px",
        textAlign: "center",
      }}
    >
      <LoadingSpinner />

      <span
        style={{
          fontSize: "12px",
          fontWeight: 600,
          color: "#737b91",
        }}
      >
        {text}
      </span>
    </div>
  );
}


/* =========================================================
   HOME
========================================================= */

function Home() {
  const navigate = useNavigate();

  const API_URL =
    import.meta.env.VITE_API_URL ||
    "http://127.0.0.1:8000";

  const [movies, setMovies] = useState([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");


  /* =========================================================
     FETCH MODERN POPULAR MOVIES FROM DJANGO
  ========================================================= */

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        setLoading(true);

        setError("");

        const response = await fetch(
          `${API_URL}/api/movies/popular/`
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.error ||
              "Could not load movies."
          );
        }

        console.log(
          "Popular Movies API response:",
          data
        );

        let movieList = [];

        if (Array.isArray(data)) {
          movieList = data;
        } else if (
          Array.isArray(data.movies)
        ) {
          movieList = data.movies;
        } else if (
          Array.isArray(data.results)
        ) {
          movieList = data.results;
        } else if (
          Array.isArray(data.popular_movies)
        ) {
          movieList =
            data.popular_movies;
        }

        setMovies(movieList);
      } catch (error) {
        console.error(
          "Movie loading error:",
          error
        );

        setError(
          "Could not load movies from the server."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, [API_URL]);


  /* =========================================================
     FORMAT GENRES
  ========================================================= */

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


  /* =========================================================
     GET NUMERIC RATING
  ========================================================= */

  const getNumericRating = (movie) => {
    const rating =
      movie.average_rating ??
      movie.avg_rating ??
      movie.rating ??
      movie.vote_average ??
      0;

    const numericRating =
      Number(rating);

    if (
      Number.isNaN(numericRating)
    ) {
      return 0;
    }

    return numericRating;
  };


  /* =========================================================
     DISPLAY RATING
  ========================================================= */

  const getRating = (movie) => {
    const rating =
      getNumericRating(movie);

    if (!rating) {
      return "N/A";
    }

    return rating.toFixed(1);
  };


  /* =========================================================
     GET POSTER
  ========================================================= */

  const getPoster = (movie) => {
    if (movie.poster_url) {
      return movie.poster_url;
    }

    if (movie.poster) {
      return movie.poster;
    }

    if (movie.poster_path) {
      if (
        String(
          movie.poster_path
        ).startsWith("http")
      ) {
        return movie.poster_path;
      }

      return `https://image.tmdb.org/t/p/w500${movie.poster_path}`;
    }

    return "/movies/default.jpg";
  };


  /* =========================================================
     GET MOVIE YEAR
  ========================================================= */

  const getMovieYear = (movie) => {
    if (movie.year) {
      const year =
        Number(movie.year);

      if (!Number.isNaN(year)) {
        return year;
      }
    }

    if (movie.release_date) {
      const year =
        Number(
          String(
            movie.release_date
          ).slice(0, 4)
        );

      if (!Number.isNaN(year)) {
        return year;
      }
    }

    const title =
      movie.title || "";

    const match =
      title.match(
        /\((\d{4})\)\s*$/
      );

    if (match) {
      return Number(match[1]);
    }

    return 0;
  };


  /* =========================================================
     MODERN MOVIES
     2016 AND NEWER
  ========================================================= */

  const modernMovies =
    movies.filter(
      (movie) =>
        getMovieYear(movie) >= 2016
    );


  /* =========================================================
     RECOMMENDED MOVIES
  ========================================================= */

  const recommendedMovies =
    [...modernMovies]
      .sort(
        (a, b) =>
          getNumericRating(b) -
          getNumericRating(a)
      )
      .slice(0, 6);


  /* =========================================================
     POPULAR MOVIES
  ========================================================= */

  const popularMovies =
    [...modernMovies]
      .sort((a, b) => {
        const yearDifference =
          getMovieYear(b) -
          getMovieYear(a);

        if (
          yearDifference !== 0
        ) {
          return yearDifference;
        }

        return (
          getNumericRating(b) -
          getNumericRating(a)
        );
      })
      .slice(0, 6);


  /* =========================================================
     MOVIE CLICK
  ========================================================= */

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

    navigate(
      `/movie/${movieId}`
    );
  };


  /* =========================================================
     MOVIE CARD
  ========================================================= */

  const renderMovieCard = (
    movie,
    index
  ) => (
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
    >

      <div className="poster">

        <img
          src={getPoster(movie)}
          alt={
            movie.title ||
            "Movie poster"
          }
          onError={(event) => {
            event.currentTarget.src =
              "/movies/default.jpg";
          }}
        />

      </div>

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
            ★ {getRating(movie)}
          </strong>

        </div>

      </div>

    </div>
  );


  /* =========================================================
     RENDER
  ========================================================= */

  return (
    <div className="moodflix">

      <Sidebar />

      <main className="main-content">

        <Topbar />


        {/* =================================================
            HERO
        ================================================= */}

        <section className="hero-section">

          <div className="hero-overlay"></div>

          <div className="hero-content">

            <h1>
              How are you{" "}
              <span>feeling</span>{" "}
              today? 😊
            </h1>

            <p>
              Select your mood to receive{" "}
              <strong>
                AI-powered
              </strong>

              <br />

              movie recommendations.
            </p>

            <button
              type="button"
              className="choose-mood-button"
              onClick={() =>
                navigate("/mood")
              }
            >
              ☻ &nbsp; Choose Your Mood
            </button>

          </div>

        </section>


        {/* =================================================
            QUICK MOOD
        ================================================= */}

        <section className="quick-mood">

          <h3>
            Quick Mood Selection
          </h3>

          <div className="mood-list">

            <button
              type="button"
              className="mood happy"
              onClick={() =>
                navigate("/mood")
              }
            >
              😊 &nbsp; Happy
            </button>

            <button
              type="button"
              className="mood sad"
              onClick={() =>
                navigate("/mood")
              }
            >
              😢 &nbsp; Sad
            </button>

            <button
              type="button"
              className="mood relaxed"
              onClick={() =>
                navigate("/mood")
              }
            >
              😌 &nbsp; Relaxed
            </button>

            <button
              type="button"
              className="mood excited"
              onClick={() =>
                navigate("/mood")
              }
            >
              🤩 &nbsp; Excited
            </button>

            <button
              type="button"
              className="mood romantic"
              onClick={() =>
                navigate("/mood")
              }
            >
              ❤️ &nbsp; Romantic
            </button>

            <button
              type="button"
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
              type="button"
              className="view-all"
              onClick={() =>
                navigate("/mood")
              }
            >
              View all &nbsp; ›
            </button>

          </div>


          {/* LOADING */}

          {loading && (
            <MovieLoading text="Loading recommendations..." />
          )}


          {/* ERROR */}

          {error && (
            <p className="movie-status error">
              {error}
            </p>
          )}


          {/* EMPTY */}

          {!loading &&
            !error &&
            recommendedMovies.length ===
              0 && (

              <p className="movie-status">
                No modern movies available.
              </p>

            )}


          {/* MOVIES */}

          {!loading &&
            !error &&
            recommendedMovies.length >
              0 && (

              <div className="movie-row">

                {recommendedMovies.map(
                  renderMovieCard
                )}

                <button
                  type="button"
                  className="next-button"
                >
                  ›
                </button>

              </div>

            )}

        </section>


        {/* =================================================
            POPULAR MOVIES
        ================================================= */}

        <section
          className="movie-section popular-section"
        >

          <div className="section-title">

            <h2>
              Popular Movies
            </h2>

            <button
              type="button"
              className="view-all"
              onClick={() =>
                navigate(
                  "/search?q=popular"
                )
              }
            >
              View all &nbsp; ›
            </button>

          </div>


          {/* LOADING */}

          {loading && (
            <MovieLoading text="Loading popular movies..." />
          )}


          {/* ERROR */}

          {error && (
            <p className="movie-status error">
              {error}
            </p>
          )}


          {/* EMPTY */}

          {!loading &&
            !error &&
            popularMovies.length ===
              0 && (

              <p className="movie-status">
                No modern popular movies available.
              </p>

            )}


          {/* MOVIES */}

          {!loading &&
            !error &&
            popularMovies.length >
              0 && (

              <div className="movie-row">

                {popularMovies.map(
                  renderMovieCard
                )}

                <button
                  type="button"
                  className="next-button"
                >
                  ›
                </button>

              </div>

            )}

        </section>

      </main>

    </div>
  );
}

export default Home;