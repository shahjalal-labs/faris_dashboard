/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import Image from "next/image";
import preview from "@/assets/Logo.png";
import { useResetPasswordMutation } from "@/redux/api/authApi";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Loader } from "lucide-react";
import { useForm } from "react-hook-form";
import Cookies from "js-cookie";

type ResetPasswordFormValues = {
  newPassword: string;
  confirmPassword: string;
};

export default function NewPassword() {
  const route = useRouter();
  const [resetPassword, { isLoading }] = useResetPasswordMutation();
  const {
    handleSubmit,
    formState: { errors },
    register,
    watch,
  } = useForm<ResetPasswordFormValues>({
    defaultValues: {
      newPassword: "",
      confirmPassword: "",
    },
  });

  const handleResetPassword = async (values: ResetPasswordFormValues) => {
    try {
      const payload = {
        newPassword: values.newPassword,
      };
      const response = await resetPassword(payload).unwrap();
      if (response.success) {
        toast.success(response.message);
        Cookies.remove("resetToken");
        route.push("/login");
      }
    } catch (error) {
      toast.warning((error as any)?.data?.message);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Ocean Background */}
      <div className="hidden lg:block lg:w-1/2 h-screen relative">
        <Image
          src={preview}
          alt="Shaara"
          fill
          className="object-cover"
          priority
        />
      </div>

      {/* Right Side - Reset Form */}
      <div className="w-full lg:w-1/2 flex justify-center items-center min-h-screen bg-white dark:bg-slate-900 border-l border-[#D1D6DB] dark:border-slate-800">
        <div className="w-full max-w-xl lg:max-w-lg xl:max-w-xl">
          <div className="grow"></div>

          {/* Login Form */}
          <div className="p-8">
            <div className="mb-8 flex flex-col items-center text-7xl text-bprimary md:mb-14 pl-6 md:pl-0">
              <h1 className="border-b-4  border-b-bprimary">شـــعـــرة</h1>
              <h1 className="text-6xl font-medium">Shaara</h1>
            </div>
            <div className="text-start">
              <h2 className="text-[32px] font-semibold text-slate-900 dark:text-slate-100">
                Set New Password
              </h2>
              <p className="mt-2 pb-2 text-slate-500 dark:text-slate-400">
                Create a new password for your account.
              </p>
            </div>

            <form
              className="w-full"
              onSubmit={handleSubmit(handleResetPassword)}
            >
              <div className="mb-4">
                <label
                  htmlFor="newPassword"
                  className="mb-2 block text-sm font-medium text-slate-900 dark:text-slate-100"
                >
                  New Password
                </label>
                <input
                  id="newPassword"
                  type="password"
                  placeholder="Enter new password"
                  className="h-12 w-full rounded-2xl border border-[#D1D6DB] dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 px-4 text-sm outline-none transition focus:border-slate-900 dark:focus:border-slate-100"
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

              <div className="mb-4">
                <label
                  htmlFor="confirmPassword"
                  className="mb-2 block text-sm font-medium text-slate-900 dark:text-slate-100"
                >
                  Confirm Password
                </label>
                <input
                  id="confirmPassword"
                  type="password"
                  placeholder="Confirm new password"
                  className="h-12 w-full rounded-2xl border border-[#D1D6DB] dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 px-4 text-sm outline-none transition focus:border-slate-900 dark:focus:border-slate-100"
                  {...register("confirmPassword", {
                    required: "Confirm password is required",
                    validate: (value) =>
                      value === watch("newPassword") ||
                      "Passwords do not match",
                  })}
                />
                {errors.confirmPassword && (
                  <p className="mt-1 text-xs text-red-500">
                    {errors.confirmPassword.message}
                  </p>
                )}
              </div>
              <button
                type="button"
                className="w-full text-start text-sm font-medium text-slate-600 dark:text-slate-300"
              >
                Remember your password?{" "}
                <span
                  className="text-bprimary hover:underline cursor-pointer"
                  onClick={() => route.push("/login")}
                >
                  Login
                </span>
              </button>

              <button
                type="submit"
                disabled={isLoading}
                className="disabled:opacity-45 disabled:cursor-default w-full mt-5 bg-bprimary text-white font-semibold rounded-3xl transition-all duration-500 ease-in-out cursor-pointer px-6 py-4"
              >
                {isLoading ? (
                  <Loader className="mx-auto animate-spin"></Loader>
                ) : (
                  "Reset Password"
                )}
              </button>
            </form>
          </div>

          <div className="grow"></div>

          <div className="text-center text-sm cursor-pointer mt-20">
            <span className="text-slate-900 dark:text-slate-100">
              © {new Date().getFullYear()} Shaara. All rights reserved.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
