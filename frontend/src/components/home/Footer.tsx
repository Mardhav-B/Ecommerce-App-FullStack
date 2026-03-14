import { Facebook, Instagram, Twitter } from "lucide-react";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="mt-12 border-t border-biscuit/20 bg-[linear-gradient(180deg,#f4e6d9_0%,#e8cfb5_100%)] text-slate-800 sm:mt-16">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:gap-10 sm:px-6 sm:py-14 md:grid-cols-4">
        <div>
          <h2 className="text-xl font-black tracking-[0.12em] text-biscuit-dark sm:text-2xl sm:tracking-[0.15em]">
            SHOPSPHERE
          </h2>
          <p className="mt-4 text-sm leading-6 text-slate-600">
            A cleaner storefront for daily essentials, curated collections, and
            smoother account management.
          </p>
        </div>

        <div>
          <h3 className="font-semibold text-slate-900">Quick Links</h3>
          <ul className="mt-4 space-y-3 text-sm text-slate-600">
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/products">Products</Link>
            </li>
            <li>
              <Link to="/auth">Login</Link>
            </li>
            <li>
              <Link to="/profile">Profile</Link>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="font-semibold text-slate-900">Customer Service</h3>
          <ul className="mt-4 space-y-3 text-sm text-slate-600">
            <li>Help Center</li>
            <li>Returns</li>
            <li>Shipping Updates</li>
            <li>Order Support</li>
          </ul>
        </div>

        <div>
          <h3 className="font-semibold text-slate-900">Follow Us</h3>
          <div className="mt-4 flex gap-4 text-biscuit-dark">
            <Facebook className="cursor-pointer transition hover:scale-110" />
            <Twitter className="cursor-pointer transition hover:scale-110" />
            <Instagram className="cursor-pointer transition hover:scale-110" />
          </div>
        </div>
      </div>

      <div className="border-t border-biscuit/20 px-4 py-4 text-center text-xs text-slate-600 sm:text-sm">
        &copy; {new Date().getFullYear()} ShopSphere. All rights reserved.
      </div>
    </footer>
  );
}
