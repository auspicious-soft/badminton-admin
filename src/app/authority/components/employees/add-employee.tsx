"use client";
import { BottomArrow, Edit1, Eye, EyeOff, Loading, UpArrowIcon } from "@/utils/svgicons";
import React, { useState, useTransition } from "react";
import Image from "next/image";
import UserProfile2 from "@/assets/images/employeeProfile.jpg";
import { getImageClientS3URL } from "@/config/axios";
import { toast } from "sonner";
import { createEmployee } from "@/services/admin-services";
import { useRouter } from "next/navigation";
import { generateSignedUrlForEmployee, deleteFileFromS3 } from "@/actions";
import { validateImageFile } from "@/utils/fileValidation";

const games = ["Working", "Ex-Employee"];

const AddEmployee = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    status: "",
    password: "",
    phoneNumber: ""
  });
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [gameDropdown, setGameDropdown] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const phoneRegex = /^\d{10}$/;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const isPhoneValid = phoneRegex.test(formData.phoneNumber);
  const isEmailValid = emailRegex.test(formData.email);

  const isFormValid =
    formData.name &&
    formData.email &&
    isEmailValid &&
    formData.status &&
    formData.password &&
    formData.phoneNumber &&
    isPhoneValid;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === "phoneNumber" && !/^\d*$/.test(value)) return;

    setFormData((prev) => ({
      ...prev,
      [name === "employee_email" ? "email" : name === "employee_password" ? "password" : name]: value,
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

  const togglePasswordVisibility = () => setShowPassword(!showPassword);

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
          const payload = {
            fullName: formData.name,
            email: formData.email.trim().toLowerCase(),
            status: formData.status,
            password: formData.password,
            phoneNumber: formData.phoneNumber,
            profilePic: finalImageKey || undefined,
          };

          const response = await createEmployee("/admin/create-employee", payload);

          if (response?.status === 200 || response?.status === 201) {
            toast.success("Employee created successfully");
            setFormData({ name: "", email: "", status: "", password: "", phoneNumber: "" });

            if (selectedImage && selectedImage.startsWith('blob:')) {
              URL.revokeObjectURL(selectedImage);
            }

            setSelectedImage(null);
            setImageFile(null);
            router.push("/authority/employees");
          } else {
            toast.error("Failed to create employee");
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
          console.error("Error creating employee:", error);
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

  return (
    <>
      <input type="text" name="fakeusernameremembered" autoComplete="username" className="hidden" />
      <input type="password" name="fakepasswordremembered" autoComplete="new-password" className="hidden" />

      <div className="text-[#10375c] text-2xl md:text-3xl font-semibold mb-4">Add New Employee</div>

      <div className="flex flex-col lg:flex-row gap-6">
        <div className="bg-[#F2F2F4] w-full h-fit lg:w-[40%] py-3 px-[15px] rounded-[20px] mb-5">
          <div className="relative w-full h-[262px]">
            {selectedImage ? (
              <Image src={selectedImage} alt="Selected" fill className="rounded-[10px] object-cover" />
            ) : (
              <Image src={UserProfile2} alt="Ball Image" fill className="rounded-[10px] object-cover" />
            )}
            <label className="absolute bottom-2 right-2 h-12 px-4 py-2 flex bg-white rounded-full items-center gap-2 cursor-pointer">
              <Edit1 />
              <span className="text-[#1C2329] text-sm font-medium">Upload Image</span>
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
              <label className="text-[#1b2229] text-xs font-medium block mb-2">Name of the Employee</label>
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
              <label className="text-[#1b2229] text-xs font-medium block mb-2">Phone Number</label>
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
          </div>
        </div>

        <div className="bg-[#F2F2F4] w-full h-fit py-4 px-4 lg:py-6 lg:px-6 rounded-[20px]">
          <div className="text-[#10375C] mb-4 text-xl font-semibold">Credentials</div>
          <div className="mb-4">
            <label className="text-[#1b2229] text-xs font-medium block mb-2">Email Address</label>
            <input
              type="email"
              name="employee_email"
              placeholder="Enter Email Address"
              value={formData.email}
              onChange={handleInputChange}
              autoComplete="off"
              className="w-full h-12 px-4 py-2 bg-white border border-[#e6e6e6] rounded-full text-black/60 text-xs font-medium"
            />
          </div>
          <div className="mb-4">
            <label className="text-[#1b2229] text-xs font-medium block mb-2">Password</label>
            <div className="flex bg-white border border-[#e6e6e6] rounded-full">
              <input
                type={showPassword ? "text" : "password"}
                name="employee_password"
                value={formData.password}
                onChange={handleInputChange}
                autoComplete="new-password"
                placeholder="******"
                className="w-full h-12 px-4 py-2 text-black/60 text-xs font-medium rounded-full"
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="flex justify-center items-center mr-[15px]"
              >
                {showPassword ? <EyeOff /> : <Eye />}
              </button>
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
    </>
  );
};

export default AddEmployee;
