import React, { useState } from "react";

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

  const saveChanges = () => {
    alert("Profile changes saved successfully!");
  };

  const updatePassword = () => {
    alert("Password updated successfully!");
  };

  return (
    <div style={styles.page}>
      <style>{`
        * {
          box-sizing: border-box;
        }

        .profile-input:focus {
          outline: none;
          border-color: #6331e8 !important;
          box-shadow: 0 0 0 3px rgba(99, 49, 232, 0.10);
        }

        .genre-card:hover {
          border-color: #7545ee !important;
          transform: translateY(-1px);
        }

        .purple-button:hover {
          background: #5420d4 !important;
          transform: translateY(-1px);
        }

        .sidebar-action:hover {
          background: rgba(99, 49, 232, 0.12) !important;
        }

        @media (max-width: 1000px) {
          .profile-grid {
            grid-template-columns: 1fr !important;
          }
        }

        @media (max-width: 700px) {
          .profile-page-content {
            padding: 20px !important;
          }

          .profile-header-row {
            flex-direction: column !important;
            align-items: flex-start !important;
          }

          .profile-info-layout {
            grid-template-columns: 1fr !important;
          }

          .genre-grid {
            grid-template-columns: repeat(2, 1fr) !important;
          }
        }
      `}</style>

      {/* Main application area */}
      <div style={styles.appContainer}>

        {/* Sidebar */}
        <aside style={styles.sidebar}>

          <div style={styles.logo}>
            <div style={styles.logoCircle}>✣</div>
            <span>MoodFlix</span>
          </div>

          <div style={styles.navigation}>
            <a href="/home" style={styles.navItem}>
              <span style={styles.navIcon}>⌂</span>
              Home
            </a>

            <a href="/mood" style={styles.navItem}>
              <span style={styles.navIcon}>☺</span>
              Mood
            </a>

            <a href="/ratings" style={styles.navItem}>
              <span style={styles.navIcon}>☆</span>
              My Ratings
            </a>

            <a
              href="/profile"
              style={{
                ...styles.navItem,
                ...styles.activeNavItem,
              }}
            >
              <span style={styles.navIcon}>♙</span>
              Profile
            </a>
          </div>

          <div style={styles.discoverCard}>
            <div style={styles.movieIllustration}>
              🎬
              <span>🍿</span>
            </div>

            <div style={styles.discoverTitle}>
              Discover more
              <br />
              movies for every mood!
            </div>

            <button
              className="purple-button"
              style={styles.moodButton}
              onClick={() => (window.location.href = "/mood")}
            >
              ☺ &nbsp; Choose Your Mood
            </button>
          </div>

          <div className="sidebar-action" style={styles.helpCard}>
            <div style={styles.helpIcon}>?</div>
            <div>
              <strong style={styles.helpTitle}>Need help?</strong>
              <span style={styles.helpText}>We're here to help</span>
            </div>
            <span style={styles.arrow}>›</span>
          </div>

          <div style={styles.logout}>
            <span style={styles.logoutIcon}>⇥</span>
            Logout
          </div>
        </aside>

        {/* Content */}
        <main className="profile-page-content" style={styles.content}>

          {/* Top bar */}
          <div style={styles.topBar}>
            <div style={styles.searchBox}>
              <span style={styles.searchIcon}>⌕</span>
              <span style={styles.searchText}>
                Search movies by title, genre, actor...
              </span>
              <button style={styles.filterButton}>
                ⚙ &nbsp; Filters
              </button>
            </div>

            <div style={styles.userArea}>
              <span style={styles.notification}>♧</span>
              <span style={styles.notificationBadge}>3</span>

              <div style={styles.userAvatar}>
                C
              </div>

              <span style={styles.userName}>Chiranjeevi</span>
              <span style={styles.downArrow}>⌄</span>
            </div>
          </div>

          {/* Page heading */}
          <div className="profile-header-row" style={styles.profileHeader}>
            <div style={styles.profileTitleIcon}>♙</div>

            <div>
              <h1 style={styles.title}>Profile</h1>
              <p style={styles.subtitle}>
                Manage your personal information and preferences.
              </p>
            </div>
          </div>

          {/* Main grid */}
          <div className="profile-grid" style={styles.profileGrid}>

            {/* LEFT COLUMN */}
            <div>

              {/* Profile Information */}
              <section style={styles.card}>
                <h2 style={styles.cardTitle}>Profile Information</h2>

                <div className="profile-info-layout" style={styles.profileInfoLayout}>

                  {/* Avatar */}
                  <div style={styles.avatarSection}>
                    <div style={styles.largeAvatar}>
                      <div style={styles.avatarHead}></div>
                      <div style={styles.avatarBody}></div>
                    </div>

                    <button style={styles.cameraButton}>▣</button>

                    <p style={styles.imageText}>
                      JPG, PNG or GIF, Max size 2MB.
                    </p>
                  </div>

                  {/* Form */}
                  <div style={styles.formSection}>

                    <label style={styles.label}>Full Name</label>
                    <input
                      className="profile-input"
                      value={profile.fullName}
                      onChange={(e) =>
                        updateProfile("fullName", e.target.value)
                      }
                      style={styles.input}
                    />

                    <label style={styles.label}>Email Address</label>
                    <input
                      className="profile-input"
                      value={profile.email}
                      onChange={(e) =>
                        updateProfile("email", e.target.value)
                      }
                      style={styles.input}
                    />

                    <label style={styles.label}>Username</label>
                    <input
                      className="profile-input"
                      value={profile.username}
                      onChange={(e) =>
                        updateProfile("username", e.target.value)
                      }
                      style={styles.input}
                    />

                    <div style={styles.buttonRow}>
                      <button
                        className="purple-button"
                        onClick={saveChanges}
                        style={styles.saveButton}
                      >
                        ▣ &nbsp; Save Changes
                      </button>
                    </div>

                  </div>
                </div>
              </section>

              {/* Preferred Genres */}
              <section style={styles.card}>
                <h2 style={styles.cardTitle}>Preferred Genres</h2>

                <p style={styles.cardDescription}>
                  Select your favorite genres to get better movie recommendations.
                </p>

                <div className="genre-grid" style={styles.genreGrid}>
                  {genres.map((genre) => {
                    const selected = selectedGenres.includes(genre.name);

                    return (
                      <button
                        key={genre.name}
                        className="genre-card"
                        onClick={() => toggleGenre(genre.name)}
                        style={{
                          ...styles.genreCard,
                          ...(selected ? styles.selectedGenre : {}),
                        }}
                      >
                        <span style={styles.genreIcon}>
                          {genre.icon}
                        </span>

                        <span style={styles.genreName}>
                          {genre.name}
                        </span>

                        {selected && (
                          <span style={styles.checkMark}>✓</span>
                        )}
                      </button>
                    );
                  })}
                </div>

                <p style={styles.genreHint}>
                  You can choose multiple genres
                </p>

                <div style={styles.buttonRow}>
                  <button
                    className="purple-button"
                    onClick={saveChanges}
                    style={styles.saveButton}
                  >
                    ▣ &nbsp; Save Changes
                  </button>
                </div>
              </section>

            </div>

            {/* RIGHT COLUMN */}
            <div>

              {/* Change Password */}
              <section style={styles.card}>
                <h2 style={styles.cardTitle}>Change Password</h2>

                <p style={styles.cardDescription}>
                  Update your password to keep your account secure.
                </p>

                <label style={styles.label}>Current Password</label>
                <div style={styles.passwordWrapper}>
                  <input
                    className="profile-input"
                    type="password"
                    placeholder="Enter your current password"
                    style={styles.input}
                  />
                  <span style={styles.eye}>◉</span>
                </div>

                <label style={styles.label}>New Password</label>
                <div style={styles.passwordWrapper}>
                  <input
                    className="profile-input"
                    type="password"
                    placeholder="Enter your new password"
                    style={styles.input}
                  />
                  <span style={styles.eye}>◉</span>
                </div>

                <label style={styles.label}>Confirm New Password</label>
                <div style={styles.passwordWrapper}>
                  <input
                    className="profile-input"
                    type="password"
                    placeholder="Confirm your new password"
                    style={styles.input}
                  />
                  <span style={styles.eye}>◉</span>
                </div>

                <button
                  className="purple-button"
                  onClick={updatePassword}
                  style={styles.fullButton}
                >
                  ♙ &nbsp; Update Password
                </button>
              </section>

              {/* Account Information */}
              <section style={styles.card}>
                <h2 style={styles.cardTitle}>Account Information</h2>

                <p style={styles.cardDescription}>
                  View your account details and activity.
                </p>

                <div style={styles.accountRow}>
                  <span style={styles.accountIcon}>▣</span>
                  <span style={styles.accountLabel}>Member Since</span>
                  <strong style={styles.accountValue}>10 April 2024</strong>
                </div>

                <div style={styles.accountRow}>
                  <span style={styles.accountIcon}>♔</span>
                  <span style={styles.accountLabel}>Account Type</span>
                  <strong style={styles.accountValue}>Standard</strong>
                </div>

                <div style={styles.accountRow}>
                  <span style={styles.accountIcon}>☆</span>
                  <span style={styles.accountLabel}>Total Ratings</span>
                  <strong style={styles.accountValue}>18 Movies</strong>
                </div>

                <div style={styles.accountRow}>
                  <span style={styles.accountIcon}>▥</span>
                  <span style={styles.accountLabel}>Average Rating</span>
                  <strong style={styles.accountValue}>4.3 / 5</strong>
                </div>

                <div
                  style={{
                    ...styles.accountRow,
                    borderBottom: "none",
                  }}
                >
                  <span style={styles.accountIcon}>◷</span>
                  <span style={styles.accountLabel}>Last Login</span>
                  <strong style={styles.accountValue}>
                    06 May 2024, 10:30 AM
                  </strong>
                </div>
              </section>

            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    width: "100%",
    background: "#f4f5fb",
    fontFamily:
      "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif",
    color: "#17203a",
  },

  appContainer: {
    minHeight: "100vh",
    display: "flex",
  },

  sidebar: {
    width: "220px",
    minHeight: "100vh",
    background:
      "linear-gradient(180deg, #080d25 0%, #090d23 55%, #070b1d 100%)",
    color: "white",
    padding: "24px 14px",
    position: "relative",
    flexShrink: 0,
  },

  logo: {
    display: "flex",
    alignItems: "center",
    gap: "9px",
    fontSize: "20px",
    fontWeight: "700",
    padding: "0 10px 30px",
  },

  logoCircle: {
    width: "27px",
    height: "27px",
    borderRadius: "50%",
    background: "#6732e8",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "19px",
  },

  navigation: {
    display: "flex",
    flexDirection: "column",
    gap: "5px",
  },

  navItem: {
    height: "42px",
    borderRadius: "7px",
    display: "flex",
    alignItems: "center",
    gap: "13px",
    padding: "0 12px",
    color: "#d9dced",
    textDecoration: "none",
    fontSize: "13px",
    fontWeight: "500",
  },

  activeNavItem: {
    background: "linear-gradient(90deg, #5521d9, #7131ec)",
    color: "#ffffff",
    boxShadow: "0 5px 16px rgba(91, 39, 224, 0.35)",
  },

  navIcon: {
    width: "19px",
    textAlign: "center",
    fontSize: "18px",
  },

  discoverCard: {
    margin: "45px 2px 16px",
    padding: "14px 11px 15px",
    borderRadius: "9px",
    background:
      "linear-gradient(145deg, rgba(65, 43, 139, .30), rgba(24, 24, 64, .55))",
    border: "1px solid rgba(117, 74, 231, .18)",
  },

  movieIllustration: {
    height: "105px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "72px",
    position: "relative",
  },

  discoverTitle: {
    fontSize: "11px",
    lineHeight: "1.45",
    color: "#f4f4ff",
    marginBottom: "12px",
  },

  moodButton: {
    width: "100%",
    border: "none",
    borderRadius: "6px",
    padding: "9px 5px",
    color: "white",
    background: "#5a24df",
    fontSize: "10px",
    fontWeight: "600",
    cursor: "pointer",
  },

  helpCard: {
    margin: "12px 2px",
    padding: "12px 9px",
    borderRadius: "8px",
    display: "flex",
    alignItems: "center",
    gap: "9px",
    background: "rgba(46, 46, 91, .45)",
    cursor: "pointer",
  },

  helpIcon: {
    width: "25px",
    height: "25px",
    borderRadius: "50%",
    background: "#6531e7",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "700",
  },

  helpTitle: {
    display: "block",
    fontSize: "10px",
  },

  helpText: {
    display: "block",
    fontSize: "8px",
    color: "#a9abc1",
    marginTop: "2px",
  },

  arrow: {
    marginLeft: "auto",
    color: "#a9abc1",
  },

  logout: {
    position: "absolute",
    bottom: "25px",
    left: "25px",
    display: "flex",
    alignItems: "center",
    gap: "12px",
    color: "#dddfee",
    fontSize: "12px",
    cursor: "pointer",
  },

  logoutIcon: {
    fontSize: "20px",
  },

  content: {
    flex: 1,
    padding: "24px 30px 40px",
    overflow: "auto",
  },

  topBar: {
    height: "45px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: "25px",
  },

  searchBox: {
    width: "52%",
    height: "40px",
    background: "#ffffff",
    border: "1px solid #e1e3ef",
    borderRadius: "8px",
    display: "flex",
    alignItems: "center",
    padding: "0 12px",
    boxShadow: "0 2px 8px rgba(35, 34, 72, .03)",
  },

  searchIcon: {
    fontSize: "23px",
    color: "#8790a9",
    marginRight: "9px",
  },

  searchText: {
    fontSize: "11px",
    color: "#8c93a8",
    flex: 1,
  },

  filterButton: {
    border: "none",
    background: "#ffffff",
    color: "#6030e3",
    fontSize: "10px",
    fontWeight: "600",
    cursor: "pointer",
  },

  userArea: {
    display: "flex",
    alignItems: "center",
    gap: "9px",
  },

  notification: {
    fontSize: "22px",
    color: "#69718b",
    position: "relative",
  },

  notificationBadge: {
    width: "14px",
    height: "14px",
    borderRadius: "50%",
    background: "#6730e5",
    color: "white",
    fontSize: "8px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginLeft: "-15px",
    marginTop: "-15px",
  },

  userAvatar: {
    width: "32px",
    height: "32px",
    borderRadius: "50%",
    background: "linear-gradient(135deg, #f1c9a8, #8c4d34)",
    color: "#ffffff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "700",
    fontSize: "14px",
    marginLeft: "7px",
  },

  userName: {
    fontSize: "11px",
    fontWeight: "600",
  },

  downArrow: {
    color: "#747b91",
    fontSize: "15px",
  },

  profileHeader: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    marginBottom: "18px",
  },

  profileTitleIcon: {
    width: "39px",
    height: "39px",
    borderRadius: "7px",
    background: "linear-gradient(135deg, #5b22df, #7735ec)",
    color: "white",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "23px",
    boxShadow: "0 5px 14px rgba(96, 44, 224, .22)",
  },

  title: {
    margin: 0,
    fontSize: "22px",
    lineHeight: "1.1",
    color: "#18203a",
  },

  subtitle: {
    margin: "4px 0 0",
    fontSize: "10px",
    color: "#737b91",
  },

  profileGrid: {
    display: "grid",
    gridTemplateColumns: "1.25fr .75fr",
    gap: "12px",
    maxWidth: "100%",
  },

  card: {
    background: "#ffffff",
    borderRadius: "8px",
    padding: "16px",
    marginBottom: "12px",
    border: "1px solid #e8e9f1",
    boxShadow: "0 2px 10px rgba(31, 34, 69, .025)",
  },

  cardTitle: {
    margin: "0 0 4px",
    fontSize: "12px",
    color: "#1d2540",
  },

  cardDescription: {
    margin: "0 0 14px",
    fontSize: "8px",
    color: "#7c8399",
  },

  profileInfoLayout: {
    display: "grid",
    gridTemplateColumns: "115px 1fr",
    gap: "15px",
  },

  avatarSection: {
    position: "relative",
    textAlign: "center",
  },

  largeAvatar: {
    width: "98px",
    height: "98px",
    borderRadius: "50%",
    margin: "3px auto 9px",
    background:
      "linear-gradient(145deg, #f0f0f2, #ffffff)",
    border: "1px solid #e0e1e8",
    position: "relative",
    overflow: "hidden",
  },

  avatarHead: {
    position: "absolute",
    width: "31px",
    height: "36px",
    borderRadius: "50%",
    background: "linear-gradient(145deg, #3b2b27, #171514)",
    left: "34px",
    top: "17px",
  },

  avatarBody: {
    position: "absolute",
    width: "63px",
    height: "45px",
    borderRadius: "45px 45px 0 0",
    background: "linear-gradient(145deg, #171b25, #30384b)",
    left: "17px",
    top: "52px",
  },

  cameraButton: {
    position: "absolute",
    right: "0px",
    top: "75px",
    width: "29px",
    height: "29px",
    borderRadius: "50%",
    border: "3px solid white",
    background: "#6330e6",
    color: "white",
    cursor: "pointer",
  },

  imageText: {
    fontSize: "7px",
    color: "#8a90a1",
    lineHeight: "1.4",
    margin: 0,
  },

  formSection: {
    display: "flex",
    flexDirection: "column",
  },

  label: {
    display: "block",
    fontSize: "8px",
    fontWeight: "600",
    color: "#39415a",
    marginBottom: "5px",
    marginTop: "5px",
  },

  input: {
    width: "100%",
    height: "28px",
    border: "1px solid #dfe2ec",
    borderRadius: "5px",
    padding: "0 9px",
    fontSize: "9px",
    color: "#3f465b",
    background: "#ffffff",
    transition: "all .2s",
  },

  buttonRow: {
    display: "flex",
    justifyContent: "flex-end",
    marginTop: "9px",
  },

  saveButton: {
    border: "none",
    borderRadius: "5px",
    background: "#5c28df",
    color: "white",
    padding: "7px 12px",
    fontSize: "8px",
    fontWeight: "600",
    cursor: "pointer",
    transition: "all .2s",
  },

  passwordWrapper: {
    position: "relative",
    marginBottom: "7px",
  },

  eye: {
    position: "absolute",
    right: "9px",
    top: "7px",
    color: "#8b91a5",
    fontSize: "11px",
  },

  fullButton: {
    width: "100%",
    height: "27px",
    border: "none",
    borderRadius: "5px",
    background: "#5c28df",
    color: "white",
    fontSize: "8px",
    fontWeight: "600",
    cursor: "pointer",
    marginTop: "8px",
    transition: "all .2s",
  },

  genreGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(4, 1fr)",
    gap: "7px",
  },

  genreCard: {
    height: "44px",
    border: "1px solid #e4e5ed",
    borderRadius: "6px",
    background: "#ffffff",
    display: "flex",
    alignItems: "center",
    padding: "0 8px",
    gap: "7px",
    position: "relative",
    cursor: "pointer",
    textAlign: "left",
    transition: "all .2s",
  },

  selectedGenre: {
    borderColor: "#a88aff",
    background: "#faf8ff",
    boxShadow: "0 0 0 1px rgba(108, 48, 228, .05)",
  },

  genreIcon: {
    fontSize: "16px",
    width: "22px",
    textAlign: "center",
  },

  genreName: {
    fontSize: "8px",
    color: "#4e566d",
    fontWeight: "500",
  },

  checkMark: {
    position: "absolute",
    right: "5px",
    top: "4px",
    width: "13px",
    height: "13px",
    borderRadius: "50%",
    background: "#6130e6",
    color: "white",
    fontSize: "8px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },

  genreHint: {
    margin: "11px 0 0",
    fontSize: "7px",
    color: "#9aa0b0",
  },

  accountRow: {
    display: "grid",
    gridTemplateColumns: "20px 1fr auto",
    alignItems: "center",
    gap: "5px",
    minHeight: "36px",
    borderBottom: "1px solid #eeeeF3",
  },

  accountIcon: {
    color: "#777f98",
    fontSize: "14px",
  },

  accountLabel: {
    fontSize: "8px",
    color: "#717991",
  },

  accountValue: {
    fontSize: "8px",
    color: "#697188",
    fontWeight: "600",
    textAlign: "right",
  },
};

export default Profile;