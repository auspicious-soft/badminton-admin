"use client";
import { useState } from "react";
import Image from "next/image";
import MatchImage from "@/assets/images/padelImage.png";
import UserProfile from "@/assets/images/userprofile.png";
import UserProfile2 from "@/assets/images/UserProfile2.png";
import UserProfile3 from "@/assets/images/userProfile3.png";
import UserProfile4 from "@/assets/images/userProfile4.png";
import { EyeIcon, ClockIcon, CalenderIcon } from "@/utils/svgicons";
import SearchBar from "../SearchBar";
import TablePagination from "../TablePagination";

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

export default function MatchesComponent({ name }: { name: string }) {
 const [selectedMatch, setSelectedMatch] = useState({ id: 1, team1: "Alex Parker", team2: "Alex Parker", game: "Padel", date: "22-01-2024" });
 const [searchParams, setSearchParams] = useState("");
 const [page, setPage] = useState(1);
 const itemsPerPage = 10;

 const handlePageChange = (newPage: number) => {
  setPage(newPage);
  // setQuery(`page=${newPage}&limit=${itemsPerPage}`);
 };
 return (
  <div className=" h-full flex flex-col lg:flex-row w-full  bg-[#fbfaff] rounded-[20px]  gap-6">
   <div className="w-full lg:w-2/3 bg-[#f2f2f4] shadow-md rounded-[20px] p-[14px] overflow-auto overflo-custom">
    <div className="flex justify-between items-center mb-6">
     <h2 className="text-[#10375c] text-xl font-semibold">{name}</h2>
     <SearchBar setQuery={setSearchParams} query={searchParams} />
    </div>
    <div className="overflow-x-auto overflo-custom max-w-full">
     <div className="w-full min-w-[600px] rounded-[10px] bg-[#f2f2f4] flex text-sm font-semibold text-[#7e7e8a]">
      <div className="w-[30%] h-3.5 text-[#7e7e8a] text-start text-xs font-medium">Team 1</div>
      <div className="w-[30%] h-3.5 text-[#7e7e8a] text-start text-xs font-medium">Team 2</div>
      <div className="w-[15%] h-3.5 text-[#7e7e8a] text-xs font-medium">Game</div>
      <div className="w-[18%] h-3.5 text-[#7e7e8a] text-xs text-center font-medium">Date</div>
      <div className="w-[10%] h-3.5 text-[#7e7e8a] text-start text-xs font-medium ">Action</div>
     </div>
     <div className="w-full h-[0px] border border-[#d0d0d0] border-dotted mt-[8px]"></div>
     <div className="w-full min-w-[600px]">
      {matches.map((match, index) => (
       <div key={match.id} className={`cursor-pointer flex items-center h-[47px] px-3.5 py-3 rounded-[10px] ${selectedMatch?.id === match.id ? "bg-[#176dbf] text-white" : index % 2 === 0 ? "bg-[#f2f2f4]" : "bg-white"}`} onClick={() => setSelectedMatch(match)}>
        <div className={`w-[30%] flex items-center gap-2 break-words text-[#1b2229] text-xs font-medium ${selectedMatch?.id === match.id ? "text-white" : "text-[#1b2229]"}`}>
         <Image src={UserProfile} alt="Avatar" className="rounded-full" width={25} height={25} />
         {match.team1}
        </div>
        <div className={`w-[30%] flex items-center gap-2 break-words text-[#1b2229] text-xs font-medium ${selectedMatch?.id === match.id ? "text-white" : "text-[#1b2229]"}`}>
         <Image src={UserProfile} alt="Avatar" className="rounded-full" width={25} height={25} />
         {match.team1}
        </div>
        <div className={`w-[15%] text-[#1b2229] text-xs text-start font-medium ${selectedMatch?.id === match.id ? "text-white" : "text-[#1b2229]"}`}>{match.game}</div>
        <div className={`w-[18%] text-[#1b2229] text-center break-words text-xs font-medium ${selectedMatch?.id === match.id ? "text-white" : "text-[#1b2229]"}`}>{match.date}</div>
        <div className="w-[10%] text-[#1b2229] text-xs font-medium flex justify-center">
         <EyeIcon stroke={selectedMatch?.id === match.id ? "#FFFF" : "#fd5602"} />
        </div>
       </div>
      ))}
     </div>

     {/* Pagination */}
     <div className="mt-4 flex justify-end gap-2">
      <TablePagination setPage={handlePageChange} page={page} totalData={matches.length} itemsPerPage={itemsPerPage} />
     </div>
    </div>
   </div>

   <div className="w-full lg:w-1/3 h-fit bg-[#f2f2f4] shadow-md rounded-[20px] px-[15px] pt-[14px] pb-[19px]">
    {selectedMatch ? (
     <div className="bg-[#f2f2f4] rounded-[20px]">
      <Image src={MatchImage} alt="Match" className="w-full h-40 rounded-md object-cover" />
      <h3 className="text-xl font-bold mt-4 flex justify-between mb-[8px]">
       {selectedMatch?.game} Game <span className="text-right text-[#1b2229] text-sm font-semibold  leading-[16.80px]">120 Mins</span>
      </h3>
      <div className="flex justify-between">
       <p className="text-[#1b2229] text-sm font-medium  leading-[16.80px] flex items-center gap-2">Sector 24, Chandigarh </p>
       <div className="flex  gap-[20px] ">
        <div className="flex gap-[10px] text-[#5f6a7c] text-xs font-medium  leading-[14.40px]">
         {" "}
         <CalenderIcon /> 17 Sept 2024{" "}
        </div>
        <div className="flex gap-[10px] text-[#5f6a7c] text-xs font-medium  leading-[14.40px]">
         <ClockIcon /> 09:00 AM
        </div>
       </div>
      </div>

      <div className=" flex justify-between items-center mt-4">
       <h4 className="text-[#1b2229] text-sm font-semibold  leading-[16.80px]">Created By</h4>
       <div className="flex items-center gap-2">
        <Image src={UserProfile2} alt="Avatar" className="rounded-full" width={25} height={25} />
        <p className="text-right text-[#1b2229] text-xs font-medium">Alex Parker</p>
       </div>
      </div>
      <div className="mt-2 grid grid-cols-2 gap-[10px]">
       <p className="text-[#1b2229] text-sm font-semibold  leading-[16.80px]">Players</p>
       <p className="text-right text-[#1b2229] text-xs font-medium  ">3</p>
       <p className="text-[#1b2229] text-sm font-semibold  leading-[16.80px]">Equipment Rented</p>
       <p className="text-right text-[#1b2229] text-xs font-medium ">None</p>
       <p className="text-[#1b2229] text-sm font-semibold  leading-[16.80px]">Paid for</p>
       <p className="text-right text-[#1b2229] text-xs font-medium ">Himself only</p>
      </div>

      <div className="bg-[#f2f2f4] rounded-[20px] mt-[15px] ">
       {/* <div className=""> */}
       <div className="flex flex-col items-center mt-[15px] bg-white px-[17px] py-[20px] gap-[20px] rounded-lg">
        <h4 className="text-center text-[#1b2229] text-sm font-semibold  leading-[16.80px]">Players in the Game</h4>
        <div className="flex items-center gap-[15px]">
         <div className="flex flex-col items-center">
          <Image src={UserProfile3} alt="Player" height={100} width={100} className="rounded-full w-16" />
          <p className="text-xs">Wren Lee</p>
         </div>
         <div className="flex flex-col items-center">
          <Image src={UserProfile4} alt="Player" height={100} width={100} className="rounded-full w-16" />
          <p className="text-xs">Wren Lee</p>
         </div>
         <p className="text-sm font-bold">VS</p>
         <div className="flex flex-col items-center">
          <Image src={UserProfile3} alt="Player" height={100} width={100} className="rounded-full w-16" />
          <p className="text-xs">Taylor Davis</p>
         </div>
         <div className="flex flex-col items-center">
          <Image src={UserProfile4} alt="Player" height={100} width={100} className="rounded-full w-16" />
          <p className="text-xs">Taylor Davis</p>
         </div>
        </div>
       </div>
       {/* </div> */}
      </div>
      <button className="w-full  bg-[#10375C] text-white p-3 rounded-[28px] mt-[20%]">Edit Game</button>
     </div>
    ) : (
     <p className="text-center text-gray-500">Select a match to see details</p>
    )}
   </div>
  </div>
 );
}
