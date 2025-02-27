import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchSubscriptions, deleteSubscription } from "../redux/slices/adminSlice";
import EditSubscriptionModal from "../components/EditSubscription";
import "../styles/adminManagement.css";

const SubscriptionManagement = () => {
  const dispatch = useDispatch();
  const { subscriptions, loading, error } = useSelector((state) => state.admin);
  const [selectedSubscription, setSelectedSubscription] = useState(null);

  useEffect(() => {
    dispatch(fetchSubscriptions());
  }, [dispatch]);

  const handleEdit = (subscription) => {
    setSelectedSubscription(subscription);
  };

  const handleDelete = (id) => {
    const confirmDelete = window.confirm("Êtes-vous sûr de vouloir supprimer cet abonnement ?");
    if (confirmDelete) {
      dispatch(deleteSubscription(id));
    }
  };

  const handleCloseModal = () => {
    setSelectedSubscription(null);
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="subscription-management">
      <h2>Gestion des Abonnements</h2>
      <table className="subscription-table">
        <thead>
          <tr>
            <th>Architecte</th>
            <th>Plan</th>
            <th>Date de début</th>
            <th>Date de fin</th>
            <th>Statut</th>
            <th>Prix</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {subscriptions.map((sub) => (
            <tr key={sub._id}>
              <td>{sub.architectId?.pseudo || `${sub.architectId?.nomDeFamille} ${sub.architectId?.prenom}`}</td>
              <td>{sub.plan}</td>
              <td>{new Date(sub.startDate).toLocaleDateString()}</td>
              <td>{sub.endDate ? new Date(sub.endDate).toLocaleDateString() : "N/A"}</td>
              <td>{sub.status}</td>
              <td>{sub.price} €</td>
              <td>
                <button className="btn-edit" onClick={() => handleEdit(sub)}>Modifier</button>
                <button className="btn-delete" onClick={() => handleDelete(sub._id)}>Supprimer</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {selectedSubscription && (
        <EditSubscriptionModal
          subscription={selectedSubscription}
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
};

export default SubscriptionManagement;