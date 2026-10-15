import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import { useCart } from "../context/CartContext";
import {
  ShoppingCart,
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  RefreshCw,
  AlertTriangle,
  ShoppingBag,
  Tag,
} from "lucide-react";

function Cart() {
  const navigate = useNavigate();
  const {
    cartItems,
    loading,
    error,
    totalCount,
    subtotal,
    updateQuantity,
    removeFromCart,
    refreshCart,
  } = useCart();

  const [updatingId, setUpdatingId] = useState(null);
  const [actionError, setActionError] = useState("");

  const handleQuantityChange = async (productId, newQuantity) => {
    setUpdatingId(productId);
    setActionError("");

    const res = await updateQuantity(productId, newQuantity);
    if (!res.success) {
      setActionError(res.message);
    }
    setUpdatingId(null);
  };

  const handleRemoveItem = async (productId) => {
    setUpdatingId(productId);
    setActionError("");

    const res = await removeFromCart(productId);
    if (!res.success) {
      setActionError(res.message);
    }
    setUpdatingId(null);
  };

  return (
    <div className="min-h-screen bg-[#0B0B0B] text-[#F5F2ED]">
      <Navbar />

      <main className="mx-auto max-w-7xl px-5 py-8 sm:px-8">
        <div className="mb-8">
          <p className="text-xs font-bold uppercase tracking-wider text-[#8B0D1A]">
            Shopping Bag
          </p>
          <div className="mt-1 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-3xl font-extrabold tracking-tight text-[#F5F2ED] sm:text-4xl">
                My Cart
              </h1>
              <p className="mt-1 text-sm text-[#b8b3ab]">
                Review and manage items currently in your shopping cart.
              </p>
            </div>
            {!loading && !error && cartItems.length > 0 && (
              <span className="self-start rounded-full border border-[#2c2c2c] bg-[#141414] px-3.5 py-1.5 text-xs font-bold text-[#F5F2ED] sm:self-auto">
                {totalCount} {totalCount === 1 ? "Unit" : "Total Units"} (
                {cartItems.length} {cartItems.length === 1 ? "Item" : "Items"})
              </span>
            )}
          </div>
        </div>

        {actionError && (
          <div className="mb-6 flex items-center justify-between rounded-xl border border-[#8B0D1A]/50 bg-[#8B0D1A]/15 p-4 text-sm text-[#F5F2ED]">
            <span>{actionError}</span>
            <button
              onClick={() => setActionError("")}
              className="text-xs font-bold underline hover:text-[#8B0D1A]"
            >
              Dismiss
            </button>
          </div>
        )}

        {loading && (
          <div className="flex min-h-[400px] flex-col items-center justify-center rounded-2xl border border-[#242424] bg-[#141414] p-8 text-center shadow-lg">
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full border border-[#8B0D1A]/30 bg-[#8B0D1A]/10 text-[#8B0D1A] animate-spin">
              <RefreshCw size={28} />
            </div>
            <p className="text-base font-semibold text-[#F5F2ED]">
              Loading your cart...
            </p>
          </div>
        )}

        {!loading && error && (
          <div className="flex min-h-[400px] flex-col items-center justify-center rounded-2xl border border-[#8B0D1A]/50 bg-[#141414] p-8 text-center shadow-lg">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full border border-[#8B0D1A]/40 bg-[#8B0D1A]/15 text-[#8B0D1A]">
              <AlertTriangle size={32} />
            </div>
            <h3 className="text-xl font-bold text-[#F5F2ED]">{error}</h3>
            <button
              onClick={refreshCart}
              className="mt-5 flex items-center gap-2 rounded-xl bg-[#8B0D1A] px-6 py-2.5 text-sm font-semibold text-[#F5F2ED] shadow-md shadow-[#8B0D1A]/30 transition-all hover:bg-[#a81323] active:scale-95"
            >
              <RefreshCw size={16} />
              <span>Try Again</span>
            </button>
          </div>
        )}

        {!loading && !error && cartItems.length === 0 && (
          <div className="flex min-h-[400px] flex-col items-center justify-center rounded-2xl border border-[#242424] bg-[#141414] p-8 text-center shadow-lg">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full border border-[#8B0D1A]/30 bg-[#8B0D1A]/10 text-[#8B0D1A]">
              <ShoppingCart size={34} />
            </div>
            <h3 className="text-2xl font-bold text-[#F5F2ED]">
              Your cart is empty 🛒
            </h3>
            <p className="mt-2 text-sm text-[#b8b3ab]">
              Looks like you haven't added anything yet.
            </p>
            <button
              onClick={() => navigate("/products")}
              className="mt-6 flex items-center gap-2 rounded-xl bg-[#8B0D1A] px-6 py-2.5 text-sm font-semibold text-[#F5F2ED] shadow-md shadow-[#8B0D1A]/30 transition-all hover:bg-[#a81323] active:scale-95"
            >
              <ShoppingBag size={17} />
              <span>Browse Products</span>
            </button>
          </div>
        )}

        {!loading && !error && cartItems.length > 0 && (
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            <div className="space-y-4 lg:col-span-2">
              {cartItems.map((item) => {
                const product = item.product;
                if (!product) return null;

                const isUpdating = updatingId === product._id;
                const itemSubtotal = (product.price || 0) * (item.quantity || 0);

                return (
                  <div
                    key={item._id || product._id}
                    className="flex flex-col gap-4 rounded-2xl border border-[#242424] bg-[#141414] p-4 shadow-md transition-all sm:flex-row sm:items-center sm:justify-between sm:p-5"
                  >
                    <div className="flex items-center gap-4">
                      <Link
                        to={`/products/${product._id}`}
                        className="h-20 w-20 shrink-0 overflow-hidden rounded-xl border border-[#2c2c2c] bg-[#0B0B0B]"
                      >
                        <img
                          src={product.image}
                          alt={product.name}
                          className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
                        />
                      </Link>

                      <div>
                        <div className="mb-1 flex items-center gap-1.5">
                          <span className="inline-flex items-center gap-1 rounded-full border border-[#2c2c2c] bg-[#0B0B0B] px-2 py-0.5 text-[10px] font-semibold text-[#F5F2ED]">
                            <Tag size={10} className="text-[#8B0D1A]" />
                            {product.category}
                          </span>
                          <span className="text-[11px] text-[#7a7670]">
                            Max: {product.stock}
                          </span>
                        </div>

                        <Link
                          to={`/products/${product._id}`}
                          className="line-clamp-1 font-bold text-[#F5F2ED] hover:text-[#8B0D1A]"
                        >
                          {product.name}
                        </Link>

                        <p className="mt-0.5 text-xs text-[#b8b3ab]">
                          ₹{product.price.toLocaleString("en-IN")} each
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between border-t border-[#242424] pt-3 sm:border-t-0 sm:pt-0 sm:gap-6">
                      <div className="flex items-center rounded-xl border border-[#2c2c2c] bg-[#0B0B0B] p-1">
                        <button
                          onClick={() =>
                            handleQuantityChange(product._id, item.quantity - 1)
                          }
                          disabled={item.quantity <= 1 || isUpdating}
                          className="flex h-7 w-7 items-center justify-center rounded-lg text-[#F5F2ED] transition hover:bg-[#181818] hover:text-[#8B0D1A] disabled:cursor-not-allowed disabled:text-[#7a7670]"
                        >
                          <Minus size={14} />
                        </button>

                        <span className="w-8 text-center text-sm font-bold text-[#F5F2ED]">
                          {item.quantity}
                        </span>

                        <button
                          onClick={() =>
                            handleQuantityChange(product._id, item.quantity + 1)
                          }
                          disabled={item.quantity >= product.stock || isUpdating}
                          className="flex h-7 w-7 items-center justify-center rounded-lg text-[#F5F2ED] transition hover:bg-[#181818] hover:text-[#8B0D1A] disabled:cursor-not-allowed disabled:text-[#7a7670]"
                        >
                          <Plus size={14} />
                        </button>
                      </div>

                      <div className="text-right">
                        <p className="text-xs text-[#7a7670]">Item Total</p>
                        <p className="text-base font-extrabold text-[#F5F2ED]">
                          ₹{itemSubtotal.toLocaleString("en-IN")}
                        </p>
                      </div>

                      <button
                        onClick={() => handleRemoveItem(product._id)}
                        disabled={isUpdating}
                        className="flex h-9 w-9 items-center justify-center rounded-xl border border-[#2c2c2c] bg-[#181818] text-[#7a7670] transition hover:border-[#8B0D1A] hover:bg-[#8B0D1A]/15 hover:text-[#8B0D1A] disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="lg:col-span-1">
              <div className="sticky top-24 rounded-2xl border border-[#242424] bg-[#141414] p-6 shadow-xl">
                <h2 className="mb-4 text-lg font-bold text-[#F5F2ED]">
                  Order Summary
                </h2>

                <div className="space-y-3 border-b border-[#242424] pb-4 text-sm">
                  <div className="flex justify-between text-[#b8b3ab]">
                    <span>Total Items</span>
                    <span className="font-semibold text-[#F5F2ED]">
                      {totalCount}
                    </span>
                  </div>

                  <div className="flex justify-between text-[#b8b3ab]">
                    <span>Shipping</span>
                    <span className="font-semibold text-[#8B0D1A]">FREE</span>
                  </div>
                </div>

                <div className="my-4 flex items-baseline justify-between">
                  <span className="text-sm font-bold uppercase tracking-wider text-[#7a7670]">
                    Subtotal
                  </span>
                  <span className="text-2xl font-extrabold text-[#F5F2ED]">
                    ₹{subtotal.toLocaleString("en-IN")}
                  </span>
                </div>

                <button
                  onClick={() => navigate("/checkout")}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#8B0D1A] py-3.5 text-sm font-bold text-[#F5F2ED] shadow-lg shadow-[#8B0D1A]/30 transition-all duration-200 hover:bg-[#a81323] hover:shadow-[#8B0D1A]/40 active:scale-[0.99]"
                >
                  <span>Proceed to Checkout</span>
                  <ArrowRight size={16} />
                </button>

                <div className="mt-4 text-center">
                  <Link
                    to="/products"
                    className="text-xs font-semibold text-[#b8b3ab] hover:text-[#F5F2ED] hover:underline"
                  >
                    ← Continue Shopping
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default Cart;
