"use client";

import { useState } from "react";
import { Camera, ChevronDown, CircleAlert, X } from "lucide-react";
import { IoClose } from "react-icons/io5";
import { toast } from "sonner";
import { Dialog, DialogContent } from "@/components/ui/dialog";

interface ServiceModalProps {
  providerId: string;
  onSuccess?: () => void;
}

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
      <label className="block text-sm font-medium text-gray-700 dark:text-slate-300">{label}</label>

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
            <label className="flex h-24 w-24 flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 dark:bg-slate-800 cursor-pointer hover:border-bprimary hover:bg-blue-50">
              <Camera className="h-6 w-6 text-gray-400" />
              <p className="text-xs text-gray-500 text-center mt-1">Add</p>
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
  const [currentDate, setCurrentDate] = useState(new Date(2025, 4)); // May 2025

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
          <div key={day} className="text-xs font-semibold text-gray-600 dark:text-slate-400 py-1">
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
          const isSelected = selectedDates.includes(dateStr);

          return (
            <button
              key={day}
              type="button"
              onClick={() => handleDateClick(day)}
              className={`py-2 rounded text-sm font-medium ${
                isSelected
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
      <label className="block text-sm font-medium text-gray-700 dark:text-slate-300">{label}</label>
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

const AddServiceModal = ({ providerId, onSuccess }: ServiceModalProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Basic info
  const [serviceName, setServiceName] = useState("");
  const [providerName, setProviderName] = useState("");
  const [serviceCategory, setServiceCategory] = useState("");
  const [servicePrice, setServicePrice] = useState("");
  const [totalProvider, setTotalProvider] = useState("");
  const [serviceMode, setServiceMode] = useState("");

  // Images
  const [images, setImages] = useState<(File | string)[]>([]);

  // Working hours/days
  const [useWorkingHours, setUseWorkingHours] = useState(true);
  const [workingDays, setWorkingDays] = useState<string[]>([]);

  // Service hours/times
  const [useServiceHours, setUseServiceHours] = useState(true);
  const [startTime, setStartTime] = useState("10:00");
  const [endTime, setEndTime] = useState("18:00");
  const [duration, setDuration] = useState("1:0");

  // Description & notes
  const [description, setDescription] = useState("");
  const [notes, setNotes] = useState("");

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

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

    if (!totalProvider) {
      toast.error("Number of service providers is required");
      return;
    }

    if (!serviceMode) {
      toast.error("Service mode is required");
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

    if (images.length === 0) {
      toast.error("At least one service image is required");
      return;
    }

    // Build FormData
    const formData = new FormData();
    formData.append("providerId", providerId);
    formData.append("serviceName", serviceName);
    formData.append("providerName", providerName);
    formData.append("serviceCategory", serviceCategory);
    formData.append("servicePrice", servicePrice);
    formData.append("totalProvider", totalProvider);
    formData.append("serviceMode", serviceMode);
    formData.append("useWorkingHours", String(useWorkingHours));
    formData.append("workingDays", JSON.stringify(workingDays));
    formData.append("useServiceHours", String(useServiceHours));
    formData.append("startTime", startTime);
    formData.append("endTime", endTime);
    formData.append("duration", duration);
    formData.append("description", description);
    formData.append("notes", notes);

    // Add image files
    images.forEach((image, index) => {
      if (image instanceof File) {
        if (index === 0) formData.append("url1", image);
        else if (index === 1) formData.append("url2", image);
        else if (index === 2) formData.append("url3", image);
        else if (index === 3) formData.append("url4", image);
        else if (index === 4) formData.append("url5", image);
      }
    });

    // Submit
    try {
      setIsLoading(true);
      const response = await fetch("/api/services/create", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (response.ok && data.success) {
        toast.success("Service created successfully");
        setIsOpen(false);
        onSuccess?.();
        // Reset form
        setServiceName("");
        setProviderName("");
        setServiceCategory("");
        setServicePrice("");
        setTotalProvider("");
        setServiceMode("");
        setImages([]);
        setWorkingDays([]);
        setStartTime("10:00");
        setEndTime("18:00");
        setDuration("1:0");
        setDescription("");
        setNotes("");
      } else {
        toast.error(data.message || "Failed to create service");
      }
    } catch (error) {
      console.error("Service creation failed", error);
      toast.error("An error occurred while creating the service");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <button
        onClick={() => setIsOpen(true)}
        className="rounded-md bg-bprimary px-4 py-2 text-sm font-medium text-white"
      >
        Add Service
      </button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent
          className="max-w-[900px] rounded-xl bg-white dark:bg-slate-900 p-0 shadow-lg"
          showCloseButton={false}
        >
          <div className="flex items-center justify-between border-b border-gray-100 dark:border-slate-800 px-6 py-4">
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-slate-100">
                Add Service
              </h2>
              <CircleAlert className="h-4 w-4 text-gray-500" />
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-gray-500 hover:text-gray-700 dark:text-slate-300"
              aria-label="Close add service modal"
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
              <FileUpload
                label="Upload Photo"
                images={images}
                onChange={setImages}
                maxFiles={5}
              />

              {/* Basic Info */}
              <div>
                <h3 className="mb-4 flex items-center border-b border-gray-100 dark:border-slate-800 pb-3 text-lg font-semibold text-gray-900 dark:text-slate-100">
                  Input Area
                </h3>

                <div className="space-y-4">
                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-slate-300">
                      Service Name
                    </label>
                    <input
                      value={serviceName}
                      onChange={(e) => setServiceName(e.target.value)}
                      placeholder="Long Hair Washing"
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
                      onChange={(e) => setProviderName(e.target.value)}
                      placeholder="Long Hair Washing"
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
                        Service Price
                      </label>
                      <input
                        type="number"
                        value={servicePrice}
                        onChange={(e) => setServicePrice(e.target.value)}
                        placeholder="50"
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
                      onChange={(e) => setTotalProvider(e.target.value)}
                      placeholder="2"
                      className="w-full rounded-lg border border-gray-200 dark:border-slate-700 px-3 py-2 outline-none focus:border-bprimary"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Working Hours/Days Section */}
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

              {/* Service Hours Section */}
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

              {/* Duration */}
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
                      onChange={(e) => {
                        const min = duration.split(":")[1] || "0";
                        setDuration(`${e.target.value}:${min}`);
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
                      value={duration.split(":")[1] || ""}
                      onChange={(e) => {
                        const hrs = duration.split(":")[0] || "0";
                        setDuration(`${hrs}:${e.target.value}`);
                      }}
                      placeholder="0"
                      className="w-full rounded-lg border border-gray-200 dark:border-slate-700 px-3 py-2 outline-none focus:border-bprimary"
                    />
                  </div>
                </div>
              </div>

              {/* Service Mode */}
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-slate-300">
                  Service Mode
                </label>
                <div className="relative">
                  <select
                    value={serviceMode}
                    onChange={(e) => setServiceMode(e.target.value)}
                    className="w-full appearance-none rounded-lg border border-gray-200 dark:border-slate-700 px-3 py-2 pr-10 outline-none focus:border-bprimary"
                    required
                  >
                    <option value="">Service Type</option>
                    <option value="Online">Online</option>
                    <option value="Home">Home</option>
                  </select>
                  <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-slate-300">
                  Short Description
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Type service description"
                  rows={4}
                  className="w-full rounded-lg border border-gray-200 dark:border-slate-700 px-3 py-2 outline-none focus:border-bprimary"
                />
              </div>

              {/* Notes */}
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-slate-300">
                  Notes
                </label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Type service notes"
                  rows={4}
                  className="w-full rounded-lg border border-gray-200 dark:border-slate-700 px-3 py-2 outline-none focus:border-bprimary"
                />
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

export default AddServiceModal;
