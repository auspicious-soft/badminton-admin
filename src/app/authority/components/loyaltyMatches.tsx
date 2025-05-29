import React, { useState } from "react";
import Image from "next/image";
import { Button } from "@mui/material";
import Coins from "@/assets/images/coins.png";
import { TiltedArrowIcon } from "@/utils/svgicons";
import { toast } from "sonner";

// Define the loyalty points interface
interface LoyaltyPoints {
  rewardCoins: number;
  rewardPointPerMatch: number;
  rewardTarget: number;
}

const LoyaltyCard = () => {
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loyaltyPoints, setLoyaltyPoints] = useState<LoyaltyPoints>({
    rewardCoins: 400,
    rewardPointPerMatch: 200,
    rewardTarget: 2000
  });

  const handleOpen = () => setOpen(true);
  const handleClose = () => {setOpen(false); setLoyaltyPoints({
    rewardCoins: 0,
    rewardPointPerMatch: 0,
    rewardTarget: 0
  })};

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setLoyaltyPoints(prev => ({
      ...prev,
      [name]: parseInt(value) || 0
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      // API call to update loyalty points
      const response = await fetch('/api/admin/loyalty-points', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(loyaltyPoints),
      });

      if (!response.ok) {
        throw new Error('Failed to update loyalty points');
      }

      toast.success('Loyalty points updated successfully');
      handleClose();
    } catch (error) {
      console.error('Error updating loyalty points:', error);
      toast.error(error.message || 'Something went wrong');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <div className="bg-[#1c2329] text-white p-3 sm:p-4 md:p-5 rounded-xl flex flex-col xs:flex-row items-center gap-2 sm:gap-4 shadow-lg w-full min-w-0">
        <div className="w-[60px] xs:w-[80px] sm:w-[100px] md:w-[117px] flex-shrink-0">
          <Image
            src={Coins}
            alt="Coins"
            width={117}
            height={73}
            className="w-full h-auto object-contain"
          />
        </div>

        <div className="flex flex-col flex-1 items-center xs:items-start text-center xs:text-left min-w-0">
          <h3 className="text-sm xs:text-base sm:text-lg font-semibold truncate w-full">
            Manage Loyalty Points
          </h3>
          <p className="text-xs sm:text-sm text-gray-400 w-full">
            Manage what reward is being given to the users.
          </p>
          <Button
            variant="contained"
            onClick={handleOpen}
            sx={{
              backgroundColor: "white",
              color: "#10375C",
              borderRadius: "30px",
              marginTop: "10px",
              textTransform: "none",
              padding: {
                xs: '4px 10px',
                sm: '6px 12px',
                md: '8px 16px'
              },
              fontSize: {
                xs: '0.7rem',
                sm: '0.75rem',
                md: '0.875rem'
              },
              minWidth: 'auto',
              "&:hover": { backgroundColor: "#ddd" },
            }}
          >
            <span className="whitespace-nowrap">Manage Points</span>
            <div className="rounded-[50px] bg-[#10375C] ml-2 flex-shrink-0">
              <TiltedArrowIcon stroke={"white"} />
            </div>
          </Button>
        </div>
      </div>

      {/* Loyalty Points Modal */}
      {open && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-[20px] w-[95%] max-w-[480px] px-[28px] py-[30px] shadow-lg">
            <h2 className="text-[#1B2229] text-lg font-semibold  leading-snug mb-6">Loyalty Points</h2>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-gray-700 mb-2">Reward Coins</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500">₹</span>
                  <input
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    name="rewardCoins"
                    value={loyaltyPoints.rewardCoins}
                    onChange={handleChange}
                    placeholder="400"
                    className="w-full h-[50px] pl-8 pr-4 py-2 bg-[#f4f5f7] rounded-[50px] border focus:border-[#176dbf] focus:ring-blue-400 text-gray-700 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-700 mb-2">Reward Point Per match</label>
                <div className="relative">
                  <input
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    name="rewardPointPerMatch"
                    value={loyaltyPoints.rewardPointPerMatch}
                    onChange={handleChange}
                    placeholder="200"
                    className="w-full h-[50px] px-4 py-2 bg-[#f4f5f7] rounded-[50px] border focus:border-[#176dbf] focus:ring-blue-400 text-gray-700 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  />
                  <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500">points</span>
                </div>
              </div>

              <div>
                <label className="block text-gray-700 mb-2">Reward Target</label>
                <div className="relative">
                  <input
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    name="rewardTarget"
                    value={loyaltyPoints.rewardTarget}
                    onChange={handleChange}
                    placeholder="2000"
                    className="w-full h-[50px] px-4 py-2 bg-[#f4f5f7] rounded-[50px] border focus:border-[#176dbf] focus:ring-blue-400 text-gray-700 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  />
                  <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500">Points</span>
                </div>
              </div>

              <div className="pt-4 flex gap-2">
                <button
                  onClick={handleClose}
                  className="w-[40%] h-[50px] border border-[#10375C] text-[#10375C] rounded-[50px]  transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full h-[50px] bg-[#10375C] text-white rounded-[50px] hover:bg-[#0a2c4a] transition-colors"
                >
                  {isSubmitting ? "Updating..." : "Update"}
                </button>
              </div>
            </form>

            <button
              onClick={handleClose}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default LoyaltyCard;
