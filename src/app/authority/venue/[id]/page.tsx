"use client";
import React, { useState, useEffect, useRef, startTransition } from "react";
import Image from "next/image";
import { BottomArrow, Edit1, UpArrowIcon, EyeIcon, Add, Loading } from "@/utils/svgicons";
import Court from "@/assets/images/courtsmallImg.png";
import UserProfile2 from "@/assets/images/images.png";
import CourtManagement from "../../components/headers/EditVenueModal";
import AddEmployeeModal from "../../components/headers/AddEmployeesModal";
import { states } from "@/utils";
import { GoogleMap, useJsApiLoader, Marker, Autocomplete } from "@react-google-maps/api";
import Select from "react-select";
import { getVenue, updateVenue, updateCourt } from "@/services/admin-services";
import { useParams } from "next/navigation";
import useSWR from "swr";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { getImageClientS3URL } from "@/config/axios";
import { deleteFileFromS3, generateSignedUrlForVenue } from "@/actions";

// Custom Modal Component
const Modal: React.FC<{ open: boolean; onClose?: () => void; children: React.ReactNode }> = ({
  open,
  onClose,
  children,
}) => {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-lg p-6 w-11/12 md:w-3/4 h-3/4 border border-gray-200 shadow-md"
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );
};

interface Court {
  id: string;
  name: string;
  status: "Active" | "Inactive";
  image?: string;
  imageKey?: string;
  imageFile?: File | null;
  game: string;
}

interface Employee {
  id: string;
  name: string;
  image?: string;
  isActive: boolean;
}

interface OpeningHour {
  day: string;
  hours: string[];
}

const option = [
  { id: 1, label: "Free Parking" },
  { id: 2, label: "Paid Parking" },
  { id: 3, label: "Rental Equipments" },
  { id: 4, label: "Locker Rooms & Changing Area" },
  { id: 5, label: "Restrooms & Showers" },
];

const statuses = ["Active", "In-Active"];
const gamesAvailableOptions = [
  { value: "Pickleball", label: "Pickleball" },
  { value: "Padel", label: "Padel" },
];

// Custom component for Google Maps
const GoogleMapComponent = ({ location, setLocation, apiKey, initialAddress }) => {
  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: apiKey,
    libraries: ["places"],
  });

  const [map, setMap] = useState(null);
  const [marker, setMarker] = useState(location);
  const [mapType, setMapType] = useState("satellite");
  const autocompleteRef = useRef(null);

  const containerStyle = {
    width: "100%",
    height: "calc(100% - 100px)",
  };

  useEffect(() => {
    if (isLoaded && initialAddress && !location) {
      const geocoder = new google.maps.Geocoder();
      geocoder.geocode({ address: initialAddress }, (results, status) => {
        if (status === "OK" && results[0]) {
          const { lat, lng } = results[0].geometry.location;
          const newLocation = { lat: lat(), lng: lng() };
          setLocation(newLocation);
          setMarker(newLocation);
          if (map) {
            map.panTo(newLocation);
            map.setZoom(15);
          }
        } else {
          console.error("Geocoding failed:", status);
          toast.error("Geocoding failed. Please check the address.");
        }
      });
    }
  }, [isLoaded, initialAddress, location, setLocation, map]);

  const onMapLoad = (mapInstance) => {
    setMap(mapInstance);
    mapInstance.setMapTypeId(mapType);
    if (location) {
      mapInstance.panTo(location);
      mapInstance.setZoom(15);
    }
  };

  const onMapClick = (event) => {
    const lat = event.latLng.lat();
    const lng = event.latLng.lng();
    setLocation({ lat, lng });
    setMarker({ lat, lng });
    if (map) {
      map.panTo({ lat, lng });
      map.setZoom(15);
    }
  };

  const onPlaceChanged = () => {
    if (autocompleteRef.current) {
      const place = autocompleteRef.current.getPlace();
      if (place.geometry) {
        const lat = place.geometry.location.lat();
        const lng = place.geometry.location.lng();
        setLocation({ lat, lng });
        setMarker({ lat, lng });
        if (map) {
          map.panTo({ lat, lng });
          map.setZoom(15);
        }
      }
    }
  };

  if (!isLoaded) return <div>Loading...</div>;

  return (
    <>
      <div className="mb-4 h-fit">
        <Autocomplete
          onLoad={(autocomplete) => (autocompleteRef.current = autocomplete)}
          onPlaceChanged={onPlaceChanged}
        >
          <input
            type="text"
            placeholder="Search location..."
            defaultValue={initialAddress || ""}
            className="w-full p-2 border border-gray-300 rounded mb-2 text-sm"
          />
        </Autocomplete>
      </div>
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={location || { lat: 0, lng: 0 }}
        zoom={location ? 15 : 2}
        mapTypeId={mapType}
        onLoad={onMapLoad}
        onClick={onMapClick}
      >
        {marker && <Marker position={marker} />}
      </GoogleMap>
    </>
  );
};

const Page = () => {
  const { id } = useParams();
  const [selectedImage, setSelectedImage] = useState(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageKey, setImageKey] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [stateDropdown, setStateDropdown] = useState(false);
  const [statusDropdown, setStatusDropdown] = useState(false);
  const [selectedState, setSelectedState] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [contactNumber, setContactNumber] = useState("");
  const [description, setDescription] = useState("");
  const stateDropdownRef = useRef<HTMLDivElement>(null);
  const statusDropdownRef = useRef<HTMLDivElement>(null);
  const [selectedFacilities, setSelectedFacilities] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [employeeModalOpen, setEmployeeModalOpen] = useState(false);
  const [courts, setCourts] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [gamesAvailable, setGamesAvailable] = useState([]);
  const [mapOpen, setMapOpen] = useState(false);
  const [searchParams, setSearchParams] = useState("");
  const [location, setLocation] = useState(null);
  const [openingHours, setOpeningHours] = useState<OpeningHour[]>([
    { day: "Monday", hours: ["06:00", "22:00"] },
    { day: "Tuesday", hours: ["06:00", "22:00"] },
    { day: "Wednesday", hours: ["06:00", "22:00"] },
    { day: "Thursday", hours: ["06:00", "22:00"] },
    { day: "Friday", hours: ["06:00", "22:00"] },
    { day: "Saturday", hours: ["07:00", "22:00"] },
    { day: "Sunday", hours: ["07:00", "22:00"] },
  ]);
  const [openingTime, setOpeningTime] = useState("06:00");
  const [closingTime, setClosingTime] = useState("22:00");
  const [editingCourt, setEditingCourt] = useState<Court | null>(null);

  const apiKey = "AIzaSyCDZoRf-BZL2yR_ZyXpzht_a63hMgLCTis";
  const router = useRouter();

  const { data, mutate, isLoading } = useSWR(
    `admin/get-venue-by-id?id=${id}`,
    getVenue
  );

  const fullAddress = `${address}, ${city}, ${selectedState}`.trim();

  // Function to generate timeslots between opening and closing times
  const generateTimeslots = (startTime: string, endTime: string): string[] => {
    const timeslots: string[] = [];
    if (!startTime || !endTime) return timeslots;

    const startHour = parseInt(startTime.split(":")[0], 10);
    const endHour = parseInt(endTime.split(":")[0], 10);

    if (isNaN(startHour) || isNaN(endHour)) return timeslots;

    for (let hour = startHour; hour <= endHour; hour++) {
      const formattedHour = hour.toString().padStart(2, "0") + ":00";
      timeslots.push(formattedHour);
    }

    return timeslots;
  };

  // Click outside to close dropdowns
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (stateDropdownRef.current && !stateDropdownRef.current.contains(event.target as Node)) {
        setStateDropdown(false);
      }
      if (statusDropdownRef.current && !statusDropdownRef.current.contains(event.target as Node)) {
        setStatusDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const venueDataValue = data?.data?.data || {};
    console.log('venueDataValue: ', venueDataValue);
    if (venueDataValue && Object.keys(venueDataValue).length > 0) {
      setName(venueDataValue.venue?.name || "");
      setAddress(venueDataValue.venue?.address || "");
      setCity(venueDataValue.venue?.city || "");
      setSelectedState(venueDataValue.venue?.state || "");
      setSelectedStatus(venueDataValue.venue?.isActive ? "Active" : "In-Active");
      setContactNumber(venueDataValue.venue?.contactInfo || "");
      setDescription(venueDataValue.venue?.venueInfo || "");

      const mappedCourts = venueDataValue.courts?.map((court: any) => ({
        id: court._id,
        name: court.name,
        status: court.isActive ? "Active" : "Inactive",
        game: court.games,
        image: court.image ? getImageClientS3URL(court.image) : Court.src,
        imageKey: court.image || null,
        imageFile: null,
      })) || [];
      setCourts(mappedCourts);

      const mappedEmployees = venueDataValue.venue?.employees?.map((emp: any) => ({
        id: emp.employeeId,
        name: emp.employeeData?.fullName || "Unknown",
        image: emp.employeeData?.profilePic ? getImageClientS3URL(emp.employeeData.profilePic) : UserProfile2.src,
        isActive: emp.isActive,
      })) || [];
      setEmployees(mappedEmployees);

      const activeFacilities = venueDataValue.venue?.facilities
        ?.map((facility: any, index: number) =>
          facility.isActive ? option[index]?.id : null
        )
        .filter((id: any) => id !== null) || [];
      setSelectedFacilities(activeFacilities);

      setGamesAvailable(venueDataValue.venue?.gamesAvailable || []);

      if (venueDataValue.venue?.location?.coordinates) {
        setLocation({
          lat: venueDataValue.venue.location.coordinates[1],
          lng: venueDataValue.venue.location.coordinates[0],
        });
      }

      if (venueDataValue.venue?.openingHours) {
        setOpeningHours(venueDataValue.venue.openingHours);
        if (venueDataValue.venue.openingHours.length > 0) {
          setOpeningTime(venueDataValue.venue.openingHours[0].hours[0]);
          setClosingTime(venueDataValue.venue.openingHours[0].hours[1]);
        }
      }

      const venueImage = venueDataValue.venue?.image || null;
      setImageKey(venueImage);

      if (venueImage && venueImage.startsWith('venues/')) {
        const imageUrl = getImageClientS3URL(venueImage);
        setSelectedImage(imageUrl);
      } else {
        setSelectedImage(venueImage);
      }
    }
  }, [data]);

  const isSaveDisabled = !(
    selectedImage &&
    name &&
    address &&
    city &&
    selectedState &&
    contactNumber &&
    description &&
    courts.length > 0 &&
    employees.length > 0 &&
    location
  );

  const [togglingCourtId, setTogglingCourtId] = useState<string | null>(null);

  const handleToggleCourtStatus = async (courtId: string) => {
    try {
      const court = courts.find(c => c.id === courtId);
      if (!court) return;

      setTogglingCourtId(courtId);

      const newStatus = court.status === "Active" ? "Inactive" : "Active";

      const payload = {
        id: courtId,
        venueId: id,
        name: court.name,
        isActive: newStatus === "Active",
        games: court.game,
        image: court.imageKey || null,
      };

      const response = await updateCourt("/admin/court", payload);

      if (response?.status === 200 || response?.status === 201) {
        setCourts((prev) =>
          prev.map((c) =>
            c.id === courtId
              ? { ...c, status: newStatus }
              : c
          )
        );
        toast.success(`Court status updated to ${newStatus}`);
      } else {
        toast.error("Failed to update court status");
      }
    } catch (error) {
      console.error("Error updating court status:", error);
      toast.error("Failed to update court status");
    } finally {
      setTogglingCourtId(null);
    }
  };

  const handleAddCourt = (newCourt: Court) => {
    setCourts((prev) => [...prev, newCourt]);
  };

  const handleUpdateCourt = (updatedCourt: Court) => {
    setCourts((prev) =>
      prev.map((court) =>
        court.id === updatedCourt.id ? {
          ...updatedCourt,
          imageKey: updatedCourt.imageKey || court.imageKey
        } : court
      )
    );
  };

  const handleEditCourt = (court: Court) => {
    setEditingCourt(court);
    setModalOpen(true);
  };

  const handleAddEmployees = (newEmployees: any[]) => {
    const mappedEmployees = newEmployees.map((emp: any) => ({
      id: emp.employeeId,
      name: emp.fullName,
      image: emp.image,
      isActive: emp.isActive,
    }));
    setEmployees((prev) => [...prev, ...mappedEmployees]);
  };

  const handleRemoveEmployee = (employeeId: string) => {
    setEmployees((prev) => prev.filter((employee) => employee.id !== employeeId));
  };

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (selectedImage && typeof selectedImage === 'string' && selectedImage.startsWith('blob:')) {
        URL.revokeObjectURL(selectedImage);
      }

      const imageUrl = URL.createObjectURL(file);
      setSelectedImage(imageUrl);
      setImageFile(file);
      setImageKey(null);
    }
  };

  const handleGameChange = (selectedOptions: any) => {
    const selectedGames = selectedOptions
      ? selectedOptions.map((option: any) => option.value)
      : [];
    setGamesAvailable(selectedGames);
  };

  const uploadImageToS3 = async (file: File): Promise<string> => {
    try {
      setIsUploading(true);
      const timestamp = Date.now();
      const fileName = `${timestamp}-${file.name}`;

      const { signedUrl, key } = await generateSignedUrlForVenue(
        fileName,
        file.type
      );

      const uploadResponse = await fetch(signedUrl, {
        method: "PUT",
        body: file,
        headers: {
          "Content-Type": file.type,
        },
      });

      if (!uploadResponse.ok) {
        throw new Error("Failed to upload image to S3");
      }

      return key;
    } catch (error) {
      console.error("Error uploading image:", error);
      toast.error("Failed to upload image");
      throw error;
    } finally {
      setIsUploading(false);
    }
  };

  const handleTimeChange = (index: number, value: string) => {
    const newHours = [openingTime, closingTime];
    newHours[index] = value;
    const [newOpeningTime, newClosingTime] = newHours;
    setOpeningTime(newOpeningTime);
    setClosingTime(newClosingTime);
    setOpeningHours((prev) =>
      prev.map((entry) => ({
        ...entry,
        hours: [newOpeningTime, newClosingTime],
      }))
    );
  };

  const handleSave = async () => {
    setIsUploading(true);
    try {
      let finalImageKey = imageKey;

      if (imageFile) {
        finalImageKey = await uploadImageToS3(imageFile);

        if (imageKey && imageKey.startsWith('venues/')) {
          try {
            await deleteFileFromS3(imageKey);
            console.log("Previous venue image deleted:", imageKey);
          } catch (error) {
            console.error("Error deleting previous venue image:", error);
          }
        }
      }

      const updatedCourts = courts;

      const timeslots = generateTimeslots(openingTime, closingTime);

      const payload = {
        _id: id,
        name,
        address,
        city,
        state: selectedState,
        contactInfo: contactNumber,
        venueInfo: description,
        image: finalImageKey,
        gamesAvailable,
        facilities: [
          ...option.map((opt) => ({
            name: opt.label,
            isActive: selectedFacilities.includes(opt.id),
          })),
        ],
        courts: updatedCourts.map((court) => ({
          name: court.name,
          isActive: court.status === "Active",
          games: court.game,
          image: court.imageKey || null,
          id: court.id,
        })),
        employees: employees.map((emp) => ({
          employeeId: emp.id,
          isActive: emp.isActive,
        })),
        location: {
          type: "Point",
          coordinates: [location.lng, location.lat],
        },
        openingHours,
        timeslots,
      };

      startTransition(async () => {
        try {
          console.log('payload: ', payload);
          const endpoint = `/admin/update-venue`;
          const response = await updateVenue(endpoint, payload);
          if (response?.status === 200 || response?.status === 201) {
            toast.success("Venue updated successfully");

            if (selectedImage && typeof selectedImage === 'string' && selectedImage.startsWith('blob:')) {
              URL.revokeObjectURL(selectedImage);
            }

            courts.forEach(court => {
              if (court.image && typeof court.image === 'string' && court.image.startsWith('blob:')) {
                URL.revokeObjectURL(court.image);
              }
            });

            router.push("/authority/venue");
          } else {
            toast.error("Failed to update venue");
            setIsUploading(false);
          }
        } catch (error) {
          console.error("Error updating venue:", error);
          toast.error("Something went wrong");
          setIsUploading(false);
        }
      });
    } catch (error) {
      console.error("Error in save process:", error);
      toast.error("Failed to upload images or save venue");
      setIsUploading(false);
    }
  };

  useEffect(() => {
    return () => {
      if (selectedImage && typeof selectedImage === 'string' && selectedImage.startsWith('blob:')) {
        URL.revokeObjectURL(selectedImage);
      }
    };
  }, [selectedImage]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <main className="mb-2">
      <h1 className="text-2xl md:text-3xl font-semibold text-[#10375c] mb-6">
        {id ? "Edit Venue" : "Add New Venue"}
      </h1>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Left Side */}
        <div className="w-full lg:w-2/5 bg-white rounded-2xl p-4 shadow-md h-fit">
          <div className="relative h-64 w-full bg-[#e5e5e5] rounded-xl flex items-center justify-center mb-6">
            {selectedImage ? (
              <Image
                src={selectedImage}
                alt="Venue Image"
                fill
                className="object-cover rounded-xl"
              />
            ) : (
              <span className="text-black/60 text-sm">No Image Uploaded</span>
            )}
            <label className="absolute bottom-2 right-2 bg-white rounded-full px-2 py-1 flex items-center gap-2 cursor-pointer shadow-md">
              <Edit1 />
              <span className="text-sm font-medium">Change Image</span>
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageChange}
                disabled={isUploading}
              />
            </label>
            {isUploading && (
              <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded-xl">
                <div className="text-white">Uploading...</div>
              </div>
            )}
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-xs font-medium text-[#1b2229]">
                Name of venue
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full mt-2 p-3 bg-white rounded-full text-xs border border-gray-300"
                placeholder="Enter venue name"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-medium text-[#1b2229]">
                  Address
                </label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full mt-2 p-3 bg-white rounded-full text-xs border border-gray-300"
                  placeholder="Enter Address"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-[#1b2229]">
                  City
                </label>
                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full mt-2 p-3 bg-white rounded-full text-xs border border-gray-300"
                  placeholder="Enter City"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-medium text-[#1b2229]">
                  Contact Number
                </label>
                <input
                  type="tel"
                  value={contactNumber}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, "");
                    if (value.length <= 10) {
                      setContactNumber(value);
                    }
                  }}
                  className="w-full mt-2 p-3 bg-white rounded-full text-xs border border-gray-300"
                  placeholder="Enter Contact Number"
                />
              </div>
              <div className="relative" ref={stateDropdownRef}>
                <label className="text-xs font-medium text-[#1b2229] block mb-2">
                  State
                </label>
                <button
                  className="w-full p-3 border border-[#e6e6e6] rounded-full bg-white flex justify-between items-center text-xs"
                  onClick={() => setStateDropdown(!stateDropdown)}
                  aria-expanded={stateDropdown}
                  aria-label="Select State"
                >
                  {selectedState || "Select State"}
                  <span>{stateDropdown ? <UpArrowIcon /> : <BottomArrow />}</span>
                </button>
                {stateDropdown && (
                  <div className="absolute top-full left-0 w-full mt-2 bg-white rounded-xl shadow-lg p-4 max-h-60 overflow-y-auto overflo-custom z-50">
                    {states.map((state) => (
                      <label
                        key={state}
                        className="flex gap-2 cursor-pointer text-xs py-1"
                      >
                        <input
                          type="radio"
                          name="state"
                          value={state}
                          checked={selectedState === state}
                          onChange={(e) => {
                            setSelectedState(e.target.value);
                            setStateDropdown(false);
                          }}
                          className="accent-[#1b2229]"
                        />
                        {state}
                      </label>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-medium text-[#1b2229] block mb-2">
                  Location
                </label>
                <button
                  onClick={() => setMapOpen(true)}
                  className="w-full p-3 bg-white rounded-full text-xs border border-gray-300 flex items-center justify-between"
                >
                  <span>
                    {location
                      ? `Lat: ${location.lat.toFixed(4)}, Lng: ${location.lng.toFixed(4)}`
                      : "Select a location"}
                  </span>
                </button>
              </div>
              <div className="relative" ref={statusDropdownRef}>
                <label className="text-xs font-medium text-[#1b2229] block mb-2">
                  Status
                </label>
                <button
                  className="w-full p-3 border border-[#e6e6e6] rounded-full bg-white flex justify-between items-center text-xs"
                  onClick={() => setStatusDropdown(!statusDropdown)}
                  aria-expanded={statusDropdown}
                  aria-label="Select Status"
                >
                  {selectedStatus || "Select Status"}
                  <span>{statusDropdown ? <UpArrowIcon /> : <BottomArrow />}</span>
                </button>
                {statusDropdown && (
                  <div className="absolute top-full left-0 w-full mt-2 bg-white rounded-xl shadow-lg p-4 z-50">
                    {statuses.map((status) => (
                      <label
                        key={status}
                        className="flex gap-2 cursor-pointer text-xs py-1"
                      >
                        <input
                          type="radio"
                          name="status"
                          value={status}
                          checked={selectedStatus === status}
                          onChange={(e) => {
                            setSelectedStatus(e.target.value);
                            setStatusDropdown(false);
                          }}
                          className="accent-[#1b2229]"
                        />
                        {status}
                      </label>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="h-[69.41px]">
              <div className="text-[#1B2229] mb-[8px] text-xs font-medium">
                Games Available
              </div>
              <Select
                isMulti
                options={gamesAvailableOptions}
                value={gamesAvailableOptions.filter((option) =>
                  gamesAvailable.includes(option.value)
                )}
                onChange={handleGameChange}
                className="w-full text-black/60 text-xs font-medium"
                classNamePrefix="react-select"
                placeholder="Select Game..."
                styles={{
                  control: (base) => ({
                    ...base,
                    borderRadius: "44px",
                    border: "1px solid #e6e6e6",
                    boxShadow: "none",
                    height: "45.41px",
                    backgroundColor: "white",
                    "&:hover": {
                      borderColor: "#e6e6e6",
                    },
                  }),
                  menu: (base) => ({
                    ...base,
                    borderRadius: "8px",
                    width: "40%",
                    boxShadow: "0 2px 4px rgba(0, 0,0, 0.1)",
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
                    backgroundColor: "#1c2329",
                    borderRadius: "5px",
                  }),
                  multiValueLabel: (base) => ({
                    ...base,
                    color: "white",
                    padding: "4px 2px 4px 12px",
                  }),
                  multiValueRemove: (base) => ({
                    ...base,
                    color: "white",
                    margin: "4px 5px 4px 0px",
                    "&:hover": {
                      backgroundColor: "#1c2329",
                      color: "white",
                    },
                  }),
                }}
              />
            </div>

            <div>
              <label className="text-xs font-medium text-[#1b2229] block mb-2">
                Description
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full p-3 bg-white rounded-xl text-xs border border-gray-300 resize-y h-24"
                placeholder="Enter venue description"
              />
            </div>

            <button
              onClick={handleSave}
              className={`flex items-center justify-center w-full p-3 rounded-full text-white text-sm font-medium ${
                isSaveDisabled || isUploading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-[#10375c]"
              }`}
              disabled={isSaveDisabled || isUploading}
            >
              {isUploading ? <Loading /> : null}
              {isUploading ? 'Saving...' : 'Save'}
            </button>
          </div>
        </div>

        {/* Right Side */}
        <div className="w-full lg:w-3/5 space-y-6">
          {/* Courts */}
          <div className="bg-[#f2f2f4] rounded-2xl p-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
              <h3 className="text-2xl font-semibold text-[#10375c] mb-4 sm:mb-0">
                Courts
              </h3>
              <button
                onClick={() => {
                  setEditingCourt(null);
                  setModalOpen(true);
                }}
                className="flex items-center gap-2 px-5 py-2 bg-[#1b2229] rounded-full text-white text-sm"
              >
                <Add /> Add A New Court
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {courts.map((court) => (
                <div key={court.id} className="bg-white p-3 rounded-xl space-y-3">
                  <div className="flex gap-3">
                    <div className="relative">
                      <Image
                        src={court.imageKey && court.imageKey.startsWith('courts/')
                          ? getImageClientS3URL(court.imageKey)
                          : court.image || Court}
                        alt={`${court.name} Image`}
                        width={80}
                        height={80}
                        className="object-cover rounded"
                      />
                    </div>
                    <div className="flex-1">
                      <h4 className="text-lg font-semibold text-[#1b2229]">
                        {court.name}
                      </h4>
                      <p className="text-xs text-[#1b2229] mt-1">
                        Game: {court.game}
                      </p>
                      <div className="mt-2">
                        <label className={`flex items-center ${togglingCourtId === court.id ? 'opacity-50 cursor-wait' : 'cursor-pointer'}`}>
                          <input
                            type="checkbox"
                            checked={court.status === "Active"}
                            onChange={() => {
                              if (togglingCourtId !== court.id) {
                                handleToggleCourtStatus(court.id);
                              }
                            }}
                            className="hidden"
                            disabled={togglingCourtId === court.id}
                          />
                          <span
                            className={`w-10 h-5 ${
                              court.status === "Active"
                                ? "bg-[#1b2229]"
                                : "bg-[#ccc]"
                            } rounded-full relative transition-colors duration-300`}
                          >
                            <span
                              className={`w-4 h-4 bg-white rounded-full absolute top-0.5 ${
                                court.status === "Active"
                                  ? "left-5"
                                  : "left-0.5"
                              } transition-transform duration-300`}
                            ></span>
                          </span>
                        </label>
                        <div className="flex items-center mt-1">
                          <p
                            className={`text-[10px] font-medium ${
                              court.status === "Active"
                                ? "text-[#1b2229]"
                                : "text-[#ff0004]"
                            }`}
                          >
                            {court.status}
                          </p>
                          {togglingCourtId === court.id && (
                            <div className="ml-2 w-3 h-3 border-t-2 border-r-2 border-[#1b2229] rounded-full animate-spin"></div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => handleEditCourt(court)}
                    className="w-full py-2 bg-[#1C2329] text-white text-[10px] rounded-full"
                  >
                    Edit
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Facilities and Employees */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-[#f2f2f4] rounded-2xl p-4">
              <h2 className="text-xl font-medium text-[#172554] mb-4">
                Select Facilities
              </h2>
              <div className="space-y-2 max-h-48 overflow-y-auto overflo-custom">
                {option.map((opt) => (
                  <div
                    key={opt.id}
                    className="flex justify-between items-center py-1 cursor-pointer"
                    onClick={() => {
                      setSelectedFacilities((prev) =>
                        prev.includes(opt.id)
                          ? prev.filter((item) => item !== opt.id)
                          : [...prev, opt.id]
                      );
                    }}
                  >
                    <span className="text-xs font-medium text-[#1b2229]">
                      {opt.label}
                    </span>
                    <Image
                      src={
                        selectedFacilities.includes(opt.id)
                          ? "/orange.svg"
                          : "/gray.svg"
                      }
                      alt={
                        selectedFacilities.includes(opt.id)
                          ? "Selected"
                          : "Not Selected"
                      }
                      width={16}
                      height={16}
                    />
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-[#f2f2f4] rounded-2xl p-4">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
                <h3 className="text-xl font-medium text-[#10375c] mb-4 sm:mb-0">
                  Employees Associated
                </h3>
                <button
                  onClick={() => setEmployeeModalOpen(true)}
                  className="flex items-center gap-2 px-3 py-1 bg-[#1b2229] rounded-full text-white text-[10px]"
                >
                  Add Employee
                </button>
              </div>

              <div className="space-y-2 max-h-48 overflow-y-auto overflo-custom">
                {employees.map((employee) => (
                  <div key={employee.id}>
                    <div className="flex justify-between items-center py-1">
                      <div className="flex items-center gap-3">
                        <Image
                          src={employee.image || UserProfile2}
                          alt={`Employee ${employee.name}`}
                          width={23}
                          height={23}
                          className="rounded-full"
                        />
                        <div>
                          <span className="text-xs font-medium text-[#1b2229]">
                            {employee.name}
                          </span>
                          <p
                            className={`text-[10px] font-medium ${
                              employee.isActive
                                ? "text-[#1b2229]"
                                : "text-[#ff0004]"
                            }`}
                          >
                            {employee.isActive ? "Active" : "Inactive"}
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => handleRemoveEmployee(employee.id)}
                        className="px-3 py-1 bg-[#fd5602]/10 rounded-full text-[#fd5602] text-xs"
                      >
                        Remove
                      </button>
                    </div>
                    <div className="h-[1px] w-full border border-white"></div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Timings */}
          <div className="bg-[#f2f2f4] rounded-2xl p-4">
            <h2 className="text-xl font-medium text-[#172554] mb-4">Timings</h2>
            <div className="grid grid-cols-2 gap-4 font-semibold text-[#10375C] text-sm border-b border-gray-300 pb-2">
              <div>Opening Hours</div>
              <div>Closing Hours</div>
            </div>
            <div className="mt-4">
              <div className="grid grid-cols-2 gap-4 items-center text-sm">
                <input
                  type="time"
                  value={openingTime}
                  onChange={(e) => handleTimeChange(0, e.target.value)}
                  className="p-2 bg-white rounded-full text-xs border border-gray-300 w-full"
                />
                <input
                  type="time"
                  value={closingTime}
                  onChange={(e) => handleTimeChange(1, e.target.value)}
                  className="p-2 bg-white rounded-full text-xs border border-gray-300 w-full"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <CourtManagement
        open={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setEditingCourt(null);
        }}
        onSave={editingCourt ? handleUpdateCourt : handleAddCourt}
        court={editingCourt ? {...editingCourt, venueId: id} : null}
        venueId={id}
      />
      <AddEmployeeModal
        open={employeeModalOpen}
        setOpen={setEmployeeModalOpen}
        onAddEmployees={handleAddEmployees}
      />
      {mapOpen && (
        <Modal open={mapOpen}>
          <div className="bg-white rounded-lg p-2 w-full h-[100%] flex flex-col justify-between">
            <div className="w-full flex justify-between mb-4">
              <h2 className="text-lg font-semibold">Select Location</h2>
              <button onClick={() => setMapOpen(false)}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M18 6 6 18" />
                  <path d="m6 6 12 12" />
                </svg>
              </button>
            </div>
            <GoogleMapComponent
              location={location}
              setLocation={setLocation}
              apiKey={apiKey}
              initialAddress={fullAddress || ""}
            />
            <button
              onClick={() => setMapOpen(false)}
              className="mt-4 w-full p-3 bg-[#1a73e8] text-white rounded-full text-sm font-medium hover:bg-[#1557b0]"
            >
              Save Location
            </button>
          </div>
        </Modal>
      )}
    </main>
  );
};

export default Page;