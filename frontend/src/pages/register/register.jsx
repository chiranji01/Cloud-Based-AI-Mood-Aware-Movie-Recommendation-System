import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./Register.css";

function Register() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    console.log("Registration Data:", formData);
    alert("Registration successful!");
  };

  return (
    <div className="register-page">
      <div className="register-container">

        {/* LEFT SIDE */}
        <div className="register-left">

          <div className="left-overlay"></div>

          <div className="left-content">

            <div className="logo">
              <span className="logo-icon">●●●</span>
              <span>Mood<span>Flix</span></span>
            </div>

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
                <span>🍿</span>
              </div>
            </div>

          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="register-right">

          <div className="top-login">
            Already have an account?
            <Link to="/login">Login</Link>
          </div>

          <div className="register-card">

            <h2>Create your account</h2>

            <p className="subtitle">
              Join MoodFlix and start your personalized journey.
            </p>

            <form onSubmit={handleSubmit}>

              {/* NAME */}
              <div className="input-group">
                <label>Full Name</label>

                <div className="input-wrapper">
                  <span className="input-icon">♙</span>

                  <input
                    type="text"
                    name="name"
                    placeholder="Enter your full name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              {/* EMAIL */}
              <div className="input-group">
                <label>Email</label>

                <div className="input-wrapper">
                  <span className="input-icon">✉</span>

                  <input
                    type="email"
                    name="email"
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              {/* PASSWORD */}
              <div className="input-group">
                <label>Password</label>

                <div className="input-wrapper">
                  <span className="input-icon">♙</span>

                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    placeholder="Create a password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                  />

                  <button
                    type="button"
                    className="eye-button"
                    onClick={() =>
                      setShowPassword(!showPassword)
                    }
                  >
                    {showPassword ? "◉" : "◌"}
                  </button>
                </div>
              </div>

              {/* CONFIRM PASSWORD */}
              <div className="input-group">
                <label>Confirm Password</label>

                <div className="input-wrapper">
                  <span className="input-icon">♙</span>

                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirmPassword"
                    placeholder="Confirm your password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
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
                    {showConfirmPassword ? "◉" : "◌"}
                  </button>
                </div>
              </div>

              <div className="password-info">
                <span>●</span>
                Password must be at least 8 characters long
              </div>

              {/* CREATE ACCOUNT */}
              <button
                type="submit"
                className="register-button"
              >
                <span>♙</span>
                Create Account
              </button>

            </form>

            {/* OR */}
            <div className="or-divider">
              <span></span>
              <p>OR</p>
              <span></span>
            </div>

            {/* GOOGLE */}
            <button className="google-button">
              <span className="google-icon">G</span>
              Sign up with Google
            </button>

          </div>
        </div>

      </div>
    </div>
  );
}

export default Register;