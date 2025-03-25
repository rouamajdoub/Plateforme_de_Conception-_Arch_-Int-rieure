import React, { useState } from "react";
import "./Style.css";
import Sidebar from "./content/Sidebar/Sidebar";
import MainDash from "./content/MainDash/MainDash";
import RightSide from "./content/RightSide/RightSide";
import Profile from "./pages/Profile/Profile";
import Calendar from "./pages/Calendar/Calendar";
import Project from "./pages/Project/Project";
import Market from "./pages/Market/Market";
import Invoices from "./pages/Invoice/Invoices";
import Quotes from "./pages/Quote/Quotes";
import Matching from "./pages/Matching/Matching";

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
      case "market":
        return <Market />;
      case "invoices":
        return <Invoices />;
      case "quote":
        return <Quotes />;
      case "client":
        return <Matching />;
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
          gridTemplateColumns:
            selectedItem === "dashboard"
              ? expanded
                ? "11rem auto 20rem"
                : "5rem auto 20rem"
              : expanded
              ? "11rem auto"
              : "5rem auto",
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
        )}
      </div>
    </div>
  );
};

export default Main;
