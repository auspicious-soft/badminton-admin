// import React from 'react'

// export const Page = () => {
//   return (
//     <>
//   <div>previous tournament detail</div>
    
    
    
//     </>
//   )
// }
// export default Page;





"use client";
import { useState ,  useRef } from "react";
import Image from "next/image";
import React from "react";
import MatchImage from "@/assets/images/padelImage.png";
import rebeccaAndSteven from "@/assets/images/rebeccaAndSteven.png";
import rebecca from "@/assets/images/rebecca.png";
import UserProfile from "@/assets/images/userprofile.png";
import trophy from "@/assets/images/trophy.png";
import { Calender, Clock, Downarrow, EyeIcon, Icon, PlusIcon, WhiteDownArrow } from "@/utils/svgicons";
// import SearchBar from "../../components/SearchBar";
import { useRouter } from "next/navigation";
import { CrossIcon, CrossIcon1, DownArrowIcon, UpArrowIcon, } from "@/utils/svgicons";
import SearchBar from "@/app/admin/components/SearchBar";

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
  const [gameDropdown, setGameDropdown] = useState(false);
  const [selectedGame, setSelectedGame] = useState("");
  const [open, setOpen] = useState(false);
    const dateInputRef = useRef<HTMLInputElement>(null);
    const [selectedCity, setSelectedCity] = useState("");
    const [selectedDate, setSelectedDate] = useState("");
    const [cityDropdown, setCityDropdown] = useState(false);
  
const games = ["Padel", "Pickleball"];

  return (
    <div className="w-full bg-[#fbfaff] rounded-[10px] mt-10 p-4  ">
      <div className="text-[#10375c] text-2xl sm:text-3xl font-semibold mb-4">Tournaments</div>

      <div className="flex flex-wrap gap-3 mb-6">
        <button className="h-10 px-5 py-3 bg-[#1b2229] rounded-[28px] text-white text-sm font-medium">
          Upcoming
        </button>
        <button onClick={() => {router.push("/admin/tournaments/upcoming/previous")}} className="h-10 px-5  bg-[#f4f4f5] py-[12px] rounded-[28px] text-[#1b2229] text-sm font-medium">
          Previous
        </button>

       
     <div className="mb-4">
       <div className="relative">
         <button
         className="w-full h-10 px-5 py-3 border border-[#e6e6e6] rounded-full bg-[#1b2229] text-white flex justify-between items-center text-xs font-medium"
         onClick={() => setGameDropdown(!gameDropdown)}
         >
         {selectedGame || "Game"}
         <span>{!gameDropdown ? <WhiteDownArrow /> : <UpArrowIcon />}</span>
         </button>
         {gameDropdown && (
         <div className="z-50 flex flex-col gap-2 absolute top-14 left-0 p-4  w-auto bg-white rounded-[10px] shadow-lg">
         {games.map((status) => (
         <label key={status} className="flex gap-2 cursor-pointer text-[#1b2229] text-xs font-medium">
         <input
         type="radio"
         name="Game"
         value={status}
         checked={selectedGame === status}
         onChange={(e) => {
         setSelectedGame(e.target.value);
         console.log("Selected Status:", e.target.value);
         setGameDropdown(false);
       }}
         className="accent-[#1b2229]" />
         {status}
         </label>
         ))}
         </div>
         )}
         </div>
         </div>




        <div className="relative" onClick={() => dateInputRef.current?.showPicker()}>
            <button className="h-10 px-5 py-3 text-sm font-medium bg-[#1b2229] text-white rounded-[28px] w-full flex items-center justify-between">
              {selectedDate || "Select Date"}
              <span className="ml-2">
              {dateInputRef.current ? <UpArrowIcon />:<DownArrowIcon /> }
              </span>
            </button>
            <input
              ref={dateInputRef}
              type="date"
              className="absolute inset-0 opacity-0 w-full h-full cursor-pointer"
              value={selectedDate}
              onChange={(e) => {
                setSelectedDate(e.target.value);
                console.log("Selected Date:", e.target.value);
              }}
            />
          </div>




        <div className="h-10 px-5 py-3 bg-[#1b2229] rounded-[28px] flex items-center gap-2 ml-auto">
          <PlusIcon />
          <span className="text-white text-sm font-medium">Add A New Tournament</span>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        <div className="bg-[#f2f2f4] rounded-[20px] w-full lg:w-[70%] p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
            <div className="text-[#10375c] text-xl font-medium mb-2 sm:mb-0">Previous Matches</div>
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



<div className="w-full mt-4 h-auto px-4 py-5 bg-white rounded-lg flex flex-col md:justify-center lg:flex-row justify-between items-center shadow-md">
  <div className="flex justify-center items-center gap-4 w-full md:w-auto">
    <Image className="object-fit w-24 h-24 md:w-28  md:h-24 lg:h-20 lg:w-20 " src={trophy} alt="trophy image" />
    <div className="flex flex-col justify-center items-center gap-2 text-center">
      <div className="flex justify-center items-center gap-2 md:gap-4">
        <Image className="w-14 h-14 lg:h-12 lg:w-12  rounded-full border-2 border-gray-200" src={rebecca} alt="Rebecca" />
        <Image className="w-14 h-14 lg:h-12 lg:w-12  rounded-full border-2 border-gray-200" src={rebeccaAndSteven} alt="Rebecca and Steven" />
      </div>
      <div className="text-lg md:text-xl font-semibold text-gray-900">Rebeca & Steven</div>
      <div className="text-sm md:text-xs font-semibold text-gray-600">Winners of the Tournament</div>
    </div>
  </div>
</div>





            <div
              onClick={() => router.push("/admin/tournaments/upcoming/previous/details")}
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