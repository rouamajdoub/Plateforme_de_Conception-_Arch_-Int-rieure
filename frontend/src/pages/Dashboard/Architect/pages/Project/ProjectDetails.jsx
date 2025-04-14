import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Paper,
  Typography,
  Divider,
  Grid,
  Chip,
  Button,
  CircularProgress,
  Alert,
  IconButton,
  Card,
  CardContent,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Badge,
  ImageList,
  ImageListItem,
  Modal,
} from "@mui/material";
import {
  ArrowBack as ArrowBackIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Person as PersonIcon,
  AttachMoney as AttachMoneyIcon,
  Event as EventIcon,
  Visibility as VisibilityIcon,
  Public as PublicIcon,
  ThumbUp as ThumbUpIcon,
  LocationOn as LocationOnIcon,
  Close as CloseIcon,
  NavigateBefore as NavigateBeforeIcon,
  NavigateNext as NavigateNextIcon,
} from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchProjectById,
  deleteProject,
  resetProjectState,
  getProjectLikesCount,
  likeProject,
} from "../../../../../redux/slices/ProjectSlice";

const ProjectDetails = ({ projectId, isDialog = false, onClose }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { currentProject, isLoading, error, likesCount } = useSelector(
    (state) => state.projects
  );
  const { user } = useSelector((state) => state.auth);

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [imageModalOpen, setImageModalOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    if (projectId) {
      dispatch(fetchProjectById(projectId));
      dispatch(getProjectLikesCount(projectId));
    }

    return () => {
      dispatch(resetProjectState());
    };
  }, [dispatch, projectId]);

  const handleDelete = () => {
    dispatch(deleteProject(projectId));
    setDeleteDialogOpen(false);
    if (isDialog && onClose) {
      onClose();
    } else {
      navigate("/dashboard/architect/projects");
    }
  };

  const handleLikeProject = () => {
    if (user && user._id) {
      dispatch(likeProject({ projectId, userId: user._id }));
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Not set";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // Function to format location, whether it's a string or an object
  const formatLocation = (location) => {
    if (!location) return "Not specified";

    if (typeof location === "string") return location;

    // If location is an object (address)
    const parts = [];
    if (location.street) parts.push(location.street);
    if (location.city) parts.push(location.city);
    if (location.region) parts.push(location.region);
    if (location.postalCode) parts.push(location.postalCode);
    if (location.country) parts.push(location.country);

    return parts.length > 0 ? parts.join(", ") : "Not specified";
  };

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

  const handleImageClick = (index) => {
    setCurrentImageIndex(index);
    setImageModalOpen(true);
  };

  const handlePrevImage = () => {
    setCurrentImageIndex((prevIndex) => {
      const images = currentProject.images || [];
      return prevIndex > 0 ? prevIndex - 1 : images.length - 1;
    });
  };

  const handleNextImage = () => {
    setCurrentImageIndex((prevIndex) => {
      const images = currentProject.images || [];
      return prevIndex < images.length - 1 ? prevIndex + 1 : 0;
    });
  };

  if (isLoading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ mb: 3 }}>
        {error.message || "An error occurred while fetching the project."}
      </Alert>
    );
  }

  if (!currentProject) {
    return <Alert severity="info">Project not found or still loading...</Alert>;
  }

  // Get all images including cover image
  const allImages = [];
  if (currentProject.coverImage) {
    allImages.push(currentProject.coverImage);
  }
  if (currentProject.images && Array.isArray(currentProject.images)) {
    allImages.push(...currentProject.images);
  }

  // Remove outer Paper when shown in dialog
  const ContentWrapper = isDialog ? Box : Paper;
  const contentWrapperProps = isDialog
    ? { sx: { p: 3 } }
    : { elevation: 2, sx: { mb: 4, p: 3, borderRadius: 2 } };

  return (
    <Box sx={{ maxWidth: 1200, mx: "auto", p: isDialog ? 0 : 3 }}>
      {/* Header - Only show if not in dialog mode */}
      {!isDialog && (
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 3,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <IconButton
              onClick={() => navigate("/dashboard/architect/projects")}
              sx={{ mr: 1 }}
            >
              <ArrowBackIcon />
            </IconButton>
            <Typography variant="h5" component="h1">
              Project Details
            </Typography>
          </Box>
          <Box sx={{ display: "flex", gap: 1 }}>
            <Button
              onClick={() =>
                navigate(`/dashboard/architect/projects/${projectId}/edit`)
              }
              variant="outlined"
              startIcon={<EditIcon />}
            >
              Edit
            </Button>
            <Button
              variant="outlined"
              color="error"
              startIcon={<DeleteIcon />}
              onClick={() => setDeleteDialogOpen(true)}
            >
              Delete
            </Button>
          </Box>
        </Box>
      )}

      {/* Project Overview Card */}
      <ContentWrapper {...contentWrapperProps}>
        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
          <Typography variant="h4" component="h2" gutterBottom>
            {currentProject.title}
          </Typography>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Chip
              label={currentProject.status}
              color={getStatusColor(currentProject.status)}
            />
            <Badge badgeContent={likesCount} color="primary">
              <IconButton onClick={handleLikeProject} color="primary">
                <ThumbUpIcon />
              </IconButton>
            </Badge>
          </Box>
        </Box>

        {currentProject.shortDescription && (
          <Typography variant="subtitle1" color="text.secondary" gutterBottom>
            {currentProject.shortDescription}
          </Typography>
        )}

        <Divider sx={{ my: 2 }} />

        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
              <PersonIcon sx={{ mr: 1, color: "primary.main" }} />
              <Typography variant="subtitle1" fontWeight="bold">
                Client:
              </Typography>
              <Typography variant="body1" sx={{ ml: 1 }}>
                {currentProject.clientId?.name || "Unknown Client"}
              </Typography>
            </Box>

            <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
              <AttachMoneyIcon sx={{ mr: 1, color: "primary.main" }} />
              <Typography variant="subtitle1" fontWeight="bold">
                Budget:
              </Typography>
              <Typography variant="body1" sx={{ ml: 1 }}>
                {currentProject.budget
                  ? `$${currentProject.budget.toLocaleString()}`
                  : "Not set"}
              </Typography>
            </Box>

            <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
              <LocationOnIcon sx={{ mr: 1, color: "primary.main" }} />
              <Typography variant="subtitle1" fontWeight="bold">
                Location:
              </Typography>
              <Typography variant="body1" sx={{ ml: 1 }}>
                {formatLocation(currentProject.location)}
              </Typography>
            </Box>

            <Box sx={{ display: "flex", alignItems: "center" }}>
              <PublicIcon sx={{ mr: 1, color: "primary.main" }} />
              <Typography variant="subtitle1" fontWeight="bold">
                Visibility:
              </Typography>
              <Typography variant="body1" sx={{ ml: 1 }}>
                {currentProject.isPublic ? "Public" : "Private"}
                {currentProject.isPublic &&
                  currentProject.showroomStatus &&
                  currentProject.showroomStatus !== "normal" && (
                    <Chip
                      size="small"
                      label={currentProject.showroomStatus}
                      color={
                        currentProject.showroomStatus === "featured"
                          ? "success"
                          : "primary"
                      }
                      sx={{ ml: 1 }}
                    />
                  )}
              </Typography>
            </Box>
          </Grid>

          <Grid item xs={12} md={6}>
            <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
              <VisibilityIcon sx={{ mr: 1, color: "primary.main" }} />
              <Typography variant="subtitle1" fontWeight="bold">
                Category:
              </Typography>
              <Typography variant="body1" sx={{ ml: 1 }}>
                {currentProject.category || "Not specified"}
              </Typography>
            </Box>

            <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
              <EventIcon sx={{ mr: 1, color: "primary.main" }} />
              <Typography variant="subtitle1" fontWeight="bold">
                Start Date:
              </Typography>
              <Typography variant="body1" sx={{ ml: 1 }}>
                {formatDate(currentProject.startDate)}
              </Typography>
            </Box>

            <Box sx={{ display: "flex", alignItems: "center" }}>
              <EventIcon sx={{ mr: 1, color: "primary.main" }} />
              <Typography variant="subtitle1" fontWeight="bold">
                End Date:
              </Typography>
              <Typography variant="body1" sx={{ ml: 1 }}>
                {formatDate(currentProject.endDate)}
              </Typography>
            </Box>
          </Grid>
        </Grid>

        {/* Project Images Section */}
        {allImages.length > 0 && (
          <Box sx={{ mt: 3 }}>
            <Typography variant="h6" gutterBottom>
              Project Images
            </Typography>
            <ImageList
              sx={{ width: "100%", height: 450 }}
              cols={allImages.length === 1 ? 1 : 3}
              rowHeight={300}
              gap={8}
            >
              {allImages.map((img, index) => (
                <ImageListItem
                  key={index}
                  onClick={() => handleImageClick(index)}
                  sx={{
                    cursor: "pointer",
                    "&:hover": {
                      opacity: 0.8,
                      transition: "opacity 0.3s ease-in-out",
                    },
                  }}
                >
                  <img
                    src={img}
                    alt={`Project image ${index + 1}`}
                    loading="lazy"
                    style={{
                      height: "100%",
                      width: "100%",
                      objectFit: "cover",
                      borderRadius: "8px",
                    }}
                  />
                </ImageListItem>
              ))}
            </ImageList>
          </Box>
        )}

        <Divider sx={{ my: 3 }} />

        <Typography variant="h6" gutterBottom>
          Description
        </Typography>
        <Typography variant="body1" paragraph>
          {currentProject.description || "No description provided."}
        </Typography>

        {currentProject.tags && currentProject.tags.length > 0 && (
          <Box sx={{ mt: 3 }}>
            <Typography variant="subtitle1" gutterBottom>
              Tags
            </Typography>
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
              {currentProject.tags.map((tag, index) => (
                <Chip key={index} label={tag} size="small" />
              ))}
            </Box>
          </Box>
        )}
      </ContentWrapper>

      {/* Client Information Card */}
      {currentProject.clientId &&
        typeof currentProject.clientId === "object" && (
          <Card sx={{ mb: isDialog ? 0 : 4 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Client Information
              </Typography>
              <Divider sx={{ mb: 2 }} />
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Name
                  </Typography>
                  <Typography variant="body1">
                    {currentProject.clientId.name || "N/A"}
                  </Typography>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Email
                  </Typography>
                  <Typography variant="body1">
                    {currentProject.clientId.email || "N/A"}
                  </Typography>
                </Grid>
                {currentProject.clientId.phone && (
                  <Grid item xs={12} md={6}>
                    <Typography variant="subtitle2" color="text.secondary">
                      Phone
                    </Typography>
                    <Typography variant="body1">
                      {currentProject.clientId.phone}
                    </Typography>
                  </Grid>
                )}
                {currentProject.clientId.address && (
                  <Grid item xs={12} md={6}>
                    <Typography variant="subtitle2" color="text.secondary">
                      Address
                    </Typography>
                    <Typography variant="body1">
                      {typeof currentProject.clientId.address === "string"
                        ? currentProject.clientId.address
                        : formatLocation(currentProject.clientId.address)}
                    </Typography>
                  </Grid>
                )}
              </Grid>
            </CardContent>
          </Card>
        )}

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      >
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          Are you sure you want to delete this project? This action cannot be
          undone.
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)} color="primary">
            Cancel
          </Button>
          <Button onClick={handleDelete} color="error">
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Image Modal */}
      <Modal
        open={imageModalOpen}
        onClose={() => setImageModalOpen(false)}
        aria-labelledby="image-modal"
        aria-describedby="project-image-full-view"
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "90%",
            maxWidth: 1000,
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 1,
            outline: "none",
            borderRadius: 2,
            display: "flex",
            flexDirection: "column",
          }}
        >
          <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 1 }}>
            <IconButton onClick={() => setImageModalOpen(false)}>
              <CloseIcon />
            </IconButton>
          </Box>
          <Box
            sx={{
              position: "relative",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "80vh",
              width: "100%",
            }}
          >
            <img
              src={allImages[currentImageIndex]}
              alt={`Project image ${currentImageIndex + 1}`}
              style={{
                maxHeight: "100%",
                maxWidth: "100%",
                objectFit: "contain",
              }}
            />
            {allImages.length > 1 && (
              <>
                <IconButton
                  onClick={handlePrevImage}
                  sx={{
                    position: "absolute",
                    left: 0,
                    backgroundColor: "rgba(0,0,0,0.3)",
                    color: "white",
                    "&:hover": {
                      backgroundColor: "rgba(0,0,0,0.5)",
                    },
                  }}
                >
                  <NavigateBeforeIcon fontSize="large" />
                </IconButton>
                <IconButton
                  onClick={handleNextImage}
                  sx={{
                    position: "absolute",
                    right: 0,
                    backgroundColor: "rgba(0,0,0,0.3)",
                    color: "white",
                    "&:hover": {
                      backgroundColor: "rgba(0,0,0,0.5)",
                    },
                  }}
                >
                  <NavigateNextIcon fontSize="large" />
                </IconButton>
              </>
            )}
          </Box>
          <Typography
            variant="caption"
            sx={{
              textAlign: "center",
              mt: 1,
              color: "text.secondary",
            }}
          >
            {`Image ${currentImageIndex + 1} of ${allImages.length}`}
          </Typography>
        </Box>
      </Modal>
    </Box>
  );
};

export default ProjectDetails;
