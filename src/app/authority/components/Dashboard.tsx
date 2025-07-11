"use client";
import { DashbordStat1Icon, DashbordPickleBallIcon, DashbordPadelBallIcon, DashbordRupeeIcon, ViewEyeIcon, TiltedArrowIcon } from "@/utils/svgicons";
import Image from "next/image";
import React, { useState } from "react";
import Match from "@/assets/images/ongoingmatches.png";
import Profile from "@/assets/images/profile.webp";
import SalesChart from "./statistic-chart/StatsChart";
import LoyaltyCard from "./loyaltyMatches";
import ScheduleCalender from "./dashboard-calender/dashboard-calender";
import useSWR from "swr";
import { getDashboard } from "@/services/admin-services";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

// Extend the User type to include 'role' and 'venueId'
declare module "next-auth" {
  interface User {
    role?: string;
    venueId?: string;
  }
}

const StatCard = ({ value, label, Icon }) => (
  <div className="flex items-center gap-3 rounded-lg">
    <div>
      <div className="flex gap-[20px]">
        <div className="flex justify-end bg-[#FD5602] rounded-[5px] w-[20px] h-[20px] p-1 mt-4">{Icon}</div>
        <div className="left-[44px] top-0 text-[#10375c] text-[40px] font-semibold font-['Raleway']">{value}</div>
      </div>
      <div className="left-0 top-[48px] text-[#1b2229] text-xs font-medium">{label}</div>
    </div>
  </div>
);

const BookingRow = ({ fullName, game, city, date, image, index, isMaintenance }) => {
  const bgColor = index % 2 === 0 ? "bg-[#f2f2f4]" : "bg-white";

  return (
    <div className={`rounded-[10px] justify-start items-center inline-flex ${bgColor} w-full ring-offset-purple-950 py-3`}>
      <div className="w-[30%] grow shrink basis-0 self-stretch justify-start items-center gap-1 flex">
        <Image className="rounded-full" src={Profile} alt="user" width={23} height={23} />
        <div className="text-[#1b2229] text-xs font-medium">{isMaintenance === true ? "Maintenance" : fullName}</div>
      </div>
      <div className="w-[20%] h-3.5 text-[#1b2229] text-xs font-medium">{game}</div>
      <div className="w-[20%] text-[#1b2229] text-xs font-medium">{city}</div>
      <div className="w-[20%] h-3.5 pr-2 text-right text-[#1b2229] text-xs font-medium">
        {new Date(date).toLocaleDateString('en-GB').replace(/\//g, '-')}
      </div>
    </div>
  );
};

const Dashboard = () => {
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const handleYearChange = (year) => setSelectedYear(year);
  const [openPanelIndex, setOpenPanelIndex] = useState(0);
  const router = useRouter();
  const handleViewClick = (index) => {
    setOpenPanelIndex(openPanelIndex === index ? -1 : index);
  };
  const { data: session, status } = useSession();
  const userRole = (session?.user?.role || "").toLowerCase();
  const venueId = session?.user?.venueId;

  const endpoint = userRole === "employee" ? `/admin/dashboard-emp?venueId=${venueId}` : `/admin/dashboard`;
  const { data, isLoading } = useSWR(endpoint, getDashboard);
  const data1 = data?.data?.data;

  if (status === "loading") return <div>Loading session...</div>;

  const OngoingMatchesPanel = ({ open, data }) => {
    if (!open) return null;
    return (
      <div className="relative w-full h-[300px] rounded-xl overflow-hidden shadow-lg">
        <Image src={Match} alt="Ongoing Matches" layout="fill" objectFit="cover" className="absolute inset-0 z-10" />
        <div className="absolute inset-0 bg-black bg-opacity-50"></div>
        <div className="relative z-10 p-6 text-white flex flex-col h-full justify-between">
          <h2 className="text-lg font-semibold">Ongoing Matches</h2>
          <div className="flex gap-6 absolute top-[60px]">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <span className="text-3xl font-bold">{data1?.stats?.ongoingMatches?.Padel}</span>
                <div className="w-2.5 h-2.5 bg-[#fd5602] rounded-[7px]" />
                <span className="text-sm">Padel</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-3xl font-bold">{data1?.stats?.ongoingMatches?.Pickleball}</span>
                <div className="w-2.5 h-2.5 bg-[#fd5602] rounded-[7px]" />
                <span className="text-sm">Pickleball</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="bg-[#fbfaff]">
      {userRole === "employee" && venueId === "null" ? (
        <div className="bg-[#fbfaff] p-1 flex flex-col items-center justify-center min-h-[60vh] ">
          <h2 className="text-[#10375C] text-3xl font-semibold mb-4">You’re not yet assigned to any venue.</h2>
          <p className="text-[#1B2229] text-center text-sm max-w-[60%]">
            You&apos;re currently not assigned to any venue. Please reach out to your admin or manager to get assigned to a venue so you can start accessing relevant schedules, tools, and updates tailored to your role.
          </p>
        </div>
      ) : (
        <>
          <div className="flex flex-wrap justify-between mb-4 pt-6 p-2">
            <h1 className="text-[#10375c] text-2xl md:text-3xl font-semibold">Welcome to Barnton Park LTC</h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              <StatCard value={data1?.stats?.totalMatchesThisMonth || "0"} label="Total matches this month" Icon={<DashbordStat1Icon />} />
              <StatCard value={data1?.stats?.pickleballMatchesThisMonth || "0"} label="Pickleball matches this month" Icon={<DashbordPickleBallIcon />} />
              <StatCard value={data1?.stats?.padelMatchesThisMonth || "0"} label="Padel matches this month" Icon={<DashbordPadelBallIcon />} />
              <StatCard value={isLoading ? "" : `₹${data1?.stats?.incomeThisMonth || "0"}`} label="Income this month" Icon={<DashbordRupeeIcon />} />
            </div>
          </div>
          <div className="flex flex-col md:flex-row gap-8 w-full">
            <div className="w-full md:w-1/4">
              <ScheduleCalender data={data1?.todaySchedule} />
            </div>
            <div className="w-full md:w-3/4">
              <div className="rounded-[20px] w-full">
                <div className="bg-[#f2f2f4] p-2 rounded-[20px] flex flex-col md:flex-row w-full gap-4">
                  <div className="w-full p-4 md:w-[55%] md:p-2">
                    <div className="flex items-center justify-between mb-6">
                      <div className="text-[#10375c] text-xl font-medium font-['Raleway']">Recent Bookings</div>
                      <div onClick={() => router.push('/authority/matches')} className="cursor-pointer rounded-[50px] bg-white">
                        <TiltedArrowIcon />
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center gap-6 text-[#7e7e8a] text-xs font-medium mb-2">
                        <div className="w-[30%]">Name of Person</div>
                        <div className="w-[20%] text-center">Game</div>
                        <div className="w-[20%] text-center">City</div>
                        <div className="w-[20%] text-right mr-2">Date</div>
                      </div>
                      <div className="w-full h-[0px] border border-dotted border-[#d0d0d0]"></div>
                      <div>
                        {data1?.recentBookings?.map((booking, index) => (
                          <BookingRow key={index} {...booking} index={index} />
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="flex-1">
                    {openPanelIndex !== -1 && data1?.recentBookings[openPanelIndex] && (
                      <OngoingMatchesPanel open={true} data={data1?.recentBookings[openPanelIndex]} />
                    )}
                  </div>
                </div>
              </div>
              <div className="flex flex-col md:flex-row gap-8 mt-6 mb-6 w-full">
                <div className="w-full md:w-2/3">
                  <SalesChart selectedYear={selectedYear} data={data1?.monthlyGameGraph} onYearChange={handleYearChange} />
                </div>
                <div className="w-full md:w-2/4">
                  <LoyaltyCard />
                  <div className="bg-[#f2f2f4] rounded-[20px] mt-[20px] pb-[20px] w-full">
                    <h2 className="text-[#10375c] text-xl font-medium pt-[16px] pl-[16px]">Game Booking Composition</h2>
                    <div className="flex justify-center gap-8 mt-[30px]">
                      <div className="text-center">
                        <div className="text-[#10375c] text-3xl font-medium">{data1?.stats?.gameComposition?.Padel || 0}%</div>
                        <div className="h-3.5 justify-start items-center gap-[5px] inline-flex">
                          <div className="w-2.5 h-2.5 bg-[#fd5602] rounded-[7px]" />
                          <div className="text-[#7e7e8a] text-xs font-medium font-['Raleway']">Padel</div>
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="text-[#10375c] text-3xl font-medium">{data1?.stats?.gameComposition?.Pickleball || 0}%</div>
                        <div className="h-3.5 justify-start items-center gap-[5px] inline-flex">
                          <div className="w-2.5 h-2.5 bg-[#1b2229] rounded-[7px]" />
                          <div className="text-[#7e7e8a] text-xs font-medium font-['Raleway']">Pickleball</div>
                        </div>
                      </div>
                    </div>
                    <div className="mt-[20px] mx-[20px] w-[85%] px-[26px] py-3.5 bg-white rounded-[39px] text-center text-[#7e7e8a] text-xs font-medium">
                      People love to play {data1?.stats?.gameComposition?.Pickleball > data1?.stats?.gameComposition?.Padel ? "Pickelball" : "Padel"} at your court!
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Dashboard;