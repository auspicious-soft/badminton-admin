"use client";
import React, { useState } from "react";
import Image from "next/image";
import { Modal, Box } from "@mui/material";
import Select, { MultiValue } from "react-select";
import MatchImage from "@/assets/images/padelImage.png";

interface NotificationData {
  title: string;
  text: string;
  recipients: string[];
}

interface OptionType {
  value: string;
  label: string;
}

const options: OptionType[] = [
  { value: "Active", label: "Active" },
  { value: "Inactive", label: "Inactive" },
];

const Page = () => {
  const [formData, setFormData] = useState<NotificationData>({
    title: "",
    text: "",
    recipients: [],
  });

  const [open, setOpen] = useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleRecipientsChange = (selectedOptions: MultiValue<OptionType>) => {
    const recipients = selectedOptions.map((option) => option.value);
    setFormData((prev) => ({
      ...prev,
      recipients: recipients,
    }));
  };

  return (
    <>
      {/* Button to Open Modal */}
      <button
        className="bg-[#10375c] text-white py-2 px-4 rounded-lg"
        onClick={handleOpen}
      >
        Open Court Modal
      </button>

      {/* Modal Component */}
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "90%",
            maxWidth: "500px",
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 3,
            borderRadius: "12px",
            outline: "none",
            maxHeight: "90vh",
            overflowY: "auto",
          }}
        >
          {/* Modal Content */}
          <div className="flex flex-col gap-4">
            {/* Image Section */}
            <div className="w-full">
              <Image
                className="rounded-lg w-full h-auto object-cover"
                alt="padel game image"
                src={MatchImage}
                width={500}
                height={300}
              />
            </div>

            {/* Form Section */}
            <div>
              <label className="text-[#1b2229] text-sm font-medium mb-2 block">
                Name of the Court
              </label>
              <input
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter court name"
              />
            </div>

            <div>
              <label className="text-[#1b2229] text-sm font-medium mb-2 block">
                Status
              </label>
              <Select
                isMulti
                options={options}
                value={options.filter((option) =>
                  formData.recipients.includes(option.value)
                )}
                onChange={handleRecipientsChange}
                className="w-full text-black/60 text-sm font-medium"
                classNamePrefix="react-select"
                placeholder="Select Game..."
                styles={{
                  control: (base) => ({
                    ...base,
                    borderRadius: "8px",
                    border: "1px solid #e6e6e6",
                    boxShadow: "none",
                    minHeight: "45px",
                    backgroundColor: "white",
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
                  }),
                  multiValue: (base) => ({
                    ...base,
                    backgroundColor: "#1c2329",
                    borderRadius: "5px",
                    padding: "2px 6px",
                  }),
                  multiValueLabel: (base) => ({
                    ...base,
                    color: "white",
                  }),
                  multiValueRemove: (base) => ({
                    ...base,
                    color: "white",
                    "&:hover": {
                      backgroundColor: "#1c2329",
                      color: "white",
                    },
                  }),
                }}
              />
            </div>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              <button className="w-full h-12 bg-[#fd5602] rounded-lg text-white text-sm font-medium">
                Delete Court
              </button>
              <button className="w-full h-12 bg-[#10375c] rounded-lg text-white text-sm font-medium">
                Save
              </button>
            </div>
          </div>
        </Box>
      </Modal>
    </>
  );
};

export default Page;
