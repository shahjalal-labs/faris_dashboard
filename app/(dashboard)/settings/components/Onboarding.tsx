"use client";

import { ChangeEvent, FormEvent, useEffect, useState } from "react";

import {
  useOnboardingQuery,
  useUpdateOnboardingMutation,
} from "@/redux/api/content.api";
import { Camera, Loader2 } from "lucide-react";
import { toast } from "sonner";

type OnboardingItem = {
  id: string;
  key: string;
  title: string;
  content: string;
  fileUrl: string;
};

const Onboarding = () => {
  const { data, isLoading } = useOnboardingQuery("");
  const [updateOnboarding, { isLoading: isUpdating }] =
    useUpdateOnboardingMutation();

  const onboardingData = data?.result as OnboardingItem | undefined;

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [preview, setPreview] = useState("");

  const currentTitle = title.trim();
  const currentContent = content.trim();
  const initialTitle = onboardingData?.title?.trim() || "";
  const initialContent = onboardingData?.content?.trim() || "";
  const hasTextChanged =
    currentTitle !== initialTitle || currentContent !== initialContent;
  const hasImageChanged = Boolean(imageFile);
  const hasAnyChanges = hasTextChanged || hasImageChanged;

  useEffect(() => {
    if (!onboardingData) return;

    setTitle(onboardingData.title || "");
    setContent(onboardingData.content || "");
    setPreview(onboardingData.fileUrl || "");
    setImageFile(null);
  }, [onboardingData]);

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImageFile(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleUpdate = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!currentTitle || !currentContent) {
      toast.warning("Title and content are required");
      return;
    }

    const payload = {
      id: onboardingData?.id,
      key: onboardingData?.key,
      title: currentTitle,
      content: currentContent,
    };

    const formData = new FormData();
    formData.append("bodyData", JSON.stringify(payload));

    if (imageFile) {
      formData.append("profileImage", imageFile);
    }

    try {
      const response = await updateOnboarding(formData).unwrap();

      if (response?.success) {
        setImageFile(null);
        toast.success(response?.message || "Onboarding updated successfully");
      }
    } catch (error) {
      toast.warning(
        (error as { data?: { message?: string } })?.data?.message ||
          "Failed to update onboarding",
      );
    }
  };

  if (isLoading) {
    return (
      <div className="bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-xl p-6 mt-4 text-slate-700 dark:text-slate-300">
        Loading onboarding...
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 p-6 rounded-xl mt-4">
      <div className="flex items-center border-b border-gray-200 dark:border-slate-800 gap-2 pb-3 mb-6">
        <p className="font-medium text-slate-900 dark:text-slate-100">
          On Boarding Screen
        </p>
      </div>

      <form onSubmit={handleUpdate} className="space-y-6">
        <div>
          <label className="block text-sm mb-1 text-slate-700 dark:text-slate-300">
            Heading
          </label>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 rounded-md px-3 py-2"
            placeholder="Write onboarding title"
            required
          />
        </div>

        <div>
          <label className="block text-sm mb-1 text-slate-700 dark:text-slate-300">
            Title
          </label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 rounded-md px-3 py-2 min-h-28"
            placeholder="Write onboarding content"
            required
          />
        </div>

        <div className="flex justify-start">
          <div className="relative w-full max-w-md h-56 group">
            <img
              src={preview || "https://placehold.co/800x500?text=Onboarding"}
              alt="Onboarding"
              className="w-full h-full rounded-xl object-cover border border-gray-200 dark:border-slate-700 transition-transform group-hover:scale-[1.01]"
            />

            <label className="absolute inset-0 rounded-xl bg-black/45 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer">
              <Camera className="w-7 h-7 text-white" />
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
            </label>
          </div>
        </div>

        <button
          type="submit"
          disabled={
            isUpdating || !currentTitle || !currentContent || !hasAnyChanges
          }
          className="bg-bprimary text-white px-5 py-2 rounded-md disabled:opacity-50 cursor-pointer"
        >
          {isUpdating ? (
            <span className="flex items-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              Updating...
            </span>
          ) : (
            "Update Onboarding"
          )}
        </button>
      </form>
    </div>
  );
};

export default Onboarding;
