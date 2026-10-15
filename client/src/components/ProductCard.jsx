import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, Tag, AlertCircle, CheckCircle, Heart, Loader2, ShoppingCart, Check } from "lucide-react";
import api from "../Services/api";
import { useCart } from "../context/CartContext";

function ProductCard({ product }) {
  const navigate = useNavigate();
  const { addToCart, cartItems } = useCart();
  const [wishlistStatus, setWishlistStatus] = useState("idle");
  const [wishlistError, setWishlistError] = useState("");
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [cartSuccess, setCartSuccess] = useState(false);
  const [cartError, setCartError] = useState("");

  const isOutOfStock = product.stock <= 0;
  const isInCart = cartItems.some((item) => item.product?._id === product._id || item.product === product._id);

  const handleAddToWishlist = async () => {
    if (wishlistStatus === "saving") return;

    setWishlistStatus("saving");
    setWishlistError("");

    try {
      await api.post(`/wishlist/${product._id}`);
      setWishlistStatus("saved");
    } catch (err) {
      if (err.response?.status === 409) {
        setWishlistStatus("saved");
      } else if (err.response?.status === 401) {
        navigate("/login");
      } else {
        setWishlistStatus("error");
        setWishlistError("Unable to save product. Please try again.");
      }
    }
  };

  const handleAddToCart = async () => {
    if (isAddingToCart || isOutOfStock) return;

    setIsAddingToCart(true);
    setCartError("");

    const res = await addToCart(product._id);
    setIsAddingToCart(false);

    if (!res.success) {
      if (res.status === 401) {
        navigate("/login");
      } else {
        setCartError(res.message || "Unable to add to cart.");
      }
    } else {
      setCartSuccess(true);
      setTimeout(() => setCartSuccess(false), 2000);
    }
  };

  return (
    <div className="group flex flex-col overflow-hidden rounded-2xl border border-[#242424] bg-[#141414] shadow-md transition-all duration-300 hover:-translate-y-1 hover:border-[#8B0D1A]/60 hover:shadow-xl hover:shadow-[#8B0D1A]/10">
      <div className="relative h-52 w-full overflow-hidden bg-[#0B0B0B]">
        <img
          src={product.image}
          alt={product.name}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute left-3 top-3">
          <span className="inline-flex items-center gap-1 rounded-full border border-[#2c2c2c] bg-[#0B0B0B]/90 px-2.5 py-1 text-xs font-semibold text-[#F5F2ED] backdrop-blur-sm shadow-sm">
            <Tag size={13} className="text-[#8B0D1A]" />
            {product.category}
          </span>
        </div>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <div className="mb-2 flex items-center justify-between">
          <span
            className={`inline-flex items-center gap-1 rounded-md border px-2 py-0.5 text-xs font-semibold ${
              isOutOfStock
                ? "border-[#333333] bg-[#1a1a1a] text-[#7a7670]"
                : "border-[#8B0D1A]/40 bg-[#8B0D1A]/15 text-[#F5F2ED]"
            }`}
          >
            {isOutOfStock ? (
              <>
                <AlertCircle size={13} />
                Out of Stock
              </>
            ) : (
              <>
                <CheckCircle size={13} className="text-[#8B0D1A]" />
                In Stock ({product.stock})
              </>
            )}
          </span>
        </div>

        <h3 className="line-clamp-1 text-base font-bold text-[#F5F2ED]">
          {product.name}
        </h3>

        <p className="mt-1 line-clamp-2 text-xs text-[#b8b3ab]">
          {product.description}
        </p>

        <div className="mt-auto pt-4">
          <div className="mb-3 flex items-baseline justify-between border-t border-[#242424] pt-3">
            <span className="text-xs uppercase tracking-wider text-[#7a7670]">Price</span>
            <span className="text-xl font-extrabold text-[#F5F2ED]">
              ₹{product.price.toLocaleString("en-IN")}
            </span>
          </div>

          <div className="flex flex-col gap-2">
            <button
              onClick={handleAddToCart}
              disabled={isAddingToCart || isOutOfStock}
              className={`flex w-full items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition-all duration-200 ${
                isOutOfStock
                  ? "border border-[#2c2c2c] bg-[#181818] text-[#7a7670] cursor-not-allowed"
                  : cartSuccess
                  ? "border border-[#8B0D1A] bg-[#8B0D1A]/20 text-[#F5F2ED]"
                  : isAddingToCart
                  ? "border border-[#2c2c2c] bg-[#181818] text-[#7a7670] cursor-not-allowed"
                  : "bg-[#8B0D1A] text-[#F5F2ED] shadow-md shadow-[#8B0D1A]/25 hover:bg-[#a81323] hover:shadow-[#8B0D1A]/40 active:scale-[0.98]"
              }`}
            >
              {isAddingToCart ? (
                <>
                  <Loader2 size={16} className="animate-spin text-[#F5F2ED]" />
                  <span>Adding...</span>
                </>
              ) : cartSuccess ? (
                <>
                  <Check size={16} className="text-[#8B0D1A]" />
                  <span>Added to Cart</span>
                </>
              ) : (
                <>
                  <ShoppingCart size={16} />
                  <span>{isOutOfStock ? "Out of Stock" : isInCart ? "Add Another" : "Add to Cart"}</span>
                </>
              )}
            </button>

            {cartError && (
              <p className="text-center text-xs text-[#8B0D1A]">{cartError}</p>
            )}

            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={handleAddToWishlist}
                disabled={wishlistStatus === "saving"}
                className={`flex items-center justify-center gap-1.5 rounded-xl border px-3 py-2 text-xs font-semibold transition-all duration-200 ${
                  wishlistStatus === "saved"
                    ? "border-[#8B0D1A] bg-[#8B0D1A]/20 text-[#F5F2ED]"
                    : wishlistStatus === "saving"
                    ? "border-[#2c2c2c] bg-[#181818] text-[#7a7670] cursor-not-allowed"
                    : "border-[#2c2c2c] bg-[#1a1a1a] text-[#F5F2ED] hover:border-[#8B0D1A] hover:bg-[#8B0D1A]/15"
                }`}
              >
                {wishlistStatus === "saving" ? (
                  <>
                    <Loader2 size={14} className="animate-spin text-[#b8b3ab]" />
                    <span>Saving...</span>
                  </>
                ) : wishlistStatus === "saved" ? (
                  <>
                    <Heart size={14} className="fill-[#8B0D1A] text-[#8B0D1A]" />
                    <span>Saved</span>
                  </>
                ) : (
                  <>
                    <Heart size={14} className="text-[#8B0D1A]" />
                    <span>Wishlist</span>
                  </>
                )}
              </button>

              <button
                onClick={() => navigate(`/products/${product._id}`)}
                className="flex items-center justify-center gap-1.5 rounded-xl border border-[#2c2c2c] bg-[#1a1a1a] px-3 py-2 text-xs font-semibold text-[#F5F2ED] hover:border-[#8B0D1A] hover:bg-[#8B0D1A]/15"
              >
                <Eye size={14} />
                <span>Details</span>
              </button>
            </div>

            {wishlistError && (
              <p className="text-center text-xs text-[#8B0D1A]">{wishlistError}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductCard;
