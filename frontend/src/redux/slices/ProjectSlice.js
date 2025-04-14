import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// API base URL
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
  async (formData, { rejectWithValue }) => {
    try {
      // Set headers for form data with proper boundary handling
      const config = {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      };

      const response = await axios.post(API_URL, formData, config);
      return response.data.project;
    } catch (error) {
      console.error("Project creation error:", error);
      return rejectWithValue(
        error.response?.data || { message: error.message }
      );
    }
  }
);

export const updateProject = createAsyncThunk(
  "projects/update",
  async (params, { rejectWithValue }) => {
    try {
      const { projectId, formData } = params;

      // Set headers for form data
      const config = {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      };

      const response = await axios.put(
        `${API_URL}/${projectId}`,
        formData,
        config
      );
      return response.data.project;
    } catch (error) {
      console.error("Project update error:", error);
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

export const getProjectLikesCount = createAsyncThunk(
  "projects/getLikesCount",
  async (projectId, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/${projectId}/likes`);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: error.message }
      );
    }
  }
);

export const fetchProjectsByClient = createAsyncThunk(
  "projects/fetchByClient",
  async (clientId, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/client/${clientId}`);
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
  likesCount: 0,
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
    setFilteredProjects: (state, action) => {
      state.searchResults = action.payload;
    },
    clearErrors: (state) => {
      state.error = null;
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
        state.projects = action.payload.projects;
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
        state.currentProject = action.payload.project;
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
        state.success = false;
      })
      .addCase(createProject.fulfilled, (state, action) => {
        state.isLoading = false;
        state.projects.push(action.payload);
        state.success = true;
        state.message = "Project created successfully!";
      })
      .addCase(createProject.rejected, (state, action) => {
        state.isLoading = false;
        state.success = false;
        state.error = action.payload || { message: "Failed to create project" };
      })

      // Update project
      .addCase(updateProject.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.success = false;
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
        state.success = false;
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
      .addCase(likeProject.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(likeProject.fulfilled, (state, action) => {
        state.isLoading = false;
        state.likesCount = action.payload.likesCount;
        state.message = action.payload.message;
        state.success = true;
      })
      .addCase(likeProject.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || { message: "Failed to like project" };
      })

      // Get project likes count
      .addCase(getProjectLikesCount.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getProjectLikesCount.fulfilled, (state, action) => {
        state.isLoading = false;
        state.likesCount = action.payload.likesCount;
        state.success = true;
      })
      .addCase(getProjectLikesCount.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || {
          message: "Failed to get project likes count",
        };
      })

      // Fetch projects by client
      .addCase(fetchProjectsByClient.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchProjectsByClient.fulfilled, (state, action) => {
        state.isLoading = false;
        state.projects = action.payload.projects;
        state.success = true;
      })
      .addCase(fetchProjectsByClient.rejected, (state, action) => {
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
  setFilteredProjects,
  clearErrors,
} = projectSlice.actions;
export default projectSlice.reducer;
