"use client";
import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Bell, User, Menu, X } from "lucide-react";
import { AppLogoIcon } from "../../../../utils/svgicons";

// Define navigation links with associated routes
const navigationLinks = [
  { href: "/admin/dashboard", label: "Dashboard", routes: ["/admin/dashboard"] },
  { href: "/admin/matches", label: "Matches", routes: ["/admin/matches"] },
  { href: "/admin/tournaments", label: "Tournaments", routes: ["/admin/tournaments"] },
  { href: "/admin/users", label: "Users", routes: ["/admin/users"] },
  { href: "/admin/notifications", label: "Notifications", routes: ["/admin/notifications"] },
  { href: "/admin/courts", label: "Courts", routes: ["/admin/courts"] },
  {
    href: "/admin/merchandises",
    label: "Merchandise",
    routes: ["/admin/merchandises", "/admin/merchandises/[id]", "/admin/merchandises/add"],
  },
  { href: "/admin/inventory", label: "Inventory", routes: ["/admin/inventory"] },
  { href: "/admin/employees", label: "Employees", routes: ["/admin/employees"] },
];

// Common function to determine if a tab is active
const isTabActive = (pathname, routes) => {
  return routes.some((route) => {
    // Replace dynamic segments like [id] with a regex or simple startsWith for subroutes
    if (route.includes("[id]")) {
      const baseRoute = route.replace("[id]", "");
      return pathname.startsWith(baseRoute);
    }
    return pathname === route || pathname.startsWith(route + "/");
  });
};

export default function Headers() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  return (
    <div className="sticky top-0 w-full py-4 px-4 md:px-6 z-50 bg-[#fbfaff] pb-1">
      <div className="max-w-[1920px] mx-auto">
        <div className="flex items-center justify-between w-full">
          <Link 
            href="/admin/dashboard" 
            className="flex items-center rounded-[44px] border-[#10375C] border px-3 py-2 md:px-4 md:py-2 lg:px-6 lg:py-3 hover:bg-gray-50 transition-colors"
          >
            <span className="text-orange-500 font-semibold">
              <AppLogoIcon />
            </span>
            <span className="ml-2 text-gray-900 text-base md:text-lg lg:text-2xl font-semibold">
              Tennis
            </span>
          </Link>

          <div className="flex items-center gap-1 sm:gap-2 lg-2">
            <nav className="hidden lg:flex items-center bg-[#FFF] p-1 rounded-[44px]">
              {navigationLinks.map((link) => (
                <Link 
                  key={link.label} 
                  href={link.href} 
                  className={`py-2 px-3 xl:py-3 xl:px-4 rounded-[28px] text-xs xl:text-sm font-medium whitespace-nowrap transition-colors ${
                    isTabActive(pathname, link.routes) 
                      ? "bg-gray-900 text-white" 
                      : "text-[#1b2229] hover:bg-gray-100"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            <div className="flex items-center">
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

              <div className="flex items-center gap-1 sm:gap-2 lg-2">
                <button className="p-2 md:p-3 rounded-full bg-[#FFF] text-gray-500 hover:text-gray-900 hover:bg-gray-100 transition-colors">
                  <Bell className="w-4 h-4 md:w-5 md:h-5" />
                </button>
                <button  className="p-2 md:p-3 rounded-full bg-[#FFF] text-gray-500 hover:text-gray-900 hover:bg-gray-100 transition-colors ">
                  <User className="w-4 h-4 md:w-5 md:h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden absolute left-4 right-4 mt-2 bg-white rounded-lg shadow-lg overflow-hidden">
            <nav className="py-2">
              {navigationLinks.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  className={`block px-4 py-2 text-sm transition-colors ${
                    isTabActive(pathname, link.routes)
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
      </div>
    </div>
  );
}