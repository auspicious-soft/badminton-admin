// import React from "react";
// import Image from "next/image";
// import { Button } from "@mui/material";
// import Coins from "@/assets/images/coins.png"
// import Profile from "@/assets/images/profile.webp";
// import { DashbordStat1Icon, DashbordPickleBallIcon, DashbordPadelBallIcon, DashbordRupeeIcon, ViewEyeIcon, TiltedArrowIcon } from "@/utils/svgicons";

// // import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

// const LoyaltyCard = () => {
//   return (
//     <div className="bg-[#1c2329] text-white p-5 rounded-xl flex items-center gap-4 shadow-lg w-full">
//       <Image src={Coins} alt="Coins" width={117} height={73}  />
//       <div className="flex flex-col flex-1">
//         <h3 className="text-lg font-semibold">Manage Loyalty Points</h3>
//         <p className="text-sm text-gray-400">
//           Manage what reward is being given to the users.
//         </p>
//         <Button
//           variant="contained"
//         //   endIcon={<ArrowForwardIcon />}
//           sx={{
//             backgroundColor: "white",
//             color: "#10375C",
//             borderRadius: "30px",
//             marginTop: "10px",
//             textTransform: "none",
//             "&:hover": { backgroundColor: "#ddd" },
//           }}
//         >
//           Manage Points
//           <div className="rounded-[50px] bg-[#10375C] ml-2">
//               <TiltedArrowIcon stroke={"white"}/>
//             </div>
//         </Button>
//       </div>
//     </div>
//   );
// };

// export default LoyaltyCard;


// import React from "react";
// import Image from "next/image";
// import { Button } from "@mui/material";
// import Coins from "@/assets/images/coins.png";
// import Profile from "@/assets/images/profile.webp";
// import { DashbordStat1Icon, DashbordPickleBallIcon, DashbordPadelBallIcon, DashbordRupeeIcon, ViewEyeIcon, TiltedArrowIcon } from "@/utils/svgicons";

// const LoyaltyCard = () => {
//   return (
//     <div className="bg-[#1c2329] text-white p-3 sm:p-4 md:p-5 rounded-xl flex flex-col sm:flex-row items-center gap-2 sm:gap-4 shadow-lg w-full">
//       <div className="w-[80px] sm:w-[117px]">
//         <Image 
//           src={Coins} 
//           alt="Coins" 
//           width={117} 
//           height={73} 
//           className="w-full h-auto"
//         />
//       </div>
      
//       <div className="flex flex-col flex-1 items-center sm:items-start text-center sm:text-left">
//         <h3 className="text-base sm:text-lg font-semibold">Manage Loyalty Points</h3>
//         <p className="text-xs sm:text-sm text-gray-400">
//           Manage what reward is being given to the users.
//         </p>
//         <Button
//           variant="contained"
//           sx={{
//             backgroundColor: "white",
//             color: "#10375C",
//             borderRadius: "30px",
//             marginTop: "10px",
//             textTransform: "none",
//             padding: {
//               xs: '6px 12px',
//               sm: '8px 16px'
//             },
//             fontSize: {
//               xs: '0.75rem',
//               sm: '0.875rem'
//             },
//             "&:hover": { backgroundColor: "#ddd" },
//           }}
//         >
//           Manage Points
//           <div className="rounded-[50px] bg-[#10375C] ml-2">
//             <TiltedArrowIcon stroke={"white"}/>
//           </div>
//         </Button>
//       </div>
//     </div>
//   );
// };

// export default LoyaltyCard;


import React from "react";
import Image from "next/image";
import { Button } from "@mui/material";
import Coins from "@/assets/images/coins.png";
import Profile from "@/assets/images/profile.webp";
import { DashbordStat1Icon, DashbordPickleBallIcon, DashbordPadelBallIcon, DashbordRupeeIcon, ViewEyeIcon, TiltedArrowIcon } from "@/utils/svgicons";

const LoyaltyCard = () => {
  return (
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
  );
};

export default LoyaltyCard;