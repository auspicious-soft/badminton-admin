"use client";
import React, { useState } from "react";
import { MaintenanceButton } from "../components/maintenance";
import { toast } from "sonner";

interface MaintenanceData {
  venue: string;
  court: string;
  date: string;
  timeSlots: string[];
  reason: string;
}

const MaintenancePage = () => {
  const [maintenanceData, setMaintenanceData] = useState<MaintenanceData[]>([]);

  const handleMaintenanceAdded = (data: MaintenanceData) => {
    console.log("Maintenance data:", data);
    
    // In a real application, you would send this data to your API
    // For demo purposes, we'll just add it to our local state
    setMaintenanceData([...maintenanceData, data]);
    
    toast.success("Maintenance added successfully");
  };

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-[#10375c]">Maintenance Management</h1>
        
        <MaintenanceButton 
          onMaintenanceAdded={handleMaintenanceAdded}
          buttonText="Add Maintenance"
        />
      </div>

      {/* Display existing maintenance data */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {maintenanceData.map((maintenance, index) => (
          <div key={index} className="bg-[#f2f2f4] p-4 rounded-[20px]">
            <h3 className="text-lg font-semibold text-[#10375c]">Maintenance #{index + 1}</h3>
            <p className="text-sm text-gray-600 mb-2">Venue: {maintenance.venue}</p>
            <p className="text-sm text-gray-600 mb-2">Court: {maintenance.court}</p>
            <p className="text-sm text-gray-600 mb-2">Date: {maintenance.date}</p>
            <p className="text-sm text-gray-600 mb-2">Reason: {maintenance.reason}</p>
            
            <div className="space-y-2">
              <h4 className="text-sm font-medium">Time Slots</h4>
              <div className="flex flex-wrap gap-2">
                {maintenance.timeSlots.map((slot, idx) => (
                  <span key={idx} className="bg-[#10375c] text-white px-2 py-1 rounded-full text-xs">
                    {slot}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MaintenancePage;
