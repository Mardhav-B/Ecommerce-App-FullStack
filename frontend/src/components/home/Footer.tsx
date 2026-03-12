import { Facebook, Twitter, Instagram } from "lucide-react";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="bg-biscuit text-white mt-16">
      <div className="max-w-7xl mx-auto px-6 py-12 grid md:grid-cols-4 gap-8">
        <div>
          <h2 className="text-2xl font-bold mb-3">ShopSphere</h2>

          <p className="text-sm text-gray-100">
            Your one stop destination for the latest gadgets, fashion, and
            lifestyle products.
          </p>
        </div>

        <div>
          <h3 className="font-semibold mb-3">Quick Links</h3>

          <ul className="space-y-2 text-sm">
            <li>
              <Link to="/" className="hover:underline">
                Home
              </Link>
            </li>

            <li>
              <Link to="/products" className="hover:underline">
                Products
              </Link>
            </li>

            <li>
              <Link to="/cart" className="hover:underline">
                Cart
              </Link>
            </li>

            <li>
              <Link to="/profile" className="hover:underline">
                Profile
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="font-semibold mb-3">Customer Service</h3>

          <ul className="space-y-2 text-sm">
            <li>Help Center</li>
            <li>Returns</li>
            <li>Shipping</li>
            <li>Contact Us</li>
          </ul>
        </div>

        <div>
          <h3 className="font-semibold mb-3">Follow Us</h3>

          <div className="flex gap-4">
            <Facebook className="cursor-pointer hover:text-gray-200" />
            <Twitter className="cursor-pointer hover:text-gray-200" />
            <Instagram className="cursor-pointer hover:text-gray-200" />
          </div>
        </div>
      </div>

      <div className="border-t border-white/20 py-4 text-center text-sm">
        © {new Date().getFullYear()} ShopSphere. All rights reserved.
      </div>
    </footer>
  );
}
