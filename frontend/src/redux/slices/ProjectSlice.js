import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Base URL of your backend API
const API_URL = "http://localhost:5000/api/projects";

// **Async Actions**

// Fetch all projects
export const fetchProjects = createAsyncThunk(
  "projects/fetchProjects",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(API_URL);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Error fetching projects");
    }
  }
);

// Fetch a single project by ID
export const fetchProjectById = createAsyncThunk(
  "projects/fetchProjectById",
  async (projectId, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/${projectId}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Error fetching project");
    }
  }
);

// Create a new project
export const createProject = createAsyncThunk(
  "projects/createProject",
  async (projectData, { rejectWithValue }) => {
    try {
      const response = await axios.post(API_URL, projectData);
      console.log("✅ Create Project Response:", response.data); // Debugging
      return response.data.project || response.data; // Ensure correct structure
    } catch (error) {
      console.error("❌ Create Project Error:", error.response?.data);
      return rejectWithValue(error.response?.data || "Error creating project");
    }
  }
);

// Update a project
export const updateProject = createAsyncThunk(
  "projects/updateProject",
  async ({ projectId, updateData }, { rejectWithValue }) => {
    try {
      const response = await axios.put(`${API_URL}/${projectId}`, updateData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Error updating project");
    }
  }
);

// Delete a project
export const deleteProject = createAsyncThunk(
  "projects/deleteProject",
  async (projectId, { rejectWithValue }) => {
    try {
      await axios.delete(`${API_URL}/${projectId}`);
      return projectId; // Return ID for removal in Redux state
    } catch (error) {
      return rejectWithValue(error.response?.data || "Error deleting project");
    }
  }
);

// Like/Unlike a project
export const likeProject = createAsyncThunk(
  "projects/likeProject",
  async ({ projectId, userId }, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_URL}/${projectId}/like`, {
        userId,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Error liking project");
    }
  }
);

// **NEW: Search projects**
export const searchProjects = createAsyncThunk(
  "projects/searchProjects",
  async (searchParams, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/search`, {
        params: searchParams,
      });
      return response.data.projects;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Error searching projects"
      );
    }
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
  reducers: {}, // Non-async reducers can go here
  extraReducers: (builder) => {
    builder
      // **Fetch All Projects**
      .addCase(fetchProjects.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchProjects.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.projects = action.payload;
      })
      .addCase(fetchProjects.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })

      // **Fetch Single Project**
      .addCase(fetchProjectById.fulfilled, (state, action) => {
        state.project = action.payload;
      })

      // **Create Project**
      .addCase(createProject.fulfilled, (state, action) => {
        if (action.payload) {
          state.projects.push(action.payload); // Add new project
        }
      })
      .addCase(createProject.rejected, (state, action) => {
        state.error = action.payload;
      })

      // **Update Project**
      .addCase(updateProject.fulfilled, (state, action) => {
        const index = state.projects.findIndex(
          (p) => p._id === action.payload.project._id
        );
        if (index !== -1) {
          state.projects[index] = action.payload.project;
        }
      })

      // **Delete Project**
      .addCase(deleteProject.fulfilled, (state, action) => {
        state.projects = state.projects.filter((p) => p._id !== action.payload);
      })

      // **Like Project**
      .addCase(likeProject.fulfilled, (state, action) => {
        const index = state.projects.findIndex(
          (p) => p._id === action.payload.project._id
        );
        if (index !== -1) {
          state.projects[index] = action.payload.project;
        }
      })

      // **Search Projects**
      .addCase(searchProjects.pending, (state) => {
        state.status = "loading";
      })
      .addCase(searchProjects.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.projects = action.payload;
      })
      .addCase(searchProjects.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

// Export the reducer
export default projectSlice.reducer;
