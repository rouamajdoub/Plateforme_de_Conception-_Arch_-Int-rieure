import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = "http://localhost:5000/api/projects";

// Action pour récupérer les projets
export const fetchProjects = createAsyncThunk(
  "architect/fetchProjects",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(API_URL);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Action pour ajouter un projet
export const addProject = createAsyncThunk(
  "architect/addProject",
  async (projectData, { rejectWithValue }) => {
    try {
      const response = await axios.post(API_URL, projectData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Action pour mettre à jour un projet
export const updateProject = createAsyncThunk(
  "architect/updateProject",
  async (projectData, { rejectWithValue }) => {
    try {
      const response = await axios.put(
        `${API_URL}/${projectData._id}`,
        projectData
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Action pour supprimer un projet
export const deleteProject = createAsyncThunk(
  "architect/deleteProject",
  async (projectId, { rejectWithValue }) => {
    try {
      await axios.delete(`${API_URL}/${projectId}`);
      return projectId;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const architectSlice = createSlice({
  name: "architect",
  initialState: {
    projects: [],
    loading: false,
    error: null,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProjects.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchProjects.fulfilled, (state, action) => {
        state.loading = false;
        state.projects = action.payload;
      })
      .addCase(fetchProjects.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(addProject.fulfilled, (state, action) => {
        state.projects.push(action.payload);
      })
      .addCase(updateProject.fulfilled, (state, action) => {
        const index = state.projects.findIndex(
          (p) => p._id === action.payload._id
        );
        if (index !== -1) state.projects[index] = action.payload;
      })
      .addCase(deleteProject.fulfilled, (state, action) => {
        state.projects = state.projects.filter((p) => p._id !== action.payload);
      });
  },
});

export default architectSlice.reducer;
