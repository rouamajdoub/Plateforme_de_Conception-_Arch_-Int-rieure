import React, { useState } from "react";
import  DropdownItem from "../ui/dropdown/DropdownItem";
import  Dropdown  from "../ui/dropdown/Dropdown";
import { Link } from "react-router-dom";

const UserDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const closeDropdown = () => {
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <button
        onClick={toggleDropdown}
        className="flex items-center text-gray-700"
      >
        <span className="mr-3 overflow-hidden rounded-full h-11 w-11">
          <img src="/images/user/owner.jpg" alt="User" />
        </span>
        <span className="block mr-1 font-medium">Musharof</span>
        <svg
          className={`stroke-gray-500 transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
          width="18"
          height="20"
          viewBox="0 0 18 20"
        >
          <path
            d="M4.3125 8.65625L9 13.3437L13.6875 8.65625"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
      <Dropdown
        isOpen={isOpen}
        onClose={closeDropdown}
        className="absolute right-0 mt-[17px] flex w-[260px] flex-col rounded-2xl border border-gray-200 bg-white p-3 shadow-theme-lg"
      >
        <div>
          <span className="block font-medium text-gray-700">
            Musharof Chowdhury
          </span>
          <span className="mt-0.5 block text-gray-500">randomuser@pimjo.com</span>
        </div>
        <ul className="flex flex-col gap-1 pt-4 pb-3 border-b border-gray-200">
          <li>
            <DropdownItem onItemClick={closeDropdown} to="/profile">
              Edit profile
            </DropdownItem>
          </li>
          <li>
            <DropdownItem onItemClick={closeDropdown} to="/support">
              Support
            </DropdownItem>
          </li>
        </ul>
        <Link
          to="/signin"
          className="flex items-center gap-3 px-3 py-2 mt-3 font-medium text-gray-700 rounded-lg"
        >
          Sign out
        </Link>
      </Dropdown>
    </div>
  );
};

export default UserDropdown;