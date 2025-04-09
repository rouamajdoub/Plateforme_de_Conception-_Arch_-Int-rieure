import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../../redux/slices/authSlice";
import "./styles/Login.css";
import GoogleAuth from "./GoogleAuth";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, isLoading, error, isFirstLogin } = useSelector(
    (state) => state.auth
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(loginUser({ email, password }));
  };

  useEffect(() => {
    if (user) {
      // If architect and first login, redirect to subscription page
      if (user.role === "architect" && isFirstLogin) {
        navigate("/subs");
      } else {
        // Otherwise, redirect to appropriate dashboard
        navigate(user.role === "client" ? "/home" : "/architect");
      }
    }
  }, [user, isFirstLogin, navigate]);

  return (
    <div className="login-container">
      <div className="login-card">
        <h2>Login</h2>
        <p className="subtext">
          Welcome! Please fill in the details to get started.
        </p>

        {/* Google Auth Button */}
        <GoogleAuth />

        <div className="separator">or</div>

        {error && <p className="error-message">{error}</p>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <input
              type="email"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="btn next-btn" disabled={isLoading}>
            {isLoading ? "Logging in..." : "Continue →"}
          </button>
        </form>

        <p className="register-link">
          Don't have an account? <a href="/signup">Sign up</a>
        </p>
      </div>
    </div>
  );
};

export default Login;
