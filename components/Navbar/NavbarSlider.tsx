"use client";

import Link from "next/link";
import Image from "next/image";
import Cookies from "js-cookie";
import { useDispatch } from "react-redux";
import { usePathname, useRouter } from "next/navigation";
import expert from "@/assets/expert.png";
import logout from "@/assets/logout.png";
import settings from "@/assets/settings.png";
import dashboard from "@/assets/dashboard.png";
import jobSeeker from "@/assets/jobSeeker.png";
import earnings from "@/assets/dispute.png";
import messages from "@/assets/content.png";
import insights from "@/assets/withdrawals.png";
import { baseApi } from "@/redux/api/baseApi";
import { logout as logoutUser } from "@/redux/features/authSlice";
import { persistor } from "@/redux/store/store";
import { useGetMyProfileQuery } from "@/redux/api/authApi";
import logo3 from "@/assets/logo3.png";

interface SidebarProps {
  isOpen: boolean;
  toggleSidebar: () => void;
}

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

const withNavNonce = (route: string) => {
  const [pathname, queryString] = route.split("?");
  if (!queryString) return route;

  const params = new URLSearchParams(queryString);
  params.set("_nav", Date.now().toString());
  return `${pathname}?${params.toString()}`;
};

const NavbarSlider = ({ isOpen }: SidebarProps) => {
  const { data: profile } = useGetMyProfileQuery("");
  const path = usePathname();
  const router = useRouter();
  const dispatch = useDispatch();

  const permissions = (profile?.result ?? {}) as SidebarPermissionFlags;

  const navigation = [
    {
      label: "Dashboard",
      route: "/?view=home",
      iconPath: dashboard,
      visible: permissions.aic,
    },
    {
      label: "Client Management",
      route: "/client-management?view=all",
      iconPath: jobSeeker,
      visible: permissions.cm,
    },
    {
      label: "Business Management",
      route: "/business-management?view=all",
      iconPath: jobSeeker,
      visible: permissions.bm,
    },
    {
      label: "Service Management",
      route: "/service-management",
      iconPath: expert,
      visible: permissions.sm,
    },
    {
      label: "VIP Offer",
      route: "/vip-offer",
      iconPath: expert,
      visible: permissions.vo,
    },
    {
      label: "Earnings",
      route: "/earnings-management",
      iconPath: earnings,
      visible: permissions.earnings,
    },
    {
      label: "Insights",
      route: "/insights",
      iconPath: insights,
      visible: permissions.in,
    },
    {
      label: "Messages",
      route: "/barber-messages",
      iconPath: messages,
      visible: permissions.bbm,
    },
    {
      label: "Settings",
      route: "/settings",
      iconPath: settings,
      visible: true,
    },
  ].filter((item) => item.visible);

  const handleLogOut = async () => {
    Cookies.remove("token");
    dispatch(logoutUser());
    dispatch(baseApi.util.resetApiState());
    await persistor.purge();
    router.replace("/login");
  };

  // Helper function to extract path without query params
  const getPathname = (route: string) => route.split("?")[0];

  return (
    <div className="h-full bg-white dark:bg-slate-900">
      <aside
        className={`duration-300 flex flex-col justify-between h-[calc(100%-80px)] font-inter ${isOpen ? "w-[250px] xl:w-[286px]" : "w-20"}`}
      >
        <div className="flex flex-col h-full">
          {/* <div
            className={`flex items-center ${isOpen ? "justify-start px-8 pt-6" : "justify-center pt-6"}`}
          >
            <Image
              src={logo3}
              alt="Logo"
              width={140}
              height={44}
              className={isOpen ? "h-auto w-20" : "h-10 w-10 object-contain"}
              priority
            />
          </div> */}

          <div className={`flex flex-col ${isOpen ? "pt-0" : ""} mt-6 lg:mt-0`}>
            <ul className="m-4 lg:m-6">
              {navigation.map((item) => (
                <li key={item.route}>
                  <Link
                    href={item.route}
                    onClick={(e) => {
                      if (item.route.includes("view=")) {
                        e.preventDefault();
                        router.push(withNavNonce(item.route));
                      }
                    }}
                    className={`group flex items-center gap-2 mb-2 rounded-lg hover:bg-bprimary/90 hover:text-white transition-colors duration-300 ease-in-out ${
                      !isOpen
                        ? "justify-center py-2"
                        : "justify-start px-4 py-2"
                    } ${
                      path === getPathname(item.route)
                        ? "bg-bprimary text-white"
                        : "text-[#636F85] dark:text-slate-300"
                    }`}
                  >
                    <div className="flex justify-center items-center">
                      <Image
                        src={item.iconPath}
                        height={50}
                        width={50}
                        alt={item.label}
                        className={`h-6 w-6 transition-all duration-300 filter ${
                          path === getPathname(item.route)
                            ? "brightness-0 invert"
                            : "brightness-0 invert-50"
                        } group-hover:invert`}
                        priority
                      />
                    </div>

                    {isOpen && (
                      <p className="text-sm xl:text-base flex items-center">
                        {item.label}
                      </p>
                    )}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="grow"></div>

          <div className="mt-auto p-6">
            <button
              onClick={handleLogOut}
              className="flex items-center justify-start gap-2 text-bprimary bg-bprimary/10 hover:text-bprimary/90 transition-colors duration-500 ease-in-out cursor-pointer rounded-md hover:bg-[#FF4D4F33] dark:hover:bg-red-500/20 w-full p-1.5 lg:py-2 lg:px-4"
            >
              <Image
                src={logout}
                height={50}
                width={50}
                alt="Log out"
                className="h-5 w-5"
                priority
              />
              {isOpen && <span>Logout</span>}
            </button>
          </div>
        </div>
      </aside>
    </div>
  );
};

export default NavbarSlider;
