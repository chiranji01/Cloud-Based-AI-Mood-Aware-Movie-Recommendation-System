import React, { useState } from "react";
import "./profile.css";

import Sidebar from "../../components/Sidebar";
import Topbar from "../../components/Topbar";

function Profile() {
  const [selectedGenres, setSelectedGenres] = useState([
    "Action",
    "Animation",
    "Drama",
    "Romance",
    "Sci-Fi",
  ]);

  const [profile, setProfile] = useState({
    fullName: "Chiranji Jayalathge",
    email: "chiranjii@example.com",
    username: "chiranjii01",
  });

  const [passwords, setPasswords] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const genres = [
    { name: "Action", icon: "🚀" },
    { name: "Adventure", icon: "⛰️" },
    { name: "Animation", icon: "🎨" },
    { name: "Comedy", icon: "😂" },
    { name: "Crime", icon: "😎" },
    { name: "Drama", icon: "🎭" },
    { name: "Fantasy", icon: "🧙" },
    { name: "Horror", icon: "👻" },
    { name: "Romance", icon: "❤️" },
    { name: "Sci-Fi", icon: "🛸" },
    { name: "Thriller", icon: "🔪" },
    { name: "Documentary", icon: "🎬" },
  ];

  const toggleGenre = (genre) => {
    setSelectedGenres((current) =>
      current.includes(genre)
        ? current.filter((item) => item !== genre)
        : [...current, genre]
    );
  };

  const updateProfile = (field, value) => {
    setProfile((current) => ({
      ...current,
      [field]: value,
    }));
  };

  const updatePasswordField = (field, value) => {
    setPasswords((current) => ({
      ...current,
      [field]: value,
    }));
  };

  const saveChanges = () => {
    alert("Profile changes saved successfully!");
  };

  const updatePassword = () => {
    if (
      !passwords.currentPassword ||
      !passwords.newPassword ||
      !passwords.confirmPassword
    ) {
      alert("Please fill in all password fields.");
      return;
    }

    if (passwords.newPassword !== passwords.confirmPassword) {
      alert("New passwords do not match.");
      return;
    }

    alert("Password updated successfully!");

    setPasswords({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
  };

  return (
    <div className="profile-page">

      <Sidebar />

      <main className="profile-main">

        <Topbar />

        <div className="profile-content">

          {/* ================= PAGE HEADER ================= */}

          <div className="profile-header">

            <div className="profile-title-icon">
              ♙
            </div>

            <div>
              <h1 className="profile-title">
                Profile
              </h1>

              <p className="profile-subtitle">
                Manage your personal information and preferences.
              </p>
            </div>

          </div>

          {/* ================= MAIN GRID ================= */}

          <div className="profile-grid">

            {/* =================================================
                LEFT COLUMN
            ================================================= */}

            <div className="profile-column">

              {/* ================= PROFILE INFO ================= */}

              <section className="profile-card">

                <h2 className="profile-card-title">
                  Profile Information
                </h2>

                <p className="profile-card-description">
                  Update your personal information and profile details.
                </p>

                <div className="profile-info-layout">

                  {/* AVATAR */}

                  <div className="profile-avatar-section">

                    <div className="profile-large-avatar">

                      <div className="profile-avatar-head"></div>

                      <div className="profile-avatar-body"></div>

                    </div>

                    <button
                      type="button"
                      className="profile-camera-button"
                      aria-label="Change profile picture"
                    >
                      ▣
                    </button>

                    <p className="profile-image-text">
                      JPG, PNG or GIF. Max size 2MB.
                    </p>

                  </div>

                  {/* FORM */}

                  <div className="profile-form">

                    {/* FULL NAME */}

                    <div className="profile-form-group">

                      <label className="profile-label">
                        Full Name
                      </label>

                      <input
                        className="profile-input"
                        type="text"
                        value={profile.fullName}
                        onChange={(event) =>
                          updateProfile(
                            "fullName",
                            event.target.value
                          )
                        }
                      />

                    </div>

                    {/* EMAIL */}

                    <div className="profile-form-group">

                      <label className="profile-label">
                        Email Address
                      </label>

                      <input
                        className="profile-input"
                        type="email"
                        value={profile.email}
                        onChange={(event) =>
                          updateProfile(
                            "email",
                            event.target.value
                          )
                        }
                      />

                    </div>

                    {/* USERNAME */}

                    <div className="profile-form-group">

                      <label className="profile-label">
                        Username
                      </label>

                      <input
                        className="profile-input"
                        type="text"
                        value={profile.username}
                        onChange={(event) =>
                          updateProfile(
                            "username",
                            event.target.value
                          )
                        }
                      />

                    </div>

                    {/* SAVE BUTTON */}

                    <div className="profile-button-row">

                      <button
                        type="button"
                        className="profile-save-button"
                        onClick={saveChanges}
                      >
                        ▣ &nbsp; Save Changes
                      </button>

                    </div>

                  </div>

                </div>

              </section>

              {/* ================= PREFERRED GENRES ================= */}

              <section className="profile-card">

                <h2 className="profile-card-title">
                  Preferred Genres
                </h2>

                <p className="profile-card-description">
                  Select your favorite genres to get better movie recommendations.
                </p>

                <div className="genre-grid">

                  {genres.map((genre) => {
                    const selected =
                      selectedGenres.includes(genre.name);

                    return (
                      <button
                        type="button"
                        key={genre.name}
                        className={`genre-card ${
                          selected ? "selected" : ""
                        }`}
                        onClick={() =>
                          toggleGenre(genre.name)
                        }
                      >

                        <span className="genre-icon">
                          {genre.icon}
                        </span>

                        <span className="genre-name">
                          {genre.name}
                        </span>

                        {selected && (
                          <span className="genre-check">
                            ✓
                          </span>
                        )}

                      </button>
                    );
                  })}

                </div>

                <p className="genre-hint">
                  You can choose multiple genres.
                </p>

                <div className="profile-button-row">

                  <button
                    type="button"
                    className="profile-save-button"
                    onClick={saveChanges}
                  >
                    ▣ &nbsp; Save Changes
                  </button>

                </div>

              </section>

            </div>

            {/* =================================================
                RIGHT COLUMN
            ================================================= */}

            <div className="profile-column">

              {/* ================= CHANGE PASSWORD ================= */}

              <section className="profile-card">

                <h2 className="profile-card-title">
                  Change Password
                </h2>

                <p className="profile-card-description">
                  Update your password to keep your account secure.
                </p>

                {/* CURRENT PASSWORD */}

                <div className="password-group">

                  <label className="profile-label">
                    Current Password
                  </label>

                  <div className="password-wrapper">

                    <input
                      className="profile-input"
                      type="password"
                      placeholder="Enter your current password"
                      value={passwords.currentPassword}
                      onChange={(event) =>
                        updatePasswordField(
                          "currentPassword",
                          event.target.value
                        )
                      }
                    />

                    <span className="password-eye">
                      ◉
                    </span>

                  </div>

                </div>

                {/* NEW PASSWORD */}

                <div className="password-group">

                  <label className="profile-label">
                    New Password
                  </label>

                  <div className="password-wrapper">

                    <input
                      className="profile-input"
                      type="password"
                      placeholder="Enter your new password"
                      value={passwords.newPassword}
                      onChange={(event) =>
                        updatePasswordField(
                          "newPassword",
                          event.target.value
                        )
                      }
                    />

                    <span className="password-eye">
                      ◉
                    </span>

                  </div>

                </div>

                {/* CONFIRM PASSWORD */}

                <div className="password-group">

                  <label className="profile-label">
                    Confirm New Password
                  </label>

                  <div className="password-wrapper">

                    <input
                      className="profile-input"
                      type="password"
                      placeholder="Confirm your new password"
                      value={passwords.confirmPassword}
                      onChange={(event) =>
                        updatePasswordField(
                          "confirmPassword",
                          event.target.value
                        )
                      }
                    />

                    <span className="password-eye">
                      ◉
                    </span>

                  </div>

                </div>

                <button
                  type="button"
                  className="profile-full-button"
                  onClick={updatePassword}
                >
                  ♙ &nbsp; Update Password
                </button>

              </section>

              {/* ================= ACCOUNT INFORMATION ================= */}

              <section className="profile-card">

                <h2 className="profile-card-title">
                  Account Information
                </h2>

                <p className="profile-card-description">
                  View your account details and activity.
                </p>

                <div className="account-list">

                  <div className="account-row">

                    <span className="account-icon">
                      ▣
                    </span>

                    <span className="account-label">
                      Member Since
                    </span>

                    <strong className="account-value">
                      10 April 2024
                    </strong>

                  </div>

                  <div className="account-row">

                    <span className="account-icon">
                      ♔
                    </span>

                    <span className="account-label">
                      Account Type
                    </span>

                    <strong className="account-value">
                      Standard
                    </strong>

                  </div>

                  <div className="account-row">

                    <span className="account-icon">
                      ☆
                    </span>

                    <span className="account-label">
                      Total Ratings
                    </span>

                    <strong className="account-value">
                      18 Movies
                    </strong>

                  </div>

                  <div className="account-row">

                    <span className="account-icon">
                      ▥
                    </span>

                    <span className="account-label">
                      Average Rating
                    </span>

                    <strong className="account-value">
                      4.3 / 5
                    </strong>

                  </div>

                  <div className="account-row">

                    <span className="account-icon">
                      ◷
                    </span>

                    <span className="account-label">
                      Last Login
                    </span>

                    <strong className="account-value">
                      06 May 2024, 10:30 AM
                    </strong>

                  </div>

                </div>

              </section>

            </div>

          </div>

        </div>

      </main>

    </div>
  );
}

export default Profile;