import React from 'react';

const tabs = [
  {
    label: 'Auth',
    icon: (
      <svg
        className="w-6 h-6"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M12 11c0-1.657-1.343-3-3-3s-3 1.343-3 3 1.343 3 3 3 3-1.343 3-3zm0 0c0-1.657 1.343-3 3-3s3 1.343 3 3-1.343 3-3 3-3-1.343-3-3zm-6 8v-2a4 4 0 014-4h4a4 4 0 014 4v2"
        />
      </svg>
    ),
  },
  {
    label: 'Web3',
    icon: (
      <svg
        className="w-6 h-6"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        viewBox="0 0 24 24"
      >
        <circle
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="2"
          fill="none"
        />
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M2 12h20M12 2a15.3 15.3 0 010 20M12 2a15.3 15.3 0 000 20"
        />
      </svg>
    ),
  },
  {
    label: 'Bulk Mint',
    icon: (
      <svg
        className="w-6 h-6"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M3 10h4V3h10v7h4v11H3V10zm7 4h4"
        />
      </svg>
    ),
  },
  {
    label: 'Marketplace Listing',
    icon: (
      <svg
        className="w-6 h-6"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        viewBox="0 0 24 24"
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 7h18M3 12h18M3 17h18" />
      </svg>
    ),
  },
  {
    label: 'Delimiters',
    icon: (
      <svg
        className="w-6 h-6"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M9 17v-2a4 4 0 014-4h4a4 4 0 014 4v2M3 7h18"
        />
      </svg>
    ),
  },
  {
    label: 'JSON to String',
    icon: (
      <svg
        className="w-6 h-6"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        viewBox="0 0 24 24"
      >
        <rect x="3" y="5" width="18" height="14" rx="2" ry="2" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M8 9h8M8 13h6" />
      </svg>
    ),
  },
  {
    label: 'ENV Converter',
    icon: (
      <svg
        className="w-6 h-6"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M12 8v4l3 3m6 0a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
    ),
  },
];

/**
 * Sidebar component for vertical navigation.
 * @param {Object} props
 * @param {number} props.selectedIndex
 * @param {function} props.setSelectedIndex
 * @param {boolean} props.isAuthenticated
 */
const Sidebar = ({ selectedIndex, setSelectedIndex, isAuthenticated, email }) => {
  return (
    <aside className="h-full w-64 bg-[#23242a] flex flex-col justify-between py-8 px-4 shadow-lg rounded-r-2xl">
      {/* Logo */}
      <div className="flex flex-col items-center space-y-8">
        <div className="flex flex-col items-center space-y-2">
          <img
            src="https://cdn.prod.website-files.com/62ecfefc58b878e68b3c7c20/6673f3ade8f353e75cd1f090_Vector.svg"
            alt="maxion logo"
            className="h-10 mb-2"
          />
          <p className="text-white text-xl font-poppins font-extrabold uppercase">
            Maxion Dev Hub
          </p>
          {email && (
            <p className="text-white text-sm font-poppins font-extrabold">{email}</p>
          )}
        </div>
        {/* Navigation Tabs */}
        <nav className="flex flex-col space-y-2 w-full">
          {tabs.map((tab, idx) => (
            <button
              key={tab.label}
              className={`flex items-center space-x-4 px-4 py-3 rounded-lg transition-all text-left w-full font-medium text-base
                ${
                  selectedIndex === idx
                    ? 'bg-primary text-black shadow'
                    : 'text-white hover:bg-[#282a36]'
                }
              `}
              onClick={() => setSelectedIndex(idx)}
              disabled={!isAuthenticated}
            >
              <span>{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          ))}
        </nav>
      </div>
    </aside>
  );
};

export default Sidebar;
