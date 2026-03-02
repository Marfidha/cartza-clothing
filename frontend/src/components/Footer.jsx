import React from "react";
import { Facebook, Instagram, Twitter, Youtube } from "lucide-react";

function Footer() {
  return (
    <footer className="bg-[oklch(21%_0.034_264.665)] text-white border-t border-white/10 px-6 sm:px-10 lg:px-20 py-16">

      {/* Top Section */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-10">

        {/* Shop */}
        <div className="space-y-4">
          <h4 className="text-lg font-semibold tracking-wide">Shop</h4>
          <ul className="space-y-2 text-sm">
            {["Women", "Men", "Kids", "Home"].map((item) => (
              <li key={item} className="cursor-pointer relative w-fit group">
                {item}
                <span className="absolute left-0 -bottom-1 w-0 h-1px bg-white transition-all duration-300 group-hover:w-full"></span>
              </li>
            ))}
          </ul>
        </div>

        {/* Customer Care */}
        <div className="space-y-4">
          <h4 className="text-lg font-semibold tracking-wide">
            Customer Care
          </h4>
          <ul className="space-y-2 text-sm">
            {[
              "Return your order",
              "Delivery information",
              "Return information",
              "FAQs",
              "Contact us",
            ].map((item) => (
              <li
                key={item}
                className="hover:translate-x-1 transition cursor-pointer text-gray-300 hover:text-white"
              >
                {item}
              </li>
            ))}
          </ul>
        </div>

        {/* Legal */}
        <div className="space-y-4">
          <h4 className="text-lg font-semibold tracking-wide">
            Privacy & Legal
          </h4>
          <ul className="space-y-2 text-sm">
            {[
              "Privacy policy",
              "Terms & conditions",
              "About cookies",
              "Terms of use",
            ].map((item) => (
              <li
                key={item}
                className="hover:translate-x-1 transition cursor-pointer text-gray-300 hover:text-white"
              >
                {item}
              </li>
            ))}
          </ul>
        </div>

        {/* Help */}
        <div className="space-y-4">
          <h4 className="text-lg font-semibold tracking-wide">Help</h4>
          <ul className="space-y-2 text-sm">
            {[
              "Customer service",
              "Find a store",
              "Secure shopping",
              "Cookie settings",
            ].map((item) => (
              <li
                key={item}
                className="hover:translate-x-1 transition cursor-pointer text-gray-300 hover:text-white"
              >
                {item}
              </li>
            ))}
          </ul>
        </div>

        {/* Account */}
        <div className="space-y-4">
          <h4 className="text-lg font-semibold tracking-wide">
            My Account
          </h4>
          <ul className="space-y-2 text-sm">
            {["Sign in", "Create account", "Order history"].map((item) => (
              <li
                key={item}
                className="hover:translate-x-1 transition cursor-pointer text-gray-300 hover:text-white"
              >
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Newsletter Section */}
      <div className="mt-16 border-t border-white/10 pt-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">

        <div className="max-w-lg">
          <h4 className="text-xl font-semibold mb-2">
            Join our newsletter
          </h4>
          <p className="text-sm text-gray-300">
            Be the first to know about new arrivals, exclusive offers and style inspiration.
          </p>
        </div>

        <div className="flex w-full max-w-md">
          <input
            type="email"
            placeholder="Enter your email"
            className="flex-1 bg-transparent border border-white/20 px-4 py-3 text-sm text-white placeholder-gray-400 focus:outline-none focus:border-white transition"
          />
          <button className="bg-white text-black px-6 text-sm font-medium hover:bg-gray-200 transition">
            Subscribe
          </button>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="mt-10 flex flex-col md:flex-row items-center justify-between gap-6 text-xs text-gray-400">

        <p>© 2026 Your Brand. All rights reserved.</p>

        {/* Social Icons */}
        <div className="flex gap-5">
          {[Facebook, Instagram, Twitter, Youtube].map((Icon, i) => (
            <Icon
              key={i}
              className="w-5 h-5 cursor-pointer hover:scale-125 hover:text-white transition duration-300"
            />
          ))}
        </div>
      </div>
    </footer>
  );
}

export default Footer;