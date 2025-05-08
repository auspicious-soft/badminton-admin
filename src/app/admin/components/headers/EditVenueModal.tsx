"use client";
import React, { useState, useEffect } from "react";
import MatchImage from "@/assets/images/courtImage.png";
import Image from "next/image";
import Modal from "@mui/material/Modal";
import {  updateCourt } from "@/services/admin-services";
import { toast } from "sonner";

interface Court {
  id: string;
  name: string;
  status: "Active" | "Inactive";
  image?: string;
  game: string;
  venueId: any;
}

interface CourtManagementProps {
  open: boolean;
  onClose: () => void;
  onSave: (court: Court) => void;
  court?: Court | null;
  venueId: any;
}

const gamesAvailableOptions = ["Padel", "Pickleball"];

const CourtManagement = ({ open, onClose, onSave, court, venueId }: CourtManagementProps) => {
  const [courtName, setCourtName] = useState("");
  const [status, setStatus] = useState<"Active" | "Inactive">("Active");
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedGame, setSelectedGame] = useState(gamesAvailableOptions[0]);

  useEffect(() => {
    if (court) {
      setCourtName(court.name);
      setStatus(court.status);
      setSelectedImage(court.image || null);
      setSelectedGame(court.game);
    } else {
      setCourtName("");
      setStatus("Active");
      setSelectedImage(null);
      setSelectedGame(gamesAvailableOptions[0]);
    }
  }, [court]);

  const handleDelete = () => {
    onClose();
  };

  const handleSave = async () => {
    const courtData: Court = {
      id: court ? court.id : crypto.randomUUID(),
      name: courtName,
      status,
      image: selectedImage || MatchImage.src,
      game: selectedGame,
      venueId,
    };

    try {
      if (court) {
        // Update existing court
        const payload = {
          id: court.id,
          venueId,
          name: courtName,
          isActive: status === "Active",
          games: selectedGame,
          image: selectedImage || MatchImage.src,
        };
        const response = await updateCourt("/admin/court", payload);
        if (response?.status === 200 || response?.status === 201) {
          toast.success("Court updated successfully");
          onSave(courtData);
        } else {
          toast.error("Failed to update court");
        }
      } else {
        // Add new court
        const payload = {
          venueId:venueId,
          name: courtName,
          isActive: status === "Active",
          games: selectedGame,
          image: selectedImage || MatchImage.src,
        };
        const response = await updateCourt("/admin/court", payload);
        if (response?.status === 200 || response?.status === 201) {
          toast.success("Court added successfully");
          onSave({ ...courtData, id: response.data.data._id });
        } else {
          toast.error("Failed to add court");
        }
      }
    } catch (error) {
      toast.error("Something went wrong");
    }

    onClose();
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
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="court-management-modal"
      aria-describedby="court-management-form"
    >
      <div className="flex items-center justify-center min-h-screen">
        <div className="z-50 bg-[#f2f2f4] rounded-[30px] shadow-lg p-[20px] w-full max-w-md">
          {/* Image Section */}
          <div className="mb-6 relative">
            <Image
              src={selectedImage || MatchImage}
              alt="Court Image"
              className="w-full rounded-[10px]"
              width={400}
              height={200}
            />
            <label className="absolute bottom-2 right-2 bg-white rounded-full px-2 py-1 flex items-center gap-2 cursor-pointer shadow-md">
              <input type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
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
                className="w-full text-white text-sm font-medium h-12 py-2 bg-[#10375c] rounded-[28px]"
              >
                {court ? "Update" : "Save"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </Modal>
  );
};

export default CourtManagement;