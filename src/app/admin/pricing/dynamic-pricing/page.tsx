"use client";
import React, { useState, useEffect } from "react";
import { WeekdayPricingButton } from "../../components/pricing";
import { toast } from "sonner";
import { getDynamicPricing } from "@/services/admin-services";

interface SlotPricing {
  slot: string;
  price: number;
}

interface DynamicPricing {
  id: string;
  name: string;
  description: string;
  dayType: "weekday" | "weekend";
  slotPricing: SlotPricing[];
}

const DynamicPricingPage = () => {
  const [pricingData, setPricingData] = useState<DynamicPricing[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch pricing data when the component mounts
    fetchPricingData();
  }, []);

  const fetchPricingData = async () => {
    try {
      setLoading(true);
      const response = await getDynamicPricing();
      setPricingData(response.data);
    } catch (error) {
      console.error("Error fetching pricing data:", error);
      toast.error("Failed to fetch pricing data");
    } finally {
      setLoading(false);
    }
  };

  const handlePricingAdded = (data: any) => {
    // Refresh the pricing data after adding a new pricing
    fetchPricingData();
  };

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-[#10375c]">Dynamic Pricing Management</h1>
        
        <WeekdayPricingButton 
          onPricingAdded={handlePricingAdded}
          buttonText="Add New Pricing"
        />
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <p className="text-lg text-gray-600">Loading pricing data...</p>
        </div>
      ) : pricingData.length === 0 ? (
        <div className="flex justify-center items-center h-64">
          <p className="text-lg text-gray-600">No pricing data available. Add your first pricing!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {pricingData.map((pricing) => (
            <div key={pricing.id} className="bg-white rounded-[15px] p-5 shadow-sm">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-[#10375c] text-lg font-medium">{pricing.name}</h3>
                <span className="px-3 py-1 bg-[#f2f2f4] rounded-full text-[#10375c] text-xs font-medium">
                  {pricing.dayType === "weekday" ? "Weekday" : "Weekend"}
                </span>
              </div>
              
              <p className="text-gray-600 text-sm mb-4">{pricing.description}</p>
              
              <div className="space-y-2">
                <h4 className="text-[#1b2229] text-xs font-medium mb-2">Slot Pricing</h4>
                {pricing.slotPricing.map((slot, index) => (
                  <div key={index} className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-[#1b2229] text-sm">{slot.slot}</span>
                    <span className="text-[#10375c] font-medium">₹{slot.price}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DynamicPricingPage;
