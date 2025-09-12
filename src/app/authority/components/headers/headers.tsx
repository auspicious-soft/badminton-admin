"use client";
import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Bell, User, Menu, X } from "lucide-react";
import { AppLogoIcon, Loading } from "../../../../utils/svgicons";
import { signOut, useSession } from "next-auth/react";
import { logOutService } from "@/services/admin-services";
import NotificationModal from "../notifications/NotificationModal";
import { getNotifications } from "@/services/admin-services";
import useSWR from "swr";

const navigationLinks = [
  { href: "/authority/dashboard", label: "Dashboard", routes: ["/authority/dashboard"] },
  { href: "/authority/matches", label: "Matches", routes: ["/authority/matches"] },
  // { href: "/authority/tournaments", label: "Tournaments", routes: ["/authority/tournaments"] },
  { href: "/authority/users", label: "Users", routes: ["/authority/users"] },
  { href: "/authority/notifications", label: "Notifications", routes: ["/authority/notifications"] },
  { href: "/authority/venue", label: "Venue", routes: ["/authority/venue"] },
  // { href: "/authority/merchandises", label: "Merchandise", routes: ["/authority/merchandises", "/authority/merchandises/[id]", "/authority/merchandises/add"] },
  { href: "/authority/inventory", label: "Inventory", routes: ["/authority/inventory"] },
  { href: "/authority/employees", label: "Employees", routes: ["/authority/employees"] },
  { href: "/authority/maintenance", label: "Maintenance", routes: ["/authority/maintenance"] },
  { href: "/authority/pricing", label: "Pricing", routes: ["/authority/pricing"] },
  { href: "/authority/miscellaneous", label: "Misc", routes: ["/authority/miscellaneous"] },
];

const isTabActive = (pathname, routes) => {
  return routes.some((route) => {
    if (route.includes("[id]")) {
      return pathname.startsWith(route.replace("[id]", ""));
    }
    return pathname === route || pathname.startsWith(route + "/");
  });
};

const Headers = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showNotificationDropdown, setShowNotificationDropdown] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [logoutLoading, setLogoutLoading] = useState(false);
  const [hasUnreadNotifications, setHasUnreadNotifications] = useState(false);
  const { data, status } = useSession();
  const userRole = (data as any)?.user?.role;
  const logoRoute = typeof userRole === 'string' && userRole === "employee" ? "/authority/matches" : "/authority/dashboard"
  const name = data?.user?.name || "User";
  const router = useRouter();
  const pathname = usePathname();
  const isProfileActive = pathname === "/authority/profile";
  const venueId = (data as any)?.user?.venueId;
  let endpoint = ""
  // userRole === "employee"
  //   ? `/admin/notifications?page=1&limit=10&venueId=${venueId}`
  //   : `/admin/notifications?page=1&limit=1000`;

  if (userRole === "admin") {
    endpoint = `/admin/notifications?page=1&limit=10`
  }
  else {
    endpoint = `/admin/notifications?page=1&limit=10&venueId=${venueId}`
  }
  const {
    data: notificationsData,
    error: swrError,
    isLoading,
    mutate,
  } = useSWR(endpoint, getNotifications, {
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
    revalidateIfStale: false,
    keepPreviousData: true,
    dedupingInterval: 100,
  });
  // const hasUnreadNotifications = Array.isArray(notificationsData?.data?.data)
  //   ? notificationsData.data.data.some((n) => n.isReadyByAdmin === true
  // )
  //   : false;


  // useEffect(() => {
  //     if (notificationsData) {
  //       mutate()
  //     }
  //   }, [notificationsData, mutate])


  // Filter navigation links based on userRole
  const filteredNavigationLinks = userRole?.toLowerCase() === "employee"
    ? navigationLinks.filter(
      (link) => link.label !== "Venue" && link.label !== "Employees" && link.label !== "Misc" && link.label !== "Dashboard" && link.label !== "Users" && link.label !== "Pricing"
    )
    : navigationLinks;

  const dropdownRef = useRef(null);
  const notificationRef = useRef(null);
  
  const handleLogout = async () => {
    setLogoutLoading(true);
    if (userRole === "employee") {
      await logOutService('admin/logout-employee');
    }
    signOut({ callbackUrl: "/" });
    setLogoutLoading(false);
  }

  useEffect(() => {
    const handleClickOutside = (event) => {

      // Check if the click is outside the user dropdown
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }

      // Check if the click is outside the notification area
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        // Don't close if the click is inside the notification modal content
        const notificationModal = document.querySelector('[aria-labelledby="notifications-modal"]');
        if (notificationModal && notificationModal.contains(event.target)) {
          return;
        }
        setShowNotificationDropdown(false);
      }
    };

    if (showDropdown || showNotificationDropdown) {
      // Add a small delay to prevent immediate closing
      const timer = setTimeout(() => {
        document.addEventListener("mousedown", handleClickOutside);
      }, 100);

      return () => {
        clearTimeout(timer);
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showDropdown, showNotificationDropdown]);

  const handleNotificationClick = (e) => {
    e.stopPropagation();
    setShowNotificationDropdown(!showNotificationDropdown);
  };

  const handleNotificationClose = () => {
    setShowNotificationDropdown(false);
  };


  // After fetching notifications in SWR:
  // After fetching notifications in SWR:
  useEffect(() => {
    if (Array.isArray(notificationsData?.data?.data)) {
      const hasUnread = notificationsData.data.data.some(
        (n) => n.isReadyByAdmin === false
      );
      setHasUnreadNotifications(hasUnread);
    } else {
      setHasUnreadNotifications(false);
    }
  }, [notificationsData]);



  return (
    <div className="sticky top-0 w-full py-4 px-4 md:px-6 z-50 bg-[#fbfaff] pb-1">
      <div className="max-w-[1920px] mx-auto">
        <div className="flex items-center justify-between w-full">
          <Link href={logoRoute} className="flex items-center hover:bg-gray-50 transition-colors">
            <span className="text-orange-500 font-semibold">
              <AppLogoIcon />
            </span>
          </Link>

          <div className="flex items-center gap-2">
            <nav className="hidden lg:flex items-center bg-[#FFF] p-1 rounded-[44px]">
              {filteredNavigationLinks.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  className={`py-2 px-3 xl:py-3 xl:px-4 rounded-[28px] text-xs xl:text-sm font-medium whitespace-nowrap transition-colors ${isTabActive(pathname, link.routes)
                      ? "bg-gray-900 text-white"
                      : "text-[#1b2229] hover:bg-gray-100"
                    }`}
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            <div className="flex items-center relative" ref={dropdownRef}>
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="lg:hidden p-2 rounded-full hover:bg-gray-100 transition-colors"
              >
                {isMobileMenuOpen ? (
                  <X className="w-5 h-5 md:w-6 md:h-6" />
                ) : (
                  <Menu className="w-5 h-5 md:w-6 md:h-6" />
                )}
              </button>

              <div className="relative" ref={notificationRef}>
                {/* <button
                  className="p-2 md:p-3 rounded-full bg-[#FFF] text-gray-500 hover:text-gray-900 hover:bg-gray-100 transition-colors"
                  onClick={handleNotificationClick}
                >
                  <Bell className="w-4 h-4 md:w-5 md:h-5" />
                </button> */}
                <button
                  className="p-2 md:p-3 rounded-full bg-[#FFF] text-gray-500 hover:text-gray-900 hover:bg-gray-100 transition-colors relative"
                  onClick={handleNotificationClick}
                >
                  <Bell className="w-4 h-4 md:w-5 md:h-5" />
                  {hasUnreadNotifications && (
                    <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
                  )}
                </button>

                <NotificationModal
                  open={showNotificationDropdown}
                  onClose={handleNotificationClose}
                  onAllRead={() => setHasUnreadNotifications(false)}
                  onSingleRead={(id) => {
                    setHasUnreadNotifications((prev) => {
                      if (!prev) return false;
                      // Optional: manually check remaining unread
                      const remaining = notificationsData.data.data.filter(n => n._id !== id && n.isReadyByAdmin === false);
                      return remaining.length > 0;
                    });
                  }}
                />
              </div>

              <button
                onClick={() => setShowDropdown(!showDropdown)}
                className={`p-2 md:p-3 rounded-full bg-[#FFF] transition-colors ${isProfileActive
                    ? "bg-gray-900 text-white hover:bg-gray-800"
                    : "text-gray-500 hover:text-gray-900 hover:bg-gray-100"
                  }`}
              >
                <User className="w-4 h-4 md:w-5 md:h-5" />
              </button>

              {showDropdown && (
                <div className="absolute z-20 top-[50px] right-0 w-48 bg-white p-5 rounded-lg shadow-xl">
                  <button
                    onClick={() => {
                      router.push("/authority/profile");
                      setShowDropdown(false);
                    }}
                    className="text-darkBlack w-full hover:underline text-left mb-[5px]"
                  >
                    Profile
                  </button>
                  <button
                    onClick={() => {
                      setShowLogoutModal(true);
                      setShowDropdown(false);
                    }}
                    className="text-darkBlack w-full hover:underline text-left"
                  >
                    Log Out
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {isMobileMenuOpen && (
          <div className="lg:hidden absolute left-4 right-4 mt-2 bg-white rounded-lg shadow-lg overflow-hidden">
            <nav className="py-2">
              {filteredNavigationLinks.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  className={`block px-4 py-2 text-sm transition-colors ${isTabActive(pathname, link.routes)
                      ? "bg-gray-900 text-white"
                      : "text-gray-500 hover:text-gray-900 hover:bg-gray-50"
                    }`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>
        )}

        {showLogoutModal && (
          <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white p-6 rounded-2xl shadow-lg max-w-md w-full mx-4">
              <h2
                id="delete-confirmation-modal"
                className="text-center text-[#10375c] text-xl font-semibold mb-4"
              >
                Confirm Logout
              </h2>

              <p className="text-center text-gray-700 mb-6">
                Are you sure you want to log out?
              </p>

              <div className="flex gap-4">
                <button
                  onClick={() => setShowLogoutModal(false)}
                  className="flex-1 h-12 bg-white border border-[#10375c] rounded-[28px] text-[#10375c] text-sm font-medium"
                >
                  Cancel
                </button>

                <button
                  onClick={() => handleLogout()}
                  className="flex items-center justify-center flex-1 h-12 bg-[#10375c] rounded-[28px] text-white text-sm font-medium"
                >
                  {logoutLoading && <Loading />}
                  {logoutLoading ? "Logging Out" : "Log Out"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Headers;