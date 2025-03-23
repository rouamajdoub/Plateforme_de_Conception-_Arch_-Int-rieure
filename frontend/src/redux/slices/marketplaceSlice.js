import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = "/api/marketplace";

// Fetch all products
export const fetchProducts = createAsyncThunk(
  "marketplace/fetchProducts",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axios.get(`${API_URL}/products`);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Fetch products by seller
export const fetchProductsBySeller = createAsyncThunk(
  "marketplace/fetchProductsBySeller",
  async (sellerId, { rejectWithValue }) => {
    try {
      const { data } = await axios.get(
        `${API_URL}/products/seller/${sellerId}`
      );
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Fetch single product
export const fetchProductById = createAsyncThunk(
  "marketplace/fetchProductById",
  async (productId, { rejectWithValue }) => {
    try {
      const { data } = await axios.get(`${API_URL}/products/${productId}`);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Fetch product reviews
export const fetchProductReviews = createAsyncThunk(
  "marketplace/fetchProductReviews",
  async (productId, { rejectWithValue }) => {
    try {
      const { data } = await axios.get(
        `${API_URL}/products/${productId}/reviews`
      );
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Fetch product statistics
export const fetchProductStats = createAsyncThunk(
  "marketplace/fetchProductStats",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axios.get(`${API_URL}/stats`);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Fetch categories
export const fetchCategories = createAsyncThunk(
  "marketplace/fetchCategories",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axios.get(`${API_URL}/categories`);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Fetch seller orders
export const fetchSellerOrders = createAsyncThunk(
  "marketplace/fetchSellerOrders",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axios.get(`${API_URL}/orders`);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Create a product
export const createProduct = createAsyncThunk(
  "marketplace/createProduct",
  async (productData, { rejectWithValue }) => {
    try {
      const { data } = await axios.post(`${API_URL}/products`, productData);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Update a product
export const updateProduct = createAsyncThunk(
  "marketplace/updateProduct",
  async ({ productId, updatedData }, { rejectWithValue }) => {
    try {
      const { data } = await axios.put(
        `${API_URL}/products/${productId}`,
        updatedData
      );
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Delete a product
export const deleteProduct = createAsyncThunk(
  "marketplace/deleteProduct",
  async (productId, { rejectWithValue }) => {
    try {
      await axios.delete(`${API_URL}/products/${productId}`);
      return productId;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

const marketplaceSlice = createSlice({
  name: "marketplace",
  initialState: {
    products: [],
    product: null,
    categories: [],
    orders: [],
    reviews: [],
    stats: {},
    loading: false,
    error: null,
  },
  reducers: {
    setSelectedProduct: (state, action) => {
      state.product = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchProductById.fulfilled, (state, action) => {
        state.product = action.payload;
      })
      .addCase(fetchProductReviews.fulfilled, (state, action) => {
        state.reviews = action.payload;
      })
      .addCase(fetchProductStats.fulfilled, (state, action) => {
        state.stats = action.payload;
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.categories = action.payload;
      })
      .addCase(fetchSellerOrders.fulfilled, (state, action) => {
        state.orders = action.payload;
      })
      .addCase(createProduct.fulfilled, (state, action) => {
        state.products.push(action.payload.product);
      })
      .addCase(updateProduct.fulfilled, (state, action) => {
        const index = state.products.findIndex(
          (p) => p._id === action.payload.product._id
        );
        if (index !== -1) {
          state.products[index] = action.payload.product;
        }
      })
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.products = state.products.filter((p) => p._id !== action.payload);
      });
  },
});

export const { setSelectedProduct } = marketplaceSlice.actions;
export default marketplaceSlice.reducer;
