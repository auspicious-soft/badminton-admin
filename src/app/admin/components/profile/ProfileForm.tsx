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

// Validation schema
const schema = yup.object().shape({
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
    const { data, mutate, isLoading } = useSWR("admin/get-admin-details", getAdminDetails);
    const profileDetails = useMemo(() => data?.data?.data || {}, [data]);

    const { register, handleSubmit, formState: { errors, isDirty }, reset, watch } = useForm({
        resolver: yupResolver(schema),
        defaultValues: {
            name: '',
            phoneNumber: '',
            email: '',
            changePassword: null,
            confirmPassword: null,
            images: null,
        },
    });

    // Set default values when profileDetails loads, but only if necessary
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

            // Get current form values
            const currentValues = watch();

            // Only reset if values have changed
            if (
                currentValues.name !== newValues.name ||
                currentValues.phoneNumber !== newValues.phoneNumber ||
                currentValues.email !== newValues.email
            ) {
                reset(newValues, { keepDirty: false });
            }

            // Set image preview only if it hasn't been set or if profilePic changed
            if (
                profileDetails.profilePic &&
                (!imagePreview || imagePreview.url !== profileDetails.profilePic)
            ) {
                setImagePreview({ url: profileDetails.profilePic });
            }
        }
    }, [profileDetails, reset]); // Removed watch from dependencies

    // Watch form values to detect changes
    const formValues = watch();

    // Check if form has changes compared to initial data
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

    const onSubmit = async (data) => {
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

            // Call API to update profile
            const response=await updateAdminDetails("admin/update-admin-details",formData);
            if (response?.status === 200 || response?.status === 201) {
                await mutate();
                toast.success("Profile upded successfully");
                
              } else {
                toast.error("Failed to update profile details");
              }
          

            // Reset form to new values
            reset({
                name: data.name,
                phoneNumber: data.phoneNumber,
                email: data.email,
                changePassword: null,
                confirmPassword: null,
                images: null,
            }, { keepDirty: false });

            // Update image preview
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

    if (isLoading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="mb-[50px] h-[100vh]">
            <div className="flex justify-between">
                <h2 className="text-[#10375c] text-3xl font-semibold mb-6">Profile</h2>
            </div>
            <form onSubmit={handleSubmit(onSubmit)} className="w-full flex flex-col md:flex-row gap-[15px] h-fit">
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
                                {...register('images', { onChange: handleImageChange })}
                            />
                        </label>
                    </div>

                    <div className="flex flex-col gap-[15px]">
                        <div className="flex flex-col gap-[10px]">
                            <label className="block text-[#1b2229] text-xs font-medium">Name</label>
                            <input
                                type="text"
                                {...register('name')}
                                className="w-full h-[45.41px] px-[15px] py-2.5 bg-white rounded-[39px] text-black/60 text-xs font-medium"
                                placeholder="Enter name"
                            />
                            {errors.name && <p className="text-red-500 text-xs">{errors.name.message}</p>}
                        </div>

                        <div className="flex flex-col gap-[10px]">
                            <label className="block text-[#1b2229] text-xs font-medium">Phone Number</label>
                            <input
                                type="text"
                                {...register('phoneNumber')}
                                className="w-full h-[45.41px] px-[15px] py-2.5 bg-white rounded-[39px] text-black/60 text-xs font-medium"
                                placeholder="Enter Phone Number"
                            />
                            {errors.phoneNumber && <p className="text-red-500 text-xs">{errors.phoneNumber.message}</p>}
                        </div>

                        <div className="flex flex-col gap-[10px]">
                            <label className="block text-[#1b2229] text-xs font-medium">Email Address</label>
                            <input
                                type="text"
                                {...register('email')}
                                className="w-full h-[45.41px] px-[15px] py-2.5 bg-white rounded-[39px] text-black/60 text-xs font-medium"
                                placeholder="Email Address"
                            />
                            {errors.email && <p className="text-red-500 text-xs">{errors.email.message}</p>}
                        </div>

                        <div className="flex w-full gap-[15px]">
                            <div className="w-[50%] flex flex-col gap-[10px]">
                                <label className="block text-[#1b2229] text-xs font-medium">Change Password</label>
                                <input
                                    type="password"
                                    {...register('changePassword')}
                                    className="w-full h-[45.41px] px-[15px] py-2.5 bg-white rounded-[39px] text-black/60 text-xs font-medium"
                                    placeholder="******"
                                />
                                {errors.changePassword && <p className="text-red-500 text-xs">{errors.changePassword.message}</p>}
                            </div>
                            <div className="w-[50%] flex flex-col gap-[10px]">
                                <label className="block text-[#1b2229] text-xs font-medium">Confirm Password</label>
                                <input
                                    type="password"
                                    {...register('confirmPassword')}
                                    className="w-full h-[45.41px] px-[15px] py-2.5 bg-white rounded-[39px] text-black/60 text-xs font-medium"
                                    placeholder="******"
                                />
                                {errors.confirmPassword && <p className="text-red-500 text-xs">{errors.confirmPassword.message}</p>}
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
        </div>
    );
};

export default ProfileForm;