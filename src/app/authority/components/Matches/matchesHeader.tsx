"use client";
import { useState, useRef, useEffect } from "react";
import { UpArrowIcon, DownArrowIcon } from "@/utils/svgicons";
import useSWR from "swr";
import { getAllCities } from "@/services/admin-services";

const tabs = ["Upcoming", "Previous", "Cancelled"];
const games = ["All", "Padel", "Pickleball"];

interface MatchesHeaderProps {
  selectedTab: string;
  setSelectedTab: (tab: string) => void;
  selectedGame: string,
  setSelectedGame: any,
  selectedCity: string,
  setSelectedCity: any,
  selectedDate: string,
  setSelectedDate: any
}

const MatchesHeader: React.FC<MatchesHeaderProps> = ({ selectedTab, setSelectedTab, setSelectedGame, selectedGame, selectedCity, setSelectedCity, selectedDate, setSelectedDate }) => {
  const [gameDropdown, setGameDropdown] = useState(false);
  const [cityDropdown, setCityDropdown] = useState(false);
  const dateInputRef = useRef<HTMLInputElement>(null);
  const gameDropdownRef = useRef<HTMLDivElement>(null);
  const cityDropdownRef = useRef<HTMLDivElement>(null);
  const { data, mutate, isLoading } = useSWR("/admin/get-cities", getAllCities)
  const cities = data?.data?.data || [];
  console.log('data: ', data?.data?.data);
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (gameDropdownRef.current && !gameDropdownRef.current.contains(event.target as Node)) {
        setGameDropdown(false);
      }
      if (cityDropdownRef.current && !cityDropdownRef.current.contains(event.target as Node)) {
        setCityDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleGameChange = (value: string) => {
    setSelectedGame(value === "All" ? null : value);
    setGameDropdown(false);
  };

  const handleCityChange = (value: string) => {
    setSelectedCity(value === "All" ? null : value);
    setCityDropdown(false);
  };

  return (
    <div className="space-y-[10px] relative">
      <p className="text-[#10375c] text-3xl font-semibold">Matches</p>
      <div className="flex w-[65%] flex-col md:flex-row justify-between  flex-wrap gap-[15px]">
        {/* Tabs */}
        <div className="bg-white rounded-[44px] shadow-[0px_4px_20px_0px_rgba(92,138,255,0.10)] justify-start items-start inline-flex">
          {tabs.map((tab) => (
            <button
              key={tab}
              className={`h-10 px-5 py-3 rounded-[28px] justify-center items-center inline-flex ${selectedTab === tab ? "bg-[#1b2229] text-white" : "bg-white"}`}
              onClick={() => setSelectedTab(tab)}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Filters */}
        <div className="flex gap-[5px] relative">
          <div className="relative" ref={gameDropdownRef}>
            <button className="flex h-10 px-5 py-3 bg-[#1b2229] text-white rounded-[28px]" onClick={() => setGameDropdown(!gameDropdown)}>
              {selectedGame || "Game"}
              <span className="ml-2">{!gameDropdown ? <DownArrowIcon /> : <UpArrowIcon />}</span>
            </button>
            {gameDropdown && (
              <div className="z-50 flex flex-col gap-[5px] absolute top-12 left-0 p-[20px] w-[168px] bg-white rounded-[10px] shadow-[0px_4px_20px_0px_rgba(92,138,255,0.10)]">
                {games.map((game) => (
                  <label key={game} className="flex gap-[10px] cursor-pointer text-[#1b2229] text-sm font-medium">
                    <input
                      type="radio"
                      name="game"
                      value={game}
                      checked={(game === "All" && !selectedGame) || selectedGame === game}
                      onChange={(e) => handleGameChange(e.target.value)}
                      className="bg-[#1b2229]"
                    />
                    {game}
                  </label>
                ))}
              </div>
            )}
          </div>

          <div className="relative" onClick={() => dateInputRef.current?.showPicker()}>
            <button className="h-10 px-5 py-3 bg-[#1b2229] text-white rounded-[28px] w-full flex items-center justify-between">
              {selectedDate || "Select Date"}
              <span className="ml-2">
                {dateInputRef.current?.showPicker ? <DownArrowIcon /> : <UpArrowIcon />}
              </span>
            </button>
            <input
              ref={dateInputRef}
              type="date"
              className="absolute inset-0 opacity-0 w-full h-full cursor-pointer"
              value={selectedDate}
              onChange={(e) => {
                setSelectedDate(e.target.value);
              }}
            />
          </div>

          <div className="relative" ref={cityDropdownRef}>
            <button className="flex h-10 px-5 py-3 bg-[#1b2229] text-white rounded-[28px]" onClick={() => setCityDropdown(!cityDropdown)}>
              {selectedCity || "City"}
              <span className="ml-2">
                {!cityDropdown ? <DownArrowIcon /> : <UpArrowIcon />}
              </span>
            </button>
            {cityDropdown && (

              <div className="z-50 w-[220px] flex flex-col gap-[5px] h-[250px] overflow-y-auto overflo-custom absolute top-12 right-2 p-[20px] bg-white rounded-[10px] shadow-[0px_4px_20px_0px_rgba(92,138,255,0.10)]">
                {["All", ...cities.filter(city => city !== "All")].map((city) => (
                  <label key={city} className="w-full flex gap-[5px] cursor-pointer text-[#1b2229] text-sm font-medium">
                    <input
                      type="radio"
                      name="city"
                      value={city === "All" ? "" : city} // Set value to empty string for "All" (interpreted as null in handleCityChange)
                      checked={city === "All" ? selectedCity === null : selectedCity === city}
                      onChange={(e) => handleCityChange(e.target.value === "" ? null : e.target.value)}
                      className="mr-2"
                    />
                    {city}
                  </label>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MatchesHeader;
