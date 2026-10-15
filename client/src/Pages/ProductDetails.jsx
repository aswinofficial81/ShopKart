import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import api from "../Services/api";
import Navbar from "../components/Navbar";
import { useCart } from "../context/CartContext";
import {
  ShoppingCart,
  Check,
  Tag,
  AlertCircle,
  CheckCircle,
  Truck,
  ShieldCheck,
  RotateCcw,
  RefreshCw,
  ArrowLeft,
  Heart,
  Loader2,
} from "lucide-react";

function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart, cartItems } = useCart();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [cartSuccess, setCartSuccess] = useState(false);
  const [cartError, setCartError] = useState("");
  const [wishlistStatus, setWishlistStatus] = useState("idle");
  const [wishlistError, setWishlistError] = useState("");

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      setError("");

      try {
        const response = await api.get(`/products/${id}`);
        setProduct(response.data.product);
      } catch (err) {
        console.error(err);
        if (err.response?.status === 404) {
          setError("Product not found.");
        } else if (err.response?.status === 400) {
          setError("Invalid product ID.");
        } else {
          setError("Something went wrong while loading product details.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleAddToCart = async () => {
    if (isAddingToCart || !product || product.stock <= 0) return;

    setIsAddingToCart(true);
    setCartError("");

    const res = await addToCart(product._id);
    setIsAddingToCart(false);

    if (!res.success) {
      if (res.status === 401) {
        navigate("/login");
      } else {
        setCartError(res.message || "Unable to add product to cart.");
      }
    } else {
      setCartSuccess(true);
      setTimeout(() => {
        setCartSuccess(false);
      }, 2500);
    }
  };

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

  return (
    <div className="min-h-screen bg-[#0B0B0B] text-[#F5F2ED]">
      <Navbar />

      <main className="mx-auto max-w-6xl px-5 py-8 sm:px-8">
        {loading && (
          <div className="flex min-h-[400px] flex-col items-center justify-center rounded-2xl border border-[#242424] bg-[#141414] p-8 text-center shadow-lg">
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full border border-[#8B0D1A]/30 bg-[#8B0D1A]/10 text-[#8B0D1A] animate-spin">
              <RefreshCw size={28} />
            </div>
            <p className="text-base font-semibold text-[#F5F2ED]">
              Loading product details...
            </p>
          </div>
        )}

        {!loading && error && (
          <div className="flex min-h-[400px] flex-col items-center justify-center rounded-2xl border border-[#8B0D1A]/50 bg-[#141414] p-8 text-center shadow-lg">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full border border-[#8B0D1A]/40 bg-[#8B0D1A]/15 text-[#8B0D1A]">
              <AlertCircle size={32} />
            </div>
            <h3 className="text-xl font-bold text-[#F5F2ED]">{error}</h3>
            <p className="mt-2 text-sm text-[#b8b3ab]">
              The product you are looking for does not exist or may have been removed.
            </p>
            <button
              onClick={() => navigate("/products")}
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#8B0D1A] px-5 py-2.5 text-sm font-semibold text-[#F5F2ED] shadow-md shadow-[#8B0D1A]/30 hover:bg-[#a81323]"
            >
              <ArrowLeft size={16} />
              Return to Catalog
            </button>
          </div>
        )}

        {!loading && !error && product && (
          <div>
            <div className="mb-6 flex items-center gap-2 text-xs font-medium text-[#7a7670]">
              <Link to="/products" className="hover:text-[#8B0D1A]">
                Products
              </Link>
              <span>/</span>
              <span className="text-[#b8b3ab]">{product.category}</span>
              <span>/</span>
              <span className="line-clamp-1 font-semibold text-[#F5F2ED]">
                {product.name}
              </span>
            </div>

            <div className="overflow-hidden rounded-3xl border border-[#242424] bg-[#141414] shadow-2xl">
              <div className="grid grid-cols-1 md:grid-cols-2">
                <div className="relative flex items-center justify-center bg-[#0B0B0B] p-8 md:border-r md:border-[#242424]">
                  <div className="max-h-[460px] w-full overflow-hidden rounded-2xl bg-[#0B0B0B]">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="h-full w-full max-h-[460px] object-cover transition-transform duration-500 hover:scale-105"
                    />
                  </div>
                </div>

                <div className="flex flex-col p-8 sm:p-10">
                  <div className="mb-4 flex flex-wrap items-center gap-2">
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-[#2c2c2c] bg-[#0B0B0B] px-3 py-1 text-xs font-bold text-[#F5F2ED]">
                      <Tag size={13} className="text-[#8B0D1A]" />
                      {product.category}
                    </span>

                    <span
                      className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-bold ${
                        product.stock <= 0
                          ? "border-[#333333] bg-[#1a1a1a] text-[#7a7670]"
                          : "border-[#8B0D1A]/40 bg-[#8B0D1A]/15 text-[#F5F2ED]"
                      }`}
                    >
                      {product.stock <= 0 ? (
                        <>
                          <AlertCircle size={13} />
                          Out of Stock
                        </>
                      ) : (
                        <>
                          <CheckCircle size={13} className="text-[#8B0D1A]" />
                          In Stock ({product.stock} available)
                        </>
                      )}
                    </span>
                  </div>

                  <h1 className="text-2xl font-extrabold tracking-tight text-[#F5F2ED] sm:text-3xl">
                    {product.name}
                  </h1>

                  <div className="my-5 flex items-baseline gap-3 border-y border-[#242424] py-4">
                    <span className="text-3xl font-extrabold text-[#F5F2ED]">
                      ₹{product.price.toLocaleString("en-IN")}
                    </span>
                    <span className="text-xs font-medium text-[#7a7670]">
                      Inclusive of all taxes
                    </span>
                  </div>

                  <div className="mb-6">
                    <h3 className="mb-2 text-xs font-bold uppercase tracking-wider text-[#7a7670]">
                      Description
                    </h3>
                    <p className="text-sm leading-relaxed text-[#b8b3ab]">
                      {product.description}
                    </p>
                  </div>

                  <div className="mb-8">
                    <h3 className="mb-2 text-xs font-bold uppercase tracking-wider text-[#7a7670]">
                      Availability
                    </h3>
                    <p className="text-sm font-semibold text-[#F5F2ED]">
                      {product.stock > 0
                        ? `${product.stock} units currently in warehouse stock.`
                        : "Currently out of stock. Check back soon!"}
                    </p>
                  </div>

                  <div className="mt-auto space-y-3">
                    <button
                      onClick={handleAddToCart}
                      disabled={product.stock <= 0 || isAddingToCart}
                      className={`flex w-full items-center justify-center gap-2 rounded-xl py-3.5 text-sm font-bold shadow-lg transition-all ${
                        product.stock <= 0
                          ? "cursor-not-allowed border border-[#2c2c2c] bg-[#181818] text-[#7a7670] shadow-none"
                          : cartSuccess
                          ? "border border-[#8B0D1A] bg-[#8B0D1A]/20 text-[#F5F2ED]"
                          : isAddingToCart
                          ? "border border-[#2c2c2c] bg-[#181818] text-[#7a7670] cursor-not-allowed"
                          : "bg-[#8B0D1A] text-[#F5F2ED] shadow-md shadow-[#8B0D1A]/30 hover:bg-[#a81323] active:scale-[0.99]"
                      }`}
                    >
                      {isAddingToCart ? (
                        <>
                          <Loader2 size={18} className="animate-spin text-[#F5F2ED]" />
                          <span>Adding...</span>
                        </>
                      ) : cartSuccess ? (
                        <>
                          <Check size={18} className="text-[#8B0D1A]" />
                          <span>Added to Cart!</span>
                        </>
                      ) : (
                        <>
                          <ShoppingCart size={18} />
                          <span>
                            {product.stock <= 0
                              ? "Out of Stock"
                              : cartItems.some((i) => (i.product?._id || i.product) === product._id)
                              ? "Add Another to Cart"
                              : "Add to Cart"}
                          </span>
                        </>
                      )}
                    </button>

                    {cartError && (
                      <p className="text-center text-xs text-[#8B0D1A]">{cartError}</p>
                    )}

                    <button
                      onClick={handleAddToWishlist}
                      disabled={wishlistStatus === "saving"}
                      className={`flex w-full items-center justify-center gap-2 rounded-xl border py-3 text-sm font-semibold transition-all ${
                        wishlistStatus === "saved"
                          ? "border-[#8B0D1A] bg-[#8B0D1A]/20 text-[#F5F2ED]"
                          : wishlistStatus === "saving"
                          ? "border-[#2c2c2c] bg-[#181818] text-[#7a7670] cursor-not-allowed"
                          : "border-[#2c2c2c] bg-[#181818] text-[#F5F2ED] hover:border-[#8B0D1A] hover:bg-[#8B0D1A]/15"
                      }`}
                    >
                      {wishlistStatus === "saving" && (
                        <>
                          <Loader2 size={18} className="animate-spin text-[#b8b3ab]" />
                          <span>Saving...</span>
                        </>
                      )}
                      {wishlistStatus === "saved" && (
                        <>
                          <Heart size={18} className="fill-[#8B0D1A] text-[#8B0D1A]" />
                          <span>Added to Wishlist</span>
                        </>
                      )}
                      {(wishlistStatus === "idle" || wishlistStatus === "error") && (
                        <>
                          <Heart size={18} className="text-[#8B0D1A]" />
                          <span>Add to Wishlist</span>
                        </>
                      )}
                    </button>

                    {wishlistError && (
                      <p className="text-center text-xs text-[#8B0D1A]">{wishlistError}</p>
                    )}

                    <div className="grid grid-cols-3 gap-2 border-t border-[#242424] pt-4 text-center">
                      <div className="flex flex-col items-center p-2">
                        <Truck size={18} className="mb-1 text-[#8B0D1A]" />
                        <span className="text-[11px] font-semibold text-[#b8b3ab]">Fast Shipping</span>
                      </div>
                      <div className="flex flex-col items-center p-2">
                        <ShieldCheck size={18} className="mb-1 text-[#8B0D1A]" />
                        <span className="text-[11px] font-semibold text-[#b8b3ab]">Genuine Product</span>
                      </div>
                      <div className="flex flex-col items-center p-2">
                        <RotateCcw size={18} className="mb-1 text-[#8B0D1A]" />
                        <span className="text-[11px] font-semibold text-[#b8b3ab]">7-Day Returns</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default ProductDetails;
