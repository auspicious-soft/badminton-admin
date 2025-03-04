// "use client"
// import React, { useState } from 'react';



// interface NotificationData {
//   title: string;
//   text: string;
//   recipients: string[];
// }

// const NotificationForm = () => {
//   const [formData, setFormData] = useState<NotificationData>({
//     title: '',
//     text: '',
//     recipients: []
//   });
  
//   const [selectedPerson, setSelectedPerson] = useState<string>('');
//   const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);

//   // Sample list of people - in a real app, this would come from props or API
//   const people = ['John Doe', 'Jane Smith', 'Mike Johnson', 'Sara Williams'];
  
//   const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
//     const { name, value } = e.target;
//     setFormData(prev => ({
//       ...prev,
//       [name]: value
//     }));
//   };
  
//   const addRecipient = (name: string) => {
//     if (!formData.recipients.includes(name)) {
//       setFormData(prev => ({
//         ...prev,
//         recipients: [...prev.recipients, name]
//       }));
//     }
//     setSelectedPerson('');
//     setIsDropdownOpen(false);
//   };
  
//   const removeRecipient = (name: string) => {
//     setFormData(prev => ({
//       ...prev,
//       recipients: prev.recipients.filter(recipient => recipient !== name)
//     }));
//   };
  
//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault();
    
//     // Log the form data to the console
//     console.log('Notification Form Submitted:', formData);
    
//     // Call the onSubmit callback if provided
    
//   };
  
//   return (
//     <div className="w-full  mx-auto bg-white rounded-lg shadow-md">
//       <div className="p-6">
//         <h1 className="text-2xl font-bold text-gray-800 mb-6">Notifications</h1>
        
//         <form onSubmit={handleSubmit}>
//           <div className="mb-4">
//             <label htmlFor="title" className="text-[#1c2329] text-sm font-semibold leading-[16.80px]">
//               Enter Title
//             </label>
//             <input
//               type="text"
//               id="title"
//               name="title"
//               value={formData.title}
//               onChange={handleInputChange}
//               placeholder="Lorem ipsum Dummy Text here..."
//               className="w-full px-[15px] py-2.5 bg-white rounded-[44px] border border-[#e6e6e6]  text-black/60 text-xs font-medium  focus:outline-none focus:ring-2 focus:ring-blue-500"
//               required
//             />
//           </div>
          
//           <div className="mb-6">
//             <label htmlFor="text" className="text-[#1c2329] text-sm font-semibold leading-[16.80px]">
//               Enter Your text
//             </label>
//             <textarea
//               id="text"
//               name="text"
//               value={formData.text}
//               onChange={handleInputChange}
//               placeholder="Lorem ipsum Dummy Text here..."
//               rows={4}
//               className="w-full px-[15px] pt-2.5 pb-[60px] bg-white rounded-[20px] border border-[#e6e6e6]  text-black/60 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
//               required
//             />
//           </div>
          
//           <div className="mb-6">
//             <div className="flex items-center mb-2">
//               <input
//                 type="checkbox"
//                 id="sendToSpecific"
//                 className="mr-2"
//               />
//               <label htmlFor="sendToSpecific" className="text-black/60 text-xs font-medium">
//                 Send to a specific person
//               </label>
//             </div>
            
//             {/* Selected recipients */}
//             {formData.recipients.length > 0 && (
//               <div className="flex flex-wrap gap-2 mb-3">
//                 {formData.recipients.map(name => (
//                   <div key={name} className="bg-gray-200 rounded-md px-3 py-1 flex items-center">
//                     <span className="text-sm">{name}</span>
//                     <button 
//                       type="button"
//                       onClick={() => removeRecipient(name)}
//                       className="ml-2 text-gray-500 hover:text-gray-700"
//                     >
//                       &times;
//                     </button>
//                   </div>
//                 ))}
//               </div>
//             )}
            
//             {/* Person selector */}
//             <div className="relative">
//               <div className="flex gap-2 mb-2">
//                 <button
//                   type="button"
//                   className="bg-gray-800 text-white px-3 py-2 rounded-md text-sm"
//                   onClick={() => setIsDropdownOpen(!isDropdownOpen)}
//                 >
//                   Select Name
//                 </button>
//               </div>
              
//               {isDropdownOpen && (
//                 <div className="absolute z-10 w-full bg-white border border-gray-300 rounded-md shadow-lg">
//                   {people.map(person => (
//                     <div
//                       key={person}
//                       className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
//                       onClick={() => addRecipient(person)}
//                     >
//                       {person}
//                     </div>
//                   ))}
//                 </div>
//               )}
//             </div>
//           </div>
          
//           <button
//             type="submit"
//             className="w-full  bg-[#10375c] rounded-[5px] hover:opacity-0.2 px-[27px] py-5 text-white text-sm font-medium font-['Inter']  transition duration-200"
//           >
//             Send
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default NotificationForm;


"use client";
import React, { useState } from 'react';
import Select, { MultiValue } from 'react-select';

interface NotificationData {
  title: string;
  text: string;
  recipients: string[];
}

interface OptionType {
  value: string;
  label: string;
}

const NotificationForm = () => {
  const [formData, setFormData] = useState<NotificationData>({
    title: '',
    text: '',
    recipients: []
  });
  
  const people = ['John Doe', 'Jane Smith', 'Mike Johnson', 'Sara Williams'];
  
  // Convert people array to react-select options
  const options: OptionType[] = people.map(person => ({
    value: person,
    label: person
  }));
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleRecipientsChange = (selectedOptions: MultiValue<OptionType>) => {
    const recipients = selectedOptions.map(option => option.value);
    setFormData(prev => ({
      ...prev,
      recipients: recipients
    }));
  };
  
  const removeRecipient = (name: string) => {
    setFormData(prev => ({
      ...prev,
      recipients: prev.recipients.filter(recipient => recipient !== name)
    }));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Notification Form Submitted:', formData);
  };
  
  return (
    <div className="w-full ">
        <h1 className="text-[#10375c] text-3xl font-semibold mb-[20px]">Notifications</h1>
      <div className="bg-white rounded-lg shadow-md px-[20px] pt-[20px] pb-[30px] mb-[15px]">
        
        <form onSubmit={handleSubmit}>
          <div className="flex flex-col gap-[10px] mb-[20px]">
            <label htmlFor="title" className="text-[#1c2329] text-sm font-semibold leading-[16.80px]">
              Enter Title
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              placeholder="Lorem ipsum Dummy Text here..."
              className="w-full px-[15px] py-2.5 bg-white rounded-[44px] border border-[#e6e6e6] text-black/60 text-xs font-medium"
              required
            />
          </div>
          
          <div className="flex flex-col gap-[10px] mb-[20px]">
            <label htmlFor="text" className="text-[#1c2329] text-sm font-semibold leading-[16.80px]">
              Enter Your text
            </label>
            <textarea
              id="text"
              name="text"
              value={formData.text}
              onChange={handleInputChange}
              placeholder="Lorem ipsum Dummy Text here..."
              rows={4}
              className="w-full px-[15px] pt-2.5 pb-[60px] bg-white rounded-[20px] border border-[#e6e6e6] text-black/60 text-xs font-medium "
              required
            />
          </div>
          
          <div className="mb-[20px]">
            <div className="flex items-center mb-[20px]">
              <input
                type="checkbox"
                id="sendToSpecific"
                className="mr-2"
              />
              <label htmlFor="sendToSpecific" className="text-black/60 text-xs font-medium ">
                Send to a specific person
              </label>
            </div>
            
            {/* React-Select for multi-select with chips */}
            <Select
              isMulti
              options={options}
              value={options.filter(option => formData.recipients.includes(option.value))}
              onChange={handleRecipientsChange}
              className="w-full  text-black/60 text-xs font-medium "
              classNamePrefix="react-select"
              placeholder="Select Name..."
              styles={{
                control: (base) => ({
                  ...base,
                  borderRadius: '44px', // Match the rounded style from your input
                  border: '1px solid #e6e6e6',
                  boxShadow: 'none',
                  width:'60%',
                  '&:hover': {
                    borderColor: '#e6e6e6',
                  },
                  padding: '2px',
                }),
                menu: (base) => ({
                  ...base,
                  borderRadius: '8px',
                  width:'40%',
                  boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                }),
                option: (base, { isFocused }) => ({
                  ...base,
                  backgroundColor: isFocused ? '#e6f7ff' : 'white',
                  color: '#1c2329',
                  '&:active': {
                    backgroundColor: '#e6f7ff',
                  },
                }),
                multiValue: (base) => ({
                  ...base,
                  backgroundColor: '#1c2329',
                  borderRadius: '5px',
                }),
                multiValueLabel: (base) => ({
                  ...base,
                  color: 'white',
                  padding: '4px 2px 4px 12px'
                }),
                multiValueRemove: (base) => ({
                  ...base,
                  color: 'white',
                  margin:'4px 5px 4px 0px',
                  '&:hover': {
                    backgroundColor: '#1c2329',
                    color: 'white',
                  },
                }),
              }}
            />
          </div>
          
          <button
            type="submit"
            className="w-full bg-[#10375c] rounded-[5px] hover:opacity-0.2 px-[27px] py-5 text-white text-sm font-medium font-['Inter'] transition duration-200"
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
};

export default NotificationForm;