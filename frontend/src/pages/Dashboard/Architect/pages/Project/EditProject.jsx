import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  updateProject,
  fetchProjectById,
  resetProjectState,
} from "../../../../../redux/slices/ProjectSlice";
import {
  Box,
  TextField,
  Button,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
  FormControlLabel,
  Switch,
  CircularProgress,
  Alert,
  Divider,
  Paper,
  Card,
  CardMedia,
  IconButton,
  Tooltip,
} from "@mui/material";
import {
  Save as SaveIcon,
  Cancel as CancelIcon,
  CloudUpload as CloudUploadIcon,
  Delete as DeleteIcon,
  AddPhotoAlternate as AddPhotoIcon,
} from "@mui/icons-material";

const EditProject = ({ projectId, isDialog = false, onClose }) => {
  const dispatch = useDispatch();
  const {
    currentProject: project,
    isLoading,
    error,
  } = useSelector((state) => state.projects);
  const { clients } = useSelector((state) => state.clients);

  // Original project data for comparison
  const [originalData, setOriginalData] = useState(null);

  // Form state
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    clientId: "",
    category: "",
    status: "",
    budget: "",
    startDate: "",
    endDate: "",
    isPublic: false,
    location: "",
    tags: "",
  });

  // Image states
  const [coverImage, setCoverImage] = useState(null);
  const [coverImageFile, setCoverImageFile] = useState(null);
  const [coverImageChanged, setCoverImageChanged] = useState(false);
  const [beforePhotos, setBeforePhotos] = useState([]);
  const [afterPhotos, setAfterPhotos] = useState([]);
  const [newBeforePhotos, setNewBeforePhotos] = useState([]);
  const [newAfterPhotos, setNewAfterPhotos] = useState([]);
  const [deletedBeforePhotoIds, setDeletedBeforePhotoIds] = useState([]);
  const [deletedAfterPhotoIds, setDeletedAfterPhotoIds] = useState([]);

  const [formErrors, setFormErrors] = useState({});

  // Load project data when component mounts or projectId changes
  useEffect(() => {
    if (projectId) {
      dispatch(fetchProjectById(projectId));
    }

    return () => {
      if (!isDialog) {
        dispatch(resetProjectState());
      }

      // Clean up image URLs
      if (coverImage && coverImage.startsWith("blob:")) {
        URL.revokeObjectURL(coverImage);
      }

      beforePhotos.forEach((photo) => {
        if (photo.preview && photo.preview.startsWith("blob:")) {
          URL.revokeObjectURL(photo.preview);
        }
      });

      afterPhotos.forEach((photo) => {
        if (photo.preview && photo.preview.startsWith("blob:")) {
          URL.revokeObjectURL(photo.preview);
        }
      });
    };
  }, [dispatch, projectId, isDialog]);

  // Format dates for date input (YYYY-MM-DD)
  const formatDateForInput = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toISOString().split("T")[0];
  };

  // Format location if it's an object
  const formatLocation = (location) => {
    if (!location) return "";
    if (typeof location === "string") return location;

    // If location is an object (address)
    const parts = [];
    if (location.street) parts.push(location.street);
    if (location.city) parts.push(location.city);
    if (location.region) parts.push(location.region);
    if (location.postalCode) parts.push(location.postalCode);
    if (location.country) parts.push(location.country);

    return parts.join(", ");
  };

  // Update form data when project changes
  useEffect(() => {
    if (project && project._id === projectId) {
      const formattedData = {
        title: project.title || "",
        description: project.description || "",
        clientId: project.clientId?._id || project.clientId || "",
        category: project.category || "",
        status: project.status || "",
        budget: project.budget?.toString() || "",
        startDate: formatDateForInput(project.startDate),
        endDate: formatDateForInput(project.endDate),
        isPublic: project.isPublic || false,
        location: formatLocation(project.location),
        tags: project.tags ? project.tags.join(", ") : "",
      };

      setFormData(formattedData);
      setOriginalData(formattedData);

      // Set initial image data
      if (project.coverImage) {
        setCoverImage(project.coverImage);
      }

      if (project.beforePhotos && project.beforePhotos.length > 0) {
        setBeforePhotos(
          project.beforePhotos.map((photo) => ({
            id: photo._id || photo.id,
            url: photo.url,
            isExisting: true,
          }))
        );
      }

      if (project.afterPhotos && project.afterPhotos.length > 0) {
        setAfterPhotos(
          project.afterPhotos.map((photo) => ({
            id: photo._id || photo.id,
            url: photo.url,
            isExisting: true,
          }))
        );
      }
    }
  }, [project, projectId]);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value, checked, type } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });

    // Clear error for this field when user starts typing
    if (formErrors[name]) {
      setFormErrors({
        ...formErrors,
        [name]: null,
      });
    }
  };

  // Handle cover image change
  const handleCoverImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const filePreview = URL.createObjectURL(file);

      // Revoke previous URL if it exists and is a blob
      if (coverImage && coverImage.startsWith("blob:")) {
        URL.revokeObjectURL(coverImage);
      }

      setCoverImage(filePreview);
      setCoverImageFile(file);
      setCoverImageChanged(true);
    }
  };

  // Handle before photos change
  const handleBeforePhotosChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const files = Array.from(e.target.files);
      const newPhotosArray = files.map((file) => ({
        file,
        preview: URL.createObjectURL(file),
        isNew: true,
      }));

      setNewBeforePhotos([...newBeforePhotos, ...newPhotosArray]);
    }
  };

  // Handle after photos change
  const handleAfterPhotosChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const files = Array.from(e.target.files);
      const newPhotosArray = files.map((file) => ({
        file,
        preview: URL.createObjectURL(file),
        isNew: true,
      }));

      setNewAfterPhotos([...newAfterPhotos, ...newPhotosArray]);
    }
  };

  // Remove cover image
  const handleRemoveCoverImage = () => {
    if (coverImage && coverImage.startsWith("blob:")) {
      URL.revokeObjectURL(coverImage);
    }
    setCoverImage(null);
    setCoverImageFile(null);
    setCoverImageChanged(true);
  };

  // Remove before photo
  const handleRemoveBeforePhoto = (index, isNew = false) => {
    if (isNew) {
      // Remove from new photos
      const updatedNewPhotos = [...newBeforePhotos];
      if (updatedNewPhotos[index].preview) {
        URL.revokeObjectURL(updatedNewPhotos[index].preview);
      }
      updatedNewPhotos.splice(index, 1);
      setNewBeforePhotos(updatedNewPhotos);
    } else {
      // Mark existing photo for deletion
      const photoToDelete = beforePhotos[index];
      if (photoToDelete && photoToDelete.id) {
        setDeletedBeforePhotoIds([...deletedBeforePhotoIds, photoToDelete.id]);
      }

      // Remove from UI
      const updatedPhotos = [...beforePhotos];
      updatedPhotos.splice(index, 1);
      setBeforePhotos(updatedPhotos);
    }
  };

  // Remove after photo
  const handleRemoveAfterPhoto = (index, isNew = false) => {
    if (isNew) {
      // Remove from new photos
      const updatedNewPhotos = [...newAfterPhotos];
      if (updatedNewPhotos[index].preview) {
        URL.revokeObjectURL(updatedNewPhotos[index].preview);
      }
      updatedNewPhotos.splice(index, 1);
      setNewAfterPhotos(updatedNewPhotos);
    } else {
      // Mark existing photo for deletion
      const photoToDelete = afterPhotos[index];
      if (photoToDelete && photoToDelete.id) {
        setDeletedAfterPhotoIds([...deletedAfterPhotoIds, photoToDelete.id]);
      }

      // Remove from UI
      const updatedPhotos = [...afterPhotos];
      updatedPhotos.splice(index, 1);
      setAfterPhotos(updatedPhotos);
    }
  };

  // Validate form
  const validateForm = () => {
    const errors = {};
    if (!formData.title) errors.title = "Title is required";
    if (!formData.clientId) errors.clientId = "Client is required";
    if (!formData.category) errors.category = "Category is required";
    if (!formData.status) errors.status = "Status is required";

    if (formData.budget && isNaN(Number(formData.budget))) {
      errors.budget = "Budget must be a number";
    }

    if (
      formData.startDate &&
      formData.endDate &&
      new Date(formData.startDate) > new Date(formData.endDate)
    ) {
      errors.endDate = "End date cannot be before start date";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Get only changed fields
  const getChangedFields = () => {
    if (!originalData) return formData;

    const changedFields = {};

    Object.keys(formData).forEach((key) => {
      // Handle tags specially since it's a string in the form but an array in the API
      if (key === "tags") {
        const originalTags = originalData.tags;
        const newTags = formData.tags;

        if (originalTags !== newTags) {
          changedFields[key] = formData[key]
            .split(",")
            .map((tag) => tag.trim())
            .filter((tag) => tag);
        }
      }
      // Handle budget specially to convert to number
      else if (key === "budget") {
        if (originalData[key] !== formData[key]) {
          changedFields[key] = formData[key]
            ? Number(formData[key])
            : undefined;
        }
      }
      // For all other fields, just compare directly
      else if (originalData[key] !== formData[key]) {
        changedFields[key] = formData[key];
      }
    });

    // Always include the ID
    changedFields._id = projectId;

    return changedFields;
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    // Only get the fields that have changed
    const changedData = getChangedFields();

    // Create a FormData object for file upload
    const formDataObj = new FormData();

    // Append all changed fields
    Object.keys(changedData).forEach((key) => {
      if (key === "tags" && Array.isArray(changedData[key])) {
        formDataObj.append(key, JSON.stringify(changedData[key]));
      } else {
        formDataObj.append(key, changedData[key]);
      }
    });

    // Append cover image if changed
    if (coverImageChanged) {
      if (coverImageFile) {
        formDataObj.append("coverImage", coverImageFile);
      } else {
        // Signal to remove the current cover image
        formDataObj.append("removeCoverImage", "true");
      }
    }

    // Append new before photos
    newBeforePhotos.forEach((photo) => {
      formDataObj.append("newBeforePhotos", photo.file);
    });

    // Append new after photos
    newAfterPhotos.forEach((photo) => {
      formDataObj.append("newAfterPhotos", photo.file);
    });

    // Append deleted photo IDs
    if (deletedBeforePhotoIds.length > 0) {
      formDataObj.append(
        "deletedBeforePhotoIds",
        JSON.stringify(deletedBeforePhotoIds)
      );
    }

    if (deletedAfterPhotoIds.length > 0) {
      formDataObj.append(
        "deletedAfterPhotoIds",
        JSON.stringify(deletedAfterPhotoIds)
      );
    }

    dispatch(updateProject({ projectId, projectData: formDataObj }));
  };

  // Handle cancel
  const handleCancel = () => {
    if (isDialog && onClose) {
      onClose();
    } else {
      // Reset form to original data
      if (originalData) {
        setFormData(originalData);
      }

      // Reset image states
      if (coverImage && coverImage.startsWith("blob:")) {
        URL.revokeObjectURL(coverImage);
      }

      if (project && project.coverImage) {
        setCoverImage(project.coverImage);
      } else {
        setCoverImage(null);
      }

      setCoverImageFile(null);
      setCoverImageChanged(false);

      // Reset before photos
      newBeforePhotos.forEach((photo) => {
        if (photo.preview) URL.revokeObjectURL(photo.preview);
      });
      setNewBeforePhotos([]);

      if (project && project.beforePhotos) {
        setBeforePhotos(
          project.beforePhotos.map((photo) => ({
            id: photo._id || photo.id,
            url: photo.url,
            isExisting: true,
          }))
        );
      } else {
        setBeforePhotos([]);
      }

      setDeletedBeforePhotoIds([]);

      // Reset after photos
      newAfterPhotos.forEach((photo) => {
        if (photo.preview) URL.revokeObjectURL(photo.preview);
      });
      setNewAfterPhotos([]);

      if (project && project.afterPhotos) {
        setAfterPhotos(
          project.afterPhotos.map((photo) => ({
            id: photo._id || photo.id,
            url: photo.url,
            isExisting: true,
          }))
        );
      } else {
        setAfterPhotos([]);
      }

      setDeletedAfterPhotoIds([]);
    }
  };

  if (isLoading && !project) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", my: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Paper elevation={isDialog ? 0 : 3} sx={{ p: 3 }}>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error.message || "An error occurred while updating the project"}
        </Alert>
      )}

      <form onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          {/* Basic Info Section */}
          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom>
              Project Information
            </Typography>
            <Divider sx={{ mb: 2 }} />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Project Title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              error={!!formErrors.title}
              helperText={formErrors.title}
              required
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <FormControl fullWidth error={!!formErrors.clientId}>
              <InputLabel id="client-label">Client</InputLabel>
              <Select
                labelId="client-label"
                name="clientId"
                value={formData.clientId}
                label="Client"
                onChange={handleChange}
                required
              >
                {clients?.map((client) => (
                  <MenuItem key={client._id} value={client._id}>
                    {client.name}
                  </MenuItem>
                ))}
                {!clients?.length && (
                  <MenuItem disabled>No clients available</MenuItem>
                )}
              </Select>
              {formErrors.clientId && (
                <Typography color="error" variant="caption">
                  {formErrors.clientId}
                </Typography>
              )}
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={6}>
            <FormControl fullWidth error={!!formErrors.category}>
              <InputLabel id="category-label">Category</InputLabel>
              <Select
                labelId="category-label"
                name="category"
                value={formData.category}
                label="Category"
                onChange={handleChange}
                required
              >
                <MenuItem value="Residential">Residential</MenuItem>
                <MenuItem value="Commercial">Commercial</MenuItem>
                <MenuItem value="Interior Design">Interior Design</MenuItem>
                <MenuItem value="Landscape">Landscape</MenuItem>
                <MenuItem value="Industrial">Industrial</MenuItem>
                <MenuItem value="Urban Planning">Urban Planning</MenuItem>
              </Select>
              {formErrors.category && (
                <Typography color="error" variant="caption">
                  {formErrors.category}
                </Typography>
              )}
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={6}>
            <FormControl fullWidth error={!!formErrors.status}>
              <InputLabel id="status-label">Status</InputLabel>
              <Select
                labelId="status-label"
                name="status"
                value={formData.status}
                label="Status"
                onChange={handleChange}
                required
              >
                <MenuItem value="pending">Pending</MenuItem>
                <MenuItem value="in_progress">In Progress</MenuItem>
                <MenuItem value="completed">Completed</MenuItem>
                <MenuItem value="canceled">Canceled</MenuItem>
              </Select>
              {formErrors.status && (
                <Typography color="error" variant="caption">
                  {formErrors.status}
                </Typography>
              )}
            </FormControl>
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              multiline
              rows={4}
            />
          </Grid>

          {/* Financial and Timeline Section */}
          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
              Financial & Timeline
            </Typography>
            <Divider sx={{ mb: 2 }} />
          </Grid>

          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              label="Budget ($)"
              name="budget"
              value={formData.budget}
              onChange={handleChange}
              type="number"
              InputProps={{ inputProps: { min: 0 } }}
              error={!!formErrors.budget}
              helperText={formErrors.budget}
            />
          </Grid>

          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              label="Start Date"
              name="startDate"
              type="date"
              value={formData.startDate}
              onChange={handleChange}
              InputLabelProps={{
                shrink: true,
              }}
            />
          </Grid>

          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              label="End Date"
              name="endDate"
              type="date"
              value={formData.endDate}
              onChange={handleChange}
              error={!!formErrors.endDate}
              helperText={formErrors.endDate}
              InputLabelProps={{
                shrink: true,
              }}
            />
          </Grid>

          {/* Cover Image Section */}
          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
              Cover Image
            </Typography>
            <Divider sx={{ mb: 2 }} />
          </Grid>

          <Grid item xs={12}>
            <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
              <Button
                variant="contained"
                component="label"
                startIcon={<CloudUploadIcon />}
                sx={{ mr: 2 }}
              >
                Upload Cover Image
                <input
                  type="file"
                  accept="image/*"
                  hidden
                  onChange={handleCoverImageChange}
                />
              </Button>
              {coverImage && (
                <Button
                  variant="outlined"
                  color="error"
                  onClick={handleRemoveCoverImage}
                  startIcon={<DeleteIcon />}
                >
                  Remove
                </Button>
              )}
            </Box>

            {coverImage && (
              <Box sx={{ mb: 3, maxWidth: "300px" }}>
                <Card>
                  <CardMedia
                    component="img"
                    height="180"
                    image={coverImage}
                    alt="Cover image"
                  />
                </Card>
              </Box>
            )}
          </Grid>

          {/* Before Photos Section */}
          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
              Before Photos
            </Typography>
            <Divider sx={{ mb: 2 }} />
          </Grid>

          <Grid item xs={12}>
            <Box sx={{ mb: 2 }}>
              <Button
                variant="contained"
                component="label"
                startIcon={<AddPhotoIcon />}
              >
                Add Before Photos
                <input
                  type="file"
                  accept="image/*"
                  hidden
                  multiple
                  onChange={handleBeforePhotosChange}
                />
              </Button>
            </Box>

            <Grid container spacing={2}>
              {/* Existing before photos */}
              {beforePhotos.map((photo, index) => (
                <Grid
                  item
                  xs={6}
                  sm={4}
                  md={3}
                  key={`existing-before-${index}`}
                >
                  <Card>
                    <CardMedia
                      component="img"
                      height="120"
                      image={photo.url}
                      alt={`Before photo ${index + 1}`}
                    />
                    <Box
                      sx={{ p: 1, display: "flex", justifyContent: "center" }}
                    >
                      <Tooltip title="Remove Photo">
                        <IconButton
                          color="error"
                          size="small"
                          onClick={() => handleRemoveBeforePhoto(index, false)}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </Card>
                </Grid>
              ))}

              {/* New before photos */}
              {newBeforePhotos.map((photo, index) => (
                <Grid item xs={6} sm={4} md={3} key={`new-before-${index}`}>
                  <Card>
                    <CardMedia
                      component="img"
                      height="120"
                      image={photo.preview}
                      alt={`New before photo ${index + 1}`}
                    />
                    <Box
                      sx={{ p: 1, display: "flex", justifyContent: "center" }}
                    >
                      <Tooltip title="Remove Photo">
                        <IconButton
                          color="error"
                          size="small"
                          onClick={() => handleRemoveBeforePhoto(index, true)}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Grid>

          {/* After Photos Section */}
          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
              After Photos
            </Typography>
            <Divider sx={{ mb: 2 }} />
          </Grid>

          <Grid item xs={12}>
            <Box sx={{ mb: 2 }}>
              <Button
                variant="contained"
                component="label"
                startIcon={<AddPhotoIcon />}
              >
                Add After Photos
                <input
                  type="file"
                  accept="image/*"
                  hidden
                  multiple
                  onChange={handleAfterPhotosChange}
                />
              </Button>
            </Box>

            <Grid container spacing={2}>
              {/* Existing after photos */}
              {afterPhotos.map((photo, index) => (
                <Grid item xs={6} sm={4} md={3} key={`existing-after-${index}`}>
                  <Card>
                    <CardMedia
                      component="img"
                      height="120"
                      image={photo.url}
                      alt={`After photo ${index + 1}`}
                    />
                    <Box
                      sx={{ p: 1, display: "flex", justifyContent: "center" }}
                    >
                      <Tooltip title="Remove Photo">
                        <IconButton
                          color="error"
                          size="small"
                          onClick={() => handleRemoveAfterPhoto(index, false)}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </Card>
                </Grid>
              ))}

              {/* New after photos */}
              {newAfterPhotos.map((photo, index) => (
                <Grid item xs={6} sm={4} md={3} key={`new-after-${index}`}>
                  <Card>
                    <CardMedia
                      component="img"
                      height="120"
                      image={photo.preview}
                      alt={`New after photo ${index + 1}`}
                    />
                    <Box
                      sx={{ p: 1, display: "flex", justifyContent: "center" }}
                    >
                      <Tooltip title="Remove Photo">
                        <IconButton
                          color="error"
                          size="small"
                          onClick={() => handleRemoveAfterPhoto(index, true)}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Grid>

          {/* Additional Details Section */}
          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
              Additional Details
            </Typography>
            <Divider sx={{ mb: 2 }} />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Location"
              name="location"
              value={formData.location}
              onChange={handleChange}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Tags (comma separated)"
              name="tags"
              value={formData.tags}
              onChange={handleChange}
              placeholder="residential, modern, eco-friendly"
            />
          </Grid>

          <Grid item xs={12}>
            <FormControlLabel
              control={
                <Switch
                  checked={formData.isPublic}
                  onChange={handleChange}
                  name="isPublic"
                  color="primary"
                />
              }
              label="Display in public portfolio"
            />
          </Grid>

          {/* Action Buttons */}
          <Grid item xs={12}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "flex-end",
                gap: 2,
                mt: 2,
              }}
            >
              <Button
                variant="outlined"
                startIcon={<CancelIcon />}
                onClick={handleCancel}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="contained"
                startIcon={<SaveIcon />}
                disabled={isLoading}
              >
                {isLoading ? (
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <CircularProgress size={24} sx={{ mr: 1 }} />
                    Saving...
                  </Box>
                ) : (
                  "Save Changes"
                )}
              </Button>
            </Box>
          </Grid>
        </Grid>
      </form>
    </Paper>
  );
};

export default EditProject;
