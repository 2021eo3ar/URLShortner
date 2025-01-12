import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const backendUrl = "http://localhost:5000";

// Axios instance setup
const axiosInstance = axios.create({
  baseURL: backendUrl,
  withCredentials: true, // Ensures cookies are sent with the request
});

// Function to attach the token dynamically
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem('token'); // Retrieve token from localStorage
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  return config;
});

// Thunk for creating a shortened URL
export const createShortURL = createAsyncThunk(
  'url/createShortURL',
  async (payload, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(`/api/short/shortURL`, payload);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response ? error.response.data : error.message
      );
    }
  }
);

// Thunk for fetching analytics or original URL by alias
export const fetchURLDetails = createAsyncThunk(
  'url/fetchURLDetails',
  async (alias, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/api/short/${alias}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response ? error.response.data : error.message
      );
    }
  }
);

// Thunk for fetching all URLs for the user
export const fetchUserUrls = createAsyncThunk(
  'url/fetchUserUrls',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/api/short/getUserUrls`);
      return response.data.urls; // Extract the list of URLs from the response
    } catch (error) {
      return rejectWithValue(
        error.response ? error.response.data : error.message
      );
    }
  }
);

// Thunk for deleting a URL by ID
export const deleteUserUrl = createAsyncThunk(
  'url/deleteUserUrl',
  async (id, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.delete(`/api/short/${id}`);
      return { id, message: response.data.message }; // Return the deleted URL ID and success message
    } catch (error) {
      return rejectWithValue(
        error.response ? error.response.data : error.message
      );
    }
  }
);

// URL Slice
const urlSlice = createSlice({
  name: 'url',
  initialState: {
    shortURL: null,
    longURL: null,
    analytics: null,
    userUrls: [],
    loading: false,
    error: null,
  },
  reducers: {
    resetURLState: (state) => {
      state.shortURL = null;
      state.longURL = null;
      state.analytics = null;
      state.userUrls = [];
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Create Short URL
      .addCase(createShortURL.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createShortURL.fulfilled, (state, action) => {
        state.loading = false;
        state.shortURL = action.payload;
      })
      .addCase(createShortURL.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch URL Details
      .addCase(fetchURLDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchURLDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.longURL = action.payload.longURL;
        state.analytics = action.payload.analytics;
      })
      .addCase(fetchURLDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch User URLs
      .addCase(fetchUserUrls.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserUrls.fulfilled, (state, action) => {
        state.loading = false;
        state.userUrls = action.payload;
      })
      .addCase(fetchUserUrls.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Delete User URL
      .addCase(deleteUserUrl.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteUserUrl.fulfilled, (state, action) => {
        state.loading = false;
        state.userUrls = state.userUrls.filter((url) => url._id !== action.payload.id); // Remove the deleted URL from state
      })
      .addCase(deleteUserUrl.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { resetURLState } = urlSlice.actions;
export default urlSlice.reducer;
