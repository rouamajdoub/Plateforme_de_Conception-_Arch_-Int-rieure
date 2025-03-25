import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = "http://localhost:5000/api/stats"; // Adjust this URL as needed

// Fetch dashboard statistics
export const fetchDashboardStats = createAsyncThunk(
  "statistics/fetchDashboardStats",
  async (userId, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/dashboard/${userId}`);
      return response.data.data; // Adjust based on your API response structure
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Failed to fetch dashboard stats"
      );
    }
  }
);

// Increment profile views
export const incrementProfileViews = createAsyncThunk(
  "statistics/incrementProfileViews",
  async (profileId, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${API_URL}/profile/${profileId}/views`
      );
      return response.data; // Assuming success response
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Failed to increment profile views"
      );
    }
  }
);

// Fetch comparison statistics
export const fetchComparisonStats = createAsyncThunk(
  "statistics/fetchComparisonStats",
  async (userId, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/comparison/${userId}`);
      return response.data.data; // Adjust based on your API response structure
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Failed to fetch comparison stats"
      );
    }
  }
);

const statisticsSlice = createSlice({
  name: "statistics",
  initialState: {
    dashboard: null,
    comparison: null,
    loading: false,
    error: null,
  },
  reducers: {
    resetStatisticsState: (state) => {
      state.dashboard = null;
      state.comparison = null;
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchDashboardStats.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDashboardStats.fulfilled, (state, action) => {
        state.loading = false;
        state.dashboard = action.payload;
      })
      .addCase(fetchDashboardStats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(incrementProfileViews.fulfilled, (state) => {
        // Optionally handle the success response if needed
      })
      .addCase(fetchComparisonStats.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchComparisonStats.fulfilled, (state, action) => {
        state.loading = false;
        state.comparison = action.payload;
      })
      .addCase(fetchComparisonStats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { resetStatisticsState } = statisticsSlice.actions;
export default statisticsSlice.reducer;
