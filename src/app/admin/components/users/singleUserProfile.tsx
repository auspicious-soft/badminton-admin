"use client";
import { useState } from "react";
import Image from "next/image";
import Human from "@/assets/images/Human.png";
import { EyeIcon, DownArrowIcon, UpArrowIcon } from "@/utils/svgicons";
import UserProfileImage from "@/assets/images/userProfile4.png";
import { useRouter } from "next/navigation";


// Sample detailed user data (updated to match the image)
const userDetails = {
    id: 4,
    name: "Isabella Anderson",
    email: "isabella.lee@example.com",
    phone: "+1 555-210-4569",
    city: "Chandigarh",
    loyaltyPoints: 6800,
    level: 6000, // Updated to match the image
    lastMonthLevel: 6549,
    levelThisMonth: -4,
    improvement12Months: -0.4,
    confidence: 27,
    activePadelMatches: 120,
    activePickleballMatches: 220,
    activeVouchers: 12,
};

// Sample match data for Isabella Anderson
const matches = [
    {
        date: "Nov 10, 2024, 10:00 AM",
        opponent1: "Wen Lee",
        opponent2: "Emerson White",
        opponent3: "Taylor",
        opponent4: "Bailey Allen",
        type: "Open Match",
        location: "Kemmerer Trafficway, West",
        amountPaid: "₹1000 for N/A",
        equipmentRented: "Equipment Rented (if any)",
        score: null, // No score for upcoming matches
        winner: null, // No winner for upcoming matches
        isUpcoming: true,
    },
    {
        date: "Nov 10, 2024, 08:00 AM",
        opponent1: "Wen Lee",
        opponent2: "Emerson White",
        opponent3: "Taylor",
        opponent4: "Bailey Allen",
        type: "Competitive",
        location: "Kemmerer Trafficway, Zenatown",
        amountPaid: "₹1000 for All",
        equipmentRented: "2 rackets",
        score: "4-5",
        winner: "Taylor & Bailey",
        rentedEquipmentPrice: "₹1500",
        isUpcoming: false,
    },
    {
        date: "Nov 10, 2024, 08:00 AM",
        opponent1: "Wen Lee",
        opponent2: "Emerson White",
        opponent3: "Taylor",
        opponent4: "Bailey Allen",
        type: "Competitive",
        location: "Kemmerer Trafficway, Zenatown",
        amountPaid: "₹1000 for All",
        equipmentRented: "2 rackets",
        score: "4-5",
        winner: "Taylor & Bailey",
        isUpcoming: false,
        rentedEquipmentPrice: "₹1500",
    },
    {
        date: "Nov 10, 2024, 08:00 AM",
        opponent1: "Wen Lee",
        opponent2: "Emerson White",
        opponent3: "Taylor",
        opponent4: "Bailey Allen",
        type: "Open Match",
        location: "Kemmerer Trafficway, West",
        amountPaid: "₹1000 for All",
        equipmentRented: "Equipment Rented (if any)",
        score: null,
        winner: null,
        isUpcoming: true,
    },
];

const games = ["Padel", "Pickleball"];

export default function UserProfileComponent() {
    const router = useRouter();
    const [selectedUser, setSelectedUser] = useState(userDetails); // Default to Isabella Anderson
    const [searchParams, setSearchParams] = useState("");
    const [selectedGame, setSelectedGame] = useState("");
    const [gameDropdown, setGameDropdown] = useState(false);


    const [selectedMatch, setSelectedMatch] = useState(null);
    return (
        <>
            <div className="flex w-full justify-between mb-[15px] ">
                <div className="text-[#10375c] text-3xl font-semibold">Users</div>
                <div className="relative ">
                    <button className="flex px-5 py-3 bg-[#1b2229] text-white rounded-[28px]" onClick={() => setGameDropdown(!gameDropdown)}>
                        {selectedGame || "Sort"}
                        <span className="ml-2 mt-1">{!gameDropdown ? <DownArrowIcon /> : <UpArrowIcon />}</span>
                    </button>
                    {gameDropdown && (
                        <div className="z-50 flex flex-col gap-[5px] absolute top-12 left-[-50px] p-[20px]  h-[81px] bg-white rounded-[10px] shadow-[0px_4px_20px_0px_rgba(92,138,255,0.10)]">
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
            <div className="flex flex-col lg:flex-row w-full rounded-[20px] gap-6 mb-[15px]">
                {/* Left Panel: User Details (from the image) */}
                <div className="flex flex-col gap-[20px] w-full lg:w-1/3 rounded-[20px]  ">
                    {selectedUser ? (
                        <div className="w-full bg-[#f2f2f4] rounded-[20px] ">
                            {/* Blue Header with Wave */}
                            <div className="relative w-full">
                                <svg width="100%" height="100%" viewBox="0 0 471 165" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M0 20 Q0 0 20 0 H451 Q471 0 471 20 V155.046 C471 155.046 372.679 132.651 235.5 155.046 C98.3213 177.442 0 155.046 0 155.046 Z" fill="#176dbf" />
                                </svg>
                                <div className="absolute top-0 left-0 w-full h-full flex gap-[15px] items-center p-2 text-white">
                                    <Image src={UserProfileImage} alt="User Avatar" className="rounded-full  border-2 border-white w-30 h-30 sm:w-30 sm:h-30 lg:w-16 lg:h-16" />
                                    <div>
                                        <div className="text-white text-2xl md:text-3xl font-bold leading-10 tracking-wide">{selectedUser.name}</div>
                                    </div>
                                    <div className="h-10 px-5 py-3 bg-[#10375c] rounded-[28px] gap-[5px] inline-flex mb-[30px]">
                                        <div className="text-white text-sm font-medium">₹{selectedUser.level}</div>
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
                                    <div className="self-stretch text-[#1c2329] text-sm font-semibold leading-[16.80px]">Personal Details</div>
                                    <div className="self-stretch justify-between items-center inline-flex">
                                        <div className="flex-col justify-start items-start gap-2.5 inline-flex">
                                            <div className="text-[#7e7e8a] text-xs font-medium capitalize leading-[15px]">Phone Number</div>
                                            <div className="text-[#7e7e8a] text-xs font-medium capitalize leading-[15px]">Email Address</div>
                                            <div className="text-[#7e7e8a] text-xs font-medium capitalize leading-[15px]">City</div>
                                        </div>
                                        <div className="flex-col justify-start items-end gap-2.5 inline-flex">
                                            <div className="text-right text-[#1b2229] text-xs font-bold capitalize leading-[15px]">{selectedUser.phone}</div>
                                            <div className="text-right text-[#1b2229] text-xs font-bold leading-[15px]">{selectedUser.email}</div>
                                            <div className="text-right text-[#1b2229] text-xs font-bold capitalize leading-[15px]">{selectedUser.city}</div>
                                        </div>
                                    </div>
                                </div>

                                {/* Statistics */}
                                <div className="w-[45%] ml-[30px] flex-col justify-start items-start gap-3 inline-flex mb-[30px]">
                                    <div className="self-stretch text-[#1c2329] text-sm font-semibold leading-[16.80px]">Statistics</div>
                                    <div className="self-stretch justify-between items-center inline-flex">
                                        <div className="flex-col justify-start items-start gap-2.5 inline-flex">
                                            <div className="self-stretch text-[#7e7e8a] text-xs font-medium capitalize leading-[15px]">Loyalty Points</div>
                                            <div className="self-stretch text-[#7e7e8a] text-xs font-medium capitalize leading-[15px]">Level</div>
                                            <div className="text-[#7e7e8a] text-xs font-medium capitalize leading-[15px]">Last Month Level</div>
                                            <div className="self-stretch text-[#7e7e8a] text-xs font-medium capitalize leading-[15px]">Level This Month</div>
                                            <div className="text-[#7e7e8a] text-xs font-medium capitalize leading-[15px]">Improvement</div>
                                            <div className="self-stretch text-[#7e7e8a] text-xs font-medium capitalize leading-[15px]">Confidence</div>
                                            <div className="self-stretch text-[#7e7e8a] text-xs font-medium capitalize leading-[15px]">Active Padel Matches</div>
                                            <div className="self-stretch text-[#7e7e8a] text-xs font-medium capitalize leading-[15px]">Active Pickleball Matches</div>
                                            <div className="self-stretch text-[#7e7e8a] text-xs font-medium capitalize leading-[15px]">Active Vouchers</div>
                                        </div>
                                        <div className="flex-col justify-start items-end gap-2.5 inline-flex">
                                            <div className="text-right text-[#1b2229] text-xs font-bold capitalize leading-[15px]">{selectedUser.loyaltyPoints}</div>
                                            <div className="text-right text-[#1b2229] text-xs font-bold capitalize leading-[15px]">{selectedUser.level}</div>
                                            <div className="text-right text-[#1b2229] text-xs font-bold capitalize leading-[15px]">{selectedUser.lastMonthLevel}</div>
                                            <div className="self-stretch text-right text-[#1b2229] text-xs font-bold capitalize leading-[15px]">{selectedUser.levelThisMonth}</div>
                                            <div className="text-right text-[#1b2229] text-xs font-bold capitalize leading-[15px]">{selectedUser.improvement12Months}%</div>
                                            <div className="self-stretch text-right text-[#1b2229] text-xs font-bold capitalize leading-[15px]">{selectedUser.confidence}%</div>
                                            <div className="self-stretch text-right text-[#1b2229] text-xs font-bold capitalize leading-[15px]">{selectedUser.activePadelMatches}</div>
                                            <div className="self-stretch text-right text-[#1b2229] text-xs font-bold capitalize leading-[15px]">{selectedUser.activePickleballMatches}</div>
                                            <div className="self-stretch text-right text-[#1b2229] text-xs font-bold capitalize leading-[15px]">{selectedUser.activeVouchers}</div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                        </div>
                    ) : (
                        <p className="text-center text-gray-500">Select a user to see details</p>
                    )}
                    <div className="w-full px-[20px] py-[18px] bg-[#f2f2f4] rounded-[20px]  ">
                        <div className="w-full flex justify-between">
                                <div className="flex flex-col gap-[10px]">
                                    <div className=" text-[#7e7e8a] text-xs font-medium capitalize leading-[15px]">Total Matches</div>
                                    <div className=" text-center text-[#1b2229] text-xs font-bold capitalize leading-[15px]">240</div>
                                </div>
                                <div className="flex flex-col gap-[10px]">
                                    <div className=" text-[#7e7e8a] text-xs font-medium capitalize leading-[15px]">Paddle Matches</div>
                                    <div className="text-center text-[#1b2229] text-xs font-bold capitalize leading-[15px] ">120</div>
                                </div>
                                <div className="flex flex-col gap-[10px]">
                                    <div className="text-[#7e7e8a] text-xs font-medium capitalize leading-[15px] ">Pickleball Matches</div>
                                    <div className="text-center text-[#1b2229] text-xs font-bold capitalize leading-[15px] ">120</div>
                                </div>
                        </div>
                    </div>
                         <div className=" px-5 py-4 bg-[#f2f2f4] rounded-[20px] justify-between items-center inline-flex">
                          <div className="text-right text-[#1b2229] text-xs font-bold capitalize leading-[15px]">Active Vouchers</div>
                          <div className="text-right text-[#1b2229] text-xs font-bold capitalize leading-[15px]">12</div>
                        </div>
                </div>

                {/* Right Panel: User List (with matches from the image) */}
                <div className="h-[80vh] md:h-[calc(100vh)] w-full lg:w-2/3 bg-[#f2f2f4] shadow-md rounded-[20px] p-[14px] overflow-y-auto overflo-custom ">
                    {/* Upcoming Matches Section */}
                    <div className="mt-6">
                        <h3 className="text-[#10375c] text-xl font-semibold mb-4">Upcoming Matches</h3>
                        {matches
                            .filter((match) => match.isUpcoming)
                            .map((match, index) => (
                                <div key={index} className="flex flex-col gap-[10px] w-full mb-[20px]">
                                    {/* <div className="w-full h-[0px] border border-dotted border-[#d0d0d0] my-[10px]"></div> */}

                                    <div className="flex items-center w-full gap-[10px] flex-col md:flex-row ">
                                        <div className="h-full p-[30px] bg-white rounded-[10px]  w-full lg:w-max ">
                                            <div className="h-[17px] w-full justify-between items-center inline-flex mb-[20px]">
                                                <div className="text-center text-[#1b2229] text-sm font-semibold leading-[16.80px]">Paddle Match</div>
                                                <div className="text-right text-[#1b2229] text-sm font-semibold leading-[16.80px]">{match.date}</div>
                                            </div>
                                            <div className="flex items-center gap-[20px] w-full">
                                                <div className="w-1/2 flex flex-col gap-1">
                                                    <Image src={UserProfileImage} alt={`${match.opponent1} Avatar`} className="w-[60px] h-[60px] rounded-full" width={60} height={60} />
                                                    <div className=" text-center text-[#1b2229] word-break text-xs font-medium leading-[12px]">{match.opponent1}</div>
                                                </div>
                                                <div className="w-1/2 flex flex-col gap-1">
                                                    <Image src={UserProfileImage} alt={`${match.opponent2} Avatar`} className="w-[60px] h-[60px] rounded-full" width={60} height={60} />
                                                    <div className=" text-center text-[#1b2229] word-break text-xs font-medium leading-[12px]">{match.opponent2}</div>

                                                </div>
                                                <span className="text-[#7e7e8a] text-xs">vs</span>
                                                <div className="w-1/2 flex flex-col gap-1">
                                                    <Image src={UserProfileImage} alt={`${match.opponent3} Avatar`} className="w-[60px] h-[60px] rounded-full" width={60} height={60} />
                                                    <div className=" text-center text-[#1b2229] word-break text-xs font-medium leading-[12px]">{match.opponent3}</div>

                                                </div>
                                                <div className="w-1/2 flex flex-col gap-1">
                                                    <Image src={UserProfileImage} alt={`${match.opponent4} Avatar`} className="w-[60px] h-[60px] rounded-full" width={60} height={60} />
                                                    <div className=" text-center text-[#1b2229] word-break text-xs font-medium leading-[12px]">{match.opponent4}</div>

                                                </div>
                                            </div>
                                        </div>

                                        <div className=" w-full md:w-1/2 p-[25px] bg-[#176dbf] rounded-[10px] justify-center items-center gap-5 flex">
                                            <div className="w-full flex-col justify-center items-center gap-[15px] inline-flex">

                                                <div className="w-full  items-center flex justify-between">
                                                    <div className=" text-white text-xs font-medium leading-[14.40px]">Amount Paid</div>
                                                    <div className=" text-right text-white text-xs font-semibold leading-[14.40px]">{match.amountPaid}</div>
                                                </div>
                                                <div className=" w-full  flex justify-between items-center ">
                                                    <div className="text-white text-xs font-medium leading-[14.40px]">Location</div>
                                                    <div className=" text-right text-white text-xs font-semibold leading-[14.40px]">{match.location}</div>
                                                </div>
                                                <div className="flex justify-between items-center w-full ">
                                                    <div className="text-white text-xs font-medium leading-[14.40px]">Game Type</div>
                                                    <div className=" text-right text-white text-xs font-semibold leading-[14.40px]">Padel</div>
                                                </div>
                                                <div className="flex justify-between items-center w-full ">
                                                    <div className="text-white text-xs font-medium leading-[14.40px]">Match Type</div>
                                                    <div className=" text-right text-white text-xs font-semibold leading-[14.40px]">{match.type}</div>
                                                </div>
                                                <div className="flex justify-between items-center w-full ">
                                                    <div className=" text-white text-xs font-medium leading-[14.40px]">Equipment Rented(if any)</div>
                                                    <div className=" text-right text-white text-xs font-medium leading-[14.40px]">{match.equipmentRented}</div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}

                        {/* Previous Matches Section */}
                        <h3 className="text-[#10375c] text-xl font-semibold mb-4">Previous Matches</h3>
                        {matches
                            .filter((match) => !match.isUpcoming)
                            .map((match, index) => (
                                <div key={index} className="flex flex-col w-full">

                                    <div className="flex items-center w-full gap-[10px] flex-col md:flex-row ">
                                        <div className="h-full p-[30px] bg-white rounded-[10px]  w-full lg:w-max ">
                                            <div className="h-[17px] w-full justify-between items-center inline-flex mb-[20px]">
                                                <div className="text-center text-[#1b2229] text-sm font-semibold leading-[16.80px]">Paddle Match</div>
                                                <div className="text-right text-[#1b2229] text-sm font-semibold leading-[16.80px]">{match.date}</div>
                                            </div>
                                            <div className="flex items-center gap-[20px] w-full">
                                                <div className="w-1/2 flex flex-col gap-1">
                                                    <Image src={UserProfileImage} alt={`${match.opponent1} Avatar`} className="w-[60px] h-[60px] rounded-full" width={60} height={60} />
                                                    <div className=" text-center text-[#1b2229] word-break text-xs font-medium leading-[12px]">{match.opponent1}</div>
                                                </div>
                                                <div className="w-1/2 flex flex-col gap-1">
                                                    <Image src={UserProfileImage} alt={`${match.opponent2} Avatar`} className="w-[60px] h-[60px] rounded-full" width={60} height={60} />
                                                    <div className=" text-center text-[#1b2229] word-break text-xs font-medium leading-[12px]">{match.opponent2}</div>

                                                </div>
                                                <span className="text-[#7e7e8a] text-xs">vs</span>
                                                <div className="w-1/2 flex flex-col gap-1">
                                                    <Image src={UserProfileImage} alt={`${match.opponent3} Avatar`} className="w-[60px] h-[60px] rounded-full" width={60} height={60} />
                                                    <div className=" text-center text-[#1b2229] word-break text-xs font-medium leading-[12px]">{match.opponent3}</div>

                                                </div>
                                                <div className="w-1/2 flex flex-col gap-1">
                                                    <Image src={UserProfileImage} alt={`${match.opponent4} Avatar`} className="w-[60px] h-[60px] rounded-full" width={60} height={60} />
                                                    <div className=" text-center text-[#1b2229] word-break text-xs font-medium leading-[12px]">{match.opponent4}</div>
                                                </div>
                                            </div>
                                            <div className=" w-full flex-col justify-start items-center gap-2 inline-flex mt-[15px]">
                                                <div className="self-stretch text-center text-[#1b2229] text-sm font-semibold leading-[16.80px]">Score</div>
                                                <div className="self-stretch justify-between items-center inline-flex">
                                                    <div className="w-1/2 justify-start items-center flex">
                                                        <div className="self-stretch flex-col justify-center items-start gap-2.5 inline-flex">
                                                            <div className="text-center text-[#1b2229] text-xs font-medium  leading-[12px]">Wren & Emerson </div>
                                                            <div className="w-full h-[0px] border border-[#d6d6d6]"></div>
                                                            <div className="text-center text-[#1b2229] text-xs font-medium  leading-[14.40px]">Taylor  & Bailey</div>
                                                        </div>
                                                    </div>
                                                    <div className="text-center text-[#1b2229] text-xs font-medium ">Game</div>
                                                    <div className="flex-col justify-center items-end gap-2.5 inline-flex">
                                                        <div className="justify-start items-start gap-2.5 inline-flex">
                                                            <div className="text-center text-[#1b2229] text-xs font-medium  leading-[14.40px]">4</div>
                                                            <div className="text-center text-[#1b2229] text-xs font-medium  leading-[14.40px]">5</div>
                                                            <div className="text-center text-[#1b2229] text-xs font-medium  leading-[14.40px]">5</div>
                                                        </div>
                                                        <div className=" h-[0px] border border-[#d6d6d6]"></div>
                                                        <div className="justify-start items-start gap-2.5 inline-flex">
                                                            <div className="text-center text-[#1b2229] text-xs font-medium  leading-[14.40px]">4</div>
                                                            <div className="text-center text-[#1b2229] text-xs font-medium  leading-[14.40px]">5</div>
                                                            <div className="text-center text-[#1b2229] text-xs font-medium  leading-[14.40px]">5</div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className=" w-full md:w-1/2 p-[25px] bg-[#176dbf] rounded-[10px] justify-center items-center gap-5 flex">
                                            <div className="w-full flex-col justify-center items-center gap-[15px] inline-flex">
                                                <div className="w-full  items-center flex justify-between">
                                                    <div className=" text-white text-xs font-medium leading-[14.40px]">Winner Of the Match</div>
                                                    <div className=" text-right text-white text-xs font-semibold leading-[14.40px]">{match.winner}</div>
                                                </div>
                                                <div className="w-full  items-center flex justify-between">
                                                    <div className=" text-white text-xs font-medium leading-[14.40px]">Amount Paid</div>
                                                    <div className=" text-right text-white text-xs font-semibold leading-[14.40px]">{match.amountPaid}</div>
                                                </div>
                                                <div className=" w-full  flex justify-between items-center ">
                                                    <div className="text-white text-xs font-medium leading-[14.40px]">Location</div>
                                                    <div className=" text-right text-white text-xs font-semibold leading-[14.40px]">{match.location}</div>
                                                </div>
                                                <div className="flex justify-between items-center w-full ">
                                                    <div className="text-white text-xs font-medium leading-[14.40px]">Game Type</div>
                                                    <div className=" text-right text-white text-xs font-semibold leading-[14.40px]">Padel</div>
                                                </div>
                                                <div className="flex justify-between items-center w-full ">
                                                    <div className="text-white text-xs font-medium leading-[14.40px]">Match Type</div>
                                                    <div className=" text-right text-white text-xs font-semibold leading-[14.40px]">{match.type}</div>
                                                </div>
                                                <div className="flex justify-between items-center w-full ">
                                                    <div className=" text-white text-xs font-medium leading-[14.40px]">Equipment Rented(if any)</div>
                                                    <div className=" text-right text-white text-xs font-medium leading-[14.40px]">{match.equipmentRented}</div>
                                                </div>
                                                <div className="flex justify-between items-center w-full ">
                                                    <div className=" text-white text-xs font-medium leading-[14.40px]">Price of Equipment Rented</div>
                                                    <div className=" text-right text-white text-xs font-medium leading-[14.40px]">{match.rentedEquipmentPrice}</div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    {index === 0 && (
                                        <div className="w-full h-[0px] border border-dotted border-[#d0d0d0] my-[10px]" />
                                    )}
                                </div>

                            ))}
                    </div>
                </div>
            </div>
        </>
    );
}
