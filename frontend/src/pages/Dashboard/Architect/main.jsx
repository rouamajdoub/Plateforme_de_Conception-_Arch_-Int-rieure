import React, { useState } from "react";
import Sidebar from "./global/Sidebar";
import MainDash from "./content/MainDash"
import "./css/style.css";
const Main = () => {
  return (
    <div className="App">
      <div className="AppGlass">
        <Sidebar />
        <MainDash/>
      </div>
    </div>
  );
};

export default Main;
