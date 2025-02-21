import React from "react";
import Image from "next/image";
import { Button } from "@mui/material";
import Coins from "@/assets/images/coins.png"
import Profile from "@/assets/images/profile.webp";
import { DashbordStat1Icon, DashbordPickleBallIcon, DashbordPadelBallIcon, DashbordRupeeIcon, ViewEyeIcon, TiltedArrowIcon } from "@/utils/svgicons";

// import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

const LoyaltyCard = () => {
  return (
    <div className="bg-[#1c2329] text-white p-5 rounded-xl flex items-center gap-4 shadow-lg w-full">
      <Image src={Coins} alt="Coins" width={117} height={73}  />
      <div className="flex flex-col flex-1">
        <h3 className="text-lg font-semibold">Manage Loyalty Points</h3>
        <p className="text-sm text-gray-400">
          Manage what reward is being given to the users.
        </p>
        <Button
          variant="contained"
        //   endIcon={<ArrowForwardIcon />}
          sx={{
            backgroundColor: "white",
            color: "#10375C",
            borderRadius: "30px",
            marginTop: "10px",
            textTransform: "none",
            "&:hover": { backgroundColor: "#ddd" },
          }}
        >
          Manage Points
          <div className="rounded-[50px] bg-[#10375C] ml-2">
              <TiltedArrowIcon stroke={"white"}/>
            </div>
        </Button>
      </div>
    </div>
  );
};

export default LoyaltyCard;
