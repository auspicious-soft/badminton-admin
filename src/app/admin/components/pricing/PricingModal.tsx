"use client";
import React, { useState } from "react";
import Modal from "@mui/material/Modal";
import { useForm, useFieldArray } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import Image from "next/image";
import { toast } from "sonner";

// Define the validation schema
const pricingSchema = yup.object().shape({
  name: yup.string().required("Name is required"),
  description: yup.string().required("Description is required"),
  reason: yup.string().required("Reason is required"),
  timeSlots: yup.array().of(
    yup.object().shape({
      time: yup.string().required("Time is required"),
      price: yup.number().required("Price is required").min(0, "Price must be positive"),
    })
  ),
});

// Define the form values type
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

interface PricingModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: PricingFormValues) => void;
  initialData?: PricingFormValues;
  title?: string;
}

const PricingModal: React.FC<PricingModalProps> = ({
  open,
  onClose,
  onSubmit,
  initialData,
  title = "Weekdays/Weekends Pricing",
}) => {
  // Initialize form with react-hook-form
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<PricingFormValues>({
    resolver: yupResolver(pricingSchema) as any,
    defaultValues: initialData || {
      name: "",
      description: "",
      reason: "",
      timeSlots: [
        { time: "06:00", price: 0 },
        { time: "07:00", price: 0 },
        { time: "08:00", price: 0 },
        { time: "09:00", price: 0 },
        { time: "10:00", price: 0 },
        { time: "11:00", price: 0 },
        { time: "12:00", price: 0 },
        { time: "13:00", price: 0 },
        { time: "14:00", price: 0 },
        { time: "15:00", price: 0 },
        { time: "16:00", price: 0 },
        { time: "17:00", price: 0 },
        { time: "18:00", price: 0 },
        { time: "19:00", price: 0 },
        { time: "20:00", price: 0 },
        { time: "21:00", price: 0 },
      ],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "timeSlots",
  });

  // Handle form submission
  const handleFormSubmit = (data: PricingFormValues) => {
    onSubmit(data);
    toast.success("Pricing saved successfully");
    onClose();
  };

  // List of reasons for select dropdown
  const reasons = ["Maintenance", "Holiday", "Special Event", "Other"];

  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="pricing-modal"
      className="flex items-center justify-center"
    >
      <div className="bg-white rounded-[20px] w-[95%] max-w-[480px] p-8 shadow-lg">
        <h2 className="text-[#10375c] text-xl font-semibold mb-6 text-center">{title}</h2>

        <form onSubmit={handleSubmit(handleFormSubmit)} className="flex flex-col gap-4">
          {/* Name */}
          <div className="flex flex-col gap-1">
            <label className="text-[#1b2229] text-xs font-medium">Name</label>
            <input
              type="text"
              {...register("name")}
              placeholder="Mon - Fri"
              className="w-full h-[45px] px-4 py-2 bg-[#f2f2f4] rounded-full text-black/60 text-sm font-medium outline-none"
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
              className="w-full h-[45px] px-4 py-2 bg-[#f2f2f4] rounded-full text-black/60 text-sm font-medium outline-none"
            />
            {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description.message}</p>}
          </div>

          {/* Time Slots and Prices */}
          <div className="flex flex-col gap-2 mt-2">
            <div className="grid grid-cols-2 gap-4">
              <label className="text-[#1b2229] text-xs font-medium">Time Slot</label>
              <label className="text-[#1b2229] text-xs font-medium">Price</label>
            </div>

            {fields.map((field, index) => (
              <div key={field.id} className="grid grid-cols-2 gap-4">
                <input
                  type="time"
                  {...register(`timeSlots.${index}.time`)}
                  className="w-full h-[45px] px-4 py-2 bg-[#f2f2f4] rounded-full text-black/60 text-sm font-medium outline-none"
                />
                <input
                  type="number"
                  {...register(`timeSlots.${index}.price`)}
                  placeholder="₹0"
                  className="w-full h-[45px] px-4 py-2 bg-[#f2f2f4] rounded-full text-black/60 text-sm font-medium outline-none"
                />
              </div>
            ))}
          </div>

          {/* Select Reason */}
          <div className="flex flex-col gap-1 mt-2">
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
          </div>

          {/* Buttons */}
          <div className="flex justify-between mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-8 py-2 bg-white border border-gray-300 rounded-full text-[#1b2229] text-sm font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-8 py-2 bg-[#10375c] rounded-full text-white text-sm font-medium"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </Modal>
  );
};

export default PricingModal;
