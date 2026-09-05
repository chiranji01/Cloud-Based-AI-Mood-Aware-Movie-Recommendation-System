import React, { useState } from "react";
import "./dashboard.css";
import Sidebar from "../../components/Sidebar";
import Topbar from "../../components/Topbar";

const movies = [
  {
    id: 1,
    title: "Interstellar",
    genre: "Sci-Fi, Adventure",
    rating: "4.8",
    status: "Active",
    added: "05 May 2024",
    poster: "🚀",
  },
  {
    id: 2,
    title: "The Dark Knight",
    genre: "Action, Crime",
    rating: "4.7",
    status: "Active",
    added: "02 May 2024",
    poster: "🦇",
  },
  {
    id: 3,
    title: "Inception",
    genre: "Sci-Fi, Thriller",
    rating: "4.6",
    status: "Active",
    added: "20 Apr 2024",
    poster: "🌀",
  },
  {
    id: 4,
    title: "The Lion King",
    genre: "Animation, Family",
    rating: "4.6",
    status: "Active",
    added: "18 Apr 2024",
    poster: "🦁",
  },
  {
    id: 5,
    title: "Spider-Man: No Way Home",
    genre: "Action, Adventure",
    rating: "4.5",
    status: "Active",
    added: "15 Apr 2024",
    poster: "🕷️",
  },
  {
    id: 6,
    title: "La La Land",
    genre: "Romance, Drama",
    rating: "4.4",
    status: "Active",
    added: "12 Apr 2024",
    poster: "🎵",
  },
  {
    id: 7,
    title: "The Martian",
    genre: "Sci-Fi, Adventure",
    rating: "4.5",
    status: "Inactive",
    added: "10 Apr 2024",
    poster: "🚀",
  },
];

const users = [
  {
    id: 1,
    name: "Chiranj JayaIathge",
    email: "chiranj@example.com",
    role: "User",
    status: "Active",
    joined: "10 Apr 2024",
  },
  {
    id: 2,
    name: "Prapti Pokharel",
    email: "prapti@example.com",
    role: "User",
    status: "Active",
    joined: "12 Apr 2024",
  },
  {
    id: 3,
    name: "Meghan Reddy",
    email: "meghan@example.com",
    role: "Admin",
    status: "Active",
    joined: "05 Apr 2024",
  },
  {
    id: 4,
    name: "John Doe",
    email: "john@example.com",
    role: "User",
    status: "Active",
    joined: "01 Apr 2024",
  },
  {
    id: 5,
    name: "Sarah Wilson",
    email: "sarah@example.com",
    role: "User",
    status: "Active",
    joined: "22 Mar 2024",
  },
];

function Dashboard() {
  const [movieSearch, setMovieSearch] = useState("");
  const [userSearch, setUserSearch] = useState("");

  const filteredMovies = movies.filter((movie) =>
    movie.title.toLowerCase().includes(movieSearch.toLowerCase())
  );

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(userSearch.toLowerCase()) ||
      user.email.toLowerCase().includes(userSearch.toLowerCase())
  );

  return (
    <div className="admin-dashboard">

      {/* SIDEBAR */}
      <aside className="admin-sidebar">

        <div className="brand">
          <div className="brand-logo">●</div>

          <div>
            <div className="brand-name">MoodFlix</div>
            <div className="brand-subtitle">Admin Panel</div>
          </div>
        </div>

        <Sidebar />   

        <div className="sidebar-decoration">
          <div className="director-chair">
            <div className="chair-label">DIRECTOR</div>
            <div className="chair-seat"></div>
            <div className="chair-legs"></div>
          </div>

          <div className="popcorn">
            <div className="popcorn-top">● ● ●</div>
            <div className="popcorn-box">🍿</div>
          </div>

          <div className="clapper">
            <div></div>
            <div></div>
          </div>
        </div>

      </aside>

      {/* MAIN CONTENT */}
      <main className="admin-main">

        {/* HEADER */}
        <header className="admin-header">

          <div className="header-left">
            <button className="menu-button">☰</button>
            <h1>Dashboard</h1>
          </div>

          <div className="header-right">

            <button className="notification-button">
              ♧
              <span className="notification-badge">3</span>
            </button>

            <div className="admin-profile">
              <div className="admin-avatar">A</div>

              <div className="admin-info">
                <strong>Admin</strong>
                <span>Administrator</span>
              </div>

              <span className="profile-arrow">⌄</span>
            </div>

          </div>

        </header>

        <div className="dashboard-content">

          {/* STAT CARDS */}
          <section className="stats-grid">

            <div className="stat-card">
              <div className="stat-icon purple">▣</div>

              <div className="stat-content">
                <span>Total Movies</span>
                <strong>512</strong>
                <small className="purple-text">+12 added this month</small>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon green">♙</div>

              <div className="stat-content">
                <span>Total Users</span>
                <strong>156</strong>
                <small className="green-text">+8 new this month</small>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon blue">★</div>

              <div className="stat-content">
                <span>Total Ratings</span>
                <strong>2,842</strong>
                <small className="blue-text">+132 this month</small>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon orange">↗</div>

              <div className="stat-content">
                <span>Avg. Rating</span>
                <strong>4.25 / 5</strong>
                <small>Across all movies</small>
              </div>
            </div>

          </section>

          {/* TABLES */}
          <section className="tables-grid">

            {/* MOVIES */}
            <div className="dashboard-card movies-card">

              <div className="card-title-row">

                <div>
                  <h2>Manage Movies</h2>
                  <p>Add, edit or remove movies from the system.</p>
                </div>

                <button className="add-button">
                  <span>+</span>
                  Add New Movie
                </button>

              </div>

              <div className="filters">

                <div className="search-box">
                  <span>⌕</span>
                  <input
                    type="text"
                    placeholder="Search movies by title, genre..."
                    value={movieSearch}
                    onChange={(e) => setMovieSearch(e.target.value)}
                  />
                </div>

                <select>
                  <option>All Genres</option>
                  <option>Action</option>
                  <option>Adventure</option>
                  <option>Drama</option>
                  <option>Sci-Fi</option>
                  <option>Comedy</option>
                </select>

                <select>
                  <option>Status</option>
                  <option>Active</option>
                  <option>Inactive</option>
                </select>

              </div>

              <div className="table-wrapper">

                <table className="dashboard-table">

                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Movie</th>
                      <th>Genre</th>
                      <th>Rating</th>
                      <th>Status</th>
                      <th>Added On</th>
                      <th>Actions</th>
                    </tr>
                  </thead>

                  <tbody>

                    {filteredMovies.map((movie) => (
                      <tr key={movie.id}>

                        <td>{movie.id}</td>

                        <td>
                          <div className="movie-name">
                            <div className="movie-poster">
                              {movie.poster}
                            </div>

                            <strong>{movie.title}</strong>
                          </div>
                        </td>

                        <td>
                          <span className="genre-tag">
                            {movie.genre}
                          </span>
                        </td>

                        <td>
                          <span className="rating">
                            ★ {movie.rating}
                          </span>
                        </td>

                        <td>
                          <span
                            className={
                              movie.status === "Active"
                                ? "status active-status"
                                : "status inactive-status"
                            }
                          >
                            {movie.status}
                          </span>
                        </td>

                        <td>{movie.added}</td>

                        <td>
                          <div className="action-buttons">
                            <button className="edit-button">✎</button>
                            <button className="delete-button">♙</button>
                          </div>
                        </td>

                      </tr>
                    ))}

                  </tbody>

                </table>

              </div>

              <div className="table-footer">
                Showing 1 to {filteredMovies.length} of 512 movies

                <div className="pagination">
                  <button>‹</button>
                  <button className="current">1</button>
                  <button>2</button>
                  <button>3</button>
                  <button>...</button>
                  <button>32</button>
                  <button>›</button>
                </div>
              </div>

            </div>

            {/* USERS */}
            <div className="dashboard-card users-card">

              <div className="card-title-row">

                <div>
                  <h2>Manage Users</h2>
                  <p>View and manage user accounts.</p>
                </div>

              </div>

              <div className="filters users-filter">

                <div className="search-box">
                  <span>⌕</span>

                  <input
                    type="text"
                    placeholder="Search users by name or email..."
                    value={userSearch}
                    onChange={(e) => setUserSearch(e.target.value)}
                  />
                </div>

              </div>

              <div className="table-wrapper">

                <table className="dashboard-table users-table">

                  <thead>
                    <tr>
                      <th>#</th>
                      <th>User</th>
                      <th>Role</th>
                      <th>Status</th>
                      <th>Joined On</th>
                      <th>Actions</th>
                    </tr>
                  </thead>

                  <tbody>

                    {filteredUsers.map((user) => (
                      <tr key={user.id}>

                        <td>{user.id}</td>

                        <td>
                          <div className="user-name">

                            <div className="small-avatar">
                              {user.name.charAt(0)}
                            </div>

                            <div>
                              <strong>{user.name}</strong>
                              <small>{user.email}</small>
                            </div>

                          </div>
                        </td>

                        <td>
                          <span
                            className={
                              user.role === "Admin"
                                ? "role admin-role"
                                : "role user-role"
                            }
                          >
                            {user.role}
                          </span>
                        </td>

                        <td>
                          <span className="status active-status">
                            {user.status}
                          </span>
                        </td>

                        <td>{user.joined}</td>

                        <td>
                          <button className="delete-button">♙</button>
                        </td>

                      </tr>
                    ))}

                  </tbody>

                </table>

              </div>

              <div className="table-footer">
                Showing 1 to 5 of 156 users

                <div className="pagination">
                  <button>‹</button>
                  <button className="current">1</button>
                  <button>2</button>
                  <button>3</button>
                  <button>...</button>
                  <button>32</button>
                  <button>›</button>
                </div>
              </div>

            </div>

          </section>

          {/* QUICK ACTIONS */}
          <section className="dashboard-card quick-card">

            <div className="quick-header">
              <div>
                <h2>Quick Actions</h2>
                <p>Frequently used admin actions</p>
              </div>
            </div>

            <div className="quick-actions">

              <button className="quick-action">
                <div className="quick-icon purple-bg">+</div>
                <div>
                  <strong>Add New Movie</strong>
                  <span>Add a movie to the system</span>
                </div>
              </button>

              <button className="quick-action">
                <div className="quick-icon green-bg">♙</div>
                <div>
                  <strong>Manage Users</strong>
                  <span>View all registered users</span>
                </div>
              </button>

              <button className="quick-action">
                <div className="quick-icon blue-bg">★</div>
                <div>
                  <strong>View Ratings</strong>
                  <span>Check movie ratings</span>
                </div>
              </button>

            </div>

          </section>

        </div>

      </main>

    </div>
  );
}

export default Dashboard;