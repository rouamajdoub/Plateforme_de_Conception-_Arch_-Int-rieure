import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = "http://localhost:5000/api/events"; // Ajuste selon ton backend

// Fetch all events
export const fetchEvents = createAsyncThunk("events/fetchEvents", async (_, { rejectWithValue }) => {
  try {
    const response = await axios.get(API_URL, { withCredentials: true });
    console.log("Fetched events:", response.data.data); // ✅ Debug
    return response.data.data; // Vérifie que le backend retourne { success: true, data: events }
  } catch (error) {
    console.error("Error fetching events:", error); // ✅ Debug
    return rejectWithValue(error.response?.data?.message || "Failed to fetch events");
  }
});

// Add an event
export const addEvent = createAsyncThunk("events/addEvent", async (eventData, { rejectWithValue }) => {
  try {
    const response = await axios.post(API_URL, eventData, { withCredentials: true });
    return response.data.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || "Failed to add event");
  }
});

// Delete an event
export const deleteEvent = createAsyncThunk("events/deleteEvent", async (eventId, { rejectWithValue }) => {
  try {
    await axios.delete(`${API_URL}/${eventId}`, { withCredentials: true });
    return eventId;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || "Failed to delete event");
  }
});

const eventSlice = createSlice({
  name: "events",
  initialState: {
    events: [], // ✅ Évite undefined
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
        state.events = action.payload || []; // ✅ Évite undefined
      })
      .addCase(fetchEvents.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(addEvent.fulfilled, (state, action) => {
        state.events.push(action.payload);
      })
      .addCase(deleteEvent.fulfilled, (state, action) => {
        state.events = state.events.filter((event) => event.id !== action.payload);
      });
  },
});

export default eventSlice.reducer;
