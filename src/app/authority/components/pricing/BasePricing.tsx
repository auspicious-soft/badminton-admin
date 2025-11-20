'use client';
import React, { useState } from 'react';
import { deletePricing, getPricing, updatePricing, createPricing } from "@/services/admin-services";
import useSWR from "swr";
import { toast } from "sonner";
import {  EditIcon } from '@/utils/svgicons';
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
  game: string;
  slotPricing: SlotPricing[];
  id: string;
}

const BasePricingPage: React.FC = () => {
  const { data, mutate, isLoading } = useSWR("/admin/dynamic-pricing", getPricing);
  const pricingPlans: any[] = data?.data?.data?.pricingPlans || [];
  const venues = data?.data?.data?.courtsWithVenue || [];
  console.log('venues: ', venues);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false); // State for delete modal
  const [planToDelete, setPlanToDelete] = useState<string | null>(null); // Track plan to delete
  const [openAccordions, setOpenAccordions] = useState<{ [key: string]: boolean }>({});
  const [selectedPlan, setSelectedPlan] = useState<any | null>(null);
  const [pricingSelected, setPricingSelected] = useState<string>("dynamic");

  const mapVenueData = (venues: any[]) => {
    return venues.map((venue) => ({
      _id: venue.venueId,
      venueId: venue.venueId,
      venueName: venue.venueName,
      address: venue.address,
      courts: venue.courts.map((court: any) => {
        let hourlyRateArray: any[] = [];

        // CASE 1: hourlyRate is a single number → apply same value to all slots
        if (typeof court.hourlyRate === "number") {
          const defaultSlots = [
            "06:00", "07:00", "08:00", "09:00", "10:00", "11:00", "12:00",
            "13:00", "14:00", "15:00", "16:00", "17:00", "18:00", "19:00",
            "20:00", "21:00", "22:00"
          ];
          hourlyRateArray = defaultSlots.map(slot => ({
            slot,
            price: court.hourlyRate
          }));
        }

        // CASE 2: hourlyRate is an object → convert object → array
        else if (court.hourlyRate && typeof court.hourlyRate === "object") {
          hourlyRateArray = Object.entries(court.hourlyRate).map(
            ([slot, price]) => ({
              slot,
              price: Number(price)
            })
          );
        }

        return {
          _id: court._id,
          name: court.name,
          courtNumber: court.name,
          games: court.games,
          hourlyRate: hourlyRateArray  // FINAL CONSISTENT ARRAY
        };
      })
    }));
  };


  const courtsList = React.useMemo(() => {
    return mapVenueData(venues).flatMap((venue) =>
      venue.courts.map((court: any) => ({
        venueName: venue.venueName,
        venueId: venue._id,
        courtId: court._id,
        courtName: court.name,
        games: court.games,
        hourlyRate: court.hourlyRate
      }))
    );
  }, [venues]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };
  const handleEditCourtBasePricing = (court: any) => {
    const formattedCourt = {
      _id: court.courtId,
      courtId: {
        _id: court.courtId,
        name: court.courtName,
        games: court.games,
        venueId: {
          _id: court.venueId,
          name: court.venueName
        }
      },
      slotPricing: court.hourlyRate.map((slot: any) => ({
        slot: slot.slot,
        price: slot.price,
        _id: slot._id || ""
      }))
    };
    setPricingSelected("base")
    setSelectedPlan(formattedCourt);
    setIsModalOpen(true);
  };

  // Group and sort pricing plans by date in ascending order
  const groupedPricingData: GroupedPricing[] = React.useMemo(() => {
    const grouped: { [key: string]: GroupedPricing } = {};

    // Sort pricing plans by date in ascending order
    const sortedPlans = [...pricingPlans].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    sortedPlans.forEach((plan, index) => {
      const venueName = plan.courtId?.venueId?.name || 'Unknown Venue';
      const courtName = plan.courtId?.name || 'Unknown Court';
      const game = plan.courtId?.games || 'Unknown Game';
      const date = formatDate(plan.date);
      const key = `${venueName}-${courtName}-${date}`;

      if (!grouped[key]) {
        grouped[key] = {
          srNo: Object.keys(grouped).length + 1,
          venue: venueName,
          court: courtName,
          date: date,
          game: game,
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
          toast.success('Price updated successfully!');
        } else {
          toast.success('Price created successfully!');
        }
      } else {
        toast.error('Failed to create pricing');
      }
    } catch (err) {
      console.error('Error creating pricing:', err);
      toast.error('Error creating pricing');
    }
  };
  const handleCreateBasePricing = async (formData: any) => {
    try {
      const response = await createPricing('/admin/base-price', formData);

      if (response.status === 200 || response.status === 201) {
        setIsModalOpen(false);
        setSelectedPlan(null);
        mutate(); // Refresh the data
        if (selectedPlan !== null) {
          toast.success('Base Price updated successfully!');
        } else {
          toast.success('Base Price created successfully!');
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
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-20 w-20 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="">
      {/* <div className="flex justify-end items-center">
      </div> */}

      <div className="mt-4 w-full">
        <div className="overflow-x-auto bg-[#f2f2f4] rounded-[20px] p-[15px]">
          <table className="w-full">
            <thead>
              <tr className="text-left text-[#1b2229] text-sm font-medium">
                <th className="text-[#7E7E8A] text-xs font-medium">Sr No</th>
                <th className="text-[#7E7E8A] text-xs font-medium w-[30%]">Venue</th>
                <th className="text-[#7E7E8A] text-xs font-medium">Court</th>
                <th className="text-[#7E7E8A] text-xs font-medium">Game</th>
                <th className="text-[#7E7E8A] text-xs font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {courtsList.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-4">
                    <p className="text-gray-600">No courts found</p>
                  </td>
                </tr>
              ) : (
                courtsList.map((court, index) => {
                  const key = court.courtId;
                  const isOpen = !!openAccordions[key];

                  return (
                    <React.Fragment key={key}>
                      <tr
                        className={`text-sm px-3 py-3 ${index % 2 === 0 ? 'bg-white' : 'bg-[#f2f2f4]'} rounded-[40px]`}
                      >
                        <td className="text-[#1B2229] text-xs font-medium">{index + 1}</td>

                        <td className="text-[#1B2229] text-xs font-medium">{court.venueName}</td>
                        <td className="text-[#1B2229] text-xs font-medium">{court.courtName}</td>
                        <td className="text-[#1B2229] text-xs font-medium">{court.games}</td>
                        {/* <td>Base</td> */}

                        <td className="text-right flex justify-end gap-6">

                          {/* EDIT BUTTON */}
                          <button
                            onClick={() => handleEditCourtBasePricing(court)}
                            className="text-blue-500 hover:text-blue-700"
                          >
                            <EditIcon width={14} height={14} stroke={"#1d4ed8"} />
                          </button>

                          {/* DROPDOWN */}
                          <button
                            onClick={() =>
                              setOpenAccordions((prev) => ({
                                ...prev,
                                [key]: !prev[key],
                              }))
                            }
                          >
                            {isOpen ? "▲" : "▼"}
                          </button>
                        </td>
                      </tr>

                      {isOpen && (
                        <tr>
                          <td colSpan={6} className="p-0">
                            <div className="bg-[#e7e7e7] p-4 rounded-b-[20px]">
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {court.hourlyRate.map((slot: any, idx: number) => (
                                  <div
                                    key={idx}
                                    className={`text-sm p-3 ${idx % 1.5 === 0 ? 'bg-white' : 'bg-[#f2f2f4]'} rounded-[10px] flex justify-between items-center`}
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
        onSubmitBasePrice={handleCreateBasePricing}
        venues={mapVenueData(venues)}
        pricingPlan={selectedPlan}
        pricingSelected={pricingSelected}
      />

     
    </div>
  );
};

export default BasePricingPage;