import React, { useState } from "react";
import "./Register.css";

function Register() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

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

        <div className="register-left">
          <h1>Welcome!</h1>
          <p>
            Create your account and start discovering
            movies recommended just for you.
          </p>
        </div>

        <div className="register-card">
          <h2>Create Account</h2>
          <p className="subtitle">Register to get started</p>

          <form onSubmit={handleSubmit}>

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

            <div className="input-group">
              <label>Password</label>
              <input
                type="password"
                name="password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>

            <div className="input-group">
              <label>Confirm Password</label>
              <input
                type="password"
                name="confirmPassword"
                placeholder="Confirm your password"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
              />
            </div>

            <button type="submit" className="register-button">
              Register
            </button>

          </form>

          <p className="login-text">
            Already have an account?{" "}
            <a href="/login">Login</a>
          </p>

        </div>
      </div>
    </div>
  );
}

export default Register;