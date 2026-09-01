import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./login.css";

function Login() {
const navigate = useNavigate();

const [email, setEmail] = useState("");
const [password, setPassword] = useState("");

const [error, setError] = useState("");
const [loading, setLoading] = useState(false);

const handleLogin = async (e) => {
e.preventDefault();

setError("");
setLoading(true);

try {
  const response = await fetch(
    `${import.meta.env.VITE_API_URL}/api/login/`,
    {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify({
        email: email,
        password: password,
      }),
    }
  );

  const data = await response.json();

  console.log("Login response:", data);

  if (response.ok) {
    localStorage.setItem(
      "user",
      JSON.stringify(data.user)
    );

    alert("Login successful!");

    navigate("/home");
  } else {
    setError(
      data.message ||
      "Invalid email or password."
    );
  }
} catch (error) {
  console.error("Login error:", error);

  setError(
    "Could not connect to Django server. " +
    "Please make sure Django is running."
  );
} finally {
  setLoading(false);
}

};

return (
<div className="login-page">

  <div className="login-left">

    <h1>
      <span>●</span> MoodFlix
    </h1>

    <div className="login-content">

      <h2>
        Find movies
        <br />
        that match
        <br />
        your <span>mood</span>
      </h2>

      <p>
        Select your mood and discover movies
        that are perfect for you.
      </p>

      <div className="popcorn">
        🍿
      </div>

    </div>

  </div>

  <div className="login-right">

    <div className="login-form">

      <h2>Welcome Back</h2>

      <p>
        Login to your MoodFlix account
      </p>

      <form onSubmit={handleLogin}>

        <label>Email</label>

        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) =>
            setEmail(e.target.value)
          }
          required
        />

        <label>Password</label>

        <input
          type="password"
          placeholder="Enter your password"
          value={password}
          onChange={(e) =>
            setPassword(e.target.value)
          }
          required
        />

        <div
          className="forgot"
          onClick={() =>
            navigate("/forgot-password")
          }
        >
          Forgot password?
        </div>

        {error && (
          <p
            style={{
              color: "red",
              marginTop: "10px",
            }}
          >
            {error}
          </p>
        )}

        <button
          type="submit"
          className="login-button"
          disabled={loading}
        >
          {loading
            ? "Logging in..."
            : "Login"}
        </button>

      </form>

      <div className="or">
        OR
      </div>

      <button
        type="button"
        className="register-button"
        onClick={() => navigate("/register")}
      >
        Create an account
      </button>

    </div>

  </div>

</div>

);
}

export default Login;