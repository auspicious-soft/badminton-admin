"use client";
import React, { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import useSWR from 'swr';
import Select from 'react-select';
import { toast } from 'sonner';
import { getVenueForMaintenance, getCourtForMaintenance, createMaintenance } from '@/services/admin-services';
import { useSession } from "next-auth/react";

// Validation schema for maintenance
const maintenanceSchema = yup.object().shape({
    venue: yup.string().required('Venue is required'),
    // reason: yup.number().required('Reason is required'),
    reason: yup
    .number()
    .typeError('Reason is required') // Custom error for non-number input
    .required('Reason is required') // Custom error for empty or undefined
    .min(1, 'Reason must be a positive number') // Optional: Custom error for minimum value
    .max(100, 'Reason must not exceed 100') // Optional: Custom error for maximum value
    .test(
      'is-valid-reason',
      'Reason is invalid (must be a specific value, e.g., between 1 and 100)', // Custom error for custom test
      (value) =>  value !== null && value >= 1 && value <= 100 // Example custom logic
    ),
});

interface MaintenanceModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: any) => void;
    mutate: () => void;

}

const MaintenanceModal: React.FC<MaintenanceModalProps> = ({ isOpen, onClose, onSubmit, mutate }) => {
    const [selectedVenue, setSelectedVenue] = useState<string>('');
    const [selectedVenueTimeslots, setSelectedVenueTimeslots] = useState<string[]>([]);
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const { data: session } = useSession();
    const userRole = (session as any)?.user?.role;
    const userVenueId = (session as any)?.user?.venueId;
    const { data: venueData } = useSWR("admin/venue-list", getVenueForMaintenance);

    const { data: courtData } = useSWR(
        selectedVenue ? `admin/court-list?venueId=${selectedVenue}` : null,
        getCourtForMaintenance
    );

    const { register, handleSubmit, control, formState: { errors }, reset, watch, setValue } = useForm({
        resolver: yupResolver(maintenanceSchema),
        defaultValues: {
            venue: '',
            reason:undefined ,
        },
    });

    const watchedVenue = watch('venue');

    // Handle venue change to update courts and timeslots
    useEffect(() => {
        if (watchedVenue) {
            setSelectedVenue(watchedVenue);
            const venue = venueData?.data?.data?.find((v: any) => v._id === watchedVenue);
            if (venue) {
                setSelectedVenueTimeslots(venue.timeslots || []);
            }
        } else {
            setSelectedVenue('');
            setSelectedVenueTimeslots([]);
        }
    }, [watchedVenue, venueData]);

    // Set default venue for employee role
    useEffect(() => {
        if (userRole === 'employee' && userVenueId && venueData?.data?.data) {
            const employeeVenue = venueData.data.data.find((v: any) => v._id === userVenueId);
            if (employeeVenue) {
                setValue('venue', userVenueId);
                setSelectedVenue(userVenueId);
            }
        }
    }, [userRole, userVenueId, venueData, setValue]);

    // Prevent background scrolling when modal is open
    useEffect(() => {
        if (isOpen) {
            const scrollY = window.scrollY;
            document.body.style.position = 'fixed';
            document.body.style.top = `-${scrollY}px`;
            document.body.style.width = '100%';
            document.body.style.overflow = 'hidden';
        } else {
            const scrollY = document.body.style.top;
            document.body.style.position = '';
            document.body.style.top = '';
            document.body.style.width = '';
            document.body.style.overflow = '';
            if (scrollY) {
                window.scrollTo(0, parseInt(scrollY || '0') * -1);
            }
        }

        return () => {
            document.body.style.position = '';
            document.body.style.top = '';
            document.body.style.width = '';
            document.body.style.overflow = '';
        };
    }, [isOpen]);

    // Prepare options for selects
    const venueOptions = userRole === 'employee' && userVenueId
        ? venueData?.data?.data
            ?.filter((venue: any) => venue._id === userVenueId)
            .map((venue: { _id: string; name: string }) => ({
                value: venue._id,
                label: venue.name,
            })) || []
        : venueData?.data?.data?.map((venue: { _id: string; name: string }) => ({
            value: venue._id,
            label: venue.name,
        })) || [];

    const courtOptions = courtData?.data?.data?.map((court: { _id: string; name: string, games: string }) => ({
        value: court._id,
        label: `${court.name} -  ${court.games}`
    })) || [];

    const timeslotOptions = [
        { value: 'select-all', label: 'Select All' },
        ...selectedVenueTimeslots.map((timeslot: string) => ({
            value: timeslot,
            label: timeslot,
        })),
    ];

    const handleFormSubmit = async (data: any) => {
        setIsSubmitting(true);

        try {
            const payload = {
                venueId: data.venue,
                hour: data.reason,
            };

            const response = await createMaintenance('admin/rain-toggle', payload);
            toast.success('Weather record successfully!');

            if (onSubmit) {
                onSubmit(data);
            }

            if (userRole === 'employee') {
                reset({
                    venue: watchedVenue,
                    reason: undefined,
                });
            } else {
                reset();
            }
            mutate();
            onClose();
        } catch (error: any) {
            console.error('Error creating maintenance booking:', error);
            const errorMessage = error?.response?.data?.message || 'Failed to create maintenance booking';
            toast.error(errorMessage);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleCancel = () => {
        if (userRole === 'employee') {
            reset({
                venue: watchedVenue,
                reason: undefined,
            });
        } else {
            reset();
        }
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-[20px] w-[95%] max-w-[480px] p-8 px-10 flex flex-col items-center shadow-lg">
                <h2 className="text-[#10375c] text-2xl font-semibold mb-2">Weather</h2>
                <form onSubmit={handleSubmit(handleFormSubmit)} className="w-full flex flex-col gap-2">
                    <div>
                        <label className="block text-[#1b2229] text-xs font-medium mb-2">Select Venue</label>
                        <select
                            {...register('venue')}
                            className="w-full h-[45px] px-4 py-2 bg-[#f2f2f4] rounded-full text-black/60 text-sm font-medium outline-none"
                            disabled={userRole === 'employee'}
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
                        <label className="block text-[#1b2229] text-xs font-medium mb-2">Select Hours</label>
                        <input
                            {...register('reason')}
                            className="w-full h-[45px] px-4 py-2 bg-[#f2f2f4] rounded-full text-black/60 text-sm font-medium outline-none"
                            type="number"
                            placeholder="Hours"
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
                            {isSubmitting ? 'Creating...' : 'Create'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default MaintenanceModal;