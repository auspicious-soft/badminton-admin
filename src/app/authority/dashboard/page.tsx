// "use client"
// import { auth } from '@/auth';
// // import { getDashboardStats } from '@/services/admin-services';
// import React, {  useEffect } from 'react';
// import Dashboard from '../components/Dashboard';
// import { getBrowserToken } from '@/utils/firebase';



// const Page = async() => {
// //   useEffect(()=>{
// //       const fcmtoken = await getBrowserToken();
// //     console.log("fcmtoken",fcmtoken)
//  useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const token = await getBrowserToken();
//         console.log("fcmtoken", token);
//         // Do something with the token
//       } catch (error) {
//         console.error(error);
//       }
//     };

//     fetchData();
//   }, []);
// //   },[])  
//     return (
//         <div>
//          <Dashboard />
//         </div>
//     );
// }

// export default Page;



"use client";

import React, { useEffect } from "react";
import Dashboard from "../components/Dashboard";
import { getBrowserToken } from "@/utils/firebase";

const Page = () => {
  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = await getBrowserToken();
        console.log("fcmtoken:", token);
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, []);

  return (
    <div>
      <Dashboard />
    </div>
  );
};

export default Page;
