import React from 'react';

/**
 * TopBar component for the application header.
 * Includes logo, search, notifications, and user avatar.
 */
const Header = () => {
  return (
    <header className="w-full h-20 flex items-center justify-between px-8 bg-subBackground2 shadow-md rounded-t-lg">
      {/* Logo Section */}
      <div className="flex items-center space-x-4">
        <img
          src="https://cdn.prod.website-files.com/62ecfefc58b878e68b3c7c20/6673f3ade8f353e75cd1f090_Vector.svg"
          alt="maxion logo"
          className="h-10"
        />
        <span className="text-2xl font-extrabold font-poppins tracking-wide text-white">
          MAXION DEV HUB
        </span>
      </div>
      {/* Search Bar */}
      <div className="flex-1 flex justify-center">
        <input
          type="text"
          placeholder="Search ..."
          className="w-96 h-10 px-4 rounded-lg bg-[#222324] text-white placeholder-customGrayLight focus:outline-none focus:ring-2 focus:ring-primary"
        />
      </div>
      {/* User Info & Notifications */}
      <div className="flex items-center space-x-6">
        {/* Notification Icon */}
        <button className="relative focus:outline-none">
          <svg
            className="w-7 h-7 text-white"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
            />
          </svg>
          <span className="absolute -top-1 -right-1 bg-primary text-black text-xs rounded-full px-1.5 py-0.5">
            1
          </span>
        </button>
        {/* User Avatar & Name */}
        <div className="flex items-center space-x-3">
          <img
            src="https://randomuser.me/api/portraits/men/32.jpg"
            alt="User Avatar"
            className="w-10 h-10 rounded-full border-2 border-primary object-cover"
          />
          <div className="flex flex-col">
            <span className="text-white font-semibold text-sm">Augusta Ryan</span>
            <span className="text-customGrayLight text-xs">Director</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
