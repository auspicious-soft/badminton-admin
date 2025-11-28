"use client";
import React, { useState, useEffect, useCallback, useRef } from "react";
import Modal from "@mui/material/Modal";
import { X, Bell, Loader2 } from "lucide-react";
import { getNotifications, markNotificationRead, markAllNotificationRead } from "@/services/admin-services";
import useSWR from "swr";
import Success from "@/assets/images/accepted.png";
import Cancel from "@/assets/images/cancelled.png";
import FreeGame from "@/assets/images/freeGame.png";
import Player from "@/assets/images/player.png";
import StarBadge from "@/assets/images/starBadge.png";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

interface NotificationItem {
  _id: string;
  bookingData?: any;
  user?: { name: string; avatar?: string };
  action?: string;
  timestamp?: string;
  type?: string;
  userData?: { fullName?: string };
  isReadyByAdmin?: boolean;
  title?: string;
    message?: string; 
 metadata?: {
    type?: string;
    bookingId?: string;
    transactionId?: string;
    amount?: number;
    timestamp?: string;
  };
}

interface NotificationModalProps {
  open: boolean;
  onClose: () => void;
   onAllRead?: () => void;
  onSingleRead?: (id: string) => void;
}

interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

const NotificationModal: React.FC<NotificationModalProps> = ({ open, onClose, onAllRead, onSingleRead }) => {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  console.log('notifications: ', notifications);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const [error, setError] = useState<string | null>(null);
  const [loadingMore, setLoadingMore] = useState(false);

  const router = useRouter();
  const lastNotificationRef = useRef<HTMLDivElement>(null);
  const { data: session } = useSession();
  const userRole = (session as any)?.user?.role;
  const venueId = (session as any)?.user?.venueId;

 let endpoint = "";

  if (userRole === "admin") {
    endpoint = `/admin/notifications?page=${page}&limit=10`;
  } else {
    endpoint = `/admin/notifications?page=${page}&limit=10&venueId=${venueId}`;
  }
  const {
    data,
    error: swrError,
    isLoading,
    mutate,
  } = useSWR(open ? endpoint : null, getNotifications, {
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
    revalidateIfStale: false,
    keepPreviousData: true,
    dedupingInterval: 5000,
  });

  const notificationMessages = {
    FREE_GAME_EARNED: (user) => `${user} has earned a free game.`,
    PAYMENT_SUCCESSFUL: (user) => `${user} created a new game.`,
    BOOKING_CANCELLED: (user) => `${user} has cancelled the game.`,
    FREE_GAME_USED: (user) => `${user} has used a free game.`,
    PLAYER_JOINED_GAME: (user) => `${user} has joined the game`,
    REFUND_COMPLETED: (user) => `Refund is provided to ${user} `,
    PAYMENT_FAILED: (user) => `${user} 's payment failed for the game`,
  };

  const notificationTitle = {
    FREE_GAME_EARNED: `Free Game Earned`,
    PAYMENT_SUCCESSFUL: `Game Booked Successfully`,
    BOOKING_CANCELLED: `Booking Cancelled`,
    FREE_GAME_USED: `Free Game Used`,
    PLAYER_JOINED_GAME: `New Player Joined`,
    REFUND_COMPLETED:'Refund Successfully',
    PAYMENT_FAILED:'Payment Failed'
  };

  const notificationIcons = {
    PAYMENT_SUCCESSFUL: { src: Success, alt: "Success", wrapper: false },
    BOOKING_CANCELLED: { src: Cancel, alt: "Cancel", wrapper: true },
    PAYMENT_FAILED: { src: Cancel, alt: "Cancel", wrapper: true },
    FREE_GAME_EARNED: { src: StarBadge, alt: "StarBadge", wrapper: false },
    FREE_GAME_USED: { src: FreeGame, alt: "FreeGame", wrapper: false },
    PLAYER_JOINED_GAME: { src: Player, alt: "player", wrapper: false },
    REFUND_COMPLETED: { src: Success, alt: "Success", wrapper: false },
  };

  useEffect(() => {
    if (data?.data) {
      const newNotifications = data.data.data || [];
      const existingIds = new Set(notifications.map((n) => n._id));
      const uniqueNewNotifications = newNotifications.filter((n) => !existingIds.has(n._id));

      if (page === 1) {
        setNotifications(uniqueNewNotifications);
      } else {
        setNotifications((prev) => [...prev, ...uniqueNewNotifications]);
      }

      setHasMore(data.data.meta?.hasNextPage || false);
      setError(null);
      setLoadingMore(false);
    }
  }, [data, page]);

  useEffect(() => {
    if (swrError) {
      setError(swrError.message || "Failed to load notifications");
      setLoadingMore(false);
    }
  }, [swrError]);

  const loadMoreNotifications = useCallback(() => {
    if (!isLoading && !loadingMore && hasMore) {
      setLoadingMore(true);
      setPage((prev) => prev + 1);
    }
  }, [isLoading, loadingMore, hasMore]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const lastEntry = entries[0];
        if (lastEntry.isIntersecting && hasMore && !isLoading && !loadingMore) {
          loadMoreNotifications();
        }
      },
      { threshold: 0.1, rootMargin: "20px" }
    );

    if (lastNotificationRef.current && notifications.length > 0) {
      observer.observe(lastNotificationRef.current);
    }

    return () => {
      if (lastNotificationRef.current) {
        observer.unobserve(lastNotificationRef.current);
      }
    };
  }, [hasMore, isLoading, loadingMore, loadMoreNotifications, notifications.length]);

  useEffect(() => {
    if (!open) {
      setNotifications([]);
      setPage(1);
      setHasMore(true);
      setError(null);
      setLoadingMore(false);
    }
  }, [open]);

  const retryLoad = () => {
    setError(null);
    setPage(1);
    setLoadingMore(false);
    mutate();
  };

  const handleMarkAllReadClick = async (e: any) => {
    e.stopPropagation();
    e.preventDefault();
    try {
      await markAllNotificationRead("/admin/notifications");
         onAllRead?.();
         mutate();
         onClose();
        } catch (error) {
          console.error("❌ Error marking all notifications as read:", error);
          
        }
      };
      
  const handleNotificationClick = async (notification: NotificationItem, e: React.MouseEvent | React.KeyboardEvent) => {
    e.stopPropagation();
    e.preventDefault();
    try {
      await markNotificationRead("/admin/notifications", { notificationId: notification._id });
        onSingleRead?.(notification._id);
      mutate();
    } catch (error) {
      console.error("❌ Error marking notification as read:", error);
    }

    setTimeout(() => {
      mutate();
      if (["PAYMENT_SUCCESSFUL", "BOOKING_CANCELLED"].includes(notification.type)) {
        if (notification.type === "BOOKING_CANCELLED") {
          router.push("/authority/matches?tab=Cancelled");
        } else {
          router.push("/authority/matches?tab=Upcoming");
        }
      }
      onClose();
    }, 10);
  };

  const handleModalContentClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  console.log("notifications",notifications)

  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="notifications-modal"
      className="flex items-start justify-center pt-16"
      disableEnforceFocus
    >
      <div
        className="bg-white rounded-[20px] w-[95%] max-w-[400px] shadow-lg max-h-[80vh] overflow-hidden"
        onClick={handleModalContentClick}
      >
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <h2 className="text-[#10375c] text-xl font-semibold">Notifications</h2>
          <div className="flex gap-2">
            <button
              onClick={handleMarkAllReadClick}
              className="px-1 py-[2px] bg-green-500 text-white text-xs rounded"
            >
              Mark all read
            </button>
            <button
              onClick={onClose}
              className="p-1 rounded-full hover:bg-gray-100 transition-colors"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>
        </div>

        <div className="max-h-[60vh] overflow-y-auto">
          {notifications.length > 0 ? (
            <div className="divide-y divide-gray-100">
              {notifications.map((notification, index) => {
                console.log('notification?.type: ', notification?.type);
                const {  src ,alt, wrapper } = notificationIcons[notification?.type];
                // const notificationText =
                // notifications?.metadata?.type === "Admin"
                // ? notifications?.message
                // : notificationMessages?.[notification?.type]?.(
                //   notification?.userData?.fullName || "Someone"
                // ) ??
                // `${notification?.userData?.fullName || "Someone"} performed an action.`;
                // console.log('notificationText: ', notificationText);
                return (
                  <div
                    key={notification._id}
                    ref={index === notifications.length - 1 ? lastNotificationRef : null}
                    className="p-4 hover:bg-gray-50 transition-colors cursor-pointer"
                    tabIndex={0}
                    onClick={(e) => handleNotificationClick(notification, e)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        handleNotificationClick(notification, e);
                      }
                    }}
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0">
                        {wrapper ? (
                          <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                            <Image src={src} alt={alt} className="w-10 h-10 rounded-full object-cover" />
                          </div>
                        ) : (
                          <Image src={src} alt={alt} className="w-10 h-10 rounded-full object-cover" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-col text-sm text-gray-900">
                          <span className="font-medium">
                            {notificationTitle[notification.type] || "Notification"}
                          </span>
                         <span className="text-gray-600">
  {notification?.metadata?.type === "Admin"
    ? notification?.message
    : notificationMessages[notification.type]
      ? notificationMessages[notification.type](notification?.userData?.fullName)
      : `${notification?.userData?.fullName || "Someone"} performed an action.`}
</span>
                        </div>
                        <div className="text-xs text-gray-500 mt-1">{notification.timestamp}</div>
                      </div>
                      <div className="flex-shrink-0">
                        <div
                          className={`w-2 h-2 rounded-full ${notification.isReadyByAdmin ? "bg-gray-500" : "bg-blue-500"
                            }`}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}

              {(loadingMore || (isLoading && page > 1)) && (
                <div className="p-4 flex items-center justify-center">
                  <Loader2 className="w-5 h-5 animate-spin text-gray-500" />
                  <span className="ml-2 text-sm text-gray-500">Loading more...</span>
                </div>
              )}

              {error && (
                <div className="p-4 text-center">
                  <p className="text-red-500 text-sm mb-2">{error}</p>
                  <button onClick={retryLoad} className="text-[#10375c] text-sm font-medium hover:underline">
                    Try Again
                  </button>
                </div>
              )}

              {!hasMore && (
                <div className="p-4 text-center">
                  <p className="text-gray-500 text-sm">No more notifications</p>
                </div>
              )}
            </div>
          ) : (
            <div className="p-8 text-center">
              {isLoading ? (
                <div className="flex flex-col items-center">
                  <Loader2 className="w-8 h-8 animate-spin text-gray-400 mb-4" />
                  <p className="text-gray-500 text-sm">Loading notifications...</p>
                </div>
              ) : error ? (
                <div className="flex flex-col items-center">
                  <div className="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
                    <X className="w-8 h-8 text-red-400" />
                  </div>
                  <p className="text-red-500 text-sm mb-2">{error}</p>
                  <button onClick={retryLoad} className="text-[#10375c] text-sm font-medium hover:underline">
                    Try Again
                  </button>
                </div>
              ) : (
                <div className="flex flex-col items-center">
                  <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                    <Bell className="w-8 h-8 text-gray-400" />
                  </div>
                  <p className="text-gray-500 text-sm">No notifications yet</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
};

export default NotificationModal;
