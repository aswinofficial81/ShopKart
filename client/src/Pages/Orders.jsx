import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Package, ShoppingBag, RefreshCw, AlertTriangle, Loader2 } from "lucide-react";
import Navbar from "../components/Navbar";
import OrderCard from "../components/OrderCard";
import api from "../Services/api";

function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchOrders = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await api.get("/orders");
      if (response.data.success) {
        setOrders(response.data.orders || []);
      } else {
        setError("Unable to load orders.");
      }
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to load orders. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  return (
    <div className="min-h-screen bg-[#0B0B0B] text-[#F5F2ED]">
      <Navbar />

      <main className="mx-auto max-w-5xl px-5 py-8 sm:px-8">
        <div className="mb-8">
          <p className="text-xs font-bold uppercase tracking-wider text-[#8B0D1A]">
            Purchase History
          </p>
          <div className="mt-1 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-3xl font-extrabold sm:text-4xl text-[#F5F2ED]">
                My Orders
              </h1>
              <p className="mt-1 text-sm text-[#b8b3ab]">
                View and track your previous orders and payment status.
              </p>
            </div>

            {!loading && !error && orders.length > 0 && (
              <span className="self-start rounded-full border border-[#2c2c2c] bg-[#141414] px-3.5 py-1.5 text-xs font-bold text-[#F5F2ED] sm:self-auto">
                {orders.length} {orders.length === 1 ? "Order" : "Orders"} Placed
              </span>
            )}
          </div>
        </div>

        {loading && (
          <div className="flex min-h-[350px] flex-col items-center justify-center rounded-2xl border border-[#242424] bg-[#141414] p-8 text-center shadow-lg">
            <Loader2 size={36} className="animate-spin text-[#8B0D1A]" />
            <p className="mt-4 text-base font-semibold text-[#F5F2ED]">
              Loading your orders...
            </p>
          </div>
        )}

        {!loading && error && (
          <div className="flex min-h-[350px] flex-col items-center justify-center rounded-2xl border border-[#8B0D1A]/50 bg-[#141414] p-8 text-center shadow-lg">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full border border-[#8B0D1A]/40 bg-[#8B0D1A]/15 text-[#8B0D1A]">
              <AlertTriangle size={32} />
            </div>
            <h3 className="text-xl font-bold text-[#F5F2ED]">{error}</h3>
            <button
              onClick={fetchOrders}
              className="mt-5 flex items-center gap-2 rounded-xl bg-[#8B0D1A] px-6 py-2.5 text-sm font-semibold text-[#F5F2ED] shadow-md shadow-[#8B0D1A]/30 transition hover:bg-[#a81323] active:scale-95"
            >
              <RefreshCw size={16} />
              <span>Retry</span>
            </button>
          </div>
        )}

        {!loading && !error && orders.length === 0 && (
          <div className="flex min-h-[400px] flex-col items-center justify-center rounded-2xl border border-[#242424] bg-[#141414] p-8 text-center shadow-lg">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full border border-[#8B0D1A]/30 bg-[#8B0D1A]/10 text-[#8B0D1A]">
              <Package size={34} />
            </div>
            <h3 className="text-2xl font-bold text-[#F5F2ED]">
              You have not placed any orders yet.
            </h3>
            <p className="mt-2 text-sm text-[#b8b3ab]">
              Explore our collection and find something you like.
            </p>
            <Link
              to="/products"
              className="mt-6 flex items-center gap-2 rounded-xl bg-[#8B0D1A] px-6 py-2.5 text-sm font-semibold text-[#F5F2ED] shadow-md shadow-[#8B0D1A]/30 transition hover:bg-[#a81323] active:scale-95"
            >
              <ShoppingBag size={17} />
              <span>Start Shopping</span>
            </Link>
          </div>
        )}

        {!loading && !error && orders.length > 0 && (
          <div className="space-y-5">
            {orders.map((order) => (
              <OrderCard key={order._id} order={order} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

export default Orders;
