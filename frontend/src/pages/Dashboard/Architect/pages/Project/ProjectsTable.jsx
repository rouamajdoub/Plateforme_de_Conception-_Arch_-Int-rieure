import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  fetchProjects,
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
} from "@mui/material";
import { Edit, Delete } from "@mui/icons-material";

const ProjectsTable = ({ onEdit }) => {
  const dispatch = useDispatch();
  const { projects, status, error } = useSelector((state) => state.projects);

  useEffect(() => {
    dispatch(fetchProjects());
  }, [dispatch]);

  const handleDelete = (projectId) => {
    if (window.confirm("Are you sure you want to delete this project?")) {
      dispatch(deleteProject(projectId));
    }
  };

  if (status === "loading") return <p>Loading projects...</p>;
  if (status === "failed") return <p>Error: {error}</p>;

  return (
    <TableContainer
      component={Paper}
      sx={{
        mt: 3,
        backgroundColor: "transparent", // Transparent background
        boxShadow: "0px 4px 10px rgba(236, 222, 222, 0.77)", // Soft shadow
        backdropFilter: "blur(10px)", // Glass effect
        borderRadius: "12px", // Rounded corners
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
              <strong>Budget </strong>
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
  );
};

export default ProjectsTable;
