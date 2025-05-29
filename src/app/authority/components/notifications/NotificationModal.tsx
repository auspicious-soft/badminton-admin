// "use client";
// import React from "react";
// import Modal from "@mui/material/Modal";
// import { X, User, Bell } from "lucide-react";

// interface NotificationItem {
//   id: string;
//   user: {
//     name: string;
//     avatar?: string;
//   };
//   action: string;
//   timestamp: string;
//   type: "game" | "purchase" | "general";
// }

// interface NotificationModalProps {
//   open: boolean;
//   onClose: () => void;
// }

// const NotificationModal: React.FC<NotificationModalProps> = ({
//   open,
//   onClose,
// }) => {
//   // Mock notification data - in a real app, this would come from an API
//   const notifications: NotificationItem[] = [
//     {
//       id: "1",
//       user: { name: "Joseph Quinn" },
//       action: "created a new game",
//       timestamp: "2 minutes ago",
//       type: "game",
//     },
//     {
//       id: "2",
//       user: { name: "Joseph Quinn" },
//       action: "purchased FULL SLEEVE HOODIE",
//       timestamp: "5 minutes ago",
//       type: "purchase",
//     },
//     {
//       id: "3",
//       user: { name: "Joseph Quinn" },
//       action: "created a new game",
//       timestamp: "10 minutes ago",
//       type: "game",
//     },
//     {
//       id: "4",
//       user: { name: "Joseph Quinn" },
//       action: "purchased FULL SLEEVE HOODIE",
//       timestamp: "15 minutes ago",
//       type: "purchase",
//     },
//     {
//       id: "5",
//       user: { name: "Joseph Quinn" },
//       action: "created a new game",
//       timestamp: "20 minutes ago",
//       type: "game",
//     },
//     {
//       id: "6",
//       user: { name: "Joseph Quinn" },
//       action: "purchased FULL SLEEVE HOODIE",
//       timestamp: "25 minutes ago",
//       type: "purchase",
//     },
//     {
//       id: "7",
//       user: { name: "Joseph Quinn" },
//       action: "created a new game",
//       timestamp: "30 minutes ago",
//       type: "game",
//     },
//     {
//       id: "8",
//       user: { name: "Joseph Quinn" },
//       action: "purchased FULL SLEEVE HOODIE",
//       timestamp: "35 minutes ago",
//       type: "purchase",
//     },
//     {
//       id: "9",
//       user: { name: "Joseph Quinn" },
//       action: "created a new game",
//       timestamp: "40 minutes ago",
//       type: "game",
//     },
//   ];

//   return (
//     <Modal
//       open={open}
//       onClose={onClose}
//       aria-labelledby="notifications-modal"
//       className="flex items-start justify-center pt-16"
//     >
//       <div className="bg-white rounded-[20px] w-[95%] max-w-[400px] shadow-lg max-h-[80vh] overflow-hidden">
//         {/* Header */}
//         <div className="flex items-center justify-between p-6 border-b border-gray-100">
//           <h2 className="text-[#10375c] text-xl font-semibold">Notifications</h2>
//           <button
//             onClick={onClose}
//             className="p-1 rounded-full hover:bg-gray-100 transition-colors"
//           >
//             <X className="w-5 h-5 text-gray-500" />
//           </button>
//         </div>

//         {/* Notifications List */}
//         <div className="max-h-[60vh] overflow-y-auto">
//           {notifications.length > 0 ? (
//             <div className="divide-y divide-gray-100">
//               {notifications.map((notification) => (
//                 <div
//                   key={notification.id}
//                   className="p-4 hover:bg-gray-50 transition-colors cursor-pointer"
//                 >
//                   <div className="flex items-start gap-3">
//                     {/* User Avatar */}
//                     <div className="flex-shrink-0">
//                       {notification.user.avatar ? (
//                         <img
//                           src={notification.user.avatar}
//                           alt={notification.user.name}
//                           className="w-10 h-10 rounded-full object-cover"
//                         />
//                       ) : (
//                         <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
//                           <User className="w-5 h-5 text-gray-500" />
//                         </div>
//                       )}
//                     </div>

//                     {/* Notification Content */}
//                     <div className="flex-1 min-w-0">
//                       <div className="text-sm text-gray-900">
//                         <span className="font-medium">{notification.user.name}</span>
//                         <span className="text-gray-600 ml-1">{notification.action}</span>
//                       </div>
//                       <div className="text-xs text-gray-500 mt-1">
//                         {notification.timestamp}
//                       </div>
//                     </div>

//                     {/* Notification Type Indicator */}
//                     <div className="flex-shrink-0">
//                       <div
//                         className={`w-2 h-2 rounded-full ${
//                           notification.type === "game"
//                             ? "bg-blue-500"
//                             : notification.type === "purchase"
//                             ? "bg-green-500"
//                             : "bg-gray-500"
//                         }`}
//                       />
//                     </div>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           ) : (
//             <div className="p-8 text-center">
//               <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
//                 <Bell className="w-8 h-8 text-gray-400" />
//               </div>
//               <p className="text-gray-500 text-sm">No notifications yet</p>
//             </div>
//           )}
//         </div>

//         {/* Footer */}
//         {notifications.length > 0 && (
//           <div className="p-4 border-t border-gray-100">
//             <button className="w-full text-center text-[#10375c] text-sm font-medium hover:underline">
//               View All Notifications
//             </button>
//           </div>
//         )}
//       </div>
//     </Modal>
//   );
// };

// export default NotificationModal;



"use client";
import React from "react";
import { User, Bell } from "lucide-react";
import Image from "next/image";

interface NotificationItem {
  id: string;
  user: {
    name: string;
    avatar?: string;
  };
  action: string;
  timestamp: string;
  type: "game" | "purchase" | "general";
}

interface NotificationDropdownProps {
  open: boolean;
  onClose: () => void;
}

const NotificationDropdown: React.FC<NotificationDropdownProps> = ({
  open,
  onClose,
}) => {
  // Mock notification data with updated timestamps relative to May 27, 2025, 01:15 PM IST
  const notifications: NotificationItem[] = [
    {
      id: "1",
      user: { name: "Joseph Quinn" },
      action: "created a new game",
      timestamp: "13 minutes ago", // 01:02 PM
      type: "game",
    },
    {
      id: "2",
      user: { name: "Joseph Quinn" },
      action: "purchased FULL SLEEVE HOODIE",
      timestamp: "15 minutes ago", // 01:00 PM
      type: "purchase",
    },
    {
      id: "3",
      user: { name: "Joseph Quinn" },
      action: "created a new game",
      timestamp: "20 minutes ago", // 12:55 PM
      type: "game",
    },
    {
      id: "4",
      user: { name: "Joseph Quinn" },
      action: "purchased FULL SLEEVE HOODIE",
      timestamp: "25 minutes ago", // 12:50 PM
      type: "purchase",
    },
    {
      id: "5",
      user: { name: "Joseph Quinn" },
      action: "created a new game",
      timestamp: "30 minutes ago", // 12:45 PM
      type: "game",
    },
    {
      id: "6",
      user: { name: "Joseph Quinn" },
      action: "purchased FULL SLEEVE HOODIE",
      timestamp: "35 minutes ago", // 12:40 PM
      type: "purchase",
    },
    {
      id: "7",
      user: { name: "Joseph Quinn" },
      action: "created a new game",
      timestamp: "40 minutes ago", // 12:35 PM
      type: "game",
    },
    {
      id: "8",
      user: { name: "Joseph Quinn" },
      action: "purchased FULL SLEEVE HOODIE",
      timestamp: "45 minutes ago", // 12:30 PM
      type: "purchase",
    },
    {
      id: "9",
      user: { name: "Joseph Quinn" },
      action: "created a new game",
      timestamp: "50 minutes ago", // 12:25 PM
      type: "game",
    },
  ];

  if (!open) return null;

  return (
    <div className="absolute z-20 top-[50px] right-0 w-80 bg-white rounded-lg shadow-xl max-h-[60vh] overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-100">
        <h2 className="text-[#10375c] text-lg font-semibold">Notifications</h2>
        <button
          onClick={onClose}
          className="p-1 rounded-full hover:bg-gray-100 transition-colors"
        >
          x
          {/* <X className="w-5 h-5 text-gray-500" /> */}
        </button>
      </div>

      {/* Notifications List */}
      <div className="max-h-[40vh] overflow-y-auto overflo-custom">
        {notifications.length > 0 ? (
          <div className="divide-y divide-gray-100">
            {notifications.map((notification) => (
              <div
                key={notification.id}
                className="p-4 hover:bg-gray-50 transition-colors cursor-pointer"
              >
                <div className="flex items-start gap-3">
                  {/* User Avatar */}
                  <div className="flex-shrink-0">
                    {notification.user.avatar ? (
                      <Image
                        src={notification.user.avatar}
                        alt={notification.user.name}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                        <User className="w-5 h-5 text-gray-500" />
                      </div>
                    )}
                  </div>

                  {/* Notification Content */}
                  <div className="flex-1 min-w-0">
                    <div className="text-sm text-gray-900">
                      <span className=" text-[#1C2329] text-sm font-bold">{notification.user.name}</span>
                      <span className="text-gray-600 ml-1">{notification.action}</span>
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      {notification.timestamp}
                    </div>
                  </div>

                  {/* Notification Type Indicator */}
                  {/* <div className="flex-shrink-0">
                    <div
                      className={`w-2 h-2 rounded-full ${
                        notification.type === "game"
                          ? "bg-blue-500"
                          : notification.type === "purchase"
                          ? "bg-green-500"
                          : "bg-gray-500"
                      }`}
                    />
                  </div> */}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-8 text-center">
            <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
              <Bell className="w-8 h-8 text-gray-400" />
            </div>
            <p className="text-gray-500 text-sm">No notifications yet</p>
          </div>
        )}
      </div>

      {/* Footer */}
      {/* {notifications.length > 0 && (
        <div className="p-4 border-t border-gray-100">
          <button className="w-full text-center text-[#10375c] text-sm font-medium hover:underline">
            View All Notifications
          </button>
        </div>
      )} */}
    </div>
  );
};

export default NotificationDropdown;
