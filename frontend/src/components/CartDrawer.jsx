import { useCartStore } from "../store/useCartStore";
import { useAuthStore } from "../store/useAuthStore";
import { useOrderStore } from "../store/useOrderStore";
import { ShoppingBagIcon, Trash2Icon, XIcon, PlusIcon, MinusIcon, ArrowRightIcon } from "lucide-react";

function CartDrawer() {
  const { cart, isCartOpen, closeCart, removeFromCart, updateQuantity, getTotalPrice } =
    useCartStore();
  const { user, openAuthModal } = useAuthStore();
  const { checkout, loading: checkoutLoading } = useOrderStore();

  if (!isCartOpen) return null;

  const handleCheckout = async () => {
    if (!user) {
      closeCart();
      openAuthModal("login");
      return;
    }
    await checkout();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/50 backdrop-blur-xs flex justify-end">
      <div className="w-full max-w-md bg-base-100 h-full shadow-2xl flex flex-col transition-all duration-300">
        {/* HEADER */}
        <div className="p-4 border-b border-base-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShoppingBagIcon className="size-5 text-primary" />
            <h2 className="text-lg font-bold">Shopping Cart ({cart.length})</h2>
          </div>
          <button onClick={closeCart} className="btn btn-sm btn-ghost btn-circle">
            <XIcon className="size-5" />
          </button>
        </div>

        {/* CART ITEMS */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {cart.length === 0 ? (
            <div className="text-center py-16 text-base-content/60 space-y-3">
              <ShoppingBagIcon className="size-16 mx-auto opacity-30" />
              <p className="text-lg font-medium">Your cart is empty</p>
              <button onClick={closeCart} className="btn btn-sm btn-outline btn-primary mt-2">
                Start Shopping
              </button>
            </div>
          ) : (
            cart.map((item) => (
              <div
                key={item.product}
                className="flex items-center gap-4 bg-base-200/50 p-3 rounded-xl border border-base-200"
              >
                <img
                  src={item.image}
                  alt={item.name}
                  className="size-16 object-cover rounded-lg bg-base-300"
                />
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-sm truncate">{item.name}</h4>
                  <p className="text-xs text-primary font-bold mt-1">${Number(item.price).toFixed(2)}</p>
                  
                  {/* QUANTITY CONTROLS */}
                  <div className="flex items-center gap-2 mt-2">
                    <button
                      onClick={() => updateQuantity(item.product, -1)}
                      className="btn btn-xs btn-square btn-ghost"
                    >
                      <MinusIcon className="size-3" />
                    </button>
                    <span className="text-xs font-semibold px-1">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.product, 1)}
                      className="btn btn-xs btn-square btn-ghost"
                    >
                      <PlusIcon className="size-3" />
                    </button>
                  </div>
                </div>

                <button
                  onClick={() => removeFromCart(item.product)}
                  className="btn btn-sm btn-ghost text-error"
                >
                  <Trash2Icon className="size-4" />
                </button>
              </div>
            ))
          )}
        </div>

        {/* FOOTER */}
        {cart.length > 0 && (
          <div className="p-4 border-t border-base-200 bg-base-200/30 space-y-4">
            <div className="flex justify-between items-center text-lg font-bold">
              <span>Total Amount:</span>
              <span className="text-primary">${getTotalPrice()}</span>
            </div>

            <button
              onClick={handleCheckout}
              disabled={checkoutLoading}
              className="btn btn-primary w-full"
            >
              {checkoutLoading ? (
                <span className="loading loading-spinner loading-sm" />
              ) : (
                <>
                  Checkout <ArrowRightIcon className="size-4 ml-2" />
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default CartDrawer;
