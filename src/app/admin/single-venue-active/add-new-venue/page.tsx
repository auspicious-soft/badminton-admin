"use client";
import React, { useState } from "react";
import Image from "next/image";
import { BottomArrow, Edit, Pluss, Search } from "@/utils/svgicons";
import MatchImage from "@/assets/images/padelImage.png";
import padelImage from "@/assets/images/padelImage.png";
import Select, { MultiValue } from "react-select";
import { Add } from "@/utils/svgicons";
// import SearchBar from "../../components/SearchBar";
import { useRouter } from "next/navigation";

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
  const router = useRouter();

 const handleRecipientsChange = (selectedOptions: MultiValue<OptionType>) => {
  const recipients = selectedOptions.map((option) => option.value);
  setFormData((prev) => ({
   ...prev,
   recipients: recipients,
  }));
 };

 const courts = [
  { id: 1, name: "Court No 1", status: "Inactive" },
 ];



 return (
  <div className="w-full">
    <div className="flex justify-between">
   <div className="text-[#10375c] text-3xl font-semibold">Barnton Park LTC</div>
    </div>


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
     <div className=" w-full p-[15px] bg-[#f2f2f4] rounded-[20px] flex flex-col mt-[10px]">
      <div className="h-10 justify-between items-center inline-flex mb-[20px]">
       <div className="text-[#10375c] text-2xl font-semibold ">Courts</div>
       <div className="px-5 py-3 bg-[#1b2229] rounded-[28px] justify-center items-center gap-2.5 flex">
        <Add />
        <button className="text-white text-sm font-medium ">Add A New Court</button>
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


     {/* Right bottom Side */}

    <div className="w-full mt-4 sm:mt-[15px] h-auto sm:h-[277px] p-4 sm:p-[15px] bg-[#f2f2f4] rounded-[20px] flex flex-col gap-2.5">
  <div className="flex w-full justify-between items-center">
    <div className="text-[#10375c] text-lg sm:text-xl font-medium">Employees Associated</div>
  
    <div className="px-4 py-2 bg-[#1b2229] rounded-[17px] flex justify-center items-center cursor-pointer ">
    <div className="text-white text-xs sm:text-[10px] font-normal">Add Employee</div>
    </div>
  </div>
</div>


    


    </div>
   </div>
  </div>
 );
};

export default Page;

