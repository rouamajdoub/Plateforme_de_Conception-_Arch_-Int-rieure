import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import "./ProjectStyles.css";
import { motion } from "framer-motion";

import {
  updateProject,
  fetchProjectById,
  resetProjectState,
  addMilestone,
  updateMilestone,
  deleteMilestone,
  updateProjectProgress,
  addPayment,
  updatePaymentStatus,
  resetMilestoneState,
  resetPaymentState,
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
  InputAdornment,
  CardMedia,
  IconButton,
  Slider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  List,
  Chip,
  LinearProgress,
} from "@mui/material";
import {
  Save as SaveIcon,
  Cancel as CancelIcon,
  Delete as DeleteIcon,
  AddPhotoAlternate as AddPhotoIcon,
  Add as AddIcon,
  Edit as EditIcon,
  ExpandMore as ExpandMoreIcon,
  Payment as PaymentIcon,
} from "@mui/icons-material";

const EditProject = ({ projectId, isDialog = false, onClose }) => {
  const dispatch = useDispatch();
  const {
    currentProject: project,
    isLoading,
    error,
    milestone: milestoneState,
    payment: paymentState,
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

  // Progress state
  const [progressPercentage, setProgressPercentage] = useState(0);

  // Milestone states
  const [milestones, setMilestones] = useState([]);
  const [milestoneDialogOpen, setMilestoneDialogOpen] = useState(false);
  const [currentMilestone, setCurrentMilestone] = useState({
    title: "",
    description: "",
    dueDate: "",
    status: "pending",
    completionPercentage: 0,
  });
  const [isEditingMilestone, setIsEditingMilestone] = useState(false);
  const [currentMilestoneId, setCurrentMilestoneId] = useState(null);

  // Payment states
  const [paymentDialogOpen, setPaymentDialogOpen] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState("unpaid");
  const [currentPayment, setCurrentPayment] = useState({
    amount: "",
    date: "",
    method: "bank_transfer",
    notes: "",
    status: "pending",
  });
  const [isEditingPayment, setIsEditingPayment] = useState(false);
  const [currentPaymentId, setCurrentPaymentId] = useState(null);

  const [formErrors, setFormErrors] = useState({});

  // Status colors
  const getStatusColor = (status) => {
    switch (status) {
      case "completed":
        return "success";
      case "in_progress":
        return "primary";
      case "pending":
        return "warning";
      case "canceled":
        return "error";
      default:
        return "default";
    }
  };

  const getPaymentStatusColor = (status) => {
    switch (status) {
      case "paid":
        return "success";
      case "partial":
        return "warning";
      case "unpaid":
        return "error";
      case "overdue":
        return "error";
      default:
        return "default";
    }
  };

  // Load project data when component mounts or projectId changes
  useEffect(() => {
    if (projectId) {
      dispatch(fetchProjectById(projectId));
    }

    return () => {
      if (!isDialog) {
        dispatch(resetProjectState());
        dispatch(resetMilestoneState());
        dispatch(resetPaymentState());
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

      // Set initial progress
      setProgressPercentage(project.progressPercentage || 0);

      // Set milestones
      if (project.milestones && project.milestones.length > 0) {
        setMilestones(project.milestones);
      }

      // Set payment status
      if (project.paymentStatus) {
        setPaymentStatus(project.paymentStatus);
      }

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

  // Handle milestone input changes
  const handleMilestoneChange = (e) => {
    const { name, value } = e.target;
    setCurrentMilestone({
      ...currentMilestone,
      [name]: value,
    });
  };

  // Handle payment input changes
  const handlePaymentChange = (e) => {
    const { name, value } = e.target;
    setCurrentPayment({
      ...currentPayment,
      [name]: value,
    });
  };

  // Handle progress slider change
  const handleProgressChange = (event, newValue) => {
    setProgressPercentage(newValue);
  };

  // Update project progress
  const handleUpdateProgress = () => {
    dispatch(
      updateProjectProgress({
        projectId: project._id,
        progressData: { progressPercentage },
      })
    );
  };

  // Open milestone dialog
  const handleOpenMilestoneDialog = (milestone = null) => {
    if (milestone) {
      setCurrentMilestone({
        title: milestone.title || "",
        description: milestone.description || "",
        dueDate: formatDateForInput(milestone.dueDate) || "",
        status: milestone.status || "pending",
        completionPercentage: milestone.completionPercentage || 0,
      });
      setIsEditingMilestone(true);
      setCurrentMilestoneId(milestone._id);
    } else {
      setCurrentMilestone({
        title: "",
        description: "",
        dueDate: "",
        status: "pending",
        completionPercentage: 0,
      });
      setIsEditingMilestone(false);
      setCurrentMilestoneId(null);
    }
    setMilestoneDialogOpen(true);
  };

  // Close milestone dialog
  const handleCloseMilestoneDialog = () => {
    setMilestoneDialogOpen(false);
    setCurrentMilestone({
      title: "",
      description: "",
      dueDate: "",
      status: "pending",
      completionPercentage: 0,
    });
    setIsEditingMilestone(false);
    setCurrentMilestoneId(null);
  };

  // Save milestone
  const handleSaveMilestone = () => {
    if (!currentMilestone.title) {
      // Show error
      return;
    }

    if (isEditingMilestone && currentMilestoneId) {
      dispatch(
        updateMilestone({
          projectId: project._id,
          milestoneId: currentMilestoneId,
          milestoneData: currentMilestone,
        })
      );
    } else {
      dispatch(
        addMilestone({
          projectId: project._id,
          milestoneData: currentMilestone,
        })
      );
    }
    handleCloseMilestoneDialog();
  };

  // Delete milestone
  const handleDeleteMilestone = (milestoneId) => {
    if (window.confirm("Are you sure you want to delete this milestone?")) {
      dispatch(
        deleteMilestone({
          projectId: project._id,
          milestoneId,
        })
      );
    }
  };

  // Open payment dialog
  const handleOpenPaymentDialog = (payment = null) => {
    if (payment) {
      setCurrentPayment({
        amount: payment.amount?.toString() || "",
        date: formatDateForInput(payment.date) || "",
        method: payment.method || "bank_transfer",
        notes: payment.notes || "",
        status: payment.status || "pending",
      });
      setIsEditingPayment(true);
      setCurrentPaymentId(payment._id);
    } else {
      setCurrentPayment({
        amount: "",
        date: formatDateForInput(new Date()),
        method: "bank_transfer",
        notes: "",
        status: "pending",
      });
      setIsEditingPayment(false);
      setCurrentPaymentId(null);
    }
    setPaymentDialogOpen(true);
  };

  // Close payment dialog
  const handleClosePaymentDialog = () => {
    setPaymentDialogOpen(false);
    setCurrentPayment({
      amount: "",
      date: "",
      method: "bank_transfer",
      notes: "",
      status: "pending",
    });
    setIsEditingPayment(false);
    setCurrentPaymentId(null);
  };

  // Save payment
  const handleSavePayment = () => {
    if (!currentPayment.amount || isNaN(Number(currentPayment.amount))) {
      // Show error
      return;
    }

    const paymentData = {
      ...currentPayment,
      amount: Number(currentPayment.amount),
    };

    if (isEditingPayment && currentPaymentId) {
      // Handle updating payment if needed
      handleClosePaymentDialog();
    } else {
      dispatch(
        addPayment({
          projectId: project._id,
          paymentData,
        })
      );
      handleClosePaymentDialog();
    }
  };

  // Update payment status
  const handleUpdatePaymentStatus = (newStatus) => {
    dispatch(
      updatePaymentStatus({
        projectId: project._id,
        statusData: { status: newStatus },
      })
    );
    setPaymentStatus(newStatus);
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

    // Append progress percentage if changed
    if (progressPercentage !== (project?.progressPercentage || 0)) {
      formDataObj.append("progressPercentage", progressPercentage);
    }

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
      if (project) {
        setFormData(originalData || {});
        setProgressPercentage(project.progressPercentage || 0);

        if (project.milestones) {
          setMilestones(project.milestones);
        }

        if (project.paymentStatus) {
          setPaymentStatus(project.paymentStatus);
        }
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
    <Paper
      elevation={isDialog ? 0 : 3}
      sx={{
        p: 3,
        backgroundColor: "#c9d3f1",
        color: "#242d49",
        borderRadius: "12px",
      }}
      className="edit-project-container"
      component={motion.div}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error.message || "An error occurred while updating the project"}
        </Alert>
      )}

      {milestoneState.error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {milestoneState.error.message || "An error occurred with milestones"}
        </Alert>
      )}

      {paymentState.error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {paymentState.error.message || "An error occurred with payments"}
        </Alert>
      )}

      {(milestoneState.success || paymentState.success) && (
        <Alert severity="success" sx={{ mb: 2 }}>
          {milestoneState.message ||
            paymentState.message ||
            "Operation successful!"}
        </Alert>
      )}

      <form onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          {/* Basic Info Section */}
          <Grid item xs={12}>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <Typography variant="h6" gutterBottom>
                Project Information
              </Typography>
              <Divider sx={{ mb: 2 }} />
            </motion.div>
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

          {/* Progress Section */}
          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
              Project Progress
            </Typography>
            <Divider sx={{ mb: 2 }} />
          </Grid>

          <Grid item xs={12}>
            <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
              <Typography variant="body1" sx={{ mr: 2, minWidth: "100px" }}>
                Progress: {progressPercentage}%
              </Typography>
              <Slider
                value={progressPercentage}
                onChange={handleProgressChange}
                aria-labelledby="project-progress-slider"
                valueLabelDisplay="auto"
                step={5}
                marks
                min={0}
                max={100}
                sx={{ flexGrow: 1, mr: 2 }}
              />
              <Button
                variant="outlined"
                onClick={handleUpdateProgress}
                disabled={
                  progressPercentage === (project?.progressPercentage || 0)
                }
              >
                Update
              </Button>
            </Box>
          </Grid>

          {/* Milestones Section */}
          <Grid item xs={12}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
                Milestones
              </Typography>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => handleOpenMilestoneDialog()}
                sx={{ mt: 2 }}
              >
                Add Milestone
              </Button>
            </Box>
            <Divider sx={{ mb: 2 }} />
          </Grid>

          <Grid item xs={12}>
            {milestoneState.isLoading ? (
              <Box sx={{ display: "flex", justifyContent: "center", my: 2 }}>
                <CircularProgress size={24} />
              </Box>
            ) : project?.milestones && project.milestones.length > 0 ? (
              <List>
                {project.milestones.map((milestone) => (
                  <Paper
                    key={milestone._id}
                    sx={{ mb: 2, p: 2 }}
                    component={motion.div}
                    whileHover={{ scale: 1.02 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "flex-start",
                      }}
                    >
                      <Box>
                        <Typography variant="subtitle1" fontWeight="bold">
                          {milestone.title}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {milestone.description}
                        </Typography>
                        <Box
                          sx={{ display: "flex", alignItems: "center", mt: 1 }}
                        >
                          <Chip
                            label={milestone.status}
                            color={getStatusColor(milestone.status)}
                            size="small"
                            sx={{ mr: 2 }}
                          />
                          <Typography variant="body2">
                            Due:{" "}
                            {new Date(milestone.dueDate).toLocaleDateString()}
                          </Typography>
                        </Box>
                      </Box>
                      <Box>
                        <IconButton
                          onClick={() => handleOpenMilestoneDialog(milestone)}
                          size="small"
                        >
                          <EditIcon fontSize="small" />
                        </IconButton>
                        <IconButton
                          onClick={() => handleDeleteMilestone(milestone._id)}
                          size="small"
                          color="error"
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Box>
                    </Box>
                    <Box sx={{ display: "flex", alignItems: "center", mt: 1 }}>
                      <Typography
                        variant="body2"
                        sx={{ mr: 2, minWidth: "40px" }}
                      >
                        {milestone.completionPercentage}%
                      </Typography>
                      <LinearProgress
                        variant="determinate"
                        value={milestone.completionPercentage}
                        sx={{ flexGrow: 1, height: 8, borderRadius: 1 }}
                      />
                    </Box>
                  </Paper>
                ))}
              </List>
            ) : (
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ fontStyle: "italic" }}
              >
                No milestones defined for this project yet. Add a milestone to
                track project progress.
              </Typography>
            )}
          </Grid>

          {/* Payment Section */}
          <Grid item xs={12}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
                Payment Information
              </Typography>
              <Button
                variant="contained"
                startIcon={<PaymentIcon />}
                onClick={() => handleOpenPaymentDialog()}
                sx={{ mt: 2 }}
              >
                Add Payment
              </Button>
            </Box>
            <Divider sx={{ mb: 2 }} />
          </Grid>

          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel id="payment-status-label">Payment Status</InputLabel>
              <Select
                labelId="payment-status-label"
                value={paymentStatus}
                label="Payment Status"
                onChange={(e) => handleUpdatePaymentStatus(e.target.value)}
              >
                <MenuItem value="unpaid">Unpaid</MenuItem>
                <MenuItem value="partial">Partially Paid</MenuItem>
                <MenuItem value="paid">Paid</MenuItem>
                <MenuItem value="overdue">Overdue</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Budget"
              name="budget"
              type="number"
              value={formData.budget}
              onChange={handleChange}
              error={!!formErrors.budget}
              helperText={formErrors.budget}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">$</InputAdornment>
                ),
              }}
            />
          </Grid>

          <Grid item xs={12}>
            {paymentState.isLoading ? (
              <Box sx={{ display: "flex", justifyContent: "center", my: 2 }}>
                <CircularProgress size={24} style={{ color: "#ff919d" }} />
              </Box>
            ) : project?.payments && project.payments.length > 0 ? (
              <List>
                {project.payments.map((payment) => (
                  <Paper key={payment._id} sx={{ mb: 2, p: 2 }}>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "flex-start",
                      }}
                    >
                      <Box>
                        <Typography variant="subtitle1" fontWeight="bold">
                          ${payment.amount.toFixed(2)}
                        </Typography>
                        <Typography variant="body2">
                          Date: {new Date(payment.date).toLocaleDateString()}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Method: {payment.method.replace("_", " ")}
                        </Typography>
                        {payment.notes && (
                          <Typography variant="body2" color="text.secondary">
                            Notes: {payment.notes}
                          </Typography>
                        )}
                      </Box>
                      <Box>
                        <Chip
                          label={payment.status}
                          color={getPaymentStatusColor(payment.status)}
                          size="small"
                        />
                      </Box>
                    </Box>
                  </Paper>
                ))}
              </List>
            ) : (
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ fontStyle: "italic" }}
              >
                No payments recorded for this project yet.
              </Typography>
            )}
          </Grid>

          {/* Schedule Section */}
          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
              Schedule
            </Typography>
            <Divider sx={{ mb: 2 }} />
          </Grid>

          <Grid item xs={12} sm={6}>
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

          <Grid item xs={12} sm={6}>
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

          {/* Additional Info Section */}
          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
              Additional Information
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
              placeholder="residential, modern, renovation"
            />
          </Grid>

          <Grid item xs={12}>
            <FormControlLabel
              control={
                <Switch
                  checked={formData.isPublic}
                  onChange={handleChange}
                  name="isPublic"
                />
              }
              label="Make project public in portfolio"
            />
          </Grid>

          {/* Image Section */}
          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
              Project Images
            </Typography>
            <Divider sx={{ mb: 2 }} />
          </Grid>

          {/* Cover Image */}
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle1" gutterBottom>
              Cover Image
            </Typography>
            {coverImage ? (
              <Box sx={{ position: "relative", mb: 2 }}>
                <CardMedia
                  component="img"
                  image={coverImage}
                  alt="Project Cover"
                  sx={{ height: 200, borderRadius: 1 }}
                />
                <IconButton
                  sx={{
                    position: "absolute",
                    top: 8,
                    right: 8,
                    backgroundColor: "rgba(0,0,0,0.6)",
                    "&:hover": { backgroundColor: "rgba(0,0,0,0.8)" },
                  }}
                  onClick={handleRemoveCoverImage}
                >
                  <DeleteIcon sx={{ color: "white" }} />
                </IconButton>
              </Box>
            ) : (
              <Button
                variant="outlined"
                component="label"
                startIcon={<AddPhotoIcon />}
                sx={{ mb: 2 }}
              >
                Add Cover Image
                <input
                  type="file"
                  hidden
                  accept="image/*"
                  onChange={handleCoverImageChange}
                />
              </Button>
            )}
          </Grid>

          {/* Before and After Photos */}
          <Grid item xs={12}>
            <Accordion>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography>Project Photos</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Grid container spacing={2}>
                  {/* Before Photos */}
                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle1" gutterBottom>
                      Before Photos
                    </Typography>
                    <Box sx={{ mb: 2 }}>
                      <Button
                        variant="outlined"
                        component="label"
                        startIcon={<AddPhotoIcon />}
                        sx={{ mb: 2 }}
                      >
                        Add Before Photos
                        <input
                          type="file"
                          hidden
                          accept="image/*"
                          multiple
                          onChange={handleBeforePhotosChange}
                        />
                      </Button>
                    </Box>
                    <Grid container spacing={1}>
                      {beforePhotos.map((photo, index) => (
                        <Grid item xs={6} key={`existing-before-${index}`}>
                          <Box sx={{ position: "relative" }}>
                            <img
                              src={photo.url}
                              alt={`Before ${index + 1}`}
                              style={{
                                width: "100%",
                                height: 100,
                                objectFit: "cover",
                                borderRadius: 4,
                              }}
                            />
                            <IconButton
                              sx={{
                                position: "absolute",
                                top: 4,
                                right: 4,
                                backgroundColor: "rgba(0,0,0,0.6)",
                                "&:hover": {
                                  backgroundColor: "rgba(0,0,0,0.8)",
                                },
                                padding: "4px",
                              }}
                              onClick={() => handleRemoveBeforePhoto(index)}
                            >
                              <DeleteIcon
                                sx={{ color: "white", fontSize: 16 }}
                              />
                            </IconButton>
                          </Box>
                        </Grid>
                      ))}
                      {newBeforePhotos.map((photo, index) => (
                        <Grid item xs={6} key={`new-before-${index}`}>
                          <Box sx={{ position: "relative" }}>
                            <img
                              src={photo.preview}
                              alt={`New Before ${index + 1}`}
                              style={{
                                width: "100%",
                                height: 100,
                                objectFit: "cover",
                                borderRadius: 4,
                              }}
                            />
                            <IconButton
                              sx={{
                                position: "absolute",
                                top: 4,
                                right: 4,
                                backgroundColor: "rgba(0,0,0,0.6)",
                                "&:hover": {
                                  backgroundColor: "rgba(0,0,0,0.8)",
                                },
                                padding: "4px",
                              }}
                              onClick={() =>
                                handleRemoveBeforePhoto(index, true)
                              }
                            >
                              <DeleteIcon
                                sx={{ color: "white", fontSize: 16 }}
                              />
                            </IconButton>
                          </Box>
                        </Grid>
                      ))}
                    </Grid>
                  </Grid>

                  {/* After Photos */}
                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle1" gutterBottom>
                      After Photos
                    </Typography>
                    <Box sx={{ mb: 2 }}>
                      <Button
                        variant="outlined"
                        component="label"
                        startIcon={<AddPhotoIcon />}
                        sx={{ mb: 2 }}
                      >
                        Add After Photos
                        <input
                          type="file"
                          hidden
                          accept="image/*"
                          multiple
                          onChange={handleAfterPhotosChange}
                        />
                      </Button>
                    </Box>
                    <Grid container spacing={1}>
                      {afterPhotos.map((photo, index) => (
                        <Grid item xs={6} key={`existing-after-${index}`}>
                          <Box sx={{ position: "relative" }}>
                            <img
                              src={photo.url}
                              alt={`After ${index + 1}`}
                              style={{
                                width: "100%",
                                height: 100,
                                objectFit: "cover",
                                borderRadius: 4,
                              }}
                            />
                            <IconButton
                              sx={{
                                position: "absolute",
                                top: 4,
                                right: 4,
                                backgroundColor: "rgba(0,0,0,0.6)",
                                "&:hover": {
                                  backgroundColor: "rgba(0,0,0,0.8)",
                                },
                                padding: "4px",
                              }}
                              onClick={() => handleRemoveAfterPhoto(index)}
                            >
                              <DeleteIcon
                                sx={{ color: "white", fontSize: 16 }}
                              />
                            </IconButton>
                          </Box>
                        </Grid>
                      ))}
                      {newAfterPhotos.map((photo, index) => (
                        <Grid item xs={6} key={`new-after-${index}`}>
                          <Box sx={{ position: "relative" }}>
                            <img
                              src={photo.preview}
                              alt={`New After ${index + 1}`}
                              style={{
                                width: "100%",
                                height: 100,
                                objectFit: "cover",
                                borderRadius: 4,
                              }}
                            />
                            <IconButton
                              sx={{
                                position: "absolute",
                                top: 4,
                                right: 4,
                                backgroundColor: "rgba(0,0,0,0.6)",
                                "&:hover": {
                                  backgroundColor: "rgba(0,0,0,0.8)",
                                },
                                padding: "4px",
                              }}
                              onClick={() =>
                                handleRemoveAfterPhoto(index, true)
                              }
                            >
                              <DeleteIcon
                                sx={{ color: "white", fontSize: 16 }}
                              />
                            </IconButton>
                          </Box>
                        </Grid>
                      ))}
                    </Grid>
                  </Grid>
                </Grid>
              </AccordionDetails>
            </Accordion>
          </Grid>

          {/* Action buttons */}
          <Grid
            item
            xs={12}
            sx={{ mt: 2, display: "flex", justifyContent: "flex-end" }}
          >
            <Button
              variant="outlined"
              onClick={handleCancel}
              startIcon={<CancelIcon />}
              sx={{ mr: 2 }}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              startIcon={<SaveIcon />}
              disabled={isLoading}
            >
              {isLoading ? <CircularProgress size={24} /> : "Save Project"}
            </Button>
          </Grid>
        </Grid>
      </form>

      {/* Milestone Dialog */}
      <Dialog
        open={milestoneDialogOpen}
        onClose={handleCloseMilestoneDialog}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          {isEditingMilestone ? "Edit Milestone" : "Add Milestone"}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 0.5 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Title"
                name="title"
                value={currentMilestone.title}
                onChange={handleMilestoneChange}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Description"
                name="description"
                value={currentMilestone.description}
                onChange={handleMilestoneChange}
                multiline
                rows={3}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Due Date"
                name="dueDate"
                type="date"
                value={currentMilestone.dueDate}
                onChange={handleMilestoneChange}
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel id="milestone-status-label">Status</InputLabel>
                <Select
                  labelId="milestone-status-label"
                  name="status"
                  value={currentMilestone.status}
                  label="Status"
                  onChange={handleMilestoneChange}
                >
                  <MenuItem value="pending">Pending</MenuItem>
                  <MenuItem value="in_progress">In Progress</MenuItem>
                  <MenuItem value="completed">Completed</MenuItem>
                  <MenuItem value="blocked">Blocked</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="body2" gutterBottom>
                Completion Percentage: {currentMilestone.completionPercentage}%
              </Typography>
              <Slider
                value={currentMilestone.completionPercentage}
                onChange={(e, newValue) =>
                  setCurrentMilestone({
                    ...currentMilestone,
                    completionPercentage: newValue,
                  })
                }
                valueLabelDisplay="auto"
                step={5}
                marks
                min={0}
                max={100}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseMilestoneDialog}>Cancel</Button>
          <Button onClick={handleSaveMilestone} variant="contained">
            Save
          </Button>
        </DialogActions>
      </Dialog>

      {/* Payment Dialog */}
      <Dialog
        open={paymentDialogOpen}
        onClose={handleClosePaymentDialog}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          {isEditingPayment ? "Edit Payment" : "Add Payment"}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 0.5 }}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Amount"
                name="amount"
                type="number"
                value={currentPayment.amount}
                onChange={handlePaymentChange}
                required
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">$</InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Date"
                name="date"
                type="date"
                value={currentPayment.date}
                onChange={handlePaymentChange}
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel id="payment-method-label">
                  Payment Method
                </InputLabel>
                <Select
                  labelId="payment-method-label"
                  name="method"
                  value={currentPayment.method}
                  label="Payment Method"
                  onChange={handlePaymentChange}
                >
                  <MenuItem value="bank_transfer">Bank Transfer</MenuItem>
                  <MenuItem value="cash">Cash</MenuItem>
                  <MenuItem value="check">Check</MenuItem>
                  <MenuItem value="credit_card">Credit Card</MenuItem>
                  <MenuItem value="paypal">PayPal</MenuItem>
                  <MenuItem value="other">Other</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Notes"
                name="notes"
                value={currentPayment.notes}
                onChange={handlePaymentChange}
                multiline
                rows={2}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClosePaymentDialog}>Cancel</Button>
          <Button onClick={handleSavePayment} variant="contained">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
};

export default EditProject;
