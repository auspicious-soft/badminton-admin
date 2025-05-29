
"use client";
import React, { useState, useEffect } from "react";
import MatchImage from "@/assets/images/courtImage.png";
import Image from "next/image";
import Modal from "@mui/material/Modal";
import { v4 as uuidv4 } from "uuid";
import { getImageClientS3URL } from "@/config/axios";
import { toast } from "sonner";


interface Court {
  id: string;
  name: string;
  status: "Active" | "Inactive";
  image?: string;
  imageKey?: string;
  imageFile?: File | null;
  game: string;
}

interface CourtManagementProps {
  open: boolean;
  onClose: () => void;
  onSave: (court: Court) => void;
  court?: Court | null;
}

const gamesAvailableOptions = ["Padel", "Pickleball"]; // Hardcoded; fetch from API if needed

const CourtManagement = ({ open, onClose, onSave, court }: CourtManagementProps) => {
  const [courtName, setCourtName] = useState("");
  const [status, setStatus] = useState<"Active" | "Inactive">("Active");
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageKey, setImageKey] = useState<string | null>(null);
  // No longer uploading in the modal
  const [selectedGame, setSelectedGame] = useState(gamesAvailableOptions[0]); // Default to first game

  // Initialize form with court data if editing
  useEffect(() => {
    if (court) {
      setCourtName(court.name);
      setStatus(court.status);
      setImageKey(court.imageKey || null);

      // Handle S3 image URLs
      if (court.imageKey && court.imageKey.startsWith('courts/')) {
        const imageUrl = getImageClientS3URL(court.imageKey);
        setSelectedImage(imageUrl);
      } else {
        setSelectedImage(court.image || null);
      }

      setSelectedGame(court.game);
      setImageFile(null);
    } else {
      // Reset form when adding a new court
      setCourtName("");
      setStatus("Active");
      setSelectedImage(null);
      setImageKey(null);
      setImageFile(null);
      setSelectedGame(gamesAvailableOptions[0]);
    }
  }, [court]);

  const handleDelete = () => {
    onClose();
  };

  const handleSave = () => {
    try {
      // Create court data with local image preview and file for later upload
      const courtData: Court = {
        id: court ? court.id : uuidv4(),
        name: courtName,
        status,
        // For UI display purposes
        image: selectedImage || MatchImage.src,
        // Store the existing S3 key if we're editing and not changing the image
        imageKey: imageKey || undefined,
        // Store the image file for later upload when venue is saved
        imageFile: imageFile,
        game: selectedGame,
      };

      onSave(courtData);
      onClose();
    } catch (error) {
      console.error("Error in save process:", error);
      toast.error("Failed to save court");
    }
  };



  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // If the current image is a local object URL, revoke it
      if (selectedImage && typeof selectedImage === 'string' && selectedImage.startsWith('blob:')) {
        URL.revokeObjectURL(selectedImage);
      }

      // Create a local preview URL for the image
      const imageUrl = URL.createObjectURL(file);
      setSelectedImage(imageUrl);

      // Store the file for later upload when Save is clicked
      setImageFile(file);

      // Clear the image key since we're replacing the image
      setImageKey(null);
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="court-management-modal"
      aria-describedby="court-management-form"
    >
      <div className="flex items-center justify-center min-h-screen">
        <div className="z-50 bg-[#f2f2f4] rounded-[30px] shadow-lg p-[20px] w-full max-w-md">
          {/* <h2 className="text-xl font-semibold text-[#10375c] mb-4">{court ? 'Edit Court' : 'Add New Court'}</h2> */}
          {/* Image Section */}
          <div className="mb-6 relative">
            <Image
              src={selectedImage || MatchImage}
              alt="Court Image"
              className="w-full rounded-[10px]"
              width={442}
              height={285}
            />
            <label className="absolute bottom-2 right-2 bg-white rounded-full px-2 py-1 flex items-center gap-2 cursor-pointer shadow-md">
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageChange}
              />
              <span className="text-sm font-medium">Change Image</span>
            </label>
          </div>

          {/* Form Section */}
          <form>
            {/* Court Name Input */}
            <div className="mb-[15px]">
              <label htmlFor="courtName" className="block text-[#1b2229] text-xs font-medium">
                Name of the court
              </label>
              <input
                type="text"
                id="courtName"
                value={courtName}
                placeholder="Enter court name"
                onChange={(e) => setCourtName(e.target.value)}
                className="mt-1 block w-full px-[15px] py-2.5 text-black/60 text-xs font-medium bg-white rounded-[39px] sm:text-sm p-2"
              />
            </div>

            {/* Status Select */}
            <div className="mb-[15px]">
              <label htmlFor="status" className="block text-[#1b2229] text-xs font-medium">
                Status
              </label>
              <select
                id="status"
                value={status}
                onChange={(e) => setStatus(e.target.value as "Active" | "Inactive")}
                className="mt-1 block w-full px-[15px] py-2.5 text-black/60 text-xs font-medium bg-white rounded-[39px] sm:text-sm p-2"
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>

            {/* Game Select */}
            <div className="mb-[15px]">
              <label htmlFor="game" className="block text-[#1b2229] text-xs font-medium">
                Game
              </label>
              <select
                id="game"
                value={selectedGame}
                onChange={(e) => setSelectedGame(e.target.value)}
                className="mt-1 block w-full px-[15px] py-2.5 text-black/60 text-xs font-medium bg-white rounded-[39px] sm:text-sm p-2"
              >
                {gamesAvailableOptions.map((game) => (
                  <option key={game} value={game}>
                    {game}
                  </option>
                ))}
              </select>
            </div>

            {/* Buttons */}
            <div className="w-full flex justify-between gap-[10px]">
              <button
                type="button"
                onClick={handleDelete}
                className="w-full text-white text-sm font-medium h-12 py-2 bg-[#fd5602] rounded-[28px]"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSave}
                className="w-full text-white text-sm font-medium h-12 py-2 bg-[#10375c] rounded-[28px] flex items-center justify-center"
              >
                {court ? 'Update' : 'Save'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </Modal>
  );
};

export default CourtManagement;