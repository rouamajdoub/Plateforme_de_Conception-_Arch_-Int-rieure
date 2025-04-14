import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
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
  Grid,
  Alert,
  Snackbar,
  IconButton,
  Card,
  CardMedia,
  Chip,
} from "@mui/material";
import {
  Close as CloseIcon,
  CloudUpload as CloudUploadIcon,
  Delete as DeleteIcon,
  AddCircleOutline as AddIcon,
} from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import {
  createProject,
  resetProjectState,
  clearErrors,
} from "../../../../../redux/slices/ProjectSlice";
import { fetchClients } from "../../../../../redux/slices/clientsSlice";

const AddProject = ({ onCancel }) => {
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
    coverImage: null, // Changed to null instead of empty string
    isPublic: false,
    showroomStatus: "normal",
    clientId: "",
    status: "pending",
    tags: [], // Initialize tags as array
  });

  const [coverImagePreview, setCoverImagePreview] = useState(null);
  const [beforePhotos, setBeforePhotos] = useState([]);
  const [afterPhotos, setAfterPhotos] = useState([]);
  const [selectedClient, setSelectedClient] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [tag, setTag] = useState("");

  // Fetch architect's clients when component mounts
  useEffect(() => {
    if (user && user._id) {
      dispatch(fetchClients());
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
        if (onCancel) onCancel();
      }, 2000);
    }
  }, [success, message, navigate, onCancel]);

  // Handle form field changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setProjectData({
      ...projectData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  // Handle client selection
  const handleClientSelect = (event, client) => {
    setSelectedClient(client);
    setProjectData({
      ...projectData,
      clientId: client ? client._id : "",
    });
  };

  // Handle cover image upload
  const handleCoverImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];

      // Create preview URL for the selected file
      const previewUrl = URL.createObjectURL(file);
      setCoverImagePreview(previewUrl);

      // Update projectData with the file
      setProjectData({
        ...projectData,
        coverImage: file, // Store the file object, not the URL
      });
    }
  };

  // Handle before photos upload
  const handleBeforePhotosChange = (e) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);

      // Create preview URLs for the selected files
      const newPhotos = files.map((file) => ({
        file,
        preview: URL.createObjectURL(file),
      }));

      setBeforePhotos([...beforePhotos, ...newPhotos]);
    }
  };

  // Handle after photos upload
  const handleAfterPhotosChange = (e) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);

      // Create preview URLs for the selected files
      const newPhotos = files.map((file) => ({
        file,
        preview: URL.createObjectURL(file),
      }));

      setAfterPhotos([...afterPhotos, ...newPhotos]);
    }
  };

  // Remove cover image
  const removeCoverImage = () => {
    if (coverImagePreview) {
      URL.revokeObjectURL(coverImagePreview);
    }
    setCoverImagePreview(null);
    setProjectData({
      ...projectData,
      coverImage: null,
    });
  };

  // Remove a photo from the before list
  const removeBeforePhoto = (index) => {
    const updatedPhotos = [...beforePhotos];

    // Revoke the object URL to avoid memory leaks
    URL.revokeObjectURL(updatedPhotos[index].preview);

    updatedPhotos.splice(index, 1);
    setBeforePhotos(updatedPhotos);
  };

  // Remove a photo from the after list
  const removeAfterPhoto = (index) => {
    const updatedPhotos = [...afterPhotos];

    // Revoke the object URL to avoid memory leaks
    URL.revokeObjectURL(updatedPhotos[index].preview);

    updatedPhotos.splice(index, 1);
    setAfterPhotos(updatedPhotos);
  };

  // Handle tag input
  const handleTagChange = (e) => {
    setTag(e.target.value);
  };

  // Add new tag
  const addTag = () => {
    if (tag.trim() && !projectData.tags.includes(tag.trim())) {
      setProjectData({
        ...projectData,
        tags: [...projectData.tags, tag.trim()],
      });
      setTag("");
    }
  };

  // Remove a tag
  const removeTag = (tagToRemove) => {
    setProjectData({
      ...projectData,
      tags: projectData.tags.filter((tag) => tag !== tagToRemove),
    });
  };

  // Handle key press for tag input
  const handleTagKeyPress = (e) => {
    if (e.key === "Enter" && tag.trim()) {
      e.preventDefault();
      addTag();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Clear any previous errors
    dispatch(clearErrors());

    // Create FormData object for multipart/form-data
    const formData = new FormData();

    // Append project data
    Object.keys(projectData).forEach((key) => {
      if (key !== "coverImage" && key !== "tags") {
        formData.append(key, projectData[key]);
      }
    });

    // Append tags as JSON string
    if (projectData.tags.length > 0) {
      formData.append("tags", JSON.stringify(projectData.tags));
    }

    // Append cover image if exists
    if (projectData.coverImage) {
      formData.append("coverImage", projectData.coverImage);
    }

    // Append before photos
    beforePhotos.forEach((photo) => {
      formData.append("beforePhotos", photo.file);
    });

    // Append after photos
    afterPhotos.forEach((photo) => {
      formData.append("afterPhotos", photo.file);
    });

    dispatch(createProject(formData));
  };

  // Clean up object URLs when component unmounts
  useEffect(() => {
    return () => {
      if (coverImagePreview) URL.revokeObjectURL(coverImagePreview);
      beforePhotos.forEach((photo) => URL.revokeObjectURL(photo.preview));
      afterPhotos.forEach((photo) => URL.revokeObjectURL(photo.preview));
    };
  }, []);

  return (
    <div className="add-project-container">
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 2,
        }}
      >
        <Typography variant="h5" component="h1">
          Create New Project
        </Typography>
        <IconButton onClick={onCancel} size="small" className="close-btn">
          <CloseIcon />
        </IconButton>
      </Box>
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
              You don't have any clients yet. Please add clients from the client
              management page first.
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

            {/* Tags section */}
            <Grid item xs={12}>
              <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                <TextField
                  fullWidth
                  label="Add Tags"
                  value={tag}
                  onChange={handleTagChange}
                  onKeyPress={handleTagKeyPress}
                  margin="normal"
                  sx={{ mr: 1 }}
                />
                <Button
                  variant="outlined"
                  onClick={addTag}
                  disabled={!tag.trim()}
                  startIcon={<AddIcon />}
                >
                  Add
                </Button>
              </Box>
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mt: 1 }}>
                {projectData.tags.map((tag, index) => (
                  <Chip
                    key={index}
                    label={tag}
                    onDelete={() => removeTag(tag)}
                    color="primary"
                    variant="outlined"
                  />
                ))}
              </Box>
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

        {/* Cover Image Section */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="subtitle1" fontWeight="bold">
            Cover Image
          </Typography>
          <Divider sx={{ mb: 2 }} />

          <Box>
            <Button
              variant="outlined"
              component="label"
              startIcon={<CloudUploadIcon />}
              sx={{ mb: 2 }}
            >
              Upload Cover Image
              <input
                type="file"
                accept="image/*"
                hidden
                onChange={handleCoverImageChange}
              />
            </Button>
          </Box>

          {coverImagePreview && (
            <Box sx={{ mt: 2, mb: 3, maxWidth: "300px" }}>
              <Card>
                <CardMedia
                  component="img"
                  height="180"
                  image={coverImagePreview}
                  alt="Cover image preview"
                />
                <Button
                  fullWidth
                  size="small"
                  color="error"
                  onClick={removeCoverImage}
                  startIcon={<DeleteIcon />}
                >
                  Remove
                </Button>
              </Card>
            </Box>
          )}
        </Box>

        {/* Before & After Photos Section */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="subtitle1" fontWeight="bold">
            Before & After Photos
          </Typography>
          <Divider sx={{ mb: 2 }} />

          {/* Before Photos */}
          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle2" sx={{ mb: 1 }}>
              Before Photos
            </Typography>

            <Box>
              <Button
                variant="outlined"
                component="label"
                startIcon={<CloudUploadIcon />}
                sx={{ mb: 2 }}
              >
                Upload Before Photos
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  hidden
                  onChange={handleBeforePhotosChange}
                />
              </Button>
            </Box>

            {beforePhotos.length > 0 && (
              <Grid container spacing={2}>
                {beforePhotos.map((photo, index) => (
                  <Grid item xs={6} sm={4} md={3} key={index}>
                    <Card>
                      <CardMedia
                        component="img"
                        height="120"
                        image={photo.preview}
                        alt={`Before photo ${index + 1}`}
                      />
                      <Button
                        fullWidth
                        size="small"
                        color="error"
                        onClick={() => removeBeforePhoto(index)}
                        startIcon={<DeleteIcon />}
                      >
                        Remove
                      </Button>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            )}
          </Box>

          {/* After Photos */}
          <Box>
            <Typography variant="subtitle2" sx={{ mb: 1 }}>
              After Photos
            </Typography>

            <Box>
              <Button
                variant="outlined"
                component="label"
                startIcon={<CloudUploadIcon />}
                sx={{ mb: 2 }}
              >
                Upload After Photos
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  hidden
                  onChange={handleAfterPhotosChange}
                />
              </Button>
            </Box>

            {afterPhotos.length > 0 && (
              <Grid container spacing={2}>
                {afterPhotos.map((photo, index) => (
                  <Grid item xs={6} sm={4} md={3} key={index}>
                    <Card>
                      <CardMedia
                        component="img"
                        height="120"
                        image={photo.preview}
                        alt={`After photo ${index + 1}`}
                      />
                      <Button
                        fullWidth
                        size="small"
                        color="error"
                        onClick={() => removeAfterPhoto(index)}
                        startIcon={<DeleteIcon />}
                      >
                        Remove
                      </Button>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            )}
          </Box>
        </Box>

        {/* Form Actions */}
        <Box
          sx={{ mt: 4, display: "flex", justifyContent: "flex-end", gap: 2 }}
        >
          <Button variant="outlined" onClick={onCancel} disabled={isLoading}>
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={isLoading || !projectData.clientId || !projectData.title}
          >
            {isLoading ? (
              <>
                <CircularProgress size={24} sx={{ mr: 1 }} color="inherit" />
                Creating...
              </>
            ) : (
              "Create Project"
            )}
          </Button>
        </Box>
      </form>

      {/* Success Snackbar */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={4000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={() => setSnackbarOpen(false)}
          severity="success"
          sx={{ width: "100%" }}
        >
          {message || "Project created successfully!"}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default AddProject;
