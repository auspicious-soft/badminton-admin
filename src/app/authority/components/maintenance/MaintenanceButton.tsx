"use client";
import React, { useState } from "react";
import MaintenanceModal from "./MaintenanceModal";
import { toast } from "sonner";

interface MaintenanceButtonProps {
  onMaintenanceAdded?: (data: any) => void;
  buttonText?: string;
  buttonClassName?: string;
  venues?: { id: string; name: string }[];
  courts?: { id: string; name: string }[];
}

const MaintenanceButton: React.FC<MaintenanceButtonProps> = ({
  onMaintenanceAdded,
  buttonText = "Add Maintenance",
  buttonClassName = "px-4 py-2 bg-[#10375c] text-white rounded-full text-sm font-medium",
  venues = [],
  courts = [],
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleSubmit = (data: any) => {
    // Call the callback if provided
    if (onMaintenanceAdded) {
      onMaintenanceAdded(data);
    } else {
      toast.success("Maintenance added successfully");
    }
    
    // Close the modal
    setIsModalOpen(false);
  };

  return (
    <>
      <button
        onClick={handleOpenModal}
        className={buttonClassName}
      >
        {buttonText}
      </button>

      {/* Maintenance Modal */}
      <MaintenanceModal
        open={isModalOpen}
        onClose={handleCloseModal}
        onSubmit={handleSubmit}
        venues={venues}
        courts={courts}
      />
    </>
  );
};

export default MaintenanceButton;
