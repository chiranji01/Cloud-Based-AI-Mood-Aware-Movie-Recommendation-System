import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import Sidebar from "../../components/Sidebar";
import Topbar from "../../components/Topbar";

import "./Search.css";

function Search() {
  const location = useLocation();
  const navigate = useNavigate();

  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const query =
    new URLSearchParams(location.search).get("q") || "";

  // =========================================================
  // LOAD SEARCH RESULTS
  // =========================================================

  useEffect(() => {
    const fetchMovies = async () => {
      if (!query.trim()) {
        setMovies([]);
        setError("");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/api/movies/?search=${encodeURIComponent(
            query
          )}`
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.error || "Unable to search movies."
          );
        }

        const movieList = Array.isArray(data)
          ? data
          : Array.isArray(data.movies)
          ? data.movies
          : [];

        setMovies(movieList);
      } catch (err) {
        console.error("Search error:", err);

        setMovies([]);
        setError("Could not load search results.");
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, [query]);

  // =========================================================
  // OPEN MOVIE
  // =========================================================

  const openMovie = (movie) => {
    const movieId =
      movie.movie_id ??
      movie.movieId ??
      movie.id;

    if (!movieId) {
      console.error("Movie ID not found:", movie);
      return;
    }

    navigate(`/movie/${movieId}`);
  };

  // =========================================================
  // FORMAT GENRES
  // =========================================================

  const formatGenres = (genres) => {
    if (!genres) {
      return "No genre";
    }

    if (Array.isArray(genres)) {
      return genres.join(" • ");
    }

    return String(genres)
      .split("|")
      .join(" • ");
  };

  // =========================================================
  // RENDER
  // =========================================================

  return (
    <div className="app">

      <Sidebar />

      <main className="main">

        <Topbar />

        <section className="search-page">

          {/* ================= HEADER ================= */}

          <div className="search-results-header">

            <h1>
              Search Results
            </h1>

            <p>
              Results for{" "}
              <strong>
                "{query}"
              </strong>
            </p>

          </div>

          {/* ================= LOADING ================= */}

          {loading && (
            <div className="search-loading">
              Searching movies...
            </div>
          )}

          {/* ================= ERROR ================= */}

          {error && (
            <div className="search-error">
              {error}
            </div>
          )}

          {/* ================= EMPTY ================= */}

          {!loading &&
            !error &&
            movies.length === 0 && (
              <div className="no-search-results">
                No movies found for "{query}".
              </div>
            )}

          {/* ================= RESULTS ================= */}

          {!loading &&
            !error &&
            movies.length > 0 && (

              <div className="search-movie-grid">

                {movies
                  .slice(0, 10)
                  .map((movie, index) => (

                    <div
                      key={
                        movie.movie_id ??
                        movie.movieId ??
                        movie.id ??
                        index
                      }
                      className="search-movie-card"
                      onClick={() =>
                        openMovie(movie)
                      }
                    >

                      {/* POSTER */}

                      <div className="search-poster">

                        {movie.poster_url ? (

                          <img
                            src={movie.poster_url}
                            alt={`${movie.title} poster`}
                            loading="lazy"
                            onError={(event) => {
                              event.currentTarget.src =
                                "/movies/default.jpg";
                            }}
                          />

                        ) : (

                          <div className="search-poster-placeholder">
                            🎬
                          </div>

                        )}

                      </div>

                      {/* MOVIE INFO */}

                      <div className="search-movie-info">

                        <h3>
                          {movie.title ||
                            "Untitled Movie"}
                        </h3>

                        <p>
                          {formatGenres(
                            movie.genres
                          )}
                        </p>

                      </div>

                    </div>

                  ))}

              </div>

            )}

        </section>
 
      </main>

    </div>
  );
}

export default Search;