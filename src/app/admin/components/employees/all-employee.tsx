// "use client";
// import { WhiteDownArrow, BottomArrow, Edit1, Add, EyeIcon } from "@/utils/svgicons";
// import React, { useState, useEffect, useRef } from "react";
// import SearchBar from "../SearchBar";
// import Image from "next/image";
// import AlexParker from "@/assets/images/AlexParker.png";
// import Ball from "@/assets/images/Ball.png";
// import { UpArrowIcon, DownArrowIcon } from "@/utils/svgicons";
// import { useRouter } from "next/navigation";
// import useSWR from 'swr';
// import { getAllEmployees, updateEmployee } from "@/services/admin-services";
// import TablePagination from "@/app/components/TablePagination";
// import { toast } from "sonner";

// const games = ["Working", "Ex-Employee"];
// const cities = ["New York", "Los Angeles", "Chicago", "Houston"];

// interface NotificationData {
//   title: string;
//   text: string;
//   recipients: string[];
// }

// interface OptionType {
//   value: string;
//   label: string;
// }

// interface Employee {
//   _id: string;
//   fullName: string;
//   status: string;
//   email: string;
//   phoneNumber: string;
//   image?: string;
// }

// interface EmployeesResponse {
//   data: {
//     data: Employee[];
//     meta: {
//       total: number;
//     };
//   };
// }

// const AllEmployeeComponent = () => {
//   const [formData, setFormData] = useState<NotificationData>({
//     title: "",
//     text: "",
//     recipients: [],
//   });
  
//   const [selectedGame, setSelectedGame] = useState("");
//   const [gameDropdown, setGameDropdown] = useState(false);
//   const [selectedStatus, setSelectedStatus] = useState(false);
//   const [searchParams, setSearchParams] = useState("");
//   const [page, setPage] = useState(1);
//   const itemsPerPage = 11;
//   const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
//   const [editFormData, setEditFormData] = useState<Employee>({
//     _id: "",
//     fullName: "",
//     email: "",
//     phoneNumber: "",
//     status: "",
//     image: "",
//   });
//   const [originalFormData, setOriginalFormData] = useState<Employee | null>(null); // To track original values
//   const [loading, setLoading] = useState(false); // Loader state
//   // const { data, mutate } = useSWR<EmployeesResponse>("/admin/get-employees", getAllEmployees);
//       const { data, mutate, isLoading } = useSWR<EmployeesResponse>(`/admin/get-employees?search=${searchParams}&page=${page}&limit=${itemsPerPage}&status=${selectedGame}`, getAllEmployees);

//   const employees = data?.data.data || [];
//   const totalEmployees = searchParams ? employees.length : data?.data.meta.total || 0;
//     const router = useRouter();

//   const gameDropdownRef = useRef<HTMLDivElement>(null); // Ref for game dropdown
//   const statusDropdownRef = useRef<HTMLDivElement>(null); // Ref for status dropdown

//   const handlePageChange = (newPage: number) => {
//     setPage(newPage);
//   };

//   const [selectedImage, setSelectedImage] = useState<string | null>(null);
//   const [dropdownStates, setDropdownStates] = useState<{ [key: string]: boolean }>({});
//   console.log('dropdownStates: ', dropdownStates);

//   useEffect(() => {
//     if (employees.length > 0 && !selectedEmployee) {
//       const firstEmployee = employees[0];
//       setSelectedEmployee(firstEmployee);
//       setEditFormData({
//         ...firstEmployee,
//         image: firstEmployee.image || "",
//       });
//       setSelectedImage(firstEmployee.image || null);
//       setOriginalFormData({ ...firstEmployee, image: firstEmployee.image || "" }); // Set original data
//     }
//   }, [employees, selectedEmployee]);

//   useEffect(() => {
//     // Close dropdowns when clicking outside
//     const handleClickOutside = (event: MouseEvent) => {
//       if (
//         gameDropdownRef.current &&
//         !gameDropdownRef.current.contains(event.target as Node) &&
//         statusDropdownRef.current &&
//         !statusDropdownRef.current.contains(event.target as Node)
//       ) {
//         setGameDropdown(false);
//         setSelectedStatus(false);
//       }
//     };

//     document.addEventListener("mousedown", handleClickOutside);
//     return () => {
//       document.removeEventListener("mousedown", handleClickOutside);
//     };
//   }, []);

//   const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
//     const file = event.target.files?.[0];
//     if (file) {
//       if (selectedImage) {
//         URL.revokeObjectURL(selectedImage);
//       }
//       const imageUrl = URL.createObjectURL(file);
//       setSelectedImage(imageUrl);
//     }
//   };

//   const toggleDropdown = (id: string) => {
//     setDropdownStates((prev) => ({
//       ...prev,
//       [id]: !prev[id],
//     }));
//   };

//   const handleEmployeeSelect = (employee: Employee) => {
//     setSelectedEmployee(employee);
//     setEditFormData({
//       ...employee,
//       image: employee.image || "",
//     });
//     setSelectedImage(employee.image || null);
//     setOriginalFormData({ ...employee, image: employee.image || "" }); // Update original data on selection
//   };

//   const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const { name, value } = e.target;
//     if (name === "phoneNumber") {
//       // Filter out non-numeric characters
//       const numericValue = value.replace(/[^0-9]/g, "");
//       // Limit to 10 digits
//       if (numericValue.length <= 10) {
//         setEditFormData((prev) => ({
//           ...prev,
//           [name]: numericValue,
//         }));
//       } 
//     } else {
//       setEditFormData((prev) => ({
//         ...prev,
//         [name]: value,
//       }));
//     }
//   };

//   const validateForm = () => {
//     const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//     if (!editFormData.fullName.trim()) return "Name is required";
//     if (!editFormData.email.trim()) return "Email is required";
//     if (!emailRegex.test(editFormData.email)) return "Email is invalid";
//     if (!editFormData.phoneNumber.trim()) return "Phone number is required";
//     if (editFormData.phoneNumber.length !== 10) return "Phone number must be 10 digits";
//     if (!editFormData.status) return "Status is required";
//     return "";
//   };

//   const hasChanges = () => {
//     if (!originalFormData) return false;
//     return (
//       editFormData.fullName !== originalFormData.fullName ||
//       editFormData.email !== originalFormData.email ||
//       editFormData.phoneNumber !== originalFormData.phoneNumber ||
//       editFormData.status !== originalFormData.status ||
//       (selectedImage !== null && selectedImage !== originalFormData.image) // Check for image change
//     );
//   };

//   const handleSave = async () => {
//     const error = validateForm();
//     if (error) {
//       toast.error(error);
//       return;
//     }

//     if (!hasChanges()) {
//       toast.info("No changes to save");
//       return;
//     }

//     setLoading(true);
//     try {
//       const payload = {
//         fullName: editFormData.fullName,
//         email: editFormData.email,
//         phoneNumber: editFormData.phoneNumber,
//         status: editFormData.status,
//         image: selectedImage || undefined,
//         id: selectedEmployee?._id,
//       };

//       const response = await updateEmployee(`/admin/update-employee`, payload);
      
//       if (response?.status === 200) {
//         toast.success("Employee updated successfully");
//         mutate();
//         setSelectedEmployee({
//           ...selectedEmployee,
//           ...payload,
//           image: selectedImage || undefined,
//         });
//         setOriginalFormData({ ...editFormData, image: selectedImage || undefined }); // Update original data after save
//       } else {
//         toast.error("Failed to update employee");
//       }
//     } catch (error) {
//       toast.error("Something went wrong");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div>
//       <h1 className="text-[#10375c] mb-4 text-3xl font-semibold">All Employees</h1>

//       {/* Header Controls */}
//       <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-1">
//         <div className="flex flex-row gap-2 sm:flex-start items-start sm:w-auto">
//           <button className="h-10 px-5 py-3 border border-[#e6e6e6] rounded-full bg-[#1b2229] text-white flex justify-between items-center text-xs font-medium">
//             Sort <WhiteDownArrow />
//           </button>

//           <div className="mb-4" ref={gameDropdownRef}>
//             <div className="relative items-center">
//               <button
//                 className="h-10 px-5 py-3 border border-[#e6e6e6] rounded-full bg-[#1b2229] text-white flex justify-between items-center text-xs font-medium"
//                 onClick={() => setGameDropdown(!gameDropdown)}
//               >
//                 {selectedGame || "Select Status"}
//                 <span>{!gameDropdown ? <WhiteDownArrow /> : <UpArrowIcon />}</span>
//               </button>
//               {gameDropdown && (
//                 <div className="z-50 flex flex-col gap-2 absolute top-14 left-0 p-4 bg-white rounded-[10px] shadow-lg">
//                   {games.map((status) => (
//                     <label key={status} className="flex gap-2 cursor-pointer text-[#1b2229] text-xs font-medium">
//                       <input
//                         type="radio"
//                         name="Select Status"
//                         value={status}
//                         checked={selectedGame === status}
//                         onChange={(e) => {
//                           setSelectedGame(e.target.value);
//                           setGameDropdown(false);
//                         }}
//                         className="accent-[#1b2229]" />
//                       {status}
//                     </label>
//                   ))}
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>
//         <button onClick={() => router.push("/admin/employees/add")} className="flex h-10 w-[210px] md:w-[210px] sm:w-[210px] px-5 py-3 bg-[#1b2229] rounded-full justify-between items-center gap-2 text-white text-sm font-medium">
//           <Add /> Add A New Employee
//         </button>
//       </div>

//       {/* Main Content */}
//       <div className="flex flex-col lg:flex-row gap-6">
//         {/* Left Side - Employee List */}
//         <div className="w-full lg:w-2/3 bg-[#f2f2f4] rounded-[20px] p-4 md:p-6 h-auto lg:h-[657px] overflow-auto">
//           <div className="flex flex-col sm:flex-row justify-between items-center mb-4">
//             <h2 className="text-[#10375c] text-lg md:text-xl font-medium">All Employees</h2>
//             <div className="w-full sm:w-auto mt-2 sm:mt-0">
//               <SearchBar setQuery={setSearchParams} query={searchParams} />
//             </div>
//           </div>

//           {/* Table Header */}
//           <div className="hidden md:flex justify-between items-center text-[#7e7e8a] text-xs font-medium mb-2">
//             <div className="w-[30%] ">Name</div>
//             <div className="w-[28%] text-left">Status</div>
//             <div className="w-[25%] text-left">Email</div>
//             <div className="w-[20%] text-left">Phone Number</div>
//             <div className="w-[5%] text-right pr-2 ">Action</div>
//           </div>
//           <div className="hidden md:block border-t border-[#d0d0d0] mb-2"></div>
//           {isLoading ? (
//             <p className="text-center text-[#10375c] py-4">Loading...</p>
//           ) : employees.length === 0 ? (
//             <p className="text-center text-[#10375c] py-4">No data found.</p>
//           ) : (
//             <>
//           {/* Employee List */}
//           {employees.map((employee: Employee, index: number) => (

//             <div
//               key={employee._id}
//               className={`w-full cursor-pointer flex flex-col md:flex-row items-start md:items-center p-3 rounded-[10px] mb-2 ${
//                 selectedEmployee?._id === employee._id
//                   ? "bg-[#176dbf] text-white"
//                   : index % 2 === 0
//                     ? "bg-white"
//                     : "bg-gray-200"
//               }`}
//               onClick={() => handleEmployeeSelect(employee)}
//             >
//               <div
//                 className={`w-full md:w-[25%] flex items-center gap-2 text-xs font-medium p-2 ${
//                   selectedEmployee?._id === employee._id ? "text-white" : "text-[#1b2229]"
//                 }`}
//               >
//                 <Image src={AlexParker} alt="Avatar" className="rounded-full" width={25} height={25} />
//                 <span className="md:hidden font-bold">Name: </span> {employee.fullName}
//               </div>

//               <div className={`w-full md:w-[22%] p-2 flex justify-center items-center`}>
//                 <span
//                   className={`flex items-center w-[100px] md:w-full px-2 py-1 rounded-full text-xs font-medium ${
//                     employee.status === "Working"
//                       ? "bg-[#14d1a4] text-white"
//                       : "bg-[#d11414] text-white"
//                   }`}
//                 >
//                   {employee.status}
//                 </span>
//               </div>

//               <div
//                 className={`w-full md:w-[25%] text-xs md:text-center font-medium p-2 ${
//                   selectedEmployee?._id === employee._id ? "text-white" : "text-[#1b2229]"
//                 }`}
//               >
//                 <span className="md:hidden font-bold">Email: </span> {employee.email}
//               </div>

//               <div
//                 className={`w-full md:w-[18%] md:text-center text-xs font-medium p-2 ${
//                   selectedEmployee?._id === employee._id ? "text-white" : "text-[#1b2229]"
//                 }`}
//               >
//                 <span className="md:hidden font-bold">Phone: </span> {employee.phoneNumber}
//               </div>

//               <div className="w-full md:w-[10%] md:text-right text-xs font-medium p-2 flex justify-start md:justify-end">
//                 <EyeIcon stroke={selectedEmployee?._id === employee._id ? "#FFFF" : "#fd5602"} />
//               </div>
//             </div>
//           ))}
//           <div className="mt-4 flex justify-end gap-2">
//             <TablePagination
//               setPage={handlePageChange}
//               page={page}
//               totalData={totalEmployees}
//               itemsPerPage={itemsPerPage}
//             />
//           </div>
//           </>
//           )}
//         </div>

//         {/* Right Side - Employee Details */}
//         <div className="w-full lg:w-1/3 mt-6 lg:mt-0" ref={statusDropdownRef}>
//           <div className="relative w-full h-[262px]">
//             {selectedImage ? (
//               <Image
//                 src={selectedImage}
//                 alt="Selected"
//                 width={300}
//                 height={262}
//                 className="w-full h-full rounded-[10px] object-cover"
//               />
//             ) : (
//               <Image
//                 className="w-full h-full rounded-[10px] object-cover"
//                 src={Ball}
//                 alt="Ball Image"
//                 width={300}
//                 height={262}
//               />
//             )}
//             <label className="absolute bottom-2 right-2 h-12 px-4 py-2 flex bg-white rounded-full items-center gap-2 cursor-pointer">
//               <Edit1 />
//               <span className="text-black text-sm font-medium">Change Image</span>
//               <input type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
//             </label>
//           </div>

//           <div className="w-full rounded-[20px] mt-4">
//             <div className="mb-4">
//               <label className="text-[#1b2229] text-xs font-medium block mb-2">Name Of Employee</label>
//               <input
//                 type="text"
//                 name="fullName"
//                 value={editFormData.fullName}
//                 onChange={handleInputChange}
//                 className="w-full h-12 px-4 py-2 bg-white border border-[#e6e6e6] rounded-full text-black/60 text-xs font-medium"
//                 disabled={!selectedEmployee}
//                 placeholder="Employee Name"
//               />
//             </div>
//             <div className="flex w-full gap-[15px]">
//               <div className="mb-4 w-[50%]">
//                 <label className="text-[#1b2229] text-xs font-medium block mb-2">Email Address</label>
//                 <input
//                   type="email"
//                   name="email"
//                   value={editFormData.email}
//                   onChange={handleInputChange}
//                   className="w-full h-12 px-4 py-2 bg-white border border-[#e6e6e6] rounded-full text-black/60 text-xs font-medium"
//                   disabled={!selectedEmployee}
//                   placeholder="Employee email"
//                 />
//               </div>
//               <div className="mb-4 w-[50%]">
//                 <label className="text-[#1b2229] text-xs font-medium block mb-2">Phone Number</label>
//                 <input
//                   type="text"
//                   name="phoneNumber"
//                   value={editFormData.phoneNumber}
//                   onChange={handleInputChange}
//                   className="w-full h-12 px-4 py-2 bg-white border border-[#e6e6e6] rounded-full text-black/60 text-xs font-medium"
//                   disabled={!selectedEmployee}
//                   placeholder="Employee phone number"

//                 />
//               </div>
//             </div>
//             <div className="mb-4">
//               <label className="text-[#1b2229] text-xs font-medium block mb-2">Status</label>
//               <div className="relative">
//                 <button
//                   onClick={() => setSelectedStatus(!selectedStatus)}
//                   className="w-full h-12 px-5 py-3 border border-[#e6e6e6] rounded-full bg-white text-[#1b2229] flex justify-between items-center text-xs font-medium"
//                 >
//                   {editFormData.status || "Select Status"}
//                   <span>{!selectedStatus ? <BottomArrow /> : <UpArrowIcon />}</span>
//                 </button>
//                 {selectedStatus && (
//                   <div className="z-50 flex flex-col gap-2 absolute top-14 left-0 p-4 w-full bg-white rounded-[10px] shadow-lg">
//                     {games.map((status) => (
//                       <label key={status} className="flex gap-2 cursor-pointer text-[#1b2229] text-xs font-medium">
//                         <input
//                           type="radio"
//                           name="Select Status"
//                           value={status}
//                           checked={editFormData.status === status}
//                           onChange={(e) => {
//                             setEditFormData((prev) => ({
//                               ...prev,
//                               status: e.target.value,
//                             }));
//                             setSelectedStatus(false);
//                           }}
//                           className="accent-[#1b2229]"
//                         />
//                         {status}
//                       </label>
//                     ))}
//                   </div>
//                 )}
//               </div>
//             </div>

//             <button
//               className="w-full h-12 bg-[#10375c] rounded-full text-white text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
//               onClick={handleSave}
//               disabled={!selectedEmployee || loading || !hasChanges()}
//             >
//               {loading ? (
//                 <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
//                   <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
//                   <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
//                 </svg>
//               ) : (
//                 "Save"
//               )}
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default AllEmployeeComponent;




"use client";
import { WhiteDownArrow, BottomArrow, Edit1, Add, EyeIcon, UpArrowIcon } from "@/utils/svgicons";
import React, { useState, useEffect, useRef } from "react";
import SearchBar from "../SearchBar";
import Image from "next/image";
import AlexParker from "@/assets/images/AlexParker.png";
import Ball from "@/assets/images/Ball.png";
import { useRouter } from "next/navigation";
import useSWR from "swr";
import { getAllEmployees, updateEmployee } from "@/services/admin-services";
import TablePagination from "@/app/components/TablePagination";
import { toast } from "sonner";

const games = ["Working", "Ex-Employee"];
const sortOptions = [
  { value: "fullName", label: "A to Z" },
  { value: "createdAt", label: "Newest to Oldest" },
];

interface NotificationData {
  title: string;
  text: string;
  recipients: string[];
}

interface Employee {
  _id: string;
  fullName: string;
  status: string;
  email: string;
  phoneNumber: string;
  image?: string;
}

interface EmployeesResponse {
  data: {
    data: Employee[];
    meta: {
      total: number;
    };
  };
}

const AllEmployeeComponent = () => {
  const [formData, setFormData] = useState<NotificationData>({
    title: "",
    text: "",
    recipients: [],
  });

  const [selectedGame, setSelectedGame] = useState("");
  const [gameDropdown, setGameDropdown] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState(false);
  const [searchParams, setSearchParams] = useState("");
  const [page, setPage] = useState(1);
  const itemsPerPage = 11;
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [editFormData, setEditFormData] = useState<Employee>({
    _id: "",
    fullName: "",
    email: "",
    phoneNumber: "",
    status: "",
    image: "",
  });
  const [originalFormData, setOriginalFormData] = useState<Employee | null>(null);
  const [loading, setLoading] = useState(false);
  const [selectedSort, setSelectedSort] = useState("");
  console.log('selectedSort: ', selectedSort);
  const [sortDropdown, setSortDropdown] = useState(false);

  const { data, mutate, isLoading } = useSWR<EmployeesResponse>(
    `/admin/get-employees?search=${searchParams}&page=${page}&limit=${itemsPerPage}&status=${selectedGame}&sortBy=${selectedSort}`,
    getAllEmployees
  );

  const employees = data?.data.data || [];
  const totalEmployees = searchParams ? employees.length : data?.data.meta.total || 0;
  const router = useRouter();

  const gameDropdownRef = useRef<HTMLDivElement>(null);
  const statusDropdownRef = useRef<HTMLDivElement>(null);
  const sortDropdownRef = useRef<HTMLDivElement>(null);

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [dropdownStates, setDropdownStates] = useState<{ [key: string]: boolean }>({});

  useEffect(() => {
    if (employees.length > 0 && !selectedEmployee) {
      const firstEmployee = employees[0];
      setSelectedEmployee(firstEmployee);
      setEditFormData({
        ...firstEmployee,
        image: firstEmployee.image || "",
      });
      setSelectedImage(firstEmployee.image || null);
      setOriginalFormData({ ...firstEmployee, image: firstEmployee.image || "" });
    }
  }, [employees, selectedEmployee]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        gameDropdownRef.current &&
        !gameDropdownRef.current.contains(event.target as Node) &&
        statusDropdownRef.current &&
        !statusDropdownRef.current.contains(event.target as Node) &&
        sortDropdownRef.current &&
        !sortDropdownRef.current.contains(event.target as Node)
      ) {
        setGameDropdown(false);
        setSelectedStatus(false);
        setSortDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (selectedImage) {
        URL.revokeObjectURL(selectedImage);
      }
      const imageUrl = URL.createObjectURL(file);
      setSelectedImage(imageUrl);
    }
  };

  const toggleDropdown = (id: string) => {
    setDropdownStates((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const handleEmployeeSelect = (employee: Employee) => {
    setSelectedEmployee(employee);
    setEditFormData({
      ...employee,
      image: employee.image || "",
    });
    setSelectedImage(employee.image || null);
    setOriginalFormData({ ...employee, image: employee.image || "" });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === "phoneNumber") {
      const numericValue = value.replace(/[^0-9]/g, "");
      if (numericValue.length <= 10) {
        setEditFormData((prev) => ({
          ...prev,
          [name]: numericValue,
        }));
      }
    } else {
      setEditFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const validateForm = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!editFormData.fullName.trim()) return "Name is required";
    if (!editFormData.email.trim()) return "Email is required";
    if (!emailRegex.test(editFormData.email)) return "Email is invalid";
    if (!editFormData.phoneNumber.trim()) return "Phone number is required";
    if (editFormData.phoneNumber.length !== 10) return "Phone number must be 10 digits";
    if (!editFormData.status) return "Status is required";
    return "";
  };

  const hasChanges = () => {
    if (!originalFormData) return false;
    return (
      editFormData.fullName !== originalFormData.fullName ||
      editFormData.email !== originalFormData.email ||
      editFormData.phoneNumber !== originalFormData.phoneNumber ||
      editFormData.status !== originalFormData.status ||
      (selectedImage !== null && selectedImage !== originalFormData.image)
    );
  };

  const handleSave = async () => {
    const error = validateForm();
    if (error) {
      toast.error(error);
      return;
    }

    if (!hasChanges()) {
      toast.info("No changes to save");
      return;
    }

    setLoading(true);
    try {
      const payload = {
        fullName: editFormData.fullName,
        email: editFormData.email,
        phoneNumber: editFormData.phoneNumber,
        status: editFormData.status,
        image: selectedImage || undefined,
        id: selectedEmployee?._id,
      };

      const response = await updateEmployee(`/admin/update-employee`, payload);

      if (response?.status === 200) {
        toast.success("Employee updated successfully");
        mutate();
        setSelectedEmployee({
          ...selectedEmployee,
          ...payload,
          image: selectedImage || undefined,
        });
        setOriginalFormData({ ...editFormData, image: selectedImage || undefined });
      } else {
        toast.error("Failed to update employee");
      }
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1 className="text-[#10375c] mb-4 text-3xl font-semibold">All Employees</h1>

      {/* Header Controls */}
      <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-1">
        <div className="flex flex-row gap-2 sm:flex-start items-start sm:w-auto">
          {/* Sort Dropdown */}
          <div ref={sortDropdownRef}>
            <div className="relative items-center">
              <button
                className="h-10 px-5 py-3 border border-[#e6e6e6] rounded-full bg-[#1b2229] text-white flex justify-between items-center text-xs font-medium"
                onClick={() => setSortDropdown(!sortDropdown)}
              >
                {selectedSort ? sortOptions.find(opt => opt.value === selectedSort)?.label || "Sort" : "Sort"}
                <span>{!sortDropdown ? <WhiteDownArrow /> : <UpArrowIcon />}</span>
              </button>
              {sortDropdown && (
                <div className="z-50 flex flex-col gap-2 absolute top-14 left-0 p-4 bg-white rounded-[10px] shadow-lg">
                  {sortOptions.map((option) => (
                    <label key={option.value} className="flex gap-2 cursor-pointer text-[#1b2229] text-xs font-medium">
                      <input
                        type="radio"
                        name="Sort"
                        value={option.value}
                        checked={selectedSort === option.value}
                        onChange={(e) => {
                          setSelectedSort(e.target.value);
                          setSortDropdown(false);
                          setPage(1);
                        }}
                        className="accent-[#1b2229]"
                      />
                      {option.label}
                    </label>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Status Dropdown */}
          <div className="mb-4" ref={gameDropdownRef}>
            <div className="relative items-center">
              <button
                className="h-10 px-5 py-3 border border-[#e6e6e6] rounded-full bg-[#1b2229] text-white flex justify-between items-center text-xs font-medium"
                onClick={() => setGameDropdown(!gameDropdown)}
              >
                {selectedGame || "Select Status"}
                <span>{!gameDropdown ? <WhiteDownArrow /> : <UpArrowIcon />}</span>
              </button>
              {gameDropdown && (
                <div className="z-50 flex flex-col gap-2 absolute top-14 left-0 p-4 bg-white rounded-[10px] shadow-lg">
                  {games.map((status) => (
                    <label key={status} className="flex gap-2 cursor-pointer text-[#1b2229] text-xs font-medium">
                      <input
                        type="radio"
                        name="Select Status"
                        value={status}
                        checked={selectedGame === status}
                        onChange={(e) => {
                          setSelectedGame(e.target.value);
                          setGameDropdown(false);
                          setPage(1);
                        }}
                        className="accent-[#1b2229]"
                      />
                      {status}
                    </label>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
        <button
          onClick={() => router.push("/admin/employees/add")}
          className="flex h-10 w-[210px] md:w-[210px] sm:w-[210px] px-5 py-3 bg-[#1b2229] rounded-full justify-between items-center gap-2 text-white text-sm font-medium"
        >
          <Add /> Add A New Employee
        </button>
      </div>

      {/* Main Content */}
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Left Side - Employee List */}
        <div className="w-full lg:w-2/3 bg-[#f2f2f4] rounded-[20px] p-4 md:p-6 h-auto lg:h-[657px] overflow-auto">
          <div className="flex flex-col sm:flex-row justify-between items-center mb-4">
            <h2 className="text-[#10375c] text-lg md:text-xl font-medium">All Employees</h2>
            <div className="w-full sm:w-auto mt-2 sm:mt-0">
              <SearchBar setQuery={setSearchParams} query={searchParams} />
            </div>
          </div>

          {/* Table Header */}
          <div className="hidden md:flex justify-between items-center text-[#7e7e8a] text-xs font-medium mb-2">
            <div className="w-[30%] ">Name</div>
            <div className="w-[28%] text-left">Status</div>
            <div className="w-[25%] text-left">Email</div>
            <div className="w-[20%] text-left">Phone Number</div>
            <div className="w-[5%] text-right pr-2 ">Action</div>
          </div>
          <div className="hidden md:block border-t border-[#d0d0d0] mb-2"></div>
          {isLoading ? (
            <p className="text-center text-[#10375c] py-4">Loading...</p>
          ) : employees.length === 0 ? (
            <p className="text-center text-[#10375c] py-4">No data found.</p>
          ) : (
            <>
              {/* Employee List */}
              {employees.map((employee: Employee, index: number) => (
                <div
                  key={employee._id}
                  className={`w-full cursor-pointer flex flex-col md:flex-row items-start md:items-center p-3 rounded-[10px] mb-2 ${
                    selectedEmployee?._id === employee._id
                      ? "bg-[#176dbf] text-white"
                      : index % 2 === 0
                      ? "bg-white"
                      : "bg-gray-200"
                  }`}
                  onClick={() => handleEmployeeSelect(employee)}
                >
                  <div
                    className={`w-full md:w-[25%] flex items-center gap-2 text-xs font-medium p-2 ${
                      selectedEmployee?._id === employee._id ? "text-white" : "text-[#1b2229]"
                    }`}
                  >
                    <Image src={AlexParker} alt="Avatar" className="rounded-full" width={25} height={25} />
                    <span className="md:hidden font-bold">Name: </span> {employee.fullName}
                  </div>

                  <div className={`w-full md:w-[22%] p-2 flex justify-center items-center`}>
                    <span
                      className={`flex items-center w-[100px] md:w-full px-2 py-1 rounded-full text-xs font-medium ${
                        employee.status === "Working" ? "bg-[#14d1a4] text-white" : "bg-[#d11414] text-white"
                      }`}
                    >
                      {employee.status}
                    </span>
                  </div>

                  <div
                    className={`w-full md:w-[25%] text-xs md:text-center font-medium p-2 ${
                      selectedEmployee?._id === employee._id ? "text-white" : "text-[#1b2229]"
                    }`}
                  >
                    <span className="md:hidden font-bold">Email: </span> {employee.email}
                  </div>

                  <div
                    className={`w-full md:w-[18%] md:text-center text-xs font-medium p-2 ${
                      selectedEmployee?._id === employee._id ? "text-white" : "text-[#1b2229]"
                    }`}
                  >
                    <span className="md:hidden font-bold">Phone: </span> {employee.phoneNumber}
                  </div>

                  <div className="w-full md:w-[10%] md:text-right text-xs font-medium p-2 flex justify-start md:justify-end">
                    <EyeIcon stroke={selectedEmployee?._id === employee._id ? "#FFFF" : "#fd5602"} />
                  </div>
                </div>
              ))}
              <div className="mt-4 flex justify-end gap-2">
                <TablePagination
                  setPage={handlePageChange}
                  page={page}
                  totalData={totalEmployees}
                  itemsPerPage={itemsPerPage}
                />
              </div>
            </>
          )}
        </div>

        {/* Right Side - Employee Details */}
        <div className="w-full lg:w-1/3 mt-6 lg:mt-0" ref={statusDropdownRef}>
          <div className="relative w-full h-[262px]">
            {selectedImage ? (
              <Image
                src={selectedImage}
                alt="Selected"
                width={300}
                height={262}
                className="w-full h-full rounded-[10px] object-cover"
              />
            ) : (
              <Image
                className="w-full h-full rounded-[10px] object-cover"
                src={Ball}
                alt="Ball Image"
                width={300}
                height={262}
              />
            )}
            <label className="absolute bottom-2 right-2 h-12 px-4 py-2 flex bg-white rounded-full items-center gap-2 cursor-pointer">
              <Edit1 />
              <span className="text-black text-sm font-medium">Change Image</span>
              <input type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
            </label>
          </div>

          <div className="w-full rounded-[20px] mt-4">
            <div className="mb-4">
              <label className="text-[#1b2229] text-xs font-medium block mb-2">Name Of Employee</label>
              <input
                type="text"
                name="fullName"
                value={editFormData.fullName}
                onChange={handleInputChange}
                className="w-full h-12 px-4 py-2 bg-white border border-[#e6e6e6] rounded-full text-black/60 text-xs font-medium"
                disabled={!selectedEmployee}
                placeholder="Employee Name"
              />
            </div>
            <div className="flex w-full gap-[15px]">
              <div className="mb-4 w-[50%]">
                <label className="text-[#1b2229] text-xs font-medium block mb-2">Email Address</label>
                <input
                  type="email"
                  name="email"
                  value={editFormData.email}
                  onChange={handleInputChange}
                  className="w-full h-12 px-4 py-2 bg-white border border-[#e6e6e6] rounded-full text-black/60 text-xs font-medium"
                  disabled={!selectedEmployee}
                  placeholder="Employee email"
                />
              </div>
              <div className="mb-4 w-[50%]">
                <label className="text-[#1b2229] text-xs font-medium block mb-2">Phone Number</label>
                <input
                  type="text"
                  name="phoneNumber"
                  value={editFormData.phoneNumber}
                  onChange={handleInputChange}
                  className="w-full h-12 px-4 py-2 bg-white border border-[#e6e6e6] rounded-full text-black/60 text-xs font-medium"
                  disabled={!selectedEmployee}
                  placeholder="Employee phone number"
                />
              </div>
            </div>
            <div className="mb-4">
              <label className="text-[#1b2229] text-xs font-medium block mb-2">Status</label>
              <div className="relative">
                <button
                  onClick={() => setSelectedStatus(!selectedStatus)}
                  className="w-full h-12 px-5 py-3 border border-[#e6e6e6] rounded-full bg-white text-[#1b2229] flex justify-between items-center text-xs font-medium"
                >
                  {editFormData.status || "Select Status"}
                  <span>{!selectedStatus ? <BottomArrow /> : <UpArrowIcon />}</span>
                </button>
                {selectedStatus && (
                  <div className="z-50 flex flex-col gap-2 absolute top-14 left-0 p-4 w-full bg-white rounded-[10px] shadow-lg">
                    {games.map((status) => (
                      <label key={status} className="flex gap-2 cursor-pointer text-[#1b2229] text-xs font-medium">
                        <input
                          type="radio"
                          name="Select Status"
                          value={status}
                          checked={editFormData.status === status}
                          onChange={(e) => {
                            setEditFormData((prev) => ({
                              ...prev,
                              status: e.target.value,
                            }));
                            setSelectedStatus(false);
                          }}
                          className="accent-[#1b2229]"
                        />
                        {status}
                      </label>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <button
              className="w-full h-12 bg-[#10375c] rounded-full text-white text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              onClick={handleSave}
              disabled={!selectedEmployee || loading || !hasChanges()}
            >
              {loading ? (
                <svg
                  className="animate-spin h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                  ></path>
                </svg>
              ) : (
                "Save"
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AllEmployeeComponent;