"use client";
import React, { useState, useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { DeleteMaintenanceIcon } from '@/utils/svgicons';
import useSWR from 'swr';
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import { getAdminDetails, updateAdminDetails, getDynamicPricing, deleteMaintenance, updateEmployeeDetails } from '@/services/admin-services';
import { generateSignedUrlForProfile, deleteFileFromS3 } from '@/actions';
import { getImageClientS3URL } from '@/config/axios';
import { validateImageFile } from '@/utils/fileValidation';
import DeleteConfirmationModal from './../components/common/DeleteConfirmationModal';
import MaintenanceModal from './../components/profile/MaintenanceModal'
import WeatherModal from './../components/profile/WeatherModal'
import Switch from '@mui/material/Switch';
import { convertUTCToLocalISTWithOffset } from './../../../utils/timeFormat';

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
    const [isRainModalOpen, setRainIsModalOpen] = useState(false);
    const { data: session } = useSession();
    const userRole = (session as any)?.user?.role;
    const userId = (session as any)?.user?.id;
    const [imageKey, setImageKey] = useState(null);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [itemToDelete, setItemToDelete] = useState<any>(null);
    const [openAccordions, setOpenAccordions] = useState({});

    const { data, mutate, isLoading } = useSWR("admin/get-admin-details", getAdminDetails);
    const { data: rainData, mutate: rainMutate, isLoading: rainLoading } = useSWR("admin/rain-toggle", getAdminDetails);
    const { data: maintenanceData1, mutate: maintenanceMutate, isLoading: maintenanceLoading } = useSWR("admin/maintenance-booking?page=1&limit=100", getAdminDetails);
    const profileDetails = useMemo(() => data?.data?.data || {}, [data]);
    const weatherData = rainData?.data?.data || [];
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

    // Group maintenance data by venue and date
    const groupedMaintenanceData = useMemo(() => {
        const grouped = {};
        mappedMaintenanceData.forEach((item) => {
            const key = `${item.venue}-${item.date}`;
            if (!grouped[key]) {
                grouped[key] = {
                    venue: item.venue,
                    date: item.date,
                    items: [],
                };
            }
            grouped[key].items.push(item);
        });
        return Object.values(grouped).map((group: any, index) => ({
            ...group,
            srNo: index + 1,
        }));
    }, [mappedMaintenanceData]);

    // Map API pricing data to component format


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

    // Profile form logic
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


    const uploadImageToS3 = async (file: File) => {
        try {
            const timestamp = Date.now();
            const fileName = `${timestamp}-${file.name}`;
            const { signedUrl, key } = await generateSignedUrlForProfile(fileName, file.type);

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

    function convertToLocalTime(utcTimestamp) {
        const date = new Date(utcTimestamp);
        return date.toLocaleString('en-US', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: true
        });
    }

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

            if (imagePreview?.file) {
                try {
                    uploadedImageKey = await uploadImageToS3(imagePreview.file);
                } catch (uploadError) {
                    console.error("Error uploading image to S3:", uploadError);
                    toast.error("Failed to upload profile image");
                }
            }

            const payload: any = {
                fullName: data.name,
                phoneNumber: data.phoneNumber,
                email: data.email,
                profilePic: uploadedImageKey || profileDetails.profilePic || null,
                id: userId,
            };

            if (data.changePassword) {
                payload.password = data.changePassword;
            }


            let response;


            if (userRole === "admin") {
                response = await updateAdminDetails("admin/update-admin-details", payload);
            }
            else {
                response = await updateEmployeeDetails("/admin/update-employee", payload)
            }
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
    const onWeatherSubmit = () => {
        rainMutate();
        setIsModalOpen(false);
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
            const response = await deleteMaintenance(`admin/maintenance-booking/${itemToDelete.id}`);
            maintenanceMutate();
            toast.success("Maintenance schedule deleted successfully");
            setIsDeleteModalOpen(false);
            setItemToDelete(null);
        } catch (error: any) {
            console.error('Error deleting maintenance:', error);
            const errorMessage = error?.response?.data?.message || 'Failed to delete maintenance schedule';
            toast.error(errorMessage);
        }
    };

    // Toggle accordion open/close state
    const toggleAccordion = (key) => {
        setOpenAccordions((prev) => ({
            ...prev,
            [key]: !prev[key],
        }));
    };

    if (isLoading) {
        return <div>Loading...</div>;
    }

    return (
        <div className=" h-[85vh] w-full ">
            <div>
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-[#10375c] text-3xl font-semibold">Weather</h2>
                    <button
                        onClick={() => setRainIsModalOpen(true)}
                        className="flex items-center gap-2 bg-[#1C2329] text-white text-sm font-medium px-4 py-2 rounded-full"
                    >
                        <span className="text-2xl">+</span> Add Weather Record
                    </button>
                </div>
                <div className="overflow-x-auto bg-[#f2f2f4] rounded-[20px] p-[15px]">
                    <table className="w-full">
                        <thead>
                            <tr className="text-left text-[#1b2229] text-sm font-medium">
                                <th className="text-[#7E7E8A] text-xs font-medium">Sr No</th>
                                <th className="text-[#7E7E8A] text-xs font-medium w-[32%]">Venue</th>
                                <th className="text-[#7E7E8A] text-xs font-medium pl-[25px]">Rain</th>
                                <th className="text-[#7E7E8A] text-xs font-medium text-right">Ends in</th>
                            </tr>
                        </thead>
                        <tbody>
                            {maintenanceLoading ? (
                                <tr>
                                    <td colSpan={4} className="text-center py-4">
                                        <p className="text-gray-600">Loading maintenance data...</p>
                                    </td>
                                </tr>
                            ) : weatherData.length === 0 ? (
                                <tr>
                                    <td colSpan={4} className="text-center py-4">
                                        <p className="text-gray-600">No Weather record found.</p>
                                    </td>
                                </tr>
                            ) : (
                                weatherData.map((group, index) => {
                                    return (
                                        <React.Fragment key={group._id}>
                                            <tr
                                                className={`text-sm ${index % 2 === 0 ? 'bg-white' : 'bg-[#f2f2f4]'} rounded-[40px] `}

                                            >
                                                <td>{index + 1}</td>
                                                <td className="text-[#1B2229] text-xs font-medium">{group.name}</td>
                                                <td className="text-[#1B2229] text-xs font-medium">
                                                    <Switch name='rain' disabled checked={group.rain} />
                                                </td>
                                                <td className="text-[#1B2229] text-xs font-medium text-right">
                                                    {convertUTCToLocalISTWithOffset(group.hour)}
                                                </td>
                                            </tr>

                                        </React.Fragment>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            <div className="w-full mt-4">
                <div className="flex justify-between items-center">
                    <h2 className="text-[#10375c] text-3xl font-semibold">Maintenance</h2>
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="flex items-center gap-2 bg-[#1C2329] text-white text-sm font-medium px-4 py-2 rounded-full"
                    >
                        <span className="text-2xl">+</span> Add A New Court
                    </button>
                </div>

                <div className="mt-6 w-full">
                    <div className="overflow-x-auto bg-[#f2f2f4] rounded-[20px] p-[15px]">

                        <table className="w-full">
                            <thead>
                                <tr className="text-left text-[#1b2229] text-sm font-medium">
                                    <th className="text-[#7E7E8A] text-xs font-medium">Sr No</th>
                                    <th className="text-[#7E7E8A] text-xs font-medium w-[30%]">Venue</th>
                                    <th className="text-[#7E7E8A] text-xs font-medium">Date</th>
                                    <th className="text-[#7E7E8A] text-xs font-medium text-right">Details</th>
                                </tr>
                            </thead>
                            <tbody>
                                {maintenanceLoading ? (
                                    <tr>
                                        <td colSpan={4} className="text-center py-4">
                                            <p className="text-gray-600">Loading maintenance data...</p>
                                        </td>
                                    </tr>
                                ) : groupedMaintenanceData.length === 0 ? (
                                    <tr>
                                        <td colSpan={4} className="text-center py-4">
                                            <p className="text-gray-600">No maintenance schedules found</p>
                                        </td>
                                    </tr>
                                ) : (
                                    groupedMaintenanceData.map((group, index) => {
                                        const key = `${group.venue}-${group.date}`;
                                        const isOpen = !!openAccordions[key];
                                        return (
                                            <React.Fragment key={key}>
                                                <tr
                                                    className={`text-sm px-3 py-3 ${index % 2 === 0 ? 'bg-white' : 'bg-[#f2f2f4]'} rounded-[40px] cursor-pointer`}
                                                    onClick={() => toggleAccordion(key)}
                                                >
                                                    <td>{group.srNo}</td>
                                                    <td className="text-[#1B2229] text-xs font-medium">{group.venue}</td>
                                                    <td className="text-[#1B2229] text-xs font-medium">{group.date}</td>
                                                    <td className="text-[#1B2229] text-xs font-medium text-right">
                                                        <span>{isOpen ? '▲' : '▼'}</span>
                                                    </td>
                                                </tr>
                                                {isOpen && (
                                                    <tr>
                                                        <td colSpan={4} className="p-0">
                                                            <div className="bg-[#e7e7e7] p-4 rounded-b-[20px]">
                                                                <table className="w-full">
                                                                    <thead>
                                                                        <tr className="text-left text-[#7E7E8A] text-xs font-medium">
                                                                            <th className="py-2">Court</th>
                                                                            <th className="py-2 text-right">Time</th>
                                                                            <th className="py-2 text-right">Reason</th>
                                                                            <th className="py-2 text-right">Action</th>
                                                                        </tr>
                                                                    </thead>
                                                                    <tbody>
                                                                        {group.items.map((item, itemIndex) => (
                                                                            <tr
                                                                                key={item.id}
                                                                                className={`text-sm ${itemIndex % 2 === 0 ? 'bg-white' : 'bg-[#f2f2f4]'} rounded-[10px]`}
                                                                            >
                                                                                <td className="py-2 text-[#1B2229] text-xs font-medium">{item.court}</td>
                                                                                <td className="py-2 text-[#1B2229] text-xs font-medium text-right">{item.time}</td>
                                                                                <td className="py-2 text-[#1B2229] text-xs font-medium text-right">{item.maintenanceReason}</td>
                                                                                <td className="py-2 text-[#1B2229] text-xs font-medium text-right">
                                                                                    <button onClick={() => openDeleteModal(item)} className="text-red-500">
                                                                                        <DeleteMaintenanceIcon />
                                                                                    </button>
                                                                                </td>
                                                                            </tr>
                                                                        ))}
                                                                    </tbody>
                                                                </table>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                )}
                                            </React.Fragment>
                                        );
                                    })
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
                <MaintenanceModal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    onSubmit={onMaintenanceSubmit}
                />
                <WeatherModal
                    isOpen={isRainModalOpen}
                    onClose={() => setRainIsModalOpen(false)}
                    onSubmit={onWeatherSubmit}
                    mutate={rainMutate}
                />
                <DeleteConfirmationModal
                    open={isDeleteModalOpen}
                    onClose={() => setIsDeleteModalOpen(false)}
                    onDelete={handleDeleteMaintenance}
                    title="Delete Maintenance?"
                    message={itemToDelete ? `Are you sure you want to delete the maintenance schedule for ${itemToDelete.venue} - ${itemToDelete.court}?` : "Are you sure you want to delete this maintenance schedule?"}
                    cancelText="Cancel"
                    deleteText="Delete"
                />
            </div>
        </div >
    );
};

export default ProfileForm;