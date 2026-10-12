"use client";

import { useEffect, useState } from "react";
import { Camera, ChevronDown, CircleAlert, Edit } from "lucide-react";
import { IoClose } from "react-icons/io5";
import { toast } from "sonner";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useUpdateBusinessMutation } from "@/redux/api/business.Api";
import cities from "@/components/Common/Cities.json";
import regions from "@/components/Common/Region.json";
import { useGetMyProfileQuery } from "@/redux/api/authApi";

type CityItem = {
  name: string;
  region: string;
};

const allCities = cities as CityItem[];
const allRegions = regions as string[];

const normalizeRegion = (value?: string | null) => {
  if (!value) return "";

  const exactMatch = allRegions.find(
    (regionName) => regionName.toLowerCase() === value.toLowerCase(),
  );

  if (exactMatch) return exactMatch;

  const strippedMatch = allRegions.find(
    (regionName) =>
      regionName.toLowerCase().replace(" region", "") ===
      value.toLowerCase().replace(" region", ""),
  );

  return strippedMatch || "";
};

const FileUpload = ({
  label,
  preview,
  onChange,
}: {
  label: string;
  preview?: string;
  onChange: (file: File | null) => void;
}) => {
  const [localPreview, setLocalPreview] = useState(preview || "");

  useEffect(() => {
    setLocalPreview(preview || "");
  }, [preview]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;
    if (!file) return;

    onChange(file);
    setLocalPreview(URL.createObjectURL(file));
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700 dark:text-slate-300">
        {label}
      </label>
      <div className="rounded-xl border border-dashed border-sky-300 bg-sky-50/40 px-4 py-5">
        {localPreview ? (
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <img
                src={localPreview}
                alt={label}
                className="h-14 w-14 rounded-lg border border-gray-200 dark:border-slate-700 object-cover"
              />
              <div>
                <p className="text-sm font-medium text-gray-800">
                  Selected image
                </p>
                <p className="text-xs text-gray-500">
                  Replace it with a new file if needed
                </p>
              </div>
            </div>
            <label className="cursor-pointer rounded-full bg-bprimary px-4 py-2 text-sm font-medium text-white">
              Choose file
              <input
                type="file"
                accept="image/*"
                onChange={handleChange}
                className="hidden"
              />
            </label>
          </div>
        ) : (
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
        )}
      </div>
    </div>
  );
};

const UpdateBusinessModal = ({ business }: any) => {
  const [isOpen, setIsOpen] = useState(false);
  const [updateBusiness, { isLoading }] = useUpdateBusinessMutation();
  const { data: profile } = useGetMyProfileQuery("");
  const editable = Boolean(profile?.result?.editing);

  const providerProfile = business?.providerProfiles?.[0];

  const [providerId, setProviderId] = useState("");
  const [fullName, setFullName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [region, setRegion] = useState("");
  const [city, setCity] = useState("");
  const [serviceCategory, setServiceCategory] = useState("");
  const [serviceType, setServiceType] = useState("");
  const [salonDescription, setSalonDescription] = useState("");
  const [additionalNote, setAdditionalNote] = useState("");
  const [optionalNote, setOptionalNote] = useState("");
  const [nidNote, setNidNote] = useState("");

  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [vatUrlFile, setVatUrlFile] = useState<File | null>(null);
  const [nidUrlFile, setNidUrlFile] = useState<File | null>(null);
  const [additionalPhotoFile, setAdditionalPhotoFile] = useState<File | null>(
    null,
  );

  const citiesByRegion = region
    ? allCities.filter((item) => item.region === region)
    : [];

  useEffect(() => {
    if (!business) return;

    const provider = business?.providerProfiles?.[0] || {};

    setProviderId(business?.id || "");
    setFullName(business?.fullName || "");
    setPhoneNumber(business?.phoneNumber || "");
    setEmail(business?.email || "");
    setRegion(normalizeRegion(provider?.region));
    setCity(provider?.city || "");
    setServiceCategory(provider?.serviceCategory || "");
    setServiceType(provider?.serviceType || "");
    setSalonDescription(provider?.salonDescription || "");
    setAdditionalNote(provider?.additionalNote || "");
    setOptionalNote(provider?.optionalNote || "");
    setNidNote(provider?.nidNote || "");
  }, [business]);

  useEffect(() => {
    if (!region) {
      setCity("");
      return;
    }

    const isCityValidForRegion = citiesByRegion.some(
      (item) => item.name === city,
    );
    if (!isCityValidForRegion) {
      setCity("");
    }
  }, [region]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!providerId) {
      toast.error("Business information is missing.");
      return;
    }

    const bodyData = {
      providerId,
      fullName,
      phoneNumber,
      email,
      region: region || null,
      city: city || null,
      serviceCategory,
      serviceType,
      salonDescription,
      additionalNote,
      optionalNote,
      nidNote,
    };

    const formData = new FormData();
    formData.append("bodyData", JSON.stringify(bodyData));

    if (logoFile) formData.append("logo", logoFile);
    if (vatUrlFile) formData.append("vatUrl", vatUrlFile);
    if (nidUrlFile) formData.append("nidUrl", nidUrlFile);
    if (additionalPhotoFile)
      formData.append("additionalPhoto", additionalPhotoFile);

    try {
      const response = await updateBusiness(formData).unwrap();
      if (response?.success) {
        toast.success(response?.message || "Business updated successfully");
        setIsOpen(false);
      }
    } catch (error) {
      console.error("Business update failed", error);
    }
  };

  return (
    <div>
      <button
        disabled={!editable}
        onClick={() => setIsOpen(true)}
        className=" text-sm font-medium disabled:cursor-not-allowed text-gray-700 dark:text-slate-300 cursor-pointer"
      >
        <Edit></Edit>
      </button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent
          className="max-w-[880px] rounded-xl bg-white dark:bg-slate-900 p-0 shadow-lg"
          showCloseButton={false}
        >
          <div className="flex items-center justify-between border-b border-gray-100 dark:border-slate-800 px-6 py-4">
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-slate-100">
                Edit Business Information
              </h2>
              <CircleAlert className="h-4 w-4 text-gray-500" />
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-gray-500 hover:text-gray-700 dark:text-slate-300"
              aria-label="Close business update modal"
            >
              <IoClose size={24} />
            </button>
          </div>

          <form
            onSubmit={handleSubmit}
            className="max-h-[65vh] overflow-y-auto px-6 py-5"
          >
            <div className="space-y-5">
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-slate-300">
                  Business Name
                </label>
                <input
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full rounded-lg border border-gray-200 dark:border-slate-700 px-3 py-2 outline-none focus:border-bprimary"
                />
              </div>

              <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-slate-300">
                    Phone Number
                  </label>
                  <input
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    className="w-full rounded-lg border border-gray-200 dark:border-slate-700 px-3 py-2 outline-none focus:border-bprimary"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-slate-300">
                    Email
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full rounded-lg border border-gray-200 dark:border-slate-700 px-3 py-2 outline-none focus:border-bprimary"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-slate-300">
                    Region
                  </label>
                  <div className="relative">
                    <select
                      value={region}
                      onChange={(e) => setRegion(e.target.value)}
                      className="w-full appearance-none rounded-lg border border-gray-200 dark:border-slate-700 px-3 py-2 pr-10 outline-none focus:border-bprimary"
                    >
                      <option value="">Select region</option>
                      {allRegions.map((regionName) => (
                        <option key={regionName} value={regionName}>
                          {regionName}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
                  </div>
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-slate-300">
                    City
                  </label>
                  <div className="relative">
                    <select
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      disabled={!region}
                      className="w-full appearance-none rounded-lg border border-gray-200 dark:border-slate-700 px-3 py-2 pr-10 outline-none focus:border-bprimary disabled:bg-gray-100"
                      required
                    >
                      <option value="">
                        {region ? "Select city" : "Select region first"}
                      </option>
                      {citiesByRegion.map((item) => (
                        <option key={item.name} value={item.name}>
                          {item.name}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-slate-300">
                    Service category
                  </label>
                  <div className="relative">
                    <select
                      value={serviceCategory}
                      onChange={(e) => setServiceCategory(e.target.value)}
                      className="w-full appearance-none rounded-lg border border-gray-200 dark:border-slate-700 px-3 py-2 pr-10 outline-none focus:border-bprimary"
                    >
                      <option value="">Select category</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Both">Male & Female</option>
                    </select>
                    <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
                  </div>
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-slate-300">
                    Service Type
                  </label>
                  <div className="relative">
                    <select
                      value={serviceType}
                      onChange={(e) => setServiceType(e.target.value)}
                      className="w-full appearance-none rounded-lg border border-gray-200 dark:border-slate-700 px-3 py-2 pr-10 outline-none focus:border-bprimary"
                    >
                      <option value="">Select service type</option>
                      <option value="Salon">Salon</option>
                      <option value="Grooming">Grooming Center</option>
                      <option value="Aesthetic">Aesthetic Clinic</option>
                      <option value="Spa">Spa & Massage</option>
                    </select>
                    <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
                  </div>
                </div>
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-slate-300">
                  Description
                </label>
                <textarea
                  value={salonDescription}
                  onChange={(e) => setSalonDescription(e.target.value)}
                  rows={4}
                  className="w-full rounded-lg border border-gray-200 dark:border-slate-700 px-3 py-2 outline-none focus:border-bprimary"
                  placeholder="Type service notes"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-slate-300">
                  Notes
                </label>
                <textarea
                  value={optionalNote}
                  onChange={(e) => setOptionalNote(e.target.value)}
                  rows={4}
                  className="w-full rounded-lg border border-gray-200 dark:border-slate-700 px-3 py-2 outline-none focus:border-bprimary"
                  placeholder="Type notes"
                />
              </div>

              <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-slate-300">
                    Additional Note
                  </label>
                  <textarea
                    value={additionalNote}
                    onChange={(e) => setAdditionalNote(e.target.value)}
                    rows={4}
                    className="w-full rounded-lg border border-gray-200 dark:border-slate-700 px-3 py-2 outline-none focus:border-bprimary"
                    placeholder="Type additional note"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-slate-300">
                    NID Note
                  </label>
                  <textarea
                    value={nidNote}
                    onChange={(e) => setNidNote(e.target.value)}
                    rows={4}
                    className="w-full rounded-lg border border-gray-200 dark:border-slate-700 px-3 py-2 outline-none focus:border-bprimary"
                    placeholder="Type NID note"
                  />
                </div>
              </div>

              <div className="pt-2">
                <div className="mb-4 flex items-center border-b border-gray-100 dark:border-slate-800 pb-3">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-slate-100">
                    Edit Business Verification
                  </h3>
                </div>

                <div className="space-y-5">
                  <FileUpload
                    label="VAT Certification"
                    preview={providerProfile?.vatUrl}
                    onChange={setVatUrlFile}
                  />
                  <FileUpload
                    label="National Address Image"
                    preview={providerProfile?.nidUrl}
                    onChange={setNidUrlFile}
                  />
                  <FileUpload
                    label="Additional Photo"
                    preview={providerProfile?.additionalPhoto}
                    onChange={setAdditionalPhotoFile}
                  />
                  <FileUpload
                    label="Logo"
                    preview={providerProfile?.logo}
                    onChange={setLogoFile}
                  />
                </div>
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                type="submit"
                disabled={isLoading}
                className="rounded-full bg-bprimary px-8 py-2 text-sm font-medium text-white disabled:opacity-60"
              >
                {isLoading ? "Saving..." : "Save"}
              </button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default UpdateBusinessModal;
