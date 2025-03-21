import React, { useState } from "react";
import { AppBar, Tabs, Tab, Box } from "@mui/material";
import Kanbanproject from "./kanbanproject";
import ProjectsTable from "./ProjectsTable";
import "./Project.css";

const Project = () => {
  const [activeTab, setActiveTab] = useState("table");

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  return (
    <Box className="project-container">
      <AppBar position="static">
        <Tabs value={activeTab} onChange={handleTabChange}>
          <Tab label="Table" value="table" />
          <Tab label="Kanban" value="kanban" />
        </Tabs>
      </AppBar>
      <Box p={3}>
        {activeTab === "kanban" && <Kanbanproject />}
        {activeTab === "table" && <ProjectsTable />}
      </Box>
    </Box>
  );
};

export default Project;
