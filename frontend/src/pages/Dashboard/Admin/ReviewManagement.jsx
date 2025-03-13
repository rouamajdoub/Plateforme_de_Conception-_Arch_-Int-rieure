import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchAllReviews,
  deleteReview,
} from "../../../redux/slices/adminSlice";
import {
  Box,
  Typography,
  Button,
  useTheme,
  MenuItem,
  Select,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { tokens } from "../../../theme";

const ReviewManagement = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const dispatch = useDispatch();
  const { reviews, loading, error } = useSelector((state) => state.admin);
  const [reviewType, setReviewType] = useState("all"); // New state for filtering

  // Merge product and project reviews with a new "type" property
  const mergedReviews = [
    ...(reviews.productReviews || []).map((r) => ({ ...r, type: "Product" })),
    ...(reviews.projectReviews || []).map((r) => ({ ...r, type: "Project" })),
  ];

  // Filter reviews based on selected review type
  const filteredReviews =
    reviewType === "all"
      ? mergedReviews
      : mergedReviews.filter((r) => r.type === reviewType);

  useEffect(() => {
    dispatch(fetchAllReviews());
  }, [dispatch]);

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this review?")) {
      dispatch(deleteReview({ id }));
    }
  };

  const columns = [
    { field: "id", headerName: "ID", flex: 1 },
    {
      field: "client",
      headerName: "Author",
      flex: 1,
      renderCell: ({ row }) => (
        <Typography>{row.client?.pseudo || "Unknown"}</Typography>
      ),
    },
    { field: "type", headerName: "Type", flex: 0.5 },
    { field: "rating", headerName: "Rating", flex: 0.5 },
    { field: "comment", headerName: "Comment", flex: 2 },
    {
      field: "date",
      headerName: "Date",
      flex: 1,
      renderCell: ({ row }) => new Date(row.createdAt).toLocaleDateString(),
    },
    {
      field: "actions",
      headerName: "Actions",
      flex: 1,
      renderCell: ({ row }) => (
        <Box>
          <Button
            variant="contained"
            color="error"
            onClick={() => handleDelete(row.id)}
          >
            Delete
          </Button>
        </Box>
      ),
    },
  ];

  const rows = filteredReviews.map((review) => ({
    id: review._id,
    client: review.client,
    rating: review.rating,
    comment: review.comment,
    createdAt: review.createdAt,
    type: review.type,
  }));

  return (
    <Box m="20px">
      {/* Filter by Review Type */}
      <Box mb={2}>
        <Typography variant="h6" mb={1}>
          Filter Reviews By:
        </Typography>
        <Select
          value={reviewType}
          onChange={(e) => setReviewType(e.target.value)}
          fullWidth
          variant="outlined"
        >
          <MenuItem value="all">All Reviews</MenuItem>
          <MenuItem value="Product">Product Reviews</MenuItem>
          <MenuItem value="Project">Project Reviews</MenuItem>
        </Select>
      </Box>

      {/* Data Grid */}
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

export default ReviewManagement;
