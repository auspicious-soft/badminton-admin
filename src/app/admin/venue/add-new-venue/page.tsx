"use client";
import React, { useState, useEffect, useRef, startTransition } from "react";
import Image from "next/image";
import { Add, BottomArrow, Edit1, UpArrowIcon } from "@/utils/svgicons";
import Court from "@/assets/images/courtsmallImg.png";
import UserProfile2 from "@/assets/images/UserProfile2.png";
import CourtManagement from "../../components/headers/AddVenueModal";
import AddEmployeeModal from "../../components/headers/AddEmployeesModal";
import { states } from "@/utils";
import { GoogleMap, useJsApiLoader, Marker, Autocomplete } from "@react-google-maps/api";
import Select from "react-select";
import { createVenue } from "@/services/admin-services";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

// Custom Modal Component
const Modal: React.FC<{ open: boolean; onClose?: () => void; children: React.ReactNode }> = ({
  open,
  onClose,
  children,
}) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={onClose}>
      <div className="bg-white rounded-lg p-6 w-11/12 md:w-3/4 h-3/4 border border-gray-200 shadow-md" onClick={(e) => e.stopPropagation()}>
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

  // Geocode the initial address when the map loads
  useEffect(() => {
    if (isLoaded && initialAddress && !location) {
      const geocoder = new google.maps.Geocoder();
      geocoder.geocode({ address: initialAddress }, (results, status) => {
        if (status === "OK" && results[0]) {
          const { lat, lng } = results[0].geometry.location;
          const newLocation = { lat: lat(), lng: lng() };
          setLocation(newLocation);
          setMarker(newLocation);
          map?.panTo(newLocation);
        } else {
          console.error("Geocoding failed:", status);
        }
      });
    }
  }, [isLoaded, initialAddress, location, setLocation, map]);

  const onMapLoad = (mapInstance) => {
    setMap(mapInstance);
    mapInstance.setMapTypeId(mapType);
  };

  const onMapClick = (event) => {
    const lat = event.latLng.lat();
    const lng = event.latLng.lng();
    setLocation({ lat, lng });
    setMarker({ lat, lng });
  };

  const onPlaceChanged = () => {
    if (autocompleteRef.current) {
      const place = autocompleteRef.current.getPlace();
      if (place.geometry) {
        const lat = place.geometry.location.lat();
        const lng = place.geometry.location.lng();
        setLocation({ lat, lng });
        setMarker({ lat, lng });
        map?.panTo({ lat, lng });
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
            className="w-full p-2 border border-gray-300 rounded mb-2 text-sm"
            defaultValue={initialAddress}
          />
        </Autocomplete>
      </div>
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={location || { lat: 0, lng: 0 }}
        zoom={location ? 10 : 2}
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
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [stateDropdown, setStateDropdown] = useState(false);
  const [statusDropdown, setStatusDropdown] = useState(false);
  const [selectedState, setSelectedState] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [selectedFacilities, setSelectedFacilities] = useState<number[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [employeeModalOpen, setEmployeeModalOpen] = useState(false);
  const [courts, setCourts] = useState<Court[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [gamesAvailable, setGamesAvailable] = useState<string[]>([]);
  const [mapOpen, setMapOpen] = useState(false);
  const [location, setLocation] = useState(null);
  const [openingHours, setOpeningHours] = useState<OpeningHour[]>([
    { day: "Monday", hours: ["06:00", "21:00"] },
    { day: "Tuesday", hours: ["06:00", "21:00"] },
    { day: "Wednesday", hours: ["06:00", "21:00"] },
    { day: "Thursday", hours: ["06:00", "21:00"] },
    { day: "Friday", hours: ["06:00", "21:00"] },
    { day: "Saturday", hours: ["07:00", "22:00"] },
    { day: "Sunday", hours: ["07:00", "20:00"] },
  ]);
  const apiKey = "AIzaSyCDZoRf-BZL2yR_ZyXpzht_a63hMgLCTis";
  const router = useRouter();

  const isSaveDisabled = !(
    selectedImage &&
    name &&
    address &&
    city &&
    selectedState &&
    courts.length > 0 &&
    employees.length > 0 &&
    location
  );

  const fullAddress = `${address}, ${city}, ${selectedState}`.trim();

  const handleToggleCourtStatus = (courtId: string) => {
    setCourts((prev) =>
      prev.map((court) =>
        court.id === courtId
          ? { ...court, status: court.status === "Active" ? "Inactive" : "Active" }
          : court
      )
    );
  };

  const handleAddCourt = (newCourt: Court) => {
    setCourts((prev) => [...prev, newCourt]);
  };

  const handleAddEmployees = (newEmployees: { employeeId: string; fullName: string; isActive: boolean }[]) => {
    const mappedEmployees = newEmployees.map((emp) => ({
      id: emp.employeeId,
      name: emp.fullName,
      image: UserProfile2.src,
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
      if (selectedImage) URL.revokeObjectURL(selectedImage);
      const imageUrl = URL.createObjectURL(file);
      setSelectedImage(imageUrl);
    }
  };

  const handleGameChange = (selectedOptions) => {
    const selectedGames = selectedOptions ? selectedOptions.map((option) => option.value) : [];
    setGamesAvailable(selectedGames);
  };

  const handleTimeChange = (day: string, index: number, value: string) => {
    setOpeningHours((prev) =>
      prev.map((entry) =>
        entry.day === day
          ? { ...entry, hours: entry.hours.map((time, i) => (i === index ? value : time)) }
          : entry
      )
    );
  };

  const handleSave = async () => {
    const payload = {
      name,
      address,
      city,
      state: selectedState,
      image: selectedImage || "https://example.com/venue-image.jpg",
      gamesAvailable,
      facilities: [
        ...option.map((opt) => ({
          name: opt.label,
          isActive: selectedFacilities.includes(opt.id),
        })),
      ],
      courts: courts.map((court) => ({
        name: court.name,
        isActive: court.status === "Active",
        games: court.game,
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
    };
    console.log("payload", payload);

    startTransition(async () => {
      try {
        const response = await createVenue("/admin/create-venue", payload);
        if (response?.status === 200 || response?.status === 201) {
          toast.success("Venue created successfully");
          if (selectedImage) {
            URL.revokeObjectURL(selectedImage);
            setSelectedImage(null);
          }
          router.push("/admin/venue");
        } else {
          toast.error("Failed to create employee");
        }
      } catch (error) {
        toast.error("Something went wrong");
      }
    });
  };

  useEffect(() => {
    return () => {
      if (selectedImage) URL.revokeObjectURL(selectedImage);
    };
  }, [selectedImage]);

  return (
    <main className="">
      <h1 className="text-2xl md:text-3xl font-semibold text-[#10375c] mb-6">Add New Venue</h1>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Left Side */}
        <div className="w-full lg:w-2/5 bg-white rounded-2xl p-4 shadow-md">
          <div className="relative h-64 w-full bg-[#e5e5e5] rounded-xl flex items-center justify-center mb-6">
            {selectedImage ? (
              <Image src={selectedImage} alt="Uploaded Venue Image" fill className="object-cover rounded-xl" />
            ) : (
              <span className="text-black/60 text-sm">No Image Uploaded</span>
            )}
            <label className="absolute bottom-2 right-2 bg-white rounded-full px-2 py-1 flex items-center gap-2 cursor-pointer shadow-md">
              <Edit1 />
              <span className="text-sm font-medium">Change Image</span>
              <input type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
            </label>
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-xs font-medium text-[#1b2229]">Name of venue</label>
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
                <label className="text-xs font-medium text-[#1b2229]">Address</label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full mt-2 p-3 bg-white rounded-full text-xs border border-gray-300"
                  placeholder="Enter Address"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-[#1b2229]">City</label>
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
              <div className="relative">
                <label className="text-xs font-medium text-[#1b2229] block mb-2">State</label>
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
                  <div className="absolute top-full left-0 w-full mt-2 bg-white rounded-xl shadow-lg p-4 max-h-60 overflow-y-auto overflow-custom z-50">
                    {states.map((state) => (
                      <label key={state} className="flex gap-2 cursor-pointer text-xs py-1">
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
              <div>
                <label className="text-xs font-medium text-[#1b2229] block mb-2">Location</label>
                <button
                  onClick={() => setMapOpen(true)}
                  className="w-full p-3 bg-white rounded-full text-xs border border-gray-300 flex items-center justify-between"
                >
                  <span>{location ? `Lat: ${location.lat.toFixed(4)}, Lng: ${location.lng.toFixed(4)}` : "Select a location"}</span>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="h-[69.41px]">
                <div className="text-[#1B2229] mb-[8px] text-xs font-medium">Games Available</div>
                <Select
                  isMulti
                  options={gamesAvailableOptions}
                  value={gamesAvailableOptions.filter((option) => gamesAvailable.includes(option.value))}
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

              <div className="relative">
                <label className="text-xs font-medium text-[#1b2229] block mb-2">Status</label>
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
                      <label key={status} className="flex gap-2 cursor-pointer text-xs py-1">
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

            <button
              onClick={handleSave}
              className={`w-full p-3 rounded-full text-white text-sm font-medium ${
                isSaveDisabled ? "bg-gray-400 cursor-not-allowed" : "bg-[#10375c]"
              }`}
              disabled={isSaveDisabled}
            >
              Save
            </button>
          </div>
        </div>

        {/* Right Side */}
        <div className="w-full lg:w-3/5 space-y-6">
          <div className="bg-[#f2f2f4] rounded-2xl p-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
              <h3 className="text-2xl font-semibold text-[#10375c] mb-4 sm:mb-0">Courts</h3>
              <button
                onClick={() => setModalOpen(true)}
                className="flex items-center gap-2 px-5 py-2 bg-[#1b2229] rounded-full text-white text-sm"
              >
                <Add /> Add A New Court
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {courts.map((court) => (
                <div key={court.id} className="bg-white p-3 rounded-xl space-y-3">
                  <div className="flex gap-3">
                    <Image
                      src={court.image || Court}
                      alt={`${court.name} Image`}
                      width={80}
                      height={80}
                      className="object-cover rounded"
                    />
                    <div className="flex-1">
                      <h4 className="text-lg font-semibold text-[#1b2229]">{court.name}</h4>
                      <p className="text-xs text-[#1b2229] mt-1">Game: {court.game}</p>
                      <div className="mt-2">
                        <label className="flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={court.status === "Active"}
                            onChange={() => handleToggleCourtStatus(court.id)}
                            className="hidden"
                          />
                          <span
                            className={`w-10 h-5 ${
                              court.status === "Active" ? "bg-[#1b2229]" : "bg-[#ccc]"
                            } rounded-full relative transition-colors duration-300`}
                          >
                            <span
                              className={`w-4 h-4 bg-white rounded-full absolute top-0.5 ${
                                court.status === "Active" ? "left-5" : "left-0.5"
                              } transition-transform duration-300`}
                            ></span>
                          </span>
                        </label>
                        <p
                          className={`text-[10px] font-medium mt-1 ${
                            court.status === "Active" ? "text-[#1b2229]" : "text-[#ff0004]"
                          }`}
                        >
                          {court.status}
                        </p>
                      </div>
                    </div>
                  </div>
                  <button className="w-full py-2 bg-[#1C2329] text-white text-[10px] rounded-full">Edit</button>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-[#f2f2f4] rounded-2xl p-4">
              <h2 className="text-xl font-medium text-[#172554] mb-4">Select Facilities</h2>
              <div className="space-y-2 max-h-48 overflow-y-auto overflow-custom">
                {option.map((opt) => (
                  <div
                    key={opt.id}
                    className="flex justify-between items-center py-1 cursor-pointer"
                    onClick={() => {
                      setSelectedFacilities((prev) =>
                        prev.includes(opt.id) ? prev.filter((item) => item !== opt.id) : [...prev, opt.id]
                      );
                    }}
                  >
                    <span className="text-xs font-medium text-[#1b2229]">{opt.label}</span>
                    <Image
                      src={selectedFacilities.includes(opt.id) ? "/orange.svg" : "/gray.svg"}
                      alt={selectedFacilities.includes(opt.id) ? "Selected" : "Not Selected"}
                      width={16}
                      height={16}
                    />
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-[#f2f2f4] rounded-2xl p-4">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
                <h3 className="text-xl font-medium text-[#10375c] mb-4 sm:mb-0">Employees Associated</h3>
                <button
                  onClick={() => setEmployeeModalOpen(true)}
                  className="flex items-center gap-2 px-3 py-1 bg-[#1b2229] rounded-full text-white text-[10px]"
                >
                  Add Employee
                </button>
              </div>

              <div className="space-y-2 max-h-48 overflow-y-auto overflow-custom">
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
                          <span className="text-xs font-medium text-[#1b2229]">{employee.name}</span>
                          <p
                            className={`text-[10px] font-medium ${
                              employee.isActive ? "text-[#1b2229]" : "text-[#ff0004]"
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

          <div className="bg-[#f2f2f4] rounded-2xl p-4">
            <h2 className="text-xl font-medium text-[#172554] mb-4">Timings</h2>
            <div className="grid grid-cols-3 gap-4 font-semibold text-[#10375C] text-sm border-b border-gray-300 pb-2">
              <div>Days</div>
              <div>Opening Hours</div>
              <div>Closing Hours</div>
            </div>
            <div className="space-y-2 max-h-48 overflow-y-auto overflow-custom">
              {openingHours.map((entry) => (
                <div key={entry.day} className="grid grid-cols-3 gap-4 items-center text-sm">
                  <div className="text-[#10375C]">{entry.day}</div>
                  <input
                    type="time"
                    value={entry.hours[0]}
                    onChange={(e) => handleTimeChange(entry.day, 0, e.target.value)}
                    className="p-2 bg-white rounded-full text-xs border border-gray-300 w-full"
                  />
                  <input
                    type="time"
                    value={entry.hours[1]}
                    onChange={(e) => handleTimeChange(entry.day, 1, e.target.value)}
                    className="p-2 bg-white rounded-full text-xs border border-gray-300 w-full"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <CourtManagement open={modalOpen} onClose={() => setModalOpen(false)} onSave={handleAddCourt} />
      <AddEmployeeModal
        open={employeeModalOpen}
        setOpen={setEmployeeModalOpen}
        onAddEmployees={handleAddEmployees}
      />
      {mapOpen && (
        <Modal open={mapOpen}>
          <div className="bg-white rounded-lg p-2 w-full h-[90%]">
            <div className="w-full flex justify-between">
              <h2 className="text-lg font-semibold mb-2">Select Location</h2>
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
              initialAddress={fullAddress}
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