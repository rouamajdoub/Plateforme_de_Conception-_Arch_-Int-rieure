// src/components/Header.js
import React from 'react';
import { useNavigate } from 'react-router-dom';
import "../styles/header.css";

const Header = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        // Perform logout actions, then redirect to login page
        // Clear tokens or session data if necessary
        navigate("/login");
    };

    return (
        <header className="header">
            <h1>Admin Dashboard</h1>
            <div className="header-actions">
                <span className="user-profile">Admin</span>
                <button className="logout-btn" onClick={handleLogout}>Logout</button>
            </div>
        </header>
    );
};

export default Header;
