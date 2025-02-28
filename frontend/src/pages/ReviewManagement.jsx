// src/pages/ReviewManagement.js
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchReviews, deleteReview } from "../redux/slices/adminSlice";
import "../styles/adminManagement.css";

const ReviewManagement = () => {
  const dispatch = useDispatch();
  const { reviews = [], loading, error } = useSelector((state) => state.admin);
  const [filter, setFilter] = useState("");

  useEffect(() => {
    dispatch(fetchReviews());
  }, [dispatch]);

  const handleDelete = (id) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer cet avis ?")) {
      dispatch(deleteReview(id));
    }
  };

  if (loading) return <p>Chargement en cours...</p>;
  if (error) return <p>Erreur : {error}</p>;

  // Filtrer les avis
  const filteredReviews = reviews.filter((review) => {
    const reviewerName = review.reviewerId?.pseudo || ""; // Utiliser le champ pseudo
    return reviewerName.toLowerCase().includes(filter.toLowerCase());
  });

  return (
    <div className="review-management">
      <h2>Gestion des Avis</h2>
      <input
        type="text"
        placeholder="Filtrer par auteur"
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
      />
      {filteredReviews.length === 0 ? (
        <p>Aucun avis disponible.</p>
      ) : (
        <table className="review-table">
          <thead>
            <tr>
              <th>Auteur</th>
              <th>Évaluation</th>
              <th>Commentaire</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredReviews.map((review) => (
              <tr key={review._id}>
                <td>{review.reviewerId.pseudo}</td>
                <td>{review.rating}</td>
                <td>{review.comment}</td>
                <td>{new Date(review.createdAt).toLocaleDateString()}</td>
                <td>
                  <button
                    className="btn-delete"
                    onClick={() => handleDelete(review._id)}
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

export default ReviewManagement;
