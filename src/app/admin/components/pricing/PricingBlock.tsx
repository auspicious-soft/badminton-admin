"use client";
import React, { useState } from "react";
import { EditIcon } from "@/utils/svgicons";
import WeekdayPricingModal from "./WeekdayPricingModal";

interface TimeSlot {
  time: string;
  price: number;
}

interface PricingData {
  name: string;
  description: string;
  timeSlots: TimeSlot[];
}

// API data interfaces
interface ApiSlotPricing {
  slot: string;
  price: number;
  _id: string;
}

interface ApiPricingData {
  _id: string;
  name: string;
  description: string;
  dayType: 'weekday' | 'weekend';
  slotPricing: ApiSlotPricing[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

// Utility function to map API data to component format
export const mapApiDataToPricingData = (apiData: ApiPricingData[]): { weekdayPricing: PricingData & { id?: string }; weekendPricing: PricingData & { id?: string } } => {
  const weekdayData = apiData.find(item => item.dayType === 'weekday');
  const weekendData = apiData.find(item => item.dayType === 'weekend');

  const mapSlots = (slotPricing: ApiSlotPricing[]): TimeSlot[] => {
    return slotPricing.map(slot => ({
      time: slot.slot,
      price: slot.price
    }));
  };

  return {
    weekdayPricing: weekdayData ? {
      id: weekdayData._id,
      name: weekdayData.name,
      description: weekdayData.description,
      timeSlots: mapSlots(weekdayData.slotPricing)
    } : {
      name: "Mon - Fri",
      description: "No weekday pricing available",
      timeSlots: []
    },
    weekendPricing: weekendData ? {
      id: weekendData._id,
      name: weekendData.name,
      description: weekendData.description,
      timeSlots: mapSlots(weekendData.slotPricing)
    } : {
      name: "Sat - Sun",
      description: "No weekend pricing available",
      timeSlots: []
    }
  };
};

interface PricingBlockProps {
  weekdayPricing: PricingData & { id?: string };
  weekendPricing: PricingData & { id?: string };
  onWeekdayPricingUpdate?: (data: any) => void;
  onWeekendPricingUpdate?: (data: any) => void;
}

const PricingBlock: React.FC<PricingBlockProps> = ({
  weekdayPricing = {
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
  },
  weekendPricing = {
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
  },
  onWeekdayPricingUpdate,
  onWeekendPricingUpdate,
}) => {
  const [activeTab, setActiveTab] = useState<"Weekdays" | "Weekends">("Weekdays");
  const [isWeekdayModalOpen, setIsWeekdayModalOpen] = useState(false);
  const [isWeekendModalOpen, setIsWeekendModalOpen] = useState(false);

  const handleWeekdayEdit = () => {
    setIsWeekdayModalOpen(true);
  };

  const handleWeekendEdit = () => {
    setIsWeekendModalOpen(true);
  };

  const handleWeekdayPricingUpdate = (data: any) => {
    if (onWeekdayPricingUpdate) {
      onWeekdayPricingUpdate(data);
    }
    setIsWeekdayModalOpen(false);
  };

  const handleWeekendPricingUpdate = (data: any) => {
    if (onWeekendPricingUpdate) {
      onWeekendPricingUpdate(data);
    }
    setIsWeekendModalOpen(false);
  };

  return (
    <div className="bg-[#f2f2f4] rounded-[20px] p-6 shadow-sm">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-[#10375c] text-2xl font-semibold">Pricing</h2>
        {/* <button
          onClick={handleAddPricing}
          className="flex items-center gap-2 bg-[#10375c] text-white text-sm font-medium px-4 py-2 rounded-full"
        >
          <span className="text-xl">+</span> Add Pricing
        </button> */}
      </div>

      {/* <div className="flex gap-4 mb-6">
        <button
          onClick={() => setActiveTab("Weekdays")}
          className={`px-4 py-2 rounded-full text-sm font-medium ${
            activeTab === "Weekdays"
              ? "bg-[#10375c] text-white"
              : "bg-white text-[#10375c] border border-[#e0e0e0]"
          }`}
        >
          Weekdays
        </button>
        <button
          onClick={() => setActiveTab("Weekends")}
          className={`px-4 py-2 rounded-full text-sm font-medium ${
            activeTab === "Weekends"
              ? "bg-[#10375c] text-white"
              : "bg-white text-[#10375c] border border-[#e0e0e0]"
          }`}
        >
          Weekends
        </button>
      </div> */}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Weekdays Pricing */}
        <div className={` rounded-[15px] ${activeTab !== "Weekdays" && "hidden md:block"}`}>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-[#10375C] text-xl font-semibold ">Weekdays</h3>
            <button
              onClick={handleWeekdayEdit}
              className="flex items-center gap-[10px] text-white text-sm font-medium py-[12px] px-[20px] text-sm bg-[#1C2329] rounded-3xl"
            >
              <EditIcon stroke="white" />
              Edit
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-[#1b2229] text-xs font-medium mb-1">Name</label>
              <div className="w-full h-[45px] px-4 py-2 bg-white rounded-full text-black/60 text-sm font-medium">
                {weekdayPricing.name}
              </div>
            </div>

            <div>
              <label className="block text-[#1b2229] text-xs font-medium mb-1">Description</label>
              <div className="w-full h-[45px] px-4 py-2 bg-white rounded-full text-black/60 text-sm font-medium">
                {weekdayPricing.description}
              </div>
            </div>

            <div className="bg-white px-[16px] py-[20px] rounded-[10px]">
              <div className="grid grid-cols-2 gap-4 mb-2">
                <label className="text-[#1b2229] text-xs font-medium">Time Slot</label>
                <label className="text-[#1b2229] text-xs font-medium">Price</label>
              </div>

              {/* Scrollable container for weekday time slots */}
              <div className="max-h-[200px] overflow-y-auto overflo-custom pr-2 space-y-2">
                {weekdayPricing.timeSlots.map((slot, index) => (
                  <div key={index} className="grid grid-cols-2 gap-4">
                    <div className="w-full h-[45px] px-4 py-2 bg-[#f2f2f4] rounded-full text-black/60 text-sm font-medium flex items-center">
                      {slot.time}
                    </div>
                    <div className="w-full h-[45px] px-4 py-2 bg-[#f2f2f4] rounded-full text-black/60 text-sm font-medium flex items-center">
                      ₹{slot.price}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Weekends Pricing */}
        <div className={`${activeTab !== "Weekends" && "hidden md:block"}`}>
          <div className="flex justify-between items-center mb-4 ">
            <h3 className="text-[#10375C] text-xl font-semibold ">Weekends</h3>
            <button
              onClick={handleWeekendEdit}
              className="flex items-center gap-[10px] text-white text-sm font-medium py-[12px] px-[20px] text-sm font-medium bg-[#1C2329] rounded-3xl"
            >
              <EditIcon stroke="white" />
              Edit
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-[#1b2229] text-xs font-medium mb-1">Name</label>
              <div className="w-full h-[45px] px-4 py-2 bg-white align-center rounded-full text-black/60 text-sm font-medium">
                {weekendPricing.name}
              </div>
            </div>

            <div>
              <label className="block text-[#1b2229] text-xs font-medium mb-1">Description</label>
              <div className="w-full h-[45px] px-4 py-2 bg-white rounded-full text-black/60 text-sm font-medium">
                {weekendPricing.description}
              </div>
            </div>

            <div className="bg-white rounded-[10px] px-[16px] py-[20px]">
              <div className=" bg-white rounded-[15px] grid grid-cols-2 gap-4 mb-2">
                <label className="text-[#1b2229] text-xs font-medium">Time Slot</label>
                <label className="text-[#1b2229] text-xs font-medium">Price</label>
              </div>

              {/* Scrollable container for weekend time slots */}
              <div className="max-h-[200px] overflow-y-auto overflo-custom pr-2 space-y-2">
                {weekendPricing.timeSlots.map((slot, index) => (
                  <div key={index} className="grid grid-cols-2 gap-4">
                    <div className="w-full h-[45px] px-4 py-2 bg-[#f2f2f4] rounded-full text-black/60 text-sm font-medium flex items-center">
                      {slot.time}
                    </div>
                    <div className="w-full h-[45px] px-4 py-2 bg-[#f2f2f4] rounded-full text-black/60 text-sm font-medium flex items-center">
                      ₹{slot.price}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      <WeekdayPricingModal
        open={isWeekdayModalOpen}
        onClose={() => setIsWeekdayModalOpen(false)}
        onSubmit={handleWeekdayPricingUpdate}
        initialData={{
          id: weekdayPricing.id,
          name: weekdayPricing.name,
          description: weekdayPricing.description,
          dayType: "weekday",
          timeSlots: weekdayPricing.timeSlots,
        }}
        title="Edit Weekday Pricing"
        isEditing={!!weekdayPricing.id}
        type="weekday"
      />

      <WeekdayPricingModal
        open={isWeekendModalOpen}
        onClose={() => setIsWeekendModalOpen(false)}
        onSubmit={handleWeekendPricingUpdate}
        initialData={{
          id: weekendPricing.id,
          name: weekendPricing.name,
          description: weekendPricing.description,
          dayType: "weekend",
          timeSlots: weekendPricing.timeSlots,
        }}
        title="Edit Weekend Pricing"
        type="weekend"
        isEditing={!!weekendPricing.id}
      />
    </div>
  );
};

export default PricingBlock;
