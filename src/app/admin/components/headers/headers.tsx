// "use client";
// import React, { useState } from "react";
// import Link from "next/link";
// import { usePathname } from "next/navigation";
// import { Bell, User, Menu, X } from "lucide-react";
// import { AppLogoIcon } from "../../../../utils/svgicons";

// const navigationLinks = [
//   { href: "/admin/dashboard", label: "Dashboard" },
//   { href: "/admin/matches", label: "Matches" },
//   { href: "/admin/tournaments", label: "Tournaments" },
//   { href: "/admin/users", label: "Users" },
//   { href: "/admin/notifications", label: "Notifications" },
//   { href: "/admin/courts", label: "Courts" },
//   { href: "/admin/merchandises", label: "Merchandise" },
//   { href: "/admin/inventory", label: "Inventory" },
//   { href: "/admin/employees", label: "Employees" },
// ];

// export default function Headers() {
//   const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
//   const pathname = usePathname();

//   return (
//     <div className="sticky top-0 w-full py-4 px-4 md:px-6 z-50 bg-[#fbfaff]">
//       <div className="w-full h-14 flex items-center ">
//         <div className="flex items-center w-full justify-between">
//           <Link href="/" className="flex items-center rounded-[44px] border-[#10375C] border px-4 py-2 md:px-6 md:py-3 hover:bg-gray-50 transition-colors">
//             <span className="text-orange-500 font-semibold"><AppLogoIcon/></span>
//             <span className="ml-2 text-gray-900 text-lg md:text-2xl font-semibold">Tennis</span>
//           </Link>
//           <div className="flex gap-1 max-xl:gap-10">
//             <div className="flex">
//               <nav className="hidden lg:flex items-center bg-[#FFF] p-1 rounded-[44px]">
//                 {navigationLinks.map((link) => (
//                   <Link 
//                     key={link.label} 
//                     href={link.href} 
//                     className={` py-3 px-4 rounded-[28px] text-sm font-medium whitespace-nowrap transition-colors ${pathname === link.href ? "bg-gray-900 text-white" : "text-[#1b2229]  "}`}
//                   >
//                     {link.label}
//                   </Link>
//                 ))}
//               </nav>
//               <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="lg:hidden p-2 rounded-full hover:bg-gray-100">
//                 {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
//               </button>
//             </div>
//             <div className="flex items-center gap-[5px] max-lg:gap-[10px] ">
//               <button className="p-3 rounded-full bg-[#FFF] text-gray-500 hover:text-gray-900 hover:bg-gray-100 transition-colors">
//                 <Bell className="w-5 h-5" />
//               </button>
//               <button className="p-3 rounded-full bg-[#FFF] text-gray-500 hover:text-gray-900 hover:bg-gray-100 transition-colors">
//                 <User className="w-5 h-5" />
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>
//       {isMobileMenuOpen && (
//         <nav className="lg:hidden bg-[#FFF] mt-2 rounded-lg shadow-lg p-4 absolute left-4 right-4">
//           {navigationLinks.map((link) => (
//             <Link
//               key={link.label}
//               href={link.href}
//               className={`block px-4 py-2 text-sm rounded-md transition-colors ${pathname === link.href ? "bg-gray-900 text-white" : "text-gray-500 hover:text-gray-900 hover:bg-gray-50"}`}
//               onClick={() => setIsMobileMenuOpen(false)}
//             >
//               {link.label}
//             </Link>
//           ))}
//         </nav>
//       )}
//     </div>
//   );
// }


"use client";
import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Bell, User, Menu, X } from "lucide-react";
import { AppLogoIcon } from "../../../../utils/svgicons";

const navigationLinks = [
  { href: "/admin/dashboard", label: "Dashboard" },
  { href: "/admin/matches", label: "Matches" },
  { href: "/admin/tournaments", label: "Tournaments" },
  { href: "/admin/users", label: "Users" },
  { href: "/admin/notifications", label: "Notifications" },
  { href: "/admin/courts", label: "Courts" },
  { href: "/admin/merchandises", label: "Merchandise" },
  { href: "/admin/inventory", label: "Inventory" },
  { href: "/admin/employees", label: "Employees" },
];

export default function Headers() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  return (
    <div className="sticky top-0 w-full py-4 px-4 md:px-6 z-50 bg-[#fbfaff] pb-1">
      <div className="max-w-[1920px] mx-auto">
        <div className="flex items-center justify-between w-full">
          <Link 
            href="/" 
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
                  className={`py-2 px-3 xl:py-3 xl:px-4 rounded-[28px] text-sm font-medium whitespace-nowrap transition-colors ${
                    pathname === link.href 
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
                <button className="p-2 md:p-3 rounded-full bg-[#FFF] text-gray-500 hover:text-gray-900 hover:bg-gray-100 transition-colors">
                  <User className="w-4 h-4 md:w-5 md:h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {isMobileMenuOpen && (
          <div className=" lg:hidden absolute left-4 right-4 mt-2 bg-white rounded-lg shadow-lg overflow-hidden">
            <nav className="py-2">
              {navigationLinks.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  className={`block px-4 py-2 text-sm transition-colors ${
                    pathname === link.href
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