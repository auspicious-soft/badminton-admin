"use client";
import { BottomArrow, Edit1, Eye, EyeOff, Loading, UpArrowIcon } from "@/utils/svgicons";
import React, { useState, useTransition, useEffect } from "react";
import Image from "next/image";
import UserProfile2 from "@/assets/images/employeeProfile.jpg";
import { getImageClientS3URL } from "@/config/axios";
import { toast } from "sonner";
import { getEmployeeById, updateEmployee } from "@/services/admin-services";
import { useRouter } from "next/navigation";
import { generateSignedUrlForEmployee, deleteFileFromS3 } from "@/actions";
import { validateImageFile } from "@/utils/fileValidation";
import TablePagination from "@/app/components/TablePagination";

const games = ["Working", "Ex-Employee"];

interface AttendanceRecord {
  _id: string;
  employeeId: string;
  date: string;
  status: string;
  checkInTime: string;
  checkOutTime: string; // Added to match usage in code
  createdAt: string;
  updatedAt: string;
  __v: number;
}

interface EmployeeData {
  _id: string;
  identifier: string;
  role: string;
  fullName: string;
  email: string;
  authType: string;
  phoneNumber: string;
  status: string;
  profilePic: string;
  emailVerified: boolean;
  fcmToken: string | null;
  createdAt: string;
  updatedAt: string;
  __v: number;
  attendanceRecords: AttendanceRecord[];
}

interface EditEmployeeProps {
  employeeId: string;
}

const EditEmployee = ({ employeeId }: EditEmployeeProps) => {
  const [employeeData, setEmployeeData] = useState<EmployeeData | null>(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    status: "",
    phoneNumber: ""
  });
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [gameDropdown, setGameDropdown] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [attendancePage, setAttendancePage] = useState(1);
  const attendanceItemsPerPage = 5;
  const router = useRouter();

  // Fetch employee data on component mount
  useEffect(() => {
    const fetchEmployeeData = async () => {
      try {
        setLoading(true);
        const response = await getEmployeeById(`/admin/get-employees-by-id?id=${employeeId}`);

        if (response?.status === 200 && response?.data?.success) {
          const employee = response.data.data;
          setEmployeeData(employee);
          setFormData({
            name: employee.fullName || "",
            email: employee.email || "",
            status: employee.status || "",
            phoneNumber: employee.phoneNumber || ""
          });

          // Set profile image if exists
          if (employee.profilePic) {
            setSelectedImage(getImageClientS3URL(employee.profilePic));
          }

          // Reset attendance pagination when new data is loaded
          setAttendancePage(1);
        } else {
          toast.error("Failed to fetch employee data");
        }
      } catch (error) {
        console.error("Error fetching employee:", error);
        toast.error("Something went wrong while fetching employee data");
      } finally {
        setLoading(false);
      }
    };

    if (employeeId) {
      fetchEmployeeData();
    }
  }, [employeeId]);

  const phoneRegex = /^\d{10}$/;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const isPhoneValid = phoneRegex.test(formData.phoneNumber);
  const isEmailValid = emailRegex.test(formData.email);

  const isFormValid =
    formData.name &&
    formData.email &&
    isEmailValid &&
    formData.status &&
    formData.phoneNumber &&
    isPhoneValid;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === "phoneNumber" && !/^\d*$/.test(value)) return;

    setFormData((prev) => ({
      ...prev,
      [name === "employee_email" ? "email" : name]: value,
    }));
  };

  const handleStatusChange = (status: string) => {
    setFormData((prev) => ({
      ...prev,
      status,
    }));
    setGameDropdown(false);
  };

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const validation = validateImageFile(file, 5);
      if (!validation.isValid) {
        toast.error(validation.error);
        event.target.value = '';
        return;
      }

      if (selectedImage && selectedImage.startsWith('blob:')) {
        URL.revokeObjectURL(selectedImage);
      }

      const imageUrl = URL.createObjectURL(file);
      setSelectedImage(imageUrl);
      setImageFile(file);
    }
  };

  const uploadImageToS3 = async (file: File): Promise<string> => {
    try {
      setIsUploading(true);
      const timestamp = Date.now();
      const fileName = `${timestamp}-${file.name}`;

      const { signedUrl, key } = await generateSignedUrlForEmployee(fileName, file.type);

      const uploadResponse = await fetch(signedUrl, {
        method: "PUT",
        body: file,
        headers: { "Content-Type": file.type },
      });

      if (!uploadResponse.ok) {
        throw new Error("Failed to upload image to S3");
      }

      return key;
    } catch (error) {
      console.error("Error uploading image:", error);
      toast.error("Failed to upload image");
      throw error;
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async () => {
    if (!isPhoneValid) {
      toast.error("Please enter a valid 10-digit phone number");
      return;
    }

    if (!isEmailValid) {
      toast.error("Please enter a valid email address");
      return;
    }

    setIsUploading(true);

    try {
      let finalImageKey = null;

      if (imageFile) {
        finalImageKey = await uploadImageToS3(imageFile);
      }

      startTransition(async () => {
        try {
          const payload: any = {
            id: employeeId,
            fullName: formData.name,
            email: formData.email.trim().toLowerCase(),
            status: formData.status,
            phoneNumber: formData.phoneNumber,
          };

          // Only include profilePic if a new image was uploaded
          if (finalImageKey) {
            payload.profilePic = finalImageKey;
          }

          const response = await updateEmployee("/admin/update-employee", payload);

          if (response?.status === 200 || response?.status === 201) {
            toast.success("Employee updated successfully");
            router.push("/authority/employees");
          } else {
            toast.error("Failed to update employee");
            if (finalImageKey) {
              try {
                await deleteFileFromS3(finalImageKey);
              } catch (error) {
                console.error("Failed to delete uploaded image:", error);
              }
            }
            setIsUploading(false);
          }
        } catch (error) {
          console.error("Error updating employee:", error);
          toast.error("Something went wrong");
          if (finalImageKey) {
            try {
              await deleteFileFromS3(finalImageKey);
            } catch (deleteError) {
              console.error("Failed to delete uploaded image:", deleteError);
            }
          }
          setIsUploading(false);
        }
      });
    } catch (error) {
      console.error("Error in image upload:", error);
      toast.error("Failed to upload image");
      setIsUploading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loading />
        <span className="ml-2">Loading employee data...</span>
      </div>
    );
  }

  if (!employeeData) {
    return (
      <div className="text-center text-red-500">
        Employee not found
      </div>
    );
  }

  return (
    <>
      <div className="text-[#10375c] text-2xl md:text-3xl font-semibold mb-4">Single Employee</div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Left Panel - Employee Info */}
        <div className="bg-[#F2F2F4] w-full h-fit lg:w-[40%] py-3 px-[15px] rounded-[20px] mb-5">
          <div className="relative w-full h-[262px]">
            {selectedImage ? (
              <Image src={selectedImage} alt="Employee" fill className="rounded-[10px] object-cover" />
            ) : (
              <Image src={UserProfile2} alt="Employee" fill className="rounded-[10px] object-cover" />
            )}
            <label className="absolute bottom-2 right-2 h-12 px-4 py-2 flex bg-white rounded-full items-center gap-2 cursor-pointer">
              <Edit1 />
              <span className="text-[#1C2329] text-sm font-medium">Change Image</span>
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageChange}
                disabled={isUploading || isPending}
              />
            </label>
            {isUploading && (
              <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded-[10px]">
                <div className="text-white">Uploading...</div>
              </div>
            )}
          </div>

          <div className="w-full rounded-[20px] mt-4">
            <div className="mb-4">
              <label className="text-[#1b2229] text-xs font-medium block mb-2">Name of Employee</label>
              <input
                type="text"
                name="name"
                placeholder="Enter Name"
                value={formData.name}
                onChange={handleInputChange}
                autoComplete="off"
                className="w-full h-12 px-4 py-2 bg-white border border-[#e6e6e6] rounded-full text-black/60 text-xs font-medium"
              />
            </div>
            <div className="mb-4">
              <label className="text-[#1b2229] text-xs font-medium block mb-2">Phone</label>
              <input
                type="text"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleInputChange}
                placeholder="Enter 10-digit phone number"
                maxLength={10}
                autoComplete="off"
                className="w-full h-12 px-4 py-2 bg-white border border-[#e6e6e6] rounded-full text-black/60 text-xs font-medium"
              />
            </div>
            <div className="mb-4">
              <label className="text-[#1b2229] text-xs font-medium block mb-2">Email Address</label>
              <input
                type="email"
                name="email"
                placeholder="Enter Email Address"
                value={formData.email}
                onChange={handleInputChange}
                autoComplete="off"
                className="w-full h-12 px-4 py-2 bg-white border border-[#e6e6e6] rounded-full text-black/60 text-xs font-medium"
              />
            </div>
            <div className="mb-4">
              <label className="text-[#1b2229] text-xs font-medium block mb-2">Status</label>
              <div className="relative">
                <button
                  className="w-full h-12 px-5 py-3 border border-[#e6e6e6] rounded-full bg-white text-[#1b2229] flex justify-between items-center text-xs font-medium"
                  onClick={() => setGameDropdown(!gameDropdown)}
                >
                  {formData.status || "Select Status"}
                  <span>{!gameDropdown ? <BottomArrow /> : <UpArrowIcon />}</span>
                </button>
                {gameDropdown && (
                  <div className="z-50 flex flex-col gap-2 absolute top-14 left-0 p-4 w-full bg-white rounded-[10px] shadow-lg">
                    {games.map((status) => (
                      <label key={status} className="flex gap-2 cursor-pointer text-[#1b2229] text-xs font-medium">
                        <input
                          type="radio"
                          name="Select Status"
                          value={status}
                          checked={formData.status === status}
                          onChange={() => handleStatusChange(status)}
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
              className="w-full h-12 bg-black rounded-full text-white text-sm font-medium flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={handleSubmit}
              disabled={isPending || isUploading || !isFormValid}
            >
              {isPending || isUploading ? <Loading /> : null}
              {isPending || isUploading ? "Saving..." : "Save"}
            </button>
          </div>
        </div>

        {/* Right Panel - Attendance Table */}
        <div className="bg-[#F2F2F4] w-full h-fit mb-2 p-[15px]  rounded-[20px]">
          <div className="text-[#10375C] mb-4 text-xl font-semibold">Attendance</div>

          <div className="bg-[#f2f2f4] rounded-[10px] overflow-hidden">
            {/* Table Header */}
            {employeeData.attendanceRecords.length !== 0 && (
              <div className=" text-[#7E7E8A] px-2 py-3">
                <div className="flex justify-between w-full gap-4 text-xs font-medium">
                  <div className="w-[70%] ">Date</div>
                  <div className="flex justify-between w-[30%]">
                    <div>Login Time</div>
                    <div>Logout Time</div>
                  </div>
                  {/* <div>Status</div> */}
                </div>
                <div className="w-full border-b border-dotted border-gray-400"></div>
              </div>

            )}
            {/* Table Body */}
            <div className="max-h-96 overflow-y-auto">
              {(() => {
                if (!employeeData.attendanceRecords || employeeData.attendanceRecords.length === 0) {
                  return (
                    <div className="px-4 py-5 text-center text-gray-500 text-sm">
                      No attendance records found
                    </div>
                  );
                }

                // Calculate pagination
                const startIndex = (attendancePage - 1) * attendanceItemsPerPage;
                const endIndex = startIndex + attendanceItemsPerPage;
                const paginatedRecords = employeeData.attendanceRecords.slice(startIndex, endIndex);

                return paginatedRecords.map((record, index) => {
                  const date = new Date(record.date);
                  const checkInTime = new Date(record.checkInTime);
                  const checkOutTime = record.checkOutTime ? new Date(record.checkOutTime) : null; return (
                    <div
                      key={record._id}
                      className={`w-full px-4 py-3 border-b rounded-[10px] border-gray-100 ${index % 2 === 0 ? 'bg-white' : 'bg-[#f2f2f4] '}`}
                    >
                      <div className="flex justify-between gap-4 text-xs">
                        <div className="w-[70%] text-xs text-[#1B2229] font-medium">
                          {date.toLocaleDateString('en-GB')}
                        </div>
                        <div className="flex w-[30%] justify-between ">
                          <div className="text-xs font-medium text-[#1B2229]">
                            {checkInTime.toLocaleTimeString('en-US', {
                              hour: '2-digit',
                              minute: '2-digit',
                              hour12: true
                            })}
                          </div>
                          <div className="text-xs font-medium text-[#1b2229]">
                            {checkOutTime
                              ? checkOutTime.toLocaleTimeString('en-US', {
                                hour: '2-digit',
                                minute: '2-digit',
                                hour12: true,
                              })
                              : <p className="text-red-600 text-xs font-medium ">Not Recorded</p>}
                          </div>
                        </div>
                        {/* <div className={`font-medium ${
                          record.status === 'Present' ? 'text-green-600' :
                          record.status === 'Absent' ? 'text-red-600' :
                          'text-yellow-600'
                        }`}>
                          {record.status}
                        </div> */}
                      </div>
                    </div>
                  );
                });
              })()}
            </div>

            {/* Pagination */}
            {employeeData.attendanceRecords && employeeData.attendanceRecords.length > 0 && (
              <div className=" mt-4  bg-[#f2f2f4] ">
                <div className="flex justify-end items-center text-xs text-gray-600">
                  {/* <span>
                    Showing {Math.min((attendancePage - 1) * attendanceItemsPerPage + 1, employeeData.attendanceRecords.length)} to{' '}
                    {Math.min(attendancePage * attendanceItemsPerPage, employeeData.attendanceRecords.length)} of{' '}
                    {employeeData.attendanceRecords.length} records
                  </span> */}
                  <TablePagination
                    setPage={setAttendancePage}
                    page={attendancePage}
                    totalData={employeeData.attendanceRecords.length}
                    itemsPerPage={attendanceItemsPerPage}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default EditEmployee;
