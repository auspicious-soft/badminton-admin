"use client";
import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Bell, User, Menu, X } from "lucide-react";
import { AppLogoIcon } from "../../../../utils/svgicons";
import { signOut, useSession } from "next-auth/react";
import NotificationDropdown from "../notifications/NotificationModal";

const navigationLinks = [
  { href: "/authority/dashboard", label: "Dashboard", routes: ["/authority/dashboard"] },
  { href: "/authority/matches", label: "Matches", routes: ["/authority/matches"] },
  { href: "/authority/tournaments", label: "Tournaments", routes: ["/authority/tournaments"] },
  { href: "/authority/users", label: "Users", routes: ["/authority/users"] },
  { href: "/authority/notifications", label: "Notifications", routes: ["/authority/notifications"] },
  { href: "/authority/venue", label: "Venue", routes: ["/authority/venue"] },
  { href: "/authority/merchandises", label: "Merchandise", routes: ["/authority/merchandises", "/authority/merchandises/[id]", "/authority/merchandises/add"] },
  { href: "/authority/inventory", label: "Inventory", routes: ["/authority/inventory"] },
  { href: "/authority/employees", label: "Employees", routes: ["/authority/employees"] },
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

export default function Headers() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showNotificationDropdown, setShowNotificationDropdown] = useState(false); // Renamed state for clarity
  const { data } = useSession();
  const name = data?.user?.name || "User";
  const router = useRouter();
  const pathname = usePathname();
  const isProfileActive = pathname === "/authority/profile";
  const dropdownRef = useRef(null);
  const notificationRef = useRef(null); // Ref for notification dropdown

  // Close profile dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setShowNotificationDropdown(false);
      }
    };

    if (showDropdown || showNotificationDropdown) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showDropdown, showNotificationDropdown]);

  return (
    <div className="sticky top-0 w-full py-4 px-4 md:px-6 z-50 bg-[#fbfaff] pb-1">
      <div className="max-w-[1920px] mx-auto">
        <div className="flex items-center justify-between w-full">
          <Link href="/authority/dashboard" className="flex items-center   hover:bg-gray-50 transition-colors">
            <span className="text-orange-500 font-semibold">
              <AppLogoIcon />
            </span>
            {/* <span className="ml-2 text-gray-900 text-base md:text-lg lg:text-2xl font-semibold">Tennis</span> */}
          </Link>

          <div className="flex items-center gap-2">
            <nav className="hidden lg:flex items-center bg-[#FFF] p-1 rounded-[44px]">
              {navigationLinks.map((link) => (
                <Link key={link.label} href={link.href} className={`py-2 px-3 xl:py-3 xl:px-4 rounded-[28px] text-xs xl:text-sm font-medium whitespace-nowrap transition-colors ${isTabActive(pathname, link.routes) ? "bg-gray-900 text-white" : "text-[#1b2229] hover:bg-gray-100"}`}>
                  {link.label}
                </Link>
              ))}
            </nav>

            <div className="flex items-center relative" ref={dropdownRef}>
              <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="lg:hidden p-2 rounded-full hover:bg-gray-100 transition-colors">
                {isMobileMenuOpen ? <X className="w-5 h-5 md:w-6 md:h-6" /> : <Menu className="w-5 h-5 md:w-6 md:h-6" />}
              </button>
              <div className="relative" ref={notificationRef}>
                <button
                  className="p-2 md:p-3 rounded-full bg-[#FFF] text-gray-500 hover:text-gray-900 hover:bg-gray-100 transition-colors"
                  onClick={() => setShowNotificationDropdown(!showNotificationDropdown)}
                >
                  <Bell className="w-4 h-4 md:w-5 md:h-5" />
                </button>
                <NotificationDropdown
                  open={showNotificationDropdown}
                  onClose={() => setShowNotificationDropdown(false)}
                />
              </div>
              <button onClick={() => setShowDropdown(!showDropdown)} className={`p-2 md:p-3 rounded-full bg-[#FFF] transition-colors ${isProfileActive ? "bg-gray-900 text-white hover:bg-gray-800" : "text-gray-500 hover:text-gray-900 hover:bg-gray-100"}`}>
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
                  <button onClick={() => signOut({ callbackUrl: "/" })} className="text-darkBlack w-full hover:underline text-left">
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
              {navigationLinks.map((link) => (
                <Link key={link.label} href={link.href} className={`block px-4 py-2 text-sm transition-colors ${isTabActive(pathname, link.routes) ? "bg-gray-900 text-white" : "text-gray-500 hover:text-gray-900 hover:bg-gray-50"}`} onClick={() => setIsMobileMenuOpen(false)}>
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>
        )}
      </div>
    </div>
  );
}