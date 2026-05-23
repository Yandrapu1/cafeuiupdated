import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { customerAuthStorage } from "../../auth/customerAuthStorage";
import { fetchCustomerProfile, updateCustomerProfile } from "../../services/customerProfileApi";
import { fetchMyOrders } from "../../services/orderApi";
import { logoutCustomer, changeCustomerPassword } from "../../services/customerAuthApi";

export default function ProfilePage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("profile");
  const [customer, setCustomer] = useState(null);
  
  const [loading, setLoading] = useState(true);
  const [savingProfile, setSavingProfile] = useState(false);
  const [message, setMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  
  const [profileForm, setProfileForm] = useState({ name: "", email: "", phone: "" });
  
  // Orders
  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(false);

  useEffect(() => {
    const accessToken = customerAuthStorage.getAccessToken();
    if (!accessToken) {
      navigate("/login");
      return;
    }

    const loadProfile = async () => {
      try {
        const profile = await fetchCustomerProfile(accessToken);
        setCustomer(profile);
        setProfileForm({ name: profile.name || "", email: profile.email || "", phone: profile.phone || "" });
      } catch (error) {
        console.error("Failed to load profile", error);
        customerAuthStorage.clearSession();
        navigate("/login");
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, [navigate]);

  useEffect(() => {
    if (activeTab === "orders") {
      const loadOrders = async () => {
        setOrdersLoading(true);
        try {
          const accessToken = customerAuthStorage.getAccessToken();
          const result = await fetchMyOrders(accessToken, { page: 1, limit: 20 });
          setOrders(result.data || []);
        } catch (error) {
          console.error(error);
        } finally {
          setOrdersLoading(false);
        }
      };
      loadOrders();
    }
  }, [activeTab]);

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setSavingProfile(true);
    setMessage("");
    setErrorMessage("");

    try {
      const updatedCustomer = await updateCustomerProfile(profileForm, customerAuthStorage.getAccessToken());
      customerAuthStorage.updateCustomer(updatedCustomer);
      setCustomer(updatedCustomer);
      setMessage("Profile updated successfully!");
    } catch (error) {
      setErrorMessage(error.message);
    } finally {
      setSavingProfile(false);
    }
  };

  const handleSignOut = async () => {
    try {
      const accessToken = customerAuthStorage.getAccessToken();
      if (accessToken) await logoutCustomer(accessToken);
    } catch (error) {
      console.error(error);
    } finally {
      customerAuthStorage.clearSession();
      navigate("/");
      window.location.reload();
    }
  };

  if (loading) {
    return <div className="pt-24 pb-16 min-h-screen bg-theme-bg flex items-center justify-center">Loading...</div>;
  }

  const tabs = [
    { key: "profile", label: "My Profile" },
    { key: "orders", label: "Order History" },
    { key: "security", label: "Security" },
  ];

  return (
    <div className="pt-24 pb-16 min-h-screen bg-theme-bg">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row gap-8">
        
        {/* Sidebar */}
        <div className="w-full md:w-64 shrink-0">
          <div className="bg-theme-surface rounded-3xl p-6 shadow-sm border border-theme-border">
            <div className="flex items-center gap-4 mb-8">
              <div className="h-12 w-12 rounded-full bg-theme-accent flex items-center justify-center text-xl font-bold text-theme-inverse-text">
                {customer?.name?.charAt(0).toUpperCase()}
              </div>
              <div className="min-w-0">
                <h2 className="text-theme-text font-bold truncate">{customer?.name}</h2>
                <p className="text-theme-text-muted text-xs truncate">{customer?.email}</p>
              </div>
            </div>

            <nav className="flex flex-col gap-2">
              {tabs.map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => { setActiveTab(tab.key); setMessage(""); setErrorMessage(""); }}
                  className={`text-left px-4 py-3 rounded-xl text-sm font-semibold transition-colors ${
                    activeTab === tab.key ? "bg-theme-accent text-theme-inverse-text" : "text-theme-inverse-text-muted hover:bg-theme-surface"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
              <hr className="my-2 border-theme-border" />
              <button
                onClick={handleSignOut}
                className="text-left px-4 py-3 rounded-xl text-sm font-semibold text-red-500 hover:bg-red-50 transition-colors"
              >
                Sign Out
              </button>
            </nav>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1">
          <div className="bg-theme-surface rounded-3xl p-8 shadow-sm border border-theme-border min-h-[400px]">
            {message && <div className="mb-6 rounded-xl border border-green-500/25 bg-green-50 p-4 text-sm text-theme-accent">{message}</div>}
            {errorMessage && <div className="mb-6 rounded-xl border border-red-500/25 bg-red-50 p-4 text-sm text-red-600">{errorMessage}</div>}

            {activeTab === "profile" && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <h3 className="font-serif text-2xl font-bold text-theme-text mb-6">Personal Details</h3>
                <form onSubmit={handleSaveProfile} className="flex flex-col gap-4 max-w-md">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-theme-text-muted mb-2">Full Name</label>
                    <input type="text" value={profileForm.name} onChange={(e) => setProfileForm(p => ({...p, name: e.target.value}))} className="w-full rounded-xl border border-theme-border px-4 py-3 text-sm focus:border-theme-accent focus:ring-1 focus:ring-theme-accent outline-none" required />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-theme-text-muted mb-2">Email Address</label>
                    <input type="email" value={profileForm.email} onChange={(e) => setProfileForm(p => ({...p, email: e.target.value}))} className="w-full rounded-xl border border-theme-border px-4 py-3 text-sm focus:border-theme-accent focus:ring-1 focus:ring-theme-accent outline-none" required />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-theme-text-muted mb-2">Phone Number</label>
                    <input type="tel" value={profileForm.phone} onChange={(e) => setProfileForm(p => ({...p, phone: e.target.value}))} className="w-full rounded-xl border border-theme-border px-4 py-3 text-sm focus:border-theme-accent focus:ring-1 focus:ring-theme-accent outline-none" required />
                  </div>
                  <button type="submit" disabled={savingProfile} className="mt-4 rounded-xl bg-theme-accent py-3 font-sans text-sm font-bold uppercase tracking-wider text-theme-inverse-text transition-transform hover:scale-[1.02] disabled:opacity-70">
                    {savingProfile ? "Saving..." : "Save Changes"}
                  </button>
                </form>
              </motion.div>
            )}

            {activeTab === "orders" && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <h3 className="font-serif text-2xl font-bold text-theme-text mb-6">Order History</h3>
                {ordersLoading ? (
                  <p className="text-theme-text-muted">Loading orders...</p>
                ) : orders.length === 0 ? (
                  <div className="text-center py-12">
                    <span className="text-4xl mb-4 block">🛍️</span>
                    <p className="text-theme-text-muted">You haven't placed any orders yet.</p>
                  </div>
                ) : (
                  <div className="grid gap-4">
                    {orders.map(order => (
                      <div key={order.id} className="border border-theme-border rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div>
                          <div className="font-bold text-theme-text">{order.order_number}</div>
                          <div className="text-xs text-theme-text-muted">{new Date(order.created_at).toLocaleDateString()}</div>
                        </div>
                        <div className="flex gap-8 text-sm">
                          <div><span className="text-theme-text-muted">Items:</span> <br/>{order.item_count}</div>
                          <div><span className="text-theme-text-muted">Total:</span> <br/>${Number(order.total_amount).toFixed(2)}</div>
                          <div><span className="text-theme-text-muted">Status:</span> <br/>
                            <span className="px-2 py-1 bg-amber-100 text-amber-800 rounded-md text-xs font-bold uppercase">{order.order_status.replace(/_/g, " ")}</span>
                          </div>
                        </div>
                        <button onClick={() => navigate(`/orders/${order.id}`)} className="px-4 py-2 border border-theme-border rounded-xl text-sm font-bold hover:bg-theme-surface transition-colors">
                          View
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </motion.div>
            )}

            {activeTab === "security" && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <h3 className="font-serif text-2xl font-bold text-theme-text mb-6">Security Settings</h3>
                <p className="text-theme-text-muted text-sm mb-6">To change your password, please use the forgot password flow from the login page, or implement the change password form here.</p>
              </motion.div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}
