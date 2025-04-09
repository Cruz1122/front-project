import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  currentUser: null,
  loading: false,
  isAuthenticated: false,
  token: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setUser: (state, action) => {
      state.isAuthenticated = action.payload.isAuthenticated;
      state.email = action.payload.email;
      state.loading = false;

      // Guardar en localStorage
      localStorage.setItem(
        "isAuthenticated",
        JSON.stringify(action.payload.isAuthenticated)
      );
      localStorage.setItem("email", action.payload.email); // Guardar el correo en localStorage
    },
    setToken: (state, action) => {
      state.token = action.payload.token;

      // Guardar el token en localStorage
      localStorage.setItem("token", action.payload.token);
    },
    logoutUser: (state) => {
      state.currentUser = null;
      state.isAuthenticated = false;
      state.token = null;
      state.loading = false;
      localStorage.removeItem("token");
      localStorage.removeItem("isAuthenticated");
      localStorage.removeItem("email");
    },
  },
});

export const { setLoading, setUser, setToken, logoutUser } = authSlice.actions;
export default authSlice.reducer;
