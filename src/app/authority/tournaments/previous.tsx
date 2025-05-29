"use client";
import React, { useState } from "react";
import Image from "next/image";
import { UpArrowIcon, DownArrowIcon, Downarrow,Winner, Calender } from "@/utils/svgicons";
import MatchImage from "@/assets/images/padelImage.png";
import chanceAndBrandon from "@/assets/images/chanceAndBrandon.png";
import cbBackImage from "@/assets/images/cbBackImage.png";
import ThirdImage from "@/assets/images/ThirdImage.png";
import TwoImage from "@/assets/images/TwoImage.png";
import FirstImage from "@/assets/images/FirstImage.png";


const Page = () => {
  const [gameDropdown, setGameDropdown] = useState({});
  const [selectedGame, setSelectedGame] = useState({});
  const games = ["Padel", "Pickleball"];

  const toggleDropdown = (index) => {
    setGameDropdown((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  const selectGame = (index, game) => {
    setSelectedGame((prev) => ({
      ...prev,
      [index]: game,
    }));
    setGameDropdown((prev) => ({
      ...prev,
      [index]: false,
    }));
  };

  const players = [
    { team: 1, image: FirstImage, name: "Maria", score: "2.1" },
    { team: 1, image: TwoImage, name: "John", score: "2.1" },
    { team: 2, image1: ThirdImage, name1: "Lorem", score1: "2.1" },
    { team: 2, image2: chanceAndBrandon, name2: "Ipsum", score2: "2.1" },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <h1 className="text-[#10375c] text-2xl md:text-3xl font-semibold mb-6">Name of the Tournament</h1>

      <div className="flex flex-col lg:flex-row bg-[#f2f2f4] rounded-[20px] p-4 gap-6">
        {/* Left Side */}
        <div className="w-full lg:w-1/2">
          <div className="space-y-6">
            <Image 
              className="rounded-[10px] w-full h-auto object-cover" 
              alt="padel game image" 
              src={MatchImage} 
              width={500} 
              height={300} 
            />
            <div className="text-[#10375c] text-xl md:text-2xl font-semibold">Name of the tournament</div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { label: "Date of Tournament", value: "22 Dec 2024 - 10 Jan 2025" },
                { label: "Time", value: "09:30 AM - 06:30PM" },
                { label: "No of Teams", value: "16", icon: <Downarrow /> },
                { label: "Last Day of Registration", value: "14 Dec 2024" },
                { label: "Format", value: "Knockout" },
                { label: "Winning Reward", value: "Trophy and Cash Prize" },
              ].map((item, index) => (
                <div key={index} className="space-y-2">
                  <div className="text-[#1b2229] text-xs font-medium">{item.label}</div>
                  <div className="bg-white rounded-[39px] px-4 py-2.5 flex items-center">
                    <div className="text-black/60 text-xs font-medium flex items-center gap-2">
                      {item.value} {item.icon}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Section */}
        <div className="w-full lg:w-1/2 bg-white rounded-[20px] p-4 md:p-6">
          <h2 className="text-[#10375c] text-lg md:text-xl font-medium mb-6">Teams Joined</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
            {["Chance & Brandon", "Charlie & Madelyn", "Jocelyn & Kadin", "Corey & Kierra", "Skylar & Carter", "Cooper & Giana"].map((team, index) => (
              <div key={index} className="flex items-center bg-[#0E3A5A] text-white rounded-full px-4 py-2">
                <div className="relative w-8 h-8 mr-2 flex-shrink-0">
                  <Image 
                    className="w-[30px] h-[30px] absolute left-0 top-0 rounded-full border border-[#10375c] object-cover" 
                    src={cbBackImage} 
                    alt="team member 1" 
                  />
                  <Image 
                    className="w-[30px] h-[30px] absolute left-[10px] top-0 rounded-full border border-[#10375c]" 
                    src={chanceAndBrandon} 
                    alt="team member 2" 
                  />
                </div>
                <span className="text-sm font-medium truncate">{team}</span>
              </div>
            ))}
          </div>

          <div className="text-[#10375c] text-lg md:text-xl font-medium mb-4">Standings</div>

          <div className="bg-[#f2f2f4] rounded-[10px] p-4 md:p-5">
            {/* Finals Section */}
            <div className="text-[#1b2229] text-base md:text-lg font-semibold">Finals</div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-4">
              {players.slice(0, 2).map((player, index) => (
                <div key={index} className="bg-white rounded-[10px] p-4">
                  <div className="flex justify-end mb-4">
                    <div className="bg-[#1b2229] rounded-[28px] px-5 py-1.5">
                      <div className="text-white text-[10px] font-medium">Edit</div>
                    </div>
                  </div>

                  <div className="flex flex-wrap justify-center gap-2 md:gap-4 items-center">
                    <div className="text-center">
                      <Winner />
                      <Image src={FirstImage} alt="first image" className="w-12 h-12 rounded-full object-cover mx-auto" />
                      <div className="text-white text-[8px] font-normal mt-1">2.1</div>
                      <div className="text-[#5f6a7c] text-[10px] font-medium">John</div>
                    </div>

                    <div className="text-center">
                      <Winner />
                      <Image src={TwoImage} alt="second image" className="w-12 h-12 rounded-full object-cover mx-auto" />
                      <div className="text-white text-[8px] font-normal mt-1">2.1</div>
                      <div className="text-[#5f6a7c] text-[10px] font-medium">Maria</div>
                    </div>

                    <div className="w-10 h-[2px] bg-[#d6d6d6] md:hidden" />

                    <div className="text-center">
                      <Image src={ThirdImage} alt="third image" className="w-12 h-12 rounded-full object-cover mx-auto" />
                      <div className="text-white text-[8px] font-normal mt-1">2.1</div>
                      <div className="text-[#5f6a7c] text-[10px] font-medium">Lorem</div>
                    </div>

                    <div className="text-center">
                      <Winner />
                      <Image src={chanceAndBrandon} alt="fourth image" className="w-12 h-12 rounded-full object-cover mx-auto" />
                      <div className="text-white text-[8px] font-normal mt-1">2.1</div>
                      <div className="text-[#5f6a7c] text-[10px] font-medium">Ipsum</div>
                    </div>
                  </div>

                  <div className="flex justify-center items-center gap-2 mt-4">
                    <Calender />
                    <div className="text-[#5f6a7c] text-[10px] font-medium">Nov 10, 2024 | 08:00 A.M.</div>
                  </div>

                  <div className="bg-white rounded-[5px] p-2.5 mt-4">
                    <div className="flex justify-between items-center">
                      <div className="space-y-2">
                        <div className="text-[#10375c] text-[10px] font-semibold">Maria</div>
                        <div className="h-[1px] bg-[#d6d6d6]" />
                        <div className="text-[#10375c] text-[10px] font-semibold">Lorem Ipsum</div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-[#5f6a7c] text-[10px] font-medium">Game</div>
                        <div className="space-y-2">
                          <div className="flex gap-4">
                            <div className="text-[#5f6a7c] text-xs font-semibold">-</div>
                            <div className="text-[#5f6a7c] text-xs font-semibold">-</div>
                            <div className="text-[#5f6a7c] text-xs font-semibold">-</div>
                          </div>
                          <div className="h-[1px] bg-[#d6d6d6]" />
                          <div className="flex gap-4">
                            <div className="text-[#5f6a7c] text-xs font-semibold">-</div>
                            <div className="text-[#5f6a7c] text-xs font-semibold">-</div>
                            <div className="text-[#5f6a7c] text-xs font-semibold">-</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Semi Finals Section */}
            <div className="text-[#1b2229] text-base md:text-lg font-semibold mt-6">Semi Finals</div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-4">
              {players.map((player, index) => (
                <div key={index} className="bg-white rounded-[10px] p-4">
                  <div className="flex justify-end mb-4">
                    <div className="bg-[#1b2229] rounded-[28px] px-5 py-1.5">
                      <div className="text-white text-[10px] font-medium">Edit</div>
                    </div>
                  </div>

                  <div className="flex flex-wrap justify-center gap-2 md:gap-4 items-center">
                    <div className="text-center">
                      <Winner />
                      <Image src={FirstImage} alt="first image" className="w-12 h-12 rounded-full object-cover mx-auto" />
                      <div className="text-white text-[8px] font-normal mt-1">2.1</div>
                      <div className="text-[#5f6a7c] text-[10px] font-medium">John</div>
                    </div>

                    <div className="text-center">
                      <Winner />
                      <Image src={TwoImage} alt="second image" className="w-12 h-12 rounded-full object-cover mx-auto" />
                      <div className="text-white text-[8px] font-normal mt-1">2.1</div>
                      <div className="text-[#5f6a7c] text-[10px] font-medium">Maria</div>
                    </div>

                    <div className="w-10 h-[2px] bg-[#d6d6d6] md:hidden" />

                    <div className="text-center">
                      <Image src={ThirdImage} alt="third image" className="w-12 h-12 rounded-full object-cover mx-auto" />
                      <div className="text-white text-[8px] font-normal mt-1">2.1</div>
                      <div className="text-[#5f6a7c] text-[10px] font-medium">Lorem</div>
                    </div>

                    <div className="text-center">
                      <Winner />
                      <Image src={chanceAndBrandon} alt="fourth image" className="w-12 h-12 rounded-full object-cover mx-auto" />
                      <div className="text-white text-[8px] font-normal mt-1">2.1</div>
                      <div className="text-[#5f6a7c] text-[10px] font-medium">Ipsum</div>
                    </div>
                  </div>

                  <div className="flex justify-center items-center gap-2 mt-4">
                    <Calender />
                    <div className="text-[#5f6a7c] text-[10px] font-medium">Nov 10, 2024 | 08:00 A.M.</div>
                  </div>

                  <div className="bg-white rounded-[5px] p-2.5 mt-4">
                    <div className="flex justify-between items-center">
                      <div className="space-y-2">
                        <div className="text-[#10375c] text-[10px] font-semibold">Maria</div>
                        <div className="h-[1px] bg-[#d6d6d6]" />
                        <div className="text-[#10375c] text-[10px] font-semibold">Lorem Ipsum</div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-[#5f6a7c] text-[10px] font-medium">Game</div>
                        <div className="space-y-2">
                          <div className="flex gap-4">
                            <div className="text-[#5f6a7c] text-xs font-semibold">-</div>
                            <div className="text-[#5f6a7c] text-xs font-semibold">-</div>
                            <div className="text-[#5f6a7c] text-xs font-semibold">-</div>
                          </div>
                          <div className="h-[1px] bg-[#d6d6d6]" />
                          <div className="flex gap-4">
                            <div className="text-[#5f6a7c] text-xs font-semibold">-</div>
                            <div className="text-[#5f6a7c] text-xs font-semibold">-</div>
                            <div className="text-[#5f6a7c] text-xs font-semibold">-</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;