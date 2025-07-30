// src/components/SideNav.tsx
import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { motion } from 'framer-motion';
import ConversationHistory from './ConversationHistory';
import type { Conversation } from '../services/chatApi';

// --- UserAvatar Sub-component ---
function UserAvatar({ name }: { name: string }) {
  let initials = 'U';
  if (name) {
    const parts = name.split(' ').filter(Boolean);
    if (parts.length > 1) {
      initials = (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    } else if (parts.length === 1) {
      initials = parts[0][0].toUpperCase();
    }
  }
  return (
    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-500 text-white flex-shrink-0">
      <span className="text-sm font-bold">{initials}</span>
    </div>
  );
}

// --- Props Interface ---
// All props are explicitly defined here.
interface SideNavProps {
  setIsSidebarOpen: (isOpen: boolean) => void;
  onNewChat: () => void;
  conversations: Conversation[];
  onSelectConversation: (id: string) => void;
  onDeleteConversation: (id: string) => void;
  activeConversationId: string | null;
  onOpenSettings: () => void;
  onOpenFilesModal: () => void;
}

// --- Main SideNav Component ---
export default function SideNav({
  // All props are now correctly destructured from the SideNavProps interface
  setIsSidebarOpen,
  onNewChat,
  conversations,
  onSelectConversation,
  onDeleteConversation,
  activeConversationId,
  onOpenSettings,
  onOpenFilesModal,
}: SideNavProps) {
  const { user, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Effect to close the user menu when clicking outside of it.
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [menuRef]);

  // --- Event Handlers ---
  const handleFilesClick = () => {
    onOpenFilesModal();
    setIsMenuOpen(false);
  };

  const handleSettingsClick = () => {
    onOpenSettings();
    setIsMenuOpen(false);
  };

  const handleLogoutClick = () => {
    logout();
    setIsMenuOpen(false);
  };

  // --- JSX Return ---
  // The JSX is now complete and valid.
  return (
    <motion.nav
      initial={{ x: '-100%' }}
      animate={{ x: 0 }}
      exit={{ x: '-100%' }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      className="flex h-full w-64 flex-col bg-black p-2 flex-shrink-0"
    >
      {/* Top Section: New Chat and Close Sidebar */}
      <div className="mb-2 flex items-center justify-between">
        <button
          onClick={onNewChat}
          className="flex flex-1 items-center gap-3 rounded-md px-3 py-3 text-sm text-white transition-colors hover:bg-zinc-800"
        >
          <svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
          New Chat
        </button>
        <button
          onClick={() => setIsSidebarOpen(false)}
          title="Close sidebar"
          className="ml-2 rounded-md p-2 text-white transition-colors hover:bg-zinc-800"
        >
          <svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="9" y1="3" x2="9" y2="21"></line></svg>
        </button>
      </div>

      {/* Conversation History */}
      <ConversationHistory
        conversations={conversations}
        onSelectConversation={onSelectConversation}
        onDeleteConversation={onDeleteConversation}
        activeConversationId={activeConversationId}
      />

      {/* Bottom Section: User Menu */}
      <div ref={menuRef} className="relative mt-auto border-t border-zinc-700 pt-2">
        {isMenuOpen && (
          <div className="absolute bottom-full mb-2 w-full rounded-lg bg-zinc-800 text-white shadow-lg">
            <div className="p-2">
              <div className="px-3 py-2 text-sm text-gray-400">{user?.email}</div>
              <hr className="my-1 border-zinc-700" />
              <button onClick={handleFilesClick} className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors hover:bg-zinc-700">
                <svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
                My Files
              </button>
              <button onClick={handleSettingsClick} className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors hover:bg-zinc-700">
                <svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>
                Settings
              </button>
              <hr className="my-1 border-zinc-700" />
              <button onClick={handleLogoutClick} className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors hover:bg-zinc-700">
                <svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
                Log out
              </button>
            </div>
          </div>
        )}
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="flex w-full items-center gap-3 rounded-md px-3 py-3 text-sm text-white transition-colors hover:bg-zinc-800"
        >
          <UserAvatar name={user?.name ?? 'User'} />
          <span className="grow overflow-hidden text-ellipsis whitespace-nowrap text-left">
            {user?.name}
          </span>
        </button>
      </div>
    </motion.nav>
  );
}
