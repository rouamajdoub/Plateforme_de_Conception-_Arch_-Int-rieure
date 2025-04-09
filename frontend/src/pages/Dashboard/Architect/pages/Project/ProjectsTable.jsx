import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import {
  fetchArchitectProjects,
  deleteProject,
  searchProjects,
  resetProjectState,
} from "../../../../../redux/slices/ProjectSlice";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  IconButton,
  Typography,
  Box,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Chip,
  Tooltip,
  CircularProgress,
  Alert,
  Snackbar,
} from "@mui/material";
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as ViewIcon,
  Search as SearchIcon,
  FilterList as FilterIcon,
  Add as AddIcon,
  Clear as ClearIcon,
} from "@mui/icons-material";
import AddProjects from "./AddProject";

const ProjectsTable = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { projects, isLoading, error, success, message } = useSelector(
    (state) => state.projects
  );

  // Local state
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState(null);
  const [filterDialogOpen, setFilterDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [showAddProject, setShowAddProject] = useState(false);

  // Fetch architect's projects on component mount
  useEffect(() => {
    dispatch(fetchArchitectProjects());

    // Cleanup on component unmount
    return () => {
      dispatch(resetProjectState());
    };
  }, [dispatch]);

  // Show snackbar when operation succeeds
  useEffect(() => {
    if (success && message) {
      setSnackbarOpen(true);
      // After showing success message, reset the state
      setShowAddProject(false); // Close form on success
      setTimeout(() => {
        dispatch(resetProjectState());
      }, 3000);
    }
  }, [success, message, dispatch]);

  // Handle search
  const handleSearch = (e) => {
    if (e) e.preventDefault();
    const searchParams = {};

    if (searchTerm) searchParams.query = searchTerm;
    if (categoryFilter) searchParams.category = categoryFilter;
    if (statusFilter) searchParams.status = statusFilter;

    dispatch(searchProjects(searchParams));
    setFilterDialogOpen(false);
  };

  // Reset filters
  const handleResetFilters = () => {
    setSearchTerm("");
    setCategoryFilter("");
    setStatusFilter("");
    dispatch(fetchArchitectProjects());
    setFilterDialogOpen(false);
  };

  // Handle delete confirmation
  const openDeleteDialog = (project) => {
    setProjectToDelete(project);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (projectToDelete) {
      dispatch(deleteProject(projectToDelete._id));
      setDeleteDialogOpen(false);
      setProjectToDelete(null);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Not set";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  // Get status chip color
  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "warning";
      case "in_progress":
        return "info";
      case "completed":
        return "success";
      case "canceled":
        return "error";
      default:
        return "default";
    }
  };

  // Toggle add project form
  const handleAddProject = () => {
    setShowAddProject(!showAddProject);
  };

  return (
    <Box sx={{ width: "100%" }}>
      {/* Header section */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
        }}
      >
        <Typography variant="h5" component="h1" gutterBottom>
          Projects Management
        </Typography>
        <Box sx={{ display: "flex", gap: 2 }}>
          <TextField
            size="small"
            placeholder="Search projects..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              endAdornment: (
                <IconButton onClick={handleSearch} size="small">
                  <SearchIcon />
                </IconButton>
              ),
            }}
          />
          <Button
            variant="outlined"
            startIcon={<FilterIcon />}
            onClick={() => setFilterDialogOpen(true)}
          >
            Filters
          </Button>
          <Button
            variant="contained"
            color="primary"
            startIcon={showAddProject ? <ClearIcon /> : <AddIcon />}
            onClick={handleAddProject}
          >
            {showAddProject ? "Cancel" : "New Project"}
          </Button>
        </Box>
      </Box>

      {/* Error message */}
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error.message || "An error occurred"}
        </Alert>
      )}

      {/* Show Add Project form or projects table based on state */}
      {showAddProject ? (
        <AddProjects onCancel={() => setShowAddProject(false)} />
      ) : isLoading ? (
        <Box sx={{ display: "flex", justifyContent: "center", my: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <>
          {/* Projects table */}
          {projects && projects.length > 0 ? (
            <TableContainer component={Paper} sx={{ mb: 4 }}>
              <Table aria-label="projects table">
                <TableHead>
                  <TableRow>
                    <TableCell>Title</TableCell>
                    <TableCell>Client</TableCell>
                    <TableCell>Category</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Budget</TableCell>
                    <TableCell>Start Date</TableCell>
                    <TableCell>End Date</TableCell>
                    <TableCell align="center">Public</TableCell>
                    <TableCell align="right">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {projects.map((project) => (
                    <TableRow key={project._id}>
                      <TableCell component="th" scope="row">
                        {project.title}
                      </TableCell>
                      <TableCell>
                        {project.clientId
                          ? project.clientId.name || "Unknown Client"
                          : "Unknown Client"}
                      </TableCell>
                      <TableCell>{project.category}</TableCell>
                      <TableCell>
                        <Chip
                          label={project.status}
                          color={getStatusColor(project.status)}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        {project.budget
                          ? `$${project.budget.toLocaleString()}`
                          : "Not set"}
                      </TableCell>
                      <TableCell>{formatDate(project.startDate)}</TableCell>
                      <TableCell>{formatDate(project.endDate)}</TableCell>
                      <TableCell align="center">
                        {project.isPublic ? "✓" : "✗"}
                      </TableCell>
                      <TableCell align="right">
                        <Box
                          sx={{ display: "flex", justifyContent: "flex-end" }}
                        >
                          <Tooltip title="View">
                            <IconButton
                              component={Link}
                              to={`/dashboard/architect/projects/${project._id}`}
                              size="small"
                            >
                              <ViewIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Edit">
                            <IconButton
                              component={Link}
                              to={`/dashboard/architect/projects/${project._id}/edit`}
                              size="small"
                            >
                              <EditIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Delete">
                            <IconButton
                              onClick={() => openDeleteDialog(project)}
                              color="error"
                              size="small"
                            >
                              <DeleteIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          ) : (
            <Box sx={{ textAlign: "center", py: 5 }}>
              <Typography variant="body1" color="text.secondary">
                No projects found. Create a new project to get started.
              </Typography>
              <Button
                variant="contained"
                color="primary"
                startIcon={<AddIcon />}
                sx={{ mt: 2 }}
                onClick={handleAddProject}
              >
                Create Project
              </Button>
            </Box>
          )}
        </>
      )}

      {/* Filter dialog */}
      <Dialog
        open={filterDialogOpen}
        onClose={() => setFilterDialogOpen(false)}
      >
        <DialogTitle>Filter Projects</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Search term"
            fullWidth
            variant="outlined"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            sx={{ mb: 2 }}
          />
          <FormControl fullWidth margin="dense" sx={{ mb: 2 }}>
            <InputLabel id="category-label">Category</InputLabel>
            <Select
              labelId="category-label"
              value={categoryFilter}
              label="Category"
              onChange={(e) => setCategoryFilter(e.target.value)}
            >
              <MenuItem value="">All Categories</MenuItem>
              <MenuItem value="Residential">Residential</MenuItem>
              <MenuItem value="Commercial">Commercial</MenuItem>
              <MenuItem value="Interior Design">Interior Design</MenuItem>
              <MenuItem value="Landscape">Landscape</MenuItem>
              <MenuItem value="Industrial">Industrial</MenuItem>
              <MenuItem value="Urban Planning">Urban Planning</MenuItem>
            </Select>
          </FormControl>
          <FormControl fullWidth margin="dense">
            <InputLabel id="status-label">Status</InputLabel>
            <Select
              labelId="status-label"
              value={statusFilter}
              label="Status"
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <MenuItem value="">All Statuses</MenuItem>
              <MenuItem value="pending">Pending</MenuItem>
              <MenuItem value="in_progress">In Progress</MenuItem>
              <MenuItem value="completed">Completed</MenuItem>
              <MenuItem value="canceled">Canceled</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleResetFilters} startIcon={<ClearIcon />}>
            Reset
          </Button>
          <Button onClick={() => setFilterDialogOpen(false)}>Cancel</Button>
          <Button
            onClick={handleSearch}
            variant="contained"
            startIcon={<SearchIcon />}
          >
            Apply Filters
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete confirmation dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      >
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete the project "
            {projectToDelete?.title}"? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button
            onClick={handleDeleteConfirm}
            color="error"
            variant="contained"
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Success message snackbar */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={5000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          elevation={6}
          variant="filled"
          onClose={() => setSnackbarOpen(false)}
          severity="success"
        >
          {message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ProjectsTable;
