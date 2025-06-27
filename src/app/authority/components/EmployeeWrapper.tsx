// 'use client';

// import React, { useState, useEffect } from 'react';

// interface EmployeeClientWrapperProps {
//   children: React.ReactNode;
//   tabParam: string | null;
// }

// export default function EmployeeClientWrapper({ children, tabParam }: EmployeeClientWrapperProps) {
//   const [location, setLocation] = useState<{ latitude: number; longitude: number } | null>(null);
//   const [selectedTab, setSelectedTab] = useState<string | null>(null);

//   // Geolocation logic
//   useEffect(() => {
//     if ('geolocation' in navigator) {
//       navigator.geolocation.getCurrentPosition(({ coords }) => {
//         setLocation({
//           latitude: coords.latitude,
//           longitude: coords.longitude,
//         });
//       });
//     }
//   }, []);

//   // Log location when it changes
//   useEffect(() => {
//     console.log('location: ', location);
//   }, [location]);

//   // Tab parameter logic
//   useEffect(() => {
//     if (tabParam && ['Upcoming', 'Previous', 'Cancelled'].includes(tabParam)) {
//       setSelectedTab(tabParam);
//     }
//   }, [tabParam]);

//   return <>{children}</>;
// }


'use client';

import React, { useState, useEffect } from 'react';
import { signOut } from 'next-auth/react';
import { logOutService } from "@/services/admin-services";

interface EmployeeClientWrapperProps {
  children: React.ReactNode;
  tabParam: string | null;
  session: any;
}

// Static venue location (replace with actual venue coordinates)
const VENUE_LOCATION = {
  latitude: 40.7128, // Example: New York City
  longitude: -74.0060,
};

// Haversine formula to calculate distance in meters
const calculateDistance = (
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number => {
  const R = 6371e3; // Earth's radius in meters
  const φ1 = (lat1 * Math.PI) / 180;
  const φ2 = (lat2 * Math.PI) / 180;
  const Δφ = ((lat2 - lat1) * Math.PI) / 180;
  const Δλ = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; // Distance in meters
};

export default function EmployeeClientWrapper({
  children,
  tabParam,
  session
}: EmployeeClientWrapperProps) {
  console.log('session: ', session);
  const [location, setLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);
  const [selectedTab, setSelectedTab] = useState<string | null>(null);
 const venueLat = (session as any).user.venueLat;
 const venueLong = (session as any).user.venueLong;
 
  // Geolocation logic and distance-based logout
  // useEffect(() => {
  //   if ('geolocation' in navigator) {
  //     navigator.geolocation.getCurrentPosition(
  //       ({ coords }) => {
  //         const userLocation = {
  //           latitude: coords.latitude,
  //           longitude: coords.longitude,
  //         };
  //         setLocation(userLocation);

  //         // Calculate distance to venue
  //         const distance = calculateDistance(
  //           userLocation.latitude,
  //           userLocation.longitude,
  //           venueLat,
  //           venueLong
  //         );

  //         // If distance > 20 meters, trigger logout
  //         if (distance > 100) {
  //           // signOut({ callbackUrl: '/' });
  //             //  setLogoutLoading(true);
              
  //                  logOutService('admin/logout-employee');
            
  //               signOut({ callbackUrl: "/" });
  //               // setLogoutLoading(false);
  //         }
  //       },
  //       (error) => {
  //         console.error('Geolocation error:', error);
  //         // Optionally handle geolocation errors (e.g., permission denied)
  //       }
  //     );
  //   } else {
  //     console.error('Geolocation not supported');
  //   }
  // }, []);

  useEffect(() => {
  let watchId;

  if ('geolocation' in navigator) {
    watchId = navigator.geolocation.watchPosition(
      ({ coords }) => {
        const userLocation = {
          latitude: coords.latitude,
          longitude: coords.longitude,
        };
        setLocation(userLocation);

        const distance = calculateDistance(
          userLocation.latitude,
          userLocation.longitude,
          venueLat,
          venueLong
        );

        if (distance > 200) {
          logOutService('admin/logout-employee');
          signOut({ callbackUrl: "/" });
        }
      },
      (error) => {
        console.error('Geolocation error:', error);
      },
      {
        enableHighAccuracy: true,
        maximumAge: 10000, // max cached location age
        timeout: 10000
      }
    );
  } else {
    console.error('Geolocation not supported');
  }

  return () => {
    if (watchId) {
      navigator.geolocation.clearWatch(watchId);
    }
  };
}, []);

  // Log location when it changes
  useEffect(() => {
    console.log('location: ', location);
  }, [location]);

  // Tab parameter logic
  useEffect(() => {
    if (tabParam && ['Upcoming', 'Previous', 'Cancelled'].includes(tabParam)) {
      setSelectedTab(tabParam);
    }
  }, [tabParam]);

  return <>{children}</>;
}