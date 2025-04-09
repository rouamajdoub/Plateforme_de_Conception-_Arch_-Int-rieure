import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
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
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { createProject } from "../../../../../redux/slices/ProjectSlice";
import {
  getClientById,
  searchClients,
} from "../../../../../redux/slices/clientsSlice";

const AddProject = ({ open, onClose }) => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { clients, loading: clientsLoading } = useSelector(
    (state) => state.clients
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
  });

  const [clientSearchQuery, setClientSearchQuery] = useState("");
  const [selectedClient, setSelectedClient] = useState(null);

  // Fetch architect's clients when component mounts
  useEffect(() => {
    if (user && user._id) {
      dispatch(getClientById(user._id));
    }
  }, [dispatch, user]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setProjectData({
      ...projectData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleClientSelect = (client) => {
    setSelectedClient(client);
    setProjectData({
      ...projectData,
      clientId: client ? client._id : "",
    });
  };

  const handleClientSearch = (event, newValue) => {
    setClientSearchQuery(newValue);
    if (newValue && newValue.length > 2) {
      dispatch(searchClients(newValue));
    }
  };

  const handleSubmit = () => {
    if (!projectData.clientId) {
      alert("Please select a client for this project");
      return;
    }
    dispatch(createProject(projectData));
    onClose(); // Close modal after submission
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle>Add New Project</DialogTitle>
      <DialogContent>
        <Box sx={{ mb: 3, mt: 1 }}>
          <Typography variant="subtitle1" fontWeight="bold">
            Client Information
          </Typography>
          <Divider sx={{ mb: 2 }} />

          <Autocomplete
            id="client-select"
            options={clients || []}
            getOptionLabel={(option) => option.name || ""}
            value={selectedClient}
            onChange={(event, newValue) => handleClientSelect(newValue)}
            loading={clientsLoading}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Select Client"
                variant="outlined"
                required
                fullWidth
                margin="dense"
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
              You don't have any clients yet. Please add clients from the client
              management page first.
            </Typography>
          )}
        </Box>

        <Typography variant="subtitle1" fontWeight="bold">
          Project Details
        </Typography>
        <Divider sx={{ mb: 2 }} />

        <TextField
          fullWidth
          label="Title"
          name="title"
          value={projectData.title}
          onChange={handleChange}
          margin="dense"
          required
        />
        <TextField
          fullWidth
          label="Short Description"
          name="shortDescription"
          value={projectData.shortDescription}
          onChange={handleChange}
          margin="dense"
          required
        />
        <TextField
          fullWidth
          label="Description"
          name="description"
          value={projectData.description}
          onChange={handleChange}
          margin="dense"
          multiline
          rows={3}
          required
        />
        <TextField
          select
          fullWidth
          label="Category"
          name="category"
          value={projectData.category}
          onChange={handleChange}
          margin="dense"
          required
        >
          <MenuItem value="Interior Design">Interior Design</MenuItem>
          <MenuItem value="Architecture">Architecture</MenuItem>
          <MenuItem value="Renovation">Renovation</MenuItem>
        </TextField>
        <TextField
          fullWidth
          label="Budget (TND)"
          name="budget"
          type="number"
          value={projectData.budget}
          onChange={handleChange}
          margin="dense"
        />
        <TextField
          fullWidth
          label="Start Date"
          name="startDate"
          type="date"
          value={projectData.startDate}
          onChange={handleChange}
          margin="dense"
          InputLabelProps={{ shrink: true }}
        />
        <TextField
          fullWidth
          label="End Date"
          name="endDate"
          type="date"
          value={projectData.endDate}
          onChange={handleChange}
          margin="dense"
          InputLabelProps={{ shrink: true }}
        />
        <TextField
          fullWidth
          label="Cover Image (URL)"
          name="coverImage"
          value={projectData.coverImage}
          onChange={handleChange}
          margin="dense"
          required
        />
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
        <TextField
          select
          fullWidth
          label="Showroom Status"
          name="showroomStatus"
          value={projectData.showroomStatus}
          onChange={handleChange}
          margin="dense"
        >
          <MenuItem value="featured">Featured</MenuItem>
          <MenuItem value="trending">Trending</MenuItem>
          <MenuItem value="normal">Normal</MenuItem>
        </TextField>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="secondary">
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          color="primary"
          variant="contained"
          disabled={!projectData.clientId}
        >
          Add Project
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddProject;
