import { useEffect, useState } from "react";
import { X, ShoppingBag, Plus, Minus } from "lucide-react";
import { customerAuthStorage } from "../../auth/customerAuthStorage";
import { getImageUrl } from "../../Utils/imageUrl";
import { useNavigate } from "react-router-dom";

function CartDrawer({
  cart,
  customer,
  onClose,
  onAdd,
  onRemove,
  onClearCart,
  onRequireSignIn,
  onOrderPlaced,
  restaurantSettings,
}) {
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState("");

  const total = cart.reduce((sum, item) => {
    const price =
      item.discount_price && item.discount_price < item.price
        ? item.discount_price
        : item.price;

    return sum + (Number(price) + Number(item.addon_total || 0)) * item.qty;
  }, 0);

  const totalItems = cart.reduce((sum, item) => sum + item.qty, 0);

  const handleProceedToCheckout = () => {
    if (!customer) {
      setErrorMessage("Please sign in before checking out.");
      onRequireSignIn?.();
      return;
    }
    
    if (cart.length === 0) return;
    
    onClose();
    navigate("/checkout");
  };

  return (
    <>
      <div
        onClick={onClose}
        className="customer-drawer-overlay"
      />

      <div className="customer-drawer-panel flex flex-col">
        <div className="flex items-center justify-between border-b border-theme-border pb-5 px-6 pt-6 bg-theme-surface">
          <div>
            <h2 className="m-0 font-serif text-2xl font-bold text-theme-text">Your Cart</h2>
            <p className="mt-1 font-sans text-xs font-semibold text-theme-text-muted">
              {totalItems} {totalItems === 1 ? "item" : "items"}
            </p>
          </div>
          <button
            onClick={onClose}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-theme-surface text-theme-text transition-colors hover:bg-theme-accent"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex flex-1 flex-col gap-4 overflow-y-auto px-6 py-5 bg-theme-bg [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {cart.length === 0 ? (
            <div className="flex flex-1 flex-col items-center justify-center gap-4">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-theme-surface text-black/20">
                <ShoppingBag className="h-8 w-8" />
              </div>
              <p className="m-0 font-sans text-sm font-semibold text-theme-text-muted">
                Your cart is empty
              </p>
            </div>
          ) : (
            <>
              {cart.map((item) => {
                const price =
                  item.discount_price && item.discount_price < item.price
                    ? item.discount_price
                    : item.price;
                const linePrice =
                  (Number(price) + Number(item.addon_total || 0)) * item.qty;

                return (
                  <div
                    key={item.cart_key || item.id}
                    className="flex items-start gap-4 p-4 rounded-2xl bg-theme-surface shadow-sm border border-theme-border"
                  >
                    {getImageUrl(item, "item_image") ? (
                      <img
                        src={getImageUrl(item, "item_image")}
                        alt={item.item_name}
                        className="h-16 w-16 flex-shrink-0 rounded-xl object-cover bg-theme-surface"
                      />
                    ) : (
                      <div className="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-xl bg-theme-surface text-2xl">
                        ☕
                      </div>
                    )}

                    <div className="min-w-0 flex-1">
                      <h4 className="m-0 truncate font-serif text-sm font-bold text-theme-text">
                        {item.item_name}
                      </h4>
                      {item.selected_addons?.length > 0 ? (
                        <p className="mt-1 font-sans text-xs leading-relaxed text-theme-text-muted">
                          {item.selected_addons
                            .map((addon) => addon.addon_name)
                            .join(", ")}
                        </p>
                      ) : null}
                      <p className="mt-2 font-serif text-sm font-bold text-theme-accent">
                        Rs {linePrice.toFixed(2)}
                      </p>
                    </div>

                    <div className="flex flex-shrink-0 items-center overflow-hidden rounded-full border border-theme-border bg-theme-surface">
                      <button
                        onClick={() => onRemove(item.id, item.cart_key)}
                        className="flex h-8 w-8 items-center justify-center border-0 bg-transparent text-theme-text hover:bg-theme-border"
                      >
                        <Minus className="h-3 w-3" />
                      </button>
                      <span className="min-w-[20px] text-center font-sans text-xs font-bold text-theme-text">
                        {item.qty}
                      </span>
                      <button
                        onClick={() => onAdd(item)}
                        className="flex h-8 w-8 items-center justify-center border-0 bg-transparent text-theme-text hover:bg-theme-border"
                      >
                        <Plus className="h-3 w-3" />
                      </button>
                    </div>
                  </div>
                );
              })}

              {/* Checkout details removed from Cart Drawer */}
            </>
          )}
        </div>

        {cart.length > 0 ? (
          <div className="border-t border-white/5 bg-theme-surface pb-6 pt-5 px-6 shadow-[0_-10px_40px_-15px_rgba(0,0,0,0.1)]">
            <div className="mb-4 flex items-center justify-between">
              <span className="font-sans text-xs font-bold uppercase tracking-wider text-theme-text-muted">Total Amount</span>
              <span className="font-serif text-2xl font-bold text-theme-accent">
                Rs {total.toFixed(2)}
              </span>
            </div>
            {errorMessage ? (
              <div className="mb-3 rounded-xl border border-red-500/25 bg-red-50 p-3 text-xs text-red-600">
                {errorMessage}
              </div>
            ) : null}
            <button
              onClick={handleProceedToCheckout}
              className="w-full rounded-xl bg-theme-accent py-4 font-sans text-sm font-bold uppercase tracking-wider text-theme-inverse-text transition-transform hover:scale-[1.02]"
            >
              Proceed to Checkout
            </button>
          </div>
        ) : null}
      </div>
    </>
  );
}

export default CartDrawer;
