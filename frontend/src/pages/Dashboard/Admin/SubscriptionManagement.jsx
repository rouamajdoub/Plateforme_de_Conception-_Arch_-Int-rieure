import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchSubscriptions,
  deleteSubscription,
} from "../../../redux/slices/adminSlice";
import EditSubscriptionModal from "../../../components/subs/EditSubscription";
import { Box, Typography, useTheme } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { tokens } from "../../../theme";
const SubscriptionManagement = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const dispatch = useDispatch();
  const {
    subscriptions = [],
    loading,
    error,
  } = useSelector((state) => state.admin);
  const [selectedSubscription, setSelectedSubscription] = useState(null);

  useEffect(() => {
    dispatch(fetchSubscriptions());
  }, [dispatch]);

  const handleEdit = (subscription) => {
    setSelectedSubscription(subscription);
  };

  const handleDelete = (id) => {
    const confirmDelete = window.confirm(
      "Êtes-vous sûr de vouloir supprimer cet abonnement ?"
    );
    if (confirmDelete) {
      dispatch(deleteSubscription(id));
    }
  };

  const handleCloseModal = () => {
    setSelectedSubscription(null);
  };

  if (loading) return <p>Loading...</p>;
  if (error)
    return <p>Error: {error.message || "An unknown error occurred"}</p>;

  // Define columns for the DataGrid
  const columns = [
    { field: "id", headerName: "ID", flex: 1 },
    {
      field: "architect",
      headerName: "Architecte",
      flex: 1,
      renderCell: ({ row }) => (
        <Typography>
          {row.architectId?.pseudo ||
            `${row.architectId?.nomDeFamille} ${row.architectId?.prenom}`}
        </Typography>
      ),
    },
    { field: "plan", headerName: "Plan", flex: 1 },
    {
      field: "startDate",
      headerName: "Date de début",
      flex: 1,
      renderCell: ({ value }) => new Date(value).toLocaleDateString(),
    },
    {
      field: "endDate",
      headerName: "Date de fin",
      flex: 1,
      renderCell: ({ row }) => (
        <Typography>
          {row.endDate ? new Date(row.endDate).toLocaleDateString() : "N/A"}
        </Typography>
      ),
    },
    { field: "status", headerName: "Statut", flex: 1 },
    { field: "price", headerName: "Prix", flex: 1 },
    {
      field: "actions",
      headerName: "Actions",
      renderCell: ({ row }) => (
        <Box>
          <button className="btn-edit" onClick={() => handleEdit(row)}>
            Modifier
          </button>

          <button className="btn-delete" onClick={() => handleDelete(row.id)}>
            Supprimer
          </button>
        </Box>
      ),
    },
  ];

  // Map subscriptions to the format expected by DataGrid
  const rows = (subscriptions || []).map((sub) => ({
    id: sub._id,
    architectId: sub.architectId,
    plan: sub.plan,
    startDate: sub.startDate,
    endDate: sub.endDate,
    status: sub.status,
    price: sub.price,
  }));
  return (
    <Box m="20px">
     
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
        }}
      >
        <DataGrid
          checkboxSelection
          rows={rows} // Use the mapped subscriptions as rows
          columns={columns} // Use the defined columns
        />
      </Box>

      {selectedSubscription && (
        <EditSubscriptionModal
          subscription={selectedSubscription}
          onClose={handleCloseModal}
        />
      )}
    </Box>
  );
};

export default SubscriptionManagement;
