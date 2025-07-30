"use client";
import { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import MatchImage from "@/assets/images/padelImage.png";
import UserProfile2 from "@/assets/images/images.png";
import { EyeIcon, ClockIcon, CalenderIcon } from "@/utils/svgicons";
import TablePagination from "../TablePagination";
import useSWR from "swr";
import { getAllMatches } from "@/services/admin-services";
import { getImageClientS3URL } from "@/config/axios";
import { useSession } from "next-auth/react";
import RefundConfirmation from "./refundConfirmationModal";
import { getProfileImageUrl } from "@/utils";

export default function MatchesComponent({ name, selectedGame, selectedCity, selectedDate }) {
  const [selectedMatch, setSelectedMatch] = useState(null);
  const [searchParams, setSearchParams] = useState("");
  const [page, setPage] = useState(1);
  const itemsPerPage = 10;
  const [type, setType] = useState("upcoming");
  const [isTabSwitching, setIsTabSwitching] = useState(false);
  const { data: session, status } = useSession();
  console.log("session", session, "status", status);
const [isRefundModalOpen, setIsRefundModalOpen] = useState(false);
  // Derive userRole and venueId from session
  const userRole = status === "authenticated" ? (session as any)?.user?.role : undefined;
  const venueId = status === "authenticated" ? (session as any)?.user?.venueId : undefined;
  console.log("userRole", userRole, "venueId", venueId);
     const typeMapping: { [key: string]: string } = {
    "Cancelled Matches": "cancelled",
    "Previous Matches": "completed",
    "Upcoming Matches": "upcoming",
  };
  useEffect(() => {
    const mappedType = typeMapping[name] || "completed";
    setType(mappedType);
    setPage(1);
    setSelectedMatch(null);
    setIsTabSwitching(true);
  }, [name]);
  // Compute the SWR key based on role and conditions
  const swrKey = useMemo(() => {
    console.log('Computing swrKey - userRole:', userRole, 'venueId:', venueId, 'status:', status);
    if (status !== "authenticated") return null;
 
    const baseParams = `?page=${page}&limit=${itemsPerPage}&type=${type}${searchParams ? `&search=${searchParams}` : ''}${selectedGame ? `&game=${selectedGame}` : ''}${selectedDate ? `&date=${selectedDate}` : ''}${selectedCity ? `&city=${selectedCity}` : ''}`;
 
    if (userRole === "admin") {
      return `/admin/get-matches${baseParams}`;
    }
     else if (userRole === "employee" && venueId !== "null") {
      return `/admin/get-matches${baseParams}&venueId=${venueId}`;
    }
    return null; // No fetch for other cases
  }, [status, userRole, venueId, page, itemsPerPage, type, searchParams, selectedGame, selectedDate, selectedCity]);
 
  const { data, mutate, isLoading, error } = useSWR(
    swrKey,
    getAllMatches
  );

  const getTotalEquipmentRented = (match) => {
    let total = 0;
    if (match?.team1 && Array.isArray(match?.team1)) {
      match?.team1.forEach(player => {
        total += (player.racketA || 0) + (player.racketB || 0) + (player.racketC || 0) + (player.balls || 0);
      });
    }
    if (match?.team2 && Array.isArray(match?.team2)) {
      match?.team2.forEach(player => {
        total += (player.racketA || 0) + (player.racketB || 0) + (player.racketC || 0) + (player.balls || 0);
      });
    }
    return total === 0 ? "None" : total;
  };

  const matchData = data?.data?.data || [];
  const total = data?.data?.meta?.total || 0;
  const totalPages = data?.data?.meta?.totalPages || Math.ceil(total / itemsPerPage);
  const hasNextPage = data?.data?.meta?.hasNextPage ?? page < totalPages;
  const hasPreviousPage = data?.data?.meta?.hasPreviousPage ?? page > 1;

  const currentSelectedMatch = selectedMatch || (matchData.length > 0 ? matchData[0] : null);

  useEffect(() => {
    if (!isLoading) {
      setIsTabSwitching(false);
    }
  }, [isLoading]);

  useEffect(() => {
    if (matchData.length > 0 && !selectedMatch) {
      console.log(`Selecting first match for ${name}:`, matchData[0]);
      setSelectedMatch(matchData[0]);
      setIsTabSwitching(false);
    } else if (matchData.length === 0) {
      console.log(`No matches found for ${name}, clearing selection`);
      setSelectedMatch(null);
      setIsTabSwitching(false);
    }
  }, [matchData, name, selectedMatch]);

  useEffect(() => {
    setSelectedMatch(null);
    setPage(1);
    setIsTabSwitching(true);
  }, [selectedGame, selectedCity, selectedDate, searchParams]);

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      console.log("Changing to page:", newPage);
      setPage(newPage);
      setSelectedMatch(null);
    }
  };

  // Return early if no venue is assigned for employee
  if (userRole === "employee" && venueId === "null") {
    return <p className="text-center text-[#10375c] text-lg font-semibold">No venue assigned yet</p>;
  }

  if (error) return <p>Error loading matches: {error.message}</p>;

  return (
    <div className="h-full flex flex-col lg:flex-row w-full bg-[#fbfaff] rounded-[20px] gap-6">
      <div className={`w-full h-fit ${matchData.length > 0 ? 'lg:w-2/3' : 'lg:w-full'} bg-[#f2f2f4] shadow-md rounded-[20px] p-[14px] overflow-auto overflo-custom`}>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-[#10375c] text-xl font-semibold">{name}</h2>
        </div>
        <div className="overflow-x-auto overflo-custom max-w-full">
          <div className="w-full min-w-[600px] rounded-[10px] bg-[#f2f2f4] flex text-sm font-semibold text-[#7e7e8a]">
            <div className="w-[30%] h-3.5 text-[#7e7e8a] text-start text-xs font-medium">Team 1</div>
            <div className="w-[30%] h-3.5 text-[#7e7e8a] text-start text-xs font-medium">Team 2</div>
            <div className="w-[15%] h-3.5 text-[#7e7e8a] text-xs font-medium">Game</div>
            <div className="w-[13%] h-3.5 text-[#7e7e8a] text-xs font-medium">Venue</div>
            <div className="w-[18%] h-3.5 text-[#7e7e8a] text-xs text-center font-medium">Date</div>
            <div className="w-[10%] h-3.5 text-[#7e7e8a] text-start text-xs font-medium">Action</div>
          </div>
          <div className="w-full h-[0px] border border-[#d0d0d0] border-dotted mt-[8px]"></div>
          <div className="w-full min-w-[600px]">
            {isLoading ? (
              <p className="m-2">Loading...</p>
            ) : matchData.length === 0 ? (
              <p className="m-2">No matches found</p>
            ) : (
              matchData.map((match, index) => (
                <div
                  key={match._id}
                  className={`cursor-pointer flex items-center h-[47px] px-3.5 py-3 rounded-[10px] ${currentSelectedMatch?._id === match._id
                    ? "bg-[#176dbf] text-white"
                    : index % 2 === 0
                      ? "bg-[#f2f2f4]"
                      : "bg-white"
                    }`}
                  onClick={() => setSelectedMatch(match)}
                >
                  <div
                    className={`w-[30%] flex items-center gap-2 break-words text-[#1b2229] text-xs font-medium ${currentSelectedMatch?._id === match._id ? "text-white" : "text-[#1b2229]"
                      }`}
                  >
                    <div className="w-[25px] h-[25px] relative">
                      <Image
                        src={
                          match?.team1?.length > 0 && match?.team1?.[0]?.userData?.profilePic !== "null"
                            ? getProfileImageUrl(match?.team1?.[0]?.userData?.profilePic)
                            : UserProfile2
                        }
                        alt="Avatar"
                        className="rounded-full object-cover"
                        fill
                        unoptimized
                      />
                    </div>
                    {match.isMaintenance === true
                      ? "Maintenance"
                      : match?.team1?.[0]?.userData
                        ? match?.team1?.[0]?.userData?.fullName
                        : "N/A"}
                  </div>
                  <div
                    className={`w-[30%] flex items-center gap-2 break-words text-[#1b2229] text-xs font-medium ${currentSelectedMatch?._id === match._id ? "text-white" : "text-[#1b2229]"
                      }`}
                  >
                    <div className="w-[25px] h-[25px] relative">
                      {match.isMaintenance === false && <Image
                        src={
                          match?.team2?.length > 0 && match?.team2[0]?.userData?.profilePic !== "null"
                            ? getProfileImageUrl(match?.team2[0].userData.profilePic)
                            : UserProfile2
                        }
                        alt="Avatar"
                        className="rounded-full object-cover"
                        fill
                        unoptimized
                      />}
                    </div>
                    {match.isMaintenance === true
                      ? ""
                      : match?.team2?.[0]?.userData
                        ? match?.team2?.[0]?.userData?.fullName
                        : "N/A"}
                  </div>
                  <div
                    className={`w-[15%] text-[#1b2229] text-xs text-start font-medium ${currentSelectedMatch?._id === match._id ? "text-white" : "text-[#1b2229]"
                      }`}
                  >
                    {match.court?.games || "N/A"}
                  </div>
                  <div
                    className={`w-[15%] text-[#1b2229] text-xs text-start font-medium ${currentSelectedMatch?._id === match._id ? "text-white" : "text-[#1b2229]"
                      }`}
                  >
                    {match.venue?.name || "N/A"}
                  </div>
                  <div
                    className={`w-[18%] text-[#1b2229] text-center break-words text-xs font-medium ${selectedMatch?._id === match._id ? "text-white" : "text-[#1b2229]"
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
          {matchData.length !== 0 && (
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
      {(matchData.length !== 0 || isLoading) && (
        <div className="w-full lg:w-1/3 h-fit bg-[#f2f2f4] shadow-md rounded-[20px] px-[15px] pt-[14px] pb-[19px]">
          {(isLoading && !matchData.length) || (isTabSwitching && !currentSelectedMatch) ? (
            <div className="flex flex-col items-center justify-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#10375c]"></div>
              <p className="text-center text-[#10375c] mt-4">
                {(isTabSwitching && matchData.length !== 0) ? "Loading matches..." : "Loading match details..."}
              </p>
            </div>
          ) : !currentSelectedMatch && matchData.length > 0 ? (
            <div className="flex flex-col items-center justify-center h-64">
              <div className="animate-pulse">
                <div className="w-16 h-16 bg-gray-300 rounded-full mx-auto mb-4"></div>
                <div className="h-4 bg-gray-300 rounded w-32 mx-auto mb-2"></div>
                <div className="h-3 bg-gray-300 rounded w-24 mx-auto"></div>
              </div>
              <p className="text-center text-[#10375c] mt-4">Preparing match details...</p>
            </div>
          ) : currentSelectedMatch ? (
            <div className="bg-[#f2f2f4] rounded-[20px]">
              <div className="w-full h-40 relative">
                <Image src={MatchImage} alt="Match" className="rounded-md object-cover" fill unoptimized />
              </div>
              <h3 className="font-bold mt-4 flex justify-between mb-[8px]">
                {currentSelectedMatch.court?.games || "N/A"} Game{" "}
                <span className="text-right text-[#1b2229] text-sm font-semibold leading-[16.80px]">
                  60 Mins
                </span>
              </h3>
              <div className="flex justify-between">
                <p className="text-[#1b2229] text-sm font-medium leading-[16.80px] flex items-center gap-2">
                  {currentSelectedMatch.venue?.city || "N/A"}, {currentSelectedMatch.venue?.state || "N/A"}
                </p>
                <div className="flex gap-[20px]">
                  <div className="flex gap-[10px] text-[#5f6a7c] text-xs font-medium leading-[14.40px]">
                    <CalenderIcon />{" "}
                    {new Date(currentSelectedMatch.bookingDate).toLocaleDateString("en-GB", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </div>
                  <div className="flex gap-[10px] text-[#5f6a7c] text-xs font-medium leading-[14.40px]">
                    <ClockIcon /> {currentSelectedMatch.bookingSlots || "N/A"}
                  </div>
                </div>
              </div>
              {currentSelectedMatch?.isMaintenance === false && (
                <div>
                  <div className="flex justify-between items-center mt-4">
                    <h4 className="text-[#1b2229] text-sm font-semibold leading-[16.80px]">Venue</h4>
                    <div className="flex items-center gap-2">
                      <div className="w-[25px] h-[25px] relative">
                        {/* <Image
                          src={selectedMatch?.venue?.image !== "null" && getProfileImageUrl(selectedMatch?.venue?.image)}
                          alt="Avatar"
                          className="rounded-full object-cover"
                          fill
                          unoptimized
                        /> */}
                      </div>
                      <p className="text-right text-[#1b2229] text-sm font-semibold">
                        {selectedMatch?.venue?.name || "N/A"}
                      </p>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <h4 className="text-[#1b2229] text-sm font-semibold leading-[16.80px]">Created By</h4>
                    <div className="flex items-center gap-2">
                      <div className="w-[25px] h-[25px] relative">
                        <Image
                          src={selectedMatch?.team1?.[0]?.userData?.profilePic !== "null" ? getProfileImageUrl(selectedMatch?.team1?.[0]?.userData?.profilePic) : UserProfile2}
                          alt="Avatar"
                          className="rounded-full object-cover"
                          fill
                          unoptimized
                        />
                      </div>
                      <p className="text-right text-[#1b2229] text-xs font-medium">
                        {selectedMatch?.team1?.[0]?.userData?.fullName || "N/A"}
                      </p>
                    </div>
                  </div>
                  <div className="mt-2 grid grid-cols-2 gap-[10px]">
                    <p className="text-[#1b2229] text-sm font-semibold leading-[16.80px]">Players</p>
                    <p className="text-right text-[#1b2229] text-xs font-medium">
                      {selectedMatch?.team1?.length + (selectedMatch?.team2?.length || 0) || 0}
                    </p>
                    <p className="text-[#1b2229] text-sm font-semibold leading-[16.80px]">Equipment Rented</p>
                    <p className="text-right text-[#1b2229] text-xs font-medium">
                      {getTotalEquipmentRented(selectedMatch)}
                    </p>
                  </div>
                </div>
              )}
              {selectedMatch?.isMaintenance === false && (
                <div className="bg-[#f2f2f4] rounded-[20px] mt-[15px]">
                  <div className="flex flex-col items-center mt-[15px] bg-white px-[17px] py-[20px] gap-[20px] rounded-lg">
                    <h4 className="text-center text-[#1b2229] text-sm font-semibold leading-[16.80px]">
                      Players in the Game
                    </h4>
                    <div className="flex items-center gap-[15px]">
                      {selectedMatch?.team1?.map((player, idx) => (
                        <div key={idx} className="flex flex-col items-center">
                          <div className="w-16 h-16 relative">
                            <Image
                              src={player.userData?.profilePic !== "null" ? getProfileImageUrl(player.userData?.profilePic) : UserProfile2}
                              alt="Player"
                              className="rounded-full object-cover"
                              fill
                              unoptimized
                            />
                          </div>
                          <p className="text-xs mt-1 text-center max-w-[64px] truncate">{player.userData?.fullName || "N/A"}</p>
                        </div>
                      ))}
                      <p className="text-sm font-bold">VS</p>
                      {selectedMatch?.team2?.length > 0 ? (
                        selectedMatch?.team2.map((player, idx) => (
                          <div key={idx} className="flex flex-col items-center">
                            <div className="w-16 h-16 relative">
                              <Image
                                src={player.userData?.profilePic !== "null" ? getProfileImageUrl(player.userData?.profilePic) : UserProfile2}
                                alt="Player"
                                className="rounded-full object-cover"
                                fill
                              />
                            
                            </div>
                            <p className="text-xs mt-1 text-center max-w-[64px] truncate">{player.userData?.fullName || "N/A"}</p>
                          </div>
                        ))
                      ) : (
                        <>
                          <div className="flex flex-col items-center">
                            <div className="w-16 h-16 relative">
                              <Image
                                src={UserProfile2}
                                alt="Player"
                                className="rounded-full object-cover"
                                fill
                              />
                            </div>
                            <p className="text-xs mt-1 text-center">N/A</p>
                          </div>
                          <div className="flex flex-col items-center">
                            <div className="w-16 h-16 relative">
                              <Image
                                src={UserProfile2}
                                alt="Player"
                                className="rounded-full object-cover"
                                fill
                              />
                            </div>
                            <p className="text-xs mt-1 text-center">N/A</p>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              )}
              {type === "upcoming" && (
                <>
                  <button onClick={() => setIsRefundModalOpen(true)} className="w-full bg-[#10375C] text-white p-3 rounded-[28px] mt-[10%]">
                    Cancel Game
                  </button>
                  <RefundConfirmation open={isRefundModalOpen} setOpen={setIsRefundModalOpen} id={selectedMatch?._id} />
                </>
              )}
            </div>
          ) : (
            <p className="text-center text-gray-500">Select a match to see details</p>
          )}
        </div>
      )}
    </div>
  );
}