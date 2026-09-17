import { useEffect } from "react";
import { useOrderStore } from "../store/useOrderStore";
import { useAuthStore } from "../store/useAuthStore";
import { ShieldCheckIcon, UsersIcon, StoreIcon, PackageIcon, DollarSignIcon, UserCheckIcon, Trash2Icon, CheckCircle2Icon, XCircleIcon, ClockIcon } from "lucide-react";

function AdminDashboardPage() {
  const { adminStats, allUsers, fetchAdminStats, fetchAllUsers, updateUserRole, approveUser, deleteUser, loading } =
    useOrderStore();
  const { user } = useAuthStore();

  useEffect(() => {
    fetchAdminStats();
    fetchAllUsers();
  }, [fetchAdminStats, fetchAllUsers]);

  if (!user || user.role !== "admin") {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <ShieldCheckIcon className="size-16 mx-auto text-base-content/30 mb-4" />
        <h2 className="text-2xl font-bold mb-2">Admin Access Required</h2>
        <p className="text-base-content/60">You must log in with an Administrator account to view this page.</p>
      </div>
    );
  }

  const handleDeleteUser = async (targetUser) => {
    if (targetUser.id === user.id || targetUser._id === user.id) {
      alert("You cannot delete your own Admin account.");
      return;
    }

    if (window.confirm(`Are you sure you want to delete user "${targetUser.name}" (${targetUser.email})?`)) {
      await deleteUser(targetUser.id || targetUser._id);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl space-y-8">
      {/* HEADER */}
      <div className="flex items-center gap-3">
        <ShieldCheckIcon className="size-9 text-accent" />
        <div>
          <h1 className="text-3xl font-bold">Admin Platform Control</h1>
          <p className="text-sm text-base-content/60">System-wide metrics and user account approval management</p>
        </div>
      </div>

      {/* METRICS CARDS */}
      {adminStats && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="stat bg-base-100 shadow-xl rounded-2xl border border-base-200">
            <div className="stat-figure text-accent">
              <UsersIcon className="size-8" />
            </div>
            <div className="stat-title font-medium">Total Registered Users</div>
            <div className="stat-value text-accent">{adminStats.totalUsers}</div>
            <div className="stat-desc font-medium">
              {adminStats.totalSellers} Sellers | {adminStats.totalBuyers} Buyers
            </div>
          </div>

          <div className="stat bg-base-100 shadow-xl rounded-2xl border border-base-200">
            <div className="stat-figure text-warning">
              <ClockIcon className="size-8" />
            </div>
            <div className="stat-title font-medium">Pending Approvals</div>
            <div className="stat-value text-warning">{adminStats.pendingUsers || 0}</div>
            <div className="stat-desc font-medium">Awaiting Admin Authorization</div>
          </div>

          <div className="stat bg-base-100 shadow-xl rounded-2xl border border-base-200">
            <div className="stat-figure text-primary">
              <PackageIcon className="size-8" />
            </div>
            <div className="stat-title font-medium">Total Products</div>
            <div className="stat-value text-primary">{adminStats.totalProducts}</div>
          </div>

          <div className="stat bg-base-100 shadow-xl rounded-2xl border border-base-200">
            <div className="stat-figure text-success">
              <DollarSignIcon className="size-8" />
            </div>
            <div className="stat-title font-medium">Platform Revenue</div>
            <div className="stat-value text-success">${Number(adminStats.totalRevenue).toFixed(2)}</div>
          </div>
        </div>
      )}

      {/* USER MANAGEMENT & APPROVAL TABLE */}
      <div className="card bg-base-100 shadow-xl border border-base-200">
        <div className="card-body p-6">
          <h2 className="card-title text-xl mb-4">
            <UserCheckIcon className="size-5 text-accent" /> Registered User Accounts & Approval Control
          </h2>

          <div className="overflow-x-auto">
            <table className="table table-zebra w-full">
              <thead>
                <tr>
                  <th>User / Shop Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Approval Status</th>
                  <th>Approve Action</th>
                  <th>Role Action</th>
                  <th>Delete</th>
                </tr>
              </thead>
              <tbody>
                {allUsers.map((u) => {
                  const isSelf = u.id === user.id || u._id === user.id;

                  return (
                    <tr key={u.id || u._id}>
                      <td>
                        <div className="font-bold">{u.name}</div>
                        {u.role === "seller" && u.shopName && (
                          <div className="text-xs text-secondary font-semibold">
                            Shop: {u.shopName}
                          </div>
                        )}
                      </td>
                      <td className="text-base-content/70">{u.email}</td>
                      <td>
                        <span
                          className={`badge ${
                            u.role === "admin"
                              ? "badge-accent"
                              : u.role === "seller"
                              ? "badge-secondary"
                              : "badge-primary"
                          }`}
                        >
                          {u.role.toUpperCase()}
                        </span>
                      </td>
                      <td>
                        {u.role === "admin" || u.isApproved ? (
                          <span className="badge badge-success gap-1 text-xs">
                            <CheckCircle2Icon className="size-3" /> Approved
                          </span>
                        ) : (
                          <span className="badge badge-warning gap-1 text-xs">
                            <ClockIcon className="size-3" /> Pending Admin
                          </span>
                        )}
                      </td>
                      <td>
                        {u.role === "admin" ? (
                          <span className="text-xs text-base-content/50 italic">System Owner</span>
                        ) : u.isApproved ? (
                          <button
                            onClick={() => approveUser(u.id || u._id, false)}
                            className="btn btn-xs btn-outline btn-warning gap-1"
                          >
                            <XCircleIcon className="size-3" /> Revoke
                          </button>
                        ) : (
                          <button
                            onClick={() => approveUser(u.id || u._id, true)}
                            className="btn btn-xs btn-success text-white gap-1 shadow-sm"
                          >
                            <CheckCircle2Icon className="size-3" /> Approve Account
                          </button>
                        )}
                      </td>
                      <td>
                        {u.role === "admin" ? (
                          <span className="text-xs text-base-content/50 italic">Admin</span>
                        ) : (
                          <select
                            className="select select-xs select-bordered w-28"
                            value={u.role}
                            onChange={(e) => updateUserRole(u.id || u._id, e.target.value)}
                          >
                            <option value="buyer">Buyer</option>
                            <option value="seller">Seller</option>
                          </select>
                        )}
                      </td>
                      <td>
                        <button
                          onClick={() => handleDeleteUser(u)}
                          disabled={isSelf}
                          className="btn btn-xs btn-error btn-outline"
                          title={isSelf ? "Cannot delete yourself" : "Delete User Account"}
                        >
                          <Trash2Icon className="size-3" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboardPage;
