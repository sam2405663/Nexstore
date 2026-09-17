import { create } from "zustand";
import axios from "axios";
import toast from "react-hot-toast";

const BASE_URL = import.meta.env.MODE === "development" ? "http://localhost:3000" : "";

const storedUser = JSON.parse(localStorage.getItem("nexstore_user") || "null");
const storedToken = localStorage.getItem("nexstore_token") || null;

if (storedToken) {
  axios.defaults.headers.common["Authorization"] = `Bearer ${storedToken}`;
}

export const useAuthStore = create((set, get) => ({
  user: storedUser,
  token: storedToken,
  loading: false,
  isAuthModalOpen: false,
  authMode: "login", // "login" | "register"

  openAuthModal: (mode = "login") => set({ isAuthModalOpen: true, authMode: mode }),
  closeAuthModal: () => set({ isAuthModalOpen: false }),

  setAuthMode: (mode) => set({ authMode: mode }),

  login: async (email, password) => {
    set({ loading: true });
    try {
      const response = await axios.post(`${BASE_URL}/api/auth/login`, { email, password });
      const { data } = response.data;

      localStorage.setItem("nexstore_token", data.token);
      localStorage.setItem("nexstore_user", JSON.stringify(data));
      axios.defaults.headers.common["Authorization"] = `Bearer ${data.token}`;

      set({ user: data, token: data.token, isAuthModalOpen: false });
      toast.success(`Welcome back, ${data.name}!`);
      return true;
    } catch (error) {
      console.error("Login error:", error);
      const msg = error.response?.data?.message || "Invalid credentials";
      toast.error(msg);
      return false;
    } finally {
      set({ loading: false });
    }
  },

  register: async (name, email, password, role, shopName, shopImage) => {
    set({ loading: true });
    try {
      const response = await axios.post(`${BASE_URL}/api/auth/register`, {
        name,
        email,
        password,
        role,
        shopName,
        shopImage,
      });
      const { data } = response.data;

      localStorage.setItem("nexstore_token", data.token);
      localStorage.setItem("nexstore_user", JSON.stringify(data));
      axios.defaults.headers.common["Authorization"] = `Bearer ${data.token}`;

      set({ user: data, token: data.token, isAuthModalOpen: false });
      toast.success(`Account created successfully! Logged in as ${data.role}`);
      return true;
    } catch (error) {
      console.error("Register error:", error);
      const msg = error.response?.data?.message || "Registration failed";
      toast.error(msg);
      return false;
    } finally {
      set({ loading: false });
    }
  },

  logout: () => {
    localStorage.removeItem("nexstore_token");
    localStorage.removeItem("nexstore_user");
    delete axios.defaults.headers.common["Authorization"];
    set({ user: null, token: null });
    toast.success("Logged out successfully");
  },
}));
