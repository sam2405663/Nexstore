import { Link, useResolvedPath } from "react-router-dom";
import { ShoppingBagIcon, ShoppingCartIcon, PlusSquareIcon, LogInIcon, LogOutIcon, ShieldCheckIcon, StoreIcon, PackageIcon } from "lucide-react";
import ThemeSelector from "./ThemeSelector";
import { useAuthStore } from "../store/useAuthStore";
import { useCartStore } from "../store/useCartStore";

function Navbar() {
  const { pathname } = useResolvedPath();

  const { user, openAuthModal, logout } = useAuthStore();
  const { toggleCart, getTotalItemsCount } = useCartStore();

  // Seller Dashboard is strictly for Sellers only
  const isSeller = user && user.role === "seller";
  const isAdmin = user && user.role === "admin";

  const totalCartCount = getTotalItemsCount();

  return (
    <div className="bg-base-100/80 backdrop-blur-lg border-b border-base-content/10 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto">
        <div className="navbar px-4 min-h-[4rem] justify-between">
          {/* LOGO */}
          <div className="flex-1 lg:flex-none">
            <Link to="/" className="hover:opacity-80 transition-opacity">
              <div className="flex items-center gap-2">
                <ShoppingCartIcon className="size-9 text-primary" />
                <span
                  className="font-semibold font-mono tracking-widest text-2xl 
                    bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary"
                >
                  NEXSTORE
                </span>
              </div>
            </Link>
          </div>

          {/* DYNAMIC NAV LINKS */}
          <div className="hidden md:flex items-center gap-2 mx-4">
            {user && (
              <Link to="/orders" className="btn btn-ghost btn-sm gap-1">
                <PackageIcon className="size-4" /> My Orders
              </Link>
            )}

            {isSeller && (
              <Link to="/seller" className="btn btn-ghost btn-sm gap-1 text-secondary">
                <StoreIcon className="size-4" /> Seller Dashboard
              </Link>
            )}

            {isAdmin && (
              <Link to="/admin" className="btn btn-ghost btn-sm gap-1 text-accent">
                <ShieldCheckIcon className="size-4" /> Admin Panel
              </Link>
            )}
          </div>

          {/* RIGHT SECTION */}
          <div className="flex items-center gap-3">
            {/* THEME SELECTOR */}
            <ThemeSelector />

            {/* CART BUTTON */}
            <button
              onClick={toggleCart}
              className="btn btn-ghost btn-circle indicator hover:bg-base-200 transition-colors"
            >
              <ShoppingBagIcon className="size-5" />
              {totalCartCount > 0 && (
                <span className="badge badge-sm badge-primary indicator-item">
                  {totalCartCount}
                </span>
              )}
            </button>

            {/* ADD PRODUCT BUTTON (SELLER ONLY) */}
            {isSeller && (
              <button
                onClick={() => document.getElementById("add_product_modal")?.showModal()}
                className="btn btn-primary btn-sm gap-1 shadow-md hidden sm:flex"
              >
                <PlusSquareIcon className="size-4" /> Add Product
              </button>
            )}

            {/* USER AUTH MENU */}
            {user ? (
              <div className="dropdown dropdown-end">
                <label tabIndex={0} className="btn btn-ghost btn-circle avatar border border-base-300">
                  <div className="w-9 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                </label>
                <ul
                  tabIndex={0}
                  className="menu menu-sm dropdown-content mt-3 z-50 p-3 shadow-xl bg-base-100 rounded-box w-56 border border-base-200 space-y-1"
                >
                  <li className="px-2 py-1 font-medium border-b border-base-200 pb-2">
                    <p className="font-bold text-sm">{user.name}</p>
                    <p className="text-xs text-base-content/60">{user.email}</p>
                    <div className="mt-1">
                      <span
                        className={`badge badge-sm ${
                          user.role === "admin"
                            ? "badge-accent"
                            : user.role === "seller"
                            ? "badge-secondary"
                            : "badge-primary"
                        }`}
                      >
                        {user.role.toUpperCase()}
                      </span>
                    </div>
                  </li>

                  <li>
                    <Link to="/orders">
                      <PackageIcon className="size-4" /> My Orders
                    </Link>
                  </li>

                  {isSeller && (
                    <li>
                      <Link to="/seller">
                        <StoreIcon className="size-4" /> Seller Dashboard
                      </Link>
                    </li>
                  )}

                  {isAdmin && (
                    <li>
                      <Link to="/admin">
                        <ShieldCheckIcon className="size-4" /> Admin Panel
                      </Link>
                    </li>
                  )}

                  <li className="border-t border-base-200 pt-1">
                    <button onClick={logout} className="text-error">
                      <LogOutIcon className="size-4" /> Sign Out
                    </button>
                  </li>
                </ul>
              </div>
            ) : (
              <button
                onClick={() => openAuthModal("login")}
                className="btn btn-outline btn-primary btn-sm gap-1"
              >
                <LogInIcon className="size-4" /> Sign In
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Navbar;