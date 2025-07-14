// src/components/OpenSidebarButton.tsx
import React from 'react';

export default function OpenSidebarButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      title="Open sidebar"
      className="absolute top-3 left-3 z-20 rounded-md p-2 text-white transition-colors hover:bg-zinc-700"
    >
      <svg
        stroke="currentColor"
        fill="none"
        strokeWidth="2"
        viewBox="0 0 24 24"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="h-5 w-5"
        height="1em"
        width="1em"
        xmlns="http://www.w3.org/2000/svg"
      >
        <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
        <line x1="9" y1="3" x2="9" y2="21"></line>
      </svg>
    </button>
  );
}