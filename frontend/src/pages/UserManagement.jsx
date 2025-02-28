// src/pages/UserManagement.js
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUsers, deleteUser } from "../redux/slices/adminSlice"; // Import actions from your slice
import "..";

const UserManagement = () => {
  const dispatch = useDispatch();
  const { users = [], loading, error } = useSelector((state) => state.admin); // Adjust based on your Redux state
  const [filter, setFilter] = useState("");

  useEffect(() => {
    dispatch(fetchUsers()); // Fetch users when the component mounts
  }, [dispatch]);

  const handleDelete = (id) => {
    if (
      window.confirm("Êtes-vous sûr de vouloir supprimer cet utilisateur ?")
    ) {
      dispatch(deleteUser(id)); // Dispatch delete user action
    }
  };

  // Filter users based on the input
  const filteredUsers = users.filter((user) =>
    user.pseudo.toLowerCase().includes(filter.toLowerCase())
  );

  if (loading) return <p>Chargement en cours...</p>;
  if (error) return <p>Erreur : {error}</p>;

  return (
    <div className="user-management">
      <h2>Gestion des Utilisateurs</h2>
      <input
        type="text"
        placeholder="Filtrer par pseudo"
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
      />
      {filteredUsers.length === 0 ? (
        <p>Aucun utilisateur disponible.</p>
      ) : (
        <table className="user-table">
          <thead>
            <tr>
              <th>Pseudo</th>
              <th>Email</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((user) => (
              <tr key={user._id}>
                <td>{user.pseudo}</td>
                <td>{user.email}</td>
                <td>
                  <button
                    className="btn-delete"
                    onClick={() => handleDelete(user._id)}
                  >
                    Supprimer
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default UserManagement;
