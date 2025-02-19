"use client"
import { DashbordStat1Icon, DashbordPickleBallIcon, DashbordPadelBallIcon, DashbordRupeeIcon, ViewEyeIcon, TiltedArrowIcon } from "@/utils/svgicons";
import Image from "next/image";
import React,{useState} from "react";
import Match from "@/assets/images/ongoingmatches.png"
import Profile from "@/assets/images/profile.webp"

const StatCard = ({ value, label, Icon }) => (
  <div className="flex items-center gap-3rounded-lg  ">
    <div>
      <div className="flex gap-[20px] ">
        <div className="flex justify-end bg-[#FD5602] rounded-[5px] w-[20px] h-[20px] p-1 mt-4">{Icon}</div>
        <div className="left-[44px] top-0 text-[#10375c] text-[40px] font-semibold font-['Raleway']">{value}</div>
      </div>
      <div className="left-0 top-[48px] text-[#1b2229] text-xs font-medium ">{label}</div>
    </div>
  </div>
);

const ScheduleItem = ({ time, name, game, duration }) => (
  <div className="flex items-center gap-4 py-3 border-b border-gray-100">
    <div className="text-sm text-gray-500 w-16">{time}</div>
    <div className="flex-1">
      <div className="font-medium text-gray-900">{name}</div>
      <div className="text-sm text-gray-500">{game}</div>
    </div>
    <div className="text-sm text-gray-500">{duration}</div>
  </div>
);

const BookingRow = ({ name, game, city, date, image, index }) => {
  const bgColor = index % 2 === 0 ? "bg-[#f2f2f4]" : "bg-white";

  return (
    <div className={` rounded-[10px] justify-start items-center inline-flex ${bgColor} w-full ring-offset-purple-950 px-3.5 py-3`}>
      <div className=" w-1/5 grow shrink basis-0 self-stretch justify-start items-center gap-1 flex">
      {/* <div className="w-1/5"> */}
        <Image className=" rounded-full" src={Profile} alt={name} width={23} height={23} />
        <div className=" text-[#1b2229] text-xs font-medium ">{name}</div>
      </div>
      <div className="w-1/5 h-3.5 text-[#1b2229] text-xs font-medium pl-2">
      
      {/* <div className="w-1/5"> */}
        {game}</div>
      <div className="w-1/5 text-[#1b2229] text-xs font-medium ">
        {city}</div>
      <div className=" w-1/5 h-3.5 text-right text-[#1b2229] text-xs font-medium ">{date}</div>
      <div className="w-1/5 pl-4">
        <ViewEyeIcon />
      </div>
    </div>
  );
};
const SimpleChart = () => (
  <div className="relative h-64 mt-4">
    <div className="absolute inset-0 flex items-end justify-between px-4">
      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((month) => (
        <div key={month} className="flex flex-col items-center">
          <div className="h-32 w-2 bg-blue-500 rounded-t opacity-75" style={{ height: `${2 * 100 + 20}px` }} />
          <div className="mt-2 text-xs text-gray-500">M{month}</div>
        </div>
      ))}
    </div>
  </div>
);

const Dashboard = () => {
  const scheduleData = Array.from({ length: 5 }, (_, i) => ({
    time: `${9 + i}:00`,
    name: "Neil Melendez",
    game: "Padel Match",
    duration: "120 Mins",
  }));

  const bookingsData = [
    { name: "Tracy Martin", game: "Padel", city: "Chandigarh", date: "22-01-2024", image: "https://www.google.com/imgres?q=profile%20picture&imgurl=https%3A%2F%2Fi.pinimg.com%2F736x%2Fa3%2F42%2Fa5%2Fa342a5261e23a03fdfa88be4c793e27e.jpg&imgrefurl=https%3A%2F%2Fwww.pinterest.com%2Fpin%2F33333--10977592835419086%2F&docid=MlM14WN1Kk9PiM&tbnid=WzgbtV9yQ1JdrM&vet=12ahUKEwjT1KT7p8-LAxUPTmwGHa54OsMQM3oECCMQAA..i&w=736&h=736&hcb=2&ved=2ahUKEwjT1KT7p8-LAxUPTmwGHa54OsMQM3oECCMQAA" },
    { name: "Jordan Lee", game: "Pickleball", city: "Chandigarh", date: "22-01-2024", image: "https://placehold.co/23x23" },
    { name: "Alan Parker", game: "Padel", city: "Chandigarh", date: "22-01-2024", image: "https://placehold.co/23x23" },
  ];
    const [openPanelIndex, setOpenPanelIndex] = useState(0);

  const handleViewClick = (index) => {
    setOpenPanelIndex(openPanelIndex === index ? -1 : index);
  };



const OngoingMatchesPanel = ({ open, data  }) => {
  if (!open) return null;

  return (
    <div className="relative w-full h-[300px] rounded-xl overflow-hidden shadow-lg">
      <Image
        src={Match}
        alt="Ongoing Matches"
        layout="fill"
        objectFit="cover"
        className="absolute inset-0 z-10"
      />

      {/* Dark Overlay for Readability */}
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
    <div className="min-h-screen bg-gray-50 ">
      {/* Header */}
      <div className="flex items-center justify-between gap-1 xs:gap-10 mb-8 flex-wrap">
        <h1 className="text-[#10375c] text-3xl font-semibold font-['Raleway']">Welcome to Barnton Park LTC</h1>
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard value="240" label="Total matches this month" Icon={<DashbordStat1Icon />} />
          <StatCard value="120" label="Pickleball matches this month" Icon={<DashbordPickleBallIcon />} />
          <StatCard value="120" label="Padel matches this month" Icon={<DashbordPadelBallIcon />} />
          <StatCard value="₹22,300" label="Income this month" Icon={<DashbordRupeeIcon />} />
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="flex  gap-8">
        {/* Schedule Card  */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900">Today Schedule</h2>
            <div className='rounded-[50px] bg-white'><TiltedArrowIcon/></div>
          </div>
          <div className="space-y-1">
            {scheduleData.map((item, index) => (
              <ScheduleItem key={index} {...item} />
            ))}
          </div>
        </div>

       

<div className=" rounded-[20px] w-full ">
  <div className=" bg-[#f2f2f4] p-2 rounded-[20px] flex w-full gap-4">
    
    {/* Left Section: Recent Bookings */}
    <div className="w-1/2 p-2">
      <div className="flex items-center justify-between mb-6">
      <div className="text-[#10375c] text-xl font-medium font-['Raleway']">Recent Bookings</div>
      <div className='rounded-[50px] bg-white'><TiltedArrowIcon/></div>

      </div>
      
      {/* Table Header */}
      <div className="flex items-center gap-6 text-[#7e7e8a] text-xs font-medium mb-2">
        <div className="w-1/5">Name of Person</div>
        <div className="w-1/5">Game</div>
        <div className="w-1/5">City</div>
        <div className="w-1/5 text-right">Date</div>
        <div className="w-1/5">Action</div>
      </div>
      
      {/* Bookings List */}
      <div className="">
        {bookingsData.map((booking, index) => (
          <BookingRow key={index} {...booking} index={index} />
        ))}
      </div>
    </div>

    {/* Right Section: Ongoing Matches */}
    <div className="flex-1">
      {openPanelIndex !== -1 && bookingsData[openPanelIndex] && (
        <OngoingMatchesPanel open={true} data={bookingsData[openPanelIndex]} />
      )}
    </div>
  </div>
</div>


      {/* Statistics Chart */}
      {/* <div className="bg-white rounded-lg shadow-sm p-6 mt-8">
        <h2 className="text-lg font-semibold text-gray-900 mb-6">Statistics</h2>
        <SimpleChart />
      </div> */}

      {/* Metrics Grid */}
      {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8"> */}
        {/* Ongoing Matches */}
        {/* <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">Ongoing Matches</h2>
          <div className="flex flex-col items-center justify-center">
            <div className="text-4xl font-bold text-orange-500">4</div>
            <div className="text-sm text-gray-500">Padel</div>
            <div className="text-4xl font-bold text-blue-500 mt-4">3</div>
            <div className="text-sm text-gray-500">Pickleball</div>
          </div>
        </div> */}

        {/* Game Booking Composition */}
        {/* <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">Game Booking Composition</h2>
          <div className="flex justify-center gap-8">
            <div className="text-center">
              <div className="text-4xl font-bold text-orange-500">66%</div>
              <div className="text-sm text-gray-500">Padel</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-500">34%</div>
              <div className="text-sm text-gray-500">Pickleball</div>
            </div>
          </div>
          <div className="text-sm text-gray-500 text-center mt-4">People love to play Padel at your court!</div> */}
        {/* </div> */}
      </div>
     </div>
  );
};

export default Dashboard;



// import { DashbordStat1Icon, DashbordPickleBallIcon, DashbordPadelBallIcon, DashbordRupeeIcon, ViewEyeIcon } from "@/utils/svgicons";
// import Image from "next/image";
// import React, { useState } from "react";

// const StatCard = ({ value, label, Icon }) => (
//   <div className="flex items-center gap-3 rounded-lg bg-white p-4 shadow-sm">
//     <div className="flex items-center">
//       <div className="bg-orange-500 rounded-full w-10 h-10 flex items-center justify-center text-white">
//         {Icon}
//       </div>
//     </div>
//     <div className="ml-3">
//       <div className="text-[#10375c] text-2xl font-bold">{value}</div>
//       <div className="text-[#1b2229] text-xs">{label}</div>
//     </div>
//   </div>
// );

// const ScheduleItem = ({ time, name, game, duration }) => (
//   <div className="flex items-center justify-between py-2 border-b border-gray-200">
//     <div className="text-sm text-gray-500">{time}</div>
//     <div className="flex-1 ml-4">
//       <div className="font-medium text-gray-900">{name}</div>
//       <div className="text-xs text-gray-500">{game}</div>
//     </div>
//     <div className="text-sm text-gray-500">{duration}</div>
//   </div>
// );

// const BookingRow = ({ name, game, city, date, image, index, onViewClick }) => {
//   const bgColor = index % 2 === 0 ? "bg-[#f2f2f4]" : "bg-white";

//   return (
//     <div className={`flex items-center justify-between py-2 ${bgColor}`}>
//       <div className="flex items-center">
//         <Image className="h-8 w-8 rounded-full mr-2" src={image} alt={name} width={32} height={32} />
//         <div className="text-sm font-medium text-gray-900">{name}</div>
//       </div>
//       <div className="text-sm text-gray-500">{game}</div>
//       <div className="text-sm text-gray-500">{city}</div>
//       <div className="text-sm text-gray-500">{date}</div>
//       <div className="text-sm text-orange-500 cursor-pointer" onClick={() => onViewClick(index)}>
//         <ViewEyeIcon />
//       </div>
//     </div>
//   );
// };

// const OngoingMatchesPanel = ({ open, data }) => {
//   if (!open) return null;

//   return (
//     <div className="bg-[#1a1a2e] rounded-lg shadow-sm p-6 text-white relative">
//       <h2 className="text-lg font-semibold mb-4">Ongoing Matches</h2>
//       <div className="flex items-center gap-4">
//         <div className="flex items-center">
//           <div className="bg-orange-500 w-8 h-8 rounded-full flex items-center justify-center text-white">
//             <span>{data.game === 'Padel' ? 4 : 3}</span>
//           </div>
//           <div className="ml-2">{data.game}</div>
//         </div>
//       </div>
//       <div className="mt-4">
//         {/* Using the provided image as a background */}
//         <Image src="/path-to-your-ongoing-matches-background.png" alt="Ongoing Matches Background" layout="fill" objectFit="cover" className="rounded-lg opacity-50" />
//         <div className="absolute inset-0 flex items-center justify-center">
//           <Image src="/path-to-your-player-image.png" alt="Player" width={200} height={200} />
//         </div>
//       </div>
//     </div>
//   );
// };

// const SimpleChart = () => (
//   <div className="bg-white rounded-lg shadow-sm p-6 mt-4">
//     <h2 className="text-lg font-semibold text-gray-900 mb-6">Statistics</h2>
//     <div className="h-48">
//       <Image src="/path-to-your-chart-image.png" alt="Statistics Chart" layout="fill" objectFit="contain" />
//     </div>
//   </div>
// );

// const Dashboard = () => {
//   const scheduleData = Array.from({ length: 5 }, (_, i) => ({
//     time: `${9 + i}:00`,
//     name: "Neil Melendez",
//     game: "Padel Match",
//     duration: "120 Mins",
//   }));

//   const bookingsData = [
//     { name: "Tracy Martin", game: "Padel", city: "Chandigarh", date: "22-01-2024", image: "https://placehold.co/32x32" },
//     { name: "Jordan Lee", game: "Pickleball", city: "Chandigarh", date: "22-01-2024", image: "https://placehold.co/32x32" },
//     { name: "Alex Parker", game: "Padel", city: "Chandigarh", date: "22-01-2024", image: "https://placehold.co/32x32" },
//     { name: "Marley Martinez", game: "Pickleball", city: "Chandigarh", date: "22-01-2024", image: "https://placehold.co/32x32" },
//   ];

//   const [openPanelIndex, setOpenPanelIndex] = useState(0);

//   const handleViewClick = (index) => {
//     setOpenPanelIndex(openPanelIndex === index ? -1 : index);
//   };

//   return (
//     <div className="min-h-screen bg-gray-50 p-6">
//       {/* Header */}
//       <header className="flex justify-between items-center mb-8">
//         <div className="flex items-center">
//           <Image src="/path-to-logo.png" alt="Tennis Logo" width={40} height={40} />
//           <h1 className="ml-4 text-[#10375c] text-2xl font-semibold">Tennis</h1>
//         </div>
//         <nav className="flex space-x-4">
//           <a href="#" className="text-gray-700">Dashboard</a>
//           <a href="#" className="text-gray-700">Matches</a>
//           <a href="#" className="text-gray-700">Tournaments</a>
//           <a href="#" className="text-gray-700">Users</a>
//           <a href="#" className="text-gray-700">Notifications</a>
//           <a href="#" className="text-gray-700">Courts</a>
//           <a href="#" className="text-gray-700">Merchandise</a>
//           <a href="#" className="text-gray-700">Inventory</a>
//           <a href="#" className="text-gray-700">Employees</a>
//         </nav>
//         <div className="flex space-x-4">
//           <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
//             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
//           </svg>
//           <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
//             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
//           </svg>
//         </div>
//       </header>

//       <h1 className="text-[#10375c] text-2xl font-semibold mb-4">Welcome to Barnton Park LTC</h1>

//       {/* Stats Grid */}
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
//         <StatCard value="240" label="Total matches this month" Icon={<DashbordStat1Icon />} />
//         <StatCard value="120" label="Pickleball matches this month" Icon={<DashbordPickleBallIcon />} />
//         <StatCard value="120" label="Padel matches this month" Icon={<DashbordPadelBallIcon />} />
//         <StatCard value="₹22,300" label="Income this month" Icon={<DashbordRupeeIcon />} />
//       </div>

//       {/* Main Content Grid */}
//       <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
//         {/* Schedule Card */}
//         <div className="bg-white rounded-lg shadow-sm p-6">
//           <div className="flex items-center justify-between mb-6">
//             <h2 className="text-lg font-semibold text-gray-900">Today Schedule</h2>
//             <svg className="w-4 h-4 text-gray-400" viewBox="0 0 24 24">
//               <path d="M9 18l6-6-6-6" fill="none" stroke="currentColor" strokeWidth="2" />
//             </svg>
//           </div>
//           <div className="space-y-1">
//             {scheduleData.map((item, index) => (
//               <ScheduleItem key={index} {...item} />
//             ))}
//           </div>
//         </div>

//         {/* Bookings Card */}
//         <div className="bg-white rounded-lg shadow-sm p-6">
//           <div className="flex items-center justify-between mb-6">
//             <h2 className="text-lg font-semibold text-gray-900">Recent Bookings</h2>
//             <svg className="w-4 h-4 text-gray-400" viewBox="0 0 24 24">
//               <path d="M9 18l6-6-6-6" fill="none" stroke="currentColor" strokeWidth="2" />
//             </svg>
//           </div>
//           <div className="mb-4">
//             <div className="grid grid-cols-5 gap-4 text-[#7e7e8a] text-xs font-medium mb-2">
//               <div>Name of Person</div>
//               <div>Game</div>
//               <div>City</div>
//               <div className="text-right">Date</div>
//               <div>Action</div>
//             </div>
//           </div>
//           <div className="space-y-2">
//             {bookingsData.map((booking, index) => (
//               <BookingRow key={index} {...booking} index={index} onViewClick={handleViewClick} />
//             ))}
//           </div>
//         </div>

//         {/* Right Sidebar */}
//         <div className="space-y-8">
//           {/* Ongoing Matches Panel */}
//           {openPanelIndex !== -1 && (
//             <OngoingMatchesPanel open={openPanelIndex !== -1} data={bookingsData[openPanelIndex]} />
//           )}

//           {/* Statistics Chart */}
//           <SimpleChart />

//           {/* Manage Loyalty Points */}
//           <div className="bg-[#1a1a2e] text-white rounded-lg shadow-sm p-6">
//             <h2 className="text-lg font-semibold mb-4">Manage Loyalty Points</h2>
//             <p className="mb-4">Manage what reward is being given to the users.</p>
//             <button className="bg-orange-500 text-white px-4 py-2 rounded">Manage Points</button>
//           </div>

//           {/* Game Booking Composition */}
//           <div className="bg-white rounded-lg shadow-sm p-6">
//             <h2 className="text-lg font-semibold text-gray-900 mb-6">Game Booking Composition</h2>
//             <div className="flex justify-center gap-8">
//               <div className="text-center">
//                 <div className="text-4xl font-bold text-orange-500">66%</div>
//                 <div className="text-sm text-gray-500">Padel</div>
//               </div>
//               <div className="text-center">
//                 <div className="text-4xl font-bold text-blue-500">34%</div>
//                 <div className="text-sm text-gray-500">Pickleball</div>
//               </div>
//             </div>
//             <div className="text-sm text-gray-500 text-center mt-4">People love to play Padel at your court!</div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Dashboard;