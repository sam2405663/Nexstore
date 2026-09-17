import { useEffect } from "react";
import { useOrderStore } from "../store/useOrderStore";
import { useAuthStore } from "../store/useAuthStore";
import { PackageIcon, ClockIcon, CheckCircle2Icon, TruckIcon } from "lucide-react";
import { Link } from "react-router-dom";

function OrdersPage() {
  const { myOrders, fetchMyOrders, loading } = useOrderStore();
  const { user } = useAuthStore();

  useEffect(() => {
    if (user) {
      fetchMyOrders();
    }
  }, [user, fetchMyOrders]);

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <PackageIcon className="size-16 mx-auto text-base-content/30 mb-4" />
        <h2 className="text-2xl font-bold mb-2">Sign in to view your orders</h2>
        <p className="text-base-content/60 mb-6">Track purchases and order statuses in real-time.</p>
      </div>
    );
  }

  const getStatusBadge = (status) => {
    switch (status) {
      case "delivered":
        return <span className="badge badge-success gap-1"><CheckCircle2Icon className="size-3" /> Delivered</span>;
      case "shipped":
        return <span className="badge badge-info gap-1"><TruckIcon className="size-3" /> Shipped</span>;
      default:
        return <span className="badge badge-warning gap-1"><ClockIcon className="size-3" /> Pending</span>;
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <div className="flex items-center gap-3 mb-8">
        <PackageIcon className="size-8 text-primary" />
        <div>
          <h1 className="text-3xl font-bold">My Orders</h1>
          <p className="text-sm text-base-content/60">View your purchase history and tracking</p>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-16">
          <span className="loading loading-spinner loading-lg text-primary" />
        </div>
      ) : myOrders.length === 0 ? (
        <div className="card bg-base-100 shadow-xl p-8 text-center">
          <PackageIcon className="size-16 mx-auto opacity-30 mb-4" />
          <h3 className="text-xl font-bold mb-2">No orders yet</h3>
          <p className="text-base-content/60 mb-6">Browse our catalog and place your first order!</p>
          <div>
            <Link to="/" className="btn btn-primary">Start Shopping</Link>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {myOrders.map((order) => (
            <div key={order.id || order._id} className="card bg-base-100 shadow-lg border border-base-200">
              <div className="card-body p-6">
                <div className="flex flex-wrap justify-between items-center gap-4 pb-4 border-b border-base-200">
                  <div>
                    <span className="text-xs text-base-content/60 block">Order ID</span>
                    <span className="font-mono text-xs font-bold">#{order.id || order._id}</span>
                  </div>
                  <div>
                    <span className="text-xs text-base-content/60 block">Date Placed</span>
                    <span className="text-sm font-medium">{new Date(order.createdAt).toLocaleDateString()}</span>
                  </div>
                  <div>
                    <span className="text-xs text-base-content/60 block">Total</span>
                    <span className="text-lg font-bold text-primary">${Number(order.totalPrice).toFixed(2)}</span>
                  </div>
                  <div>{getStatusBadge(order.status)}</div>
                </div>

                <div className="divide-y divide-base-200 mt-4">
                  {order.orderItems.map((item, idx) => (
                    <div key={idx} className="py-3 flex items-center gap-4">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="size-14 object-cover rounded-lg bg-base-200"
                      />
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-sm truncate">{item.name}</h4>
                        <p className="text-xs text-base-content/60">
                          Qty: {item.quantity} × ${Number(item.price).toFixed(2)}
                        </p>
                      </div>
                      <span className="font-bold text-sm">
                        ${(item.quantity * item.price).toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default OrdersPage;
