import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

axios.defaults.baseURL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000';

const initialState = {
  user: null,
  token: localStorage.getItem('token') || null,
  isAuthenticated: false,
  status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
  authMethod: null, // 'local' | 'google' | 'auth0'
  error: null,
  architectStatus: null, // 'pending' | 'approved' | 'rejected'
  isLoading: false,
};

// Interceptor to add token to requests
const setupAuthInterceptor = (token) => {
  axios.interceptors.request.use(
    (config) => {
      if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
      }
      return config;
    },
    (error) => Promise.reject(error)
  );
};

export const registerUser = createAsyncThunk(
  'auth/register',
  async (userData, { rejectWithValue }) => {
    try {
      const response = await axios.post('/api/auth/register', userData);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.error || 'Registration failed'
      );
    }
  }
);

export const loginUser = createAsyncThunk(
  'auth/login',
  async ({ email, password }, { rejectWithValue, dispatch }) => {
    try {
      const response = await axios.post('/api/auth/login', { email, password });
      const { token, user } = response.data;
      
      localStorage.setItem('token', token);
      setupAuthInterceptor(token);

      // Additional verification for architects
      if (user.role === 'architect' && user.status !== 'approved') {
        dispatch(fetchUserProfile(user._id));
      }

      return { token, user };
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.error || 'Login failed'
      );
    }
  }
);

export const googleLogin = createAsyncThunk(
  'auth/googleLogin',
  async (googleToken, { rejectWithValue }) => {
    try {
      const response = await axios.post('/api/auth/google-login', {
        token: googleToken,
      });
      const { token, user } = response.data;
      
      localStorage.setItem('token', token);
      setupAuthInterceptor(token);

      return { token, user };
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.error || 'Google login failed'
      );
    }
  }
);

export const logoutUser = createAsyncThunk(
  'auth/logout',
  async (_, { rejectWithValue }) => {
    try {
      await axios.post('/api/auth/logout');
      localStorage.removeItem('token');
      return null;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.error || 'Logout failed'
      );
    }
  }
);

export const checkAuthStatus = createAsyncThunk(
  'auth/checkStatus',
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        return { isAuthenticated: false, user: null };
      }

      const response = await axios.get('/api/auth/check', {
        headers: { Authorization: `Bearer ${token}` }
      });

      return response.data;
    } catch (error) {
      localStorage.removeItem('token');
      return { isAuthenticated: false, user: null };
    }
  }
);

export const fetchUserProfile = createAsyncThunk(
  'auth/fetchProfile',
  async (userId, { rejectWithValue }) => {
    try {
      const response = await axios.get(`/api/auth/profile/${userId}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.error || 'Failed to fetch profile'
      );
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    resetStatus: (state) => {
      state.status = 'idle';
      state.error = null;
      state.isLoading = false;
    },
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers(builder) {
    const handlePendingState = (state) => {
      state.status = 'loading';
      state.isLoading = true;
      state.error = null;
    };

    const handleRejectedState = (state, action) => {
      state.status = 'failed';
      state.isLoading = false;
      state.error = action.payload || 'An error occurred';
    };

    builder
      .addCase(registerUser.pending, handlePendingState)
      .addCase(registerUser.fulfilled, (state) => {
        state.status = 'succeeded';
        state.isLoading = false;
        state.error = null;
      })
      .addCase(registerUser.rejected, handleRejectedState)

      .addCase(loginUser.pending, handlePendingState)
      .addCase(loginUser.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.authMethod = 'local';
        state.isLoading = false;
        state.error = null;
        state.architectStatus = action.payload.user.role === 'architect' 
          ? action.payload.user.status 
          : null;
      })
      .addCase(loginUser.rejected, handleRejectedState)

      .addCase(googleLogin.pending, handlePendingState)
      .addCase(googleLogin.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.authMethod = 'google';
        state.isLoading = false;
        state.error = null;
      })
      .addCase(googleLogin.rejected, handleRejectedState)

      .addCase(logoutUser.fulfilled, (state) => {
        state.isAuthenticated = false;
        state.user = null;
        state.token = null;
        state.authMethod = null;
        state.status = 'idle';
        state.error = null;
        state.architectStatus = null;
      })

      .addCase(checkAuthStatus.fulfilled, (state, action) => {
        state.isAuthenticated = action.payload.isAuthenticated;
        state.user = action.payload.user || null;
        state.authMethod = action.payload.authMethod;
        
        if (action.payload.user?.role === 'architect') {
          state.architectStatus = action.payload.user.status;
        }
      })

      .addCase(fetchUserProfile.fulfilled, (state, action) => {
        state.user = action.payload;
        if (action.payload.role === 'architect') {
          state.architectStatus = action.payload.status;
        }
      });
  },
});

export const { resetStatus, clearError } = authSlice.actions;

// Selectors
export const selectCurrentUser = (state) => state.auth.user;
export const selectIsAuthenticated = (state) => state.auth.isAuthenticated;
export const selectAuthStatus = (state) => state.auth.status;
export const selectIsLoading = (state) => state.auth.isLoading;
export const selectAuthError = (state) => state.auth.error;
export const selectArchitectStatus = (state) => state.auth.architectStatus;
export const selectAuthMethod = (state) => state.auth.authMethod;

export default authSlice.reducer;