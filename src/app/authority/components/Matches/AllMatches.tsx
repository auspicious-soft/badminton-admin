
"use client";
import { useState } from "react";
import Dashboard from "./../Dashboard";
import MatchesComponent from './matches';
import MatchesHeader from "./matchesHeader";

const MatchesPage = () => {
  const [selectedTab, setSelectedTab] = useState("Upcoming");
  const [selectedGame, setSelectedGame] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [selectedDate, setSelectedDate] = useState("");

  return (
    <div className="">
      {/* Header with Tabs & Filters */}
      <div>
        <MatchesHeader selectedTab={selectedTab} setSelectedTab={setSelectedTab} selectedGame={selectedGame} setSelectedGame={setSelectedGame} selectedCity={selectedCity} setSelectedCity={setSelectedCity} setSelectedDate={setSelectedDate} selectedDate={selectedDate} />
      </div>
      {/* Render Content Based on Selected Tab */}
      <div className="mt-6 mb-6">
        {selectedTab === "Upcoming" && <MatchesComponent key="upcoming" name="Upcoming Matches" selectedDate={selectedDate} selectedCity={selectedCity} selectedGame={selectedGame} />}
        {selectedTab === "Previous" && <MatchesComponent key="previous" name="Previous Matches" selectedDate={selectedDate} selectedCity={selectedCity} selectedGame={selectedGame}/>}
        {selectedTab === "Cancelled" && <MatchesComponent key="cancelled" name="Cancelled Matches" selectedDate={selectedDate} selectedCity={selectedCity} selectedGame={selectedGame}/>}
      </div>
    </div>
  );
};

export default MatchesPage;
