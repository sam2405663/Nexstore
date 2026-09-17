import Navbar from "./components/Navbar";
import AuthModal from "./components/AuthModal";
import CartDrawer from "./components/CartDrawer";
import AddProductModal from "./components/AddProductModal";

import HomePage from "./pages/HomePage";
import ShopStorePage from "./pages/ShopStorePage";
import ProductPage from "./pages/ProductPage";
import OrdersPage from "./pages/OrdersPage";
import SellerDashboardPage from "./pages/SellerDashboardPage";
import AdminDashboardPage from "./pages/AdminDashboardPage";

import { Routes, Route } from "react-router-dom";
import { useThemeStore } from "./store/useThemeStore";

import { Toaster } from "react-hot-toast";

function App() {
  const { theme } = useThemeStore();

  return (
    <div className="min-h-screen bg-base-200 transition-colors duration-300" data-theme={theme}>
      <Navbar />

      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/shop/:sellerId" element={<ShopStorePage />} />
        <Route path="/product/:id" element={<ProductPage />} />
        <Route path="/orders" element={<OrdersPage />} />
        <Route path="/seller" element={<SellerDashboardPage />} />
        <Route path="/admin" element={<AdminDashboardPage />} />
      </Routes>

      <AuthModal />
      <CartDrawer />
      <AddProductModal />

      <Toaster />
    </div>
  );
}

export default App;