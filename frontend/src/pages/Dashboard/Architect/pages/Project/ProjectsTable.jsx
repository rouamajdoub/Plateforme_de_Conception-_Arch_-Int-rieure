import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchAllProjects,
  deleteProject,
  searchProjects,
  resetProjectState,
  fetchProjectById,
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
  Close as CloseIcon,
} from "@mui/icons-material";
import AddProjects from "./AddProject";
import ProjectDetails from "./ProjectDetails"; // Import the ProjectDetails component
import EditProject from "./EditProject"; // Import the EditProject component

const ProjectsTable = () => {
  const dispatch = useDispatch();
  const { projects, isLoading, error, success, message } = useSelector(
    (state) => state.projects
  );
  const { user } = useSelector((state) => state.auth);

  // Local state
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState(null);
  const [filterDialogOpen, setFilterDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [addProjectDialogOpen, setAddProjectDialogOpen] = useState(false);

  // New state for view and edit dialogs
  const [viewProjectDialogOpen, setViewProjectDialogOpen] = useState(false);
  const [editProjectDialogOpen, setEditProjectDialogOpen] = useState(false);
  const [selectedProjectId, setSelectedProjectId] = useState(null);

  // Fetch projects on component mount
  useEffect(() => {
    // If we need to fetch architect-specific projects, we can use the user ID
    if (user && user.role === "architect") {
      // Assuming user ID is used to identify the architect's projects
      dispatch(fetchAllProjects());
      // Alternatively, if there's a specific endpoint for architect projects:
      // dispatch(fetchProjectsByClient(user._id));
    } else {
      dispatch(fetchAllProjects());
    }

    // Cleanup on component unmount
    return () => {
      dispatch(resetProjectState());
    };
  }, [dispatch, user]);

  // Show snackbar when operation succeeds
  useEffect(() => {
    if (success && message) {
      setSnackbarOpen(true);
      setAddProjectDialogOpen(false); // Close form on success
      setEditProjectDialogOpen(false); // Also close edit form on success
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
    dispatch(fetchAllProjects());
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

  // Open view project dialog
  const openViewProjectDialog = (projectId) => {
    setSelectedProjectId(projectId);
    dispatch(fetchProjectById(projectId));
    setViewProjectDialogOpen(true);
  };

  // Open edit project dialog
  const openEditProjectDialog = (projectId) => {
    setSelectedProjectId(projectId);
    dispatch(fetchProjectById(projectId));
    setEditProjectDialogOpen(true);
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

  // Toggle add project dialog
  const toggleAddProjectDialog = () => {
    setAddProjectDialogOpen(!addProjectDialogOpen);
  };

  return (
    <Box sx={{ width: "100%" }} className="projects-container">
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
            startIcon={<AddIcon />}
            onClick={toggleAddProjectDialog}
            className="add-project-btn"
          >
            New Project
          </Button>
        </Box>
      </Box>

      {/* Error message */}
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error.message || "An error occurred"}
        </Alert>
      )}

      {/* Projects table */}
      {isLoading ? (
        <Box sx={{ display: "flex", justifyContent: "center", my: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <>
          {projects && projects.length > 0 ? (
            <TableContainer
              component={Paper}
              sx={{ mb: 4 }}
              className="transparent-table"
            >
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
                              onClick={() => openViewProjectDialog(project._id)}
                              size="small"
                            >
                              <ViewIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Edit">
                            <IconButton
                              onClick={() => openEditProjectDialog(project._id)}
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
                onClick={toggleAddProjectDialog}
                className="add-project-btn"
              >
                Create Project
              </Button>
            </Box>
          )}
        </>
      )}

      {/* Add Project Dialog */}
      <Dialog
        open={addProjectDialogOpen}
        onClose={toggleAddProjectDialog}
        maxWidth="lg"
        fullWidth
        className="add-project-dialog"
      >
        <DialogTitle>
          Add New Project
          <IconButton
            aria-label="close"
            onClick={toggleAddProjectDialog}
            sx={{
              position: "absolute",
              right: 8,
              top: 8,
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent className="add-project-content">
          <AddProjects onCancel={toggleAddProjectDialog} />
        </DialogContent>
      </Dialog>

      {/* View Project Dialog */}
      <Dialog
        open={viewProjectDialogOpen}
        onClose={() => setViewProjectDialogOpen(false)}
        maxWidth="lg"
        fullWidth
        className="view-project-dialog"
      >
        <DialogTitle>
          Project Details
          <IconButton
            aria-label="close"
            onClick={() => setViewProjectDialogOpen(false)}
            sx={{
              position: "absolute",
              right: 8,
              top: 8,
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent className="view-project-content" sx={{ p: 0 }}>
          {selectedProjectId && (
            <ProjectDetails
              projectId={selectedProjectId}
              isDialog={true}
              onClose={() => setViewProjectDialogOpen(false)}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Edit Project Dialog */}
      <Dialog
        open={editProjectDialogOpen}
        onClose={() => setEditProjectDialogOpen(false)}
        maxWidth="lg"
        fullWidth
        className="edit-project-dialog"
      >
        <DialogTitle>
          Edit Project
          <IconButton
            aria-label="close"
            onClick={() => setEditProjectDialogOpen(false)}
            sx={{
              position: "absolute",
              right: 8,
              top: 8,
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent className="edit-project-content" sx={{ p: 0 }}>
          {selectedProjectId && (
            <EditProject
              projectId={selectedProjectId}
              isDialog={true}
              onClose={() => setEditProjectDialogOpen(false)}
            />
          )}
        </DialogContent>
      </Dialog>

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
