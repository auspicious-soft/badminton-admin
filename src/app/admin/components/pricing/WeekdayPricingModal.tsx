"use client";
import React, { useState, useEffect, useMemo } from "react";
import Modal from "@mui/material/Modal";
import { useForm, useFieldArray } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { toast } from "sonner";
import { saveDynamicPricing } from "@/services/admin-services";

// Define the validation schema
const pricingSchema = yup.object({
  name: yup.string().required("Name is required"),
  description: yup.string().required("Description is required"),
  // reason: yup.string().required("Reason is required"),
  dayType: yup.string().oneOf(["weekday", "weekend"]).required("Day type is required"),
  timeSlots: yup.array().of(
    yup.object({
      time: yup.string().required("Time is required"),
      price: yup.number().required("Price is required").min(0, "Price must be positive"),
    }).required()
  ).required(),
}).required();

// Define the form values type
interface TimeSlot {
  time: string;
  price: number;
}

interface SlotPricing {
  slot: string;
  price: number;
}

interface PricingFormValues {
  name: string;
  description: string;
  // reason: string;
  dayType: "weekday" | "weekend";
  timeSlots: TimeSlot[];
}

interface WeekdayPricingModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
  initialData?: PricingFormValues & { id?: string };
  title?: string;
  isEditing?: boolean;
  type?: string
}

const WeekdayPricingModal: React.FC<WeekdayPricingModalProps> = ({
  open,
  onClose,
  onSubmit,
  initialData,
  title = "Weekdays/Weekends Pricing",
  type,
  isEditing = false,
}) => {
  // Default values for new pricing - memoized to prevent re-renders
  const defaultValues: PricingFormValues = useMemo(() => ({
    name: "Mon - Fri",
    description: "",
    // reason: "",
    dayType: "weekday",
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
  }), []);

  // Initialize form with react-hook-form
  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<PricingFormValues>({
    resolver: yupResolver(pricingSchema) as any,
    defaultValues,
  });

  const { fields, replace } = useFieldArray({
    control,
    name: "timeSlots",
  });

  // Effect to handle conditional data mapping based on _id presence
  useEffect(() => {
    if (open) {
      if (initialData && initialData.id) {
        // If there's an _id, map the existing data to the form
        const formData = {
          name: initialData.name,
          description: initialData.description,
          // reason: initialData.reason || "",
          dayType: initialData.dayType,
          timeSlots: initialData.timeSlots,
        };
        reset(formData);
        replace(initialData.timeSlots); // Replace the field array
      } else {
        // If no _id, reset to default values (for new pricing)
        reset(defaultValues);
        replace(defaultValues.timeSlots); // Replace with default time slots
      }
    }
  }, [open, initialData, reset, replace, defaultValues]);

  // Handle form submission
  const handleFormSubmit = (data: PricingFormValues) => {
    // Convert the data to the required API format
    const apiPayload: any = {
      name: data.name,
      description: data.description,
      dayType: type,
      slotPricing: data.timeSlots.map(slot => ({
        slot: slot.time,
        price: slot.price
      }))
    };

    // Add ID if editing existing pricing
    if (isEditing && initialData?.id) {
      apiPayload.id = initialData.id;
    }

    // Call the API endpoint using the admin service
    saveDynamicPricing(apiPayload)
      .then((response: any) => {
        console.log('Pricing saved successfully:', response.data);
        const successMessage = isEditing ? "Pricing updated successfully" : "Pricing created successfully";
        toast.success(successMessage);
        onSubmit(data); // Pass the original form data to maintain type compatibility
        onClose();
      })
      .catch((error: any) => {
        console.error('Error saving pricing:', error);
        const errorMessage = isEditing ? "Failed to update pricing" : "Failed to create pricing";
        toast.error(errorMessage);
      });
  };

  // List of reasons for select dropdown
  // const reasons = ["Maintenance", "Holiday", "Special Event", "Other"];

  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="pricing-modal"
      className="flex items-center justify-center"
    >
      <div className="bg-[#f2f2f4] rounded-[20px] w-[95%] max-w-[480px] p-8 shadow-lg">
        <h2 className="text-[#10375c] text-xl font-semibold mb-6 text-center">{title}</h2>

        <form onSubmit={handleSubmit(handleFormSubmit)} className="flex flex-col gap-4">
          {/* Name */}
          <div className="flex flex-col gap-1">
            <label className="text-[#1b2229] text-xs font-medium">Name</label>
            <input
              type="text"
              {...register("name")}
              placeholder="Mon - Fri"
              className="w-full h-[45px] px-4 py-2 bg-white rounded-full text-black/60 text-sm font-medium outline-none"
            />
            {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
          </div>

          {/* Description */}
          <div className="flex flex-col gap-1">
            <label className="text-[#1b2229] text-xs font-medium">Description</label>
            <input
              type="text"
              {...register("description")}
              placeholder="Description"
              className="w-full h-[45px] px-4 py-2 bg-white rounded-full text-black/60 text-sm font-medium outline-none"
            />
            {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description.message}</p>}
          </div>

          {/* Time Slots and Prices */}
          <div className="flex flex-col gap-2 mt-2">
            <div className="grid grid-cols-2 gap-4">
              <label className="text-[#1b2229] text-xs font-medium">Time Slot</label>
              <label className="text-[#1b2229] text-xs font-medium">Price</label>
            </div>

            {/* Scrollable container for time slots */}
            <div className="max-h-[200px] overflow-y-auto overflo-custom pr-2 space-y-2">
              {fields.map((field, index) => (
                <div key={field.id} className="grid grid-cols-2 gap-4">
                  <input
                    type="time"
                    disabled
                    {...register(`timeSlots.${index}.time`)}
                    className="w-full h-[45px] px-4 py-2 border rounded-full text-black/60 text-sm font-medium outline-none"
                  />
                  <input
                    type="number"
                    {...register(`timeSlots.${index}.price`)}
                    placeholder="₹0"
                    className="w-full h-[45px] px-4 py-2 bg-white rounded-full text-black/60 text-sm font-medium outline-none"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Select Reason */}
          {/* <div className="flex flex-col gap-1 mt-2">
            <label className="text-[#1b2229] text-xs font-medium">Select Reason</label>
            <select
              {...register("reason")}
              className="w-full h-[45px] px-4 py-2 bg-[#f2f2f4] rounded-full text-black/60 text-sm font-medium outline-none"
            >
              <option value="">Select</option>
              {reasons.map((reason) => (
                <option key={reason} value={reason}>
                  {reason}
                </option>
              ))}
            </select>
            {errors.reason && <p className="text-red-500 text-xs mt-1">{errors.reason.message}</p>}
          </div> */}

          {/* Buttons */}
          <div className="flex justify-between mt-6 gap-4">
            <button
              type="button"
              onClick={onClose}
              className="w-[30%] px-8 py-2 bg-white border border-gray-300 rounded-full text-[#1b2229] text-sm font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="w-full px-8 py-2 bg-[#10375c] rounded-full text-white text-sm font-medium"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </Modal>
  );
};

export default WeekdayPricingModal;
