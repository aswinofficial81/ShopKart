import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { ArrowLeft, Package, ShieldCheck, Calendar, MapPin, CreditCard, AlertTriangle, Loader2 } from "lucide-react";
import Navbar from "../components/Navbar";
import api from "../Services/api";

function OrderDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchOrder = async () => {
    setLoading(true);
    setError("");
    try {
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

  useEffect(() => {
    fetchOrder();
  }, [id]);

  const formattedDate = order?.createdAt
    ? new Date(order.createdAt).toLocaleDateString("en-IN", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit"
      })
    : "";

  return (
    <div className="min-h-screen bg-[#0B0B0B] text-[#F5F2ED]">
      <Navbar />

      <main className="mx-auto max-w-4xl px-5 py-8 sm:px-8">
        <button
          onClick={() => navigate("/orders")}
          className="mb-6 flex items-center gap-2 text-sm font-semibold text-[#b8b3ab] hover:text-[#F5F2ED]"
        >
          <ArrowLeft size={16} />
          Back to My Orders
        </button>

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
              <button
                onClick={fetchOrder}
                className="rounded-xl bg-[#8B0D1A] px-5 py-2.5 text-sm font-semibold text-[#F5F2ED] transition hover:bg-[#a81323]"
              >
                Retry
              </button>
              <Link
                to="/orders"
                className="rounded-xl border border-[#2c2c2c] bg-[#141414] px-5 py-2.5 text-sm font-semibold text-[#F5F2ED] transition hover:border-[#8B0D1A]"
              >
                All Orders
              </Link>
            </div>
          </div>
        )}

        {!loading && !error && order && (
          <div className="space-y-6">
            <div className="flex flex-col gap-3 rounded-2xl border border-[#242424] bg-[#141414] p-6 shadow-xl sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-[#8B0D1A]">
                  Order Details
                </p>
                <h1 className="mt-1 font-mono text-xl font-extrabold sm:text-2xl text-[#F5F2ED] break-all">
                  #{order._id}
                </h1>
                {formattedDate && (
                  <div className="mt-1 flex items-center gap-1.5 text-xs text-[#b8b3ab]">
                    <Calendar size={13} className="text-[#7a7670]" />
                    <span>Placed on {formattedDate}</span>
                  </div>
                )}
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <span
                  className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold ${
                    order.paymentStatus === "PAID"
                      ? "border border-emerald-500/30 bg-emerald-500/15 text-emerald-400"
                      : "border border-amber-500/30 bg-amber-500/15 text-amber-400"
                  }`}
                >
                  <ShieldCheck size={13} />
                  Payment: {order.paymentStatus}
                </span>

                <span className="inline-flex items-center gap-1 rounded-full border border-[#8B0D1A]/40 bg-[#8B0D1A]/15 px-3 py-1 text-xs font-semibold text-[#F5F2ED]">
                  <Package size={13} className="text-[#8B0D1A]" />
                  Status: {order.status}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div className="rounded-2xl border border-[#242424] bg-[#141414] p-6 shadow-xl">
                <div className="mb-3 flex items-center gap-2 text-sm font-bold text-[#F5F2ED]">
                  <MapPin size={16} className="text-[#8B0D1A]" />
                  <span>Shipping Address</span>
                </div>
                {order.shippingAddress && (
                  <div className="text-sm">
                    <p className="font-bold text-[#F5F2ED]">
                      {order.shippingAddress.fullName}
                    </p>
                    <p className="mt-0.5 text-[#b8b3ab]">
                      Phone: {order.shippingAddress.phone}
                    </p>
                    <p className="mt-2 text-[#b8b3ab]">
                      {order.shippingAddress.addressLine1}
                    </p>
                    <p className="text-[#b8b3ab]">
                      {order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.pincode}
                    </p>
                  </div>
                )}
              </div>

              <div className="rounded-2xl border border-[#242424] bg-[#141414] p-6 shadow-xl">
                <div className="mb-3 flex items-center gap-2 text-sm font-bold text-[#F5F2ED]">
                  <CreditCard size={16} className="text-[#8B0D1A]" />
                  <span>Payment Information</span>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-[#7a7670]">Payment Method</span>
                    <span className="font-semibold text-[#F5F2ED]">Razorpay</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#7a7670]">Payment Status</span>
                    <span className="font-semibold text-[#F5F2ED]">{order.paymentStatus}</span>
                  </div>
                  {order.razorpayPaymentId && (
                    <div className="flex justify-between">
                      <span className="text-[#7a7670]">Transaction ID</span>
                      <span className="font-mono text-xs font-semibold text-[#b8b3ab]">
                        {order.razorpayPaymentId}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-[#242424] bg-[#141414] p-6 shadow-xl">
              <h2 className="mb-4 text-lg font-bold text-[#F5F2ED]">
                Ordered Products
              </h2>

              <div className="divide-y divide-[#242424]">
                {(order.items || []).map((item, idx) => (
                  <div
                    key={item.product?._id || item._id || idx}
                    className="flex flex-col gap-4 py-4 first:pt-0 last:pb-0 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div className="flex items-center gap-4 min-w-0">
                      {item.image && (
                        <img
                          src={item.image}
                          alt={item.name}
                          className="h-16 w-16 shrink-0 rounded-xl border border-[#2c2c2c] object-cover"
                        />
                      )}
                      <div className="min-w-0">
                        <Link
                          to={item.product ? `/products/${item.product}` : "#"}
                          className="font-bold text-[#F5F2ED] hover:text-[#8B0D1A]"
                        >
                          {item.name}
                        </Link>
                        <p className="mt-0.5 text-xs text-[#7a7670]">
                          Snapshot Price: ₹{item.price?.toLocaleString("en-IN")} × {item.quantity}
                        </p>
                      </div>
                    </div>

                    <div className="text-right">
                      <p className="text-xs text-[#7a7670]">Item Total</p>
                      <p className="text-base font-extrabold text-[#F5F2ED]">
                        ₹{((item.price || 0) * item.quantity).toLocaleString("en-IN")}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 border-t border-[#242424] pt-4">
                <div className="flex items-center justify-between">
                  <span className="text-base font-bold text-[#F5F2ED]">
                    Grand Total
                  </span>
                  <span className="text-2xl font-extrabold text-[#F5F2ED]">
                    ₹{order.totalAmount?.toLocaleString("en-IN")}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default OrderDetails;
