import React, { useState } from "react";
import "./Style.css";
import Sidebar from "./content/Sidebar/Sidebar";
import MainDash from "./content/MainDash/MainDash";
import RightSide from "./content/RightSide/RightSide";
import Profile from "./pages/Profile/Profile";
import Calendar from "./pages/Calendar/Calendar";
import Project from "./pages/Project/Project";

const Main = () => {
  const [expanded, setExpanded] = useState(true);
  const [selectedItem, setSelectedItem] = useState("dashboard");

  const renderMainContent = () => {
    switch (selectedItem) {
      case "dashboard":
        return (
          <div className="main-dash-container">
            <MainDash />
          </div>
        );
      case "profile":
        return <Profile />;
      case "calendar":
        return <Calendar />;
      case "projects":
        return <Project />;
      // Add more cases for other pages
      default:
        return (
          <div className="main-dash-container">
            <MainDash />
          </div>
        );
    }
  };

  return (
    <div className="App">
      <div
        className="AppGlass"
        style={{
          // Switch to 2 columns when a sidebar item is clicked
          gridTemplateColumns:
            selectedItem === "dashboard"
              ? expanded
                ? "11rem auto 20rem" // 3 columns for dashboard
                : "5rem auto 20rem" // Collapsed sidebar for dashboard
              : expanded
              ? "11rem auto" // 2 columns for other pages
              : "5rem auto", // Collapsed sidebar for other pages
        }}
      >
        <Sidebar
          expanded={expanded}
          setExpanded={setExpanded}
          selectedItem={selectedItem}
          setSelectedItem={setSelectedItem}
        />
        {renderMainContent()}
        {selectedItem === "dashboard" && (
          <div className="right-side-container">
            <RightSide />
          </div>
        )}{" "}
      </div>
    </div>
  );
};

export default Main;
