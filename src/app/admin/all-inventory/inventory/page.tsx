'use client';
import { WhiteDownArrow } from '@/utils/svgicons';
import React, { useState } from 'react';
import Image from "next/image";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from "@mui/material";

export const Page = () => {
  const [openEditStock, setOpenEditStock] = useState(false); 
  const [openAddToStock, setOpenAddToStock] = useState(false); 
  const [openNewItem, setopenNewItem] = useState(false);

  const [stockInUse, setStockInUse] = useState(120);
  const [freshStock, setFreshStock] = useState(120);
  const [addNewItem, setaddNewItem] = useState(120);

  const handleIncrease = (setter) => setter(prev => prev + 1);
  const handleDecrease = (setter) => setter(prev => (prev > 0 ? prev - 1 : 0));

  return (
    <>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
        <div className="justify-start text-[#10375c] text-3xl font-semibold">Inventory</div>
        <div className="mt-4 md:mt-0 px-5 py-3 bg-[#1b2229] rounded-[28px] flex justify-center items-center gap-[5px]">
          <div onClick={() => setopenNewItem(true)} className="justify-start text-white text-sm font-medium">
            Add A New Item
          </div>
          <WhiteDownArrow />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
        {Array.from({ length: 10 }).map((_, index) => (
          <div key={index} className='px-[20px] py-[20px] bg-white rounded-[20px] shadow-md'>
            <div className="text-[#10375c] text-2xl font-semibold mb-[10px]">Name of Product </div>
            <div className='flex flex-col sm:flex-row gap-[20px] sm:gap-[64px]'>

              <div className="flex flex-col items-center">
                <div className="text-[#10375c] text-[40px] font-semibold mb-[7px]">{stockInUse}</div>
                <div className="text-[#1b2229] text-xs font-medium mb-[15px]">Stock In Use</div>
                <div onClick={() => setOpenEditStock(true)} className="px-[50px] py-[11px] bg-[#10375c] rounded-[28px] inline-flex justify-center items-center gap-2.5">
                  <button className="text-white text-[10px] font-medium">Edit Stock</button>
                </div>
              </div>

              <div className="flex flex-col items-center">
                <div className="text-[#10375c] text-[40px] font-semibold mb-[7px]">{freshStock}</div>
                <div className="text-[#1b2229] text-xs font-medium mb-[15px]">Fresh Stock</div>
                <div onClick={() => setOpenAddToStock(true)} className="px-[50px] py-[11px] bg-[#10375c] rounded-[28px] inline-flex justify-center items-center gap-2.5">
                  <button className="text-white text-[10px] font-medium">Add To Stock</button>
                </div>
              </div>

            </div>
          </div>
        ))}
      </div>





{/* edit stock */}
<Dialog
        open={openEditStock}
        onClose={() => setOpenEditStock(false)}
        fullWidth
        maxWidth="sm"
      >
        <div className="px-6 py-6 sm:px-[67px] sm:py-[40px] bg-[#f2f2f4] rounded-2xl">
          <DialogTitle className="text-center text-[#10375c] text-[22px] sm:text-[28px] font-extrabold mb-[30px] sm:mb-[30px]">
            Edit Stock In Use
          </DialogTitle>

          <DialogContent className="p-0">
            <div className="flex flex-col sm:flex-row justify-between gap-4 sm:gap-6 mb-4 sm:mb-6">
              <div className="flex-1">
                <label className="block text-[#1b2229] text-xs sm:text-sm font-medium mb-2">Name of The Item</label>
                <div className="w-full flex items-center bg-neutral-300 rounded-[39px] px-4 py-2 sm:py-3">
                  <span className="text-black/60 text-xs sm:text-sm font-medium">P1</span>
                </div>
              </div>

              <div className="flex-1">
                <label className="block text-[#1b2229] text-xs sm:text-sm font-medium mb-2">Quantity</label>
                <div className="flex items-center justify-between bg-white rounded-full px-4 py-2 sm:py-3 shadow">
                  <Image 
                    src="/-.svg" 
                    alt="Minus Icon" 
                    width={16} 
                    height={16} 
                    className="w-4 h-4 cursor-pointer" 
                    onClick={() => handleDecrease(setStockInUse)} 
                  />
                  <span className="text-black/60 text-lg sm:text-xl font-medium">{stockInUse}</span>
                  <Image 
                    src="/+.svg" 
                    alt="Plus Icon" 
                    width={16} 
                    height={16} 
                    className="w-4 h-4 cursor-pointer" 
                    onClick={() => handleIncrease(setStockInUse)} 
                  />
                </div>
              </div>
            </div>
          </DialogContent>

          <DialogActions className="p-0 flex justify-center">
            <Button
              fullWidth
              variant="contained"
              onClick={() => setOpenEditStock(false)}
              style={{
                textTransform: "none",
                backgroundColor: "#10375c",
                color: "#fff",
                borderRadius: "28px",
                paddingTop: "16px",
                paddingBottom: "16px",
              }}
              className='w-full sm:w-auto text-white text-sm sm:text-base font-medium bg-[#10375c] rounded-[28px] px-6 sm:px-[173px] py-3 sm:py-4'
            >
              Update Details
            </Button>
          </DialogActions>
        </div>
</Dialog>



{/* add to stock */}
<Dialog
        open={openAddToStock}
        onClose={() => setOpenAddToStock(false)}
        fullWidth
        maxWidth="sm"
      >
        <div className="px-6 py-6 sm:px-[67px] sm:py-[40px] bg-[#f2f2f4] rounded-2xl">
          <DialogTitle className="text-center text-[#10375c] text-[22px] sm:text-[28px] font-extrabold mb-[30px] sm:mb-[30px]">
          Add To Stock
          </DialogTitle>

          <DialogContent className="p-0">
            <div className="flex flex-col sm:flex-row justify-between gap-4 sm:gap-6 mb-4 sm:mb-6">
              <div className="flex-1">
                <label className="block text-[#1b2229] text-xs sm:text-sm font-medium mb-2">Name of The Item</label>
                <div className="w-full flex items-center bg-neutral-300 rounded-[39px] px-4 py-2 sm:py-3">
                  <span className="text-black/60 text-xs sm:text-sm font-medium">P1</span>
                </div>
              </div>

              <div className="flex-1">
                <label className="block text-[#1b2229] text-xs sm:text-sm font-medium mb-2">Quantity</label>
                <div className="flex items-center justify-between bg-white rounded-full px-4 py-2 sm:py-3 shadow">
                  <Image 
                    src="/-.svg" 
                    alt="Minus Icon" 
                    width={16} 
                    height={16} 
                    className="w-4 h-4 cursor-pointer" 
                    onClick={() => handleDecrease(setFreshStock)} 
                  />
                  <span className="text-black/60 text-lg sm:text-xl font-medium">{freshStock}</span>
                  <Image 
                    src="/+.svg" 
                    alt="Plus Icon" 
                    width={16} 
                    height={16} 
                    className="w-4 h-4 cursor-pointer" 
                    onClick={() => handleIncrease(setFreshStock)} 
                  />
                </div>
              </div>
            </div>
          </DialogContent>

          <DialogActions className="p-0 flex justify-center">
            <Button
              fullWidth
              variant="contained"
              onClick={() => setOpenAddToStock(false)}
              style={{
                textTransform: "none",
                backgroundColor: "#10375c",
                color: "#fff",
                borderRadius: "28px",
                paddingTop: "16px",
                paddingBottom: "16px",
              }}
              className='w-full sm:w-auto text-white text-sm sm:text-base font-medium bg-[#10375c] rounded-[28px] px-6 sm:px-[173px] py-3 sm:py-4'
            >
              Update Details
            </Button>
          </DialogActions>
        </div>
</Dialog>


{/* add new item  */}
<Dialog
        open={openNewItem}
        onClose={() => setopenNewItem(false)}
        fullWidth
        maxWidth="sm"
      >
        <div className="px-6 py-6 sm:px-[67px] sm:py-[40px] bg-[#f2f2f4] rounded-2xl">
          <DialogTitle className="text-center text-[#10375c] text-[22px] sm:text-[28px] font-extrabold mb-[30px] sm:mb-[30px]">
          Add New Item
          </DialogTitle>

          <DialogContent className="p-0">
            <div className="flex flex-col sm:flex-row justify-between gap-4 sm:gap-6 mb-4 sm:mb-6">
              <div className="flex-1">
                <label className="block text-[#1b2229] text-xs sm:text-sm font-medium mb-2">Name of The Item</label>
                <div className="w-full flex items-center bg-neutral-300 rounded-[39px] px-4 py-2 sm:py-3">
                  <span className="text-black/60 text-xs sm:text-sm font-medium">P1</span>
                </div>
              </div>

              <div className="flex-1">
                <label className="block text-[#1b2229] text-xs sm:text-sm font-medium mb-2">Quantity</label>
                <div className="flex items-center justify-between bg-white rounded-full px-4 py-2 sm:py-3 shadow">
                  <Image 
                    src="/-.svg" 
                    alt="Minus Icon" 
                    width={16} 
                    height={16} 
                    className="w-4 h-4 cursor-pointer" 
                    onClick={() => handleDecrease(setFreshStock)} 
                  />
                  <span className="text-black/60 text-lg sm:text-xl font-medium">{freshStock}</span>
                  <Image 
                    src="/+.svg" 
                    alt="Plus Icon" 
                    width={16} 
                    height={16} 
                    className="w-4 h-4 cursor-pointer" 
                    onClick={() => handleIncrease(setFreshStock)} 
                  />
                </div>
              </div>
            </div>
          </DialogContent>

          <DialogActions className="p-0 flex justify-center">
            <Button
              fullWidth
              variant="contained"
              // onClick={() => setaddNewItem(false)}
              style={{
                textTransform: "none",
                backgroundColor: "#10375c",
                color: "#fff",
                borderRadius: "28px",
                paddingTop: "16px",
                paddingBottom: "16px",
              }}
              className='w-full sm:w-auto text-white text-sm sm:text-base font-medium bg-[#10375c] rounded-[28px] px-6 sm:px-[173px] py-3 sm:py-4'
            >
              Update Details
            </Button>
          </DialogActions>
        </div>
</Dialog>



    </>
  );
};

export default Page;

