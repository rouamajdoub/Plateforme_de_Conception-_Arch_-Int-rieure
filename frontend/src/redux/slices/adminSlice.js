import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

//---------------------------------------Subscriptions---------------------------------------
// Récupérer les abonnements
export const fetchSubscriptions = createAsyncThunk(
  "admin/fetchSubscriptions",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        "http://localhost:5000/api/subscriptions"
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Supprimer un abonnement
export const deleteSubscription = createAsyncThunk(
  "admin/deleteSubscription",
  async (id, { rejectWithValue, dispatch }) => {
    try {
      await axios.delete(`http://localhost:5000/api/subscriptions/${id}`);
      dispatch(fetchSubscriptions()); // Rafraîchir la liste après suppression
      return id; // Retourner l'ID supprimé
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Mettre à jour un abonnement
export const updateSubscription = createAsyncThunk(
  "admin/updateSubscription",
  async ({ id, data }, { rejectWithValue, dispatch }) => {
    try {
      const response = await axios.put(
        `http://localhost:5000/api/subscriptions/${id}`,
        data
      );
      dispatch(fetchSubscriptions()); // Rafraîchir la liste après mise à jour
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

//---------------------------------------Reviews---------------------------------------
// Récupérer les avis
export const fetchReviews = createAsyncThunk(
  "admin/fetchReviews",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        "http://localhost:5000/api/marketplace/product-reviews"
      );
      console.log("Fetched reviews:", response.data); // Ajoutez ceci
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Supprimer un avis
export const deleteReview = createAsyncThunk(
  "admin/deleteReview",
  async (id, { rejectWithValue, dispatch }) => {
    try {
      await axios.delete(`http://localhost:5000/api/projects/reviews/${id}`);
      dispatch(fetchReviews()); // Rafraîchir la liste après suppression
      return id; // Retourner l'ID supprimé
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

//-----------------------------------------Users---------------------------------------
// Récupérer les utilisateurs
export const fetchUsers = createAsyncThunk(
  "admin/fetchUsers",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get("http://localhost:5000/api/users");
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
      await axios.delete(`http://localhost:5000/api/users/${id}`);
      dispatch(fetchUsers()); // Refresh the user list after deletion
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
    reviews: [],
    loading: false,
    error: null,
  },
  extraReducers: (builder) => {
    builder
      // Gestion des abonnements
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

      // Gestion des avis
      .addCase(fetchReviews.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchReviews.fulfilled, (state, action) => {
        state.loading = false;
        state.reviews = action.payload;
      })
      .addCase(fetchReviews.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(deleteReview.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteReview.fulfilled, (state, action) => {
        state.loading = false;
        state.reviews = state.reviews.filter(
          (review) => review._id !== action.payload
        );
      })
      .addCase(deleteReview.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Gestion des utilisateurs
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
      });
  },
});

export default adminSlice.reducer;
