import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Define the initial state
const initialState = {
  clients: [],
  loading: false,
  error: null,
  success: false,
  message: "",
};

// Async thunk to fetch all clients
export const fetchClients = createAsyncThunk(
  "clients/fetchClients",
  async () => {
    const response = await axios.get("/api/client-arch/");
    return response.data.data;
  }
);

// Async thunk to create a client
export const createClient = createAsyncThunk(
  "clients/createClient",
  async (clientData) => {
    const response = await axios.post("/api/client-arch/", clientData);
    return response.data.data;
  }
);

// Async thunk to update a client
export const updateClient = createAsyncThunk(
  "clients/updateClient",
  async ({ id, clientData }) => {
    const response = await axios.put(`/api/client-arch/${id}`, clientData);
    return response.data.data;
  }
);

// Async thunk to delete a client
export const deleteClient = createAsyncThunk(
  "clients/deleteClient",
  async (id) => {
    await axios.delete(`/api/client-arch/${id}`);
    return id;
  }
);

// Async thunk to get a client by ID
export const getClientById = createAsyncThunk(
  "clients/getClientById",
  async (id) => {
    const response = await axios.get(`/api/client-arch/${id}`);
    return response.data.data;
  }
);

// Async thunk to search clients
export const searchClients = createAsyncThunk(
  "clients/searchClients",
  async (query) => {
    const response = await axios.get(`/api/client-arch/search/${query}`);
    return response.data.data;
  }
);

// Create the slice
const clientsSlice = createSlice({
  name: "clients",
  initialState,
  reducers: {
    clearClientState: (state) => {
      state.success = false;
      state.error = null;
      state.message = "";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchClients.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchClients.fulfilled, (state, action) => {
        state.loading = false;
        state.clients = action.payload;
      })
      .addCase(fetchClients.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(createClient.fulfilled, (state, action) => {
        state.clients.push(action.payload);
        state.success = true;
        state.message = "Client added successfully";
      })
      .addCase(updateClient.fulfilled, (state, action) => {
        const index = state.clients.findIndex(
          (client) => client._id === action.payload._id
        );
        if (index !== -1) {
          state.clients[index] = action.payload;
        }
        state.success = true;
        state.message = "Client updated successfully";
      })
      .addCase(deleteClient.fulfilled, (state, action) => {
        state.clients = state.clients.filter(
          (client) => client._id !== action.payload
        );
        state.success = true;
        state.message = "Client deleted successfully";
      })
      .addCase(searchClients.fulfilled, (state, action) => {
        state.clients = action.payload;
      })
      .addCase(getClientById.fulfilled, (state, action) => {
        const clientIndex = state.clients.findIndex(
          (client) => client._id === action.payload._id
        );
        if (clientIndex === -1) {
          state.clients.push(action.payload);
        }
      });
  },
});

// Export the actions and reducer
export const { clearClientState } = clientsSlice.actions;
export default clientsSlice.reducer;
