"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import Human from "@/assets/images/Human.png";
import { EyeIcon, DownArrowIcon, UpArrowIcon } from "@/utils/svgicons";
import ProductImage from "@/assets/images/default-product.jpg";
import SearchBar from "../SearchBar";
import TablePagination from "../TablePagination";
import { useRouter } from "next/navigation";
import useSWR from "swr";
import { getAllMerchandise } from "@/services/admin-services";
import { getImageClientS3URL } from "@/config/axios";

// Placeholder for fetching venue data (replace with actual API call if available)
const fetchVenues = async () => {
  // Mock venue data; replace with actual API call if available
  return [
    { _id: "venue1", name: "Aute quos ut et et a" },
    { _id: "venue2", name: "Necessitatibus ipsum" },
    { _id: "venue3", name: "Consequuntur aut" },
  ];
};

export default function InventoryComponent() {
  const router = useRouter();
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [searchParams, setSearchParams] = useState("");
  const [page, setPage] = useState(1);
  const itemsPerPage = 11;

  const { data, isLoading } = useSWR(
    `/admin/products?page=${page}&limit=${itemsPerPage}&search=${searchParams}`,
    getAllMerchandise
  );

  const inventoryData = data?.data?.data || [];
  const totalData = data?.data?.meta?.total || 0;

  // Fetch venue data (mocked for now; replace with actual API call)
  const { data: venueData } = useSWR("admin/get-venues", fetchVenues);
  const venues = venueData || [];

  // Set the first product as the default selection when data loads
  useEffect(() => {
    if (inventoryData.length > 0 && !selectedProduct) {
      setSelectedProduct(inventoryData[0]);
    } else if (inventoryData.length === 0) {
      setSelectedProduct(null); // Reset if no data is available
    } else if (
      selectedProduct &&
      !inventoryData.find((product) => product._id === selectedProduct._id)
    ) {
      // If the selected product is no longer in the list, select the first one
      setSelectedProduct(inventoryData[0]);
    }
  }, [inventoryData, selectedProduct]);

  // Reset page to 1 when searchParams changes
  useEffect(() => {
    setPage(1);
  }, [searchParams]);

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  const handleClick = () => {
    if (selectedProduct) {
      router.push(`/admin/merchandises/${selectedProduct._id}`);
    }
  };

  return (
    <>
      <div className="flex w-full lg:w-2/3 justify-between mb-[15px]"></div>
      <div className="flex flex-col lg:flex-row w-full rounded-[20px] gap-6 mb-[40px]">
        {/* Left Panel: Product List */}
        <div
          className={`w-full  h-fit ${inventoryData.length > 0 ? "lg:w-2/3" : "lg:w-full"
            } bg-[#f2f2f4] shadow-md rounded-[20px] p-[14px] overflow-auto`}
        >
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-[#10375c] text-xl font-semibold">Inventory</h2>
            <SearchBar setQuery={setSearchParams} query={searchParams} />
          </div>
          <div className="overflow-x-auto overflo-custom max-w-full">
            <div className="w-full min-w-[600px] rounded-[10px] bg-[#f2f2f4] flex text-sm font-semibold text-[#7e7e8a]">
              <div className="w-[45%] h-3.5 text-[#7e7e8a] text-xs font-medium">
                Name Of Product
              </div>
              <div className="w-[20%] h-3.5 text-[#7e7e8a] text-center text-xs font-medium">
                Discounted Price
              </div>
              <div className="w-[15%] h-3.5 text-[#7e7e8a] text-center text-xs font-medium">
                Actual Price
              </div>
              <div className="w-[21%] h-3.5 text-[#7e7e8a] text-xs text-center font-medium">
                Sold This Month
              </div>
              <div className="w-[11%] h-3.5 text-[#7e7e8a] text-center text-xs font-medium">
                Action
              </div>
            </div>
            <div className="w-full h-[0px] border border-[#d0d0d0] border-dotted mt-[8px]"></div>
            <div className="w-full min-w-[600px]">
              {isLoading ? (
                <p className="text-center text-[#10375C] py-4">Loading...</p>
              ) : inventoryData.length === 0 ? (
                <p className="text-center text-[#10375C] py-4">
                  No data found.
                </p>
              ) : (
                inventoryData.map((product, index) => (
                  <div
                    key={product._id}
                    className={`cursor-pointer flex items-center h-[47px] px-3.5 py-3 rounded-[10px] ${selectedProduct?._id === product._id
                        ? "bg-[#176dbf] text-white"
                        : index % 2 === 0
                          ? "bg-[#f2f2f4]"
                          : "bg-white"
                      }`}
                    onClick={() => setSelectedProduct(product)}
                  >
                    <div
                      className={`w-[45%] flex items-center gap-2 break-words text-[#1b2229] text-xs font-medium ${selectedProduct?._id === product._id
                          ? "text-white"
                          : "text-[#1b2229]"
                        }`}
                    >
                      <Image
                        src={getImageClientS3URL(product.primaryImage)}
                        alt="Avatar"
                        className="rounded-full"
                        width={25}
                        height={25}
                      />
                      {product.productName}
                    </div>
                    <div
                      className={`w-[20%] text-[#1b2229] text-xs text-center font-medium ${selectedProduct?._id === product._id
                          ? "text-white"
                          : "text-[#1b2229]"
                        }`}
                    >
                      ₹{product.discountedPrice}
                    </div>
                    <div
                      className={`w-[15%] text-[#1b2229] text-center text-xs font-medium ${selectedProduct?._id === product._id
                          ? "text-white"
                          : "text-[#1b2229]"
                        }`}
                    >
                      ₹{product.actualPrice}
                    </div>
                    <div
                      className={`w-[20%] text-[#1b2229] text-center flex-wrap text-xs font-medium ${selectedProduct?._id === product._id
                          ? "text-white"
                          : "text-[#1b2229]"
                        }`}
                    >
                      {product.soldThisMonth || 0} items
                    </div>
                    <div className="w-[10%] text-[#1b2229] text-xs font-medium flex justify-center">
                      <EyeIcon
                        stroke={
                          selectedProduct?._id === product._id
                            ? "#FFFF"
                            : "#fd5602"
                        }
                      />
                    </div>
                  </div>
                ))
              )}
            </div>
            {/* Pagination */}
            {totalData !== 0 && (
              <div className="mt-4 flex justify-end gap-2">
                <TablePagination
                  setPage={handlePageChange}
                  page={page}
                  totalData={totalData}
                  itemsPerPage={itemsPerPage}
                />
              </div>
            )}
          </div>
        </div>

        {/* Right Panel: Product Details (Hidden if no data) */}
        {inventoryData.length > 0 && (
          <div className="flex flex-col w-full lg:w-1/3 gap-[24px] h-full justify-between">
            <div className="bg-[#f2f2f4] shadow-md rounded-[20px] relative">
              {selectedProduct ? (
                <div className="w-full bg-[#f2f2f4] rounded-[20px] min-h-full">
                  {/* Blue Header with Wave */}
                  <div className="relative w-full">
                    <svg
                      width="100%"
                      height="100%"
                      viewBox="0 0 471 165"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M0 20 Q0 0 20 0 H451 Q471 0 471 20 V155.046 C471 155.046 372.679 132.651 235.5 155.046 C98.3213 177.442 0 155.046 0 155.046 Z"
                        fill="#176dbf"
                      />
                    </svg>
                    <div className="absolute top-0 left-0 w-full h-full flex gap-[25px] items-center p-2 pl-[20px] text-white">
                      {/* <Image
                        src={getImageClientS3URL(selectedProduct.primaryImage)}
                        alt="Product Image"
                        className="rounded-full border-2 border-white w-100 h-100"
                        height={81}
                        width={81}
                      /> */}
                      <div className="w-[81px] h-[81px] rounded-full border-2 border-white overflow-hidden">
                        <Image
                          src={getImageClientS3URL(selectedProduct.primaryImage)}
                          alt="Product Image"
                          width={81}
                          height={81}
                          className="object-cover w-full h-full"
                        />
                      </div>

                      <div>
                        <div className="text-white text:2xl md:text-3xl font-bold leading-10 tracking-wide">
                          {selectedProduct.productName}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Content Section */}
                  <div className="flex flex-col w-full mt-[27px] gap-[20px] relative z-20">
                    {/* Product Details */}
                    <div className="w-[85%] ml-[30px] flex-col justify-start items-start gap-3 inline-flex">
                      <div className="self-stretch text-[#1c2329] text-sm font-semibold leading-[16.80px]">
                        Product Details
                      </div>
                      <div className="self-stretch justify-between items-center inline-flex">
                        <div className="flex-col justify-start items-start gap-2.5 inline-flex">
                          <div className="text-[#7e7e8a] text-xs font-medium capitalize leading-[15px]">
                            Name
                          </div>
                          <div className="text-[#7e7e8a] text-xs font-medium capitalize leading-[15px]">
                            Discounted Price
                          </div>
                          <div className="text-[#7e7e8a] text-xs font-medium capitalize leading-[15px]">
                            Actual Price
                          </div>
                          <div className="text-[#7e7e8a] text-xs font-medium capitalize leading-[15px]">
                            Total Quantity
                          </div>
                        </div>
                        <div className="flex-col justify-start items-end gap-2.5 inline-flex">
                          <div className="text-right text-[#1b2229] text-xs font-bold capitalize leading-[15px]">
                            {selectedProduct.productName}
                          </div>
                          <div className="text-right text-[#1b2229] text-xs font-bold leading-[15px]">
                            ₹{selectedProduct.discountedPrice}
                          </div>
                          <div className="text-right text-[#1b2229] text-xs font-bold capitalize leading-[15px]">
                            ₹{selectedProduct.actualPrice}
                          </div>
                          <div className="text-right text-[#1b2229] text-xs font-bold capitalize leading-[15px]">
                            {selectedProduct.venueAndQuantity?.reduce(
                              (total, item) => total + (item.quantity || 0),
                              0
                            )}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Venue and Quantity */}
                    {/* <div className="w-[85%] ml-[30px] flex-col justify-start items-start gap-3 inline-flex">
                      <div className="text-[#1c2329] text-sm font-semibold leading-[16.80px]">
                        Venue & Quantity
                      </div>
                      {selectedProduct.venueAndQuantity?.length > 0 ? (
                        selectedProduct.venueAndQuantity.map((vq, index) => {
                          const venue = venues.find((v) => v._id === vq.venueId);
                          return (
                            <div
                              key={index}
                              className="flex w-full justify-between items-center "
                            >
                              <div>

                              <div className="text-[#7e7e8a] text-xs font-medium capitalize leading-[15px]">
                                {venue ? venue.name : `${vq.venueName}`}
                              </div>
                              <div className="text-right text-[#1b2229] text-xs font-bold capitalize leading-[15px]">
                                {vq.quantity} items
                              </div>
                              </div>
                            </div>
                          );
                        })
                      ) : (
                        <div className="text-[#7e7e8a] text-xs font-medium leading-[15px]">
                          No venues assigned
                        </div>
                      )}
                    </div> */}
                    <div className="w-[85%] ml-[30px] flex-col justify-start items-start gap-3 inline-flex">
                      {/* <div className="text-[#1c2329] text-sm font-semibold leading-[16.80px]">
                        Venue & Quantity
                      </div> */}
                      {selectedProduct.venueAndQuantity?.length > 0 ? (
                        <div className="grid grid-cols-2 gap-2 w-full">
                          {selectedProduct.venueAndQuantity.map((vq, index) => {
                            const venue = venues?.find(
                              (v) => v._id === vq.venueId
                            );
                            return (
                              <div
                                key={index}
                                className="bg-white p-3 rounded-md"
                              >
                                <div className="self-stretch mb-[10px] text-center justify-center text-Primary-Font text-base font-bold capitalize leading-tigh">
                                  {vq.quantity}
                                </div>
                                <div className="text-center justify-center mb-[6px] text-[#7F7F8A] text-xs font-semibold capitalize leading-none">
                                  {venue ? venue.name : `${vq.venueName}`}
                                </div>
                                <div className="text-center justify-center text-[#176DBF] text-[10px] font-normal capitalize leading-3">
                                  Add more
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      ) : (
                        <div className="text-[#7e7e8a] text-xs font-medium leading-[15px]">
                          No venues assigned
                        </div>
                      )}
                    </div>
                    {/* Description */}
                    <div className="w-[85%] ml-[30px] flex-col justify-start items-start gap-3 inline-flex">
                      <div className="text-[#1c2329] text-sm font-semibold leading-[16.80px]">
                        Description
                      </div>
                      <div className="text-black/60 text-[10px] font-medium leading-[18px]">
                        {selectedProduct.description ||
                          "No description available."}
                      </div>
                    </div>

                    {/* Specifications */}
                    <div className="w-[85%] ml-[30px] flex-col justify-start items-start gap-3 inline-flex mb-[30px]">
                      <div className="text-[#1c2329] text-sm font-semibold leading-[16.80px]">
                        Specifications
                      </div>
                      <div className="text-black/60 text-[10px] font-medium leading-[18px]">
                        {selectedProduct.specification ||
                          "No specifications available."}
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <p className="text-center text-gray-500">
                  Select a product to see details
                </p>
              )}
            </div>
            <button
              onClick={handleClick}
              className="h-12 py-4 bg-[#10375c] rounded-[28px] justify-center items-center text-white text-sm font-medium"
            >
              Edit Product
            </button>
          </div>
        )}
      </div>
    </>
  );
}
