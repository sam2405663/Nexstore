import { useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { LogInIcon, UserPlusIcon, XIcon, StoreIcon, ImageIcon } from "lucide-react";

function AuthModal() {
  const { isAuthModalOpen, closeAuthModal, authMode, setAuthMode, login, register, loading } =
    useAuthStore();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("buyer");
  const [shopName, setShopName] = useState("");
  const [shopImage, setShopImage] = useState("");

  if (!isAuthModalOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (authMode === "login") {
      await login(email, password);
    } else {
      await register(name, email, password, role, shopName, shopImage);
    }
  };

  return (
    <dialog className="modal modal-open">
      <div className="modal-box relative max-w-md">
        <button
          onClick={closeAuthModal}
          className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
        >
          <XIcon className="size-4" />
        </button>

        {/* TABS */}
        <div className="tabs tabs-boxed mb-6 justify-center">
          <button
            className={`tab ${authMode === "login" ? "tab-active" : ""}`}
            onClick={() => setAuthMode("login")}
          >
            <LogInIcon className="size-4 mr-2" /> Sign In
          </button>
          <button
            className={`tab ${authMode === "register" ? "tab-active" : ""}`}
            onClick={() => setAuthMode("register")}
          >
            <UserPlusIcon className="size-4 mr-2" /> Register
          </button>
        </div>

        <h3 className="font-bold text-xl text-center mb-4">
          {authMode === "login" ? "Welcome Back to Nexstore" : "Join Nexstore"}
        </h3>

        <form onSubmit={handleSubmit} className="space-y-4">
          {authMode === "register" && (
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Full Name</span>
              </label>
              <input
                type="text"
                placeholder="John Doe"
                className="input input-bordered w-full"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
          )}

          <div className="form-control">
            <label className="label">
              <span className="label-text font-medium">Email Address</span>
            </label>
            <input
              type="email"
              placeholder="user@example.com"
              className="input input-bordered w-full"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text font-medium">Password</span>
            </label>
            <input
              type="password"
              placeholder="••••••••"
              className="input input-bordered w-full"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {authMode === "register" && (
            <>
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium">Account Role</span>
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    className={`btn btn-sm ${role === "buyer" ? "btn-primary" : "btn-outline"}`}
                    onClick={() => setRole("buyer")}
                  >
                    Buyer
                  </button>
                  <button
                    type="button"
                    className={`btn btn-sm ${role === "seller" ? "btn-secondary" : "btn-outline"}`}
                    onClick={() => setRole("seller")}
                  >
                    Seller / Vendor
                  </button>
                </div>
              </div>

              {/* SELLER SPECIFIC MANDATORY FIELDS */}
              {role === "seller" && (
                <div className="p-4 bg-secondary/10 border border-secondary/20 rounded-xl space-y-3">
                  <div className="flex items-center gap-2 text-secondary font-bold text-sm">
                    <StoreIcon className="size-4" /> Mandatory Shop Details
                  </div>

                  <div className="form-control">
                    <label className="label py-1">
                      <span className="label-text text-xs font-semibold">Shop Name *</span>
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. TechZone Official Store"
                      className="input input-sm input-bordered w-full"
                      value={shopName}
                      onChange={(e) => setShopName(e.target.value)}
                      required={role === "seller"}
                    />
                  </div>

                  <div className="form-control">
                    <label className="label py-1">
                      <span className="label-text text-xs font-semibold">Seller / Shop Logo Image URL *</span>
                    </label>
                    <div className="relative">
                      <input
                        type="url"
                        placeholder="https://images.unsplash.com/photo-..."
                        className="input input-sm input-bordered w-full"
                        value={shopImage}
                        onChange={(e) => setShopImage(e.target.value)}
                        required={role === "seller"}
                      />
                    </div>
                  </div>
                </div>
              )}
            </>
          )}

          <button
            type="submit"
            className="btn btn-primary w-full mt-6"
            disabled={loading}
          >
            {loading ? (
              <span className="loading loading-spinner loading-sm" />
            ) : authMode === "login" ? (
              "Sign In"
            ) : (
              `Create ${role === "seller" ? "Seller Store" : "Buyer"} Account`
            )}
          </button>
        </form>

        {/* DEMO ACCOUNTS HINT */}
        <div className="mt-6 p-3 bg-base-200 rounded-lg text-xs space-y-1">
          <p className="font-semibold text-base-content/70 mb-1">Demo Credentials:</p>
          <p><span className="font-medium text-primary">Admin:</span> admin@nexstore.com / admin123</p>
          <p><span className="font-medium text-secondary">Tech Shop:</span> seller@nexstore.com / seller123</p>
          <p><span className="font-medium text-secondary">Fashion Shop:</span> fashion@nexstore.com / seller123</p>
          <p><span className="font-medium text-accent">Buyer:</span> buyer@nexstore.com / buyer123</p>
        </div>
      </div>
      <form method="dialog" className="modal-backdrop" onClick={closeAuthModal}>
        <button>close</button>
      </form>
    </dialog>
  );
}

export default AuthModal;
