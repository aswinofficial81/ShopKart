import { Link } from "react-router-dom";
import { Package, ShieldCheck, ChevronRight, Calendar } from "lucide-react";

function OrderCard({ order }) {
  const formattedDate = order.createdAt
    ? new Date(order.createdAt).toLocaleDateString("en-IN", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit"
      })
    : "";

  const totalQuantity = (order.items || []).reduce(
    (sum, item) => sum + (item.quantity || 0),
    0
  );

  return (
    <div className="rounded-2xl border border-[#242424] bg-[#141414] p-5 shadow-lg transition-all hover:border-[#383838]">
      <div className="flex flex-col gap-3 border-b border-[#242424] pb-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-[#7a7670]">Order</span>
            <span className="font-mono text-xs font-bold text-[#F5F2ED]">
              #{order._id}
            </span>
          </div>
          {formattedDate && (
            <div className="mt-1 flex items-center gap-1.5 text-xs text-[#b8b3ab]">
              <Calendar size={13} className="text-[#7a7670]" />
              <span>{formattedDate}</span>
            </div>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <span
            className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold ${
              order.paymentStatus === "PAID"
                ? "border border-emerald-500/30 bg-emerald-500/15 text-emerald-400"
                : "border border-amber-500/30 bg-amber-500/15 text-amber-400"
            }`}
          >
            <ShieldCheck size={12} />
            {order.paymentStatus}
          </span>

          <span className="inline-flex items-center gap-1 rounded-full border border-[#8B0D1A]/40 bg-[#8B0D1A]/15 px-2.5 py-0.5 text-xs font-semibold text-[#F5F2ED]">
            <Package size={12} className="text-[#8B0D1A]" />
            {order.status}
          </span>
        </div>
      </div>

      <div className="my-4 space-y-3">
        {(order.items || []).map((item, idx) => (
          <div
            key={item.product?._id || item._id || idx}
            className="flex items-center justify-between gap-3 text-sm"
          >
            <div className="flex items-center gap-3 min-w-0">
              {item.image && (
                <img
                  src={item.image}
                  alt={item.name}
                  className="h-12 w-12 shrink-0 rounded-xl border border-[#2c2c2c] object-cover"
                />
              )}
              <div className="min-w-0">
                <p className="truncate font-semibold text-[#F5F2ED]">
                  {item.name}
                </p>
                <p className="text-xs text-[#7a7670]">
                  Qty: {item.quantity} × ₹{item.price?.toLocaleString("en-IN")}
                </p>
              </div>
            </div>

            <p className="shrink-0 text-sm font-bold text-[#F5F2ED]">
              ₹{((item.price || 0) * item.quantity).toLocaleString("en-IN")}
            </p>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between border-t border-[#242424] pt-4">
        <div>
          <span className="text-xs text-[#7a7670]">
            {totalQuantity} {totalQuantity === 1 ? "item" : "items"}
          </span>
          <p className="text-lg font-extrabold text-[#F5F2ED]">
            ₹{order.totalAmount?.toLocaleString("en-IN")}
          </p>
        </div>

        <Link
          to={`/orders/${order._id}`}
          className="flex items-center gap-1.5 rounded-xl border border-[#2c2c2c] bg-[#0B0B0B] px-4 py-2 text-xs font-bold text-[#F5F2ED] transition hover:border-[#8B0D1A] hover:bg-[#8B0D1A]/15 hover:text-[#F5F2ED]"
        >
          <span>View Details</span>
          <ChevronRight size={14} />
        </Link>
      </div>
    </div>
  );
}

export default OrderCard;
