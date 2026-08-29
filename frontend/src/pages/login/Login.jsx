import React from "react";
import "./Login.css";
import { useNavigate } from "react-router-dom";

function Login() {
  const navigate = useNavigate();

  return (
    
    <div className="login-page">

      <div className="login-left">
        <h1>
          <span>●</span> MoodFlix
        </h1>

        <div className="login-content">
          <h2>
            Find movies<br />
            that match<br />
            your <span>mood</span>
          </h2>

          <p>
            Select your mood and discover personalized
            movie recommendations.
          </p>

          <div className="popcorn">
            🍿
          </div>
        </div>
      </div>

      <div className="login-right">

        <div className="login-form">

          <h2>Welcome back!</h2>

          <p>Login to your account</p>

          <label>Email</label>

          <input
            type="email"
            placeholder="Enter your email"
          />

          <label>Password</label>

          <input
            type="password"
            placeholder="Enter your password"
          />

          <div className="forgot">
            Forgot password?
          </div>

          <button className="login-button" onClick={() => navigate("/home")}>
            Login
          </button>

          <div className="or">
            OR
          </div>

          <p>
            Don't have an account?
          </p>

          <button
        className="register-button"
        onClick={() => navigate("/register")}
      >
        Register here
      </button>

        </div>

      </div>

    </div>
  );
}

export default Login;