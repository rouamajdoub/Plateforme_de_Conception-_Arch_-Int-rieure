import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// URL de base de ton API
const BASE_URL = "http://localhost:5000/api/auth";

// Récupérer le token du localStorage (si existant)
const storedUser = JSON.parse(localStorage.getItem("user")) || null;

// 🔹 Inscription
export const registerUser = createAsyncThunk(
  "auth/registerUser",
  async (userData, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${BASE_URL}/register`, userData);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.error || "Registration failed"
      );
    }
  }
);

// 🔹 Connexion (Login)
export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${BASE_URL}/login`, credentials);
      const user = response.data;

      // Stocker l'utilisateur et le token dans le localStorage
      localStorage.setItem("user", JSON.stringify(user));

      return user;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.error || "Login failed"
      );
    }
  }
);

// 🔹 Déconnexion (Logout)
export const logoutUser = createAsyncThunk("auth/logoutUser", async () => {
  // Supprime l'utilisateur du localStorage
  localStorage.removeItem("user");
  return null; // Reset du state
});

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: storedUser,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Inscription
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Connexion
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Déconnexion
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
      });
  },
});

export default authSlice.reducer;
