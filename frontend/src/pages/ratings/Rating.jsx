import React, {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  Bookmark,
  ChevronLeft,
  ChevronRight,
  Edit3,
  Trash2,
  Star,
  CalendarDays,
  Heart,
  X,
} from "lucide-react";

import "./Rating.css";

import Sidebar from "../../components/Sidebar";
import Topbar from "../../components/Topbar";

// =========================================================
// API URL
// =========================================================

const API_URL =
  import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

// =========================================================
// RATING STARS
// =========================================================

function RatingStars({ rating }) {
  const numericRating = Number(rating) || 0;

  return (
    <div className="rating-stars">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          size={15}
          fill={
            star <= numericRating
              ? "#ffae00"
              : "none"
          }
          color={
            star <= numericRating
              ? "#ffae00"
              : "#c9c9d4"
          }
          strokeWidth={2}
        />
      ))}
    </div>
  );
}

// =========================================================
// FORMAT DATE
// =========================================================

function formatDate(timestamp) {
  if (!timestamp) {
    return "—";
  }

  try {
    const numericTimestamp = Number(timestamp);

    if (Number.isNaN(numericTimestamp)) {
      return "—";
    }

    // Backend timestamp is normally Unix seconds.
    // This also handles milliseconds safely.
    const timestampInMilliseconds =
      numericTimestamp > 100000000000
        ? numericTimestamp
        : numericTimestamp * 1000;

    const date = new Date(timestampInMilliseconds);

    if (Number.isNaN(date.getTime())) {
      return "—";
    }

    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  } catch {
    return "—";
  }
}

// =========================================================
// GET PRIMARY GENRE
// =========================================================

function getPrimaryGenre(genres) {
  if (!genres) {
    return "Unknown";
  }

  const firstGenre = String(genres)
    .split("|")
    .map((genre) => genre.trim())
    .filter(Boolean)[0];

  return firstGenre || "Unknown";
}

// =========================================================
// GENRE CLASS
// =========================================================

function getGenreClass(genre) {
  const value = String(genre).toLowerCase();

  if (
    value.includes("sci-fi") ||
    value.includes("science")
  ) {
    return "purple";
  }

  if (
    value.includes("action") ||
    value.includes("adventure")
  ) {
    return "blue";
  }

  if (
    value.includes("romance") ||
    value.includes("romantic")
  ) {
    return "pink";
  }

  if (
    value.includes("animation") ||
    value.includes("fantasy")
  ) {
    return "green";
  }

  if (
    value.includes("horror") ||
    value.includes("thriller")
  ) {
    return "orange";
  }

  if (value.includes("comedy")) {
    return "yellow";
  }

  return "purple";
}

// =========================================================
// RATINGS PAGE
// =========================================================

function Ratings() {
  // =======================================================
  // USER
  // =======================================================

  const [user, setUser] = useState(null);

  // =======================================================
  // RATINGS
  // =======================================================

  const [ratings, setRatings] = useState([]);

  // =======================================================
  // LOADING
  // =======================================================

  const [loading, setLoading] = useState(true);

  // =======================================================
  // ERROR
  // =======================================================

  const [error, setError] = useState("");

  // =======================================================
  // EDIT
  // =======================================================

  const [editingRating, setEditingRating] =
    useState(null);

  const [editValue, setEditValue] = useState(0);

  const [updating, setUpdating] = useState(false);

  // =======================================================
  // DELETE
  // =======================================================

  const [deletingId, setDeletingId] = useState(null);

  // =======================================================
  // PAGINATION
  // =======================================================

  const [currentPage, setCurrentPage] = useState(1);

  const itemsPerPage = 6;

  // =======================================================
  // GET LOGGED-IN USER
  // =======================================================

  useEffect(() => {
    try {
      const savedUser =
        localStorage.getItem("user");

      console.log(
        "================================="
      );
      console.log(
        "Reading logged-in user"
      );
      console.log(
        "localStorage user:",
        savedUser
      );
      console.log(
        "================================="
      );

      if (!savedUser) {
        setUser(null);
        setLoading(false);
        return;
      }

      const parsedUser =
        JSON.parse(savedUser);

      console.log(
        "Parsed user:",
        parsedUser
      );

      console.log(
        "User ID:",
        parsedUser?.id
      );

      if (!parsedUser?.id) {
        setUser(null);
        setLoading(false);
        return;
      }

      setUser(parsedUser);
    } catch (error) {
      console.error(
        "Error reading logged-in user:",
        error
      );

      setUser(null);
      setLoading(false);
    }
  }, []);

  // =======================================================
  // FETCH USER RATINGS
  // =======================================================

  const fetchRatings = useCallback(
    async () => {
      if (!user?.id) {
        return;
      }

      try {
        setLoading(true);
        setError("");

        const url = `${API_URL}/api/ratings/user/${user.id}/`;

        console.log(
          "================================="
        );

        console.log(
          "FETCHING USER RATINGS"
        );

        console.log(
          "User ID:",
          user.id
        );

        console.log(
          "API URL:",
          API_URL
        );

        console.log(
          "Full URL:",
          url
        );

        console.log(
          "================================="
        );

        // IMPORTANT:
        // Do NOT send custom Cache-Control header.
        // It can trigger CORS preflight.
        const response = await fetch(url, {
          method: "GET",
          cache: "no-store",
        });

        const data = await response.json();

        console.log(
          "================================="
        );

        console.log(
          "USER RATINGS API RESPONSE"
        );

        console.log(
          "Status:",
          response.status
        );

        console.log(
          "Response:",
          data
        );

        console.log(
          "Ratings:",
          data?.ratings
        );

        console.log(
          "Ratings count:",
          data?.ratings?.length
        );

        console.log(
          "================================="
        );

        if (!response.ok) {
          throw new Error(
            data?.error ||
              data?.message ||
              "Failed to load your ratings."
          );
        }

        const receivedRatings =
          Array.isArray(data?.ratings)
            ? data.ratings
            : [];

        setRatings(receivedRatings);

        // Always start from first page
        // after fresh data is loaded.
        setCurrentPage(1);
      } catch (error) {
        console.error(
          "Fetch ratings error:",
          error
        );

        setError(
          error.message ||
            "Could not load your ratings."
        );

        setRatings([]);
      } finally {
        setLoading(false);
      }
    },
    [user]
  );

  // =======================================================
  // INITIAL FETCH
  // =======================================================

  useEffect(() => {
    if (user?.id) {
      fetchRatings();
    }
  }, [user, fetchRatings]);

  // =======================================================
  // REFRESH WHEN PAGE BECOMES ACTIVE
  // =======================================================

  useEffect(() => {
    if (!user?.id) {
      return;
    }

    const handleWindowFocus = () => {
      console.log(
        "Ratings page focused - refreshing ratings..."
      );

      fetchRatings();
    };

    window.addEventListener(
      "focus",
      handleWindowFocus
    );

    return () => {
      window.removeEventListener(
        "focus",
        handleWindowFocus
      );
    };
  }, [user, fetchRatings]);

  // =======================================================
  // STATISTICS
  // =======================================================

  const statistics = useMemo(() => {
    const count = ratings.length;

    if (count === 0) {
      return {
        count: 0,
        average: 0,
        thisMonth: 0,
        favorites: 0,
      };
    }

    const total = ratings.reduce(
      (sum, item) =>
        sum + Number(item.rating || 0),
      0
    );

    const average = total / count;

    const now = new Date();

    const currentMonth =
      now.getMonth();

    const currentYear =
      now.getFullYear();

    const thisMonth = ratings.filter(
      (item) => {
        if (!item.timestamp) {
          return false;
        }

        const numericTimestamp =
          Number(item.timestamp);

        if (
          Number.isNaN(
            numericTimestamp
          )
        ) {
          return false;
        }

        const timestampInMilliseconds =
          numericTimestamp >
          100000000000
            ? numericTimestamp
            : numericTimestamp * 1000;

        const date = new Date(
          timestampInMilliseconds
        );

        return (
          date.getMonth() ===
            currentMonth &&
          date.getFullYear() ===
            currentYear
        );
      }
    ).length;

    return {
      count,
      average: Number(
        average.toFixed(1)
      ),
      thisMonth,
      favorites: 0,
    };
  }, [ratings]);

  // =======================================================
  // PAGINATION
  // =======================================================

  const totalPages = Math.max(
    1,
    Math.ceil(
      ratings.length /
        itemsPerPage
    )
  );

  const visibleRatings = useMemo(() => {
    const startIndex =
      (currentPage - 1) *
      itemsPerPage;

    const endIndex =
      startIndex + itemsPerPage;

    return ratings.slice(
      startIndex,
      endIndex
    );
  }, [
    ratings,
    currentPage,
  ]);

  useEffect(() => {
    if (
      currentPage >
      totalPages
    ) {
      setCurrentPage(totalPages);
    }
  }, [
    currentPage,
    totalPages,
  ]);

  // =======================================================
  // EDIT CLICK
  // =======================================================

  const handleEditClick = (
    rating
  ) => {
    setEditingRating(rating);

    setEditValue(
      Number(rating.rating)
    );
  };

  // =======================================================
  // UPDATE RATING
  // =======================================================

  const handleUpdateRating =
    async () => {
      if (
        !editingRating ||
        !user?.id
      ) {
        return;
      }

      const numericRating =
        Number(editValue);

      if (
        Number.isNaN(
          numericRating
        ) ||
        numericRating < 0.5 ||
        numericRating > 5
      ) {
        alert(
          "Rating must be between 0.5 and 5."
        );

        return;
      }

      const validRating =
        Math.round(
          numericRating * 2
        ) / 2;

      try {
        setUpdating(true);

        const response =
          await fetch(
            `${API_URL}/api/ratings/`,
            {
              method: "POST",

              headers: {
                "Content-Type":
                  "application/json",
              },

              body: JSON.stringify({
                user_id: user.id,

                movie_id:
                  editingRating.movie_id,

                rating:
                  validRating,
              }),
            }
          );

        const data =
          await response.json();

        console.log(
          "Update rating response:",
          data
        );

        if (!response.ok) {
          throw new Error(
            data.error ||
              data.message ||
              "Failed to update rating."
          );
        }

        // Refresh from backend.
        await fetchRatings();

        setEditingRating(null);
        setEditValue(0);

        alert(
          data.message ||
            "Rating updated successfully."
        );
      } catch (error) {
        console.error(
          "Update rating error:",
          error
        );

        alert(
          error.message ||
            "Could not update rating."
        );
      } finally {
        setUpdating(false);
      }
    };

  // =======================================================
  // DELETE RATING
  // =======================================================

  const handleDeleteRating =
    async (
      ratingId,
      movieTitle
    ) => {
      if (!ratingId) {
        return;
      }

      const confirmed =
        window.confirm(
          `Are you sure you want to delete your rating for "${movieTitle}"?`
        );

      if (!confirmed) {
        return;
      }

      try {
        setDeletingId(ratingId);

        const response =
          await fetch(
            `${API_URL}/api/ratings/${ratingId}/`,
            {
              method: "DELETE",
            }
          );

        const data =
          await response.json();

        console.log(
          "Delete rating response:",
          data
        );

        if (!response.ok) {
          throw new Error(
            data.error ||
              "Failed to delete rating."
          );
        }

        setRatings(
          (previousRatings) =>
            previousRatings.filter(
              (item) =>
                item.id !==
                ratingId
            )
        );

        alert(
          data.message ||
            "Rating deleted successfully."
        );
      } catch (error) {
        console.error(
          "Delete rating error:",
          error
        );

        alert(
          error.message ||
            "Could not delete rating."
        );
      } finally {
        setDeletingId(null);
      }
    };

  // =======================================================
  // NOT LOGGED IN
  // =======================================================

  if (!loading && !user) {
    return (
      <div className="ratings-page">
        <Sidebar />

        <main className="ratings-main">
          <Topbar />

          <div className="ratings-content">
            <section className="page-heading">
              <div className="heading-left">

                <div className="heading-icon">
                  <Bookmark size={21} />
                </div>

                <div>
                  <h1>
                    My Ratings
                  </h1>

                  <p>
                    View and manage the
                    movies you have rated.
                  </p>
                </div>

              </div>
            </section>

            <section className="ratings-card">

              <div
                style={{
                  padding:
                    "60px 20px",
                  textAlign:
                    "center",
                }}
              >

                <h2>
                  Please log in
                </h2>

                <p>
                  You need to log in
                  to view your ratings.
                </p>

              </div>

            </section>
          </div>
        </main>
      </div>
    );
  }

  // =======================================================
  // MAIN PAGE
  // =======================================================

  return (
    <div className="ratings-page">

      <Sidebar />

      <main className="ratings-main">

        <Topbar />

        <div className="ratings-content">

          {/* PAGE HEADING */}

          <section className="page-heading">

            <div className="heading-left">

              <div className="heading-icon">
                <Bookmark size={21} />
              </div>

              <div>

                <h1>
                  My Ratings
                </h1>

                <p>
                  View and manage the
                  movies you have rated.
                </p>

              </div>

            </div>

          </section>

          {/* STATISTICS */}

          <section className="stats-grid">

            <div className="stat-card">

              <div className="stat-icon">
                <Star
                  size={20}
                  fill="#6634df"
                />
              </div>

              <div>

                <h2>
                  {statistics.count}
                </h2>

                <p>
                  Movies Rated
                </p>

              </div>

            </div>

            <div className="stat-card">

              <div className="stat-icon">
                <Star
                  size={20}
                  fill="#6634df"
                />
              </div>

              <div>

                <h2>
                  {statistics.average.toFixed(
                    1
                  )}
                </h2>

                <p>
                  Average Rating
                </p>

              </div>

            </div>

            <div className="stat-card">

              <div className="stat-icon">
                <CalendarDays size={20} />
              </div>

              <div>

                <h2>
                  {statistics.thisMonth}
                </h2>

                <p>
                  This Month
                </p>

              </div>

            </div>

            <div className="stat-card">

              <div className="stat-icon">
                <Heart
                  size={20}
                  fill="#6634df"
                />
              </div>

              <div>

                <h2>
                  {statistics.favorites}
                </h2>

                <p>
                  Favorite Movies
                </p>

              </div>

            </div>

          </section>

          {/* ERROR */}

          {error && (
            <div
              style={{
                background:
                  "#fff0f0",

                color:
                  "#d93025",

                padding:
                  "12px 16px",

                borderRadius:
                  "8px",

                marginBottom:
                  "15px",
              }}
            >
              {error}
            </div>
          )}

          {/* RATINGS TABLE */}

          <section className="ratings-card">

            {loading ? (

              <div
                style={{
                  padding:
                    "60px 20px",

                  textAlign:
                    "center",
                }}
              >

                <h3>
                  Loading your ratings...
                </h3>

                <p>
                  Please wait.
                </p>

              </div>

            ) : ratings.length === 0 ? (

              <div
                style={{
                  padding:
                    "70px 20px",

                  textAlign:
                    "center",
                }}
              >

                <Star
                  size={45}
                  color="#6634df"
                  strokeWidth={1.5}
                />

                <h2>
                  You haven't rated
                  any movies yet.
                </h2>

                <p>
                  Start rating movies
                  to see them here.
                </p>

              </div>

            ) : (

              <>

                {/* TABLE */}

                <div className="table-container">

                  <table>

                    <thead>

                      <tr>

                        <th>
                          #
                        </th>

                        <th>
                          Movie
                        </th>

                        <th>
                          Genre
                        </th>

                        <th>
                          My Rating
                        </th>

                        <th>
                          Rated On
                        </th>

                        <th>
                          Actions
                        </th>

                      </tr>

                    </thead>

                    <tbody>

                      {visibleRatings.map(
                        (
                          movie,
                          index
                        ) => {

                          const genre =
                            getPrimaryGenre(
                              movie.genres
                            );

                          const genreClass =
                            getGenreClass(
                              genre
                            );

                          const actualNumber =
                            (currentPage -
                              1) *
                              itemsPerPage +
                            index +
                            1;

                          return (

                            <tr
                              key={
                                movie.id
                              }
                            >

                              {/* NUMBER */}

                              <td className="number">
                                {
                                  actualNumber
                                }
                              </td>

                              {/* MOVIE */}

                              <td>

                                <div className="movie-info">

                                  <div className="movie-poster">

                                    {movie.poster_url ? (

                                      <img
                                        src={
                                          movie.poster_url
                                        }
                                        alt={
                                          movie.movie_title
                                        }
                                        onError={(
                                          event
                                        ) => {

                                          event.currentTarget.style.display =
                                            "none";

                                          event.currentTarget.parentElement.classList.add(
                                            "poster-fallback"
                                          );

                                        }}
                                      />

                                    ) : null}

                                  </div>

                                  <strong>
                                    {
                                      movie.movie_title
                                    }
                                  </strong>

                                </div>

                              </td>

                              {/* GENRE */}

                              <td>

                                <span
                                  className={`genre-tag ${genreClass}`}
                                >
                                  {genre}
                                </span>

                              </td>

                              {/* RATING */}

                              <td>

                                <div className="rating-container">

                                  <RatingStars
                                    rating={Number(
                                      movie.rating
                                    )}
                                  />

                                  <span>
                                    {Number(
                                      movie.rating
                                    ).toFixed(
                                      1
                                    )}
                                  </span>

                                </div>

                              </td>

                              {/* DATE */}

                              <td className="date">

                                {formatDate(
                                  movie.timestamp
                                )}

                              </td>

                              {/* ACTIONS */}

                              <td>

                                <div className="action-buttons">

                                  <button
                                    className="edit-btn"
                                    title="Edit rating"
                                    onClick={() =>
                                      handleEditClick(
                                        movie
                                      )
                                    }
                                  >
                                    <Edit3
                                      size={15}
                                    />
                                  </button>

                                  <button
                                    className="delete-btn"
                                    title="Delete rating"
                                    disabled={
                                      deletingId ===
                                      movie.id
                                    }
                                    onClick={() =>
                                      handleDeleteRating(
                                        movie.id,
                                        movie.movie_title
                                      )
                                    }
                                  >
                                    <Trash2
                                      size={15}
                                    />
                                  </button>

                                </div>

                              </td>

                            </tr>

                          );
                        }
                      )}

                    </tbody>

                  </table>

                </div>

                {/* FOOTER */}

                <div className="table-footer">

                  <span>

                    Showing{" "}

                    {(currentPage -
                      1) *
                      itemsPerPage +
                      1}{" "}

                    to{" "}

                    {Math.min(
                      currentPage *
                        itemsPerPage,
                      ratings.length
                    )}{" "}

                    of{" "}

                    {ratings.length}{" "}

                    movies

                  </span>

                  <div className="pagination">

                    {/* PREVIOUS */}

                    <button
                      disabled={
                        currentPage ===
                        1
                      }
                      onClick={() =>
                        setCurrentPage(
                          (page) =>
                            Math.max(
                              1,
                              page - 1
                            )
                        )
                      }
                    >
                      <ChevronLeft
                        size={15}
                      />
                    </button>

                    {/* PAGE NUMBERS */}

                    {Array.from(
                      {
                        length:
                          totalPages,
                      },
                      (
                        _,
                        index
                      ) => {

                        const page =
                          index + 1;

                        return (

                          <button
                            key={page}
                            className={
                              currentPage ===
                              page
                                ? "current"
                                : ""
                            }
                            onClick={() =>
                              setCurrentPage(
                                page
                              )
                            }
                          >
                            {page}
                          </button>

                        );
                      }
                    )}

                    {/* NEXT */}

                    <button
                      disabled={
                        currentPage ===
                        totalPages
                      }
                      onClick={() =>
                        setCurrentPage(
                          (page) =>
                            Math.min(
                              totalPages,
                              page + 1
                            )
                        )
                      }
                    >
                      <ChevronRight
                        size={15}
                      />
                    </button>

                  </div>

                </div>

              </>

            )}

          </section>

        </div>

      </main>

      {/* =====================================================
          EDIT RATING MODAL
      ===================================================== */}

      {editingRating && (

        <div
          style={{
            position: "fixed",
            inset: 0,

            background:
              "rgba(0, 0, 0, 0.45)",

            display: "flex",

            alignItems:
              "center",

            justifyContent:
              "center",

            zIndex: 9999,

            padding: "20px",
          }}

          onClick={() =>
            setEditingRating(null)
          }
        >

          <div
            style={{
              background:
                "#ffffff",

              width: "100%",

              maxWidth:
                "420px",

              borderRadius:
                "14px",

              padding: "25px",

              boxShadow:
                "0 15px 40px rgba(0,0,0,0.2)",
            }}

            onClick={(event) =>
              event.stopPropagation()
            }
          >

            {/* HEADER */}

            <div
              style={{
                display: "flex",

                justifyContent:
                  "space-between",

                alignItems:
                  "center",

                marginBottom:
                  "20px",
              }}
            >

              <div>

                <h2
                  style={{
                    margin: 0,
                  }}
                >
                  Edit Rating
                </h2>

                <p
                  style={{
                    margin:
                      "5px 0 0",

                    color:
                      "#777",
                  }}
                >
                  {
                    editingRating.movie_title
                  }
                </p>

              </div>

              <button
                type="button"

                onClick={() =>
                  setEditingRating(
                    null
                  )
                }

                style={{
                  border: "none",

                  background:
                    "transparent",

                  cursor:
                    "pointer",
                }}
              >
                <X size={20} />
              </button>

            </div>

            {/* RATING */}

            <div
              style={{
                marginBottom:
                  "20px",
              }}
            >

              <p
                style={{
                  marginBottom:
                    "10px",

                  fontWeight: 600,
                }}
              >
                Your rating
              </p>

              <div
                style={{
                  display: "flex",

                  gap: "8px",

                  alignItems:
                    "center",

                  marginBottom:
                    "15px",
                }}
              >

                {[1, 2, 3, 4, 5].map(
                  (star) => (

                    <button
                      key={star}

                      type="button"

                      onClick={() =>
                        setEditValue(
                          star
                        )
                      }

                      style={{
                        border:
                          "none",

                        background:
                          "transparent",

                        cursor:
                          "pointer",

                        padding:
                          "2px",
                      }}
                    >

                      <Star
                        size={28}

                        fill={
                          star <=
                          editValue
                            ? "#ffae00"
                            : "none"
                        }

                        color={
                          star <=
                          editValue
                            ? "#ffae00"
                            : "#c9c9d4"
                        }
                      />

                    </button>

                  )
                )}

              </div>

              <div
                style={{
                  display: "flex",

                  alignItems:
                    "center",

                  gap: "10px",
                }}
              >

                <input
                  type="number"

                  min="0.5"

                  max="5"

                  step="0.5"

                  value={
                    editValue
                  }

                  onChange={(event) =>
                    setEditValue(
                      event.target
                        .value
                    )
                  }

                  style={{
                    width: "100px",

                    padding:
                      "10px",

                    border:
                      "1px solid #ddd",

                    borderRadius:
                      "7px",

                    fontSize:
                      "16px",
                  }}
                />

                <span>
                  out of 5
                </span>

              </div>

            </div>

            {/* BUTTONS */}

            <div
              style={{
                display: "flex",

                justifyContent:
                  "flex-end",

                gap: "10px",
              }}
            >

              <button
                type="button"

                onClick={() =>
                  setEditingRating(
                    null
                  )
                }

                disabled={
                  updating
                }

                style={{
                  padding:
                    "10px 18px",

                  border:
                    "1px solid #ddd",

                  background:
                    "#ffffff",

                  borderRadius:
                    "7px",

                  cursor:
                    "pointer",
                }}
              >
                Cancel
              </button>

              <button
                type="button"

                onClick={
                  handleUpdateRating
                }

                disabled={
                  updating
                }

                style={{
                  padding:
                    "10px 18px",

                  border:
                    "none",

                  background:
                    "#6634df",

                  color:
                    "#ffffff",

                  borderRadius:
                    "7px",

                  cursor:
                    "pointer",
                }}
              >
                {updating
                  ? "Updating..."
                  : "Update Rating"}
              </button>

            </div>

          </div>

        </div>

      )}

    </div>
  );
}

export default Ratings;