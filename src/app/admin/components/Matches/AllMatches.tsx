
"use client";
import { useState } from "react";
import Dashboard from "./../Dashboard";
import MatchesComponent from './matches';
import MatchesHeader from "./matchesHeader";

const MatchesPage = () => {
  const [selectedTab, setSelectedTab] = useState("Upcoming");

  return (
    <div className="p-6">
      {/* Header with Tabs & Filters */}
      <div>
        <MatchesHeader selectedTab={selectedTab} setSelectedTab={setSelectedTab} />
      </div>
      {/* Render Content Based on Selected Tab */}
      <div className="mt-6">
        {selectedTab === "Upcoming" && <MatchesComponent name="Upcoming Matches"/>}
        {selectedTab === "Previous" && <MatchesComponent name="Previous Matches"/>}
        {selectedTab === "Cancelled" && <MatchesComponent name="Cancelled Matches"/>}
      </div>
    </div>
  );
};

export default MatchesPage;
