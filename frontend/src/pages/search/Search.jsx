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

  const query = new URLSearchParams(location.search).get("q") || "";

  useEffect(() => {
    const fetchMovies = async () => {
      if (!query.trim()) {
        setMovies([]);
        return;
      }

      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/api/movies/?search=${encodeURIComponent(query)}`
        );

        if (!response.ok) {
          throw new Error("Unable to search movies.");
        }

        const data = await response.json();

        setMovies(Array.isArray(data) ? data : data.movies || []);

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

  return (
    <div className="app">

      <Sidebar />

      <main className="main">

        <Topbar />

        <section className="search-page">

          <div className="search-results-header">
            <h1>Search Results</h1>

            <p>
              Results for <strong>"{query}"</strong>
            </p>
          </div>

          {loading && (
            <div className="search-loading">
              Searching movies...
            </div>
          )}

          {error && (
            <div className="search-error">
              {error}
            </div>
          )}

          {!loading && !error && movies.length === 0 && (
            <div className="no-search-results">
              No movies found for "{query}".
            </div>
          )}

          {!loading && movies.length > 0 && (
            <div className="search-movie-grid">

              {movies.slice(0, 10).map((movie) => (

                <div
                    key={movie.movie_id || movie.movieId}
                    className="search-movie-card"
                    onClick={() =>
                        navigate(`/movie/${movie.movie_id || movie.movieId}`)
                    }
                    >

                    <div className="search-poster">

                        {movie.poster_url ? (
                        <img
                            src={movie.poster_url}
                            alt={`${movie.title} poster`}
                            loading="lazy"
                        />
                        ) : (
                        <div className="search-poster-placeholder">
                            🎬
                        </div>
                        )}

                    </div>

                    <div className="search-movie-info">

                        <h3>{movie.title}</h3>

                        <p>
                        {movie.genres
                            ? movie.genres.split("|").join(" • ")
                            : "No genre"}
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