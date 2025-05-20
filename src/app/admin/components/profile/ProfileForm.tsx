// "use client";
// import React, { useState, useEffect, useMemo } from 'react';
// import { useForm } from 'react-hook-form';
// import { yupResolver } from '@hookform/resolvers/yup';
// import * as yup from 'yup';
// import { CrossIcon, EditIcon } from '@/utils/svgicons';
// import NoImage from "@/assets/images/nofile.png";
// import Image from 'next/image';
// import useSWR from 'swr';
// import AlexParker from "@/assets/images/AlexParker.png";
// import { toast } from "sonner";

// import { getAdminDetails, updateAdminDetails } from '@/services/admin-services';

// // Validation schema
// const schema = yup.object().shape({
//     name: yup.string().required('Name is required'),
//     phoneNumber: yup
//         .string()
//         .required('Phone number is required')
//         .matches(/^[0-9]{10}$/, 'Phone number must be 10 digits'),
//     email: yup
//         .string()
//         .email('Invalid email format')
//         .required('Email is required'),
//     changePassword: yup
//         .string()
//         .min(6, 'Password must be at least 6 characters')
//         .nullable(),
//     confirmPassword: yup
//         .string()
//         .oneOf([yup.ref('changePassword'), null], 'Passwords must match')
//         .nullable(),
//     images: yup.mixed().nullable(),
// });

// const ProfileForm = () => {
//     const [imagePreview, setImagePreview] = useState(null);
//     const [isSubmitting, setIsSubmitting] = useState(false);
//     const { data, mutate, isLoading } = useSWR("admin/get-admin-details", getAdminDetails);
//     const profileDetails = useMemo(() => data?.data?.data || {}, [data]);

//     const { register, handleSubmit, formState: { errors, isDirty }, reset, watch } = useForm({
//         resolver: yupResolver(schema),
//         defaultValues: {
//             name: '',
//             phoneNumber: '',
//             email: '',
//             changePassword: null,
//             confirmPassword: null,
//             images: null,
//         },
//     });

//     // Set default values when profileDetails loads, but only if necessary
//     useEffect(() => {
//         if (profileDetails && Object.keys(profileDetails).length > 0) {
//             const newValues = {
//                 name: profileDetails.fullName || '',
//                 phoneNumber: profileDetails.phoneNumber || '',
//                 email: profileDetails.email || '',
//                 changePassword: null,
//                 confirmPassword: null,
//                 images: null,
//             };

//             // Get current form values
//             const currentValues = watch();

//             // Only reset if values have changed
//             if (
//                 currentValues.name !== newValues.name ||
//                 currentValues.phoneNumber !== newValues.phoneNumber ||
//                 currentValues.email !== newValues.email
//             ) {
//                 reset(newValues, { keepDirty: false });
//             }

//             // Set image preview only if it hasn't been set or if profilePic changed
//             if (
//                 profileDetails.profilePic &&
//                 (!imagePreview || imagePreview.url !== profileDetails.profilePic)
//             ) {
//                 setImagePreview({ url: profileDetails.profilePic });
//             }
//         }
//     }, [profileDetails, reset]); // Removed watch from dependencies

//     // Watch form values to detect changes
//     const formValues = watch();

//     // Check if form has changes compared to initial data
//     const hasChanges = useMemo(() => {
//         return (
//             isDirty ||
//             formValues.name !== (profileDetails.fullName || '') ||
//             formValues.phoneNumber !== (profileDetails.phoneNumber || '') ||
//             formValues.email !== (profileDetails.email || '') ||
//             (formValues.changePassword && formValues.changePassword.length > 0) ||
//             imagePreview?.file !== undefined
//         );
//     }, [formValues, profileDetails, isDirty, imagePreview]);

//     const handleImageChange = (e) => {
//         const file = e.target.files[0];
//         if (file) {
//             if (imagePreview) {
//                 URL.revokeObjectURL(imagePreview.url);
//             }
//             const newPreview = {
//                 file,
//                 url: URL.createObjectURL(file),
//             };
//             setImagePreview(newPreview);
//         }
//     };

//     const removeImage = () => {
//         if (imagePreview) {
//             URL.revokeObjectURL(imagePreview.url);
//             setImagePreview(null);
//         }
//     };

//     useEffect(() => {
//         return () => {
//             if (imagePreview) {
//                 URL.revokeObjectURL(imagePreview.url);
//             }
//         };
//     }, [imagePreview]);

//     const onSubmit = async (data) => {
//         setIsSubmitting(true);
//         try {
//             const formData = new FormData();
//             formData.append('fullName', data.name);
//             formData.append('phoneNumber', data.phoneNumber);
//             formData.append('email', data.email);
//             if (data.changePassword) {
//                 formData.append('password', data.changePassword);
//             }
//             if (imagePreview?.file) {
//                 formData.append('profilePic', imagePreview.file);
//             }

//             // Call API to update profile
//             const response=await updateAdminDetails("admin/update-admin-details",formData);
//             if (response?.status === 200 || response?.status === 201) {
//                 await mutate();
//                 toast.success("Profile upded successfully");
                
//               } else {
//                 toast.error("Failed to update profile details");
//               }
          

//             // Reset form to new values
//             reset({
//                 name: data.name,
//                 phoneNumber: data.phoneNumber,
//                 email: data.email,
//                 changePassword: null,
//                 confirmPassword: null,
//                 images: null,
//             }, { keepDirty: false });

//             // Update image preview
//             if (imagePreview?.file) {
//                 setImagePreview({ url: URL.createObjectURL(imagePreview.file) });
//             } else if (profileDetails.profilePic) {
//                 setImagePreview({ url: profileDetails.profilePic });
//             }

//         } catch (error) {
//             console.error('Error updating profile:', error);
//         } finally {
//             setIsSubmitting(false);
//         }
//     };

//     if (isLoading) {
//         return <div>Loading...</div>;
//     }

//     return (
//         <div className="mb-[50px] h-[100vh]">
//             <div className="flex justify-between">
//                 <h2 className="text-[#10375c] text-3xl font-semibold mb-6">Profile</h2>
//             </div>
//             <form onSubmit={handleSubmit(onSubmit)} className="w-full flex flex-col md:flex-row gap-[15px] h-fit">
//                 <div className="w-full md:w-[50%] lg:w-[40%] space-y-4 bg-[#f2f2f4] p-[15px] rounded-[20px] h-fit mb-[30px]">
//                     <div className="relative bg-gray-100 rounded-lg flex flex-col items-center justify-center">
//                         {imagePreview ? (
//                             <div className="w-full">
//                                 <Image
//                                     src={AlexParker || imagePreview.url}
//                                     alt="Preview"
//                                     className="w-full h-48 object-cover rounded-lg"
//                                     width={400}
//                                     height={200}
//                                 />
//                                 <button
//                                     type="button"
//                                     onClick={removeImage}
//                                     className="absolute top-1 right-1 bg-white text-black text-center rounded-full p-[6px] px-[7px] flex items-center justify-center"
//                                 >
//                                     <CrossIcon />
//                                 </button>
//                             </div>
//                         ) : (
//                             <div className="flex flex-col h-[250px] w-full items-center justify-center bg-[#e7e7e7] rounded-[10px]">
//                                 <Image
//                                     src={NoImage}
//                                     alt='No image selected'
//                                     className="h-24 w-24 object-cover rounded-[10px]"
//                                     width={100}
//                                     height={100}
//                                 />
//                             </div>
//                         )}
//                         <label
//                             htmlFor="imageUpload"
//                             className="flex items-center gap-[10px] absolute bottom-2 right-2 h-12 px-5 py-4 bg-white rounded-[28px] text-[#1b2229] text-sm font-medium cursor-pointer"
//                         >
//                             <EditIcon stroke="black" />
//                             Upload Image
//                             <input 
//                                 type="file"
//                                 id="imageUpload"
//                                 accept="image/*"
//                                 className="hidden"
//                                 {...register('images', { onChange: handleImageChange })}
//                             />
//                         </label>
//                     </div>

//                     <div className="flex flex-col gap-[15px]">
//                         <div className="flex flex-col gap-[10px]">
//                             <label className="block text-[#1b2229] text-xs font-medium">Name</label>
//                             <input
//                                 type="text"
//                                 {...register('name')}
//                                 className="w-full h-[45.41px] px-[15px] py-2.5 bg-white rounded-[39px] text-black/60 text-xs font-medium"
//                                 placeholder="Enter name"
//                             />
//                             {errors.name && <p className="text-red-500 text-xs">{errors.name.message}</p>}
//                         </div>

//                         <div className="flex flex-col gap-[10px]">
//                             <label className="block text-[#1b2229] text-xs font-medium">Phone Number</label>
//                             <input
//                                 type="text"
//                                 {...register('phoneNumber')}
//                                 className="w-full h-[45.41px] px-[15px] py-2.5 bg-white rounded-[39px] text-black/60 text-xs font-medium"
//                                 placeholder="Enter Phone Number"
//                             />
//                             {errors.phoneNumber && <p className="text-red-500 text-xs">{errors.phoneNumber.message}</p>}
//                         </div>

//                         <div className="flex flex-col gap-[10px]">
//                             <label className="block text-[#1b2229] text-xs font-medium">Email Address</label>
//                             <input
//                                 type="text"
//                                 {...register('email')}
//                                 className="w-full h-[45.41px] px-[15px] py-2.5 bg-white rounded-[39px] text-black/60 text-xs font-medium"
//                                 placeholder="Email Address"
//                             />
//                             {errors.email && <p className="text-red-500 text-xs">{errors.email.message}</p>}
//                         </div>

//                         <div className="flex w-full gap-[15px]">
//                             <div className="w-[50%] flex flex-col gap-[10px]">
//                                 <label className="block text-[#1b2229] text-xs font-medium">Change Password</label>
//                                 <input
//                                     type="password"
//                                     {...register('changePassword')}
//                                     className="w-full h-[45.41px] px-[15px] py-2.5 bg-white rounded-[39px] text-black/60 text-xs font-medium"
//                                     placeholder="******"
//                                 />
//                                 {errors.changePassword && <p className="text-red-500 text-xs">{errors.changePassword.message}</p>}
//                             </div>
//                             <div className="w-[50%] flex flex-col gap-[10px]">
//                                 <label className="block text-[#1b2229] text-xs font-medium">Confirm Password</label>
//                                 <input
//                                     type="password"
//                                     {...register('confirmPassword')}
//                                     className="w-full h-[45.41px] px-[15px] py-2.5 bg-white rounded-[39px] text-black/60 text-xs font-medium"
//                                     placeholder="******"
//                                 />
//                                 {errors.confirmPassword && <p className="text-red-500 text-xs">{errors.confirmPassword.message}</p>}
//                             </div>
//                         </div>
                        
//                         <button
//                             type="submit"
//                             disabled={!hasChanges || isSubmitting}
//                             className={`py-4 rounded-[28px] text-white text-sm font-medium mt-[5px] ${
//                                 hasChanges && !isSubmitting
//                                     ? 'bg-[#10375c] hover:bg-[#0f2e4a]'
//                                     : 'bg-gray-400 cursor-not-allowed'
//                             }`}
//                         >
//                             {isSubmitting ? (
//                                 <span className="flex items-center justify-center">
//                                     <svg className="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24">
//                                         <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
//                                         <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
//                                     </svg>
//                                     Saving...
//                                 </span>
//                             ) : (
//                                 'Save'
//                             )}
//                         </button>
//                     </div>
//                 </div>
//             </form>
//         </div>
//     );
// };

// export default ProfileForm;



"use client";
import React, { useState, useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { CrossIcon, EditIcon } from '@/utils/svgicons';
import NoImage from "@/assets/images/nofile.png";
import Image from 'next/image';
import useSWR from 'swr';
import AlexParker from "@/assets/images/AlexParker.png";
import { toast } from "sonner";

import { getAdminDetails, updateAdminDetails } from '@/services/admin-services';

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

// Validation schema for maintenance
const maintenanceSchema = yup.object().shape({
    venue: yup.string().required('Venue is required'),
    court: yup.string().required('Court is required'),
    date: yup.string().required('Date is required'),
    startTime: yup.string().required('Start time is required'),
    endTime: yup.string().required('End time is required'),
    reason: yup.string().required('Reason is required'),
});

// Validation schema for pricing
const pricingSchema = yup.object().shape({
    weekdayPrice: yup.object().shape({
        '09:00': yup.number().required('Price is required').min(0, 'Price must be positive'),
        '10:00': yup.number().required('Price is required').min(0, 'Price must be positive'),
        '11:00': yup.number().required('Price is required').min(0, 'Price must be positive'),
        '12:00': yup.number().required('Price is required').min(0, 'Price must be positive'),
    }),
    weekendPrice: yup.object().shape({
        '09:00': yup.number().required('Price is required').min(0, 'Price must be positive'),
        '10:00': yup.number().required('Price is required').min(0, 'Price must be positive'),
        '11:00': yup.number().required('Price is required').min(0, 'Price must be positive'),
        '12:00': yup.number().required('Price is required').min(0, 'Price must be positive'),
    }),
});

const ProfileForm = () => {
    const [imagePreview, setImagePreview] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [maintenanceData, setMaintenanceData] = useState([
        { id: 1, venue: 'Grand Oak', court: 'Court 1', date: 'March 15, 2023', time: '07:00 to 15:00' },
        { id: 2, venue: 'Sunset Hall', court: 'Court 2', date: 'April 22, 2023', time: '07:00 to 15:00' },
        { id: 3, venue: 'Silver Star', court: 'Court 3', date: 'May 30, 2023', time: '07:00 to 15:00' },
        { id: 4, venue: 'Emerald Arena', court: 'Court 4', date: 'June 10, 2023', time: '07:00 to 15:00' },
        { id: 5, venue: 'Crystal Dome', court: 'Court 5', date: 'July 5, 2023', time: '07:00 to 15:00' },
        { id: 6, venue: 'Sky Lounge', court: 'Court 6', date: 'August 18, 2023', time: '07:00 to 15:00' },
        { id: 7, venue: 'Golden Gate', court: 'Court 7', date: 'September 25, 2023', time: '07:00 to 15:00' },
        { id: 8, venue: 'Starlight Room', court: 'Court 8', date: 'October 12, 2023', time: '07:00 to 15:00' },
        { id: 9, venue: 'Harmony Center', court: 'Court 9', date: 'November 1, 2023', time: '07:00 to 15:00' },
        { id: 10, venue: 'Velvet Lounge', court: 'Court 10', date: 'December 31, 2023', time: '07:00 to 15:00' },
    ]);

    const { data, mutate, isLoading } = useSWR("admin/get-admin-details", getAdminDetails);
    const profileDetails = useMemo(() => data?.data?.data || {}, [data]);

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

    // Maintenance form
    const { register: maintenanceRegister, handleSubmit: handleMaintenanceSubmit, formState: { errors: maintenanceErrors }, reset: resetMaintenance } = useForm({
        resolver: yupResolver(maintenanceSchema),
        defaultValues: {
            venue: '',
            court: '',
            date: '',
            startTime: '',
            endTime: '',
            reason: '',
        },
    });

    // Pricing form
    const { register: pricingRegister, handleSubmit: handlePricingSubmit, formState: { errors: pricingErrors }, reset: resetPricing } = useForm({
        resolver: yupResolver(pricingSchema),
        defaultValues: {
            weekdayPrice: {
                '09:00': 900,
                '10:00': 1000,
                '11:00': 1000,
                '12:00': 1000,
            },
            weekendPrice: {
                '09:00': 1400,
                '10:00': 1400,
                '11:00': 1400,
                '12:00': 1400,
            },
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
                (!imagePreview || imagePreview.url !== profileDetails.profilePic)
            ) {
                setImagePreview({ url: profileDetails.profilePic });
            }
        }
    }, [profileDetails, resetProfile]);

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

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (imagePreview) {
                URL.revokeObjectURL(imagePreview.url);
            }
            const newPreview = {
                file,
                url: URL.createObjectURL(file),
            };
            setImagePreview(newPreview);
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

    const onProfileSubmit = async (data) => {
        setIsSubmitting(true);
        try {
            const formData = new FormData();
            formData.append('fullName', data.name);
            formData.append('phoneNumber', data.phoneNumber);
            formData.append('email', data.email);
            if (data.changePassword) {
                formData.append('password', data.changePassword);
            }
            if (imagePreview?.file) {
                formData.append('profilePic', imagePreview.file);
            }

            const response = await updateAdminDetails("admin/update-admin-details", formData);
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

            if (imagePreview?.file) {
                setImagePreview({ url: URL.createObjectURL(imagePreview.file) });
            } else if (profileDetails.profilePic) {
                setImagePreview({ url: profileDetails.profilePic });
            }
        } catch (error) {
            console.error('Error updating profile:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    // Maintenance form logic
    const onMaintenanceSubmit = (data) => {
        const newMaintenance = {
            id: maintenanceData.length + 1,
            venue: data.venue,
            court: data.court,
            date: data.date,
            time: `${data.startTime} to ${data.endTime}`,
        };
        setMaintenanceData([...maintenanceData, newMaintenance]);
        setIsModalOpen(false);
        resetMaintenance();
        toast.success("Maintenance schedule added successfully");
    };

    const handleDeleteMaintenance = (id) => {
        setMaintenanceData(maintenanceData.filter(item => item.id !== id));
        toast.success("Maintenance schedule deleted successfully");
    };

    // Pricing form logic
    const onPricingSubmit = (data) => {
        toast.success("Pricing updated successfully");
    };

    if (isLoading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="mb-[50px] h-[100vh] overflow-y-auto">
            {/* Profile Section */}
            <div className="flex justify-between">
                <h2 className="text-[#10375c] text-3xl font-semibold mb-6">Profile</h2>
            </div>
            <form onSubmit={handleProfileSubmit(onProfileSubmit)} className="w-full flex flex-col md:flex-row gap-[15px] h-fit">
                <div className="w-full md:w-[50%] lg:w-[40%] space-y-4 bg-[#f2f2f4] p-[15px] rounded-[20px] h-fit mb-[30px]">
                    <div className="relative bg-gray-100 rounded-lg flex flex-col items-center justify-center">
                        {imagePreview ? (
                            <div className="w-full">
                                <Image
                                    src={AlexParker || imagePreview.url}
                                    alt="Preview"
                                    className="w-full h-48 object-cover rounded-lg"
                                    width={400}
                                    height={200}
                                />
                                <button
                                    type="button"
                                    onClick={removeImage}
                                    className="absolute top-1 right-1 bg-white text-black text-center rounded-full p-[6px] px-[ economypx] flex items-center justify-center"
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
                            className={`py-4 rounded-[28px] text-white text-sm font-medium mt-[5px] ${
                                hasChanges && !isSubmitting
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

            {/* Maintenance Section */}
            <div className="mt-10">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-[#10375c] text-3xl font-semibold">Maintenance</h2>
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="flex items-center gap-2 bg-[#10375c] text-white px-4 py-2 rounded-full"
                    >
                        <span className="text-2xl">+</span> Add A New Court
                    </button>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full bg-[#f2f2f4] rounded-[20px]">
                        <thead>
                            <tr className="text-left text-[#1b2229] text-sm font-medium">
                                <th className="p-4">Sr No</th>
                                <th className="p-4">Venue</th>
                                <th className="p-4">Court</th>
                                <th className="p-4">Date</th>
                                <th className="p-4">Time</th>
                                <th className="p-4">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {maintenanceData.map((item, index) => (
                                <tr key={item.id} className={`text-sm ${index % 2 === 0 ? 'bg-white' : 'bg-[#f2f2f4]'}`}>
                                    <td className="p-4">{item.id}</td>
                                    <td className="p-4">{item.venue}</td>
                                    <td className="p-4">{item.court}</td>
                                    <td className="p-4">{item.date}</td>
                                    <td className="p-4">{item.time}</td>
                                    <td className="p-4">
                                        <button onClick={() => handleDeleteMaintenance(item.id)} className="text-red-500">
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5-4h4M5 7h14"></path>
                                            </svg>
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Maintenance Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <div className="bg-white p-6 rounded-lg w-[90%] md:w-[500px]">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-semibold">Add New Item</h3>
                            <button onClick={() => setIsModalOpen(false)} className="text-black">
                                <CrossIcon />
                            </button>
                        </div>
                        <form onSubmit={handleMaintenanceSubmit(onMaintenanceSubmit)} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium">Select Venue</label>
                                <select {...maintenanceRegister('venue')} className="w-full p-2 border rounded">
                                    <option value="">Select Venue</option>
                                    <option value="Grand Oak">Grand Oak</option>
                                    <option value="Sunset Hall">Sunset Hall</option>
                                    <option value="Silver Star">Silver Star</option>
                                    <option value="Emerald Arena">Emerald Arena</option>
                                    <option value="Crystal Dome">Crystal Dome</option>
                                    <option value="Sky Lounge">Sky Lounge</option>
                                    <option value="Golden Gate">Golden Gate</option>
                                    <option value="Starlight Room">Starlight Room</option>
                                    <option value="Harmony Center">Harmony Center</option>
                                    <option value="Velvet Lounge">Velvet Lounge</option>
                                </select>
                                {maintenanceErrors.venue && <p className="text-red-500 text-xs">{maintenanceErrors.venue.message}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-medium">Select Court</label>
                                <select {...maintenanceRegister('court')} className="w-full p-2 border rounded">
                                    <option value="">Select Court</option>
                                    {[...Array(10)].map((_, i) => (
                                        <option key={i} value={`Court ${i + 1}`}>Court {i + 1}</option>
                                    ))}
                                </select>
                                {maintenanceErrors.court && <p className="text-red-500 text-xs">{maintenanceErrors.court.message}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-medium">Date</label>
                                <input type="date" {...maintenanceRegister('date')} className="w-full p-2 border rounded" />
                                {maintenanceErrors.date && <p className="text-red-500 text-xs">{maintenanceErrors.date.message}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-medium">Select Timeslot</label>
                                <div className="flex gap-2">
                                    <input type="time" {...maintenanceRegister('startTime')} className="w-1/2 p-2 border rounded" />
                                    <input type="time" {...maintenanceRegister('endTime')} className="w-1/2 p-2 border rounded" />
                                </div>
                                {maintenanceErrors.startTime && <p className="text-red-500 text-xs">{maintenanceErrors.startTime.message}</p>}
                                {maintenanceErrors.endTime && <p className="text-red-500 text-xs">{maintenanceErrors.endTime.message}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-medium">Select Reason</label>
                                <select {...maintenanceRegister('reason')} className="w-full p-2 border rounded">
                                    <option value="">Select Reason</option>
                                    <option value="Maintenance">Maintenance</option>
                                    <option value="Renovation">Renovation</option>
                                    <option value="Event">Event</option>
                                </select>
                                {maintenanceErrors.reason && <p className="text-red-500 text-xs">{maintenanceErrors.reason.message}</p>}
                            </div>

                            <div className="flex justify-end gap-2">
                                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 border rounded">Cancel</button>
                                <button type="submit" className="px-4 py-2 bg-[#10375c] text-white rounded">Change Status</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Pricing Section */}
            <div className="mt-10">
                <h2 className="text-[#10375c] text-3xl font-semibold mb-6">Pricing</h2>
                <form onSubmit={handlePricingSubmit(onPricingSubmit)} className="bg-[#f2f2f4] p-6 rounded-[20px]">
                    <div className="flex gap-4 mb-4">
                        <button type="button" className="px-4 py-2 bg-[#10375c] text-white rounded-full">Weekdays</button>
                        <button type="button" className="px-4 py-2 bg-white border rounded-full">Weekends</button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium">Name</label>
                            <input type="text" value="Mon - Fri" disabled className="w-full p-2 border rounded bg-gray-100" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium">Description</label>
                            <input type="text" value="A unique phone number from India, perfect for connecting with friends and family" disabled className="w-full p-2 border rounded bg-gray-100" />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                        <div>
                            <label className="block text-sm font-medium">S/I II Frame 159</label>
                            <div className="grid grid-cols-2 gap-2">
                                <div>
                                    <label className="block text-sm">09:00</label>
                                    <input type="number" {...pricingRegister('weekdayPrice.09:00')} className="w-full p-2 border rounded" />
                                    {pricingErrors.weekdayPrice?.['09:00'] && <p className="text-red-500 text-xs">{pricingErrors.weekdayPrice['09:00'].message}</p>}
                                </div>
                                <div>
                                    <label className="block text-sm">09:00</label>
                                    <input type="number" {...pricingRegister('weekendPrice.09:00')} className="w-full p-2 border rounded" />
                                    {pricingErrors.weekendPrice?.['09:00'] && <p className="text-red-500 text-xs">{pricingErrors.weekendPrice['09:00'].message}</p>}
                                </div>
                                <div>
                                    <label className="block text-sm">10:00</label>
                                    <input type="number" {...pricingRegister('weekdayPrice.10:00')} className="w-full p-2 border rounded" />
                                    {pricingErrors.weekdayPrice?.['10:00'] && <p className="text-red-500 text-xs">{pricingErrors.weekdayPrice['10:00'].message}</p>}
                                </div>
                                <div>
                                    <label className="block text-sm">10:00</label>
                                    <input type="number" {...pricingRegister('weekendPrice.10:00')} className="w-full p-2 border rounded" />
                                    {pricingErrors.weekendPrice?.['10:00'] && <p className="text-red-500 text-xs">{pricingErrors.weekendPrice['10:00'].message}</p>}
                                </div>
                                <div>
                                    <label className="block text-sm">11:00</label>
                                    <input type="number" {...pricingRegister('weekdayPrice.11:00')} className="w-full p-2 border rounded" />
                                    {pricingErrors.weekdayPrice?.['11:00'] && <p className="text-red-500 text-xs">{pricingErrors.weekdayPrice['11:00'].message}</p>}
                                </div>
                                <div>
                                    <label className="block text-sm">11:00</label>
                                    <input type="number" {...pricingRegister('weekendPrice.11:00')} className="w-full p-2 border rounded" />
                                    {pricingErrors.weekendPrice?.['11:00'] && <p className="text-red-500 text-xs">{pricingErrors.weekendPrice['11:00'].message}</p>}
                                </div>
                                <div>
                                    <label className="block text-sm">12:00</label>
                                    <input type="number" {...pricingRegister('weekdayPrice.12:00')} className="w-full p-2 border rounded" />
                                    {pricingErrors.weekdayPrice?.['12:00'] && <p className="text-red-500 text-xs">{pricingErrors.weekdayPrice['12:00'].message}</p>}
                                </div>
                                <div>
                                    <label className="block text-sm">12:00</label>
                                    <input type="number" {...pricingRegister('weekendPrice.12:00')} className="w-full p-2 border rounded" />
                                    {pricingErrors.weekendPrice?.['12:00'] && <p className="text-red-500 text-xs">{pricingErrors.weekendPrice['12:00'].message}</p>}
                                </div>
                            </div>
                        </div>
                    </div>

                    <button type="submit" className="mt-6 w-full py-4 bg-[#10375c] text-white rounded-[28px]">Save</button>
                </form>
            </div>
        </div>
    );
};

export default ProfileForm;