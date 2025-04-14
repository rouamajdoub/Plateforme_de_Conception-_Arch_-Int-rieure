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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Badge,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  LinearProgress,
  ImageList,
  ImageListItem,
  Tab,
  Tabs,
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
  CheckCircle as CheckCircleIcon,
  Pending as PendingIcon,
  ImageAspectRatio as ImageIcon,
  Payment as PaymentIcon,
  Flag as FlagIcon,
} from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchProjectById,
  deleteProject,
  resetProjectState,
  getProjectLikesCount,
  likeProject,
} from "../../../../../redux/slices/ProjectSlice";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

// Function to get custom theme colors
const getThemeColors = () => {
  return {
    background: "#cdd6f2",
    text: "#242d49",
    accent: "#e57f8a",
    lightAccent: "#f6e7e9",
    success: "#4caf50",
    warning: "#ff9800",
    info: "#2196f3",
    error: "#f44336",
  };
};

const TabPanel = (props) => {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`project-tabpanel-${index}`}
      aria-labelledby={`project-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ pt: 3 }}>{children}</Box>}
    </div>
  );
};

const ProjectDetails = ({ projectId, isDialog = false, onClose }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const colors = getThemeColors();

  const { currentProject, isLoading, error, likesCount } = useSelector(
    (state) => state.projects
  );
  const { user } = useSelector((state) => state.auth);

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [tabValue, setTabValue] = useState(0);

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

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
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

  const formatCurrency = (amount) => {
    if (amount === undefined || amount === null) return "Not set";
    return `$${Number(amount).toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
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
        return colors.warning;
      case "in_progress":
        return colors.info;
      case "completed":
        return colors.success;
      case "canceled":
        return colors.error;
      default:
        return "default";
    }
  };

  const getStatusChip = (status) => {
    return (
      <Chip
        label={status}
        sx={{
          backgroundColor: getStatusColor(status),
          color: "white",
          textTransform: "capitalize",
        }}
      />
    );
  };

  const getMilestoneStatusIcon = (status) => {
    switch (status) {
      case "completed":
        return <CheckCircleIcon sx={{ color: colors.success }} />;
      case "in_progress":
        return <PendingIcon sx={{ color: colors.info }} />;
      default:
        return <FlagIcon sx={{ color: colors.warning }} />;
    }
  };

  if (isLoading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          p: 4,
          backgroundColor: colors.background,
          minHeight: "100vh",
        }}
      >
        <CircularProgress sx={{ color: colors.accent }} />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ backgroundColor: colors.background, p: 3 }}>
        <Alert severity="error" sx={{ mb: 3 }}>
          {error.message || "An error occurred while fetching the project."}
        </Alert>
      </Box>
    );
  }

  if (!currentProject) {
    return (
      <Box sx={{ backgroundColor: colors.background, p: 3 }}>
        <Alert severity="info">Project not found or still loading...</Alert>
      </Box>
    );
  }

  // Remove outer Paper when shown in dialog
  const ContentWrapper = isDialog ? Box : Paper;
  const contentWrapperProps = isDialog
    ? { sx: { p: 3 } }
    : {
        elevation: 2,
        sx: {
          mb: 4,
          p: 3,
          borderRadius: 2,
          backgroundColor: "white",
          boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
        },
      };

  return (
    <Box
      sx={{
        maxWidth: 1200,
        mx: "auto",
        p: isDialog ? 0 : 3,
        backgroundColor: colors.background,
        color: colors.text,
        minHeight: "100vh",
      }}
    >
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
              sx={{ mr: 1, color: colors.text }}
            >
              <ArrowBackIcon />
            </IconButton>
            <Typography variant="h5" component="h1" sx={{ color: colors.text }}>
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
              sx={{
                borderColor: colors.accent,
                color: colors.accent,
                "&:hover": {
                  borderColor: colors.accent,
                  backgroundColor: colors.lightAccent,
                },
              }}
            >
              Edit
            </Button>
            <Button
              variant="contained"
              color="error"
              startIcon={<DeleteIcon />}
              onClick={() => setDeleteDialogOpen(true)}
              sx={{
                backgroundColor: colors.accent,
                "&:hover": {
                  backgroundColor: "#c5616c",
                },
              }}
            >
              Delete
            </Button>
          </Box>
        </Box>
      )}

      {/* Project Overview Card */}
      <ContentWrapper {...contentWrapperProps}>
        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
          <Typography
            variant="h4"
            component="h2"
            gutterBottom
            sx={{ color: colors.text }}
          >
            {currentProject.title}
          </Typography>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            {getStatusChip(currentProject.status)}
            <Badge badgeContent={likesCount} color="primary">
              <IconButton
                onClick={handleLikeProject}
                sx={{ color: colors.accent }}
              >
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
              <PersonIcon sx={{ mr: 1, color: colors.accent }} />
              <Typography
                variant="subtitle1"
                fontWeight="bold"
                sx={{ color: colors.text }}
              >
                Client:
              </Typography>
              <Typography variant="body1" sx={{ ml: 1, color: colors.text }}>
                {currentProject.clientId?.name || "Unknown Client"}
              </Typography>
            </Box>

            <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
              <AttachMoneyIcon sx={{ mr: 1, color: colors.accent }} />
              <Typography
                variant="subtitle1"
                fontWeight="bold"
                sx={{ color: colors.text }}
              >
                Budget:
              </Typography>
              <Typography variant="body1" sx={{ ml: 1, color: colors.text }}>
                {currentProject.budget
                  ? `$${currentProject.budget.toLocaleString()}`
                  : "Not set"}
              </Typography>
            </Box>

            <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
              <LocationOnIcon sx={{ mr: 1, color: colors.accent }} />
              <Typography
                variant="subtitle1"
                fontWeight="bold"
                sx={{ color: colors.text }}
              >
                Location:
              </Typography>
              <Typography variant="body1" sx={{ ml: 1, color: colors.text }}>
                {formatLocation(currentProject.location)}
              </Typography>
            </Box>

            <Box sx={{ display: "flex", alignItems: "center" }}>
              <PublicIcon sx={{ mr: 1, color: colors.accent }} />
              <Typography
                variant="subtitle1"
                fontWeight="bold"
                sx={{ color: colors.text }}
              >
                Visibility:
              </Typography>
              <Typography variant="body1" sx={{ ml: 1, color: colors.text }}>
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
              <VisibilityIcon sx={{ mr: 1, color: colors.accent }} />
              <Typography
                variant="subtitle1"
                fontWeight="bold"
                sx={{ color: colors.text }}
              >
                Category:
              </Typography>
              <Typography variant="body1" sx={{ ml: 1, color: colors.text }}>
                {currentProject.category || "Not specified"}
              </Typography>
            </Box>

            <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
              <EventIcon sx={{ mr: 1, color: colors.accent }} />
              <Typography
                variant="subtitle1"
                fontWeight="bold"
                sx={{ color: colors.text }}
              >
                Start Date:
              </Typography>
              <Typography variant="body1" sx={{ ml: 1, color: colors.text }}>
                {formatDate(currentProject.startDate)}
              </Typography>
            </Box>

            <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
              <EventIcon sx={{ mr: 1, color: colors.accent }} />
              <Typography
                variant="subtitle1"
                fontWeight="bold"
                sx={{ color: colors.text }}
              >
                End Date:
              </Typography>
              <Typography variant="body1" sx={{ ml: 1, color: colors.text }}>
                {formatDate(currentProject.endDate)}
              </Typography>
            </Box>

            {currentProject.progressPercentage !== undefined && (
              <Box>
                <Typography
                  variant="subtitle1"
                  fontWeight="bold"
                  sx={{ color: colors.text }}
                >
                  Progress: {currentProject.progressPercentage}%
                </Typography>
                <LinearProgress
                  variant="determinate"
                  value={currentProject.progressPercentage}
                  sx={{
                    height: 10,
                    borderRadius: 1,
                    mt: 1,
                    backgroundColor: colors.lightAccent,
                    "& .MuiLinearProgress-bar": {
                      backgroundColor: colors.accent,
                    },
                  }}
                />
              </Box>
            )}
          </Grid>
        </Grid>

        {currentProject.coverImage && (
          <Box sx={{ my: 3, textAlign: "center" }}>
            <img
              src={`${API_BASE_URL}${currentProject.coverImage}`}
              alt={currentProject.title}
              style={{
                maxWidth: "100%",
                maxHeight: "400px",
                borderRadius: "8px",
                boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
              }}
            />
          </Box>
        )}

        <Divider sx={{ my: 3 }} />

        <Typography variant="h6" gutterBottom sx={{ color: colors.text }}>
          Description
        </Typography>
        <Typography variant="body1" paragraph sx={{ color: colors.text }}>
          {currentProject.description || "No description provided."}
        </Typography>

        {currentProject.tags && currentProject.tags.length > 0 && (
          <Box sx={{ mt: 3 }}>
            <Typography
              variant="subtitle1"
              gutterBottom
              sx={{ color: colors.text }}
            >
              Tags
            </Typography>
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
              {currentProject.tags.map((tag, index) => (
                <Chip
                  key={index}
                  label={tag}
                  size="small"
                  sx={{
                    backgroundColor: colors.lightAccent,
                    color: colors.text,
                  }}
                />
              ))}
            </Box>
          </Box>
        )}
      </ContentWrapper>

      {/* Tabs for Project Details */}
      <Paper
        elevation={2}
        sx={{ mb: 4, borderRadius: 2, backgroundColor: "white" }}
      >
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          variant="fullWidth"
          sx={{
            "& .MuiTabs-indicator": {
              backgroundColor: colors.accent,
            },
            "& .Mui-selected": {
              color: `${colors.accent} !important`,
            },
          }}
        >
          <Tab
            icon={<PersonIcon />}
            label="Client"
            sx={{ color: colors.text }}
          />
          <Tab
            icon={<FlagIcon />}
            label="Milestones"
            sx={{ color: colors.text }}
          />
          <Tab
            icon={<PaymentIcon />}
            label="Payments"
            sx={{ color: colors.text }}
          />
          <Tab
            icon={<ImageIcon />}
            label="Photos"
            sx={{ color: colors.text }}
          />
        </Tabs>

        {/* Client Information */}
        <TabPanel value={tabValue} index={0}>
          <Box sx={{ p: 3 }}>
            {currentProject.clientId &&
            typeof currentProject.clientId === "object" ? (
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Name
                  </Typography>
                  <Typography variant="body1" sx={{ color: colors.text }}>
                    {currentProject.clientId.name || "N/A"}
                  </Typography>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Email
                  </Typography>
                  <Typography variant="body1" sx={{ color: colors.text }}>
                    {currentProject.clientId.email || "N/A"}
                  </Typography>
                </Grid>
                {currentProject.clientId.phone && (
                  <Grid item xs={12} md={6}>
                    <Typography variant="subtitle2" color="text.secondary">
                      Phone
                    </Typography>
                    <Typography variant="body1" sx={{ color: colors.text }}>
                      {currentProject.clientId.phone}
                    </Typography>
                  </Grid>
                )}
                {currentProject.clientId.address && (
                  <Grid item xs={12} md={6}>
                    <Typography variant="subtitle2" color="text.secondary">
                      Address
                    </Typography>
                    <Typography variant="body1" sx={{ color: colors.text }}>
                      {typeof currentProject.clientId.address === "string"
                        ? currentProject.clientId.address
                        : formatLocation(currentProject.clientId.address)}
                    </Typography>
                  </Grid>
                )}
                {currentProject.clientId.company && (
                  <Grid item xs={12} md={6}>
                    <Typography variant="subtitle2" color="text.secondary">
                      Company
                    </Typography>
                    <Typography variant="body1" sx={{ color: colors.text }}>
                      {currentProject.clientId.company}
                    </Typography>
                  </Grid>
                )}
                {currentProject.clientId.notes && (
                  <Grid item xs={12}>
                    <Typography variant="subtitle2" color="text.secondary">
                      Notes
                    </Typography>
                    <Typography variant="body1" sx={{ color: colors.text }}>
                      {currentProject.clientId.notes}
                    </Typography>
                  </Grid>
                )}
              </Grid>
            ) : (
              <Alert severity="info">Client information not available</Alert>
            )}
          </Box>
        </TabPanel>

        {/* Milestones */}
        <TabPanel value={tabValue} index={1}>
          <Box sx={{ p: 3 }}>
            {currentProject.milestones &&
            currentProject.milestones.length > 0 ? (
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow sx={{ backgroundColor: colors.lightAccent }}>
                      <TableCell
                        sx={{ color: colors.text, fontWeight: "bold" }}
                      >
                        Title
                      </TableCell>
                      <TableCell
                        sx={{ color: colors.text, fontWeight: "bold" }}
                      >
                        Description
                      </TableCell>
                      <TableCell
                        sx={{ color: colors.text, fontWeight: "bold" }}
                      >
                        Due Date
                      </TableCell>
                      <TableCell
                        sx={{ color: colors.text, fontWeight: "bold" }}
                      >
                        Status
                      </TableCell>
                      <TableCell
                        sx={{ color: colors.text, fontWeight: "bold" }}
                      >
                        Completion Date
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {currentProject.milestones.map((milestone) => (
                      <TableRow key={milestone._id}>
                        <TableCell sx={{ color: colors.text }}>
                          <Box sx={{ display: "flex", alignItems: "center" }}>
                            {getMilestoneStatusIcon(milestone.status)}
                            <Typography sx={{ ml: 1 }}>
                              {milestone.title}
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell sx={{ color: colors.text }}>
                          {milestone.description}
                        </TableCell>
                        <TableCell sx={{ color: colors.text }}>
                          {formatDate(milestone.dueDate)}
                        </TableCell>
                        <TableCell>{getStatusChip(milestone.status)}</TableCell>
                        <TableCell sx={{ color: colors.text }}>
                          {milestone.completionDate
                            ? formatDate(milestone.completionDate)
                            : "Not completed"}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            ) : (
              <Alert severity="info">
                No milestones have been added to this project yet.
              </Alert>
            )}
          </Box>
        </TabPanel>

        {/* Payments */}
        <TabPanel value={tabValue} index={2}>
          <Box sx={{ p: 3 }}>
            {currentProject.paymentHistory &&
            currentProject.paymentHistory.length > 0 ? (
              <>
                <Box sx={{ mb: 3 }}>
                  <Typography
                    variant="h6"
                    gutterBottom
                    sx={{ color: colors.text }}
                  >
                    Payment Status:
                    <Chip
                      label={currentProject.paymentStatus || "Not set"}
                      sx={{
                        ml: 1,
                        backgroundColor:
                          currentProject.paymentStatus === "paid"
                            ? colors.success
                            : currentProject.paymentStatus === "partially_paid"
                            ? colors.warning
                            : colors.error,
                        color: "white",
                      }}
                    />
                  </Typography>
                </Box>
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow sx={{ backgroundColor: colors.lightAccent }}>
                        <TableCell
                          sx={{ color: colors.text, fontWeight: "bold" }}
                        >
                          Amount
                        </TableCell>
                        <TableCell
                          sx={{ color: colors.text, fontWeight: "bold" }}
                        >
                          Date
                        </TableCell>
                        <TableCell
                          sx={{ color: colors.text, fontWeight: "bold" }}
                        >
                          Method
                        </TableCell>
                        <TableCell
                          sx={{ color: colors.text, fontWeight: "bold" }}
                        >
                          Status
                        </TableCell>
                        <TableCell
                          sx={{ color: colors.text, fontWeight: "bold" }}
                        >
                          Notes
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {currentProject.paymentHistory.map((payment) => (
                        <TableRow key={payment._id}>
                          <TableCell sx={{ color: colors.text }}>
                            {formatCurrency(payment.amount)}
                          </TableCell>
                          <TableCell sx={{ color: colors.text }}>
                            {formatDate(payment.date)}
                          </TableCell>
                          <TableCell sx={{ color: colors.text }}>
                            {payment.method}
                          </TableCell>
                          <TableCell>
                            <Chip
                              label={payment.status}
                              sx={{
                                backgroundColor:
                                  payment.status === "completed"
                                    ? colors.success
                                    : payment.status === "pending"
                                    ? colors.warning
                                    : payment.status === "failed"
                                    ? colors.error
                                    : colors.info,
                                color: "white",
                              }}
                            />
                          </TableCell>
                          <TableCell sx={{ color: colors.text }}>
                            {payment.notes || "—"}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </>
            ) : (
              <Alert severity="info">
                No payment records found for this project.
              </Alert>
            )}
          </Box>
        </TabPanel>

        {/* Photos */}
        <TabPanel value={tabValue} index={3}>
          <Box sx={{ p: 3 }}>
            {/* Before Photos */}
            <Typography variant="h6" gutterBottom sx={{ color: colors.text }}>
              Before Photos
            </Typography>
            {currentProject.beforePhotos &&
            currentProject.beforePhotos.length > 0 ? (
              <ImageList cols={3} gap={16}>
                {currentProject.beforePhotos.map((photo, index) => (
                  <ImageListItem
                    key={index}
                    sx={{ overflow: "hidden", borderRadius: 2 }}
                  >
                    <img
                      src={
                        photo.startsWith("http")
                          ? photo
                          : `${API_BASE_URL.replace(/\/$/, "")}${photo}`
                      }
                      alt={`Before photo ${index + 1}`}
                      loading="lazy"
                      style={{
                        objectFit: "cover",
                        height: "100%",
                        width: "100%",
                      }}
                    />
                  </ImageListItem>
                ))}
              </ImageList>
            ) : (
              <Alert severity="info" sx={{ mb: 3 }}>
                No before photos available.
              </Alert>
            )}

            <Divider sx={{ my: 3 }} />

            {/* After Photos */}
            <Typography variant="h6" gutterBottom sx={{ color: colors.text }}>
              After Photos
            </Typography>
            {currentProject.afterPhotos &&
            currentProject.afterPhotos.length > 0 ? (
              <ImageList cols={3} gap={16}>
                {currentProject.afterPhotos.map((photo, index) => (
                  <ImageListItem
                    key={index}
                    sx={{ overflow: "hidden", borderRadius: 2 }}
                  >
                    <img
                      src={
                        photo.startsWith("http")
                          ? photo
                          : `${API_BASE_URL.replace(/\/$/, "")}${photo}`
                      }
                      alt={`Before photo ${index + 1}`}
                      loading="lazy"
                      style={{
                        objectFit: "cover",
                        height: "100%",
                        width: "100%",
                      }}
                    />
                  </ImageListItem>
                ))}
              </ImageList>
            ) : (
              <Alert severity="info">No after photos available.</Alert>
            )}

            {/* Additional project images */}
            {currentProject.images && currentProject.images.length > 0 && (
              <>
                <Divider sx={{ my: 3 }} />
                <Typography
                  variant="h6"
                  gutterBottom
                  sx={{ color: colors.text }}
                >
                  Additional Project Images
                </Typography>
                <ImageList cols={3} gap={16}>
                  {currentProject.images.map((photo, index) => (
                    <ImageListItem
                      key={index}
                      sx={{ overflow: "hidden", borderRadius: 2 }}
                    >
                      <img
                        src={
                          photo.startsWith("http")
                            ? photo
                            : `${API_BASE_URL.replace(/\/$/, "")}${photo}`
                        }
                        alt={`Before photo ${index + 1}`}
                        loading="lazy"
                        style={{
                          objectFit: "cover",
                          height: "100%",
                          width: "100%",
                        }}
                      />
                    </ImageListItem>
                  ))}
                </ImageList>
              </>
            )}
          </Box>
        </TabPanel>
      </Paper>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        PaperProps={{
          sx: {
            borderRadius: 2,
          },
        }}
      >
        <DialogTitle sx={{ color: colors.text }}>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography sx={{ color: colors.text }}>
            Are you sure you want to delete this project? This action cannot be
            undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setDeleteDialogOpen(false)}
            sx={{ color: colors.text }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleDelete}
            variant="contained"
            sx={{
              backgroundColor: colors.accent,
              "&:hover": {
                backgroundColor: "#c5616c",
              },
            }}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ProjectDetails;
