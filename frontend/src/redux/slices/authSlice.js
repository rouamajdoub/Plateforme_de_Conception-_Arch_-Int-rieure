import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Constants for localStorage keys (shared with Next.js app)
const TOKEN_KEY = "token";
const AUTH_STORAGE_KEY = "visiona_auth";

axios.defaults.baseURL =
  process.env.REACT_APP_API_BASE_URL || "http://localhost:5000";

const initialState = {
  user: null,
  token: localStorage.getItem(TOKEN_KEY) || null,
  isAuthenticated: false,
  status: "idle", // 'idle' | 'loading' | 'succeeded' | 'failed'
  authMethod: null, // 'local' | 'google' | 'auth0'
  error: null,
  architectStatus: null, // 'pending' | 'approved' | 'rejected'
  isLoading: false,
  isFirstLogin: false, // Added this to track first login state
};

// Interceptor to add token to requests
const setupAuthInterceptor = (token) => {
  axios.interceptors.request.use(
    (config) => {
      if (token) {
        config.headers["Authorization"] = `Bearer ${token}`;
      }
      return config;
    },
    (error) => Promise.reject(error)
  );
};

export const registerUser = createAsyncThunk(
  "auth/register",
  async (userData, { rejectWithValue }) => {
    try {
      const response = await axios.post("/api/auth/register", userData);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.error || "Registration failed"
      );
    }
  }
);

export const loginUser = createAsyncThunk(
  "auth/login",
  async ({ email, password }, { rejectWithValue, dispatch }) => {
    try {
      const response = await axios.post("/api/auth/login", { email, password });
      const { token, user, isFirstLogin } = response.data;

      // Store token in localStorage
      localStorage.setItem(TOKEN_KEY, token);

      // Store user data for Next.js app
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));

      setupAuthInterceptor(token);

      // Additional verification for architects
      if (user.role === "architect" && user.status !== "approved") {
        dispatch(fetchUserProfile(user._id));
      }

      return { token, user, isFirstLogin };
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || "Login failed");
    }
  }
);

export const googleLogin = createAsyncThunk(
  "auth/googleLogin",
  async (googleToken, { rejectWithValue }) => {
    try {
      const response = await axios.post("/api/auth/google-login", {
        token: googleToken,
      });
      const { token, user } = response.data;

      // Store token in localStorage
      localStorage.setItem(TOKEN_KEY, token);

      // Store user data for Next.js app
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));

      setupAuthInterceptor(token);

      return { token, user };
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.error || "Google login failed"
      );
    }
  }
);

export const logoutUser = createAsyncThunk(
  "auth/logout",
  async (_, { rejectWithValue }) => {
    try {
      await axios.post("/api/auth/logout");

      // Clear all localStorage items related to auth
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(AUTH_STORAGE_KEY);

      // If Next.js app is open in another tab, notify it of logout
      const event = new StorageEvent("storage", {
        key: AUTH_STORAGE_KEY,
        oldValue: localStorage.getItem(AUTH_STORAGE_KEY),
        newValue: null,
        url: window.location.href,
      });

      window.dispatchEvent(event);

      return null;
    } catch (error) {
      // Even if API call fails, clear localStorage
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(AUTH_STORAGE_KEY);

      return rejectWithValue(error.response?.data?.error || "Logout failed");
    }
  }
);

export const checkAuthStatus = createAsyncThunk(
  "auth/checkStatus",
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem(TOKEN_KEY);
      if (!token) {
        return { isAuthenticated: false, user: null };
      }

      const response = await axios.get("/api/auth/check", {
        headers: { Authorization: `Bearer ${token}` },
      });

      // If authenticated, update localStorage for Next.js app
      if (response.data.isAuthenticated && response.data.user) {
        localStorage.setItem(
          AUTH_STORAGE_KEY,
          JSON.stringify(response.data.user)
        );
      }

      return response.data;
    } catch (error) {
      // Clear localStorage on authentication error
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(AUTH_STORAGE_KEY);

      return { isAuthenticated: false, user: null };
    }
  }
);

export const fetchUserProfile = createAsyncThunk(
  "auth/fetchProfile",
  async (userId, { rejectWithValue }) => {
    try {
      const response = await axios.get(`/api/auth/profile/${userId}`);

      // Update localStorage for Next.js app
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(response.data));

      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.error || "Failed to fetch profile"
      );
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    resetStatus: (state) => {
      state.status = "idle";
      state.error = null;
      state.isLoading = false;
    },
    clearError: (state) => {
      state.error = null;
    },
    clearFirstLoginFlag: (state) => {
      state.isFirstLogin = false;
    },
  },
  extraReducers(builder) {
    const handlePendingState = (state) => {
      state.status = "loading";
      state.isLoading = true;
      state.error = null;
    };

    const handleRejectedState = (state, action) => {
      state.status = "failed";
      state.isLoading = false;
      state.error = action.payload || "An error occurred";
    };

    builder
      .addCase(registerUser.pending, handlePendingState)
      .addCase(registerUser.fulfilled, (state) => {
        state.status = "succeeded";
        state.isLoading = false;
        state.error = null;
      })
      .addCase(registerUser.rejected, handleRejectedState)

      .addCase(loginUser.pending, handlePendingState)
      .addCase(loginUser.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.authMethod = "local";
        state.isLoading = false;
        state.error = null;
        state.isFirstLogin = action.payload.isFirstLogin || false;
        state.architectStatus =
          action.payload.user.role === "architect"
            ? action.payload.user.status
            : null;
      })
      .addCase(loginUser.rejected, handleRejectedState)

      .addCase(googleLogin.pending, handlePendingState)
      .addCase(googleLogin.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.authMethod = "google";
        state.isLoading = false;
        state.error = null;
      })
      .addCase(googleLogin.rejected, handleRejectedState)

      .addCase(logoutUser.fulfilled, (state) => {
        state.isAuthenticated = false;
        state.user = null;
        state.token = null;
        state.authMethod = null;
        state.status = "idle";
        state.error = null;
        state.architectStatus = null;
        state.isFirstLogin = false;
      })

      .addCase(checkAuthStatus.fulfilled, (state, action) => {
        state.isAuthenticated = action.payload.isAuthenticated;
        state.user = action.payload.user || null;
        state.authMethod = action.payload.authMethod;

        if (action.payload.user?.role === "architect") {
          state.architectStatus = action.payload.user.status;
        }
      })

      .addCase(fetchUserProfile.fulfilled, (state, action) => {
        state.user = action.payload;
        if (action.payload.role === "architect") {
          state.architectStatus = action.payload.status;
        }
      });
  },
});

export const { resetStatus, clearError, clearFirstLoginFlag } =
  authSlice.actions;

// Selectors
export const selectCurrentUser = (state) => state.auth.user;
export const selectIsAuthenticated = (state) => state.auth.isAuthenticated;
export const selectAuthStatus = (state) => state.auth.status;
export const selectIsLoading = (state) => state.auth.isLoading;
export const selectAuthError = (state) => state.auth.error;
export const selectArchitectStatus = (state) => state.auth.architectStatus;
export const selectAuthMethod = (state) => state.auth.authMethod;
export const selectSubscriptionStatus = (state) =>
  state.auth.user?.subscription?.status;
export const selectIsFirstLogin = (state) => state.auth.isFirstLogin;
export const selectToken = (state) => state.auth.token;

export default authSlice.reducer;
