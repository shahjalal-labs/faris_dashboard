"use client";

import { useEffect, useState } from "react";
import { CircleAlert, Camera, ChevronDown } from "lucide-react";
import { toast } from "sonner";
import {
  useGetMyProfileQuery,
  useUpdateMyProfileMutation,
} from "@/redux/api/authApi";
import Onboarding from "./Onboarding";
import cities from "@/components/Common/Cities.json";
import regions from "@/components/Common/Region.json";
import AdminProfileForMessaging from "./AdminProfileForMessaging";

type CityItem = {
  name: string;
  region: string;
};

const allCities = cities as CityItem[];
const allRegions = regions as string[];

const UpdateProfile = () => {
  const { data: profile, isLoading } = useGetMyProfileQuery("");

  const [update, { isLoading: isUpdateLoading }] = useUpdateMyProfileMutation();

  const admin = profile?.result;

  const [adminName, setAdminName] = useState("");
  const [region, setRegion] = useState("");
  const [city, setCity] = useState("");
  const [bio, setBio] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>("");

  const getMatchedRegion = (value?: string | null) => {
    if (!value) return "";
    const exactMatch = allRegions.find(
      (regionName) => regionName.toLowerCase() === value.toLowerCase(),
    );
    if (exactMatch) return exactMatch;

    const withSuffix = allRegions.find(
      (regionName) =>
        regionName.toLowerCase().replace(" region", "") ===
        value.toLowerCase().replace(" region", ""),
    );
    return withSuffix || "";
  };

  const citiesByRegion = region
    ? allCities.filter((item) => item.region === region)
    : [];

  // hydrate form when profile loads
  useEffect(() => {
    if (admin) {
      const matchedRegion = getMatchedRegion(admin.region);

      setAdminName(admin.adminName || admin.userName || "");
      setRegion(matchedRegion);
      setCity(admin.city || "");
      setBio(admin.bio || "");
      setPreview(admin.profileImage || "");
    }
  }, [admin]);

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

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImageFile(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload = {
      adminName,
      bio,
      region: region || null,
      city: city || null,
    };

    const formData = new FormData();
    formData.append("bodyData", JSON.stringify(payload));

    if (imageFile) {
      formData.append("profileImage", imageFile);
    }

    try {
      const response = await update(formData).unwrap();
      if (response.success) {
        toast.success(response.message);
      }
    } catch (error) {
      console.error("Profile update failed", error);
    }
  };

  if (isLoading) {
    return (
      <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-gray-100 dark:border-slate-800 text-slate-700 dark:text-slate-300">
        Loading...
      </div>
    );
  }

  return (
    <div>
      <AdminProfileForMessaging></AdminProfileForMessaging>
      <div className="bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 p-6 rounded-xl">
        {/* Header */}
        <div className="flex items-center border-b border-gray-200 dark:border-slate-800 gap-2 pb-3 mb-6">
          <p className="font-medium text-slate-900 dark:text-slate-100">
            Profile Information
          </p>
          <CircleAlert className="w-4 h-4 text-gray-500 dark:text-slate-400" />
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Profile Image */}
          {/* <div className="flex justify-start">
            <div className="relative w-24 h-24 group">
              <img
                src={
                  preview ||
                  "https://api.zenexcloud.com/emdadullah/uploads/messages/files/1780416667413-yjvj4j0m9i.png"
                }
                alt="Profile"
                className="w-24 h-24 rounded-xl object-cover border transition-transform group-hover:scale-105"
              />

              <label className="absolute -bottom-1 -right-1 w-7 h-7 rounded-md bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 shadow-sm flex items-center justify-center cursor-pointer hover:bg-gray-50 dark:hover:bg-slate-700">
                <Camera className="w-4 h-4 text-gray-700 dark:text-slate-200" />
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </label>
            </div>
          </div> */}

          {/* Name */}
          <div>
            <label className="block text-sm mb-1 text-slate-700 dark:text-slate-300">
              Display Name
            </label>
            <input
              value={adminName}
              onChange={(e) => setAdminName(e.target.value)}
              className="w-full border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 rounded-md px-3 py-2"
              required
            />
          </div>

          {/* Email (readonly) */}
          <div>
            <label className="block text-sm mb-1 text-slate-700 dark:text-slate-300">
              Email
            </label>
            <input
              value={admin?.email || ""}
              readOnly
              className="w-full border border-gray-300 dark:border-slate-700 rounded-md px-3 py-2 bg-gray-100 dark:bg-slate-800/70 text-slate-700 dark:text-slate-300"
            />
          </div>

          {/* City / Region */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="relative">
              <label className="block text-sm mb-1 text-slate-700 dark:text-slate-300">
                City
              </label>
              <select
                value={city}
                onChange={(e) => setCity(e.target.value)}
                disabled={!region}
                className="w-full border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 rounded-md px-3 py-2 pr-10 appearance-none disabled:bg-gray-100 dark:disabled:bg-slate-800/70 disabled:text-gray-500 dark:disabled:text-slate-500"
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
              <ChevronDown className="w-4 h-4 text-gray-500 dark:text-slate-400 absolute right-3 top-[38px] pointer-events-none" />
            </div>

            <div className="relative">
              <label className="block text-sm mb-1 text-slate-700 dark:text-slate-300">
                Region
              </label>
              <select
                value={region}
                onChange={(e) => setRegion(e.target.value)}
                className="w-full border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 rounded-md px-3 py-2 pr-10 appearance-none"
              >
                <option value="">Select region</option>
                {allRegions.map((regionName) => (
                  <option key={regionName} value={regionName}>
                    {regionName}
                  </option>
                ))}
              </select>
              <ChevronDown className="w-4 h-4 text-gray-500 dark:text-slate-400 absolute right-3 top-[38px] pointer-events-none" />
            </div>
          </div>

          {/* Bio */}
          <div>
            <label className="block text-sm mb-1 text-slate-700 dark:text-slate-300">
              Bio
            </label>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Write a short bio"
              rows={4}
              className="w-full border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 rounded-md px-3 py-2"
            />
          </div>

          {/* Submit */}
          <button
            disabled={isUpdateLoading}
            className="bg-bprimary text-white px-5 py-2 rounded-md disabled:opacity-50"
          >
            {isUpdateLoading ? "Updating..." : "Update Profile"}
          </button>
        </form>
      </div>
      <Onboarding></Onboarding>
    </div>
  );
};

export default UpdateProfile;
