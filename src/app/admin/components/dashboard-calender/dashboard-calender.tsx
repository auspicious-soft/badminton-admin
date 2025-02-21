// import React from "react";
// import { FaArrowRight } from "react-icons/fa";

// const scheduleData = [
//   { time: "09:00", matches: 2, player: "Neil Melendez", duration: "120 Mins", highlighted: true },
//   { time: "10:00", matches: 2, player: "Neil Melendez", duration: "120 Mins" },
//   { time: "11:00", matches: 1, player: "Neil Melendez", duration: "120 Mins" },
//   { time: "12:00", matches: 1, player: "Neil Melendez", duration: "120 Mins" },
//   { time: "01:00", matches: 1, player: "Neil Melendez", duration: "120 Mins" },
// ];

// const ScheduleCalender = () => {
//   return (
//     <div className="bg-white p-5 rounded-xl shadow-lg w-80">
//       {/* Header */}
//       <div className="flex justify-between items-center mb-3">
//         <h2 className="text-lg font-bold">Today Schedule</h2>
//         <FaArrowRight className="text-gray-400" />
//       </div>

//       {/* Weekday Selector */}
//       <div className="flex justify-between text-gray-400 text-sm mb-4">
//         {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day, index) => (
//           <div key={index} className={`flex flex-col items-center ${index === 3 ? "text-blue-600 font-bold" : ""}`}>
//             <span>{day}</span>
//             <span className={`text-lg ${index === 3 ? "text-black border-b-2 border-blue-600" : ""}`}>{22 + index}</span>
//           </div>
//         ))}
//       </div>

//       {/* Schedule List */}
//       <div className="space-y-4">
//         {scheduleData.map((item, index) => (
//           <div key={index} className="flex items-start space-x-3">
//             {/* Time Slot */}
//             <div className="flex flex-col items-center">
//               <span className={`px-3 py-1 rounded-full ${item.highlighted ? "bg-black text-white" : "bg-gray-200 text-black"}`}>
//                 {item.time}
//               </span>
//               <span className="text-xs bg-blue-500 text-white px-2 py-1 rounded-full mt-1">{item.matches}</span>
//             </div>

//             {/* Match Details */}
//             <div className={`p-3 rounded-lg w-full ${item.highlighted ? "bg-black text-white" : "bg-gray-100"}`}>
//               <h3 className="text-sm font-semibold">{item.player}</h3>
//               <p className="text-xs text-gray-400">{item.duration}</p>
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default ScheduleCalender;


import React, { useState, useEffect } from "react";
import {  TiltedArrowIcon } from "@/utils/svgicons";

const scheduleData = [
  { time: "09:00", matches: 2, player: "Neil Melendez", duration: "120 Mins", highlighted: true },
  { time: "10:00", matches: 2, player: "Neil Melendez", duration: "120 Mins" },
  { time: "11:00", matches: 1, player: "Neil Melendez", duration: "120 Mins" },
  { time: "12:00", matches: 1, player: "Neil Melendez", duration: "120 Mins" },
  { time: "01:00", matches: 1, player: "Neil Melendez", duration: "120 Mins" },
  { time: "10:00", matches: 2, player: "Neil Melendez", duration: "120 Mins" },
  { time: "11:00", matches: 1, player: "Neil Melendez", duration: "120 Mins" },
  { time: "12:00", matches: 1, player: "Neil Melendez", duration: "120 Mins" },
];

// Function to get current week days dynamically
const getCurrentWeekDays = () => {
  const today = new Date();
  const startOfWeek = new Date(today);
  startOfWeek.setDate(today.getDate() - today.getDay()); // Start from Sunday

  return Array.from({ length: 7 }, (_, index) => {
    const date = new Date(startOfWeek);
    date.setDate(startOfWeek.getDate() + index);
    return {
      day: date.toLocaleString("en-US", { weekday: "short" }),
      date: date.getDate(),
      isToday: date.toDateString() === today.toDateString(),
    };
  });
};

const ScheduleCalender = () => {
  const [weekDays, setWeekDays] = useState(getCurrentWeekDays());

  useEffect(() => {
    setWeekDays(getCurrentWeekDays());
  }, []);

  return (
    <div className="bg-[#f2f2f4] p-5 rounded-[20px] " >
      {/* Header */}
      <div className="flex justify-between items-center mb-3">
        <h2 className="text-[#10375c] text-xl font-medium ">Today&apos;s Schedule</h2>
        <div className="rounded-[50px] bg-white">
              <TiltedArrowIcon />
            </div>
      </div>

      {/* Dynamic Weekday Selector */}
      <div className="flex justify-between text-gray-400 text-sm mb-4">
        {weekDays.map((day, index) => (
          <div key={index} className="flex flex-col items-center">
            <span className={`text-sm font-medium  ${day.isToday ? "text-[#10375c] font-bold" : "text-[#acacac]" }` }>{day.day}</span>
            <span
              className={`text-lg px-2 py-1 rounded-full ${
                day.isToday ? " text-[#10375c] font-bold" : ""
              }`}
            >
              {day.date}
            </span>
          </div>
        ))}
      </div>

      {/* Schedule List */}
      <div className="space-y-4">
        {scheduleData.map((item, index) => (
          <div key={index} className="flex items-start space-x-3">
            {/* Time Slot */}
            <div className="flex flex-col items-center">
              <span className={`px-3 py-1 rounded-full ${item.highlighted ? "bg-[#1c2329] text-white" : "rounded-[19px] border border-[#1b2229]"}`}>
                {item.time}
              </span>
              <span className="text-xs bg-blue-500 text-white px-2 py-1 rounded-full mt-1">{item.matches}</span>
            </div>

            {/* Match Details */}
            <div className={`p-3 rounded-lg w-full ${item.highlighted ? "bg-[#1c2329] text-white" : "bg-white"}`}>
              <h3 className="text-sm font-semibold">{item.player}</h3>
              <p className="text-xs text-gray-400">{item.duration}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ScheduleCalender;
