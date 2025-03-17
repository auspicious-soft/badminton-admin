"use client";
import { WhiteDownArrow, BottomArrow, Edit, Add, EyeIcon } from "@/utils/svgicons";
import React, { useState } from "react";
import SearchBar from "../SearchBar";
import Image from "next/image";
import Select, { MultiValue } from "react-select";
import AlexParker from "@/assets/images/AlexParker.png";
import Ball from "@/assets/images/Ball.png";
import { UpArrowIcon, DownArrowIcon } from "@/utils/svgicons";
import { useRouter } from "next/navigation";


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
const cities = ["New York", "Los Angeles", "Chicago", "Houston"];



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

const Page = () => {
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

  const router = useRouter();
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
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-[#10375c] mb-4">All Employees</h1>

      {/* Header Controls */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6">
        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
          <button className="flex h-10 px-5 py-3 bg-[#1b2229] rounded-full justify-center items-center gap-2 text-white text-sm font-medium">
            Sort <WhiteDownArrow />
          </button>


<div className="mb-4">
  <div className="relative">
    <button
    className="w-full h-10 px-5 py-3 border border-[#e6e6e6] rounded-full bg-[#1b2229] text-white flex justify-between items-center text-xs font-medium"
    onClick={() => setGameDropdown(!gameDropdown)}
    >
    {selectedGame || "Select Status"}
    <span>{!gameDropdown ? <WhiteDownArrow /> : <UpArrowIcon />}</span>
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
    className="accent-[#1b2229]" />
    {status}
    </label>
    ))}
    </div>
    )}
    </div>
    </div>
           








        </div>
        <button onClick={() => router.push("/admin/components/employees/add-new-employe")} className="flex h-10 w-full sm:w-[210px] px-5 py-3 bg-[#1b2229] rounded-full justify-between items-center gap-2 text-white text-sm font-medium">
          <Add /> Add A New Employee
        </button>
      </div>

      {/* Main Content */}
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Left Side - Employee List */}
        <div className="w-full lg:w-2/3 bg-[#f2f2f4] rounded-[20px] p-4 md:p-6 h-auto lg:h-[657px] overflow-auto">
          <div className="flex flex-col sm:flex-row justify-between items-center mb-4">
            <h2 className="text-[#10375c] text-lg md:text-xl font-medium">All Employees</h2>
            <div className="w-full sm:w-auto mt-2 sm:mt-0">
              <SearchBar setQuery={setSearchParams} query={searchParams} />
            </div>
          </div>

          {/* Table Header */}
          <div className="hidden md:flex justify-between items-center text-[#7e7e8a] text-xs font-medium mb-2">
            <div className="w-1/4">Name</div>
            <div className="w-1/4">Status</div>
            <div className="w-1/4">Email</div>
            <div className="w-1/4">Phone Number</div>
            <div className="w-1/6 text-center">Action</div>
          </div>
          <div className="hidden md:block border-t border-[#d0d0d0] mb-2"></div>

          {/* Employee List */}
          {employees.map((employee, index) => (
            <div
              key={employee.id}
              className={`w-full cursor-pointer flex flex-col md:flex-row items-start md:items-center p-3 rounded-[10px] mb-2 ${
                selectedMatch?.id === employee.id
                  ? "bg-[#176dbf] text-white"
                  : index % 2 === 0
                  ? "bg-white"
                  : "bg-gray-200"
              }`}
              onClick={() => setSelectedMatch(employee)}
            >
              <div
                className={`w-full md:w-1/4 flex items-center gap-2 text-xs font-medium p-2 ${
                  selectedMatch?.id === employee.id ? "text-white" : "text-[#1b2229]"
                }`}
              >
                <Image src={AlexParker} alt="Avatar" className="rounded-full" width={25} height={25} />
                <span className="md:hidden font-bold">Name: </span> {employee.name}
              </div>

              <div className="relative w-full md:w-1/4 p-2">
                <button
                  className="flex w-full md:w-[140px] h-[22px] px-3 py-1 bg-[#1b2229] text-white text-xs justify-between items-center rounded-full"
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleDropdown(employee.id);
                  }}
                >
                  {employee.status}
                  <span className="ml-2">
                    {!dropdownStates[employee.id] ? <DownArrowIcon /> : <UpArrowIcon />}
                  </span>
                </button>
                {dropdownStates[employee.id] && (
                  <div className="z-50 flex flex-col gap-2 absolute top-8 md:top-10 left-0 p-4 w-[180px] bg-white rounded-[10px] shadow-lg">
                    {games.map((status) => (
                      <label key={status} className="flex gap-2 cursor-pointer text-[#1b2229] text-sm font-medium">
                        <input
                          type="radio"
                          name={`status-${employee.id}`}
                          value={status}
                          checked={employee.status === status}
                          onChange={(e) => {
                            console.log("Selected Status for", employee.id, ":", e.target.value);
                            toggleDropdown(employee.id);
                          }}
                          className="accent-[#1b2229]"
                        />
                        {status}
                      </label>
                    ))}
                  </div>
                )}
              </div>

              <div
                className={`w-full md:w-1/4 text-xs font-medium p-2 ${
                  selectedMatch?.id === employee.id ? "text-white" : "text-[#1b2229]"
                }`}
              >
                <span className="md:hidden font-bold">Email: </span> {employee.email}
              </div>

              <div
                className={`w-full md:w-1/4 text-xs font-medium p-2 ${
                  selectedMatch?.id === employee.id ? "text-white" : "text-[#1b2229]"
                }`}
              >
                <span className="md:hidden font-bold">Phone: </span> {employee.phonenumber}
              </div>

              <div className="w-full md:w-1/6 text-xs font-medium p-2 flex justify-start md:justify-center">
                <EyeIcon stroke={selectedMatch?.id === employee.id ? "#FFFF" : "#fd5602"} />
              </div>
            </div>
          ))}
        </div>

        {/* Right Side - Employee Details */}
        <div className="w-full lg:w-1/3 mt-6 lg:mt-0">
          <div className="relative w-full h-[262px]">
            {selectedImage ? (
              <Image
                src={selectedImage}
                alt="Selected"
                width={300} // Added width
                height={262} // Added height (matches container height)
                className="w-full h-full rounded-[10px] object-cover"
              />
            ) : (
              <Image
                className="w-full h-full rounded-[10px] object-cover"
                src={Ball}
                alt="Ball Image"
                width={300} // Added width
                height={262} // Added height (matches container height)
              />
            )}
            <label className="absolute bottom-2 right-2 h-12 px-4 py-2 flex bg-white rounded-full items-center gap-2 cursor-pointer">
              <Edit />
              <span className="text-black text-sm font-medium">Change Image</span>
              <input type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
            </label>
          </div>

          <h2 className="text-[#10375c] text-xl md:text-2xl font-semibold mt-6">Name of the Employee</h2>

          <div className="w-full bg-white rounded-[20px] p-4 mt-4">
            <div className="mb-4">
              <label className="text-[#1b2229] text-xs font-medium block mb-2">Phone Number</label>
              <input
                type="number"
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
      </div>
    </div>
  );
};

export default Page;