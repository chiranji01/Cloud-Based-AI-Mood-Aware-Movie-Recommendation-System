import "./Login.css";

function Login() {
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

          <button className="login-button">
            Login
          </button>

          <div className="or">
            OR
          </div>

          <p>
            Don't have an account?
          </p>

          <button className="register-button">
            Register here
          </button>

        </div>

      </div>

    </div>
  );
}

export default Login;