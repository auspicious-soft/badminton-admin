"use client";
import { useState } from "react";
import Image from "next/image";
import React from "react";
import MatchImage from "@/assets/images/padelImage.png";
import rebeccaAndSteven from "@/assets/images/rebeccaAndSteven.png";
import rebecca from "@/assets/images/rebecca.png";
import UserProfile from "@/assets/images/userprofile.png";
import { Calender, Clock, Downarrow, EyeIcon, Icon, PlusIcon } from "@/utils/svgicons";
import SearchBar from "../../components/SearchBar";
import { useRouter } from "next/navigation";

const matches = [
  { id: 1, team1: "Alex Parker", game: "Padel", city: "Chandigarh", date: "22-01-2024" },
  { id: 2, team1: "Jordan Lee", game: "Pickleball", city: "Chandigarh", date: "22-01-2024" },
  { id: 3, team1: "Tracy Martin", game: "Padel", city: "Chandigarh", date: "22-01-2024" },
  { id: 4, team1: "Marley Martinez", game: "Pickleball", city: "Chandigarh", date: "22-01-2024" },
  { id: 5, team1: "Alex Parker", game: "Padel", city: "Chandigarh", date: "22-01-2024" },
  { id: 6, team1: "Jordan Lee", game: "Padel", city: "Chandigarh", date: "22-01-2024" },
  { id: 7, team1: "Tracy Martin", game: "Padel", city: "Chandigarh", date: "22-01-2024" },
  { id: 8, team1: "Marley Martinez", game: "Pickleball", city: "Chandigarh", date: "22-01-2024" },
  { id: 9, team1: "Alex Parker", game: "Padel", city: "Chandigarh", date: "22-01-2024" },
  { id: 10, team1: "Jordan Lee", game: "Pickleball", city: "Chandigarh", date: "22-01-2024" },
  { id: 11, team1: "Tracy Martin", game: "Padel", city: "Chandigarh", date: "22-01-2024" },
  { id: 12, team1: "Marley Martinez", game: "Pickleball", city: "Chandigarh", date: "22-01-2024" },
];

const Page = () => {
  const [selectedMatch, setSelectedMatch] = useState(matches[0]);
  const [searchParams, setSearchParams] = useState("");
  const router = useRouter();

  return (
    <div className="w-full bg-[#fbfaff] rounded-[10px] mt-10 p-4  ">
      <div className="text-[#10375c] text-2xl sm:text-3xl font-semibold mb-4">Tournaments</div>

      <div className="flex flex-wrap gap-3 mb-6">
        <button className="h-10 px-5 py-3 bg-[#1b2229] rounded-[28px] text-white text-sm font-medium">
          Upcoming
        </button>
        <button className="h-10 px-5 py-3 bg-white rounded-[28px] text-[#1b2229] text-sm font-medium">
          Previous
        </button>
        <div className="h-10 px-5 py-3 bg-[#1b2229] rounded-[28px] flex items-center gap-2">
          <span className="text-white text-sm font-medium">Game</span>
          <Downarrow />
        </div>
        <div className="h-10 px-5 py-3 bg-[#1b2229] rounded-[28px] flex items-center gap-2">
          <span className="text-white text-sm font-medium">Select a date</span>
          <Downarrow />
        </div>
        <div className="h-10 px-5 py-3 bg-[#1b2229] rounded-[28px] flex items-center gap-2 ml-auto">
          <PlusIcon />
          <span className="text-white text-sm font-medium">Add A New Tournament</span>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        <div className="bg-[#f2f2f4] rounded-[20px] w-full lg:w-[70%] p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
            <div className="text-[#10375c] text-xl font-medium mb-2 sm:mb-0">Upcoming Tournaments</div>
            <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
              <SearchBar setQuery={setSearchParams} query={searchParams} />
              <div className="h-10 px-5 py-3 bg-[#1b2229] rounded-[28px] flex items-center gap-2">
                <span className="text-white text-sm font-medium">Download</span>
                <Downarrow />
              </div>
            </div>
          </div>


{/* left  */}
<div className="w-full overflow-x-auto">
  <div className="flex text-sm font-semibold text-[#7e7e8a] mb-2 min-w-[600px]">
    <div className="w-1/4">Name of Tournament</div>
    <div className="w-1/4">Game</div>
    <div className="w-1/4 text-center">City</div>
    <div className="w-1/6">Date</div>
    <div className="w-1/6 text-center">Action</div>
  </div>

  <div className="w-full h-[1px] border border-[#d0d0d0] border-dotted mb-4"></div>

  <div className="space-y-2 max-h-[700px] min-w-[600px]">
    {matches.map((match, index) => (
      <div
        key={match.id}
        className={`flex justify-between items-center cursor-pointer p-3 rounded-[10px] min-w-[600px]
          ${selectedMatch?.id === match.id ? "bg-[#176dbf] text-white" : index % 2 === 0 ? "bg-white" : "bg-gray-200"}
        `}
        onClick={() => setSelectedMatch(match)}
      >
        <div className="flex items-center gap-2 text-xs font-medium w-1/4 whitespace-nowrap">
          <Image src={UserProfile} alt="Avatar" className="rounded-full" width={25} height={25} />
          <span className={selectedMatch?.id === match.id ? "text-white" : "text-[#1b2229]"}>
            {match.team1}
          </span>
        </div>

        <div className={`text-xs font-medium w-1/4 whitespace-nowrap ${selectedMatch?.id === match.id ? "text-white" : "text-[#1b2229]"}`}>
          {match.game}
        </div>

        <div className={`text-xs font-medium w-1/4 text-center whitespace-nowrap ${selectedMatch?.id === match.id ? "text-white" : "text-[#1b2229]"}`}>
          {match.city}
        </div>

        <div className={`text-xs font-medium w-1/6 whitespace-nowrap ${selectedMatch?.id === match.id ? "text-white" : "text-[#1b2229]"}`}>
          {match.date}
        </div>

        <div className="w-1/6 flex justify-center">
          <EyeIcon stroke={selectedMatch?.id === match.id ? "#FFFF" : "#fd5602"} />
        </div>
      </div>
    ))}
  </div>
</div>


        </div>

        {/* Right Section - Tournament Details */}
        <div className="bg-[#f2f2f4] rounded-[20px] h-auto w-full lg:w-[30%] p-4 sm:p-6">
          <Image className="rounded-[10px] w-full h-auto" alt="padel game image" src={MatchImage} />

          <div className="mt-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div className="text-[#1b2229] text-lg font-semibold">Padel Tournament</div>
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex items-center gap-2">
                  <Calender />
                  <span className="text-[#5f6a7c] text-xs font-medium">17 Sept 2024</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock />
                  <span className="text-[#5f6a7c] text-xs font-medium">09:00 AM</span>
                </div>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mt-2 gap-4">
              <div className="text-[#1b2229] text-sm font-medium">Sector 24, Chandigarh</div>
              <div className="flex items-center gap-2">
                <Icon />
                <div>
                  <span className="text-[#7e7e8a] text-xs font-medium">Last Registrations Date: </span>
                  <span className="text-[#1b2229] text-xs font-semibold">26 Nov 2024</span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6">
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-[#1b2229] text-sm font-semibold">Prize:</span>
                <span className="text-[#1b2229] text-xs font-medium">Unknown</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#1b2229] text-sm font-semibold">Format:</span>
                <span className="text-[#1b2229] text-xs font-medium">Knockout</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#1b2229] text-sm font-semibold">Total No of Teams:</span>
                <span className="text-[#1b2229] text-xs font-medium">16</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#1b2229] text-sm font-semibold">Teams joined:</span>
                <span className="text-[#1b2229] text-xs font-medium">3</span>
              </div>
            </div>

            <div className="mt-6 p-4 bg-white shadow-lg rounded-2xl">
              <div className="flex justify-between items-center mb-4">
                <p className="text-[#1b2229] text-sm font-semibold">Teams Joined</p>
                <p className="text-[#1c2329] text-sm font-semibold">3/16</p>
              </div>
              {[1, 2, 3].map((_, index) => (
                <div key={index} className="flex items-center mb-2">
                  <div className="relative w-8 h-8">
                    <Image
                      className="w-[30px] h-[30px] absolute left-0 top-0 rounded-full border border-[#10375c]"
                      src={rebecca}
                      alt="girl image"
                    />
                    <Image
                      className="w-[30px] h-[30px] absolute left-[10px] top-0 rounded-full border border-[#10375c]"
                      src={rebeccaAndSteven}
                      alt="boy image"
                    />
                  </div>
                  <span className="text-[#1c2329] text-xs font-semibold ml-4">Rebecca & Steven</span>
                </div>
              ))}
            </div>

            <div
              onClick={() => router.push("/admin/tournaments/upcoming-tournament/2")}
              className="cursor-pointer mt-6 h-12 px-4 py-3 bg-[#10375c] rounded-[28px] flex justify-center items-center"
            >
              <button className="text-white text-sm font-medium">View Details</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;