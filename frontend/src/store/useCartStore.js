import { create } from "zustand";
import toast from "react-hot-toast";

const initialCart = JSON.parse(localStorage.getItem("nexstore_cart") || "[]");

const saveCart = (cart) => {
  localStorage.setItem("nexstore_cart", JSON.stringify(cart));
};

export const useCartStore = create((set, get) => ({
  cart: initialCart,
  isCartOpen: false,

  toggleCart: () => set((state) => ({ isCartOpen: !state.isCartOpen })),
  openCart: () => set({ isCartOpen: true }),
  closeCart: () => set({ isCartOpen: false }),

  addToCart: (product) => {
    const { cart } = get();
    const existingIndex = cart.findIndex((item) => item.product === product.id);

    let updatedCart;
    if (existingIndex > -1) {
      updatedCart = cart.map((item, index) =>
        index === existingIndex ? { ...item, quantity: item.quantity + 1 } : item
      );
    } else {
      updatedCart = [
        ...cart,
        {
          product: product.id,
          name: product.name,
          price: product.price,
          image: product.image,
          seller: product.seller,
          quantity: 1,
        },
      ];
    }

    saveCart(updatedCart);
    set({ cart: updatedCart });
    toast.success(`${product.name} added to cart!`);
  },

  removeFromCart: (productId) => {
    const updatedCart = get().cart.filter((item) => item.product !== productId);
    saveCart(updatedCart);
    set({ cart: updatedCart });
    toast.success("Item removed from cart");
  },

  updateQuantity: (productId, delta) => {
    const updatedCart = get()
      .cart.map((item) => {
        if (item.product === productId) {
          const newQty = item.quantity + delta;
          return newQty > 0 ? { ...item, quantity: newQty } : null;
        }
        return item;
      })
      .filter(Boolean);

    saveCart(updatedCart);
    set({ cart: updatedCart });
  },

  clearCart: () => {
    localStorage.removeItem("nexstore_cart");
    set({ cart: [] });
  },

  getTotalPrice: () => {
    return get()
      .cart.reduce((total, item) => total + item.price * item.quantity, 0)
      .toFixed(2);
  },

  getTotalItemsCount: () => {
    return get().cart.reduce((total, item) => total + item.quantity, 0);
  },
}));
