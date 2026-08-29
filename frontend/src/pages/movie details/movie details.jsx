import React, { useState } from "react";
import {
  Home,
  Smile,
  Bookmark,
  User,
  LogOut,
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
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [watchlisted, setWatchlisted] = useState(false);
  const [review, setReview] = useState("");

  const handleRating = (value) => {
    setRating(value);
  };

  return (
    <div className="movie-detail-page">

      {/* ================= SIDEBAR ================= */}

      <Sidebar />

      {/* ================= MAIN ================= */}

      <main className="movie-main">

        {/* TOP BAR */}

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

        {/* CONTENT */}

        <div className="movie-content">

          {/* BACK */}

          <button
            className="back-home"
            onClick={() => window.history.back()}
          >
            <ArrowLeft size={12} />
            Back to Home
          </button>

          {/* ================= MOVIE INFORMATION ================= */}

          <section className="movie-information">

            {/* POSTER */}

            <div className="main-movie-poster">

              <img
                src="/posters/interstellar.jpg"
                alt="Interstellar"
              />

            </div>

            {/* DETAILS */}

            <div className="movie-details">

              <h1>Interstellar</h1>

              <div className="movie-meta">

                <span className="main-rating">
                  <Star size={13} fill="#ffae00" color="#ffae00" />
                  <strong>4.5/5</strong>
                  <small>(12,345 ratings)</small>
                </span>

                <span className="detail-tag sci-fi">
                  Sci-Fi
                </span>

                <span className="detail-tag adventure">
                  Adventure
                </span>

                <span className="detail-tag drama">
                  Drama
                </span>

                <span className="meta-text">
                  2014
                </span>

                <span className="meta-text">
                  •
                </span>

                <span className="meta-text">
                  2h 49m
                </span>

                <span className="pg-tag">
                  PG-13
                </span>

              </div>

              <p className="movie-description">
                A team of explorers travel through a wormhole in
                space in an attempt to ensure humanity's survival.
                They embark on a dangerous journey across the galaxy
                to find a new home for mankind.
              </p>

              {/* INFORMATION */}

              <div className="movie-info-list">

                <div>
                  <span>Director</span>
                  <strong>Christopher Nolan</strong>
                </div>

                <div>
                  <span>Writers</span>
                  <strong>
                    Jonathan Nolan, Christopher Nolan
                  </strong>
                </div>

                <div>
                  <span>Stars</span>
                  <strong>
                    Matthew McConaughey, Anne Hathaway,
                    Jessica Chastain, Michael Caine
                  </strong>
                </div>

                <div>
                  <span>Release Date</span>
                  <strong>
                    7 November 2014
                  </strong>
                </div>

              </div>

              {/* BUTTONS */}

              <div className="movie-actions">

                <button className="details-button">
                  <Play size={13} fill="white" />
                  View Details
                </button>

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
                    onClick={() => handleRating(value)}
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
                {rating > 0 ? `${rating}/5` : "4/5"}
              </strong>

            </div>

            {/* REVIEW */}

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

              {recommendedMovies.map((movie, index) => (

                <div
                  className="recommendation-card"
                  key={index}
                >

                  <div className="recommendation-image">

                    <img
                      src={movie.image}
                      alt={movie.title}
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

                    <h3>{movie.title}</h3>

                    <div className="recommendation-meta">

                      <span>
                        {movie.genre}
                      </span>

                      <span>•</span>

                      <span>
                        {movie.type}
                      </span>

                      <span className="small-rating">
                        <Star
                          size={9}
                          fill="#ffae00"
                          color="#ffae00"
                        />
                        {movie.rating}
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