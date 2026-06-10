import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { customerAuthStorage } from "../../auth/customerAuthStorage";
import {
  fetchCustomerNotifications,
  markAllCustomerNotificationsAsRead,
  markCustomerNotificationAsRead,
  fetchCustomerUnreadNotificationSummary,
} from "../../services/customerNotificationApi";
import { stopCustomerNotificationAlert } from "../../Utils/notificationSound";

const formatDateTime = (value) => {
  if (!value) return "-";
  try {
    return new Date(value).toLocaleString("en-IN", {
      dateStyle: "medium",
      timeStyle: "short",
    });
  } catch (_error) {
    return value;
  }
};

export default function NotificationDrawer({
  open,
  onClose,
  notificationsRefreshKey = 0,
  onNotificationSummaryChange,
}) {
  const LIVE_ITEM_HIGHLIGHT_MS = 30000;
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [markingAllRead, setMarkingAllRead] = useState(false);
  const [highlightedIds, setHighlightedIds] = useState([]);

  useEffect(() => {
    if (!open) return;
    
    stopCustomerNotificationAlert();

    let cancelled = false;
    const loadNotifications = async () => {
      setLoading(true);
      setError("");
      try {
        const accessToken = customerAuthStorage.getAccessToken();
        if (!accessToken) return;

        const result = await fetchCustomerNotifications(accessToken, { page: 1, limit: 30 });
        if (!cancelled) {
          setNotifications(result.data || []);
          if (notificationsRefreshKey > 0 && result.data?.[0]?.id) {
            const id = Number(result.data[0].id);
            setHighlightedIds((prev) => [...new Set([...prev, id])]);
            setTimeout(() => {
              setHighlightedIds((prev) => prev.filter((v) => v !== id));
            }, LIVE_ITEM_HIGHLIGHT_MS);
          }
        }
      } catch (err) {
        if (!cancelled) {
          setNotifications([]);
          setError(err.message);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    
    void loadNotifications();
    return () => { cancelled = true; };
  }, [open, notificationsRefreshKey]);

  const refreshNotificationSummary = async () => {
    try {
      const accessToken = customerAuthStorage.getAccessToken();
      const summary = await fetchCustomerUnreadNotificationSummary(accessToken, 10);
      onNotificationSummaryChange?.(summary);
    } catch (_error) {
      onNotificationSummaryChange?.({ unreadCount: 0, notifications: [] });
    }
  };

  const openNotification = async (notification) => {
    if (!notification || Number(notification.is_read) === 1) return;

    try {
      const accessToken = customerAuthStorage.getAccessToken();
      await markCustomerNotificationAsRead(notification.id, accessToken);
      setNotifications((prev) =>
        prev.map((entry) =>
          entry.id === notification.id
            ? { ...entry, is_read: 1, read_at: new Date().toISOString() }
            : entry
        )
      );
      setHighlightedIds((prev) => prev.filter((v) => v !== Number(notification.id)));
      await refreshNotificationSummary();
    } catch (err) {
      setError(err.message);
    }
  };

  const markAllRead = async () => {
    setMarkingAllRead(true);
    setError("");
    try {
      const accessToken = customerAuthStorage.getAccessToken();
      await markAllCustomerNotificationsAsRead(accessToken);
      setNotifications((prev) =>
        prev.map((entry) => ({
          ...entry,
          is_read: 1,
          read_at: entry.read_at || new Date().toISOString(),
        }))
      );
      await refreshNotificationSummary();
    } catch (err) {
      setError(err.message);
    } finally {
      setMarkingAllRead(false);
    }
  };

  if (!open) return null;

  return (
    <>
      <div onClick={onClose} className="customer-drawer-overlay" />
      <div className="customer-drawer-panel flex flex-col !z-[221]">
        <div className="flex items-center justify-between border-b border-white/5 pb-5 px-5 pt-6 sm:px-6">
          <div>
            <h2 className="m-0 font-serif text-2xl font-bold text-white">Notifications</h2>
            <p className="mt-1 font-sans text-[13px] text-white/55">Recent updates on your orders.</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={markAllRead}
              disabled={markingAllRead || notifications.length === 0}
              className="text-xs font-bold uppercase tracking-wider text-cafe-gold hover:text-white transition-colors disabled:opacity-50"
            >
              Mark all read
            </button>
            <button
              onClick={onClose}
              className="flex h-10 w-10 items-center justify-center rounded-full bg-white/5 text-white transition-colors hover:bg-cafe-gold hover:text-[#110e0d]"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-5 pb-6 pt-[18px] sm:px-6">
          {error && (
            <div className="mb-4 rounded-xl border border-red-500/25 bg-red-500/10 px-[14px] py-3 text-[13px] text-red-200">
              {error}
            </div>
          )}

          <div className="grid gap-2.5">
            {loading && (
              <div className="rounded-[14px] bg-white/[0.03] px-[14px] py-[14px] text-[13px] text-white/70">
                Loading notifications...
              </div>
            )}

            {!loading && notifications.length === 0 && (
              <div className="rounded-[14px] bg-white/[0.03] px-[14px] py-[14px] text-[13px] leading-6 text-white/70">
                You have no notifications right now.
              </div>
            )}

            {notifications.map((notification) => {
              const highlighted = highlightedIds.includes(Number(notification.id));
              const isRead = Number(notification.is_read) === 1;

              return (
                <button
                  key={notification.id}
                  onClick={() => openNotification(notification)}
                  className={`grid gap-2 rounded-[14px] px-[14px] py-[14px] text-left text-white transition-all duration-300 ${
                    highlighted
                      ? "border border-amber-400/35 bg-gradient-to-br from-amber-500/25 to-red-500/15 shadow-[inset_0_0_0_1px_rgba(245,158,11,0.16)]"
                      : isRead
                        ? "border border-white/10 bg-white/[0.03]"
                        : "border border-amber-400/25 bg-gradient-to-br from-amber-500/15 to-red-500/10"
                  }`}
                >
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="font-bold">{notification.title}</div>
                    <div className={`text-xs font-bold ${isRead ? "text-white/45" : "text-amber-200"}`}>
                      {isRead ? "Read" : "New"}
                    </div>
                  </div>
                  <div className="text-[13px] leading-6 text-white/70">{notification.message}</div>
                  <div className="text-xs text-white/45">{formatDateTime(notification.created_at)}</div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
}
