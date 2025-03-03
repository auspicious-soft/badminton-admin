"use client";
import { useState } from "react";
import Image from "next/image";
import Human from "@/assets/images/Human.png";
import { EyeIcon, DownArrowIcon, UpArrowIcon } from "@/utils/svgicons";
import UserProfileImage from "@/assets/images/userProfile4.png";
import SearchBar from "../SearchBar";
import TablePagination from "../TablePagination";

// Sample user data
const users = [
 { id: 1, name: "Alex Parker", level: 6000, email: "james.smith@example.com", phone: "+1 555-234-5678" },
 { id: 2, name: "Jordan Lee", level: 3000, email: "sophia.brown@example.com", phone: "+1 555-678-5678" },
 { id: 3, name: "Tracy Martin", level: 6000, email: "mia.johnson@example.com", phone: "+1 555-894-5332" },
 { id: 4, name: "Isabella Anderson", level: 6000, email: "isabella.lee@example.com", phone: "+1 555-210-4569" },
 { id: 5, name: "Jacob Davis", level: 6000, email: "jacob.davis@example.com", phone: "+1 555-678-5678" },
 { id: 6, name: "Marley Martinez", level: 3000, email: "sophia.brown@example.com", phone: "+1 555-220-5678" },
 { id: 7, name: "Lucas Martinez", level: 6000, email: "lucas.martinez@example.com", phone: "+1 555-878-5678" },
 { id: 8, name: "Ava Martinez", level: 3000, email: "ava.martinez@example.com", phone: "+1 555-234-5678" },
 { id: 9, name: "Emily Jones", level: 3000, email: "emily.jones@example.com", phone: "+1 555-780-5678" },
 { id: 10, name: "Bob Johnson", level: 5000, email: "bob.johnson@example.com", phone: "+1 555-890-5432" },
];

// Sample detailed user data
const userDetails = {
 id: 4,
 name: "Isabella Anderson",
 email: "isabella.lee@example.com",
 phone: "+1 555-210-4569",
 city: "Chandigarh",
 loyaltyPoints: 6800,
 lastMonthLevel: 6549,
 levelThisMonth: -4,
 improvement12Months: -0.4,
 confidence: 27,
};

const games = ["Padel", "Pickleball"];

export default function UsesComponent({ name }: { name: string }) {
 const [selectedUser, setSelectedUser] = useState({ id: 1, name: "Alex Parker", level: 6000, email: "james.smith@example.com", phone: "+1 555-234-5678" });
 const [searchParams, setSearchParams] = useState("");
 const [selectedGame, setSelectedGame] = useState("");
 const [gameDropdown, setGameDropdown] = useState(false);
 const [page, setPage] = useState(1);
 const itemsPerPage = 10;

 const handlePageChange = (newPage: number) => {
  setPage(newPage);
  // setQuery(`page=${newPage}&limit=${itemsPerPage}`);
};
 // Filter users based on search
 const filteredUsers = users.filter((user) => user.name.toLowerCase().includes(searchParams.toLowerCase()));

 return (
  <>
   <div className="flex w-full lg:w-2/3 justify-between mb-[15px]">
    <div className="text-[#10375c] text-3xl font-semibold ">Users</div>
    <div className="relative lg:mr-[15px]">
     <button className="flex h-10 px-5 py-3 bg-[#1b2229] text-white rounded-[28px]" onClick={() => setGameDropdown(!gameDropdown)}>
      {selectedGame || "Sort"}
      <span className="ml-2">{!gameDropdown ? <DownArrowIcon /> : <UpArrowIcon />}</span>
     </button>
     {gameDropdown && (
      <div className="z-50 flex flex-col gap-[5px] absolute top-12 left-0 p-[20px] w-[168px] h-[81px] bg-white rounded-[10px] shadow-[0px_4px_20px_0px_rgba(92,138,255,0.10)]">
       {games.map((game) => (
        <label key={game} className="flex gap-[10px] cursor-pointer text-[#1b2229] text-sm font-medium">
         <input
          type="radio"
          name="game"
          value={game}
          checked={selectedGame === game}
          onChange={(e) => {
           setSelectedGame(e.target.value);
           setGameDropdown(false);
          }}
          className="bg-[#1b2229]"
         />
         {game}
        </label>
       ))}
      </div>
     )}
    </div>
   </div>
   <div className="flex flex-col lg:flex-row w-full  rounded-[20px] gap-6 mb-[40px]">
    {/* Left Panel: User List */}
    <div className="w-full lg:w-2/3 bg-[#f2f2f4] shadow-md rounded-[20px] p-[14px] overflow-auto">
     <div className="flex justify-between items-center mb-6">
      <h2 className="text-[#10375c] text-xl font-semibold">Users</h2>
      <SearchBar setQuery={setSearchParams} query={searchParams} />
     </div>
     <div className="overflow-x-auto max-w-full">
      <div className="w-full min-w-[600px] rounded-[10px] bg-[#f2f2f4] flex text-sm font-semibold text-[#7e7e8a]">
       <div className="w-1/4 h-3.5 text-[#7e7e8a] text-xs font-medium">Name</div>
       <div className="w-[14%] h-3.5 text-[#7e7e8a] text-center text-xs font-medium">Level</div>
       <div className="w-[27%] h-3.5 text-[#7e7e8a] text-xs font-medium">Email</div>
       <div className="w-[20%] h-3.5 text-[#7e7e8a] text-xs text-end font-medium">Phone Number</div>
       <div className="w-[10%] h-3.5 text-[#7e7e8a] text-end text-xs font-medium ">Action</div>
      </div>
      <div className="w-full h-[0px] border border-[#d0d0d0] border-dotted mt-[8px]"></div>
      <div className="w-full min-w-[600px]">
       {filteredUsers.map((user, index) => (
        <div key={user.id} className={`cursor-pointer flex items-center h-[47px] px-3.5 py-3 rounded-[10px] ${selectedUser?.id === user.id ? "bg-[#176dbf] text-white" : index % 2 === 0 ? "bg-white" : "bg-gray-200"}`} onClick={() => setSelectedUser(user)}>
         <div className={`w-1/4 flex items-center gap-2 break-words text-[#1b2229] text-xs font-medium ${selectedUser?.id === user.id ? "text-white" : "text-[#1b2229]"}`}>
          <Image src={UserProfileImage} alt="Avatar" className="rounded-full" width={25} height={25} />
          {user.name}
         </div>
         <div className={`w-[15%] text-[#1b2229] text-xs text-center font-medium ${selectedUser?.id === user.id ? "text-white" : "text-[#1b2229]"}`}>{user.level}</div>
         <div className={`w-[35%] text-[#1b2229] break-words text-xs font-medium ${selectedUser?.id === user.id ? "text-white" : "text-[#1b2229]"}`}>{user.email}</div>
         <div className={`w-[20%] text-[#1b2229] text-center flex-wrap text-xs font-medium ${selectedUser?.id === user.id ? "text-white" : "text-[#1b2229]"}`}>{user.phone}</div>
         <div className="w-[10%] text-[#1b2229] text-xs font-medium flex justify-center">
          <EyeIcon stroke={selectedUser?.id === user.id ? "#FFFF" : "#fd5602"} />
         </div>
        </div>
       ))}
      </div>
      {/* Pagination */}
    
      <div className="mt-4 flex justify-end gap-2">
       <TablePagination
          setPage={handlePageChange}
          page={page}
          totalData={users.length}
          itemsPerPage={itemsPerPage}
        />
     </div>
     </div>
    </div>

    {/* Right Panel: User Details */}

    <div className="w-full lg:w-1/3 bg-[#f2f2f4] shadow-md rounded-[20px] relative">
     {selectedUser ? (
      <div className="bg-[#f2f2f4] rounded-[20px] min-h-full">
       {/* Blue Header with Wave */}
       <div className="relative w-full">
        <svg width="100%" height="100%" viewBox="0 0 471 165" fill="none" xmlns="http://www.w3.org/2000/svg">
         <path d="M0 20 Q0 0 20 0 H451 Q471 0 471 20 V155.046 C471 155.046 372.679 132.651 235.5 155.046 C98.3213 177.442 0 155.046 0 155.046 Z" fill="#176dbf" />
        </svg>
        <div className="absolute top-0 left-0 w-full h-full flex gap-[15px] items-center p-2 text-white">
         <Image src={UserProfileImage} alt="User Avatar" className="rounded-full w-16 h-16" />
         <div>
          <div className="text-white text:xl md:text-3xl font-bold leading-10 tracking-wide">{userDetails.name}</div>
         </div>
         <div className="h-10 px-5 py-3 bg-[#10375c] rounded-[28px] justify-center items-center gap-[5px] inline-flex">
          <div className="text-white text-sm font-medium">₹2000</div>
         </div>
        </div>
       </div>

       <div className="relative w-full pointer-events-none">
        <Image
         src={Human}
         alt="Tennis Player Illustration"
         className="object-contain max-w-full h-auto absolute right-1 top-[-110px]  sm:top-[-130px] md:top-[-260px] lg:top-[-50px] z-10 w-[300px] sm:w-[300px] md:w-[380px] lg:w-[300px]"
         width={300} // Intrinsic width of the image
         height={200} // Intrinsic height of the image
         sizes="(max-width: 640px) 100px, (max-width: 768px) 150px, (max-width: 1024px) 200px, 300px"
         priority
        />
       </div>
       {/* Content Section */}
       <div className="flex flex-col w-full mt-[27px] gap-[30px] relative z-20">
        {/* Personal Details */}
        <div className="w-[55%] ml-[30px] flex-col justify-start items-start gap-3 inline-flex">
         <div className="self-stretch text-[#1c2329] text-sm font-semibold leading-[16.80px]">Personal Details</div>
         <div className="self-stretch justify-between items-center inline-flex">
          <div className="flex-col justify-start items-start gap-2.5 inline-flex">
           <div className="text-[#7e7e8a] text-xs font-medium capitalize leading-[15px]">Phone Number</div>
           <div className="text-[#7e7e8a] text-xs font-medium capitalize leading-[15px]">Email Address</div>
           <div className="text-[#7e7e8a] text-xs font-medium capitalize leading-[15px]">City</div>
          </div>
          <div className="flex-col justify-start items-end gap-2.5 inline-flex">
           <div className="text-right text-[#1b2229] text-xs font-bold capitalize leading-[15px]">+1 (555)458 5478</div>
           <div className="text-right text-[#1b2229] text-xs font-bold leading-[15px]">i.bella@mail.com</div>
           <div className="text-right text-[#1b2229] text-xs font-bold capitalize leading-[15px]">Chandigarh</div>
          </div>
         </div>
        </div>

        {/* Statistics */}
        <div className="w-[45%] ml-[30px] flex-col justify-start items-start gap-3 inline-flex mb-[30px]">
         <div className="self-stretch text-[#1c2329] text-sm font-semibold leading-[16.80px]">Statistics</div>
         <div className="self-stretch justify-between items-center inline-flex">
          <div className="flex-col justify-start items-start gap-2.5 inline-flex">
           <div className="self-stretch text-[#7e7e8a] text-xs font-medium capitalize leading-[15px]">Loyalty Points</div>
           <div className="self-stretch text-[#7e7e8a] text-xs font-medium capitalize leading-[15px]">level</div>
           <div className="text-[#7e7e8a] text-xs font-medium capitalize leading-[15px]">Last Month Level</div>
           <div className="self-stretch text-[#7e7e8a] text-xs font-medium capitalize leading-[15px]">level This Month</div>
           <div className="text-[#7e7e8a] text-xs font-medium capitalize leading-[15px]">level 6 Months Ago</div>
           <div className="text-[#7e7e8a] text-xs font-medium capitalize leading-[15px]">Level 12 months ago</div>
           <div className="self-stretch text-[#7e7e8a] text-xs font-medium capitalize leading-[15px]">Improvement</div>
           <div className="self-stretch text-[#7e7e8a] text-xs font-medium capitalize leading-[15px]">Confidence</div>
          </div>
          <div className="flex-col justify-start items-end gap-2.5 inline-flex">
           <div className="text-right text-[#1b2229] text-xs font-bold capitalize leading-[15px]">5800</div>
           <div className="text-right text-[#1b2229] text-xs font-bold capitalize leading-[15px]">65456</div>
           <div className="text-right text-[#1b2229] text-xs font-bold capitalize leading-[15px]">-1</div>
           <div className="self-stretch text-right text-[#1b2229] text-xs font-bold capitalize leading-[15px]">-1</div>
           <div className="text-right text-[#1b2229] text-xs font-bold capitalize leading-[15px]">-1</div>
           <div className="text-right text-[#1b2229] text-xs font-bold capitalize leading-[15px]">-1</div>
           <div className="self-stretch text-right text-[#1b2229] text-xs font-bold capitalize leading-[15px]">-0.01</div>
           <div className="self-stretch text-right text-[#1b2229] text-xs font-bold capitalize leading-[15px]">27%</div>
          </div>
         </div>
        </div>
       </div>
      </div>
     ) : (
      <p className="text-center text-gray-500">Select a user to see details</p>
     )}
    </div>
   </div>
  </>
 );
}
