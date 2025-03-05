"use client";
import { useState } from "react";
import Image from "next/image";
import React from "react";
import MatchImage from "@/assets/images/padelImage.png";
import rebeccaAndSteven from "@/assets/images/rebeccaAndSteven.png";
import rebecca from "@/assets/images/rebecca.png";
import UserProfile from "@/assets/images/userprofile.png";
import UserProfile2 from "@/assets/images/UserProfile2.png";
import { Calender, Clock, Downarrow, EyeIcon, Icon, PlusIcon, Pluss } from "@/utils/svgicons";
import SearchBar from "../../components/SearchBar";
import trophy from "@/assets/images/trophy.png";

const matches = [
 { id: 1, team1: "Alex Parker", team2: "Alex Parker", game: "Padel", date: "22-01-2024" },
 { id: 2, team1: "Jordan Lee", team2: "Jordan Lee", game: "Pickleball", date: "22-01-2024" },
 { id: 3, team1: "Tracy Martin", team2: "Tracy Martin", game: "Padel", date: "22-01-2024" },
 { id: 4, team1: "Marley Martinez", team2: "Marley Martinez", game: "Pickleball", date: "22-01-2024" },
 { id: 5, team1: "Alex Parker", team2: "Alex Parker", game: "Padel", date: "22-01-2024" },
 { id: 6, team1: "Jordan Lee", team2: "Jordan Lee", game: "Pickleball", date: "22-01-2024" },
 { id: 7, team1: "Tracy Martin", team2: "Tracy Martin", game: "Padel", date: "22-01-2024" },
 { id: 8, team1: "Marley Martinez", team2: "Marley Martinez", game: "Pickleball", date: "22-01-2024" },
 { id: 9, team1: "Alex Parker", team2: "Alex Parker", game: "Padel", date: "22-01-2024" },
 { id: 10, team1: "Jordan Lee", team2: "Jordan Lee", game: "Pickleball", date: "22-01-2024" },
 { id: 11, team1: "Tracy Martin", team2: "Tracy Martin", game: "Padel", date: "22-01-2024" },
 { id: 12, team1: "Marley Martinez", team2: "Marley Martinez", game: "Pickleball", date: "22-01-2024" },
];

const Page = () => {
  const [selectedMatch, setSelectedMatch] = useState({ id: 1, team1: "Alex Parker", team2: "Alex Parker", game: "Padel", date: "22-01-2024" });
  const [searchParams, setSearchParams] = useState("");

 return (
  <div className="w-full bg-[#fbfaff] rounded-[10px] mt-[40px]">
   <div className="w-full bg-[#fbfaff] rounded-[10px] mt-[40px]">
    <div className="text-[#10375c] text-3xl font-semibold">Tournaments</div>

    <div className="mt-[10px] h-10 px-5 py-3 bg-[#1b2229] rounded-[28px] justify-center items-center gap-2.5 inline-flex">
     <button className="text-white text-sm font-medium ">Upcoming</button>
    </div>
    <div className="h-10 px-5 py-3 bg-white rounded-[28px] justify-center items-center gap-2.5 inline-flex">
     <div className="text-[#1b2229] text-sm font-medium font-['Raleway']">Previous</div>
    </div>

    <div className="h-10 lg:ml-[300px] lg:mr-[10px] px-5 py-3 bg-[#1b2229] rounded-[28px] justify-center items-center gap-[5px] inline-flex">
     <div className="text-white text-sm font-medium font-['Raleway']">Game</div>
    <Downarrow/>
    </div>

    <div className="h-10 px-5 py-3 bg-[#1b2229] rounded-[28px] justify-center items-center gap-[5px] inline-flex">
     <div className="text-white text-sm font-medium font-['Raleway']">Select a date</div>
     <Downarrow/>
    </div>

    <div className="flex float-end h-10 lg:ml-[200px] px-5 py-3 bg-[#1b2229] rounded-[28px] justify-center items-center gap-2.5 ">
    
     <PlusIcon/>
     <div className="text-white text-sm font-medium ">Add A New Tournament</div>
    </div>



    

    {/* left */}
    <div className="flex flex-col lg:flex-row w-full">
     <div className="bg-[#f2f2f4] rounded-[20px] mt-[10px] lg:w-[70%] w-full">
      <div className="mt-[21px] ml-[16px] flex justify-between">
       <div className="text-[#10375c] text-xl font-medium">Upcoming Tournaments</div>

       <SearchBar setQuery={setSearchParams} query={searchParams} />

       <div className="mr-[10px] h-10 px-5 py-3 bg-[#1b2229] rounded-[28px] justify-center items-center gap-[5px] inline-flex">
        <div className="text-white text-sm font-medium">Download</div>
        <Downarrow />
       </div>
      </div>

      <div className="overflow-auto overflo-custom">
          <div className="mt-[20px] ml-[30px] w-full rounded-[10px] bg-[#f2f2f4] flex text-sm font-semibold text-[#7e7e8a]">
            <div className="w-1/4 h-3.5 text-[#7e7e8a] text-xs font-medium">Name of Tournament</div>
            <div className="w-1/4 h-3.5 text-[#7e7e8a] text-xs font-medium">Game</div>
            <div className="w-1/4 h-3.5 text-[#7e7e8a] text-xs font-medium text-center">City</div>
            <div className="w-1/6 h-3.5 text-[#7e7e8a] text-xs font-medium">Date</div>
            <div className="w-1/6 h-3.5 text-[#7e7e8a] text-xs font-medium text-center">Action</div>
          </div>
          <div className="w-full h-[0px] border border-[#d0d0d0] border-dotted mt-[8px]"></div>
          
          <div className="p-[29px]">
            {matches.map((match, index) => (
              <div
                key={match.id}
                className={`cursor-pointer flex items-center h-[47px] px-3.5 py-3 rounded-[10px] ${
                  selectedMatch?.id === match.id ? "bg-[#176dbf] text-white" : index % 2 === 0 ? "bg-white" : "bg-gray-200"
                }`}
                onClick={() => setSelectedMatch(match)}
              >
                <div className={`w-1/4 flex items-center gap-2 text-[#1b2229] text-xs font-medium ${selectedMatch?.id === match.id ? "text-white" : "text-[#1b2229]"}`}>
                  <Image src={UserProfile} alt="Avatar" className="rounded-full" width={25} height={25} />
                  {match.team1}
                </div>
                <div className={`w-1/4 flex items-center gap-2 text-[#1b2229] text-xs font-medium ${selectedMatch?.id === match.id ? "text-white" : "text-[#1b2229]"}`}>
                  <Image src={UserProfile2} alt="Avatar" className="rounded-full" width={25} height={25} />
                  {match.team2}
                </div>
                <div className={`w-1/4 text-[#1b2229] text-xs font-medium text-center ${selectedMatch?.id === match.id ? "text-white" : "text-[#1b2229]"}`}>{match.game}</div>
                <div className={`w-1/6 text-xs font-medium ${selectedMatch?.id === match.id ? "text-white" : "text-[#1b2229]"}`}>{match.date}</div>
                <div className="w-1/6 text-[#1b2229] text-xs font-medium flex justify-center">
                  <EyeIcon stroke={selectedMatch?.id === match.id ? "#FFFF" : "#fd5602"} />
                </div>
              </div>
            ))}
          </div>
        </div>
     </div>

     {/* right */}
     <div className="lg:w-[30%] w-full h-fit mt-[10px] lg:ml-[10px] bg-[#f2f2f4] rounded-[20px]">
      <Image className="rounded-[10px] h-[40%] w-full p-[15px]" alt="padel game image" src={MatchImage} />

      <div className="h-[47px] flex-col justify-start items-start gap-2 inline-flex md:justify-between">
       <div className="self-stretch justify-start items-center gap-[28px] inline-flex">
        <div className="text-[#1b2229] mt-[10px] ml-[15px] text-lg font-semibold ">Padel Tournament</div>
        <div className="justify-start items-center gap-5 flex">
         <div className="justify-start items-center gap-2.5 flex">
          <Calender/>
          <div className="text-[#5f6a7c] text-xs font-medium ml-[40px]">17 Sept 2024</div>
         </div>
         <div className="justify-start items-center gap-2.5 flex">
        <Clock/>
          <div className="text-[#5f6a7c] text-xs font-medium font-['Raleway'] leading-[14.40px]">09:00 AM</div>
         </div>
        </div>
       </div>
       <div className="self-stretch justify-between items-start inline-flex">
        <div className="ml-[15px] text-[#1b2229] text-sm font-medium">Sector 24, Chandigarh</div>
        <div className="justify-start items-center gap-2.5 flex">
      <Icon/>
         <div>
          <span className="text-[#7e7e8a] text-xs font-medium">Last Registrations Date : </span>
          <span className="text-[#1b2229] text-xs font-semibold">26 Nov 2024</span>
         </div>
        </div>
       </div>
      </div>

      <div className="mt-[25px] mx-auto p-4">
       <div className="mt-4">
        <div className="mb-[15px] flex justify-between">
         <div className="text-[#1b2229] text-sm font-semibold">Prize:</div>
         <div className="text-[#1b2229] text-xs font-medium">Unknown</div>
        </div>

        <div className="mb-[15px] flex justify-between">
         <div className="text-[#1b2229] text-sm font-semibold">Format:</div>
         <div className="text-[#1b2229] text-xs font-medium">Knockout</div>
        </div>

        <div className="mb-[15px] flex justify-between">
         <div className="text-[#1b2229] text-sm font-semibold">Total No of Teams:</div>
         <div className="text-[#1b2229] text-xs font-medium">16</div>
        </div>

        <div className="flex justify-between">
         <div className="text-[#1b2229] text-sm font-semibold">Teams joined:</div>
         <div className="text-[#1b2229] text-xs font-medium">3</div>
        </div>
       </div>
     



<div className="mt-[15px] mb-[55px] px-[20px] py-[17px] bg-white rounded-[10px] flex flex-col  md:flex-row justify-center items-center">
    <div className="flex justify-center items-center gap-[20px]">
        <div className="flex justify-start items-start gap-5">
            <Image className="w-[119px] h-[98px] p-[15px]" alt="trophy image" src={trophy} />
        </div>
        <div className="flex flex-col justify-start items-center gap-[11px] w-full md:w-[209px]">
            <div className="flex justify-start items-center gap-[18px]">
                <Image className="w-[54px] object-cover h-[54px] rounded-full border-2 border-[#f2f2f4]" src={rebecca} alt="girl image" />
                <Image className="w-[54px] h-[54px] rounded-full border-2 border-[#f2f2f4]" src={rebeccaAndSteven} alt="boy image"/>
            </div>
            <div className="text-[#1b2229] font-semibold self-stretch text-center mt-[11px] mb-[11px] text-[21px]">Rebeca & Steven</div>
            <div className="self-stretch text-center text-[#1c2329] mb-[20px] text-xs font-semibold">Winners of the Tournament</div>
        </div>
    </div>
</div>
      
       <div className="mt-[31px] mb-[21px] h-12 px-[173px] py-4 bg-[#10375c] rounded-[28px] justify-center items-center gap-2.5 inline-flex">
        <button className="text-white text-sm font-medium ">View Details</button>
       </div>
      </div>
     </div>
    
    </div>
   </div>
  </div>
 );
};

export default Page;