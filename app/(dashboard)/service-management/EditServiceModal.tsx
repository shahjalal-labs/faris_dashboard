"use client";

import { useEffect, useMemo, useState } from "react";
import { Camera, ChevronDown, CircleAlert, Edit, X } from "lucide-react";
import { IoClose } from "react-icons/io5";
import { toast } from "sonner";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import {
  useServiceDetailsForEditQuery,
  useUpdateServiceMutation,
} from "@/redux/api/serviceApi";
import { useGetMyProfileQuery } from "@/redux/api/authApi";

type EditServiceModalProps = {
  id: string;
};

const parseDurationToInput = (duration?: string) => {
  if (!duration) return "1:00";

  const parsed = duration.match(/(\d+)h\s*(\d+)min/i);
  if (parsed) {
    const hours = parsed[1] ?? "1";
    const minutes = parsed[2] ?? "00";
    return `${hours}:${minutes.padStart(2, "0")}`;
  }

  if (duration.includes(":")) {
    const [hours = "1", minutes = "00"] = duration.split(":");
    return `${hours}:${minutes.padStart(2, "0")}`;
  }

  return "1:00";
};

const formatDuration = (value: string) => {
  const [hoursPart = "0", minutesPart = "0"] = value.split(":");
  const hours = Number.parseInt(hoursPart, 10) || 0;
  const minutes = Number.parseInt(minutesPart, 10) || 0;
  return `${hours}h ${String(minutes).padStart(2, "0")}min`;
};

const normalizeDate = (value: string) => {
  if (!value) return "";

  if (value.includes("-")) return value;

  const parts = value.split("/");
  if (parts.length !== 3) return value;

  const [day, month, year] = parts;
  if (!day || !month || !year) return value;

  return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
};

const FileUpload = ({
  label,
  images,
  onChange,
  maxFiles = 1,
}: {
  label: string;
  images: (File | string)[];
  onChange: (files: (File | string)[]) => void;
  maxFiles?: number;
}) => {
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newFiles = Array.from(event.target.files || []);
    if (newFiles.length + images.length > maxFiles) {
      toast.error(`Maximum ${maxFiles} file(s) allowed`);
      return;
    }

    onChange([...images, ...newFiles]);
  };

  const handleRemove = (index: number) => {
    onChange(images.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700 dark:text-slate-300">
        {label}
      </label>

      {images.length > 0 ? (
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
          {images.map((image, index) => (
            <div
              key={index}
              className="relative h-24 w-24 overflow-hidden rounded-lg border border-gray-200 dark:border-slate-700"
            >
              <img
                src={
                  typeof image === "string" ? image : URL.createObjectURL(image)
                }
                alt={`Upload ${index + 1}`}
                className="h-full w-full object-cover"
              />
              <button
                type="button"
                onClick={() => handleRemove(index)}
                className="absolute top-1 right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-white hover:bg-red-600"
              >
                <X size={14} />
              </button>
            </div>
          ))}

          {images.length < maxFiles && (
            <label className="flex h-24 w-24 cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 dark:bg-slate-800 hover:border-bprimary hover:bg-blue-50">
              <Camera className="h-6 w-6 text-gray-400" />
              <p className="mt-1 text-center text-xs text-gray-500">Add</p>
              <input
                type="file"
                accept="image/*"
                onChange={handleChange}
                className="hidden"
              />
            </label>
          )}
        </div>
      ) : (
        <div className="rounded-xl border border-dashed border-sky-300 bg-sky-50/40 px-4 py-5">
          <div className="flex flex-col items-center text-center">
            <Camera className="mb-2 h-7 w-7 text-gray-700 dark:text-slate-300" />
            <p className="text-sm font-medium text-gray-800">Upload photo</p>
            <p className="mt-1 text-xs text-gray-500">
              Supports JPG, PNG, WebP
            </p>
            <label className="mt-4 cursor-pointer rounded-full bg-bprimary px-4 py-2 text-sm font-medium text-white">
              Choose file
              <input
                type="file"
                accept="image/*"
                onChange={handleChange}
                className="hidden"
              />
            </label>
          </div>
        </div>
      )}
    </div>
  );
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

const EditServiceModal = ({ id }: EditServiceModalProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [updateService, { isLoading: isUpdating }] = useUpdateServiceMutation();
  const { data, isLoading } = useServiceDetailsForEditQuery(id, {
    skip: !isOpen || !id,
  });

  const { data: profile } = useGetMyProfileQuery("");
  const editable = Boolean(profile?.result?.editing);

  const service = data?.result;

  const [serviceName, setServiceName] = useState("");
  const [providerName, setProviderName] = useState("");
  const [serviceCategory, setServiceCategory] = useState("");
  const [servicePrice, setServicePrice] = useState("");
  const [totalProvider, setTotalProvider] = useState("");
  const [serviceMode, setServiceMode] = useState("");
  const [images, setImages] = useState<(File | string)[]>([]);
  const [useWorkingHours, setUseWorkingHours] = useState(true);
  const [workingDays, setWorkingDays] = useState<string[]>([]);
  const [useServiceHours, setUseServiceHours] = useState(true);
  const [startTime, setStartTime] = useState("10:00");
  const [endTime, setEndTime] = useState("18:00");
  const [duration, setDuration] = useState("1:00");
  const [description, setDescription] = useState("");
  const [notes, setNotes] = useState("");

  useEffect(() => {
    if (!service) return;

    setServiceName(service.serviceName || "");
    setProviderName(service.providerName || "");
    setServiceCategory(service.serviceCategory || "");
    setServicePrice(
      typeof service.servicePrice === "number"
        ? String(service.servicePrice)
        : "",
    );
    setTotalProvider(
      typeof service.totalProvider === "number"
        ? String(service.totalProvider)
        : "",
    );
    setServiceMode(service.serviceMode || "");

    const existingImages = [
      service.url1,
      service.url2,
      service.url3,
      service.url4,
      service.url5,
    ].filter(Boolean) as string[];
    setImages(existingImages);

    setUseWorkingHours(Boolean(service.useWorkingHours));
    setWorkingDays(
      Array.isArray(service.workingDays)
        ? service.workingDays.map((date: string) => normalizeDate(date))
        : [],
    );
    setUseServiceHours(Boolean(service.useServiceHours));
    setStartTime(service.startTime || "10:00");
    setEndTime(service.endTime || "18:00");
    setDuration(parseDurationToInput(service.duration));
    setDescription(service.description || "");
    setNotes(service.notes || "");
  }, [service]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!id) {
      toast.error("Service id is missing");
      return;
    }

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

    if (!totalProvider) {
      toast.error("Number of service providers is required");
      return;
    }

    if (!serviceMode) {
      toast.error("Service mode is required");
      return;
    }

    const durationMinutes = Number.parseInt(duration.split(":")[1] || "0", 10);
    if (
      Number.isNaN(durationMinutes) ||
      durationMinutes < 1 ||
      durationMinutes > 59
    ) {
      toast.error("Duration minutes must be between 1 and 59");
      return;
    }

    if (!useWorkingHours && workingDays.length === 0) {
      toast.error(
        "At least one working day is required when not using working hours",
      );
      return;
    }

    if (!useServiceHours && (!startTime || !endTime)) {
      toast.error(
        "Start and end times are required when not using service hours",
      );
      return;
    }

    if (images.length === 0) {
      toast.error("At least one service image is required");
      return;
    }

    const bodyData: Record<string, unknown> = {
      serviceId: id,
      serviceName,
      providerName,
      serviceCategory,
      servicePrice: parseFloat(servicePrice),
      totalProvider: parseInt(totalProvider, 10),
      serviceMode,
      useWorkingHours,
      useServiceHours,
      duration: formatDuration(duration),
      description,
      notes,
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

    let fileIndex = 0;
    images.forEach((image) => {
      if (image instanceof File) {
        fileIndex += 1;
        formData.append(`url${fileIndex}`, image);
      }
    });

    try {
      const response = await updateService(formData).unwrap();

      if (response?.success) {
        toast.success(response?.message || "Service updated successfully");
        setIsOpen(false);
      } else {
        toast.error(response?.message || "Failed to update service");
      }
    } catch (error) {
      console.error("Service update failed", error);
      toast.error("An error occurred while updating the service");
    }
  };

  return (
    <div>
      <button
      disabled={!editable}
        onClick={() => setIsOpen(true)}
        className="cursor-pointer disabled:cursor-not-allowed rounded-md py-2 text-sm text-gray-500"
        aria-label="Open edit service modal"
      >
        <Edit />
      </button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent
          className="max-w-[930px] rounded-xl bg-white dark:bg-slate-900 p-0 shadow-lg"
          showCloseButton={false}
        >
          <div className="flex items-center justify-between border-b border-gray-100 dark:border-slate-800 px-6 py-4">
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-slate-100">
                Edit Service
              </h2>
              <CircleAlert className="h-4 w-4 text-gray-500" />
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-gray-500 hover:text-gray-700 dark:text-slate-300"
              aria-label="Close edit service modal"
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
                Loading service details...
              </div>
            ) : (
              <div className="space-y-6">
                <FileUpload
                  label="Upload Photo"
                  images={images}
                  onChange={setImages}
                  maxFiles={5}
                />

                <div className="space-y-4">
                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-slate-300">
                      Service Name
                    </label>
                    <input
                      value={serviceName}
                      onChange={(event) => setServiceName(event.target.value)}
                      className="w-full rounded-lg border border-gray-200 dark:border-slate-700 px-3 py-2 outline-none focus:border-bprimary"
                      required
                    />
                  </div>

                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-slate-300">
                      Provider Name (Optional)
                    </label>
                    <input
                      value={providerName}
                      onChange={(event) => setProviderName(event.target.value)}
                      className="w-full rounded-lg border border-gray-200 dark:border-slate-700 px-3 py-2 outline-none focus:border-bprimary"
                    />
                  </div>

                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div>
                      <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-slate-300">
                        Select Category
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
                          <option value="Male">Male Services</option>
                          <option value="Female">Female Services</option>
                          {/* <option value="Both">Both</option> */}
                        </select>
                        <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
                      </div>
                    </div>

                    <div>
                      <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-slate-300">
                        Service Price
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

                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-slate-300">
                      Number of service providers
                    </label>
                    <input
                      type="number"
                      value={totalProvider}
                      onChange={(event) => setTotalProvider(event.target.value)}
                      className="w-full rounded-lg border border-gray-200 dark:border-slate-700 px-3 py-2 outline-none focus:border-bprimary"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-4 rounded-lg border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800 p-4">
                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-slate-300">
                      Apply Service on All Working Days?
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
                        Service Dates
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
                      Apply Service Center on Working Hours?
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
                        label="Start"
                        value={startTime}
                        onChange={setStartTime}
                      />
                      <TimeInput
                        label="End"
                        value={endTime}
                        onChange={setEndTime}
                      />
                    </div>
                  )}
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-slate-300">
                    Service Duration
                  </label>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="mb-1 block text-xs text-gray-600 dark:text-slate-400">
                        Hours
                      </label>
                      <input
                        type="number"
                        value={duration.split(":")[0] || ""}
                        onChange={(event) => {
                          const min = duration.split(":")[1] || "0";
                          setDuration(`${event.target.value}:${min}`);
                        }}
                        placeholder="0"
                        className="w-full rounded-lg border border-gray-200 dark:border-slate-700 px-3 py-2 outline-none focus:border-bprimary"
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-xs text-gray-600 dark:text-slate-400">
                        Minutes
                      </label>
                      <input
                        type="number"
                        min="1"
                        max="59"
                        value={duration.split(":")[1] || ""}
                        onChange={(event) => {
                          const hrs = duration.split(":")[0] || "0";
                          const nextMinutes = Number.parseInt(
                            event.target.value || "0",
                            10,
                          );
                          const safeMinutes = Number.isNaN(nextMinutes)
                            ? 1
                            : Math.min(59, Math.max(1, nextMinutes));
                          setDuration(
                            `${hrs}:${String(safeMinutes).padStart(2, "0")}`,
                          );
                        }}
                        placeholder="0"
                        className="w-full rounded-lg border border-gray-200 dark:border-slate-700 px-3 py-2 outline-none focus:border-bprimary"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-slate-300">
                    Service Mode
                  </label>
                  <div className="relative">
                    <select
                      value={serviceMode}
                      onChange={(event) => setServiceMode(event.target.value)}
                      className="w-full appearance-none rounded-lg border border-gray-200 dark:border-slate-700 px-3 py-2 pr-10 outline-none focus:border-bprimary"
                      required
                    >
                      <option value="">Service Type</option>
                      <option value="Online">In-center</option>
                      <option value="Home">Out-of-center</option>
                    </select>
                    <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
                  </div>
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-slate-300">
                    Short Description
                  </label>
                  <textarea
                    value={description}
                    onChange={(event) => setDescription(event.target.value)}
                    rows={4}                
                    className="w-full rounded-lg border border-gray-200 dark:border-slate-700 px-3 py-2 outline-none focus:border-bprimary"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-slate-300">
                    Notes
                  </label>
                  <textarea
                    value={notes}
                    onChange={(event) => setNotes(event.target.value)}
                    rows={4}                  
                    className="w-full rounded-lg border border-gray-200 dark:border-slate-700 px-3 py-2 outline-none focus:border-bprimary"
                  />
                </div>
              </div>
            )}

            <div className="mt-6 flex justify-end">
              <button
                type="submit"
                disabled={isUpdating}
                className="rounded-full bg-bprimary px-8 py-2 text-sm font-medium text-white disabled:opacity-60"
              >
                {isUpdating ? "Updating..." : "Update Service"}
              </button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default EditServiceModal;
