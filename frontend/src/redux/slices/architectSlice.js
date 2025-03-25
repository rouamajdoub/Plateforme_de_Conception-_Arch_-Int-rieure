import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = "http://localhost:5000/api/profile";
const getToken = () => localStorage.getItem("token");

// Fetch architect profile
export const fetchArchitectProfile = createAsyncThunk(
  "architect/fetchProfile",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/me`, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "An error occurred");
    }
  }
);

// Update architect profile
export const updateArchitectProfile = createAsyncThunk(
  "architect/updateProfile",
  async (profileData, { rejectWithValue }) => {
    try {
      const response = await axios.put(`${API_URL}/me`, profileData, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Failed to update profile"
      );
    }
  }
);

// Fetch architect stats
export const fetchArchitectStats = createAsyncThunk(
  "architect/fetchStats",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/me/stats`, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to load stats");
    }
  }
);

// Delete architect account
export const deleteArchitectAccount = createAsyncThunk(
  "architect/deleteAccount",
  async (_, { rejectWithValue }) => {
    try {
      await axios.delete(`${API_URL}/me`, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      return { success: true };
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Failed to delete account"
      );
    }
  }
);

const architectSlice = createSlice({
  name: "architect",
  initialState: {
    profile: null,
    stats: null,
    loading: false,
    error: null,
  },
  reducers: {
    resetArchitectState: (state) => {
      state.profile = null;
      state.stats = null;
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchArchitectProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchArchitectProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.profile = action.payload;
      })
      .addCase(fetchArchitectProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateArchitectProfile.fulfilled, (state, action) => {
        state.profile = { ...state.profile, ...action.payload };
      })
      .addCase(fetchArchitectStats.fulfilled, (state, action) => {
        state.stats = action.payload;
      })
      .addCase(deleteArchitectAccount.fulfilled, (state) => {
        state.profile = null;
        state.stats = null;
      });
  },
});

export const { resetArchitectState } = architectSlice.actions;
export default architectSlice.reducer;
