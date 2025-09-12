import React, { useState, useTransition, useEffect } from "react";
import EquipmentImage from "@/assets/images/EquipmentImage.png";
import Image from "next/image";
import { updateEquipment } from "@/services/admin-services";
import { toast } from "sonner";

export default function EquipmentUpdateModal({ open, setOpen, bookingId, selectedMatch, mutate }) {
  
  // Combine all players from team1 and team2
  const allPlayers = [
    ...(selectedMatch?.team1 || []),
    ...(selectedMatch?.team2 || [])
  ];

  const [isPending, startTransition] = useTransition();
  
  // Initialize players state based on actual player data
  const initializePlayersState = () => {
    const initialState = {};
    allPlayers.forEach((player, index) => {
      const playerKey = player.playerType;
      initialState[playerKey] = {
        rackets: player?.rackets || 0,
        balls: player?.balls || 0
      };
    });
    return initialState;
  };

  const [players, setPlayers] = useState(initializePlayersState());
  console.log('players-------: ', players);

  // Check if any field has a value to enable/disable the update button
  const hasAnyEquipment = Object.values(players as any).some(
    (player: any ) => (player?.rackets !== null && player?.rackets > 0) || (player?.balls !== null && player?.balls > 0)
  );
 useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    // Cleanup function to restore scroll when component unmounts
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  if (!open) return null;

  const handleInputChange = (player, field, value) => {
    setPlayers((prev) => ({
      ...prev,
      [player]: {
        ...prev[player],
        [field]: parseInt(value) || 0,
      },
    }));
  };

  const handleConfirm = () => {
    startTransition(async () => {
      try {
        const hasValidInput = Object.values(players).some(
          (player: any) => player.rackets > 0 || player.balls > 0
        );
        if (hasValidInput) {
          const payload = {
            bookingId,
            ...players,
          };
          const response = await updateEquipment("/admin/add-rented-items", payload);
          toast.success("Equipment updated successfully");
          mutate()
          setTimeout(() => {
            setOpen(false);
            setPlayers(initializePlayersState());
          }, 2000);
        } else {
          toast.error("Please enter at least one equipment item for any player");
        }
      } catch (error) {
        console.log("error", error);
        toast.error(error?.response?.data?.message || "Failed to update equipment");
      }
    });
  };

  const handleCancel = () => {
    setOpen(false);
    setPlayers(initializePlayersState());
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm w-full z-50">
      <div className="bg-white rounded-3xl shadow-2xl w-[90%] max-w-[700px] mx-4 overflow-hidden">
        {/* Header Section */}
        <div className=" px-4 py-4">
          {/* <div className="flex items-center justify-center mb-2">
            <div className="bg-white/20 rounded-full p-3">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.78 0-2.678-2.153-1.415-3.414l5-5A2 2 0 009 9.586V5L8 4z" />
              </svg>
            </div>
          </div> */}
          <h2 className="text-center text-[#10375c] text-2xl font-bold">
            Update Equipment Rental
          </h2>
          <p className="text-center text-[#10375c] text-sm mt-1">
            Modify equipment allocations for match players
          </p>
        </div>

        {/* Content Section */}
        <div className="px-4 py-2 max-h-[60vh] overflow-y-auto">
          <div className="space-y-6">
            {allPlayers.map((player, index) => {
              const playerKey = player?.playerType;
              const playerName = player?.userData?.fullName || `Player ${index + 1}`;
              
              return (
                <div key={playerKey} className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-2xl p-6 border border-gray-200 hover:shadow-md transition-all duration-200">
                  <div className="flex items-center mb-4">
                    <div className="bg-[#10375c] text-white rounded-full w-10 h-10 flex items-center justify-center font-semibold text-sm mr-3">
                      {index + 1}
                    </div>
                    <div>
                      <h4 className="text-[#10375c] text-lg font-semibold">
                        {playerName}
                      </h4>
                      <p className="text-gray-600 text-sm">Equipment Allocation</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="flex items-center text-sm font-semibold text-gray-700">
                        <svg className="w-4 h-4 mr-2 text-[#10375c]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                        Rackets
                      </label>
                      <div className="relative">
                        <input
                          type="number"
                          min="0"
                          value={players[playerKey]?.rackets || 0}
                          onChange={(e) => handleInputChange(playerKey, "rackets", e.target.value)}
                          className="w-full h-12 px-4 py-3 bg-white rounded-xl border-2 border-gray-200 focus:border-[#176dbf] focus:ring-0 text-gray-700 font-medium transition-colors duration-200 text-center"
                          aria-label={`Rackets for ${playerName}`}
                        />
                        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                          <span className="text-gray-400 text-xs font-medium">QTY</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <label className="flex items-center text-sm font-semibold text-gray-700">
                        <svg className="w-4 h-4 mr-2 text-[#10375c]" fill="currentColor" viewBox="0 0 24 24">
                          <circle cx="12" cy="12" r="10" />
                        </svg>
                        Balls
                      </label>
                      <div className="relative">
                        <input
                          type="number"
                          min="0"
                          value={players[playerKey]?.balls || 0}
                          onChange={(e) => handleInputChange(playerKey, "balls", e.target.value)}
                          className="w-full h-12 px-4 py-3 bg-white rounded-xl border-2 border-gray-200 focus:border-[#176dbf] focus:ring-0 text-gray-700 font-medium transition-colors duration-200 text-center"
                          aria-label={`Balls for ${playerName}`}
                        />
                        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                          <span className="text-gray-400 text-xs font-medium">QTY</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer Section */}
        <div className="bg-gray-50 px-8 py-6 border-t border-gray-200">
          <div className="flex gap-4">
            <button
              className={`flex-1 h-12 ${
                hasAnyEquipment 
                  ? "h-12 w-full bg-[#10375c] text-white rounded-[28px] text-sm font-medium shadow-lg hover:shadow-xl"
                  : "bg-gray-300 text-gray-500 cursor-not-allowed"
              } rounded-xl font-semibold flex items-center justify-center transition-all duration-200`}
              onClick={handleConfirm}
              disabled={isPending || !hasAnyEquipment}
            >
              {isPending ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-t-transparent border-white mr-2"></div>
                  Updating...
                </>
              ) : (
                <>
                  {/* <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg> */}
                  Update Equipment
                </>
              )}
            </button>
            <button
              className="flex-1 h-12 bg-white hover:bg-gray-50 border-2 border-gray-300 text-gray-700 font-semibold rounded-xl flex items-center justify-center transition-all duration-200"
              onClick={handleCancel}
              disabled={isPending}
            >
              {/* <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg> */}
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
