"use client";
import { useState } from "react";
import Image from "next/image";
import React from 'react'
import MatchImage from "@/assets/images/padelImage.png";

const matches = [
  { id: 1, team1: "Alex Parker", team2: "Alex Parker", game: "Padel", date: "22-01-2024" },
  { id: 2, team1: "Jordan Lee", team2: "Jordan Lee", game: "Pickleball", date: "22-01-2024" },
  { id: 3, team1: "Tracy Martin", team2: "Tracy Martin", game: "Padel", date: "22-01-2024" },
  { id: 4, team1: "Marley Martinez", team2: "Marley Martinez", game: "Pickleball", date: "22-01-2024" },
  { id: 5, team1: "Alex Parker", team2: "Alex Parker", game: "Padel", date: "22-01-2024" },
  { id: 6, team1: "Jordan Lee", team2: "Jordan Lee", game: "Pickleball", date: "22-01-2024" },
  { id: 7, team1: "Tracy Martin", team2: "Tracy Martin", game: "Padel", date: "22-01-2024" },
  { id: 8, team1: "Marley Martinez", team2: "Marley Martinez", game: "Pickleball", date: "22-01-2024" },
  { id: 9, team1: "Alex Parker", team2: "Alex Parker", game: "Padel", date: "22-01-2024" },
  { id: 10, team1: "Jordan Lee", team2: "Jordan Lee", game: "Pickleball", date: "22-01-2024" },
  { id: 11, team1: "Tracy Martin", team2: "Tracy Martin", game: "Padel", date: "22-01-2024" },
  { id: 12, team1: "Marley Martinez", team2: "Marley Martinez", game: "Pickleball", date: "22-01-2024" },
];






const Page = () => {
  return (
//     <div>
  
// <div className='bg-[#fbfaff] rounded-[10px] mt-[40px]'>
// <div className='text-[#10375c]  text-3xl font-semibold'>Tournaments</div>

// <div className="mt-[10px] h-10 px-5 py-3 bg-[#1b2229] rounded-[28px] justify-center items-center gap-2.5 inline-flex">
//     <button className="text-white text-sm font-medium ">Upcoming</button>
// </div>
// <div className="h-10 px-5 py-3 bg-white rounded-[28px] justify-center items-center gap-2.5 inline-flex">
//     <div className="text-[#1b2229] text-sm font-medium font-['Raleway']">Previous</div>
// </div>


// <div className="h-10 ml-[300px] mr-[10px] px-5 py-3 bg-[#1b2229] rounded-[28px] justify-center items-center gap-[5px] inline-flex">
//     <div className="w-[69px] text-white text-sm font-medium font-['Raleway']">Game</div>
//     <div data-svg-wrapper className="relative">
//     <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
//     <path d="M4 6L8 10L12 6" stroke="white" stroke-linecap="round" stroke-linejoin="round"/>
//     </svg>
//     </div>
// </div>


// <div className="h-10 px-5 py-3 bg-[#1b2229] rounded-[28px] justify-center items-center gap-[5px] inline-flex">
//     <div className="w-[117px] text-white text-sm font-medium font-['Raleway']">Select a date</div>
//     <div data-svg-wrapper className="relative">
//     <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
//     <path d="M4 6L8 10L12 6" stroke="white" stroke-linecap="round" stroke-linejoin="round"/>
//     </svg>
//     </div>
// </div>

// <div className="h-10 ml-[200px] px-5 py-3 bg-[#1b2229] rounded-[28px] justify-center items-center gap-2.5 inline-flex">
//     <div data-svg-wrapper className="relative">
//     <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
//     <path d="M7.99992 3.33325V12.6666M3.33325 7.99992H12.6666" stroke="white" stroke-linecap="round" stroke-linejoin="round"/>
//     </svg>
//     </div>
//     <div className="text-white text-sm font-medium font-['Raleway']">Add A New Tournament</div>
// </div>


// {/* left */}
// <div className="w-[910px] bg-[#f2f2f4] rounded-[20px] mt-[10px] " >
//   <div className='flex justify-between'>
// <div className="text-[#10375c] text-xl font-medium ">Upcoming Tournaments</div>

// <div className="w-[248px] h-[37.41px] px-[15px] py-1.5 bg-white rounded-[39px] flex-col justify-start items-start gap-2.5 inline-flex">
//     <div className="self-stretch justify-start items-center gap-[52px] inline-flex">
//         <div className="h-[25.41px] relative">
//             <div className="w-[193px] h-[25.41px] left-[25px] top-0 absolute text-black/60 text-xs font-medium">Search</div>
//             <div data-svg-wrapper className="left-0 top-[6px] absolute">
//             <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
//             <path d="M13 13L11.8 11.8M6.7 12.4C7.44853 12.4 8.18974 12.2526 8.8813 11.9661C9.57285 11.6797 10.2012 11.2598 10.7305 10.7305C11.2598 10.2012 11.6797 9.57285 11.9661 8.8813C12.2526 8.18974 12.4 7.44853 12.4 6.7C12.4 5.95147 12.2526 5.21026 11.9661 4.5187C11.6797 3.82715 11.2598 3.19879 10.7305 2.66949C10.2012 2.1402 9.57285 1.72034 8.8813 1.43389C8.18974 1.14743 7.44853 1 6.7 1C5.18827 1 3.73845 1.60053 2.66949 2.66949C1.60053 3.73845 1 5.18827 1 6.7C1 8.21173 1.60053 9.66155 2.66949 10.7305C3.73845 11.7995 5.18827 12.4 6.7 12.4V12.4Z" stroke="black" stroke-opacity="0.57" stroke-linecap="round" stroke-linejoin="round"/>
//             </svg>
//             </div>
//         </div>
//     </div>
// </div>

// <div className="h-10 px-5 py-3 bg-[#1b2229] rounded-[28px] justify-center items-center gap-[5px] inline-flex">
//     <div className="text-white text-sm font-medium font-['Raleway']">Download</div>
//     <div data-svg-wrapper className="relative">
//     <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
//     <path d="M4 6L8 10L12 6" stroke="white" stroke-linecap="round" stroke-linejoin="round"/>
//     </svg>
//     </div>
// </div>

// </div>

// <div className="w-[866px] h-3.5 justify-start items-center gap-[30px] inline-flex">
//     <div className="w-[200px] text-[#7e7e8a] text-xs font-medium font-['Raleway']">Name of Tournament</div>
//     <div className="w-[120px] h-3.5 text-[#7e7e8a] text-xs font-medium font-['Raleway']">Game</div>
//     <div className="w-[200px] text-[#7e7e8a] text-xs font-medium font-['Raleway']">City</div>
//     <div className="w-[150px] h-3.5 text-right text-[#7e7e8a] text-xs font-medium font-['Raleway']">Date</div>
//     <div className="text-[#7e7e8a] text-xs font-medium font-['Raleway']">Action</div>
// </div>



// {/* right */}
// <div className="w-[471px]  bg-[#f2f2f4] border border-red-600 rounded-[20px]" >

//   <Image  className="rounded-[10px] h-[50%] w-full"  alt="padel game image" src={MatchImage}  />

// </div>

// </div>








    <div>


    </div>
  )
}

export default Page
