"use client";
import React, { useState } from "react";
import PricingModal from "./PricingModal";
import { toast } from "sonner";

interface TimeSlot {
  time: string;
  price: number;
}

interface PricingFormValues {
  name: string;
  description: string;
  reason: string;
  timeSlots: TimeSlot[];
}

interface PricingButtonProps {
  onPricingAdded?: (data: PricingFormValues) => void;
  buttonText?: string;
  buttonClassName?: string;
}

const PricingButton: React.FC<PricingButtonProps> = ({
  onPricingAdded,
  buttonText = "Add Pricing",
  buttonClassName = "px-4 py-2 bg-[#10375c] text-white rounded-full text-sm font-medium",
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleSubmit = (data: PricingFormValues) => {
    // Call the callback if provided
    if (onPricingAdded) {
      onPricingAdded(data);
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

      {/* Pricing Modal */}
      <PricingModal
        open={isModalOpen}
        onClose={handleCloseModal}
        onSubmit={handleSubmit}
      />
    </>
  );
};

export default PricingButton;
