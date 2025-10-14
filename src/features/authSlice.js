import { createSlice } from "@reduxjs/toolkit";

/**
 * Mock authentication:
 * - Registered users stored in localStorage.registeredUsers (array of {email,password,role})
 * - On register -> push into registeredUsers
 * - On login -> check registeredUsers, if match generate mock token and store token=user.email:timestamp
 * - user object stored in localStorage.user
 */

const initialUser = JSON.parse(localStorage.getItem("user")) || null;
const initialToken = localStorage.getItem("token") || null;

const initialState = {
  user: initialUser,
  token: initialToken,
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    register: (state, action) => {
      // action.payload = { email, password, role }
      const users = JSON.parse(localStorage.getItem("registeredUsers")) || [];
      const exists = users.find((u) => u.email === action.payload.email);
      if (exists) {
        state.error = "User already exists";
        return;
      }
      users.push({
        email: action.payload.email,
        password: action.payload.password,
        role: action.payload.role || "User",
      });
      localStorage.setItem("registeredUsers", JSON.stringify(users));
      state.error = null;
    },
    login: (state, action) => {
      // action.payload = { email, password }
      const users = JSON.parse(localStorage.getItem("registeredUsers")) || [];
      const found = users.find(
        (u) => u.email === action.payload.email && u.password === action.payload.password
      );
      if (!found) {
        state.error = "Invalid credentials";
        return;
      }
      const token = `mock-jwt-${found.email}-${Date.now()}`;
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify({ email: found.email, role: found.role }));
      state.user = { email: found.email, role: found.role };
      state.token = token;
      state.error = null;
    },
    logout: (state) => {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      state.user = null;
      state.token = null;
      state.error = null;
    },
    clearError: (state) => {
      state.error = null;
    }
  },
});

export const { register, login, logout, clearError } = authSlice.actions;
export default authSlice.reducer;
