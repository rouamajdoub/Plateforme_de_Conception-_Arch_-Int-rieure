import React from "react";
import "./Style.css";
import Sidebar from "./content/Sidebar/Sidebar";
import MainDash from "./content/MainDash/MainDash";
import RightSide from "./content/RightSide/RightSide";
const Main = () => {
  return (
    <div className="App">
      <div className="AppGlass">
        <Sidebar />
        <MainDash />
        <RightSide />
      </div>
    </div>
  );
};

export default Main;
