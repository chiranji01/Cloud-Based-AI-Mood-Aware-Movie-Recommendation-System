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
        "http://127.0.0.1:8000/api/login/",
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


      // -----------------------------------------
      // Successful login
      // -----------------------------------------

      if (response.ok) {

        // Save user information
        localStorage.setItem(
          "user",
          JSON.stringify(data.user)
        );

        alert("Login successful!");

        // Go to Home page
        navigate("/");

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

      {/* LEFT SIDE */}

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


      {/* RIGHT SIDE */}

      <div className="login-right">

        <div className="login-form">

          <h2>Welcome Back</h2>

          <p>
            Login to your MoodFlix account
          </p>


          <form onSubmit={handleLogin}>

            {/* EMAIL */}

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


            {/* PASSWORD */}

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


            {/* FORGOT PASSWORD */}

            <div
               className="forgot"
               onClick={() => navigate("/forgot-password")}
            >
              Forgot password?
            </div>


            {/* ERROR */}

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


            {/* LOGIN BUTTON */}

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


          {/* OR */}

          <div className="or">
            OR
          </div>


          {/* REGISTER */}

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