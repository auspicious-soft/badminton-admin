"use client";
import React, { ReactElement, useState } from "react";
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
   [index]: !prev[index], // Toggle only the clicked dropdown
  }));
 };

 // Function to handle game selection
 const selectGame = (index, game) => {
  setSelectedGame((prev) => ({
   ...prev,
   [index]: game,
  }));
  setGameDropdown((prev) => ({
   ...prev,
   [index]: false, // Close the dropdown after selection
  }));
 };

 return (
  <div>
   <div className="text-[#10375c] text-3xl font-semibold ">Padel Tournament</div>
   <div className="w-full flex bg-[#f2f2f4] rounded-[20px] px-[15px] py-[14px] gap-[24px]">
    {/* left */}
    <div className="w-full ">
     <div className=" rounded-lg  mx-auto h-full ">
      <Image className="rounded-[10px] h-[30%]  w-full" alt="padel game image" src={MatchImage} width={500} />
      <div className="grid grid-cols-2 gap-4 mt-10">
       <div>
        <label className="block text-[#1b2229] text-xs font-medium">Date of Match</label>
        <input type="date" className="w-full h-[45px] text-xs p-2 border rounded-2xl bg-white" />
       </div>
       <div>
        <label className="block text-[#1b2229] text-xs">Time</label>
        <input type="time" className="w-full h-[45px] text-xs p-2 border rounded-2xl bg-white" />
       </div>
       <div>
        <label className="block text-[#1b2229] text-xs">Select Game</label>
        <select className="w-full h-[45px] text-xs p-2 border rounded-2xl bg-white">
         <option>Padel</option>
         <option>Pickleball</option>
        </select>
       </div>
       <div>
        <label className="block text-[#1b2229] text-xs">Court Booking Time</label>
        <input type="time" className="w-full h-[45px] text-xs p-2 border rounded-2xl bg-white" />
       </div>
       <div>
        <label className="block text-[#1b2229] text-xs">No of Players Joined</label>
        <input type="number" className="w-full h-[45px] text-xs p-2 border rounded-2xl bg-white" />
       </div>
       <div>
        <label className="block text-[#1b2229] text-xs">Amount Paid</label>
        <input type="number" className="w-full h-[45px] text-xs p-2 border rounded-2xl bg-white" />
       </div>
       <div>
        <label className="block text-gray-600 text-sm">Pending Payment</label>
        <input type="number" className="w-full h-[45px] text-xs p-2 border rounded-2xl bg-white" />
       </div>
       <div>
        <label className="block text-gray-600 text-sm">Discount</label>
        <input type="number" className="w-full h-[45px] text-xs p-2 border rounded-2xl bg-white" />
       </div>
      </div>
      <button className="h-12   pt-[10px]  py-4 bg-[#10375c] rounded-[28px] mt-6 w-full text-white text-sm font-medium justify-center mb-[10px]">Save</button>
     </div>
    </div>

    {/* right */}
    <div className="  bg-white rounded-[20px] ">
     <div className="text-[#10375c] text-xl font-medium mt-[30px] ml-[30px]">Teams Joined</div>

     {/* people */}
     {/* <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4  mb-[30px] px-[30px] pt-[15px]">
      <div className="h-auto  flex items-center space-x-2 bg-[#0E3A5A] text-white rounded-full px-4 py-2 ">
       <div className="relative w-8 h-8 mr-[15px]">
        <Image className="w-[30px] h-[30px] left-0 top-0 absolute border rounded-full object-cover border-[#10375c]" src={cbBackImage} alt="girl image" />
        <Image className="w-[30px] h-[30px] left-[10px] top-0 absolute rounded-full border border-[#10375c]" src={chanceAndBrandon} alt="chance and brandon image" />
       </div>
       <span className="text-sm font-medium ">Chance & Brandon</span>
      </div>

      <div className="h-auto w-full p-[10px ]  flex items-center space-x-2 bg-[#0E3A5A] text-white rounded-full px-4 py-2 ">
       <div className="relative w-8 h-8 mr-[15px]">
        <Image className="w-[30px] h-[30px] left-0 top-0 absolute border rounded-full object-cover border-[#10375c]" src={cbBackImage} alt="girl image" />
        <Image className="w-[30px] h-[30px] left-[10px] top-0 absolute rounded-full border border-[#10375c]" src={chanceAndBrandon} alt="chance and brandon image" />
       </div>
       <span className="text-sm font-medium">Charlie & Madelyn</span>
      </div>

      <div className="h-auto w-full   flex items-center space-x-2 bg-[#0E3A5A] text-white rounded-full px-4 py-2 ">
       <div className="relative w-8 h-8 mr-[15px]">
        <Image className="w-[30px] h-[30px] left-0 top-0 absolute border rounded-full object-cover border-[#10375c]" src={cbBackImage} alt="girl image" />
        <Image className="w-[30px] h-[30px] left-[10px] top-0 absolute rounded-full border border-[#10375c]" src={chanceAndBrandon} alt="chance and brandon image" />
       </div>
       <span className="text-sm font-medium">Jocelyn & Kadin</span>
      </div>

      <div className="h-auto w-full   flex items-center space-x-2 bg-[#0E3A5A] text-white rounded-full px-4 py-2 ">
       <div className="relative w-8 h-8 mr-[15px]">
        <Image className="w-[30px] h-[30px] left-0 top-0 absolute border rounded-full object-cover border-[#10375c]" src={cbBackImage} alt="girl image" />
        <Image className="w-[30px] h-[30px] left-[10px] top-0 absolute rounded-full border border-[#10375c]" src={chanceAndBrandon} alt="chance and brandon image" />
       </div>
       <span className="text-sm font-medium">Corey & Kierra</span>
      </div>

      <div className="h-auto w-full flex items-center space-x-2 bg-[#0E3A5A] text-white rounded-full px-4 py-2 ">
       <div className="relative w-8 h-8 mr-[15px]">
        <Image className="w-[30px] h-[30px] left-0 top-0 absolute border rounded-full object-cover border-[#10375c]" src={cbBackImage} alt="girl image" />
        <Image className="w-[30px] h-[30px] left-[10px] top-0 absolute rounded-full border border-[#10375c]" src={chanceAndBrandon} alt="chance and brandon image" />
       </div>
       <span className="text-sm font-medium">Skylar & Carter</span>
      </div>

      <div className="h-auto w-full   flex items-center space-x-2 bg-[#0E3A5A] text-white rounded-full px-4 py-2 ">
       <div className="relative w-8 h-8 mr-[15px]">
        <Image className="w-[30px] h-[30px] left-0 top-0 absolute border rounded-full object-cover border-[#10375c]" src={cbBackImage} alt="girl image" />
        <Image className="w-[30px] h-[30px] left-[10px] top-0 absolute rounded-full border border-[#10375c]" src={chanceAndBrandon} alt="chance and brandon image" />
       </div>
       <span className="text-sm font-medium">Cooper & Giana</span>
      </div>
     </div> */}



     <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-[30px] px-[30px] pt-[15px]">
  <div className="h-auto flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-2 bg-[#0E3A5A] text-white rounded-full px-4 py-2">
    <div className="relative w-8 h-8 sm:mr-[15px]">
      <Image className="w-[30px] h-[30px] left-0 top-0 absolute border rounded-full object-cover border-[#10375c]" src={cbBackImage} alt="girl image" />
      <Image className="w-[30px] h-[30px] left-[10px] top-0 absolute rounded-full border border-[#10375c]" src={chanceAndBrandon} alt="chance and brandon image" />
    </div>
    <span className="text-sm font-medium">Chance & Brandon</span>
  </div>

  <div className="h-auto flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-2 bg-[#0E3A5A] text-white rounded-full px-4 py-2">
    <div className="relative w-8 h-8 sm:mr-[15px]">
      <Image className="w-[30px] h-[30px] left-0 top-0 absolute border rounded-full object-cover border-[#10375c]" src={cbBackImage} alt="girl image" />
      <Image className="w-[30px] h-[30px] left-[10px] top-0 absolute rounded-full border border-[#10375c]" src={chanceAndBrandon} alt="chance and brandon image" />
    </div>
    <span className="text-sm font-medium">Charlie & Madelyn</span>
  </div>

  <div className="h-auto flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-2 bg-[#0E3A5A] text-white rounded-full px-4 py-2">
    <div className="relative w-8 h-8 sm:mr-[15px]">
      <Image className="w-[30px] h-[30px] left-0 top-0 absolute border rounded-full object-cover border-[#10375c]" src={cbBackImage} alt="girl image" />
      <Image className="w-[30px] h-[30px] left-[10px] top-0 absolute rounded-full border border-[#10375c]" src={chanceAndBrandon} alt="chance and brandon image" />
    </div>
    <span className="text-sm font-medium">Jocelyn & Kadin</span>
  </div>

  <div className="h-auto flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-2 bg-[#0E3A5A] text-white rounded-full px-4 py-2">
    <div className="relative w-8 h-8 sm:mr-[15px]">
      <Image className="w-[30px] h-[30px] left-0 top-0 absolute border rounded-full object-cover border-[#10375c]" src={cbBackImage} alt="girl image" />
      <Image className="w-[30px] h-[30px] left-[10px] top-0 absolute rounded-full border border-[#10375c]" src={chanceAndBrandon} alt="chance and brandon image" />
    </div>
    <span className="text-sm font-medium">Corey & Kierra</span>
  </div>

  <div className="h-auto flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-2 bg-[#0E3A5A] text-white rounded-full px-4 py-2">
    <div className="relative w-8 h-8 sm:mr-[15px]">
      <Image className="w-[30px] h-[30px] left-0 top-0 absolute border rounded-full object-cover border-[#10375c]" src={cbBackImage} alt="girl image" />
      <Image className="w-[30px] h-[30px] left-[10px] top-0 absolute rounded-full border border-[#10375c]" src={chanceAndBrandon} alt="chance and brandon image" />
    </div>
    <span className="text-sm font-medium">Skylar & Carter</span>
  </div>

  <div className="h-auto flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-2 bg-[#0E3A5A] text-white rounded-full px-4 py-2">
    <div className="relative w-8 h-8 sm:mr-[15px]">
      <Image className="w-[30px] h-[30px] left-0 top-0 absolute border rounded-full object-cover border-[#10375c]" src={cbBackImage} alt="girl image" />
      <Image className="w-[30px] h-[30px] left-[10px] top-0 absolute rounded-full border border-[#10375c]" src={chanceAndBrandon} alt="chance and brandon image" />
    </div>
    <span className="text-sm font-medium">Cooper & Giana</span>
  </div>
</div>

     {/* right lower */}
     <div className="text-[#10375c] text-xl font-medium ml-[30px] mb-[15px]">Schedule</div>

     <div className="h-auto ml-[30px] mr-[30px] mb-[23.35px]  p-5 bg-[#f2f2f4] rounded-[10px] flex-col justify-start items-center gap-2.5 inline-flex">
      <div className="self-stretch h-[365.65px] flex-col justify-start items-center gap-[30px] flex">
       <div className="self-stretch h-[287.65px] flex-col justify-start items-start gap-5 flex">
        <div className="self-stretch h-[287.65px] flex-col justify-start items-start gap-2.5 flex">
         <div className="self-stretch justify-start items-start gap-2.5 inline-flex">
          <div className="w-48 flex-col justify-start items-start gap-[5px] inline-flex">
           <label className="self-stretch text-[#1b2229] text-xs font-medium"> Match Type </label>
           <div className="relative w-full">
            <button className="w-full self-stretch flex justify-between h-[45px] px-[15px] py-[10px] bg-white items-center text-black/60 text-xs font-medium rounded-[28px]" onClick={() => toggleDropdown(1)}>
             {selectedGame[1] || "Game"}
             <span className="ml-2">{!gameDropdown[1] ? <DownArrowIcon stroke="#1C2329" /> : <UpArrowIcon stroke="#1C2329" />}</span>
            </button>
            {gameDropdown[1] && (
             <div className=" self-stretch px-[15px] py-2.5 rounded-[10px]  justify-between items-start   z-50 flex flex-col gap-[5px] absolute top-12 left-0  p-[20px] w-[168px]  bg-white  shadow-[0px_4px_20px_0px_rgba(92,138,255,0.10)]">
              {games.map((game) => (
               <label key={game} className="flex gap-[10px] cursor-pointer text-[#1b2229] text-sm font-medium ">
                <input
                 type="radio"
                 name="game-1" // Unique name for this dropdown
                 value={game}
                 checked={selectedGame[1] === game} // Check if this game is selected for index 1
                 onChange={() => selectGame(1, game)}
                 className="bg-[#1b2229]"
                />
                {game}
               </label>
              ))}
             </div>
            )}
           </div>
           <div data-svg-wrapper className="relative"></div>
          </div>

          <div className="w-[193px] flex-col justify-start items-start gap-[5px] inline-flex">
           <div className="self-stretch text-[#1b2229] text-xs font-medium font-['Raleway']">Select Date & Time</div>
           <div className="self-stretch h-[45.41px] px-[15px] py-2.5 bg-white rounded-[39px] flex-col justify-start items-start gap-2.5 flex">
            <div className="self-stretch justify-start items-center gap-[52px] inline-flex">
             <input type="datetime-local" className="w-[94px] h-[25.41px] text-black/60 text-xs font-medium font-['Raleway']" />
            </div>
           </div>
          </div>

          <div className="w-[193px] flex-col justify-start items-start gap-[5px] inline-flex">
           <div className="self-stretch text-[#1b2229] text-xs font-medium font-['Raleway']">Team 1</div>
           <div className="self-stretch h-[45.41px] px-[15px] py-2.5 bg-white rounded-[39px] flex-col justify-start items-start gap-2.5 flex">
            <div className="self-stretch justify-start items-center gap-[52px] inline-flex">
             <input type="text" className="w-[94px] h-[25.41px] text-black/60 text-xs font-medium font-['Raleway']" />
            </div>
           </div>
          </div>

          <div className="w-[193px] flex-col justify-start items-start gap-[5px] inline-flex">
           <div className="self-stretch text-[#1b2229] text-xs font-medium font-['Raleway']">Team 2</div>
           <div className="self-stretch h-[45.41px] px-[15px] py-2.5 bg-white rounded-[39px] flex-col justify-start items-start gap-2.5 flex">
            <div className="self-stretch justify-start items-center gap-[52px] inline-flex">
             <input type="text" className="w-[94px] h-[25.41px] text-black/60 text-xs font-medium font-['Raleway']" />
            </div>
           </div>
          </div>
         </div>

         <div className="self-stretch justify-start items-start gap-2.5 inline-flex">
          <div className="w-48 flex-col justify-start items-start gap-[5px] inline-flex">
           <label className="self-stretch text-[#1b2229] text-xs font-medium"> Match Type </label>
           <div className="relative w-full">
            <button className="w-full self-stretch flex justify-between h-[45px] px-[15px] py-[10px] bg-white items-center text-black/60 text-xs font-medium rounded-[28px]" onClick={() => toggleDropdown(2)}>
             {selectedGame[2] || "Game"}
             <span className="ml-2">{!gameDropdown[2] ? <DownArrowIcon stroke="#1C2329" /> : <UpArrowIcon stroke="#1C2329" />}</span>
            </button>
            {gameDropdown[2] && (
             <div className=" self-stretch px-[15px] py-2.5 rounded-[10px]  justify-between items-start   z-50 flex flex-col gap-[5px] absolute top-12 left-0  p-[20px] w-[168px]  bg-white  shadow-[0px_4px_20px_0px_rgba(92,138,255,0.10)]">
              {games.map((game) => (
               <label key={game} className="flex gap-[10px] cursor-pointer text-[#1b2229] text-sm font-medium ">
                <input
                 type="radio"
                 name="game-2" // Unique name for this dropdown
                 value={game}
                 checked={selectedGame[2] === game} // Check if this game is selected for index 2
                 onChange={() => selectGame(2, game)}
                 className="bg-[#1b2229]"
                />
                {game}
               </label>
              ))}
             </div>
            )}
           </div>
           <div data-svg-wrapper className="relative"></div>
          </div>
          <div className="w-[193px] flex-col justify-start items-start gap-[5px] inline-flex">
           <div className="self-stretch text-[#1b2229] text-xs font-medium font-['Raleway']">Select Date & Time</div>
           <div className="self-stretch h-[45.41px] px-[15px] py-2.5 bg-white rounded-[39px] flex-col justify-start items-start gap-2.5 flex">
            <div className="self-stretch justify-start items-center gap-[52px] inline-flex">
             <input type="datetime-local" className="w-[94px] h-[25.41px] text-black/60 text-xs font-medium font-['Raleway']" />
            </div>
           </div>
          </div>

          <div className="w-[193px] flex-col justify-start items-start gap-[5px] inline-flex">
           <div className="self-stretch text-[#1b2229] text-xs font-medium font-['Raleway']">Team 1</div>
           <div className="self-stretch h-[45.41px] px-[15px] py-2.5 bg-white rounded-[39px] flex-col justify-start items-start gap-2.5 flex">
            <div className="self-stretch justify-start items-center gap-[52px] inline-flex">
             <input type="text" className="w-[94px] h-[25.41px] text-black/60 text-xs font-medium font-['Raleway']" />
            </div>
           </div>
          </div>

          <div className="w-[193px] flex-col justify-start items-start gap-[5px] inline-flex">
           <div className="self-stretch text-[#1b2229] text-xs font-medium font-['Raleway']">Team 2</div>
           <div className="self-stretch h-[45.41px] px-[15px] py-2.5 bg-white rounded-[39px] flex-col justify-start items-start gap-2.5 flex">
            <div className="self-stretch justify-start items-center gap-[52px] inline-flex">
             <input type="text" className="w-[94px] h-[25.41px] text-black/60 text-xs font-medium font-['Raleway']" />
            </div>
           </div>
          </div>
         </div>

         <div className="self-stretch justify-start items-start gap-2.5 inline-flex">
          <div className="w-48 flex-col justify-start items-start gap-[5px] inline-flex">
           <label className="self-stretch text-[#1b2229] text-xs font-medium"> Match Type </label>
           <div className="relative w-full">
            <button className="w-full self-stretch flex justify-between h-[45px] px-[15px] py-[10px] bg-white items-center text-black/60 text-xs font-medium rounded-[28px]" onClick={() => toggleDropdown(3)}>
             {selectedGame[3] || "Game"}
             <span className="ml-2">{!gameDropdown[3] ? <DownArrowIcon stroke="#1C2329" /> : <UpArrowIcon stroke="#1C2329" />}</span>
            </button>
            {gameDropdown[3] && (
             <div className=" self-stretch px-[15px] py-2.5 rounded-[10px]  justify-between items-start   z-50 flex flex-col gap-[5px] absolute top-12 left-0  p-[20px] w-[168px]  bg-white  shadow-[0px_4px_20px_0px_rgba(92,138,255,0.10)]">
              {games.map((game) => (
               <label key={game} className="flex gap-[10px] cursor-pointer text-[#1b2229] text-sm font-medium ">
                <input
                 type="radio"
                 name="game-3" // Unique name for this dropdown
                 value={game}
                 checked={selectedGame[3] === game} // Check if this game is selected for index 3
                 onChange={() => selectGame(3, game)}
                 className="bg-[#1b2229]"
                />
                {game}
               </label>
              ))}
             </div>
            )}
           </div>
           <div data-svg-wrapper className="relative"></div>
          </div>
          <div className="w-[193px] flex-col justify-start items-start gap-[5px] inline-flex">
           <div className="self-stretch text-[#1b2229] text-xs font-medium font-['Raleway']">Select Date & Time</div>
           <div className="self-stretch h-[45.41px] px-[15px] py-2.5 bg-white rounded-[39px] flex-col justify-start items-start gap-2.5 flex">
            <div className="self-stretch justify-start items-center gap-[52px] inline-flex">
             <input type="datetime-local" className="w-[94px] h-[25.41px] text-black/60 text-xs font-medium font-['Raleway']" />
            </div>
           </div>
          </div>

          <div className="w-[193px] flex-col justify-start items-start gap-[5px] inline-flex">
           <div className="self-stretch text-[#1b2229] text-xs font-medium font-['Raleway']">Team 1</div>
           <div className="self-stretch h-[45.41px] px-[15px] py-2.5 bg-white rounded-[39px] flex-col justify-start items-start gap-2.5 flex">
            <div className="self-stretch justify-start items-center gap-[52px] inline-flex">
             <input type="text" className="w-[94px] h-[25.41px] text-black/60 text-xs font-medium font-['Raleway']" />
            </div>
           </div>
          </div>

          <div className="w-[193px] flex-col justify-start items-start gap-[5px] inline-flex">
           <div className="self-stretch text-[#1b2229] text-xs font-medium font-['Raleway']">Team 2</div>
           <div className="self-stretch h-[45.41px] px-[15px] py-2.5 bg-white rounded-[39px] flex-col justify-start items-start gap-2.5 flex">
            <div className="self-stretch justify-start items-center gap-[52px] inline-flex">
             <input type="text" className="w-[94px] h-[25.41px] text-black/60 text-xs font-medium font-['Raleway']" />
            </div>
           </div>
          </div>
         </div>

         <div className="self-stretch justify-start items-start gap-2.5 inline-flex">
          <div className="w-48 flex-col justify-start items-start gap-[5px] inline-flex">
           <label className="self-stretch text-[#1b2229] text-xs font-medium"> Match Type </label>
           <div className="relative w-full">
            <button className="w-full self-stretch flex justify-between h-[45px] px-[15px] py-[10px] bg-white items-center text-black/60 text-xs font-medium rounded-[28px]" onClick={() => toggleDropdown(4)}>
             {selectedGame[4] || "Game"}
             <span className="ml-2">{!gameDropdown[4] ? <DownArrowIcon stroke="#1C2329" /> : <UpArrowIcon stroke="#1C2329" />}</span>
            </button>
            {gameDropdown[4] && (
             <div className=" self-stretch px-[15px] py-2.5 rounded-[10px]  justify-between items-start   z-50 flex flex-col gap-[5px] absolute top-12 left-0  p-[20px] w-[168px]  bg-white  shadow-[0px_4px_20px_0px_rgba(92,138,255,0.10)]">
              {games.map((game) => (
               <label key={game} className="flex gap-[10px] cursor-pointer text-[#1b2229] text-sm font-medium ">
                <input
                 type="radio"
                 name="game-4" // Unique name for this dropdown
                 value={game}
                 checked={selectedGame[4] === game} // Check if this game is selected for index 4
                 onChange={() => selectGame(4, game)}
                 className="bg-[#1b2229]"
                />
                {game}
               </label>
              ))}
             </div>
            )}
           </div>
           <div data-svg-wrapper className="relative"></div>
          </div>
          <div className="w-[193px] flex-col justify-start items-start gap-[5px] inline-flex">
           <div className="self-stretch text-[#1b2229] text-xs font-medium font-['Raleway']">Select Date & Time</div>
           <div className="self-stretch h-[45.41px] px-[15px] py-2.5 bg-white rounded-[39px] flex-col justify-start items-start gap-2.5 flex">
            <div className="self-stretch justify-start items-center gap-[52px] inline-flex">
             <input type="datetime-local" className="w-[94px] h-[25.41px] text-black/60 text-xs font-medium font-['Raleway']" />
            </div>
           </div>
          </div>

          <div className="w-[193px] flex-col justify-start items-start gap-[5px] inline-flex">
           <div className="self-stretch text-[#1b2229] text-xs font-medium font-['Raleway']">Team 1</div>
           <div className="self-stretch h-[45.41px] px-[15px] py-2.5 bg-white rounded-[39px] flex-col justify-start items-start gap-2.5 flex">
            <div className="self-stretch justify-start items-center gap-[52px] inline-flex">
             <input type="text" className="w-[94px] h-[25.41px] text-black/60 text-xs font-medium font-['Raleway']" />
            </div>
           </div>
          </div>

          <div className="w-[193px] flex-col justify-start items-start gap-[5px] inline-flex">
           <div className="self-stretch text-[#1b2229] text-xs font-medium font-['Raleway']">Team 2</div>
           <div className="self-stretch h-[45.41px] px-[15px] py-2.5 bg-white rounded-[39px] flex-col justify-start items-start gap-2.5 flex">
            <div className="self-stretch justify-start items-center gap-[52px] inline-flex">
             <input type="text" className="w-[94px] h-[25.41px] text-black/60 text-xs font-medium font-['Raleway']" />
            </div>
           </div>
          </div>
         </div>
        </div>
       </div>
       <div className="mt-[10px] px-[173px] py-4 bg-[#10375c] rounded-[28px] justify-center items-center gap-2.5 inline-flex">
        <div className="text-white text-sm font-medium font-['Raleway']">Add More</div>
       </div>
      </div>
     </div>

    </div>
   </div>
  </div>
 );
};

export default Page;
