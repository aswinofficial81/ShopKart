import { Link, useLocation, useNavigate } from "react-router-dom";
import { ShoppingBag, Home, Heart, LogOut, Package, ShoppingCart, Receipt } from "lucide-react";
import api from "../Services/api";
import { useCart } from "../context/CartContext";

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { totalCount } = useCart();

  const handleLogout = async () => {
    try {
      await api.post("/customers/logout");
      navigate("/login");
    } catch (error) {
      console.error(error);
      navigate("/login");
    }
  };

  const navLinks = [
    { name: "Home", path: "/home", icon: Home },
    { name: "Products", path: "/products", icon: Package },
    { name: "Wishlist", path: "/wishlist", icon: Heart },
    { name: "Orders", path: "/orders", icon: Receipt },
    { name: `Cart (${totalCount})`, path: "/cart", icon: ShoppingCart },
  ];

  return (
    <nav className="sticky top-0 z-30 flex items-center justify-between border-b border-[#242424] bg-[#0B0B0B]/95 px-6 py-4 shadow-xl backdrop-blur-md sm:px-12">
      <Link to="/products" className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#8B0D1A] shadow-md shadow-[#8B0D1A]/30 transition-transform hover:scale-105">
          <ShoppingBag size={20} className="text-[#F5F2ED]" />
        </div>
        <h2 className="text-2xl font-extrabold tracking-tight text-[#F5F2ED]">
          Shop<span className="text-[#8B0D1A]">Kart</span>
        </h2>
      </Link>

      <div className="flex items-center gap-2 sm:gap-4">
        {navLinks.map((link) => {
          const Icon = link.icon;
          const isActive = location.pathname === link.path;
          return (
            <Link
              key={link.path}
              to={link.path}
              className={`flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-sm font-semibold transition-all duration-200 ${
                isActive
                  ? "border border-[#8B0D1A] bg-[#8B0D1A]/20 text-[#F5F2ED] shadow-sm shadow-[#8B0D1A]/20"
                  : "text-[#b8b3ab] hover:bg-[#181818] hover:text-[#F5F2ED]"
              }`}
            >
              <Icon size={16} className={isActive ? "text-[#8B0D1A]" : ""} />
              <span>{link.name}</span>
            </Link>
          );
        })}

        <button
          onClick={handleLogout}
          className="flex items-center gap-1.5 rounded-xl border border-[#2c2c2c] bg-[#141414] px-3.5 py-2 text-sm font-semibold text-[#b8b3ab] transition-all hover:border-[#8B0D1A] hover:bg-[#8B0D1A]/15 hover:text-[#F5F2ED]"
        >
          <LogOut size={16} />
          <span>Logout</span>
        </button>
      </div>
    </nav>
  );
}

export default Navbar;
