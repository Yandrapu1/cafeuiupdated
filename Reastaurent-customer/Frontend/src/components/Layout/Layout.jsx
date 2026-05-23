import { useEffect, useEffectEvent, useRef, useState, lazy, Suspense } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { Header } from "../common";
import Footer from "../common/Footer";
import { fetchRestaurantSettings } from "../../services/restaurantApi";
import { useCustomerRealtimeUpdates } from "../../realtime/useCustomerRealtimeUpdates";
import { customerAuthStorage } from "../../auth/customerAuthStorage";
import { fetchCustomerProfile } from "../../services/customerProfileApi";
import { fetchCustomerUnreadNotificationSummary } from "../../services/customerNotificationApi";
import { startCustomerNotificationAlert, stopCustomerNotificationAlert } from "../../Utils/notificationSound";

const CartDrawer = lazy(() => import("../Cart/CartDrawer"));

function Layout() {
  const [restaurantSettings, setRestaurantSettings] = useState(null);
  const [cart, setCart] = useState(() => {
    try {
      const saved = localStorage.getItem("cafe_cart");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [cartOpen, setCartOpen] = useState(false);
  
  const [customer, setCustomer] = useState(customerAuthStorage.getCustomer());
  const [ordersRefreshKey, setOrdersRefreshKey] = useState(0);
  const [notificationsRefreshKey, setNotificationsRefreshKey] = useState(0);
  const [notificationSummary, setNotificationSummary] = useState({
    unreadCount: 0,
    notifications: [],
  });

  const navigate = useNavigate();
  const location = useLocation();

  const previousNotificationCountRef = useRef(0);
  const hasLoadedNotificationSummaryRef = useRef(false);

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const settings = await fetchRestaurantSettings();
        setRestaurantSettings(settings);
      } catch (error) {
        console.error("Failed to fetch restaurant settings", error);
      }
    };
    loadSettings();
  }, []);

  useEffect(() => {
    localStorage.setItem("cafe_cart", JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    const accessToken = customerAuthStorage.getAccessToken();
    if (!accessToken || !customer) {
      setNotificationSummary({ unreadCount: 0, notifications: [] });
      hasLoadedNotificationSummaryRef.current = false;
      return;
    }

    const loadInitialData = async () => {
      try {
        const profile = await fetchCustomerProfile(accessToken);
        setCustomer(profile);

        const summary = await fetchCustomerUnreadNotificationSummary(accessToken);
        setNotificationSummary({
          unreadCount: summary.unread_count,
          notifications: summary.recent_notifications,
        });

        previousNotificationCountRef.current = summary.unread_count;
        hasLoadedNotificationSummaryRef.current = true;
      } catch (error) {
        console.error("Failed to load customer data:", error);
      }
    };

    loadInitialData();
  }, [customer?.id]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleOrderUpdate = useEffectEvent((data) => {
    setOrdersRefreshKey((prev) => prev + 1);
  });

  const handleNotificationUpdate = useEffectEvent((data) => {
    setNotificationSummary((prev) => {
      let nextNotifications = [data.notification, ...prev.notifications];
      
      const uniqueNotifications = Array.from(
        new Map(nextNotifications.map((n) => [n.id, n])).values()
      ).sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

      nextNotifications = uniqueNotifications.slice(0, 5);
      const nextUnreadCount = prev.unreadCount + 1;

      return {
        unreadCount: nextUnreadCount,
        notifications: nextNotifications,
      };
    });

    setNotificationsRefreshKey((prev) => prev + 1);
  });

  useEffect(() => {
    if (!hasLoadedNotificationSummaryRef.current) return;

    if (notificationSummary.unreadCount > previousNotificationCountRef.current) {
      startCustomerNotificationAlert().catch(console.error);
    } else if (notificationSummary.unreadCount === 0) {
      stopCustomerNotificationAlert();
    }
    
    previousNotificationCountRef.current = notificationSummary.unreadCount;
  }, [notificationSummary.unreadCount]);

  useCustomerRealtimeUpdates({
    customer,
    onOrderUpdate: handleOrderUpdate,
    onNotificationUpdate: handleNotificationUpdate,
  });

  const addToCart = useEffectEvent((item, addons = []) => {
    setCart((currentCart) => {
      const cartKey = `${item.id}-${addons.map((a) => a.id).sort().join("-")}`;
      const existingItemIndex = currentCart.findIndex((i) => (i.cart_key || i.id) === cartKey);

      if (existingItemIndex >= 0) {
        const newCart = [...currentCart];
        newCart[existingItemIndex] = {
          ...newCart[existingItemIndex],
          qty: newCart[existingItemIndex].qty + 1,
        };
        return newCart;
      }

      const addonTotal = addons.reduce((sum, addon) => sum + Number(addon.price), 0);

      return [
        ...currentCart,
        {
          ...item,
          cart_key: cartKey,
          qty: 1,
          selected_addons: addons,
          addon_total: addonTotal,
        },
      ];
    });
    setCartOpen(true);
  });

  const removeFromCart = useEffectEvent((itemId, cartKey = null) => {
    setCart((currentCart) => {
      const identifier = cartKey || itemId;
      const existingItemIndex = currentCart.findIndex((i) => (i.cart_key || i.id) === identifier);

      if (existingItemIndex === -1) return currentCart;

      const existingItem = currentCart[existingItemIndex];
      if (existingItem.qty > 1) {
        const newCart = [...currentCart];
        newCart[existingItemIndex] = {
          ...existingItem,
          qty: existingItem.qty - 1,
        };
        return newCart;
      }

      return currentCart.filter((i) => (i.cart_key || i.id) !== identifier);
    });
  });

  const clearCart = () => setCart([]);

  const handleRequireSignIn = () => {
    setCartOpen(false);
    navigate("/login");
  };

  const handleOrderPlaced = (order) => {
    navigate("/profile"); // Instead of opening drawer to orders, redirect to profile page which will handle orders
  };

  const handleCustomerClick = () => {
    if (customer) {
      navigate("/profile");
    } else {
      navigate("/login");
    }
  };

  return (
    <div className="customer-shell flex min-h-screen flex-col">
      <Header
        cartItemCount={cart.reduce((sum, item) => sum + item.qty, 0)}
        onCartClick={() => setCartOpen(true)}
        customer={customer}
        onCustomerClick={handleCustomerClick}
        onNotificationsClick={() => {
          // If we had a dedicated notifications page we'd route there.
          // For now, let's just route to profile if they click the bell
          navigate("/profile");
        }}
        notificationSummary={notificationSummary}
      />
      
      <main className="flex-1">
        <Outlet 
          context={{
            cart,
            addToCart,
            removeFromCart,
            clearCart,
            restaurantSettings,
          }}
        />
      </main>

      {/* Only show Footer if not on Contact Page, as Contact Page might have its own rich contact section */}
      {location.pathname !== "/contact" && <Footer />}

      <Suspense fallback={null}>
        {cartOpen && (
          <CartDrawer
            cart={cart}
            customer={customer}
            restaurantSettings={restaurantSettings}
            onClose={() => setCartOpen(false)}
            onAdd={addToCart}
            onRemove={removeFromCart}
            onClearCart={clearCart}
            onRequireSignIn={handleRequireSignIn}
            onOrderPlaced={handleOrderPlaced}
          />
        )}
      </Suspense>

    </div>
  );
}

export default Layout;
