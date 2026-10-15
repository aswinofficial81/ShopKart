import { useNavigate } from "react-router-dom";
import { Eye, Trash2, Tag, AlertCircle, CheckCircle, Loader2 } from "lucide-react";

function WishlistCard({ product, onRemove, isRemoving }) {
  const navigate = useNavigate();

  const isOutOfStock = product.stock <= 0;
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
            className={`inline-flex items-center gap-1 rounded-md border px-2 py-0.5 text-xs font-semibold ${isOutOfStock
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

        <div className="mt-auto pt-4">
          <div className="mb-3 flex items-baseline justify-between border-t border-[#242424] pt-3">
            <span className="text-xs uppercase tracking-wider text-[#7a7670]">Price</span>
            <span className="text-xl font-extrabold text-[#F5F2ED]">
              ₹{product.price.toLocaleString("en-IN")}
            </span>
          </div>

          <div className="flex flex-col gap-2">
            <button
              onClick={() => navigate(`/products/${product._id}`)}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#8B0D1A] px-4 py-2.5 text-sm font-semibold text-[#F5F2ED] shadow-md shadow-[#8B0D1A]/25 transition-all duration-200 hover:bg-[#a81323] hover:shadow-[#8B0D1A]/40 active:scale-[0.98]"
            >
              <Eye size={16} />
              <span>View Details</span>
            </button>

            <button
              onClick={() => onRemove(product._id)}
              disabled={isRemoving}
              className="flex w-full items-center justify-center gap-2 rounded-xl border border-[#2c2c2c] bg-[#181818] px-4 py-2.5 text-sm font-semibold text-[#b8b3ab] transition-all duration-200 hover:border-[#8B0D1A] hover:bg-[#8B0D1A]/15 hover:text-[#F5F2ED] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isRemoving ? (
                <>
                  <Loader2 size={16} className="animate-spin text-[#8B0D1A]" />
                  <span>Removing...</span>
                </>
              ) : (
                <>
                  <Trash2 size={16} className="text-[#8B0D1A]" />
                  <span>Remove</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default WishlistCard;
