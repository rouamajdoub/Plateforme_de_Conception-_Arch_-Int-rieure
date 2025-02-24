import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "frontend/src/styles/Auth.css"; 

const Signup = () => {
  const [formData, setFormData] = useState({
    pseudo: "",
    nomDeFamille: "",
    prenom: "",
    email: "",
    password: "",
    role: "client",
  });

  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/api/auth/register", formData);
      alert("Signup successful! You can now log in.");
      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.error || "Something went wrong");
    }
  };

  return (
    <div className="wrapper">
      <h2>Sign Up</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <div className="input-box">
          <input
            type="text"
            name="pseudo"
            placeholder="Pseudo"
            value={formData.pseudo}
            onChange={handleChange}
            required
          />
        </div>
        <div className="input-box">
          <input
            type="text"
            name="nomDeFamille"
            placeholder="Nom de famille"
            value={formData.nomDeFamille}
            onChange={handleChange}
            required
          />
        </div>
        <div className="input-box">
          <input
            type="text"
            name="prenom"
            placeholder="Prénom"
            value={formData.prenom}
            onChange={handleChange}
            required
          />
        </div>
        <div className="input-box">
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        <div className="input-box">
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>
        <select name="role" value={formData.role} onChange={handleChange}>
          <option value="client">Client</option>
          <option value="architect">Architecte</option>
        </select>
        <button type="submit" className="btn">Sign Up</button>
      </form>
      <p className="registre-link">
        Already have an account? <a href="/login">Login</a>
      </p>
    </div>
  );
};

export default Signup;