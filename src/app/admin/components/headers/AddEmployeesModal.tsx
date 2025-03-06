
import React, { useState } from 'react';
import Modal from '@mui/material/Modal';
import MatchImage from "@/assets/images/employeeImage.png";
import Image from "next/image";
import { SelectSvg } from "@/utils/svgicons";
import SearchBar from '../SearchBar';

const employees = [
  { id: 1, name: 'Name of person', image: 'https://via.placeholder.com/100' },
  { id: 2, name: 'Name of person', image: 'https://via.placeholder.com/100' },
  { id: 3, name: 'Name of person', image: 'https://via.placeholder.com/100' },
  { id: 4, name: 'Name of person', image: 'https://via.placeholder.com/100' },
  { id: 5, name: 'Name of person', image: 'https://via.placeholder.com/100' },
  { id: 6, name: 'Name of person', image: 'https://via.placeholder.com/100' },
];

const AddEmployeeModal = ({ open, setOpen }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCourses, setSelectedCourses] = useState<number[]>([]);

  const handleClose = () => setOpen(false);

  // Toggle employee selection
  const handleEmployeeClick = (employeeId: number) => {
    setSelectedCourses(prev => 
      prev.includes(employeeId)
        ? prev.filter(id => id !== employeeId)
        : [...prev, employeeId]
    );
  };

  // Filter employees based on search term
  const filteredEmployees = employees.filter((employee) =>
    employee.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="add-employee-modal"
        aria-describedby="modal-to-add-employees"
      >
        <div className="flex items-center justify-center min-h-screen ">
          <div className="bg-[#f2f2f4] rounded-lg shadow-lg p-[20px] w-full max-w-md">
            <h2 className=" text-[#1b2229] text-lg font-semibold mb-[20px] leading-snug">
              Add Employees
            </h2>

            <div className="flex flex-col  gap-2.5 mb-[20px] w-full">
              {/* <input
                type="text"
                placeholder="Search Name"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              /> */}
              <h6 className="text-[#1b2229] text-xs font-medium ">Search Name</h6>
              <SearchBar widthSearch={true}  setQuery={setSearchTerm} query={searchTerm}/>
            </div>

            <div className="grid grid-cols-3 gap-y-[39px] gap-x-[10px] gap-0 mb-4">
              {filteredEmployees.map((employee) => (
                <div
                  key={employee.id}
                  onClick={() => handleEmployeeClick(employee.id)}
                  className="relative flex flex-col items-center  rounded-lg  cursor-pointer"
                >
                  
                  <Image
                    src={MatchImage}
                    alt={employee.name}
                    className="w-full h-[100px] rounded-[10px] object-cover mb-2"
                  />
                  <div className="absolute self-start left-1 top-1">
                    {selectedCourses.includes(employee.id) ? (
                      <SelectSvg color="#10375c" />
                    ) : (
                      <SelectSvg color="white" />
                    )}
                  </div>
                  <p className="text-start text-black/60 text-xs font-medium ">{employee.name}</p>
                </div>
              ))}
            </div>

            <button
              onClick={handleClose}
              className="w-full text-white text-sm font-medium h-12 py-4 bg-[#10375c] rounded-[28px] mt-[30px]"
            >
              Add
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default AddEmployeeModal;