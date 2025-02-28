import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { updateSubscription } from "../redux/slices/adminSlice";
import "../styles/EditSubscriptionModal.css";

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
    dispatch(updateSubscription({ id: subscription._id, data: formData }));
    onClose(); // Fermer le modal après mise à jour
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h3>Modifier l'Abonnement</h3>
        <form onSubmit={handleSubmit}>
          <label>
            Plan :
            <input type="text" name="plan" value={formData.plan} onChange={handleChange} />
          </label>
          <label>
            Statut :
            <select name="status" value={formData.status} onChange={handleChange}>
              <option value="active">Actif</option>
              <option value="expired">Expiré</option>
            </select>
          </label>
          <label>
            Prix (€) :
            <input type="number" name="price" value={formData.price} onChange={handleChange} />
          </label>
          <div className="modal-actions">
            <button type="submit">Enregistrer</button>
            <button type="button" onClick={onClose}>Annuler</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditSubscriptionModal;
