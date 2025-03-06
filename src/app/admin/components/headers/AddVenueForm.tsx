// "use client";
// import React, { useState, useEffect } from 'react';
// import { useForm } from 'react-hook-form';
// import { yupResolver } from '@hookform/resolvers/yup';
// import * as yup from 'yup';
// import Image from 'next/image';
// import { CrossIcon, DeleteIcon1, EditIcon, PlusIcon } from '@/utils/svgicons';
// import NoImage from "@/assets/images/nofile.png";
// import Rating from '@mui/material/Rating';
// import CourtManagement from './AddVenueModal';
// import AddEmployeeModal from './AddEmployeesModal';

// // Updated Reviews array (removed duplicates and ensured unique IDs)
// const Reviews = [
//     { id: 1, userName: "John Doe", rating: 5, review: "consequat. ex vero qui dolor nulla adipiscing exerci sed sit ut eu ullamcorper amet, praesent odio facilisi. quis iusto nulla aliquip iriure nibh nisl consequat, dolor enim eum et erat elit, tation aliquam accumsan euismod lobortis dignissim volutpat. ad dolore feugiat feugait dolore Duis vulputate dolore zzril autem wisi vel" },
//     { id: 2, userName: "Alex Parker", rating: 4, review: "giat feugait dolore Duis vulputate dolore zzril autem wisi vel" },
//     { id: 3, userName: "Marley Martinez", rating: 4.5, review: "quis iusto nulla aliquip iriure nibh nisl consequat, dolor enim eum et erat elit, tation aliquam accumsan euismod lobortis dignissim volutpat. ad dolore feugiat feugait dolore Duis vulputate dolore zzril autem wisi vel" },
//     { id: 1, userName: "John Doe", rating: 5, review: "consequat. ex vero qui dolor nulla adipiscing exerci sed sit ut eu ullamcorper amet, praesent odio facilisi. quis iusto nulla aliquip iriure nibh nisl consequat, dolor enim eum et erat elit, tation aliquam accumsan euismod lobortis dignissim volutpat. ad dolore feugiat feugait dolore Duis vulputate dolore zzril autem wisi vel" },
//     { id: 2, userName: "Alex Parker", rating: 4, review: "giat feugait dolore Duis vulputate dolore zzril autem wisi vel" },
//     { id: 3, userName: "Marley Martinez", rating: 4.5, review: "quis iusto nulla aliquip iriure nibh nisl consequat, dolor enim eum et erat elit, tation aliquam accumsan euismod lobortis dignissim volutpat. ad dolore feugiat feugait dolore Duis vulputate dolore zzril autem wisi vel" },
// ];

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

// const AddVenueForm = () => {
//     const [modalOpen, setModalOpen] = useState(false);
//     const [employeeModalOpen, setEmployeeModalOpen] = useState(false);
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
//         <div className="mb-[50px] h-[100vh] ">
//             <div className="flex justify-between">
//                 <h2 className="text-[#10375c] text-3xl font-semibold mb-6">Barnton Park LTC</h2>
//                 <button onClick={() => console.log("add court")} className="flex items-center h-10 gap-[10px] px-5 py-3 bg-[#1b2229] rounded-[28px] text-white text-sm font-medium "><PlusIcon /> Add A New Venue</button>
//             </div>
//             <form onSubmit={handleSubmit(onSubmit)} className="w-full flex flex-col md:flex-row gap-[15px] h-fit">
//                 <div className="w-full md:w-[35%] space-y-4 bg-[#f2f2f4] p-[15px] rounded-[20px] h-fit">
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
//                                         <CrossIcon />
//                                     </button>
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
//                             Upload Images
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

//                     <div className="flex flex-col gap-[15px]">
//                         <div className="flex flex-col gap-[10px]">
//                             <label className="block text-[#1b2229] text-xs font-medium">
//                             Name of the Venue
//                             </label>
//                             <input
//                                 type="text"
//                                 {...register('productName')}
//                                 className="w-full h-[45.41px] px-[15px] py-2.5 bg-white rounded-[39px] text-black/60 text-xs font-medium"
//                                 placeholder="Enter venue name"
//                             />
//                         </div>

//                         <div className="flex flex-col gap-[10px]">
//                             <label className="block text-[#1b2229] text-xs font-medium">
//                                 Location
//                             </label>
//                             <input
//                                 type="number"
//                                 {...register('actualPrice')}
//                                 className="w-full h-[45.41px] px-[15px] py-2.5 bg-white rounded-[39px] text-black/60 text-xs font-medium"
//                                 placeholder="location here"
//                             />
//                         </div>

//                         <div className="flex flex-col gap-[10px]">
//                             <label className="block text-[#1b2229] text-xs font-medium">
//                                 Games Available
//                             </label>
//                             {/* <input
//                                 type="number"
//                                 {...register('discountedPrice')}
//                                 className="w-full h-[45.41px] px-[15px] py-2.5 bg-white rounded-[39px] text-black/60 text-xs font-medium"
//                                 placeholder="₹0"
//                             /> */}
//                             <Select
//               isMulti
//               options={options}
//               value={options.filter(option => formData.recipients.includes(option.value))}
//               onChange={handleRecipientsChange}
//               className="w-full  text-black/60 text-xs font-medium "
//               classNamePrefix="react-select"
//               placeholder="Select Name..."
//               styles={{
//                 control: (base) => ({
//                   ...base,
//                   borderRadius: '44px', // Match the rounded style from your input
//                   border: '1px solid #e6e6e6',
//                   boxShadow: 'none',
//                   width:'60%',
//                   '&:hover': {
//                     borderColor: '#e6e6e6',
//                   },
//                   padding: '2px',
//                 }),
//                 menu: (base) => ({
//                   ...base,
//                   borderRadius: '8px',
//                   width:'40%',
//                   boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
//                 }),
//                 option: (base, { isFocused }) => ({
//                   ...base,
//                   backgroundColor: isFocused ? '#e6f7ff' : 'white',
//                   color: '#1c2329',
//                   '&:active': {
//                     backgroundColor: '#e6f7ff',
//                   },
//                 }),
//                 multiValue: (base) => ({
//                   ...base,
//                   backgroundColor: '#1c2329',
//                   borderRadius: '5px',
//                 }),
//                 multiValueLabel: (base) => ({
//                   ...base,
//                   color: 'white',
//                   padding: '4px 2px 4px 12px'
//                 }),
//                 multiValueRemove: (base) => ({
//                   ...base,
//                   color: 'white',
//                   margin:'4px 5px 4px 0px',
//                   '&:hover': {
//                     backgroundColor: '#1c2329',
//                     color: 'white',
//                   },
//                 }),
//               }}
//             />
//           </div>
//                         </div>

//                         <div className="flex flex-col gap-[10px]">
//                             <label className="block text-[#1b2229] text-xs font-medium">
//                                 Status
//                             </label>
//                             <input
//                                 type="number"
//                                 {...register('quantity')}
//                                 className="w-full h-[45.41px] px-[15px] py-2.5 bg-white rounded-[39px] text-black/60 text-xs font-medium"
//                                 placeholder="000"
//                             />
//                         </div>

//                         <button
//                             type="submit"
//                             className=" py-4 bg-[#10375c] rounded-[28px] text-white text-sm font-medium mt-[5px]"
//                         >
//                             Save
//                         </button>
//                     </div>
//                 </div>

//                 {/* Right column - Product details */}
//                 <div className="w-full md:w-[65%] flex flex-col gap-[15px]">
//                     <div className="w-full h-fit min-h-[200px] p-[15px] bg-[#f2f2f4] rounded-[20px] flex-col justify-start items-start gap-[30px]">
//                         <div className="flex justify-between">
//                             <h3 className="text-[#10375c] text-2xl font-semibold mb-[20px]">Courts</h3>
//                             <button onClick={() => setModalOpen(true)} className="flex items-center h-10 gap-[10px] px-5 py-3 bg-[#1b2229] rounded-[28px] text-white text-sm font-medium "><PlusIcon /> Add A New Court</button>
//                         </div>

//                     </div>

//                     <div className=" w-full flex flex-col gap-[15px] mb-4">
//                         <div className="w-full min-h-[200px] p-[15px] bg-[#f2f2f4] rounded-[20px] flex flex-col overflow-y-auto overflo-custom ">
//                             <div className="flex justify-between">
//                                 <h3 className="text-[#10375c] text-xl font-medium ">Employees Associated</h3>
//                                 <button onClick={() => setEmployeeModalOpen(true)} className="flex items-center h-7 gap-[10px] px-3 py-2  bg-[#1b2229] rounded-[28px]  text-white text-[10px] font-normal  ">Add Employee</button>
//                             </div>
//                             {/* {Reviews.map((review, index) => (
//                                 <div key={index} className="mb-[30px]">
//                                     <div className="flex w-full mb-[10px]">
//                                         <div className="w-full flex flex-col gap-[10px]">
//                                             <div className="text-[#1b2229] text-sm font-medium">{review.userName}</div>
//                                             <Rating name="read-only" value={review.rating} readOnly />
//                                         </div>
//                                         <div className="">
//                                             <DeleteIcon1 />
//                                         </div>
//                                     </div>
//                                     <div className="w-full text-black/60 text-sm font-medium leading-tight">{review.review}</div>
//                                 </div>
//                             ))} */}
//                         </div>
//                     </div>
//                 </div>
//             </form>
//             <CourtManagement
//                 open={modalOpen}
//                 onClose={() => setModalOpen(false)}
//             />
//             <AddEmployeeModal
//                 open={employeeModalOpen}
//                 setOpen={setEmployeeModalOpen}
//             />
//         </div>
//     );
// };

// export default AddVenueForm;
"use client";
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import Image from 'next/image';
import { CrossIcon, DeleteIcon1, EditIcon, PlusIcon } from '@/utils/svgicons';
import NoImage from "@/assets/images/nofile.png";
import Rating from '@mui/material/Rating';
import CourtManagement from './AddVenueModal';
import AddEmployeeModal from './AddEmployeesModal';
import dynamic from 'next/dynamic';
import { UpArrowIcon, DownArrowIcon } from "@/utils/svgicons";

// Dynamically import react-select with SSR disabled
const Select = dynamic(() => import('react-select'), { ssr: false });

// Updated Reviews array
const Reviews = [
    { id: 1, userName: "John Doe", rating: 5, review: "consequat..." },
    { id: 2, userName: "Alex Parker", rating: 4, review: "giat..." },
    { id: 3, userName: "Marley Martinez", rating: 4.5, review: "quis..." },
];

// Validation schema using Yup
const schema = yup.object().shape({
    productName: yup.string().required('Product name is required'),
    actualPrice: yup.string().required('Location is required'),
    quantity: yup.string().required('Status is required'),
    discountedPrice: yup.number().required('Discounted price is required').positive().integer()
        .lessThan(yup.ref('actualPrice'), 'Discounted price must be less than actual price'),
    description: yup.string().required('Description is required'),
    specifications: yup.string().required('Specifications are required'),
    images: yup
        .mixed()
        .required('An image is required')
        .test('fileSize', 'File size is too large', (value: any) => {
            return value && value.size <= 2000000; // 2MB
        })
        .test('fileType', 'Unsupported file format', (value: any) => {
            return value && ['image/jpeg', 'image/png', 'image/gif'].includes(value.type);
        }),
});

// Options for the Select component
const gameOptions = [
    { value: 'pickleball', label: 'Pickleball' },
    { value: 'padelball', label: 'Padelball' },
];

const AddVenueForm = () => {
    const [modalOpen, setModalOpen] = useState(false);
    const [employeeModalOpen, setEmployeeModalOpen] = useState(false);
    const [selectedGames, setSelectedGames] = useState([]);
    const { register, handleSubmit, formState: { errors }, reset } = useForm({
        resolver: yupResolver(schema),
    });
    const [imagePreview, setImagePreview] = useState(null);
    const [gameDropdown, setGameDropdown] = useState(false);
    const [selectedGame, setSelectedGame] = useState("");

    const status = ["Active", "Inactive"];

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

    const handleGamesChange = (selectedOptions) => {
        setSelectedGames(selectedOptions || []);
    };

    const onSubmit = (data) => {
        console.log('Form data:', {
            ...data,
            games: selectedGames.map(option => option.value),
            image: imagePreview ? imagePreview.file : null,
        });
        reset();
        setImagePreview(null);
        setSelectedGames([]);
    };

    return (
        <div className="mb-[50px] h-[100vh]">
            <div className="flex justify-between">
                <h2 className="text-[#10375c] text-3xl font-semibold mb-6">Barnton Park LTC</h2>
                <button onClick={() => console.log("add court")} className="flex items-center h-10 gap-[10px] px-5 py-3 bg-[#1b2229] rounded-[28px] text-white text-sm font-medium">
                    <PlusIcon /> Add A New Venue
                </button>
            </div>
            <form onSubmit={handleSubmit(onSubmit)} className="w-full flex flex-col md:flex-row gap-[15px] h-fit">
                <div className="w-full md:w-[35%] space-y-4 bg-[#f2f2f4] p-[15px] rounded-[20px] h-fit">
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
                            <label className="block text-[#1b2229] text-xs font-medium">Name of the Venue</label>
                            <input
                                type="text"
                                {...register('productName')}
                                className="w-full h-[45.41px] px-[15px] py-2.5 bg-white rounded-[39px] text-black/60 text-xs font-medium"
                                placeholder="Enter venue name"
                            />
                        </div>

                        <div className="flex flex-col gap-[10px]">
                            <label className="block text-[#1b2229] text-xs font-medium">Location</label>
                            <input
                                type="text"
                                {...register('actualPrice')}
                                className="w-full h-[45.41px] px-[15px] py-2.5 bg-white rounded-[39px] text-black/60 text-xs font-medium"
                                placeholder="Enter location"
                            />
                        </div>

                        <div className="flex flex-col gap-[10px]">
                            <label className="block text-[#1b2229] text-xs font-medium">Games Available</label>
                            <Select
                                isMulti
                                options={gameOptions}
                                value={selectedGames}
                                onChange={handleGamesChange}
                                className="w-full text-black/60 text-xs font-medium"
                                classNamePrefix="react-select"
                                placeholder="Select Games..."
                                styles={{
                                    control: (base) => ({
                                        ...base,
                                        borderRadius: '44px',
                                        border: '1px solid #e6e6e6',
                                        boxShadow: 'none',
                                        '&:hover': {
                                            borderColor: '#e6e6e6',
                                        },
                                        padding: '2px',
                                    }),
                                    menu: (base) => ({
                                        ...base,
                                        borderRadius: '8px',
                                        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                                    }),
                                    option: (base, { isFocused }) => ({
                                        ...base,
                                        backgroundColor: isFocused ? '#e6f7ff' : 'white',
                                        color: '#1c2329',
                                        '&:active': {
                                            backgroundColor: '#e6f7ff',
                                        },
                                    }),
                                    multiValue: (base) => ({
                                        ...base,
                                        backgroundColor: '#1c2329',
                                        borderRadius: '5px',
                                    }),
                                    multiValueLabel: (base) => ({
                                        ...base,
                                        color: 'white',
                                        padding: '4px 2px 4px 12px'
                                    }),
                                    multiValueRemove: (base) => ({
                                        ...base,
                                        color: 'white',
                                        margin: '4px 5px 4px 0px',
                                        '&:hover': {
                                            backgroundColor: '#1c2329',
                                            color: 'white',
                                        },
                                    }),
                                }}
                            />
                        </div>

                        <div className="flex flex-col gap-[10px]">
                            <label className="block text-[#1b2229] text-xs font-medium">Status</label>
                            {/* <input
                                type="text"
                                {...register('quantity')}
                                className="w-full h-[45.41px] px-[15px] py-2.5 bg-white rounded-[39px] text-black/60 text-xs font-medium"
                                placeholder="Enter status"
                            /> */}

                            <div className="relative">
                                <button className="w-full flex justify-between h-10h-[45px] px-[15px] py-2.5 bg-white rounded-[39px] text-black/60 text-xs font-medium " onClick={() => setGameDropdown(!gameDropdown)}>
                                    {selectedGame || "Status"}
                                    <span className="">{!gameDropdown ? <DownArrowIcon stroke='#1b2229' /> : <UpArrowIcon stroke='#1b2229' />}</span>
                                </button>
                                {gameDropdown && (
                                    <div className="z-50 flex flex-col gap-[5px] absolute top-10 left-0  p-[10px] w-full h-fit bg-white rounded-[10px] shadow-[0px_4px_20px_0px_rgba(92,138,255,0.10)]">
                                        {status.map((game) => (
                                            <label key={game} className="flex gap-[10px] cursor-pointer text-[#1b2229] text-sm font-medium ">
                                                <input
                                                    type="radio"
                                                    name="game"
                                                    value={game}
                                                    checked={selectedGame === game}
                                                    onChange={(e) => {
                                                        setSelectedGame(e.target.value);
                                                        console.log("Selected Game:", e.target.value);
                                                        setGameDropdown(false);
                                                    }}
                                                    className="bg-[#1b2229]"
                                                />
                                                {game}
                                            </label>
                                        ))}
                                    </div>
                                )}
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

                <div className="w-full md:w-[65%] flex flex-col gap-[15px]">
                    <div className="w-full h-fit min-h-[200px] p-[15px] bg-[#f2f2f4] rounded-[20px] flex-col justify-start items-start gap-[30px]">
                        <div className="flex justify-between">
                            <h3 className="text-[#10375c] text-2xl font-semibold mb-[20px]">Courts</h3>
                            <button onClick={() => setModalOpen(true)} className="flex items-center h-10 gap-[10px] px-5 py-3 bg-[#1b2229] rounded-[28px] text-white text-sm font-medium">
                                <PlusIcon /> Add A New Court
                            </button>
                        </div>
                    </div>

                    <div className="w-full flex flex-col gap-[15px] mb-4">
                        <div className="w-full min-h-[200px] p-[15px] bg-[#f2f2f4] rounded-[20px] flex flex-col overflow-y-auto overflo-custom">
                            <div className="flex justify-between">
                                <h3 className="text-[#10375c] text-xl font-medium">Employees Associated</h3>
                                <button onClick={() => setEmployeeModalOpen(true)} className="flex items-center h-7 gap-[10px] px-3 py-2 bg-[#1b2229] rounded-[28px] text-white text-[10px] font-normal">
                                    Add Employee
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </form>
            <CourtManagement open={modalOpen} onClose={() => setModalOpen(false)} />
            <AddEmployeeModal open={employeeModalOpen} setOpen={setEmployeeModalOpen} />
        </div>
    );
};

export default AddVenueForm;