"use client";
import { useState } from "react";
import Image from "next/image";
import Human from "@/assets/images/Human.png";
import { EyeIcon, DownArrowIcon, UpArrowIcon } from "@/utils/svgicons";
import UserProfileImage from "@/assets/images/userProfile4.png";
import SearchBar from "../SearchBar";
import TablePagination from "../TablePagination";
import { useRouter } from "next/navigation";
// Sample user data
const users = [
  { id: 1, name: "Alex Parker", level: 60, status: "Success", email: "james.smith@example.com", Sold:120, phone: "+1 555-234-5678", discounted: 15.66, actualPrice:25.66 },
  { id: 2, name: "Jordan Lee", level: 300, status: "Success", email: "sophia.brown@example.com", Sold:200, phone: "+1 555-234-5678", discounted: 15.66, actualPrice:25.66 },
  { id: 3, name: "Tracy Martin", level: 60, status: "Success", email: "mia.johnson@example.com", Sold:24, phone: "+1 555-234-5678", discounted: 15.66, actualPrice:25.66 },
  { id: 4, name: "Isabella Anderson", level: 600, status: "Success", email: "isabella.lee@example.com", Sold: 32, phone: "+1 555-234-5678", discounted: 15.66, actualPrice:25.66 },
  { id: 5, name: "Jacob Davis", level: 50, status: "Success", email: "jacob.davis@example.com", Sold: 224, phone: "+1 555-234-5678", discounted: 15.66, actualPrice:25.66 },
  { id: 6, name: "Marley Martinez", level: 30, status: "Success", email: "sophia.brown@example.com", Sold: 62, phone: "+1 555-234-5678", discounted: 15.66, actualPrice:25.66 },
  { id: 7, name: "Lucas Martinez", level: 600, status: "Success", email: "lucas.martinez@example.com", Sold: 352, phone: "+1 555-234-5678", discounted: 15.66, actualPrice:25.66 },
  { id: 8, name: "Ava Martinez", level: 300, status: "Success", email: "ava.martinez@example.com", Sold: 52, phone: "+1 555-234-5678", discounted: 15.66, actualPrice:25.66 },
  { id: 9, name: "Emily Jones", level: 400, status: "Success", email: "emily.jones@example.com", Sold: 247, phone: "+1 555-234-5678", discounted: 15.66, actualPrice:25.66 },
  { id: 10, name: "Bob Johnson", level: 50, status: "Success", email: "bob.johnson@example.com", Sold: 12, phone: "+1 555-234-5678", discounted: 15.66, actualPrice:25.66 },
  { id: 11, name: "Marley Martinez", level: 30, status: "Success", email: "sophia.brown@example.com", Sold: 62, phone: "+1 555-234-5678", discounted: 15.66, actualPrice:25.66 },
  { id: 12, name: "Lucas Martinez", level: 600, status: "Success", email: "lucas.martinez@example.com", Sold: 352, phone: "+1 555-234-5678", discounted: 15.66, actualPrice:25.66 },
];

// Sample detailed user data
const userDetails = {
  id: 4,
  name: "Isabella Anderson",
  email: "isabella.lee@example.com",
  phone: "+1 555-210-4569",
  city: "Chandigarh",
  loyaltyPoints: 6800,
  lastMonthLevel: 6549,
  levelThisMonth: -4,
  improvement12Months: -0.4,
  confidence: 27,
};

const games = ["Padel", "Pickleball"];

export default function InventoryComponent() {
  const router = useRouter();
  const [selectedUser, setSelectedUser] = useState({ id: 1, name: "Alex Parker", level: 6000, email: "james.smith@example.com", phone: "+1 555-234-5678" });
  const [searchParams, setSearchParams] = useState("");
  const [page, setPage] = useState(1);
  const itemsPerPage = 11;

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    // setQuery(`page=${newPage}&limit=${itemsPerPage}`);
  };
  // Filter users based on search
  const filteredUsers = users.filter((user) => user.name.toLowerCase().includes(searchParams.toLowerCase()));
  const handleClick = () => {
    // router.push('/admin/users/1');
  }
  return (
    <>
      <div className="flex w-full lg:w-2/3 justify-between mb-[15px]">
      </div>
      <div className="flex flex-col lg:flex-row w-full  rounded-[20px] gap-6 mb-[40px]">
        {/* Left Panel: User List */}
        <div className="w-full lg:w-2/3 bg-[#f2f2f4] shadow-md rounded-[20px] p-[14px] overflow-auto">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-[#10375c] text-xl font-semibold">Inventory</h2>
            <SearchBar setQuery={setSearchParams} query={searchParams} />
          </div>
          <div className="overflow-x-auto overflo-custom max-w-full">
            <div className="w-full min-w-[600px] rounded-[10px] bg-[#f2f2f4] flex text-sm font-semibold text-[#7e7e8a]">
              <div className="w-[25%] h-3.5 text-[#7e7e8a] text-xs font-medium">Name Of Product</div>
              <div className="w-[15%] h-3.5 text-[#7e7e8a] text-center text-xs font-medium">Quantity</div>
              <div className="w-[20%] h-3.5 text-[#7e7e8a] text-center text-xs font-medium">Discounted Price</div>
              <div className="w-[15%] h-3.5 text-[#7e7e8a] text-center text-xs font-medium">Actual Price</div>
              <div className="w-[21%] h-3.5 text-[#7e7e8a] text-xs text-center font-medium">Sold This Month</div>
              <div className="w-[11%] h-3.5 text-[#7e7e8a] text-center text-xs font-medium ">Action</div>
            </div>
            <div className="w-full h-[0px] border border-[#d0d0d0] border-dotted mt-[8px]"></div>
            <div className="w-full min-w-[600px]">
              {filteredUsers.map((user, index) => (
                <div key={user.id} className={`cursor-pointer flex items-center h-[47px] px-3.5 py-3 rounded-[10px] ${selectedUser?.id === user.id ? "bg-[#176dbf] text-white" : index % 2 === 0 ? "bg-[#f2f2f4]":"bg-white"}`} onClick={() => setSelectedUser(user)}>
                  <div className={`w-[25%] flex items-center gap-2 break-words text-[#1b2229] text-xs font-medium ${selectedUser?.id === user.id ? "text-white" : "text-[#1b2229]"}`}>
                    <Image src={UserProfileImage} alt="Avatar" className="rounded-full" width={25} height={25} />
                    {user.name}
                  </div>
                  <div className={`w-[20%] text-[#1b2229] text-xs text-center font-medium ${selectedUser?.id === user.id ? "text-white" : "text-[#1b2229]"}`}>{user.level}</div>
                  <div className={`w-[20%] text-[#1b2229] text-xs text-center font-medium ${selectedUser?.id === user.id ? "text-white" : "text-[#1b2229]"}`}>${user.discounted}</div>
                  <div className={`w-[15%] text-[#1b2229] text-center text-xs font-medium ${selectedUser?.id === user.id ? "text-white" : "text-[#1b2229]"}`}>${user.actualPrice}</div>
                  <div className={`w-[20%] text-[#1b2229] text-center flex-wrap text-xs font-medium ${selectedUser?.id === user.id ? "text-white" : "text-[#1b2229]"}`}>{user.Sold} items</div>
                  <div className="w-[10%] text-[#1b2229] text-xs font-medium flex justify-center">
                    <EyeIcon stroke={selectedUser?.id === user.id ? "#FFFF" : "#fd5602"} />
                  </div>
                </div>
              ))}
            </div>
            {/* Pagination */}

            <div className="mt-4 flex justify-end gap-2">
              <TablePagination
                setPage={handlePageChange}
                page={page}
                totalData={users.length}
                itemsPerPage={itemsPerPage}
              />
            </div>
          </div>
        </div>

        {/* Right Panel: User Details */}
        <div className="flex flex-col w-full lg:w-1/3 gap-[24px] h-full justify-between ">
          <div className=" bg-[#f2f2f4] shadow-md rounded-[20px] relative">
            {selectedUser ? (
              <div className="w-full bg-[#f2f2f4] rounded-[20px] min-h-full">
                {/* Blue Header with Wave */}
                <div className="relative w-full">
                  <svg width="100%" height="100%" viewBox="0 0 471 165" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M0 20 Q0 0 20 0 H451 Q471 0 471 20 V155.046 C471 155.046 372.679 132.651 235.5 155.046 C98.3213 177.442 0 155.046 0 155.046 Z" fill="#176dbf" />
                  </svg>
                  <div className="absolute top-0 left-0 w-full h-full flex gap-[25px] items-center p-2 pl-[20px] text-white">
                    <Image src={UserProfileImage} alt="User Avatar" className="rounded-full  border-2 border-white w-81 h-81 " height={81} width={81} />
                    <div>
                      <div className="text-white text:2xl md:text-3xl font-bold leading-10 tracking-wide">Name of the Product</div>
                    </div>
                  </div>
                </div>


                {/* Content Section */}
                <div className="flex flex-col w-full mt-[27px] gap-[20px] relative z-20">
                  {/* Personal Details */}
                  <div className="w-[85%] ml-[30px] flex-col justify-start items-start gap-3 inline-flex">
                    <div className="self-stretch text-[#1c2329] text-sm font-semibold leading-[16.80px]">Product Details</div>
                    <div className="self-stretch justify-between items-center inline-flex">
                      <div className="flex-col justify-start items-start gap-2.5 inline-flex">
                        <div className="text-[#7e7e8a] text-xs font-medium capitalize leading-[15px]">Name</div>
                        <div className="text-[#7e7e8a] text-xs font-medium capitalize leading-[15px]">Discounted Price</div>
                        <div className="text-[#7e7e8a] text-xs font-medium capitalize leading-[15px]">Actual Price</div>
                        <div className="text-[#7e7e8a] text-xs font-medium capitalize leading-[15px]">Quantity</div>
                      </div>
                      <div className="flex-col justify-start items-end gap-2.5 inline-flex">
                        <div className="text-right text-[#1b2229] text-xs font-bold capitalize leading-[15px]">Product name Goes here</div>
                        <div className="text-right text-[#1b2229] text-xs font-bold leading-[15px]">$25.00</div>
                        <div className="text-right text-[#1b2229] text-xs font-bold capitalize leading-[15px]">$35.00</div>
                        <div className="text-right text-[#1b2229] text-xs font-bold capitalize leading-[15px]">150</div>
                        <button className="text-right text-[#176dbf] text-[10px] font-normal capitalize leading-3">Add More</button>
                      </div>
                    </div>
                  </div>

                  {/* Statistics */}
                  <div className="w-[85%] ml-[30px] flex-col justify-start items-start gap-3 inline-flex">
                    <div className="text-[#1c2329] text-sm font-semibold leading-[16.80px]">Description</div>
                    <div className=" text-black/60 text-[10px] font-medium leading-[18px]">consequat. ex vero qui dolor nulla adipiscing exerci sed sit ut eu ullamcorper amet, praesent odio facilisi. quis iusto nulla aliquip iriure nibh nisl consequat, dolor enim eum et erat elit, tation aliquam accumsan euismod lobortis dignissim volutpat. ad dolore feugiat feugait dolore Duis vulputate dolore zzril autem wisi vel</div>
                  </div>
                  <div className="w-[85%] ml-[30px] flex-col justify-start items-start gap-3 inline-flex mb-[30px]">
                    <div className="text-[#1c2329] text-sm font-semibold leading-[16.80px]">Specifications</div>
                    <div className=" text-black/60 text-[10px] font-medium leading-[18px]">consequat. ex vero qui dolor nulla adipiscing exerci sed sit ut eu ullamcorper amet, praesent odio facilisi. quis iusto nulla aliquip iriure nibh nisl consequat, dolor enim eum et erat elit, tation aliquam accumsan euismod lobortis dignissim volutpat. ad dolore feugiat feugait dolore Duis vulputate dolore zzril autem wisi vel</div>
                  </div>
                </div>

              </div>
            ) : (
              <p className="text-center text-gray-500">Select a user to see details</p>
            )}

          </div>
          <button onClick={handleClick} className="h-12  py-4 bg-[#10375c] rounded-[28px] justify-center items-center text-white text-sm font-medium ">Edit Product</button>

        </div>
      </div>
    </>
  );
}
