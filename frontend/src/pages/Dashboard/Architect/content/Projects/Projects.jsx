import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchProjects,
  addProject,
  updateProject,
  deleteProject,
} from "../../../../../redux/slices/architectSlice";
import { Box, Typography, Button } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import Header from "../../../../../components/Header";
import { Input } from "../../../../../components/ui/input";
import EditProjectModal from "./EditProjectModal";

const Projects = () => {
  const dispatch = useDispatch();
  const {
    projects = [],
    loading,
    error,
  } = useSelector((state) => state.architect);
  const [newProject, setNewProject] = useState({
    title: "",
    description: "",
    budget: "",
  });
  const [selectedProject, setSelectedProject] = useState(null);

  useEffect(() => {
    dispatch(fetchProjects());
  }, [dispatch]);

  const handleAddProject = () => {
    if (newProject.title && newProject.description) {
      dispatch(addProject(newProject));
      setNewProject({ title: "", description: "", budget: "" });
    }
  };

  const handleUpdateProject = () => {
    if (selectedProject) {
      dispatch(updateProject(selectedProject));
      setSelectedProject(null);
    }
  };

  const handleDeleteProject = (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this project?"
    );
    if (confirmDelete) {
      dispatch(deleteProject(id));
    }
  };

  const handleEdit = (project) => {
    setSelectedProject(project);
  };

  const handleCloseModal = () => {
    setSelectedProject(null);
  };

  if (loading) return <p>Loading...</p>;
  if (error)
    return <p>Error: {error.message || "An unknown error occurred"}</p>;

  // Define columns for the DataGrid
  const columns = [
    { field: "id", headerName: "ID", flex: 1 },
    { field: "title", headerName: "Title", flex: 1 },
    { field: "description", headerName: "Description", flex: 2 },
    { field: "budget", headerName: "Budget", flex: 1 },
    {
      field: "actions",
      headerName: "Actions",
      renderCell: ({ row }) => (
        <Box>
          <Button onClick={() => handleEdit(row)}>Edit</Button>
          <Button onClick={() => handleDeleteProject(row.id)}>Delete</Button>
        </Box>
      ),
    },
  ];

  // Map projects to the format expected by DataGrid
  const rows = (projects || []).map((project) => ({
    id: project._id,
    title: project.title,
    description: project.description,
    budget: project.budget,
  }));

  return (
    <Box m="20px">
      <Header title="Project Management" subtitle="List of projects" />
      <Box m="40px 0 0 0" height="75vh">
        <DataGrid
          rows={rows}
          columns={columns}
          pageSize={5}
          rowsPerPageOptions={[5]}
          checkboxSelection
        />
      </Box>

      {/* Add Project Modal or Form goes here */}
      <Box className="mb-6 flex gap-4">
        <Input
          placeholder="Title"
          value={newProject.title}
          onChange={(e) =>
            setNewProject({ ...newProject, title: e.target.value })
          }
        />
        <Input
          placeholder="Description"
          value={newProject.description}
          onChange={(e) =>
            setNewProject({ ...newProject, description: e.target.value })
          }
        />
        <Input
          placeholder="Budget"
          type="number"
          value={newProject.budget}
          onChange={(e) =>
            setNewProject({ ...newProject, budget: e.target.value })
          }
        />
        <Button onClick={handleAddProject}>Add</Button>
      </Box>

      {selectedProject && (
        <EditProjectModal
          project={selectedProject}
          onClose={handleCloseModal}
          onUpdate={handleUpdateProject}
        />
      )}
    </Box>
  );
};

export default Projects;
