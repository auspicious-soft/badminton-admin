"use client";
import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { EyeIcon, DownArrowIcon,  } from "@/utils/svgicons";
import UserProfileImage from "@/assets/images/userProfile4.png";
import SearchBar from "../SearchBar";
import TablePagination from "../TablePagination";

import useSWR from "swr";
import { getAllMerchandise, updateOrder } from "@/services/admin-services";
import { toast } from "sonner";

interface MatchesHeaderProps {

  selectedGame: string;
  setSelectedGame: (tab: string) => void;
  selectedCity: string;
  setSelectedCity: (tab: string) => void;
  onSortChange?: (sortValue: string) => void;
  onStatusChange?: (statusValue: string) => void;
}
const OrdersComponent: React.FC<MatchesHeaderProps> = ({ selectedGame, setSelectedGame,setSelectedCity, selectedCity }) => {
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [searchParams, setSearchParams] = useState("");
  const [page, setPage] = useState(1);
  const [updatingOrderId, setUpdatingOrderId] = useState<string | null>(null);
  const itemsPerPage = 10;

  const { data, isLoading, mutate } = useSWR(
    `/admin/orders?page=${page}&limit=${itemsPerPage}&order=${selectedGame}&status=${selectedCity}`,
    getAllMerchandise
  );


  const orders = data?.data?.data || [];

  // Filter orders based on search
  const filteredOrders = orders.filter((order: any) =>
    order.user?.fullName?.toLowerCase().includes(searchParams.toLowerCase()) ||
    order.orderId?.toLowerCase().includes(searchParams.toLowerCase())
  );

  // Auto-select first row when data changes or search changes
  useEffect(() => {
    if (filteredOrders.length > 0) {
      // If no order is selected or the selected order is not in filtered results, select the first one
      if (!selectedOrderId || !filteredOrders.find((order: any) => order.orderId === selectedOrderId)) {
        setSelectedOrderId(filteredOrders[0].orderId);
      }
    } else {
      // Clear selection if no orders
      setSelectedOrderId(null);
    }
  }, [filteredOrders, selectedOrderId]);

  // Get the selected order object based on selectedOrderId
  const selectedOrder = selectedOrderId ? filteredOrders.find((order: any) => order.orderId === selectedOrderId) : null;

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    // setQuery(`page=${newPage}&limit=${itemsPerPage}`);
  };

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    try {
      setUpdatingOrderId(orderId);

      const payload = {
        orderId: orderId,
        status: newStatus
      };

      const response = await updateOrder(payload);

      if (response?.status === 200 || response?.status === 201) {
        toast.success("Order status updated successfully");
        // Refresh the data
        mutate();
      } else {
        toast.error("Failed to update order status");
      }
    } catch (error) {
      console.error("Error updating order status:", error);
      toast.error("Failed to update order status");
    } finally {
      setUpdatingOrderId(null);
    }
  };

  const handleClick = (id: string) => {
    try {
      console.log("Opening receipt preview for order ID:", id);
      const receiptUrl = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/order-receipt/${id}`;

      window.open(receiptUrl, '_blank', 'noopener,noreferrer');

      toast.success("Opening receipt preview in new tab");
    } catch (error) {
      console.error("Error opening receipt preview:", error);
      toast.error("Failed to open receipt preview");
    }
  };

  // Status dropdown component
  const StatusDropdown = ({ order }: { order: any }) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const statusOptions = ["pending", "ready", "confirmed", "delivered", "cancelled"];
    const isUpdating = updatingOrderId === order.orderId;

    // Close dropdown when clicking outside
    useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
          setIsOpen(false);
        }
      };

      document.addEventListener('mousedown', handleClickOutside);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }, []);

    const getStatusColor = (status: string) => {
      switch (status.toLowerCase()) {
        case "pending": return "bg-yellow-100 text-yellow-800";
        case "ready": return "bg-blue-100 text-blue-800";
        case "confirmed": return "bg-green-100 text-green-800";
        case "delivered": return "bg-green-200 text-green-900";
        case "cancelled": return "bg-red-100 text-red-800";
        default: return "bg-gray-100 text-gray-800";
      }
    };

    return (
      <div className="relative flex justify-center" ref={dropdownRef}>
        <button
          onClick={(e) => {
            e.stopPropagation();
            setIsOpen(!isOpen);
          }}
          disabled={isUpdating}
          className={`px-2 py-1 rounded-full text-xs font-medium capitalize flex items-center gap-1 ${getStatusColor(order.orderStatus)} ${isUpdating ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:opacity-80'}`}
        >
          {isUpdating ? "Updating..." : order.orderStatus}
          <div className={`transition-transform ${isOpen ? 'rotate-180' : ''}`}>
            <DownArrowIcon stroke="#374151" />
          </div>
        </button>

        {isOpen && (
          <div className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-md shadow-lg z-[60] min-w-[120px]">
            {statusOptions.map((status) => (
              <button
                key={status}
                onClick={(e) => {
                  e.stopPropagation();
                  handleStatusChange(order.orderId, status);
                  setIsOpen(false);
                }}
                className={`w-full text-left px-3 py-2 text-xs capitalize hover:bg-gray-50 ${
                  status === order.orderStatus ? 'bg-blue-50 text-blue-600' : 'text-gray-700'
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <>
      <div className="flex w-full lg:w-2/3 justify-between mb-[15px]">
      </div>
      <div className="flex flex-col lg:flex-row w-full  rounded-[20px] gap-6 mb-[40px]">
        {/* Left Panel: User List */}
        <div className={`w-full h-fit ${filteredOrders.length > 0 ? 'lg:w-2/3' : 'lg:w-full'} bg-[#f2f2f4] shadow-md rounded-[20px] p-[14px] overflow-auto overflo-custom`}>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-[#10375c] text-xl font-semibold">All Orders</h2>
            <SearchBar setQuery={setSearchParams} query={searchParams} />
          </div>
          <div className="overflow-x-auto overflo-custom max-w-full">
            <div className="w-full min-w-[600px] rounded-[10px] bg-[#f2f2f4] flex text-sm font-semibold text-[#7e7e8a]">
              <div className="w-1/4 h-3.5 text-[#7e7e8a] text-xs font-medium pl-4">Name</div>
              <div className="w-[30%] h-3.5 text-[#7e7e8a] text-center text-xs font-medium">Venue</div>
              <div className="w-[16%] h-3.5 text-[#7e7e8a] text-start text-xs font-medium">Status</div>
              <div className="w-[30%] h-3.5 text-[#7e7e8a] text-xs text-center font-medium">Email</div>
              <div className="w-[20%] h-3.5 text-[#7e7e8a] text-xs text-center font-medium">Phone Number</div>
              <div className="w-[10%] h-3.5 text-[#7e7e8a] text-end text-xs font-medium pr-3">Action</div>
            </div>
            <div className="w-full h-[0px] border border-[#d0d0d0] border-dotted mt-[8px]"></div>
            <div className="w-full min-w-[600px]">
              {isLoading ? (
                <p className="text-center text-[#10375C] py-4">Loading...</p>
              ) : filteredOrders.length === 0 ? (
                <p className="text-center text-[#10375C] py-4">No data found.</p>
              ) : (
                filteredOrders.map((order: any, index: number) => {
                const isSelected = selectedOrderId === order.orderId;
                const rowBgClass = isSelected ? "bg-[#176dbf] text-white" : (index % 2 === 0 ? "bg-[#f2f2f4]" : "bg-white");
                const textColorClass = isSelected ? "text-white" : "text-[#1b2229]";

                return (
                  <div key={order.orderId} className={`cursor-pointer flex items-center h-[47px] px-3.5 py-3 rounded-[10px] ${rowBgClass}`} onClick={() => setSelectedOrderId(order.orderId)}>
                    <div className={`w-1/4 flex items-center gap-2 break-words text-xs font-medium ${textColorClass}`}>
                      <Image src={UserProfileImage} alt="Avatar" className="rounded-full" width={25} height={25} />
                      {order.user?.fullName || 'N/A'}
                    </div>
                    <div className={`w-[30%] text-xs text-center font-medium ${textColorClass}`}>{order?.venue?.name}</div>
                    <div className={`w-[30%] text-xs text-center font-medium ${textColorClass}`}>
                      <StatusDropdown order={order} />
                    </div>
                    <div className={`w-[35%] break-words text-center text-xs font-medium ${textColorClass}`}>{order?.user?.email}</div>
                    <div className={`w-[20%] text-center flex-wrap text-xs font-medium ${textColorClass}`}>{order?.user?.phoneNumber}</div>
                    <div className="w-[10%] text-xs font-medium flex justify-end">
                      <EyeIcon stroke={isSelected ? "#FFFFFF" : "#fd5602"} />
                    </div>
                  </div>
                );
               })
              )}
            </div>
            {/* Pagination */}
            {filteredOrders.length > 0 && (
              <div className="mt-4 flex justify-end gap-2">
                <TablePagination
                  setPage={handlePageChange}
                  page={page}
                  totalData={filteredOrders.length}
                  itemsPerPage={itemsPerPage}
                />
              </div>
            )}
          </div>
        </div>

        {/* Right Panel: Order Details - Only show when there are orders */}
        {filteredOrders.length > 0 && (
          <div className="flex flex-col w-full lg:w-1/3 gap-[24px] h-full justify-between ">
          <div className=" bg-[#f2f2f4] shadow-md rounded-[20px] relative">
            {selectedOrder ? (
              <div className="w-full bg-[#f2f2f4] rounded-[20px] min-h-full">
                {/* Blue Header with Wave */}
                <div className="relative w-full">
                  <svg width="100%" height="100%" viewBox="0 0 471 165" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M0 20 Q0 0 20 0 H451 Q471 0 471 20 V155.046 C471 155.046 372.679 132.651 235.5 155.046 C98.3213 177.442 0 155.046 0 155.046 Z" fill="#176dbf" />
                  </svg>
                  <div className="absolute top-0 left-0 w-full h-full flex gap-[25px] items-center p-2 pl-[20px] text-white">
                    <Image src={UserProfileImage} alt="User Avatar" className="rounded-full  border-2 border-white w-81 h-81 " height={81} width={81} />
                    <div>
                      <div className="text-white text:2xl md:text-3xl font-bold leading-10 tracking-wide">{selectedOrder.user?.fullName || 'N/A'}</div>
                    </div>
                  </div>
                </div>


                {/* Content Section */}
                <div className="flex flex-col w-full mt-[27px] gap-[30px] relative z-20">
                  {/* Customer Details */}
                  <div className="w-[85%] ml-[30px] flex-col justify-start items-start gap-3 inline-flex">
                    <div className="self-stretch text-[#1c2329] text-sm font-semibold leading-[16.80px]">Customer details</div>
                    <div className="self-stretch justify-between items-center inline-flex">
                      <div className="flex-col justify-start items-start gap-2.5 inline-flex">
                        <div className="text-[#7e7e8a] text-xs font-medium capitalize leading-[15px]">Phone Number</div>
                        <div className="text-[#7e7e8a] text-xs font-medium capitalize leading-[15px]">Email Address</div>
                        <div className="text-[#7e7e8a] text-xs font-medium capitalize leading-[15px]">Order ID</div>
                      </div>
                      <div className="flex-col justify-start items-end gap-2.5 inline-flex">
                        <div className="text-right text-[#1b2229] text-xs font-bold capitalize leading-[15px]">{selectedOrder.user?.phoneNumber || 'N/A'}</div>
                        <div className="text-right text-[#1b2229] text-xs font-bold leading-[15px]">{selectedOrder.user?.email || 'N/A'}</div>
                        <div className="text-right text-[#1b2229] text-xs font-bold capitalize leading-[15px]">{selectedOrder.orderId}</div>
                      </div>
                    </div>
                  </div>

                  {/* Order Items */}
                  <div className="w-[85%] ml-[30px] flex-col justify-start items-start gap-3 inline-flex mb-[30px]">
                    <div className="self-stretch text-[#1c2329] text-sm font-semibold leading-[16.80px]">Order details</div>
                    <div className="self-stretch justify-between items-center inline-flex">
                      <div className="flex-col justify-start items-start gap-2.5 inline-flex">
                        {selectedOrder.items?.map((item: any, index: number) => (
                          <div key={index} className="self-stretch text-[#7e7e8a] text-xs font-medium capitalize leading-[15px]">
                            {item.quantity}x {item.name}
                          </div>
                        ))}
                      </div>
                      <div className="flex-col justify-start items-end gap-2.5 inline-flex">
                        {selectedOrder.items?.map((item: any, index: number) => (
                          <div key={index} className="text-right text-[#1b2229] text-xs font-bold capitalize leading-[15px]">
                            ₹{item.price}
                          </div>
                        ))}
                      </div>
                    </div>

                  </div>
                  <div className="w-[85%] ml-[30px] flex-col justify-start items-start gap-3 inline-flex mb-[30px]">
                    <div className="self-stretch text-[#1c2329] text-sm font-semibold leading-[16.80px]">Order Total</div>
                    <div className="self-stretch justify-between items-center inline-flex">
                      <div className="flex-col justify-start items-start gap-2.5 inline-flex">
                        <div className="self-stretch text-[#7e7e8a] text-xs font-medium capitalize leading-[15px]">{selectedOrder.items?.length || 0} Items</div>

                      </div>
                      <div className="flex-col justify-start items-end gap-2.5 inline-flex">
                        <div className="text-right text-[#1b2229] text-base font-bold font-['Raleway'] capitalize leading-tight">₹{selectedOrder.totalAmount}</div>

                      </div>
                    </div>

                  </div>
                </div>

              </div>
            ) : (
              <p className="text-center text-gray-500 p-8">Select an order to see details</p>
            )}

          </div>
          <button onClick={() => handleClick(selectedOrder.orderId)} className="h-12  py-4 bg-[#10375c] rounded-[28px] justify-center items-center text-white text-sm font-medium ">Print Reciept</button>

          </div>
        )}
      </div>
    </>
  );
}
export default OrdersComponent;