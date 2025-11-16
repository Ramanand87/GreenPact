"use client";
import { createSlice } from '@reduxjs/toolkit';

// Initial state definition
const initialState = {
  userInfo: typeof window !== 'undefined' && localStorage.getItem('userInfo')
    ? JSON.parse(localStorage.getItem('userInfo'))
    : null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      state.userInfo = action.payload;
      if (typeof window !== 'undefined') {
        localStorage.setItem('userInfo', JSON.stringify(action.payload));

        // Setting expiration time for 30 days
        const expirationTime = new Date().getTime() + 30 * 24 * 60 * 60 * 1000;
        localStorage.setItem('expirationTime', expirationTime.toString());
      }
    },
    logout: (state) => {
      state.userInfo = null;
      if (typeof window !== 'undefined') {
        localStorage.clear();
      }
    },
  },
});

export const { setCredentials, logout } = authSlice.actions;
export default authSlice.reducer;
