
"use client";
import React, { useState } from "react";
import Modal from "@mui/material/Modal";
import MatchImage from "@/assets/images/employeeImage.png";
import Image from "next/image";
import { SelectSvg } from "@/utils/svgicons";
import SearchBar from "../SearchBar";
import useSWR from "swr";
import { getAllEmployees } from "@/services/admin-services";
import { getImageClientS3URL } from "@/config/axios";


interface EmployeeData {
  employeeId: string;
  fullName: string;
  isActive: boolean;
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
  const itemsPerPage = 11;

  const { data, isLoading } = useSWR(
    `/admin/get-employees?search=${searchTerm}&page=${page}&limit=${itemsPerPage}`,
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

  const handleSave = () => {
    const selectedEmployees = employees
      .filter((employee: { _id: string }) => selectedEmployeeIds.includes(employee._id))
      .map((employee: { _id: string; fullName: string }) => ({
        employeeId: employee._id,
        fullName: employee.fullName,
        // image :employee.ProfilePic,
        isActive: true, // Default to true; adjust if API provides isActive
      }));
    onAddEmployees(selectedEmployees);
    handleClose();
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

          <div className="h-[300px] overflow-y-auto overflow-custom">
            <div className="grid grid-cols-3 gap-y-[39px] gap-x-[10px] mb-4">
              {isLoading ? (
                <p>Loading employees...</p>
              ) : (
                employees.map((employee: { _id: string; fullName: string; Profile?: string }) => (
                  <div
                    key={employee._id}
                    onClick={() => handleEmployeeClick(employee._id)}
                    className="relative flex flex-col items-center rounded-lg cursor-pointer"
                  >
                    <Image
                      src={getImageClientS3URL(employee.Profile) || MatchImage}
                      alt={employee.fullName}
                      className="w-full h-[100px] rounded-[10px] object-cover mb-2"
                      width={100}
                      height={100}
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

          <button
            onClick={handleSave}
            className="w-full text-white text-sm font-medium h-12 py-4 bg-[#10375c] rounded-[28px] mt-[30px]"
          >
            Add
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default AddEmployeeModal;