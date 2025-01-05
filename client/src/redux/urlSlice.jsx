// src/redux/urlSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const backendUrl = "http://localhost:5000";

// Get the token from localStorage (if available)
const getAuthToken = () => {
  return localStorage.getItem('token'); // Make sure the token is saved under 'token'
};

// Axios instance with auth token
const axiosInstance = axios.create({
  baseURL: backendUrl,
  headers: {
    'Authorization': `Bearer ${getAuthToken()}`, // Adding token to the header
  },
});

// Thunk for creating a shortened URL
export const createShortURL = createAsyncThunk(
  'url/createShortURL',
  async (payload, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(`/api/short/shortURL`, payload);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response ? error.response.data : error.message);
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
      return rejectWithValue(error.response ? error.response.data : error.message);
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
    loading: false,
    error: null,
  },
  reducers: {
    resetURLState: (state) => {
      state.shortURL = null;
      state.longURL = null;
      state.analytics = null;
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
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
      });
  },
});

export const { resetURLState } = urlSlice.actions;
export default urlSlice.reducer;
