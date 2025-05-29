import React, { useEffect, useState, useMemo } from "react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { DashbordStat1Icon, DashbordPickleBallIcon, DashbordPadelBallIcon, DashbordRupeeIcon, ViewEyeIcon, TiltedArrowIcon } from "@/utils/svgicons";

interface Props {
  selectedYear: number;
  data: any;
  onYearChange: (year: number) => void;
}

const yAxisTickFormatter = (value: number) => {
  if (value === 10000) return "";
  if (value < 1000) return value.toString();
  return `${value / 1000}k`;
};

const SalesChart = ({ selectedYear, data, onYearChange }: Props) => {
  console.log("graphD",data)

 const currentYear = new Date().getFullYear(); // 2025
const minYear = 2025; // Minimum year
const startYear = Math.max(currentYear, minYear); // Start from currentYear or minYear, whichever is greater
const years = Array.from({ length: startYear - minYear + 1 }, (_, i) => startYear - i);

  const monthlyCounts = useMemo(() => data?.monthlyCounts || [], [data]);
  const [chartData, setChartData] = useState<{ name: string; padel: number; pickleball: number }[]>([]);

  useEffect(() => {
    // const dummyData = [
    //   { month: "01/2025", padel: 120, pickleball: 90 },
    //   { month: "02/2025", padel: 150, pickleball: 110 },
    //   { month: "03/2025", padel: 170, pickleball: 130 },
    //   { month: "04/2025", padel: 140, pickleball: 160 },
    //   { month: "05/2025", padel: 180, pickleball: 200 },
    //   { month: "06/2025", padel: 160, pickleball: 140 },
    //   { month: "07/2025", padel: 190, pickleball: 180 },
    //   { month: "08/2025", padel: 170, pickleball: 150 },
    //   { month: "09/2025", padel: 180, pickleball: 190 },
    //   { month: "10/2025", padel: 150, pickleball: 130 },
    //   { month: "11/2025", padel: 160, pickleball: 140 },
    //   { month: "12/2025", padel: 170, pickleball: 150 },
    // ];

    const formattedData = (monthlyCounts.length ? monthlyCounts : data)?.map((item: any) => ({
      name: item.month.split("/")[0],
      padel: item.padel,
      pickleball: item.pickleball,
    }));

    setChartData(formattedData);
  }, [monthlyCounts]);

  return (
    <div className="rounded-[10px] bg-[#1c2329] text-[#FFFFFF] h-full ">
      <div className="flex justify-between items-center p-5 mb-4">
        <h2 className="text-white font-bold ">Statistics</h2>
        <select
          value={selectedYear}
          onChange={(e) => onYearChange(Number(e.target.value))}
          className="py-2 px-4 rounded-full bg-white text-black"
        >
          {years.map((year) => (
            <option key={year} value={year}>{year}</option>
          ))}
        </select>
      </div>
      <div className=" text-[#8B8E98] pr-8 pt-5">
        <ResponsiveContainer width="100%" height={350}>
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id="colorPadel" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#3498db" stopOpacity={0.8} />
                <stop offset="100%" stopColor="#2980b9" stopOpacity={0.2} />
              </linearGradient>
              <linearGradient id="colorPickleball" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#e67e22" stopOpacity={0.8} />
                <stop offset="100%" stopColor="#d35400" stopOpacity={0.2} />
              </linearGradient>
            </defs>
            <XAxis dataKey="name" tickLine={false} tick={{ fill: "#FFFFFF", fontSize: 14 }} />
            <YAxis tickFormatter={yAxisTickFormatter} tick={{ fill: "#FFFFFF", fontSize: 14 }} tickLine={false} />
            <CartesianGrid strokeDasharray="3 3" stroke="#333" />
            <Tooltip contentStyle={{ backgroundColor: "#1E1E2D", color: "#FFFFFF" }} />
            <Legend wrapperStyle={{ color: "#FFFFFF" }} />
            <Area type="monotone" dataKey="padel" strokeWidth={3} stroke="#3498db" fill="url(#colorPadel)" />
            <Area type="monotone" dataKey="pickleball" strokeWidth={3} stroke="#e67e22" fill="url(#colorPickleball)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default SalesChart;
