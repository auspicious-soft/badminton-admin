"use client";
import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { CrossIcon, DeleteIcon1, EditIcon, PlusIcon } from "@/utils/svgicons";
import NoImage from "@/assets/images/nofile.png";
import CourtManagement from "./AddVenueModal";
import AddEmployeeModal from "./AddEmployeesModal";
import dynamic from "next/dynamic";
import { UpArrowIcon, DownArrowIcon } from "@/utils/svgicons";
import Image from "next/image";
import Court from "@/assets/images/courtsmallImg.png";
import UserProfile2 from "@/assets/images/UserProfile2.png";

import Switch from "@mui/material/Switch";
// Dynamically import react-select with SSR disabled
const Select = dynamic(() => import("react-select"), { ssr: false });

// Updated Reviews array
const Reviews = [
 { id: 1, userName: "John Doe", rating: 5, review: "consequat..." },
 { id: 2, userName: "Alex Parker", rating: 4, review: "giat..." },
 { id: 3, userName: "Marley Martinez", rating: 4.5, review: "quis..." },
];

// Validation schema using Yup
const schema = yup.object().shape({
 productName: yup.string().required("Product name is required"),
 actualPrice: yup.string().required("Location is required"),
 quantity: yup.string().required("Status is required"),
 discountedPrice: yup.number().required("Discounted price is required").positive().integer().lessThan(yup.ref("actualPrice"), "Discounted price must be less than actual price"),
 description: yup.string().required("Description is required"),
 specifications: yup.string().required("Specifications are required"),
 images: yup
  .mixed()
  .required("An image is required")
  .test("fileSize", "File size is too large", (value: any) => {
   return value && value.size <= 2000000; // 2MB
  })
  .test("fileType", "Unsupported file format", (value: any) => {
   return value && ["image/jpeg", "image/png", "image/gif"].includes(value.type);
  }),
});

// Options for the Select component
const gameOptions = [
 { value: "pickleball", label: "Pickleball" },
 { value: "padelball", label: "Padelball" },
];

const AddVenueForm = () => {
 const [modalOpen, setModalOpen] = useState(false);
 const [employeeModalOpen, setEmployeeModalOpen] = useState(false);
 const [selectedGames, setSelectedGames] = useState([]);
 const {
  register,
  handleSubmit,
  formState: { errors },
  reset,
 } = useForm({
  resolver: yupResolver(schema),
 });
 const [imagePreview, setImagePreview] = useState(null);
 const [gameDropdown, setGameDropdown] = useState(false);
 const [selectedGame, setSelectedGame] = useState("");

 const status = ["Active", "Inactive"];
 const [isActive, setIsActive] = useState(false);

 const handleToggle = () => {
  setIsActive(!isActive);
 };
 const handleImageChange = (e) => {
  const file = e.target.files[0];
  if (file) {
   if (imagePreview) {
    URL.revokeObjectURL(imagePreview.url);
   }
   const newPreview = {
    file,
    url: URL.createObjectURL(file),
   };
   setImagePreview(newPreview);
  }
 };

 const removeImage = () => {
  if (imagePreview) {
   URL.revokeObjectURL(imagePreview.url);
   setImagePreview(null);
  }
 };

 useEffect(() => {
  return () => {
   if (imagePreview) {
    URL.revokeObjectURL(imagePreview.url);
   }
  };
 }, [imagePreview]);

 const handleGamesChange = (selectedOptions) => {
  setSelectedGames(selectedOptions || []);
 };

 const onSubmit = (data) => {
  console.log("Form data:", {
   ...data,
   games: selectedGames.map((option) => option.value),
   image: imagePreview ? imagePreview.file : null,
  });
  reset();
  setImagePreview(null);
  setSelectedGames([]);
 };

 return (
  <div className="mb-[50px] h-[100vh]">
   <div className="flex justify-between">
    <h2 className="text-[#10375c] text-3xl font-semibold mb-6">Barnton Park LTC</h2>
    <button onClick={() => console.log("add court")} className="flex items-center h-10 gap-[10px] px-5 py-3 bg-[#1b2229] rounded-[28px] text-white text-sm font-medium">
     <PlusIcon /> Add A New Venue
    </button>
   </div>
   <form onSubmit={handleSubmit(onSubmit)} className="w-full flex flex-col md:flex-row gap-[15px] h-fit">
    <div className="w-full md:w-[35%] space-y-4 bg-[#f2f2f4] p-[15px] rounded-[20px] h-fit">
     <div className="relative bg-gray-100 rounded-lg flex flex-col items-center justify-center">
      {imagePreview ? (
       <div className="w-full">
        <Image src={imagePreview.url} alt="Preview" className="w-full h-48 object-cover rounded-lg" width={400} height={200} />
        <button type="button" onClick={removeImage} className="absolute top-1 right-1 bg-white text-black text-center rounded-full p-[6px] px-[7px] flex items-center justify-center">
         <CrossIcon />
        </button>
       </div>
      ) : (
       <div className="flex flex-col h-[250px] w-full items-center justify-center bg-[#e7e7e7] rounded-[10px]">
        <Image src={NoImage} alt="No image selected" className="h-24 w-24 object-cover rounded-[10px]" width={100} height={100} />
       </div>
      )}
      <label htmlFor="imageUpload" className="flex items-center gap-[10px] absolute bottom-2 right-2 h-12 px-5 py-4 bg-white rounded-[28px] text-[#1b2229] text-sm font-medium cursor-pointer">
       <EditIcon stroke="black" />
       Upload Image
       <input type="file" id="imageUpload" accept="image/*" className="hidden" {...register("images", { onChange: handleImageChange })} />
      </label>
     </div>

     <div className="flex flex-col gap-[15px]">
      <div className="flex flex-col gap-[10px]">
       <label className="block text-[#1b2229] text-xs font-medium">Name of the Venue</label>
       <input type="text" {...register("productName")} className="w-full h-[45.41px] px-[15px] py-2.5 bg-white rounded-[39px] text-black/60 text-xs font-medium" placeholder="Enter venue name" />
      </div>

      <div className="flex flex-col gap-[10px]">
       <label className="block text-[#1b2229] text-xs font-medium">Location</label>
       <input type="text" {...register("actualPrice")} className="w-full h-[45.41px] px-[15px] py-2.5 bg-white rounded-[39px] text-black/60 text-xs font-medium" placeholder="Enter location" />
      </div>

      <div className="flex flex-col gap-[10px]">
       <label className="block text-[#1b2229] text-xs font-medium">Games Available</label>
       <Select
        isMulti
        options={gameOptions}
        value={selectedGames}
        onChange={handleGamesChange}
        className="w-full text-black/60 text-xs font-medium"
        classNamePrefix="react-select"
        placeholder="Select Games..."
        styles={{
         control: (base) => ({
          ...base,
          borderRadius: "44px",
          border: "1px solid #e6e6e6",
          boxShadow: "none",
          "&:hover": {
           borderColor: "#e6e6e6",
          },
          padding: "2px",
         }),
         menu: (base) => ({
          ...base,
          borderRadius: "8px",
          boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
         }),
         option: (base, { isFocused }) => ({
          ...base,
          backgroundColor: isFocused ? "#e6f7ff" : "white",
          color: "#1c2329",
          "&:active": {
           backgroundColor: "#e6f7ff",
          },
         }),
         multiValue: (base) => ({
          ...base,
          backgroundColor: "#1c2329",
          borderRadius: "5px",
         }),
         multiValueLabel: (base) => ({
          ...base,
          color: "white",
          padding: "4px 2px 4px 12px",
         }),
         multiValueRemove: (base) => ({
          ...base,
          color: "white",
          margin: "4px 5px 4px 0px",
          "&:hover": {
           backgroundColor: "#1c2329",
           color: "white",
          },
         }),
        }}
       />
      </div>

      <div className="flex flex-col gap-[10px]">
       <label className="block text-[#1b2229] text-xs font-medium">Status</label>
       {/* <input
                                type="text"
                                {...register('quantity')}
                                className="w-full h-[45.41px] px-[15px] py-2.5 bg-white rounded-[39px] text-black/60 text-xs font-medium"
                                placeholder="Enter status"
                            /> */}

       <div className="relative">
        <button className="w-full flex justify-between h-10h-[45px] px-[15px] py-2.5 bg-white rounded-[39px] text-black/60 text-xs font-medium " onClick={() => setGameDropdown(!gameDropdown)}>
         {selectedGame || "Status"}
         <span className="">{!gameDropdown ? <DownArrowIcon stroke="#1b2229" /> : <UpArrowIcon stroke="#1b2229" />}</span>
        </button>
        {gameDropdown && (
         <div className="z-50 flex flex-col gap-[5px] absolute top-10 left-0  p-[10px] w-full h-fit bg-white rounded-[10px] shadow-[0px_4px_20px_0px_rgba(92,138,255,0.10)]">
          {status.map((game) => (
           <label key={game} className="flex gap-[10px] cursor-pointer text-[#1b2229] text-sm font-medium ">
            <input
             type="radio"
             name="game"
             value={game}
             checked={selectedGame === game}
             onChange={(e) => {
              setSelectedGame(e.target.value);
              console.log("Selected Game:", e.target.value);
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

      <button type="submit" className="py-4 bg-[#10375c] rounded-[28px] text-white text-sm font-medium mt-[5px]">
       Save
      </button>
     </div>
    </div>

    <div className="w-full md:w-[65%] flex flex-col gap-[15px]">
     <div className="w-full h-fit min-h-[200px] p-[15px] bg-[#f2f2f4] rounded-[20px] flex-col justify-start items-start gap-[30px]">
      <div className="flex justify-between h-10 mb-[20px]">
       <h3 className="text-[#10375c] text-2xl font-semibold mb-[20px]">Courts</h3>
       <button onClick={() => setModalOpen(true)} className="flex items-center h-10 gap-[10px] px-5 py-3 bg-[#1b2229] rounded-[28px] text-white text-sm font-medium">
        <PlusIcon /> Add A New Court
       </button>
      </div>
      <div className="w-full flex flex-col gap-[15px]">
       <div className="w-full bg-[#f2f2f4] grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-[10px] overflow-y-auto ">
        <div className="h-fit bg-white p-[10px] space-y-[10px] rounded-[10px]">
         <div className="flex gap-[10px] items-start">
          <Image src={Court} alt="court image" className="w-[80px] h-[80px] object-cover" />
          <div className="flex flex-col gap-[10px]">
           <h4 className="text-[#1b2229] text-lg font-semibold leading-snug">Court No 1</h4>
           <div className="flex flex-col justify-start  gap-[5px]">
            <label className="flex items-center cursor-pointer">
             <input type="checkbox" checked={isActive} onChange={handleToggle} className="hidden" />
             <span className={`w-[40px] h-[20px] ${isActive ? "bg-[#1b2229]" : "bg-[#ccc]"} rounded-full relative transition-colors duration-300`}>
              <span className={`w-[16px] h-[16px] bg-white rounded-full absolute top-[2px] ${isActive ? "left-[22px]" : "left-[2px]"} transition-transform duration-300`}></span>
             </span>
            </label>
            <h4 className={`text-[10px] font-medium ${isActive ? " text-[#1b2229]" : "text-[#ff0004]"}`}>{isActive ? "Active" : "Inactive"}</h4>
           </div>
          </div>
         </div>
         <button className="w-full rounded-[26px] bg-[#1C2329] text-white text-[10px] font-normal py-[8px] px-[12px]">Edit</button>
        </div>
       </div>
      </div>
     </div>

     <div className="w-full flex flex-col gap-[15px] mb-4">
      <div className="w-full h-fit min-h-[200px] p-[15px] bg-[#f2f2f4] rounded-[20px] flex flex-col overflow-y-auto overflo-custom">
       <div className="flex justify-between mb-[18px]">
        <h3 className="text-[#10375c] text-xl font-medium">Employees Associated</h3>
        <button onClick={() => setEmployeeModalOpen(true)} className="flex items-center h-7 gap-[10px] px-3 py-2 bg-[#1b2229] rounded-[28px] text-white text-[10px] font-normal">
         Add Employee
        </button>
       </div>
       <div className=" w-full flex-col justify-start items-start gap-2.5 inline-flex overflow-y-auto overflo-custom ">
        <div className="w-full h-6 justify-between items-center inline-flex">
         <div className=" justify-start items-center gap-[15px] inline-flex">
          <Image className="w-[23px] h-[23px] rounded-full" src={UserProfile2} alt="employee image" />
          <div className=" text-[#1b2229] text-xs font-medium font-['Raleway']">Alex Parker</div>
         </div>
         <div className=" h-6 px-3.5 py-[5px] bg-[#fd5602]/10 rounded-[28px] justify-center items-center gap-2.5 inline-flex">
          <div className="text-[#fd5602] text-xs font-medium font-['Raleway']">Remove</div>
         </div>
        </div>
        <div className="h-[0px] w-full border border-white"></div>
        <div className="w-full h-6 justify-between items-center inline-flex">
         <div className=" justify-start items-center gap-[15px] inline-flex">
          <Image className="w-[23px] h-[23px] rounded-full" src={UserProfile2} alt="employee image" />
          <div className=" text-[#1b2229] text-xs font-medium font-['Raleway']">Alex Parker</div>
         </div>
         <div className=" h-6 px-3.5 py-[5px] bg-[#fd5602]/10 rounded-[28px] justify-center items-center gap-2.5 inline-flex">
          <div className="text-[#fd5602] text-xs font-medium font-['Raleway']">Remove</div>
         </div>
        </div>
       </div>
      </div>
     </div>
    </div>
   </form>
   {/* <CourtManagement open={modalOpen} onClose={() => setModalOpen(false)} />
   <AddEmployeeModal open={employeeModalOpen} setOpen={setEmployeeModalOpen} /> */}
  </div>
 );
};

export default AddVenueForm;
