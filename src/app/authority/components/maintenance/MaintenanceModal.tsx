"use client";
import React, { useState } from "react";
import Modal from "@mui/material/Modal";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { toast } from "sonner";
import Select from "react-select";

// Define the form values type
interface TimeSlot {
  value: string;
  label: string;
}

interface MaintenanceFormValues {
  venue: string;
  court: string;
  date: string;
  timeSlots: TimeSlot[];
  reason: string;
}

// Define the validation schema
const maintenanceSchema = yup.object().shape({
  venue: yup.string().required("Venue is required"),
  court: yup.string().required("Court is required"),
  date: yup.string().required("Date is required"),
  timeSlots: yup
    .array()
    .of(
      yup.object().shape({
        value: yup.string().required(),
        label: yup.string().required(),
      })
    )
    .min(1, "At least one time slot must be selected")
    .required("Time slots are required"),
  reason: yup.string().required("Reason is required"),
});

interface MaintenanceModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
  venues?: { id: string; name: string }[];
  courts?: { id: string; name: string }[];
}

const MaintenanceModal: React.FC<MaintenanceModalProps> = ({
  open,
  onClose,
  onSubmit,
  venues = [],
  courts = [],
}) => {
  // Generate time slots from 6:00 to 22:00
  const timeSlotOptions = Array.from({ length: 16 }, (_, i) => {
    const hour = i + 6; // Start from 6:00
    const timeString = `${hour.toString().padStart(2, "0")}:00`;
    return { value: timeString, label: timeString };
  });

  // Initialize form with react-hook-form
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<MaintenanceFormValues>({
    resolver: yupResolver(maintenanceSchema) as any,
    defaultValues: {
      venue: "",
      court: "",
      date: "",
      timeSlots: [],
      reason: "",
    },
  });

  // Handle form submission
  const handleFormSubmit = (data: MaintenanceFormValues) => {
    // Format the data for submission
    const formattedData = {
      venue: data.venue,
      court: data.court,
      date: data.date,
      timeSlots: data.timeSlots.map(slot => slot.value),
      reason: data.reason,
    };

    onSubmit(formattedData);
    reset();
    onClose();
  };

  // List of venues and courts (should be fetched from API in a real app)
  const venueOptions = venues.length > 0
    ? venues.map(venue => ({ id: venue.id, name: venue.name }))
    : [
        { id: "1", name: "Grand Oak" },
        { id: "2", name: "Sunset Hall" },
        { id: "3", name: "Silver Star" },
        { id: "4", name: "Emerald Arena" },
        { id: "5", name: "Crystal Dome" },
      ];

  const courtOptions = courts.length > 0
    ? courts.map(court => ({ id: court.id, name: court.name }))
    : [
        { id: "1", name: "Court 1" },
        { id: "2", name: "Court 2" },
        { id: "3", name: "Court 3" },
        { id: "4", name: "Court 4" },
        { id: "5", name: "Court 5" },
      ];

  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="maintenance-modal"
      className="flex items-center justify-center"
    >
      <div className="bg-white rounded-[20px] w-[95%] max-w-[480px] p-8 shadow-lg">
        <h2 className="text-[#10375c] text-xl font-semibold mb-6 text-center">Maintenance</h2>

        <form onSubmit={handleSubmit(handleFormSubmit)} className="flex flex-col gap-4">
          {/* Venue */}
          <div className="flex flex-col gap-1">
            <label className="text-[#1b2229] text-xs font-medium">Select Venue</label>
            <select
              {...register("venue")}
              className="w-full h-[45px] px-4 py-2 bg-[#f2f2f4] rounded-full text-black/60 text-sm font-medium outline-none"
            >
              <option value="">Select</option>
              {venueOptions.map((venue) => (
                <option key={venue.id} value={venue.id}>
                  {venue.name}
                </option>
              ))}
            </select>
            {errors.venue && <p className="text-red-500 text-xs mt-1">{errors.venue.message}</p>}
          </div>

          {/* Court */}
          <div className="flex flex-col gap-1">
            <label className="text-[#1b2229] text-xs font-medium">Select Court</label>
            <select
              {...register("court")}
              className="w-full h-[45px] px-4 py-2 bg-[#f2f2f4] rounded-full text-black/60 text-sm font-medium outline-none"
            >
              <option value="">Select</option>
              {courtOptions.map((court) => (
                <option key={court.id} value={court.id}>
                  {court.name}
                </option>
              ))}
            </select>
            {errors.court && <p className="text-red-500 text-xs mt-1">{errors.court.message}</p>}
          </div>

          {/* Date */}
          <div className="flex flex-col gap-1">
            <label className="text-[#1b2229] text-xs font-medium">Date</label>
            <input
              type="date"
              {...register("date")}
              className="w-full h-[45px] px-4 py-2 bg-[#f2f2f4] rounded-full text-black/60 text-sm font-medium outline-none"
            />
            {errors.date && <p className="text-red-500 text-xs mt-1">{errors.date.message}</p>}
          </div>

          {/* Time Slots - Multiselect */}
          <div className="flex flex-col gap-1">
            <label className="text-[#1b2229] text-xs font-medium">Select Timeslot</label>
            <Controller
              name="timeSlots"
              control={control}
              render={({ field }) => (
                <Select
                  {...field}
                  isMulti
                  options={timeSlotOptions}
                  className="w-full text-black/60 text-xs font-medium"
                  classNamePrefix="react-select"
                  placeholder="Select Time Slots..."
                  styles={{
                    control: (base) => ({
                      ...base,
                      borderRadius: "44px",
                      border: "1px solid #e6e6e6",
                      boxShadow: "none",
                      backgroundColor: "#f2f2f4",
                      "&:hover": {
                        borderColor: "#e6e6e6",
                      },
                      padding: "2px",
                    }),
                    menu: (base) => ({
                      ...base,
                      borderRadius: "8px",
                      boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                    }),
                    option: (base, { isFocused }) => ({
                      ...base,
                      backgroundColor: isFocused ? "#e6f7ff" : "white",
                      color: "#1c2329",
                      "&:active": {
                        backgroundColor: "#e6f7ff",
                      },
                    }),
                    multiValue: (base) => ({
                      ...base,
                      backgroundColor: "#1c2329",
                      borderRadius: "5px",
                    }),
                    multiValueLabel: (base) => ({
                      ...base,
                      color: "white",
                      padding: "4px 2px 4px 12px",
                    }),
                    multiValueRemove: (base) => ({
                      ...base,
                      color: "white",
                      margin: "4px 5px 4px 0px",
                      "&:hover": {
                        backgroundColor: "#1c2329",
                        color: "white",
                      },
                    }),
                  }}
                />
              )}
            />
            {errors.timeSlots && <p className="text-red-500 text-xs mt-1">{errors.timeSlots.message}</p>}
          </div>

          {/* Reason */}
          <div className="flex flex-col gap-1">
            <label className="text-[#1b2229] text-xs font-medium">Select Reason</label>
            <input
              type="text"
              {...register("reason")}
              placeholder="Maintenance"
              className="w-full h-[45px] px-4 py-2 bg-[#f2f2f4] rounded-full text-black/60 text-sm font-medium outline-none"
            />
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
              Change Status
            </button>
          </div>
        </form>
      </div>
    </Modal>
  );
};

export default MaintenanceModal;
