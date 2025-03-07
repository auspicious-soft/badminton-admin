
"use client";
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { CrossIcon, EditIcon } from '@/utils/svgicons';
import NoImage from "@/assets/images/nofile.png";
import Image from 'next/image';

// Validation schema using Yup
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
        .required('Password is required'),
    confirmPassword: yup
        .string()
        .oneOf([yup.ref('changePassword')], 'Passwords must match')
        .required('Confirm password is required'),
    images: yup
        .mixed()
        .required('An image is required')
        // .test('fileSize', 'File size is too large', (value:any) => {
        //     return value && value.size <= 8000000; // 2MB
        // })
        // .test('fileType', 'Unsupported file format', (value:any) => {
        //     return value && ['image/jpeg', 'image/png', 'image/gif'].includes(value.type);
        // }),
});

const ProfileForm = () => {
    const [imagePreview, setImagePreview] = useState(null);
    const { register, handleSubmit, formState: { errors }, reset } = useForm({
        resolver: yupResolver(schema),
    });
    console.log('errors: ', errors);
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

    const onSubmit = (data) => {
        const formData = {
            name: data.name,
            phoneNumber: data.phoneNumber,
            email: data.email,
            changePassword: data.changePassword,
            confirmPassword: data.confirmPassword,
            image: imagePreview ? imagePreview.file : null,
        };
        console.log('Profile Form Data:', formData);
        
        // Reset form
        reset();
        setImagePreview(null);
    };

    return (
        <div className="mb-[50px] h-[100vh]">
            <div className="flex justify-between">
                <h2 className="text-[#10375c] text-3xl font-semibold mb-6">Profile</h2>
            </div>
            <form onSubmit={handleSubmit(onSubmit)} className="w-full flex flex-col md:flex-row gap-[15px] h-fit">
                <div className="w-full md:w-[50%] lg:w-[40%] space-y-4 bg-[#f2f2f4] p-[15px] rounded-[20px] h-fit">
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
                            className="py-4 bg-[#10375c] rounded-[28px] text-white text-sm font-medium mt-[5px]"
                        >
                            Save
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default ProfileForm;