import { useState, useEffect } from "react";
import { ShoppingCart, Bell, User, Menu } from "lucide-react";
import clsx from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs) {
  return twMerge(clsx(inputs));
}

function Header({
  cartCount,
  onCartClick,
  onCustomerClick,
  onNotificationClick,
  customer,
  notificationCount = 0,
}) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const iconButtonClass = cn(
    "relative flex h-12 w-12 items-center justify-center rounded-full transition-all duration-300",
    scrolled
      ? "bg-white/5 text-white hover:bg-cafe-gold hover:text-[#110e0d]"
      : "bg-black/20 text-white backdrop-blur-md border border-white/10 hover:bg-white hover:text-[#110e0d]"
  );

  return (
    <header
      className={cn(
        "fixed left-0 right-0 top-0 z-[100] flex items-center justify-between px-6 py-4 transition-all duration-500",
        scrolled ? "bg-[#110e0d]/90 py-3 shadow-premium backdrop-blur-xl border-b border-white/10" : "bg-transparent py-6"
      )}
    >
      {/* Logo */}
      <div className="flex items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-cafe-gold text-2xl font-serif font-bold text-[#110e0d]">
          B
        </div>
        <div className="hidden sm:block">
          <h1 className="m-0 font-serif text-2xl font-bold tracking-tight text-white">
            Bagel Cafe
          </h1>
        </div>
      </div>

      {/* Center Nav (Hidden on Mobile) */}
      <nav className="hidden md:flex items-center gap-8 font-sans text-sm font-semibold uppercase tracking-widest text-white/80">
        <button onClick={() => document.getElementById("menu-section")?.scrollIntoView({ behavior: "smooth" })} className="transition-colors hover:text-cafe-gold">Menu</button>
        <button onClick={() => document.getElementById("about-section")?.scrollIntoView({ behavior: "smooth" })} className="transition-colors hover:text-cafe-gold">About Us</button>
        <button onClick={() => document.getElementById("gallery-section")?.scrollIntoView({ behavior: "smooth" })} className="transition-colors hover:text-cafe-gold">Gallery</button>
        <button onClick={() => document.getElementById("footer-section")?.scrollIntoView({ behavior: "smooth" })} className="transition-colors hover:text-cafe-gold">Contact Us</button>
      </nav>

      {/* Actions */}
      <div className="flex items-center gap-3 sm:gap-4">
        {/* User */}
        <button onClick={onCustomerClick} className={iconButtonClass}>
          {customer?.name ? (
            <span className="font-sans text-lg font-bold">{customer.name.charAt(0).toUpperCase()}</span>
          ) : (
            <User className="h-5 w-5" />
          )}
        </button>

        {/* Notifications */}
        <button onClick={onNotificationClick} className={iconButtonClass}>
          <Bell className="h-5 w-5" />
          {notificationCount > 0 && (
            <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 font-sans text-[10px] font-bold text-white shadow-lg">
              {notificationCount > 99 ? "99+" : notificationCount}
            </span>
          )}
        </button>

        {/* Cart */}
        <button onClick={onCartClick} className={iconButtonClass}>
          <ShoppingCart className="h-5 w-5" />
          {cartCount > 0 && (
            <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-cafe-gold font-sans text-[10px] font-bold text-[#110e0d] shadow-lg">
              {cartCount}
            </span>
          )}
        </button>
      </div>
    </header>
  );
}

export default Header;
