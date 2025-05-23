"use client";
import React, { useState } from "react";
import WeekdayPricingModal from "../../components/pricing/WeekdayPricingModal";
import WeekdayPricingButton from "../../components/pricing/WeekdayPricingButton";
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

const WeekdayPricingPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [pricingData, setPricingData] = useState<PricingFormValues[]>([]);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleSubmit = (data: PricingFormValues) => {
    // In a real application, you would send this data to your API
    console.log("Pricing data submitted:", data);
    
    // For demo purposes, we'll just add it to our local state
    setPricingData([...pricingData, data]);
    
    toast.success("Pricing added successfully");
  };

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-[#10375c]">Weekday Pricing Management</h1>
        
        {/* Button to open modal directly */}
        <button
          onClick={handleOpenModal}
          className="px-4 py-2 bg-[#10375c] text-white rounded-full text-sm font-medium"
        >
          Add Pricing
        </button>
        
        {/* Or use the button component */}
        <WeekdayPricingButton 
          onPricingAdded={handleSubmit}
          buttonText="Add Using Component"
        />
      </div>

      {/* Modal */}
      <WeekdayPricingModal
        open={isModalOpen}
        onClose={handleCloseModal}
        onSubmit={handleSubmit}
      />

      {/* Display existing pricing data */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {pricingData.map((pricing, index) => (
          <div key={index} className="bg-[#f2f2f4] p-4 rounded-[20px]">
            <h3 className="text-lg font-semibold text-[#10375c]">{pricing.name}</h3>
            <p className="text-sm text-gray-600 mb-2">{pricing.description}</p>
            <p className="text-xs text-gray-500 mb-4">Reason: {pricing.reason}</p>
            
            <div className="space-y-2">
              <h4 className="text-sm font-medium">Time Slots & Prices</h4>
              {pricing.timeSlots.map((slot, idx) => (
                <div key={idx} className="flex justify-between text-sm">
                  <span>{slot.time}</span>
                  <span>₹{slot.price}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WeekdayPricingPage;
