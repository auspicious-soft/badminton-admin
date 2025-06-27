"use client";
import Image from "next/image";
import React, { useState } from "react";
import MatchImage from "@/assets/images/padelImage.png";
import UserProfile from "@/assets/images/userprofile.png";
import UserProfile2 from "@/assets/images/UserProfile2.png";
import UserProfile3 from "@/assets/images/userProfile3.png";
import UserProfile4 from "@/assets/images/userProfile4.png";
import {
  CrossIcon,
  CrossIcon1,
  DownArrowIcon,
  UpArrowIcon,
} from "@/utils/svgicons";
import CustomSelect from "@/app/components/CustomSelect";
import RefundConfirmationModal from "@/app/authority/components/Matches/refundConfirmationModal";


const Page = () => {
  const [gameDropdown, setGameDropdown] = useState(false);
  const [selectedGame, setSelectedGame] = useState("");
  const [open, setOpen] = useState(false);

  const games = ["Padel", "Pickleball"];
  return (
    <div className=" ">
      <div className="text-[#10375c] text-3xl font-semibold mb-4 ">Matches</div>
      <div className="w-full h-auto  mb-[25px] bg-[#f2f2f4]  rounded-[20px] px-[15px] py-[14px] flex flex-col  gap-[24px] md:flex-row">
        {/* Left */}
        <div className="w-full">
          <div className="bg-gray-100 p-6 rounded-lg shadow-md mx-auto ">
            <Image
              className="rounded-[10px] h-[50%] w-full"
              alt="padel game image"
              src={MatchImage}
              width={500}
            />

            <div className="grid grid-cols-2 gap-4 mt-10">
              <div>
                <label className="block text-[#1b2229] text-xs font-medium">
                  Date of Match
                </label>
                <input
                  type="date"
                  className="w-full h-[45px] text-xs p-2 border rounded-2xl bg-white"
                />
              </div>
              <div>
                <label className="block text-[#1b2229] text-xs">Time</label>
                <input
                  type="time"
                  className="w-full h-[45px] text-xs p-2 border rounded-2xl bg-white"
                />
              </div>
              <div>
                <label className="block text-[#1b2229] text-xs">
                  Select Game
                </label>
                <select className="w-full h-[45px] text-xs p-2 border rounded-2xl bg-white">
                  <option>Padel</option>
                  <option>Pickleball</option>
                </select>
              </div>
              <div>
                <label className="block text-[#1b2229] text-xs">
                  Court Booking Time
                </label>
                <input
                  type="time"
                  className="w-full h-[45px] text-xs p-2 border rounded-2xl bg-white"
                />
              </div>
              <div>
                <label className="block text-[#1b2229] text-xs">
                  No of Players Joined
                </label>
                <input
                  type="number"
                  className="w-full h-[45px] text-xs p-2 border rounded-2xl bg-white"
                />
              </div>
              <div>
                <label className="block text-[#1b2229] text-xs">
                  Amount Paid
                </label>
                <input
                  type="number"
                  className="w-full h-[45px] text-xs p-2 border rounded-2xl bg-white"
                />
              </div>
              <div>
                <label className="block text-gray-600 text-sm">
                  Pending Payment
                </label>
                <input
                  type="number"
                  className="w-full h-[45px] text-xs p-2 border rounded-2xl bg-white"
                />
              </div>
              <div>
                <label className="block text-gray-600 text-sm">Discount</label>
                <input
                  type="number"
                  className="w-full h-[45px] text-xs p-2 border rounded-2xl bg-white"
                />
              </div>
            </div>

            <button
              className="h-12   pt-[10px]  py-4 bg-[#10375c] rounded-[28px] mt-6 w-full text-white text-sm font-medium justify-center mb-[10px]"
              onClick={() => setOpen(true)}
            >
              Save
            </button>
          </div>
        </div>
      
        {/* RiGHT */}
        <div className="w-full  bg-white rounded-[20px]">
          <div className="text-[#10375c] text-xl font-medium   pt-[30px] px-[30px] ">
            Players Joined
          </div>

          <div className="text-[#1b2229] text-xs font-medium flex-wrap pt-[15px] px-[30px]">
            Team 1
          </div>

          <div className="grid sm:grid-cols-2 gap-4 w-full px-4 m-[10px]">
            {[UserProfile, UserProfile2].map((image, index) => (
              <div
                key={index}
                className="flex gap-x-6 p-7 items-center border rounded-xl justify-between"
              >
                <div className="flex gap-x-6 items-center">
                  <Image
                    className="w-[30px] h-[30px] rounded-full border border-[#10375c]"
                    src={image}
                    width={100}
                    height={100}
                    alt={`user profile ${index + 1}`}
                  />
                  <div className="text-[#1b2229] text-xs font-semibold justify-between leading-[14.40px]">
                    {index === 0 ? "Ella Lewis" : "Isabella Anderson"}
                  </div>
                </div>
                <CrossIcon1 />
              </div>
            ))}
          </div>

          <div className="text-[#1b2229] text-xs font-medium flex-wrap pt-[15px] px-[30px]">
            Team 2
          </div>

          <div className="grid sm:grid-cols-2 gap-4 m-[10px] w-full px-4">
            {[UserProfile3, UserProfile4].map((image, index) => (
              <div
                key={index}
                className="flex gap-x-6 p-7 items-center border rounded-xl justify-between"
              >
                <div className="flex gap-x-6 items-center">
                  <Image
                    className="w-[30px] h-[30px] rounded-full border border-[#10375c]"
                    src={image}
                    width={100}
                    height={100}
                    alt={`user profile ${index + 3}`}
                  />
                  <div className="text-[#1b2229] text-xs font-semibold justify-between leading-[14.40px]">
                    {index === 0 ? "Michael Jones" : "Natalie Clark"}
                  </div>
                </div>
                <CrossIcon1 />
              </div>
            ))}
          </div>
        </div>
      </div>
      {/* {open  && <RefundConfirmationModal setOpen={setOpen} open={open}/>} */}
    </div>
  );
};

export default Page;
