import { useEffect, useMemo, useState } from "react";
import { useShopStore } from "../store/useShopStore";
import { useProductStore } from "../store/useProductStore";
import { useAuthStore } from "../store/useAuthStore";
import { Link } from "react-router-dom";
import { StoreIcon, PlusCircleIcon, RefreshCwIcon, ArrowRightIcon, LayersIcon, PackageIcon } from "lucide-react";
import ProductCard from "../components/ProductCard";

function HomePage() {
  const { shops, fetchShops, loading: shopsLoading } = useShopStore();
  const { products, fetchProducts, loading: productsLoading } = useProductStore();
  const { user, openAuthModal } = useAuthStore();

  const [activeView, setActiveView] = useState("shops"); // "shops" | "all-products"
  const [selectedCategory, setSelectedCategory] = useState("All");

  useEffect(() => {
    fetchShops();
    fetchProducts();
  }, [fetchShops, fetchProducts]);

  const isSeller = user && (user.role === "seller" || user.role === "admin");

  const categories = useMemo(() => {
    const list = ["All"];
    products.forEach((p) => {
      if (p.category && !list.includes(p.category)) {
        list.push(p.category);
      }
    });
    return list;
  }, [products]);

  const filteredProducts = useMemo(() => {
    if (selectedCategory === "All") return products;
    return products.filter((p) => p.category === selectedCategory);
  }, [products, selectedCategory]);

  const handleAddProductClick = () => {
    if (!user) {
      openAuthModal("login");
    } else if (isSeller) {
      document.getElementById("add_product_modal")?.showModal();
    } else {
      openAuthModal("register");
    }
  };

  return (
    <main className="max-w-6xl mx-auto px-4 py-8 space-y-8">
      {/* HERO / ACTION BAR */}
      <div className="flex flex-wrap justify-between items-center gap-4 border-b border-base-200 pb-6">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">Multi-Vendor Marketplace</h1>
          <p className="text-sm text-base-content/60 mt-1">Discover unique verified seller stores or browse all catalog products</p>
        </div>

        <div className="flex items-center gap-3">
          <button className="btn btn-primary shadow-md" onClick={handleAddProductClick}>
            {isSeller ? (
              <>
                <PlusCircleIcon className="size-5 mr-1" /> Add Product to My Shop
              </>
            ) : (
              <>
                <StoreIcon className="size-5 mr-1" /> Create My Shop / Sell Item
              </>
            )}
          </button>
          <button
            className="btn btn-ghost btn-circle"
            onClick={() => {
              fetchShops();
              fetchProducts();
            }}
            title="Refresh"
          >
            <RefreshCwIcon className="size-5" />
          </button>
        </div>
      </div>

      {/* VIEW SELECTION TABS (SHOPS FIRST vs ALL PRODUCTS) */}
      <div className="flex justify-center">
        <div className="tabs tabs-boxed bg-base-200/80 p-1.5 shadow-sm">
          <button
            className={`tab gap-2 text-sm font-semibold px-6 py-2 rounded-lg ${
              activeView === "shops" ? "tab-active bg-primary text-primary-content shadow-md" : ""
            }`}
            onClick={() => setActiveView("shops")}
          >
            <StoreIcon className="size-4" /> Explore Shops ({shops.length})
          </button>
          <button
            className={`tab gap-2 text-sm font-semibold px-6 py-2 rounded-lg ${
              activeView === "all-products" ? "tab-active bg-primary text-primary-content shadow-md" : ""
            }`}
            onClick={() => setActiveView("all-products")}
          >
            <PackageIcon className="size-4" /> All Items ({products.length})
          </button>
        </div>
      </div>

      {/* VIEW 1: SHOPS / STORES GRID (SHOPS FIRST) */}
      {activeView === "shops" && (
        <section className="space-y-6">
          {shopsLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="loading loading-spinner loading-lg text-primary" />
            </div>
          ) : shops.length === 0 ? (
            <div className="text-center py-16 bg-base-100 rounded-2xl border border-base-200 p-8 space-y-3">
              <StoreIcon className="size-16 mx-auto opacity-30" />
              <h3 className="text-xl font-bold">No registered shops yet</h3>
              <p className="text-base-content/60 text-sm">Be the first seller to register and create a store!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {shops.map((shop) => (
                <div
                  key={shop.id}
                  className="card bg-base-100 shadow-xl hover:shadow-2xl transition-all duration-300 border border-base-200 overflow-hidden flex flex-col justify-between"
                >
                  <figure className="relative h-44 overflow-hidden bg-base-300">
                    <img
                      src={shop.shopImage}
                      alt={shop.shopName}
                      className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                    />
                    <span className="absolute top-3 right-3 badge badge-secondary font-semibold shadow-md">
                      {shop.productCount} Products
                    </span>
                  </figure>

                  <div className="card-body p-6 flex-1 flex flex-col justify-between space-y-4">
                    <div>
                      <h3 className="card-title text-xl font-bold line-clamp-1">{shop.shopName}</h3>
                      <p className="text-xs font-semibold text-primary mt-1">Owner: {shop.name}</p>
                      <p className="text-xs text-base-content/70 mt-2 line-clamp-2">
                        {shop.shopDescription || "Welcome to our shop!"}
                      </p>
                    </div>

                    <Link to={`/shop/${shop.id}`} className="btn btn-primary w-full gap-2 shadow-md">
                      Visit Store <ArrowRightIcon className="size-4" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      )}

      {/* VIEW 2: ALL MARKETPLACE PRODUCTS WITH CATEGORY FILTERS */}
      {activeView === "all-products" && (
        <section className="space-y-6">
          {/* CATEGORY FILTER TABS */}
          <div className="overflow-x-auto pb-2">
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1 text-sm font-semibold text-base-content/60 mr-2">
                <LayersIcon className="size-4" /> Categories:
              </div>
              {categories.map((cat) => {
                const count =
                  cat === "All"
                    ? products.length
                    : products.filter((p) => p.category === cat).length;
                const isActive = selectedCategory === cat;

                return (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`btn btn-sm rounded-full transition-all duration-200 ${
                      isActive
                        ? "btn-primary shadow-md"
                        : "btn-outline border-base-300 text-base-content/70 hover:btn-primary"
                    }`}
                  >
                    {cat}
                    <span
                      className={`badge badge-sm ml-1 ${
                        isActive ? "badge-outline text-primary-content" : "badge-ghost"
                      }`}
                    >
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* PRODUCTS GRID */}
          {productsLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="loading loading-spinner loading-lg text-primary" />
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="flex flex-col justify-center items-center h-64 bg-base-100 rounded-2xl border border-base-200 p-8">
              <PackageIcon className="size-12 opacity-30" />
              <h3 className="text-xl font-semibold mt-2">No products found</h3>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id || product._id} product={product} />
              ))}
            </div>
          )}
        </section>
      )}
    </main>
  );
}

export default HomePage;