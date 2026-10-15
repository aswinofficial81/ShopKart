import { Search, Filter, X } from "lucide-react";

function SearchBar({
  searchTerm,
  onSearchChange,
  category,
  onCategoryChange,
}) {
  const categories = [
    "All Categories",
    "Electronics",
    "Fashion",
    "Books",
    "Home",
  ];

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
      <div className="relative flex flex-1 items-center rounded-xl border border-[#262626] bg-[#141414] px-4 py-3 shadow-inner transition-all focus-within:border-[#8B0D1A] focus-within:ring-4 focus-within:ring-[#8B0D1A]/15">
        <Search size={18} className="text-[#8B0D1A]" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search luxury products..."
          className="ml-3 w-full bg-transparent text-sm text-[#F5F2ED] outline-none placeholder:text-[#7a7670]"
        />
        {searchTerm && (
          <button
            type="button"
            onClick={() => onSearchChange("")}
            className="text-[#7a7670] hover:text-[#F5F2ED]"
          >
            <X size={16} />
          </button>
        )}
      </div>

      <div className="relative flex items-center rounded-xl border border-[#262626] bg-[#141414] px-4 py-3 shadow-inner transition-all focus-within:border-[#8B0D1A] focus-within:ring-4 focus-within:ring-[#8B0D1A]/15 sm:w-60">
        <Filter size={18} className="text-[#8B0D1A]" />
        <select
          value={category}
          onChange={(e) => onCategoryChange(e.target.value)}
          className="ml-3 w-full cursor-pointer bg-transparent text-sm font-medium text-[#F5F2ED] outline-none [&>option]:bg-[#141414] [&>option]:text-[#F5F2ED]"
        >
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}

export default SearchBar;
