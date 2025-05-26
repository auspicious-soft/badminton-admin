"use client";
import { useState, useRef, useEffect } from "react";
import { UpArrowIcon, DownArrowIcon, PlusIcon } from "@/utils/svgicons";
import { useRouter } from "next/navigation";

const tabs = ["Orders", "Products", "Inventory"];
const games = ["Padel", "Pickleball"];
const cities = ["Success", "Returned", "Cancelled"];

interface MatchesHeaderProps {
  selectedTab: string;
  setSelectedTab: (tab: string) => void;
}

const MerchandiseHeader: React.FC<MatchesHeaderProps> = ({ selectedTab, setSelectedTab }) => {
  const [selectedGame, setSelectedGame] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [gameDropdown, setGameDropdown] = useState(false);
  const [cityDropdown, setCityDropdown] = useState(false);
  const dateInputRef = useRef<HTMLInputElement>(null);
  const gameDropdownRef = useRef<HTMLDivElement>(null);
  const cityDropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

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
    router.push('/admin/merchandises/add');
  }
  return (
    <div className="space-y-[10px] relative">
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
              {selectedGame || "Sort"}
              <span className="ml-2">{!gameDropdown ? <DownArrowIcon /> : <UpArrowIcon />}</span>
            </button>
            {gameDropdown && (
              <div className="z-50 flex flex-col gap-[5px] absolute top-12 left-0  p-[20px] w-[168px] h-[81px] bg-white rounded-[10px] shadow-[0px_4px_20px_0px_rgba(92,138,255,0.10)]">
                {games.map((game) => (
                  <label key={game} className="flex gap-[10px] cursor-pointer text-[#1b2229] text-sm font-medium ">
                    <input
                      type="radio"
                      name="game"
                      value={game}
                      checked={selectedGame === game}
                      onChange={(e) => {
                        setSelectedGame(e.target.value);
                        console.log("Selected Game:", e.target.value);
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
              {selectedCity || "Status"}
              <span className="">
                {!cityDropdown ? <DownArrowIcon /> : <UpArrowIcon />}
              </span>
            </button>
            {cityDropdown && (
              <div className="z-50 flex flex-col gap-[5px] absolute top-12 right-2  p-[20px] w-[160px] h-[100] bg-white rounded-[10px] shadow-[0px_4px_20px_0px_rgba(92,138,255,0.10)]">
                {cities.map((city) => (
                  <label key={city} className="flex gap-[10px] cursor-pointer text-[#1b2229] text-sm font-medium">
                    <input
                      type="radio"
                      name="city"
                      value={city}
                      checked={selectedCity === city}
                      onChange={(e) => {
                        setSelectedCity(e.target.value);
                        console.log("Selected City:", e.target.value);
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
        {selectedTab==="Orders" && <button className="flex items-center h-10 gap-[10px] px-5 py-3 bg-[#1b2229] rounded-[28px] text-white text-sm font-medium "><PlusIcon /> Record A New Sale</button>}
        {selectedTab==="Inventory" &&<button onClick={()=>{handleAddProduct()}} className="flex items-center h-10 gap-[10px] px-5 py-3 bg-[#1b2229] rounded-[28px] text-white text-sm font-medium "><PlusIcon /> Add New Product</button>}
      </div>
    </div>
  );
};

export default MerchandiseHeader;