import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { updateSubscription } from "../../../../redux/slices/adminSlice";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  MenuItem,
} from "@mui/material";

const EditSubscriptionModal = ({ subscription, onClose }) => {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    plan: subscription.plan,
    status: subscription.status,
    price: subscription.price,
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(updateSubscription({ id: subscription.id, data: formData }));
    onClose();
  };

  return (
    <Dialog open={true} onClose={onClose}>
      <DialogTitle>Modifier l'Abonnement</DialogTitle>
      <DialogContent>
        <form onSubmit={handleSubmit}>
          <TextField
            label="Plan"
            name="plan"
            value={formData.plan}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />
          <TextField
            select
            label="Statut"
            name="status"
            value={formData.status}
            onChange={handleChange}
            fullWidth
            margin="normal"
          >
            <MenuItem value="active">Actif</MenuItem>
            <MenuItem value="expired">Expiré</MenuItem>
          </TextField>
          <TextField
            label="Prix (€)"
            name="price"
            type="number"
            value={formData.price}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />
        </form>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="secondary">
          Annuler
        </Button>
        <Button type="submit" onClick={handleSubmit} color="primary">
          Enregistrer
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditSubscriptionModal;
