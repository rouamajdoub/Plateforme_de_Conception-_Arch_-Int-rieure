// src/components/Sidebar.js
import React from 'react';
import { Link } from 'react-router-dom';
import "../styles/sidebar.css";

const Sidebar = () => {
    return (
        <aside className="sidebar">
            <h2>Admin Menu</h2>
            <ul>
                <li><Link to="reviews">Gestion des Avis</Link></li>
                <li><Link to="users">Gestion des Utilisateurs</Link></li>
                <li><Link to="subscription">Gestion des Abonnements</Link></li>
            </ul>
        </aside>
    );
};

export default Sidebar;
