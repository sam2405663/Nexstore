import { EditIcon, Trash2Icon, ShoppingCartIcon, StoreIcon } from "lucide-react";
import { Link } from "react-router-dom";
import { useProductStore } from "../store/useProductStore";
import { useCartStore } from "../store/useCartStore";
import { useAuthStore } from "../store/useAuthStore";

function ProductCard({ product }) {
  const { deleteProduct } = useProductStore();
  const { addToCart } = useCartStore();
  const { user } = useAuthStore();

  const sellerObj = typeof product.seller === "object" ? product.seller : null;
  const sellerId = sellerObj ? sellerObj._id || sellerObj.id : product.seller;
  const shopName = sellerObj?.shopName || "Vendor Store";

  // Sellers can ONLY edit or delete products from their OWN shop
  const isOwningSeller =
    user && user.role === "seller" && user.id === sellerId;

  return (
    <div className="card bg-base-100 shadow-xl hover:shadow-2xl transition-all duration-300 border border-base-200 overflow-hidden flex flex-col justify-between">
      {/* PRODUCT IMAGE & BADGE */}
      <div>
        <figure className="relative pt-[56.25%] overflow-hidden bg-base-300">
          <img
            src={product.image}
            alt={product.name}
            className="absolute top-0 left-0 w-full h-full object-cover transition-transform duration-300 hover:scale-105"
          />
          {product.category && (
            <span className="absolute top-3 left-3 badge badge-primary font-semibold shadow-md">
              {product.category}
            </span>
          )}
        </figure>

        <div className="card-body p-5">
          <h2 className="card-title text-base font-bold line-clamp-1">{product.name}</h2>

          {/* SHOP BADGE LINK */}
          {sellerId && (
            <Link
              to={`/shop/${sellerId}`}
              className="inline-flex items-center gap-1 text-xs text-secondary hover:underline font-semibold mt-1"
            >
              <StoreIcon className="size-3" /> {shopName}
            </Link>
          )}

          <p className="text-2xl font-extrabold text-primary mt-2">${Number(product.price).toFixed(2)}</p>
        </div>
      </div>

      {/* CARD ACTIONS */}
      <div className="card-body pt-0 p-5">
        <div className="flex items-center justify-between gap-2 mt-2">
          <button
            className="btn btn-sm btn-primary flex-1 gap-2 shadow-md"
            onClick={() => addToCart(product)}
          >
            <ShoppingCartIcon className="size-4" /> Add to Cart
          </button>

          {isOwningSeller && (
            <div className="flex gap-1">
              <Link to={`/product/${product.id || product._id}`} className="btn btn-sm btn-square btn-ghost">
                <EditIcon className="size-4 text-info" />
              </Link>
              <button
                className="btn btn-sm btn-square btn-ghost"
                onClick={() => {
                  if (window.confirm("Delete product from your shop?")) deleteProduct(product.id || product._id);
                }}
              >
                <Trash2Icon className="size-4 text-error" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ProductCard;