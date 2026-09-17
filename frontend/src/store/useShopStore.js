import { create } from "zustand";
import axios from "axios";

const BASE_URL = import.meta.env.MODE === "development" ? "http://localhost:3000" : "";

export const useShopStore = create((set) => ({
  shops: [],
  currentShop: null,
  shopProducts: [],
  loading: false,
  error: null,

  fetchShops: async () => {
    set({ loading: true });
    try {
      const response = await axios.get(`${BASE_URL}/api/shops`);
      set({ shops: response.data.data, error: null });
    } catch (err) {
      console.error("Fetch Shops Error:", err);
      set({ error: "Failed to load shops", shops: [] });
    } finally {
      set({ loading: false });
    }
  },

  fetchShopById: async (id) => {
    set({ loading: true });
    try {
      const response = await axios.get(`${BASE_URL}/api/shops/${id}`);
      set({
        currentShop: response.data.data.shop,
        shopProducts: response.data.data.products,
        error: null,
      });
    } catch (err) {
      console.error("Fetch Shop By ID Error:", err);
      set({ error: "Failed to load shop details", currentShop: null, shopProducts: [] });
    } finally {
      set({ loading: false });
    }
  },
}));
