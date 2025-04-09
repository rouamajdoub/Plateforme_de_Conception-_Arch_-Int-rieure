import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Button,
  TextField,
  Card,
  CardContent,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Paper,
  Grid,
  CircularProgress,
  Divider,
} from "@mui/material";
import { Delete, Add, Email, Phone, LocationOn } from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchClients,
  createClient,
  deleteClient,
  clearClientState,
} from "../../../../../redux/slices/clientsSlice";

const ClientManagement = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { clients, loading, error, success, message } = useSelector(
    (state) => state.clients
  );

  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [newClient, setNewClient] = useState({
    name: "",
    email: "",
    phone: "",
    address: {
      street: "",
      city: "",
      region: "",
      country: "",
      postalCode: "",
    },
    notes: "",
  });
  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    if (user?.role === "architect") {
      dispatch(fetchClients());
    }
  }, [dispatch, user]);

  useEffect(() => {
    if (success) {
      dispatch(fetchClients());
      dispatch(clearClientState());
      setOpenAddDialog(false);
    }
  }, [success, dispatch]);

  const handleOpenAddDialog = () => {
    setOpenAddDialog(true);
    setNewClient({
      name: "",
      email: "",
      phone: "",
      address: {
        street: "",
        city: "",
        region: "",
        country: "",
        postalCode: "",
      },
      notes: "",
    });
    setFormErrors({});
  };

  const handleCloseAddDialog = () => setOpenAddDialog(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name.includes(".")) {
      const [parent, child] = name.split(".");
      setNewClient((prev) => ({
        ...prev,
        [parent]: { ...prev[parent], [child]: value },
      }));
    } else {
      setNewClient((prev) => ({ ...prev, [name]: value }));
    }
  };

  const validateForm = () => {
    const errors = {};
    if (!newClient.name.trim()) errors.name = "Name is required";
    if (!newClient.email.trim()) {
      errors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(newClient.email)) {
      errors.email = "Invalid email format";
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleAddClient = () => {
    if (validateForm()) {
      dispatch(createClient(newClient));
    }
  };

  const handleRemoveClient = (clientId) => {
    if (window.confirm("Are you sure you want to remove this client?")) {
      dispatch(deleteClient(clientId));
    }
  };

  const formatAddress = (address) => {
    if (!address) return "";
    return [
      address.street,
      address.city,
      address.region,
      address.country,
      address.postalCode,
    ]
      .filter(Boolean)
      .join(", ");
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 3 }}>
        <Typography variant="h5" component="h2">
          Client Management
        </Typography>

        <Button
          variant="contained"
          color="primary"
          startIcon={<Add />}
          onClick={handleOpenAddDialog}
          sx={{ ml: 2 }}
        >
          Add New Client
        </Button>
      </Box>

      {error && (
        <Paper sx={{ p: 2, mb: 3, bgcolor: "#ffebee" }}>
          <Typography color="error">{error}</Typography>
        </Paper>
      )}

      {message && !error && (
        <Paper sx={{ p: 2, mb: 3, bgcolor: "#e8f5e9" }}>
          <Typography color="success.main">{message}</Typography>
        </Paper>
      )}

      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <>
          {clients?.length > 0 ? (
            <Grid container spacing={3}>
              {clients.map((client) => (
                <Grid item xs={12} md={6} lg={4} key={client._id}>
                  <Card>
                    <CardContent>
                      <Typography variant="h6">{client.name}</Typography>

                      <Box
                        sx={{ display: "flex", alignItems: "center", mt: 1 }}
                      >
                        <Email fontSize="small" sx={{ mr: 1 }} />
                        <Typography variant="body2">{client.email}</Typography>
                      </Box>

                      {client.phone && (
                        <Box
                          sx={{ display: "flex", alignItems: "center", mt: 1 }}
                        >
                          <Phone fontSize="small" sx={{ mr: 1 }} />
                          <Typography>{client.phone}</Typography>
                        </Box>
                      )}

                      {client.address && (
                        <Box
                          sx={{ display: "flex", alignItems: "center", mt: 1 }}
                        >
                          <LocationOn fontSize="small" sx={{ mr: 1 }} />
                          <Typography variant="body2">
                            {formatAddress(client.address)}
                          </Typography>
                        </Box>
                      )}

                      {client.notes && (
                        <Box sx={{ mt: 2 }}>
                          <Typography variant="caption" color="text.secondary">
                            Notes:
                          </Typography>
                          <Typography variant="body2">
                            {client.notes}
                          </Typography>
                        </Box>
                      )}

                      <Box
                        sx={{
                          mt: 2,
                          display: "flex",
                          justifyContent: "flex-end",
                        }}
                      >
                        <IconButton
                          color="error"
                          onClick={() => handleRemoveClient(client._id)}
                        >
                          <Delete />
                        </IconButton>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          ) : (
            <Paper sx={{ p: 4, textAlign: "center" }}>
              <Typography color="text.secondary">
                No clients found. Start by adding your first client.
              </Typography>
            </Paper>
          )}
        </>
      )}

      {/* Add Client Dialog */}
      <Dialog
        open={openAddDialog}
        onClose={handleCloseAddDialog}
        fullWidth
        maxWidth="md"
      >
        <DialogTitle>Add New Client</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Full Name"
                name="name"
                value={newClient.name}
                onChange={handleInputChange}
                error={!!formErrors.name}
                helperText={formErrors.name}
                required
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Email"
                name="email"
                type="email"
                value={newClient.email}
                onChange={handleInputChange}
                error={!!formErrors.email}
                helperText={formErrors.email}
                required
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Phone"
                name="phone"
                value={newClient.phone}
                onChange={handleInputChange}
              />
            </Grid>

            <Grid item xs={12}>
              <Divider sx={{ my: 2 }} />
              <Typography variant="subtitle1">Address</Typography>
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Street"
                name="address.street"
                value={newClient.address.street}
                onChange={handleInputChange}
              />
            </Grid>

            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="City"
                name="address.city"
                value={newClient.address.city}
                onChange={handleInputChange}
              />
            </Grid>

            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Region"
                name="address.region"
                value={newClient.address.region}
                onChange={handleInputChange}
              />
            </Grid>

            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Country"
                name="address.country"
                value={newClient.address.country}
                onChange={handleInputChange}
              />
            </Grid>

            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Postal Code"
                name="address.postalCode"
                value={newClient.address.postalCode}
                onChange={handleInputChange}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={3}
                label="Notes"
                name="notes"
                value={newClient.notes}
                onChange={handleInputChange}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseAddDialog}>Cancel</Button>
          <Button onClick={handleAddClient} variant="contained">
            Add Client
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ClientManagement;
