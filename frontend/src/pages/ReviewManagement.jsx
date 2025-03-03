import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchReviews, deleteReview } from "../redux/slices/adminSlice";
import { Box, Typography, useTheme } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { tokens } from "../theme";
import Header from "../components/Header";

const ReviewManagement = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
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

  // Define columns for the DataGrid
  const columns = [
    { field: "id", headerName: "ID", flex: 1 }, // maybe I will remove it later
    {
      field: "author",
      headerName: "Auteur",
      flex: 1,
      renderCell: ({ row }) => (
        <Typography>{row.reviewerId?.pseudo || "Inconnu"}</Typography>
      ),
    },
    { field: "rating", headerName: "Évaluation", flex: 1 },
    { field: "comment", headerName: "Commentaire", flex: 2 },
    {
      field: "date",
      headerName: "Date",
      flex: 1,
      renderCell: ({ value }) => new Date(value).toLocaleDateString(),
    },
    {
      field: "actions",
      headerName: "Actions",
      renderCell: ({ row }) => (
        <button className="btn-delete" onClick={() => handleDelete(row._id)}>
          Supprimer
        </button>
      ),
    },
  ];

  // Map reviews to the format expected by DataGrid
  const rows = reviews.map((review) => ({
    id: review._id, // Unique identifier
    reviewerId: review.reviewerId,
    rating: review.rating,
    comment: review.comment,
    createdAt: review.createdAt,
  }));

  // Filter reviews based on the input
  const filteredRows = rows.filter((row) => {
    const reviewerName = row.reviewerId?.pseudo || ""; // Use the pseudo field
    return reviewerName.toLowerCase().includes(filter.toLowerCase());
  });

  return (
    <Box m="20px">
      <Header
        title="Reviews Management"
        subtitle="List of reviews and ratings"
      />

      <Box
        m="40px 0 0 0"
        height="75vh"
        sx={{
          "& .MuiDataGrid-root": {
            border: "none",
          },
          "& .MuiDataGrid-cell": {
            borderBottom: "none",
          },
          "& .name-column--cell": {
            color: colors.greenAccent[300],
          },
          "& .MuiDataGrid-columnHeaders": {
            backgroundColor: colors.blueAccent[700],
            borderBottom: "none",
          },
          "& .MuiDataGrid-virtualScroller": {
            backgroundColor: colors.primary[400],
          },
          "& .MuiDataGrid-footerContainer": {
            borderTop: "none",
            backgroundColor: colors.blueAccent[700],
          },
          "& .MuiCheckbox-root": {
            color: `${colors.greenAccent[200]} !important`,
          },
          "& .MuiDataGrid-toolbarContainer .MuiButton-text": {
            color: `${colors.grey[100]} !important`,
          },
        }}
      >
        <DataGrid
          checkboxSelection
          rows={filteredRows} // Use the filtered reviews as rows
          columns={columns} // Use the defined columns
          components={{ Toolbar: GridToolbar }} // Ensure GridToolbar is included
          componentsProps={{
            toolbar: {
              showQuickFilter: true, // Enable the quick filter
              quickFilterProps: { placeholder: "Search..." }, // Placeholder for the quick filter
            },
          }}
        />
      </Box>
    </Box>
  );
};

export default ReviewManagement;
