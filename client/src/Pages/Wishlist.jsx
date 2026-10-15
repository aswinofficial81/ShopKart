import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../Services/api";
import Navbar from "../components/Navbar";
import WishlistCard from "../components/WishlistCard";
import { Heart, RefreshCw, AlertTriangle, ShoppingBag } from "lucide-react";

function Wishlist() {
  const navigate = useNavigate();
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [removingId, setRemovingId] = useState(null);

  const fetchWishlist = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await api.get("/wishlist");
      setWishlist(response.data.wishlist || []);
    } catch (err) {
      console.error(err);
      if (err.response?.status === 401) {
        navigate("/login");
        return;
      }
      setError("Unable to load wishlist.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let isMounted = true;

    const loadData = async () => {
      try {
        const response = await api.get("/wishlist");
        if (isMounted) {
          setWishlist(response.data.wishlist || []);
        }
      } catch (err) {
        console.error(err);
        if (err.response?.status === 401) {
          navigate("/login");
          return;
        }
        if (isMounted) {
          setError("Unable to load wishlist.");
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadData();

    return () => {
      isMounted = false;
    };
  }, [navigate]);

  const handleRemove = async (productId) => {
    setRemovingId(productId);

    try {
      await api.delete(`/wishlist/${productId}`);
      setWishlist((prev) => prev.filter((item) => item._id !== productId));
    } catch (err) {
      console.error(err);
      alert("Failed to remove product. Please try again.");
    } finally {
      setRemovingId(null);
    }
  };

  return (
    <div className="min-h-screen bg-[#0B0B0B] text-[#F5F2ED]">
      <Navbar />

      <main className="mx-auto max-w-7xl px-5 py-8 sm:px-8">
        <div className="mb-8">
          <p className="text-xs font-bold uppercase tracking-wider text-[#8B0D1A]">
            My Collection
          </p>
          <div className="mt-1 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-3xl font-extrabold tracking-tight text-[#F5F2ED] sm:text-4xl">
                My Wishlist
              </h1>
              <p className="mt-1 text-sm text-[#b8b3ab]">
                Manage your saved products and favorite items.
              </p>
            </div>
            {!loading && !error && wishlist.length > 0 && (
              <span className="self-start rounded-full border border-[#2c2c2c] bg-[#141414] px-3.5 py-1.5 text-xs font-bold text-[#F5F2ED] sm:self-auto">
                {wishlist.length} {wishlist.length === 1 ? "Item" : "Items"}
              </span>
            )}
          </div>
        </div>

        {loading && (
          <div className="flex min-h-[400px] flex-col items-center justify-center rounded-2xl border border-[#242424] bg-[#141414] p-8 text-center shadow-lg">
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full border border-[#8B0D1A]/30 bg-[#8B0D1A]/10 text-[#8B0D1A] animate-spin">
              <RefreshCw size={28} />
            </div>
            <p className="text-base font-semibold text-[#F5F2ED]">
              Loading your wishlist...
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
              onClick={fetchWishlist}
              className="mt-5 flex items-center gap-2 rounded-xl bg-[#8B0D1A] px-6 py-2.5 text-sm font-semibold text-[#F5F2ED] shadow-md shadow-[#8B0D1A]/30 transition-all hover:bg-[#a81323] active:scale-95"
            >
              <RefreshCw size={16} />
              <span>Try Again</span>
            </button>
          </div>
        )}

        {!loading && !error && wishlist.length === 0 && (
          <div className="flex min-h-[400px] flex-col items-center justify-center rounded-2xl border border-[#242424] bg-[#141414] p-8 text-center shadow-lg">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full border border-[#8B0D1A]/30 bg-[#8B0D1A]/10 text-[#8B0D1A]">
              <Heart size={34} className="fill-[#8B0D1A] text-[#8B0D1A]" />
            </div>
            <h3 className="text-2xl font-bold text-[#F5F2ED]">
              Your wishlist is empty ❤️
            </h3>
            <p className="mt-2 text-sm text-[#b8b3ab]">
              Start saving products you love.
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

        {!loading && !error && wishlist.length > 0 && (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {wishlist.map((product) => (
              <WishlistCard
                key={product._id}
                product={product}
                onRemove={handleRemove}
                isRemoving={removingId === product._id}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

export default Wishlist;
