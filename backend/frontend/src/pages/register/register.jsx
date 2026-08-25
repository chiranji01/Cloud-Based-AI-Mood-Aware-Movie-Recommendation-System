import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./register.css";

function Register() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // -----------------------------------------
    // Check password confirmation
    // -----------------------------------------

    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    // -----------------------------------------
    // Check password length
    // -----------------------------------------

    if (formData.password.length < 8) {
      alert("Password must be at least 8 characters long.");
      return;
    }

    setLoading(true);

    try {

      const response = await fetch(
        "http://127.0.0.1:8000/api/register/",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            name: formData.name,
            email: formData.email,
            password: formData.password,
          }),
        }
      );

      const data = await response.json();

      console.log("Registration response:", data);

      // -----------------------------------------
      // Successful registration
      // -----------------------------------------

      if (response.ok) {

        alert("Registration successful! Please login.");

        setFormData({
          name: "",
          email: "",
          password: "",
          confirmPassword: "",
        });

        // Go to login
        navigate("/login");

      } else {

        // Display Django error
        alert(
          data.error ||
          data.message ||
          "Registration failed."
        );
      }

    } catch (error) {

      console.error("Registration error:", error);

      alert(
        "Could not connect to Django server."
      );

    } finally {

      setLoading(false);
    }
  };

  return (
    <div className="register-page">

      <div className="register-container">

        {/* LEFT SIDE */}

        <div className="register-left">

          <h1>Welcome!</h1>

          <p>
            Create your account and start discovering
            movies recommended just for you.
          </p>

        </div>


        {/* RIGHT SIDE */}

        <div className="register-card">

          <h2>Create Account</h2>

          <p className="subtitle">
            Register to get started
          </p>


          <form onSubmit={handleSubmit}>

            {/* NAME */}

            <div className="input-group">

              <label>Full Name</label>

              <input
                type="text"
                name="name"
                placeholder="Enter your name"
                value={formData.name}
                onChange={handleChange}
                required
              />

            </div>


            {/* EMAIL */}

            <div className="input-group">

              <label>Email</label>

              <input
                type="email"
                name="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
                required
              />

            </div>


            {/* PASSWORD */}

            <div className="input-group">

              <label>Password</label>

              <input
                type="password"
                name="password"
                placeholder="At least 8 characters"
                value={formData.password}
                onChange={handleChange}
                required
                minLength="8"
              />

            </div>


            {/* CONFIRM PASSWORD */}

            <div className="input-group">

              <label>Confirm Password</label>

              <input
                type="password"
                name="confirmPassword"
                placeholder="Confirm your password"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                minLength="8"
              />

            </div>


            {/* REGISTER BUTTON */}

            <button
              type="submit"
              className="register-button"
              disabled={loading}
            >

              {loading
                ? "Creating Account..."
                : "Register"}

            </button>

          </form>


          {/* LOGIN */}

          <p className="login-text">

            Already have an account?{" "}

            <a
              href="/login"
              onClick={(e) => {
                e.preventDefault();
                navigate("/login");
              }}
            >
              Login
            </a>

          </p>

        </div>

      </div>

    </div>
  );
}

export default Register;