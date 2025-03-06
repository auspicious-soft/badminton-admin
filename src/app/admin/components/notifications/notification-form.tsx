"use client";
import React, { useState } from 'react';
// import Select, { MultiValue } from 'react-select';
import dynamic from 'next/dynamic';

const Select = dynamic(() => import('react-select'), { ssr: false });
const MultiValue = dynamic(() => import('react-select'), { ssr: false });

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
  
  const handleRecipientsChange = (selectedOptions: any) => {
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