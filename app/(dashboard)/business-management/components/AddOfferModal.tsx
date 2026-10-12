"use client";

import { useState } from "react";
import { Camera, ChevronDown, CircleAlert } from "lucide-react";
import { IoClose } from "react-icons/io5";
import { toast } from "sonner";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useAddOfferMutation } from "@/redux/api/offerApi";
import { useGetMyProfileQuery } from "@/redux/api/authApi";

interface OfferModalProps {
  providerId: string;
  onSuccess?: () => void;
}

const ServiceCalendar = ({
  selectedDates,
  onChange,
}: {
  selectedDates: string[];
  onChange: (dates: string[]) => void;
}) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const daysInMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth() + 1,
    0,
  ).getDate();
  const firstDay = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    1,
  ).getDay();

  const handleDateClick = (day: number) => {
    const dateStr = `${currentDate.getFullYear()}-${String(
      currentDate.getMonth() + 1,
    ).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    const dateObj = new Date(dateStr);

    if (dateObj < today) return;

    if (selectedDates.includes(dateStr)) {
      onChange(selectedDates.filter((d) => d !== dateStr));
    } else {
      onChange([...selectedDates, dateStr]);
    }
  };

  const handlePrevMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() - 1),
    );
  };

  const handleNextMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() + 1),
    );
  };

  const monthName = currentDate.toLocaleString("en-US", {
    month: "long",
    year: "numeric",
  });
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium">{monthName}</h3>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={handlePrevMonth}
            className="px-2 py-1 text-sm border rounded hover:bg-gray-50 dark:hover:bg-slate-800 dark:bg-slate-800"
          >
            ←
          </button>
          <button
            type="button"
            onClick={handleNextMonth}
            className="px-2 py-1 text-sm border rounded hover:bg-gray-50 dark:hover:bg-slate-800 dark:bg-slate-800"
          >
            →
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-2 text-center">
        {days.map((day) => (
          <div
            key={day}
            className="text-xs font-semibold text-gray-600 dark:text-slate-400 py-1"
          >
            {day}
          </div>
        ))}

        {Array.from({ length: firstDay }).map((_, i) => (
          <div key={`empty-${i}`} />
        ))}

        {Array.from({ length: daysInMonth }).map((_, i) => {
          const day = i + 1;
          const dateStr = `${currentDate.getFullYear()}-${String(
            currentDate.getMonth() + 1,
          ).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
          const dateObj = new Date(dateStr);
          const isPastDate = dateObj < today;
          const isSelected = selectedDates.includes(dateStr);

          return (
            <button
              key={day}
              type="button"
              disabled={isPastDate}
              onClick={() => handleDateClick(day)}
              className={`py-2 rounded text-sm font-medium ${
                isPastDate
                  ? "bg-gray-100 text-gray-300 cursor-not-allowed"
                  : isSelected
                    ? "bg-bprimary text-white"
                    : "bg-gray-100 text-gray-700 dark:text-slate-300 hover:bg-gray-200"
              }`}
            >
              {day}
            </button>
          );
        })}
      </div>
    </div>
  );
};

const TimeInput = ({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) => {
  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700 dark:text-slate-300">
        {label}
      </label>
      <div className="flex gap-2 items-center">
        <input
          type="number"
          min="0"
          max="23"
          placeholder="HH"
          value={value.split(":")[0] || ""}
          onChange={(e) => {
            const minutes = value.split(":")[1] || "00";
            onChange(`${e.target.value.padStart(2, "0")}:${minutes}`);
          }}
          className="w-16 rounded-lg border border-gray-200 dark:border-slate-700 px-2 py-2 text-center outline-none focus:border-bprimary"
        />
        <span className="text-gray-600 dark:text-slate-400">:</span>
        <input
          type="number"
          min="0"
          max="59"
          placeholder="MM"
          value={value.split(":")[1] || ""}
          onChange={(e) => {
            const hours = value.split(":")[0] || "00";
            onChange(`${hours}:${e.target.value.padStart(2, "0")}`);
          }}
          className="w-16 rounded-lg border border-gray-200 dark:border-slate-700 px-2 py-2 text-center outline-none focus:border-bprimary"
        />
        <select className="rounded-lg border border-gray-200 dark:border-slate-700 px-2 py-2 outline-none focus:border-bprimary">
          <option>AM</option>
          <option>PM</option>
        </select>
      </div>
    </div>
  );
};

const AddOfferModal = ({ providerId }: OfferModalProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [addOffer, { isLoading }] = useAddOfferMutation();
  const isNonNegativeInteger = (value: string) => /^\d+$/.test(value);
  const { data: profile } = useGetMyProfileQuery("");
  const editable = Boolean(profile?.result?.editing);

  // Basic info
  const [serviceName, setServiceName] = useState("");
  const [serviceCategory, setServiceCategory] = useState("");
  const [servicePrice, setServicePrice] = useState("");
  const [totalAvailableSlots, setTotalAvailableSlots] = useState("");
  const [maxBookingsPerHour, setMaxBookingsPerHour] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");

  // Image
  const [mediaUrl, setMediaUrl] = useState<File | string | null>(null);
  const [mediaPreview, setMediaPreview] = useState("");

  // Date range
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  // Working hours/days
  const [useWorkingHours, setUseWorkingHours] = useState(true);
  const [workingDays, setWorkingDays] = useState<string[]>([]);

  // Service hours/times
  const [useServiceHours, setUseServiceHours] = useState(true);
  const [startTime, setStartTime] = useState("10:00");
  const [endTime, setEndTime] = useState("18:00");

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setMediaUrl(file);
    setMediaPreview(URL.createObjectURL(file));
  };

  const handleImageRemove = () => {
    setMediaUrl(null);
    setMediaPreview("");
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Validation
    if (!serviceName.trim()) {
      toast.error("Service name is required");
      return;
    }

    if (!serviceCategory) {
      toast.error("Service category is required");
      return;
    }

    if (!servicePrice) {
      toast.error("Service price is required");
      return;
    }

    if (!isNonNegativeInteger(servicePrice)) {
      toast.error("Offer price must be a non-negative whole number");
      return;
    }

    if (!location) {
      toast.error("Location is required");
      return;
    }

    // New fields validation
    if (!totalAvailableSlots) {
      toast.error("Total available slots is required");
      return;
    }

    if (!maxBookingsPerHour) {
      toast.error("Max bookings per hour is required");
      return;
    }

    if (!isNonNegativeInteger(totalAvailableSlots)) {
      toast.error("Total available slots must be a non-negative whole number");
      return;
    }

    if (!isNonNegativeInteger(maxBookingsPerHour)) {
      toast.error("Max bookings per hour must be a non-negative whole number");
      return;
    }

    if (parseInt(maxBookingsPerHour, 10) > parseInt(totalAvailableSlots, 10)) {
      toast.error(
        "Max bookings per hour cannot be greater than total available slots",
      );
      return;
    }

    if (!startDate || !endDate) {
      toast.error("Start date and end date are required");
      return;
    }

    const start = new Date(startDate);
    const end = new Date(endDate);

    if (start < today) {
      toast.error("Start date cannot be in the past");
      return;
    }

    if (end <= start) {
      toast.error("End date must be after start date");
      return;
    }

    // Working hours validation
    if (!useWorkingHours && workingDays.length === 0) {
      toast.error(
        "At least one working day is required when not using working hours",
      );
      return;
    }

    // Service hours validation
    if (!useServiceHours && (!startTime || !endTime)) {
      toast.error(
        "Start and end times are required when not using service hours",
      );
      return;
    }

    if (!mediaUrl) {
      toast.error("Offer image is required");
      return;
    }

    // Build payload to match backend validation rules
    const bodyData: Record<string, unknown> = {
      providerId,
      serviceName,
      serviceCategory,
      servicePrice: parseInt(servicePrice, 10),
      totalAvailableSlots: parseInt(totalAvailableSlots, 10),
      maxBookingsPerHour: parseInt(maxBookingsPerHour, 10),
      description,
      location,
      startDate,
      endDate,
      useWorkingHours,
      useServiceHours,
    };

    if (!useWorkingHours) {
      bodyData.workingDays = workingDays;
    }

    if (!useServiceHours) {
      bodyData.startTime = startTime;
      bodyData.endTime = endTime;
    }

    const formData = new FormData();
    formData.append("bodyData", JSON.stringify(bodyData));

    if (mediaUrl instanceof File) {
      formData.append("serviceImage", mediaUrl);
    }

    // Submit
    try {
      const response = await addOffer(formData).unwrap();
      
      if (response?.success) {
        toast.success("Offer created successfully");
        setIsOpen(false);
        // Reset form
        setServiceName("");
        setServiceCategory("");
        setServicePrice("");
        setDescription("");
        setLocation("");
        setMediaUrl(null);
        setMediaPreview("");
        setStartDate("");
        setEndDate("");
        setWorkingDays([]);
        setStartTime("10:00");
        setEndTime("18:00");
      } else {
        toast.error(response?.message || "Failed to create offer");
      }
    } catch (error) {
      console.error("Offer creation failed", error);
      toast.error("An error occurred while creating the offer");
    }
  };

  return (
    <div>
      <button
        onClick={() => setIsOpen(true)}
        disabled={!editable}
        className="rounded-md bg-bprimary disabled:cursor-not-allowed px-4 py-2 text-sm font-medium text-white"
      >
        Add Offer
      </button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent
          className="max-w-[900px] rounded-xl bg-white dark:bg-slate-900 p-0 shadow-lg"
          showCloseButton={false}
        >
          <div className="flex items-center justify-between border-b border-gray-100 dark:border-slate-800 px-6 py-4">
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-slate-100">
                Add Offer
              </h2>
              <CircleAlert className="h-4 w-4 text-gray-500" />
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-gray-500 hover:text-gray-700 dark:text-slate-300"
              aria-label="Close add offer modal"
            >
              <IoClose size={24} />
            </button>
          </div>

          <form
            onSubmit={handleSubmit}
            className="max-h-[82vh] overflow-y-auto px-6 py-5"
          >
            <div className="space-y-6">
              {/* Image Upload */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-slate-300">
                  Upload Photo
                </label>
                {mediaPreview ? (
                  <div className="flex items-center gap-4 rounded-xl border border-dashed border-sky-300 bg-sky-50/40 px-4 py-5">
                    <img
                      src={mediaPreview}
                      alt="Offer"
                      className="h-20 w-20 rounded-lg border border-gray-200 dark:border-slate-700 object-cover"
                    />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-800">
                        Selected image
                      </p>
                      <p className="text-xs text-gray-500">
                        Replace it with a new file if needed
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <label className="cursor-pointer rounded-full bg-bprimary px-4 py-2 text-sm font-medium text-white">
                        Change
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageChange}
                          className="hidden"
                        />
                      </label>
                      <button
                        type="button"
                        onClick={handleImageRemove}
                        className="rounded-full bg-red-500 px-4 py-2 text-sm font-medium text-white hover:bg-red-600"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="rounded-xl border border-dashed border-sky-300 bg-sky-50/40 px-4 py-5">
                    <div className="flex flex-col items-center text-center">
                      <Camera className="mb-2 h-7 w-7 text-gray-700 dark:text-slate-300" />
                      <p className="text-sm font-medium text-gray-800">
                        Upload photo
                      </p>
                      <p className="mt-1 text-xs text-gray-500">
                        Supports JPG, PNG, WebP
                      </p>
                      <label className="mt-4 cursor-pointer rounded-full bg-bprimary px-4 py-2 text-sm font-medium text-white">
                        Choose file
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageChange}
                          className="hidden"
                        />
                      </label>
                    </div>
                  </div>
                )}
              </div>

              {/* Basic Info */}
              <div>
                <div className="space-y-4">
                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-slate-300">
                      Offer Name
                    </label>
                    <input
                      value={serviceName}
                      onChange={(e) => setServiceName(e.target.value)}
                      placeholder="Male Services"
                      className="w-full rounded-lg border border-gray-200 dark:border-slate-700 px-3 py-2 outline-none focus:border-bprimary"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div>
                      <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-slate-300">
                        Service Category
                      </label>
                      <div className="relative">
                        <select
                          value={serviceCategory}
                          onChange={(e) => setServiceCategory(e.target.value)}
                          className="w-full appearance-none rounded-lg border border-gray-200 dark:border-slate-700 px-3 py-2 pr-10 outline-none focus:border-bprimary"
                          required
                        >
                          <option value="">Select category</option>
                          <option value="Male">Male Services</option>
                          <option value="Female">Female Services</option>
                          {/* <option value="Both">Both</option> */}
                        </select>
                        <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
                      </div>
                    </div>

                    <div>
                      <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-slate-300">
                        Offer Price (SAR)
                      </label>
                      <input
                        type="number"
                        min="0"
                        step="1"
                        value={servicePrice}
                        onChange={(e) => {
                          const value = e.target.value;
                          if (/^\d*$/.test(value)) {
                            setServicePrice(value);
                          }
                        }}
                        placeholder="50"
                        className="w-full rounded-lg border border-gray-200 dark:border-slate-700 px-3 py-2 outline-none focus:border-bprimary"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div>
                      <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-slate-300">
                        Total Available Slots
                      </label>
                      <input
                        type="number"
                        min="0"
                        step="1"
                        value={totalAvailableSlots}
                        onChange={(e) => {
                          const value = e.target.value;
                          if (/^\d*$/.test(value)) {
                            setTotalAvailableSlots(value);
                          }
                        }}
                        placeholder="10"
                        className="w-full rounded-lg border border-gray-200 dark:border-slate-700 px-3 py-2 outline-none focus:border-bprimary"
                        required
                      />
                    </div>

                    <div>
                      <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-slate-300">
                        Max Bookings Per Hour
                      </label>
                      <input
                        type="number"
                        min="0"
                        step="1"
                        value={maxBookingsPerHour}
                        onChange={(e) => {
                          const value = e.target.value;
                          if (/^\d*$/.test(value)) {
                            setMaxBookingsPerHour(value);
                          }
                        }}
                        placeholder="2"
                        className="w-full rounded-lg border border-gray-200 dark:border-slate-700 px-3 py-2 outline-none focus:border-bprimary"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-slate-300">
                      Location
                    </label>
                    <div className="relative">
                      <select
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        className="w-full appearance-none rounded-lg border border-gray-200 dark:border-slate-700 px-3 py-2 pr-10 outline-none focus:border-bprimary"
                        required
                      >
                        <option value="">Select location</option>
                        <option value="Online">In-center</option>
                        <option value="Home">Out-of-center</option>
                      </select>
                      <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div>
                      <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-slate-300">
                        Start Date
                      </label>
                      <input
                        type="date"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        min={new Date().toISOString().split("T")[0]}
                        className="w-full rounded-lg border border-gray-200 dark:border-slate-700 px-3 py-2 outline-none focus:border-bprimary"
                        required
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-slate-300">
                        End Date
                      </label>
                      <input
                        type="date"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        min={
                          startDate || new Date().toISOString().split("T")[0]
                        }
                        className="w-full rounded-lg border border-gray-200 dark:border-slate-700 px-3 py-2 outline-none focus:border-bprimary"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-slate-300">
                      Description
                    </label>
                    <textarea
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Type offer description"
                      rows={4}
                      className="w-full rounded-lg border border-gray-200 dark:border-slate-700 px-3 py-2 outline-none focus:border-bprimary"
                    />
                  </div>
                </div>
              </div>

              {/* Working Hours/Days Section */}
              <div className="space-y-4 rounded-lg border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800 p-4">
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-slate-300">
                    Apply Offer on All Working Days?
                  </label>
                  <div className="flex gap-4">
                    <label className="flex items-center gap-2">
                      <input
                        type="radio"
                        checked={useWorkingHours}
                        onChange={() => setUseWorkingHours(true)}
                        className="cursor-pointer"
                      />
                      <span className="text-sm">Yes</span>
                    </label>
                    <label className="flex items-center gap-2">
                      <input
                        type="radio"
                        checked={!useWorkingHours}
                        onChange={() => setUseWorkingHours(false)}
                        className="cursor-pointer"
                      />
                      <span className="text-sm">No</span>
                    </label>
                  </div>
                </div>

                {!useWorkingHours && (
                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-slate-300">
                      Offer Dates
                    </label>
                    <ServiceCalendar
                      selectedDates={workingDays}
                      onChange={setWorkingDays}
                    />
                  </div>
                )}
              </div>

              {/* Service Hours Section */}
              <div className="space-y-4 rounded-lg border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800 p-4">
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-slate-300">
                    Apply Offer on Working Hours?
                  </label>
                  <div className="flex gap-4">
                    <label className="flex items-center gap-2">
                      <input
                        type="radio"
                        checked={useServiceHours}
                        onChange={() => setUseServiceHours(true)}
                        className="cursor-pointer"
                      />
                      <span className="text-sm">Yes</span>
                    </label>
                    <label className="flex items-center gap-2">
                      <input
                        type="radio"
                        checked={!useServiceHours}
                        onChange={() => setUseServiceHours(false)}
                        className="cursor-pointer"
                      />
                      <span className="text-sm">No</span>
                    </label>
                  </div>
                </div>

                {!useServiceHours && (
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <TimeInput
                      label="Start Time"
                      value={startTime}
                      onChange={setStartTime}
                    />
                    <TimeInput
                      label="End Time"
                      value={endTime}
                      onChange={setEndTime}
                    />
                  </div>
                )}
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                type="submit"
                disabled={isLoading}
                className="rounded-full bg-bprimary px-8 py-2 text-sm font-medium text-white disabled:opacity-60"
              >
                {isLoading ? "Creating..." : "Done"}
              </button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AddOfferModal;
