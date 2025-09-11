"use client";
import {
  DeleteProductIcon,
  DownArrowIcon,
  UpArrowIcon,
  WhiteDownArrow,
  Loading
} from "@/utils/svgicons";
import React, { useState, useEffect, useRef, useTransition } from "react";
import Image from "next/image";
import DeleteConfirmationModal from "../components/common/DeleteConfirmationModal";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from "@mui/material";
import {
  createInventory,
  getAllMerchandise,
  updateInventory,
  deleteInventory,
} from "@/services/admin-services";
import useSWR from "swr";
import { useForm, useFieldArray } from "react-hook-form";
import { toast } from "sonner";
import shuttle from "@/assets/images/shuttle.png";
import TablePagination from "../components/TablePagination";
import { useSession } from "next-auth/react";

const Page = () => {
  const [openEditStock, setOpenEditStock] = useState(false);
  const [openAddToStock, setOpenAddToStock] = useState(false);
  const [openNewItem, setOpenNewItem] = useState(false);
  const [selectedItemIndex, setSelectedItemIndex] = useState(null);
  const [tempQuantity, setTempQuantity] = useState(0);
  const [selectedVenue, setSelectedVenue] = useState("");
  const [venueDropdown, setVenueDropdown] = useState(false);
  const venueDropdownRef = useRef<HTMLDivElement>(null);
   const [page, setPage] = useState(1);
  const itemsPerPage = 6;
  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };
  // Delete confirmation modal state
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);

  // useTransition hooks for loading states
  const [editStockPending, startEditStockTransition] = useTransition();
  const [addStockPending, startAddStockTransition] = useTransition();
  const [newItemPending, startNewItemTransition] = useTransition();
  const [deletePending, startDeleteTransition] = useTransition();
    const { data: session } = useSession();
  const userRole = (session as any )?.user?.role; 
  const apiRoute = selectedVenue
  ? `/admin/inventory?venueId=${selectedVenue}&page=${page}&limit=${itemsPerPage}`
  : `/admin/inventory?page=${page}&limit=${itemsPerPage}`;

  const { data, isLoading, mutate } = useSWR(apiRoute, getAllMerchandise);

  const total = data?.data?.meta?.total || 0;

useEffect(() => {
  if (userRole === "employee" && (session as any)?.user?.venueId) {
    setSelectedVenue((session as any)?.user?.venueId);
  }
}, [userRole, session]);
  // Extract venues from data using useMemo to prevent unnecessary recalculations
  const venues = React.useMemo(() => {
    return data?.data?.data?.venues || [];
  }, [data]);
  const [inventoryItems, setInventoryItems] = useState([]);

  // Update inventory items when data changes
  useEffect(() => {
    if (data?.data?.data?.inventory) {
      const inventoryData = data.data.data.inventory;
      setInventoryItems(
        inventoryData.map((item) => ({
          id: item._id,
          name: item.productName,
          stockInUse: item.isUse,
          freshStock: item.inStock,
        }))
      );
    }
  }, [data]);

  // Click outside to close venue dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (venueDropdownRef.current && !venueDropdownRef.current.contains(event.target as Node)) {
        setVenueDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Find the selected venue's name for display - using useMemo to prevent unnecessary recalculations
  const selectedVenueName = React.useMemo(() => {
    return selectedVenue
      ? venues.find((venue) => venue._id === selectedVenue)?.name || "Venue"
      : "Venue";
  }, [selectedVenue, venues]);

  const openEditDialog = (index) => {
    setSelectedItemIndex(index);
    setTempQuantity(inventoryItems[index].stockInUse);
    setOpenEditStock(true);
  };

  const openAddDialog = (index) => {
    setSelectedItemIndex(index);
    setTempQuantity(inventoryItems[index].freshStock);
    setOpenAddToStock(true);
  };

  const handleIncrease = () => {
    setTempQuantity((prev) => prev + 1);
  };

  const handleDecrease = () => {
    setTempQuantity((prev) => Math.max(prev - 1, 0));
  };

  const handleUpdateStock = async (index, type) => {
    const item = inventoryItems[index];
    const payload = {
      inventoryId: item.id,
      type: type === "stockInUse" ? "inUse" : "inStock",
      quantity: tempQuantity,
    };

    const transitionFunction = type === "stockInUse" ? startEditStockTransition : startAddStockTransition;

    transitionFunction(async () => {
      try {
        const response = await updateInventory("/admin/inventory", payload);

        if (response.status === 200 || response.status === 201) {
          toast.success("Stock updated successfully");
          setInventoryItems((prevItems) =>
            prevItems.map((item, i) =>
              i === index ? { ...item, [type]: tempQuantity } : item
            )
          );
          mutate();
          if (type === "stockInUse") {
            setOpenEditStock(false);
          } else {
            setOpenAddToStock(false);
          }
        } else {
          toast.error("Failed to update stock");
        }
      } catch (error) {
        console.error("Error updating stock:", error?.response?.data?.message);
        toast.error(error?.response?.data?.message);
      }
    });
  };

  const defaultFormValues = {
    productName: "",
    items: [{ venueId: "", quantity: 0 }],
  };

  const { register, control, handleSubmit, reset, watch } = useForm({
    defaultValues: defaultFormValues,
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "items",
  });

  const onSubmit = async (formData) => {
    const payload = formData.items.map((item) => ({
      venueId: item.venueId,
      productName: formData.productName,
      inStock: Number(item.quantity),
    }));

    startNewItemTransition(async () => {
      try {
        const response = await createInventory("/admin/inventory", payload);

        if (response.status === 200 || response.status === 201) {
          toast.success("Inventory created successfully");
          const newItems = payload.map((item, index) => ({
            id: `new-${inventoryItems.length + index}`,
            name: item.productName,
            stockInUse: 0,
            freshStock: item.inStock,
          }));
          setInventoryItems((prev) => [...prev, ...newItems]);
          setOpenNewItem(false);
          reset(defaultFormValues);
          mutate();
        } else {
          toast.error("Failed to add new item");
        }
      } catch (error) {
        console.error("Error adding new item:", error);
        toast.error("An error occurred while adding the new item");
      }
    });
  };

  const handleCloseNewItemDialog = () => {
    setOpenNewItem(false);
    reset(defaultFormValues);
  };

  // Open delete confirmation modal
  const openDeleteModal = (item) => {
    setItemToDelete(item);
    setIsDeleteModalOpen(true);
  };

  // Handle delete confirmation
  const handleDeleteItem = async () => {
    if (!itemToDelete) return;
    console.log('itemToDelete: ', itemToDelete);

    startDeleteTransition(async () => {
      try {
        const response = await deleteInventory(`/admin/inventory?id=${itemToDelete.id}`);

        if (response.status === 200 || response.status === 204) {
          // Remove the item from the local state
          setInventoryItems(prevItems =>
            prevItems.filter(item => item.id !== itemToDelete.id)
          );

          // Show success message
          toast.success("Item removed successfully");

          // Refresh data
          mutate();
        } else {
          toast.error("Failed to remove item");
        }
      } catch (error) {
        console.error("Error removing item:", error);
        toast.error("An error occurred while removing the item");
      }

      // Close modal and reset state
      setIsDeleteModalOpen(false);
      setItemToDelete(null);
    });
  };

  return (
    <>
      <style jsx>{`
        .venue-dropdown {
          position: relative;
          margin-right: 15px;
        }
        .venue-button {
          display: flex;
          align-items: center;
          height: 40px;
          padding: 0 20px;
          background-color: #1b2229;
          color: white;
          border-radius: 28px;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
        }
        .venue-button svg {
          margin-left: 8px;
        }
        .venue-options {
          position: absolute;
          top: 48px;
          left: 0;
          z-index: 50;
          display: flex;
          flex-direction: column;
          gap: 5px;
          padding: 15px;
          background-color: white;
          border-radius: 10px;
          box-shadow: 0px 4px 20px rgba(92, 138, 255, 0.1);
        }
        .venue-option {
          display: flex;
          align-items: center;
          gap: 10px;
          color: #1b2229;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
        }
        .venue-option input[type="radio"] {
          accent-color: #1b2229;
          width: 16px;
          maxHeight: 25px;
          minHeight: 25px;
          cursor: pointer;
        }
        .loading-spinner {
          display: flex;
          justify-content: center;
          align-items: center;
          margin-top: 32px;
        }
        .spinner {
          width: 48px;
          height: 48px;
          border: 4px solid #e6e6e6;
          border-top: 4px solid #10375c;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }
        @keyframes spin {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }
        .no-data {
          display: flex;
          justify-content: center;
          align-items: center;
          margin-top: 32px;
          color: #10375c;
          font-size: 18px;
          font-weight: 500;
        }
      `}</style>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
        <div className="justify-start text-[#10375c] text-3xl font-semibold">
          Inventory
        </div>
        <div className="flex  mt-4 md:mt-0">
          {/* Venue Filter Dropdown */}
          {userRole !== "employee" &&
          <div className="venue-dropdown" ref={venueDropdownRef}>
            <button
              className="venue-button h-full"
              onClick={() => setVenueDropdown(!venueDropdown)}
            >
              {selectedVenueName}
              <span>
                {!venueDropdown ? <DownArrowIcon /> : <UpArrowIcon />}
              </span>
            </button>
            {venueDropdown && (
              <div className="venue-options space-y-2 w-[220px] min-h-[100px] max-h-[300px] overflow-y-auto overflo-custom">
                <label className="venue-option ">
                  <input
                    type="radio"
                    name="venue"
                    value=""
                    checked={selectedVenue === ""}
                    onChange={() => {
                      setSelectedVenue("");
                      setVenueDropdown(false);
                      setPage(1); // Reset to first page when changing venue filter
                    }}
                  />
                  All Venues
                </label>
                {venues.map((venue) => (
                  <label key={venue._id} className="venue-option ">
                    <input
                      type="radio"
                      name="venue"
                      value={venue._id}
                      checked={selectedVenue === venue._id}
                      onChange={() => {
                        setSelectedVenue(venue._id);
                        setVenueDropdown(false);
                        setPage(1); // Reset to first page when changing venue filter
                      }}
                    />
                    {venue.name}
                  </label>
                ))}
              </div>
            )}
          </div>
          }
          <div className="px-5 py-2 bg-[#1b2229] rounded-[28px] flex justify-center items-center gap-[5px]">
            <div
              onClick={() => setOpenNewItem(true)}
              className="justify-start cursor-pointer text-white text-sm font-medium"
            >
              Add A New Item
            </div>
          </div>
        </div>
      </div>

      {/* Loading and No Data States */}
      {isLoading ? (
        <div className="loading-spinner">
          <div className="spinner"></div>
        </div>
      ) : inventoryItems.length === 0 ? (
        <div className="no-data">
          <p>No Data Found</p>
        </div>
      ) : (
        <div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
          {inventoryItems.map((item, index) => (
            <div key={item.id} className="p-5 bg-white rounded-2xl shadow-md">
              <div className="flex justify-between items-center mb-2.5">
                <div className="text-[#10375c] text-xl md:text-2xl font-semibold">
                  {item.name}
                </div>
                <button
                  onClick={() => openDeleteModal(item)}
                  className="border border-red-500 text-red-500 text-sm font-medium rounded-full px-4 py-1 hover:bg-red-50 transition-colors"
                >
                  Remove
                </button>
              </div>

              <div className="flex flex-col justify-center sm:flex-row gap-5 sm:gap-8 md:gap-16">
                <div className="flex flex-col items-center">
                  <div className="text-[#10375c] text-3xl md:text-[40px] font-semibold mb-1.5">
                    {item.stockInUse}
                  </div>
                  <div className="text-[#1b2229] text-xs font-medium mb-3">
                    Stock In Use
                  </div>
                  <button
                    onClick={() => openEditDialog(index)}
                    className="px-6 sm:px-8 md:px-12 py-2.5 bg-[#10375c] rounded-full text-white text-[10px] font-medium hover:bg-opacity-90 transition-colors uppercase"
                  >
                    Edit Stock
                  </button>
                </div>

                <div className="flex flex-col items-center">
                  <div className="text-[#10375c] text-3xl md:text-[40px] font-semibold mb-1.5">
                    {item.freshStock}
                  </div>
                  <div className="text-[#1b2229] text-xs font-medium mb-3">
                    Fresh Stock
                  </div>
                  <button
                    onClick={() => openAddDialog(index)}
                    className="px-6 sm:px-8 md:px-12 py-2.5 bg-[#10375c] rounded-full text-white text-[10px] font-medium hover:bg-opacity-90 transition-colors uppercase"
                  >
                    Add To Stock
                  </button>
                </div>
              </div>
            </div>
          ))}
              </div>
          {/* Pagination */}
          {inventoryItems.length !== 0 && (


            <div className="mt-4 flex justify-end gap-2">
              <TablePagination
                setPage={handlePageChange}
                page={page}
                totalData={total}
                itemsPerPage={itemsPerPage}
                // totalPages={totalPages} // Removed as it's not part of TablePaginationProps
                // hasNextPage={hasNextPage}
                // hasPreviousPage={hasPreviousPage}
              />
        </div>
          )}
        </div>
      )}
       <Dialog
        open={openEditStock}
        // onClose={() => setOpenEditStock(false)}
        fullWidth
        maxWidth="sm"
        PaperProps={{
          style: { borderRadius: "30px" , padding: "20px",backgroundColor: "#f2f2f4" },
        }}
      >
        <div className="bg-[#f2f2f4] rounded-2xl">
          <DialogTitle className="text-center text-[#10375C] text-3xl font-bold  leading-10 ">
            Edit Stock In Use
          </DialogTitle>
          <DialogContent className="p-0">
            {selectedItemIndex !== null && (
              <div className="flex flex-col sm:flex-row justify-between gap-4 sm:gap-6 mb-1">
                <div className="flex-1">
                  <label className="block text-[#1C2329] text-xs sm:text-sm font-medium mb-2">
                    Name of The Item
                  </label>
                  <div className="w-full flex items-center bg-neutral-300 rounded-[39px] px-4  ">
                    <span className="text-black/60 text-xs  px-3.5 py-2.5 sm:text-sm font-medium">
                      {inventoryItems[selectedItemIndex].name}
                    </span>
                  </div>
                </div>
                <div className="flex-1">
                  <label className="block text-[#1C2329] text-xs sm:text-sm font-medium mb-2">
                    Quantity
                  </label>
                  <div className="flex items-center justify-between bg-white rounded-full  px-3.5 py-1.5 shadow">
                    <Image
                      src="/-.svg"
                      alt="Minus Icon"
                      width={16}
                      height={16}
                      className="w-4 h-4 cursor-pointer"
                      onClick={handleDecrease}
                    />
                    <span className="text-black/60 text-lg sm:text-xl font-medium">
                      {tempQuantity}
                    </span>
                    <Image
                      src="/+.svg"
                      alt="Plus Icon"
                      width={16}
                      height={16}
                      className="w-4 h-4 cursor-pointer"
                      onClick={handleIncrease}
                    />
                  </div>
                </div>
              </div>
            )}
          </DialogContent>
          <DialogActions className="p-0 flex justify-between w-full  mb-2">
            <Button
              variant="outlined"
              onClick={() => {
                setSelectedItemIndex(null);
                setTempQuantity(0);
                setOpenEditStock(false);
              }}
              style={{
                textTransform: "none",
                borderColor: "#10375c",
                color: "#10375c",
                borderRadius: "28px",
                padding: "12px 24px",
                width: "50%",
              }}
              className="text-sm sm:text-base font-medium rounded-[28px]"
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              onClick={() => handleUpdateStock(selectedItemIndex, "stockInUse")}
              disabled={editStockPending}
              style={{
                textTransform: "none",
                backgroundColor: "#10375c",
                color: "#fff",
                borderRadius: "28px",
                padding: "12px 24px",
                width: "100%",

              }}
              className="text-white text-sm sm:text-base font-medium bg-[#10375c] rounded-[28px]"
            >
              {editStockPending ? (
                           <Loading />
                         ) : null}
              {editStockPending ? "Updating..." : "Update Details"}
            </Button>
          </DialogActions>
        </div>
      </Dialog>
 <Dialog
        open={openAddToStock}
        // onClose={() => setOpenAddToStock(false)}
        fullWidth
        maxWidth="sm"
        PaperProps={{
           style: { borderRadius: "30px" , padding: "20px",backgroundColor: "#f2f2f4" },
        }}
      >
        <div className=" bg-[#f2f2f4] rounded-2xl">
          <DialogTitle className="text-center text-[#10375c] text-[22px] sm:text-[28px] font-extrabold">
            Add To Stock
          </DialogTitle>
          <DialogContent className="p-0">
            {selectedItemIndex !== null && (
              <div className="flex flex-col sm:flex-row justify-between gap-4 sm:gap-6 mb-2 ">
                <div className="flex-1">
                  <label className="block text-[#1C2329] text-xs sm:text-sm font-medium mb-2">
                    Name of The Item
                  </label>
                  <div className="w-full flex items-center bg-neutral-300 rounded-[39px] ">
                    <span className="text-black/60 text-xs  px-3.5 py-2.5 sm:text-sm font-medium">
                      {inventoryItems[selectedItemIndex].name}
                    </span>
                  </div>
                </div>
                <div className="flex-1">
                  <label className="block text-[#1C2329] text-xs sm:text-sm font-medium mb-2">
                    Quantity
                  </label>
                  <div className="flex items-center justify-between bg-white rounded-full px-4 py-1.5  shadow">
                    <Image
                      src="/-.svg"
                      alt="Minus Icon"
                      width={16}
                      height={16}
                      className="w-4 h-4 cursor-pointer"
                      onClick={handleDecrease}
                    />
                    <span className="text-black/60 text-lg sm:text-xl font-medium">
                      {tempQuantity}
                    </span>
                    <Image
                      src="/+.svg"
                      alt="Plus Icon"
                      width={16}
                      height={16}
                      className="w-4 h-4 cursor-pointer"
                      onClick={handleIncrease}
                    />
                  </div>
                </div>
              </div>
            )}
          </DialogContent>
          <DialogActions className="p-0 flex justify-between gap-2 w-full">
            <Button
              variant="outlined"
              onClick={() => {
                setSelectedItemIndex(null);
                setTempQuantity(0);
                setOpenAddToStock(false);
              }}
              style={{
                textTransform: "none",
                borderColor: "#10375c",
                color: "#10375c",
                borderRadius: "28px",
                padding: "12px 24px",
                width: "50%",
              }}
              className="text-sm sm:text-base font-medium rounded-[28px]"
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              onClick={() => handleUpdateStock(selectedItemIndex, "freshStock")}
              disabled={addStockPending}
              style={{
                textTransform: "none",
                backgroundColor: "#10375c",
                color: "#fff",
                borderRadius: "28px",
                padding: "12px 24px",
                width: "100%",
              }}
              className="text-white text-sm sm:text-base font-medium bg-[#10375c] rounded-[28px]"
            >
                 {addStockPending ? (
                           <Loading />
                         ) : null}
                          {addStockPending ? "Updating..." : "Update Details"}
            </Button>
          </DialogActions>
        </div>
      </Dialog>



<Dialog
  open={openNewItem}
  fullWidth
  maxWidth="sm"
  PaperProps={{
    style: { borderRadius: '30px',height:"auto" }
  }}
  // Prevent the dialog from having a scrollbar
  sx={{ '& .MuiDialog-paper': { overflowY: 'hidden' } }}
>
  <div className="relative bg-[#f2f2f4] rounded-2xl">
    <div className="flex justify-center">
      <div className="bg-zinc-100 flex items-center justify-center py-2">
        <Image
          src={shuttle}
          alt="shuttle image"
          height={138}
          width={136}
        />
      </div>
    </div>
    <DialogTitle className="text-center text-[#10375c] text-[22px] sm:text-[28px] font-extrabold mb-[30px] sm:mb-[30px]">
      Add New Item
    </DialogTitle>
    <DialogContent className="p-0" sx={{ overflowY: 'hidden' }}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="flex flex-col gap-6 mb-2">
          <div className="flex-1">
            <label className="block text-[#1b2229] text-xs sm:text-sm font-medium mb-2">
              Name of The Item
            </label>
            <input
              {...register("productName", { required: true })}
              className="w-full bg-white rounded-[10px] px-4 py-2 sm:py-3 text-black/60 text-xs sm:text-sm font-medium border-none outline-none"
              placeholder="Name of the Item"
            />
          </div>
          <div className={`border border-[#e6e6e6] border-[2px] p-[16px] rounded-[10px] ${userRole=== "employee" ? "h-fit":"h-[26vh]"} overflow-y-auto`}>
            {fields.map((field, index) => (
              <div key={field.id} className="flex gap-4 mb-[10px] h-20">
                <div className="flex-1">
                  <label className="block text-[#1C2329] text-xs sm:text-sm font-medium mb-2">
                    Select Venue
                  </label>
                  <div className="relative">
                    {/* <select
                      {...register(`items.${index}.venueId`, {
                        required: true,
                      })}
                      className="w-full bg-white rounded-[10px] px-4 py-2 sm:py-3 text-black/60 text-xs sm:text-sm font-medium border-none outline-none appearance-none"
                    >
                      <option value="" disabled>
                        Select
                      </option>
                      {venues.map((venue) => (
                        <option key={venue._id} value={venue._id}>
                          {venue.name}
                        </option>
                      ))}
                    </select> */}
                    <select
                      {...register(`items.${index}.venueId`, {
                        required: true,
                      })}
                      className="w-full bg-white rounded-[10px] px-4 py-2 sm:py-3 text-black/60 text-xs sm:text-sm font-medium border-none outline-none appearance-none"
                    >
                      <option value="" disabled>
                        Select
                      </option>
                      {
                        // Filter venues based on userRole
                        userRole === "employee" && (session as any)?.user?.venueId
                          ? venues
                              .filter((venue) => venue._id === (session as any)?.user?.venueId)
                              .map((venue) => (
                                <option key={venue._id} value={venue._id}>
                                  {venue.name}
                                </option>
                              ))
                          : venues.map((venue) => (
                              <option key={venue._id} value={venue._id}>
                                {venue.name}
                              </option>
                            ))
                      }
                    </select>
                    <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                      <svg
                        className="w-4 h-4 text-gray-500"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M19 9l-7 7-7-7"
                        ></path>
                      </svg>
                    </div>
                  </div>
                </div>
                <div className="flex-1">
                  <label className="block text-[#1C2329] text-xs sm:text-sm font-medium mb-2">
                    Quantity
                  </label>
                  <input
                    type="number"
                    {...register(`items.${index}.quantity`, {
                      required: true,
                      min: 0,
                      valueAsNumber: true,
                    })}
                    className="w-full bg-white rounded-[10px] px-4 py-2 sm:py-3 text-black/60 text-xs sm:text-sm font-medium border-none outline-none"
                    placeholder="0"
                    onChange={(e) => {
                      const value = Number(e.target.value);
                      if (value < 0) {
                        e.target.value = "0";
                      }
                    }}
                  />
                </div>
                {fields.length > 1 && (
                  <button
                    type="button"
                    onClick={() => remove(index)}
                    className="text-red-500 text-sm font-medium mt-6"
                  >
                    <DeleteProductIcon />
                  </button>
                )}
              </div>
            ))}
            {userRole !== "employee" && 
            <div className="flex justify-start">
              <button
                type="button"
                onClick={() => append({ venueId: "", quantity: 0 })}
                className="text-[#10375C] text-sm font-medium flex items-center gap-1"
              >
                <span className="text-lg text-[#10375C]">+</span> Add More
              </button>
            </div>
}
          </div>
        </div>
        <DialogActions className="p-0 flex justify-between gap-4 w-full">
          <Button
            type="button"
            fullWidth
            variant="outlined"
            onClick={handleCloseNewItemDialog}
            style={{
              textTransform: "none",
              borderColor: "#10375c",
              color: "#10375c",
              borderRadius: "28px",
              padding: "12px 24px",
              width: "100%",
            }}
            className="w-full sm:w-auto text-sm sm:text-base font-medium rounded-[28px]"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            disabled={newItemPending}
            style={{
              textTransform: "none",
              backgroundColor: "#10375c",
              color: "#fff",
              borderRadius: "28px",
              padding: "12px 24px",
              width: "100%",
            }}
            className="w-full sm:w-auto text-sm sm:text-base font-medium rounded-[28px]"
          >
            {newItemPending ? "Creating..." : "Update Details"}
          </Button>
        </DialogActions>
      </form>
    </DialogContent>
  </div>
</Dialog>
      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        open={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onDelete={handleDeleteItem}
        title="Delete?"
        message={itemToDelete ? `Are you sure you want to delete ${itemToDelete.name}?` : "Are you sure you want to delete this item?"}
      />
    </>
  );
};

export default Page;
