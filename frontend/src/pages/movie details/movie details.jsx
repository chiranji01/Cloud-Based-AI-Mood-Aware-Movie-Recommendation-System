
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

import {
  ChevronRight,
  Play,
  Plus,
  Star,
  Send,
  ArrowLeft,
  Check,
} from "lucide-react";

import "./movie details.css";

import Sidebar from "../../components/Sidebar";
import Topbar from "../../components/Topbar";

function MovieDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  // =========================================================
  // MOVIE
  // =========================================================

  const [movie, setMovie] = useState(null);
  const [loadingMovie, setLoadingMovie] = useState(true);
  const [movieError, setMovieError] = useState("");

  // =========================================================
  // SIMILAR MOVIES
  // =========================================================

  const [similarMovies, setSimilarMovies] = useState([]);
  const [loadingSimilarMovies, setLoadingSimilarMovies] =
    useState(true);

  // =========================================================
  // RATING
  // =========================================================

  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);

  // =========================================================
  // WATCHLIST / REVIEW
  // =========================================================

  const [watchlisted, setWatchlisted] = useState(false);
  const [review, setReview] = useState("");

  // =========================================================
  // RATING SUBMISSION
  // =========================================================

  const [submittingRating, setSubmittingRating] =
    useState(false);

  // =========================================================
  // FETCH MOVIE DETAILS
  // =========================================================

  useEffect(() => {
    const fetchMovieDetails = async () => {
      try {
        setLoadingMovie(true);
        setMovieError("");

        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/api/movies/${id}/`
        );

        const data = await response.json();

        console.log("Movie details:", data);

        if (!response.ok) {
          throw new Error(
            data.error || "Unable to load movie details."
          );
        }

        setMovie(data);
      } catch (error) {
        console.error(
          "Movie details API error:",
          error
        );

        setMovieError(
          error.message ||
            "Could not load movie details."
        );
      } finally {
        setLoadingMovie(false);
      }
    };

    // =======================================================
    // FETCH SIMILAR MOVIES
    // =======================================================

    const fetchSimilarMovies = async () => {
      try {
        setLoadingSimilarMovies(true);

        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/api/movies/${id}/similar/`
        );

        const data = await response.json();

        console.log("Similar movies:", data);

        if (!response.ok) {
          throw new Error(
            data.error ||
              "Unable to load similar movies."
          );
        }

        setSimilarMovies(
          Array.isArray(data.recommendations)
            ? data.recommendations
            : []
        );
      } catch (error) {
        console.error(
          "Similar movies API error:",
          error
        );

        setSimilarMovies([]);
      } finally {
        setLoadingSimilarMovies(false);
      }
    };

    fetchMovieDetails();
    fetchSimilarMovies();

    // Reset selections when another movie opens
    setRating(0);
    setHoverRating(0);
    setWatchlisted(false);
    setReview("");
    setSubmittingRating(false);
  }, [id]);

  // =========================================================
  // SELECT RATING
  // =========================================================

  const handleRating = (value) => {
    setRating(value);
  };

  // =========================================================
  // SUBMIT RATING
  // =========================================================

  const handleSubmitRating = async () => {
    // -------------------------------------------------------
    // CHECK LOGIN
    // -------------------------------------------------------

    let loggedInUser = null;

    try {
      const savedUser = localStorage.getItem("user");

      if (savedUser) {
        loggedInUser = JSON.parse(savedUser);
      }
    } catch (error) {
      console.error(
        "Error reading logged-in user:",
        error
      );
    }

    if (!loggedInUser?.id) {
      alert("Please log in before submitting a rating.");
      navigate("/login");
      return;
    }

    // -------------------------------------------------------
    // CHECK RATING
    // -------------------------------------------------------

    if (rating <= 0) {
      alert("Please select a rating before submitting.");
      return;
    }

    // -------------------------------------------------------
    // CHECK MOVIE
    // -------------------------------------------------------

    if (!id) {
      alert("Movie ID is missing.");
      return;
    }

    try {
      setSubmittingRating(true);

      const numericRating = Number(rating);

      console.log("Submitting rating:", {
        user_id: loggedInUser.id,
        movie_id: Number(id),
        rating: numericRating,
      });

      // -----------------------------------------------------
      // SEND RATING TO DJANGO
      // -----------------------------------------------------

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/ratings/`,
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            user_id: loggedInUser.id,
            movie_id: Number(id),
            rating: numericRating,
          }),
        }
      );

      const data = await response.json();

      console.log("Rating submission response:", data);

      // -----------------------------------------------------
      // HANDLE ERROR
      // -----------------------------------------------------

      if (!response.ok) {
        throw new Error(
          data.error ||
            data.message ||
            "Failed to submit rating."
        );
      }

      // -----------------------------------------------------
      // SUCCESS
      // -----------------------------------------------------

      alert(
        data.message ||
          "Rating submitted successfully!"
      );

      // -----------------------------------------------------
      // GO TO MY RATINGS
      // -----------------------------------------------------

      navigate("/ratings");
    } catch (error) {
      console.error(
        "Submit rating error:",
        error
      );

      alert(
        error.message ||
          "Could not submit your rating. Please try again."
      );
    } finally {
      setSubmittingRating(false);
    }
  };

  // =========================================================
  // INITIAL LOADING
  // =========================================================

  if (loadingMovie && !movie) {
    return (
      <div className="movie-detail-page">
        <Sidebar />

        <main className="movie-main">
          <Topbar />

          <div className="movie-content">
            <button
              className="back-home"
              onClick={() => window.history.back()}
            >
              <ArrowLeft size={12} />
              Back
            </button>

            <section className="movie-information">
              <div className="main-movie-poster skeleton-box"></div>

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
          <Topbar />

          <div className="movie-content">
            <div className="movie-error-box">
              <span className="movie-error-icon">
                🎬
              </span>

              <h2>Unable to load this movie</h2>

              <p>
                Please check your connection and try again.
              </p>

              <button
                onClick={() =>
                  window.location.reload()
                }
              >
                Try Again
              </button>

              <button
                onClick={() =>
                  window.history.back()
                }
              >
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
  // MOVIE DISPLAY DATA
  // =========================================================

  const extractedYear =
    movie.year ||
    movie.title?.match(/\((\d{4})\)$/)?.[1] ||
    "N/A";

  const displayTitle =
    movie.title?.replace(/\s*\(\d{4}\)$/, "") ||
    "Unknown Movie";

  // =========================================================
  // PAGE
  // =========================================================

  return (
    <div className="movie-detail-page">
      <Sidebar />

      <main className="movie-main">
        <Topbar />

        <div className="movie-content">
          {/* ================= BACK ================= */}

          <button
            className="back-home"
            onClick={() => window.history.back()}
          >
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
                    event.currentTarget.style.display =
                      "none";
                  }}
                />
              ) : (
                <div className="movie-poster-fallback">
                  🎬
                </div>
              )}
            </div>

            {/* DETAILS */}

            <div className="movie-details">
              <h1>{displayTitle}</h1>

              <div className="movie-meta">
                {/* RATING */}

                <span className="main-rating">
                  <Star
                    size={13}
                    fill="#ffae00"
                    color="#ffae00"
                  />

                  <strong>
                    {movie.average_rating != null
                      ? `${Number(
                          movie.average_rating
                        ).toFixed(1)}/5`
                      : "N/A"}
                  </strong>

                  <small>
                    ({movie.rating_count ?? 0} ratings)
                  </small>
                </span>

                {/* GENRES */}

                {movie.genres &&
                  movie.genres
                    .split("|")
                    .map((genre) => (
                      <span
                        className="detail-tag"
                        key={genre}
                      >
                        {genre}
                      </span>
                    ))}

                {/* YEAR */}

                <span className="meta-text">
                  {extractedYear}
                </span>

                {/* RUNTIME */}

                {movie.runtime && (
                  <>
                    <span className="meta-text">
                      •
                    </span>

                    <span className="meta-text">
                      {movie.runtime}
                    </span>
                  </>
                )}

                {/* CERTIFICATION */}

                {movie.certification && (
                  <span className="pg-tag">
                    {movie.certification}
                  </span>
                )}
              </div>

              {/* DESCRIPTION */}

              <p className="movie-description">
                {movie.description ||
                  movie.overview ||
                  "Movie description is not available."}
              </p>

              {/* MOVIE INFORMATION */}

              <div className="movie-info-list">
                <div>
                  <span>Director</span>

                  <strong>
                    {movie.director ||
                      "Not available"}
                  </strong>
                </div>

                <div>
                  <span>Writers</span>

                  <strong>
                    {movie.writers ||
                      "Not available"}
                  </strong>
                </div>

                <div>
                  <span>Stars</span>

                  <strong>
                    {movie.stars ||
                      movie.cast ||
                      "Not available"}
                  </strong>
                </div>

                <div>
                  <span>Release Date</span>

                  <strong>
                    {movie.release_date ||
                      "Not available"}
                  </strong>
                </div>
              </div>

              {/* BUTTONS */}

              <div className="movie-actions">
                {movie.imdb_url ? (
                  <button
                    className="details-button"
                    onClick={() =>
                      window.open(
                        movie.imdb_url,
                        "_blank",
                        "noopener,noreferrer"
                      )
                    }
                  >
                    <Play
                      size={13}
                      fill="white"
                    />

                    View Details
                  </button>
                ) : (
                  <button
                    className="details-button"
                    disabled
                  >
                    <Play size={13} />

                    Details Unavailable
                  </button>
                )}

                <button
                  className={`watchlist-button ${
                    watchlisted
                      ? "watchlisted"
                      : ""
                  }`}
                  onClick={() =>
                    setWatchlisted(!watchlisted)
                  }
                >
                  {watchlisted ? (
                    <Check size={14} />
                  ) : (
                    <Plus size={14} />
                  )}

                  {watchlisted
                    ? "Added to Watchlist"
                    : "Add to Watchlist"}
                </button>
              </div>
            </div>
          </section>

          {/* ================= RATING ================= */}

          <section className="rate-section">
            <div className="rate-heading">
              <h2>Rate this movie</h2>

              <p>
                Share your rating to improve your
                recommendations.
              </p>
            </div>

            {/* STAR RATING */}

            <div className="rating-area">
              <div className="big-stars">
                {[1, 2, 3, 4, 5].map((value) => (
                  <Star
                    key={value}
                    size={26}
                    className="rating-star"
                    fill={
                      value <=
                      (hoverRating || rating)
                        ? "#ffae00"
                        : "none"
                    }
                    color={
                      value <=
                      (hoverRating || rating)
                        ? "#ffae00"
                        : "#d3d3df"
                    }
                    onClick={() =>
                      handleRating(value)
                    }
                    onMouseEnter={() =>
                      setHoverRating(value)
                    }
                    onMouseLeave={() =>
                      setHoverRating(0)
                    }
                  />
                ))}
              </div>

              <strong>
                {rating > 0
                  ? `${rating}/5`
                  : "Select rating"}
              </strong>
            </div>

            {/* REVIEW */}

            <div className="review-row">
              <input
                type="text"
                placeholder="Add a review (optional)"
                value={review}
                onChange={(event) =>
                  setReview(event.target.value)
                }
              />

              {/* SUBMIT RATING */}

              <button
                className="submit-rating"
                onClick={handleSubmitRating}
                disabled={submittingRating}
              >
                <Send size={13} />

                {submittingRating
                  ? "Submitting..."
                  : "Submit Rating"}
              </button>
            </div>
          </section>

          {/* ================= SIMILAR MOVIES ================= */}

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
              {similarMovies.map(
                (recommendedMovie) => {
                  const recommendedTitle =
                    recommendedMovie.title?.replace(
                      /\s*\(\d{4}\)$/,
                      ""
                    );

                  const genres =
                    recommendedMovie.genres?.split(
                      "|"
                    ) || [];

                  return (
                    <div
                      className="recommendation-card"
                      key={
                        recommendedMovie.movieId
                      }
                      onClick={() =>
                        navigate(
                          `/movie/${recommendedMovie.movieId}`
                        )
                      }
                    >
                      {/* POSTER */}

                      <div className="recommendation-image">
                        {recommendedMovie.poster_url ? (
                          <img
                            src={
                              recommendedMovie.poster_url
                            }
                            alt={recommendedTitle}
                            onError={(event) => {
                              event.currentTarget.style.display =
                                "none";

                              event.currentTarget.parentElement.classList.add(
                                "recommendation-fallback"
                              );
                            }}
                          />
                        ) : (
                          <div className="recommendation-fallback"></div>
                        )}
                      </div>

                      {/* INFORMATION */}

                      <div className="recommendation-info">
                        <h3>
                          {recommendedTitle}
                        </h3>

                        <div className="recommendation-meta">
                          <span>
                            {genres[0] || "Movie"}
                          </span>

                          {genres[1] && (
                            <>
                              <span>•</span>
                              <span>
                                {genres[1]}
                              </span>
                            </>
                          )}

                          <span className="small-rating">
                            <Star
                              size={9}
                              fill="#ffae00"
                              color="#ffae00"
                            />

                            {recommendedMovie.average_rating !=
                            null
                              ? Number(
                                  recommendedMovie.average_rating
                                ).toFixed(1)
                              : "N/A"}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                }
              )}

              {/* NO SIMILAR MOVIES */}

              {similarMovies.length === 0 &&
                !loadingSimilarMovies && (
                  <div className="no-recommendations">
                    No similar movies found.
                  </div>
                )}

              {/* NEXT */}

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
