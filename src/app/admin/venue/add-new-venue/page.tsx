"use client";
import React, { useState } from "react";
import Image from "next/image";
import { Add, BottomArrow, Edit, UpArrowIcon } from "@/utils/svgicons";
import Select, { MultiValue } from "react-select";
import Court from "@/assets/images/courtsmallImg.png";
import UserProfile2 from "@/assets/images/UserProfile2.png";
import CourtManagement from "../../components/headers/AddVenueModal";
import AddEmployeeModal from "../../components/headers/AddEmployeesModal";

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
 { value: "Pickleball", label: "Pickleball" },
 { value: "Paddle", label: "Paddle" },
];


const states = [
  "Andhra Pradesh",
  "Arunachal Pradesh",
  "Assam",
  "Bihar",
  "Chhattisgarh",
  "Goa",
  "Gujarat",
  "Haryana",
  "Himachal Pradesh",
  "Jharkhand",
  "Karnataka",
  "Kerala",
  "Madhya Pradesh",
  "Maharashtra",
  "Manipur",
  "Meghalaya",
  "Mizoram",
  "Nagaland",
  "Odisha",
  "Punjab",
  "Rajasthan",
  "Sikkim",
  "Tamil Nadu",
  "Telangana",
  "Tripura",
  "Uttar Pradesh",
  "Uttarakhand",
  "West Bengal",
];

const option = [
 { id: 1, label: "Free Parking" },
 { id: 2, label: "Paid Parking" },
 { id: 3, label: "Rental Equipments" },
 { id: 4, label: "Locker rooms & changing areas" },
 { id: 5, label: "Restrooms & showers" },
];

const statuses = ["Active", "In-Active"];

const Page = () => {
 const [formData, setFormData] = useState<NotificationData>({
  title: "",
  text: "",
  recipients: [],
 });

 const [selectedImage, setSelectedImage] = useState<string | null>(null);
 const [stateDropdown, setStateDropdown] = useState(false);
 const [statusDropdown, setStatusDropdown] = useState(false);
 const [selectedState, setSelectedState] = useState("");
 const [selectedStatus, setSelectedStatus] = useState("");
 const [selected, setSelected] = useState<number[]>([]);
 const [modalOpen, setModalOpen] = useState(false);
 const [employeeModalOpen, setEmployeeModalOpen] = useState(false);
 const [isActive, setIsActive] = useState(false);

 const handleToggle = () => setIsActive(!isActive);

 const toggleSelection = (id: number) => {
  setSelected((prev) => (prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]));
 };

 const handleRecipientsChange = (selectedOptions: MultiValue<OptionType>) => {
  const recipients = selectedOptions.map((option) => option.value);
  setFormData((prev) => ({ ...prev, recipients }));
 };

 const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
  const file = event.target.files?.[0];
  if (file) {
   if (selectedImage) URL.revokeObjectURL(selectedImage);
   const imageUrl = URL.createObjectURL(file);
   setSelectedImage(imageUrl);
  }
 };

 return (
  <div className="container mx-auto p-4 max-w-7xl ">
   <h1 className="text-2xl md:text-3xl font-semibold text-[#10375c] mb-6">Barnton Park LTC</h1>

   <div className="flex flex-col lg:flex-row gap-6">
{/* Left Side */}
    <div className="w-full lg:w-2/5 bg-[#f2f2f4] rounded-2xl p-4">
     <div className="relative h-64 w-full bg-[#e5e5e5] rounded-xl flex items-center justify-center mb-6">
      {selectedImage ? <Image src={selectedImage} alt="Uploaded Image" fill className="object-cover rounded-xl" /> : <span className="text-black/60 text-sm">No Image Uploaded</span>}
      <label className="absolute bottom-2 right-2 bg-white rounded-full px-2 py-1 flex items-center gap-2 cursor-pointer shadow-md">
       <Edit />
       <span className="text-sm font-medium">Change Image</span>
       <input type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
      </label>
     </div>

     <div className="space-y-4">
      <div>
       <label className="text-xs font-medium text-[#1b2229]">Name of venue</label>
       <input type="text" className="w-full mt-2 p-3 bg-white rounded-full text-xs" placeholder="Enter venue name" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
       <div>
        <label className="text-xs font-medium text-[#1b2229]">Address</label>
        <input type="text" className="w-full mt-2 p-3 bg-white rounded-full text-xs" placeholder="Enter Address" />
       </div>
       <div>
        <label className="text-xs font-medium text-[#1b2229]">City</label>
        <input type="text" className="w-full mt-2 p-3 bg-white rounded-full text-xs" placeholder="Enter City" />
       </div>
      </div>

      {/* State Dropdown */}
      <div className="relative">
       <label className="text-xs font-medium text-[#1b2229] block mb-2">State</label>
       <button className="w-full p-3 border border-[#e6e6e6] rounded-full bg-white flex justify-between items-center text-xs" onClick={() => setStateDropdown(!stateDropdown)}>
        {selectedState || "Select State"}
        <span>{stateDropdown ? <UpArrowIcon /> : <BottomArrow />}</span>
       </button>
       {stateDropdown && (
        <div className="absolute top-full left-0 w-full mt-2 bg-white rounded-xl shadow-lg p-4 max-h-60 overflow-y-auto z-50">
         {states.map((state) => (
          <label key={state} className="flex gap-2 cursor-pointer text-xs py-1">
           <input
            type="radio"
            name="state"
            value={state}
            checked={selectedState === state}
            onChange={(e) => {
             setSelectedState(e.target.value);
             setStateDropdown(false);
            }}
            className="accent-[#1b2229]"
           />
           {state}
          </label>
         ))}
        </div>
       )}
      </div>

      {/* Status Dropdown */}
      <div className="relative">
       <label className="text-xs font-medium text-[#1b2229] block mb-2">Status</label>
       <button className="w-full p-3 border border-[#e6e6e6] rounded-full bg-white flex justify-between items-center text-xs" onClick={() => setStatusDropdown(!statusDropdown)}>
        {selectedStatus || "Select Status"}
        <span>{statusDropdown ? <UpArrowIcon /> : <BottomArrow />}</span>
       </button>
       {statusDropdown && (
        <div className="absolute top-full left-0 w-full mt-2 bg-white rounded-xl shadow-lg p-4 z-50">
         {statuses.map((status) => (
          <label key={status} className="flex gap-2 cursor-pointer text-xs py-1">
           <input
            type="radio"
            name="status"
            value={status}
            checked={selectedStatus === status}
            onChange={(e) => {
             setSelectedStatus(e.target.value);
             setStatusDropdown(false);
            }}
            className="accent-[#1b2229]"
           />
           {status}
          </label>
         ))}
        </div>
       )}
      </div>

      <button className={`w-full p-3 rounded-full text-white text-sm font-medium ${selectedImage ? "bg-[#10375c]" : "bg-gray-400 cursor-not-allowed"}`} disabled={!selectedImage}>
       Save
      </button>
     </div>
    </div>

{/* Right Side */}
    <div className="w-full lg:w-3/5 space-y-6">

{/* right top  */}
     <div className="  bg-[#f2f2f4] rounded-2xl p-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
       <h3 className="text-2xl font-semibold text-[#10375c] mb-4 sm:mb-0">Courts</h3>
       <button onClick={() => setModalOpen(true)} className="flex items-center gap-2 px-5 py-2 bg-[#1b2229] rounded-full text-white text-sm">
        <Add /> Add A New Court
       </button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
       <div className="bg-white p-3 rounded-xl space-y-3">
        <div className="flex gap-3">
         <Image src={Court} alt="court" width={80} height={80} className="object-cover rounded" />
         <div className="flex-1">
          <h4 className="text-lg font-semibold text-[#1b2229]">Court No 1</h4>
          <div className="mt-2">
           <label className="flex items-center cursor-pointer">
            <input type="checkbox" checked={isActive} onChange={handleToggle} className="hidden" />
            <span className={`w-10 h-5 ${isActive ? "bg-[#1b2229]" : "bg-[#ccc]"} rounded-full relative transition-colors duration-300`}>
             <span className={`w-4 h-4 bg-white rounded-full absolute top-0.5 ${isActive ? "left-5" : "left-0.5"} transition-transform duration-300`}></span>
            </span>
           </label>
           <p className={`text-[10px] font-medium mt-1 ${isActive ? "text-[#1b2229]" : "text-[#ff0004]"}`}>{isActive ? "Active" : "Inactive"}</p>
          </div>
         </div>
        </div>
        <button className="w-full py-2 bg-[#1C2329] text-white text-[10px] rounded-full">Edit</button>
       </div>
      </div>
     </div>


{/* right bottom  */}
     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="bg-[#f2f2f4] rounded-2xl p-4">
       <h3 className="text-xl font-medium text-[#172554] mb-4">Select Facilities</h3>
       <div className="space-y-2 max-h-48 overflow-y-auto">
        {[{ id: 6, label: "Wi-Fi" }, { id: 7, label: "Security" }, ...option].map((opt) => (
         <div key={opt.id} className="flex justify-between items-center py-1 cursor-pointer" onClick={() => toggleSelection(opt.id)}>
          <span className="text-xs font-medium text-[#1b2229]">{opt.label}</span>
          <Image src={selected.includes(opt.id) ? "/orange.svg" : "/gray.svg"} alt="status" width={16} height={16} />
         </div>
        ))}
       </div>
      </div>

      {/* Employees */}
      <div className="bg-[#f2f2f4] rounded-2xl p-4">
       <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
        <h3 className="text-xl font-medium text-[#10375c] mb-4 sm:mb-0">Employees Associated</h3>
        <button onClick={() => setEmployeeModalOpen(true)} className="flex items-center gap-2 px-3 py-1 bg-[#1b2229] rounded-full text-white text-[10px]">
         Add Employee
        </button>
       </div>

<div className="space-y-2 max-h-48 overflow-y-auto">
  {[1, 2].map((i) => (
    <div key={i}>
      <div className="flex justify-between items-center py-1">
        <div className="flex items-center gap-3">
          <Image
            src={UserProfile2}
            alt="employee"
            width={23}
            height={23}
            className="rounded-full"
          />
          <span className="text-xs font-medium text-[#1b2229]">
            Alex Parker
          </span>
        </div>

        <button className="px-3 py-1 bg-[#fd5602]/10 rounded-full text-[#fd5602] text-xs">
          Remove
        </button>
      </div>
      <div className="h-[1px] w-full border border-white"></div>
    </div>
  ))}
</div>



      </div>
     </div>

    </div>
   </div>
  </div>
 );
};

export default Page;








