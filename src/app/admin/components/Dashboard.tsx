// "use client";
// import { DashbordStat1Icon, DashbordPickleBallIcon, DashbordPadelBallIcon, DashbordRupeeIcon, ViewEyeIcon, TiltedArrowIcon } from "@/utils/svgicons";
// import Image from "next/image";
// import React, { useState } from "react";
// import Match from "@/assets/images/ongoingmatches.png";
// import Profile from "@/assets/images/profile.webp";
// import SalesChart from "./statistic-chart/StatsChart";
// import LoyaltyCard from "./loyaltyMatches";
// import ScheduleCalender from "./dashboard-calender/dashboard-calender";

// const StatCard = ({ value, label, Icon }) => (
//   <div className="flex items-center gap-3rounded-lg  ">
//     <div>
//       <div className="flex gap-[20px] ">
//         <div className="flex justify-end bg-[#FD5602] rounded-[5px] w-[20px] h-[20px] p-1 mt-4">{Icon}</div>
//         <div className="left-[44px] top-0 text-[#10375c] text-[40px] font-semibold font-['Raleway']">{value}</div>
//       </div>
//       <div className="left-0 top-[48px] text-[#1b2229] text-xs font-medium ">{label}</div>
//     </div>
//   </div>
// );

// const BookingRow = ({ name, game, city, date, image, index }) => {
//   const bgColor = index % 2 === 0 ? "bg-[#f2f2f4]" : "bg-white";

//   return (
//     <div className={` rounded-[10px] justify-start items-center inline-flex ${bgColor} w-full ring-offset-purple-950  py-3`}>
//       <div className=" w-1/6 grow shrink basis-0 self-stretch justify-start items-center gap-1 flex">
//         {/* <div className="w-1/5"> */}
//         <Image className=" rounded-full" src={Profile} alt={name} width={23} height={23} />
//         <div className=" text-[#1b2229] text-xs font-medium ">{name}</div>
//       </div>
//       <div className="w-1/6 h-3.5 text-[#1b2229] text-xs font-medium ">
//         {/* <div className="w-1/5"> */}
//         {game}
//       </div>
//       <div className="w-1/6 text-[#1b2229] text-xs font-medium ">{city}</div>
//       <div className=" w-1/6 h-3.5 text-right text-[#1b2229] text-xs font-medium ">{date}</div>
//       <div className="w-1/6 ">
//         <ViewEyeIcon />
//       </div>
//     </div>
//   );
// };
// const Dashboard = () => {
  // const bookingsData = [
  //   {
  //     name: "Tracy Martin",
  //     game: "Padel",
  //     city: "Chandigarh",
  //     date: "22-01-2024",
  //     image:
  //       "https://www.google.com/imgres?q=profile%20picture&imgurl=https%3A%2F%2Fi.pinimg.com%2F736x%2Fa3%2F42%2Fa5%2Fa342a5261e23a03fdfa88be4c793e27e.jpg&imgrefurl=https%3A%2F%2Fwww.pinterest.com%2Fpin%2F33333--10977592835419086%2F&docid=MlM14WN1Kk9PiM&tbnid=WzgbtV9yQ1JdrM&vet=12ahUKEwjT1KT7p8-LAxUPTmwGHa54OsMQM3oECCMQAA..i&w=736&h=736&hcb=2&ved=2ahUKEwjT1KT7p8-LAxUPTmwGHa54OsMQM3oECCMQAA",
  //   },
  //   { name: "Jordan Lee", game: "Pickleball", city: "Chandigarh", date: "22-01-2024", image: "https://placehold.co/23x23" },
  //   { name: "Alan Parker", game: "Padel", city: "Chandigarh", date: "22-01-2024", image: "https://placehold.co/23x23" },
  //   { name: "Jordan Lee", game: "Pickleball", city: "Chandigarh", date: "22-01-2024", image: "https://placehold.co/23x23" },
  // ];
//   const [openPanelIndex, setOpenPanelIndex] = useState(0);
//   const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

//   const handleYearChange = (year: number) => {
//     setSelectedYear(year);
//   };
  // const handleViewClick = (index) => {
  //   setOpenPanelIndex(openPanelIndex === index ? -1 : index);
  // };

  // const OngoingMatchesPanel = ({ open, data }) => {
  //   if (!open) return null;

  //   return (
  //     <div className="relative w-full h-[300px] rounded-xl overflow-hidden shadow-lg">
  //       <Image src={Match} alt="Ongoing Matches" layout="fill" objectFit="cover" className="absolute inset-0 z-10" />

  //       <div className="absolute inset-0 bg-black bg-opacity-50"></div>

  //       {/* Content Overlay */}
  //       <div className="relative z-10 p-6 text-white flex flex-col h-full justify-between">
  //         <h2 className="text-lg font-semibold">Ongoing Matches</h2>

  //         {/* Match Details */}
  //         <div className="flex gap-6 absolute top-[60px]">
  //           {/* Left - Match Numbers & Labels */}
  //           <div className="space-y-3">
  //             <div className="flex items-center gap-2">
  //               <span className="text-3xl font-bold">4</span>
  //               <div className="w-2.5 h-2.5 bg-[#fd5602] rounded-[7px]" />
  //               <span className="text-sm">Padel</span>
  //             </div>
  //             <div className="flex items-center gap-2">
  //               <span className="text-3xl font-bold">3</span>
  //               <div className="w-2.5 h-2.5 bg-[#fd5602] rounded-[7px]" />
  //               <span className="text-sm">Pickleball</span>
  //             </div>
  //           </div>
  //         </div>
  //       </div>
  //     </div>
  //   );
  // };

//   return (
//     <div className=" bg-[#fbfaff] ">
//       {/* Header */}

//       <div className="flex items-center justify-between gap-1 xs:gap-10 mb-8 flex-wrap">
//         <h1 className="text-[#10375c] text-3xl font-semibold font-['Raleway']">Welcome to Barnton Park LTC</h1>
//         {/* Stats Grid */}
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
//           <StatCard value="240" label="Total matches this month" Icon={<DashbordStat1Icon />} />
//           <StatCard value="120" label="Pickleball matches this month" Icon={<DashbordPickleBallIcon />} />
//           <StatCard value="120" label="Padel matches this month" Icon={<DashbordPadelBallIcon />} />
//           <StatCard value="₹22,300" label="Income this month" Icon={<DashbordRupeeIcon />} />
//         </div>
//       </div>

//       {/* Main Content Grid */}
//       <div className="flex  gap-8 w-full">
//         <ScheduleCalender />
//         <div className="w-[75%]">
          // <div className=" rounded-[20px] w-full ">
          //   <div className=" bg-[#f2f2f4] p-2 rounded-[20px] flex w-full gap-4">
          //     {/* Left Section: Recent Bookings */}
          //     <div className="w-[55%] p-2">
          //       <div className="flex items-center justify-between mb-6">
          //         <div className="text-[#10375c] text-xl font-medium font-['Raleway']">Recent Bookings</div>
          //         <div className="rounded-[50px] bg-white">
          //           <TiltedArrowIcon />
          //         </div>
          //       </div>
          //       <div>
          //         {/* Table Header */}
          //         <div className="flex items-center gap-6 text-[#7e7e8a] text-xs font-medium mb-2 ">
          //           <div className="w-2/6">Name of Person</div>
          //           <div className="w-1/6">Game</div>
          //           <div className="w-1/6">City</div>
          //           <div className="w-1/6 text-right">Date</div>
          //           <div className="w-1/6">Action</div>
          //         </div>
          //         <div className="w-full h-[0px] border border-dotted border-[#d0d0d0]"></div>

          //         {/* Bookings List */}
          //         <div className="">
          //           {bookingsData.map((booking, index) => (
          //             <BookingRow key={index} {...booking} index={index} />
          //           ))}
          //         </div>
          //       </div>
          //     </div>

          //     {/* Right Section: Ongoing Matches */}
          //     <div className="flex-1">{openPanelIndex !== -1 && bookingsData[openPanelIndex] && <OngoingMatchesPanel open={true} data={bookingsData[openPanelIndex]} />}</div>
          //   </div>
          // </div>
//           <div className="w-[100%] bg-[#fbfaff] flex  mt-[20px] mb-[20px] gap-[18px] ">
//             {/* Statistics Chart  */}
//             <div className="bg-[#fbfaff]  rounded-lg shadow-sm w-[60%]">
//               <SalesChart selectedYear={selectedYear} data={{}} onYearChange={handleYearChange} />
//             </div>
//             <div className="bg-[#fbfaff] flex flex-col gap-10 w-[45%] ">
//               {/* Ongoing Matches */}
//               <div className=" w-full">
//                 <LoyaltyCard />
                // <div className="bg-[#f2f2f4] rounded-[20px] w-full mt-[20px] pb-[20px] w-full">
                //   <h2 className="text-[#10375c] text-xl font-medium pt-[16px] pl-[16px]">Game Booking Composition</h2>
                //   <div className="flex justify-left gap-8 pl-[18px] mt-[30px]">
                //     <div className="text-center">
                //       <div className="text-[#10375c] text-3xl font-medium ">66%</div>
                //       <div className="h-3.5 justify-start items-center gap-[5px] inline-flex">
                //         <div className="w-2.5 h-2.5 bg-[#fd5602] rounded-[7px]" />
                //         <div className="text-[#7e7e8a] text-xs font-medium font-['Raleway']">Padel</div>
                //       </div>
                //     </div>
                //     <div className="text-center">
                //       <div className="text-[#10375c] text-3xl font-medium ">34%</div>
                //       <div className="h-3.5 justify-start items-center gap-[5px] inline-flex">
                //         <div className="w-2.5 h-2.5 bg-[#1b2229] rounded-[7px]" />
                //         <div className="text-[#7e7e8a] text-xs font-medium font-['Raleway']">Pickleball</div>
                //       </div>
                //     </div>
                //   </div>
                //   <div className="mt-[20px] mx-[20px] w-[85%] px-[26px] py-3.5 bg-white rounded-[39px] text-center text-[#7e7e8a] text-xs font-medium">People love to play Padel at your court!</div>
                // </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Dashboard;




"use client";
import { DashbordStat1Icon, DashbordPickleBallIcon, DashbordPadelBallIcon, DashbordRupeeIcon, ViewEyeIcon, TiltedArrowIcon } from "@/utils/svgicons";
import Image from "next/image";
import React, { useState } from "react";
import Match from "@/assets/images/ongoingmatches.png";
import Profile from "@/assets/images/profile.webp";
import SalesChart from "./statistic-chart/StatsChart";
import LoyaltyCard from "./loyaltyMatches";
import ScheduleCalender from "./dashboard-calender/dashboard-calender";

const StatCard = ({ value, label, Icon }) => (
  <div className="flex items-center gap-3 rounded-lg">
    <div>
      <div className="flex gap-[20px] ">
        <div className="flex justify-end bg-[#FD5602] rounded-[5px] w-[20px] h-[20px] p-1 mt-4">{Icon}</div>
        <div className="left-[44px] top-0 text-[#10375c] text-[40px] font-semibold font-['Raleway']">{value}</div>
      </div>
      <div className="left-0 top-[48px] text-[#1b2229] text-xs font-medium ">{label}</div>
    </div>
  </div>
);

// const BookingRow = ({ name, game, city, date, index }) => {
//   const bgColor = index % 2 === 0 ? "bg-[#f2f2f4]" : "bg-white";

//   return (
//     <div className={`rounded-[10px] justify-start items-center flex flex-wrap md:flex-nowrap ${bgColor} w-full py-3 px-2 md:px-4`}> 
//       <div className="w-full md:w-2/6 flex items-center gap-2 mb-2 md:mb-0">
//         <Image className="rounded-full" src={Profile} alt={name} width={23} height={23} />
//         <div className="text-[#1b2229] text-xs font-medium ">{name}</div>
//       </div>
//       <div className="w-1/2 md:w-1/6 text-xs font-medium ">{game}</div>
//       <div className="w-1/2 md:w-1/6 text-xs font-medium ">{city}</div>
//       <div className="w-1/2 md:w-1/6 text-xs font-medium text-right md:text-left">{date}</div>
//       <div className="w-1/2 md:w-1/6 flex justify-end md:justify-start">
//         <ViewEyeIcon />
//       </div>
//     </div>
//   );
// };
const BookingRow = ({ name, game, city, date, image, index }) => {
  const bgColor = index % 2 === 0 ? "bg-[#f2f2f4]" : "bg-white";

  return (
    <div className={` rounded-[10px] justify-start items-center inline-flex ${bgColor} w-full ring-offset-purple-950  py-3`}>
      <div className=" w-1/6 grow shrink basis-0 self-stretch justify-start items-center gap-1 flex">
        {/* <div className="w-1/5"> */}
        <Image className=" rounded-full" src={Profile} alt={name} width={23} height={23} />
        <div className=" text-[#1b2229] text-xs font-medium ">{name}</div>
      </div>
      <div className="w-1/6 h-3.5 text-[#1b2229] text-xs font-medium ">
        {/* <div className="w-1/5"> */}
        {game}
      </div>
      <div className="w-1/6 text-[#1b2229] text-xs font-medium ">{city}</div>
      <div className=" w-1/6 h-3.5 text-right text-[#1b2229] text-xs font-medium ">{date}</div>
      <div className="w-1/6 ">
        <ViewEyeIcon />
      </div>
    </div>
  );
};

const Dashboard = () => {
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const handleYearChange = (year) => setSelectedYear(year);
  const [openPanelIndex, setOpenPanelIndex] = useState(0);
  const handleViewClick = (index) => {
    setOpenPanelIndex(openPanelIndex === index ? -1 : index);
  };
  const bookingsData = [
    {
      name: "Tracy Martin",
      game: "Padel",
      city: "Chandigarh",
      date: "22-01-2024",
      image:
        "https://www.google.com/imgres?q=profile%20picture&imgurl=https%3A%2F%2Fi.pinimg.com%2F736x%2Fa3%2F42%2Fa5%2Fa342a5261e23a03fdfa88be4c793e27e.jpg&imgrefurl=https%3A%2F%2Fwww.pinterest.com%2Fpin%2F33333--10977592835419086%2F&docid=MlM14WN1Kk9PiM&tbnid=WzgbtV9yQ1JdrM&vet=12ahUKEwjT1KT7p8-LAxUPTmwGHa54OsMQM3oECCMQAA..i&w=736&h=736&hcb=2&ved=2ahUKEwjT1KT7p8-LAxUPTmwGHa54OsMQM3oECCMQAA",
    },
    { name: "Jordan Lee", game: "Pickleball", city: "ambala", date: "22-01-2024", image: "https://placehold.co/23x23" },
    { name: "Alan Parker", game: "Padel", city: "Chandigarh", date: "22-01-2024", image: "https://placehold.co/23x23" },
    { name: "Jordan Lee", game: "Pickleball", city: "ambala", date: "22-01-2024", image: "https://placehold.co/23x23" },
  ];
  const OngoingMatchesPanel = ({ open, data }) => {
    if (!open) return null;

    return (
      <div className="relative w-full h-[300px] rounded-xl overflow-hidden shadow-lg">
        <Image src={Match} alt="Ongoing Matches" layout="fill" objectFit="cover" className="absolute inset-0 z-10" />

        <div className="absolute inset-0 bg-black bg-opacity-50"></div>

        {/* Content Overlay */}
        <div className="relative z-10 p-6 text-white flex flex-col h-full justify-between">
          <h2 className="text-lg font-semibold">Ongoing Matches</h2>

          {/* Match Details */}
          <div className="flex gap-6 absolute top-[60px]">
            {/* Left - Match Numbers & Labels */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <span className="text-3xl font-bold">4</span>
                <div className="w-2.5 h-2.5 bg-[#fd5602] rounded-[7px]" />
                <span className="text-sm">Padel</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-3xl font-bold">3</span>
                <div className="w-2.5 h-2.5 bg-[#fd5602] rounded-[7px]" />
                <span className="text-sm">Pickleball</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };
  return (
    <div className="bg-[#fbfaff]  ">
      <div className="flex flex-wrap justify-between mb-4 pt-6 p-2">
        <h1 className="text-[#10375c] text-2xl md:text-3xl font-semibold">Welcome to Barnton Park LTC</h1>
      
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard value="240" label="Total matches this month" Icon={<DashbordStat1Icon />} />
        <StatCard value="120" label="Pickleball matches this month" Icon={<DashbordPickleBallIcon />} />
        <StatCard value="120" label="Padel matches this month" Icon={<DashbordPadelBallIcon />} />
        <StatCard value="₹22,300" label="Income this month" Icon={<DashbordRupeeIcon />} />
      </div>
      </div>
      <div className="flex flex-col md:flex-row gap-8 w-full">
        <div className="w-full md:w-1/4">

        <ScheduleCalender  />
        </div>
        <div className="w-full md:w-3/4">
          {/* <div className="rounded-[20px] bg-[#f2f2f4] p-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-[#10375c] text-xl font-medium">Recent Bookings</h2>
              <div className="rounded-full bg-white p-2">
                <TiltedArrowIcon />
              </div>
            </div>
            <div className="overflow-x-auto">
              <div className="flex gap-6 text-[#7e7e8a] text-xs font-medium mb-2">
                <div className="w-2/6">Name</div>
                <div className="w-1/6">Game</div>
                <div className="w-1/6">City</div>
                <div className="w-1/6 text-right">Date</div>
                <div className="w-1/6">Action</div>
              </div>
              <div className="border border-dotted border-[#d0d0d0]"></div>
              <div>
                {[...Array(4)].map((_, index) => (
                  <BookingRow key={index} name="Player" game="Padel" city="City" date="22-01-2024" index={index} />
                ))}
              </div>
            </div>
          </div> */}
                    <div className=" rounded-[20px] w-full ">
            <div className=" bg-[#f2f2f4] p-2 rounded-[20px] flex flex-col md:flex-row w-full gap-4">
              {/* Left Section: Recent Bookings */}
              <div className="w-full p-4 md:w-[55%] md:p-2">
                <div className="flex items-center justify-between mb-6">
                  <div className="text-[#10375c] text-xl font-medium font-['Raleway']">Recent Bookings</div>
                  <div className="rounded-[50px] bg-white">
                    <TiltedArrowIcon />
                  </div>
                </div>
                <div>
                  {/* Table Header */}
                  <div className="flex items-center gap-6 text-[#7e7e8a] text-xs font-medium mb-2  ">
                    <div className="w-2/6">Name of Person</div>
                    <div className="w-1/6">Game</div>
                    <div className="w-1/6">City</div>
                    <div className="w-1/6 text-right">Date</div>
                    <div className="w-1/6">Action</div>
                  </div>
                  <div className="w-full h-[0px] border border-dotted border-[#d0d0d0]"></div>

                  {/* Bookings List */}
                  <div className="">
                     {bookingsData.map((booking, index) => (
                       <BookingRow key={index} {...booking} index={index} />
                     ))}
                   </div>
                </div>
              </div>

              {/* Right Section: Ongoing Matches */}
              <div className="flex-1">{openPanelIndex !== -1 && bookingsData[openPanelIndex] && <OngoingMatchesPanel open={true} data={bookingsData[openPanelIndex]} />}</div>
            </div>
          </div>
          <div className="flex flex-col md:flex-row gap-8 mt-6 mb-6 w-full">
            <div className="w-full md:w-2/3">
              <SalesChart selectedYear={selectedYear} data={{}} onYearChange={handleYearChange} />
            </div>
            <div className="w-full md:w-2/4">
              <LoyaltyCard />
              <div className="bg-[#f2f2f4] rounded-[20px]  mt-[20px] pb-[20px] w-full">
                  <h2 className="text-[#10375c] text-xl font-medium pt-[16px] pl-[16px]">Game Booking Composition</h2>
                  <div className="flex justify-left gap-8 pl-[18px] mt-[30px]">
                    <div className="text-center">
                      <div className="text-[#10375c] text-3xl font-medium ">66%</div>
                      <div className="h-3.5 justify-start items-center gap-[5px] inline-flex">
                        <div className="w-2.5 h-2.5 bg-[#fd5602] rounded-[7px]" />
                        <div className="text-[#7e7e8a] text-xs font-medium font-['Raleway']">Padel</div>
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-[#10375c] text-3xl font-medium ">34%</div>
                      <div className="h-3.5 justify-start items-center gap-[5px] inline-flex">
                        <div className="w-2.5 h-2.5 bg-[#1b2229] rounded-[7px]" />
                        <div className="text-[#7e7e8a] text-xs font-medium font-['Raleway']">Pickleball</div>
                      </div>
                    </div>
                  </div>
                  <div className="mt-[20px] mx-[20px] w-[85%] px-[26px] py-3.5 bg-white rounded-[39px] text-center text-[#7e7e8a] text-xs font-medium">People love to play Padel at your court!</div>
                </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;


