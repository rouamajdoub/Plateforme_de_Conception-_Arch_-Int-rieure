import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  fetchProjects,
  fetchProjectsByArchitect,
  deleteProject,
} from "../../../../../redux/slices/ProjectSlice";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Tooltip,
  Button,
} from "@mui/material";
import { Edit, Delete, Add } from "@mui/icons-material";
import AddProject from "./AddProject";

const ProjectsTable = ({ onEdit }) => {
  const dispatch = useDispatch();

  const { projects, status, error } = useSelector((state) => state.projects);
  const { user } = useSelector((state) => state.auth); // Get logged-in user

  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (user?.role === "architect") {
      dispatch(fetchProjectsByArchitect(user._id)); // 👈 Only fetch this architect's projects
    } else {
      dispatch(fetchProjects()); // For admins or other roles
    }
  }, [dispatch, user]);

  const handleDelete = (projectId) => {
    if (window.confirm("Are you sure you want to delete this project?")) {
      dispatch(deleteProject(projectId));
    }
  };

  if (status === "loading") return <p>Loading projects...</p>;
  if (status === "failed") return <p>Error: {error}</p>;

  return (
    <>
      <Button
        variant="contained"
        color="primary"
        startIcon={<Add />}
        sx={{ mb: 2 }}
        onClick={() => setOpen(true)}
      >
        Add New Project
      </Button>

      <TableContainer
        component={Paper}
        sx={{
          mt: 3,
          backgroundColor: "transparent",
          boxShadow: "0px 4px 10px rgba(236, 222, 222, 0.77)",
          backdropFilter: "blur(10px)",
          borderRadius: "12px",
          overflow: "hidden",
        }}
      >
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: "rgba(255, 255, 255, 0.1)" }}>
              <TableCell>
                <strong>Title</strong>
              </TableCell>
              <TableCell>
                <strong>Category</strong>
              </TableCell>
              <TableCell>
                <strong>Budget</strong>
              </TableCell>
              <TableCell>
                <strong>Start Date</strong>
              </TableCell>
              <TableCell>
                <strong>End Date</strong>
              </TableCell>
              <TableCell>
                <strong>Actions</strong>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {projects.map((project) => (
              <TableRow key={project._id}>
                <TableCell>{project.title}</TableCell>
                <TableCell>{project.category}</TableCell>
                <TableCell>{project.budget}</TableCell>
                <TableCell>
                  {new Date(project.startDate).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  {new Date(project.endDate).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  <Tooltip title="Edit">
                    <IconButton color="primary" onClick={() => onEdit(project)}>
                      <Edit />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Delete">
                    <IconButton
                      color="error"
                      onClick={() => handleDelete(project._id)}
                    >
                      <Delete />
                    </IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <AddProject open={open} onClose={() => setOpen(false)} />
    </>
  );
};

export default ProjectsTable;
