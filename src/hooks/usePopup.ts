// src/hooks/usePopup.ts
import { useState, useEffect, useRef } from 'react';

/**
 * A custom hook to manage the state and outside-click behavior of a popup menu.
 * @returns An object containing the popup's state, a state setter, and a ref to attach to the popup element.
 */
export const usePopup = () => {
  const [isOpen, setIsOpen] = useState(false);
  const popupRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    /**
     * Closes the popup if a click is detected outside of the ref element.
     */
    const handleClickOutside = (event: MouseEvent) => {
      if (popupRef.current && !popupRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    // Add event listener when the component mounts
    document.addEventListener('mousedown', handleClickOutside);

    // Clean up the event listener when the component unmounts
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [popupRef]); // The effect depends on the ref

  return {
    isOpen,
    setIsOpen,
    popupRef,
  };
};
