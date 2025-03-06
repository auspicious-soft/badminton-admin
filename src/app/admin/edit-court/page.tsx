"use client";
import React, { useState } from "react";
import Image from "next/image";
import { BottomArrow, Edit, Pluss } from "@/utils/svgicons";
import MatchImage from "@/assets/images/padelImage.png";
import padelImage from "@/assets/images/padelImage.png";
import AlexParker from "@/assets/images/AlexParker.png";
import JordanLee from "@/assets/images/JordanLee.png";
import TracyMartin from "@/assets/images/TracyMartin.png";
import Select, { MultiValue } from "react-select";
import { EyeIcon, Add } from "@/utils/svgicons";

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
 { value: "Active", label: "Active" },
 { value: "Inactive", label: "Inactive" },
];

const Page = () => {
 const [formData, setFormData] = useState<NotificationData>({
  title: "",
  text: "",
  recipients: [],
 });


 const [searchParams, setSearchParams] = useState("");

 const handleRecipientsChange = (selectedOptions: MultiValue<OptionType>) => {
  const recipients = selectedOptions.map((option) => option.value);
  setFormData((prev) => ({
   ...prev,
   recipients: recipients,
  }));
 };


 

 return (
  <>

   <div className="flex gap-[15px] mt-[15px] md:flex-row flex-col ">
    <div className=" flex gap-[15px] mt-[15px]">
     {/* Left Side */}
     <div className="w-full  bg-[#f2f2f4] rounded-[30px] px-[15px] py-[14px]">
      <Image className="rounded-[10px] w-full h-auto object-cover" alt="padel game image" src={MatchImage} width={500} height={300} />


      <div className="h-[69.41px] mt-[10px]">
       <div className="text-[#1b2229]  mb-[10px] text-xs font-medium">Name of the court</div>
       <div className="h-[45.41px] px-[15px] py-2.5 bg-white rounded-[39px]">
        <input type="text" className="text-black/60 text-xs font-medium mt-[5px]" />
       </div>
      </div>

      <div className="h-[69.41px]">
       <div className="text-[#1b2229] mt-[15px] mb-[10px] text-xs font-medium">Status </div>
       <Select
        isMulti
        options={options}
        value={options.filter((option) => formData.recipients.includes(option.value))}
        onChange={handleRecipientsChange}
        className="w-full text-black/60 text-xs font-medium"
        classNamePrefix="react-select"
        placeholder="Select Game..."
        styles={{
         control: (base) => ({
          ...base,
          borderRadius: "44px",
          border: "1px solid #e6e6e6",
          boxShadow: "none",
          height: "45.41px",
          backgroundColor: "white",
          "&:hover": {
           borderColor: "#e6e6e6",
          },
          padding: "2px",
         }),
         menu: (base) => ({
          ...base,
          borderRadius: "8px",
          width: "40%",
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

     
<div className="flex gap-[10px] mb-[20px]">
      <button className="w-full h-12 bg-[#fd5602] rounded-[28px] text-white text-sm font-medium mt-[15px]">Delete Court</button>
      <button className="w-full h-12 bg-[#10375c] rounded-[28px] text-white text-sm font-medium mt-[15px]">Save</button>
</div>
     </div>
    </div>

    <div>

   
    </div>
   </div>
  </>
 );
};

export default Page;


