import { ShoppingCart, User, Search } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { Skeleton } from "../ui/skeleton";

export default function Navbar() {
  const { data: user, isLoading } = useAuth();

  return (
    <nav className="bg-biscuit shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between py-3 px-6">
        <Link to="/" className="text-2xl font-bold text-white">
          ShopSphere
        </Link>

        <div className="flex items-center bg-white rounded-md overflow-hidden w-[40%]">
          <input
            type="text"
            placeholder="Search products..."
            className="w-full px-4 py-2 outline-none text-gray-700"
          />

          <button className="bg-biscuit-dark px-4 py-2 text-white">
            <Search size={18} />
          </button>
        </div>

        <div className="flex gap-8 items-center text-white">
          <Link to="/products">Products</Link>

          <Link to="/cart" className="flex items-center gap-2">
            <ShoppingCart size={20} />
            Cart
          </Link>

          {isLoading ? (
            <Skeleton className="h-6 w-6 rounded-full" />
          ) : !user ? (
            <Link to="/auth">Login</Link>
          ) : (
            <Link to="/profile" className="flex items-center">
              <User size={22} />
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
