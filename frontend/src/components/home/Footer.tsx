import { Facebook, Instagram, Twitter } from "lucide-react";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="mt-16 border-t border-biscuit/20 bg-[linear-gradient(180deg,#f4e6d9_0%,#e8cfb5_100%)] text-slate-800">
      <div className="mx-auto grid max-w-7xl gap-10 px-6 py-14 md:grid-cols-4">
        <div>
          <h2 className="text-2xl font-black tracking-[0.15em] text-biscuit-dark">
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
            <li><Link to="/">Home</Link></li>
            <li><Link to="/products">Products</Link></li>
            <li><Link to="/auth">Login</Link></li>
            <li><Link to="/profile">Profile</Link></li>
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

      <div className="border-t border-biscuit/20 py-4 text-center text-sm text-slate-600">
        © {new Date().getFullYear()} ShopSphere. All rights reserved.
      </div>
    </footer>
  );
}
