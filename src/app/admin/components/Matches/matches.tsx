// "use client";
// import { useState } from "react";
// import Image from "next/image";
// import MatchImage from "@/assets/images/padelImage.png";
// import UserProfile from "@/assets/images/userprofile.png";
// import UserProfile2 from "@/assets/images/UserProfile2.png";
// import UserProfile3 from "@/assets/images/userProfile3.png";
// import UserProfile4 from "@/assets/images/userProfile4.png";
// import { EyeIcon, ClockIcon, CalenderIcon } from "@/utils/svgicons";
// import SearchBar from "../SearchBar";
// import TablePagination from "../TablePagination";
// import useSWR from "swr";
// import { getAllMatches } from "@/services/admin-services";

// const matches = [
//   { id: 1, team1: "Alex Parker", team2: "Alex Parker", game: "Padel", date: "22-01-2024" },
//   { id: 2, team1: "Jordan Lee", team2: "Jordan Lee", game: "Pickleball", date: "22-01-2024" },
//   { id: 3, team1: "Tracy Martin", team2: "Tracy Martin", game: "Padel", date: "22-01-2024" },
//   { id: 4, team1: "Marley Martinez", team2: "Marley Martinez", game: "Pickleball", date: "22-01-2024" },
//   { id: 5, team1: "Alex Parker", team2: "Alex Parker", game: "Padel", date: "22-01-2024" },
//   { id: 6, team1: "Jordan Lee", team2: "Jordan Lee", game: "Pickleball", date: "22-01-2024" },
//   { id: 7, team1: "Tracy Martin", team2: "Tracy Martin", game: "Padel", date: "22-01-2024" },
//   { id: 8, team1: "Marley Martinez", team2: "Marley Martinez", game: "Pickleball", date: "22-01-2024" },
//   { id: 9, team1: "Alex Parker", team2: "Alex Parker", game: "Padel", date: "22-01-2024" },
//   { id: 10, team1: "Jordan Lee", team2: "Jordan Lee", game: "Pickleball", date: "22-01-2024" },
//   { id: 11, team1: "Tracy Martin", team2: "Tracy Martin", game: "Padel", date: "22-01-2024" },
//   { id: 12, team1: "Marley Martinez", team2: "Marley Martinez", game: "Pickleball", date: "22-01-2024" },
// ];

// export default function MatchesComponent({ name }: { name: string }) {
//   const [selectedMatch, setSelectedMatch] = useState({ id: 1, team1: "Alex Parker", team2: "Alex Parker", game: "Padel", date: "22-01-2024" });
//   const [searchParams, setSearchParams] = useState("");
//   const [page, setPage] = useState(1);
  
//   const itemsPerPage = 10;
//   const {data, mutate, isLoading} = useSWR(
//     `/admin/get-matches?page=1&limit=10&search&type=completed&game=all&date=`,
//     getAllMatches
//   );                                                                               
//   console.log('data: ', data.data);
//  const matchData = data?.data?.data || [];
//  console.log('matchData: ', matchData);
//   const handlePageChange = (newPage: number) => {
//     setPage(newPage);
//     // setQuery(`page=${newPage}&limit=${itemsPerPage}`);
//   };
//   return (
//     <div className=" h-full flex flex-col lg:flex-row w-full  bg-[#fbfaff] rounded-[20px]  gap-6">
  
//         <div className="w-full lg:w-2/3 bg-[#f2f2f4] shadow-md rounded-[20px] p-[14px] overflow-auto overflo-custom">
//           <div className="flex justify-between items-center mb-6">
//             <h2 className="text-[#10375c] text-xl font-semibold">{name}</h2>
//             <SearchBar setQuery={setSearchParams} query={searchParams} />
//           </div>
//           <div className="overflow-x-auto overflo-custom max-w-full">
//             <div className="w-full min-w-[600px] rounded-[10px] bg-[#f2f2f4] flex text-sm font-semibold text-[#7e7e8a]">
//               <div className="w-[30%] h-3.5 text-[#7e7e8a] text-start text-xs font-medium">Team 1</div>
//               <div className="w-[30%] h-3.5 text-[#7e7e8a] text-start text-xs font-medium">Team 2</div>
//               <div className="w-[15%] h-3.5 text-[#7e7e8a] text-xs font-medium">Game</div>
//               <div className="w-[18%] h-3.5 text-[#7e7e8a] text-xs text-center font-medium">Date</div>
//               <div className="w-[10%] h-3.5 text-[#7e7e8a] text-start text-xs font-medium ">Action</div>
//             </div>
//             <div className="w-full h-[0px] border border-[#d0d0d0] border-dotted mt-[8px]"></div>
//             <div className="w-full min-w-[600px]">
//               {matches.map((match, index) => (
//                 <div key={match.id} className={`cursor-pointer flex items-center h-[47px] px-3.5 py-3 rounded-[10px] ${selectedMatch?.id === match.id ? "bg-[#176dbf] text-white" : index % 2 === 0 ?  "bg-[#f2f2f4]":"bg-white"}`} onClick={() => setSelectedMatch(match)}>
//                   <div className={`w-[30%] flex items-center gap-2 break-words text-[#1b2229] text-xs font-medium ${selectedMatch?.id === match.id ? "text-white" : "text-[#1b2229]"}`}>
//                     <Image src={UserProfile} alt="Avatar" className="rounded-full" width={25} height={25} />
//                     {match.team1}
//                   </div>
//                   <div className={`w-[30%] flex items-center gap-2 break-words text-[#1b2229] text-xs font-medium ${selectedMatch?.id === match.id ? "text-white" : "text-[#1b2229]"}`}>
//                     <Image src={UserProfile} alt="Avatar" className="rounded-full" width={25} height={25} />
//                     {match.team1}
//                   </div>                  
//                   <div className={`w-[15%] text-[#1b2229] text-xs text-start font-medium ${selectedMatch?.id === match.id ? "text-white" : "text-[#1b2229]"}`}>{match.game}</div>
//                   <div className={`w-[18%] text-[#1b2229] text-center break-words text-xs font-medium ${selectedMatch?.id === match.id ? "text-white" : "text-[#1b2229]"}`}>{match.date}</div>
//                   <div className="w-[10%] text-[#1b2229] text-xs font-medium flex justify-center">
//                     <EyeIcon stroke={selectedMatch?.id === match.id ? "#FFFF" : "#fd5602"} />
//                   </div>
//                 </div>
//               ))}
//             </div>

//             {/* Pagination */}
//             <div className="mt-4 flex justify-end gap-2">
//               <TablePagination
//                 setPage={handlePageChange}
//                 page={page}
//                 totalData={matches.length}
//                 itemsPerPage={itemsPerPage}
//               />
//             </div>
//           </div>
//         </div>
       
//       <div className="w-full lg:w-1/3 h-fit bg-[#f2f2f4] shadow-md rounded-[20px] px-[15px] pt-[14px] pb-[19px]">
//         {selectedMatch ? (
//           <div className="bg-[#f2f2f4] rounded-[20px]">
//             <Image src={MatchImage} alt="Match" className="w-full h-40 rounded-md object-cover" />
//             <h3 className="text-xl font-bold mt-4 flex justify-between mb-[8px]">
//               {selectedMatch?.game} Game <span className="text-right text-[#1b2229] text-sm font-semibold  leading-[16.80px]">120 Mins</span>
//             </h3>
//             <div className="flex justify-between">

//             <p className="text-[#1b2229] text-sm font-medium  leading-[16.80px] flex items-center gap-2">Sector 24, Chandigarh </p>
//              <div className="flex  gap-[20px] ">
//               <div className="flex gap-[10px] text-[#5f6a7c] text-xs font-medium  leading-[14.40px]"> <CalenderIcon/> 17 Sept 2024 </div>
//               <div className="flex gap-[10px] text-[#5f6a7c] text-xs font-medium  leading-[14.40px]"><ClockIcon/> 09:00 AM
//               </div>
//             </div>
//             </div>
            
//             <div className=" flex justify-between items-center mt-4">
//               <h4 className="text-[#1b2229] text-sm font-semibold  leading-[16.80px]">Created By</h4>
//               <div className="flex items-center gap-2">
//                 <Image src={UserProfile2} alt="Avatar" className="rounded-full" width={25} height={25} />
//                 <p className="text-right text-[#1b2229] text-xs font-medium">Alex Parker</p>
//               </div>
//             </div>
//             <div className="mt-2 grid grid-cols-2 gap-[10px]">
//               <p className="text-[#1b2229] text-sm font-semibold  leading-[16.80px]">Players</p>
//               <p className="text-right text-[#1b2229] text-xs font-medium  ">3</p>
//               <p className="text-[#1b2229] text-sm font-semibold  leading-[16.80px]">Equipment Rented</p>
//               <p className="text-right text-[#1b2229] text-xs font-medium ">None</p>
//               <p className="text-[#1b2229] text-sm font-semibold  leading-[16.80px]">Paid for</p>
//               <p className="text-right text-[#1b2229] text-xs font-medium ">Himself only</p>
//             </div>

//             <div className="bg-[#f2f2f4] rounded-[20px] mt-[15px] ">
//               {/* <div className=""> */}
//                 <div className="flex flex-col items-center mt-[15px] bg-white px-[17px] py-[20px] gap-[20px] rounded-lg">
//                 <h4 className="text-center text-[#1b2229] text-sm font-semibold  leading-[16.80px]">Players in the Game</h4>
//                 <div className="flex items-center gap-[15px]">
//                   <div className="flex flex-col items-center">
//                     <Image src={UserProfile3} alt="Player" height={100} width={100} className="rounded-full w-16" />
//                     <p className="text-xs">Wren Lee</p>
//                   </div>
//                   <div className="flex flex-col items-center">
//                     <Image src={UserProfile4} alt="Player" height={100} width={100} className="rounded-full w-16" />
//                     <p className="text-xs">Wren Lee</p>
//                   </div>
//                   <p className="text-sm font-bold">VS</p>
//                   <div className="flex flex-col items-center">
//                     <Image src={UserProfile3} alt="Player" height={100} width={100} className="rounded-full w-16" />
//                     <p className="text-xs">Taylor Davis</p>
//                   </div>
//                   <div className="flex flex-col items-center">
//                     <Image src={UserProfile4} alt="Player" height={100} width={100} className="rounded-full w-16" />
//                     <p className="text-xs">Taylor Davis</p>
//                   </div>
//                 </div>
//                   </div>
//               {/* </div> */}
//             </div>
//             <button className="w-full  bg-[#10375C] text-white p-3 rounded-[28px] mt-[20%]">Edit Game</button>
//           </div>
//         ) : (
//           <p className="text-center text-gray-500">Select a match to see details</p>
//         )}
//       </div>
//     </div>
//   );
// }








"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import MatchImage from "@/assets/images/padelImage.png";
import UserProfile from "@/assets/images/userprofile.png";
import UserProfile2 from "@/assets/images/UserProfile2.png";
import UserProfile3 from "@/assets/images/userProfile3.png";
import UserProfile4 from "@/assets/images/userProfile4.png";
import { EyeIcon, ClockIcon, CalenderIcon } from "@/utils/svgicons";
import SearchBar from "../SearchBar";
import TablePagination from "../TablePagination";
import useSWR from "swr";
import { getAllMatches } from "@/services/admin-services";

export default function MatchesComponent({ name,selectedGame,selectedCity, selectedDate }: { name: string, selectedGame:string, selectedCity:string, selectedDate:string }) {
  const [selectedMatch, setSelectedMatch] = useState(null);
  const [searchParams, setSearchParams] = useState("");
  const [page, setPage] = useState(1);
  const itemsPerPage = 10;
  const [type, setType] = useState("completed"); // State to store the mapped type
  const typeMapping: { [key: string]: string } = {
    "Cancelled Matches": "cancelled",
    "Previous Matches": "completed",
    "Upcoming Matches": "upcoming",
  };
  useEffect(() => {
    const mappedType = typeMapping[name] || "completed"; 
    setType(mappedType);
  }, [name]);

  // Fetch matches with SWR, using the dynamic type
  // const { data, mutate, isLoading, error } = useSWR(
  //   `/admin/get-matches?page=${page}&limit=${itemsPerPage}&type=${type}`,
  //   getAllMatches
  // );
  // &search=${searchParams}&game=${selectedGame}&date=${selectedDate}
   const { data, mutate, isLoading, error } = useSWR(
    `/admin/get-matches?page=${page}&limit=${itemsPerPage}&type=${type}${searchParams ? `&search=${searchParams}` : ''}${selectedGame ? `&game=${selectedGame}` : ''}${selectedDate ? `&date=${selectedDate}` : ''}`,
    getAllMatches
  );
  // // Fetch 


  // Extract match data and pagination metadata
  const matchData = data?.data?.data || [];
  console.log('matchData: ', matchData);
  const total = data?.data?.meta?.total || 0;
  const totalPages = data?.data?.meta?.totalPages || Math.ceil(total / itemsPerPage);
  const hasNextPage = data?.data?.meta?.hasNextPage ?? page < totalPages;
  const hasPreviousPage = data?.data?.meta?.hasPreviousPage ?? page > 1;


  // Set the first match as selected when matchData is loaded
  if (matchData.length > 0 && !selectedMatch) {
    setSelectedMatch(matchData[0]);
  }

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      console.log("Changing to page:", newPage);
      setPage(newPage);
    }
  };

  if (error) return <p>Error loading matches: {error.message}</p>;

  return (
    <div className="h-full flex flex-col lg:flex-row w-full bg-[#fbfaff] rounded-[20px] gap-6">
      <div className={`w-full h-fit ${matchData.length > 0 ? 'lg:w-2/3' : 'lg:w-full'} bg-[#f2f2f4] shadow-md rounded-[20px] p-[14px] overflow-auto overflo-custom`}>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-[#10375c] text-xl font-semibold">{name}</h2>
          {/* <SearchBar setQuery={setSearchParams} query={searchParams} /> */}
        </div>
        <div className="overflow-x-auto overflo-custom max-w-full">
          <div className="w-full min-w-[600px] rounded-[10px] bg-[#f2f2f4] flex text-sm font-semibold text-[#7e7e8a]">
            <div className="w-[30%] h-3.5 text-[#7e7e8a] text-start text-xs font-medium">Team 1</div>
            <div className="w-[30%] h-3.5 text-[#7e7e8a] text-start text-xs font-medium">Team 2</div>
            <div className="w-[15%] h-3.5 text-[#7e7e8a] text-xs font-medium">Game</div>
            <div className="w-[18%] h-3.5 text-[#7e7e8a] text-xs text-center font-medium">Date</div>
            <div className="w-[10%] h-3.5 text-[#7e7e8a] text-start text-xs font-medium">Action</div>
          </div>
          <div className="w-full h-[0px] border border-[#d0d0d0] border-dotted mt-[8px]"></div>
          <div className="w-full min-w-[600px]">
            {isLoading ? (
              <p>Loading...</p>
            ) : matchData.length === 0 ? (
              <p>No matches found</p>
            ) : (
              matchData.map((match, index) => (
                <div
                  key={match._id}
                  className={`cursor-pointer flex items-center h-[47px] px-3.5 py-3 rounded-[10px] ${
                    selectedMatch?._id === match._id
                      ? "bg-[#176dbf] text-white"
                      : index % 2 === 0
                      ? "bg-[#f2f2f4]"
                      : "bg-white"
                  }`}
                  onClick={() => setSelectedMatch(match)}
                >
                  <div
                    className={`w-[30%] flex items-center gap-2 break-words text-[#1b2229] text-xs font-medium ${
                      selectedMatch?._id === match._id ? "text-white" : "text-[#1b2229]"
                    }`}
                  >
                    <Image src={UserProfile} alt="Avatar" className="rounded-full" width={25} height={25} />
                    {match.team1?.[0]?.userData?.fullName || "N/A"}
                  </div>
                  <div
                    className={`w-[30%] flex items-center gap-2 break-words text-[#1b2229] text-xs font-medium ${
                      selectedMatch?._id === match._id ? "text-white" : "text-[#1b2229]"
                    }`}
                  >
                    <Image src={UserProfile} alt="Avatar" className="rounded-full" width={25} height={25} />
                    {match.team1?.[1]?.userData?.fullName || "N/A"}
                  </div>
                  <div
                    className={`w-[15%] text-[#1b2229] text-xs text-start font-medium ${
                      selectedMatch?._id === match._id ? "text-white" : "text-[#1b2229]"
                    }`}
                  >
                    {match.court?.games || "N/A"}
                  </div>
                  <div
                    className={`w-[18%] text-[#1b2229] text-center break-words text-xs font-medium ${
                      selectedMatch?._id === match._id ? "text-white" : "text-[#1b2229]"
                    }`}
                  >
                    {new Date(match.bookingDate).toLocaleDateString("en-GB", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                    }) || "N/A"}
                  </div>
                  <div className="w-[10%] text-[#1b2229] text-xs font-medium flex justify-center">
                    <EyeIcon stroke={selectedMatch?._id === match._id ? "#FFFF" : "#fd5602"} />
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Pagination */}
          <div className="mt-4 flex justify-end gap-2">
            <TablePagination
              setPage={handlePageChange}
              page={page}
              totalData={total}
              itemsPerPage={itemsPerPage}
              // totalPages={totalPages}
              // hasNextPage={hasNextPage}
              // hasPreviousPage={hasPreviousPage}
            />
          </div>
        </div>
      </div>

      {matchData.length > 0 && (
        <div className="w-full lg:w-1/3 h-fit bg-[#f2f2f4] shadow-md rounded-[20px] px-[15px] pt-[14px] pb-[19px]">
          {selectedMatch ? (
            <div className="bg-[#f2f2f4] rounded-[20px]">
              <Image src={MatchImage} alt="Match" className="w-full h-40 rounded-md object-cover" />
              <h3 className="text-xl font-bold mt-4 flex justify-between mb-[8px]">
                {selectedMatch.court?.games || "N/A"} Game{" "}
                <span className="text-right text-[#1b2229] text-sm font-semibold leading-[16.80px]">
                  120 Mins
                </span>
              </h3>
              <div className="flex justify-between">
                <p className="text-[#1b2229] text-sm font-medium leading-[16.80px] flex items-center gap-2">
                  {selectedMatch.venueId?.city || "N/A"}, {selectedMatch.venueId?.state || "N/A"}
                </p>
                <div className="flex gap-[20px]">
                  <div className="flex gap-[10px] text-[#5f6a7c] text-xs font-medium leading-[14.40px]">
                    <CalenderIcon />{" "}
                    {new Date(selectedMatch.bookingDate).toLocaleDateString("en-GB", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </div>
                  <div className="flex gap-[10px] text-[#5f6a7c] text-xs font-medium leading-[14.40px]">
                    <ClockIcon /> {selectedMatch.bookingSlots || "N/A"}
                  </div>
                </div>
              </div>

              <div className="flex justify-between items-center mt-4">
                <h4 className="text-[#1b2229] text-sm font-semibold leading-[16.80px]">Created By</h4>
                <div className="flex items-center gap-2">
                  <Image src={UserProfile2} alt="Avatar" className="rounded-full" width={25} height={25} />
                  <p className="text-right text-[#1b2229] text-xs font-medium">
                    {selectedMatch.team1?.[0]?.userData?.fullName || "N/A"}
                  </p>
                </div>
              </div>
              <div className="mt-2 grid grid-cols-2 gap-[10px]">
                <p className="text-[#1b2229] text-sm font-semibold leading-[16.80px]">Players</p>
                <p className="text-right text-[#1b2229] text-xs font-medium">
                  {selectedMatch.team1?.length + (selectedMatch.team2?.length || 0) || 0}
                </p>
                <p className="text-[#1b2229] text-sm font-semibold leading-[16.80px]">Equipment Rented</p>
                <p className="text-right text-[#1b2229] text-xs font-medium">
                  {selectedMatch.team1?.[0]?.racketA ||
                  selectedMatch.team1?.[0]?.racketB ||
                  selectedMatch.team1?.[0]?.racketC ||
                  selectedMatch.team1?.[0]?.balls
                    ? "Yes"
                    : "None"}
                </p>
                <p className="text-[#1b2229] text-sm font-semibold leading-[16.80px]">Paid for</p>
                <p className="text-right text-[#1b2229] text-xs font-medium">
                  {selectedMatch.team1?.[0]?.paidBy || "N/A"}
                </p>
              </div>

              <div className="bg-[#f2f2f4] rounded-[20px] mt-[15px]">
                <div className="flex flex-col items-center mt-[15px] bg-white px-[17px] py-[20px] gap-[20px] rounded-lg">
                  <h4 className="text-center text-[#1b2229] text-sm font-semibold leading-[16.80px]">
                    Players in the Game
                  </h4>
                  <div className="flex items-center gap-[15px]">
                    {selectedMatch.team1?.map((player, idx) => (
                      <div key={idx} className="flex flex-col items-center">
                        <Image
                          // src={player.userData?.profilePic || UserProfile3}
                          src={ UserProfile3}
                          alt="Player"
                          height={100}
                          width={100}
                          className="rounded-full w-16"
                        />
                        <p className="text-xs">{player.userData?.fullName || "N/A"}</p>
                      </div>
                    ))}
                    <p className="text-sm font-bold">VS</p>
                    {selectedMatch.team2?.length > 0 ? (
                      selectedMatch.team2.map((player, idx) => (
                        <div key={idx} className="flex flex-col items-center">
                          <Image
                            src={ UserProfile4}
                            alt="Player"
                            height={100}
                            width={100}
                            className="rounded-full w-16"
                          />
                          <p className="text-xs">{player.userData?.fullName || "N/A"}</p>
                        </div>
                      ))
                    ) : (
                      <>
                        <div className="flex flex-col items-center">
                          <Image src={UserProfile4} alt="Player" height={100} width={100} className="rounded-full w-16" />
                          <p className="text-xs">N/A</p>
                        </div>
                        <div className="flex flex-col items-center">
                          <Image src={UserProfile4} alt="Player" height={100} width={100} className="rounded-full w-16" />
                          <p className="text-xs">N/A</p>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>
              <button className="w-full bg-[#10375C] text-white p-3 rounded-[28px] mt-[10%]">Edit Game</button>
            </div>
          ) : (
            <p className="text-center text-gray-500">Select a match to see details</p>
          )}
        </div>
      )}
    </div>
  );
}
