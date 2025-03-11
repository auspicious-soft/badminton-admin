"use client";
import { WhiteDownArrow, BottomArrow, Edit, Add, EyeIcon, Eye } from "@/utils/svgicons";
import React, { useState } from "react";
import SearchBar from "../components/SearchBar";
import Image from "next/image";
import Select, { MultiValue } from "react-select";
import AlexParker from "@/assets/images/AlexParker.png";
import Ball from "@/assets/images/Ball.png";
import { UpArrowIcon, DownArrowIcon } from "@/utils/svgicons";

const employees = [
  { id: 1, name: "Alex Parker", status: "Working", email: "janesmith@example.com", phonenumber: "+1 (555) 234-5678" },
  { id: 2, name: "Jordan Lee", status: "Ex-Employee", email: "sophia.brown@example.com", phonenumber: "+1 (555) 456-7890" },
  { id: 3, name: "Tracy Martin", status: "Working", email: "mia.johnson@example.co", phonenumber: "+1 (555) 765-4321" },
  { id: 4, name: "Jordan Lee", status: "Ex-Employee", email: "isabella.lee@example.com", phonenumber: "+1 (555) 234-5678" },
  { id: 5, name: "Marley Martinez", status: "Working", email: "jacob.davis@example.com", phonenumber: "+1 (555) 234-5888" },
  { id: 6, name: "Tracy Martin", status: "Ex-Employee", email: "sophia.brown@example.com", phonenumber: "+1 (555) 234-5778" },
  { id: 7, name: "Alex Parker", status: "Working", email: "lucas.martinez@example.com", phonenumber: "+1 (555) 234-8768" },
  { id: 8, name: "Alex Parker", status: "Ex-Employee", email: "emily.jones@example.com", phonenumber: "+1 (555) 234-9847" },
  { id: 9, name: "Marley Martinez", status: "Working", email: "ava.martinez@example.com", phonenumber: "+1 (555) 234-5777" },
  { id: 10, name: "Alex Parker", status: "Ex-Employee", email: "emily.jones@example.com", phonenumber: "+1 (555) 234-5778" },
  { id: 11, name: "Alex Parker", status: "Working", email: "bob.johnson@example.comm", phonenumber: "+1 (555) 234-5348" },
  { id: 12, name: "Marley Martinez", status: "Ex-Employee", email: "emily.jones@example.com", phonenumber: "+1 (555) 234-5668" },
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
  const [selectedMatch, setSelectedMatch] = useState({
    id: 1,
    name: "Alex Parker",
    status: "Working",
    email: "janesmith@example.com",
    phonenumber: "+1 (555) 234-5678",
  });

  const [searchParams, setSearchParams] = useState("");
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
        {/* left Side */}
        <div className="bg-[#F2F2F4] rounded-[10px] w-full lg:w-[40%] py-4 px-4 lg:py-6 lg:px-6">
          <div className="relative w-full h-[262px]">
            {selectedImage ? (
              <Image src={selectedImage} alt="Selected" className="w-full h-full rounded-[10px] object-cover" />
            ) : (
              <Image className="w-full h-full rounded-[10px] object-cover" src={Ball} alt="Ball Image" />
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

        {/* right side */}
        <div className="bg-[#F2F2F4] rounded-[10px] w-full py-4 px-4 lg:py-6 lg:px-6">
          <div className="text-[#10375C] mb-4 text-xl font-semibold">Credentials</div>
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
      </div>
    </>
  );
};

export default AllEmployeeComponent;