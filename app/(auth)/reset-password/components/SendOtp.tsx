/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import Image from "next/image";
import preview from "@/assets/Logo.png";
import { useForgotPasswordMutation } from "@/redux/api/authApi";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Loader } from "lucide-react";
import { useForm } from "react-hook-form";
import Cookies from "js-cookie";

type LoginFormValues = {
  email: string;
};

export default function SendOtp({ setActive }: any) {
  const route = useRouter();
  const [sendOtp, { isLoading }] = useForgotPasswordMutation();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    defaultValues: {
      email: "",
    },
  });

  const handleSendOtp = async (values: LoginFormValues) => {
    try {
      const response = await sendOtp({
        email: values.email,
      }).unwrap();
      if (response.success) {
        toast.success(response.message);
        Cookies.set("email", values.email);
        setActive("verifyOtp");
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
                Forgot Password
              </h2>
              <p className="mt-2 pb-2 text-slate-500 dark:text-slate-400">
                Enter your email and we will send a reset code.
              </p>
            </div>

            <form className="w-full" onSubmit={handleSubmit(handleSendOtp)}>
              <div className="mb-4">
                <input
                  id="email"
                  type="email"
                  placeholder="enter your email"
                  className="h-12 w-full rounded-xl border border-[#D1D6DB] dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 px-4 text-sm outline-none transition focus:border-slate-900 dark:focus:border-slate-100"
                  {...register("email", {
                    required: "Email is required",
                    pattern: {
                      value: /\S+@\S+\.\S+/,
                      message: "Enter a valid email",
                    },
                  })}
                />
                {errors.email && (
                  <p className="mt-1 text-xs text-red-500">
                    {errors.email.message}
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
                  "Send Code"
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
