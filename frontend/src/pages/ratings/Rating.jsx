import React from "react";
import {
  Bookmark,
  ChevronLeft,
  ChevronRight,
  Edit3,
  Trash2,
  Star,
  CalendarDays,
  Heart,
} from "lucide-react";

import "./Rating.css";
import Sidebar from "../../components/Sidebar";
import Topbar from "../../components/Topbar";

const movies = [
  {
    id: 1,
    title: "Interstellar",
    genre: "Sci-Fi",
    genreClass: "purple",
    rating: 4.5,
    date: "05 May 2024",
    image: "/posters/interstellar.jpg",
  },
  {
    id: 2,
    title: "The Dark Knight",
    genre: "Action",
    genreClass: "blue",
    rating: 5.0,
    date: "02 May 2024",
    image: "/posters/dark-knight.jpg",
  },
  {
    id: 3,
    title: "La La Land",
    genre: "Romance",
    genreClass: "pink",
    rating: 4.0,
    date: "28 Apr 2024",
    image: "/posters/la-la-land.jpg",
  },
  {
    id: 4,
    title: "Spirited Away",
    genre: "Animation",
    genreClass: "green",
    rating: 5.0,
    date: "26 Apr 2024",
    image: "/posters/spirited-away.jpg",
  },
  {
    id: 5,
    title: "Inception",
    genre: "Sci-Fi",
    genreClass: "purple",
    rating: 4.0,
    date: "20 Apr 2024",
    image: "/posters/inception.jpg",
  },
  {
    id: 6,
    title: "The Shawshank Redemption",
    genre: "Drama",
    genreClass: "orange",
    rating: 5.0,
    date: "15 Apr 2024",
    image: "/posters/shawshank.jpg",
  },
];

function RatingStars({ rating }) {
  return (
    <div className="rating-stars">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          size={15}
          fill={star <= rating ? "#ffae00" : "none"}
          color={star <= rating ? "#ffae00" : "#c9c9d4"}
          strokeWidth={2}
        />
      ))}
    </div>
  );
}

function Ratings() {
  return (
    <div className="ratings-page">

      <Sidebar />

      <main className="ratings-main">

        <Topbar />

        <div className="ratings-content">

          {/* PAGE TITLE */}

          <section className="page-heading">

            <div className="heading-left">

              <div className="heading-icon">
                <Bookmark size={21} />
              </div>

              <div>
                <h1>My Ratings</h1>
                <p>View and manage the movies you have rated.</p>
              </div>

            </div>

          </section>

          {/* STATISTICS */}

          <section className="stats-grid">

            <div className="stat-card">

              <div className="stat-icon">
                <Star size={20} fill="#6634df" />
              </div>

              <div>
                <h2>18</h2>
                <p>Movies Rated</p>
              </div>

            </div>

            <div className="stat-card">

              <div className="stat-icon">
                <Star size={20} fill="#6634df" />
              </div>

              <div>
                <h2>4.3</h2>
                <p>Average Rating</p>
              </div>

            </div>

            <div className="stat-card">

              <div className="stat-icon">
                <CalendarDays size={20} />
              </div>

              <div>
                <h2>12</h2>
                <p>This Month</p>
              </div>

            </div>

            <div className="stat-card">

              <div className="stat-icon">
                <Heart size={20} fill="#6634df" />
              </div>

              <div>
                <h2>6</h2>
                <p>Favorite Movies</p>
              </div>

            </div>

          </section>

          {/* RATINGS TABLE */}

          <section className="ratings-card">

            <div className="table-container">

              <table>

                <thead>

                  <tr>
                    <th>#</th>
                    <th>Movie</th>
                    <th>Genre</th>
                    <th>My Rating</th>
                    <th>Rated On</th>
                    <th>Actions</th>
                  </tr>

                </thead>

                <tbody>

                  {movies.map((movie) => (

                    <tr key={movie.id}>

                      <td className="number">
                        {movie.id}
                      </td>

                      <td>

                        <div className="movie-info">

                          <div className="movie-poster">

                            <img
                              src={movie.image}
                              alt={movie.title}
                              onError={(event) => {
                                event.currentTarget.style.display = "none";
                                event.currentTarget.parentElement.classList.add(
                                  "poster-fallback"
                                );
                              }}
                            />

                          </div>

                          <strong>{movie.title}</strong>

                        </div>

                      </td>

                      <td>

                        <span
                          className={`genre-tag ${movie.genreClass}`}
                        >
                          {movie.genre}
                        </span>

                      </td>

                      <td>

                        <div className="rating-container">

                          <RatingStars rating={movie.rating} />

                          <span>
                            {movie.rating.toFixed(1)}
                          </span>

                        </div>

                      </td>

                      <td className="date">
                        {movie.date}
                      </td>

                      <td>

                        <div className="action-buttons">

                          <button
                            className="edit-btn"
                            title="Edit rating"
                          >
                            <Edit3 size={15} />
                          </button>

                          <button
                            className="delete-btn"
                            title="Delete rating"
                          >
                            <Trash2 size={15} />
                          </button>

                        </div>

                      </td>

                    </tr>

                  ))}

                </tbody>

              </table>

            </div>

            {/* TABLE FOOTER */}

            <div className="table-footer">

              <span>
                Showing 1 to 6 of 18 movies
              </span>

              <div className="pagination">

                <button>
                  <ChevronLeft size={15} />
                </button>

                <button className="current">
                  1
                </button>

                <button>
                  2
                </button>

                <button>
                  3
                </button>

                <button>
                  <ChevronRight size={15} />
                </button>

              </div>

            </div>

          </section>

        </div>

      </main>

    </div>
  );
}

export default Ratings;