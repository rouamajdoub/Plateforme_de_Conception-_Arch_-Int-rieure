import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchArchitectRequests,
  approveArchitect,
  rejectArchitect,
} from "../../../redux/slices/adminSlice";
import { Box, Typography, Button, useTheme } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { tokens } from "../../../theme";

const ArchitectRequests = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const dispatch = useDispatch();
  const { architects, loading, error } = useSelector((state) => state.admin);

  useEffect(() => {
    dispatch(fetchArchitectRequests());
  }, [dispatch]);

  const handleApprove = (id) => {
    if (window.confirm("Approve this architect?")) {
      dispatch(approveArchitect(id));
    }
  };

  const handleReject = (id) => {
    if (window.confirm("Reject this architect?")) {
      dispatch(rejectArchitect(id));
    }
  };

  const columns = [
    { field: "id", headerName: "ID", flex: 1 },
    { field: "name", headerName: "Architect Name", flex: 1.5 },
    { field: "email", headerName: "Email", flex: 1.5 },
    { field: "experience", headerName: "Experience (Years)", flex: 1 },
    { field: "companyName", headerName: "Company Name", flex: 1.5 },
    { field: "patenteNumber", headerName: "Patente Number", flex: 1 },
    { field: "cin", headerName: "CIN", flex: 1 },
    {
      field: "paymentProcess",
      headerName: "Payment Process",
      flex: 1.5,
      renderCell: ({ row }) => (
        <Typography
          sx={{
            color: row.paymentProcess === "completed" ? "green" : "red",
            fontWeight: "bold",
          }}
        >
          {row.paymentProcess}
        </Typography>
      ),
    },
    {
      field: "status",
      headerName: "Status",
      flex: 1,
      renderCell: ({ row }) => (
        <Typography
          sx={{
            color: row.status === "approved" ? "green" : "red",
            fontWeight: "bold",
          }}
        >
          {row.status}
        </Typography>
      ),
    },
    {
      field: "date",
      headerName: "Date Requested",
      flex: 1,
      renderCell: ({ row }) => new Date(row.createdAt).toLocaleDateString(),
    },
    {
      field: "actions",
      headerName: "Actions",
      flex: 1.5,
      renderCell: ({ row }) => (
        <Box>
          <Button
            variant="contained"
            color="success"
            sx={{ mr: 1 }}
            onClick={() => handleApprove(row.id)}
            disabled={row.status === "approved"}
          >
            Approve
          </Button>
          <Button
            variant="contained"
            color="error"
            onClick={() => handleReject(row.id)}
            disabled={row.status === "rejected"}
          >
            Reject
          </Button>
        </Box>
      ),
    },
  ];

  const rows = architects.map((arch) => ({
    id: arch._id,
    name: arch.pseudo, // Ensure backend sends this
    email: arch.email,
    experience: arch.experience || "N/A",
    companyName: arch.companyName || "N/A",
    patenteNumber: arch.patenteNumber || "N/A",
    cin: arch.cin || "N/A",
    paymentProcess: arch.paymentStatus || "pending", // Adjust according to backend
    status: arch.status,
    createdAt: arch.createdAt,
  }));

  return (
    <Box m="20px">
      <Typography variant="h4" mb={2}>
        Architect Signup Requests
      </Typography>

      {loading ? (
        <Typography>Loading...</Typography>
      ) : error ? (
        <Typography color="error">{error}</Typography>
      ) : (
        <Box
          height="75vh"
          sx={{
            "& .MuiDataGrid-root": { border: "none" },
            "& .MuiDataGrid-cell": { borderBottom: "none" },
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
          <DataGrid rows={rows} columns={columns} checkboxSelection />
        </Box>
      )}
    </Box>
  );
};

export default ArchitectRequests;
