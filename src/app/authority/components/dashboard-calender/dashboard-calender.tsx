import React, { useState, useEffect } from "react";
import { TiltedArrowIcon } from "@/utils/svgicons";
import { useRouter } from "next/navigation";

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

// Function to check if the current time falls within a given time slot
const isCurrentTimeInSlot = (slotTime: string, currentTime: Date) => {
  const [slotHour, slotMinute] = slotTime.split(":").map(Number);
  const slotStart = new Date(currentTime);
  slotStart.setHours(slotHour, slotMinute, 0, 0);
  const slotEnd = new Date(slotStart);
  slotEnd.setHours(slotHour + 1, slotMinute, 0, 0); // 60-minute slot
  return currentTime >= slotStart && currentTime < slotEnd;
};

const ScheduleCalender = ({ data = [] }: any) => {
  const [weekDays, setWeekDays] = useState(getCurrentWeekDays());
  const router = useRouter();

  const currentTime = new Date();
  useEffect(() => {
    setWeekDays(getCurrentWeekDays());
  }, []);

  // Group data by time and count matches, with default empty array
  const groupedData = (data && data.length > 0) ? data.reduce((acc: any, item: any) => {
    const key = item.time;
    if (!acc[key]) {
      acc[key] = { ...item, matches: 1, items: [item] };
    } else {
      acc[key].matches += 1;
      acc[key].items.push(item);
    }
    return acc;
  }, {}) : {};

  // Map the grouped data to add the highlighted property dynamically
  const updatedData = Object.values(groupedData)?.map((item: any) => {
    const highlighted = isCurrentTimeInSlot(item.time, currentTime);
    return {
      ...item,
      highlighted,
    };
  }) || [];

  return (
    <div className="bg-[#f2f2f4] p-3 sm:p-5 rounded-[20px] w-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-3 space-y-3 sm:space-y-0">
        <h2 className="text-[#10375c] text-lg sm:text-xl font-medium">
          Today&apos;s Schedule
        </h2>
        <div onClick={() => router.push('/authority/matches')} className="rounded-[50px] bg-white p-1 cursor-pointer">
          <TiltedArrowIcon />
        </div>
      </div>

      {/* Dynamic Weekday Selector */}
      <div className="w-full">
        <div className="flex justify-between text-gray-400 text-xs sm:text-sm mb-4">
          {weekDays.map((day, index) => (
            <div key={index} className="flex flex-col items-center">
              <span
                className={`text-xs sm:text-sm font-medium ${
                  day.isToday ? "text-[#10375c] font-bold" : "text-[#acacac]"
                }`}
              >
                {day.day}
              </span>
              <span
                className={`text-base sm:text-lg px-1 sm:px-2 py-1 rounded-full ${
                  day.isToday ? "text-[#10375c] font-bold" : ""
                }`}
              >
                {day.date}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Schedule List */}
      <div className="space-y-4">
        {updatedData?.map((item: any, index: number) => (
          <div
            key={index}
            className="flex flex-col sm:flex-row items-start space-y-3 sm:space-y-0 sm:space-x-3"
          >
            {/* Time Slot */}
            <div className="flex flex-col items-center">
              <span
                className={`px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm ${
                  item.highlighted
                    ? "bg-[#1c2329] text-white"
                    : "bg-white rounded-[19px] border border-[#1b2229]"
                }`}
              >
                {item.time}
              </span>
              <span className="text-xs bg-blue-500 text-white px-2 py-1 rounded-full mt-1">
                {item.matches}
              </span>
            </div>

            {/* Match Details */}
            <div
            className="w-full"
              // className={`p-3 rounded-lg w-full gap-[10px] text-sm ${
              //   item.highlighted ? "bg-[#1c2329] text-white" : "bg-white"
              // }`}
            >
              {item.items.map((match: any, matchIndex: number) => (
                <div key={matchIndex} className={`mb-2 last:mb-0 p-3 rounded-lg w-full gap-[10px] text-sm ${
                item.highlighted ? "bg-[#1c2329] text-white" : "bg-white"
              }`}>
                  <h3 className="text-sm font-semibold mb-[10px]">
                    {match?.isMaintenance === true ? "Maintenance" : match.player}
                  </h3>
                  <div className="flex justify-between">
                    <p className="text-xs text-gray-400">{match.game} Match</p>
                    <p className="text-xs text-gray-400">{match.duration}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ScheduleCalender;

