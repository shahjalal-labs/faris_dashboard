"use client";
import { useChangePasswordMutation } from "@/redux/api/authApi";
import { Loader } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

type ChangePasswordFormValues = {
  oldPassword: string;
  newPassword: string;
};

const ChangePassword = () => {
  const [changePassword, { isLoading }] = useChangePasswordMutation();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ChangePasswordFormValues>({
    defaultValues: {
      oldPassword: "",
      newPassword: "",
    },
  });

  const onSubmit = async (values: ChangePasswordFormValues) => {
    try {
      const response = await changePassword({
        oldPassword: values.oldPassword,
        newPassword: values.newPassword,
      }).unwrap();
      if (response.success) {
        toast.success(response.message);
        reset();
      }
    } catch (error) {
      toast.warning((error as any)?.data?.message);
    }
  };

  return (
    <div className="w-full bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 p-6 rounded-2xl">
      <h2 className="text-2xl font-semibold text-[#2D2D2D] dark:text-slate-100">
        Change Password
      </h2>
      <p className="mt-2 text-[#636F85] dark:text-slate-400">
        Update your password to keep your account secure.
      </p>

      <form className="mt-6" onSubmit={handleSubmit(onSubmit)}>
        <div className="mb-4">
          <label
            htmlFor="oldPassword"
            className="mb-2 block text-sm font-medium text-[#2D2D2D] dark:text-slate-200"
          >
            Old Password
          </label>
          <input
            id="oldPassword"
            type="password"
            placeholder="Enter old password"
            className="h-12 w-full rounded-2xl border border-[#D1D6DB] dark:border-slate-700 bg-white dark:bg-slate-800 px-4 text-sm text-slate-900 dark:text-slate-100 outline-none transition focus:border-[#2D2D2D] dark:focus:border-slate-500"
            {...register("oldPassword", {
              required: "Old password is required",
              minLength: {
                value: 6,
                message: "Password must be at least 6 characters",
              },
            })}
          />
          {errors.oldPassword && (
            <p className="mt-1 text-xs text-red-500">
              {errors.oldPassword.message}
            </p>
          )}
        </div>

        <div className="mb-4">
          <label
            htmlFor="newPassword"
            className="mb-2 block text-sm font-medium text-[#2D2D2D] dark:text-slate-200"
          >
            New Password
          </label>
          <input
            id="newPassword"
            type="password"
            placeholder="Enter new password"
            className="h-12 w-full rounded-2xl border border-[#D1D6DB] dark:border-slate-700 bg-white dark:bg-slate-800 px-4 text-sm text-slate-900 dark:text-slate-100 outline-none transition focus:border-[#2D2D2D] dark:focus:border-slate-500"
            {...register("newPassword", {
              required: "New password is required",
              minLength: {
                value: 6,
                message: "Password must be at least 6 characters",
              },
            })}
          />
          {errors.newPassword && (
            <p className="mt-1 text-xs text-red-500">
              {errors.newPassword.message}
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="disabled:opacity-45 disabled:cursor-default w-full mt-3 bg-bprimary text-white font-semibold rounded-3xl transition-all duration-500 ease-in-out cursor-pointer px-6 py-4"
        >
          {isLoading ? (
            <Loader className="mx-auto animate-spin" />
          ) : (
            "Update Password"
          )}
        </button>
      </form>
    </div>
  );
};

export default ChangePassword;
