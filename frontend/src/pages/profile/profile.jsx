import React, { useState } from "react";
import "./profile.css";
import Sidebar from "../../components/Sidebar";

function Profile() {
  const [selectedGenres, setSelectedGenres] = useState([
    "Action",
    "Animation",
    "Drama",
    "Romance",
    "Sci-Fi",
  ]);

  const [profile, setProfile] = useState({
    fullName: "Chiranjeevi Jayalathge",
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
      <style>{`

        * {
          box-sizing: border-box;
        }

        html,
        body,
        #root {
          margin: 0;
          padding: 0;
          width: 100%;
          min-height: 100%;
        }

        body {
          overflow-x: hidden;
        }

        /* =========================
           MAIN APPLICATION
        ========================= */

        .profile-app {
          min-height: 100vh;
          width: 100%;
          background: #f4f5fb;
          display: flex;
        }

        /*
          IMPORTANT:
          Your Sidebar is approximately 220px wide.
          The content therefore starts after 220px.
        */

        .profile-main {
          margin-left: 220px;
          width: calc(100% - 220px);
          min-width: 0;
          min-height: 100vh;
          padding: 24px 30px 45px;
          overflow-x: hidden;
        }

        /* =========================
           TOP BAR
        ========================= */

        .profile-topbar {
          width: 100%;
          min-height: 45px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 25px;
          margin-bottom: 28px;
        }

        .profile-search {
          width: min(720px, 65%);
          height: 42px;
          background: #ffffff;
          border: 1px solid #e1e3ef;
          border-radius: 9px;
          display: flex;
          align-items: center;
          padding: 0 14px;
          box-shadow: 0 2px 8px rgba(35, 34, 72, 0.03);
        }

        .profile-search-icon {
          width: 24px;
          color: #8790a9;
          font-size: 21px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-right: 8px;
        }

        .profile-search-text {
          flex: 1;
          min-width: 0;
          color: #8c93a8;
          font-size: 12px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .profile-filter {
          border: none;
          background: transparent;
          color: #6030e3;
          font-size: 11px;
          font-weight: 600;
          cursor: pointer;
          white-space: nowrap;
        }

        .profile-user-area {
          display: flex;
          align-items: center;
          gap: 10px;
          flex-shrink: 0;
        }

        .profile-notification {
          position: relative;
          width: 30px;
          height: 35px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #69718b;
          font-size: 21px;
        }

        .profile-notification-badge {
          position: absolute;
          top: 1px;
          right: 0;
          width: 15px;
          height: 15px;
          border-radius: 50%;
          background: #6730e5;
          color: white;
          font-size: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
        }

        .profile-user-avatar {
          width: 35px;
          height: 35px;
          border-radius: 50%;
          background: linear-gradient(135deg, #f1c9a8, #8c4d34);
          color: #ffffff;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          font-size: 14px;
          margin-left: 5px;
        }

        .profile-user-name {
          color: #252d47;
          font-size: 12px;
          font-weight: 600;
          white-space: nowrap;
        }

        .profile-down-arrow {
          color: #747b91;
          font-size: 15px;
          margin-left: 2px;
        }

        /* =========================
           PAGE HEADER
        ========================= */

        .profile-header {
          width: 100%;
          display: flex;
          align-items: center;
          gap: 13px;
          margin-bottom: 22px;
        }

        .profile-title-icon {
          width: 42px;
          height: 42px;
          flex-shrink: 0;
          border-radius: 8px;
          background: linear-gradient(135deg, #5b22df, #7735ec);
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 22px;
          box-shadow: 0 5px 14px rgba(96, 44, 224, 0.22);
        }

        .profile-title {
          margin: 0;
          color: #18203a;
          font-size: 23px;
          line-height: 1.2;
          font-weight: 700;
        }

        .profile-subtitle {
          margin: 5px 0 0;
          color: #737b91;
          font-size: 11px;
          line-height: 1.4;
        }

        /* =========================
           MAIN GRID
        ========================= */

        .profile-grid {
          width: 100%;
          max-width: 1400px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: minmax(0, 1.25fr) minmax(360px, 0.75fr);
          gap: 20px;
          align-items: start;
        }

        .profile-column {
          min-width: 0;
        }

        /* =========================
           CARDS
        ========================= */

        .profile-card {
          width: 100%;
          background: #ffffff;
          border: 1px solid #e8e9f1;
          border-radius: 10px;
          padding: 20px;
          margin-bottom: 18px;
          box-shadow: 0 2px 10px rgba(31, 34, 69, 0.025);
        }

        .profile-card-title {
          margin: 0 0 5px;
          color: #1d2540;
          font-size: 14px;
          line-height: 1.3;
          font-weight: 700;
        }

        .profile-card-description {
          margin: 0 0 17px;
          color: #7c8399;
          font-size: 10px;
          line-height: 1.45;
        }

        /* =========================
           PROFILE INFORMATION
        ========================= */

        .profile-info-layout {
          width: 100%;
          display: grid;
          grid-template-columns: 120px minmax(0, 1fr);
          gap: 22px;
          align-items: start;
        }

        .profile-avatar-section {
          position: relative;
          text-align: center;
          min-width: 0;
        }

        .profile-large-avatar {
          width: 98px;
          height: 98px;
          border-radius: 50%;
          margin: 3px auto 10px;
          background: linear-gradient(145deg, #f0f0f2, #ffffff);
          border: 1px solid #e0e1e8;
          position: relative;
          overflow: hidden;
        }

        .profile-avatar-head {
          position: absolute;
          width: 31px;
          height: 36px;
          border-radius: 50%;
          background: linear-gradient(145deg, #3b2b27, #171514);
          left: 33px;
          top: 17px;
        }

        .profile-avatar-body {
          position: absolute;
          width: 63px;
          height: 45px;
          border-radius: 45px 45px 0 0;
          background: linear-gradient(145deg, #171b25, #30384b);
          left: 17px;
          top: 52px;
        }

        .profile-camera-button {
          position: absolute;
          right: 0;
          top: 75px;
          width: 29px;
          height: 29px;
          border-radius: 50%;
          border: 3px solid #ffffff;
          background: #6330e6;
          color: #ffffff;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 12px;
        }

        .profile-image-text {
          max-width: 115px;
          margin: 0 auto;
          color: #8a90a1;
          font-size: 8px;
          line-height: 1.45;
        }

        /* =========================
           FORM
        ========================= */

        .profile-form {
          width: 100%;
          min-width: 0;
        }

        .profile-form-group {
          width: 100%;
          margin-bottom: 12px;
        }

        .profile-label {
          display: block;
          margin: 0 0 6px;
          color: #39415a;
          font-size: 9px;
          line-height: 1.2;
          font-weight: 600;
        }

        .profile-input {
          width: 100%;
          height: 34px;
          display: block;
          border: 1px solid #dfe2ec;
          border-radius: 6px;
          padding: 0 11px;
          color: #3f465b;
          background: #ffffff;
          font-size: 10px;
          outline: none;
          transition: border-color 0.2s, box-shadow 0.2s;
        }

        .profile-input::placeholder {
          color: #a0a6b6;
        }

        .profile-input:focus {
          border-color: #6331e8;
          box-shadow: 0 0 0 3px rgba(99, 49, 232, 0.1);
        }

        .profile-button-row {
          width: 100%;
          display: flex;
          justify-content: flex-end;
          align-items: center;
          margin-top: 8px;
        }

        .profile-save-button {
          height: 34px;
          border: none;
          border-radius: 6px;
          padding: 0 15px;
          background: #5c28df;
          color: #ffffff;
          font-size: 9px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
        }

        .profile-save-button:hover {
          background: #5420d4;
          transform: translateY(-1px);
        }

        /* =========================
           PASSWORD
        ========================= */

        .password-group {
          margin-bottom: 12px;
        }

        .password-wrapper {
          position: relative;
          width: 100%;
        }

        .password-wrapper .profile-input {
          padding-right: 38px;
        }

        .password-eye {
          position: absolute;
          right: 11px;
          top: 50%;
          transform: translateY(-50%);
          color: #8b91a5;
          font-size: 12px;
          cursor: pointer;
          user-select: none;
        }

        .profile-full-button {
          width: 100%;
          height: 34px;
          margin-top: 5px;
          border: none;
          border-radius: 6px;
          background: #5c28df;
          color: #ffffff;
          font-size: 9px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
        }

        .profile-full-button:hover {
          background: #5420d4;
          transform: translateY(-1px);
        }

        /* =========================
           GENRES
        ========================= */

        .genre-grid {
          width: 100%;
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: 9px;
        }

        .genre-card {
          width: 100%;
          min-width: 0;
          height: 48px;
          border: 1px solid #e4e5ed;
          border-radius: 7px;
          background: #ffffff;
          display: flex;
          align-items: center;
          padding: 0 10px;
          gap: 8px;
          position: relative;
          cursor: pointer;
          text-align: left;
          transition: all 0.2s;
          overflow: hidden;
        }

        .genre-card:hover {
          border-color: #7545ee;
          transform: translateY(-1px);
        }

        .genre-card.selected {
          border-color: #a88aff;
          background: #faf8ff;
          box-shadow: 0 0 0 1px rgba(108, 48, 228, 0.05);
        }

        .genre-icon {
          width: 23px;
          min-width: 23px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 17px;
        }

        .genre-name {
          min-width: 0;
          padding-right: 15px;
          color: #4e566d;
          font-size: 9px;
          font-weight: 500;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .genre-check {
          position: absolute;
          right: 5px;
          top: 5px;
          width: 14px;
          height: 14px;
          border-radius: 50%;
          background: #6130e6;
          color: #ffffff;
          font-size: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
        }

        .genre-hint {
          margin: 12px 0 0;
          color: #9aa0b0;
          font-size: 8px;
        }

        /* =========================
           ACCOUNT INFORMATION
        ========================= */

        .account-list {
          width: 100%;
        }

        .account-row {
          width: 100%;
          min-height: 44px;
          display: grid;
          grid-template-columns: 24px minmax(0, 1fr) auto;
          align-items: center;
          column-gap: 8px;
          border-bottom: 1px solid #eeeeF3;
        }

        .account-row:last-child {
          border-bottom: none;
        }

        .account-icon {
          color: #777f98;
          font-size: 14px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .account-label {
          color: #717991;
          font-size: 9px;
          min-width: 0;
        }

        .account-value {
          color: #697188;
          font-size: 9px;
          font-weight: 600;
          text-align: right;
          white-space: nowrap;
        }

        /* =========================
           DESKTOP LARGE SCREENS
        ========================= */

        @media (min-width: 1400px) {
          .profile-main {
            padding-left: 40px;
            padding-right: 40px;
          }

          .profile-grid {
            gap: 24px;
          }

          .profile-card {
            padding: 22px;
          }
        }

        /* =========================
           TABLET
        ========================= */

        @media (max-width: 1100px) {
          .profile-main {
            padding: 22px;
          }

          .profile-grid {
            grid-template-columns: 1fr;
          }

          .genre-grid {
            grid-template-columns: repeat(4, minmax(0, 1fr));
          }
        }

        /* =========================
           SMALL TABLET
        ========================= */

        @media (max-width: 850px) {
          .profile-main {
            margin-left: 0;
            width: 100%;
            padding: 20px;
          }

          .profile-topbar {
            gap: 15px;
          }

          .profile-search {
            width: 100%;
            max-width: none;
          }

          .profile-info-layout {
            grid-template-columns: 110px minmax(0, 1fr);
            gap: 18px;
          }

          .genre-grid {
            grid-template-columns: repeat(3, minmax(0, 1fr));
          }
        }

        /* =========================
           MOBILE
        ========================= */

        @media (max-width: 650px) {
          .profile-main {
            padding: 16px;
          }

          .profile-topbar {
            min-height: auto;
            flex-wrap: wrap;
            margin-bottom: 22px;
          }

          .profile-search {
            order: 1;
            width: 100%;
          }

          .profile-user-area {
            order: 2;
            margin-left: auto;
          }

          .profile-header {
            align-items: flex-start;
          }

          .profile-title-icon {
            width: 38px;
            height: 38px;
          }

          .profile-title {
            font-size: 20px;
          }

          .profile-subtitle {
            font-size: 10px;
          }

          .profile-card {
            padding: 16px;
          }

          .profile-info-layout {
            grid-template-columns: 1fr;
          }

          .profile-avatar-section {
            margin-bottom: 10px;
          }

          .profile-form-group {
            margin-bottom: 13px;
          }

          .genre-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }

          .account-row {
            grid-template-columns: 22px minmax(0, 1fr) auto;
          }

          .account-value {
            font-size: 8px;
          }
        }

        /* =========================
           VERY SMALL MOBILE
        ========================= */

        @media (max-width: 420px) {
          .profile-main {
            padding: 12px;
          }

          .profile-card {
            padding: 14px;
          }

          .genre-grid {
            grid-template-columns: 1fr 1fr;
            gap: 7px;
          }

          .genre-card {
            height: 44px;
            padding: 0 7px;
          }

          .genre-icon {
            font-size: 15px;
          }

          .genre-name {
            font-size: 8px;
          }

          .account-value {
            max-width: 110px;
            overflow: hidden;
            text-overflow: ellipsis;
          }
        }

      `}</style>

      <div className="profile-app">

        {/* =========================
            SIDEBAR
        ========================= */}

        <Sidebar />

        {/* =========================
            MAIN CONTENT
        ========================= */}

        <main className="profile-main">

          {/* =========================
              TOP BAR
          ========================= */}

          <div className="profile-topbar">

            <div className="profile-search">

              <span className="profile-search-icon">
                ⌕
              </span>

              <span className="profile-search-text">
                Search movies by title, genre, actor...
              </span>

              <button
                type="button"
                className="profile-filter"
              >
                ⚙ &nbsp; Filters
              </button>

            </div>

            <div className="profile-user-area">

              <div className="profile-notification">

                ♧

                <span className="profile-notification-badge">
                  3
                </span>

              </div>

              <div className="profile-user-avatar">
                C
              </div>

              <span className="profile-user-name">
                Chiranjeevi
              </span>

              <span className="profile-down-arrow">
                ⌄
              </span>

            </div>

          </div>

          {/* =========================
              PAGE HEADER
          ========================= */}

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

          {/* =========================
              MAIN CONTENT GRID
          ========================= */}

          <div className="profile-grid">

            {/* ===================================
                LEFT COLUMN
            =================================== */}

            <div className="profile-column">

              {/* =========================
                  PROFILE INFORMATION
              ========================= */}

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
                      JPG, PNG or GIF, Max size 2MB.
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
                        onChange={(e) =>
                          updateProfile(
                            "fullName",
                            e.target.value
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
                        onChange={(e) =>
                          updateProfile(
                            "email",
                            e.target.value
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
                        onChange={(e) =>
                          updateProfile(
                            "username",
                            e.target.value
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

              {/* =========================
                  PREFERRED GENRES
              ========================= */}

              <section className="profile-card">

                <h2 className="profile-card-title">
                  Preferred Genres
                </h2>

                <p className="profile-card-description">
                  Select your favorite genres to get better movie
                  recommendations.
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
                  You can choose multiple genres
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

            {/* ===================================
                RIGHT COLUMN
            =================================== */}

            <div className="profile-column">

              {/* =========================
                  CHANGE PASSWORD
              ========================= */}

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
                      onChange={(e) =>
                        updatePasswordField(
                          "currentPassword",
                          e.target.value
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
                      onChange={(e) =>
                        updatePasswordField(
                          "newPassword",
                          e.target.value
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
                      onChange={(e) =>
                        updatePasswordField(
                          "confirmPassword",
                          e.target.value
                        )
                      }
                    />

                    <span className="password-eye">
                      ◉
                    </span>

                  </div>

                </div>

                {/* UPDATE PASSWORD */}

                <button
                  type="button"
                  className="profile-full-button"
                  onClick={updatePassword}
                >
                  ♙ &nbsp; Update Password
                </button>

              </section>

              {/* =========================
                  ACCOUNT INFORMATION
              ========================= */}

              <section className="profile-card">

                <h2 className="profile-card-title">
                  Account Information
                </h2>

                <p className="profile-card-description">
                  View your account details and activity.
                </p>

                <div className="account-list">

                  {/* MEMBER SINCE */}

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

                  {/* ACCOUNT TYPE */}

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

                  {/* TOTAL RATINGS */}

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

                  {/* AVERAGE RATING */}

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

                  {/* LAST LOGIN */}

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

        </main>

      </div>

    </div>
  );
}

export default Profile;