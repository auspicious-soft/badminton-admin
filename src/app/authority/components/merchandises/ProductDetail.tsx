"use client";
import React, { useState, useEffect, useTransition } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import Image from "next/image";
import { CrossIcon, DeleteProductIcon, EditIcon, Loading } from "@/utils/svgicons";
import NoImage from "@/assets/images/nofile.png";
import Rating from "@mui/material/Rating";
import { useParams, useRouter } from "next/navigation";
import useSWR from "swr";
import { getMerchandise, updateMerchandise } from "@/services/admin-services";
import { deleteFileFromS3, generateSignedUrlToUploadOn } from "@/actions";
import { toast } from "sonner";
import { getImageClientS3URL } from "@/config/axios";
import { validateImageFile } from "@/utils/fileValidation";

// Placeholder deleteFileFromS3 function (implement on your backend)
// const deleteFileFromS3 = async (key) => {
//   try {
//     const response = await fetch(`/api/s3/delete`, {
//       method: "DELETE",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({ key }),
//     });
//     if (!response.ok) {
//       throw new Error("Failed to delete file from S3");
//     }
//     return await response.json();
//   } catch (error) {
//     console.error("Error deleting file from S3:", error);
//     throw error;
//   }
// };

const reviews = [
  {
    userId: "507f1f77bcf86cd799439011",
    name: "Alice Johnson",
    rating: 4,
    description: "Really enjoyed the product! Great quality and fast delivery.",
    createdAt: "2025-05-12T10:30:00.000Z",
  },
  {
    userId: "507f191e810c19729de860ea",
    name: "Bob Smith",
    rating: 5,
    description: "Absolutely fantastic! Exceeded my expectations.",
    createdAt: "2025-05-11T14:45:00.000Z",
  },
  {
    userId: "507f1f77bcf86cd799439012",
    name: "Carol Williams",
    rating: 3,
    description: "Decent product, but the packaging could be improved.",
    createdAt: "2025-05-10T09:15:00.000Z",
  },
  {
    userId: "507f191e810c19729de860eb",
    name: "David Brown",
    rating: 2,
    description: "Not as described. Had some issues with the product.",
    createdAt: "2025-05-09T16:20:00.000Z",
  },
  {
    userId: "507f1f77bcf86cd799439013",
    name: "Emma Davis",
    rating: 5,
    description: "Perfect! Will definitely buy again.",
    createdAt: "2025-05-08T12:00:00.000Z",
  },
];

// Validation schema using Yup
const schema = yup.object().shape({
  productName: yup.string().required("Product name is required"),
  actualPrice: yup
    .number()
    .required("Actual price is required")
    .positive()
    .typeError("Actual price must be a number"),
  discountedPrice: yup
    .number()
    .required("Discounted price is required")
    .positive()
    .typeError("Discounted price must be a number")
    .lessThan(
      yup.ref("actualPrice"),
      "Discounted price must be less than actual price"
    ),
  description: yup.string().required("Description is required"),
  specifications: yup.string().required("Specifications are required"),
  venueAndQuantity: yup
    .array()
    .of(
      yup.object().shape({
        venueId: yup.string().required("Venue is required"),
        quantity: yup
          .number()
          .required("Quantity is required")
          .positive()
          .integer()
          .typeError("Quantity must be a number"),
      })
    )
    .min(1, "At least one venue and quantity pair is required"),
});

const ProductDetailForm = () => {
  const { id } = useParams();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const { data, mutate, isLoading, error } = useSWR(
    `/admin/products/${id}`,
    getMerchandise
  );
  const product = data?.data?.data;

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    trigger,
    getValues,
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      venueAndQuantity: [{ venueId: "", quantity: 0 }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "venueAndQuantity",
  });

  const [imagePreviews, setImagePreviews] = useState([]);
  const { data: DATA1 } = useSWR(`admin/get-venues`, getMerchandise);

  // Map venues from API data
  const venues = DATA1?.data?.data
    ? DATA1.data.data.map((venue) => ({
        id: venue._id,
        name: venue.name,
        city: venue.city,
        state: venue.state,
        image: venue.image,
      }))
    : [];

  // Set form default values and image previews when product data is available
  useEffect(() => {
    if (product && imagePreviews.length === 0) {
      setValue("productName", product.productName);
      setValue("actualPrice", product.actualPrice);
      setValue("discountedPrice", product.discountedPrice);
      setValue("description", product.description);
      setValue("specifications", product.specification);
      setValue(
        "venueAndQuantity",
        product.venueAndQuantity.length > 0
          ? product.venueAndQuantity
          : [{ venueId: "", quantity: 0 }]
      );

      // Set initial image previews only if imagePreviews is empty
      const fetchImageUrls = async () => {
        try {
          const imageUrls = await Promise.all(
            [product.primaryImage, ...(product.thumbnails || [])]
              .filter(Boolean)
              .map(async (key) => {
                const signedUrl = await getImageClientS3URL(key);
                return { url: signedUrl, file: null, key };
              })
          );
          console.log("Initial image previews:", imageUrls);
          setImagePreviews(imageUrls);
        } catch (error) {
          console.error("Error fetching image URLs:", error);
          toast.error("Failed to load product images");
        }
      };
      fetchImageUrls();
    }
  }, [product, setValue]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;

    const files = Array.from(e.target.files);

    // Validate each file
    const validFiles: File[] = [];
    for (const file of files) {
      const validation = validateImageFile(file, 2); // 2MB limit
      if (!validation.isValid) {
        toast.error(validation.error);
        continue;
      }
      validFiles.push(file);
    }

    if (validFiles.length === 0) {
      // Reset the input
      e.target.value = '';
      return;
    }

    const newPreviews = validFiles.map((file) => ({
      file,
      url: URL.createObjectURL(file),
      key: null,
    }));
    setImagePreviews((prev) => {
      const updatedPreviews = [...prev, ...newPreviews];
      return updatedPreviews;
    });

    // Reset the input to allow selecting the same file again if needed
    e.target.value = '';
  };

  const removeImage = async (indexToRemove: number) => {
    // Get the preview to remove before updating state
    const removedPreview = imagePreviews[indexToRemove];

    // Update state first
    setImagePreviews((prev) => {
      const updatedPreviews = prev.filter(
        (_, index) => index !== indexToRemove
      );

      // Revoke object URL if it was a local file
      if (removedPreview.file) {
        URL.revokeObjectURL(removedPreview.url);
      }

      console.log("Updated imagePreviews after removal:", updatedPreviews);
      return updatedPreviews;
    });

    // Handle S3 deletion outside of state setter
    if (removedPreview.key) {
      try {
        await deleteFileFromS3(removedPreview.key);
      } catch (error) {
        console.error("Failed to delete image from S3:", error);
        toast.error("Failed to delete image from S3");
      }
    }
  };

  useEffect(() => {
    return () => {
      imagePreviews.forEach((preview) => {
        if (preview.file) {
          URL.revokeObjectURL(preview.url);
        }
      });
    };
  }, [imagePreviews]);

  const uploadImages = async (files: File[]) => {
    try {
      const timestamp = Date.now();
      const uploadedKeys = await Promise.all(
        files.map(async (file: File, index: number) => {
          const fileName = `${timestamp}-${index}-${file.name}`;
          const { signedUrl, key } = await generateSignedUrlToUploadOn(
            fileName,
            file.type
          );
          const uploadResponse = await fetch(signedUrl, {
            method: "PUT",
            body: file,
            headers: { "Content-Type": file.type },
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

  const onSubmit = async (data: any) => {
    // Validate images manually
    if (imagePreviews.length === 0) {
      toast.error("Please add at least one image");
      return;
    }

    startTransition(async () => {
      try {
        // Separate existing S3 keys and new files to upload
        const existingImageKeys = imagePreviews
          .filter((preview) => preview.key && !preview.file)
          .map((preview) => preview.key);
        const newImageFiles = imagePreviews
          .filter((preview) => preview.file)
          .map((preview) => preview.file);

        // Determine which images were removed
        const originalImageKeys = [
          product.primaryImage,
          ...(product.thumbnails || []),
        ].filter(Boolean);
        const imagesToDelete = originalImageKeys.filter(
          (key) => key && !existingImageKeys.includes(key)
        );

        // Delete removed images from S3
        await Promise.all(
          imagesToDelete.map(async (key) => {
            await deleteFileFromS3(key).catch((_) => {
              toast.error(`Failed to delete image ${key} from S3`);
            });
          })
        );

        // Upload new images to S3
        const newImageKeys =
          newImageFiles.length > 0 ? await uploadImages(newImageFiles) : [];

        // Combine existing and new image keys
        const allImageKeys = [...existingImageKeys, ...newImageKeys];

        // Create payload
        const payload = {
          productName: data.productName,
          description: data.description,
          specification: data.specifications,
          primaryImage: allImageKeys[0] || "",
          thumbnails: allImageKeys.slice(1),
          actualPrice: parseFloat(data.actualPrice),
          discountedPrice: parseFloat(data.discountedPrice),
          venueAndQuantity: data.venueAndQuantity.map((item: any) => ({
            venueId: item.venueId,
            quantity: parseInt(item.quantity),
          })),
          isActive: true,
        };

        console.log("Submitting payload to updateMerchandise:", payload);

        // Make API call to update merchandise
        const response = await updateMerchandise(`/admin/products/${id}`, payload);
        console.log("API response:", response);

        if (response.status === 200 || response.status === 201) {
          toast.success("Product updated successfully");
          mutate();
          reset();
          setImagePreviews([]);
          router.push("/authority/merchandises");
        } else {
          toast.error(`Failed to update product: ${response.statusText}`);
        }
      } catch (error) {
        console.error("Error in onSubmit:", error);
        toast.error(
          "Error updating product: " + (error.message || "Unknown error")
        );
      } finally {
        toast.dismiss();
      }
    });
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error || !product) {
    return <div>Error loading product details or product not found.</div>;
  }

  return (
    <div className="mb-[50px] h-[100vh]">
      <h2 className="text-[#10375c] text-3xl font-semibold mb-6">
        {product.productName}
      </h2>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full flex flex-col md:flex-row gap-[15px] h-fit"
      >
        <div className="w-full md:w-[35%] space-y-4 bg-[#f2f2f4] p-[15px] rounded-[20px] h-fit">
          <div className="relative bg-gray-100 rounded-lg flex flex-col items-center justify-center">
            {imagePreviews.length > 0 ? (
              <div className="w-full">
                <div className="w-full mb-2 relative aspect-square">
                  <Image
                    src={imagePreviews[0].url}
                    alt={`Preview 0`}
                    className="object-cover rounded-lg"
                    fill
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
                      <div key={index + 1} className="relative aspect-square">
                        <Image
                          src={preview.url}
                          alt={`Preview ${index + 1}`}
                          className="object-cover rounded-lg"
                          fill
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
              <div className="flex flex-col aspect-square w-full items-center justify-center bg-[#e7e7e7] rounded-[10px]">
                <div className="relative h-24 w-24">
                  <Image
                    src={NoImage}
                    alt="No image selected"
                    className="object-contain rounded-[10px]"
                    fill
                  />
                </div>
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
                onChange={handleImageChange} // Direct onChange to avoid register issues
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
                {...register("productName")}
                className="w-full h-[45.41px] px-[15px] py-2.5 bg-white rounded-[39px] text-black/60 text-xs font-medium"
                placeholder="Enter product name"
              />
              {errors.productName && (
                <p className="text-red-500 text-xs">
                  {errors.productName.message}
                </p>
              )}
            </div>

            <div className="flex flex-col gap-[10px]">
              <label className="block text-[#1b2229] text-xs font-medium">
                Actual Price
              </label>
              <input
                type="number"
                {...register("actualPrice")}
                className="w-full h-[45.41px] px-[15px] py-2.5 bg-white rounded-[39px] text-black/60 text-xs font-medium"
                placeholder="₹0"
              />
              {errors.actualPrice && (
                <p className="text-red-500 text-xs">
                  {errors.actualPrice.message}
                </p>
              )}
            </div>

            <div className="flex flex-col gap-[10px]">
              <label className="block text-[#1b2229] text-xs font-medium">
                Discounted Price
              </label>
              <input
                type="number"
                {...register("discountedPrice")}
                className="w-full h-[45.41px] px-[15px] py-2.5 bg-white rounded-[39px] text-black/60 text-xs font-medium"
                placeholder="₹0"
              />
              {errors.discountedPrice && (
                <p className="text-red-500 text-xs">
                  {errors.discountedPrice.message}
                </p>
              )}
            </div>

            <div className="flex flex-col gap-[10px] border border-[#e6e6e6] border-[2px] p-[10px] rounded-[10px]">
              <div className="flex gap-[30%]">

              <label className="block text-[#1b2229] pl-2 text-xs font-medium">
                Select Venue
              </label>
              <label className="block text-[#1b2229] text-xs font-medium">
                Quantity
              </label>
              </div>
              {fields.map((field, index) => (
                <div key={field.id} className="flex gap-[10px] items-center">
                  <select
                    {...register(`venueAndQuantity.${index}.venueId`)}
                    className="w-1/2 h-[45.41px] px-[15px] py-2.5 bg-white rounded-[39px] text-black/60 text-xs font-medium"
                  >
                    <option value="" disabled>
                      Select Venue
                    </option>
                    {venues.map((venue: any) => (
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
                      <DeleteProductIcon/>
                    </button>
                  )}
                </div>
              ))}
              {errors.venueAndQuantity && (
                <p className="text-red-500 text-xs">
                  {errors.venueAndQuantity.message}
                </p>
              )}
              {errors.venueAndQuantity?.[fields.length - 1]?.venueId && (
                <p className="text-red-500 text-xs">
                  {errors.venueAndQuantity[fields.length - 1].venueId.message}
                </p>
              )}
              {errors.venueAndQuantity?.[fields.length - 1]?.quantity && (
                <p className="text-red-500 text-xs">
                  {errors.venueAndQuantity[fields.length - 1].quantity.message}
                </p>
              )}
              <button
                type="button"
                onClick={() => append({ venueId: "", quantity: 0 })}
                className="text-[#10375c] text-sm font-medium flex items-center gap-1"
              >
                + Add More
              </button>
            </div>

            <button
              type="submit"
              className="py-4 bg-[#10375c] rounded-[28px] text-white text-sm font-medium mt-[5px] flex items-center justify-center w-full disabled:opacity-70"
              disabled={isPending}
            >
              {isPending ? (
                <>
                  <Loading />
                  <span className="ml-2">Saving...</span>
                </>
              ) : (
                "Save"
              )}
            </button>
          </div>
        </div>

        <div className="w-full md:w-[65%] flex flex-col gap-[15px]">
          <div className="w-full h-fit p-[15px] bg-[#f2f2f4] rounded-[20px] flex-col justify-start items-start gap-[30px]">
            <h3 className="text-[#10375c] text-2xl font-semibold mb-[20px]">
              Product Details
            </h3>

            <div className="flex flex-col mb-[15px]">
              <label className="text-[#1b2229] text-xs font-medium mb-[10px]">
                Description
              </label>
              <textarea
                {...register("description")}
                className="w-full px-[15px] pt-2.5 pb-[50px] bg-white rounded-[10px] text-black/60 text-xs font-medium"
                placeholder="Description here"
              ></textarea>
              {errors.description && (
                <p className="text-red-500 text-xs">
                  {errors.description.message}
                </p>
              )}
            </div>

            <div className="flex flex-col">
              <label className="text-[#1b2229] text-xs font-medium mb-[10px]">
                Specifications
              </label>
              <textarea
                {...register("specifications")}
                className="w-full px-[15px] pt-2.5 pb-[50px] bg-white rounded-[10px] text-black/60 text-xs font-medium"
                placeholder="Specifications here"
              ></textarea>
              {errors.specifications && (
                <p className="text-red-500 text-xs">
                  {errors.specifications.message}
                </p>
              )}
            </div>
          </div>

          <div className="w-full flex flex-col gap-[15px] mb-4">
            <div className="w-full p-[15px] bg-[#f2f2f4] rounded-[20px] flex flex-col overflow-y-auto overflo-custom">
              <div className="w-full text-[#10375c] text-2xl font-semibold mb-[20px]">
                Reviews
              </div>
              {reviews.length > 0 ? (
                reviews.map((review, index) => (
                  <div key={index} className="mb-[30px]">
                    <div className="flex w-full mb-[10px]">
                      <div className="w-full flex flex-col gap-[10px]">
                        <div className="text-[#1b2229] text-sm font-medium">
                          {review.name}
                        </div>
                        <Rating
                          name="read-only"
                          value={review.rating}
                          readOnly
                        />
                      </div>
                    </div>
                    <div className="w-full text-black/60 text-sm font-medium leading-tight">
                      {review.description}
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-black/60 text-sm">
                  No reviews available.
                </div>
              )}
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default ProductDetailForm;