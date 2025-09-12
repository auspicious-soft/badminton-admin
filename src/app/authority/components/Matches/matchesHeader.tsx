"use client";
import { useState, useRef, useEffect } from "react";
import { UpArrowIcon, DownArrowIcon } from "@/utils/svgicons";
import useSWR from "swr";
import { getAllCities } from "@/services/admin-services";
import BookingModal from "./BookMatchModal";
import { useSession } from "next-auth/react";

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
  const [isModalOpen, setIsModalOpen] = useState(false);
    const { data: session, status } = useSession();
  const venueId = status === "authenticated" ? (session as any)?.user?.venueId : undefined;
  const { data, mutate, isLoading } = useSWR("/admin/get-cities", getAllCities)
  const { data: venuesData } = useSWR(
    `/admin/inventory`,
    getAllCities
  );
  
  const venueDropDown = venuesData?.data?.data?.venues || [];
  
  const cities = data?.data?.data || [];

  // Get courts for the selected venue
  const selectedVenueData = venueDropDown.find(venue => venue._id === selectedCity);
  const venue = venueId !== "null" ? venueId : selectedCity

    const { data: courtData } = useSWR(
      venue ? `admin/court-list?venueId=${venue}` :null,
      getAllCities
    );
  const availableCourts = courtData?.data?.data || [];

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
    // Reset court selection when venue changes
    if (value === "All" || value === null) {
      setSelectedGame(null);
    }
    setCityDropdown(false);
  };


  useEffect(() => {
    if (isModalOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isModalOpen]);

  return (
    <div className=" relative">
      <p className="text-[#10375c] text-3xl font-semibold">Matches</p>
      <div className="flex justify-between">
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
          {/* Venue Dropdown */}
          {venueId === "null" && 
          <div className="relative" ref={cityDropdownRef}>
            <button className="flex h-10 px-5 py-3 bg-[#1b2229] text-white rounded-[28px]" onClick={() => setCityDropdown(!cityDropdown)}>
              {selectedCity ? (venueDropDown.find(venue => venue._id === selectedCity)?.name || "Venue") : "Venue"}
              <span className="ml-2">
                {!cityDropdown ? <DownArrowIcon /> : <UpArrowIcon />}
              </span>
            </button>
            {cityDropdown &&  (
              <div className="z-50 w-[220px] flex flex-col gap-[5px] h-[110px] overflow-y-auto overflo-custom absolute top-12  p-[20px] bg-white rounded-[10px] shadow-[0px_4px_20px_0px_rgba(92,138,255,0.10)]">
                <label className="w-full flex gap-[5px] cursor-pointer text-[#1b2229] text-sm font-medium">
                  <input
                    type="radio"
                    name="city"
                    value=""
                    checked={selectedCity === null}
                    onChange={(e) => handleCityChange("All")}
                    className="mr-2"
                  />
                  All
                </label>
                {venueDropDown.map((venue: any) => (
                  <label key={venue._id} className="w-full flex gap-[5px] cursor-pointer text-[#1b2229] text-sm font-medium">
                    <input
                      type="radio"
                      name="city"
                      value={venue._id}
                      checked={selectedCity === venue._id}
                      onChange={(e) => handleCityChange(e.target.value)}
                      className="mr-2"
                    />
                    {venue.name}
                  </label>
                ))}
              </div>
            )}
          </div>
          }

          {/* Court Dropdown - Only show when a venue is selected */}
          {selectedCity!== "null" && availableCourts.length > 0 && (
            <div className="relative" ref={gameDropdownRef}>
              <button className="flex h-10 px-5 py-3 bg-[#1b2229] text-white rounded-[28px]" onClick={() => setGameDropdown(!gameDropdown)}>
                {selectedGame ? (availableCourts.find(court => court._id === selectedGame)?.name || "Court") : "Court"}
                <span className="ml-2">{!gameDropdown ? <DownArrowIcon /> : <UpArrowIcon />}</span>
              </button>
              {gameDropdown && (
                <div className="z-50 flex flex-col gap-[5px] absolute top-12 left-0 p-[20px] w-[200px] bg-white rounded-[10px] shadow-[0px_4px_20px_0px_rgba(92,138,255,0.10)]">
                  <label className="flex gap-[10px] cursor-pointer text-[#1b2229] text-sm font-medium">
                    <input
                      type="radio"
                      name="game"
                      value=""
                      checked={!selectedGame}
                      onChange={(e) => handleGameChange("All")}
                      className="bg-[#1b2229]"
                    />
                    All
                  </label>
                  {availableCourts.map((court: any) => (
                    <label key={court._id} className="flex gap-[10px] cursor-pointer text-[#1b2229] text-sm font-medium">
                      <input
                        type="radio"
                        name="game"
                        value={court._id}
                        checked={selectedGame === court._id}
                        onChange={(e) => handleGameChange(e.target.value)}
                        className="bg-[#1b2229]"
                      />
                      {court.name} ({court.games || ""})
                    </label>
                  ))}
                </div>
              )}
            </div>
          )}

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
        </div>
      </div>

           <div>
          <button className="h-10 px-5 py-3 bg-[#1b2229] text-white rounded-[28px] w-fit flex items-center justify-between" onClick={() => setIsModalOpen(true)}>
            <span>Create a New Booking</span>
          </button>
        </div>
      </div>
      {isModalOpen && <BookingModal onClose={() => setIsModalOpen(false)} />}
    </div>
  );
};

export default MatchesHeader;