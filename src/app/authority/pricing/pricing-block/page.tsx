"use client";
import React, { useState } from "react";
import { PricingBlock } from "../../components/pricing";
import { toast } from "sonner";

interface TimeSlot {
  time: string;
  price: number;
}

interface PricingData {
  name: string;
  description: string;
  timeSlots: TimeSlot[];
}

const PricingBlockPage = () => {
  const [weekdayPricing, setWeekdayPricing] = useState<PricingData>({
    name: "Mon - Fri",
    description: "Description",
    timeSlots: [
      { time: "06:00", price: 700 },
      { time: "07:00", price: 800 },
      { time: "08:00", price: 1000 },
      { time: "09:00", price: 1000 },
      { time: "10:00", price: 1200 },
      { time: "11:00", price: 1200 },
      { time: "12:00", price: 1200 },
      { time: "13:00", price: 1200 },
      { time: "14:00", price: 1200 },
      { time: "15:00", price: 1200 },
      { time: "16:00", price: 1200 },
      { time: "17:00", price: 1200 },
      { time: "18:00", price: 1200 },
      { time: "19:00", price: 1200 },
      { time: "20:00", price: 1200 },
      { time: "21:00", price: 1200 },
    ],
  });

  const [weekendPricing, setWeekendPricing] = useState<PricingData>({
    name: "Sat - Sun",
    description: "Description",
    timeSlots: [
      { time: "06:00", price: 1000 },
      { time: "07:00", price: 1100 },
      { time: "08:00", price: 1400 },
      { time: "09:00", price: 1400 },
      { time: "10:00", price: 1400 },
      { time: "11:00", price: 1400 },
      { time: "12:00", price: 1400 },
      { time: "13:00", price: 1400 },
      { time: "14:00", price: 1400 },
      { time: "15:00", price: 1400 },
      { time: "16:00", price: 1400 },
      { time: "17:00", price: 1400 },
      { time: "18:00", price: 1400 },
      { time: "19:00", price: 1400 },
      { time: "20:00", price: 1400 },
      { time: "21:00", price: 1400 },
    ],
  });

  const handleWeekdayPricingUpdate = (data: any) => {
    console.log("Weekday pricing updated:", data);
    setWeekdayPricing({
      name: data.name,
      description: data.description,
      timeSlots: data.timeSlots,
    });
    toast.success("Weekday pricing updated successfully");
  };

  const handleWeekendPricingUpdate = (data: any) => {
    console.log("Weekend pricing updated:", data);
    setWeekendPricing({
      name: data.name,
      description: data.description,
      timeSlots: data.timeSlots,
    });
    toast.success("Weekend pricing updated successfully");
  };

  const handleAddPricing = (data: any) => {
    console.log("New pricing added:", data);
    // Determine if it's weekday or weekend pricing based on the name
    if (data.name.toLowerCase().includes("mon") ||
        data.name.toLowerCase().includes("weekday")) {
      setWeekdayPricing({
        name: data.name,
        description: data.description,
        timeSlots: data.timeSlots,
      });
      toast.success("New weekday pricing added successfully");
    } else if (data.name.toLowerCase().includes("sat") ||
               data.name.toLowerCase().includes("weekend")) {
      setWeekendPricing({
        name: data.name,
        description: data.description,
        timeSlots: data.timeSlots,
      });
      toast.success("New weekend pricing added successfully");
    } else {
      toast.success("New pricing added successfully");
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold text-[#10375c] mb-8">Pricing Management</h1>

      <PricingBlock
        weekdayPricing={weekdayPricing}
        weekendPricing={weekendPricing}
        onWeekdayPricingUpdate={handleWeekdayPricingUpdate}
        onWeekendPricingUpdate={handleWeekendPricingUpdate}
      />
    </div>
  );
};

export default PricingBlockPage;
