import { createContext, useContext, useState, useEffect, useCallback } from "react";
import api from "../Services/api";

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const refreshCart = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const response = await api.get("/cart");
      setCartItems((response?.data?.cart) || []);
    } catch (err) {
      if (err.response?.status === 401) {
        setCartItems([]);
      } else {
        setError("Unable to load your cart.");
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshCart();
  }, [refreshCart]);

  const addToCart = async (productId) => {
    try {
      const response = await api.post(`/cart/${productId}`);
      if (response?.data?.cart) {
        setCartItems(response.data.cart);
      }
      return { success: true };
    } catch (err) {
      const message =
        err.response?.data?.message || "Unable to add product to cart.";
      return {
        success: false,
        status: err.response?.status,
        message,
      };
    }
  };

  const updateQuantity = async (productId, quantity) => {
    try {
      const response = await api.patch(`/cart/${productId}`, { quantity });
      if (response?.data?.cart) {
        setCartItems(response.data.cart);
      }
      return { success: true };
    } catch (err) {
      const message =
        err.response?.data?.message || "Unable to update cart quantity.";
      return {
        success: false,
        status: err.response?.status,
        message,
      };
    }
  };

  const removeFromCart = async (productId) => {
    try {
      const response = await api.delete(`/cart/${productId}`);
      if (response?.data?.cart) {
        setCartItems(response.data.cart);
      }
      return { success: true };
    } catch (err) {
      const message =
        err.response?.data?.message || "Unable to remove item from cart.";
      return {
        success: false,
        status: err.response?.status,
        message,
      };
    }
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const totalCount = cartItems.reduce(
    (sum, item) => sum + (item.quantity || 0),
    0
  );

  const subtotal = cartItems.reduce(
    (sum, item) => sum + (item.product?.price || 0) * (item.quantity || 0),
    0
  );

  return (
    <CartContext.Provider
      value={{
        cartItems,
        loading,
        error,
        totalCount,
        subtotal,
        addToCart,
        updateQuantity,
        removeFromCart,
        refreshCart,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
