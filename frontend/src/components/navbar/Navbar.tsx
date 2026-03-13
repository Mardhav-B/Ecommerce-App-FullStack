import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Heart, Menu, Package, Search, ShoppingCart, User, X } from "lucide-react";

import { useAuth } from "../../hooks/useAuth";
import { useCartCount } from "../../hooks/useCartCount";
import { useWishlist } from "../../hooks/useWishlist";
import { useAppStore } from "../../stores/app.store";
import CartBadge from "./CartBadge";
import { Skeleton } from "../ui/skeleton";

export default function Navbar() {
  const { data: user, isLoading } = useAuth();
  const { count } = useCartCount();
  const { data: wishlist = [] } = useWishlist();
  const navigate = useNavigate();
  const location = useLocation();
  const [search, setSearch] = useState("");
  const mobileMenuOpen = useAppStore((state) => state.mobileMenuOpen);
  const setMobileMenuOpen = useAppStore((state) => state.setMobileMenuOpen);
  const toggleMobileMenu = useAppStore((state) => state.toggleMobileMenu);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname, location.search, setMobileMenuOpen]);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const query = search.trim();
    setMobileMenuOpen(false);

    navigate(query ? `/products?search=${encodeURIComponent(query)}` : "/products");
  };

  const isProductsPage = location.pathname.startsWith("/products");

  return (
    <nav className="sticky top-0 z-50 border-b border-white/50 bg-[rgba(244,230,217,0.92)] backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center gap-3 px-4 py-4 md:px-6">
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

        <div className="ml-auto hidden items-center gap-3 text-sm font-medium text-slate-700 md:flex md:gap-6">
          <Link
            to="/products"
            className={`transition hover:text-biscuit-dark ${
              isProductsPage ? "text-biscuit-dark" : ""
            }`}
          >
            Products
          </Link>

          {user ? (
            <>
              <Link
                to="/wishlist"
                className="hidden items-center gap-2 transition hover:text-biscuit-dark sm:flex"
              >
                <Heart className="size-4" />
                Wishlist
                <CartBadge count={wishlist.length} />
              </Link>

              <Link
                to="/orders"
                className="hidden items-center gap-2 transition hover:text-biscuit-dark sm:flex"
              >
                Orders
              </Link>

              <Link
                to="/cart"
                className="hidden items-center gap-2 transition hover:text-biscuit-dark sm:flex"
              >
                <ShoppingCart className="size-4" />
                Cart
                <CartBadge count={count} />
              </Link>
            </>
          ) : null}

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

        <div className="ml-auto flex items-center gap-2 md:hidden">
          {user ? (
            <>
              <Link
                to="/wishlist"
                className="relative inline-flex size-10 items-center justify-center rounded-full bg-white shadow-sm"
              >
                <Heart className="size-4 text-slate-700" />
                <span className="absolute right-0 top-0">
                  <CartBadge count={wishlist.length} />
                </span>
              </Link>
              <Link
                to="/cart"
                className="relative inline-flex size-10 items-center justify-center rounded-full bg-white shadow-sm"
              >
                <ShoppingCart className="size-4 text-slate-700" />
                <span className="absolute right-0 top-0">
                  <CartBadge count={count} />
                </span>
              </Link>
            </>
          ) : null}
          <button
            type="button"
            onClick={toggleMobileMenu}
            className="inline-flex size-10 items-center justify-center rounded-full bg-white shadow-sm"
            aria-label={mobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
          >
            {mobileMenuOpen ? (
              <X className="size-5 text-slate-700" />
            ) : (
              <Menu className="size-5 text-slate-700" />
            )}
          </button>
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

      {mobileMenuOpen ? (
        <div className="border-t border-white/60 bg-white/95 px-4 py-4 shadow-lg backdrop-blur md:hidden">
          <div className="mx-auto flex max-w-7xl flex-col gap-3 text-sm font-medium text-slate-700">
            <Link
              to="/products"
              className="rounded-2xl border border-biscuit-light px-4 py-3 transition hover:border-biscuit hover:text-biscuit-dark"
            >
              Products
            </Link>
            {user ? (
              <>
                <Link
                  to="/wishlist"
                  className="flex items-center justify-between rounded-2xl border border-biscuit-light px-4 py-3 transition hover:border-biscuit hover:text-biscuit-dark"
                >
                  <span className="flex items-center gap-2">
                    <Heart className="size-4" />
                    Wishlist
                  </span>
                  <CartBadge count={wishlist.length} />
                </Link>
                <Link
                  to="/orders"
                  className="flex items-center gap-2 rounded-2xl border border-biscuit-light px-4 py-3 transition hover:border-biscuit hover:text-biscuit-dark"
                >
                  <Package className="size-4" />
                  Orders
                </Link>
                <Link
                  to="/cart"
                  className="flex items-center justify-between rounded-2xl border border-biscuit-light px-4 py-3 transition hover:border-biscuit hover:text-biscuit-dark"
                >
                  <span className="flex items-center gap-2">
                    <ShoppingCart className="size-4" />
                    Cart
                  </span>
                  <CartBadge count={count} />
                </Link>
              </>
            ) : null}
            {isLoading ? (
              <Skeleton className="h-12 rounded-2xl" />
            ) : !user ? (
              <Link
                to="/auth"
                className="rounded-2xl bg-biscuit px-4 py-3 text-center font-semibold text-white"
              >
                Login
              </Link>
            ) : (
              <Link
                to="/profile"
                className="flex items-center gap-2 rounded-2xl border border-biscuit-light px-4 py-3 transition hover:border-biscuit hover:text-biscuit-dark"
              >
                <User className="size-4 text-biscuit-dark" />
                {user.name}
              </Link>
            )}
          </div>
        </div>
      ) : null}
    </nav>
  );
}
