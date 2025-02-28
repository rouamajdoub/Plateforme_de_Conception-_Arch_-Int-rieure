// src/components/Navbar.js
import React from 'react';
import "../styles/navbar.css";

const Navbar = () => {
    return (
        <nav className="navbar-top">
            <ul>
                <li>Notifications</li>
                <li>Settings</li>
            </ul>
        </nav>
    );
};

export default Navbar;
