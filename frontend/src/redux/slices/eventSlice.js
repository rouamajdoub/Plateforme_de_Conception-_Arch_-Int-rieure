import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = "http://localhost:5000/api/events";

// Get auth token function
const getAuthToken = () => {
  return localStorage.getItem("authToken"); // or however you store your token
};

// Fetch all events
export const fetchEvents = createAsyncThunk(
  "events/fetchEvents",
  async (_, { rejectWithValue }) => {
    try {
      // Make sure withCredentials is set to true to pass cookies
      const response = await axios.get(API_URL, {
        withCredentials: true,
      });

      console.log("Fetched events data:", response.data);
      return response.data.data; // Make sure this is correctly extracting the events array
    } catch (error) {
      console.error("Error fetching events:", error);
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch events"
      );
    }
  }
);

// Add an event
export const addEvent = createAsyncThunk(
  "events/addEvent",
  async (eventData, { rejectWithValue }) => {
    try {
      // Use withCredentials: true to include cookies (for Auth0)
      // If using JWT, include the token in Authorization header
      const token = localStorage.getItem("token"); // or sessionStorage, or however you store it

      const config = {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        withCredentials: true, // This is crucial for Auth0 cookie-based auth
      };

      const response = await axios.post(API_URL, eventData, config);
      return response.data.data;
    } catch (error) {
      console.error("Error adding event:", error);
      return rejectWithValue(
        error.response?.data?.message || "Failed to add event"
      );
    }
  }
);

// Delete an event
export const deleteEvent = createAsyncThunk(
  "events/deleteEvent",
  async (eventId, { rejectWithValue }) => {
    try {
      const token = getAuthToken();
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      };

      await axios.delete(`${API_URL}/${eventId}`, config);
      return eventId;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to delete event"
      );
    }
  }
);

const eventSlice = createSlice({
  name: "events",
  initialState: {
    events: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchEvents.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchEvents.fulfilled, (state, action) => {
        state.loading = false;
        state.events = action.payload || [];
      })
      .addCase(fetchEvents.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(addEvent.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addEvent.fulfilled, (state, action) => {
        state.loading = false;
        state.events.push(action.payload);
      })
      .addCase(addEvent.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(deleteEvent.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteEvent.fulfilled, (state, action) => {
        state.loading = false;
        state.events = state.events.filter(
          (event) => event._id !== action.payload
        );
      })
      .addCase(deleteEvent.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default eventSlice.reducer;
