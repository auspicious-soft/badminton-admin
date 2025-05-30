"use client";
import React, { useState, useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { CrossIcon, EditIcon, DeleteIcon1, DeleteMaintenanceIcon } from '@/utils/svgicons';
import NoImage from "@/assets/images/nofile.png";
import Image from 'next/image';
import useSWR from 'swr';

import { toast } from "sonner";

import { getAdminDetails, updateAdminDetails, getDynamicPricing, deleteMaintenance } from '@/services/admin-services';
import { generateSignedUrlForProfile, deleteFileFromS3 } from '@/actions';
import { getImageClientS3URL } from '@/config/axios';
import { validateImageFile } from '@/utils/fileValidation';
import { PricingBlock, mapApiDataToPricingData } from '../pricing';
import MaintenanceModal from './MaintenanceModal';
import DeleteConfirmationModal from '../common/DeleteConfirmationModal';

// Validation schema for profile
const profileSchema = yup.object().shape({
    name: yup.string().required('Name is required'),
    phoneNumber: yup
        .string()
        .required('Phone number is required')
        .matches(/^[0-9]{10}$/, 'Phone number must be 10 digits'),
    email: yup
        .string()
        .email('Invalid email format')
        .required('Email is required'),
    changePassword: yup
        .string()
        .min(6, 'Password must be at least 6 characters')
        .nullable(),
    confirmPassword: yup
        .string()
        .oneOf([yup.ref('changePassword'), null], 'Passwords must match')
        .nullable(),
    images: yup.mixed().nullable(),
});



const ProfileForm = () => {
    const [imagePreview, setImagePreview] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const [imageKey, setImageKey] = useState(null);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [itemToDelete, setItemToDelete] = useState<any>(null);

    const { data, mutate, isLoading } = useSWR("admin/get-admin-details", getAdminDetails);
    const { data: maintenanceData1, mutate: maintenanceMutate, isLoading: maintenanceLoading } = useSWR("admin/maintenance-booking", getAdminDetails);

    // Map API data to table format
    const mappedMaintenanceData = useMemo(() => {
        if (maintenanceData1?.data?.data && Array.isArray(maintenanceData1.data.data)) {
            return maintenanceData1.data.data.map((item: any, index: number) => ({
                id: item._id,
                srNo: index + 1,
                venue: item.venueId?.name || 'N/A',
                court: item.courtId?.name || 'N/A',
                date: new Date(item.bookingDate).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                }),
                time: item.bookingSlots || 'N/A',
                maintenanceReason: item.maintenanceReason || 'N/A'
            }));
        }
        return [];
    }, [maintenanceData1]);
    const { data: PricingData, mutate: priceMutate, isLoading: priceLoading } = useSWR("admin/dynamic-pricing", getDynamicPricing);
    const profileDetails = useMemo(() => data?.data?.data || {}, [data]);

    // Map API pricing data to component format
    const mappedPricingData = useMemo(() => {
        if (PricingData?.data?.data && Array.isArray(PricingData.data.data)) {
            return mapApiDataToPricingData(PricingData.data.data);
        }
        return {
            weekdayPricing: {
                name: "Mon - Fri",
                description: "No weekday pricing available",
                timeSlots: []
            },
            weekendPricing: {
                name: "Sat - Sun",
                description: "No weekend pricing available",
                timeSlots: []
            }
        };
    }, [PricingData]);

    // Profile form
    const { register: profileRegister, handleSubmit: handleProfileSubmit, formState: { errors: profileErrors, isDirty }, reset: resetProfile, watch: watchProfile } = useForm({
        resolver: yupResolver(profileSchema),
        defaultValues: {
            name: '',
            phoneNumber: '',
            email: '',
            changePassword: null,
            confirmPassword: null,
            images: null,
        },
    });





    // Profile form logic (unchanged)
    useEffect(() => {
        if (profileDetails && Object.keys(profileDetails).length > 0) {
            const newValues = {
                name: profileDetails.fullName || '',
                phoneNumber: profileDetails.phoneNumber || '',
                email: profileDetails.email || '',
                changePassword: null,
                confirmPassword: null,
                images: null,
            };

            const currentValues = watchProfile();
            if (
                currentValues.name !== newValues.name ||
                currentValues.phoneNumber !== newValues.phoneNumber ||
                currentValues.email !== newValues.email
            ) {
                resetProfile(newValues, { keepDirty: false });
            }

            if (
                profileDetails.profilePic &&
                (!imagePreview || (imagePreview.url !== getImageClientS3URL(profileDetails.profilePic) && !imagePreview.file))
            ) {
                setImagePreview({ url: getImageClientS3URL(profileDetails.profilePic) });
                setImageKey(profileDetails.profilePic);
            }
        }
    }, [profileDetails, resetProfile, imagePreview, watchProfile]);

    const formValues = watchProfile();
    const hasChanges = useMemo(() => {
        return (
            isDirty ||
            formValues.name !== (profileDetails.fullName || '') ||
            formValues.phoneNumber !== (profileDetails.phoneNumber || '') ||
            formValues.email !== (profileDetails.email || '') ||
            (formValues.changePassword && formValues.changePassword.length > 0) ||
            imagePreview?.file !== undefined
        );
    }, [formValues, profileDetails, isDirty, imagePreview]);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files[0];
        if (file) {
            // Validate the file
            const validation = validateImageFile(file, 5); // 5MB limit
            if (!validation.isValid) {
                toast.error(validation.error);
                // Reset the input
                e.target.value = '';
                return;
            }

            if (imagePreview && imagePreview.url.startsWith('blob:')) {
                URL.revokeObjectURL(imagePreview.url);
            }

            // Create a local preview
            const newPreview = {
                file,
                url: URL.createObjectURL(file),
            };
            setImagePreview(newPreview);
        }
    };

    const uploadImageToS3 = async (file: File) => {
        try {
            const timestamp = Date.now();
            const fileName = `${timestamp}-${file.name}`;

            // Generate signed URL for S3 upload
            const { signedUrl, key } = await generateSignedUrlForProfile(
                fileName,
                file.type
            );

            // Upload the file to S3
            const uploadResponse = await fetch(signedUrl, {
                method: "PUT",
                body: file,
                headers: {
                    "Content-Type": file.type,
                },
            });

            if (!uploadResponse.ok) {
                throw new Error("Failed to upload image to S3");
            }

            // Delete previous image if it exists
            if (imageKey) {
                try {
                    await deleteFileFromS3(imageKey);
                } catch (deleteError) {
                    console.error("Error deleting previous image:", deleteError);
                }
            }

            setImageKey(key);
            return key;
        } catch (error) {
            console.error("Error uploading image:", error);
            toast.error("Failed to upload image");
            throw error;
        }
    };

    const removeImage = () => {
        if (imagePreview) {
            URL.revokeObjectURL(imagePreview.url);
            setImagePreview(null);
        }
    };

    useEffect(() => {
        return () => {
            if (imagePreview) {
                URL.revokeObjectURL(imagePreview.url);
            }
        };
    }, [imagePreview]);
    const onProfileSubmit = async (data: any) => {
        setIsSubmitting(true);
        try {
            let uploadedImageKey = imageKey;

            // If there's a new image file, upload it to S3
            if (imagePreview?.file) {
                try {
                    uploadedImageKey = await uploadImageToS3(imagePreview.file);
                } catch (uploadError) {
                    console.error("Error uploading image to S3:", uploadError);
                    toast.error("Failed to upload profile image");
                    // Continue with the profile update even if image upload fails
                }
            }

            // Prepare payload for API
            const payload: any = {
                fullName: data.name,
                phoneNumber: data.phoneNumber,
                email: data.email,
                profilePic: uploadedImageKey || profileDetails.profilePic || null
            };

            // Add password if it was changed
            if (data.changePassword) {
                payload.password = data.changePassword;
            }

            const response = await updateAdminDetails("admin/update-admin-details", payload);
            if (response?.status === 200 || response?.status === 201) {
                await mutate();
                toast.success("Profile updated successfully");
            } else {
                toast.error("Failed to update profile details");
            }

            resetProfile({
                name: data.name,
                phoneNumber: data.phoneNumber,
                email: data.email,
                changePassword: null,
                confirmPassword: null,
                images: null,
            }, { keepDirty: false });

            // Update image preview with the S3 URL if available
            if (uploadedImageKey) {
                const imageUrl = getImageClientS3URL(uploadedImageKey);
                setImagePreview({ url: imageUrl });
            } else if (profileDetails.profilePic) {
                const imageUrl = getImageClientS3URL(profileDetails.profilePic);
                setImagePreview({ url: imageUrl });
            }
        } catch (error) {
            console.error('Error updating profile:', error);
            toast.error("Failed to update profile");
        } finally {
            setIsSubmitting(false);
        }
    };

    // Maintenance form logic
    const onMaintenanceSubmit = () => {

        maintenanceMutate();
        setIsModalOpen(false);
        toast.success("Maintenance schedule added successfully");
    };

    // Open delete confirmation modal
    const openDeleteModal = (item: any) => {
        setItemToDelete(item);
        setIsDeleteModalOpen(true);
    };

    // Handle delete confirmation
    const handleDeleteMaintenance = async () => {
        if (!itemToDelete) return;

        try {
            console.log('Deleting maintenance item:', itemToDelete);

            // Call the delete API endpoint
            const response = await deleteMaintenance(`admin/maintenance-booking/${itemToDelete.id}`);
            console.log('Delete response:', response);

            // Refresh the data
            maintenanceMutate();
            toast.success("Maintenance schedule deleted successfully");

            // Close modal and reset state
            setIsDeleteModalOpen(false);
            setItemToDelete(null);

        } catch (error: any) {
            console.error('Error deleting maintenance:', error);

            // Show error message
            const errorMessage = error?.response?.data?.message || 'Failed to delete maintenance schedule';
            toast.error(errorMessage);
        }
    };



    if (isLoading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="mb-[50px] h-[100vh] w-full  flex flex-row gap-[15px]">
            <div className="w-1/2">
                {/* Profile Section */}
                <div className="flex w-full justify-between">
                    <h2 className="text-[#10375c] text-3xl font-semibold mb-6">Profile</h2>
                </div>
                <form onSubmit={handleProfileSubmit(onProfileSubmit)} className="w-full flex flex-col md:flex-row gap-[15px] h-fit">
                    <div className="w-full space-y-4 bg-[#f2f2f4] p-[15px] rounded-[20px] h-fit mb-[30px]">
                        <div className="relative bg-gray-100 rounded-lg flex flex-col items-center justify-center">
                            {imagePreview ? (
                                <div className="w-full">
                                    <Image
                                        src={imagePreview.url}
                                        alt="Preview"
                                        className="w-full h-48 object-cover rounded-lg"
                                        width={400}
                                        height={200}
                                    />
                                    <button
                                        type="button"
                                        onClick={removeImage}
                                        className="absolute top-1 right-1 bg-white text-black text-center rounded-full p-[6px] px-[7px] flex items-center justify-center"
                                    >
                                        <CrossIcon />
                                    </button>
                                </div>
                            ) : (
                                <div className="flex flex-col h-[250px] w-full items-center justify-center bg-[#e7e7e7] rounded-[10px]">
                                    <Image
                                        src={NoImage}
                                        alt='No image selected'
                                        className="h-24 w-24 object-cover rounded-[10px]"
                                        width={100}
                                        height={100}
                                    />
                                </div>
                            )}
                            <label
                                htmlFor="imageUpload"
                                className="flex items-center gap-[10px] absolute bottom-2 right-2 h-12 px-5 py-4 bg-white rounded-[28px] text-[#1b2229] text-sm font-medium cursor-pointer"
                            >
                                <EditIcon stroke="black" />
                                Upload Image
                                <input
                                    type="file"
                                    id="imageUpload"
                                    accept="image/*"
                                    className="hidden"
                                    {...profileRegister('images', { onChange: handleImageChange })}
                                />
                            </label>
                        </div>

                        <div className="flex flex-col gap-[15px]">
                            <div className="flex flex-col gap-[10px]">
                                <label className="block text-[#1b2229] text-xs font-medium">Name</label>
                                <input
                                    type="text"
                                    {...profileRegister('name')}
                                    className="w-full h-[45.41px] px-[15px] py-2.5 bg-white rounded-[39px] text-black/60 text-xs font-medium"
                                    placeholder="Enter name"
                                />
                                {profileErrors.name && <p className="text-red-500 text-xs">{profileErrors.name.message}</p>}
                            </div>

                            <div className="flex flex-col gap-[10px]">
                                <label className="block text-[#1b2229] text-xs font-medium">Phone Number</label>
                                <input
                                    type="text"
                                    {...profileRegister('phoneNumber')}
                                    className="w-full h-[45.41px] px-[15px] py-2.5 bg-white rounded-[39px] text-black/60 text-xs font-medium"
                                    placeholder="Enter Phone Number"
                                />
                                {profileErrors.phoneNumber && <p className="text-red-500 text-xs">{profileErrors.phoneNumber.message}</p>}
                            </div>

                            <div className="flex flex-col gap-[10px]">
                                <label className="block text-[#1b2229] text-xs font-medium">Email Address</label>
                                <input
                                    type="text"
                                    {...profileRegister('email')}
                                    className="w-full h-[45.41px] px-[15px] py-2.5 bg-white rounded-[39px] text-black/60 text-xs font-medium"
                                    placeholder="Email Address"
                                />
                                {profileErrors.email && <p className="text-red-500 text-xs">{profileErrors.email.message}</p>}
                            </div>

                            <div className="flex w-full gap-[15px]">
                                <div className="w-[50%] flex flex-col gap-[10px]">
                                    <label className="block text-[#1b2229] text-xs font-medium">Change Password</label>
                                    <input
                                        type="password"
                                        {...profileRegister('changePassword')}
                                        className="w-full h-[45.41px] px-[15px] py-2.5 bg-white rounded-[39px] text-black/60 text-xs font-medium"
                                        placeholder="******"
                                    />
                                    {profileErrors.changePassword && <p className="text-red-500 text-xs">{profileErrors.changePassword.message}</p>}
                                </div>
                                <div className="w-[50%] flex flex-col gap-[10px]">
                                    <label className="block text-[#1b2229] text-xs font-medium">Confirm Password</label>
                                    <input
                                        type="password"
                                        {...profileRegister('confirmPassword')}
                                        className="w-full h-[45.41px] px-[15px] py-2.5 bg-white rounded-[39px] text-black/60 text-xs font-medium"
                                        placeholder="******"
                                    />
                                    {profileErrors.confirmPassword && <p className="text-red-500 text-xs">{profileErrors.confirmPassword.message}</p>}
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={!hasChanges || isSubmitting}
                                className={`py-4 rounded-[28px] text-white text-sm font-medium mt-[5px] ${hasChanges && !isSubmitting
                                    ? 'bg-[#10375c] hover:bg-[#0f2e4a]'
                                    : 'bg-gray-400 cursor-not-allowed'
                                    }`}
                            >
                                {isSubmitting ? (
                                    <span className="flex items-center justify-center">
                                        <svg className="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                        </svg>
                                        Saving...
                                    </span>
                                ) : (
                                    'Save'
                                )}
                            </button>
                        </div>
                    </div>
                </form>
            </div>

            <div className="w-full">
                <h2 className="text-[#10375c] text-3xl font-semibold">Settings</h2>
                <div className="mt-6 w-full">

                    <div className="overflow-x-auto bg-[#f2f2f4] rounded-[20px] p-[15px]">
                        <div className="flex justify-between items-center">
                            <h2 className="text-[#10375C] text-xl font-semibold ">Maintenance</h2>
                            <button
                                onClick={() => setIsModalOpen(true)}
                                className="flex items-center gap-2 bg-[#1C2329] text-white text-sm font-medium px-4 py-2 rounded-full"
                            >
                                <span className="text-2xl ">+</span> Add A New Court
                            </button>
                        </div>
                        <table className="w-full ">
                            <thead>
                                <tr className="text-left text-[#1b2229] text-sm font-medium">
                                    <th className="text-[#7E7E8A] text-xs font-medium">Sr No</th>
                                    <th className="text-[#7E7E8A] text-xs font-medium w-[30%]">Venue</th>
                                    <th className="text-[#7E7E8A] text-xs font-medium">Court</th>
                                    <th className="text-[#7E7E8A] text-xs font-medium text-right">Date</th>
                                    <th className="text-[#7E7E8A] text-xs font-medium text-right">Time</th>
                                    <th className="text-[#7E7E8A] text-xs font-medium text-right">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {maintenanceLoading ? (
                                    <tr>
                                        <td colSpan={6} className="text-center py-4">
                                            <p className="text-gray-600">Loading maintenance data...</p>
                                        </td>
                                    </tr>
                                ) : mappedMaintenanceData.length === 0 ? (
                                    <tr>
                                        <td colSpan={6} className="text-center py-4">
                                            <p className="text-gray-600">No maintenance schedules found</p>
                                        </td>
                                    </tr>
                                ) : (
                                    mappedMaintenanceData.map((item: any, index: number) => (
                                        <tr key={item.id} className={`text-sm px-3 py-3 ${index % 2 === 0 ? 'bg-white' : 'bg-[#f2f2f4]'} rounded-[40px]`}>
                                            <td className="">{item.srNo}</td>
                                            <td className=" text-[#1B2229] text-xs font-medium ">{item.venue}</td>
                                            <td className=" text-[#1B2229] text-xs font-medium">{item.court}</td>
                                            <td className=" text-[#1B2229] text-xs font-medium text-right">{item.date}</td>
                                            <td className=" text-[#1B2229] text-xs font-medium text-right">{item.time}</td>
                                            <td className=" text-[#1B2229] text-xs font-medium text-right">
                                                <button onClick={() => openDeleteModal(item)} className="text-red-500">
                                                    <DeleteMaintenanceIcon />
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Maintenance Modal */}
                <MaintenanceModal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    onSubmit={onMaintenanceSubmit}
                />

                {/* Delete Confirmation Modal */}
                <DeleteConfirmationModal
                    open={isDeleteModalOpen}
                    onClose={() => setIsDeleteModalOpen(false)}
                    onDelete={handleDeleteMaintenance}
                    title="Delete Maintenance?"
                    message={itemToDelete ? `Are you sure you want to delete the maintenance schedule for ${itemToDelete.venue} - ${itemToDelete.court}?` : "Are you sure you want to delete this maintenance schedule?"}
                    cancelText="Cancel"
                    deleteText="Delete"
                />
                <div className="mt-5">
                    {priceLoading ? (
                        <div className="flex justify-center items-center h-32">
                            <p className="text-lg text-gray-600">Loading pricing data...</p>
                        </div>
                    ) : (
                        <PricingBlock
                            weekdayPricing={mappedPricingData.weekdayPricing}
                            weekendPricing={mappedPricingData.weekendPricing}
                            onWeekdayPricingUpdate={(data) => {
                                console.log("Weekday pricing updated:", data);
                                priceMutate(); // Refresh pricing data
                            }}
                            onWeekendPricingUpdate={(data) => {
                                console.log("Weekend pricing updated:", data);
                                priceMutate(); // Refresh pricing data
                            }}
                            // onAddPricing={(data) => {
                            //     console.log("New pricing added:", data);
                            //     priceMutate(); // Refresh pricing data
                            //     toast.success("New pricing added successfully");
                            // }}
                        />
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProfileForm;
