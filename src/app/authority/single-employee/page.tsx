"use client";
import { WhiteDownArrow, BottomArrow, Edit, Add, EyeIcon, Eye } from "@/utils/svgicons";
import React, { useState } from "react";
import SearchBar from "../components/SearchBar";
import Image from "next/image";
import Select, { MultiValue } from "react-select";
import AlexParker from "@/assets/images/AlexParker.png";
import Ball from "@/assets/images/Ball.png";
import { UpArrowIcon, DownArrowIcon } from "@/utils/svgicons";

interface Employee {
  id: number;
  date: string;
  logintime: string;
  logouttime: string;
}

const employees: Employee[] = [
  { id: 1, date: "03/01/2020", logintime: "11:30 AM", logouttime: "9:45 PM" },
  { id: 2, date: "18/01/2020", logintime: "6:00 AM", logouttime: "5:45 PM" },
  { id: 3, date: "29/01/2020", logintime: "8:45 PM", logouttime: "2:00 AM" },
  { id: 4, date: "12/01/2020", logintime: "3:30 AM", logouttime: "9:00 AM" },
  { id: 5, date: "05/01/2020", logintime: "6:00 AM", logouttime: "5:45 PM" },
  { id: 6, date: "31/01/2020", logintime: "3:00 AM", logouttime: "6:45 PM" },
  { id: 7, date: "08/01/2020", logintime: "5:00 AM", logouttime: "7:45 PM" },
  { id: 8, date: "10/01/2020", logintime: "10:00 AM", logouttime: "8:45 PM" },
  { id: 9, date: "16/01/2020", logintime: "9:00 AM", logouttime: "9:45 PM" },
  { id: 10, date: "14/01/2020", logintime: "8:00 AM", logouttime: "5:45 PM" },
];

const games = ["Working", "Ex-Employee"];

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
  { value: "Ex-Employee", label: "Ex-Employee" },
  { value: "Working", label: "Working" },
];

const AllEmployeeComponent = () => {
  const [formData, setFormData] = useState<NotificationData>({
    title: "",
    text: "",
    recipients: [],
  });

  const [selectedGame, setSelectedGame] = useState("");
  const [gameDropdown, setGameDropdown] = useState(false);
  const [selectedMatch, setSelectedMatch] = useState<Employee>({
    id: 1,
    date: "03/01/2020",
    logintime: "11:30 AM",
    logouttime: "9:45 PM",
  });

  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [dropdownStates, setDropdownStates] = useState<{ [key: number]: boolean }>({});

  const handleRecipientsChange = (selectedOptions: MultiValue<OptionType>) => {
    const recipients = selectedOptions.map((option) => option.value);
    setFormData((prev) => ({
      ...prev,
      recipients: recipients,
    }));
  };

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (selectedImage) {
        URL.revokeObjectURL(selectedImage);
      }
      const imageUrl = URL.createObjectURL(file);
      setSelectedImage(imageUrl);
    }
  };

  const toggleDropdown = (id: number) => {
    setDropdownStates((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  return (
    <>
      <div className="text-[#10375c] text-2xl md:text-3xl font-semibold mb-4">Add New Employee</div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Left Side */}
        <div className="bg-[#F2F2F4] rounded-[10px] w-full lg:w-[40%] py-4 px-4 lg:py-6 lg:px-6">
          <div className="relative w-full h-[262px]">
            {selectedImage ? (
              <Image
                src={selectedImage}
                alt="Selected"
                fill // Use fill to make the image fit the container
                className="rounded-[10px] object-cover"
              />
            ) : (
              <Image
                className="w-full h-full rounded-[10px] object-cover"
                src={Ball}
                alt="Ball Image"
                width={300} // Static width for default image
                height={262} // Matches container height
              />
            )}
            <label className="absolute bottom-2 right-2 h-12 px-4 py-2 flex bg-white rounded-full items-center gap-2 cursor-pointer">
              <Edit />
              <span className="text-black text-sm font-medium">Change Image</span>
              <input type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
            </label>
          </div>

          <div className="w-full rounded-[20px] mt-4">
            <div className="mb-4">
              <label className="text-[#1b2229] text-xs font-medium block mb-2">Name of the Employee</label>
              <input
                type="text"
                className="w-full h-12 px-4 py-2 bg-white border border-[#e6e6e6] rounded-full text-black/60 text-xs font-medium"
              />
            </div>
            <div className="mb-4">
              <label className="text-[#1b2229] text-xs font-medium block mb-2">Email Address</label>
              <input
                type="email"
                className="w-full h-12 px-4 py-2 bg-white border border-[#e6e6e6] rounded-full text-black/60 text-xs font-medium"
              />
            </div>
            <div className="mb-4">
              <label className="text-[#1b2229] text-xs font-medium block mb-2">Status</label>
              <div className="relative">
                <button
                  className="w-full h-12 px-5 py-3 border border-[#e6e6e6] rounded-full bg-white text-[#1b2229] flex justify-between items-center text-xs font-medium"
                  onClick={() => setGameDropdown(!gameDropdown)}
                >
                  {selectedGame || "Select Status"}
                  <span>{!gameDropdown ? <BottomArrow /> : <UpArrowIcon />}</span>
                </button>
                {gameDropdown && (
                  <div className="z-50 flex flex-col gap-2 absolute top-14 left-0 p-4 w-full bg-white rounded-[10px] shadow-lg">
                    {games.map((status) => (
                      <label key={status} className="flex gap-2 cursor-pointer text-[#1b2229] text-xs font-medium">
                        <input
                          type="radio"
                          name="Select Status"
                          value={status}
                          checked={selectedGame === status}
                          onChange={(e) => {
                            setSelectedGame(e.target.value);
                            console.log("Selected Status:", e.target.value);
                            setGameDropdown(false);
                          }}
                          className="accent-[#1b2229]"
                        />
                        {status}
                      </label>
                    ))}
                  </div>
                )}
              </div>
            </div>
            <button className="w-full h-12 bg-[#10375c] rounded-full text-white text-sm font-medium">Save</button>
          </div>
        </div>

        {/* Right Side */}
        <div className="w-full lg:w-[full]">
          <div className="bg-[#F2F2F4] rounded-[10px] h-auto w-full py-4 px-4 lg:py-6 lg:px-6">
            <div className=" text-[#10375c] text-xl font-medium mb-[18px]">Credentials</div>
            <div className="mb-4">
              <label className="text-[#1b2229] text-xs font-medium block mb-2">Email Address</label>
              <input
                type="email"
                className="w-full h-12 px-4 py-2 bg-white border border-[#e6e6e6] rounded-full text-black/60 text-xs font-medium"
              />
            </div>
            <div className="mb-4">
              <label className="text-[#1b2229] text-xs font-medium block mb-2">Password</label>
              <div className="flex bg-white border border-[#e6e6e6] rounded-full">
                <input
                  type="password"
                  className="w-full h-12 px-4 py-2 text-black/60 text-xs font-medium rounded-full"
                />
                <div className="flex justify-center items-center mr-2">
                  <Eye />
                </div>
              </div>
            </div>
            <button className="w-full h-12 bg-black rounded-full text-white text-sm font-medium">Save</button>
          </div>

          {/* Right Lower - Attendance */}
          <div className="h-[657px] mt-[20px] relative bg-[#f2f2f4] rounded-[20px] py-4 px-4 lg:py-6 lg:px-6">
            <div className="text-[#10375c] text-xl font-medium">Attendance</div>
            <div className="mt-[18px] ml-[10px] flex justify-between items-center">
              <div className="text-[#7e7e8a] text-xs font-medium">Date</div>
              <div className="flex justify-between min-w-[150px]">
                <div className="text-[#7e7e8a] text-xs font-medium ml-[30px]">Login Time</div>
                <div className="text-[#7e7e8a] text-xs font-medium ml-[30px]">Log Out Time</div>
              </div>
            </div>
            <div className="border-t border-gray-300 w-full mt-[8px]"></div>

            <div className="mt-2 h-[540px] overflow-y-auto overflow-x-hidden">
              {employees.map((employee, index) => (
                <div
                  key={employee.id}
                  className={`w-full cursor-pointer flex items-center p-3 rounded-[10px] mb-2 min-w-[300px] ${
                    selectedMatch?.id === employee.id
                      ? "bg-[#176dbf] text-white"
                      : index % 2 === 0
                      ? "bg-white"
                      : "bg-gray-200"
                  }`}
                  onClick={() => setSelectedMatch(employee)}
                >
                  <div className="flex items-center justify-between w-full gap-2">
                    <div
                      className={`flex-1 text-xs font-medium p-2 min-w-[80px] ${
                        selectedMatch?.id === employee.id ? "text-white" : "text-[#1b2229]"
                      }`}
                    >
                      {employee.date}
                    </div>

                    <div className="flex-1 text-xs font-medium p-2 min-w-[80px] text-right">
                      <div
                        className={`${
                          selectedMatch?.id === employee.id ? "text-white" : "text-[#1b2229]"
                        }`}
                      >
                        {employee.logintime}
                      </div>
                    </div>

                    <div
                      className={`flex-1 text-xs font-medium p-2 min-w-[80px] text-right ${
                        selectedMatch?.id === employee.id ? "text-white" : "text-[#1b2229]"
                      }`}
                    >
                      {employee.logouttime}
                    </div>
                  </div>

                  {dropdownStates[employee.id] && (
                    <div className="border border-blue-800 z-50 flex flex-col gap-2 absolute top-8 left-0 p-4 w-[180px] bg-white rounded-[10px] shadow-lg">
                      {/* Add dropdown content here if needed */}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AllEmployeeComponent;
