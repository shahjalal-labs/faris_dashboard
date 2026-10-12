"use client";

import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  Check,
  ChevronDown,
  CircleAlert,
  Eye,
  EyeOff,
  Loader,
} from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useCreateAdminMutation, useGetMyProfileQuery } from "@/redux/api/authApi";
import Admins from "./Admins";

type PageAccessKey =
  | "dashboard"
  | "cm"
  | "bm"
  | "sm"
  | "vo"
  | "cr"
  | "earnings"
  | "in"
  | "bbm"
  | "aic";

type CreateAdminFormValues = {
  adminName: string;
  email: string;
  password: string;
  confirmPassword: string;
  editing: boolean;
  viewing: boolean;
  pageAccess: PageAccessKey[];
};

const pageOptions: Array<{ key: PageAccessKey; label: string }> = [
  { key: "dashboard", label: "Dashboard" },
  { key: "cm", label: "Client Management" },
  { key: "bm", label: "Business Management" },
  { key: "sm", label: "Service Management" },
  { key: "vo", label: "VIP Offer" },
  { key: "cr", label: "Cancellation Reason" },
  { key: "earnings", label: "Earnings" },
  { key: "in", label: "Insights" },
  { key: "bbm", label: "Barber Messages" },
  // { key: "aic", label: "Activation & Inactive Clients" },
];

const defaultValues: CreateAdminFormValues = {
  adminName: "",
  email: "",
  password: "",
  confirmPassword: "",
  editing: false,
  viewing: false,
  pageAccess: [],
};

const Accessibility = () => {
  const [createAdmin, { isLoading: creatingAdmin }] = useCreateAdminMutation();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [pagePickerOpen, setPagePickerOpen] = useState(false);

    const { data: profile } = useGetMyProfileQuery("");
  const editable = Boolean(profile?.result?.editing);

  const {
    control,
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    setError,
    clearErrors,
    formState: { errors },
  } = useForm<CreateAdminFormValues>({
    defaultValues,
  });

  const passwordValue = watch("password");
  const canEdit = watch("editing");
  const canView = watch("viewing");
  const selectedPages = watch("pageAccess");

  const onSubmit = async (values: CreateAdminFormValues) => {
    if (!values.editing && !values.viewing) {
      setError("editing", {
        type: "manual",
        message: "Select at least one accessibility option",
      });
      toast.warning("Select at least one accessibility option");
      return;
    }

    if (!values.pageAccess.length) {
      setError("pageAccess", {
        type: "manual",
        message: "Select at least one accessible page",
      });
      toast.warning("Select at least one accessible page");
      return;
    }

    const payload = {
      adminName: values.adminName.trim(),
      email: values.email.trim().toLowerCase(),
      password: values.password,
      editing: values.editing,
      viewing: values.viewing,
      dashboard: values.pageAccess.includes("dashboard"),
      cm: values.pageAccess.includes("cm"),
      bm: values.pageAccess.includes("bm"),
      sm: values.pageAccess.includes("sm"),
      vo: values.pageAccess.includes("vo"),
      cr: values.pageAccess.includes("cr"),
      earnings: values.pageAccess.includes("earnings"),
      in: values.pageAccess.includes("in"),
      bbm: values.pageAccess.includes("bbm"),
      aic: values.pageAccess.includes("aic"),
    };

    try {
      const response = await createAdmin(payload).unwrap();

      if (response.success) {
        toast.success(response.message || "Admin created successfully");
        reset(defaultValues);
        setPagePickerOpen(false);
      }
    } catch (error) {
      toast.warning(
        (error as { data?: { message?: string } })?.data?.message ||
          "Failed to create admin",
      );
    }
  };

  return (
    <div className="w-full rounded-2xl bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 p-6">
      <Admins></Admins>
      <div className="mb-6 flex items-center gap-2 border-b border-[#E6EDF5] dark:border-slate-800 pb-3">
        <p className="font-medium text-[#2D2D2D] dark:text-slate-100">
          Create Admin
        </p>
        <CircleAlert className="h-4 w-4 text-[#636F85] dark:text-slate-400" />
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          <div>
            <label
              htmlFor="adminName"
              className="mb-2 block text-sm font-medium text-[#2D2D2D] dark:text-slate-200"
            >
              Admin Name
            </label>
            <Input
              id="adminName"
              placeholder="Enter admin name"
              className="h-12 rounded-2xl border-[#D1D6DB] dark:border-slate-700 bg-white dark:bg-slate-800 px-4 text-slate-900 dark:text-slate-100"
              {...register("adminName", {
                required: "Admin name is required",
              })}
            />
            {errors.adminName && (
              <p className="mt-1 text-xs text-red-500">
                {errors.adminName.message}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="email"
              className="mb-2 block text-sm font-medium text-[#2D2D2D] dark:text-slate-200"
            >
              Email Address
            </label>
            <Input
              id="email"
              type="email"
              placeholder="Enter email address"
              className="h-12 rounded-2xl border-[#D1D6DB] dark:border-slate-700 bg-white dark:bg-slate-800 px-4 text-slate-900 dark:text-slate-100"
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^\S+@\S+\.\S+$/,
                  message: "Enter a valid email address",
                },
              })}
            />
            {errors.email && (
              <p className="mt-1 text-xs text-red-500">
                {errors.email.message}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="password"
              className="mb-2 block text-sm font-medium text-[#2D2D2D] dark:text-slate-200"
            >
              Password
            </label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter password"
                className="h-12 rounded-2xl border-[#D1D6DB] dark:border-slate-700 bg-white dark:bg-slate-800 px-4 pr-11 text-slate-900 dark:text-slate-100"
                {...register("password", {
                  required: "Password is required",
                  minLength: {
                    value: 8,
                    message: "Password must be at least 8 characters",
                  },
                  pattern: {
                    value: /^(?=.*[A-Za-z])(?=.*\d).{8,}$/,
                    message: "Password must contain letters and numbers",
                  },
                })}
              />
              <button
                type="button"
                onClick={() => setShowPassword((current) => !current)}
                className="absolute top-1/2 right-4 -translate-y-1/2 text-[#636F85] dark:text-slate-400"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            <p className="mt-2 text-xs text-[#636F85] dark:text-slate-400">
              Min 8 characters with a combination of letters and numbers
            </p>
            {errors.password && (
              <p className="mt-1 text-xs text-red-500">
                {errors.password.message}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="confirmPassword"
              className="mb-2 block text-sm font-medium text-[#2D2D2D] dark:text-slate-200"
            >
              Confirm Password
            </label>
            <div className="relative">
              <Input
                id="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirm password"
                className="h-12 rounded-2xl border-[#D1D6DB] dark:border-slate-700 bg-white dark:bg-slate-800 px-4 pr-11 text-slate-900 dark:text-slate-100"
                {...register("confirmPassword", {
                  required: "Please confirm the password",
                  validate: (value) =>
                    value === passwordValue || "Passwords do not match",
                })}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword((current) => !current)}
                className="absolute top-1/2 right-4 -translate-y-1/2 text-[#636F85] dark:text-slate-400"
              >
                {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {errors.confirmPassword && (
              <p className="mt-1 text-xs text-red-500">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-[#2D2D2D] dark:text-slate-200">
              Accessibility
            </label>
            <div className="space-y-3 rounded-2xl border border-[#D1D6DB] dark:border-slate-700 p-4 bg-white dark:bg-slate-800/40">
              <Controller
                control={control}
                name="editing"
                render={({ field }) => (
                  <label className="flex cursor-pointer items-center gap-3 text-sm text-[#2D2D2D] dark:text-slate-200">
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={(value) => {
                        field.onChange(Boolean(value));
                        if (Boolean(value) || canView) {
                          clearErrors("editing");
                        }
                      }}
                      className="border-[#D1D6DB] data-[state=checked]:border-bprimary data-[state=checked]:bg-bprimary"
                    />
                    <span>Editing</span>
                  </label>
                )}
              />

              <Controller
                control={control}
                name="viewing"
                render={({ field }) => (
                  <label className="flex cursor-pointer items-center gap-3 text-sm text-[#2D2D2D] dark:text-slate-200">
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={(value) => {
                        field.onChange(Boolean(value));
                        if (Boolean(value) || canEdit) {
                          clearErrors("editing");
                        }
                      }}
                      className="border-[#D1D6DB] data-[state=checked]:border-bprimary data-[state=checked]:bg-bprimary"
                    />
                    <span>Viewing</span>
                  </label>
                )}
              />
            </div>
            {errors.editing && (
              <p className="mt-1 text-xs text-red-500">
                {errors.editing.message}
              </p>
            )}
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-[#2D2D2D] dark:text-slate-200">
              Access to Pages
            </label>
            <Popover open={pagePickerOpen} onOpenChange={setPagePickerOpen}>
              <PopoverTrigger asChild>
                <Button
                  type="button"
                  variant="outline"
                  className="h-12 w-full justify-between rounded-2xl border-[#D1D6DB] dark:border-slate-700 bg-white dark:bg-slate-800 px-4 font-normal text-[#636F85] dark:text-slate-300 hover:bg-white dark:hover:bg-slate-800"
                >
                  <span className="truncate text-left">
                    {selectedPages.length
                      ? pageOptions
                          .filter(({ key }) => selectedPages.includes(key))
                          .map(({ label }) => label)
                          .join(", ")
                      : "Select accessible pages"}
                  </span>
                  <ChevronDown
                    size={18}
                    className="shrink-0 text-[#636F85] dark:text-slate-400"
                  />
                </Button>
              </PopoverTrigger>
              <PopoverContent
                align="start"
                className="w-(--radix-popover-trigger-width) rounded-2xl border-[#E6EDF5] dark:border-slate-700 bg-white dark:bg-slate-900 p-2"
              >
                <div className="max-h-72 space-y-1 overflow-y-auto pr-1">
                  {pageOptions.map((page) => {
                    const checked = selectedPages.includes(page.key);

                    return (
                      <label
                        key={page.key}
                        className="flex w-full cursor-pointer items-center gap-3 rounded-xl px-3 py-2 text-sm text-[#2D2D2D] dark:text-slate-200 transition hover:bg-[#F7FAFC] dark:hover:bg-slate-800"
                      >
                        <Checkbox
                          checked={checked}
                          onCheckedChange={(value) => {
                            const nextPages = value
                              ? [...selectedPages, page.key]
                              : selectedPages.filter(
                                  (selectedPage) => selectedPage !== page.key,
                                );

                            setValue("pageAccess", nextPages, {
                              shouldDirty: true,
                              shouldTouch: true,
                            });

                            if (nextPages.length > 0) {
                              clearErrors("pageAccess");
                            }
                          }}
                          className="border-[#D1D6DB] data-[state=checked]:border-bprimary data-[state=checked]:bg-bprimary"
                        />
                        <span className="flex-1">{page.label}</span>
                        {checked && <Check className="h-4 w-4 text-bprimary" />}
                      </label>
                    );
                  })}
                </div>
              </PopoverContent>
            </Popover>
            <p className="mt-2 text-xs text-[#636F85] dark:text-slate-400">
              Selected pages will be sent as true. Unselected pages will remain
              false.
            </p>
            {errors.pageAccess && (
              <p className="mt-1 text-xs text-red-500">
                {errors.pageAccess.message}
              </p>
            )}
          </div>
        </div>

        <Button
          type="submit"
          disabled={creatingAdmin || !editable}
          className="min-w-40 rounded-3xl bg-bprimary px-8 disabled:cursor-not-allowed py-3 text-white hover:bg-bprimary/90"
        >
          {creatingAdmin ? (
            <Loader className="mx-auto animate-spin" />
          ) : (
            "Create Admin"
          )}
        </Button>
      </form>
    </div>
  );
};

export default Accessibility;
