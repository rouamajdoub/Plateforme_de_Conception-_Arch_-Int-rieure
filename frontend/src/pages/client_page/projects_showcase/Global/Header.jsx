import React from "react";
import { useLocation, Link } from "react-router-dom";
import "../style.css";

const Header = ({ onNavClick }) => {
  const location = useLocation();
  const pathname = location.pathname;

  const getPageName = () => {
    if (pathname === "/") return "Home";
    if (pathname === "/projects") return "Projects";
    if (pathname === "/architects") return "Architects";
    if (pathname === "/my-favorites") return "My Favorites";

    return "Unknown Page";
  };

  return (
    <header className="header">
      <Link to="/" className="logo" onClick={onNavClick}>
        <img src="../img/logo.png" alt="logo" width={45} height={45} />
      </Link>

      <h2 className="page-name">{getPageName()}</h2>

      <ul className="nav-list">
        <li>
          <Link
            to="/projects"
            className={`nav-item ${pathname === "/projects" ? "active" : ""}`}
            onClick={onNavClick}
          >
            Projects
          </Link>
          <Link
            to="/architects"
            className={`nav-item ${pathname === "/architects" ? "active" : ""}`}
            onClick={onNavClick}
          >
            Architects
          </Link>
          <Link
            to="/my-favorites"
            className={`nav-item ${
              pathname === "/my-favorites" ? "active" : ""
            }`}
            onClick={onNavClick}
          >
            My Favorites
          </Link>
          <Link
            to="/"
            className={`nav-item ${pathname === "/" ? "active" : ""}`}
            onClick={onNavClick}
          >
            Home
          </Link>
        </li>
      </ul>
    </header>
  );
};

export default Header;
