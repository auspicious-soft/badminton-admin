
import { SearchIcon } from '@/utils/svgicons';
import React, { useEffect, useState } from 'react';
interface SearchBarProps {
    setQuery: React.Dispatch<React.SetStateAction<string>>
    query?: string
    widthSearch?:boolean
}

const SearchBar = (props: SearchBarProps) => {

    const [inputValue, setInputValue] = useState('');
    const { setQuery,query ,widthSearch} = props;
    useEffect(() => {
        const handler = setTimeout(() => {
            setQuery(`${inputValue ? 'description=' :''}${inputValue.trim()}`);
        }, 500);

        return () => {
            clearTimeout(handler);
        };
    }, [inputValue, setQuery]);

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;

        // Prevent leading spaces and replace consecutive spaces with single space
        const sanitizedValue = value.replace(/^\s+/, '').replace(/\s{2,}/g, ' ');

        setQuery(sanitizedValue);
    };
    return (
        <div className={`${widthSearch ? "w-full" : "w-[248px]"} z-10`}>
            <label htmlFor="" className='relative flex w-full '>
            <input type="search" value={query} onChange={handleInputChange}
             name="" id="" placeholder="Search" className='!h-[40px] placeholder:text-[#6E6E6E] w-full px-5 pl-[40px] focus-visible:outline-none bg-white rounded-[39px] py-2  text-[#6E6E6E] '/>
            <span className='absolute left-[15px] top-[13px] '><SearchIcon /> </span>
            </label>
        </div>
    );
}

export default SearchBar;
