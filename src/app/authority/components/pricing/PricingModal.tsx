'use client';

import React, { useState, useEffect, useRef } from 'react';
import { X, ChevronDown } from 'lucide-react';
import UserProfile2 from "@/assets/images/images.png";
import { getImageClientS3URL } from "@/config/axios";
import Image from "next/image";

interface Court {
  name: string;
  courtNumber: string;
  hourlyRate: number;
  games: string;
  _id: string;
}

interface Venue {
  _id: string;
  venueId: string;
  venueName: string;
  address: string;
  courts: Court[];
}

interface SlotPricing {
  slot: string;
  price: string; // Changed to string to handle raw input
  _id?: string;
}

interface PricingPlan {
  _id: string;
  courtId: {
    _id: string;
    name: string;
    venueId: {
      _id: string;
      name: string;
      address: string;
    };
    games: string;
  };
  date: string;
  isActive: boolean;
  slotPricing: SlotPricing[];
  createdAt: string;
  updatedAt: string;
}

interface PricingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
  venues: Venue[];
  pricingPlan?: any;
}

const PricingModal: React.FC<PricingModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  venues,
  pricingPlan,
}) => {
  const [selectedCourts, setSelectedCourts] = useState<{ [venueId: string]: { [courtId: string]: boolean } }>({});
  const [selectedDates, setSelectedDates] = useState<Date[]>([]);
  const [showCalendar, setShowCalendar] = useState(false);
  const [slotPricing, setSlotPricing] = useState<SlotPricing[]>([
    { slot: '06:00', price: '300' },
    { slot: '07:00', price: '300' },
    { slot: '08:00', price: '300' },
    { slot: '09:00', price: '300' },
    { slot: '10:00', price: '300' },
    { slot: '11:00', price: '300' },
    { slot: '12:00', price: '300' },
    { slot: '13:00', price: '300' },
    { slot: '14:00', price: '300' },
    { slot: '15:00', price: '300' },
    { slot: '16:00', price: '300' },
    { slot: '17:00', price: '300' },
    { slot: '18:00', price: '300' },
    { slot: '19:00', price: '300' },
    { slot: '20:00', price: '300' },
    { slot: '21:00', price: '300' },
    { slot: '22:00', price: '300' },
  ]);
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false); // New loading state
  const calendarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen && pricingPlan) {
      const venueId = pricingPlan.courtId.venueId._id;
      const courtId = pricingPlan.courtId._id;
      setSelectedCourts({
        [venueId]: {
          [courtId]: true,
        },
      });
      setSelectedDates([new Date(pricingPlan.date)]);
      setSlotPricing(pricingPlan.slotPricing.map(slot => ({ slot: slot.slot, price: slot.price.toString(), _id: slot._id })));
      setCurrentStep(2);
    } else if (isOpen) {
      setSelectedCourts({});
      setSelectedDates([]);
      setSlotPricing([
        { slot: '06:00', price: '' },
        { slot: '07:00', price: '' },
        { slot: '08:00', price: '' },
        { slot: '09:00', price: '' },
        { slot: '10:00', price: '' },
        { slot: '11:00', price: '' },
        { slot: '12:00', price: '' },
        { slot: '13:00', price: '' },
        { slot: '14:00', price: '' },
        { slot: '15:00', price: '' },
        { slot: '16:00', price: '' },
        { slot: '17:00', price: '' },
        { slot: '18:00', price: '' },
        { slot: '19:00', price: '' },
        { slot: '20:00', price: '' },
        { slot: '21:00', price: '' },
        { slot: '22:00', price: '' },
      ]);
      setCurrentStep(1);
    }
  }, [isOpen, pricingPlan]);

  useEffect(() => {
    if (isOpen && !pricingPlan) {
      updateSlotPricing();
    }
  }, [selectedCourts, isOpen, pricingPlan]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isOpen]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (calendarRef.current && !calendarRef.current.contains(event.target as Node)) {
        setShowCalendar(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleCourtSelection = (venueId: string, courtId: string) => {
    setSelectedCourts(prev => {
      const updated = {
        ...prev,
        [venueId]: {
          ...prev[venueId],
          [courtId]: !prev[venueId]?.[courtId],
        },
      };
      if (Object.values(updated[venueId] || {}).every(selected => !selected)) {
        delete updated[venueId];
      }
      return updated;
    });
  };

  const isCourtSelected = (venueId: string, courtId: string) => {
    return selectedCourts[venueId]?.[courtId] || false;
  };

  const getSelectedCourtsCount = () => {
    let count = 0;
    Object.values(selectedCourts).forEach(venueCourts => {
      count += Object.values(venueCourts).filter(selected => selected).length;
    });
    return count;
  };

  const handleDateSelect = (date: Date) => {
    setSelectedDates(prev => {
      const dateExists = prev.find(d => d.toDateString() === date.toDateString());
      if (dateExists) {
        return prev.filter(d => d.toDateString() !== date.toDateString());
      } else {
        return pricingPlan ? [date] : [...prev, date];
      }
    });
  };

  const updateSlotPrice = (slotIndex: number, value: string) => {
    // Remove leading zeros, keep empty string if cleared
    const cleanedValue = value.replace(/^0+/, '') || '';
    setSlotPricing(prev =>
      prev.map((slot, index) =>
        index === slotIndex ? { ...slot, price: cleanedValue } : slot
      )
    );
  };

  const updateSlotPricing = () => {
    const selectedCourtRates: number[] = [];
    Object.entries(selectedCourts).forEach(([venueId, courts]) => {
      Object.entries(courts).forEach(([courtId, selected]) => {
        if (selected) {
          const venue = venues.find(v => v.venueId === venueId);
          const court = venue?.courts.find(c => c._id === courtId);
          if (court) selectedCourtRates.push(court.hourlyRate);
        }
      });
    });
    const highestRate = selectedCourtRates.length > 0 ? Math.max(...selectedCourtRates) : 300;
    setSlotPricing(prev => prev.map(slot => ({ ...slot, price: highestRate.toString() })));
  };

  const handleNext = () => {
    if (currentStep === 1 && getSelectedCourtsCount() > 0) {
      setCurrentStep(2);
    }
  };

  const handleBack = () => {
    setCurrentStep(1);
  };

  const isFormValid = () => {
    // Check if dates are selected
    if (selectedDates.length === 0) return false;
    // Check if all prices are non-empty and valid numbers
    return slotPricing.every(slot => {
      const priceNum = parseInt(slot.price);
      return slot.price !== '' && !isNaN(priceNum);
    });
  };

  const handleSubmit = async () => {
    setLoading(true); // Start loading
    const selectedCourtIds: string[] = [];
    Object.entries(selectedCourts).forEach(([venueId, courts]) => {
      Object.entries(courts).forEach(([courtId, selected]) => {
        if (selected) {
          selectedCourtIds.push(courtId);
        }
      });
    });

    const formattedDates = selectedDates.map(date => {
      const utcDate = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
      return utcDate.toISOString().split('T')[0];
    });

    const payload = {
      courts: selectedCourtIds,
      date: formattedDates,
      slotPricing: slotPricing.map(({ slot, price, _id }) => ({
        slot,
        price: price === '' ? 0 : parseInt(price), // Convert to number only on submit, default to 0 if empty
        ...(pricingPlan && _id ? { _id } : {}),
      })),
      ...(pricingPlan ? { _id: pricingPlan._id } : {}),
    };

    await onSubmit(payload); // Simulate async operation
    setLoading(false); // Stop loading after submission
  };

  const Calendar = () => {
    const [currentMonth, setCurrentMonth] = useState(new Date());
    
    const getDaysInMonth = (date: Date) => {
      const year = date.getFullYear();
      const month = date.getMonth();
      const firstDay = new Date(year, month, 1);
      const lastDay = new Date(year, month + 1, 0);
      const daysInMonth = lastDay.getDate();
      const startingDayOfWeek = firstDay.getDay();
      
      const days: (Date | null)[] = [];
      
      for (let i = 0; i < startingDayOfWeek; i++) {
        days.push(null);
      }
      
      for (let day = 1; day <= daysInMonth; day++) {
        days.push(new Date(year, month, day));
      }
      
      return days;
    };

    const isDateSelected = (date: Date | null) => {
      if (!date) return false;
      return selectedDates.some(selectedDate => 
        selectedDate.toDateString() === date.toDateString()
      );
    };

    const nextMonth = () => {
      setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));
    };

    const prevMonth = () => {
      setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
    };

    const days = getDaysInMonth(currentMonth);

    return (
      <div ref={calendarRef} className="bg-white border rounded-lg p-4 shadow-lg">
        <div className="flex justify-between items-center mb-4">
          <button onClick={prevMonth} className="p-1">
            <ChevronDown className="rotate-90" size={16} />
          </button>
          <h3 className="font-medium">
            {currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
          </h3>
          <button onClick={nextMonth} className="p-1">
            <ChevronDown className="rotate-[-90deg]" size={16} />
          </button>
        </div>
        
        <div className="grid grid-cols-7 gap-1 text-xs text-center mb-2">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div key={day} className="p-1 font-medium text-gray-500">{day}</div>
          ))}
        </div>
        
        <div className="grid grid-cols-7 gap-1">
          {days.map((day, index) => (
            <button
              key={index}
              onClick={() => day && handleDateSelect(day)}
              disabled={!day || day < new Date()}
              className={`p-2 text-xs rounded ${
                !day 
                  ? 'invisible'
                  : day < new Date()
                  ? 'text-gray-300 cursor-not-allowed'
                  : isDateSelected(day)
                  ? 'bg-blue-500 text-white'
                  : 'hover:bg-gray-100'
              }`}
            >
              {day?.getDate()}
            </button>
          ))}
        </div>
      </div>
    );
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" style={{ overflow: 'hidden' }}>
      <div className="bg-white rounded-2xl w-full max-w-4xl overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center gap-3">
            {currentStep === 2 && !pricingPlan && (
              <button
                onClick={handleBack}
                className="text-gray-500 hover:text-gray-700"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="15,18 9,12 15,6"></polyline>
                </svg>
              </button>
            )}
            <h2 className="text-2xl font-semibold text-gray-900">
              {pricingPlan ? 'Edit Pricing' : 'Create Pricing'}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X size={24} />
          </button>
        </div>

        <div className="p-4">
          {currentStep === 1 ? (
            <div className="space-y-6">
              <div className={`grid ${venues.length === 1 ? 'grid-cols-1' : 'grid-cols-2'} gap-6`}>
                {venues.map((venue: any) => (
                  <div key={venue.venueId} className="space-y-4">
                    <div className="flex items-center gap-3 mb-3">
                      <Image
                        src={
                          venue?.image !== null 
                            ? getImageClientS3URL(venue?.image)
                            : UserProfile2
                        }
                        alt="Venue"
                        className="rounded-full w-[35px] h-[35px] object-cover"
                        width={25}
                        height={25}
                        unoptimized
                      />
                      <div>
                        <p className="font-medium text-gray-900">{venue.venueName}</p>
                        <p className="text-sm text-gray-500">{venue.address}</p>
                      </div>
                    </div>
                    
                    <div className={`grid ${venue.courts.length === 1 ? 'grid-cols-1' : 'grid-cols-2'} gap-3`}>
                      {venue.courts.map((court) => (
                        <button
                          key={court._id}
                          onClick={() => toggleCourtSelection(venue.venueId, court._id)}
                          className={`py-3 px-4 rounded-lg text-sm font-medium transition-colors ${
                            isCourtSelected(venue.venueId, court._id)
                              ? 'bg-blue-500 text-white'
                              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                          } ${pricingPlan ? 'cursor-not-allowed' : ''}`}
                          disabled={!!pricingPlan}
                        >
                          {court.name}
                          <div className="text-xs mt-1">{court.games}</div>
                          <div className="text-xs mt-1">Base price- ₹{court.hourlyRate}</div>
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="">
                <div className="flex justify-between">
                  <h3 className="flex text-lg font-medium items-center">Select Date</h3>
                  <div className="relative w-[50%]">
                    <button
                      onClick={() => setShowCalendar(!showCalendar)}
                      className={`flex min-w-[300px] w-full justify-between items-center gap-2 border border-gray-300 rounded-lg px-4 py-3 text-sm hover:bg-gray-50 ${pricingPlan ? 'cursor-not-allowed' : ''}`}
                      disabled={!!pricingPlan}
                    >
                      <span>{selectedDates.length > 0 ? selectedDates[0].toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' }) : 'Select dates'}</span>
                      <ChevronDown size={16} />
                    </button>
                    {showCalendar && !pricingPlan && (
                      <div className="absolute top-full left-0 mt-2 z-10">
                        <Calendar />
                      </div>
                    )}
                  </div>
                </div>

                {selectedDates.length > 0 && !pricingPlan && (
                  <div className="flex mt-2 flex-wrap gap-2">
                    {selectedDates.map((date, index) => (
                      <span
                        key={index}
                        className="bg-gray-800 text-white px-3 py-1 rounded text-sm flex items-center gap-2"
                      >
                        {date.toLocaleDateString('en-US', { 
                          day: '2-digit', 
                          month: 'short' 
                        })}
                        <button
                          onClick={() => setSelectedDates(prev => prev.filter((_, i) => i !== index))}
                          className={`text-white hover:text-gray-300 ${pricingPlan ? 'hidden' : ''}`}
                        >
                          <X size={14} />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm font-medium text-gray-600 mb-2">
                  <div>Time Slot</div>
                  <div>Price</div>
                </div>
                <div className="space-y-4 mt-2 overflow-y-auto py-2 pr-1 max-h-[calc(60vh-140px)]">
                  {slotPricing.map((slot, index) => (
                    <div key={index} className="grid grid-cols-2 gap-4 items-center">
                      <div className="bg-gray-100 rounded-full px-4 py-3 text-sm text-gray-700">
                        {slot.slot}
                      </div>
                      <input
                        type="number"
                        value={slot.price} // Use string value directly
                        placeholder="₹"
                        onChange={(e) => updateSlotPrice(index, e.target.value)}
                        className="border-0 bg-gray-50 rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500 focus:bg-white"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="flex justify-between p-2 border-t bg-gray-50">
          <button
            onClick={onClose}
            className="px-8 py-3 border border-gray-300 rounded-full text-gray-700 hover:bg-gray-100 font-medium"
          >
            Cancel
          </button>
          {currentStep === 1 ? (
            <button
              onClick={handleNext}
              disabled={getSelectedCourtsCount() === 0}
              className={`px-8 py-3 rounded-full text-white font-medium ${
                getSelectedCourtsCount() > 0
                  ? 'bg-slate-800 hover:bg-slate-900'
                  : 'bg-gray-400 cursor-not-allowed'
              }`}
            >
              Next
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={!isFormValid() || loading}
              className={`px-8 py-3 rounded-full text-white font-medium flex items-center gap-2 ${
                isFormValid() && !loading
                  ? 'bg-slate-800 hover:bg-slate-900'
                  : 'bg-gray-400 cursor-not-allowed'
              }`}
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  {pricingPlan ? 'Updating...' : 'Saving...'}
                </>
              ) : pricingPlan ? 'Update' : 'Save'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default PricingModal;