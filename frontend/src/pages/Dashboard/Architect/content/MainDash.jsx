import React from "react";
import Cards from "../global/Cards";
import Table from "../global/Table";
import "../css/MainDash.css";
const MainDash = () => {
  return (
    <div className="MainDash">
      <h1>Dashboard</h1>
      <Cards />
      <Table />
    </div>
  );
};

export default MainDash;
