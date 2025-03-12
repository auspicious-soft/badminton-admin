'use client';
import { WhiteDownArrow } from '@/utils/svgicons';
import React, { useState } from 'react';
import Image from "next/image";
import shuttle from "@/assets/images/shuttle.png";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from "@mui/material";

const Page = () => {
  const [openEditStock, setOpenEditStock] = useState(false);
  const [openAddToStock, setOpenAddToStock] = useState(false);
  const [openNewItem, setOpenNewItem] = useState(false);
  const [selectedItemIndex, setSelectedItemIndex] = useState(null);

  // Inventory items state
  const [inventoryItems, setInventoryItems] = useState(
    Array.from({ length: 10 }, (_, index) => ({
      id: index,
      stockInUse: 120,
      freshStock: 120,
      name: `Product ${index + 1}`
    }))
  );

  // State for new item form
  const [newItem, setNewItem] = useState({
    name: '',
    quantity: 0
  });

  // Handle stock changes for existing items
  const handleIncrease = (index, type) => {
    setInventoryItems(prevItems =>
      prevItems.map((item, i) =>
        i === index
          ? {
              ...item,
              [type]: item[type] + 1
            }
          : item
      )
    );
  };

  const handleDecrease = (index, type) => {
    setInventoryItems(prevItems =>
      prevItems.map((item, i) =>
        i === index
          ? {
              ...item,
              [type]: Math.max(item[type] - 1, 0)
            }
          : item
      )
    );
  };

  // Handle new item quantity changes
  const handleNewItemIncrease = () => {
    setNewItem(prev => ({
      ...prev,
      quantity: prev.quantity + 1
    }));
  };

  const handleNewItemDecrease = () => {
    setNewItem(prev => ({
      ...prev,
      quantity: Math.max(prev.quantity - 1, 0)
    }));
  };

  // Handle new item name change
  const handleNameChange = (e) => {
    setNewItem(prev => ({
      ...prev,
      name: e.target.value
    }));
  };

  // Add new item to inventory
  const handleAddNewItem = () => {
    if (newItem.name.trim() === '') {
      alert('Please enter a product name');
      return;
    }
    
    setInventoryItems(prev => [
      ...prev,
      {
        id: prev.length,
        name: newItem.name,
        stockInUse: 0,  // Initial stock in use is 0
        freshStock: newItem.quantity  // Quantity goes to fresh stock
      }
    ]);
    
    // Reset form and close dialog
    setNewItem({ name: '', quantity: 0 });
    setOpenNewItem(false);
  };

  const openEditDialog = (index) => {
    setSelectedItemIndex(index);
    setOpenEditStock(true);
  };

  const openAddDialog = (index) => {
    setSelectedItemIndex(index);
    setOpenAddToStock(true);
  };

  return (
    <>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
        <div className="justify-start text-[#10375c] text-3xl font-semibold">Inventory</div>
        <div className="mt-4 md:mt-0 px-5 py-3 bg-[#1b2229] rounded-[28px] flex justify-center items-center gap-[5px]">
          <div onClick={() => setOpenNewItem(true)} className="justify-start text-white text-sm font-medium">
            Add A New Item
          </div>
          <WhiteDownArrow />
        </div>
      </div>


      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
        {inventoryItems.map((item, index) => (
          <div key={item.id} className='px-[20px] py-[20px] bg-white rounded-[20px] shadow-md'>
            <div className="text-[#10375c] text-2xl font-semibold mb-[10px]">{item.name}</div>
            <div className='flex flex-col sm:flex-row gap-[20px] sm:gap-[64px]'>
              <div className="flex flex-col items-center">
                <div className="text-[#10375c] text-[40px] font-semibold mb-[7px]">{item.stockInUse}</div>
                <div className="text-[#1b2229] text-xs font-medium mb-[15px]">Stock In Use</div>
                <div onClick={() => openEditDialog(index)} className="px-[50px] py-[11px] bg-[#10375c] rounded-[28px] inline-flex justify-center items-center gap-2.5">
                  <button className="text-white text-[10px] font-medium">Edit Stock</button>
                </div>
              </div>

              <div className="flex flex-col items-center">
                <div className="text-[#10375c] text-[40px] font-semibold mb-[7px]">{item.freshStock}</div>
                <div className="text-[#1b2229] text-xs font-medium mb-[15px]">Fresh Stock</div>
                <div onClick={() => openAddDialog(index)} className="px-[50px] py-[11px] bg-[#10375c] rounded-[28px] inline-flex justify-center items-center gap-2.5">
                  <button className="text-white text-[10px] font-medium">Add To Stock</button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>



{/* Edit Stock  */}
      <Dialog open={openEditStock} onClose={() => setOpenEditStock(false)} fullWidth maxWidth="sm">
        <div className="px-6 py-6 sm:px-[67px] sm:py-[40px] bg-[#f2f2f4] rounded-2xl">
          <DialogTitle className="text-center text-[#10375c] text-[22px] sm:text-[28px] font-extrabold mb-[30px] sm:mb-[30px]">
            Edit Stock In Use
          </DialogTitle>
          <DialogContent className="p-0">
            {selectedItemIndex !== null && (
              <div className="flex flex-col sm:flex-row justify-between gap-4 sm:gap-6 mb-4 sm:mb-6">
                <div className="flex-1">
                  <label className="block text-[#1b2229] text-xs sm:text-sm font-medium mb-2">Name of The Item</label>
                  <div className="w-full flex items-center bg-neutral-300 rounded-[39px] px-4 py-2 sm:py-3">
                    <span className="text-black/60 text-xs sm:text-sm font-medium">{inventoryItems[selectedItemIndex].name}</span>
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
                      onClick={() => handleDecrease(selectedItemIndex, 'stockInUse')} 
                    />
                    <span className="text-black/60 text-lg sm:text-xl font-medium">{inventoryItems[selectedItemIndex].stockInUse}</span>
                    <Image 
                      src="/+.svg" 
                      alt="Plus Icon" 
                      width={16} 
                      height={16} 
                      className="w-4 h-4 cursor-pointer" 
                      onClick={() => handleIncrease(selectedItemIndex, 'stockInUse')} 
                    />
                  </div>
                </div>
              </div>
            )}
          </DialogContent>
          <DialogActions className="p-0 flex justify-center">
            <Button
              fullWidth
              variant="contained"
              onClick={() => setOpenEditStock(false)}
              style={{ textTransform: "none", backgroundColor: "#10375c", color: "#fff", borderRadius: "28px", paddingTop: "16px", paddingBottom: "16px" }}
              className='w-full sm:w-auto text-white text-sm sm:text-base font-medium bg-[#10375c] rounded-[28px] px-6 sm:px-[173px] py-3 sm:py-4'
            >
              Update Details
            </Button>
          </DialogActions>
        </div>
      </Dialog>



{/* Add To Stock  */}
      <Dialog open={openAddToStock} onClose={() => setOpenAddToStock(false)} fullWidth maxWidth="sm">
        <div className="px-6 py-6 sm:px-[67px] sm:py-[40px] bg-[#f2f2f4] rounded-2xl">
          <DialogTitle className="text-center text-[#10375c] text-[22px] sm:text-[28px] font-extrabold mb-[30px] sm:mb-[30px]">
            Add To Stock
          </DialogTitle>
          <DialogContent className="p-0">
            {selectedItemIndex !== null && (
              <div className="flex flex-col sm:flex-row justify-between gap-4 sm:gap-6 mb-4 sm:mb-6">
                <div className="flex-1">
                  <label className="block text-[#1b2229] text-xs sm:text-sm font-medium mb-2">Name of The Item</label>
                  <div className="w-full flex items-center bg-neutral-300 rounded-[39px] px-4 py-2 sm:py-3">
                    <span className="text-black/60 text-xs sm:text-sm font-medium">{inventoryItems[selectedItemIndex].name}</span>
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
                      onClick={() => handleDecrease(selectedItemIndex, 'freshStock')} 
                    />
                    <span className="text-black/60 text-lg sm:text-xl font-medium">{inventoryItems[selectedItemIndex].freshStock}</span>
                    <Image 
                      src="/+.svg" 
                      alt="Plus Icon" 
                      width={16} 
                      height={16} 
                      className="w-4 h-4 cursor-pointer" 
                      onClick={() => handleIncrease(selectedItemIndex, 'freshStock')} 
                    />
                  </div>
                </div>
              </div>
            )}
          </DialogContent>
          <DialogActions className="p-0 flex justify-center">
            <Button
              fullWidth
              variant="contained"
              onClick={() => setOpenAddToStock(false)}
              style={{ textTransform: "none", backgroundColor: "#10375c", color: "#fff", borderRadius: "28px", paddingTop: "16px", paddingBottom: "16px" }}
              className='w-full sm:w-auto text-white text-sm sm:text-base font-medium bg-[#10375c] rounded-[28px] px-6 sm:px-[173px] py-3 sm:py-4'
            >
              Update Details
            </Button>
          </DialogActions>
        </div>
      </Dialog>



{/* Add New Item  */}
      <Dialog open={openNewItem} onClose={() => setOpenNewItem(false)} fullWidth maxWidth="sm">
        <div className="px-6 py-6 sm:px-[67px] sm:py-[40px] bg-[#f2f2f4] rounded-2xl">
          <div className='flex justify-center mb-[30px]'>
            <Image src={shuttle} alt="shuttle image" height={138} width={136}/>
          </div>
          <DialogTitle className="text-center text-[#10375c] text-[22px] sm:text-[28px] font-extrabold mb-[30px] sm:mb-[30px]">
            Add New Item
          </DialogTitle>
          <DialogContent className="p-0">
            <div className="flex flex-col gap-6 mb-6">
              <div className="flex-1">
                <label className="block text-[#1b2229] text-xs sm:text-sm font-medium mb-2">Name of The Item</label>
                <input
                  type="text"
                  value={newItem.name}
                  onChange={handleNameChange}
                  className="w-full bg-white rounded-[39px] px-4 py-2 sm:py-3 text-black/60 text-xs sm:text-sm font-medium border-none outline-none"
                  placeholder="Enter product name"
                />
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
                    onClick={handleNewItemDecrease} 
                  />
                  <span className="text-black/60 text-lg sm:text-xl font-medium">{newItem.quantity}</span>
                  <Image 
                    src="/+.svg" 
                    alt="Plus Icon" 
                    width={16} 
                    height={16} 
                    className="w-4 h-4 cursor-pointer" 
                    onClick={handleNewItemIncrease} 
                  />
                </div>
              </div>
            </div>
          </DialogContent>
          <DialogActions className="p-0 flex justify-center">
            <Button
              fullWidth
              variant="contained"
              onClick={handleAddNewItem}
              style={{ textTransform: "none", backgroundColor: "#10375c", color: "#fff", borderRadius: "28px", paddingTop: "16px", paddingBottom: "16px" }}
              className='w-full sm:w-auto text-white text-sm sm:text-base font-medium bg-[#10375c] rounded-[28px] px-6 sm:px-[173px] py-3 sm:py-4'
            >
              Add Item
            </Button>
          </DialogActions>
        </div>
      </Dialog>


    </>
  );
};

export default Page;

