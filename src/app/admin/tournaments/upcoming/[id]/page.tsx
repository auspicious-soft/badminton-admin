"use client";
import React, { useState } from "react";
import Image from "next/image";
import { UpArrowIcon, DownArrowIcon } from "@/utils/svgicons";
import MatchImage from "@/assets/images/padelImage.png";
import chanceAndBrandon from "@/assets/images/chanceAndBrandon.png";
import cbBackImage from "@/assets/images/cbBackImage.png";

const Page = () => {
 const [gameDropdown, setGameDropdown] = useState({});
 const [selectedGame, setSelectedGame] = useState({});
 const games = ["Padel", "Pickleball"];

 const toggleDropdown = (index) => {
  setGameDropdown((prev) => ({
   ...prev,
   [index]: !prev[index],
  }));
 };

 const selectGame = (index, game) => {
  setSelectedGame((prev) => ({
   ...prev,
   [index]: game,
  }));
  setGameDropdown((prev) => ({
   ...prev,
   [index]: false,
  }));
 };

 return (
  <div className=" px-4 py-6">
   <h1 className="text-[#10375c] text-2xl md:text-3xl font-semibold mb-6">Padel Tournament</h1>

   <div className=" flex flex-col lg:flex-row bg-[#f2f2f4] rounded-[20px] p-4 gap-6">
    {/* Left Section */}
    <div className=" w-full lg:w-[40%] ">
     <div className="space-y-6">
      <Image className="rounded-[10px] w-full h-auto object-cover" alt="padel game image" src={MatchImage} width={500} height={300} />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
       <div className="space-y-1">
        <label className="block text-[#1b2229] text-xs font-medium">Date of Match</label>
        <input type="date" className="w-full h-[45px] text-xs p-2 border rounded-2xl bg-white" />
       </div>

       <div className="space-y-1">
        <label className="block text-[#1b2229] text-xs">Time</label>
        <input type="time" className="w-full h-[45px] text-xs p-2 border rounded-2xl bg-white" />
       </div>

       <div className="space-y-1">
        <label className="block text-[#1b2229] text-xs">Select Game</label>
        <select className="w-full h-[45px] text-xs p-2 border rounded-2xl bg-white">
         <option>Padel</option>
         <option>Pickleball</option>
        </select>
       </div>

       <div className="space-y-1">
        <label className="block text-[#1b2229] text-xs">Court Booking Time</label>
        <input type="time" className="w-full h-[45px] text-xs p-2 border rounded-2xl bg-white" />
       </div>

       <div className="space-y-1">
        <label className="block text-[#1b2229] text-xs">No of Players Joined</label>
        <input type="number" className="w-full h-[45px] text-xs p-2 border rounded-2xl bg-white" />
       </div>

       <div className="space-y-1">
        <label className="block text-[#1b2229] text-xs">Amount Paid</label>
        <input type="number" className="w-full h-[45px] text-xs p-2 border rounded-2xl bg-white" />
       </div>

       <div className="space-y-1">
        <label className="block text-gray-600 text-xs">Pending Payment</label>
        <input type="number" className="w-full h-[45px] text-xs p-2 border rounded-2xl bg-white" />
       </div>

       <div className="space-y-1">
        <label className="block text-gray-600 text-xs">Discount</label>
        <input type="number" className="w-full h-[45px] text-xs p-2 border rounded-2xl bg-white" />
       </div>
      </div>

      <button className="w-full h-12 bg-[#10375c] rounded-[28px] text-white text-sm font-medium">Save</button>
     </div>
    </div>

    {/* Right Section */}
    <div className="w-full lg:w-[60%] bg-white rounded-[20px] p-6">
     <h2 className="text-[#10375c] text-xl font-medium mb-6">Teams Joined</h2>

     <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
      {["Chance & Brandon", "Charlie & Madelyn", "Jocelyn & Kadin", "Corey & Kierra", "Skylar & Carter", "Cooper & Giana"].map((team, index) => (
       <div key={index} className="flex items-center bg-[#0E3A5A] text-white rounded-full px-4 py-2">
        <div className="relative w-8 h-8 mr-2 flex-shrink-0">
         <Image className="w-[30px] h-[30px] absolute left-0 top-0 rounded-full border border-[#10375c] object-cover" src={cbBackImage} alt="team member 1" />
         <Image className="w-[30px] h-[30px] absolute left-[10px] top-0 rounded-full border border-[#10375c]" src={chanceAndBrandon} alt="team member 2" />
        </div>
        <span className="text-sm font-medium truncate">{team}</span>
       </div>
      ))}
     </div>

     <h2 className="text-[#10375c] text-xl font-medium mb-4">Schedule</h2>

     <div className="bg-[#f2f2f4] rounded-[10px] p-5">
      <div className="space-y-6">
       {[1, 2, 3, 4].map((index) => (
        <div key={index} className="flex flex-col md:flex-row gap-2.5">
         <div className="w-full md:w-48 space-y-1 relative">
          <label className="block text-[#1b2229] text-xs font-medium">Match Type</label>
          <button className="w-full h-[45px] px-4 bg-white rounded-[28px] flex justify-between items-center text-black/60 text-xs font-medium" onClick={() => toggleDropdown(index)}>
           {selectedGame[index] || "Game"}
           <span>{!gameDropdown[index] ? <DownArrowIcon stroke="#1C2329" /> : <UpArrowIcon stroke="#1C2329" />}</span>
          </button>
          {gameDropdown[index] && (
           <div className="absolute top-12 left-0 w-full bg-white rounded-[10px] p-4 shadow-[0px_4px_20px_0px_rgba(92,138,255,0.10)] z-50 space-y-2">
            {games.map((game) => (
             <label key={game} className="flex items-center gap-2 cursor-pointer text-[#1b2229] text-sm font-medium">
              <input type="radio" name={`game-${index}`} value={game} checked={selectedGame[index] === game} onChange={() => selectGame(index, game)} />
              {game}
             </label>
            ))}
           </div>
          )}
         </div>

         <div className="w-full md:w-[193px] space-y-1">
          <label className="block text-[#1b2229] text-xs font-medium">Select Date & Time</label>
          <input type="datetime-local" className="w-full h-[45px] px-4 bg-white rounded-[28px] text-black/60 text-xs font-medium" />
         </div>

         <div className="w-full md:w-[193px] space-y-1">
          <label className="block text-[#1b2229] text-xs font-medium">Team 1</label>
          <input type="text" className="w-full h-[45px] px-4 bg-white rounded-[28px] text-black/60 text-xs font-medium" />
         </div>

         <div className="w-full md:w-[193px] space-y-1">
          <label className="block text-[#1b2229] text-xs font-medium">Team 2</label>
          <input type="text" className="w-full h-[45px] px-4 bg-white rounded-[28px] text-black/60 text-xs font-medium" />
         </div>
        </div>
       ))}

       <button className=" w-[40%]   px-8 py-4 bg-[#10375c] rounded-[28px] text-white text-sm font-medium mx-auto block">Add More</button>
      </div>
     </div>
    </div>
   </div>
  </div>
 );
};

export default Page;
