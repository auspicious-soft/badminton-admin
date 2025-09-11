"use client";
import React, { useState, useEffect } from "react";
import {
    Button,
} from "@mui/material";
const DownloadModal = ({ isOpen, onClose, venues, onSubmit }) => {
    const [selectedVenue, setSelectedVenue] = useState("");
    const [selectedMonth, setSelectedMonth] = useState("");
    const [selectedYear, setSelectedYear] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    // Generate years from 2025 to current year
    const currentYear = new Date().getFullYear();
    const years = Array.from({ length: currentYear - 2024 }, (_, i) => currentYear - i);

    const months = [
        { name: "January", value: 1 },
        { name: "February", value: 2 },
        { name: "March", value: 3 },
        { name: "April", value: 4 },
        { name: "May", value: 5 },
        { name: "June", value: 6 },
        { name: "July", value: 7 },
        { name: "August", value: 8 },
        { name: "September", value: 9 },
        { name: "October", value: 10 },
        { name: "November", value: 11 },
        { name: "December", value: 12 },
    ];

    const handleSubmit = async () => {
        if (selectedVenue && selectedMonth && selectedYear) {
            setIsLoading(true);
            try {
                await onSubmit(selectedVenue, selectedMonth, selectedYear);
            } finally {
                setIsLoading(false);
                onClose(); // Trigger onClose to reset states
            }
        } else {
            alert("Please select all fields");
        }
    };

    // Reset states when the modal is closed
    useEffect(() => {
        if (!isOpen) {
            setSelectedVenue("");
            setSelectedMonth("");
            setSelectedYear("");
            setIsLoading(false);
        }
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-md">
                <h2 className="text-2xl font-semibold text-[#10375c] mb-6 text-center"> Venue Transactions</h2>

                <div className="mb-5">
                    <label className="block text-sm font-medium text-gray-600 mb-2">Select Venue</label>
                    <select
                        value={selectedVenue}
                        onChange={(e) => setSelectedVenue(e.target.value)}
                        className="w-full p-3 bg-gray-100 border-0 rounded-full text-gray-500 focus:outline-none focus:ring-0"
                    >
                        <option value="">Select</option>
                        {venues.map((venue) => (
                            <option key={venue._id} value={venue._id}>{venue.name}</option>
                        ))}
                    </select>
                </div>

                <div className="mb-5">
                    <label className="block text-sm font-medium text-gray-600 mb-2">Select Month</label>
                    <select
                        value={selectedMonth}
                        onChange={(e) => setSelectedMonth(e.target.value)}
                        className="w-full p-3 bg-gray-100 border-0 rounded-full text-gray-500 focus:outline-none focus:ring-0"
                    >
                        <option value="">Select a month</option>
                        {months.map((month) => (
                            <option key={month.value} value={month.value}>{month.name}</option>
                        ))}
                    </select>
                </div>

                <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-600 mb-2">Select Year</label>
                    <select
                        value={selectedYear}
                        onChange={(e) => setSelectedYear(e.target.value)}
                        className="w-full p-3 bg-gray-100 border-0 rounded-full text-gray-500 focus:outline-none focus:ring-0"
                    >
                        <option value="">Select a year</option>
                        {years.map((year) => (
                            <option key={year} value={year}>{year}</option>
                        ))}
                    </select>
                </div>

                <div className="flex justify-between gap-2 items-center">
                    <Button
                        type="button"
                        fullWidth
                        variant="outlined"
                        // onClick={handleCloseNewI/temDialog}
                        style={{
                            textTransform: "none",
                            borderColor: "#10375c",
                            color: "#10375c",
                            borderRadius: "28px",
                            padding: "12px 24px",
                            width: "100%",
                        }}
                        className="w-full sm:w-auto text-sm sm:text-base font-medium rounded-[28px]"
                        onClick={onClose}
                    // className="px-6 py-2 bg-blue-200 text-blue-700 rounded-full hover:bg-blue-300 transition-colors"
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={handleSubmit}
                        disabled={isLoading || !selectedVenue || !selectedMonth || !selectedYear}
                        type="submit"
                        fullWidth
                        variant="contained"
                        // disabled={newItemPending}
                        style={{
                            textTransform: "none",
                            backgroundColor: (isLoading || !selectedVenue || !selectedMonth || !selectedYear) ? "#d3d3d3" : "#10375c",
                            color: "#fff",
                            borderRadius: "28px",
                            padding: "12px 24px",
                            width: "100%",
                        }}
                        className={`w-full sm:w-auto text-sm sm:text-base font-medium rounded-[28px] ${isLoading || (!selectedVenue && !selectedMonth && !selectedYear) ? 'cursor-not-allowed' : ''}`}            // className={`px-6 py-2 bg-[#1E3A8A] text-white rounded-full hover:bg-[#163072] transition-colors ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                        {isLoading ? (
                            <span className="flex items-center justify-center">
                                <svg className="animate-spin h-5 w-5 mr-2 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
                                </svg>
                                Loading...
                            </span>
                        ) : (
                            "Download"
                        )}
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default DownloadModal;