import { motion, AnimatePresence } from "framer-motion";
import { X, Plus, Minus } from "lucide-react";
import { useState } from "react";
import { getImageUrl } from "../../Utils/imageUrl";

export default function ProductPopup({ item, onClose, onAddToCart, onOpenAddons }) {
  const [quantity, setQuantity] = useState(1);

  if (!item) return null;

  const handleAddToCart = () => {
    if (item.has_addons) {
      // If it has addons, the main MenuPage logic will open the addons modal 
      // after we close this popup (or we can just call onOpenAddons)
      onClose();
      onOpenAddons(item);
    } else {
      // Add multiple quantities by calling onAddToCart Q times? 
      // Wait, addToCart signature is (item, addons), it doesn't take qty currently.
      // Since it's a simple cart, we can loop to add multiple, 
      // or modify the global addToCart to take qty.
      // For now, loop it for simplicity without changing the global reducer.
      for (let i = 0; i < quantity; i++) {
        onAddToCart(item, []);
      }
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-theme-border backdrop-blur-sm"
        />

        {/* Modal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-[800px] overflow-hidden rounded-3xl bg-theme-surface shadow-premium flex flex-col md:flex-row"
        >
          <button
            onClick={onClose}
            className="absolute right-4 top-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-theme-surface text-theme-text shadow-sm backdrop-blur-md transition-colors hover:bg-theme-border"
          >
            <X className="h-5 w-5" />
          </button>

          {/* Left: Image */}
          <div className="relative h-[300px] w-full md:h-auto md:w-1/2 bg-theme-bg">
            {getImageUrl(item, "image") ? (
              <img
                src={getImageUrl(item, "image")}
                alt={item.name}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full items-center justify-center text-4xl">
                ☕
              </div>
            )}
          </div>

          {/* Right: Details */}
          <div className="flex w-full flex-col justify-between p-6 md:w-1/2 md:p-8">
            <div>
              <div className="mb-2 flex items-start justify-between">
                <h2 className="font-serif text-2xl font-bold text-theme-text md:text-3xl">
                  {item.name}
                </h2>
              </div>
              <div className="mb-6 font-sans text-xl font-bold text-theme-accent">
                ${Number(item.price).toFixed(2)} USD
              </div>
              
              <div className="mb-6">
                <h3 className="mb-2 font-sans text-sm font-semibold uppercase tracking-wider text-theme-text-muted">
                  Description
                </h3>
                <p className="font-sans text-base leading-relaxed text-theme-text-muted">
                  {item.description || "A delicious treat prepared fresh for you. Enjoy the premium quality and exceptional taste that Bagel Cafe is known for."}
                </p>
              </div>

              {item.is_vegetarian === 1 && (
                <div className="mb-6 flex items-center gap-2">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-theme-accent/20 text-xs text-theme-accent">
                    V
                  </span>
                  <span className="font-sans text-sm font-semibold text-theme-accent">Vegetarian</span>
                </div>
              )}
            </div>

            <div>
              {!item.has_addons && (
                <div className="mb-6 flex items-center gap-4">
                  <span className="font-sans text-sm font-semibold uppercase tracking-wider text-theme-text-muted">
                    Quantity
                  </span>
                  <div className="flex items-center rounded-full border border-theme-border bg-theme-surface">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="flex h-10 w-10 items-center justify-center text-theme-text-muted transition-colors hover:text-theme-text"
                    >
                      <Minus className="h-4 w-4" />
                    </button>
                    <span className="w-8 text-center font-sans font-bold text-theme-text">
                      {quantity}
                    </span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="flex h-10 w-10 items-center justify-center text-theme-text-muted transition-colors hover:text-theme-text"
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              )}

              <button
                onClick={handleAddToCart}
                disabled={!item.is_available}
                className="w-full rounded-full bg-theme-accent py-4 font-sans text-base font-bold text-theme-inverse-text shadow-warm transition-transform hover:-translate-y-0.5 hover:shadow-premium disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0"
              >
                {item.has_addons 
                  ? "Customize & Add" 
                  : !item.is_available 
                    ? "Out of Stock" 
                    : `Add to Cart - $${(Number(item.price) * quantity).toFixed(2)}`}
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
