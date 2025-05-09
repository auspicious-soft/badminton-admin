// "use client";
// import React, { useState, useEffect } from 'react';
// import { useForm } from 'react-hook-form';
// import { yupResolver } from '@hookform/resolvers/yup';
// import * as yup from 'yup';
// import Image from 'next/image';
// import { CrossIcon, EditIcon } from '@/utils/svgicons';
// import NoImage from "@/assets/images/nofile.png";

// // Validation schema using Yup
// const schema = yup.object().shape({
//     productName: yup.string().required('Product name is required'),
//     actualPrice: yup.number().required('Actual price is required').positive().integer(),
//     quantity: yup.number().required('Quantity is required').positive().integer(),
//     discountedPrice: yup.number().required('Discounted price is required').positive().integer()
//         .lessThan(yup.ref('actualPrice'), 'Discounted price must be less than actual price'),
//     description: yup.string().required('Description is required'),
//     specifications: yup.string().required('Specifications are required'),
//     images: yup
//         .mixed()
//         .required('At least one image is required')
//         .test('fileSize', 'File size is too large', (value) => {
//             return value && Array.isArray(value) && value.every(file => file.size <= 2000000); // 2MB
//         })
//         .test('fileType', 'Unsupported file format', (value) => {
//             return value && Array.isArray(value) && value.every(file =>
//                 ['image/jpeg', 'image/png', 'image/gif'].includes(file.type)
//             );
//         }),
// });

// const AddProductForm = () => {
//     const { register, handleSubmit, formState: { errors }, reset } = useForm({
//         resolver: yupResolver(schema),
//     });
//     const [imagePreviews, setImagePreviews] = useState([]);

//     const handleImageChange = (e) => {
//         const files = Array.from(e.target.files);
//         const newPreviews = files.map(file => ({
//             file,
//             url: URL.createObjectURL(file as Blob)
//         }));
//         setImagePreviews(prev => [...prev, ...newPreviews]);
//     };

//     // Remove image from preview
//     const removeImage = (indexToRemove) => {
//         setImagePreviews(prev => {
//             const updatedPreviews = prev.filter((_, index) => index !== indexToRemove);
//             URL.revokeObjectURL(prev[indexToRemove].url);
//             return updatedPreviews;
//         });
//     };

//     // Clean up all object URLs when component unmounts
//     useEffect(() => {
//         return () => {
//             imagePreviews.forEach(preview => URL.revokeObjectURL(preview.url));
//         };
//     }, [imagePreviews]);

//     const onSubmit = (data) => {
//         console.log('Form data:', {
//             ...data,
//             images: imagePreviews.map(preview => preview.file)
//         });
//         reset(); // Reset form after submission
//         setImagePreviews([]); // Reset image previews after submission
//     };

//     return (
//         <div className="mb-[30px]">
//             <h2 className="text-[#10375c] text-3xl font-semibold mb-6">Add Product</h2>

//             <form onSubmit={handleSubmit(onSubmit)} className="w-full flex flex-col md:flex-row gap-[15px]">
//                 <div className="w-full md:w-[45%] space-y-4 bg-[#f2f2f4] p-[15px] rounded-[20px]">

//                     <div className="relative bg-gray-100 rounded-lg flex flex-col items-center justify-center">
//                         {imagePreviews.length > 0 ? (
//                             <div className="w-full">
//                                 {/* Display the first image as full-width */}
//                                 <div className="w-full mb-2">
//                                     <Image
//                                         src={imagePreviews[0].url}
//                                         alt={`Preview 0`}
//                                         className="w-full h-48 object-cover rounded-lg"
//                                         width={400}
//                                         height={200}
//                                     />
//                                     <button
//                                         type="button"
//                                         onClick={() => removeImage(0)}
//                                         className="absolute top-1 right-1 bg-white text-black text-center rounded-full p-[6px] px-[7px] flex items-center justify-center"
//                                     >
//                                                     <CrossIcon />
//                                                     </button>
//                                 </div>

//                                 {/* Display remaining images in a grid (e.g., 3 columns) */}
//                                 {imagePreviews.length > 1 && (
//                                     <div className="grid grid-cols-3 gap-2">
//                                         {imagePreviews.slice(1).map((preview, index) => (
//                                             <div key={index + 1} className="relative">
//                                                 <Image
//                                                     src={preview.url}
//                                                     alt={`Preview ${index + 1}`}
//                                                     className="w-full h-24 object-cover rounded-lg"
//                                                     width={100}
//                                                     height={100}
//                                                 />
//                                                 <button
//                                                     type="button"
//                                                     onClick={() => removeImage(index + 1)}
//                                                     className="absolute top-1 right-1 bg-white text-black text-center rounded-full p-[6px] flex items-center justify-center"
//                                                 >
//                                                     <CrossIcon />
//                                                 </button>
//                                             </div>
//                                         ))}
//                                     </div>
//                                 )}
//                             </div>
//                         ) : (
//                             <div className="flex flex-col h-[250px] w-full items-center justify-center bg-[#e7e7e7]  rounded-[10px]">
//                                 <Image
//                                     src={NoImage}
//                                     alt='No image selected'
//                                     className=" h-24 w-24 object-cover  rounded-[10px]"
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
//                             Add Images
//                             <input
//                                 type="file"
//                                 id="imageUpload"
//                                 accept="image/*"
//                                 multiple
//                                 className="hidden"
//                                 {...register('images', { onChange: handleImageChange })}
//                             />
//                         </label>
//                     </div>

//                     {/* Rest of the form fields remain the same */}
//                     <div className="flex flex-col gap-[15px]">
//                         <div className="flex flex-col gap-[10px]">
//                             <label className="block text-[#1b2229] text-xs font-medium">
//                                 Name of the Product
//                             </label>
//                             <input
//                                 type="text"
//                                 {...register('productName')}
//                                 className="w-full h-[45.41px] px-[15px] py-2.5 bg-white rounded-[39px] text-black/60 text-xs font-medium"
//                                 placeholder="Enter product name"
//                             />
//                         </div>

//                         <div className="flex flex-col gap-[10px]">
//                             <label className="block text-[#1b2229] text-xs font-medium">
//                                 Actual Price
//                             </label>
//                             <input
//                                 type="number"
//                                 {...register('actualPrice')}
//                                 className="w-full h-[45.41px] px-[15px] py-2.5 bg-white rounded-[39px] text-black/60 text-xs font-medium"
//                                 placeholder="₹0"
//                             />
//                         </div>

//                         <div className="flex flex-col gap-[10px]">
//                             <label className="block text-[#1b2229] text-xs font-medium">
//                                 Discounted Price
//                             </label>
//                             <input
//                                 type="number"
//                                 {...register('discountedPrice')}
//                                 className="w-full h-[45.41px] px-[15px] py-2.5 bg-white rounded-[39px] text-black/60 text-xs font-medium"
//                                 placeholder="₹0"
//                             />
//                         </div>
//                         <div className="flex flex-col gap-[10px]">
//                             <label className="block text-[#1b2229] text-xs font-medium">
//                                 Number of Items
//                             </label>
//                             <input
//                                 type="number"
//                                 {...register('quantity')}
//                                 className="w-full h-[45.41px] px-[15px] py-2.5 bg-white rounded-[39px] text-black/60 text-xs font-medium"
//                                 placeholder="000"
//                             />
//                         </div>
//                     </div>
//                 </div>

//                 {/* Right column - Product details */}
//                 <div className="w-full h-fit p-[15px] bg-[#f2f2f4] rounded-[20px] flex-col justify-start items-start gap-[30px]">
//                     <h3 className="text-[#10375c] text-2xl font-semibold mb-[20px]">Product details</h3>

//                     <div className="flex flex-col mb-[15px]">
//                         <label className="text-[#1b2229] text-xs font-medium mb-[10px]">
//                             Description
//                         </label>
//                         <textarea
//                             {...register('description')}
//                             className="w-full px-[15px] pt-2.5 pb-[50px] bg-white rounded-[10px] text-black/60 text-xs font-medium"
//                             placeholder="Description here"
//                         ></textarea>
//                     </div>

//                     <div className="flex flex-col">
//                         <label className="text-[#1b2229] text-xs font-medium mb-[10px]">
//                             Specifications
//                         </label>
//                         <textarea
//                             {...register('specifications')}
//                             className="w-full px-[15px] pt-2.5 pb-[50px] bg-white rounded-[10px] text-black/60 text-xs font-medium"
//                             placeholder="Specifications here"
//                         ></textarea>
//                     </div>

//                     <button
//                         type="submit"
//                         className="w-full h-12 py-4 bg-[#10375c] rounded-[28px] text-white text-sm font-medium mt-[30px]"
//                     >
//                         Add Product
//                     </button>
//                 </div>
//             </form>
//         </div>
//     );
// };

// export default AddProductForm;



"use client";
import React, { useState, useEffect } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import Image from 'next/image';
import { CrossIcon, EditIcon } from '@/utils/svgicons';
import NoImage from "@/assets/images/nofile.png";
import { createMerchandise } from '@/services/admin-services';
import { generateSignedUrlToUploadOn } from '@/actions';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

// Validation schema using Yup
const schema = yup.object().shape({
    productName: yup.string().required('Product name is required'),
    actualPrice: yup.number().required('Actual price is required').positive().integer(),
    discountedPrice: yup.number().required('Discounted price is required').positive().integer()
        .lessThan(yup.ref('actualPrice'), 'Discounted price must be less than actual price'),
    description: yup.string().required('Description is required'),
    specifications: yup.string().required('Specifications are required'),
    images: yup
        .mixed()
        .required('At least one image is required')
        .test('fileSize', 'File size is too large', (value) => {
            return value instanceof FileList && Array.from(value).every(file => file.size <= 2000000); // 2MB
        })
        .test('fileType', 'Unsupported file format', (value) => {
            return value instanceof FileList && Array.from(value).every(file =>
                ['image/jpeg', 'image/png', 'image/gif'].includes(file.type)
            );
        }),
    venueAndQuantity: yup.array().of(
        yup.object().shape({
            venueId: yup.string().required('Venue is required'),
            quantity: yup.number().required('Quantity is required').positive().integer(),
        })
    ).min(1, 'At least one venue and quantity pair is required'),
});

const AddProductForm = () => {
    const router = useRouter();  
    const { register, control, handleSubmit, formState: { errors }, reset } = useForm({
        resolver: yupResolver(schema),
        defaultValues: {
            venueAndQuantity: [{ venueId: '', quantity: 0 }],
        },
    });
    const { fields, append, remove } = useFieldArray({
        control,
        name: 'venueAndQuantity',
    });
    const [imagePreviews, setImagePreviews] = useState([]);

    // Mock venue data (replace with actual data from your API/backend)
    const venues = [
        { id: '681c6bb7083d124cc5e35c63', name: 'Venue 1' },
        { id: '681c6b66083d124cc5e35c0d', name: 'Venue 2' },
    ];

    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);
        const newPreviews = files.map(file => ({
            file,
            url: URL.createObjectURL(file as Blob)
        }));
        setImagePreviews(prev => [...prev, ...newPreviews]);
    };

    const removeImage = (indexToRemove) => {
        setImagePreviews(prev => {
            const updatedPreviews = prev.filter((_, index) => index !== indexToRemove);
            URL.revokeObjectURL(prev[indexToRemove].url);
            return updatedPreviews;
        });
    };

    useEffect(() => {
        return () => {
            imagePreviews.forEach(preview => URL.revokeObjectURL(preview.url));
        };
    }, [imagePreviews]);

    const uploadImages = async (files) => {
        try {
            const timestamp = Date.now();
            const uploadedKeys = await Promise.all(
                files.map(async (file, index) => {
                    const fileName = `${timestamp}-${index}-${file.name}`;

                    // Generate signed URL for S3 upload
                    const { signedUrl, key } = await generateSignedUrlToUploadOn(
                        fileName,
                        file.type
                    );
                    console.log('signedUrl: ', signedUrl);

                    // Upload the file to S3
                    const uploadResponse = await fetch(signedUrl, {
                        method: "PUT",
                        body: file,
                        headers: {
                            "Content-Type": file.type,
                        },
                    });

                    if (!uploadResponse.ok) {
                        throw new Error(`Failed to upload image ${index} to S3`);
                    }

                    return key;
                })
            );
            return uploadedKeys;
        } catch (error) {
            console.error("Error uploading images:", error);
            toast.error("Failed to upload images");
            throw error;
        }
    };

    const onSubmit = async (data) => {
        try {
            if (imagePreviews.length === 0) {
                toast.error('Please add at least one image');
                return;
            }

            // Show loading toast
            toast.loading('Uploading images and creating product...');

            // Upload images to S3 first
            const imageFiles = imagePreviews.map(preview => preview.file);
            const uploadedImageKeys = await uploadImages(imageFiles);

            // Create payload with uploaded image keys
            const payload = {
                productName: data.productName,
                description: data.description,
                specification: data.specifications,
                primaryImage: uploadedImageKeys[0], // Use the S3 key for primary image
                thumbnails: uploadedImageKeys.slice(1), // Use the S3 keys for thumbnails
                actualPrice: parseFloat(data.actualPrice),
                discountedPrice: parseFloat(data.discountedPrice),
                venueAndQuantity: data.venueAndQuantity.map(item => ({
                    venueId: item.venueId,
                    quantity: parseInt(item.quantity),
                })),
                isActive: true,
            };

            console.log('payload: ', payload);
            // Make API call to create merchandise
            const response = await createMerchandise('/admin/products', payload);

            // Handle response
            if (response.status === 200 || response.status === 201) {
                toast.success('Product added successfully');
                reset(); // Reset form
                setImagePreviews([]); // Clear image previews
                router.push('/admin/merchandises'); // Redirect to merchandise list
            } else {
                toast.error('Failed to add product');
            }
        } catch (error) {
            console.error('Error adding product:', error);
            toast.error('Error adding product: ' + (error.message || 'Unknown error'));
        }
    };

    return (
        <div className="mb-[30px]">
            <h2 className="text-[#10375c] text-3xl font-semibold mb-6">Add Product</h2>

            <form onSubmit={handleSubmit(onSubmit)} className="w-full flex flex-col md:flex-row gap-[15px]">
                <div className="w-full md:w-[45%] space-y-4 bg-[#f2f2f4] p-[15px] rounded-[20px]">
                    <div className="relative bg-gray-100 rounded-lg flex flex-col items-center justify-center">
                        {imagePreviews.length > 0 ? (
                            <div className="w-full">
                                <div className="w-full mb-2">
                                    <Image
                                        src={imagePreviews[0].url}
                                        alt={`Preview 0`}
                                        className="w-full h-48 object-cover rounded-lg"
                                        width={400}
                                        height={200}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => removeImage(0)}
                                        className="absolute top-1 right-1 bg-white text-black text-center rounded-full p-[6px] px-[7px] flex items-center justify-center"
                                    >
                                        <CrossIcon />
                                    </button>
                                </div>
                                {imagePreviews.length > 1 && (
                                    <div className="grid grid-cols-3 gap-2">
                                        {imagePreviews.slice(1).map((preview, index) => (
                                            <div key={index + 1} className="relative">
                                                <Image
                                                    src={preview.url}
                                                    alt={`Preview ${index + 1}`}
                                                    className="w-full h-24 object-cover rounded-lg"
                                                    width={100}
                                                    height={100}
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => removeImage(index + 1)}
                                                    className="absolute top-1 right-1 bg-white text-black text-center rounded-full p-[6px] flex items-center justify-center"
                                                >
                                                    <CrossIcon />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}
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
                            Add Images
                            <input
                                type="file"
                                id="imageUpload"
                                accept="image/*"
                                multiple
                                className="hidden"
                                {...register('images', { onChange: handleImageChange })}
                            />
                        </label>
                    </div>

                    <div className="flex flex-col gap-[15px]">
                        <div className="flex flex-col gap-[10px]">
                            <label className="block text-[#1b2229] text-xs font-medium">
                                Name of the Product
                            </label>
                            <input
                                type="text"
                                {...register('productName')}
                                className="w-full h-[45.41px] px-[15px] py-2.5 bg-white rounded-[39px] text-black/60 text-xs font-medium"
                                placeholder="Enter product name"
                            />
                            {errors.productName && <p className="text-red-500 text-xs">{errors.productName.message}</p>}
                        </div>

                        <div className="flex flex-col gap-[10px]">
                            <label className="block text-[#1b2229] text-xs font-medium">
                                Actual Price
                            </label>
                            <input
                                type="number"
                                {...register('actualPrice')}
                                className="w-full h-[45.41px] px-[15px] py-2.5 bg-white rounded-[39px] text-black/60 text-xs font-medium"
                                placeholder="₹0"
                            />
                            {errors.actualPrice && <p className="text-red-500 text-xs">{errors.actualPrice.message}</p>}
                        </div>

                        <div className="flex flex-col gap-[10px]">
                            <label className="block text-[#1b2229] text-xs font-medium">
                                Discounted Price
                            </label>
                            <input
                                type="number"
                                {...register('discountedPrice')}
                                className="w-full h-[45.41px] px-[15px] py-2.5 bg-white rounded-[39px] text-black/60 text-xs font-medium"
                                placeholder="₹0"
                            />
                            {errors.discountedPrice && <p className="text-red-500 text-xs">{errors.discountedPrice.message}</p>}
                        </div>

                        <div className="flex flex-col gap-[10px]">
                            <label className="block text-[#1b2229] text-xs font-medium">
                                Venue & Quantity
                            </label>
                            {fields.map((field, index) => (
                                <div key={field.id} className="flex gap-[10px] items-center">
                                    <select
                                        {...register(`venueAndQuantity.${index}.venueId`)}
                                        className="w-1/2 h-[45.41px] px-[15px] py-2.5 bg-white rounded-[39px] text-black/60 text-xs font-medium"
                                    >
                                        <option value="" disabled>Select Venue</option>
                                        {venues.map(venue => (
                                            <option key={venue.id} value={venue.id}>
                                                {venue.name}
                                            </option>
                                        ))}
                                    </select>
                                    <input
                                        type="number"
                                        {...register(`venueAndQuantity.${index}.quantity`)}
                                        className="w-1/2 h-[45.41px] px-[15px] py-2.5 bg-white rounded-[39px] text-black/60 text-xs font-medium"
                                        placeholder="000"
                                    />
                                    {fields.length > 1 && (
                                        <button
                                            type="button"
                                            onClick={() => remove(index)}
                                            className="w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center"
                                        >
                                            -
                                        </button>
                                    )}
                                </div>
                            ))}
                            {errors.venueAndQuantity && (
                                <p className="text-red-500 text-xs">{errors.venueAndQuantity.message}</p>
                            )}
                            {errors.venueAndQuantity?.[fields.length - 1]?.venueId && (
                                <p className="text-red-500 text-xs">{errors.venueAndQuantity[fields.length - 1].venueId.message}</p>
                            )}
                            {errors.venueAndQuantity?.[fields.length - 1]?.quantity && (
                                <p className="text-red-500 text-xs">{errors.venueAndQuantity[fields.length - 1].quantity.message}</p>
                            )}
                            <button
                                type="button"
                                onClick={() => append({ venueId: '', quantity: 0 })}
                                className="text-[#10375c] text-sm font-medium flex items-center gap-1"
                            >
                                + Add More
                            </button>
                        </div>
                    </div>
                </div>

                <div className="w-full h-fit p-[15px] bg-[#f2f2f4] rounded-[20px] flex-col justify-start items-start gap-[30px]">
                    <h3 className="text-[#10375c] text-2xl font-semibold mb-[20px]">Product details</h3>

                    <div className="flex flex-col mb-[15px]">
                        <label className="text-[#1b2229] text-xs font-medium mb-[10px]">
                            Description
                        </label>
                        <textarea
                            {...register('description')}
                            className="w-full px-[15px] pt-2.5 pb-[50px] bg-white rounded-[10px] text-black/60 text-xs font-medium"
                            placeholder="Description here"
                        ></textarea>
                        {errors.description && <p className="text-red-500 text-xs">{errors.description.message}</p>}
                    </div>

                    <div className="flex flex-col">
                        <label className="text-[#1b2229] text-xs font-medium mb-[10px]">
                            Specifications
                        </label>
                        <textarea
                            {...register('specifications')}
                            className="w-full px-[15px] pt-2.5 pb-[50px] bg-white rounded-[10px] text-black/60 text-xs font-medium"
                            placeholder="Specifications here"
                        ></textarea>
                        {errors.specifications && <p className="text-red-500 text-xs">{errors.specifications.message}</p>}
                    </div>

                    <button
                        type="submit"
                        className="w-full h-12 py-4 bg-[#10375c] rounded-[28px] text-white text-sm font-medium mt-[30px]"
                    >
                        Add Product
                    </button>
                </div>
            </form>
        </div>
    );
};

export default AddProductForm;