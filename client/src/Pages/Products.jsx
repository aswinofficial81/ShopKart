import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import api from "../Services/api";
import ProductCard from "../components/ProductCard";
import SearchBar from "../components/SearchBar";
import Navbar from "../components/Navbar";
import { RefreshCw, AlertTriangle, PackageOpen } from "lucide-react";

function Products() {
  const [searchParams, setSearchParams] = useSearchParams();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const search = searchParams.get("search") || "";
  const category = searchParams.get("category") || "All Categories";

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError("");

      try {
        const params = {};
        if (search.trim()) {
          params.search = search.trim();
        }
        if (category && category !== "All Categories") {
          params.category = category;
        }

        const response = await api.get("/products", { params });
        setProducts(response.data.products || []);
      } catch (err) {
        console.error(err);
        setError("Something went wrong while loading products.");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [search, category]);

  const handleSearchChange = (value) => {
    const newParams = new URLSearchParams(searchParams);
    if (value.trim()) {
      newParams.set("search", value);
    } else {
      newParams.delete("search");
    }
    setSearchParams(newParams);
  };

  const handleCategoryChange = (value) => {
    const newParams = new URLSearchParams(searchParams);
    if (value && value !== "All Categories") {
      newParams.set("category", value);
    } else {
      newParams.delete("category");
    }
    setSearchParams(newParams);
  };

  const handleResetFilters = () => {
    setSearchParams({});
  };

  return (
    <div className="min-h-screen bg-[#0B0B0B] text-[#F5F2ED]">
      <Navbar />

      <main className="mx-auto max-w-7xl px-5 py-8 sm:px-8">
        <div className="mb-8">
          <p className="text-xs font-bold uppercase tracking-wider text-[#8B0D1A]">
            Product Catalog
          </p>
          <div className="mt-1 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-3xl font-extrabold tracking-tight text-[#F5F2ED] sm:text-4xl">
                Explore Products
              </h1>
              <p className="mt-1 text-sm text-[#b8b3ab]">
                Browse our curated selection of high quality products.
              </p>
            </div>
            {!loading && !error && (
              <span className="self-start rounded-full border border-[#2c2c2c] bg-[#141414] px-3.5 py-1 text-xs font-semibold text-[#F5F2ED] sm:self-auto">
                {products.length} {products.length === 1 ? "Product" : "Products"} found
              </span>
            )}
          </div>
        </div>

        <div className="mb-8 rounded-2xl border border-[#242424] bg-[#141414] p-4 shadow-lg shadow-black/50">
          <SearchBar
            searchTerm={search}
            onSearchChange={handleSearchChange}
            category={category}
            onCategoryChange={handleCategoryChange}
          />
        </div>

        {loading && (
          <div className="flex min-h-[350px] flex-col items-center justify-center rounded-2xl border border-[#242424] bg-[#141414] p-8 text-center shadow-lg">
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full border border-[#8B0D1A]/30 bg-[#8B0D1A]/10 text-[#8B0D1A] animate-spin">
              <RefreshCw size={28} />
            </div>
            <p className="text-base font-semibold text-[#F5F2ED]">
              Loading products...
            </p>
            <p className="mt-1 text-xs text-[#7a7670]">
              Fetching catalog from server
            </p>
          </div>
        )}

        {!loading && error && (
          <div className="flex min-h-[350px] flex-col items-center justify-center rounded-2xl border border-[#8B0D1A]/50 bg-[#141414] p-8 text-center shadow-lg">
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full border border-[#8B0D1A]/40 bg-[#8B0D1A]/15 text-[#8B0D1A]">
              <AlertTriangle size={28} />
            </div>
            <p className="text-base font-bold text-[#F5F2ED]">
              {error}
            </p>
            <button
              onClick={() => handleResetFilters()}
              className="mt-4 rounded-xl bg-[#8B0D1A] px-5 py-2.5 text-sm font-semibold text-[#F5F2ED] shadow-md shadow-[#8B0D1A]/30 hover:bg-[#a81323]"
            >
              Try Again
            </button>
          </div>
        )}

        {!loading && !error && products.length === 0 && (
          <div className="flex min-h-[350px] flex-col items-center justify-center rounded-2xl border border-dashed border-[#2c2c2c] bg-[#141414] p-8 text-center shadow-lg">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#1c1c1c] text-[#7a7670]">
              <PackageOpen size={32} />
            </div>
            <h3 className="text-lg font-bold text-[#F5F2ED]">
              No products found.
            </h3>
            <p className="mt-1 max-w-sm text-sm text-[#b8b3ab]">
              We couldn't find any products matching your current search or category filter.
            </p>
            <button
              onClick={handleResetFilters}
              className="mt-5 inline-flex items-center gap-2 rounded-xl bg-[#8B0D1A] px-5 py-2.5 text-sm font-semibold text-[#F5F2ED] shadow-md shadow-[#8B0D1A]/30 hover:bg-[#a81323]"
            >
              <RefreshCw size={15} />
              Reset Filters
            </button>
          </div>
        )}

        {!loading && !error && products.length > 0 && (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {products.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

export default Products;
