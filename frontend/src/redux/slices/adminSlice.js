import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const BASE_URL = "http://localhost:5000/api";

// ----------------- SUBSCRIPTIONS -----------------
export const fetchSubscriptions = createAsyncThunk(
  "admin/fetchSubscriptions",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${BASE_URL}/subscriptions`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const deleteSubscription = createAsyncThunk(
  "admin/deleteSubscription",
  async (id, { rejectWithValue, dispatch }) => {
    try {
      await axios.delete(`${BASE_URL}/subscriptions/${id}`);
      dispatch(fetchSubscriptions());
      return id;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const updateSubscription = createAsyncThunk(
  "admin/updateSubscription",
  async ({ id, data }, { rejectWithValue, dispatch }) => {
    try {
      const response = await axios.put(`${BASE_URL}/subscriptions/${id}`, data);
      dispatch(fetchSubscriptions());
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// ----------------- REVIEWS -----------------
export const fetchAllReviews = createAsyncThunk(
  "admin/fetchAllReviews",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${BASE_URL}/reviews`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const deleteReview = createAsyncThunk(
  "admin/deleteReview",
  async ({ id }, { rejectWithValue, dispatch }) => {
    try {
      await axios.delete(`${BASE_URL}/reviews/${id}`);
      dispatch(fetchAllReviews());
      return id;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// ----------------- USERS -----------------
export const fetchUsers = createAsyncThunk(
  "admin/fetchUsers",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${BASE_URL}/users`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const deleteUser = createAsyncThunk(
  "admin/deleteUser",
  async (id, { rejectWithValue, dispatch }) => {
    try {
      await axios.delete(`${BASE_URL}/users/${id}`);
      dispatch(fetchUsers());
      return id;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const fetchUserStats = createAsyncThunk(
  "admin/fetchUserStats",
  async () => {
    const response = await axios.get(`${BASE_URL}/users/stats`);
    return response.data;
  }
);

// ----------------- ARCHITECTS -----------------
export const fetchArchitectRequests = createAsyncThunk(
  "admin/fetchArchitectRequests",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${BASE_URL}/arch-req/requests`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const approveArchitect = createAsyncThunk(
  "admin/approveArchitect",
  async (id, { rejectWithValue, dispatch }) => {
    try {
      const response = await axios.patch(
        `${BASE_URL}/arch-req/requests/${id}`,
        {
          status: "approved",
        }
      );
      dispatch(fetchArchitectRequests()); // Refresh the list
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const rejectArchitect = createAsyncThunk(
  "admin/rejectArchitect",
  async (id, { rejectWithValue, dispatch }) => {
    try {
      await axios.patch(`${BASE_URL}/arch-req/requests/${id}`, {
        status: "rejected",
      });
      dispatch(fetchArchitectRequests()); // Refresh the list after deletion
      return id;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const adminSlice = createSlice({
  name: "admin",
  initialState: {
    users: [],
    subscriptions: [],
    reviews: {
      productReviews: [],
      projectReviews: [],
    },
    architects: [],

    userStats: [], // Initialize userStats
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Subscriptions
      .addCase(fetchSubscriptions.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchSubscriptions.fulfilled, (state, action) => {
        state.loading = false;
        state.subscriptions = action.payload;
      })
      .addCase(fetchSubscriptions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateSubscription.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateSubscription.fulfilled, (state, action) => {
        state.loading = false;
        state.subscriptions = state.subscriptions.map((sub) =>
          sub._id === action.payload._id ? action.payload : sub
        );
      })
      .addCase(updateSubscription.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Reviews
      .addCase(fetchAllReviews.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchAllReviews.fulfilled, (state, action) => {
        state.loading = false;
        state.reviews.productReviews = action.payload.productReviews || [];
        state.reviews.projectReviews = action.payload.projectReviews || [];
      })
      .addCase(fetchAllReviews.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(deleteReview.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteReview.fulfilled, (state, action) => {
        state.loading = false;
        state.reviews.productReviews = state.reviews.productReviews.filter(
          (review) => review._id !== action.payload
        );
        state.reviews.projectReviews = state.reviews.projectReviews.filter(
          (review) => review._id !== action.payload
        );
      })
      .addCase(deleteReview.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Users
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(deleteUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.loading = false;
        state.users = state.users.filter((user) => user._id !== action.payload);
      })
      .addCase(deleteUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // User Stats
      .addCase(fetchUserStats.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchUserStats.fulfilled, (state, action) => {
        state.loading = false;
        state.userStats = action.payload; // Store user stats
      })
      .addCase(fetchUserStats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload; // Correct error handling
      })
      // Architect Requests
      .addCase(fetchArchitectRequests.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchArchitectRequests.fulfilled, (state, action) => {
        state.loading = false;
        state.architects = action.payload;
      })
      .addCase(fetchArchitectRequests.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(approveArchitect.pending, (state) => {
        state.loading = true;
      })
      .addCase(approveArchitect.fulfilled, (state, action) => {
        state.loading = false;
        state.architects = state.architects.map((arch) =>
          arch._id === action.payload._id ? action.payload : arch
        );
      })
      .addCase(approveArchitect.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(rejectArchitect.pending, (state) => {
        state.loading = true;
      })
      .addCase(rejectArchitect.fulfilled, (state, action) => {
        state.loading = false;
        state.architects = state.architects.filter(
          (arch) => arch._id !== action.payload
        );
      })
      .addCase(rejectArchitect.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default adminSlice.reducer;
