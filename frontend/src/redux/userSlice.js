// src/features/userSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Async thunk for login
export const userProfile = createAsyncThunk(
  "user/profile",
  async (token, { rejectWithValue }) => {
    try {
      const backendUrl = import.meta.env.VITE_BACKEND_URL;
      const response = await axios.get(`${backendUrl}/user/profile`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data); // error response
    }
  }
);

const userSlice = createSlice({
  name: "user",
  initialState: {
    user: null,
    loading: false,
    token: localStorage.getItem("token") || null,
    error: null,
  },
  reducers: {
    loginSuccess: (state, action) => {
      state.token = action.payload;
      localStorage.setItem("token", action.payload);
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      localStorage.removeItem("token");
    },
  },
  extraReducers: (builder) => {
    builder
      // Pending
      .addCase(userProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      // Success
      .addCase(userProfile.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload.success) {
          state.user = action.payload.user;
        }
      })
      // Error
      .addCase(userProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.errors;
      });
  },
});

export const { logout,loginSuccess } = userSlice.actions;
export default userSlice.reducer;
