// src/redux/appSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const backendUrl = "http://localhost:5000";

const initialState = {
  user: null,
  token: null,
  loading: false,
  error: null,
};

// Async thunk for Google login
export const googleLogin = createAsyncThunk(`${backendUrl}/auth/googleLogin`, async (_, thunkAPI) => {
  try {
    // Perform the redirect action
    window.location.href = `${backendUrl}/auth/google`;
    // Since the actual redirection occurs outside the Redux flow, resolve the thunk with no further actions
    return null;
  } catch (error) {
    const message =
      error.response?.data?.message ||
      error.message ||
      'Something went wrong during Google login';
    return thunkAPI.rejectWithValue({ message });
  }
});

// Async thunk for logout
export const logout = createAsyncThunk(`${backendUrl}/auth/logout`, async (_, thunkAPI) => {
  try {
    await axios.get(`${backendUrl}/api/auth/logout`);
    return null;
  } catch (error) {
    const message =
      error.response?.data?.message ||
      error.message ||
      'Something went wrong during logout';
    return thunkAPI.rejectWithValue({ message });
  }
});

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser(state, action) {
      state.user = action.payload.user;
      state.token = action.payload.token;
    },
    clearAuthState(state) {
      state.user = null;
      state.token = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(googleLogin.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(googleLogin.fulfilled, (state) => {
        state.loading = false;
        // Since the user is redirected, we don't set any state here
      })
      .addCase(googleLogin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Google login failed';
      })
      .addCase(logout.fulfilled, (state) => {
        state.user = null;
        state.token = null;
      })
      .addCase(logout.rejected, (state, action) => {
        state.error = action.payload?.message || 'Logout failed';
      });
  },
});

export const { setUser, clearAuthState } = authSlice.actions;

export default authSlice.reducer;
