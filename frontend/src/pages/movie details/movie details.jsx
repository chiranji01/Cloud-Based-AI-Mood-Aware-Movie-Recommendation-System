import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom"; // useNavigate lets the user open another recommended movie
import { Bell, Search, ChevronDown, ChevronRight, Play, Plus, Star, Send, ArrowLeft, Check } from "lucide-react";

import "./movie details.css";
import Sidebar from "../../components/Sidebar";

function MovieDetail() {
  // Get movie ID from URL
  const { id } = useParams();
  const navigate = useNavigate(); // Navigate to another movie details page

  // Store movie details returned by Django
  const [movie, setMovie] = useState(null);
  const [loadingMovie, setLoadingMovie] = useState(true);
  const [movieError, setMovieError] = useState("");

  // Store similar movies returned by backend
  const [similarMovies, setSimilarMovies] = useState([]);
  // Track when similar movies are loading
  const [loadingSimilarMovies, setLoadingSimilarMovies] = useState(true);

  // Rating/watchlist
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [watchlisted, setWatchlisted] = useState(false);
  const [review, setReview] = useState("");

  // =========================================================
  // FETCH MOVIE DETAILS
  // =========================================================

  useEffect(() => {
    const fetchMovieDetails = async () => {
      try {
        setLoadingMovie(true);
        setMovieError("");

        // Fetch selected movie details from Django
        const response = await fetch(`http://127.0.0.1:8000/api/movies/${id}/`);

        if (!response.ok) {
          throw new Error("Unable to load movie details.");
        }

        const data = await response.json();

        console.log("Movie details:", data);

        // Update page only when new movie data is ready
        setMovie(data);

      } catch (error) {
        console.error("Movie details API error:", error);
        setMovieError(error.message || "Could not load movie details.");

      } finally {
        setLoadingMovie(false);
      }
    };

    // =========================================================
    // FETCH SIMILAR MOVIES FROM DJANGO API
    // =========================================================

    const fetchSimilarMovies = async () => {
      try {
        setLoadingSimilarMovies(true);

        const response = await fetch(`http://127.0.0.1:8000/api/movies/${id}/similar/`);

        if (!response.ok) {
          throw new Error("Unable to load similar movies.");
        }

        const data = await response.json();

        console.log("Similar movies:", data);

        setSimilarMovies(data.recommendations || []);

      } catch (error) {
        console.error("Similar movies API error:", error);
        setSimilarMovies([]);

      } finally {
        setLoadingSimilarMovies(false);
      }
    };

    fetchMovieDetails();
    fetchSimilarMovies(); // Load similar movies whenever selected movie changes

    // Reset user selections when another movie is opened
    setRating(0);
    setHoverRating(0);
    setWatchlisted(false);
    setReview("");

  }, [id]);

  // Rating
  const handleRating = (value) => {
    setRating(value);
  };

  // =========================================================
  // USER-FRIENDLY INITIAL LOADING SKELETON
  // =========================================================

  if (loadingMovie && !movie) {
    return (
      <div className="movie-detail-page">
        <Sidebar />

        <main className="movie-main">

          {/* TOP BAR */}

          <header className="movie-topbar">
            <div className="movie-search">
              <Search size={16} />
              <input type="text" placeholder="Search movies by title, genre, actor..." />
            </div>

            <div className="movie-user">
              <div className="movie-notification">
                <Bell size={19} />
                <span>3</span>
              </div>

              <div className="movie-profile">
                <div className="movie-avatar">C</div>
                <strong>User</strong>
                <ChevronDown size={13} />
              </div>
            </div>
          </header>

          {/* LOADING CONTENT */}

          <div className="movie-content">

            <button className="back-home" onClick={() => window.history.back()}>
              <ArrowLeft size={12} />
              Back
            </button>

            <section className="movie-information">

              {/* Poster skeleton */}

              <div className="main-movie-poster skeleton-box"></div>

              {/* Movie information skeleton */}

              <div className="movie-details">

                <div className="skeleton-line skeleton-title"></div>

                <div className="skeleton-tags">
                  <div className="skeleton-small"></div>
                  <div className="skeleton-small"></div>
                  <div className="skeleton-small"></div>
                </div>

                <div className="skeleton-line skeleton-description"></div>
                <div className="skeleton-line skeleton-description"></div>
                <div className="skeleton-line skeleton-description short"></div>

                <div className="movie-info-list">

                  <div>
                    <span>Director</span>
                    <div className="skeleton-line skeleton-info"></div>
                  </div>

                  <div>
                    <span>Writers</span>
                    <div className="skeleton-line skeleton-info"></div>
                  </div>

                  <div>
                    <span>Stars</span>
                    <div className="skeleton-line skeleton-info"></div>
                  </div>

                  <div>
                    <span>Release Date</span>
                    <div className="skeleton-line skeleton-info"></div>
                  </div>

                </div>

                <div className="skeleton-buttons">
                  <div className="skeleton-button"></div>
                  <div className="skeleton-button"></div>
                </div>

              </div>

            </section>

          </div>

        </main>
      </div>
    );
  }

  // =========================================================
  // ERROR
  // =========================================================

  if (movieError && !movie) {
    return (
      <div className="movie-detail-page">
        <Sidebar />

        <main className="movie-main">

          <header className="movie-topbar">
            <div className="movie-search">
              <Search size={16} />
              <input type="text" placeholder="Search movies by title, genre, actor..." />
            </div>
          </header>

          <div className="movie-content">

            <div className="movie-error-box">
              <span className="movie-error-icon">🎬</span>

              <h2>Unable to load this movie</h2>

              <p>Please check your connection and try again.</p>

              <button onClick={() => window.location.reload()}>
                Try Again
              </button>

              <button onClick={() => window.history.back()}>
                Go Back
              </button>
            </div>

          </div>

        </main>
      </div>
    );
  }

  if (!movie) {
    return null;
  }

  // =========================================================
  // DISPLAY MOVIE INFORMATION
  // =========================================================

  const extractedYear = movie.year || movie.title?.match(/\((\d{4})\)$/)?.[1] || "N/A";
  const displayTitle = movie.title?.replace(/\s*\(\d{4}\)$/, "") || "Unknown Movie";

  return (
    <div className="movie-detail-page">

      <Sidebar />

      <main className="movie-main">

        {/* ================= TOP BAR ================= */}

        <header className="movie-topbar">

          <div className="movie-search">
            <Search size={16} />
            <input type="text" placeholder="Search movies by title, genre, actor..." />
          </div>

          <div className="movie-user">

            <div className="movie-notification">
              <Bell size={19} />
              <span>3</span>
            </div>

            <div className="movie-profile">
              <div className="movie-avatar">C</div>
              <strong>User</strong>
              <ChevronDown size={13} />
            </div>

          </div>

        </header>

        {/* ================= CONTENT ================= */}

        <div className="movie-content">

          {/* ================= BACK ================= */}

          <button className="back-home" onClick={() => window.history.back()}>
            <ArrowLeft size={12} />
            Back
          </button>

          {/* ================= MOVIE INFORMATION ================= */}

          <section className="movie-information">

            {/* POSTER */}

            <div className="main-movie-poster">

              {movie.poster_url ? (
                <img
                  src={movie.poster_url}
                  alt={`${displayTitle} poster`}
                  onError={(event) => {
                    event.currentTarget.style.display = "none";
                  }}
                />
              ) : (
                <div className="movie-poster-fallback">🎬</div>
              )}

            </div>

            {/* ================= DETAILS ================= */}

            <div className="movie-details">

              <h1>{displayTitle}</h1>

              <div className="movie-meta">

                {/* RATING */}

                <span className="main-rating">
                  <Star size={13} fill="#ffae00" color="#ffae00" />

                  <strong>
                    {movie.average_rating != null ? `${Number(movie.average_rating).toFixed(1)}/5` : "N/A"}
                  </strong>

                  <small>({movie.rating_count ?? 0} ratings)</small>
                </span>

                {/* GENRES */}

                {movie.genres && movie.genres.split("|").map((genre) => (
                  <span className="detail-tag" key={genre}>
                    {genre}
                  </span>
                ))}

                {/* YEAR */}

                <span className="meta-text">{extractedYear}</span>

                {/* RUNTIME */}

                {movie.runtime && (
                  <>
                    <span className="meta-text">•</span>
                    <span className="meta-text">{movie.runtime}</span>
                  </>
                )}

                {/* CERTIFICATION */}

                {movie.certification && (
                  <span className="pg-tag">{movie.certification}</span>
                )}

              </div>

              {/* DESCRIPTION */}

              <p className="movie-description">
                {movie.description || movie.overview || "Movie description is not available."}
              </p>

              {/* MOVIE INFORMATION */}

              <div className="movie-info-list">

                <div>
                  <span>Director</span>
                  <strong>{movie.director || "Not available"}</strong>
                </div>

                <div>
                  <span>Writers</span>
                  <strong>{movie.writers || "Not available"}</strong>
                </div>

                <div>
                  <span>Stars</span>
                  <strong>{movie.stars || movie.cast || "Not available"}</strong>
                </div>

                <div>
                  <span>Release Date</span>
                  <strong>{movie.release_date || "Not available"}</strong>
                </div>

              </div>

              {/* ================= BUTTONS ================= */}

              <div className="movie-actions">

                {movie.imdb_url ? (
                  <button
                    className="details-button"
                    onClick={() => window.open(movie.imdb_url, "_blank", "noopener,noreferrer")}
                  >
                    <Play size={13} fill="white" />
                    View Details
                  </button>
                ) : (
                  <button className="details-button" disabled>
                    <Play size={13} />
                    Details Unavailable
                  </button>
                )}

                <button
                  className={`watchlist-button ${watchlisted ? "watchlisted" : ""}`}
                  onClick={() => setWatchlisted(!watchlisted)}
                >
                  {watchlisted ? <Check size={14} /> : <Plus size={14} />}
                  {watchlisted ? "Added to Watchlist" : "Add to Watchlist"}
                </button>

              </div>

            </div>

          </section>

          {/* ================= RATING ================= */}

          <section className="rate-section">

            <div className="rate-heading">
              <h2>Rate this movie</h2>
              <p>Share your rating to improve your recommendations.</p>
            </div>

            <div className="rating-area">

              <div className="big-stars">

                {[1, 2, 3, 4, 5].map((value) => (
                  <Star
                    key={value}
                    size={26}
                    className="rating-star"
                    fill={value <= (hoverRating || rating) ? "#ffae00" : "none"}
                    color={value <= (hoverRating || rating) ? "#ffae00" : "#d3d3df"}
                    onClick={() => handleRating(value)}
                    onMouseEnter={() => setHoverRating(value)}
                    onMouseLeave={() => setHoverRating(0)}
                  />
                ))}

              </div>

              <strong>{rating > 0 ? `${rating}/5` : "Select rating"}</strong>

            </div>

            {/* REVIEW */}

            <div className="review-row">

              <input
                type="text"
                placeholder="Add a review (optional)"
                value={review}
                onChange={(event) => setReview(event.target.value)}
              />

              <button className="submit-rating">
                <Send size={13} />
                Submit Rating
              </button>

            </div>

          </section>

          {/* ================= DYNAMIC YOU MIGHT ALSO LIKE ================= */}

          <section className="recommendation-section">

            <div className="recommendation-heading">

              <div>
                <h2>You might also like</h2>
                <p className="recommendation-subtitle">
                  Movies similar to {displayTitle}
                </p>
              </div>

              <button>
                View all
                <ChevronRight size={13} />
              </button>

            </div>

            <div className="movie-recommendations">

              {/* Display similar movies returned by Django */}

              {similarMovies.map((recommendedMovie) => {
                const recommendedTitle = recommendedMovie.title?.replace(/\s*\(\d{4}\)$/, "");
                const genres = recommendedMovie.genres?.split("|") || [];

                return (
                  <div
                    className="recommendation-card"
                    key={recommendedMovie.movieId}
                    onClick={() => navigate(`/movie/${recommendedMovie.movieId}`)}
                  >

                    {/* TMDb POSTER */}

                    <div className="recommendation-image">

                      {recommendedMovie.poster_url ? (
                        <img
                          src={recommendedMovie.poster_url}
                          alt={recommendedTitle}
                          onError={(event) => {
                            event.currentTarget.style.display = "none";
                            event.currentTarget.parentElement.classList.add("recommendation-fallback");
                          }}
                        />
                      ) : (
                        <div className="recommendation-fallback"></div>
                      )}

                    </div>

                    {/* MOVIE INFORMATION */}

                    <div className="recommendation-info">

                      <h3>{recommendedTitle}</h3>

                      <div className="recommendation-meta">

                        <span>{genres[0] || "Movie"}</span>

                        {genres[1] && (
                          <>
                            <span>•</span>
                            <span>{genres[1]}</span>
                          </>
                        )}

                        <span className="small-rating">
                          <Star size={9} fill="#ffae00" color="#ffae00" />

                          {recommendedMovie.average_rating != null
                            ? Number(recommendedMovie.average_rating).toFixed(1)
                            : "N/A"}
                        </span>

                      </div>

                    </div>

                  </div>
                );
              })}

                {similarMovies.length === 0 && !loadingSimilarMovies && (
                  <div className="no-recommendations">
                    No similar movies found.
                  </div>
                )}

              {similarMovies.length > 0 && (
                <button className="recommendation-next">
                  <ChevronRight size={17} />
                </button>
              )}

            </div>

          </section>

        </div>

      </main>

    </div>
  );
}

export default MovieDetail;