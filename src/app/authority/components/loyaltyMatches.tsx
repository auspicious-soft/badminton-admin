import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Button } from "@mui/material";
import Coins from "@/assets/images/coins.png";
import { TiltedArrowIcon } from "@/utils/svgicons";
import { toast } from "sonner";
import { updateLoyaltyPoints, updateReferralSettings, getLoyaltyPoints, getReferralSettings } from "@/services/admin-services";
import { useSession } from "next-auth/react";

// Define the loyalty points interface
interface LoyaltyPoints {
  rewardType: string;
  enabled: string;
  bonusAmount: number;
  playCoinAmount: number;
  limit: number;
  perMatch: number;
  freeGameAmount: number;
}

// Reward type options
const REWARD_TYPES = [
  { value: "referral", label: "Referral" },
  { value: "freeGame", label: "Free Game" }
];

// Enabled options
const ENABLED_OPTIONS = [
  { value: "yes", label: "Yes" },
  { value: "no", label: "No" }
];

const LoyaltyCard = () => {
  const { data: session } = useSession();
  const userRole = (session as any )?.user?.role; 

  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loyaltyPoints, setLoyaltyPoints] = useState<LoyaltyPoints>({
    rewardType: "",
    enabled: "",
    bonusAmount: 0,
    playCoinAmount: 0,
    limit: 0,
    perMatch: 0,
    freeGameAmount: 0
  });
  const handleOpen = () => {
    setOpen(true);
    // Prevent background scrolling
    document.body.style.overflow = 'hidden';
  };

  const handleClose = () => {
    setOpen(false);
    // Restore background scrolling
    document.body.style.overflow = 'unset';
    setLoyaltyPoints({
      rewardType: "",
      enabled: "",
      bonusAmount: 0,
      playCoinAmount: 0,
      limit: 0,
      perMatch: 0,
      freeGameAmount: 0
    });
  };
const fetchAllLoyaltyData = async () => {
  try {
    const [referralRes, freeGameRes] = await Promise.all([
      getReferralSettings(),
      getLoyaltyPoints()
    ]);

    const referralData = referralRes?.data?.data?.data || referralRes?.data?.data || referralRes?.data || {};
    const freeGameData = freeGameRes?.data?.data?.data || freeGameRes?.data?.data || freeGameRes?.data || {};

    const mergedData: LoyaltyPoints = {
      rewardType: '', 
      enabled: referralData.enabled ? 'yes' : (freeGameData.enabled ? 'yes' : 'no'),
      bonusAmount: referralData.bonusAmount || 0,
      playCoinAmount: 0, // not used currently
      limit: freeGameData.limit || 0,
      perMatch: freeGameData.perMatch || 0,
      freeGameAmount: freeGameData.freeGameAmount || 0
    };

    setLoyaltyPoints(mergedData);
  } catch (error) {
    console.error("Failed to fetch loyalty settings:", error);
  }
};
useEffect(() => {
  fetchAllLoyaltyData();
}, []);
  const handleChange = async (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;

    if (name === 'rewardType') {
      // Reset form when reward type changes
      setLoyaltyPoints({
        rewardType: value,
        enabled: "",
        bonusAmount: 0,
        playCoinAmount: 0,
        limit: 0,
        perMatch: 0,
        freeGameAmount: 0
      });

      // Fetch data based on selected reward type
      if (value) {
        try {
          let response;
          if (value === 'freeGame') {
            response = await getLoyaltyPoints();
          } else if (value === 'referral') {
            response = await getReferralSettings();
          }

          

          if (response?.status === 200) {
            // Try different possible data structures
            const data = response?.data?.data?.data || response?.data?.data || response?.data;

            if (data && value === 'freeGame') {
              setLoyaltyPoints(prev => ({
                ...prev,
                enabled: data.enabled ? 'yes' : 'no',
                limit: data.limit || 0,
                perMatch: data.perMatch || 0,
                freeGameAmount: data.freeGameAmount || 0
              }));
            } else if (data && value === 'referral') {
              setLoyaltyPoints(prev => ({
                ...prev,
                enabled: data.enabled ? 'yes' : 'no',
                bonusAmount: data.bonusAmount || 0
              }));
            } else {
              console.log('No data found in response');
            }
          } else {
            console.log('Invalid response status or structure');
          }
        } catch (error) {
          console.error('Error fetching reward settings:', error);
          // Continue with empty form if fetch fails
        }
      }
    } else {
      setLoyaltyPoints(prev => ({
        ...prev,
        [name]: name === 'enabled' ? value : (parseInt(value) || 0)
      }));
    }
  };

  // Cleanup effect to restore scrolling when component unmounts
  useEffect(() => {
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      let response;
      let payload = {};

      // Determine API service and payload based on reward type
      if (loyaltyPoints.rewardType === 'freeGame') {
        payload = {
          enabled: loyaltyPoints.enabled === 'yes',
          limit: loyaltyPoints.limit,
          perMatch: loyaltyPoints.perMatch,
          freeGameAmount: loyaltyPoints.freeGameAmount
        };
        response = await updateLoyaltyPoints(payload);
      } else if (loyaltyPoints.rewardType === 'referral') {
        payload = {
          enabled: loyaltyPoints.enabled === 'yes',
          bonusAmount: loyaltyPoints.bonusAmount
        };
        response = await updateReferralSettings(payload);
      } else {
        throw new Error('Please select a reward type');
      }

      // Check response status
      if (response?.status === 200 || response?.status === 201) {
        toast.success(`${loyaltyPoints.rewardType === 'freeGame' ? 'Loyalty Points' : 'Referral'} settings updated successfully`);
        handleClose();
      } else {
        throw new Error('Failed to update reward settings');
      }
    } catch (error: any) {
      console.error('Error updating reward settings:', error);
      toast.error(error?.response?.data?.message || error?.message || 'Something went wrong');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <div className="bg-[#1c2329] text-white p-3 py-[20px] sm:p-4 md:p-5 rounded-xl flex flex-col xs:flex-row items-center gap-2 sm:gap-4 shadow-lg w-full min-w-0">
        <div className="w-[60px] xs:w-[80px] sm:w-[100px] md:w-[117px] flex-shrink-0">
          <Image
            src={Coins}
            alt="Coins"
            width={117}
            height={73}
            className="w-full h-auto object-contain"
          />
        </div>

        <div className="w-full flex flex-col flex-1 items-center xs:items-start text-center xs:text-left min-w-0">
          <h3 className="text-sm xs:text-base sm:text-lg font-semibold truncate w-full">
           {userRole === "employee" ? "Loyalty Points" : "Manage Loyalty Points"}
          </h3>
          {userRole === "employee" ? 
          <div className="w-[80%] mt-[12px]">
          <div className="flex justify-between">
            <h6 className="text-xs font-medium " >Bonus Referral</h6>
            <h6 className="text-xs font-medium ">{loyaltyPoints.bonusAmount || "0"} Points</h6>
          </div>
          <div className="flex justify-between mt-[8px]">
            <h6 className="text-xs font-medium ">Free Game on</h6>
            <h6 className="text-xs font-medium ">{loyaltyPoints.limit || "0"} Points</h6>
          </div>
          </div>
          
          :
          <p className="text-xs sm:text-sm text-gray-400 w-full">
            Manage what reward is being given to the users.
          </p>
}
           {userRole !== "employee" &&
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
}
        </div>
      </div>

      {/* Loyalty Points Modal */}
      {open && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-[20px] w-[95%] max-w-[480px] max-h-[90vh] px-[28px] py-[30px] shadow-lg flex flex-col">
            <h2 className="text-[#1B2229] text-lg font-semibold leading-snug mb-6">Loyalty Points</h2>

            <form onSubmit={handleSubmit} className="flex-1 flex flex-col">
              <div className="flex-1 overflow-y-auto overflo-custom pr-2 space-y-5 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100" style={{ maxHeight: 'calc(90vh - 200px)' }}>
              {/* Reward Type Dropdown */}
              <div>
                <label className="block text-gray-700 mb-2">Reward Type</label>
                <div className="relative">
                  <select
                    name="rewardType"
                    value={loyaltyPoints.rewardType}
                    onChange={handleChange}
                    className="w-full h-[50px] px-4 py-2 bg-[#f4f5f7] rounded-[50px] border focus:border-[#176dbf] focus:ring-blue-400 text-gray-700 appearance-none cursor-pointer"
                  >
                    <option value="">Select Reward Type</option>
                    {REWARD_TYPES.map((type) => (
                      <option key={type.value} value={type.value}>
                        {type.label}
                      </option>
                    ))}
                  </select>
                  <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none">
                    <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Conditional Fields Based on Reward Type */}
              {loyaltyPoints.rewardType === "referral" && (
                <>
                  {/* Enabled Dropdown */}
                  <div>
                    <label className="block text-gray-700 mb-2">Enabled</label>
                    <div className="relative">
                      <select
                        name="enabled"
                        value={loyaltyPoints.enabled}
                        onChange={handleChange}
                        className="w-full h-[50px] px-4 py-2 bg-[#f4f5f7] rounded-[50px] border focus:border-[#176dbf] focus:ring-blue-400 text-gray-700 appearance-none cursor-pointer"
                      >
                        <option value="">Select Option</option>
                        {ENABLED_OPTIONS.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                      <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none">
                        <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                    </div>
                  </div>

                  {/* Bonus Amount */}
                  <div>
                    <label className="block text-gray-700 mb-2">Bonus Amount</label>
                    <input
                      type="text"
                      inputMode="numeric"
                      pattern="[0-9]*"
                      name="bonusAmount"
                      value={loyaltyPoints.bonusAmount || ""}
                      onChange={handleChange}
                      placeholder="50"
                      className="w-full h-[50px] px-4 py-2 bg-[#f4f5f7] rounded-[50px] border focus:border-[#176dbf] focus:ring-blue-400 text-gray-700 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    />
                  </div>
                </>
              )}

              {loyaltyPoints.rewardType === "freeGame" && (
                <>
                  {/* Play Coin Amount */}
                  {/* <div>
                    <label className="block text-gray-700 mb-2">Play Coin Amount</label>
                    <input
                      type="text"
                      inputMode="numeric"
                      pattern="[0-9]*"
                      name="playCoinAmount"
                      value={loyaltyPoints.playCoinAmount || ""}
                      onChange={handleChange}
                      placeholder="50"
                      className="w-full h-[50px] px-4 py-2 bg-[#f4f5f7] rounded-[50px] border focus:border-[#176dbf] focus:ring-blue-400 text-gray-700 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    />
                  </div> */}

                  {/* Enabled Dropdown */}
                  <div>
                    <label className="block text-gray-700 mb-2">Enabled</label>
                    <div className="relative">
                      <select
                        name="enabled"
                        value={loyaltyPoints.enabled}
                        onChange={handleChange}
                        className="w-full h-[50px] px-4 py-2 bg-[#f4f5f7] rounded-[50px] border focus:border-[#176dbf] focus:ring-blue-400 text-gray-700 appearance-none cursor-pointer"
                      >
                        <option value="">Select Option</option>
                        {ENABLED_OPTIONS.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                      <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none">
                        <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                    </div>
                  </div>

                  {/* Limit */}
                  <div>
                    <label className="block text-gray-700 mb-2">Limit</label>
                    <input
                      type="text"
                      inputMode="numeric"
                      pattern="[0-9]*"
                      name="limit"
                      value={loyaltyPoints.limit || ""}
                      onChange={handleChange}
                      placeholder="2000"
                      className="w-full h-[50px] px-4 py-2 bg-[#f4f5f7] rounded-[50px] border focus:border-[#176dbf] focus:ring-blue-400 text-gray-700 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    />
                  </div>

                  {/* Per Match */}
                  <div>
                    <label className="block text-gray-700 mb-2">Per Match</label>
                    <input
                      type="text"
                      inputMode="numeric"
                      pattern="[0-9]*"
                      name="perMatch"
                      value={loyaltyPoints.perMatch || ""}
                      onChange={handleChange}
                      placeholder="200"
                      className="w-full h-[50px] px-4 py-2 bg-[#f4f5f7] rounded-[50px] border focus:border-[#176dbf] focus:ring-blue-400 text-gray-700 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    />
                  </div>

                  {/* Free Game Amount */}
                  <div>
                    <label className="block text-gray-700 mb-2">Free Game Amount</label>
                    <input
                      type="text"
                      inputMode="numeric"
                      pattern="[0-9]*"
                      name="freeGameAmount"
                      value={loyaltyPoints.freeGameAmount || ""}
                      onChange={handleChange}
                      placeholder="1"
                      className="w-full h-[50px] px-4 py-2 bg-[#f4f5f7] rounded-[50px] border focus:border-[#176dbf] focus:ring-blue-400 text-gray-700 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    />
                  </div>
                </>
              )}
              </div>

              <div className="pt-4 flex gap-2 mt-4">
                <button
                  type="button"
                  onClick={handleClose}
                  className="w-[40%] h-[50px] border border-[#10375C] text-[#10375C] rounded-[50px] transition-colors"
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
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-xl"
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
