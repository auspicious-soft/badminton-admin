"use client";
import { useState, useRef, useEffect } from "react";
import { UpArrowIcon, DownArrowIcon, PlusIcon } from "@/utils/svgicons";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

const tabs = ["Orders", "Products", "Inventory"];
const games = ["All","Newest", "Oldest"];
const cities = ["All","Pending", "Cancelled","Ready", "Confirmed" , "Delivered" ];

// Mapping objects for API values
const gameValueMap: { [key: string]: string } = {
  "All":"",
  "Newest": "desc",
  "Oldest": "asc"
};

const cityValueMap: { [key: string]: string } = {
  "All": "",
  "Pending": "pending",
  "Cancelled": "cancelled",
  "Ready": "ready",
  "Confirmed": "confirmed",
  "Delivered": "delivered"
};

interface MatchesHeaderProps {
  selectedTab: string;
  setSelectedTab: (tab: string) => void;
  selectedGame: string;
  setSelectedGame: (tab: string) => void;
  selectedCity: string;
  setSelectedCity: (tab: string) => void;
  onSortChange?: (sortValue: string) => void;
  onStatusChange?: (statusValue: string) => void;
}

const MerchandiseHeader: React.FC<MatchesHeaderProps> = ({ selectedTab, setSelectedTab, onSortChange, onStatusChange, selectedGame, setSelectedGame,setSelectedCity, selectedCity }) => {
  const [gameDropdown, setGameDropdown] = useState(false);
  const [cityDropdown, setCityDropdown] = useState(false);
  const gameDropdownRef = useRef<HTMLDivElement>(null);
  const cityDropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const { data, status } = useSession();
  const userRole = (data as any )?.user?.role; 
  // Click outside to close dropdowns
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
  const handleAddProduct = () => {
    router.push('/authority/merchandises/add');
  }
  return (
    <div className="space-y-[10px] relative w-full md:w-[65%]">
      <p className="text-[#10375c] text-3xl font-semibold">Merchandise</p>
      <div className="flex w-full justify-between flex-wrap gap-[15px]">
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
        {selectedTab==="Orders" &&
        <div className="flex gap-[5px] relative">

          <div className="relative" ref={gameDropdownRef}>
            <button className="flex h-10 px-5 py-3 bg-[#1b2229] text-white rounded-[28px]" onClick={() => setGameDropdown(!gameDropdown)}>
              {/* {getDisplayValueFromApiValue(selectedGame, true) || "Sort"} */}
              {selectedGame === "" ? "Sort" : getDisplayValueFromApiValue(selectedGame, true)}
              <span className="ml-2">{!gameDropdown ? <DownArrowIcon /> : <UpArrowIcon />}</span>
            </button>
            {gameDropdown && (
              <div className="z-50 h-fit flex flex-col gap-[5px] absolute top-12 left-0  p-[20px] w-[168px]  bg-white rounded-[10px] shadow-[0px_4px_20px_0px_rgba(92,138,255,0.10)]">
                {games.map((game) => (
                  <label key={game} className="flex gap-[10px] cursor-pointer text-[#1b2229] text-sm font-medium ">
                    <input
                      type="radio"
                      name="game"
                      value={game}
                      checked={selectedGame === gameValueMap[game]}
                      onChange={(e) => {
                        const displayValue = e.target.value;
                        const apiValue = gameValueMap[displayValue];
                        setSelectedGame(apiValue); // Set API value to state
                        console.log("Selected Game Display:", displayValue);
                        console.log("Selected Game API Value:", apiValue);
                        onSortChange?.(apiValue);
                        setGameDropdown(false);
                      }}
                      className="bg-[#1b2229]"
                    />
                    {game}
                  </label>
                ))}
              </div>
            )}
          </div>


          <div className="relative w-full " ref={cityDropdownRef}>
            <button className="w-[180px] flex justify-between h-10 px-5 py-3 bg-[#1b2229] text-white rounded-[28px]" onClick={() => setCityDropdown(!cityDropdown)}>
              {/* {getDisplayValueFromApiValue(selectedCity, false) || "Status"} */}
              {selectedCity === "" ? "Status" : getDisplayValueFromApiValue(selectedCity, false)}

              <span className="">
                {!cityDropdown ? <DownArrowIcon /> : <UpArrowIcon />}
              </span>
            </button>
            {cityDropdown && (
              <div className="z-50 h-fit flex flex-col gap-[5px] absolute top-12 right-2  p-[20px] w-[160px] h-[100] bg-white rounded-[10px] shadow-[0px_4px_20px_0px_rgba(92,138,255,0.10)]">
                {cities.map((city) => (
                  <label key={city} className="flex gap-[10px] cursor-pointer text-[#1b2229] text-sm font-medium">
                    <input
                      type="radio"
                      name="city"
                      value={city}
                      checked={selectedCity === cityValueMap[city]}
                      onChange={(e) => {
                        const displayValue = e.target.value;
                        const apiValue = cityValueMap[displayValue];
                        setSelectedCity(apiValue); // Set API value to state
                        console.log("Selected Status Display:", displayValue);
                        console.log("Selected Status API Value:", apiValue);
                        onStatusChange?.(apiValue);
                        setCityDropdown(false);
                      }}
                      className="mr-2"
                    />
                    {city}
                    <span className="ml-2"></span>
                  </label>
                ))}
              </div>
            )}
          </div>
        </div>
}
        {/* {selectedTab==="Orders" && <button className="flex items-center h-10 gap-[10px] px-5 py-3 bg-[#1b2229] rounded-[28px] text-white text-sm font-medium "><PlusIcon /> Record A New Sale</button>} */}
        {(selectedTab==="Inventory" && userRole !== "employee") && <button onClick={()=>{handleAddProduct()}} className="flex items-center h-10 gap-[10px] px-5 py-3 bg-[#1b2229] rounded-[28px] text-white text-sm font-medium "><PlusIcon /> Add New Product</button>}
      </div>
    </div>
  );
};

// Helper functions to convert between display and API values
const getDisplayValueFromApiValue = (apiValue: string, isGame: boolean): string => {
  if (isGame) {
    return Object.keys(gameValueMap).find(key => gameValueMap[key] === apiValue) || "";
  } else {
    return Object.keys(cityValueMap).find(key => cityValueMap[key] === apiValue) || "";
  }
};

// Export helper function to get display value from API value
export const getDisplayFromApiValue = (apiValue: string, isGame: boolean): string => {
  return getDisplayValueFromApiValue(apiValue, isGame);
};

// Export helper functions to get API values
export const getSortApiValue = (displayValue: string): string => {
  return gameValueMap[displayValue] || "";
};

export const getStatusApiValue = (displayValue: string): string => {
  return cityValueMap[displayValue] || "";
};

// Export mapping objects for external use
export { gameValueMap, cityValueMap };

export default MerchandiseHeader;