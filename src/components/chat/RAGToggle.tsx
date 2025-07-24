// src/components/chat/RAGToggle.tsx

import React from 'react';

// A simple icon for the toggle button
const DeepResearchIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M14.5 14.5L19 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M11 18C14.866 18 18 14.866 18 11C18 7.13401 14.866 4 11 4C7.13401 4 4 7.13401 4 11C4 14.866 7.13401 18 11 18Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M2 22L7 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

interface RAGToggleProps {
  isActive: boolean;
  onToggle: () => void;
}

export default function RAGToggle({ isActive, onToggle }: RAGToggleProps) {
  return (
    <button
      onClick={onToggle}
      className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 ease-in-out ${
        isActive
          ? 'bg-blue-600 text-white shadow-md'
          : 'bg-zinc-700 text-zinc-300 hover:bg-zinc-600'
      }`}
      aria-pressed={isActive}
    >
      <DeepResearchIcon />
      <span>Answer from Files</span>
    </button>
  );
}