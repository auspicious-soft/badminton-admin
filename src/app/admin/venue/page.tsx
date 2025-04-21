// "use client";
// import React, { useState } from "react";
// import SearchBar from "../components/SearchBar";
// import { Add } from "@/utils/svgicons";
// import Image from "next/image";
// import firstvenue from "@/assets/images/firstvenue.png";
// import secondvenue from "@/assets/images/secondvenue.png";
// import thirdvenue from "@/assets/images/thirdvenue.png";
// import fourthvenue from "@/assets/images/fourthvenue.png";
// import fifthvenue from "@/assets/images/fifthvenue.png";
// import ReactPaginate from "react-paginate";
// import { useRouter } from "next/navigation";
// import TablePagination from "../components/TablePagination";
// import useSWR from 'swr';
// import { getAllVenues } from "@/services/admin-services";

// // const venues = [
// //   { image: firstvenue, name: "Greenwood Tennis Center", location: "Bangalore" },
// //   { image: secondvenue, name: "Silver Lake Sports Complex", location: "Mumbai" },
// //   { image: thirdvenue, name: "Maplewood Tennis Club", location: "Chennai" },
// //   { image: fourthvenue, name: "Cedar Grove Tennis Park", location: "Hyderabad" },
// //   { image: fifthvenue, name: "Sunset Ridge Tennis Arena", location: "Kolkata" },

// //   { image: firstvenue, name: "Greenwood Tennis Center", location: "Bangalore" },
// //   { image: secondvenue, name: "Silver Lake Sports Complex", location: "Mumbai" },
// //   { image: thirdvenue, name: "Maplewood Tennis Club", location: "Chennai" },
// //   { image: fourthvenue, name: "Cedar Grove Tennis Park", location: "Hyderabad" },
// //   { image: fifthvenue, name: "Sunset Ridge Tennis Arena", location: "Kolkata" },

// //   { image: firstvenue, name: "Greenwood Tennis Center", location: "Bangalore" },
// //   { image: secondvenue, name: "Silver Lake Sports Complex", location: "Mumbai" },
// //   { image: thirdvenue, name: "Maplewood Tennis Club", location: "Chennai" },
// //   { image: fourthvenue, name: "Cedar Grove Tennis Park", location: "Hyderabad" },
// //   { image: fifthvenue, name: "Sunset Ridge Tennis Arena", location: "Kolkata" },
 
// // ];

// const itemsPerPage = 10; // Show 10 venues per page

// const Page = () => {
//   const [searchParams, setSearchParams] = useState("");
//   const [currentPage, setCurrentPage] = useState(0);
//   const [page, setPage] = useState(1);
//   const itemsPerPage = 10;
//   const router= useRouter();
//   const {data, isLoading, mutate} = useSWR("/admin/get-venues",getAllVenues)
//   console.log('data: ', data?.data);
//   const venues =data?.data?.data
//   const handlePageChange = (newPage: number) => {
//     setPage(newPage);
//   };
//   // Filter venues based on search
//   // const filteredVenues = venues.filter((venue) =>
//   //   venue.name.toLowerCase().includes(searchParams.toLowerCase())
//   // );

//   // Pagination logic
//   // const pageCount = Math.ceil(filteredVenues.length / itemsPerPage);
//   // const offset = currentPage * itemsPerPage;
//   // const currentVenues = filteredVenues.slice(offset, offset + itemsPerPage);

//   const handlePageClick = ({ selected }) => {
//     setCurrentPage(selected);
//   };

//   return (
//     <>
//       <div className="flex flex-col md:flex-row justify-between items-center gap-4 md:gap-0">
//         <div className="text-[#10375C] text-2xl md:text-3xl font-semibold">All Venues</div>
//         <div className="flex flex-col md:flex-row gap-3 md:gap-[13px] w-full md:w-auto">
//           <div className="w-full md:w-auto">
//             <SearchBar setQuery={setSearchParams} query={searchParams} />
//           </div>
//           <div className="px-5 py-3 bg-[#1b2229] rounded-[28px] flex justify-center items-center gap-[5px] cursor-pointer">
//             <Add />
//             <div onClick={ () => router.push("/admin/venue/add-new-venue")} className="text-white text-sm font-medium">Add A New Venue</div>
//           </div>
//         </div>
//       </div>

//       {/* Venue List */}
//       <div onClick={ () => router.push("/admin/venue/single-venue-active")} className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 mt-6">
//         {venues?.map((venue, index) => (
//           <div key={index} className="flex flex-col items-start">
//             <Image src={venue.image} alt={venue.name} width={250} height={200} className="w-full h-52 rounded-[10px]" />
//             <div className="mt-[15px] text-Primary-Font text-lg font-medium">{venue.name}</div>
//             <div className="mb-[5px] text-Secondary-Font text-[#71717a] text-xs">{venue.location}</div>
//           </div>
//         ))}
//       </div>

//       {/* Pagination */}
//       <div className="my-4 flex justify-end gap-2">
//       {pageCount > 1 && (
//         // <ReactPaginate
//         //   breakLabel="..."
//         //   nextLabel="next >"
//         //   onPageChange={handlePageClick}
//         //   pageRangeDisplayed={3}
//         //   pageCount={pageCount}
//         //   previousLabel="< previous"
//         //   containerClassName="flex justify-center space-x-2 mt-6"
//         //   activeClassName="text-white bg-blue-600 px-3 py-1 rounded"
//         //   pageClassName="px-3 py-1 border border-gray-300 rounded"
//         //   previousClassName="px-3 py-1 border border-gray-300 rounded"
//         //   nextClassName="px-3 py-1 border border-gray-300 rounded"
//         //   disabledClassName="opacity-50 cursor-not-allowed"
//         // />
//         // <div className="mt-4 flex justify-end gap-2">
//             <TablePagination
//               setPage={handlePageChange}
//               page={page}
//               totalData={20}
//               itemsPerPage={itemsPerPage}
//             />
//           // </div>
//       )}
//       </div>
//     </>
//   );
// };

// export default Page;





"use client";
import React, { useState, useEffect } from "react";
import SearchBar from "../components/SearchBar";
import { Add } from "@/utils/svgicons";
import Image from "next/image";
import firstvenue from "@/assets/images/firstvenue.png";
import secondvenue from "@/assets/images/secondvenue.png";
import thirdvenue from "@/assets/images/thirdvenue.png";
import fourthvenue from "@/assets/images/fourthvenue.png";
import fifthvenue from "@/assets/images/fifthvenue.png";
import { useRouter } from "next/navigation";
import useSWR from 'swr';
import { getAllVenues } from "@/services/admin-services";
import TablePagination from "../components/TablePagination";

interface Venue {
  image: string; // Adjust based on actual API response (e.g., URL or asset path)
  name: string;
  location: string;
}

interface VenuesResponse {
  data: {
    data: Venue[];
    meta: {
      total: number;
    };
  };
}

const itemsPerPage = 10;

const Page = () => {
  const [searchParams, setSearchParams] = useState("");
  const [page, setPage] = useState(1);
  const router = useRouter();
  const { data, isLoading, mutate } = useSWR<VenuesResponse>(
    `/admin/get-venues?search=${searchParams}&page=${page}&limit=${itemsPerPage}`,
    getAllVenues
  );

  // Handle dynamic venues data from API
  const venues = data?.data.data || [];
  console.log('venues: ', venues);
  const totalVenues = searchParams ? venues.length : data?.data.meta.total || 0; // Use filtered count with search

  useEffect(() => {
    setPage(1); // Reset to first page when search changes
  }, [searchParams]);

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  return (
    <>
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 md:gap-0">
        <div className="text-[#10375C] text-2xl md:text-3xl font-semibold">All Venues</div>
        <div className="flex flex-col md:flex-row gap-3 md:gap-[13px] w-full md:w-auto">
          <div className="w-full md:w-auto">
            <SearchBar setQuery={setSearchParams} query={searchParams} />
          </div>
          <div
            className="px-5 py-3 bg-[#1b2229] rounded-[28px] flex justify-center items-center gap-[5px] cursor-pointer"
            onClick={() => router.push("/admin/venue/add-new-venue")}
          >
            <Add />
            <div className="text-white text-sm font-medium">Add A New Venue</div>
          </div>
        </div>
      </div>

      {/* Venue List */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 mt-6">
        {isLoading ? (
          <p className="text-center text-[#10375C] py-4">Loading...</p>
        ) : venues.length === 0 ? (
          <p className="text-center text-[#10375C] py-4">No data found.</p>
        ) : (
          venues.map((venue, index) => (
            <div key={index} className="flex flex-col items-start" onClick={() => router.push("/admin/venue/single-venue-active")}>
              <Image
                src={firstvenue} // Fallback to firstvenue if image is missing or invalid
                alt={venue.name}
                width={250}
                height={200}
                className="w-full h-52 rounded-[10px] object-cover"
              />
              <div className="mt-[15px] text-Primary-Font text-lg font-medium">{venue.name}</div>
              <div className="mb-[5px] text-Secondary-Font text-[#71717a] text-xs">{venue.location}</div>
            </div>
          ))
        )}
      </div>

      {/* Pagination */}
      <div className="my-4 flex justify-end gap-2">
        {/* {totalVenues > itemsPerPage && ( */}
          <TablePagination
            setPage={handlePageChange}
            page={page}
            totalData={totalVenues}
            itemsPerPage={itemsPerPage}
          />
        {/* )} */}
      </div>
    </>
  );
};

export default Page;