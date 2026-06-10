import { useState, useEffect } from "react";
import { ShoppingCart, Bell, User, Menu, X } from "lucide-react";
import clsx from "clsx";
import { twMerge } from "tailwind-merge";
import { NavLink, Link } from "react-router-dom";
import BMLogo from "../../assets/Cafe_logo.jpeg";


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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu when screen resizes to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setMobileMenuOpen(false);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const iconButtonClass = cn(
    "relative flex h-12 w-12 items-center justify-center rounded-full transition-all duration-300",
    scrolled
      ? "bg-white/5 text-white hover:bg-cafe-gold hover:text-[#110e0d]"
      : "bg-black/20 text-white backdrop-blur-md border border-white/10 hover:bg-white hover:text-[#110e0d]"
  );

  const navLinkClass = ({ isActive }) => cn(
    "transition-colors hover:text-cafe-gold",
    isActive ? "text-cafe-gold" : ""
  );

  return (
    <header
      className={cn(
        "fixed left-0 right-0 top-0 z-[100] flex items-center justify-between px-6 py-4 transition-all duration-500",
        scrolled ? "bg-[#110e0d]/90 py-3 shadow-premium backdrop-blur-xl border-b border-white/10" : "bg-transparent py-6"
      )}
    >
      {/* Logo */}
     <Link to="/" className="flex items-center gap-3">
  <img
    src={BMLogo}
    alt="Bagel Master Logo"
    className="h-16 w-16 rounded-full "
  />
</Link>

      {/* Center Nav (Hidden on Mobile) */}
      <nav className="hidden md:flex items-center gap-8 font-sans text-sm font-semibold uppercase tracking-widest text-white/80">
        <NavLink to="/" className={navLinkClass}>Home</NavLink>
        <NavLink to="/menu" className={navLinkClass}>Menu</NavLink>
        <NavLink to="/about" className={navLinkClass}>Events</NavLink>
        <NavLink to="/gallery" className={navLinkClass}>Rewards</NavLink>
        <NavLink to="/contact" className={navLinkClass}>Contact Us</NavLink>
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

        {/* Mobile Menu Toggle */}
        <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className={cn(iconButtonClass, "md:hidden")}>
          {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="absolute left-0 right-0 top-full flex flex-col bg-[#110e0d]/95 backdrop-blur-xl border-b border-white/10 p-6 shadow-2xl md:hidden">
          <nav className="flex flex-col gap-6 font-sans text-lg font-semibold uppercase tracking-widest text-white/80">
            <NavLink to="/" onClick={() => setMobileMenuOpen(false)} className={navLinkClass}>Home</NavLink>
            <NavLink to="/menu" onClick={() => setMobileMenuOpen(false)} className={navLinkClass}>Menu</NavLink>
            <NavLink to="/about" onClick={() => setMobileMenuOpen(false)} className={navLinkClass}>About Us</NavLink>
            <NavLink to="/gallery" onClick={() => setMobileMenuOpen(false)} className={navLinkClass}>Gallery</NavLink>
            <NavLink to="/contact" onClick={() => setMobileMenuOpen(false)} className={navLinkClass}>Contact Us</NavLink>
          </nav>
        </div>
      )}
    </header>
  );
}

export default Header;
