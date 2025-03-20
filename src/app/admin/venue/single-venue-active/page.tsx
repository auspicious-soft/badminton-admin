"use client";
import React, { useState } from "react";
import Image from "next/image";
import { BottomArrow, Edit, UpArrowIcon, EyeIcon, Add } from "@/utils/svgicons";
import MatchImage from "@/assets/images/padelImage.png";
import AlexParker from "@/assets/images/AlexParker.png";
import JordanLee from "@/assets/images/JordanLee.png";
import padelImage from "@/assets/images/padelImage.png";
import chanceAndBrandon from "@/assets/images/chanceAndBrandon.png";
import Court from "@/assets/images/courtsmallImg.png";
import Select, { MultiValue } from "react-select";
import { useRouter } from "next/navigation";
import UserProfile2 from "@/assets/images/UserProfile2.png";
import dynamic from 'next/dynamic';
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

interface CourtType {
 id: number;
 name: string;
}

interface MatchType {
 id: number;
 team1: string;
 team2: string;
 game: string;
 date: string;
}
const courts: CourtType[] = [
 { id: 1, name: "Court No 1" },
 { id: 2, name: "Court No 2" },
 { id: 3, name: "Court No 3" },
 { id: 4, name: "Court No 4" },
];

interface EmployeeType {
 id: number;
 team1: string;
}
// const Select = dynamic(() => import('react-select'), { ssr: false });
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

 const [activeCourts, setActiveCourts] = useState<{ [key: number]: boolean }>(courts.reduce((acc, court) => ({ ...acc, [court.id]: false }), {}));

 const [selectedMatch, setSelectedMatch] = useState<MatchType>({
  id: 1,
  team1: "Alex Parker",
  team2: "Alex Parker",
  game: "Padel",
  date: "22-01-2024",
 });

 const option = [
  { id: 1, label: "Free Parking" },
  { id: 2, label: "Paid Parking" },
  { id: 3, label: "Rental Equipments" },
  { id: 4, label: "Locker rooms & changing areas" },
  { id: 5, label: "Restrooms & showers" },
 ];

 const [searchParams, setSearchParams] = useState("");
 const [selectedStatus, setSelectedStatus] = useState("");
 const [statusDropdown, setStatusDropdown] = useState(false);
 const [modalOpen, setModalOpen] = useState(false);
  const [selected, setSelected] = useState<number[]>([]);
 

 const toggleSelection = (id: number) => {
  setSelected((prev) => (prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]));
 };

  const [employeeModalOpen, setEmployeeModalOpen] = useState(false);
  const [isActive, setIsActive] = useState(false);

 const router = useRouter();

 const handleToggle = (id: number) => {
  setActiveCourts((prevState) => ({
   ...prevState,
   [id]: !prevState[id],
  }));
 };

 const handleRecipientsChange = (selectedOptions: MultiValue<OptionType>) => {
  const recipients = selectedOptions.map((option) => option.value);
  setFormData((prev) => ({
   ...prev,
   recipients: recipients,
  }));
 };

 const statuses = ["Active", "In-Active"];

 const matches: MatchType[] = [
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

 const employees: EmployeeType[] = [
  { id: 1, team1: "Alex Parker" },
  { id: 2, team1: "Jordan Lee" },
  { id: 3, team1: "Tracy Martin" },
  { id: 4, team1: "Alex Parker" },
  { id: 5, team1: "Jordan Lee" },
  { id: 7, team1: "Alex" },
 ];

 return (
  <div className="w-full">
   <div className="flex justify-between">
    <div className="text-[#10375c] text-3xl font-semibold">Barnton Park LTC</div>
    <div className="px-5 py-3 bg-[#1b2229] rounded-[28px] justify-center items-center gap-2.5 flex">
     <Add />
     <button className="text-white text-sm font-medium ">Add A New Venue</button>
    </div>
   </div>

   <div className="w-full flex gap-[15px] mt-[15px] md:flex-row flex-col ">

{/* left side  */}

    <div className="w-full md:w-[45%] h-fit flex gap-[15px] mt-[15px]">
     <div className="w-full bg-[#f2f2f4] rounded-[20px] px-[15px] py-[14px]">
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

      <div className="relative mt-[15px]">
       <label className="text-xs font-medium text-[#1b2229] block mb-2">Status</label>
       <button className="w-full p-3 border border-[#e6e6e6] rounded-full bg-white flex justify-between items-center text-xs" onClick={() => setStatusDropdown(!statusDropdown)}>
        {selectedStatus || "Select Status"}
        <span>{statusDropdown ? <UpArrowIcon /> : <BottomArrow />}</span>
       </button>
       {statusDropdown && (
        <div className="absolute top-full left-0 w-full mt-2 bg-white rounded-xl shadow-lg p-4 z-50">
         {statuses.map((status) => (
          <label key={status} className="flex gap-2 cursor-pointer text-xs py-1">
           <input
            type="radio"
            name="status"
            value={status}
            checked={selectedStatus === status}
            onChange={(e) => {
             setSelectedStatus(e.target.value);
             setStatusDropdown(false);
            }}
            className="accent-[#1b2229]"
           />
           {status}
          </label>
         ))}
        </div>
       )}
      </div>

      <button className="w-full h-12 bg-[#10375c] rounded-[28px] text-white text-sm font-medium mt-[15px]">Save</button>
     </div>
    </div>

{/* right side  */}
    <div className="w-full">
{/* right top side  */}

     <div className="relative mt-[15px]">
      {selectedStatus === "Active" ? (
       <div className="bg-[#f2f2f4] rounded-2xl p-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
         <h3 className="text-2xl font-semibold text-[#10375c] mb-4 sm:mb-0">Courts</h3>
         <button onClick={() => setModalOpen(true)} className="flex items-center gap-2 px-5 py-2 bg-[#1b2229] rounded-full text-white text-sm">
          <Add /> Add A New Court
         </button>
        </div>

{/* active  */}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
         {courts.map((court) => (
          <div key={court.id} className="bg-white p-3 rounded-xl space-y-3">
           <div className="flex gap-3">
            <Image src={Court} alt="court" width={80} height={80} className="object-cover rounded" />
            <div className="flex-1">
             <h4 className="text-lg font-semibold text-[#1b2229]">{court.name}</h4>
             <div className="mt-2">
              <label className="flex items-center cursor-pointer">
               <input type="checkbox" checked={activeCourts[court.id]} onChange={() => handleToggle(court.id)} className="hidden" />
               <span className={`w-10 h-5 ${activeCourts[court.id] ? "bg-[#1b2229]" : "bg-[#ccc]"} rounded-full relative transition-colors duration-300`}>
                <span className={`w-4 h-4 bg-white rounded-full absolute top-0.5 ${activeCourts[court.id] ? "left-5" : "left-0.5"} transition-transform duration-300`}></span>
               </span>
              </label>
              <p className={`text-[10px] font-medium mt-1 ${activeCourts[court.id] ? "text-[#1b2229]" : "text-[#ff0004]"}`}>{activeCourts[court.id] ? "Active" : "Inactive"}</p>
             </div>
            </div>
           </div>
           <button className="w-full py-2 bg-[#1C2329] text-white text-[10px] rounded-full">Edit</button>
          </div>
         ))}
        </div>
       </div>
      ) : (
       <div className=" w-full p-[15px] bg-[#f2f2f4] rounded-[20px] flex flex-col mt-[10px] ">
        <div className="h-10 justify-between items-center inline-flex mb-[20px]">
         <div className="text-[#10375c] text-2xl font-semibold">Courts</div>
         <div className="px-5 py-3 bg-[#1b2229] rounded-[28px] justify-center items-center gap-2.5 flex">
          <Add />
          <div className="text-white text-sm font-medium">Add A New Court</div>
         </div>
        </div>


{/* inactive  */}

       
        <div className=" grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 opacity-50 pointer-events-none">
         {courts.map((court) => (
          <div key={court.id} className="bg-white p-3 rounded-xl space-y-3">
           <div className="flex gap-3">
            <Image src={Court} alt="court" width={80} height={80} className="object-cover rounded" />
            <div className="flex-1">
             <h4 className="text-lg font-semibold text-[#1b2229]">{court.name}</h4>
             <div className="mt-2">
              <label className="flex items-center cursor-pointer">
               <input type="checkbox" checked={activeCourts[court.id]} onChange={() => handleToggle(court.id)} className="hidden" />
               <span className={`w-10 h-5 ${activeCourts[court.id] ? "bg-[#1b2229]" : "bg-[#ccc]"} rounded-full relative transition-colors duration-300`}>
                <span className={`w-4 h-4 bg-white rounded-full absolute top-0.5 ${activeCourts[court.id] ? "left-5" : "left-0.5"} transition-transform duration-300`}></span>
               </span>
              </label>
              <p className={`text-[10px] font-medium mt-1 ${activeCourts[court.id] ? "text-[#1b2229]" : "text-[#ff0004]"}`}>{activeCourts[court.id] ? "Active" : "Inactive"}</p>
             </div>
            </div>
           </div>
           <button className="w-full py-2 bg-[#1C2329] text-white text-[10px] rounded-full">Edit</button>
          </div>
         ))}
        </div>


<div className="flex gap-[13px] mt-[15px]">
{/* select facilities  */}
      <div className="w-[50%] grid grid-cols-1  gap-4">
      <div className=" bg-white rounded-2xl p-4">
       <h3 className="text-xl font-medium text-[#172554] mb-4">Select Facilities</h3>
       <div className="space-y-2 max-h-48 overflow-y-auto">
        {[{ id: 6, label: "Wi-Fi" }, { id: 7, label: "Security" }, ...option].map((opt) => (
         <div key={opt.id} className="flex justify-between items-center py-1 cursor-pointer" onClick={() => toggleSelection(opt.id)}>
          
          <span className="text-xs font-medium text-[#1b2229]">{opt.label}</span>
          <Image src={selected.includes(opt.id) ? "/orange.svg" : "/gray.svg"} alt="status" width={16} height={16} />
          
         </div>

        ))}
       </div>
       {/* <div className="h-[1px] w-full border border-[#f2f2f4]" /> */}

      </div>
      </div>

{/* Employees */}
      <div className=" w-[50%] bg-white rounded-2xl p-4">
       <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
        <h3 className="text-xl font-medium text-[#10375c] mb-4 sm:mb-0">Employees Associated</h3>
        <button onClick={() => setEmployeeModalOpen(true)} className="flex items-center gap-2 px-3 py-1 bg-[#1b2229] rounded-full text-white text-[10px]">
         Add Employee
        </button>
       </div>

<div className="space-y-2 max-h-48 overflow-y-auto">
  {[1, 2].map((i) => (
    <div key={i}>
      <div className="flex justify-between items-center py-1">
        <div className="flex items-center gap-3">
          <Image
            src={UserProfile2}
            alt="employee"
            width={23}
            height={23}
            className="rounded-full"
          />
          <span className="text-xs font-medium text-[#1b2229]">
            Alex Parker
          </span>
        </div>

        <button className="px-3 py-1 bg-[#fd5602]/10 rounded-full text-[#fd5602] text-xs">
          Remove
        </button>
      </div>
      <div className="h-[1px] w-full border border-[#f2f2f4]"></div>
    </div>

  ))}
</div>
</div>


</div>

</div>    



  )}
  </div>


{/* right middle side  */}

     <div className="mt-[15px] bg-[#f2f2f4] rounded-[20px] p-[14px] max-h-[400px] h-[277px] overflow-auto">
      <div className="flex justify-between">
       <div className="text-[#10375c] text-xl font-medium mb-[20px]">Employees Associated</div>
       <div className="h-7 px-3 py-2 bg-[#1b2229] rounded-[17px] justify-center items-center gap-2.5 inline-flex">
        <div className="text-white text-[10px] font-normal ">Add Employee</div>
       </div>
      </div>

      {employees.map((employee) => (
       <React.Fragment key={employee.id}>
        <div className="h-6 flex justify-between items-center">
         <div className="h-[23px] justify-start items-center gap-[15px] flex">
          <Image className="w-[23px] h-[23px] rounded-full" src={employee.team1 === "Alex Parker" ? AlexParker : employee.team1 === "Jordan Lee" ? JordanLee : chanceAndBrandon} alt={employee.team1} />
          <div className="w-[114px] text-[#1b2229] text-xs font-medium ">{employee.team1}</div>
         </div>
         <div className="px-3.5 py-[5px] bg-[#fd5602]/10 rounded-[28px] justify-center items-center gap-2.5 flex">
          <div className="text-[#fd5602] text-xs font-medium ">Remove</div>
         </div>
        </div>
        <div className="h-[0px] border border-white my-[10px]"></div>
       </React.Fragment>
      ))}
     </div>

{/* right bottom side  */}

     <div className="mt-[15px] bg-[#f2f2f4] rounded-[20px] p-[14px] max-h-[400px] overflow-auto">
      <div className="flex justify-between mb-[20px] mt-[21px]">
       <div className="text-[#10375c] text-xl font-medium">Matches</div>
       <SearchBar setQuery={setSearchParams} query={searchParams} />
      </div>

      <div className="h-3.5 justify-between items-center flex text-[#7e7e8a] mb-[8px] text-xs font-medium">
       <div>Name of Team 1</div>
       <div>Name of Team 2</div>
       <div>Game</div>
       <div>Date</div>
       <div>Action</div>
      </div>
      <div className="mb-[8px] h-[0px] border border-[#d0d0d0]"></div>

      {/* Match List */}
      {matches.map((match, index) => (
       <div
        key={match.id}
        className={`w-full min-w-[600px] cursor-pointer flex items-center h-[47px] px-3.5 py-3 rounded-[10px] 
            ${selectedMatch?.id === match.id ? "bg-[#176dbf] text-white" : index % 2 === 0 ? "bg-white" : "bg-gray-200"}`}
        onClick={() => setSelectedMatch(match)}
       >
        {/* Team 1 */}
        <div className={`px-4 py-2 w-1/4 flex items-center gap-2 text-xs font-medium ${selectedMatch?.id === match.id ? "text-white" : "text-[#1b2229]"}`}>
         <Image src={AlexParker} alt="Avatar" className="rounded-full" width={25} height={25} />
         {match.team1}
        </div>

        {/* Team 2 */}
        <div className={`px-4 py-2 w-1/4 flex items-center gap-2 text-xs font-medium ${selectedMatch?.id === match.id ? "text-white" : "text-[#1b2229]"}`}>
         <Image src={JordanLee} alt="Avatar" className="rounded-full" width={25} height={25} />
         {match.team2}
        </div>

        {/* Game */}
        <div className={`px-4 py-2 w-1/4 text-xs font-medium text-center ${selectedMatch?.id === match.id ? "text-white" : "text-[#1b2229]"}`}>{match.game}</div>

        {/* Date */}
        <div className={`text-xs font-medium ${selectedMatch?.id === match.id ? "text-white" : "text-[#1b2229]"}`}>{match.date}</div>

        {/* Action (Eye Icon aligned to the end) */}
        <div className="px-4 py-2 w-1/6 text-xs font-medium flex justify-end">
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



