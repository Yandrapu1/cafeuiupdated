import React, { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ShoppingBag, Sparkles, X } from "lucide-react";
import { useNavigate } from "react-router-dom";


const SESSION_SHOWN_KEY = "bagel_cafe_welcome_offer_shown_session";
const SHOW_DELAY_MS = 2000;

const MotionDiv = motion.div;
const MotionButton = motion.button;

const canUseBrowserStorage = () => typeof window !== "undefined";

const readStorageFlag = (storage, key) => {
  try {
    return storage.getItem(key) === "true";
  } catch {
    return false;
  }
};

const writeStorageFlag = (storage, key) => {
  try {
    storage.setItem(key, "true");
  } catch {
    // Storage may be unavailable in private browsing or restricted contexts.
  }
};

export default function WelcomeOfferModal({
  user = null,
  enabled = true,
  delayMs = SHOW_DELAY_MS,

  sessionShownKey = SESSION_SHOWN_KEY,
  onOrderNow,
}) {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const isEligibleForFirstOrderOffer = useMemo(() => {
    if (!user || typeof user.totalOrders !== "number") {
      return true;
    }

    return user.totalOrders === 0;
  }, [user]);

  useEffect(() => {
    if (!enabled || !isEligibleForFirstOrderOffer || !canUseBrowserStorage()) {
      return undefined;
    }


    const hasShownThisSession = readStorageFlag(
      window.sessionStorage,
      sessionShownKey
    );

  if (hasShownThisSession) {
  return undefined;
}

    const timerId = window.setTimeout(() => {
      writeStorageFlag(window.sessionStorage, sessionShownKey);
      setOpen(true);
    }, delayMs);

    return () => window.clearTimeout(timerId);
  }, [delayMs,  enabled, isEligibleForFirstOrderOffer, sessionShownKey]);

  const dismiss = () => {
    if (canUseBrowserStorage()) {
      
      writeStorageFlag(window.sessionStorage, sessionShownKey);
    }

    setOpen(false);
  };

  const handleOrderNow = () => {
    dismiss();

    if (typeof onOrderNow === "function") {
      onOrderNow();
      return;
    }

    navigate("/menu");
  };

  return (
    <AnimatePresence>
      {open ? (
        <MotionDiv
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 px-4 py-6 backdrop-blur-md sm:px-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.24, ease: "easeOut" }}
          role="dialog"
          aria-modal="true"
          aria-labelledby="welcome-offer-title"
          aria-describedby="welcome-offer-description"
        >
          <MotionDiv
            className="relative w-full max-w-md overflow-hidden rounded-[28px] border border-cafe-gold/30 bg-[#110e0d]/90 shadow-[0_24px_90px_rgba(0,0,0,0.55)] backdrop-blur-2xl sm:max-w-lg"
            initial={{ opacity: 0, scale: 0.9, y: 24 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 12 }}
            transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cafe-gold to-transparent" />
            <div className="absolute -right-20 -top-24 h-52 w-52 rounded-full bg-cafe-gold/20 blur-[90px]" />
            <div className="absolute -bottom-24 -left-20 h-56 w-56 rounded-full bg-white/10 blur-[100px]" />

            <button
              type="button"
              onClick={dismiss}
              className="absolute right-4 top-4 z-10 grid h-10 w-10 place-items-center rounded-full border border-white/10 bg-white/5 text-white/70 transition-colors hover:border-cafe-gold/40 hover:text-white focus:outline-none focus:ring-2 focus:ring-cafe-gold/60"
              aria-label="Close welcome offer"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="relative px-6 pb-7 pt-8 text-center sm:px-8 sm:pb-8 sm:pt-10">
              <div className="mx-auto mb-5 grid h-16 w-16 place-items-center rounded-full border border-cafe-gold/35 bg-cafe-gold/10 text-cafe-gold shadow-[0_0_40px_rgba(212,175,55,0.2)]">
                <Sparkles className="h-7 w-7" />
              </div>

              <p className="mb-3 font-sans text-xs font-bold uppercase tracking-[0.24em] text-cafe-gold">
                Limited Welcome Treat
              </p>

              <h2
                id="welcome-offer-title"
                className="font-serif text-3xl font-bold leading-tight text-white sm:text-4xl"
              >
                Welcome to Bagel Cafe
              </h2>

              <p
                id="welcome-offer-description"
                className="mx-auto mt-4 max-w-sm font-sans text-base leading-relaxed text-white/70 sm:text-lg"
              >
                Enjoy FREE DELIVERY on your first order.
              </p>

              <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                <MotionButton
                  type="button"
                  onClick={handleOrderNow}
                  whileTap={{ scale: 0.98 }}
                  className="inline-flex min-h-12 flex-1 items-center justify-center gap-2 rounded-full bg-cafe-gold px-6 py-3 font-sans text-sm font-bold uppercase tracking-wider text-[#110e0d] shadow-[0_12px_30px_rgba(212,175,55,0.22)] transition-transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-cafe-gold/70 focus:ring-offset-2 focus:ring-offset-[#110e0d]"
                >
                  <ShoppingBag className="h-4 w-4" />
                  Order Now
                </MotionButton>

                <button
                  type="button"
                  onClick={dismiss}
                  className="min-h-12 flex-1 rounded-full border border-white/12 bg-white/5 px-6 py-3 font-sans text-sm font-bold uppercase tracking-wider text-white/75 transition-colors hover:border-white/25 hover:bg-white/10 hover:text-white focus:outline-none focus:ring-2 focus:ring-white/30"
                >
                  Maybe Later
                </button>
              </div>
            </div>
          </MotionDiv>
        </MotionDiv>
      ) : null}
    </AnimatePresence>
  );
}
