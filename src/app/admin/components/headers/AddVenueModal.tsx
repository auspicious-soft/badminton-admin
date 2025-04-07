"use client";
import React, { useState } from "react";
import MatchImage from "@/assets/images/courtImage.png";
import Image from "next/image";
import Modal from "@mui/material/Modal";

const CourtManagement = ({ open, onClose }) => {
 const [courtName, setCourtName] = useState("Court 1");
 const [status, setStatus] = useState("Active");

 const handleDelete = () => {
  console.log("Court deleted");
  onClose(); // Close modal after delete
 };

 const handleSave = () => {
  console.log("Court saved", { courtName, status });
  onClose(); // Close modal after save
 };

 return (
  <Modal open={open} onClose={onClose} aria-labelledby="court-management-modal" aria-describedby="court-management-form">
   <div className="flex items-center justify-center min-h-screen ">
    <div className="z-50  bg-[#f2f2f4] rounded-[30px] shadow-lg p-[20px] w-full max-w-md">
     {/* Image Section */}
     <div className="mb-6">
      <Image src={MatchImage} alt="Court Image" className="w-full  rounded-[10px]" width={442} height={285} />
     </div>

     {/* Form Section */}
     <form>
      {/* Court Name Input */}
      <div className="mb-[15px]">
       <label htmlFor="courtName" className="block text-[#1b2229] text-xs font-medium">
        Name of the court
       </label>
       <input type="text" id="courtName" value={courtName} onChange={(e) => setCourtName(e.target.value)} className="mt-1 block w-full px-[15px] py-2.5 text-black/60 text-xs font-medium bg-white rounded-[39px] sm:text-sm p-2" />
      </div>

      {/* Status Select */}
      <div className="mb-[20px]">
       <label htmlFor="status" className="block text-[#1b2229] text-xs font-medium">
        Status
       </label>
       <select id="status" value={status} onChange={(e) => setStatus(e.target.value)} className="mt-1 block w-full px-[15px] py-2.5 text-black/60 text-xs font-medium bg-white rounded-[39px] sm:text-sm p-2">
        <option>Active</option>
        <option>Inactive</option>
       </select>
      </div>

      {/* Buttons */}
      <div className="w-full flex justify-between gap-[10px]">
       <button type="button" onClick={handleDelete} className="w-full text-white text-sm font-medium h-12 py-2 bg-[#fd5602] rounded-[28px]">
        Delete Court
       </button>
       <button type="button" onClick={handleSave} className="w-full text-white text-sm font-medium h-12 py-2 bg-[#10375c] rounded-[28px]">
        Save
       </button>
      </div>
     </form>
    </div>
   </div>
  </Modal>
 );
};

export default CourtManagement;
