"use client";
import { useState, useEffect, useTransition } from "react";
import dynamic from "next/dynamic";
import type { MultiValue } from "react-select";
import { toast } from "sonner";
import { getCourts, getVenues, createMatch } from "@/services/admin-services";
import { useSession } from "next-auth/react";

const Select = dynamic(() => import("react-select"), { ssr: false });

interface TimeSlotOption {
  value: string;
  label: string;
  isDisabled: boolean;
}

interface Venue {
  _id: string;
  name: string;
}

interface Court {
  _id: string;
  name: string;
  availableSlots: {
    time: string;
    isAvailable: boolean;
  }[];
}

interface VenueOption {
  value: string;
  label: string;
}

interface CourtOption {
  value: string;
  label: string;
}

// Define the booking payload interface based on the provided data structure
interface BookingPayload {
  player1: string;
  player1Email: string;
  player1phone: string;
  player2: string;
  player3: string;
  player4: string;
  venueId: string;
  courtId: string;
  bookingSlots: string[];
  balls:number;
  rackets:number;
}

export const BookingModal = ({ onClose }: { onClose: () => void }) => {
  const [court, setCourt] = useState<string>("");
    const [isPending, startTransition] = useTransition();
  const [selectedTimeSlots, setSelectedTimeSlots] = useState<
    MultiValue<TimeSlotOption>
  >([]);
  const [guestPlayer1, setGuestPlayer1] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [phone, setPhone] = useState<string>("");
  const [balls, setBalls] = useState<number>();
  const [rackets, setRackets] = useState<number>();
  const [guestPlayer2, setGuestPlayer2] = useState<string>("");
  const [guestPlayer3, setGuestPlayer3] = useState<string>("");
  const [guestPlayer4, setGuestPlayer4] = useState<string>("");
  const [venue, setVenue] = useState<string>("");
  const [venues, setVenues] = useState<Venue[]>([]);
  const [courts, setCourts] = useState<Court[]>([]);
  const [selectedCourtId, setSelectedCourtId] = useState<string>("");
  const [selectedVenueId, setSelectedVenueId] = useState<string>("");
  const [date, setDate] = useState<string>("");
  const { data: session } = useSession();
  const userRole = (session as any)?.user?.role;
  const userData = (session as any)?.user
  const getCurrentDate = (): string => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");
    const finalDate = `${year}-${month}-${day}`;
    setDate(finalDate);
    return finalDate;
  };

  const getAllVenues = async () => {
    try {
      const response = await getVenues("/admin/get-venues");
      const data = response?.data?.data;
      if (response.status === 200) {
        setVenues(data);
        if (userRole !== "admin" && userData.venueId) {
          const selectedVenue = data.find((venue: Venue) => venue._id === userData.venueId);
          if (selectedVenue) {
            setVenue(selectedVenue.name);
            setSelectedVenueId(selectedVenue._id);
          }
        }
      } else {
        toast.error("Error fetching venues");
      }
    } catch (error) {
      toast.error((error as Error).message);
    }
  };

  const getAllCourts = async () => {
    if (!date || !selectedVenueId) return;
    try {
      const response = await getCourts(
        `/admin/get-courts?date=${date}&venueId=${selectedVenueId}`
      );
      const data = response?.data?.data?.courts;
      if (response.status === 200) {
        setCourts(data);
      } else {
        toast.error("Error fetching courts");
      }
    } catch (error) {
      toast.error((error as Error).message);
    }
  };

  const handleCreateBooking = async () => {
    
    if (
      !selectedVenueId ||
      !selectedCourtId ||
      !guestPlayer1 ||
      !email ||
      !phone ||
      selectedTimeSlots.length === 0
    ) {
      toast.error(
        "Please fill in all required fields (Venue, Court, Player 1, Email, Phone, and at least one Time Slot)."
      );
      return;
    }

    const payload: BookingPayload = {
      player1: guestPlayer1,
      player1Email: email,
      player1phone: phone,
      player2: guestPlayer2 || "",
      player3: guestPlayer3 || "",
      player4: guestPlayer4 || "",
      venueId: selectedVenueId,
      courtId: selectedCourtId,
      rackets:rackets,
      balls:balls,
      bookingSlots: selectedTimeSlots.map((slot) => slot.value),
    };
startTransition(async () => {
    try {
      const response = await createMatch("/admin//create-match", payload);
      if (response.status === 200 || response.status === 201) {
        toast.success("Booking created successfully");
        window.location.reload();
        onClose();
      } else {
        toast.error("Error creating booking");
      }
    } catch (error) {
      toast.error((error as Error).message || "Failed to create booking");
    }
        });
  };

  const timeSlotOptions: TimeSlotOption[] =
    courts
      .find((court) => court._id === selectedCourtId)
      ?.availableSlots?.map((slot) => ({
        value: slot.time,
        label: `${slot.time} - ${new Date(
          `2025-08-14T${slot.time}:00`
        ).toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        })}`,
        isDisabled: !slot.isAvailable,
      })) || [];

  const venueOptions: VenueOption[] = venues.map((venue) => ({
    value: venue._id,
    label: venue.name,
  }));

  const courtOptions: CourtOption[] = courts.map((court:any) => ({
    
    value: court._id,
    label: `${court.name} - ${court.games}`
  }));
  console.log('courtOptions: ', courtOptions);
  console.log('venueOptions: ', venueOptions);

  console.log('courts: ', courts);
  const paymentOptions: string[] = ["Cash/UPI", "Credit Card", "Debit Card"];

  useEffect(() => {
    getCurrentDate();
    getAllVenues();
  }, []);

  useEffect(() => {
    getAllCourts();
  }, [date, selectedVenueId]);

const handleVenueChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    // Only allow venue change if user is not an employee
    if (userRole == "admin") {
      const selectedVenue = venues.find((venue) => venue._id === e.target.value);
      if (selectedVenue) {
        setVenue(selectedVenue.name);
        setSelectedVenueId(selectedVenue._id);
        setCourts([]);
        setSelectedCourtId("");
        setSelectedTimeSlots([]);
      }
    }
  };

  const handleCourtChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedCourt = courts.find((court) => court._id === e.target.value);
    if (selectedCourt) {
      setCourt(selectedCourt.name);
      setSelectedCourtId(selectedCourt._id);
      setSelectedTimeSlots([]);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center z-50">
      <div className="bg-white rounded-lg mt-10 w-[90%] max-w-4xl max-h-[75vh] ">
        {/* Header */}
        <div className="p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-800">
            Create Booking
          </h2>
        </div>

        <div className="p-6 space-y-6 max-h-[60vh] overflow-y-auto">
          {/* Booking Details */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="text-sm font-medium text-gray-700 mb-4">
              Booking Details
            </h3>

            <div className="space-y-4">
              {/* Select Venue */}
              <div>
                <label className="block text-xs text-gray-600 mb-2">
                  Select A Venue
                </label>
                <div className="relative">
                  <select
                    className="w-full p-3 border border-gray-300 rounded-lg bg-white text-sm appearance-none pr-10"
                    value={selectedVenueId}
                    onChange={handleVenueChange}
                    disabled={userRole !== "admin"}
                  >
                    <option value="">Select a venue</option>
                    {venueOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <svg
                      className="w-4 h-4 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M19 9l-7 7-7-7"
                      ></path>
                    </svg>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Select Court */}
                <div>
                  <label className="block text-xs text-gray-600 mb-2">
                    Select Court
                  </label>
                  <div className="relative">
                    <select
                      className="w-full p-3 border border-gray-300 rounded-lg bg-white text-sm appearance-none pr-10"
                      value={selectedCourtId}
                      onChange={handleCourtChange}
                      disabled={!selectedVenueId}
                    >
                      <option value="">Select a court</option>
                      {courtOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                        {option.label}
                        </option>
                      ))}
                    </select>
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                      <svg
                        className="w-4 h-4 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M19 9l-7 7-7-7"
                        ></path>
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Select Time Slot */}
                <div>
                  <label className="block text-xs text-gray-600 mb-2">
                    Select Time Slot
                  </label>
                 <Select
  isMulti
  options={timeSlotOptions}
  value={selectedTimeSlots}
  onChange={(selected: MultiValue<TimeSlotOption>) =>
    setSelectedTimeSlots(selected)
  }
  className="w-full text-sm"
  classNamePrefix="react-select"
  placeholder="Select Time Slots..."
  isOptionDisabled={(option: TimeSlotOption) => option.isDisabled}
  styles={{
    control: (base) => ({
      ...base,
      borderRadius: "8px",
      border: "1px solid #d1d5db",
      boxShadow: "none",
      minHeight: "36px",
      height: "36px",
      padding: "2px 4px",
    }),
    valueContainer: (base) => ({
      ...base,
      padding: "0 6px",
    }),
    input: (base) => ({
      ...base,
      margin: 0,
      padding: 0,
    }),
    menu: (base) => ({
      ...base,
      borderRadius: "8px",
      boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
    }),
    menuList: (base) => ({
      ...base,
      maxHeight: "120px",   // 👈 limits dropdown to ~3-4 items
     overflowY: "auto",
      // 👇 apply your custom no-scrollbar class
      "::-webkit-scrollbar": {
        display: "none",
      },    // 👈 enables scroll
    }),
    option: (base, { isFocused, isDisabled }) => ({
      ...base,
      backgroundColor: isDisabled
        ? "#f3f4f6"
        : isFocused
        ? "#e5e7eb"
        : "white",
      color: isDisabled ? "#9ca3af" : "#374151",
      cursor: isDisabled ? "not-allowed" : "default",
    }),
    multiValue: (base) => ({
      ...base,
      backgroundColor: "#1f2937",
      borderRadius: "6px",
    }),
    multiValueLabel: (base) => ({
      ...base,
      color: "white",
      padding: "2px 6px",
      fontSize: "12px",
    }),
    multiValueRemove: (base) => ({
      ...base,
      color: "white",
      "&:hover": {
        backgroundColor: "#374151",
        color: "white",
      },
    }),
  }}
/>

                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 ">
              <div >
                <label className="block text-xs text-gray-600 mb-2">
                  Balls
                </label>
                <input
                  type="number"
                  className="w-full p-3 border border-gray-300 rounded-lg text-sm"
                  value={balls}
                  onChange={(e) => setBalls(parseInt(e.target.value, 10))}
                  placeholder="Balls"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-600 mb-2">
                  Rackets
                </label>
                <input
                  type="number"
                  className="w-full p-3 border border-gray-300 rounded-lg text-sm"
                  value={rackets}
                  onChange={(e) => setRackets(parseInt(e.target.value, 10))}
                  placeholder="Rackets"
                />
              </div>
              </div>
            </div>
          </div>

          {/* Customer Details */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="text-sm font-medium text-gray-700 mb-4">
              Customer Details
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Guest Player 1 */}
              <div>
                <label className="block text-xs text-gray-600 mb-2">
                  Guest Player 1
                </label>
                <input
                  type="text"
                  className="w-full p-3 border border-gray-300 rounded-lg text-sm"
                  value={guestPlayer1}
                  onChange={(e) => setGuestPlayer1(e.target.value)}
                  placeholder="Guest Player 1"
                />
              </div>

              {/* Email Address */}
              <div>
                <label className="block text-xs text-gray-600 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  className="w-full p-3 border border-gray-300 rounded-lg text-sm"
                  value={email}
                  placeholder={"Email"}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              {/* Phone */}
              <div>
                <label className="block text-xs text-gray-600 mb-2">
                  Phone
                </label>
                <input
                  type="text"
                  className="w-full p-3 border border-gray-300 rounded-lg text-sm"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="Phone"
                />
              </div>

              {/* Guest Player 2 */}
              <div>
                <label className="block text-xs text-gray-600 mb-2">
                  Guest Player 2
                </label>
                <input
                  type="text"
                  className="w-full p-3 border border-gray-300 rounded-lg text-sm"
                  value={guestPlayer2}
                  onChange={(e) => setGuestPlayer2(e.target.value)}
                  placeholder="Guest Player 2"
                />
              </div>

              {/* Guest Player 3 */}
              <div>
                <label className="block text-xs text-gray-600 mb-2">
                  Guest Player 3
                </label>
                <input
                  type="text"
                  className="w-full p-3 border border-gray-300 rounded-lg text-sm"
                  value={guestPlayer3}
                  onChange={(e) => setGuestPlayer3(e.target.value)}
                  placeholder="Guest Player 3"
                />
              </div>

              {/* Guest Player 4 */}
              <div>
                <label className="block text-xs text-gray-600 mb-2">
                  Guest Player 4
                </label>
                <input
                  type="text"
                  className="w-full p-3 border border-gray-300 rounded-lg text-sm"
                  value={guestPlayer4}
                  onChange={(e) => setGuestPlayer4(e.target.value)}
                  placeholder="Guest Player 4"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-between items-center p-6 border-t bg-gray-50 rounded-b-lg">
          <button
            className="px-8 py-3 bg-white border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="flex px-8 py-3 bg-blue-900 text-white rounded-lg font-medium hover:bg-blue-800 transition-colors"
            onClick={handleCreateBooking} // Add onClick handler
            disabled={isPending}
            >
              {isPending ? (
                <svg className="animate-spin h-5 w-5 mr-2 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : null}
              {isPending ? 'Creating Booking...' : 'Create Booking'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookingModal;
