"use client";
import { useState } from "react";
import Image from "next/image";
import Human from "@/assets/images/Human.png";
import { DownArrowIcon, UpArrowIcon } from "@/utils/svgicons";
import UserProfileImage from "@/assets/images/userProfile4.png";
import { useParams } from "next/navigation";
import useSWR from "swr";
import { getUserDetails } from "@/services/admin-services";
import UserProfile2 from "@/assets/images/employeeProfile.jpg";
import { getImageClientS3URL } from "@/config/axios";
import { Plus } from "lucide-react";

const games = ["Padel", "Pickleball"];

export default function SingleUserProfile() {
  const { id } = useParams();
  const [selectedGame, setSelectedGame] = useState("");
  const filters = ["All", "Upcoming", "Previous", "Cancelled"];
  const [selectedFilter, setSelectedFilter] = useState("All");
  const [gameDropdown, setGameDropdown] = useState(false);
  const { data, isLoading, error } = useSWR(
    `/admin/get-users/${id}`,
    getUserDetails
  );

  const userDetails = data?.data?.data;

  // Helper function to format match data with robust error handling
  const formatMatch = (match) => {
    if (!match) {
      return {
        date: "N/A",
        location: "Unknown",
        amountPaid: "₹0",
        gameType: "Padel",
        type: "Open Match",
        equipmentRented: "None",
        rentedEquipmentPrice: "N/A",
        opponents: [],
        score: { team1: "N/A", team2: "N/A" },
        winner: "N/A",
        bookingType: "",
      };
    }

    const opponents = [
      ...(match?.team1?.map((player) => ({
        name: player?.userData?.fullName || "Unknown",
        profilePic: player?.userData?.profilePic || null,
      })) || []),
      ...(match?.team2?.map((player) => ({
        name: player?.userData?.fullName || "Unknown",
        profilePic: player?.userData?.profilePic || null,
      })) || []),
    ].slice(0, 4);

    const equipmentRented =
      [
        (match?.team1?.[0]?.rackets || 0) + (match?.team2?.[0]?.rackets || 0) >
        0
          ? `${
              (match?.team1?.[0]?.rackets || 0) +
              (match?.team2?.[0]?.rackets || 0)
            } Racket`
          : null,
        (match?.team1?.[0]?.balls || 0) + (match?.team2?.[0]?.balls || 0) > 0
          ? `${
              (match?.team1?.[0]?.balls || 0) + (match?.team2?.[0]?.balls || 0)
            } Balls`
          : null,
      ]
        .filter(Boolean)
        .join(" - ") || "None";

    const equipmentCount =
      (match?.team1?.reduce(
        (sum, player) => sum + (player.rackets || 0) + (player.balls || 0),
        0
      ) || 0) +
      (match?.team2?.reduce(
        (sum, player) => sum + (player.rackets || 0) + (player.balls || 0),
        0
      ) || 0);

    return {
      date: match?.bookingDate
        ? new Date(match.bookingDate).toLocaleString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
            //   hour: "2-digit",
            //   minute: "2-digit",
          })
        : "N/A",
      slot: match?.bookingSlots,
      location: `${match?.venue?.name || "Unknown"}, ${
        match?.venue?.city || "Unknown"
      }`,
      amountPaid: `₹${match?.bookingAmount || 0}`,
      gameType: match?.court?.games || "Padel",
      type: match?.isCompetitive ? "Competitive" : "Open Match",
      equipmentRented,
      rentedEquipmentPrice:
        equipmentRented === "None" ? "N/A" : `₹${equipmentCount * 100}`,
      opponents,
      score: match?.score || { team1: "N/A", team2: "N/A" },
      winner: match?.winner || "N/A",
      bookingType: match?.bookingType,
    };
  };

  // Helper to safely parse confidence
  const parseConfidence = (confidence) => {
    if (!confidence || typeof confidence !== "string") return 0;
    const value = parseInt(confidence.replace("%", ""), 10);
    return isNaN(value) ? 0 : value;
  };

  const upcomingNonCancelled =
    userDetails?.upcomingMatches?.filter(
      (m) => m.bookingType !== "Cancelled"
    ) || [];

  const completedNonCancelled =
    userDetails?.completedMatches?.filter(
      (m) => m.bookingType !== "Cancelled"
    ) || [];

  const cancelledBookings =
    [
      ...(userDetails?.completedMatches || []),
      ...(userDetails?.upcomingMatches || []),
    ].filter((m) => m.bookingType === "Cancelled") || [];

  return (
    <>
      <div className="flex w-full justify-between mb-[15px]">
        <div className="text-[#10375c] text-3xl font-semibold">Users</div>
        <div className="relative">
          <button
            className="flex px-5 py-3 bg-[#1b2229] text-white rounded-[28px]"
            onClick={() => setGameDropdown(!gameDropdown)}
          >
            {selectedFilter}
            <span className="ml-2 mt-1">
              {!gameDropdown ? <DownArrowIcon /> : <UpArrowIcon />}
            </span>
          </button>
          {gameDropdown && (
            <div className="z-50 flex flex-col gap-[5px] absolute top-12 left-[-50px] p-[20px] h-[auto] bg-white rounded-[10px] shadow-[0px_4px_20px_0px_rgba(92,138,255,0.10)] max-h-[200px] overflow-y-auto">
              {filters.map((filter) => (
                <label
                  key={filter}
                  className="flex gap-[10px] cursor-pointer text-[#1b2229] text-sm font-medium"
                >
                  <input
                    type="radio"
                    name="filter"
                    value={filter}
                    checked={selectedFilter === filter}
                    onChange={(e) => {
                      setSelectedFilter(e.target.value);
                      setGameDropdown(false);
                    }}
                  />
                  {filter}
                </label>
              ))}
            </div>
          )}
        </div>
      </div>
      <div className="flex flex-col lg:flex-row w-full rounded-[20px] gap-6 mb-[15px]">
        {/* Left Panel: User Details */}
        <div className="flex flex-col gap-[20px] w-full lg:w-1/3 rounded-[20px]">
          {isLoading ? (
            <p className="text-center text-gray-500">Loading...</p>
          ) : error ? (
            <p className="text-center text-red-500">Error loading user data</p>
          ) : userDetails ? (
            <div className="w-full bg-[#f2f2f4] rounded-[20px]">
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
                    src={
                      userDetails.profilePic !== null
                        ? getImageClientS3URL(userDetails.profilePic)
                        : UserProfile2
                    }
                    alt="User Avatar"
                    className="rounded-full border-2 border-white w-18 h-18 ml-2"
                    width={64}
                    height={64}
                  />
                  <div>
                    <div className="text-white text-2xl md:text-3xl font-bold leading-10 tracking-wide">
                      {userDetails.firstName || "Unknown"}{" "}
                      {userDetails.lastName || ""}
                    </div>
                  </div>
                  <div className="h-10 px-5 py-3 bg-[#10375c] rounded-[28px] gap-[5px] inline-flex mb-[30px]">
                    <div className="text-white text-sm font-medium">
                      ₹{userDetails.stats?.level || 0}
                    </div>
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
                      <div className="text-[#7e7e8a] text-xs font-medium capitalize leading-[15px]">
                        Country
                      </div>
                    </div>
                    <div className="flex-col justify-start items-end gap-2.5 inline-flex">
                      <div className="text-right text-[#1b2229] text-xs font-bold capitalize leading-[15px]">
                        {(userDetails.countryCode || "") +
                          (userDetails.phoneNumber || "")}
                      </div>
                      <div className="text-right text-[#1b2229] text-xs font-bold leading-[15px]">
                        {userDetails.email || "N/A"}
                      </div>
                      <div className="text-right text-[#1b2229] text-xs font-bold capitalize leading-[15px]">
                        {userDetails.country || "N/A"}
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
                      <div className="self-stretch text-[#7e7e8a] text-xs font-medium capitalize leading-[15px]">
                        Improvement
                      </div>
                      <div className="self-stretch text-[#7e7e8a] text-xs font-medium capitalize leading-[15px]">
                        Confidence
                      </div>
                      <div className="self-stretch text-[#7e7e8a] text-xs font-medium capitalize leading-[15px]">
                        Active Padel Matches
                      </div>
                      <div className="self-stretch text-[#7e7e8a] text-xs font-medium capitalize leading-[15px]">
                        Active Pickleball Matches
                      </div>
                    </div>
                    <div className="flex-col justify-start items-end gap-2.5 inline-flex">
                      <div className="text-right text-[#1b2229] text-xs font-bold capitalize leading-[15px]">
                        {userDetails.stats?.loyaltyPoints ?? 0}
                      </div>
                      <div className="text-right text-[#1b2229] text-xs font-bold capitalize leading-[15px]">
                        {userDetails.stats?.level ?? 0}
                      </div>
                      <div className="text-right text-[#1b2229] text-xs font-bold capitalize leading-[15px]">
                        {userDetails.stats?.lastMonthLevel ?? 0}
                      </div>
                      <div className="text-right text-[#1b2229] text-xs font-bold capitalize leading-[15px]">
                        {(userDetails.stats?.level ?? 0) -
                          (userDetails.stats?.lastMonthLevel ?? 0)}
                      </div>
                      <div className="text-right text-[#1b2229] text-xs font-bold capitalize leading-[15px]">
                        {userDetails.stats?.improvement ?? 0}%
                      </div>
                      <div className="text-right text-[#1b2229] text-xs font-bold capitalize leading-[15px]">
                        {parseConfidence(userDetails.stats?.confidence)}
                      </div>
                      <div className="text-right text-[#1b2229] text-xs font-bold capitalize leading-[15px]">
                        {userDetails.stats?.padlelMatches ?? 0}
                      </div>
                      <div className="text-right text-[#1b2229] text-xs font-bold capitalize leading-[15px]">
                        {userDetails.stats?.pickleballMatches ?? 0}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <p className="text-center text-gray-500">No user data available</p>
          )}
          <div className="w-full px-[20px] py-[18px] bg-[#f2f2f4] rounded-[20px]">
            <div className="w-full flex justify-between">
              <div className="flex flex-col gap-[10px]">
                <div className="text-[#7e7e8a] text-xs font-medium capitalize leading-[15px]">
                  Total Matches
                </div>
                <div className="text-center text-[#1b2229] text-xs font-bold capitalize leading-[15px]">
                  {userDetails?.stats?.totalMatches ?? 0}
                </div>
              </div>
              <div className="flex flex-col gap-[10px]">
                <div className="text-[#7e7e8a] text-xs font-medium capitalize leading-[15px]">
                  Padel Matches
                </div>
                <div className="text-center text-[#1b2229] text-xs font-bold capitalize leading-[15px]">
                  {userDetails?.stats?.padlelMatches ?? 0}
                </div>
              </div>
              <div className="flex flex-col gap-[10px]">
                <div className="text-[#7e7e8a] text-xs font-medium capitalize leading-[15px]">
                  Pickleball Matches
                </div>
                <div className="text-center text-[#1b2229] text-xs font-bold capitalize leading-[15px]">
                  {userDetails?.stats?.pickleballMatches ?? 0}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Panel: Matches */}
        <div className="h-[80vh] md:h-[calc(100vh)] w-full lg:w-2/3 bg-[#f2f2f4] shadow-md rounded-[20px] p-[14px] overflow-y-auto overflow-auto">
          {/* Upcoming Matches Section */}
          <div className="mt-6">
            {(selectedFilter === "All" || selectedFilter === "Upcoming") && (
              <section>
                <h3 className="text-[#10375c] text-xl font-semibold mb-4">
                  Upcoming Matches
                </h3>
                {isLoading ? (
                  <p className="text-gray-500">Loading matches...</p>
                ) : error ? (
                  <p className="text-red-500">Error loading matches</p>
                ) : upcomingNonCancelled.length > 0 ? (
                  upcomingNonCancelled.map((match, index) => {
                    const formattedMatch = formatMatch(match);
                    const opponents = formattedMatch.opponents || [];
                    return (
                      <div
                        key={index}
                        className="flex flex-col gap-[10px] w-full mb-[20px]"
                      >
                        <div className="flex items-center w-full gap-[10px] flex-col md:flex-row">
                          <div className="h-full p-[30px] bg-white rounded-[10px] w-full lg:w-max">
                            <div className="h-[17px] w-full justify-between items-center inline-flex mb-[20px]">
                              <div className="text-center text-[#1b2229] text-sm font-semibold leading-[16.80px]">
                                {formattedMatch.gameType} Match
                              </div>
                              <div className="text-right text-[#1b2229] text-sm font-semibold leading-[16.80px]">
                                {formattedMatch.date} {formattedMatch.slot}
                              </div>
                            </div>
                            <div className="flex items-center gap-[20px] w-full">
                              {opponents.map((opponent, i) => (
                                <div
                                  key={i}
                                  className="w-1/2 flex flex-col gap-1"
                                >
                                  <Image
                                    src={
                                      opponent.profilePic
                                        ? opponent.profilePic.startsWith(
                                            "https"
                                          )
                                          ? opponent.profilePic
                                          : getImageClientS3URL(
                                              opponent.profilePic
                                            )
                                        : UserProfileImage
                                    }
                                    alt={`${opponent.name} Avatar`}
                                    className="w-[60px] h-[60px] rounded-full"
                                    width={60}
                                    height={60}
                                  />
                                  <div className="text-center text-[#1b2229] word-break text-xs font-medium leading-[12px]">
                                    {opponent.name}
                                  </div>
                                </div>
                              ))}
                              {Array.from({ length: 4 - opponents.length }).map(
                                (_, i) => (
                                  <div
                                    key={`placeholder-${i}`}
                                    className="w-1/2 flex flex-col gap-1 items-center"
                                  >
                                    <div
                                      className="
        w-[60px] h-[60px] rounded-full 
        bg-gray-300 flex items-center justify-center
        text-gray-600 font-semibold text-sm select-none
      "
                                    >
                                      N/A
                                    </div>
                                    <div className="text-center text-[#1b2229] word-break text-xs font-medium leading-[12px]">
                                      No User
                                    </div>
                                  </div>
                                )
                              )}
                            </div>
                          </div>
                          <div className="w-full md:w-1/2 p-[25px] bg-[#176dbf] rounded-[10px] justify-center items-center gap-5 flex">
                            <div className="w-full flex-col justify-center items-center gap-[15px] inline-flex">
                              <div className="w-full items-center flex justify-between">
                                <div className="text-white text-xs font-medium leading-[14.40px]">
                                  Amount Paid
                                </div>
                                <div className="text-right text-white text-xs font-semibold leading-[14.40px]">
                                  {formattedMatch.amountPaid}
                                </div>
                              </div>
                              <div className="w-full flex justify-between items-center">
                                <div className="text-white text-xs font-medium leading-[14.40px]">
                                  Location
                                </div>
                                <div className="text-right text-white text-xs font-semibold leading-[14.40px]">
                                  {formattedMatch.location}
                                </div>
                              </div>
                              <div className="flex justify-between items-center w-full">
                                <div className="text-white text-xs font-medium leading-[14.40px]">
                                  Game Type
                                </div>
                                <div className="text-right text-white text-xs font-semibold leading-[14.40px]">
                                  {formattedMatch.gameType}
                                </div>
                              </div>
                              <div className="flex justify-between items-center w-full">
                                <div className="text-white text-xs font-medium leading-[14.40px]">
                                  Match Type
                                </div>
                                <div className="text-right text-white text-xs font-semibold leading-[14.40px]">
                                  {formattedMatch.type}
                                </div>
                              </div>
                              <div className="flex justify-between items-center w-full">
                                <div className="text-white text-xs font-medium leading-[14.40px]">
                                  Equipment Rented (if any)
                                </div>
                                <div className="text-right text-white text-xs font-medium leading-[14.40px]">
                                  {formattedMatch.equipmentRented}
                                  {/* {match.} */}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <p className="text-gray-500 my-4 text-center">
                    No upcoming matches
                  </p>
                )}
              </section>
            )}

            {/* Previous Matches Section */}
            {(selectedFilter === "All" || selectedFilter === "Previous") && (
              <section>
                <h3 className="text-[#10375c] text-xl font-semibold mb-4">
                  Previous Matches
                </h3>
                {isLoading ? (
                  <p className="text-gray-500">Loading matches...</p>
                ) : error ? (
                  <p className="text-red-500">Error loading matches</p>
                ) : completedNonCancelled.length > 0 ? (
                  completedNonCancelled.map((match, index) => {
                    const formattedMatch = formatMatch(match);
                    const opponents = formattedMatch.opponents || [];
                    return (
                      <div key={index} className="flex flex-col w-full">
                        <div className="flex items-center w-full gap-[10px] flex-col md:flex-row">
                          <div className="h-full p-[30px] bg-white rounded-[10px] w-full lg:w-max">
                            <div className="h-[17px] w-full justify-between items-center inline-flex mb-[20px]">
                              <div className="text-center text-[#1b2229] text-sm font-semibold leading-[16.80px]">
                                {formattedMatch.gameType} Match
                              </div>
                              <div className="text-right text-[#1b2229] text-sm font-semibold leading-[16.80px]">
                                {formattedMatch.date}
                                {", "}
                                {formattedMatch.slot}
                              </div>
                            </div>
                            <div className="flex items-center gap-[20px] w-full">
                              {opponents.map((opponent, i) => (
                                <div
                                  key={i}
                                  className="w-1/2 flex flex-col gap-1"
                                >
                                  <Image
                                    src={
                                      opponent.profilePic
                                        ? opponent.profilePic.startsWith(
                                            "https"
                                          )
                                          ? opponent.profilePic
                                          : getImageClientS3URL(
                                              opponent.profilePic
                                            )
                                        : UserProfileImage
                                    }
                                    alt={`${opponent.name} Avatar`}
                                    className="w-[60px] h-[60px] rounded-full"
                                    width={60}
                                    height={60}
                                  />
                                  <div className="text-center text-[#1b2229] word-break text-xs font-medium leading-[12px]">
                                    {opponent.name}
                                  </div>
                                </div>
                              ))}
                              {Array.from({ length: 4 - opponents.length }).map(
                                (_, i) => (
                                  <div
                                    key={`placeholder-${i}`}
                                    className="w-1/2 flex flex-col gap-1 items-center"
                                  >
                                    <div
                                      className="
        w-[60px] h-[60px] rounded-full 
        bg-gray-300 flex items-center justify-center
        text-gray-600 font-semibold text-sm select-none
      "
                                    >
                                      N/A
                                    </div>
                                    <div className="text-center text-[#1b2229] word-break text-xs font-medium leading-[12px]">
                                      No User
                                    </div>
                                  </div>
                                )
                              )}
                            </div>
                            <div className="w-full flex-col justify-start items-center gap-2 inline-flex mt-[15px]">
                              <div className="self-stretch text-center text-[#1b2229] text-sm font-semibold leading-[16.80px]">
                                Score
                              </div>
                              <div className="self-stretch justify-between items-center inline-flex">
                                <div className="w-1/2 justify-start items-center flex">
                                  <div className="self-stretch flex-col justify-center items-start gap-2.5 inline-flex">
                                    <div className="text-center text-[#1b2229] text-xs font-medium leading-[12px]">
                                      Team 1
                                    </div>
                                    <div className="w-full h-[0px] border border-[#d6d6d6]"></div>
                                    <div className="text-center text-[#1b2229] text-xs font-medium leading-[14.40px]">
                                      Team 2
                                    </div>
                                  </div>
                                </div>
                                <div className="text-center text-[#1b2229] text-xs font-medium">
                                  Game
                                </div>
                                <div className="flex-col justify-center items-end gap-2.5 inline-flex">
                                  <div className="justify-start items-start gap-2.5 inline-flex">
                                    <div className="text-center text-[#1b2229] text-xs font-medium leading-[14.40px]">
                                      {formattedMatch.score.team1}
                                    </div>
                                  </div>
                                  <div className="h-[0px] border border-[#d6d6d6]"></div>
                                  <div className="justify-start items-start gap-2.5 inline-flex">
                                    <div className="text-center text-[#1b2229] text-xs font-medium leading-[14.40px]">
                                      {formattedMatch.score.team2}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="w-full md:w-1/2 p-[25px] bg-[#176dbf] rounded-[10px] justify-center items-center gap-5 flex">
                            <div className="w-full flex-col justify-center items-center gap-[15px] inline-flex">
                              <div className="w-full items-center flex justify-between">
                                <div className="text-white text-xs font-medium leading-[14.40px]">
                                  Winner Of the Match
                                </div>
                                <div className="text-right text-white text-xs font-semibold leading-[14.40px]">
                                  {formattedMatch.winner}
                                </div>
                              </div>
                              <div className="w-full items-center flex justify-between">
                                <div className="text-white text-xs font-medium leading-[14.40px]">
                                  Amount Paid
                                </div>
                                <div className="text-right text-white text-xs font-semibold leading-[14.40px]">
                                  {formattedMatch.amountPaid}
                                </div>
                              </div>
                              <div className="w-full flex justify-between items-center">
                                <div className="text-white text-xs font-medium leading-[14.40px]">
                                  Location
                                </div>
                                <div className="text-right text-white text-xs font-semibold leading-[14.40px]">
                                  {formattedMatch.location}
                                </div>
                              </div>
                              <div className="flex justify-between items-center w-full">
                                <div className="text-white text-xs font-medium leading-[14.40px]">
                                  Game Type
                                </div>
                                <div className="text-right text-white text-xs font-semibold leading-[14.40px]">
                                  {formattedMatch.gameType}
                                </div>
                              </div>
                              <div className="flex justify-between items-center w-full">
                                <div className="text-white text-xs font-medium leading-[14.40px]">
                                  Match Type
                                </div>
                                <div className="text-right text-white text-xs font-semibold leading-[14.40px]">
                                  {formattedMatch.type}
                                </div>
                              </div>
                              <div className="flex justify-between items-center w-full">
                                <div className="text-white text-xs font-medium leading-[14.40px]">
                                  Equipment Rented (if any)
                                </div>
                                <div className="text-right text-white text-xs font-medium leading-[14.40px]">
                                  {formattedMatch.equipmentRented}
                                </div>
                              </div>
                              {/* <div className="flex justify-between items-center w-full">
                                                        <div className="text-white text-xs font-medium leading-[14.40px]">
                                                            Price of Equipment Rented
                                                        </div>
                                                        <div className="text-right text-white text-xs font-medium leading-[14.40px]">
                                                            {formattedMatch.rentedEquipmentPrice}
                                                        </div>
                                                    </div> */}
                            </div>
                          </div>
                        </div>
                        {/* {index === 0 && ( */}
                        <div className="w-full h-[0px] border border-dotted border-[#d0d0d0] my-[10px]" />
                        {/* )} */}
                      </div>
                    );
                  })
                ) : (
                  <p className="text-gray-500 my-4 text-center">
                    No previous matches
                  </p>
                )}
              </section>
            )}

            {(selectedFilter === "All" || selectedFilter === "Cancelled") && (
              <section>
                <h3 className="text-[#10375c] text-xl font-semibold mb-4">
                  Cancelled Bookings
                </h3>
                {isLoading ? (
                  <p className="text-gray-500">Loading matches...</p>
                ) : error ? (
                  <p className="text-red-500">Error loading matches</p>
                ) : cancelledBookings.length > 0 ? (
                  cancelledBookings.map((match, index) => {
                    const formattedMatch = formatMatch(match);
                    const opponents = formattedMatch.opponents || [];
                    return (
                      <div
                        key={index}
                        className="flex flex-col gap-[10px] w-full mb-[20px]"
                      >
                        <div className="flex items-center w-full gap-[10px] flex-col md:flex-row">
                          <div className="h-full p-[30px] bg-white rounded-[10px] w-full lg:w-max">
                            <div className="h-[17px] w-full justify-between items-center inline-flex mb-[20px]">
                              <div className="text-center text-[#1b2229] text-sm font-semibold leading-[16.80px]">
                                {formattedMatch.gameType} Match
                              </div>
                              <div className="text-right text-[#1b2229] text-sm font-semibold leading-[16.80px]">
                                {formattedMatch.date} {formattedMatch.slot}
                              </div>
                            </div>
                            <div className="flex items-center gap-[20px] w-full">
                              {opponents.map((opponent, i) => (
                                <div
                                  key={i}
                                  className="w-1/2 flex flex-col gap-1"
                                >
                                  <Image
                                    src={
                                      opponent.profilePic
                                        ? opponent.profilePic.startsWith(
                                            "https"
                                          )
                                          ? opponent.profilePic
                                          : getImageClientS3URL(
                                              opponent.profilePic
                                            )
                                        : UserProfileImage
                                    }
                                    alt={`${opponent.name} Avatar`}
                                    className="w-[60px] h-[60px] rounded-full"
                                    width={60}
                                    height={60}
                                  />
                                  <div className="text-center text-[#1b2229] word-break text-xs font-medium leading-[12px]">
                                    {opponent.name}
                                  </div>
                                </div>
                              ))}
                              {Array.from({ length: 4 - opponents.length }).map(
                                (_, i) => (
                                  <div
                                    key={`placeholder-${i}`}
                                    className="w-1/2 flex flex-col gap-1 items-center"
                                  >
                                    <div
                                      className="
                        w-[60px] h-[60px] rounded-full 
                        bg-gray-300 flex items-center justify-center
                        text-gray-600 font-semibold text-sm select-none
                      "
                                    >
                                      N/A
                                    </div>
                                    <div className="text-center text-[#1b2229] word-break text-xs font-medium leading-[12px]">
                                      No User
                                    </div>
                                  </div>
                                )
                              )}
                            </div>
                          </div>
                          <div className="w-full md:w-1/2 p-[25px] bg-[#176dbf] rounded-[10px] justify-center items-center gap-5 flex">
                            <div className="w-full flex-col justify-center items-center gap-[15px] inline-flex">
                              <div className="w-full items-center flex justify-between">
                                <div className="text-white text-xs font-medium leading-[14.40px]">
                                  Amount Paid
                                </div>
                                <div className="text-right text-white text-xs font-semibold leading-[14.40px]">
                                  {formattedMatch.amountPaid}
                                </div>
                              </div>
                              <div className="w-full flex justify-between items-center">
                                <div className="text-white text-xs font-medium leading-[14.40px]">
                                  Location
                                </div>
                                <div className="text-right text-white text-xs font-semibold leading-[14.40px]">
                                  {formattedMatch.location}
                                </div>
                              </div>
                              <div className="flex justify-between items-center w-full">
                                <div className="text-white text-xs font-medium leading-[14.40px]">
                                  Game Type
                                </div>
                                <div className="text-right text-white text-xs font-semibold leading-[14.40px]">
                                  {formattedMatch.gameType}
                                </div>
                              </div>
                              <div className="flex justify-between items-center w-full">
                                <div className="text-white text-xs font-medium leading-[14.40px]">
                                  Match Type
                                </div>
                                <div className="text-right text-white text-xs font-semibold leading-[14.40px]">
                                  {formattedMatch.type}
                                </div>
                              </div>
                              <div className="flex justify-between items-center w-full">
                                <div className="text-white text-xs font-medium leading-[14.40px]">
                                  Equipment Rented (if any)
                                </div>
                                <div className="text-right text-white text-xs font-medium leading-[14.40px]">
                                  {formattedMatch.equipmentRented}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <p className="text-gray-500 my-4 text-center">
                    No cancelled bookings
                  </p>
                )}
              </section>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
