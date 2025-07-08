"use client";
import React, { useState } from "react";
import Modal from "@mui/material/Modal";
import Image from "next/image";
import { SelectSvg } from "@/utils/svgicons";
import SearchBar from "../SearchBar";
import useSWR from "swr";
import { getAllEmployees } from "@/services/admin-services";
import { getImageClientS3URL } from "@/config/axios";
import UserProfile2 from "@/assets/images/employeeProfile.jpg";
import { Loader2 } from "lucide-react";

interface EmployeeData {
  employeeId: string;
  fullName: string;
  isActive: boolean;
  image: string;
}

interface AddEmployeeModalProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  onAddEmployees: (employees: EmployeeData[]) => void;
}

const AddEmployeeModal = ({ open, setOpen, onAddEmployees }: AddEmployeeModalProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedEmployeeIds, setSelectedEmployeeIds] = useState<string[]>([]);
  const [page, setPage] = useState(1);
  const [isSaving, setIsSaving] = useState(false);
  const itemsPerPage = 11;

  const { data, isLoading } = useSWR(
    `/admin/get-employees?search=${searchTerm}&page=${page}&limit=${itemsPerPage}&free=true`,
    getAllEmployees
  );

  const employees = data?.data.data || [];

  const handleClose = () => {
    setSelectedEmployeeIds([]);
    setOpen(false);
  };

  const handleEmployeeClick = (employeeId: string) => {
    setSelectedEmployeeIds((prev) =>
      prev.includes(employeeId) ? prev.filter((id) => id !== employeeId) : [...prev, employeeId]
    );
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const selectedEmployees = employees
        .filter((employee: { _id: string }) => selectedEmployeeIds.includes(employee._id))
        .map((employee: any) => ({
          employeeId: employee._id,
          fullName: employee.fullName,
          image: employee.profilePic !== null ? getImageClientS3URL(employee.profilePic) : UserProfile2.src,
          isActive: true,
        }));

      await onAddEmployees(selectedEmployees);
      // Ensure loader is visible for at least 1 second
      await new Promise((resolve) => setTimeout(resolve, 1000));
    } catch (error) {
      console.error("Error saving employees:", error);
      // Optionally handle error (e.g., show a toast notification)
    } finally {
      setIsSaving(false);
      handleClose();
    }
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="add-employee-modal"
      aria-describedby="modal-to-add-employees"
    >
      <div className="flex items-center justify-center min-h-screen">
        <div className="bg-[#f2f2f4] rounded-lg shadow-lg p-[20px] w-full max-w-md">
          <h2 className="text-[#1b2229] text-lg font-semibold mb-[20px] leading-snug">Add Employees</h2>
          <div className="flex flex-col gap-2.5 mb-[20px] w-full">
            <h6 className="text-[#1b2229] text-xs font-medium">Search Name</h6>
            <SearchBar widthSearch={true} setQuery={setSearchTerm} query={searchTerm} />
          </div>

          <div className="h-[300px] overflow-y-auto overflo-custom">
            <div className="grid grid-cols-3 gap-y-[39px] gap-x-[10px] mb-4">
              {isLoading ? (
                <p>Loading employees...</p>
              ) : employees.length === 0 ? (
                <p className="w-full flex-1">No employees</p>
              ) : (
                employees.map((employee: { _id: string; fullName: string; profilePic?: string }) => (
                  <div
                    key={employee._id}
                    onClick={() => handleEmployeeClick(employee._id)}
                    className="relative flex flex-col items-center rounded-lg cursor-pointer"
                  >
                    <Image
                      src={employee.profilePic ? getImageClientS3URL(employee.profilePic) : UserProfile2}
                      alt={employee.fullName}
                      className="w-full h-[110px] rounded-[10px] object-cover mb-2"
                      width={110}
                      height={110}
                    />
                    <div className="absolute self-start left-1 top-1">
                      {selectedEmployeeIds.includes(employee._id) ? (
                        <SelectSvg color="#10375c" />
                      ) : (
                        <SelectSvg color="white" />
                      )}
                    </div>
                    <p className="text-start text-black/60 text-xs font-medium">{employee.fullName}</p>
                  </div>
                ))
              )}
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleClose}
              className="w-[40%] text-[#10375C] align-center text-sm font-medium py-3 bg-white border border-[#10375C] rounded-[28px] mt-[30px]"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={isSaving || selectedEmployeeIds.length === 0}
              className={`w-full text-white text-sm font-medium py-3 bg-[#10375c] rounded-[28px] mt-[30px] flex items-center justify-center ${
                isSaving || selectedEmployeeIds.length === 0 ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              {isSaving ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin text-white mr-2" />
                  Saving...
                </>
              ) : (
                "Add"
              )}
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default AddEmployeeModal;