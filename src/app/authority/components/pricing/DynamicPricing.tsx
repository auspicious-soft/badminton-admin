'use client';
import React, { useState } from 'react';
import { deletePricing, getPricing, updatePricing, createPricing } from "@/services/admin-services";
import useSWR from "swr";
import { toast } from "sonner";
import { DeleteMaintenanceIcon, EditIcon, Add } from '@/utils/svgicons';
import DeleteConfirmationModal from './../common/DeleteConfirmationModal';
import PricingModal from './PricingModal';


interface SlotPricing {
  slot: string;
  price: number;
  _id: string;
}

interface Venue {
  _id: string;
  name: string;
  address: string;
  image: string;
}

interface Court {
  _id: string;
  name: string;
  venueId: Venue;
  games: string;
}

interface PricingPlan {
  _id: string;
  courtId: Court;
  date: string;
  isActive: boolean;
  slotPricing: SlotPricing[];
  createdAt: string;
  updatedAt: string;
}

interface GroupedPricing {
  srNo: number;
  venue: string;
  court: string;
  date: string;
  slotPricing: SlotPricing[];
  id: string;
}

const DynamicPricingPage: React.FC = () => {
  const { data, mutate, isLoading } = useSWR("/admin/dynamic-pricing", getPricing);
  const pricingPlans: PricingPlan[] = data?.data?.data?.pricingPlans || [];
  const venues = data?.data?.data?.courtsWithVenue || [];

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false); // State for delete modal
  const [planToDelete, setPlanToDelete] = useState<string | null>(null); // Track plan to delete
  const [openAccordions, setOpenAccordions] = useState<{ [key: string]: boolean }>({});
  const [selectedPlan, setSelectedPlan] = useState<PricingPlan | null>(null);

  console.log('selectedPlan: ', selectedPlan);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  // Group and sort pricing plans by date in ascending order
  const groupedPricingData: GroupedPricing[] = React.useMemo(() => {
    const grouped: { [key: string]: GroupedPricing } = {};

    // Sort pricing plans by date in ascending order
    const sortedPlans = [...pricingPlans].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    sortedPlans.forEach((plan, index) => {
      const venueName = plan.courtId?.venueId?.name || 'Unknown Venue';
      const courtName = plan.courtId?.name || 'Unknown Court';
      const date = formatDate(plan.date);
      const key = `${venueName}-${courtName}-${date}`;

      if (!grouped[key]) {
        grouped[key] = {
          srNo: Object.keys(grouped).length + 1,
          venue: venueName,
          court: courtName,
          date: date,
          slotPricing: plan.slotPricing,
          id: plan._id,
        };
      }
    });

    return Object.values(grouped);
  }, [pricingPlans]);

  const toggleAccordion = (key: string) => {
    setOpenAccordions((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const handleCreatePricing = async (formData: any) => {
    try {
      const response = await createPricing('/admin/dynamic-pricing', formData);

      if (response.status === 200 || response.status === 201) {
        setIsModalOpen(false);
        setSelectedPlan(null);
        mutate(); // Refresh the data
        if (selectedPlan !== null) {
          toast.success('Pricing updated successfully!');
        } else {
          toast.success('Pricing created successfully!');
        }
      } else {
        toast.error('Failed to create pricing');
      }
    } catch (err) {
      console.error('Error creating pricing:', err);
      toast.error('Error creating pricing');
    }
  };

  const handleEditPricing = (plan: PricingPlan) => {
    setSelectedPlan(plan);
    setIsModalOpen(true);
  };

  const openDeleteModal = (planId: string) => {
    setPlanToDelete(planId);
    setDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setDeleteModalOpen(false);
    setPlanToDelete(null);
  };

  const handleDeletePricing = async () => {
    if (!planToDelete) return;

    try {
      const response = await deletePricing(`/admin/dynamic-pricing?id=${planToDelete}`);
      if (response.status === 200 || response.status === 204) {
        mutate(); // Refresh the data
        toast.success('Pricing deleted successfully!');
      } else {
        toast.error('Failed to delete pricing');
      }
    } catch (err) {
      console.error('Error deleting pricing:', err);
      toast.error('Error deleting pricing');
    } finally {
      closeDeleteModal();
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="">
      <div className="flex justify-end items-center">
        {/* <h1 className="text-3xl font-bold text-gray-900">Pricing</h1> */}
        <button
          onClick={() => {
            setSelectedPlan(null);
            setIsModalOpen(true);
          }}
          className="flex h-10 px-5 py-3 bg-[#1b2229] rounded-full justify-between items-center gap-2 text-white text-sm font-medium"
        >
         <Add /> Add A New Pricing
        </button>
      </div>

      <div className="mt-4 w-full">
        <div className="overflow-x-auto bg-[#f2f2f4] rounded-[20px] p-[15px]">
          <table className="w-full">
            <thead>
              <tr className="text-left text-[#1b2229] text-sm font-medium">
                <th className="text-[#7E7E8A] text-xs font-medium">Sr No</th>
                <th className="text-[#7E7E8A] text-xs font-medium w-[30%]">Venue</th>
                <th className="text-[#7E7E8A] text-xs font-medium">Court</th>
                <th className="text-[#7E7E8A] text-xs font-medium">Date</th>
                <th className="text-[#7E7E8A] text-xs font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={5} className="text-center py-4">
                    <p className="text-gray-600">Loading pricing data...</p>
                  </td>
                </tr>
              ) : groupedPricingData.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-4">
                    <p className="text-gray-600">No pricing schedules found</p>
                  </td>
                </tr>
              ) : (
                groupedPricingData.map((group, index) => {
                  const key = `${group.venue}-${group.court}-${group.date}`;
                  const isOpen = !!openAccordions[key];
                  const originalPlan = pricingPlans.find((plan) => plan._id === group.id);
                  return (
                    <React.Fragment key={key}>
                      <tr
                        className={`text-sm px-3 py-3 ${index % 2 === 0 ? 'bg-white' : 'bg-[#f2f2f4]'} rounded-[40px]`}
                      >
                        <td>{group.srNo}</td>
                        <td className="text-[#1B2229] text-xs font-medium">{group.venue}</td>
                        <td className="text-[#1B2229] text-xs font-medium">{group.court}</td>
                        <td className="text-[#1B2229] text-xs font-medium">{group.date}</td>
                        <td className="text-[#1B2229] text-xs font-medium text-right flex justify-end gap-6">
                          <button
                            onClick={() => originalPlan && handleEditPricing(originalPlan)}
                            className="text-blue-500 hover:text-blue-700"
                          >
                            <EditIcon width={14} height={14} stroke={"#1d4ed8"} />
                          </button>
                          <button
                            onClick={() => openDeleteModal(group.id)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <DeleteMaintenanceIcon />
                          </button>
                          <button
                            onClick={() => toggleAccordion(key)}
                            className="text-[#1B2229]"
                          >
                            {isOpen ? '▲' : '▼'}
                          </button>
                        </td>
                      </tr>
                      {isOpen && (
                        <tr>
                          <td colSpan={5} className="p-0">
                            <div className="bg-[#e7e7e7] p-4 rounded-b-[20px]">
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {group.slotPricing.map((slot, slotIndex) => (
                                  <div
                                    key={slot._id}
                                    className={`text-sm p-3 ${slotIndex % 1.5 === 0 ? 'bg-white' : 'bg-[#f2f2f4]'} rounded-[10px] flex justify-between items-center`}
                                  >
                                    <span className="text-[#1B2229] text-xs font-medium">{slot.slot}</span>
                                    <span className="text-[#1B2229] text-xs font-medium">₹{slot.price}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      <PricingModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedPlan(null);
        }}
        onSubmit={handleCreatePricing}
        venues={venues}
        pricingPlan={selectedPlan}
      />

      <DeleteConfirmationModal
        open={deleteModalOpen}
        onClose={closeDeleteModal}
        onDelete={handleDeletePricing}
        title="Delete Pricing?"
        message="Are you sure you want to delete this pricing plan? This action cannot be undone."
        cancelText="Cancel"
        deleteText="Delete"
      />
    </div>
  );
};

export default DynamicPricingPage;