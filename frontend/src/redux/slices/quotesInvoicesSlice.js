import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// API Call Functions
export const fetchQuotes = createAsyncThunk(
  "quotes/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get("/api/quotes");
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to fetch quotes");
    }
  }
);

export const fetchInvoices = createAsyncThunk(
  "invoices/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get("/api/invoices");
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Failed to fetch invoices"
      );
    }
  }
);

export const createQuote = createAsyncThunk(
  "quotes/create",
  async (quoteData, { rejectWithValue }) => {
    try {
      const response = await axios.post("/api/quotes", quoteData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to create quote");
    }
  }
);

export const createInvoice = createAsyncThunk(
  "invoices/create",
  async (invoiceData, { rejectWithValue }) => {
    try {
      const response = await axios.post("/api/invoices", invoiceData);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Failed to create invoice"
      );
    }
  }
);

export const updateQuote = createAsyncThunk(
  "quotes/update",
  async ({ id, quoteData }, { rejectWithValue }) => {
    try {
      const response = await axios.patch(`/api/quotes/${id}`, quoteData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to update quote");
    }
  }
);

export const updateInvoice = createAsyncThunk(
  "invoices/update",
  async ({ id, invoiceData }, { rejectWithValue }) => {
    try {
      const response = await axios.patch(`/api/invoices/${id}`, invoiceData);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Failed to update invoice"
      );
    }
  }
);

export const deleteQuote = createAsyncThunk(
  "quotes/delete",
  async (id, { rejectWithValue }) => {
    try {
      const response = await axios.delete(`/api/quotes/${id}`);
      return { id, ...response.data };
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to delete quote");
    }
  }
);

export const deleteInvoice = createAsyncThunk(
  "invoices/delete",
  async (id, { rejectWithValue }) => {
    try {
      const response = await axios.delete(`/api/invoices/${id}`);
      return { id, ...response.data };
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Failed to delete invoice"
      );
    }
  }
);

export const convertToInvoice = createAsyncThunk(
  "quotes/convert",
  async (id, { rejectWithValue }) => {
    try {
      const response = await axios.patch(`/api/quotes/${id}/convert`);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Failed to convert quote to invoice"
      );
    }
  }
);

export const recordPayment = createAsyncThunk(
  "invoices/recordPayment",
  async ({ id, paymentData }, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `/api/invoices/${id}/payment`,
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

export const generatePDF = createAsyncThunk(
  "documents/generatePDF",
  async ({ type, id }, { rejectWithValue }) => {
    try {
      const response = await axios.get(`/api/${type}s/${id}/pdf`, {
        responseType: "blob",
      });

      // Create a download link
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `${type}_${id}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();

      return { success: true, type, id };
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to generate PDF");
    }
  }
);

// Initial State
const initialState = {
  quotes: {
    items: [],
    loading: false,
    error: null,
    currentQuote: null,
  },
  invoices: {
    items: [],
    loading: false,
    error: null,
    currentInvoice: null,
  },
  pdfGenerating: false,
  pdfError: null,
};

// Create the slice
const quotesInvoicesSlice = createSlice({
  name: "quotesInvoices",
  initialState,
  reducers: {
    setCurrentQuote: (state, action) => {
      state.quotes.currentQuote = action.payload;
    },
    setCurrentInvoice: (state, action) => {
      state.invoices.currentInvoice = action.payload;
    },
    clearErrors: (state) => {
      state.quotes.error = null;
      state.invoices.error = null;
      state.pdfError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Quotes
      .addCase(fetchQuotes.pending, (state) => {
        state.quotes.loading = true;
      })
      .addCase(fetchQuotes.fulfilled, (state, action) => {
        state.quotes.loading = false;
        state.quotes.items = action.payload.data;
      })
      .addCase(fetchQuotes.rejected, (state, action) => {
        state.quotes.loading = false;
        state.quotes.error = action.payload || "Failed to fetch quotes";
      })

      // Fetch Invoices
      .addCase(fetchInvoices.pending, (state) => {
        state.invoices.loading = true;
      })
      .addCase(fetchInvoices.fulfilled, (state, action) => {
        state.invoices.loading = false;
        state.invoices.items = action.payload.data;
      })
      .addCase(fetchInvoices.rejected, (state, action) => {
        state.invoices.loading = false;
        state.invoices.error = action.payload || "Failed to fetch invoices";
      })

      // Create Quote
      .addCase(createQuote.pending, (state) => {
        state.quotes.loading = true;
      })
      .addCase(createQuote.fulfilled, (state, action) => {
        state.quotes.loading = false;
        state.quotes.items.push(action.payload.data);
        state.quotes.currentQuote = action.payload.data;
      })
      .addCase(createQuote.rejected, (state, action) => {
        state.quotes.loading = false;
        state.quotes.error = action.payload || "Failed to create quote";
      })

      // Create Invoice
      .addCase(createInvoice.pending, (state) => {
        state.invoices.loading = true;
      })
      .addCase(createInvoice.fulfilled, (state, action) => {
        state.invoices.loading = false;
        state.invoices.items.push(action.payload.data);
        state.invoices.currentInvoice = action.payload.data;
      })
      .addCase(createInvoice.rejected, (state, action) => {
        state.invoices.loading = false;
        state.invoices.error = action.payload || "Failed to create invoice";
      })

      // Update Quote
      .addCase(updateQuote.pending, (state) => {
        state.quotes.loading = true;
      })
      .addCase(updateQuote.fulfilled, (state, action) => {
        state.quotes.loading = false;
        const index = state.quotes.items.findIndex(
          (quote) => quote._id === action.payload.data._id
        );
        if (index !== -1) {
          state.quotes.items[index] = action.payload.data;
        }
        state.quotes.currentQuote = action.payload.data;
      })
      .addCase(updateQuote.rejected, (state, action) => {
        state.quotes.loading = false;
        state.quotes.error = action.payload || "Failed to update quote";
      })

      // Update Invoice
      .addCase(updateInvoice.pending, (state) => {
        state.invoices.loading = true;
      })
      .addCase(updateInvoice.fulfilled, (state, action) => {
        state.invoices.loading = false;
        const index = state.invoices.items.findIndex(
          (invoice) => invoice._id === action.payload.data._id
        );
        if (index !== -1) {
          state.invoices.items[index] = action.payload.data;
        }
        state.invoices.currentInvoice = action.payload.data;
      })
      .addCase(updateInvoice.rejected, (state, action) => {
        state.invoices.loading = false;
        state.invoices.error = action.payload || "Failed to update invoice";
      })

      // Delete Quote
      .addCase(deleteQuote.pending, (state) => {
        state.quotes.loading = true;
      })
      .addCase(deleteQuote.fulfilled, (state, action) => {
        state.quotes.loading = false;
        state.quotes.items = state.quotes.items.filter(
          (quote) => quote._id !== action.payload.id
        );
        if (state.quotes.currentQuote?._id === action.payload.id) {
          state.quotes.currentQuote = null;
        }
      })
      .addCase(deleteQuote.rejected, (state, action) => {
        state.quotes.loading = false;
        state.quotes.error = action.payload || "Failed to delete quote";
      })

      // Delete Invoice
      .addCase(deleteInvoice.pending, (state) => {
        state.invoices.loading = true;
      })
      .addCase(deleteInvoice.fulfilled, (state, action) => {
        state.invoices.loading = false;
        state.invoices.items = state.invoices.items.filter(
          (invoice) => invoice._id !== action.payload.id
        );
        if (state.invoices.currentInvoice?._id === action.payload.id) {
          state.invoices.currentInvoice = null;
        }
      })
      .addCase(deleteInvoice.rejected, (state, action) => {
        state.invoices.loading = false;
        state.invoices.error = action.payload || "Failed to delete invoice";
      })

      // Convert Quote to Invoice
      .addCase(convertToInvoice.pending, (state) => {
        state.quotes.loading = true;
        state.invoices.loading = true;
      })
      .addCase(convertToInvoice.fulfilled, (state, action) => {
        state.quotes.loading = false;
        state.invoices.loading = false;
        // Remove from quotes
        state.quotes.items = state.quotes.items.filter(
          (quote) => quote._id !== action.payload.data._id
        );
        // Add to invoices
        state.invoices.items.push(action.payload.data);
        // Update current items
        if (state.quotes.currentQuote?._id === action.payload.data._id) {
          state.quotes.currentQuote = null;
        }
        state.invoices.currentInvoice = action.payload.data;
      })
      .addCase(convertToInvoice.rejected, (state, action) => {
        state.quotes.loading = false;
        state.invoices.loading = false;
        state.quotes.error =
          action.payload || "Failed to convert quote to invoice";
      })

      // Record Payment
      .addCase(recordPayment.pending, (state) => {
        state.invoices.loading = true;
      })
      .addCase(recordPayment.fulfilled, (state, action) => {
        state.invoices.loading = false;
        const index = state.invoices.items.findIndex(
          (invoice) => invoice._id === action.payload.data._id
        );
        if (index !== -1) {
          state.invoices.items[index] = action.payload.data;
        }
        state.invoices.currentInvoice = action.payload.data;
      })
      .addCase(recordPayment.rejected, (state, action) => {
        state.invoices.loading = false;
        state.invoices.error = action.payload || "Failed to record payment";
      })

      // Generate PDF
      .addCase(generatePDF.pending, (state) => {
        state.pdfGenerating = true;
      })
      .addCase(generatePDF.fulfilled, (state) => {
        state.pdfGenerating = false;
      })
      .addCase(generatePDF.rejected, (state, action) => {
        state.pdfGenerating = false;
        state.pdfError = action.payload || "Failed to generate PDF";
      });
  },
});

export const { setCurrentQuote, setCurrentInvoice, clearErrors } =
  quotesInvoicesSlice.actions;

export default quotesInvoicesSlice.reducer;
