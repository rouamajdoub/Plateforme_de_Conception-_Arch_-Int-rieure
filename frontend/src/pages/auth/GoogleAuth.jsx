import React from "react";
import { GoogleLogin } from "@react-oauth/google";
import { useNavigate } from "react-router-dom";

const GoogleAuth = () => {
  const navigate = useNavigate();

  const handleSuccess = (response) => {
    // You can send this token to your backend for verification
    const token = response.credential;
    console.log("Google Login successful, token:", token);

    // You can now call your backend API to authenticate the user
    // Example: Make a POST request with the token
    fetch("http://localhost:5000/api/auth/google-login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ token }),
    })
      .then((res) => res.json())
      .then((data) => {
        // Store the JWT token and user info in localStorage/sessionStorage
        sessionStorage.setItem("user", JSON.stringify(data.user));
        navigate("/dashboard"); // Redirect to the dashboard after successful login
      })
      .catch((err) => {
        console.error("Google Login Error:", err);
      });
  };

  const handleError = (error) => {
    console.error("Login failed", error);
  };

  return (
    <div>
      <h3>Login with Google</h3>
      <GoogleLogin
        onSuccess={handleSuccess}
        onError={handleError}
        useOneTap
        clientId={process.env.GOOGLE_CLIENT_ID} // Replace with your actual client ID
        redirectUri="http://localhost:3000/api/auth/callback/google" // Make sure this matches your Google Cloud Console setting
      />
    </div>
  );
};

export default GoogleAuth;
