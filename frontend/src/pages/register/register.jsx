import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Register.css";

function Register() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((previousData) => ({
      ...previousData,
      [name]: value,
    }));
  };

  // Handle registration
  const handleSubmit = (e) => {
    e.preventDefault();

    // Check all fields
    if (
      !formData.name.trim() ||
      !formData.email.trim() ||
      !formData.password ||
      !formData.confirmPassword
    ) {
      alert("Please fill in all fields.");
      return;
    }

    // Check password length
    if (formData.password.length < 8) {
      alert("Password must be at least 8 characters long.");
      return;
    }

    // Check passwords
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    // Registration successful
    console.log("Registration Data:", formData);

    alert("Registration successful!");

    // Navigate to login page
    navigate("/login");
  };

  return (
    <div className="register-page">

      <div className="register-container">

        {/* =====================================================
            LEFT SIDE
        ===================================================== */}

        <div className="register-left">

          <div className="left-overlay"></div>

          <div className="left-content">

            {/* LOGO */}

            <div className="logo">

              <span className="logo-icon">
                ●●●
              </span>

              <span>
                Mood<span>Flix</span>
              </span>

            </div>

            {/* TEXT */}

            <div className="left-text">

              <h1>
                Find movies
                <br />
                that match
                <br />
                your <span>mood</span>
              </h1>

              <p>
                Select your mood and discover
                <br />
                personalized movie
                <br />
                recommendations.
              </p>

            </div>

            {/* MOVIE IMAGE */}

            <div className="movie-image">

              <div className="clapper">

                <div className="clapper-top">

                  <span></span>
                  <span></span>
                  <span></span>
                  <span></span>

                </div>

                <div className="clapper-body">

                  <div></div>
                  <div></div>
                  <div></div>

                </div>

              </div>

              <div className="popcorn">
                🍿
              </div>

            </div>

          </div>

        </div>

        {/* =====================================================
            RIGHT SIDE
        ===================================================== */}

        <div className="register-right">

          {/* TOP LOGIN */}

          <div className="top-login">

            <span>
              Already have an account?
            </span>

            <Link to="/login">
              Login
            </Link>

          </div>

          {/* REGISTER CARD */}

          <div className="register-card">

            <h2>
              Create your account
            </h2>

            <p className="subtitle">
              Join MoodFlix and start your personalized journey.
            </p>

            {/* =================================================
                SINGLE FORM
            ================================================= */}

            <form onSubmit={handleSubmit}>

              {/* NAME */}

              <div className="input-group">

                <label>
                  Full Name
                </label>

                <div className="input-wrapper">

                  <span className="input-icon">
                    ♙
                  </span>

                  <input
                    type="text"
                    name="name"
                    placeholder="Enter your full name"
                    value={formData.name}
                    onChange={handleChange}
                  />

                </div>

              </div>

              {/* EMAIL */}

              <div className="input-group">

                <label>
                  Email
                </label>

                <div className="input-wrapper">

                  <span className="input-icon">
                    ✉
                  </span>

                  <input
                    type="email"
                    name="email"
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={handleChange}
                  />

                </div>

              </div>

              {/* PASSWORD */}

              <div className="input-group">

                <label>
                  Password
                </label>

                <div className="input-wrapper">

                  <span className="input-icon">
                    ♙
                  </span>

                  <input
                    type={
                      showPassword
                        ? "text"
                        : "password"
                    }
                    name="password"
                    placeholder="Create a password"
                    value={formData.password}
                    onChange={handleChange}
                  />

                  <button
                    type="button"
                    className="eye-button"
                    onClick={() =>
                      setShowPassword(
                        !showPassword
                      )
                    }
                  >
                    {showPassword ? "◉" : "◌"}
                  </button>

                </div>

              </div>

              {/* CONFIRM PASSWORD */}

              <div className="input-group">

                <label>
                  Confirm Password
                </label>

                <div className="input-wrapper">

                  <span className="input-icon">
                    ♙
                  </span>

                  <input
                    type={
                      showConfirmPassword
                        ? "text"
                        : "password"
                    }
                    name="confirmPassword"
                    placeholder="Confirm your password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                  />

                  <button
                    type="button"
                    className="eye-button"
                    onClick={() =>
                      setShowConfirmPassword(
                        !showConfirmPassword
                      )
                    }
                  >
                    {showConfirmPassword
                      ? "◉"
                      : "◌"}
                  </button>

                </div>

              </div>

              {/* PASSWORD INFORMATION */}

              <div className="password-info">

                <span>●</span>

                <span>
                  Password must be at least 8 characters long
                </span>

              </div>

              {/* CREATE ACCOUNT */}

              <button
                type="submit"
                className="register-button"
              >

                <span>
                  ♙
                </span>

                Create Account

              </button>

            </form>

            {/* OR DIVIDER */}

            <div className="or-divider">

              <span></span>

              <p>
                OR
              </p>

              <span></span>

            </div>

            {/* GOOGLE BUTTON */}

            <button
              type="button"
              className="google-button"
            >

              <span className="google-icon">
                G
              </span>

              Sign up with Google

            </button>

          </div>

        </div>

      </div>

    </div>
  );
}

export default Register;