import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Container,
  TextField,
  Button,
  MenuItem,
  Checkbox,
  FormControlLabel,
  Autocomplete,
  CircularProgress,
  Box,
  Typography,
  Divider,
  Paper,
  Grid,
  Alert,
  Snackbar,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import {
  createProject,
  resetProjectState,
} from "../../../../../redux/slices/ProjectSlice";
import {
  getClientById,
  searchClients,
} from "../../../../../redux/slices/clientsSlice";

const AddProject = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const { clients, loading: clientsLoading } = useSelector(
    (state) => state.clients
  );
  const { isLoading, error, success, message } = useSelector(
    (state) => state.projects
  );

  const [projectData, setProjectData] = useState({
    title: "",
    shortDescription: "",
    description: "",
    category: "",
    budget: "",
    startDate: "",
    endDate: "",
    coverImage: "",
    isPublic: false,
    showroomStatus: "normal",
    clientId: "",
    status: "pending",
  });

  const [selectedClient, setSelectedClient] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  // Fetch architect's clients when component mounts
  useEffect(() => {
    if (user && user._id) {
      dispatch(getClientById(user._id));
    }

    // Clean up on unmount
    return () => {
      dispatch(resetProjectState());
    };
  }, [dispatch, user]);

  // Show snackbar when operation succeeds and redirect
  useEffect(() => {
    if (success && message) {
      setSnackbarOpen(true);
      setTimeout(() => {
        navigate("/dashboard/architect/projects");
      }, 2000);
    }
  }, [success, message, navigate]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setProjectData({
      ...projectData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleClientSelect = (event, client) => {
    setSelectedClient(client);
    setProjectData({
      ...projectData,
      clientId: client ? client._id : "",
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(createProject(projectData));
  };

  const handleCancel = () => {
    navigate("/dashboard/architect/projects");
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Paper sx={{ p: 4 }}>
        <Typography variant="h5" component="h1" gutterBottom>
          Create New Project
        </Typography>
        <Divider sx={{ mb: 4 }} />

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error.message || "An error occurred while creating the project."}
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          <Box sx={{ mb: 4 }}>
            <Typography variant="subtitle1" fontWeight="bold">
              Client Information
            </Typography>
            <Divider sx={{ mb: 2 }} />

            <Autocomplete
              id="client-select"
              options={clients || []}
              getOptionLabel={(option) => option.name || ""}
              value={selectedClient}
              onChange={handleClientSelect}
              loading={clientsLoading}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Select Client"
                  variant="outlined"
                  required
                  fullWidth
                  margin="normal"
                  error={!projectData.clientId && projectData.title.length > 0}
                  helperText={
                    !projectData.clientId && projectData.title.length > 0
                      ? "Client is required"
                      : ""
                  }
                  InputProps={{
                    ...params.InputProps,
                    endAdornment: (
                      <>
                        {clientsLoading ? (
                          <CircularProgress color="inherit" size={20} />
                        ) : null}
                        {params.InputProps.endAdornment}
                      </>
                    ),
                  }}
                />
              )}
              renderOption={(props, option) => (
                <li {...props}>
                  <Box>
                    <Typography variant="body1">{option.name}</Typography>
                    <Typography variant="caption" color="text.secondary">
                      {option.email}
                    </Typography>
                  </Box>
                </li>
              )}
            />

            {!clients?.length && (
              <Typography
                variant="caption"
                color="error"
                sx={{ mt: 1, display: "block" }}
              >
                You don't have any clients yet. Please add clients from the
                client management page first.
              </Typography>
            )}
          </Box>

          <Box sx={{ mb: 4 }}>
            <Typography variant="subtitle1" fontWeight="bold">
              Project Details
            </Typography>
            <Divider sx={{ mb: 2 }} />

            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Title"
                  name="title"
                  value={projectData.title}
                  onChange={handleChange}
                  margin="normal"
                  required
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  select
                  fullWidth
                  label="Category"
                  name="category"
                  value={projectData.category}
                  onChange={handleChange}
                  margin="normal"
                  required
                >
                  <MenuItem value="Residential">Residential</MenuItem>
                  <MenuItem value="Commercial">Commercial</MenuItem>
                  <MenuItem value="Interior Design">Interior Design</MenuItem>
                  <MenuItem value="Landscape">Landscape</MenuItem>
                  <MenuItem value="Industrial">Industrial</MenuItem>
                  <MenuItem value="Urban Planning">Urban Planning</MenuItem>
                </TextField>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Short Description"
                  name="shortDescription"
                  value={projectData.shortDescription}
                  onChange={handleChange}
                  margin="normal"
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Description"
                  name="description"
                  value={projectData.description}
                  onChange={handleChange}
                  margin="normal"
                  multiline
                  rows={4}
                  required
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Budget ($)"
                  name="budget"
                  type="number"
                  value={projectData.budget}
                  onChange={handleChange}
                  margin="normal"
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  select
                  fullWidth
                  label="Status"
                  name="status"
                  value={projectData.status}
                  onChange={handleChange}
                  margin="normal"
                  required
                >
                  <MenuItem value="pending">Pending</MenuItem>
                  <MenuItem value="in_progress">In Progress</MenuItem>
                  <MenuItem value="completed">Completed</MenuItem>
                  <MenuItem value="canceled">Canceled</MenuItem>
                </TextField>
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Start Date"
                  name="startDate"
                  type="date"
                  value={projectData.startDate}
                  onChange={handleChange}
                  margin="normal"
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="End Date"
                  name="endDate"
                  type="date"
                  value={projectData.endDate}
                  onChange={handleChange}
                  margin="normal"
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Cover Image (URL)"
                  name="coverImage"
                  value={projectData.coverImage}
                  onChange={handleChange}
                  margin="normal"
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControlLabel
                  control={
                    <Checkbox
                      name="isPublic"
                      checked={projectData.isPublic}
                      onChange={handleChange}
                    />
                  }
                  label="Make Public (Showroom)"
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  select
                  fullWidth
                  label="Showroom Status"
                  name="showroomStatus"
                  value={projectData.showroomStatus}
                  onChange={handleChange}
                  margin="normal"
                  disabled={!projectData.isPublic}
                >
                  <MenuItem value="featured">Featured</MenuItem>
                  <MenuItem value="trending">Trending</MenuItem>
                  <MenuItem value="normal">Normal</MenuItem>
                </TextField>
              </Grid>
            </Grid>
          </Box>

          <Box
            sx={{ display: "flex", justifyContent: "flex-end", gap: 2, mt: 4 }}
          >
            <Button onClick={handleCancel} color="inherit" variant="outlined">
              Cancel
            </Button>
            <Button
              type="submit"
              color="primary"
              variant="contained"
              disabled={
                isLoading || !projectData.clientId || !projectData.title
              }
            >
              {isLoading ? <CircularProgress size={24} /> : "Create Project"}
            </Button>
          </Box>
        </form>
      </Paper>

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
    </Container>
  );
};

export default AddProject;
