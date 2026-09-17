import { create } from "zustand";
import axios from "axios";
import toast from "react-hot-toast";
import { useCartStore } from "./useCartStore";

const BASE_URL = import.meta.env.MODE === "development" ? "http://localhost:3000" : "";

export const useOrderStore = create((set, get) => ({
  myOrders: [],
  sellerOrders: [],
  adminStats: null,
  allUsers: [],
  loading: false,

  checkout: async () => {
    set({ loading: true });
    try {
      const { cart, getTotalPrice, clearCart, closeCart } = useCartStore.getState();

      if (cart.length === 0) {
        toast.error("Your cart is empty");
        return false;
      }

      const orderData = {
        orderItems: cart,
        totalPrice: Number(getTotalPrice()),
      };

      const response = await axios.post(`${BASE_URL}/api/orders`, orderData);

      if (response.data.success) {
        clearCart();
        closeCart();
        toast.success("Order placed successfully!");
        await get().fetchMyOrders();
        return true;
      }
    } catch (error) {
      console.error("Checkout Error:", error);
      toast.error(error.response?.data?.message || "Failed to place order");
      return false;
    } finally {
      set({ loading: false });
    }
  },

  fetchMyOrders: async () => {
    set({ loading: true });
    try {
      const response = await axios.get(`${BASE_URL}/api/orders/myorders`);
      set({ myOrders: response.data.data });
    } catch (error) {
      console.error("Fetch My Orders Error:", error);
    } finally {
      set({ loading: false });
    }
  },

  fetchSellerOrders: async () => {
    set({ loading: true });
    try {
      const response = await axios.get(`${BASE_URL}/api/orders/seller`);
      set({ sellerOrders: response.data.data });
    } catch (error) {
      console.error("Fetch Seller Orders Error:", error);
    } finally {
      set({ loading: false });
    }
  },

  updateOrderStatus: async (orderId, status) => {
    try {
      const response = await axios.put(`${BASE_URL}/api/orders/${orderId}/status`, { status });
      if (response.data.success) {
        toast.success("Order status updated!");
        await get().fetchSellerOrders();
      }
    } catch (error) {
      console.error("Update Order Status Error:", error);
      toast.error("Failed to update status");
    }
  },

  fetchAdminStats: async () => {
    set({ loading: true });
    try {
      const response = await axios.get(`${BASE_URL}/api/admin/stats`);
      set({ adminStats: response.data.data });
    } catch (error) {
      console.error("Fetch Admin Stats Error:", error);
    } finally {
      set({ loading: false });
    }
  },

  fetchAllUsers: async () => {
    set({ loading: true });
    try {
      const response = await axios.get(`${BASE_URL}/api/admin/users`);
      set({ allUsers: response.data.data });
    } catch (error) {
      console.error("Fetch All Users Error:", error);
    } finally {
      set({ loading: false });
    }
  },

  approveUser: async (userId, isApproved) => {
    try {
      const response = await axios.put(`${BASE_URL}/api/admin/users/${userId}/approve`, {
        isApproved,
      });
      if (response.data.success) {
        toast.success(response.data.message || "Approval status updated");
        await get().fetchAllUsers();
        await get().fetchAdminStats();
      }
    } catch (error) {
      console.error("Approve User Error:", error);
      toast.error(error.response?.data?.message || "Failed to update approval status");
    }
  },

  updateUserRole: async (userId, role) => {
    try {
      const response = await axios.put(`${BASE_URL}/api/admin/users/${userId}/role`, { role });
      if (response.data.success) {
        toast.success(`User role updated to ${role}`);
        await get().fetchAllUsers();
        await get().fetchAdminStats();
      }
    } catch (error) {
      console.error("Update User Role Error:", error);
      toast.error(error.response?.data?.message || "Failed to update user role");
    }
  },

  deleteUser: async (userId) => {
    try {
      const response = await axios.delete(`${BASE_URL}/api/admin/users/${userId}`);
      if (response.data.success) {
        toast.success("User account deleted");
        await get().fetchAllUsers();
        await get().fetchAdminStats();
      }
    } catch (error) {
      console.error("Delete User Error:", error);
      toast.error(error.response?.data?.message || "Failed to delete user");
    }
  },
}));
