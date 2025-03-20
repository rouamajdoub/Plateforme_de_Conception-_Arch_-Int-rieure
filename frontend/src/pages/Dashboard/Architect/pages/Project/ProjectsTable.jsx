import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchProjects,
  deleteProject,
} from "../../../../../redux/slices/architectSlice";
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  CircularProgress,
  Typography,
} from "@mui/material";
import { Delete, Edit } from "@mui/icons-material";

const ProjectsTable = () => {
  const dispatch = useDispatch();

  // Fetch projects from Redux store
  const { projects, loading, error } = useSelector((state) => state.architect);

  useEffect(() => {
    // Fetch projects when the component mounts
    dispatch(fetchProjects());
  }, [dispatch]);

  // Handle project deletion
  const handleDelete = (projectId) => {
    if (window.confirm("Are you sure you want to delete this project?")) {
      dispatch(deleteProject(projectId));
    }
  };

  if (loading.projects) {
    return (
      <Box display="flex" justifyContent="center" mt={4}>
        <CircularProgress />
      </Box>
    );
  }

  if (error.projects) {
    console.log("Error:", error.projects); // Log the error object
    return (
      <Typography variant="h6" color="error" align="center" mt={4}>
        Error: {error.projects.message || "An unknown error occurred"}
      </Typography>
    );
  }

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Title</TableCell>
            <TableCell>Description</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Start Date</TableCell>
            <TableCell>End Date</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {projects.map((project) => (
            <TableRow key={project._id}>
              <TableCell>{project.title}</TableCell>
              <TableCell>{project.description}</TableCell>
              <TableCell>{project.status}</TableCell>
              <TableCell>
                {new Date(project.startDate).toLocaleDateString()}
              </TableCell>
              <TableCell>
                {new Date(project.endDate).toLocaleDateString()}
              </TableCell>
              <TableCell>
                <IconButton
                  color="primary"
                  onClick={() => {
                    // Handle edit action (e.g., open a modal or navigate to edit page)
                    console.log("Edit project:", project._id);
                  }}
                >
                  <Edit />
                </IconButton>
                <IconButton
                  color="error"
                  onClick={() => handleDelete(project._id)}
                >
                  <Delete />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default ProjectsTable;