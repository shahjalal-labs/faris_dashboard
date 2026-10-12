"use client";

import { useEffect, useMemo, useState } from "react";
import { Camera, ChevronDown, CircleAlert, Edit } from "lucide-react";
import { IoClose } from "react-icons/io5";
import { toast } from "sonner";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import {
  useOfferDetailsForEditQuery,
  useUpdateOfferMutation,
} from "@/redux/api/offerApi";
import { useGetMyProfileQuery } from "@/redux/api/authApi";

type EditOfferModalProps = {
  id: string;
};

const formatDateForInput = (value?: string | null) => {
  if (!value) return "";

  if (value.includes("-")) return value;

  const parts = value.split("/");
  if (parts.length !== 3) return "";

  const [day, month, year] = parts;
  if (!day || !month || !year) return "";

  return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
};

const formatDateForPayload = (value: string) => {
  return value;
};

const formatTimeForInput = (value?: string | null) => {
  if (!value) return "10:00";

  const [hours = "10", minutes = "00"] = value.split(":");
  return `${hours.padStart(2, "0")}:${minutes.padStart(2, "0")}`;
};

const ServiceCalendar = ({
  selectedDates,
  onChange,
}: {
  selectedDates: string[];
  onChange: (dates: string[]) => void;
}) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const today = useMemo(() => {
    const date = new Date();
    date.setHours(0, 0, 0, 0);
    return date;
  }, []);

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
      onChange(selectedDates.filter((date) => date !== dateStr));
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
            className="rounded border px-2 py-1 text-sm hover:bg-gray-50 dark:hover:bg-slate-800 dark:bg-slate-800"
          >
            ←
          </button>
          <button
            type="button"
            onClick={handleNextMonth}
            className="rounded border px-2 py-1 text-sm hover:bg-gray-50 dark:hover:bg-slate-800 dark:bg-slate-800"
          >
            →
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-2 text-center">
        {days.map((day) => (
          <div
            key={day}
            className="py-1 text-xs font-semibold text-gray-600 dark:text-slate-400"
          >
            {day}
          </div>
        ))}

        {Array.from({ length: firstDay }).map((_, index) => (
          <div key={`empty-${index}`} />
        ))}

        {Array.from({ length: daysInMonth }).map((_, index) => {
          const day = index + 1;
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
              className={`rounded py-2 text-sm font-medium ${
                isPastDate
                  ? "cursor-not-allowed bg-gray-100 text-gray-300"
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
      <div className="flex items-center gap-2">
        <input
          type="number"
          min="0"
          max="23"
          placeholder="HH"
          value={value.split(":")[0] || ""}
          onChange={(event) => {
            const minutes = value.split(":")[1] || "00";
            onChange(`${event.target.value.padStart(2, "0")}:${minutes}`);
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
          onChange={(event) => {
            const hours = value.split(":")[0] || "00";
            onChange(`${hours}:${event.target.value.padStart(2, "0")}`);
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

const EditOfferModal = ({ id }: EditOfferModalProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [updateOffer, { isLoading: isUpdating }] = useUpdateOfferMutation();
  const { data, isLoading } = useOfferDetailsForEditQuery(id, {
    skip: !isOpen || !id,
  });

  const { data: profile } = useGetMyProfileQuery("");
  const editable = Boolean(profile?.result?.editing);

  const offer = data?.result;
  const [serviceName, setServiceName] = useState("");
  const [serviceCategory, setServiceCategory] = useState("");
  const [servicePrice, setServicePrice] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [useWorkingHours, setUseWorkingHours] = useState(true);
  const [workingDays, setWorkingDays] = useState<string[]>([]);
  const [useServiceHours, setUseServiceHours] = useState(true);
  const [startTime, setStartTime] = useState("10:00");
  const [endTime, setEndTime] = useState("18:00");
  const [mediaFile, setMediaFile] = useState<File | null>(null);
  const [mediaPreview, setMediaPreview] = useState("");
  const [totalAvailableSlots, setTotalAvailableSlots] = useState("");
  const [maxBookingsPerHour, setMaxBookingsPerHour] = useState("");

  useEffect(() => {
    if (!offer) return;

    setServiceName(offer.serviceName || "");
    setServiceCategory(offer.serviceCategory || "");
    setServicePrice(
      typeof offer.servicePrice === "number" ? String(offer.servicePrice) : "",
    );
    setDescription(offer.description || "");
    setLocation(offer.location || "");
    setStartDate(formatDateForInput(offer.startDate));
    setEndDate(formatDateForInput(offer.endDate));
    setUseWorkingHours(Boolean(offer.useWorkingHours));
    setUseServiceHours(Boolean(offer.useServiceHours));
    setWorkingDays(
      Array.isArray(offer.workingDays)
        ? offer.workingDays.map((date: string) => formatDateForInput(date))
        : [],
    );
    setStartTime(formatTimeForInput(offer.startTime));
    setEndTime(formatTimeForInput(offer.endTime));
    setMediaFile(null);
    setMediaPreview(offer.mediaUrl || "");
    setTotalAvailableSlots(
      typeof offer.totalAvailableSlots === "number"
        ? String(offer.totalAvailableSlots)
        : "",
    );
    setMaxBookingsPerHour(
      typeof offer.maxBookingsPerHour === "number"
        ? String(offer.maxBookingsPerHour)
        : "",
    );
  }, [offer]);

  const handleMediaChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;
    if (!file) return;

    setMediaFile(file);
    setMediaPreview(URL.createObjectURL(file));
  };

  const handleMediaRemove = () => {
    setMediaFile(null);
    setMediaPreview(offer?.mediaUrl || "");
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!id) {
      toast.error("Offer id is missing");
      return;
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (!serviceName.trim()) {
      toast.error("Offer name is required");
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

    if (!totalAvailableSlots) {
      toast.error("Total available slots is required");
      return;
    }

    if (!maxBookingsPerHour) {
      toast.error("Max bookings per hour is required");
      return;
    }

    if (!/^\d*$/.test(totalAvailableSlots)) {
      toast.error("Total available slots must be a non-negative whole number");
      return;
    }

    if (!/^\d*$/.test(maxBookingsPerHour)) {
      toast.error("Max bookings per hour must be a non-negative whole number");
      return;
    }

    if (parseInt(maxBookingsPerHour, 10) > parseInt(totalAvailableSlots, 10)) {
      toast.error("Max bookings per hour cannot be greater than total available slots");
      return;
    }

    if (!description.trim()) {
      toast.error("Description is required");
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

    if (!useWorkingHours && workingDays.length === 0) {
      toast.error("At least one working day is required");
      return;
    }

    if (!useServiceHours && (!startTime || !endTime)) {
      toast.error("Start and end times are required");
      return;
    }

    const bodyData: Record<string, unknown> = {
      offerId: id,
      serviceName,
      serviceCategory,
      servicePrice: parseFloat(servicePrice),
      description,
      location,
      startDate: formatDateForPayload(startDate),
      endDate: formatDateForPayload(endDate),
      totalAvailableSlots: parseInt(totalAvailableSlots, 10),
      maxBookingsPerHour: parseInt(maxBookingsPerHour, 10),
      useWorkingHours,
      useServiceHours,
    };

    if (!useWorkingHours) {
      bodyData.workingDays = workingDays.map(formatDateForPayload);
    }

    if (!useServiceHours) {
      bodyData.startTime = startTime;
      bodyData.endTime = endTime;
    }

    const formData = new FormData();
    formData.append("bodyData", JSON.stringify(bodyData));

    if (mediaFile) {
      formData.append("serviceImage", mediaFile);
    }

    try {
      const response = await updateOffer(formData).unwrap();

      if (response.success) {
        toast.success(response?.message || "Offer updated successfully");
      }

      setIsOpen(false);
    } catch (error) {
      console.error("Offer update failed", error);
      toast.error("An error occurred while updating the offer");
    }
  };

  return (
    <div>
      <button
        disabled={!editable}
        onClick={() => setIsOpen(true)}
        className="rounded-md disabled:cursor-not-allowed py-2 text-gray-500 cursor-pointer text-sm"
        aria-label="Open edit offer modal"
      >
        <Edit />
      </button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent
          className="max-w-[900px] rounded-xl bg-white dark:bg-slate-900 p-0 shadow-lg"
          showCloseButton={false}
        >
          <div className="flex items-center justify-between border-b border-gray-100 dark:border-slate-800 px-6 py-4">
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-slate-100">
                Edit Offer
              </h2>
              <CircleAlert className="h-4 w-4 text-gray-500" />
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-gray-500 hover:text-gray-700 dark:text-slate-300"
              aria-label="Close edit offer modal"
            >
              <IoClose size={24} />
            </button>
          </div>

          <form
            onSubmit={handleSubmit}
            className="max-h-[65vh] overflow-y-auto px-6 py-5"
          >
            {isLoading ? (
              <div className="py-20 text-center text-sm text-gray-500">
                Loading offer details...
              </div>
            ) : (
              <div className="space-y-6">
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
                            onChange={handleMediaChange}
                            className="hidden"
                          />
                        </label>
                        <button
                          type="button"
                          onClick={handleMediaRemove}
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
                            onChange={handleMediaChange}
                            className="hidden"
                          />
                        </label>
                      </div>
                    </div>
                  )}
                </div>

                <div>
                  <h3 className="mb-4 flex items-center border-b border-gray-100 dark:border-slate-800 pb-3 text-lg font-semibold text-gray-900 dark:text-slate-100">
                    Input Area
                  </h3>

                  <div className="space-y-4">
                    <div>
                      <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-slate-300">
                        Offer Name
                      </label>
                      <input
                        value={serviceName}
                        onChange={(event) => setServiceName(event.target.value)}
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
                            onChange={(event) =>
                              setServiceCategory(event.target.value)
                            }
                            className="w-full appearance-none rounded-lg border border-gray-200 dark:border-slate-700 px-3 py-2 pr-10 outline-none focus:border-bprimary"
                            required
                          >
                            <option value="">Select category</option>
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
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
                          value={servicePrice}
                          onChange={(event) =>
                            setServicePrice(event.target.value)
                          }
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
                          onChange={(event) => {
                            const value = event.target.value;
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
                          onChange={(event) => {
                            const value = event.target.value;
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
                          onChange={(event) => setLocation(event.target.value)}
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
                          onChange={(event) => setStartDate(event.target.value)}
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
                          onChange={(event) => setEndDate(event.target.value)}
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
                        onChange={(event) => setDescription(event.target.value)}
                        rows={4}
                        className="w-full rounded-lg border border-gray-200 dark:border-slate-700 px-3 py-2 outline-none focus:border-bprimary"
                        required
                      />
                    </div>
                  </div>
                </div>

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
            )}

            <div className="mt-6 flex justify-end">
              <button
                type="submit"
                disabled={isUpdating}
                className="rounded-full bg-bprimary px-8 py-2 text-sm font-medium text-white"
              >
                {isUpdating ? "Updating..." : "Update Offer"}
              </button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default EditOfferModal;
