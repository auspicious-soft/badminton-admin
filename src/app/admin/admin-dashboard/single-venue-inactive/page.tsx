"use client";
import React, { useState } from "react";
import Image from "next/image";
import { BottomArrow, Edit, Pluss, Search } from "@/utils/svgicons";
import MatchImage from "@/assets/images/padelImage.png";
import padelImage from "@/assets/images/padelImage.png";
import AlexParker from "@/assets/images/AlexParker.png";
import JordanLee from "@/assets/images/JordanLee.png";
import chanceAndBrandon from "@/assets/images/chanceAndBrandon.png";
import TracyMartin from "@/assets/images/TracyMartin.png";
import Select, { MultiValue } from "react-select";
import { EyeIcon, Add } from "@/utils/svgicons";
import SearchBar from "../../components/SearchBar";


interface NotificationData {
 title: string;
 text: string;
 recipients: string[];
}

interface OptionType {
 value: string;
 label: string;
}

const options: OptionType[] = [
 { value: "Pickleball", label: "Pickleball" },
 { value: "Paddle", label: "Paddle" },
];

const Page = () => {
 const [formData, setFormData] = useState<NotificationData>({
  title: "",
  text: "",
  recipients: [],
 });

 const [selectedMatch, setSelectedMatch] = useState({
  id: 1,
  team1: "Alex Parker",
  team2: "Alex Parker",
  game: "Padel",
  date: "22-01-2024",
 });
 const [searchParams, setSearchParams] = useState("");

 const handleRecipientsChange = (selectedOptions: MultiValue<OptionType>) => {
  const recipients = selectedOptions.map((option) => option.value);
  setFormData((prev) => ({
   ...prev,
   recipients: recipients,
  }));
 };

 const courts = [
  { id: 1, name: "Court No 1", status: "Inactive" },
  { id: 2, name: "Court No 2", status: "Active" },
  { id: 3, name: "Court No 3", status: "Inactive" },
  { id: 4, name: "Court No 4", status: "Active" },
 ];

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

 const employees = [
  { id: 1, team1: "Alex Parker" },
  { id: 2, team1: "Jordan Lee" },
  { id: 3, team1: "Tracy Martin" },
 ];

 return (
  <div className="w-full">
   <div className="text-[#10375c] text-3xl font-semibold">Barnton Park LTC</div>

   <div className="w-full flex gap-[15px] mt-[15px] md:flex-row flex-col ">
    <div className="w-full md:w-[45%] h-fit flex gap-[15px] mt-[15px]">
     {/* Left Side */}
     <div className="w-full  bg-[#f2f2f4] rounded-[20px] px-[15px] py-[14px]">
      <Image className="rounded-[10px] w-full h-auto object-cover" alt="padel game image" src={MatchImage} width={500} height={300} />

      <div className="flex justify-between items-center">
       <div className="text-[#10375c] text-2xl font-semibold mt-[25px]">Name of the Venue</div>
       <div className="mt-[15px]">
        <Edit />
       </div>
      </div>

      <div className="h-[69.41px]">
       <div className="text-[#1b2229] mt-[25px] mb-[10px] text-xs font-medium">Location</div>
       <div className="h-[45.41px] px-[15px] py-2.5 bg-white rounded-[39px]">
        <input type="date" className="text-black/60 text-xs font-medium mt-[5px]" />
       </div>
      </div>

      <div className="h-[69.41px]">
       <div className="text-[#1b2229] mt-[15px] mb-[10px] text-xs font-medium">Games Available</div>
       <Select
        isMulti
        options={options}
        value={options.filter((option) => formData.recipients.includes(option.value))}
        onChange={handleRecipientsChange}
        className="w-full text-black/60 text-xs font-medium"
        classNamePrefix="react-select"
        placeholder="Select Game..."
        styles={{
         control: (base) => ({
          ...base,
          borderRadius: "44px",
          border: "1px solid #e6e6e6",
          boxShadow: "none",
          height: "45.41px",
          backgroundColor: "white",
          "&:hover": {
           borderColor: "#e6e6e6",
          },
          padding: "2px",
         }),
         menu: (base) => ({
          ...base,
          borderRadius: "8px",
          width: "40%",
          boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
         }),
         option: (base, { isFocused }) => ({
          ...base,
          backgroundColor: isFocused ? "#e6f7ff" : "white",
          color: "#1c2329",
          "&:active": {
           backgroundColor: "#e6f7ff",
          },
         }),
         multiValue: (base) => ({
          ...base,
          backgroundColor: "#1c2329",
          borderRadius: "5px",
         }),
         multiValueLabel: (base) => ({
          ...base,
          color: "white",
          padding: "4px 2px 4px 12px",
         }),
         multiValueRemove: (base) => ({
          ...base,
          color: "white",
          margin: "4px 5px 4px 0px",
          "&:hover": {
           backgroundColor: "#1c2329",
           color: "white",
          },
         }),
        }}
       />
      </div>

      <div className="h-[69.41px]">
       <div className="text-[#1b2229] mt-[15px] mb-[10px] text-xs font-medium">Status</div>
       <div className="h-[45.41px] px-[15px] py-2.5 bg-white rounded-[39px] flex self-stretch justify-between items-center">
        <div className="text-black/60 text-xs font-medium mt-[5px]">Active</div>
        <BottomArrow />
       </div>
      </div>

      <button className="w-full h-12 bg-[#10375c] rounded-[28px] text-white text-sm font-medium mt-[15px]">Save</button>
     </div>
    </div>

    <div className="w-full">
     {/* Right Side */}

     {/* Right top Side */}
     <div className="w-full p-[15px] bg-[#f2f2f4] rounded-[20px] flex flex-col mt-[10px] opacity-50">
      <div className="h-10 justify-between items-center inline-flex mb-[20px]">
       <div className="text-[#10375c] text-2xl font-semibold ">Courts</div>
       <div className="px-5 py-3 bg-[#1b2229] rounded-[28px] justify-center items-center gap-2.5 flex">
        <Add />
        <div className="text-white text-sm font-medium ">Add A New Court</div>
       </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4 ">
       {courts.map((court, index) => (
        <div key={index} className="p-[10px] bg-white rounded-[10px] flex flex-col justify-center items-center gap-2 overflow-hidden">
         <div className="w-full flex items-center gap-2.5">
          <Image className="w-[80px] h-[80px] rounded-[5px]" src={padelImage} alt="paddle image" />
          <div className="flex flex-col justify-center items-start gap-2.5">
           <div className="text-[#1b2229] text-m font-semibold">{court.name}</div>
           <div className="flex flex-col justify-center items-center gap-2">
            <div className="w-[46px] h-[22px] relative rounded-[86px] overflow-hidden">
             <div className="w-[46px] h-[22px] absolute bg-[#f2f2f4] rounded-[11px] border border-[#e6e6e6]" />
             <div className={`w-[18px] h-[18px] absolute rounded-[9px] shadow-[0px_4px_4px_0px_rgba(23,109,191,0.25)] ${court.status === "Active" ? "bg-[#10375c]" : "bg-[#10375c]"}`} />
            </div>
            <div className="text-right text-[#ff0004] text-[10px] font-medium">{court.status}</div>
           </div>
          </div>
         </div>
         <div className="w-full px-3 py-2 bg-[#1b2229] rounded-[26px] flex justify-center items-center">
          <div className="text-white text-[10px] font-normal">Edit</div>
         </div>
        </div>
       ))}
      </div>
     </div>

     {/* Right middle Side */}
     <div className="mt-[15px] bg-[#f2f2f4] rounded-[20px] p-[14px] max-h-[400px]  h-[277px] overflow-auto">
      <div className="flex justify-between">
       <div className="text-[#10375c] text-xl font-medium mb-[20px]">Employees Associated</div>
       <div className="h-7 px-3 py-2 bg-[#1b2229] rounded-[17px] justify-center items-center gap-2.5 inline-flex">
        <div className="text-white text-[10px] font-normal ">Add Employee</div>
       </div>
      </div>

      {employees.map((employee, index) => (
       <div key={employee.id}>
        <div className="h-6 flex justify-between items-center bg-local">
         <div className="h-[23px] justify-start items-center gap-[15px] flex">
          <Image className="w-[23px] h-[23px] rounded-full" src={AlexParker} alt="AlexParker" />
          <div className="w-[114px] text-[#1b2229] text-xs font-medium ">Alex Parker</div>
         </div>
         <div className="px-3.5 py-[5px] bg-[#fd5602]/10 rounded-[28px] justify-center items-center gap-2.5 flex">
          <div className="text-[#fd5602] text-xs font-medium ">Remove</div>
         </div>
        </div>

        <div className="h-[0px] border border-white my-[10px]"></div>

        <div className="h-6 flex justify-between items-center ">
         <div className="h-[23px] justify-start items-center gap-[15px] flex">
          <Image className="w-[23px] h-[23px] rounded-full" src={JordanLee} alt="JordanLee" />
          <div className=" w-[114px] text-[#1b2229] text-xs font-medium ">Jordan Lee</div>
         </div>
         <div className="px-3.5 py-[5px] bg-[#fd5602]/10 rounded-[28px] justify-center items-center gap-2.5 flex">
          <div className="text-[#fd5602] text-xs font-medium ">Remove</div>
         </div>
        </div>

        <div className="h-[0px] border border-white my-[10px]"></div>

        <div className="h-6 flex justify-between items-center ">
         <div className="h-[23px] justify-start items-center gap-[15px] flex">
          <Image className="w-[23px] h-[23px] rounded-full" src={chanceAndBrandon} alt="chanceAndBrandon" />
          <div className="w-[114px] text-[#1b2229] text-xs font-medium ">Tracy Martin</div>
         </div>
         <div className="px-3.5 py-[5px] bg-[#fd5602]/10 rounded-[28px] justify-center items-center gap-2.5 flex">
          <div className="text-[#fd5602] text-xs font-medium ">Remove</div>
         </div>
        </div>

        <div className="h-[0px] border border-white my-[10px]"></div>
       </div>
      ))}
     </div>

     {/* Right bottom Side */}
     <div className="mt-[15px] bg-[#f2f2f4] rounded-[20px] p-[14px] max-h-[400px] overflow-auto">
    


        <div className="flex justify-between mb-[20px] mt-[21px]">
      <div className="text-[#10375c] text-xl font-medium ">Matches</div>
       <SearchBar setQuery={setSearchParams} query={searchParams} />
     </div>

      <div className=" h-3.5 justify-between items-center flex text-[#7e7e8a] mb-[8px] text-xs font-medium">
       <div>Name of Team 1</div>
       <div>Name of Team 2</div>
       <div>Game</div>
       <div>Date</div>
       <div>Action</div>
      </div>
      <div className="mb-[8px] h-[0px] border border-[#d0d0d0]"></div>

      {matches.map((match, index) => (
       <div key={match.id} className={`w-full   min-w-[600px] cursor-pointer flex items-center h-[47px] px-3.5 py-3 rounded-[10px] ${selectedMatch?.id === match.id ? "bg-[#176dbf] text-white" : index % 2 === 0 ? "bg-white" : "bg-gray-200"}`} onClick={() => setSelectedMatch(match)}>
        <div className={` px-4 py-2 w-1/4 flex items-center gap-2 text-xs font-medium ${selectedMatch?.id === match.id ? "text-white" : "text-[#1b2229]"}`}>
         <Image src={AlexParker} alt="Avatar" className="rounded-full " width={25} height={25} />
         {match.team1}
        </div>
        <div className={`  px-4 py-2 w-1/4 flex items-center gap-2 text-xs font-medium ${selectedMatch?.id === match.id ? "text-white" : "text-[#1b2229]"}`}>
         <Image src={JordanLee} alt="Avatar" className="rounded-full" width={25} height={25} />
         {match.team2}
        </div>
        <div className={`  px-4 py-2 w-1/4 text-xs font-medium text-center ${selectedMatch?.id === match.id ? "text-white" : "text-[#1b2229]"}`}>{match.game}</div>
        <div className={`text-xs font-medium ${selectedMatch?.id === match.id ? "text-white" : "text-[#1b2229]"}`}>{match.date}</div>
        <div className=" px-4 py-2 w-1/6 text-xs font-medium flex justify-center">
         <EyeIcon stroke={selectedMatch?.id === match.id ? "#FFFF" : "#fd5602"} />
        </div>
       </div>
      ))}
     </div>
    </div>
   </div>
  </div>
 );
};

export default Page;
