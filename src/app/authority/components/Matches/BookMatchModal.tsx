"use client";
import { useState } from "react";
import dynamic from 'next/dynamic';

const Select = dynamic(() => import("react-select"), { ssr: false });

export const BookingModal = ({ onClose }) => {
  const [court, setCourt] = useState("Court 2");
  const [selectedTimeSlots, setSelectedTimeSlots] = useState([
    { value: "02:00-03:00", label: "02:00 - 03:00 PM" }
  ]);
  const [guestPlayer1, setGuestPlayer1] = useState("Rahul Sharma");
  const [email, setEmail] = useState("sharmahuzz@gmail.com");
  const [phone, setPhone] = useState("+91 7964962237");
  const [guestPlayer2, setGuestPlayer2] = useState("Rahul Sharma");
  const [guestPlayer3, setGuestPlayer3] = useState("Rahul Sharma");
  const [guestPlayer4, setGuestPlayer4] = useState("Rahul Sharma");
  const [paymentMode, setPaymentMode] = useState("Cash/UPI");

  const timeSlotOptions = [
    { value: "02:00-03:00", label: "02:00 - 03:00 PM" },
    { value: "03:00-04:00", label: "03:00 - 04:00 PM" },
    { value: "04:00-05:00", label: "04:00 - 05:00 PM" },
    { value: "05:00-06:00", label: "05:00 - 06:00 PM" },
    { value: "06:00-07:00", label: "06:00 - 07:00 PM" }
  ];

  const courtOptions = ["Court 1", "Court 2", "Court 3"];
  const paymentOptions = ["Cash/UPI", "Credit Card", "Debit Card"];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex  justify-center z-50">
      <div className="bg-white rounded-lg mt-10 w-[90%] max-w-4xl max-h-[75vh] ">
        {/* Header */}
        <div className="p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-800">Create Booking</h2>
        </div>

        <div className="p-6 space-y-6 max-h-[60vh] overflow-y-auto">
          {/* Booking Details */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="text-sm font-medium text-gray-700 mb-4">Booking Details</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Select Court */}
              <div>
                <label className="block text-xs text-gray-600 mb-2">Select Court</label>
                <div className="relative">
                  <select 
                    className="w-full p-3 border border-gray-300 rounded-lg bg-white text-sm appearance-none pr-10"
                    value={court} 
                    onChange={(e) => setCourt(e.target.value)}
                  >
                    {courtOptions.map(option => (
                      <option key={option} value={option}>{option}</option>
                    ))}
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                    </svg>
                  </div>
                </div>
              </div>

              {/* Select Time Slot */}
              <div>
                <label className="block text-xs text-gray-600 mb-2">Select Time Slot</label>
                <Select
                  isMulti
                  options={timeSlotOptions}
                  value={selectedTimeSlots}
                  onChange={setSelectedTimeSlots}
                  className="w-full text-sm"
                  classNamePrefix="react-select"
                  placeholder="Select Time Slots..."
                  styles={{
                    control: (base) => ({
                      ...base,
                      borderRadius: "8px",
                      border: "1px solid #d1d5db",
                      boxShadow: "none",
                      "&:hover": {
                        borderColor: "#d1d5db",
                      },
                      padding: "4px",
                      minHeight: "48px"
                    }),
                    menu: (base) => ({
                      ...base,
                      borderRadius: "8px",
                      boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                    }),
                    option: (base, { isFocused }) => ({
                      ...base,
                      backgroundColor: isFocused ? "#f3f4f6" : "white",
                      color: "#374151",
                      "&:active": {
                        backgroundColor: "#f3f4f6",
                      },
                    }),
                    multiValue: (base) => ({
                      ...base,
                      backgroundColor: "#1f2937",
                      borderRadius: "6px",
                    }),
                    multiValueLabel: (base) => ({
                      ...base,
                      color: "white",
                      padding: "4px 8px",
                      fontSize: "12px"
                    }),
                    multiValueRemove: (base) => ({
                      ...base,
                      color: "white",
                      "&:hover": {
                        backgroundColor: "#374151",
                        color: "white",
                      },
                    }),
                  }}
                />
              </div>
            </div>
          </div>

          {/* Customer Details */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="text-sm font-medium text-gray-700 mb-4">Customer Details</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Guest Player 1 */}
              <div>
                <label className="block text-xs text-gray-600 mb-2">Guest Player 1</label>
                <input 
                  type="text" 
                  className="w-full p-3 border border-gray-300 rounded-lg text-sm"
                  value={guestPlayer1} 
                  onChange={(e) => setGuestPlayer1(e.target.value)}
                  placeholder="Guest Player 1"
                />
              </div>

              {/* Email Address */}
              <div>
                <label className="block text-xs text-gray-600 mb-2">Email Address</label>
                <input 
                  type="email" 
                  className="w-full p-3 border border-gray-300 rounded-lg text-sm"
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email Address"
                />
              </div>

              {/* Phone */}
              <div>
                <label className="block text-xs text-gray-600 mb-2">Phone</label>
                <input 
                  type="text" 
                  className="w-full p-3 border border-gray-300 rounded-lg text-sm"
                  value={phone} 
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="Phone"
                />
              </div>

              {/* Guest Player 2 */}
              <div>
                <label className="block text-xs text-gray-600 mb-2">Guest Player 2</label>
                <input 
                  type="text" 
                  className="w-full p-3 border border-gray-300 rounded-lg text-sm"
                  value={guestPlayer2} 
                  onChange={(e) => setGuestPlayer2(e.target.value)}
                  placeholder="Guest Player 2"
                />
              </div>

              {/* Guest Player 3 */}
              <div>
                <label className="block text-xs text-gray-600 mb-2">Guest Player 3</label>
                <input 
                  type="text" 
                  className="w-full p-3 border border-gray-300 rounded-lg text-sm"
                  value={guestPlayer3} 
                  onChange={(e) => setGuestPlayer3(e.target.value)}
                  placeholder="Guest Player 3"
                />
              </div>

              {/* Guest Player 4 */}
              <div>
                <label className="block text-xs text-gray-600 mb-2">Guest Player 4</label>
                <input 
                  type="text" 
                  className="w-full p-3 border border-gray-300 rounded-lg text-sm"
                  value={guestPlayer4} 
                  onChange={(e) => setGuestPlayer4(e.target.value)}
                  placeholder="Guest Player 4"
                />
              </div>
            </div>
          </div>

          {/* Payment Details */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="text-sm font-medium text-gray-700 mb-4">Payment Details</h3>
            
            <div className="w-full md:w-1/2">
              <label className="block text-xs text-gray-600 mb-2">Payment Mode</label>
              <div className="relative">
                <select 
                  className="w-full p-3 border border-gray-300 rounded-lg bg-white text-sm appearance-none pr-10"
                  value={paymentMode} 
                  onChange={(e) => setPaymentMode(e.target.value)}
                >
                  {paymentOptions.map(option => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-between items-center p-6 border-t bg-gray-50 rounded-b-lg">
          <button 
            className="px-8 py-3 bg-white border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
            onClick={onClose}
          >
            Cancel
          </button>
          <button 
            className="px-8 py-3 bg-blue-900 text-white rounded-lg font-medium hover:bg-blue-800 transition-colors"
          >
            Create Booking
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookingModal;