import { useEffect, useMemo, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useShopStore } from "../store/useShopStore";
import { StoreIcon, ArrowLeftIcon, PackageIcon, LayersIcon, ShieldCheckIcon } from "lucide-react";
import ProductCard from "../components/ProductCard";

function ShopStorePage() {
  const { sellerId } = useParams();
  const { currentShop, shopProducts, fetchShopById, loading, error } = useShopStore();
  const [selectedCategory, setSelectedCategory] = useState("All");

  useEffect(() => {
    fetchShopById(sellerId);
  }, [sellerId, fetchShopById]);

  const categories = useMemo(() => {
    const list = ["All"];
    shopProducts.forEach((p) => {
      if (p.category && !list.includes(p.category)) {
        list.push(p.category);
      }
    });
    return list;
  }, [shopProducts]);

  const filteredProducts = useMemo(() => {
    if (selectedCategory === "All") return shopProducts;
    return shopProducts.filter((p) => p.category === selectedCategory);
  }, [shopProducts, selectedCategory]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="loading loading-spinner loading-lg text-primary" />
      </div>
    );
  }

  if (error || !currentShop) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <StoreIcon className="size-16 mx-auto text-base-content/30 mb-4" />
        <h2 className="text-2xl font-bold mb-2">{error || "Shop Not Found"}</h2>
        <Link to="/" className="btn btn-primary mt-4">
          <ArrowLeftIcon className="size-4 mr-2" /> Back to Marketplace
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-16">
      {/* SHOP BANNER HEADER */}
      <div className="bg-gradient-to-r from-base-300 via-base-200 to-base-300 border-b border-base-200 py-12 px-4 shadow-inner">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-6">
          <img
            src={currentShop.shopImage}
            alt={currentShop.shopName}
            className="size-28 md:size-36 object-cover rounded-2xl shadow-xl border-4 border-base-100 bg-base-300"
          />
          <div className="text-center md:text-left space-y-2 flex-1">
            <Link to="/" className="inline-flex items-center text-xs font-semibold text-primary hover:underline mb-1">
              <ArrowLeftIcon className="size-3 mr-1" /> All Stores
            </Link>
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">{currentShop.shopName}</h1>
            <p className="text-base-content/70 max-w-xl text-sm leading-relaxed">{currentShop.shopDescription}</p>
            <div className="flex items-center justify-center md:justify-start gap-4 pt-2 text-xs">
              <span className="badge badge-secondary gap-1">
                <StoreIcon className="size-3" /> Owner: {currentShop.name}
              </span>
              <span className="badge badge-primary gap-1">
                <PackageIcon className="size-3" /> {shopProducts.length} Items Listed
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* SHOP CONTENT CONTAINER */}
      <main className="max-w-6xl mx-auto px-4 py-8">
        {/* CATEGORY FILTER BAR FOR THIS SHOP */}
        <div className="mb-8 overflow-x-auto pb-2">
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 text-sm font-semibold text-base-content/60 mr-2">
              <LayersIcon className="size-4" /> Shop Categories:
            </div>
            {categories.map((cat) => {
              const count =
                cat === "All"
                  ? shopProducts.length
                  : shopProducts.filter((p) => p.category === cat).length;
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
        {filteredProducts.length === 0 ? (
          <div className="flex flex-col justify-center items-center h-64 space-y-4 bg-base-100 rounded-2xl border border-base-200 p-8">
            <PackageIcon className="size-12 opacity-30" />
            <h3 className="text-xl font-semibold">No products in this category</h3>
            <p className="text-base-content/60 text-sm">Check back later for updates from {currentShop.shopName}.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id || product._id} product={product} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

export default ShopStorePage;
