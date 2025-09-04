// import React, { useState, useEffect } from 'react';
// import { Plus, Edit, Trash2, X, ChevronDown } from 'lucide-react';
// import { Add } from "@/utils/svgicons";
// import DeleteConfirmationModal from '../common/DeleteConfirmationModal';
// import { updatePackage, createPackage, getPackages, deletePackage } from "@/services/admin-services";
// import useSWR from "swr";

// interface Item {
//   _id?: string;
//   amount: number;
//   coinReceivable: number;
//   extraCoins?: number;
//   isActive?: boolean;
//   createdAt?: string;
//   updatedAt?: string;
//   __v?: number;
// }

// interface ApiResponse {
//   success: boolean;
//   message: string;
//   data: Item[];
// }

// const Packages: React.FC = () => {
//   const [modalOpen, setModalOpen] = useState<boolean>(false);
//   const [deleteModalOpen, setDeleteModalOpen] = useState<boolean>(false);
//   const [itemToDelete, setItemToDelete] = useState<{ index: number; id: string } | null>(null);
//   const [amount, setAmount] = useState<number | string>('');
//   const [coinReceivable, setCoinReceivable] = useState<number | string>('');
//   const [editingIndex, setEditingIndex] = useState<number | null>(null);
//   const [error, setError] = useState<string>('');
//   const [loading, setLoading] = useState<boolean>(false);
//   const [dropdownOpen, setDropdownOpen] = useState<boolean>(false);
  
//   // Fix SWR usage - use getPackages as the fetcher function
//   const { data, isLoading, mutate: mutatePackages } = useSWR("/admin/packages", getPackages);
  
//   // Extract items from the API response
//   const items: Item[] = data?.data?.data || [];
//   console.log("items", items)
//   const rewardOptions = [
//     { value: 10, label: 'Basic Reward - 10 coins' },
//     { value: 15, label: 'Premium Reward - 15 coins' },
//     { value: 20, label: 'Elite Reward - 20 coins' },
//     { value: 25, label: 'VIP Reward - 25 coins' },
//   ];

//   // Helper function to format number input
//   const handleNumberInput = (value: string): string => {
//     // Remove leading zeros but keep single 0 or empty string
//     if (value === '' || value === '0') return value;
//     return value.replace(/^0+/, '') || '0';
//   };

//   // Amount field handlers
//   const handleAmountChange = (value: string) => {
//     // Only allow numbers
//     if (value === '' || /^\d+$/.test(value)) {
//       const formattedValue = handleNumberInput(value);
//       setAmount(formattedValue);
      
//       // Clear coinReceivable if amount is removed
//       if (formattedValue === '' || formattedValue === '0') {
//         setCoinReceivable('');
//       }
//     }
//   };

//   const handleAmountFocus = () => {
//     if (amount === '0') {
//       setAmount('');
//     }
//   };

//   // Coin Receivable field handlers
//   const handleCoinReceivableChange = (value: string) => {
//     // Only allow numbers and only if amount is entered
//     if (amount && Number(amount) > 0) {
//       if (value === '' || /^\d+$/.test(value)) {
//         const formattedValue = handleNumberInput(value);
//         setCoinReceivable(formattedValue);
//       }
//     }
//   };

//   const handleCoinReceivableFocus = () => {
//     if (coinReceivable === '0') {
//       setCoinReceivable('');
//     }
//   };

//   const openModal = (index: number | null = null) => {
//     if (index !== null) {
//       const item = items[index];
//       setAmount(item.amount.toString());
//       setCoinReceivable(item.coinReceivable.toString());
//       setEditingIndex(index);
//     } else {
//       setAmount('');
//       setCoinReceivable('');
//       setEditingIndex(null);
//     }
//     setError('');
//     setModalOpen(true);
//     setDropdownOpen(false);
//   };

//   const closeModal = () => {
//     setModalOpen(false);
//     setError('');
//     setDropdownOpen(false);
//   };

//   const handleSubmit = async () => {
//     const amountNum = Number(amount);
//     const coinReceivableNum = Number(coinReceivable);
    
//     if (!amount || amountNum <= 0) {
//       setError('Amount must be greater than 0');
//       return;
//     }
    
//     if (!coinReceivable || coinReceivableNum < amountNum) {
//       setError('Coin Receivable must be greater than or equal to Amount');
//       return;
//     }

//     setLoading(true);
//     try {
      
//       if (editingIndex !== null) {
//         const payload = {
//           _id: items[editingIndex]._id,    
//           amount: amountNum,
//           coinReceivable: coinReceivableNum
//         };
//         // Update existing item
//         const response = await updatePackage(`/admin/packages`, payload);
//         console.log("response", response)
//         if (response.status ===200) {
//           // Refresh the list to get updated data
//           mutatePackages();
//           console.log('Package updated successfully:', payload);
//         }
//       } else {
//         // Create new item
//         const payload = {
//           amount: amountNum,
//           coinReceivable: coinReceivableNum
//         };
//         const response = await createPackage('/admin/packages', payload);
        
//         if (response.status === 200 || response.status === 201) {
//           mutatePackages();
//           console.log('Package created successfully:', payload);
//         }
//       }

//       closeModal();
//     } catch (error) {
//       setError('Failed to save package. Please try again.');
//       console.error('Error saving package:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const openDeleteModal = (index: number) => {
//     const item = items[index];
//     if (item._id) {
//       setItemToDelete({ index, id: item._id });
//       setDeleteModalOpen(true);
//     }
//   };

//   const closeDeleteModal = () => {
//     setDeleteModalOpen(false);
//     setItemToDelete(null);
//   };

//   const handleDelete = async () => {
//     if (!itemToDelete) return;
    
//     setLoading(true);
//     try {
//       const payload = {
//         packageId: itemToDelete.id
//       };
      
//       const response = await deletePackage(`/admin/packages?_id=${itemToDelete.id}`, payload);
//       console.log('response: ', response);
      
//       if (response.status===200) {
//         // Refresh the list to get updated data
//         mutatePackages();
//         console.log('Package deleted successfully');
//       }
//     } catch (error) {
//       console.error('Error deleting package:', error);
//       setError('Failed to delete package');
//     } finally {
//       setLoading(false);
//       closeDeleteModal();
//     }
//   };

//   const getSelectedRewardLabel = () => {
//     const selected = rewardOptions.find(option => option.value === Number(coinReceivable));
//     return selected ? selected.label : 'Select Reward Type';
//   };

//   return (
//     <>
//       <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 ">
//         <div className="">
//           {/* Header */}
          

//           {/* Add Button */}
//           <div className="flex justify-end mb-2">
//             <button
//               onClick={() => openModal()}
//               className=" px-5 py-3 bg-[#1b2229] rounded-[28px] flex justify-end items-center gap-[5px] cursor-pointer"
//             >
//               <Add />
//               <div className="text-white text-sm font-medium">Add New Package</div>
//             </button>
//           </div>
          

//           {/* Modal */}
//           {modalOpen && (
//             <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
//               <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md transform transition-all duration-300">
//                 {/* Modal Header */}
//                 <div className="flex items-center justify-between p-6 border-b border-slate-200">
//                   <h2 className="text-2xl font-bold text-slate-800">Package</h2>
//                   <button
//                     onClick={closeModal}
//                     className="p-2 hover:bg-slate-100 rounded-full transition-colors"
//                   >
//                     <X className="w-5 h-5 text-slate-500" />
//                   </button>
//                 </div>

//                 {/* Modal Body */}
//                 <div className="p-6 space-y-6">
//                   {/* Amount Input - First Field */}
//                   <div>
//                     <label className="block text-sm font-medium text-slate-700 mb-2">
//                       Amount <span className="text-red-500">*</span>
//                     </label>
//                     <input
//                       type="text"
//                       value={amount}
//                       onChange={(e) => handleAmountChange(e.target.value)}
//                       onFocus={handleAmountFocus}
//                       className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
//                       placeholder="Enter amount"
//                     />
//                   </div>

//                   {/* Coin Receivable Input - Second Field */}
//                   <div>
//                     <label className="block text-sm font-medium text-slate-700 mb-2">
//                       Coin Receivable <span className="text-red-500">*</span>
//                     </label>
//                     <input
//                       type="text"
//                       value={coinReceivable}
//                       onChange={(e) => handleCoinReceivableChange(e.target.value)}
//                       onFocus={handleCoinReceivableFocus}
//                       disabled={!amount || Number(amount) <= 0}
//                       className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
//                         !amount || Number(amount) <= 0 
//                           ? 'bg-slate-100 border-slate-200 text-slate-400 cursor-not-allowed' 
//                           : 'bg-slate-50 border-slate-200'
//                       }`}
//                       placeholder={!amount || Number(amount) <= 0 ? "Enter amount first" : "Enter coin receivable"}
//                     />
//                     {amount && Number(amount) > 0 && (
//                       <p className="text-xs text-slate-500 mt-1">
//                         Must be greater than or equal to {amount}
//                       </p>
//                     )}
//                   </div>

//                   {/* Error Message */}
//                   {error && (
//                     <div className="p-3 bg-red-50 border border-red-200 rounded-xl">
//                       <p className="text-red-600 text-sm">{error}</p>
//                     </div>
//                   )}
//                 </div>

//                 {/* Modal Footer */}
//                 <div className="flex gap-3 p-6 border-t border-slate-200">
//                   <button
//                     onClick={closeModal}
//                     className="flex-1 px-4 py-3 text-slate-600 font-medium rounded-xl border border-slate-200 hover:bg-slate-50 transition-colors"
//                     disabled={loading}
//                   >
//                     Cancel
//                   </button>
//                   <button
//                     onClick={handleSubmit}
//                     disabled={loading}
//                     className="flex-1 px-4 py-3 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
//                   >
//                     {loading ? 'Saving...' : editingIndex !== null ? 'Update' : 'Create'}
//                   </button>
//                 </div>
//               </div>
//             </div>
//           )}

//           {/* Items Grid */}
//           <div className="space-y-4">
//             {/* <h2 className="text-2xl font-bold text-slate-800">Active Packages</h2> */}
//             {isLoading && items.length === 0 ? (
//               <div className="flex items-center justify-center py-12">
//                 <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
//               </div>
//             ) : items.length === 0 ? (
//               <div className="text-center py-12">
//                 <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
//                   <Plus className="w-8 h-8 text-slate-400" />
//                 </div>
//                 <h3 className="text-lg font-semibold text-slate-600 mb-2">No packages yet</h3>
//                 {/* <p className="text-slate-500">Create your first loyalty package to get started</p> */}
//               </div>
//             ) : (
//               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//                 {items.map((item, index) => (
//                   <div key={item._id || index} className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden">
//                     <div className="bg-[#176dbf] p-4">
//                       <div className="flex items-center justify-between text-white">
//                         <h3 className="font-semibold">Package #{index + 1}</h3>
//                         <div className="flex gap-2">
//                           <button
//                             onClick={() => openModal(index)}
//                             className="p-2 bg-white bg-opacity-20 rounded-lg hover:bg-opacity-30 transition-colors"
//                             disabled={loading}
//                           >
//                             <Edit className="w-4 h-4" />
//                           </button>
//                           <button
//                             onClick={() => openDeleteModal(index)}
//                             className="p-2 bg-white bg-opacity-20 rounded-lg hover:bg-opacity-30 transition-colors"
//                             disabled={loading}
//                           >
//                             <Trash2 className="w-4 h-4" />
//                           </button>
//                         </div>
//                       </div>
//                     </div>
                    
//                     <div className="p-6">
//                       <div className="space-y-4">
//                         <div className="flex items-center justify-between">
//                           <span className="text-slate-600 font-medium">Amount</span>
//                           <span className="text-2xl font-bold text-slate-800">₹{item.amount}</span>
//                         </div>
//                         <div className="flex items-center justify-between">
//                           <span className="text-slate-600 font-medium">Coins Receivable</span>
//                           <div className="flex items-center">
//                             <span className="text-2xl font-bold text-yellow-600">{item.coinReceivable}</span>
//                             <span className="text-yellow-600 ml-1">🪙</span>
//                           </div>
//                         </div>
//                         {/* {item.extraCoins && (
//                           <div className="flex items-center justify-between">
//                             <span className="text-slate-600 font-medium">Extra Coins</span>
//                             <span className="text-lg font-bold text-green-600">+{item.extraCoins}</span>
//                           </div>
//                         )} */}
//                         {item.extraCoins && (
//                         <div className="pt-2 border-t border-slate-100">
//                           <div className="flex items-center justify-between text-sm text-slate-500">
//                             {/* Extra Coins +{item.extraCoins} */}
//                             <span className="text-slate-600 text-sm">Extra Coins </span>
//                             <span className="text-sm font-bold text-green-600">+{item.extraCoins}</span>
//                             {/* Reward Ratio: {((item.coinReceivable / item.amount) * 100).toFixed(0)}% return */}
//                           </div>
//                         </div>
//                         )}
//                       </div>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             )}
//           </div>
//         </div>
//       </div>

//       {/* Delete Confirmation Modal */}
//       <DeleteConfirmationModal
//         open={deleteModalOpen}
//         onClose={closeDeleteModal}
//         onDelete={handleDelete}
//         title="Delete Package?"
//         message="Are you sure you want to delete this package? This action cannot be undone."
//         cancelText="Cancel"
//         deleteText="Delete"
//       />
//     </>
//   );
// };

// export default Packages;







import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, X, ChevronDown } from 'lucide-react';
import { Add } from "@/utils/svgicons";
import DeleteConfirmationModal from '../common/DeleteConfirmationModal';
import { updatePackage, createPackage, getPackages, deletePackage } from "@/services/admin-services";
import { mutate } from 'swr';
import useSWR from "swr";
import { toast } from "sonner";

interface Item {
  _id?: string;
  amount: number;
  coinReceivable: number;
  extraCoins?: number;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
  __v?: number;
}

interface ApiResponse {
  success: boolean;
  message: string;
  data: Item[];
}

const Packages: React.FC = () => {
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState<boolean>(false);
  const [itemToDelete, setItemToDelete] = useState<{ index: number; id: string } | null>(null);
  const [amount, setAmount] = useState<number | string>('');
  const [coinReceivable, setCoinReceivable] = useState<number | string>('');
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [dropdownOpen, setDropdownOpen] = useState<boolean>(false);
  
  const { data, isLoading, mutate: mutatePackages } = useSWR("/admin/packages", getPackages);
  
  const items: Item[] = data?.data?.data || [];
  console.log("items", items)
  const rewardOptions = [
    { value: 10, label: 'Basic Reward - 10 coins' },
    { value: 15, label: 'Premium Reward - 15 coins' },
    { value: 20, label: 'Elite Reward - 20 coins' },
    { value: 25, label: 'VIP Reward - 25 coins' },
  ];

  // Helper function to format number input
  const handleNumberInput = (value: string): string => {
    if (value === '' || value === '0') return value;
    return value.replace(/^0+/, '') || '0';
  };

  // Amount field handlers
  const handleAmountChange = (value: string) => {
    if (value === '' || /^\d+$/.test(value)) {
      const formattedValue = handleNumberInput(value);
      setAmount(formattedValue);
      if (formattedValue === '' || formattedValue === '0') {
        setCoinReceivable('');
      }
    }
  };

  const handleAmountFocus = () => {
    if (amount === '0') {
      setAmount('');
    }
  };

  // Coin Receivable field handlers
  const handleCoinReceivableChange = (value: string) => {
    if (amount && Number(amount) > 0) {
      if (value === '' || /^\d+$/.test(value)) {
        const formattedValue = handleNumberInput(value);
        setCoinReceivable(formattedValue);
      }
    }
  };

  const handleCoinReceivableFocus = () => {
    if (coinReceivable === '0') {
      setCoinReceivable('');
    }
  };

  // Validation for enabling/disabling Create/Update button
  const isFormValid = () => {
    const amountNum = Number(amount);
    const coinReceivableNum = Number(coinReceivable);
    return amount !== '' && 
           coinReceivable !== '' && 
           amountNum > 0 && 
           coinReceivableNum >= amountNum;
  };

  const openModal = (index: number | null = null) => {
    if (index !== null) {
      const item = items[index];
      setAmount(item.amount.toString());
      setCoinReceivable(item.coinReceivable.toString());
      setEditingIndex(index);
    } else {
      setAmount('');
      setCoinReceivable('');
      setEditingIndex(null);
    }
    setError('');
    setModalOpen(true);
    setDropdownOpen(false);
  };

  const closeModal = () => {
    setModalOpen(false);
    setError('');
    setDropdownOpen(false);
  };

  const handleSubmit = async () => {
    const amountNum = Number(amount);
    const coinReceivableNum = Number(coinReceivable);
    
    if (!amount || amountNum <= 0) {
      setError('Amount must be greater than 0');
      return;
    }
    
    if (!coinReceivable || coinReceivableNum < amountNum) {
      setError('Coin Receivable must be greater than or equal to Amount');
      return;
    }

    setLoading(true);
    try {
      if (editingIndex !== null) {
        const payload = {
          _id: items[editingIndex]._id,    
          amount: amountNum,
          coinReceivable: coinReceivableNum
        };
        const response = await updatePackage(`/admin/packages`, payload);
        console.log("response", response)
        if (response.status === 200) {
          toast.success("Package updated successfully")
          mutatePackages();
          console.log('Package updated successfully:', payload);
        }
      } else {
        const payload = {
          amount: amountNum,
          coinReceivable: coinReceivableNum
        };
        const response = await createPackage('/admin/packages', payload);
        if (response.status === 200 || response.status === 201) {
          toast.success("Package created successfully")
          mutatePackages();
          console.log('Package created successfully:', payload);
        }
      }

      closeModal();
    } catch (error) {
      setError('Failed to save package. Please try again.');
      console.error('Error saving package:', error);
    } finally {
      setLoading(false);
    }
  };

  const openDeleteModal = (index: number) => {
    const item = items[index];
    if (item._id) {
      setItemToDelete({ index, id: item._id });
      setDeleteModalOpen(true);
    }
  };

  const closeDeleteModal = () => {
    setDeleteModalOpen(false);
    setItemToDelete(null);
  };

  const handleDelete = async () => {
    if (!itemToDelete) return;
    
    setLoading(true);
    try {
      const payload = {
        packageId: itemToDelete.id
      };
      const response = await deletePackage(`/admin/packages?_id=${itemToDelete.id}`, payload);
      console.log('response: ', response);
      if (response.status === 200) {
        toast.success("Package deleted successfully");
        mutatePackages();
      }
    } catch (error) {
      console.error('Error deleting package:', error);
      setError('Failed to delete package');
    } finally {
      setLoading(false);
      closeDeleteModal();
    }
  };

  const getSelectedRewardLabel = () => {
    const selected = rewardOptions.find(option => option.value === Number(coinReceivable));
    return selected ? selected.label : 'Select Reward Type';
  };

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="">
          <div className="flex justify-end mb-2">
            <button
              onClick={() => openModal()}
              className="px-5 py-3 bg-[#1b2229] rounded-[28px] flex justify-end items-center gap-[5px] cursor-pointer"
            >
              <Add />
              <div className="text-white text-sm font-medium">Add New Package</div>
            </button>
          </div>

          {modalOpen && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md transform transition-all duration-300">
                <div className="flex items-center justify-between p-6 border-b border-slate-200">
                  <h2 className="text-2xl font-bold text-slate-800">Package</h2>
                  <button
                    onClick={closeModal}
                    className="p-2 hover:bg-slate-100 rounded-full transition-colors"
                  >
                    <X className="w-5 h-5 text-slate-500" />
                  </button>
                </div>

                <div className="p-6 space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Amount <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={amount}
                      onChange={(e) => handleAmountChange(e.target.value)}
                      onFocus={handleAmountFocus}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      placeholder="Enter amount"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Coin Receivable <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={coinReceivable}
                      onChange={(e) => handleCoinReceivableChange(e.target.value)}
                      onFocus={handleCoinReceivableFocus}
                      disabled={!amount || Number(amount) <= 0}
                      className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                        !amount || Number(amount) <= 0 
                          ? 'bg-slate-100 border-slate-200 text-slate-400 cursor-not-allowed' 
                          : 'bg-slate-50 border-slate-200'
                      }`}
                      placeholder={!amount || Number(amount) <= 0 ? "Enter amount first" : "Enter coin receivable"}
                    />
                    {amount && Number(amount) > 0 && (
                      <p className="text-xs text-slate-500 mt-1">
                        Must be greater than or equal to {amount}
                      </p>
                    )}
                  </div>

                  {error && (
                    <div className="p-3 bg-red-50 border border-red-200 rounded-xl">
                      <p className="text-red-600 text-sm">{error}</p>
                    </div>
                  )}
                </div>

                <div className="flex gap-3 p-6 border-t border-slate-200">
                  <button
                    onClick={closeModal}
                    className="flex-1 px-4 py-3 text-slate-600 font-medium rounded-xl border border-slate-200 hover:bg-slate-50 transition-colors"
                    disabled={loading}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSubmit}
                    disabled={loading || !isFormValid()}
                    className="flex-1 px-4 py-3 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {loading ? 'Saving...' : editingIndex !== null ? 'Update' : 'Create'}
                  </button>
                </div>
              </div>
            </div>
          )}

          <div className="space-y-4">
            {isLoading && items.length === 0 ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              </div>
            ) : items.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Plus className="w-8 h-8 text-slate-400" />
                </div>
                <h3 className="text-lg font-semibold text-slate-600 mb-2">No packages yet</h3>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {items.map((item, index) => (
                  <div key={item._id || index} className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden">
                    <div className="bg-[#176dbf] p-4">
                      <div className="flex items-center justify-between text-white">
                        <h3 className="font-semibold">Package #{index + 1}</h3>
                        <div className="flex gap-2">
                          <button
                            onClick={() => openModal(index)}
                            className="p-2 bg-white bg-opacity-20 rounded-lg hover:bg-opacity-30 transition-colors"
                            disabled={loading}
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => openDeleteModal(index)}
                            className="p-2 bg-white bg-opacity-20 rounded-lg hover:bg-opacity-30 transition-colors"
                            disabled={loading}
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                    
                    <div className="p-6">
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <span className="text-slate-600 font-medium">Amount</span>
                          <span className="text-2xl font-bold text-slate-800">₹{item.amount}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-slate-600 font-medium">Coins Receivable</span>
                          <div className="flex items-center">
                            <span className="text-2xl font-bold text-yellow-600">{item.coinReceivable}</span>
                            <span className="text-yellow-600 ml-1">🪙</span>
                          </div>
                        </div>
                        {item.extraCoins && (
                          <div className="pt-2 border-t border-slate-100">
                            <div className="flex items-center justify-between text-sm text-slate-500">
                              <span className="text-slate-600 text-sm">Extra Coins </span>
                              <span className="text-sm font-bold text-green-600">+{item.extraCoins}</span>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <DeleteConfirmationModal
        open={deleteModalOpen}
        onClose={closeDeleteModal}
        onDelete={handleDelete}
        title="Delete Package?"
        message="Are you sure you want to delete this package? This action cannot be undone."
        cancelText="Cancel"
        deleteText="Delete"
      />
    </>
  );
};

export default Packages;