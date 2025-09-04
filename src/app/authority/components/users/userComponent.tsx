"use client";
import { useState, useEffect, useRef, useMemo } from "react";
import Image from "next/image";
import Human from "@/assets/images/Human.png";
import { EyeIcon, DownArrowIcon, UpArrowIcon } from "@/utils/svgicons";
import UserProfile2 from "@/assets/images/images.png";
import SearchBar from "../SearchBar";
import TablePagination from "../TablePagination";
import { useRouter } from "next/navigation";
import useSWR from "swr";
import { getAllUser } from "@/services/admin-services";
import { getImageClientS3URL } from "@/config/axios";

const games = [
  { label: "Default", value: "createdAt" },
  { label: "Alphabetically", value: "fullName" },
  { label: "Newest", value: "createdAt" }
];

export default function UsersComponent() {
  const router = useRouter();
  const dropdownRef = useRef(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [searchParams, setSearchParams] = useState("");
  const [selectedGame, setSelectedGame] = useState(null);
  const [gameDropdown, setGameDropdown] = useState(false);
  const [page, setPage] = useState(1);
  const itemsPerPage = 10;

  // Fetch data with SWR
  const { data, isLoading, error } = useSWR(
    `/admin/get-users?search=${searchParams}&page=${page}&limit=${itemsPerPage}&order=asc&sortBy=${selectedGame || "createdAt"}`,
    getAllUser
  );
  console.log('data: ', data);
// ?search=${searchParams}&page=${page}&limit=${itemsPerPage}&sortBy=${selectedGame || ""}
  // Extract users and pagination metadata
  let users = useMemo(() => data?.data?.data || [], [data?.data?.data]);
  // let users:any[] = data?.data?.data
  const total = data?.data?.meta?.total || 59; // Fallback to 59 as per your confirmation
  const totalPages = data?.data?.meta?.totalPages || Math.ceil(total / itemsPerPage);
  const hasNextPage = data?.data?.meta?.hasNextPage ?? page < totalPages;
  const hasPreviousPage = data?.data?.meta?.hasPreviousPage ?? page > 1;

  // Handle 400 status error by setting users to empty array
  if (error && error.status === 400) {
    console.error("Error 400: No users found", error);
    users = [];
  }

  // Set the first user as selected when users data is loaded or page changes
  useEffect(() => {
    if (users.length > 0) {
      setSelectedUser(users[0]);
    } else {
      setSelectedUser(null); // Clear selected user when no users are found
    }
  }, [users]);

  // Handle click outside dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setGameDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      console.log("Changing to page:", newPage);
      setPage(newPage);
    }
  };

  const handleClick = () => {
    if (selectedUser) {
      router.push(`/authority/users/${selectedUser._id}`);
    }
  };

  // Handle other errors (non-400)
  if (error && error.status !== 400) {
    console.error("Error loading users:", error);
    return <p>Error loading users: {error.message}</p>;
  }

  return (
    <>
      <div className="h-fit flex w-full lg:w-2/3 justify-between mb-[15px]">
        <div className="text-[#10375c] text-3xl font-semibold">Users</div>
        <div className="relative lg:mr-[15px]" ref={dropdownRef}>
          <button
            className="flex h-10 px-5 py-3 bg-[#1b2229] text-white rounded-[28px]"
            onClick={() => setGameDropdown(!gameDropdown)}
          >
            {selectedGame === null ? "Sort" : games.find(game => game.value === selectedGame)?.label}
            <span className="ml-2">{!gameDropdown ? <DownArrowIcon /> : <UpArrowIcon />}</span>
          </button>
          {gameDropdown && (
            <div className="z-50 flex flex-col gap-[5px] absolute top-12 left-0 p-[20px] w-[168px] bg-white rounded-[10px] shadow-[0px_4px_20px_0px_rgba(92,138,255,0.10)]">
              {games?.map((game) => (
                <label
                  key={game.label}
                  className="flex gap-[10px] cursor-pointer text-[#1b2229] text-sm font-medium"
                >
                  <input
                    type="radio"
                    name="game"
                    value={game.value || ""}
                    checked={selectedGame === game.value}
                    onChange={() => {
                      setSelectedGame(game.value);
                      setGameDropdown(false);
                    }}
                    className="bg-[#1b2229]"
                  />
                  {game.label}
                </label>
              ))}
            </div>
          )}
        </div>
      </div>
      <div className="flex flex-col lg:flex-row w-full rounded-[20px] gap-6 mb-[40px]">
        {/* Left Panel: User List */}
        <div className={`w-full h-fit ${users.length === 0 ? 'lg:w-full' : 'lg:w-2/3'} bg-[#f2f2f4] shadow-md rounded-[20px] p-[14px] overflow-auto`}>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-[#10375c] text-xl font-semibold">Users</h2>
            <SearchBar setQuery={setSearchParams} query={searchParams} />
          </div>
          <div className="overflow-x-auto max-w-full overflo-custom h-fit">
            <div className="w-full min-w-[600px] rounded-[10px] bg-[#f2f2f4] flex text-sm font-semibold text-[#7e7e8a]">
              <div className="w-1/4 h-3.5 text-[#7e7e8a] text-xs font-medium">Name</div>
              <div className="w-[14%] h-3.5 text-[#7e7e8a] text-center text-xs font-medium">Level</div>
              <div className="w-[27%] h-3.5 text-[#7e7e8a] text-xs font-medium">Email</div>
              <div className="w-[20%] h-3.5 text-[#7e7e8a] text-xs text-end font-medium">Phone Number</div>
              <div className="w-[10%] h-3.5 text-[#7e7e8a] text-end text-xs font-medium">Action</div>
            </div>
            <div className="w-full h-[0px] border border-[#d0d0d0] border-dotted mt-[8px]"></div>
            <div className="w-full min-w-[600px]">
              {isLoading ? (
                <p>Loading...</p>
              ) : users.length === 0 ? (
                <p>No users found</p>
              ) : (
                users?.map((user, index) => (
                  <div
                    key={user._id}
                    className={`cursor-pointer flex items-center h-[47px] px-3.5 py-3 rounded-[10px] ${selectedUser?._id === user._id
                        ? "bg-[#176dbf] text-white"
                        : index % 2 === 0
                          ? "bg-white"
                          : "bg-gray-200"
                      }`}
                    onClick={() => setSelectedUser(user)}
                  >
                    <div
                      className={`w-1/4 flex items-center gap-2 break-words text-[#1b2229] text-xs font-medium ${selectedUser?._id === user._id ? "text-white" : "text-[#1b2229]"
                        }`}
                    >
                      <Image
                        src={user.profilePic ? getImageClientS3URL(user.profilePic) : UserProfile2}
                        alt="Avatar"
                        className="rounded-full w-[25px] h-[25px] object-cover"
                        width={25}
                        height={25}
                      />
                      {user.fullName || "N/A"}
                    </div>
                    <div
                      className={`w-[15%] text-[#1b2229] text-xs text-center font-medium ${selectedUser?._id === user._id ? "text-white" : "text-[#1b2229]"
                        }`}
                    >
                      {user.level || "0000"}
                    </div>
                    <div
                      className={`w-[35%] text-[#1b2229] break-words text-xs font-medium ${selectedUser?._id === user._id ? "text-white" : "text-[#1b2229]"
                        }`}
                    >
                      {user.email || "N/A"}
                    </div>
                    <div
                      className={`w-[20%] text-[#1b2229] text-center flex-wrap text-xs font-medium ${selectedUser?._id === user._id ? "text-white" : "text-[#1b2229]"
                        }`}
                    >
                      {user.phoneNumber || "N/A"}
                    </div>
                    <div className="w-[10%] text-[#1b2229] text-xs font-medium flex justify-center">
                      <EyeIcon stroke={selectedUser?._id === user._id ? "#FFFF" : "#fd5602"} />
                    </div>
                  </div>
                ))
              )}
            </div>
            {/* Pagination */}
            {users.length !== 0 && (
              <div className="mt-4 flex justify-end gap-2">
                <TablePagination
                  setPage={handlePageChange}
                  page={page}
                  totalData={total}
                  itemsPerPage={itemsPerPage}
                />
              </div>
            )}
          </div>
        </div>

        {/* Right Panel: User Details - Only show when users exist */}
        {users.length > 0 && (
          <div className="flex flex-col w-full lg:w-1/3 gap-[24px] h-full justify-between">
            <div className="bg-[#f2f2f4] shadow-md rounded-[20px] relative">
              {selectedUser ? (
                <div className="w-full bg-[#f2f2f4] rounded-[20px] min-h-full">
                  {/* Blue Header with Wave */}
                  <div className="relative w-full">
                    <svg
                      width="100%"
                      height="100%"
                      viewBox="0 0 471 165"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M0 20 Q0 0 20 0 H451 Q471 0 471 20 V155.046 C471 155.046 372.679 132.651 235.5 155.046 C98.3213 177.442 0 155.046 0 155.046 Z"
                        fill="#176dbf"
                      />
                    </svg>
                    <div className="absolute top-0 left-0 w-full h-full flex gap-[15px] items-center p-2 text-white">
                      <Image
                        src={selectedUser.profilePic !== null ? getImageClientS3URL(selectedUser.profilePic) : UserProfile2}
                        alt="User Avatar"
                        className="rounded-full border-2 border-white w-30 h-30 sm:w-30 sm:h-30 lg:w-16 lg:h-16"
                        width="100"
                        height="100"
                      />
                      <div>
                        <div className="text-white text:2xl md:text-3xl font-bold leading-10 tracking-wide">
                          {selectedUser.fullName || "N/A"}
                        </div>
                      </div>
                      <div className="h-10 px-5 py-3 bg-[#10375c] rounded-[28px] gap-[5px] inline-flex mb-[30px]">
                        <div className="text-white text-sm font-medium">₹0</div>
                      </div>
                    </div>
                  </div>

                  <div className="relative w-full pointer-events-none">
                    <Image
                      src={Human}
                      alt="Tennis Player Illustration"
                      className="object-contain max-w-full h-auto absolute right-1 top-[-30px] w-[250px] sm:top-[-130px] md:top-[-260px] lg:top-[-80px] z-10 sm:w-[300px] md:w-[380px] lg:w-[280px]"
                      width={300}
                      height={180}
                      sizes="(max-width: 640px) 200px, (max-width: 768px) 150px, (max-width: 1024px) 180px, 300px"
                      priority
                    />
                  </div>
                  {/* Content Section */}
                  <div className="flex flex-col w-full mt-[27px] gap-[30px] relative z-20">
                    {/* Personal Details */}
                    <div className="w-[55%] ml-[30px] flex-col justify-start items-start gap-3 inline-flex">
                      <div className="self-stretch text-[#1c2329] text-sm font-semibold leading-[16.80px]">
                        Personal Details
                      </div>
                      <div className="self-stretch justify-between items-center inline-flex">
                        <div className="flex-col justify-start items-start gap-2.5 inline-flex">
                          <div className="text-[#7e7e8a] text-xs font-medium capitalize leading-[15px]">
                            Phone Number
                          </div>
                          <div className="text-[#7e7e8a] text-xs font-medium capitalize leading-[15px]">
                            Email Address
                          </div>
                        </div>
                        <div className="flex-col justify-start items-end gap-2.5 inline-flex">
                          <div className="text-right text-[#1b2229] text-xs font-bold capitalize leading-[15px]">
                            {selectedUser.phoneNumber || "N/A"}
                          </div>
                          <div className="text-right text-[#1b2229] text-xs font-bold leading-[15px]">
                            {selectedUser.email || "N/A"}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Statistics */}
                    <div className="w-[45%] ml-[30px] flex-col justify-start items-start gap-3 inline-flex mb-[30px]">
                      <div className="self-stretch text-[#1c2329] text-sm font-semibold leading-[16.80px]">
                        Statistics
                      </div>
                      <div className="self-stretch justify-between items-center inline-flex">
                        <div className="flex-col justify-start items-start gap-2.5 inline-flex">
                          <div className="self-stretch text-[#7e7e8a] text-xs font-medium capitalize leading-[15px]">
                            Loyalty Points
                          </div>
                          <div className="self-stretch text-[#7e7e8a] text-xs font-medium capitalize leading-[15px]">
                            Level
                          </div>
                          <div className="text-[#7e7e8a] text-xs font-medium capitalize leading-[15px]">
                            Last Month Level
                          </div>
                          <div className="self-stretch text-[#7e7e8a] text-xs font-medium capitalize leading-[15px]">
                            Level This Month
                          </div>
                          <div className="text-[#7e7e8a] text-xs font-medium capitalize leading-[15px]">
                            Level 6 Months Ago
                          </div>
                          <div className="text-[#7e7e8a] text-xs font-medium capitalize leading-[15px]">
                            Level 12 Months Ago
                          </div>
                          <div className="self-stretch text-[#7e7e8a] text-xs font-medium capitalize leading-[15px]">
                            Improvement
                          </div>
                          <div className="self-stretch text-[#7e7e8a] text-xs font-medium capitalize leading-[15px]">
                            Confidence
                          </div>
                        </div>
                        <div className="flex-col justify-start items-end gap-2.5 inline-flex">
                          <div className="text-right text-[#1b2229] text-xs font-bold capitalize leading-[15px]">
                            {selectedUser.loyaltyPoints || "5800"}
                          </div>
                          <div className="text-right text-[#1b2229] text-xs font-bold capitalize leading-[15px]">
                            {selectedUser.level || "65456"}
                          </div>
                          <div className="text-right text-[#1b2229] text-xs font-bold capitalize leading-[15px]">
                            {selectedUser.lastMonthLevel || "-1"}
                          </div>
                          <div className="self-stretch text-right text-[#1b2229] text-xs font-bold capitalize leading-[15px]">
                            {selectedUser.levelThisMonth || "-1"}
                          </div>
                          <div className="text-right text-[#1b2229] text-xs font-bold capitalize leading-[15px]">
                            {selectedUser.level6MonthsAgo || "-1"}
                          </div>
                          <div className="text-right text-[#1b2229] text-xs font-bold capitalize leading-[15px]">
                            {selectedUser.level12MonthsAgo || "-1"}
                          </div>
                          <div className="self-stretch text-right text-[#1b2229] text-xs font-bold capitalize leading-[15px]">
                            {selectedUser.improvement || "-0.01"}
                          </div>
                          <div className="self-stretch text-right text-[#1b2229] text-xs font-bold capitalize leading-[15px]">
                            {selectedUser.confidence || "27%"}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <p className="text-center text-gray-500">Select a user to see details</p>
              )}
            </div>
            <button
              onClick={handleClick}
              disabled={!selectedUser}
              className={`h-12 py-4 rounded-[28px] justify-center items-center text-white text-sm font-medium ${selectedUser ? 'bg-[#10375c]' : 'bg-gray-400 cursor-not-allowed'}`}
            >
              View More Details
            </button>
          </div>
        )}
      </div>
    </>
  );
}


// "use client";
// import { useState, useEffect, useRef } from "react";
// import Image from "next/image";
// import Human from "@/assets/images/Human.png";
// import { EyeIcon, DownArrowIcon, UpArrowIcon } from "@/utils/svgicons";
// import UserProfile2 from "@/assets/images/images.png";
// import SearchBar from "../SearchBar";
// import TablePagination from "../TablePagination";
// import { useRouter } from "next/navigation";
// import useSWR from "swr";
// import { getAllUser } from "@/services/admin-services";
// import { getImageClientS3URL } from "@/config/axios";

// const games = [
//   { label: "Default", value: null },
//   { label: "Alphabetically", value: "fullName" },
//   { label: "Newest", value: "createdAt" }
// ];

// export default function UsersComponent() {
//   const router = useRouter();
//   const dropdownRef = useRef(null);
//   const [selectedUser, setSelectedUser] = useState(null);
//   const [searchParams, setSearchParams] = useState("");
//   const [selectedGame, setSelectedGame] = useState(null);
//   const [gameDropdown, setGameDropdown] = useState(false);
//   const [page, setPage] = useState(1);
//   const itemsPerPage = 10;

//   // Fetch data with SWR
//   const { data, isLoading, error } = useSWR(`/admin/get-users`, getAllUser,{
//     revalidateOnMount: true,
//     revalidateOnFocus: true, // refetch when tab/window refocuses
//     dedupingInterval: 0,      // disables deduping cache to always refetch
//     refreshInterval: 0,       // no polling
//   });
// //   const { data, isLoading, error, mutate } = useSWR(
// //   ['/admin/get-users', page, searchParams, selectedGame], // key to ensure uniqueness
// //   () => getAllUser({ page, searchParams, sortBy: selectedGame }),
// //   {
// //     revalidateOnMount: true,
// //     revalidateOnFocus: true, // refetch when tab/window refocuses
// //     dedupingInterval: 0,      // disables deduping cache to always refetch
// //     refreshInterval: 0,       // no polling
// //   }
// // );
//   const users = data?.data?.data || [];
//   const total = data?.data?.meta?.total || 59;
//   const totalPages = data?.data?.meta?.totalPages || Math.ceil(total / itemsPerPage);
//   const hasNextPage = data?.data?.meta?.hasNextPage ?? page < totalPages;
//   const hasPreviousPage = data?.data?.meta?.hasPreviousPage ?? page > 1;

//   if (error && error.status === 400) {
//     console.error("Error 400: No users found", error);
//   }

//   useEffect(() => {
//     const userList = data?.data?.data || [];
//     if (userList.length > 0) {
//       setSelectedUser(userList[0]);
//     } else {
//       setSelectedUser(null);
//     }
//   }, [data?.data?.data]);

//   useEffect(() => {
//     const handleClickOutside = (event: MouseEvent) => {
//       if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
//         setGameDropdown(false);
//       }
//     };

//     document.addEventListener('mousedown', handleClickOutside);
//     return () => {
//       document.removeEventListener('mousedown', handleClickOutside);
//     };
//   }, []);

//   const handlePageChange = (newPage: number) => {
//     if (newPage >= 1 && newPage <= totalPages) {
//       setPage(newPage);
//     }
//   };

//   const handleClick = () => {
//     if (selectedUser) {
//       router.push(`/authority/users/${selectedUser._id}`);
//     }
//   };

//   if (error && error.status !== 400) {
//     console.error("Error loading users:", error);
//     return <p>Error loading users: {error.message}</p>;
//   }

//   return (
//     <>
//       <div className="h-fit flex w-full lg:w-2/3 justify-between mb-[15px]">
//         <div className="text-[#10375c] text-3xl font-semibold">Users</div>
//         <div className="relative lg:mr-[15px]" ref={dropdownRef}>
//           <button
//             className="flex h-10 px-5 py-3 bg-[#1b2229] text-white rounded-[28px]"
//             onClick={() => setGameDropdown(!gameDropdown)}
//           >
//             {selectedGame === null ? "Sort" : games.find(game => game.value === selectedGame)?.label}
//             <span className="ml-2">{!gameDropdown ? <DownArrowIcon /> : <UpArrowIcon />}</span>
//           </button>
//           {gameDropdown && (
//             <div className="z-50 flex flex-col gap-[5px] absolute top-12 left-0 p-[20px] w-[168px] bg-white rounded-[10px] shadow-[0px_4px_20px_0px_rgba(92,138,255,0.10)]">
//               {games?.map((game) => (
//                 <label
//                   key={game.label}
//                   className="flex gap-[10px] cursor-pointer text-[#1b2229] text-sm font-medium"
//                 >
//                   <input
//                     type="radio"
//                     name="game"
//                     value={game.value || ""}
//                     checked={selectedGame === game.value}
//                     onChange={() => {
//                       setSelectedGame(game.value);
//                       setGameDropdown(false);
//                     }}
//                     className="bg-[#1b2229]"
//                   />
//                   {game.label}
//                 </label>
//               ))}
//             </div>
//           )}
//         </div>
//       </div>

//       <div className="flex flex-col lg:flex-row w-full rounded-[20px] gap-6 mb-[40px]">
//         {/* Left Panel */}
//         <div className={`w-full h-fit ${users.length === 0 ? 'lg:w-full' : 'lg:w-2/3'} bg-[#f2f2f4] shadow-md rounded-[20px] p-[14px] overflow-auto`}>
//           <div className="flex justify-between items-center mb-6">
//             <h2 className="text-[#10375c] text-xl font-semibold">Users</h2>
//             <SearchBar setQuery={setSearchParams} query={searchParams} />
//           </div>
//           <div className="overflow-x-auto max-w-full overflo-custom h-fit">
//             <div className="w-full min-w-[600px] rounded-[10px] bg-[#f2f2f4] flex text-sm font-semibold text-[#7e7e8a]">
//               <div className="w-1/4 h-3.5 text-xs font-medium">Name</div>
//               <div className="w-[14%] h-3.5 text-center text-xs font-medium">Level</div>
//               <div className="w-[27%] h-3.5 text-xs font-medium">Email</div>
//               <div className="w-[20%] h-3.5 text-end text-xs font-medium">Phone Number</div>
//               <div className="w-[10%] h-3.5 text-end text-xs font-medium">Action</div>
//             </div>
//             <div className="w-full h-[0px] border border-[#d0d0d0] border-dotted mt-[8px]"></div>
//             <div className="w-full min-w-[600px]">
//               {isLoading ? (
//                 <p>Loading...</p>
//               ) : users.length === 0 ? (
//                 <p>No users found</p>
//               ) : (
//                 users.map((user, index) => (
//                   <div
//                     key={user._id}
//                     className={`cursor-pointer flex items-center h-[47px] px-3.5 py-3 rounded-[10px] ${selectedUser?._id === user._id
//                         ? "bg-[#176dbf] text-white"
//                         : index % 2 === 0
//                           ? "bg-white"
//                           : "bg-gray-200"
//                       }`}
//                     onClick={() => setSelectedUser(user)}
//                   >
//                     <div className={`w-1/4 flex items-center gap-2 break-words text-xs font-medium ${selectedUser?._id === user._id ? "text-white" : "text-[#1b2229]"}`}>
//                       <Image
//                         src={user.profilePic ? getImageClientS3URL(user.profilePic) : UserProfile2}
//                         alt="Avatar"
//                         className="rounded-full w-[25px] h-[25px] object-cover"
//                         width={25}
//                         height={25}
//                       />
//                       {user.fullName || "N/A"}
//                     </div>
//                     <div className={`w-[15%] text-xs text-center font-medium ${selectedUser?._id === user._id ? "text-white" : "text-[#1b2229]"}`}>
//                       {user.level || "0000"}
//                     </div>
//                     <div className={`w-[35%] break-words text-xs font-medium ${selectedUser?._id === user._id ? "text-white" : "text-[#1b2229]"}`}>
//                       {user.email || "N/A"}
//                     </div>
//                     <div className={`w-[20%] text-center text-xs font-medium ${selectedUser?._id === user._id ? "text-white" : "text-[#1b2229]"}`}>
//                       {user.phoneNumber || "N/A"}
//                     </div>
//                     <div className="w-[10%] text-xs font-medium flex justify-center">
//                       <EyeIcon stroke={selectedUser?._id === user._id ? "#FFFF" : "#fd5602"} />
//                     </div>
//                   </div>
//                 ))
//               )}
//             </div>
//             {/* Pagination */}
//             {users.length !== 0 && (
//               <div className="mt-4 flex justify-end gap-2">
//                 <TablePagination
//                   setPage={handlePageChange}
//                   page={page}
//                   totalData={total}
//                   itemsPerPage={itemsPerPage}
//                 />
//               </div>
//             )}
//           </div>
//         </div>

//         {/* Right Panel */}
//         {users.length > 0 && (
//           <div className="flex flex-col w-full lg:w-1/3 gap-[24px] h-full justify-between">
//             {/* ... keep your user details card here (unchanged) ... */}
//             {/* For brevity, I’ve left that part unchanged since you didn’t ask for changes in that part */}
//             {/* Let me know if you want the full details section again */}
//             <button
//               onClick={handleClick}
//               disabled={!selectedUser}
//               className={`h-12 py-4 rounded-[28px] justify-center items-center text-white text-sm font-medium ${selectedUser ? 'bg-[#10375c]' : 'bg-gray-400 cursor-not-allowed'}`}
//             >
//               View More Details
//             </button>
//           </div>
//         )}
//       </div>
//     </>
//   );
// }
