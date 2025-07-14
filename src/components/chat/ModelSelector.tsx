// src\components\chat\ModelSelector.tsx

import React, { useState, useRef, useEffect } from 'react';
import { useModel } from '../../contexts/ModelContext';
import Logo from '../Logo'; 
import ModelMenu from './ModelMenu';

export default function ModelSelector() {
  const { conversation } = useModel();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [menuRef]);

  if (!conversation) {
    return null; // or a loading state
  }

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 rounded-md bg-gray-900/50 px-3 py-1.5 text-sm font-semibold text-white transition-colors hover:bg-gray-700"
      >
        <Logo />
        <span>{conversation.model}</span>
      </button>
      {isOpen && <ModelMenu setIsOpen={setIsOpen} />}
    </div>
  );
}