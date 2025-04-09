// frontend/src/redux/slices/ProjectSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// API base URL - replace with your actual API URL
const API_URL = "/api/projects";

// Async thunks
export const fetchAllProjects = createAsyncThunk(
  "projects/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(API_URL);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: error.message }
      );
    }
  }
);

export const fetchProjectById = createAsyncThunk(
  "projects/fetchById",
  async (projectId, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/${projectId}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: error.message }
      );
    }
  }
);

export const createProject = createAsyncThunk(
  "projects/create",
  async (projectData, { rejectWithValue }) => {
    try {
      const response = await axios.post(API_URL, projectData);
      return response.data.project;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: error.message }
      );
    }
  }
);

export const updateProject = createAsyncThunk(
  "projects/update",
  async ({ projectId, projectData }, { rejectWithValue }) => {
    try {
      const response = await axios.put(`${API_URL}/${projectId}`, projectData);
      return response.data.project;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: error.message }
      );
    }
  }
);

export const deleteProject = createAsyncThunk(
  "projects/delete",
  async (projectId, { rejectWithValue }) => {
    try {
      await axios.delete(`${API_URL}/${projectId}`);
      return projectId;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: error.message }
      );
    }
  }
);

export const searchProjects = createAsyncThunk(
  "projects/search",
  async (searchParams, { rejectWithValue }) => {
    try {
      const queryString = new URLSearchParams(searchParams).toString();
      const response = await axios.get(`${API_URL}/search?${queryString}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: error.message }
      );
    }
  }
);

export const likeProject = createAsyncThunk(
  "projects/like",
  async ({ projectId, userId }, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_URL}/${projectId}/like`, {
        userId,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: error.message }
      );
    }
  }
);

export const fetchArchitectProjects = createAsyncThunk(
  "projects/fetchArchitectProjects",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/architect`);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: error.message }
      );
    }
  }
);

export const fetchClientProjects = createAsyncThunk(
  "projects/fetchClientProjects",
  async ({ clientId, clientType }, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${API_URL}/client/${clientId}/${clientType}`
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: error.message }
      );
    }
  }
);

// Initial state
const initialState = {
  projects: [],
  currentProject: null,
  searchResults: [],
  isLoading: false,
  error: null,
  success: false,
  message: "",
};

// Create slice
const projectSlice = createSlice({
  name: "projects",
  initialState,
  reducers: {
    resetProjectState: (state) => {
      state.isLoading = false;
      state.success = false;
      state.error = null;
      state.message = "";
    },
    clearCurrentProject: (state) => {
      state.currentProject = null;
    },
    incrementViewCount: (state, action) => {
      const projectId = action.payload;
      const project = state.projects.find((p) => p._id === projectId);
      if (project) {
        project.views += 1;
      }
      if (state.currentProject && state.currentProject._id === projectId) {
        state.currentProject.views += 1;
      }
    },
    setFilteredProjects: (state, action) => {
      state.searchResults = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch all projects
      .addCase(fetchAllProjects.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchAllProjects.fulfilled, (state, action) => {
        state.isLoading = false;
        state.projects = action.payload;
        state.success = true;
      })
      .addCase(fetchAllProjects.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || { message: "Failed to fetch projects" };
      })

      // Fetch project by ID
      .addCase(fetchProjectById.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchProjectById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentProject = action.payload;
        state.success = true;
      })
      .addCase(fetchProjectById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || { message: "Failed to fetch project" };
      })

      // Create project
      .addCase(createProject.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createProject.fulfilled, (state, action) => {
        state.isLoading = false;
        state.projects.push(action.payload);
        state.success = true;
        state.message = "Project created successfully!";
      })
      .addCase(createProject.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || { message: "Failed to create project" };
      })

      // Update project
      .addCase(updateProject.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateProject.fulfilled, (state, action) => {
        state.isLoading = false;
        const index = state.projects.findIndex(
          (project) => project._id === action.payload._id
        );
        if (index !== -1) {
          state.projects[index] = action.payload;
        }
        state.currentProject = action.payload;
        state.success = true;
        state.message = "Project updated successfully!";
      })
      .addCase(updateProject.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || { message: "Failed to update project" };
      })

      // Delete project
      .addCase(deleteProject.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteProject.fulfilled, (state, action) => {
        state.isLoading = false;
        state.projects = state.projects.filter(
          (project) => project._id !== action.payload
        );
        state.success = true;
        state.message = "Project deleted successfully!";
      })
      .addCase(deleteProject.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || { message: "Failed to delete project" };
      })

      // Search projects
      .addCase(searchProjects.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(searchProjects.fulfilled, (state, action) => {
        state.isLoading = false;
        state.searchResults = action.payload.projects;
        state.success = true;
      })
      .addCase(searchProjects.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || {
          message: "Failed to search projects",
        };
      })

      // Like project
      .addCase(likeProject.fulfilled, (state, action) => {
        const projectId = action.payload.project._id;
        const updatedProject = action.payload.project;

        // Update in projects array
        const projectIndex = state.projects.findIndex(
          (p) => p._id === projectId
        );
        if (projectIndex !== -1) {
          state.projects[projectIndex] = {
            ...state.projects[projectIndex],
            likes: updatedProject.likes,
          };
        }

        // Update current project if it's the one being liked
        if (state.currentProject && state.currentProject._id === projectId) {
          state.currentProject = {
            ...state.currentProject,
            likes: updatedProject.likes,
          };
        }

        state.message = action.payload.message;
        state.success = true;
      })

      // Fetch architect projects
      .addCase(fetchArchitectProjects.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchArchitectProjects.fulfilled, (state, action) => {
        state.isLoading = false;
        state.projects = action.payload;
        state.success = true;
      })
      .addCase(fetchArchitectProjects.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || {
          message: "Failed to fetch architect projects",
        };
      })

      // Fetch client projects
      .addCase(fetchClientProjects.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchClientProjects.fulfilled, (state, action) => {
        state.isLoading = false;
        state.projects = action.payload;
        state.success = true;
      })
      .addCase(fetchClientProjects.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || {
          message: "Failed to fetch client projects",
        };
      });
  },
});

// Export actions and reducer
export const {
  resetProjectState,
  clearCurrentProject,
  incrementViewCount,
  setFilteredProjects,
} = projectSlice.actions;
export default projectSlice.reducer;
