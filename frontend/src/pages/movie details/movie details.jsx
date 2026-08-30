import React, { useEffect, useState } from "react";

// ================= UPDATED: useParams reads the movie ID from /movie/:id =================
import { useParams } from "react-router-dom";

import {
  Bell,
  Search,
  ChevronDown,
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

/*
  These recommendations are still temporary/static.
  We can connect "You might also like" to the backend later.
*/
const recommendedMovies = [
  {
    title: "Inception",
    genre: "Sci-Fi",
    type: "Thriller",
    rating: "4.6",
    image: "/posters/inception.jpg",
  },
  {
    title: "The Martian",
    genre: "Sci-Fi",
    type: "Adventure",
    rating: "4.5",
    image: "/posters/martian.jpg",
  },
  {
    title: "Gravity",
    genre: "Sci-Fi",
    type: "Thriller",
    rating: "4.4",
    image: "/posters/gravity.jpg",
  },
  {
    title: "Dune",
    genre: "Sci-Fi",
    type: "Adventure",
    rating: "4.3",
    image: "/posters/dune.jpg",
  },
  {
    title: "Tenet",
    genre: "Action",
    type: "Sci-Fi",
    rating: "4.2",
    image: "/posters/tenet.jpg",
  },
  {
    title: "Arrival",
    genre: "Sci-Fi",
    type: "Drama",
    rating: "4.1",
    image: "/posters/arrival.jpg",
  },
];

function MovieDetail() {

  // ================= UPDATED: Get movie ID from the URL =================
  // Example:
  // /movie/134853
  // id = 134853
  const { id } = useParams();

  // ================= UPDATED: State for selected movie details =================
  const [movie, setMovie] = useState(null);
  const [loadingMovie, setLoadingMovie] = useState(true);
  const [movieError, setMovieError] = useState("");

  // Existing rating/watchlist states
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [watchlisted, setWatchlisted] = useState(false);
  const [review, setReview] = useState("");

  // ================= UPDATED: Fetch clicked movie from Django =================
  useEffect(() => {

    const fetchMovieDetails = async () => {
      try {
        setLoadingMovie(true);
        setMovieError("");

        /*
          The ID comes from the movie card that the user clicked.

          Example request:
          GET http://127.0.0.1:8000/api/movies/134853/
        */
        const response = await fetch(
          `http://127.0.0.1:8000/api/movies/${id}/`
        );

        if (!response.ok) {
          throw new Error("Unable to load movie details.");
        }

        const data = await response.json();

        console.log("Movie details API response:", data);

        // Save returned movie information
        setMovie(data);

      } catch (error) {

        console.error("Movie details API error:", error);

        setMovie(null);
        setMovieError(
          error.message || "Could not load movie details."
        );

      } finally {

        setLoadingMovie(false);

      }
    };

    fetchMovieDetails();

  }, [id]);

  // Existing rating function
  const handleRating = (value) => {
    setRating(value);
  };

  // ================= UPDATED: Loading screen =================
  if (loadingMovie) {
    return (
      <div className="movie-detail-page">

        <Sidebar />

        <main className="movie-main">

          <div
            style={{
              padding: "50px",
              textAlign: "center",
            }}
          >
            Loading movie details...
          </div>

        </main>

      </div>
    );
  }

  // ================= UPDATED: Error screen =================
  if (movieError) {
    return (
      <div className="movie-detail-page">

        <Sidebar />

        <main className="movie-main">

          <div
            style={{
              padding: "50px",
              textAlign: "center",
            }}
          >
            <p>{movieError}</p>

            <button onClick={() => window.history.back()}>
              Go Back
            </button>

          </div>

        </main>

      </div>
    );
  }

  // ================= UPDATED: Handle missing movie =================
  if (!movie) {
    return (
      <div className="movie-detail-page">

        <Sidebar />

        <main className="movie-main">

          <div
            style={{
              padding: "50px",
              textAlign: "center",
            }}
          >
            Movie not found.
          </div>

        </main>

      </div>
    );
  }

  /*
    ================= UPDATED =================

    If the backend provides a separate year field,
    use it.

    Otherwise try to get the year from a MovieLens title like:

    Interstellar (2014)
  */
  const extractedYear =
    movie.year ||
    movie.title?.match(/\((\d{4})\)$/)?.[1] ||
    "N/A";

  /*
    ================= UPDATED =================

    MovieLens titles normally contain the year.

    This removes "(2014)" from the page heading if necessary.

    Example:
    "Interstellar (2014)" -> "Interstellar"
  */
  const displayTitle =
    movie.title?.replace(/\s*\(\d{4}\)$/, "") ||
    "Unknown Movie";

  return (
    <div className="movie-detail-page">

      {/* ================= SIDEBAR ================= */}

      <Sidebar />

      {/* ================= MAIN ================= */}

      <main className="movie-main">

        {/* ================= TOP BAR ================= */}

        <header className="movie-topbar">

          <div className="movie-search">

            <Search size={16} />

            <input
              type="text"
              placeholder="Search movies by title, genre, actor..."
            />

          </div>

          <div className="movie-user">

            <div className="movie-notification">

              <Bell size={19} />

              <span>3</span>

            </div>

            <div className="movie-profile">

              <div className="movie-avatar">
                C
              </div>

              <strong>Chiranjeevi</strong>

              <ChevronDown size={13} />

            </div>

          </div>

        </header>

        {/* ================= CONTENT ================= */}

        <div className="movie-content">

          {/* ================= BACK BUTTON ================= */}

          <button
            className="back-home"
            onClick={() => window.history.back()}
          >
            <ArrowLeft size={12} />

            Back
          </button>

          {/* ================= MOVIE INFORMATION ================= */}

          <section className="movie-information">

            {/* ================= UPDATED: DYNAMIC POSTER ================= */}

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

                <div
                  style={{
                    width: "100%",
                    height: "100%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "45px",
                  }}
                >
                  🎬
                </div>

              )}

            </div>

            {/* ================= MOVIE DETAILS ================= */}

            <div className="movie-details">

              {/* ================= UPDATED: DYNAMIC TITLE ================= */}

              <h1>{displayTitle}</h1>

              <div className="movie-meta">

                {/* ================= UPDATED: DYNAMIC RATING ================= */}

                <span className="main-rating">

                  <Star
                    size={13}
                    fill="#ffae00"
                    color="#ffae00"
                  />

                  <strong>
                    {movie.average_rating != null
                      ? `${Number(movie.average_rating).toFixed(1)}/5`
                      : "N/A"}
                  </strong>

                  <small>
                    ({movie.rating_count ?? 0} ratings)
                  </small>

                </span>

                {/* ================= UPDATED: DYNAMIC GENRES ================= */}

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

                {/* ================= UPDATED: DYNAMIC YEAR ================= */}

                <span className="meta-text">
                  {extractedYear}
                </span>

                {/* ================= UPDATED: RUNTIME ================= */}

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

                {/* ================= UPDATED: AGE RATING ================= */}

                {movie.certification && (

                  <span className="pg-tag">
                    {movie.certification}
                  </span>

                )}

              </div>

              {/* ================= UPDATED: DYNAMIC DESCRIPTION ================= */}

              <p className="movie-description">

                {movie.description ||
                  movie.overview ||
                  "Movie description is not available."}

              </p>

              {/* ================= MOVIE INFORMATION ================= */}

              <div className="movie-info-list">

                {/* ================= UPDATED: DYNAMIC DIRECTOR ================= */}

                <div>

                  <span>Director</span>

                  <strong>
                    {movie.director || "Not available"}
                  </strong>

                </div>

                {/* ================= UPDATED: DYNAMIC WRITERS ================= */}

                <div>

                  <span>Writers</span>

                  <strong>
                    {movie.writers || "Not available"}
                  </strong>

                </div>

                {/* ================= UPDATED: DYNAMIC STARS ================= */}

                <div>

                  <span>Stars</span>

                  <strong>
                    {movie.stars ||
                      movie.cast ||
                      "Not available"}
                  </strong>

                </div>

                {/* ================= UPDATED: DYNAMIC RELEASE DATE ================= */}

                <div>

                  <span>Release Date</span>

                  <strong>
                    {movie.release_date || "Not available"}
                  </strong>

                </div>

              </div>

              {/* ================= BUTTONS ================= */}

              <div className="movie-actions">

                {/* ================= UPDATED: IMDb button if backend returns URL ================= */}

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

                  <button className="details-button">

                    <Play
                      size={13}
                      fill="white"
                    />

                    View Details

                  </button>

                )}

                <button
                  className={`watchlist-button ${
                    watchlisted ? "watchlisted" : ""
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

          {/* ================= RATING SECTION ================= */}

          <section className="rate-section">

            <div className="rate-heading">

              <h2>Rate this movie</h2>

              <p>
                Share your rating to improve your recommendations.
              </p>

            </div>

            <div className="rating-area">

              <div className="big-stars">

                {[1, 2, 3, 4, 5].map((value) => (

                  <Star
                    key={value}
                    size={26}
                    className="rating-star"
                    fill={
                      value <= (hoverRating || rating)
                        ? "#ffae00"
                        : "none"
                    }
                    color={
                      value <= (hoverRating || rating)
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

            {/* ================= REVIEW ================= */}

            <div className="review-row">

              <input
                type="text"
                placeholder="Add a review (optional)"
                value={review}
                onChange={(e) =>
                  setReview(e.target.value)
                }
              />

              <button className="submit-rating">

                <Send size={13} />

                Submit Rating

              </button>

            </div>

          </section>

          {/* ================= RECOMMENDATIONS ================= */}

          <section className="recommendation-section">

            <div className="recommendation-heading">

              <h2>You might also like</h2>

              <button>

                View all

                <ChevronRight size={13} />

              </button>

            </div>

            <div className="movie-recommendations">

              {recommendedMovies.map((recommendedMovie, index) => (

                <div
                  className="recommendation-card"
                  key={index}
                >

                  <div className="recommendation-image">

                    <img
                      src={recommendedMovie.image}
                      alt={recommendedMovie.title}
                      onError={(e) => {

                        e.currentTarget.style.display =
                          "none";

                        e.currentTarget.parentElement.classList.add(
                          "recommendation-fallback"
                        );

                      }}
                    />

                  </div>

                  <div className="recommendation-info">

                    <h3>
                      {recommendedMovie.title}
                    </h3>

                    <div className="recommendation-meta">

                      <span>
                        {recommendedMovie.genre}
                      </span>

                      <span>•</span>

                      <span>
                        {recommendedMovie.type}
                      </span>

                      <span className="small-rating">

                        <Star
                          size={9}
                          fill="#ffae00"
                          color="#ffae00"
                        />

                        {recommendedMovie.rating}

                      </span>

                    </div>

                  </div>

                </div>

              ))}

              <button className="recommendation-next">

                <ChevronRight size={17} />

              </button>

            </div>

          </section>

        </div>

      </main>

    </div>
  );
}

export default MovieDetail;