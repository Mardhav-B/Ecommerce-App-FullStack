import { useState } from "react";
import type { FormEvent } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Search, ShoppingCart, User } from "lucide-react";

import { useAuth } from "../../hooks/useAuth";
import { Skeleton } from "../ui/skeleton";

export default function Navbar() {
  const { data: user, isLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [search, setSearch] = useState("");

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const query = search.trim();

    navigate(query ? `/products?search=${encodeURIComponent(query)}` : "/products");
  };

  const isProductsPage = location.pathname.startsWith("/products");

  return (
    <nav className="sticky top-0 z-50 border-b border-white/50 bg-[rgba(244,230,217,0.92)] backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center gap-4 px-4 py-4 md:px-6">
        <Link to="/" className="min-w-fit">
          <div className="text-2xl font-black tracking-[0.18em] text-biscuit-dark">
            SHOPSPHERE
          </div>
          <div className="text-[10px] uppercase tracking-[0.35em] text-slate-500">
            Everyday premium
          </div>
        </Link>

        <form
          onSubmit={handleSubmit}
          className="hidden flex-1 items-center overflow-hidden rounded-full border border-biscuit/30 bg-white shadow-sm md:flex"
        >
          <Search className="ml-4 size-4 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search products, categories, and brands"
            className="w-full bg-transparent px-3 py-3 text-sm outline-none placeholder:text-slate-400"
          />
          <button className="rounded-full bg-biscuit px-5 py-3 text-sm font-semibold text-white transition hover:bg-biscuit-dark">
            Search
          </button>
        </form>

        <div className="ml-auto flex items-center gap-3 text-sm font-medium text-slate-700 md:gap-6">
          <Link
            to="/products"
            className={`transition hover:text-biscuit-dark ${
              isProductsPage ? "text-biscuit-dark" : ""
            }`}
          >
            Products
          </Link>

          <Link
            to="/cart"
            className="hidden items-center gap-2 transition hover:text-biscuit-dark sm:flex"
          >
            <ShoppingCart className="size-4" />
            Cart
          </Link>

          {isLoading ? (
            <Skeleton className="h-9 w-9 rounded-full" />
          ) : !user ? (
            <Link
              to="/auth"
              className="rounded-full border border-biscuit/30 px-4 py-2 transition hover:border-biscuit hover:text-biscuit-dark"
            >
              Login
            </Link>
          ) : (
            <Link
              to="/profile"
              className="flex items-center gap-2 rounded-full bg-white px-3 py-2 shadow-sm transition hover:shadow-md"
            >
              <User className="size-4 text-biscuit-dark" />
              <span className="hidden sm:inline">{user.name.split(" ")[0]}</span>
            </Link>
          )}
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 pb-4 md:hidden">
        <form
          onSubmit={handleSubmit}
          className="flex items-center overflow-hidden rounded-full border border-biscuit/30 bg-white shadow-sm"
        >
          <Search className="ml-4 size-4 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search products"
            className="w-full bg-transparent px-3 py-3 text-sm outline-none"
          />
          <button className="rounded-full bg-biscuit px-4 py-3 text-sm font-semibold text-white">
            Go
          </button>
        </form>
      </div>
    </nav>
  );
}
