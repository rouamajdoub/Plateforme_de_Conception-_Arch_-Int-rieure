import React from "react";
import "./Header.css"; // Import the CSS file
import Logo from "../img/logo.png";
const Header = () => {
  return (
    <header className="header">
      <div className="logo">
        <img src={Logo} alt="logo" />
        <p>Visiona</p>
      </div>
    </header>
  );
};

export default Header;
