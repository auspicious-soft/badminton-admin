
"use client";
import { useState } from "react";
import DynamicPricingPage from "./DynamicPricing";
import MiscellaneousHeader from "./pricingHeader";
import BasePricingPage from "./BasePricing";

const PricingPage = () => {
  const [selectedTab, setSelectedTab] = useState("Dynamic Pricing");
  const [selectedGame, setSelectedGame] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  return (
    <div className="">
      {/* Header with Tabs & Filters */}
      <div>
        <MiscellaneousHeader selectedTab={selectedTab} setSelectedTab={setSelectedTab} selectedGame={selectedGame} setSelectedGame={setSelectedGame} selectedCity={selectedCity} setSelectedCity={setSelectedCity} setSelectedDate={setSelectedDate} selectedDate={selectedDate} />
      </div>
      {/* Render Content Based on Selected Tab */}
      <div className="mt-6 mb-6">
        {selectedTab === "Dynamic Pricing" && <DynamicPricingPage />}
        {selectedTab === "Base Pricing" && <BasePricingPage />}
      </div>
    </div>
  );
};

export default PricingPage;
