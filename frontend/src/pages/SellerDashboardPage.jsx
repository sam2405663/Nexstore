import { useEffect, useState } from "react";
import { useOrderStore } from "../store/useOrderStore";
import { useProductStore } from "../store/useProductStore";
import { useAuthStore } from "../store/useAuthStore";
import { StoreIcon, PackageIcon, DollarSignIcon, PlusSquareIcon, CheckCircleIcon, TruckIcon } from "lucide-react";

function SellerDashboardPage() {
  const { sellerOrders, fetchSellerOrders, updateOrderStatus, loading } = useOrderStore();
  const { products, fetchProducts } = useProductStore();
  const { user } = useAuthStore();
  const [activeTab, setActiveTab] = useState("inventory"); // "inventory" | "orders"

  useEffect(() => {
    if (user && user.role === "seller") {
      fetchProducts();
      fetchSellerOrders();
    }
  }, [user, fetchProducts, fetchSellerOrders]);

  // Strictly restrict Seller Dashboard to Sellers only (excluding Admin and Buyer)
  if (!user || user.role !== "seller") {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <StoreIcon className="size-16 mx-auto text-base-content/30 mb-4" />
        <h2 className="text-2xl font-bold mb-2">Seller Access Required</h2>
        <p className="text-base-content/60">This dashboard is reserved exclusively for registered Sellers.</p>
      </div>
    );
  }

  const sellerProducts = products.filter(
    (p) => p.seller === user.id || p.seller?._id === user.id
  );

  const totalSales = sellerOrders.reduce((sum, ord) => sum + (ord.totalPrice || 0), 0);

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      {/* HEADER */}
      <div className="flex flex-wrap justify-between items-center gap-4 mb-8">
        <div className="flex items-center gap-3">
          <StoreIcon className="size-8 text-secondary" />
          <div>
            <h1 className="text-3xl font-bold">Seller Dashboard</h1>
            <p className="text-sm text-base-content/60">Manage your store products and incoming orders</p>
          </div>
        </div>

        <button
          onClick={() => document.getElementById("add_product_modal")?.showModal()}
          className="btn btn-secondary gap-2"
        >
          <PlusSquareIcon className="size-5" /> Add New Product
        </button>
      </div>

      {/* STATS OVERVIEW */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="stat bg-base-100 shadow-lg rounded-2xl border border-base-200">
          <div className="stat-figure text-secondary">
            <PackageIcon className="size-8" />
          </div>
          <div className="stat-title font-medium">My Active Products</div>
          <div className="stat-value text-secondary">{sellerProducts.length}</div>
        </div>

        <div className="stat bg-base-100 shadow-lg rounded-2xl border border-base-200">
          <div className="stat-figure text-primary">
            <StoreIcon className="size-8" />
          </div>
          <div className="stat-title font-medium">Total Orders Received</div>
          <div className="stat-value text-primary">{sellerOrders.length}</div>
        </div>

        <div className="stat bg-base-100 shadow-lg rounded-2xl border border-base-200">
          <div className="stat-figure text-success">
            <DollarSignIcon className="size-8" />
          </div>
          <div className="stat-title font-medium">Total Store Earnings</div>
          <div className="stat-value text-success">${totalSales.toFixed(2)}</div>
        </div>
      </div>

      {/* NAVIGATION TABS */}
      <div className="tabs tabs-boxed mb-6 bg-base-200/60 p-1 max-w-xs">
        <button
          className={`tab ${activeTab === "inventory" ? "tab-active" : ""}`}
          onClick={() => setActiveTab("inventory")}
        >
          My Inventory ({sellerProducts.length})
        </button>
        <button
          className={`tab ${activeTab === "orders" ? "tab-active" : ""}`}
          onClick={() => setActiveTab("orders")}
        >
          Incoming Orders ({sellerOrders.length})
        </button>
      </div>

      {/* TAB CONTENT: INVENTORY */}
      {activeTab === "inventory" && (
        <div className="card bg-base-100 shadow-xl border border-base-200">
          <div className="card-body p-0 overflow-x-auto">
            <table className="table table-zebra w-full">
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Category</th>
                  <th>Price</th>
                  <th>Stock</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {sellerProducts.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="text-center py-8 text-base-content/60">
                      No products found. Add your first product to start selling!
                    </td>
                  </tr>
                ) : (
                  sellerProducts.map((p) => (
                    <tr key={p.id}>
                      <td className="flex items-center gap-3">
                        <img src={p.image} alt={p.name} className="size-12 object-cover rounded-lg" />
                        <span className="font-bold">{p.name}</span>
                      </td>
                      <td>
                        <span className="badge badge-sm badge-outline">{p.category || "General"}</span>
                      </td>
                      <td className="font-bold text-primary">${Number(p.price).toFixed(2)}</td>
                      <td>{p.stock || 10} units</td>
                      <td>
                        <button
                          onClick={() => window.location.href = `/product/${p.id}`}
                          className="btn btn-xs btn-outline btn-info"
                        >
                          Edit
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB CONTENT: ORDERS */}
      {activeTab === "orders" && (
        <div className="card bg-base-100 shadow-xl border border-base-200">
          <div className="card-body p-0 overflow-x-auto">
            <table className="table table-zebra w-full">
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Buyer</th>
                  <th>Total</th>
                  <th>Current Status</th>
                  <th>Update Status</th>
                </tr>
              </thead>
              <tbody>
                {sellerOrders.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="text-center py-8 text-base-content/60">
                      No orders received yet.
                    </td>
                  </tr>
                ) : (
                  sellerOrders.map((ord) => (
                    <tr key={ord.id || ord._id}>
                      <td className="font-mono text-xs">#{ord.id || ord._id}</td>
                      <td>{ord.buyer?.name || "Customer"}</td>
                      <td className="font-bold text-primary">${Number(ord.totalPrice).toFixed(2)}</td>
                      <td>
                        <span
                          className={`badge ${
                            ord.status === "delivered"
                              ? "badge-success"
                              : ord.status === "shipped"
                              ? "badge-info"
                              : "badge-warning"
                          }`}
                        >
                          {ord.status}
                        </span>
                      </td>
                      <td className="flex gap-2">
                        <button
                          onClick={() => updateOrderStatus(ord.id || ord._id, "shipped")}
                          className="btn btn-xs btn-info gap-1"
                        >
                          <TruckIcon className="size-3" /> Ship
                        </button>
                        <button
                          onClick={() => updateOrderStatus(ord.id || ord._id, "delivered")}
                          className="btn btn-xs btn-success gap-1"
                        >
                          <CheckCircleIcon className="size-3" /> Deliver
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

export default SellerDashboardPage;
