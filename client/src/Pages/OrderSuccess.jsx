import { useState, useEffect } from "react";
import { useParams, useLocation, useNavigate, Link } from "react-router-dom";
import { CheckCircle2, Package, ShoppingBag, ArrowRight, Loader2, AlertTriangle, ShieldCheck } from "lucide-react";
import Navbar from "../components/Navbar";
import api from "../Services/api";

function OrderSuccess() {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const [order, setOrder] = useState(location.state?.order || null);
  const [loading, setLoading] = useState(!location.state?.order);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!order && id) {
      const fetchOrder = async () => {
        try {
          setLoading(true);
          setError("");
          const res = await api.get(`/orders/${id}`);
          if (res.data.success && res.data.order) {
            setOrder(res.data.order);
          } else {
            setError("Order not found.");
          }
        } catch (err) {
          setError(
            err.response?.data?.message || "Failed to load order details."
          );
        } finally {
          setLoading(false);
        }
      };
      fetchOrder();
    }
  }, [id, order]);

  return (
    <div className="min-h-screen bg-[#0B0B0B] text-[#F5F2ED]">
      <Navbar />

      <main className="mx-auto max-w-3xl px-5 py-12 sm:px-8">
        {loading && (
          <div className="flex min-h-[350px] flex-col items-center justify-center rounded-2xl border border-[#242424] bg-[#141414] p-8 text-center shadow-lg">
            <Loader2 size={36} className="animate-spin text-[#8B0D1A]" />
            <p className="mt-4 text-base font-semibold text-[#F5F2ED]">
              Loading order details...
            </p>
          </div>
        )}

        {!loading && error && (
          <div className="flex min-h-[350px] flex-col items-center justify-center rounded-2xl border border-[#8B0D1A]/50 bg-[#141414] p-8 text-center shadow-lg">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full border border-[#8B0D1A]/40 bg-[#8B0D1A]/15 text-[#8B0D1A]">
              <AlertTriangle size={32} />
            </div>
            <h2 className="text-xl font-bold text-[#F5F2ED]">{error}</h2>
            <div className="mt-6 flex gap-4">
              <Link
                to="/orders"
                className="rounded-xl bg-[#8B0D1A] px-5 py-2.5 text-sm font-semibold text-[#F5F2ED] transition hover:bg-[#a81323]"
              >
                View My Orders
              </Link>
              <Link
                to="/products"
                className="rounded-xl border border-[#2c2c2c] bg-[#141414] px-5 py-2.5 text-sm font-semibold text-[#F5F2ED] transition hover:border-[#8B0D1A]"
              >
                Continue Shopping
              </Link>
            </div>
          </div>
        )}

        {!loading && !error && order && (
          <div className="rounded-2xl border border-[#242424] bg-[#141414] p-6 shadow-2xl sm:p-8">
            <div className="text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-emerald-500/40 bg-emerald-500/10 text-emerald-400">
                <CheckCircle2 size={36} />
              </div>
              <h1 className="mt-4 text-2xl font-extrabold sm:text-3xl text-[#F5F2ED]">
                Order Placed Successfully!
              </h1>
              <p className="mt-2 text-sm text-[#b8b3ab]">
                Thank you for your purchase. Your payment has been verified.
              </p>
            </div>

            <div className="mt-8 rounded-xl border border-[#2c2c2c] bg-[#0B0B0B] p-5">
              <div className="grid grid-cols-2 gap-4 text-sm sm:grid-cols-4">
                <div>
                  <span className="text-xs text-[#7a7670]">Order ID</span>
                  <p className="mt-1 font-mono text-xs font-bold text-[#F5F2ED] break-all">
                    {order._id}
                  </p>
                </div>
                <div>
                  <span className="text-xs text-[#7a7670]">Total Amount</span>
                  <p className="mt-1 text-base font-extrabold text-[#F5F2ED]">
                    ₹{order.totalAmount?.toLocaleString("en-IN")}
                  </p>
                </div>
                <div>
                  <span className="text-xs text-[#7a7670]">Payment Status</span>
                  <p className="mt-1">
                    <span className="inline-flex items-center gap-1 rounded-full border border-emerald-500/30 bg-emerald-500/15 px-2.5 py-0.5 text-xs font-semibold text-emerald-400">
                      <ShieldCheck size={12} />
                      {order.paymentStatus}
                    </span>
                  </p>
                </div>
                <div>
                  <span className="text-xs text-[#7a7670]">Order Status</span>
                  <p className="mt-1">
                    <span className="inline-flex items-center gap-1 rounded-full border border-[#8B0D1A]/40 bg-[#8B0D1A]/15 px-2.5 py-0.5 text-xs font-semibold text-[#F5F2ED]">
                      <Package size={12} className="text-[#8B0D1A]" />
                      {order.status}
                    </span>
                  </p>
                </div>
              </div>
            </div>

            {order.items && order.items.length > 0 && (
              <div className="mt-6">
                <h3 className="mb-3 text-sm font-bold uppercase tracking-wider text-[#b8b3ab]">
                  Items Ordered ({order.items.length})
                </h3>
                <div className="divide-y divide-[#242424] rounded-xl border border-[#242424] bg-[#0B0B0B] p-4">
                  {order.items.map((item, index) => (
                    <div
                      key={item.product?._id || item._id || index}
                      className="flex items-center justify-between py-3 first:pt-0 last:pb-0"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        {item.image && (
                          <img
                            src={item.image}
                            alt={item.name}
                            className="h-12 w-12 shrink-0 rounded-lg border border-[#2c2c2c] object-cover"
                          />
                        )}
                        <div className="min-w-0">
                          <p className="truncate text-sm font-semibold text-[#F5F2ED]">
                            {item.name}
                          </p>
                          <p className="text-xs text-[#7a7670]">
                            Qty: {item.quantity} × ₹{item.price?.toLocaleString("en-IN")}
                          </p>
                        </div>
                      </div>
                      <span className="shrink-0 text-sm font-bold text-[#F5F2ED]">
                        ₹{((item.price || 0) * item.quantity).toLocaleString("en-IN")}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {order.shippingAddress && (
              <div className="mt-6 rounded-xl border border-[#242424] bg-[#0B0B0B] p-4 text-sm">
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#7a7670]">
                  Shipping Address
                </h3>
                <p className="mt-1 font-semibold text-[#F5F2ED]">
                  {order.shippingAddress.fullName} ({order.shippingAddress.phone})
                </p>
                <p className="text-xs text-[#b8b3ab]">
                  {order.shippingAddress.addressLine1}, {order.shippingAddress.city},{" "}
                  {order.shippingAddress.state} - {order.shippingAddress.pincode}
                </p>
              </div>
            )}

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-end">
              <button
                onClick={() => navigate("/products")}
                className="flex items-center justify-center gap-2 rounded-xl border border-[#2c2c2c] bg-[#141414] px-6 py-3 text-sm font-semibold text-[#F5F2ED] transition hover:border-[#8B0D1A] hover:bg-[#8B0D1A]/15"
              >
                <ShoppingBag size={16} />
                Continue Shopping
              </button>

              <button
                onClick={() => navigate("/orders")}
                className="flex items-center justify-center gap-2 rounded-xl bg-[#8B0D1A] px-6 py-3 text-sm font-bold text-[#F5F2ED] shadow-md shadow-[#8B0D1A]/30 transition hover:bg-[#a81323]"
              >
                <span>View My Orders</span>
                <ArrowRight size={16} />
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default OrderSuccess;
