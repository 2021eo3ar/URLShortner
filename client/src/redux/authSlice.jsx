import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const backendUrl = "http://localhost:5000";

const initialState = {
  user: null,
  token: null,
  loading: true, 
  error: null,
};

// Async thunk for checking if the user is logged in
export const checkLoginStatus = createAsyncThunk(
  'auth/checkLoginStatus',
  async (_, thunkAPI) => {
    try {
      const response = await axios.get(`${backendUrl}/auth/validate-session`, {
        withCredentials: true,
      });
      const { user, accessToken } = response.data;

      // Save new access token to localStorage
      localStorage.setItem('jwtToken', accessToken);
      return { user, token: accessToken };
    } catch (error) {
      // Clear storage on failure
      localStorage.removeItem('jwtToken');
      localStorage.removeItem('userData');
      thunkAPI.dispatch(logout()); // Dispatch logout action
      return thunkAPI.rejectWithValue({
        message: error.response?.data?.error || 'Session expired. Please log in again.',
      });
    }
  }
);

// Async thunk for Google login
export const googleLogin = createAsyncThunk(
  'auth/googleLogin',
  async (_, thunkAPI) => {
    try {
      window.location.href = `${backendUrl}/auth/google`;
      return null; // Redirection occurs outside the Redux flow
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.message ||
        'Something went wrong during Google login';
      return thunkAPI.rejectWithValue({ message });
    }
  }
);

// Async thunk for handling the callback and saving the token
export const handleGoogleCallback = createAsyncThunk(
  'auth/handleGoogleCallback',
  async (token, thunkAPI) => {
    try {
      localStorage.setItem('jwtToken', token);
      const user = JSON.parse(atob(token.split('.')[1])); // Decode JWT payload to get user info
      localStorage.setItem('userData', JSON.stringify(user));
      return { user, token };
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.message ||
        'Failed to process Google callback';
      return thunkAPI.rejectWithValue({ message });
    }
  }
);

// Async thunk for logout
export const logout = createAsyncThunk(
  'auth/logout',
  async (_, thunkAPI) => {
    try {
      await axios.get(`${backendUrl}/auth/logout`, {
        withCredentials: true,
      });
      localStorage.removeItem('jwtToken');
      localStorage.removeItem('userData');
      return null;
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.message ||
        'Something went wrong during logout';
      return thunkAPI.rejectWithValue({ message });
    }
  }
);

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
      .addCase(checkLoginStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(checkLoginStatus.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
      })
      .addCase(checkLoginStatus.rejected, (state) => {
        state.loading = false;
        state.user = null;
        state.token = null;
      });
  },
});

export const { setUser, clearAuthState } = authSlice.actions;
export default authSlice.reducer;