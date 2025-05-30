"use client";
import React, { useState, useEffect } from "react";
import MatchImage from "@/assets/images/courtImage.png";
import Image from "next/image";
import Modal from "@mui/material/Modal";
import { updateCourt } from "@/services/admin-services";
import { toast } from "sonner";
import { getImageClientS3URL } from "@/config/axios";
import { generateSignedUrlForCourt, deleteFileFromS3 } from "@/actions";
import { validateImageFile } from "@/utils/fileValidation";

interface Court {
  id: string;
  name: string;
  status: "Active" | "Inactive";
  image?: string;
  imageKey?: string;
  imageFile?: File | null;
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
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageKey, setImageKey] = useState<string | null>(null);
  const [selectedGame, setSelectedGame] = useState(gamesAvailableOptions[0]);

  useEffect(() => {
    if (court) {
      setCourtName(court.name);
      setStatus(court.status);
      setImageKey(court.imageKey || null);

      // Handle image display
      if (court.imageKey && court.imageKey.startsWith('courts/')) {
        const imageUrl = getImageClientS3URL(court.imageKey);
        setSelectedImage(imageUrl);
      } else {
        setSelectedImage(court.image || null);
      }

      setSelectedGame(court.game);
      setImageFile(null); // Reset image file when editing a court
    } else {
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

  // Function to upload a court image to S3
  const uploadCourtImageToS3 = async (file: File): Promise<string> => {
    try {
      const timestamp = Date.now();
      const fileName = `${timestamp}-${file.name}`;

      // Generate signed URL for S3 upload
      const { signedUrl, key } = await generateSignedUrlForCourt(
        fileName,
        file.type
      );

      // Upload the file to S3
      const uploadResponse = await fetch(signedUrl, {
        method: "PUT",
        body: file,
        headers: {
          "Content-Type": file.type,
        },
      });

      if (!uploadResponse.ok) {
        throw new Error("Failed to upload court image to S3");
      }

      return key;
    } catch (error) {
      console.error("Error uploading court image:", error);
      throw error;
    }
  };

  const handleSave = async () => {
    try {
      // If we have a new image file, upload it to S3 first
      let finalImageKey = imageKey || court?.imageKey;
      let isUploading = false;

      if (imageFile) {
        isUploading = true;
        try {
          // Upload the new image
          finalImageKey = await uploadCourtImageToS3(imageFile);
          console.log("Uploaded new court image, key:", finalImageKey);

          // Delete the previous image if it exists
          if (court?.imageKey && court.imageKey.startsWith('courts/')) {
            try {
              await deleteFileFromS3(court.imageKey);
              console.log("Previous court image deleted:", court.imageKey);
            } catch (deleteError) {
              console.error("Error deleting previous court image:", deleteError);
              // Continue with the save process even if deletion fails
            }
          }
        } catch (uploadError) {
          console.error("Error uploading court image:", uploadError);
          toast.error("Failed to upload court image");
          // Continue with saving the court without the image
          finalImageKey = court?.imageKey || null;
        } finally {
          isUploading = false;
        }
      }

      // Create court data with the new image key
      const courtData: Court = {
        id: court ? court.id : crypto.randomUUID(),
        name: courtName,
        status,
        // For UI display purposes - use the S3 URL if we have an image key
        image: finalImageKey ? getImageClientS3URL(finalImageKey) : (selectedImage || MatchImage.src),
        // Store the S3 image key
        imageKey: finalImageKey || undefined,
        // No need to store the image file anymore since we've already uploaded it
        imageFile: null,
        game: selectedGame,
        venueId,
      };

      console.log("Court data being saved:", {
        id: courtData.id,
        name: courtData.name,
        imageKey: courtData.imageKey
      });

      if (court) {
        // Update existing court in the backend with the new image key
        const payload = {
          id: court.id,
          venueId,
          name: courtName,
          isActive: status === "Active",
          games: selectedGame,
          // Include the new image key
          image: finalImageKey || null,
        };

        const response = await updateCourt("/admin/court", payload);
        if (response?.status === 200 || response?.status === 201) {
          toast.success("Court updated successfully");
          // Pass the court data to the parent component
          onSave(courtData);
        } else {
          toast.error("Failed to update court");
        }
      } else {
        // Add new court to the backend with the image key
        const payload = {
          venueId: venueId,
          name: courtName,
          isActive: status === "Active",
          games: selectedGame,
          // Include the image key
          image: finalImageKey || null,
        };

        const response = await updateCourt("/admin/court", payload);
        if (response?.status === 200 || response?.status === 201) {
          toast.success("Court added successfully");
          // Pass the court data to the parent component
          onSave({
            ...courtData,
            id: response.data.data._id,
          });
        } else {
          toast.error("Failed to add court");
        }
      }
    } catch (error) {
      console.error("Error in save process:", error);
      toast.error("Something went wrong");
    }

    onClose();
  };

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate the file
      const validation = validateImageFile(file, 5); // 5MB limit
      if (!validation.isValid) {
        toast.error(validation.error);
        // Reset the input
        event.target.value = '';
        return;
      }

      // If the current image is a local object URL, revoke it
      if (selectedImage && typeof selectedImage === 'string' && selectedImage.startsWith('blob:')) {
        URL.revokeObjectURL(selectedImage);
      }

      // Create a local preview URL for the image
      const imageUrl = URL.createObjectURL(file);
      setSelectedImage(imageUrl);

      // Store the file for later upload when venue Save is clicked
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
          {/* Image Section */}
          <div className="mb-6 relative">
            <Image
              src={selectedImage || MatchImage}
              alt="Court Image"
              className="w-full max-h-[200px] rounded-[10px]"
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