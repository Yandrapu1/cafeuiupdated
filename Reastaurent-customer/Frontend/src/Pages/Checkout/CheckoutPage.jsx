import { useState, useEffect } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import { customerAuthStorage } from "../../auth/customerAuthStorage";
import { placeCustomerOrder } from "../../services/orderApi";
import { createCustomerCheckoutSession } from "../../services/paymentApi";
import { STRIPE_MIN_INR_AMOUNT, STRIPE_PUBLISHABLE_KEY } from "../../Utils/Constant";
import { getStripeClient } from "../../Utils/stripeClient";
import { isRestaurantOpen } from "../../Utils/restaurantLogic";
import { motion } from "framer-motion";
import { getImageUrl } from "../../Utils/imageUrl";

export default function CheckoutPage() {
  const navigate = useNavigate();
  const { cart, clearCart, restaurantSettings } = useOutletContext();
  const customer = customerAuthStorage.getCustomer();

  const [deliveryForm, setDeliveryForm] = useState({
    recipient_name: customer?.name || "",
    phone: customer?.phone || "",
    line1: "",
    line2: "",
    landmark: "",
    city: "",
    state: "",
    pincode: "",
  });
  const [orderNotes, setOrderNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("cash_on_delivery");
  const [orderType, setOrderType] = useState("collection");
  const [scheduledTime, setScheduledTime] = useState("");

  const cafeOpen = isRestaurantOpen(restaurantSettings);

  useEffect(() => {
    if (!customer) {
      navigate("/login");
    }
    if (cart.length === 0) {
      navigate("/menu");
    }
  }, [customer, cart, navigate]);

  const total = cart.reduce((sum, item) => {
    const price = item.discount_price && item.discount_price < item.price ? item.discount_price : item.price;
    return sum + (Number(price) + Number(item.addon_total || 0)) * item.qty;
  }, 0);

  const isStripeAmountAllowed = total >= STRIPE_MIN_INR_AMOUNT;
  const isStripeOptionDisabled = !STRIPE_PUBLISHABLE_KEY || !isStripeAmountAllowed;

  useEffect(() => {
    if (orderType === "delivery" && paymentMethod === "cash_on_delivery") {
      setPaymentMethod("stripe");
    } else if (paymentMethod === "stripe" && isStripeOptionDisabled) {
      setPaymentMethod("cash_on_delivery");
    }
  }, [isStripeOptionDisabled, paymentMethod, orderType]);

  const handleFieldChange = (field, value) => {
    setDeliveryForm((prev) => ({ ...prev, [field]: value }));
  };

  const handlePlaceOrder = async () => {
    if (!cafeOpen && !scheduledTime) {
      setErrorMessage("The cafe is currently closed. Please select a future time slot for a scheduled order.");
      return;
    }
    if (orderType === "delivery" && (!deliveryForm.line1.trim() || !deliveryForm.city.trim() || !deliveryForm.pincode.trim())) {
      setErrorMessage("Please add address line 1, city, and pincode for delivery.");
      return;
    }

    setSubmitting(true);
    setErrorMessage("");

    try {
      const accessToken = customerAuthStorage.getAccessToken();
      const checkoutPayload = {
        items: cart.map((item) => ({
          item_id: item.id,
          quantity: item.qty,
          selected_addons: item.selected_addons || [],
          item_notes: item.item_notes || "",
        })),
        order_type: orderType,
        scheduled_time: scheduledTime || null,
        delivery_address: orderType === "delivery" ? {
          recipient_name: deliveryForm.recipient_name.trim(),
          phone: deliveryForm.phone.trim(),
          line1: deliveryForm.line1.trim(),
          line2: deliveryForm.line2.trim(),
          landmark: deliveryForm.landmark.trim(),
          city: deliveryForm.city.trim(),
          state: deliveryForm.state.trim(),
          pincode: deliveryForm.pincode.trim(),
        } : null,
        order_notes: orderNotes.trim(),
      };

      if (paymentMethod === "stripe") {
        const successUrl = `${window.location.origin}/profile?checkout=success`;
        const cancelUrl = `${window.location.origin}/checkout?checkout=cancelled`;
        const checkoutSession = await createCustomerCheckoutSession(
          { checkoutPayload, successUrl, cancelUrl },
          accessToken
        );

        if (checkoutSession.url) {
          window.location.assign(checkoutSession.url);
          return;
        }

        const stripe = await getStripeClient();
        await stripe.redirectToCheckout({ sessionId: checkoutSession.sessionId });
        return;
      }

      await placeCustomerOrder({ ...checkoutPayload, payment_method: paymentMethod }, accessToken);
      clearCart();
      navigate("/profile", { state: { orderPlaced: true } });
    } catch (error) {
      setErrorMessage(error.message);
      setSubmitting(false);
    }
  };

  if (!customer || cart.length === 0) return null;

  return (
    <div className="pt-24 pb-16 min-h-screen bg-theme-bg">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <h1 className="font-serif text-3xl font-bold text-theme-text mb-8">Checkout</h1>
        
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Main Checkout Form */}
          <div className="flex-1 space-y-6">
            
            {/* Order Type Selection */}
            <div className="bg-theme-surface rounded-3xl p-6 shadow-sm border border-theme-border">
              <h2 className="font-serif text-xl font-bold text-theme-text mb-4">How would you like to receive your order?</h2>
              <div className="flex gap-4">
                <button
                  onClick={() => setOrderType("collection")}
                  className={`flex-1 py-3 px-4 rounded-xl border-2 transition-all font-bold ${
                    orderType === "collection" ? "border-theme-accent bg-theme-accent/10 text-theme-text" : "border-theme-border text-theme-text-muted hover:border-theme-accent/50"
                  }`}
                >
                  Collection
                </button>
                <button
                  onClick={() => setOrderType("delivery")}
                  className={`flex-1 py-3 px-4 rounded-xl border-2 transition-all font-bold ${
                    orderType === "delivery" ? "border-theme-accent bg-theme-accent/10 text-theme-text" : "border-theme-border text-theme-text-muted hover:border-theme-accent/50"
                  }`}
                >
                  Delivery
                </button>
              </div>
            </div>

            {/* Scheduling */}
            <div className="bg-theme-surface rounded-3xl p-6 shadow-sm border border-theme-border">
              <h2 className="font-serif text-xl font-bold text-theme-text mb-2">Schedule Time (Optional)</h2>
              {!cafeOpen && (
                <div className="mb-4 text-sm text-red-600 bg-red-50 p-3 rounded-xl border border-red-100">
                  The cafe is currently closed for immediate orders. You must select a future time slot.
                </div>
              )}
              <input
                type="datetime-local"
                value={scheduledTime}
                onChange={(e) => setScheduledTime(e.target.value)}
                className="w-full rounded-xl border border-theme-border px-4 py-3 outline-none focus:border-theme-accent"
              />
            </div>

            {/* Delivery Address */}
            {orderType === "delivery" && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="bg-theme-surface rounded-3xl p-6 shadow-sm border border-theme-border overflow-hidden">
                <h2 className="font-serif text-xl font-bold text-theme-text mb-4">Delivery Details</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <input type="text" placeholder="Recipient Name *" value={deliveryForm.recipient_name} onChange={(e) => handleFieldChange("recipient_name", e.target.value)} className="w-full rounded-xl border border-theme-border px-4 py-3 outline-none focus:border-theme-accent" required />
                  <input type="tel" placeholder="Phone Number *" value={deliveryForm.phone} onChange={(e) => handleFieldChange("phone", e.target.value)} className="w-full rounded-xl border border-theme-border px-4 py-3 outline-none focus:border-theme-accent" required />
                  <input type="text" placeholder="Address Line 1 *" value={deliveryForm.line1} onChange={(e) => handleFieldChange("line1", e.target.value)} className="w-full sm:col-span-2 rounded-xl border border-theme-border px-4 py-3 outline-none focus:border-theme-accent" required />
                  <input type="text" placeholder="Address Line 2" value={deliveryForm.line2} onChange={(e) => handleFieldChange("line2", e.target.value)} className="w-full sm:col-span-2 rounded-xl border border-theme-border px-4 py-3 outline-none focus:border-theme-accent" />
                  <input type="text" placeholder="Landmark" value={deliveryForm.landmark} onChange={(e) => handleFieldChange("landmark", e.target.value)} className="w-full sm:col-span-2 rounded-xl border border-theme-border px-4 py-3 outline-none focus:border-theme-accent" />
                  <input type="text" placeholder="City *" value={deliveryForm.city} onChange={(e) => handleFieldChange("city", e.target.value)} className="w-full rounded-xl border border-theme-border px-4 py-3 outline-none focus:border-theme-accent" required />
                  <input type="text" placeholder="Pincode *" value={deliveryForm.pincode} onChange={(e) => handleFieldChange("pincode", e.target.value)} className="w-full rounded-xl border border-theme-border px-4 py-3 outline-none focus:border-theme-accent" required />
                </div>
              </motion.div>
            )}

            {/* Payment Options */}
            <div className="bg-theme-surface rounded-3xl p-6 shadow-sm border border-theme-border">
              <h2 className="font-serif text-xl font-bold text-theme-text mb-4">Payment Method</h2>
              <div className="flex flex-col gap-3">
                {orderType === "collection" && (
                  <label className="flex items-center gap-3 p-4 rounded-xl border border-theme-border cursor-pointer hover:bg-theme-surface transition-colors">
                    <input type="radio" name="payment" checked={paymentMethod === "cash_on_delivery"} onChange={() => setPaymentMethod("cash_on_delivery")} className="accent-cafe-gold" />
                    <span className="font-semibold text-theme-text">Pay at Collection (Cash/Card)</span>
                  </label>
                )}
                <label className={`flex items-center gap-3 p-4 rounded-xl border border-theme-border cursor-pointer transition-colors ${isStripeOptionDisabled ? "opacity-50" : "hover:bg-theme-surface"}`}>
                  <input type="radio" name="payment" checked={paymentMethod === "stripe"} disabled={isStripeOptionDisabled} onChange={() => setPaymentMethod("stripe")} className="accent-cafe-gold" />
                  <span className="font-semibold text-theme-text">Pay Online (Stripe)</span>
                </label>
                {!isStripeAmountAllowed && (
                  <p className="text-xs text-amber-600 px-4">Online card payment is available from Rs {STRIPE_MIN_INR_AMOUNT.toFixed(2)}.</p>
                )}
              </div>
            </div>

          </div>

          {/* Order Summary Sidebar */}
          <div className="w-full lg:w-96 shrink-0">
            <div className="bg-theme-surface rounded-3xl p-6 shadow-sm border border-theme-border sticky top-28">
              <h2 className="font-serif text-xl font-bold text-theme-text mb-4">Order Summary</h2>
              
              <div className="flex flex-col gap-4 max-h-[300px] overflow-y-auto mb-4 pr-2">
                {cart.map((item, idx) => (
                  <div key={idx} className="flex gap-3">
                    <div className="h-12 w-12 rounded-lg bg-theme-surface overflow-hidden flex-shrink-0">
                      {getImageUrl(item, "item_image") ? (
                        <img src={getImageUrl(item, "item_image")} alt={item.item_name} className="h-full w-full object-cover" />
                      ) : (
                        <div className="h-full w-full flex items-center justify-center">☕</div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-bold text-sm text-theme-text truncate">{item.item_name} x{item.qty}</div>
                      <div className="text-xs text-theme-text-muted">
                        ${(((item.discount_price || item.price) + (item.addon_total || 0)) * item.qty).toFixed(2)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t border-theme-border pt-4 mt-4">
                <textarea
                  value={orderNotes}
                  onChange={(e) => setOrderNotes(e.target.value)}
                  placeholder="Add a note to your order..."
                  className="w-full rounded-xl border border-theme-border px-4 py-3 text-sm outline-none focus:border-theme-accent mb-4 min-h-[80px]"
                />

                <div className="flex justify-between items-center mb-6">
                  <span className="font-bold text-theme-text">Total</span>
                  <span className="font-serif text-2xl font-bold text-theme-accent">Rs {total.toFixed(2)}</span>
                </div>

                {errorMessage && (
                  <div className="mb-4 rounded-xl border border-red-500/25 bg-red-50 p-3 text-xs text-red-600">
                    {errorMessage}
                  </div>
                )}

                <button
                  onClick={handlePlaceOrder}
                  disabled={submitting}
                  className="w-full rounded-xl bg-theme-accent py-4 font-sans text-sm font-bold uppercase tracking-wider text-theme-inverse-text transition-transform hover:scale-[1.02] disabled:opacity-70 disabled:hover:scale-100"
                >
                  {submitting ? "Processing..." : paymentMethod === "stripe" ? "Pay Securely" : "Confirm Order"}
                </button>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
