import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// API base URL
const API_URL = "/api/projects";

// Existing async thunks
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

export const addMilestone = createAsyncThunk(
  "projects/addMilestone",
  async ({ projectId, milestoneData }, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${API_URL}/${projectId}/milestones`,
        milestoneData
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: error.message }
      );
    }
  }
);

export const updateMilestone = createAsyncThunk(
  "projects/updateMilestone",
  async ({ projectId, milestoneId, milestoneData }, { rejectWithValue }) => {
    try {
      const response = await axios.put(
        `${API_URL}/${projectId}/milestones/${milestoneId}`,
        milestoneData
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: error.message }
      );
    }
  }
);

export const deleteMilestone = createAsyncThunk(
  "projects/deleteMilestone",
  async ({ projectId, milestoneId }, { rejectWithValue }) => {
    try {
      const response = await axios.delete(
        `${API_URL}/${projectId}/milestones/${milestoneId}`
      );
      return { ...response.data, milestoneId };
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: error.message }
      );
    }
  }
);

export const updateProjectProgress = createAsyncThunk(
  "projects/updateProgress",
  async ({ projectId, progressData }, { rejectWithValue }) => {
    try {
      const response = await axios.put(
        `${API_URL}/${projectId}/progress`,
        progressData
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: error.message }
      );
    }
  }
);

export const addPayment = createAsyncThunk(
  "projects/addPayment",
  async ({ projectId, paymentData }, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${API_URL}/${projectId}/payments`,
        paymentData
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: error.message }
      );
    }
  }
);

export const updatePaymentStatus = createAsyncThunk(
  "projects/updatePaymentStatus",
  async ({ projectId, statusData }, { rejectWithValue }) => {
    try {
      const response = await axios.put(
        `${API_URL}/${projectId}/payment-status`,
        statusData
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: error.message }
      );
    }
  }
);

export const deletePayment = createAsyncThunk(
  "projects/deletePayment",
  async ({ projectId, paymentId }, { rejectWithValue }) => {
    try {
      const response = await axios.delete(
        `${API_URL}/${projectId}/payments/${paymentId}`
      );
      return { ...response.data, paymentId };
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
  // New state for milestones and payments
  milestone: {
    isLoading: false,
    error: null,
    success: false,
    message: "",
  },
  payment: {
    isLoading: false,
    error: null,
    success: false,
    message: "",
  },
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
      state.milestone.error = null;
      state.payment.error = null;
    },
    resetMilestoneState: (state) => {
      state.milestone = {
        isLoading: false,
        error: null,
        success: false,
        message: "",
      };
    },
    resetPaymentState: (state) => {
      state.payment = {
        isLoading: false,
        error: null,
        success: false,
        message: "",
      };
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
      })

      // Add milestone
      .addCase(addMilestone.pending, (state) => {
        state.milestone.isLoading = true;
        state.milestone.error = null;
        state.milestone.success = false;
      })
      .addCase(addMilestone.fulfilled, (state, action) => {
        state.milestone.isLoading = false;
        state.milestone.success = true;
        state.milestone.message = "Milestone added successfully!";

        // Update the current project if loaded
        if (
          state.currentProject &&
          state.currentProject._id === action.payload.projectId
        ) {
          if (!state.currentProject.milestones) {
            state.currentProject.milestones = [];
          }
          state.currentProject.milestones.push(action.payload.milestone);

          // Update progress percentage if returned
          if (action.payload.progressPercentage !== undefined) {
            state.currentProject.progressPercentage =
              action.payload.progressPercentage;
          }
        }
      })
      .addCase(addMilestone.rejected, (state, action) => {
        state.milestone.isLoading = false;
        state.milestone.success = false;
        state.milestone.error = action.payload || {
          message: "Failed to add milestone",
        };
      })

      // Update milestone
      .addCase(updateMilestone.pending, (state) => {
        state.milestone.isLoading = true;
        state.milestone.error = null;
        state.milestone.success = false;
      })
      .addCase(updateMilestone.fulfilled, (state, action) => {
        state.milestone.isLoading = false;
        state.milestone.success = true;
        state.milestone.message = "Milestone updated successfully!";

        // Update the current project if loaded
        if (
          state.currentProject &&
          state.currentProject._id === action.payload.project._id
        ) {
          state.currentProject.milestones = action.payload.project.milestones;
          state.currentProject.progressPercentage =
            action.payload.project.progressPercentage;
        }
      })
      .addCase(updateMilestone.rejected, (state, action) => {
        state.milestone.isLoading = false;
        state.milestone.success = false;
        state.milestone.error = action.payload || {
          message: "Failed to update milestone",
        };
      })

      // Delete milestone
      .addCase(deleteMilestone.pending, (state) => {
        state.milestone.isLoading = true;
        state.milestone.error = null;
        state.milestone.success = false;
      })
      .addCase(deleteMilestone.fulfilled, (state, action) => {
        state.milestone.isLoading = false;
        state.milestone.success = true;
        state.milestone.message = "Milestone deleted successfully!";

        // Update the current project if loaded
        if (
          state.currentProject &&
          state.currentProject._id === action.payload.projectId
        ) {
          state.currentProject.milestones =
            state.currentProject.milestones.filter(
              (milestone) => milestone._id !== action.payload.milestoneId
            );

          // Update progress if returned
          if (action.payload.progressPercentage !== undefined) {
            state.currentProject.progressPercentage =
              action.payload.progressPercentage;
          }
        }
      })
      .addCase(deleteMilestone.rejected, (state, action) => {
        state.milestone.isLoading = false;
        state.milestone.success = false;
        state.milestone.error = action.payload || {
          message: "Failed to delete milestone",
        };
      })

      // Update project progress
      .addCase(updateProjectProgress.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(updateProjectProgress.fulfilled, (state, action) => {
        state.isLoading = false;
        state.success = true;
        state.message = "Project progress updated successfully!";

        // Update the current project if loaded
        if (
          state.currentProject &&
          state.currentProject._id === action.payload.projectId
        ) {
          state.currentProject.progressPercentage =
            action.payload.progressPercentage;
        }

        // Update in the projects list
        const index = state.projects.findIndex(
          (project) => project._id === action.payload.projectId
        );
        if (index !== -1) {
          state.projects[index].progressPercentage =
            action.payload.progressPercentage;
        }
      })
      .addCase(updateProjectProgress.rejected, (state, action) => {
        state.isLoading = false;
        state.success = false;
        state.error = action.payload || {
          message: "Failed to update project progress",
        };
      })

      // Add payment
      .addCase(addPayment.pending, (state) => {
        state.payment.isLoading = true;
        state.payment.error = null;
        state.payment.success = false;
      })
      .addCase(addPayment.fulfilled, (state, action) => {
        state.payment.isLoading = false;
        state.payment.success = true;
        state.payment.message = "Payment added successfully!";

        // Update the current project if loaded
        if (
          state.currentProject &&
          state.currentProject._id === action.payload.projectId
        ) {
          if (!state.currentProject.paymentHistory) {
            state.currentProject.paymentHistory = [];
          }
          state.currentProject.paymentHistory.push(action.payload.payment);
          state.currentProject.paymentStatus = action.payload.paymentStatus;
        }
      })
      .addCase(addPayment.rejected, (state, action) => {
        state.payment.isLoading = false;
        state.payment.success = false;
        state.payment.error = action.payload || {
          message: "Failed to add payment",
        };
      })

      // Update payment status
      .addCase(updatePaymentStatus.pending, (state) => {
        state.payment.isLoading = true;
        state.payment.error = null;
        state.payment.success = false;
      })
      .addCase(updatePaymentStatus.fulfilled, (state, action) => {
        state.payment.isLoading = false;
        state.payment.success = true;
        state.payment.message = "Payment status updated successfully!";

        // Update the current project if loaded
        if (
          state.currentProject &&
          state.currentProject._id === action.payload.projectId
        ) {
          state.currentProject.paymentStatus = action.payload.paymentStatus;
        }

        // Update in the projects list
        const index = state.projects.findIndex(
          (project) => project._id === action.payload.projectId
        );
        if (index !== -1) {
          state.projects[index].paymentStatus = action.payload.paymentStatus;
        }
      })
      .addCase(updatePaymentStatus.rejected, (state, action) => {
        state.payment.isLoading = false;
        state.payment.success = false;
        state.payment.error = action.payload || {
          message: "Failed to update payment status",
        };
      })

      // Delete payment
      .addCase(deletePayment.pending, (state) => {
        state.payment.isLoading = true;
        state.payment.error = null;
        state.payment.success = false;
      })
      .addCase(deletePayment.fulfilled, (state, action) => {
        state.payment.isLoading = false;
        state.payment.success = true;
        state.payment.message = "Payment deleted successfully!";

        // Update the current project if loaded
        if (
          state.currentProject &&
          state.currentProject._id === action.payload.projectId
        ) {
          state.currentProject.paymentHistory =
            state.currentProject.paymentHistory.filter(
              (payment) => payment._id !== action.payload.paymentId
            );
          state.currentProject.paymentStatus = action.payload.paymentStatus;
        }
      })
      .addCase(deletePayment.rejected, (state, action) => {
        state.payment.isLoading = false;
        state.payment.success = false;
        state.payment.error = action.payload || {
          message: "Failed to delete payment",
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
  resetMilestoneState,
  resetPaymentState,
} = projectSlice.actions;
export default projectSlice.reducer;
