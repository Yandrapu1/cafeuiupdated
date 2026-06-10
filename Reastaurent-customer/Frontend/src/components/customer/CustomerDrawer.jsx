import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { X, ChevronDown, ChevronUp } from "lucide-react";
import { customerAuthStorage } from "../../auth/customerAuthStorage";
import {
  changeCustomerPassword,
  loginCustomer,
  logoutCustomer,
  registerCustomer,
} from "../../services/customerAuthApi";
import {
  fetchCustomerProfile,
  updateCustomerProfile,
} from "../../services/customerProfileApi";
import { fetchMyOrders } from "../../services/orderApi";
import { fetchCustomerUnreadNotificationSummary } from "../../services/customerNotificationApi";

const formatDateTime = (value) => {
  if (!value) {
    return "-";
  }
  try {
    return new Date(value).toLocaleString("en-IN", {
      dateStyle: "medium",
      timeStyle: "short",
    });
  } catch (_error) {
    return value;
  }
};

function Notice({ tone = "success", message }) {
  if (!message) {
    return null;
  }
  const isSuccess = tone === "success";
  return (
    <div
      className={`rounded-xl px-[14px] py-3 text-[13px] mb-4 ${
        isSuccess
          ? "border border-green-500/25 bg-green-500/15 text-green-200"
          : "border border-red-500/25 bg-red-500/10 text-red-200"
      }`}
    >
      {message}
    </div>
  );
}

function GuestView({ onAuthenticated }) {
  const [mode, setMode] = useState("login");
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [loginForm, setLoginForm] = useState({ email: "", password: "" });
  const [registerForm, setRegisterForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirm_password: "",
  });

  const isLogin = mode === "login";

  const handleLogin = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    setErrorMessage("");

    try {
      const session = await loginCustomer(loginForm);
      customerAuthStorage.setSession({
        accessToken: session.access_token,
        refreshToken: session.refresh_token,
        customer: session.customer,
      });
      onAuthenticated(session.customer);
    } catch (error) {
      setErrorMessage(error.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleRegister = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    setErrorMessage("");

    try {
      const session = await registerCustomer(registerForm);
      customerAuthStorage.setSession({
        accessToken: session.access_token,
        refreshToken: session.refresh_token,
        customer: session.customer,
      });
      onAuthenticated(session.customer);
    } catch (error) {
      setErrorMessage(error.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="customer-card">
        <div className="mb-[18px] flex gap-2">
          {["login", "register"].map((tab) => {
            const active = tab === mode;
            return (
              <button
                key={tab}
                onClick={() => {
                  setMode(tab);
                  setErrorMessage("");
                }}
                className={`flex-1 rounded-xl px-3 py-2.5 font-bold capitalize text-white transition ${
                  active
                    ? "border border-amber-400/40 bg-gradient-to-br from-amber-500/20 to-red-500/20"
                    : "border border-white/10 bg-white/[0.03] hover:bg-white/[0.06]"
                }`}
              >
                {tab}
              </button>
            );
          })}
        </div>

        <h3 className="m-0 text-[22px] font-bold text-white">
          {isLogin ? "Sign in to continue" : "Create your customer account"}
        </h3>
        <p className="mt-2 text-[13px] leading-6 text-white/60">
          Once signed in, this panel will show your profile, orders, account, and address details.
        </p>

        <div className="mt-4">
          <Notice tone="error" message={errorMessage} />
        </div>

        <form
          onSubmit={isLogin ? handleLogin : handleRegister}
          className="mt-4 flex flex-col gap-3"
        >
          {isLogin ? (
            <>
              <input
                type="email"
                value={loginForm.email}
                onChange={(event) =>
                  setLoginForm((prev) => ({ ...prev, email: event.target.value }))
                }
                placeholder="Email address"
                className="customer-input"
                required
              />
              <input
                type="password"
                value={loginForm.password}
                onChange={(event) =>
                  setLoginForm((prev) => ({ ...prev, password: event.target.value }))
                }
                placeholder="Password"
                className="customer-input"
                required
              />
            </>
          ) : (
            <>
              <input
                type="text"
                value={registerForm.name}
                onChange={(event) =>
                  setRegisterForm((prev) => ({ ...prev, name: event.target.value }))
                }
                placeholder="Full name"
                className="customer-input"
                required
              />
              <input
                type="email"
                value={registerForm.email}
                onChange={(event) =>
                  setRegisterForm((prev) => ({ ...prev, email: event.target.value }))
                }
                placeholder="Email address"
                className="customer-input"
                required
              />
              <input
                type="tel"
                value={registerForm.phone}
                onChange={(event) =>
                  setRegisterForm((prev) => ({ ...prev, phone: event.target.value }))
                }
                placeholder="Mobile number"
                className="customer-input"
                required
              />
              <input
                type="password"
                value={registerForm.password}
                onChange={(event) =>
                  setRegisterForm((prev) => ({ ...prev, password: event.target.value }))
                }
                placeholder="Password"
                className="customer-input"
                required
              />
              <input
                type="password"
                value={registerForm.confirm_password}
                onChange={(event) =>
                  setRegisterForm((prev) => ({ ...prev, confirm_password: event.target.value }))
                }
                placeholder="Confirm password"
                className="customer-input"
                required
              />
            </>
          )}

          <button type="submit" disabled={submitting} className="customer-primary-button">
            {submitting ? (isLogin ? "Signing in..." : "Creating account...") : (isLogin ? "Sign In" : "Register")}
          </button>
        </form>
      </div>
    </div>
  );
}

function SignedInView({
  customer,
  onCustomerChange,
  initialTab = "profile",
  ordersRefreshKey = 0,
}) {
  const navigate = useNavigate();
  const [expandedSection, setExpandedSection] = useState(initialTab || "profile");
  
  const [profileForm, setProfileForm] = useState({
    name: customer?.name || "",
    email: customer?.email || "",
    phone: customer?.phone || "",
  });
  const [passwordForm, setPasswordForm] = useState({
    current_password: "",
    new_password: "",
    confirm_password: "",
  });
  
  const [message, setMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [savingProfile, setSavingProfile] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);
  
  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [ordersError, setOrdersError] = useState("");

  const toggleSection = (section) => {
    setExpandedSection(prev => prev === section ? null : section);
    setMessage("");
    setErrorMessage("");
  };

  useEffect(() => {
    setProfileForm({
      name: customer?.name || "",
      email: customer?.email || "",
      phone: customer?.phone || "",
    });
  }, [customer]);

  useEffect(() => {
    if (expandedSection !== "orders") return;

    let cancelled = false;
    const loadOrders = async () => {
      setOrdersLoading(true);
      setOrdersError("");
      try {
        const accessToken = customerAuthStorage.getAccessToken();
        const result = await fetchMyOrders(accessToken, { page: 1, limit: 20 });
        if (!cancelled) setOrders(result.data || []);
      } catch (error) {
        if (!cancelled) {
          setOrders([]);
          setOrdersError(error.message);
        }
      } finally {
        if (!cancelled) setOrdersLoading(false);
      }
    };
    void loadOrders();
    return () => { cancelled = true; };
  }, [expandedSection, ordersRefreshKey]);

  const saveProfile = async (event) => {
    event.preventDefault();
    setSavingProfile(true);
    setMessage("");
    setErrorMessage("");

    try {
      const updatedCustomer = await updateCustomerProfile(
        profileForm,
        customerAuthStorage.getAccessToken()
      );
      customerAuthStorage.updateCustomer(updatedCustomer);
      onCustomerChange(updatedCustomer);
      setMessage("Profile updated successfully");
    } catch (error) {
      setErrorMessage(error.message);
    } finally {
      setSavingProfile(false);
    }
  };

  const submitPasswordChange = async (event) => {
    event.preventDefault();
    setSavingPassword(true);
    setMessage("");
    setErrorMessage("");

    try {
      await changeCustomerPassword(
        passwordForm,
        customerAuthStorage.getAccessToken()
      );
      customerAuthStorage.clearSession();
      onCustomerChange(null);
    } catch (error) {
      setErrorMessage(error.message);
    } finally {
      setSavingPassword(false);
    }
  };

  const signOut = async () => {
    try {
      const accessToken = customerAuthStorage.getAccessToken();
      if (accessToken) await logoutCustomer(accessToken);
    } catch (_error) {
    } finally {
      customerAuthStorage.clearSession();
      onCustomerChange(null);
    }
  };

  const viewOrderDetails = async (orderId) => {
    navigate(`/orders/${orderId}`);
  };

  const AccordionItem = ({ title, sectionKey, children }) => {
    const isExpanded = expandedSection === sectionKey;
    return (
      <div className="mb-3 rounded-[14px] bg-white/[0.03] border border-white/10 overflow-hidden">
        <button
          className="w-full px-5 py-4 flex items-center justify-between text-left text-white hover:bg-white/[0.05] transition-colors"
          onClick={() => toggleSection(sectionKey)}
        >
          <span className="font-bold">{title}</span>
          {isExpanded ? <ChevronUp className="h-5 w-5 text-cafe-gold" /> : <ChevronDown className="h-5 w-5 text-white/50" />}
        </button>
        {isExpanded && (
          <div className="px-5 pb-5 pt-2 border-t border-white/5 bg-black/20">
            {children}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="flex flex-col">
      <div className="customer-card mb-4 bg-transparent border-none p-0 shadow-none">
        <div className="mb-6 flex items-center gap-[14px]">
          <div className="grid h-16 w-16 place-items-center rounded-2xl bg-gradient-to-br from-amber-500 to-red-500 text-2xl font-extrabold text-white shadow-lg">
            {(customer?.name || "C").slice(0, 1).toUpperCase()}
          </div>
          <div className="min-w-0">
            <h3 className="m-0 truncate text-xl font-bold text-white">
              {customer?.name || "Customer"}
            </h3>
            <p className="mt-1.5 truncate text-[13px] text-white/55">
              {customer?.email}
            </p>
          </div>
        </div>

        <Notice tone="success" message={message} />
        <Notice tone="error" message={errorMessage} />

        <div className="space-y-0">
          <AccordionItem title="My Profile" sectionKey="profile">
            <form onSubmit={saveProfile} className="mt-2 flex flex-col gap-3">
              <input
                type="text"
                value={profileForm.name}
                onChange={(e) => setProfileForm((prev) => ({ ...prev, name: e.target.value }))}
                placeholder="Full name"
                className="customer-input"
                required
              />
              <input
                type="email"
                value={profileForm.email}
                onChange={(e) => setProfileForm((prev) => ({ ...prev, email: e.target.value }))}
                placeholder="Email address"
                className="customer-input"
                required
              />
              <input
                type="tel"
                value={profileForm.phone}
                onChange={(e) => setProfileForm((prev) => ({ ...prev, phone: e.target.value }))}
                placeholder="Mobile number"
                className="customer-input"
                required
              />
              <button type="submit" disabled={savingProfile} className="customer-primary-button mt-2">
                {savingProfile ? "Saving..." : "Save Profile"}
              </button>
            </form>
          </AccordionItem>

          <AccordionItem title="My Orders" sectionKey="orders">
            {ordersError && <div className="text-red-400 text-sm mb-3">{ordersError}</div>}
            {ordersLoading && <div className="text-white/70 text-sm">Loading your orders...</div>}
            {!ordersLoading && orders.length === 0 && (
              <div className="text-white/70 text-sm">No orders yet. Your past orders will appear here.</div>
            )}
            <div className="grid gap-3 mt-2">
              {orders.map((order) => (
                <div key={order.id} className="rounded-xl border border-white/10 bg-white/[0.03] p-3">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-bold text-sm text-white">{order.order_number}</span>
                    <span className="text-xs font-bold text-amber-200 capitalize">{String(order.order_status).replace(/_/g, " ")}</span>
                  </div>
                  <div className="text-xs text-white/60 mb-3">{formatDateTime(order.created_at)}</div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-bold text-white">Rs {Number(order.total_amount || 0).toFixed(2)}</span>
                    <button onClick={() => viewOrderDetails(order.id)} className="text-xs font-bold text-cafe-gold hover:text-white transition-colors">
                      View Details
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </AccordionItem>

          <AccordionItem title="My Account" sectionKey="account">
            <form onSubmit={submitPasswordChange} className="mt-2 flex flex-col gap-3">
              <input
                type="password"
                value={passwordForm.current_password}
                onChange={(e) => setPasswordForm((prev) => ({ ...prev, current_password: e.target.value }))}
                placeholder="Current password"
                className="customer-input"
                required
              />
              <input
                type="password"
                value={passwordForm.new_password}
                onChange={(e) => setPasswordForm((prev) => ({ ...prev, new_password: e.target.value }))}
                placeholder="New password"
                className="customer-input"
                required
              />
              <input
                type="password"
                value={passwordForm.confirm_password}
                onChange={(e) => setPasswordForm((prev) => ({ ...prev, confirm_password: e.target.value }))}
                placeholder="Confirm new password"
                className="customer-input"
                required
              />
              <button type="submit" disabled={savingPassword} className="customer-primary-button mt-2">
                {savingPassword ? "Updating..." : "Change Password"}
              </button>
            </form>
          </AccordionItem>

          <AccordionItem title="Address" sectionKey="address">
            <div className="text-[13px] leading-6 text-white/70">
              Address management system will be fully integrated here. For now, you can add notes directly during checkout.
            </div>
          </AccordionItem>
        </div>

        <button
          onClick={signOut}
          className="mt-6 w-full rounded-[14px] border border-red-500/20 bg-red-500/10 px-[14px] py-[11px] text-[13px] font-bold text-red-400 transition hover:bg-red-500/20"
        >
          Logout
        </button>
      </div>
    </div>
  );
}

function CustomerDrawer({
  open,
  onClose,
  customer,
  onCustomerChange,
  initialTab = "profile",
  ordersRefreshKey = 0,
}) {
  if (!open) {
    return null;
  }

  const handleAuthenticated = async (sessionCustomer) => {
    onCustomerChange(sessionCustomer);
    try {
      const accessToken = customerAuthStorage.getAccessToken();
      const freshProfile = await fetchCustomerProfile(accessToken);
      customerAuthStorage.updateCustomer(freshProfile);
      onCustomerChange(freshProfile);
    } catch (_error) {
      onCustomerChange(sessionCustomer);
    }
  };

  return (
    <>
      <div onClick={onClose} className="customer-drawer-overlay" />
      <div className="customer-drawer-panel flex flex-col !z-[221]">
        <div className="flex items-center justify-between border-b border-white/5 pb-5">
          <div>
            <h2 className="m-0 font-serif text-2xl font-bold text-white">
              {customer ? "Customer Panel" : "Sign In"}
            </h2>
            <p className="mt-2 font-sans text-[13px] text-white/55">
              {customer
                ? "Manage your profile, orders, and account settings."
                : "Sign in to access your profile and history."}
            </p>
          </div>
          <button
            onClick={onClose}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-white/5 text-white transition-colors hover:bg-cafe-gold hover:text-[#110e0d]"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-5 pb-6 pt-[18px] sm:px-6">
          {customer ? (
            <SignedInView
              customer={customer}
              onCustomerChange={onCustomerChange}
              initialTab={initialTab}
              ordersRefreshKey={ordersRefreshKey}
            />
          ) : (
            <GuestView onAuthenticated={handleAuthenticated} />
          )}
        </div>
      </div>
    </>
  );
}

export default CustomerDrawer;
