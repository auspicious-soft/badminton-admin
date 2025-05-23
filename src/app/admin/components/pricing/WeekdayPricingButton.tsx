"use client";
import React, { useState } from "react";
import WeekdayPricingModal from "./WeekdayPricingModal";
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

interface WeekdayPricingButtonProps {
  onPricingAdded?: (data: PricingFormValues) => void;
  buttonText?: string;
  buttonClassName?: string;
}

const WeekdayPricingButton: React.FC<WeekdayPricingButtonProps> = ({
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

  const handleSubmit = (data: any) => {
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
      <WeekdayPricingModal
        open={isModalOpen}
        onClose={handleCloseModal}
        onSubmit={handleSubmit}
      />
    </>
  );
};

export default WeekdayPricingButton;
