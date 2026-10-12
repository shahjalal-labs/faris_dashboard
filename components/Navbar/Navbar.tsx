"use client";

import NavbarSlider from "./NavbarSlider";

interface NavbarProps {
  isOpen: boolean;
  toggleSidebar: () => void;
}

const Navbar = ({ isOpen, toggleSidebar }: NavbarProps) => {
  return (
    <div
      className={`fixed left-0 top-[90px] z-30 h-[calc(100vh-90px)] w-[250px] bg-white dark:bg-slate-900 border-r border-gray-100 dark:border-slate-800 transition-transform duration-300 xl:w-[286px] lg:static lg:z-auto lg:h-screen lg:translate-x-0 lg:shadow-none lg:top-0 ${
        isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
      }`}
    >
      <NavbarSlider isOpen={isOpen} toggleSidebar={toggleSidebar} />
    </div>
  );
};

export default Navbar;
