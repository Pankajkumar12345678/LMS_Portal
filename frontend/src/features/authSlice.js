
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null,
  isAuthenticated: false,
}; 

// // Try to load the user data from localStorage (if it exists)
// const savedUser = localStorage.getItem("user");
// const initialState = {
//   user: savedUser ? JSON.parse(savedUser) : null, // If saved user exists, load it
//   isAuthenticated: savedUser ? true : false, // Set authentication status based on saved user
// };

const authSlice = createSlice({
  name: "authSlice",
  initialState,
  reducers: {
    userLoggedIn: (state, action) => {
        state.user = action.payload.user;
        state.isAuthenticated = true;
    },

    userLoggedOut:(state) => {
        state.user = null;
        state.isAuthenticated = false;
    }
  },
});

export const {userLoggedIn, userLoggedOut} = authSlice.actions;
export default authSlice.reducer;
