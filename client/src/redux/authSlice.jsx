import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const backendUrl = "http://localhost:5000";

const initialState = {
  user: null,
  token: null,
  loading: false,
  error: null,
};

// Async thunk for checking if the user is logged in
export const checkLoginStatus = createAsyncThunk(
  'auth/checkLoginStatus',
  async (_, thunkAPI) => {
    try {
      const response = await axios.get(`${backendUrl}/auth/validate-session`, {
        withCredentials: true, // Ensure cookies are sent with the request
      });
      const { user } = response.data;

      // Save user data to localStorage for persistence
      localStorage.setItem('userData', JSON.stringify(user));
      return { user };
    } catch (error) {
      localStorage.removeItem('userData'); // Clear localStorage on failure
      return thunkAPI.rejectWithValue({
        message:
          error.response?.data?.error ||
          error.message ||
          'Failed to validate session',
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
      .addCase(googleLogin.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(googleLogin.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(googleLogin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Google login failed';
      })
      .addCase(handleGoogleCallback.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(handleGoogleCallback.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
      })
      .addCase(handleGoogleCallback.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to handle Google callback';
      })
      .addCase(logout.fulfilled, (state) => {
        state.user = null;
        state.token = null;
      })
      .addCase(logout.rejected, (state, action) => {
        state.error = action.payload?.message || 'Logout failed';
      })
      .addCase(checkLoginStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(checkLoginStatus.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
      })
      .addCase(checkLoginStatus.rejected, (state, action) => {
        state.loading = false;
        state.user = null;
        state.error = action.payload?.message || 'Failed to validate session';
      });
  },
});

export const { setUser, clearAuthState } = authSlice.actions;
export default authSlice.reducer;
