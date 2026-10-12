import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { Camera } from "lucide-react";
import { toast } from "sonner";

const AdminProfileForMessaging = () => {
  const url = `https://api.shaara.center/api/v1/users/profile`;
  const updateUrl = `https://api.shaara.center/api/v1/users/update-profile`;
  const token = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY5ZjM0NDIwNjY5MDc5ZWFkYTYxNzc5NCIsImVtYWlsIjoiZmFrZUBnbWFpbC5jb20iLCJyb2xlIjoiQWRtaW4iLCJwaG9uZU51bWJlciI6IjAxNzAwMDAwMDAwIiwiaWF0IjoxNzc5MTE1Njc1LCJleHAiOjE3ODczMjM2NzV9.GoAS_WAaxs_rtnHcJoUXxN77FSYrx2BsbUpFIA5G06s`;
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [profileImage, setProfileImage] = useState("");
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get(url, {
          headers: {
            Authorization: `${token}`,
          },
        });

        setProfileImage(response.data?.result?.profileImage || "");
      } catch (error) {
        console.error("Failed to fetch admin profile", error);
      }
    };

    fetchProfile();
  }, [token, url]);

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const previewUrl = URL.createObjectURL(file);
    setProfileImage(previewUrl);
    setIsUploading(true);

    const formData = new FormData();
    formData.append("profileImage", file);

    try {
      const response = await axios.put(updateUrl, formData, {
        headers: {
          Authorization: `${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      console.log(response.data);
      setProfileImage(response.data?.result?.profileImage || previewUrl);
      toast.success(
        response.data?.message || "Profile image updated successfully",
      );
    } catch (error) {
      console.error("Failed to update profile image", error);
    } finally {
      setIsUploading(false);
      event.target.value = "";
    }
  };

  console.log("Current profile image URL:", profileImage);

  return (
    <div className="space-y-3 mb-8">
      <div className="flex items-center gap-2 border-b border-gray-200 dark:border-slate-800 pb-3">
        <p className="font-medium text-slate-900 dark:text-slate-100">
          Admin Logo
        </p>
      </div>

      <div className="relative group h-24 w-24">
        <img
          src={
            profileImage ||
            "https://api.zenexcloud.com/emdadullah/uploads/messages/files/1780416667413-yjvj4j0m9i.png"
          }
          alt="Admin logo"
          className="h-24 w-24 rounded-xl object-cover border border-gray-200 dark:border-slate-700"
        />

        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="absolute inset-0 flex items-center justify-center rounded-xl bg-black/0 text-white opacity-0 transition-all duration-200 group-hover:bg-black/45 group-hover:opacity-100"
          aria-label="Change profile image"
        >
          <span className="flex flex-col items-center gap-1 rounded-full bg-black/40 px-3 py-2 backdrop-blur-sm">
            <Camera className="h-5 w-5" />
            <span className="text-xs font-medium">
              {isUploading ? "Uploading..." : "Change"}
            </span>
          </span>
        </button>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
        />
      </div>
    </div>
  );
};

export default AdminProfileForMessaging;
