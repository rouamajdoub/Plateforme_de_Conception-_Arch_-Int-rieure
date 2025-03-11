import React, { useState } from "react";
import Sidebar from "./global/Sidebar";
//import Header from "./global/Header";
//import MarketManagement from "./content/MarketManagement";
//import Profile from "./content/Profile";
//import Projects from "./content/Projects/Projects";
import "../../../styles/Archi_Dash.css";
const Main = () => {
  return (
    <div className="App">
      <div className="AppGlass">
        <Sidebar/>
      </div>
    </div>
  );
};

export default Main;
