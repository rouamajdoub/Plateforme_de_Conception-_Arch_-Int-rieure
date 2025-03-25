import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Base URL of your backend API
const API_URL = "http://localhost:5000/api/projects";

// **Async Actions**

// missing the search functionality

/*---------------------------------------------------------------
---------------------------------------*/
// Fetch all projects
export const fetchProjects = createAsyncThunk(
  "projects/fetchProjects",
  async () => {
    const response = await axios.get(API_URL);
    return response.data;
  }
);

// Fetch a single project by ID
export const fetchProjectById = createAsyncThunk(
  "projects/fetchProjectById",
  async (projectId) => {
    const response = await axios.get(`${API_URL}/${projectId}`);
    return response.data;
  }
);

// Create a new project
export const createProject = createAsyncThunk(
  "projects/createProject",
  async (projectData) => {
    const response = await axios.post(API_URL, projectData);
    return response.data;
  }
);

// Update a project
export const updateProject = createAsyncThunk(
  "projects/updateProject",
  async ({ projectId, updateData }) => {
    const response = await axios.put(`${API_URL}/${projectId}`, updateData);
    return response.data;
  }
);

// Delete a project
export const deleteProject = createAsyncThunk(
  "projects/deleteProject",
  async (projectId) => {
    await axios.delete(`${API_URL}/${projectId}`);
    return projectId; // Return ID for removal in Redux state
  }
);

// Like/Unlike a project
export const likeProject = createAsyncThunk(
  "projects/likeProject",
  async ({ projectId, userId }) => {
    const response = await axios.post(`${API_URL}/${projectId}/like`, {
      userId,
    });
    return response.data;
  }
);

// **Redux Slice**
const projectSlice = createSlice({
  name: "projects",
  initialState: {
    projects: [],
    project: null,
    status: "idle", // "idle" | "loading" | "succeeded" | "failed"
    error: null,
  },
  reducers: {}, // You can add non-async reducers if needed
  extraReducers: (builder) => {
    builder
      .addCase(fetchProjects.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchProjects.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.projects = action.payload;
      })
      .addCase(fetchProjects.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(fetchProjectById.fulfilled, (state, action) => {
        state.project = action.payload;
      })
      .addCase(createProject.fulfilled, (state, action) => {
        state.projects.push(action.payload.project);
      })
      .addCase(updateProject.fulfilled, (state, action) => {
        const index = state.projects.findIndex(
          (p) => p._id === action.payload.project._id
        );
        if (index !== -1) {
          state.projects[index] = action.payload.project;
        }
      })
      .addCase(deleteProject.fulfilled, (state, action) => {
        state.projects = state.projects.filter((p) => p._id !== action.payload);
      })
      .addCase(likeProject.fulfilled, (state, action) => {
        const index = state.projects.findIndex(
          (p) => p._id === action.payload.project._id
        );
        if (index !== -1) {
          state.projects[index] = action.payload.project;
        }
      });
  },
});

// Export the reducer
export default projectSlice.reducer;
