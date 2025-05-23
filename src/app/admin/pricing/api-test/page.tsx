"use client";
import React, { useState, useEffect, useMemo } from "react";
import { PricingBlock, mapApiDataToPricingData } from "../../components/pricing";
import { getDynamicPricing } from "@/services/admin-services";
import { toast } from "sonner";
import useSWR from "swr";

const ApiTestPage = () => {
  // Mock API data for testing
  const mockApiData = [
    {
      _id: '68285c1df8a0a0921ca65d08',
      name: 'Premium Weekends',
      description: 'Higher pricing for weekends',
      dayType: 'weekend' as const,
      slotPricing: [
        { slot: '06:00', price: 700, _id: '68286384d6eb26b8ba3992d4' },
        { slot: '07:00', price: 800, _id: '68286384d6eb26b8ba3992d5' },
        { slot: '08:00', price: 1000, _id: '68286384d6eb26b8ba3992d6' },
        { slot: '09:00', price: 1000, _id: '68286384d6eb26b8ba3992d7' },
        { slot: '10:00', price: 1200, _id: '68286384d6eb26b8ba3992d8' },
        { slot: '11:00', price: 1200, _id: '68286384d6eb26b8ba3992d9' },
        { slot: '12:00', price: 1500, _id: '68286384d6eb26b8ba3992da' },
        { slot: '13:00', price: 1500, _id: '68286384d6eb26b8ba3992db' },
        { slot: '14:00', price: 1200, _id: '68286384d6eb26b8ba3992dc' },
        { slot: '15:00', price: 1200, _id: '68286384d6eb26b8ba3992dd' },
        { slot: '16:00', price: 1000, _id: '68286384d6eb26b8ba3992de' },
        { slot: '17:00', price: 1500, _id: '68286384d6eb26b8ba3992df' },
        { slot: '18:00', price: 1800, _id: '68286384d6eb26b8ba3992e0' },
        { slot: '19:00', price: 1800, _id: '68286384d6eb26b8ba3992e1' },
        { slot: '20:00', price: 1500, _id: '68286384d6eb26b8ba3992e2' },
        { slot: '21:00', price: 1200, _id: '68286384d6eb26b8ba3992e3' }
      ],
      isActive: true,
      createdAt: '2025-05-17T09:51:25.269Z',
      updatedAt: '2025-05-17T10:23:00.323Z',
      __v: 0
    },
    {
      _id: '682d553458ef5add13b3734c',
      name: 'Standard Weekday',
      description: 'Regular pricing for weekdays',
      dayType: 'weekday' as const,
      slotPricing: [
        { slot: '06:00', price: 100, _id: '682d553458ef5add13b3734d' },
        { slot: '07:00', price: 100, _id: '682d553458ef5add13b3734e' },
        { slot: '08:00', price: 100, _id: '682d553458ef5add13b3734f' },
        { slot: '09:00', price: 100, _id: '682d553458ef5add13b37350' },
        { slot: '10:00', price: 100, _id: '682d553458ef5add13b37351' },
        { slot: '11:00', price: 100, _id: '682d553458ef5add13b37352' },
        { slot: '12:00', price: 100, _id: '682d553458ef5add13b37353' },
        { slot: '13:00', price: 100, _id: '682d553458ef5add13b37354' },
        { slot: '14:00', price: 100, _id: '682d553458ef5add13b37355' },
        { slot: '15:00', price: 100, _id: '682d553458ef5add13b37356' },
        { slot: '16:00', price: 100, _id: '682d553458ef5add13b37357' },
        { slot: '17:00', price: 100, _id: '682d553458ef5add13b37358' },
        { slot: '18:00', price: 100, _id: '682d553458ef5add13b37359' },
        { slot: '19:00', price: 100, _id: '682d553458ef5add13b3735a' },
        { slot: '20:00', price: 100, _id: '682d553458ef5add13b3735b' },
        { slot: '21:00', price: 100, _id: '682d553458ef5add13b3735c' }
      ],
      isActive: true,
      createdAt: '2025-05-21T04:23:16.941Z',
      updatedAt: '2025-05-21T04:23:16.941Z',
      __v: 0
    }
  ];

  const [useMockData, setUseMockData] = useState(true);

  // Fetch real API data
  const { data: PricingData, mutate: priceMutate, isLoading: priceLoading } = useSWR(
    useMockData ? null : "admin/dynamic-pricing",
    getDynamicPricing
  );

  // Map API pricing data to component format
  const mappedPricingData = useMemo(() => {
    const dataToMap = useMockData ? mockApiData : PricingData?.data?.data;

    if (dataToMap && Array.isArray(dataToMap)) {
      return mapApiDataToPricingData(dataToMap);
    }
    return {
      weekdayPricing: {
        name: "Mon - Fri",
        description: "No weekday pricing available",
        timeSlots: []
      },
      weekendPricing: {
        name: "Sat - Sun",
        description: "No weekend pricing available",
        timeSlots: []
      }
    };
  }, [PricingData, useMockData]);

  const handlePricingUpdate = (type: 'weekday' | 'weekend') => {
    console.log(`${type} pricing updated`);
    if (!useMockData) {
      priceMutate(); // Refresh data from API
    }
    toast.success(`${type.charAt(0).toUpperCase() + type.slice(1)} pricing updated successfully`);
  };

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-[#10375c]">API Data Mapping Test</h1>

        <div className="flex gap-4">
          <button
            onClick={() => setUseMockData(true)}
            className={`px-4 py-2 rounded-full text-sm font-medium ${
              useMockData
                ? "bg-[#10375c] text-white"
                : "bg-white text-[#10375c] border border-[#e0e0e0]"
            }`}
          >
            Use Mock Data
          </button>
          <button
            onClick={() => setUseMockData(false)}
            className={`px-4 py-2 rounded-full text-sm font-medium ${
              !useMockData
                ? "bg-[#10375c] text-white"
                : "bg-white text-[#10375c] border border-[#e0e0e0]"
            }`}
          >
            Use Real API
          </button>
        </div>
      </div>

      {/* Display raw API data */}
      <div className="mb-8 bg-gray-100 p-4 rounded-lg">
        <h3 className="text-lg font-semibold mb-4">Raw API Data:</h3>
        <pre className="text-xs overflow-auto max-h-64">
          {JSON.stringify(useMockData ? mockApiData : PricingData?.data?.data, null, 2)}
        </pre>
      </div>

      {/* Display mapped data */}
      <div className="mb-8 bg-blue-50 p-4 rounded-lg">
        <h3 className="text-lg font-semibold mb-4">Mapped Data:</h3>
        <pre className="text-xs overflow-auto max-h-64">
          {JSON.stringify(mappedPricingData, null, 2)}
        </pre>
      </div>

      {/* PricingBlock Component */}
      {(useMockData || !priceLoading) ? (
        <PricingBlock
          weekdayPricing={mappedPricingData.weekdayPricing}
          weekendPricing={mappedPricingData.weekendPricing}
          onWeekdayPricingUpdate={() => handlePricingUpdate('weekday')}
          onWeekendPricingUpdate={() => handlePricingUpdate('weekend')}
        />
      ) : (
        <div className="flex justify-center items-center h-32">
          <p className="text-lg text-gray-600">Loading pricing data...</p>
        </div>
      )}

      {/* API Payload Examples */}
      <div className="mt-8 bg-yellow-50 p-4 rounded-lg">
        <h3 className="text-lg font-semibold mb-4">API Payload Examples:</h3>

        <div className="mb-4">
          <h4 className="font-medium mb-2">Create New Pricing (no ID):</h4>
          <pre className="text-xs bg-white p-2 rounded border overflow-auto">
{JSON.stringify({
  "name": "New Weekday Pricing",
  "description": "Regular pricing for weekdays",
  "dayType": "weekday",
  "slotPricing": [
    { "slot": "06:00", "price": 100 },
    { "slot": "07:00", "price": 150 },
    { "slot": "08:00", "price": 200 }
  ]
}, null, 2)}
          </pre>
        </div>

        <div>
          <h4 className="font-medium mb-2">Edit Existing Pricing (with ID):</h4>
          <pre className="text-xs bg-white p-2 rounded border overflow-auto">
{JSON.stringify({
  "id": "68285c1df8a0a0921ca65d08",
  "name": "Premium Weekday",
  "description": "Higher pricing for weekdays",
  "dayType": "weekday",
  "slotPricing": [
    { "slot": "06:00", "price": 1850 },
    { "slot": "07:00", "price": 1900 },
    { "slot": "08:00", "price": 1200 }
  ]
}, null, 2)}
          </pre>
        </div>
      </div>
    </div>
  );
};

export default ApiTestPage;
