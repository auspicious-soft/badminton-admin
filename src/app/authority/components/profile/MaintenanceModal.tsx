"use client";
import React, { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import useSWR from 'swr';
import Select from 'react-select';
import { toast } from 'sonner';
import { getVenueForMaintenance, getCourtForMaintenance, createMaintenance } from '@/services/admin-services';

// Validation schema for maintenance
const maintenanceSchema = yup.object().shape({
    venue: yup.string().required('Venue is required'),
    court: yup.string().required('Court is required'),
    date: yup.string().required('Date is required'),
    timeslots: yup.array().min(1, 'At least one timeslot is required').required('Timeslots are required'),
    reason: yup.string().required('Reason is required'),
});

interface MaintenanceModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: any) => void;
}

const MaintenanceModal: React.FC<MaintenanceModalProps> = ({ isOpen, onClose, onSubmit }) => {
    const [selectedVenue, setSelectedVenue] = useState<string>('');
    const [selectedVenueTimeslots, setSelectedVenueTimeslots] = useState<string[]>([]);
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

    const { data: venueData } = useSWR("admin/venue-list", getVenueForMaintenance);

    const { data: courtData } = useSWR(
        selectedVenue ? `admin/court-list?venueId=${selectedVenue}` : null,
        getCourtForMaintenance
    );

    const { register, handleSubmit, control, formState: { errors }, reset, watch } = useForm({
        resolver: yupResolver(maintenanceSchema),
        defaultValues: {
            venue: '',
            court: '',
            date: '',
            timeslots: [],
            reason: '',
        },
    });

    const watchedVenue = watch('venue');

    // Handle venue change to update courts and timeslots
    useEffect(() => {
        if (watchedVenue) {
            setSelectedVenue(watchedVenue);
            // Find the selected venue's timeslots
            const venue = venueData?.data?.data?.find((v: any) => v._id === watchedVenue);
            if (venue) {
                setSelectedVenueTimeslots(venue.timeslots || []);
            }
        } else {
            setSelectedVenue('');
            setSelectedVenueTimeslots([]);
        }
    }, [watchedVenue, venueData]);

    // Prevent background scrolling when modal is open
    useEffect(() => {
        if (isOpen) {
            // Save current scroll position
            const scrollY = window.scrollY;
            document.body.style.position = 'fixed';
            document.body.style.top = `-${scrollY}px`;
            document.body.style.width = '100%';
            document.body.style.overflow = 'hidden';
        } else {
            // Restore scroll position
            const scrollY = document.body.style.top;
            document.body.style.position = '';
            document.body.style.top = '';
            document.body.style.width = '';
            document.body.style.overflow = '';
            if (scrollY) {
                window.scrollTo(0, parseInt(scrollY || '0') * -1);
            }
        }

        // Cleanup function to restore scroll when component unmounts
        return () => {
            document.body.style.position = '';
            document.body.style.top = '';
            document.body.style.width = '';
            document.body.style.overflow = '';
        };
    }, [isOpen]);

    // Prepare options for selects
    const venueOptions = venueData?.data?.data?.map((venue: { _id: string; name: string }) => ({
        value: venue._id,
        label: venue.name,
    })) || [];

    const courtOptions = courtData?.data?.data?.map((court: { _id: string; name: string }) => ({
        value: court._id,
        label: court.name,
    })) || [];

    const timeslotOptions = selectedVenueTimeslots.map((timeslot: string) => ({
        value: timeslot,
        label: timeslot,
    }));

    const handleFormSubmit = async (data: any) => {
        setIsSubmitting(true);

        try {
            // Format the payload according to the API specification
            const payload = {
                courtId: data.court,
                venueId: data.venue,
                bookingDate: data.date,
                bookingSlots: data.timeslots.map((slot: any) => slot.value),
                maintenanceReason: data.reason
            };

            console.log('Submitting maintenance booking:', payload);

            // Call the API
            const response = await createMaintenance('admin/maintenance-booking', payload);

            console.log('Maintenance booking response:', response);

            // Show success message
            toast.success('Maintenance booking created successfully!');

            // Call the parent onSubmit if provided (for any additional handling)
            if (onSubmit) {
                onSubmit(data);
            }

            // Reset form and close modal
            reset();
            onClose();

        } catch (error: any) {
            console.error('Error creating maintenance booking:', error);

            // Show error message
            const errorMessage = error?.response?.data?.message || 'Failed to create maintenance booking';
            toast.error(errorMessage);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleCancel = () => {
        reset();
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-[20px] w-[95%] max-w-[480px] p-8 px-10 flex flex-col items-center shadow-lg">
                <h2 className="text-[#10375c] text-2xl font-semibold mb-8">Maintenance</h2>
                <form onSubmit={handleSubmit(handleFormSubmit)} className="w-full flex flex-col gap-2">
                    <div>
                        <label className="block text-[#1b2229] text-xs font-medium mb-2">Select Venue</label>
                        <select
                            {...register('venue')}
                            className="w-full h-[45px] px-4 py-2 bg-[#f2f2f4] rounded-full text-black/60 text-sm font-medium outline-none"
                        >
                            <option value="">Select</option>
                            {venueOptions.map((venue) => (
                                <option key={venue.value} value={venue.value}>
                                    {venue.label}
                                </option>
                            ))}
                        </select>
                        {errors.venue && <p className="text-red-500 text-xs mt-1">{errors.venue.message}</p>}
                    </div>
                    <div>
                        <label className="block text-[#1b2229] text-xs font-medium mb-2">Select Court</label>
                        <select
                            {...register('court')}
                            className="w-full h-[45px] px-4 py-2 bg-[#f2f2f4] rounded-full text-black/60 text-sm font-medium outline-none"
                            disabled={!selectedVenue}
                        >
                            <option value="">Select</option>
                            {courtOptions.map((court) => (
                                <option key={court.value} value={court.value}>
                                    {court.label}
                                </option>
                            ))}
                        </select>
                        {errors.court && <p className="text-red-500 text-xs mt-1">{errors.court.message}</p>}
                    </div>
                    <div>
                        <label className="block text-[#1b2229] text-xs font-medium mb-2">Date</label>
                        <input
                            type="date"
                            {...register('date')}
                            className="w-full h-[45px] px-4 py-2 bg-[#f2f2f4] rounded-full text-black/60 text-sm font-medium outline-none"
                        />
                        {errors.date && <p className="text-red-500 text-xs mt-1">{errors.date.message}</p>}
                    </div>
                    <div>
                        <label className="block text-[#1b2229] text-xs font-medium mb-2">Select Timeslots</label>
                        <Controller
                            name="timeslots"
                            control={control}
                            render={({ field }) => (
                                <Select
                                    {...field}
                                    isMulti
                                    options={timeslotOptions}
                                    className="w-full text-black/60 text-xs font-medium"
                                    classNamePrefix="react-select"
                                    placeholder="Select Time Slots..."
                                    isDisabled={!selectedVenue}
                                    styles={{
                                        control: (base) => ({
                                            ...base,
                                            borderRadius: "44px",
                                            border: "1px solid #e6e6e6",
                                            boxShadow: "none",
                                            backgroundColor: "#f2f2f4",
                                            minHeight: "45px",
                                            "&:hover": {
                                                borderColor: "#e6e6e6",
                                            },
                                            padding: "2px",
                                        }),
                                        menu: (base) => ({
                                            ...base,
                                            borderRadius: "8px",
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
                                            backgroundColor: "#10375c",
                                            borderRadius: "20px",
                                        }),
                                        multiValueLabel: (base) => ({
                                            ...base,
                                            color: "white",
                                            fontSize: "12px",
                                        }),
                                        multiValueRemove: (base) => ({
                                            ...base,
                                            color: "white",
                                            "&:hover": {
                                                backgroundColor: "#0f2e4a",
                                                color: "white",
                                            },
                                        }),
                                    }}
                                />
                            )}
                        />
                        {errors.timeslots && <p className="text-red-500 text-xs mt-1">{errors.timeslots.message}</p>}
                    </div>
                    <div>
                        <label className="block text-[#1b2229] text-xs font-medium mb-2">Select Reason</label>
                        <input
                            {...register('reason')}
                            className="w-full h-[45px] px-4 py-2 bg-[#f2f2f4] rounded-full text-black/60 text-sm font-medium outline-none"
                            type="text"
                            placeholder="Reason"
                        />
                        {errors.reason && <p className="text-red-500 text-xs mt-1">{errors.reason.message}</p>}
                    </div>
                    <div className="flex w-full gap-4 mt-2">
                        <button
                            type="button"
                            onClick={handleCancel}
                            className="w-[40%] py-3 border border-[#10375c] text-[#10375c] rounded-full font-medium transition-colors hover:bg-[#f2f2f4]"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full py-3 bg-[#10375c] text-white rounded-full font-medium transition-colors hover:bg-[#0f2e4a] disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isSubmitting ? 'Creating...' : 'Change Status'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default MaintenanceModal;
