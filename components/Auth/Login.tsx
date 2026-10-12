/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import Image from "next/image";
import preview from "@/assets/Logo.png";
import {
  useAdminLoginMutation,
  useLazyGetMyProfileQuery,
} from "@/redux/api/authApi";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Loader } from "lucide-react";
import { useForm } from "react-hook-form";
import Cookies from "js-cookie";

type LoginFormValues = {
  email: string;
  password: string;
};

type SidebarPermissionFlags = {
  aic?: boolean;
  cm?: boolean;
  bm?: boolean;
  sm?: boolean;
  vo?: boolean;
  earnings?: boolean;
  in?: boolean;
  bbm?: boolean;
};

const getFirstAccessibleRoute = (permissions: SidebarPermissionFlags) => {
  const routeByPermission: Array<{
    key: keyof SidebarPermissionFlags;
    route: string;
  }> = [
    { key: "aic", route: "/" },
    { key: "cm", route: "/client-management" },
    { key: "bm", route: "/business-management" },
    { key: "sm", route: "/service-management" },
    { key: "vo", route: "/vip-offer" },
    { key: "earnings", route: "/earnings-management" },
    { key: "in", route: "/insights" },
    { key: "bbm", route: "/barber-messages" },
  ];

  const firstAllowed = routeByPermission.find(({ key }) => permissions[key]);
  return firstAllowed?.route ?? "/settings";
};

export default function Login() {
  const route = useRouter();
  const [Login, { isLoading }] = useAdminLoginMutation();
  const [getMyProfile] = useLazyGetMyProfileQuery();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const handleLogin = async (values: LoginFormValues) => {
    try {
      const response = await Login({
        email: values.email,
        password: values.password,
      }).unwrap();
      if (response.success) {
        toast.success(response.message);
        Cookies.set("token", response.result);

        try {
          const profileResponse = await getMyProfile(undefined, true).unwrap();
          const permissions = (profileResponse?.result ??
            {}) as SidebarPermissionFlags;
          route.replace(getFirstAccessibleRoute(permissions));
        } catch {
          route.replace("/settings");
        }
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

      {/* Right Side - Login Form */}
      <div className="w-full lg:w-1/2 flex justify-center items-center min-h-screen bg-white dark:bg-slate-900 border-l border-[#D1D6DB] dark:border-slate-800">
        <div className="w-full max-w-xl lg:max-w-lg xl:max-w-xl">
          {/* Logo and Brand */}
          <div className="mb-8 flex flex-col items-center text-7xl text-bprimary md:mb-14 pl-6 md:pl-0">
            <h1 className="border-b-4  border-b-bprimary">شـــعـــرة</h1>
            <h1 className="text-6xl font-medium">Shaara</h1>
          </div>

          <div className="grow"></div>

          {/* Login Form */}
          <div className="p-8">
            <div className="text-start">
              <h2 className="text-[32px] font-semibold text-slate-900 dark:text-slate-100">
                Login
              </h2>
              <p className="my-2.5 text-slate-500 dark:text-slate-400">
                Let’s login into your account first
              </p>
            </div>

            <form className="w-full" onSubmit={handleSubmit(handleLogin)}>
              <div className="mb-4">
                <label
                  htmlFor="email"
                  className="mb-2 block text-sm font-medium text-slate-900 dark:text-slate-100"
                >
                  Email Address
                </label>
                <input
                  id="email"
                  type="email"
                  placeholder="enter your email"
                  className="h-12 w-full rounded-2xl border border-[#D1D6DB] dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 px-4 text-sm outline-none transition focus:border-slate-900 dark:focus:border-slate-100"
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

              <div className="mb-2">
                <label
                  htmlFor="password"
                  className="mb-2 block text-sm font-medium text-slate-900 dark:text-slate-100"
                >
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  className="h-12 w-full rounded-2xl border border-[#D1D6DB] dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 px-4 text-sm outline-none transition focus:border-slate-900 dark:focus:border-slate-100"
                  {...register("password", {
                    required: "Password is required",
                    minLength: {
                      value: 6,
                      message: "Password must be at least 6 characters",
                    },
                  })}
                />
                {errors.password && (
                  <p className="mt-1 text-xs text-red-500">
                    {errors.password.message}
                  </p>
                )}
              </div>
              <button
                type="button"
                onClick={() => route.push("/reset-password")}
                className="w-full hover:underline cursor-pointer text-right text-sm font-medium text-bprimary"
              >
                Forgot Password?
              </button>

              <button
                type="submit"
                disabled={isLoading}
                className="disabled:opacity-45 disabled:cursor-default w-full mt-5 bg-bprimary text-white font-semibold rounded-3xl transition-all duration-500 ease-in-out cursor-pointer px-6 py-4"
              >
                {isLoading ? (
                  <Loader className="mx-auto animate-spin"></Loader>
                ) : (
                  "Login"
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
