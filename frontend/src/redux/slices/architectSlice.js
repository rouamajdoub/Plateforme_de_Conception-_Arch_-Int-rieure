import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL_PROJECTS = "http://localhost:5000/api/projects";
const API_URL_QUOTES_INVOICES = "http://localhost:5000/api/quotes-invoices";

// Set up axios instance for authentication
const axiosInstance = axios.create();
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ====== PROJECT ACTIONS ======
export const fetchProjects = createAsyncThunk(
  "architect/fetchProjects",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(API_URL_PROJECTS);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Failed to fetch projects"
      );
    }
  }
);

export const addProject = createAsyncThunk(
  "architect/addProject",
  async (projectData, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(API_URL_PROJECTS, projectData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to add project");
    }
  }
);

export const updateProject = createAsyncThunk(
  "architect/updateProject",
  async (projectData, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.put(
        `${API_URL_PROJECTS}/${projectData._id}`,
        projectData
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Failed to update project"
      );
    }
  }
);

export const deleteProject = createAsyncThunk(
  "architect/deleteProject",
  async (projectId, { rejectWithValue }) => {
    try {
      await axiosInstance.delete(`${API_URL_PROJECTS}/${projectId}`);
      return projectId;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Failed to delete project"
      );
    }
  }
);

// ====== QUOTE ACTIONS ======
export const fetchQuotes = createAsyncThunk(
  "architect/fetchQuotes",
  async (filters = {}, { rejectWithValue }) => {
    try {
      const queryParams = new URLSearchParams();
      for (const [key, value] of Object.entries(filters)) {
        if (value) queryParams.append(key, value);
      }

      const response = await axiosInstance.get(
        `${API_URL_QUOTES_INVOICES}/quotes?${queryParams}`
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to fetch quotes");
    }
  }
);

export const getQuoteById = createAsyncThunk(
  "architect/getQuoteById",
  async (quoteId, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(
        `${API_URL_QUOTES_INVOICES}/quotes/${quoteId}`
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to fetch quote");
    }
  }
);

export const addQuote = createAsyncThunk(
  "architect/addQuote",
  async (quoteData, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(
        `${API_URL_QUOTES_INVOICES}/quotes`,
        quoteData
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to create quote");
    }
  }
);

export const updateQuote = createAsyncThunk(
  "architect/updateQuote",
  async (quoteData, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.patch(
        `${API_URL_QUOTES_INVOICES}/quotes/${quoteData._id}`,
        quoteData
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to update quote");
    }
  }
);

export const deleteQuote = createAsyncThunk(
  "architect/deleteQuote",
  async (quoteId, { rejectWithValue }) => {
    try {
      await axiosInstance.delete(
        `${API_URL_QUOTES_INVOICES}/quotes/${quoteId}`
      );
      return quoteId;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to delete quote");
    }
  }
);

export const convertQuoteToInvoice = createAsyncThunk(
  "architect/convertQuoteToInvoice",
  async ({ quoteId, dueDate }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.patch(
        `${API_URL_QUOTES_INVOICES}/quotes/${quoteId}/convert`,
        { dueDate }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Failed to convert quote to invoice"
      );
    }
  }
);

export const generateQuotePDF = createAsyncThunk(
  "architect/generateQuotePDF",
  async (quoteId, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(
        `${API_URL_QUOTES_INVOICES}/quotes/${quoteId}/pdf`,
        { responseType: "blob" }
      );

      // Create a URL for the blob
      const pdfUrl = URL.createObjectURL(response.data);

      return {
        quoteId,
        pdfUrl,
        pdfBlob: response.data,
      };
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to generate PDF");
    }
  }
);

// ====== INVOICE ACTIONS ======
export const fetchInvoices = createAsyncThunk(
  "architect/fetchInvoices",
  async (filters = {}, { rejectWithValue }) => {
    try {
      const queryParams = new URLSearchParams();
      for (const [key, value] of Object.entries(filters)) {
        if (value) queryParams.append(key, value);
      }

      const response = await axiosInstance.get(
        `${API_URL_QUOTES_INVOICES}/invoices?${queryParams}`
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Failed to fetch invoices"
      );
    }
  }
);

export const getInvoiceById = createAsyncThunk(
  "architect/getInvoiceById",
  async (invoiceId, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(
        `${API_URL_QUOTES_INVOICES}/invoices/${invoiceId}`
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to fetch invoice");
    }
  }
);

export const addInvoice = createAsyncThunk(
  "architect/addInvoice",
  async (invoiceData, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(
        `${API_URL_QUOTES_INVOICES}/invoices`,
        invoiceData
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Failed to create invoice"
      );
    }
  }
);

export const updateInvoice = createAsyncThunk(
  "architect/updateInvoice",
  async (invoiceData, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.patch(
        `${API_URL_QUOTES_INVOICES}/invoices/${invoiceData._id}`,
        invoiceData
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Failed to update invoice"
      );
    }
  }
);

export const deleteInvoice = createAsyncThunk(
  "architect/deleteInvoice",
  async (invoiceId, { rejectWithValue }) => {
    try {
      await axiosInstance.delete(
        `${API_URL_QUOTES_INVOICES}/invoices/${invoiceId}`
      );
      return invoiceId;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Failed to delete invoice"
      );
    }
  }
);

export const recordInvoicePayment = createAsyncThunk(
  "architect/recordInvoicePayment",
  async ({ invoiceId, paymentData }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(
        `${API_URL_QUOTES_INVOICES}/invoices/${invoiceId}/payment`,
        paymentData
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Failed to record payment"
      );
    }
  }
);

export const generateInvoicePDF = createAsyncThunk(
  "architect/generateInvoicePDF",
  async (invoiceId, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(
        `${API_URL_QUOTES_INVOICES}/invoices/${invoiceId}/pdf`,
        { responseType: "blob" }
      );

      // Create a URL for the blob
      const pdfUrl = URL.createObjectURL(response.data);

      return {
        invoiceId,
        pdfUrl,
        pdfBlob: response.data,
      };
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to generate PDF");
    }
  }
);

const architectSlice = createSlice({
  name: "architect",
  initialState: {
    projects: [],
    quotes: [],
    invoices: [],
    currentQuote: null,
    currentInvoice: null,
    pdfs: {}, // Store generated PDFs by ID
    loading: {
      projects: false,
      quotes: false,
      invoices: false,
      currentItem: false,
      pdf: false,
    },
    error: {
      projects: null,
      quotes: null,
      invoices: null,
      currentItem: null,
      pdf: null,
    },
  },
  reducers: {
    clearCurrentItems: (state) => {
      state.currentQuote = null;
      state.currentInvoice = null;
    },
    clearPDFs: (state) => {
      // Clean up object URLs to prevent memory leaks
      Object.values(state.pdfs).forEach((pdf) => {
        if (pdf.pdfUrl) {
          URL.revokeObjectURL(pdf.pdfUrl);
        }
      });
      state.pdfs = {};
    },
  },
  extraReducers: (builder) => {
    builder
      // Project reducers
      .addCase(fetchProjects.pending, (state) => {
        state.loading.projects = true;
        state.error.projects = null;
      })
      .addCase(fetchProjects.fulfilled, (state, action) => {
        state.loading.projects = false;
        state.projects = action.payload.data;
      })
      .addCase(fetchProjects.rejected, (state, action) => {
        state.loading.projects = false;
        state.error.projects = action.payload;
      })
      .addCase(addProject.fulfilled, (state, action) => {
        state.projects.push(action.payload.data);
      })
      .addCase(updateProject.fulfilled, (state, action) => {
        const index = state.projects.findIndex(
          (p) => p._id === action.payload.data._id
        );
        if (index !== -1) state.projects[index] = action.payload.data;
      })
      .addCase(deleteProject.fulfilled, (state, action) => {
        state.projects = state.projects.filter((p) => p._id !== action.payload);
      })

      // Quote reducers
      .addCase(fetchQuotes.pending, (state) => {
        state.loading.quotes = true;
        state.error.quotes = null;
      })
      .addCase(fetchQuotes.fulfilled, (state, action) => {
        state.loading.quotes = false;
        state.quotes = action.payload.data;
      })
      .addCase(fetchQuotes.rejected, (state, action) => {
        state.loading.quotes = false;
        state.error.quotes = action.payload;
      })
      .addCase(getQuoteById.pending, (state) => {
        state.loading.currentItem = true;
        state.error.currentItem = null;
      })
      .addCase(getQuoteById.fulfilled, (state, action) => {
        state.loading.currentItem = false;
        state.currentQuote = action.payload.data;
      })
      .addCase(getQuoteById.rejected, (state, action) => {
        state.loading.currentItem = false;
        state.error.currentItem = action.payload;
      })
      .addCase(addQuote.fulfilled, (state, action) => {
        state.quotes.push(action.payload.data);
      })
      .addCase(updateQuote.fulfilled, (state, action) => {
        const index = state.quotes.findIndex(
          (q) => q._id === action.payload.data._id
        );
        if (index !== -1) state.quotes[index] = action.payload.data;

        // Update current quote if it's the one being updated
        if (
          state.currentQuote &&
          state.currentQuote._id === action.payload.data._id
        ) {
          state.currentQuote = action.payload.data;
        }
      })
      .addCase(deleteQuote.fulfilled, (state, action) => {
        state.quotes = state.quotes.filter((q) => q._id !== action.payload);

        // Clear current quote if it's the one being deleted
        if (state.currentQuote && state.currentQuote._id === action.payload) {
          state.currentQuote = null;
        }
      })
      .addCase(convertQuoteToInvoice.fulfilled, (state, action) => {
        // Remove from quotes
        state.quotes = state.quotes.filter(
          (q) => q._id !== action.payload.data._id
        );

        // Add to invoices
        state.invoices.push(action.payload.data);

        // Clear current quote if it's the one being converted
        if (
          state.currentQuote &&
          state.currentQuote._id === action.payload.data._id
        ) {
          state.currentQuote = null;
        }
      })
      .addCase(generateQuotePDF.pending, (state) => {
        state.loading.pdf = true;
        state.error.pdf = null;
      })
      .addCase(generateQuotePDF.fulfilled, (state, action) => {
        state.loading.pdf = false;
        state.pdfs[action.payload.quoteId] = {
          pdfUrl: action.payload.pdfUrl,
          pdfBlob: action.payload.pdfBlob,
        };
      })
      .addCase(generateQuotePDF.rejected, (state, action) => {
        state.loading.pdf = false;
        state.error.pdf = action.payload;
      })

      // Invoice reducers
      .addCase(fetchInvoices.pending, (state) => {
        state.loading.invoices = true;
        state.error.invoices = null;
      })
      .addCase(fetchInvoices.fulfilled, (state, action) => {
        state.loading.invoices = false;
        state.invoices = action.payload.data;
      })
      .addCase(fetchInvoices.rejected, (state, action) => {
        state.loading.invoices = false;
        state.error.invoices = action.payload;
      })
      .addCase(getInvoiceById.pending, (state) => {
        state.loading.currentItem = true;
        state.error.currentItem = null;
      })
      .addCase(getInvoiceById.fulfilled, (state, action) => {
        state.loading.currentItem = false;
        state.currentInvoice = action.payload.data;
      })
      .addCase(getInvoiceById.rejected, (state, action) => {
        state.loading.currentItem = false;
        state.error.currentItem = action.payload;
      })
      .addCase(addInvoice.fulfilled, (state, action) => {
        state.invoices.push(action.payload.data);
      })
      .addCase(updateInvoice.fulfilled, (state, action) => {
        const index = state.invoices.findIndex(
          (i) => i._id === action.payload.data._id
        );
        if (index !== -1) state.invoices[index] = action.payload.data;

        // Update current invoice if it's the one being updated
        if (
          state.currentInvoice &&
          state.currentInvoice._id === action.payload.data._id
        ) {
          state.currentInvoice = action.payload.data;
        }
      })
      .addCase(deleteInvoice.fulfilled, (state, action) => {
        state.invoices = state.invoices.filter((i) => i._id !== action.payload);

        // Clear current invoice if it's the one being deleted
        if (
          state.currentInvoice &&
          state.currentInvoice._id === action.payload
        ) {
          state.currentInvoice = null;
        }
      })
      .addCase(recordInvoicePayment.fulfilled, (state, action) => {
        const index = state.invoices.findIndex(
          (i) => i._id === action.payload.data._id
        );
        if (index !== -1) state.invoices[index] = action.payload.data;

        // Update current invoice if it's the one being updated
        if (
          state.currentInvoice &&
          state.currentInvoice._id === action.payload.data._id
        ) {
          state.currentInvoice = action.payload.data;
        }
      })
      .addCase(generateInvoicePDF.pending, (state) => {
        state.loading.pdf = true;
        state.error.pdf = null;
      })
      .addCase(generateInvoicePDF.fulfilled, (state, action) => {
        state.loading.pdf = false;
        state.pdfs[action.payload.invoiceId] = {
          pdfUrl: action.payload.pdfUrl,
          pdfBlob: action.payload.pdfBlob,
        };
      })
      .addCase(generateInvoicePDF.rejected, (state, action) => {
        state.loading.pdf = false;
        state.error.pdf = action.payload;
      });
  },
});

export const { clearCurrentItems, clearPDFs } = architectSlice.actions;
export default architectSlice.reducer;
