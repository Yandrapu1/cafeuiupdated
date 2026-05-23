import { useState, useEffect } from "react";
import { ShoppingCart, Bell, User, Menu } from "lucide-react";
import { Link } from "react-router-dom";
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
      ? "bg-theme-surface text-theme-text hover:bg-theme-accent hover:text-theme-inverse-text"
      : "bg-theme-surface text-white backdrop-blur-md border border-white/10 hover:bg-theme-accent hover:text-theme-inverse-text"
  );

  return (
    <header
      className={cn(
        "fixed left-0 right-0 top-0 z-[100] flex items-center justify-between px-6 py-4 transition-all duration-500",
        scrolled ? "bg-theme-bg/90 py-3 shadow-sm backdrop-blur-xl border-b border-theme-border" : "bg-transparent py-6"
      )}
    >
      {/* Logo */}
      <Link to="/" className="flex items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-theme-accent text-2xl font-serif font-bold text-theme-inverse-text">
          B
        </div>
        <div className="hidden sm:block">
          <h1 className={cn(
            "m-0 font-serif text-2xl font-bold tracking-tight transition-colors duration-300",
            scrolled ? "text-theme-text" : "text-white"
          )}>
            Bagel Cafe
          </h1>
        </div>
      </Link>

      {/* Center Nav (Hidden on Mobile) */}
      <nav className={cn(
        "hidden md:flex items-center gap-8 font-sans text-sm font-semibold uppercase tracking-widest transition-colors duration-300",
        scrolled ? "text-theme-text/80" : "text-white/90"
      )}>
        <Link to="/" className="transition-colors hover:text-theme-accent">Home</Link>
        <Link to="/menu" className="transition-colors hover:text-theme-accent">Menu</Link>
        <Link to="/about" className="transition-colors hover:text-theme-accent">About Us</Link>
        <Link to="/gallery" className="transition-colors hover:text-theme-accent">Gallery</Link>
        <Link to="/contact" className="transition-colors hover:text-theme-accent">Contact Us</Link>
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
            <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-theme-accent font-sans text-[10px] font-bold text-theme-inverse-text shadow-lg">
              {cartCount}
            </span>
          )}
        </button>
      </div>
    </header>
  );
}

export default Header;
