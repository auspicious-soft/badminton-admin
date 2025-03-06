// "use client";
// import { WhiteDownArrow, BottomArrow,Edit, Add, EyeIcon } from "@/utils/svgicons";
// import React, { useState } from "react";
// import SearchBar from "../../components/SearchBar";
// import Image from "next/image";
// import AlexParker from "@/assets/images/AlexParker.png";
// import JordanLee from "@/assets/images/JordanLee.png";

// const employees = [
// { id: 1, name: "Alex Parker", status: "Working", email: "janesmith@example.com", phonenumber: "+1 (555) 234-5678" },
// { id: 2, name: "Jordan Lee", status: "Ex-Employee", email: "sophia.brown@example.com", phonenumber: "+1 (555) 456-7890" },
// { id: 3, name: "Tracy Martin", status: "Working", email: "mia.johnson@example.co", phonenumber: "+1 (555) 765-4321" },
// { id: 4, name: "Alex Parker", status: "Working", email: "isabella.lee@example.com", phonenumber: "+1 (555) 234-5678" },
// { id: 5, name: "Alex Parker", status: "Working", email: "jacob.davis@example.com", phonenumber: "+1 (555) 234-5888" },
// { id: 6, name: "Alex Parker", status: "Working", email: "sophia.brown@example.com", phonenumber: "+1 (555) 234-5778" },
// { id: 7, name: "Alex Parker", status: "Working", email: "lucas.martinez@example.com", phonenumber: "+1 (555) 234-8768" },
// { id: 8, name: "Alex Parker", status: "Working", email: "emily.jones@example.com", phonenumber: "+1 (555) 234-9847" },
// { id: 9, name: "Alex Parker", status: "Working", email: "ava.martinez@example.com", phonenumber: "+1 (555) 234-5777" },
// { id: 10, name: "Alex Parker", status: "Working", email: "emily.jones@example.com", phonenumber: "+1 (555) 234-5778" },
// { id: 11, name: "Alex Parker", status: "Working", email: "bob.johnson@example.comm", phonenumber: "+1 (555) 234-5348" },
// { id: 12, name: "Alex Parker", status: "Working", email: "emily.jones@example.com", phonenumber: "+1 (555) 234-5668" },
// ];

// interface NotificationData {
//  title: string;
//  text: string;
//  recipients: string[];
// }

// interface OptionType {
//  value: string;
//  label: string;
// }

// const options: OptionType[] = [
//  { value: "Pickleball", label: "Pickleball" },
//  { value: "Paddle", label: "Paddle" },
// ];

// const Page = () => {
//  const [formData, setFormData] = useState<NotificationData>({
//   title: "",
//   text: "",
//   recipients: [],
//  });

//  const [selectedMatch, setSelectedMatch] = useState({
//   id: 1,
//   team1: "Alex Parker",
//   team2: "Alex Parker",
//   game: "Padel",
//   date: "22-01-2024",
//  });
//  const [searchParams, setSearchParams] = useState("");

//  const handleRecipientsChange = (selectedOptions: MultiValue<OptionType>) => {
//   const recipients = selectedOptions.map((option) => option.value);
//   setFormData((prev) => ({
//    ...prev,
//    recipients: recipients,
//   }));
//  };

// export const Page = () => {
//  const [searchParams, setSearchParams] = useState("");
//  const [selectedMatch, setSelectedMatch] = useState(null);

//  return (
//   <>

//    <div className="text-[#10375c] text-3xl font-semibold ">All Employees</div>

//    <div className="flex px-[20px] py-[12px] gap-[381px]">
//     <div className="gap-[5px] w-full flex justify-end ">
//      <div className="flex h-10 px-5 py-3 bg-[#1b2229] rounded-[28px] justify-center items-center gap-[5px]">
//       <div className="text-white text-sm font-medium ">Sort</div>
//       <WhiteDownArrow />
//      </div>

//      <div className="flex h-10 w-[150px] justify-between px-5 py-3 bg-[#1b2229] rounded-[28px] items-center gap-[5px]">
//       <div className="text-white text-sm font-medium ">Status</div>
//       <WhiteDownArrow />
//      </div>
//     </div>

//     <div className=" justify-end">
//      <div className="w-[210px] flex h-10 justify-between px-5 py-3 bg-[#1b2229] rounded-[28px] items-center gap-[5px]">
//       <Add />
//       <div className="text-white text-sm font-medium ">Add A New Employee</div>
//      </div>
//     </div>
//    </div>

//    <div className="flex">
//    {/* left side */}
//    <div className="w-2/3 px-[16px] py-[21px] h-[657px] bg-[#f2f2f4] rounded-[20px]">
//     <div className="flex justify-between">
//      <div className="text-[#10375c] text-xl font-medium ">All Employees</div>
//      <div className="">
//       <SearchBar setQuery={setSearchParams} query={searchParams} />
//      </div>
//     </div>

//     <div className=" h-3.5 justify-between items-center flex text-[#7e7e8a] mt-[20px] mb-[8px] text-xs font-medium">
//      <div>Name</div>
//      <div>Status</div>
//      <div>Email</div>
//      <div>Phone Number</div>
//      <div>Action</div>
//     </div>
//     <div className="mb-[8px] h-[0px] border border-[#d0d0d0]"></div>

//     {employees.map((employee, index) => (
//      <div key={employee.id} className={`w-full min-w-[600px] cursor-pointer flex items-center h-[47px] px-3.5 py-3 rounded-[10px] ${selectedMatch?.id === employee.id ? "bg-[#176dbf] text-white" : index % 2 === 0 ? "bg-white" : "bg-gray-200"}`} onClick={() => setSelectedMatch(employee)}>

//         {/* { id: 2, team1: "Jordan Lee", team2: "Jordan Lee", game: "Pickleball", date: "22-01-2024" },  */}
//         {/* { id: 1, name: "Alex Parker", status: "Working", email: "janesmith@example.com", phonenumber: "+1 (555) 234-5678" }, */}

//       <div className={`px-4 py-2 w-1/4 flex items-center gap-2 text-xs font-medium ${selectedMatch?.id === employee.id ? "text-white" : "text-[#1b2229]"}`}>
//        <Image src={AlexParker} alt="Avatar" className="rounded-full" width={25} height={25} />   {employee.name}   </div>

//       <div className={`px-4 py-2 w-1/4 flex items-center gap-2 text-xs font-medium ${selectedMatch?.id === employee.id ? "text-white" : "text-[#1b2229]"}`}>    {employee.status}     </div>

//       <div className={`px-4 py-2 w-1/4 text-xs font-medium text-center ${selectedMatch?.id === employee.id ? "text-white" : "text-[#1b2229]"}`}>     {employee.email}    </div>

//       <div className={`text-xs font-medium ${selectedMatch?.id === employee.id ? "text-white" : "text-[#1b2229]"}`}>          {employee.phonenumber}     </div>

//       <div className="px-4 py-2 w-1/6 text-xs font-medium flex justify-center">
//        <EyeIcon stroke={selectedMatch?.id === employee.id ? "#FFFF" : "#fd5602"} />
//       </div>

//      </div>
//     ))}
//    </div>

//    {/* right side */}

// <div className="1/3 m-[20px]"></div>
//    <img className="w-[441px] h-[262px] rounded-[10px]" src="https://placehold.co/441x262" />
//    <div className="text-[#10375c] text-2xl font-semibold">Name of the Employee</div>

//    <div className="w-full  bg-[#f2f2f4] rounded-[20px] px-[15px] py-[14px]">
//       {/* <Image className="rounded-[10px] w-full h-auto object-cover" alt="padel game image" src={MatchImage} width={500} height={300} /> */}

//       <div className="flex justify-between items-center">
//        <div className="text-[#10375c] text-2xl font-semibold mt-[25px]">Name of the Venue</div>
//        <div className="mt-[15px]">
//         <Edit />
//        </div>
//       </div>

//       <div className="h-[69.41px]">
//        <div className="text-[#1b2229] mt-[25px] mb-[10px] text-xs font-medium">Location</div>
//        <div className="h-[45.41px] px-[15px] py-2.5 bg-white rounded-[39px]">
//         <input type="date" className="text-black/60 text-xs font-medium mt-[5px]" />
//        </div>
//       </div>

//       <div className="h-[69.41px]">
//        <div className="text-[#1b2229] mt-[15px] mb-[10px] text-xs font-medium">Games Available</div>
//        <Select
//         isMulti
//         options={options}
//         value={options.filter((option) => formData.recipients.includes(option.value))}
//         onChange={handleRecipientsChange}
//         className="w-full text-black/60 text-xs font-medium"
//         classNamePrefix="react-select"
//         placeholder="Select Game..."
//         styles={{
//          control: (base) => ({
//           ...base,
//           borderRadius: "44px",
//           border: "1px solid #e6e6e6",
//           boxShadow: "none",
//           height: "45.41px",
//           backgroundColor: "white",
//           "&:hover": {
//            borderColor: "#e6e6e6",
//           },
//           padding: "2px",
//          }),
//          menu: (base) => ({
//           ...base,
//           borderRadius: "8px",
//           width: "40%",
//           boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
//          }),
//          option: (base, { isFocused }) => ({
//           ...base,
//           backgroundColor: isFocused ? "#e6f7ff" : "white",
//           color: "#1c2329",
//           "&:active": {
//            backgroundColor: "#e6f7ff",
//           },
//          }),
//          multiValue: (base) => ({
//           ...base,
//           backgroundColor: "#1c2329",
//           borderRadius: "5px",
//          }),
//          multiValueLabel: (base) => ({
//           ...base,
//           color: "white",
//           padding: "4px 2px 4px 12px",
//          }),
//          multiValueRemove: (base) => ({
//           ...base,
//           color: "white",
//           margin: "4px 5px 4px 0px",
//           "&:hover": {
//            backgroundColor: "#1c2329",
//            color: "white",
//           },
//          }),
//         }}
//        />
//       </div>

//       <div className="h-[69.41px]">
//        <div className="text-[#1b2229] mt-[15px] mb-[10px] text-xs font-medium">Status</div>
//        <div className="h-[45.41px] px-[15px] py-2.5 bg-white rounded-[39px] flex self-stretch justify-between items-center">
//         <div className="text-black/60 text-xs font-medium mt-[5px]">Active</div>
//         <BottomArrow />
//        </div>
//       </div>

//       <button className="w-full h-12 bg-[#10375c] rounded-[28px] text-white text-sm font-medium mt-[15px]">Save</button>
//      </div>
//     </div>

//    </div>
//   </>
//  );
// };

// export default Page;

// "use client";
// import { WhiteDownArrow, BottomArrow, Edit, Add, EyeIcon } from "@/utils/svgicons";
// import React, { useState } from "react";
// import SearchBar from "../../components/SearchBar";
// import Image from "next/image";
// import Select, { MultiValue } from "react-select";
// import AlexParker from "@/assets/images/AlexParker.png";
// import JordanLee from "@/assets/images/JordanLee.png";


// const employees = [
//  { id: 1, name: "Alex Parker", status: "Working", email: "janesmith@example.com", phonenumber: "+1 (555) 234-5678" },
//  { id: 2, name: "Jordan Lee", status: "Ex-Employee", email: "sophia.brown@example.com", phonenumber: "+1 (555) 456-7890" },
//  { id: 3, name: "Tracy Martin", status: "Working", email: "mia.johnson@example.co", phonenumber: "+1 (555) 765-4321" },
//  { id: 4, name: "Alex Parker", status: "Working", email: "isabella.lee@example.com", phonenumber: "+1 (555) 234-5678" },
//  { id: 5, name: "Alex Parker", status: "Working", email: "jacob.davis@example.com", phonenumber: "+1 (555) 234-5888" },
//  { id: 6, name: "Alex Parker", status: "Working", email: "sophia.brown@example.com", phonenumber: "+1 (555) 234-5778" },
//  { id: 7, name: "Alex Parker", status: "Working", email: "lucas.martinez@example.com", phonenumber: "+1 (555) 234-8768" },
//  { id: 8, name: "Alex Parker", status: "Working", email: "emily.jones@example.com", phonenumber: "+1 (555) 234-9847" },
//  { id: 9, name: "Alex Parker", status: "Working", email: "ava.martinez@example.com", phonenumber: "+1 (555) 234-5777" },
//  { id: 10, name: "Alex Parker", status: "Working", email: "emily.jones@example.com", phonenumber: "+1 (555) 234-5778" },
//  { id: 11, name: "Alex Parker", status: "Working", email: "bob.johnson@example.comm", phonenumber: "+1 (555) 234-5348" },
//  { id: 12, name: "Alex Parker", status: "Working", email: "emily.jones@example.com", phonenumber: "+1 (555) 234-5668" },
// ];


// interface NotificationData {
//  title: string;
//  text: string;
//  recipients: string[];
// }


// interface OptionType {
//  value: string;
//  label: string;
// }


// const options: OptionType[] = [
//  { value: "Pickleball", label: "Pickleball" },
//  { value: "Paddle", label: "Paddle" },
// ];


// const Page = () => {
//  const [formData, setFormData] = useState<NotificationData>({
//   title: "",
//   text: "",
//   recipients: [],
//  });


//  const [selectedMatch, setSelectedMatch] = useState({
//   id: 1,
//   name: "Alex Parker",
//   status: "Working",
//   email: "janesmith@example.com",
//   phonenumber: "+1 (555) 234-5678",
//  });


//  const [searchParams, setSearchParams] = useState("");


//  const handleRecipientsChange = (selectedOptions: MultiValue<OptionType>) => {
//   const recipients = selectedOptions.map((option) => option.value);
//   setFormData((prev) => ({
//    ...prev,
//    recipients: recipients,
//   }));
//  };


//  return (
//   <>
//    <div className="text-[#10375c] text-3xl font-semibold ">All Employees</div>

//    <div className="flex px-[20px] py-[12px] gap-[381px]">
//     <div className="gap-[5px] w-full flex justify-end ">
//      <div className="flex h-10 px-5 py-3 bg-[#1b2229] rounded-[28px] justify-center items-center gap-[5px]">
//       <div className="text-white text-sm font-medium ">Sort</div>
//       <WhiteDownArrow />
//      </div>

//      <div className="flex h-10 w-[150px] justify-between px-5 py-3 bg-[#1b2229] rounded-[28px] items-center gap-[5px]">
//       <div className="text-white text-sm font-medium ">Status</div>
//       <WhiteDownArrow />
//      </div>
//     </div>

//     <div className=" justify-end">
//      <div className="w-[210px] flex h-10 justify-between px-5 py-3 bg-[#1b2229] rounded-[28px] items-center gap-[5px]">
//       <Add />
//       <div className="text-white text-sm font-medium ">Add A New Employee</div>
//      </div>
//     </div>
//    </div>

//    <div className="flex">
//     {/* left side */}
//     <div className="w-2/3 px-[16px] py-[21px] h-[657px] bg-[#f2f2f4] rounded-[20px]">
//      <div className="flex justify-between">
//       <div className="text-[#10375c] text-xl font-medium ">All Employees</div>
//       <div className="">
//        <SearchBar setQuery={setSearchParams} query={searchParams} />
//       </div>
//      </div>

//      <div className=" h-3.5 justify-between items-center flex text-[#7e7e8a] mt-[20px] mb-[8px] text-xs font-medium">
//       <div>Name</div>
//       <div>Status</div>
//       <div>Email</div>
//       <div>Phone Number</div>
//       <div>Action</div>
//      </div>
//      <div className="mb-[8px] h-[0px] border border-[#d0d0d0]"></div>

//      {employees.map((employee, index) => (
//       <div key={employee.id} className={`w-full min-w-[600px] cursor-pointer flex items-center h-[47px] px-3.5 py-3 rounded-[10px] ${selectedMatch?.id === employee.id ? "bg-[#176dbf] text-white" : index % 2 === 0 ? "bg-white" : "bg-gray-200"}`} onClick={() => setSelectedMatch(employee)}>
//        <div className={`px-4 py-2 w-1/4 flex items-center gap-2 text-xs font-medium ${selectedMatch?.id === employee.id ? "text-white" : "text-[#1b2229]"}`}>
//         <Image src={AlexParker} alt="Avatar" className="rounded-full" width={25} height={25} /> {employee.name}
//        </div>

//        <div className={`px-4 py-2 w-1/4 flex items-center gap-2 text-xs font-medium ${selectedMatch?.id === employee.id ? "text-white" : "text-[#1b2229]"}`}>{employee.status}</div>

//        <div className={`px-4 py-2 w-1/4 text-xs font-medium text-center ${selectedMatch?.id === employee.id ? "text-white" : "text-[#1b2229]"}`}>{employee.email}</div>

//        <div className={`text-xs font-medium ${selectedMatch?.id === employee.id ? "text-white" : "text-[#1b2229]"}`}>{employee.phonenumber}</div>

//        <div className="px-4 py-2 w-1/6 text-xs font-medium flex justify-center">
//         <EyeIcon stroke={selectedMatch?.id === employee.id ? "#FFFF" : "#fd5602"} />
//        </div>
//       </div>
//      ))}
//     </div>

//     {/* right side */}
//     <div className="1/3 m-[20px]"></div>
//     <img className="w-[441px] h-[262px] rounded-[10px]" src="https://placehold.co/441x262" />
//     <div className="text-[#10375c] text-2xl font-semibold">Name of the Employee</div>

//     <div className="w-full bg-[#f2f2f4] rounded-[20px] px-[15px] py-[14px]">
//      <div className="flex justify-between items-center">
//       <div className="text-[#10375c] text-2xl font-semibold mt-[25px]">Name of the Venue</div>
//       <div className="mt-[15px]">
//        <Edit />
//       </div>
//      </div>

//      <div className="h-[69.41px]">
//       <div className="text-[#1b2229] mt-[25px] mb-[10px] text-xs font-medium">Location</div>
//       <div className="h-[45.41px] px-[15px] py-2.5 bg-white rounded-[39px]">
//        <input type="date" className="text-black/60 text-xs font-medium mt-[5px]" />
//       </div>
//      </div>

//      <div className="h-[69.41px]">
//       <div className="text-[#1b2229] mt-[15px] mb-[10px] text-xs font-medium">Games Available</div>
//       <Select
//        isMulti
//        options={options}
//        value={options.filter((option) => formData.recipients.includes(option.value))}
//        onChange={handleRecipientsChange}
//        className="w-full text-black/60 text-xs font-medium"
//        classNamePrefix="react-select"
//        placeholder="Select Game..."
//        styles={{
//         control: (base) => ({
//          ...base,
//          borderRadius: "44px",
//          border: "1px solid #e6e6e6",
//          boxShadow: "none",
//          height: "45.41px",
//          backgroundColor: "white",
//          "&:hover": {
//           borderColor: "#e6e6e6",
//          },
//          padding: "2px",
//         }),
//         menu: (base) => ({
//          ...base,
//          borderRadius: "8px",
//          width: "40%",
//          boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
//         }),
//         option: (base, { isFocused }) => ({
//          ...base,
//          backgroundColor: isFocused ? "#e6f7ff" : "white",
//          color: "#1c2329",
//          "&:active": {
//           backgroundColor: "#e6f7ff",
//          },
//         }),
//         multiValue: (base) => ({
//          ...base,
//          backgroundColor: "#1c2329",
//          borderRadius: "5px",
//         }),
//         multiValueLabel: (base) => ({
//          ...base,
//          color: "white",
//          padding: "4px 2px 4px 12px",
//         }),
//         multiValueRemove: (base) => ({
//          ...base,
//          color: "white",
//          margin: "4px 5px 4px 0px",
//          "&:hover": {
//           backgroundColor: "#1c2329",
//           color: "white",
//          },
//         }),
//        }}
//       />
//      </div>

//      <div className="h-[69.41px]">
//       <div className="text-[#1b2229] mt-[15px] mb-[10px] text-xs font-medium">Status</div>
//       <div className="h-[45.41px] px-[15px] py-2.5 bg-white rounded-[39px] flex self-stretch justify-between items-center">
//        <div className="text-black/60 text-xs font-medium mt-[5px]">Active</div>
//        <BottomArrow />
//       </div>
//      </div>

//      <button className="w-full h-12 bg-[#10375c] rounded-[28px] text-white text-sm font-medium mt-[15px]">Save</button>
//     </div>
//    </div>
//   </>
//  );
// };

// export default Page;



"use client";
import { WhiteDownArrow, BottomArrow, Edit, Add, EyeIcon } from "@/utils/svgicons";
import React, { useState } from "react";
import SearchBar from "../../components/SearchBar";
import Image from "next/image";
import Select, { MultiValue } from "react-select";
import AlexParker from "@/assets/images/AlexParker.png";
import JordanLee from "@/assets/images/JordanLee.png";

const employees = [
  { id: 1, name: "Alex Parker", status: "Working", email: "janesmith@example.com", phonenumber: "+1 (555) 234-5678" },
  { id: 2, name: "Jordan Lee", status: "Ex-Employee", email: "sophia.brown@example.com", phonenumber: "+1 (555) 456-7890" },
  { id: 3, name: "Tracy Martin", status: "Working", email: "mia.johnson@example.co", phonenumber: "+1 (555) 765-4321" },
  { id: 4, name: "Alex Parker", status: "Working", email: "isabella.lee@example.com", phonenumber: "+1 (555) 234-5678" },
  { id: 5, name: "Alex Parker", status: "Working", email: "jacob.davis@example.com", phonenumber: "+1 (555) 234-5888" },
  { id: 6, name: "Alex Parker", status: "Working", email: "sophia.brown@example.com", phonenumber: "+1 (555) 234-5778" },
  { id: 7, name: "Alex Parker", status: "Working", email: "lucas.martinez@example.com", phonenumber: "+1 (555) 234-8768" },
  { id: 8, name: "Alex Parker", status: "Working", email: "emily.jones@example.com", phonenumber: "+1 (555) 234-9847" },
  { id: 9, name: "Alex Parker", status: "Working", email: "ava.martinez@example.com", phonenumber: "+1 (555) 234-5777" },
  { id: 10, name: "Alex Parker", status: "Working", email: "emily.jones@example.com", phonenumber: "+1 (555) 234-5778" },
  { id: 11, name: "Alex Parker", status: "Working", email: "bob.johnson@example.comm", phonenumber: "+1 (555) 234-5348" },
  { id: 12, name: "Alex Parker", status: "Working", email: "emily.jones@example.com", phonenumber: "+1 (555) 234-5668" },
];

interface NotificationData {
  title: string;
  text: string;
  recipients: string[];
}

interface OptionType {
  value: string;
  label: string;
}

const options: OptionType[] = [
  { value: "Pickleball", label: "Pickleball" },
  { value: "Paddle", label: "Paddle" },
];

const Page = () => {
  const [formData, setFormData] = useState<NotificationData>({
    title: "",
    text: "",
    recipients: [],
  });

  const [selectedMatch, setSelectedMatch] = useState({
    id: 1,
    name: "Alex Parker",
    status: "Working",
    email: "janesmith@example.com",
    phonenumber: "+1 (555) 234-5678",
  });

  const [searchParams, setSearchParams] = useState("");

  const handleRecipientsChange = (selectedOptions: MultiValue<OptionType>) => {
    const recipients = selectedOptions.map((option) => option.value);
    setFormData((prev) => ({
      ...prev,
      recipients: recipients,
    }));
  };

  return (
    <>
      <div className="text-[#10375c] text-3xl font-semibold ">All Employees</div>

      <div className="flex px-[20px] py-[12px] gap-[381px]">
        <div className="gap-[5px] w-full flex justify-end ">
          <div className="flex h-10 px-5 py-3 bg-[#1b2229] rounded-[28px] justify-center items-center gap-[5px]">
            <div className="text-white text-sm font-medium ">Sort</div>
            <WhiteDownArrow />
          </div>

          <div className="flex h-10 w-[150px] justify-between px-5 py-3 bg-[#1b2229] rounded-[28px] items-center gap-[5px]">
            <div className="text-white text-sm font-medium ">Status</div>
            <WhiteDownArrow />
          </div>
        </div>

        <div className=" justify-end">
          <div className="w-[210px] flex h-10 justify-between px-5 py-3 bg-[#1b2229] rounded-[28px] items-center gap-[5px]">
            <Add />
            <div className="text-white text-sm font-medium ">Add A New Employee</div>
          </div>
        </div>
      </div>

      <div className="flex">
        {/* left side */}
        <div className="w-2/3 px-[16px] py-[21px] h-[657px] bg-[#f2f2f4] rounded-[20px]">
          <div className="flex justify-between">
            <div className="text-[#10375c] text-xl font-medium ">All Employees</div>
            <div className="">
              <SearchBar setQuery={setSearchParams} query={searchParams} />
            </div>
          </div>

          <div className=" h-3.5 justify-between items-center flex text-[#7e7e8a] mt-[20px] mb-[8px] text-xs font-medium">
            <div>Name</div>
            <div>Status</div>
            <div>Email</div>
            <div>Phone Number</div>
            <div>Action</div>
          </div>
          <div className="mb-[8px] h-[0px] border border-[#d0d0d0]"></div>

          {employees.map((employee, index) => (
            <div key={employee.id} className={`w-full min-w-[600px] cursor-pointer flex items-center h-[47px] px-3.5 py-3 rounded-[10px] ${selectedMatch?.id === employee.id ? "bg-[#176dbf] text-white" : index % 2 === 0 ? "bg-white" : "bg-gray-200"}`} onClick={() => setSelectedMatch(employee)}>
              <div className={`px-4 py-2 w-1/4 flex items-center gap-2 text-xs font-medium ${selectedMatch?.id === employee.id ? "text-white" : "text-[#1b2229]"}`}>
                <Image src={AlexParker} alt="Avatar" className="rounded-full" width={25} height={25} /> {employee.name}
              </div>

              <div className={`px-4 py-2 w-1/4 flex items-center gap-2 text-xs font-medium ${selectedMatch?.id === employee.id ? "text-white" : "text-[#1b2229]"}`}>{employee.status}</div>

              <div className={`px-4 py-2 w-1/4 text-xs font-medium text-center ${selectedMatch?.id === employee.id ? "text-white" : "text-[#1b2229]"}`}>{employee.email}</div>

              <div className={`text-xs font-medium ${selectedMatch?.id === employee.id ? "text-white" : "text-[#1b2229]"}`}>{employee.phonenumber}</div>

              <div className="px-4 py-2 w-1/6 text-xs font-medium flex justify-center">
                <EyeIcon stroke={selectedMatch?.id === employee.id ? "#FFFF" : "#fd5602"} />
              </div>
            </div>
          ))}
        </div>

        {/* right side */}
        <div className="w-1/3 m-[20px]">
          <img className="w-[441px] h-[262px] rounded-[10px]" src="https://placehold.co/441x262" />
          <div className="text-[#10375c] text-2xl font-semibold mt-[25px]">Name of the Employee</div>

          <div className="w-full rounded-[20px] px-[15px] py-[14px]">
            

            <div className="h-[69.41px]">
              <div className="text-[#1b2229] mt-[25px] mb-[10px] text-xs font-medium">Phone Number</div>
              <div className="h-[45.41px] px-[15px] py-2.5 bg-white border border-[#e6e6e6] rounded-[39px]">
                <input type="number" className="text-black/60 text-xs font-medium  border border-[#e6e6e6]  p-2 w-full" />
              </div>

            </div>
            <div className="h-[69.41px]">
              <div className="text-[#1b2229] mt-[25px] mb-[10px] text-xs font-medium">Email Address</div>
              <div className="h-[45.41px] px-[15px] py-2.5 bg-white border border-[#e6e6e6] rounded-[39px]">
                <input type="email" className="text-black/60 text-xs font-medium   p-2 w-full" />
              </div>
            </div>

            <div className="h-[69.41px]">
              <div className="text-[#1b2229] mt-[15px] mb-[10px] text-xs font-medium">Status </div>
              <Select
                isMulti
                options={options}
                value={options.filter((option) => formData.recipients.includes(option.value))}
                onChange={handleRecipientsChange}
                className="w-full text-black/60 text-xs font-medium"
                classNamePrefix="react-select"
                placeholder="Select Game..."
                styles={{
                  control: (base) => ({
                    ...base,
                    borderRadius: "44px",
                    border: "1px solid #e6e6e6",
                    boxShadow: "none",
                    height: "45.41px",
                    backgroundColor: "white",
                    "&:hover": {
                      borderColor: "#e6e6e6",
                    },
                    padding: "2px",
                  }),
                  menu: (base) => ({
                    ...base,
                    borderRadius: "8px",
                    width: "40%",
                    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                  }),
                  option: (base, { isFocused }) => ({
                    ...base,
                    backgroundColor: isFocused ? "#e6f7ff" : "white",
                    color: "#1c2329",
                    "&:active": {
                      backgroundColor: "#e6f7ff",
                    },
                  }),
                  multiValue: (base) => ({
                    ...base,
                    backgroundColor: "#1c2329",
                    borderRadius: "5px",
                  }),
                  multiValueLabel: (base) => ({
                    ...base,
                    color: "white",
                    padding: "4px 2px 4px 12px",
                  }),
                  multiValueRemove: (base) => ({
                    ...base,
                    color: "white",
                    margin: "4px 5px 4px 0px",
                    "&:hover": {
                      backgroundColor: "#1c2329",
                      color: "white",
                    },
                  }),
                }}
              />
            </div>

            <div className="h-[69.41px]">
              <div className="text-[#1b2229] mt-[15px] mb-[10px] text-xs font-medium">Status</div>
              <div className="h-[45.41px] px-[15px] py-2.5 bg-white rounded-[39px] flex self-stretch justify-between items-center">
                <div className="text-black/60 text-xs font-medium mt-[5px]">Active</div>
                <BottomArrow />
              </div>
            </div>

            <button className="w-full h-12 bg-[#10375c] rounded-[28px] text-white text-sm font-medium mt-[15px]">Save</button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Page;