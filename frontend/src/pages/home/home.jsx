import React from "react";
import "./home.css";

import Sidebar from "../../components/Sidebar";
import Topbar from "../../components/Topbar";

function Home() {
  const recommendedMovies = [
    {
      title: "Interstellar",
      genre: "Sci-Fi • Drama",
      rating: "4.8",
      image: "/movies/interstellar.jpg",
    },
    {
      title: "The Dark Knight",
      genre: "Action • Crime",
      rating: "4.7",
      image: "/movies/dark-knight.jpg",
    },
    {
      title: "Inception",
      genre: "Sci-Fi • Thriller",
      rating: "4.6",
      image: "/movies/inception.jpg",
    },
    {
      title: "The Lion King",
      genre: "Animation • Family",
      rating: "4.6",
      image: "/movies/lion-king.jpg",
    },
    {
      title: "Spider-Man: No Way Home",
      genre: "Action • Adventure",
      rating: "4.5",
      image: "/movies/spiderman.jpg",
    },
    {
      title: "La La Land",
      genre: "Romance • Drama",
      rating: "4.4",
      image: "/movies/lalaland.jpg",
    },
  ];

  const popularMovies = [
    {
      title: "Avengers",
      image: "/movies/avengers.jpg",
    },
    {
      title: "Joker",
      image: "/movies/joker.jpg",
    },
    {
      title: "Gladiator",
      image: "/movies/gladiator.jpg",
    },
    {
      title: "Titanic",
      image: "/movies/titanic.jpg",
    },
    {
      title: "The Martian",
      image: "/movies/martian.jpg",
    },
    {
      title: "Gravity",
      image: "/movies/gravity.jpg",
    },
  ];

  return (
    <div className="moodflix">
      <Sidebar />

      {/* ================= MAIN CONTENT ================= */}

      <main className="main-content">

        <Topbar />

        {/* ================= HERO ================= */}

        <section className="hero-section">

          <div className="hero-overlay"></div>

          <div className="hero-content">

            <h1>
              How are you{" "}
              <span>feeling</span> today? 😊
            </h1>

            <p>
              Select your mood to receive{" "}
              <strong>AI-powered</strong>
              <br />
              movie recommendations.
            </p>

            <button className="choose-mood-button">
              ☻ &nbsp; Choose Your Mood
            </button>

          </div>

        </section>


        {/* ================= QUICK MOOD ================= */}

        <section className="quick-mood">

          <h3>Quick Mood Selection</h3>

          <div className="mood-list">

            <button className="mood happy">
              😊 &nbsp; Happy
            </button>

            <button className="mood sad">
              😢 &nbsp; Sad
            </button>

            <button className="mood relaxed">
              😌 &nbsp; Relaxed
            </button>

            <button className="mood excited">
              🤩 &nbsp; Excited
            </button>

            <button className="mood romantic">
              ❤️ &nbsp; Romantic
            </button>

            <button className="mood stressed">
              😰 &nbsp; Stressed
            </button>

          </div>

        </section>


        {/* ================= RECOMMENDED ================= */}

        <section className="movie-section">

          <div className="section-title">

            <h2>Recommended for You</h2>

            <button className="view-all">
              View all &nbsp; ›
            </button>

          </div>


          <div className="movie-row">

            {recommendedMovies.map((movie, index) => (

              <div className="movie-card" key={index}>

                <div className="poster">

                  <img
                    src={movie.image}
                    alt={movie.title}
                  />

                </div>

                <div className="movie-details">

                  <h3>{movie.title}</h3>

                  <div className="movie-bottom">

                    <span>{movie.genre}</span>

                    <strong>
                      ★ {movie.rating}
                    </strong>

                  </div>

                </div>

              </div>

            ))}

            <button className="next-button">
              ›
            </button>

          </div>

        </section>


        {/* ================= POPULAR ================= */}

        <section className="movie-section popular-section">

          <div className="section-title">

            <h2>Popular Movies</h2>

            <button className="view-all">
              View all &nbsp; ›
            </button>

          </div>


          <div className="movie-row">

            {popularMovies.map((movie, index) => (

              <div className="popular-card" key={index}>

                <img
                  src={movie.image}
                  alt={movie.title}
                />

              </div>

            ))}

            <button className="next-button">
              ›
            </button>

          </div>

        </section>

      </main>

    </div>
  );
}

export default Home;












