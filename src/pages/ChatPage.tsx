// src/pages/ChatPage.tsx
import React, { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import SideNav from '../components/SideNav';
import ChatView from '../components/ChatView';
import OpenSidebarButton from '../components/OpenSidebarButton';

export default function ChatPage() {
  const [isNewChat, setIsNewChat] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <div className="flex h-screen w-full bg-zinc-800 text-white">
      <AnimatePresence>
        {isSidebarOpen && (
          <SideNav setIsSidebarOpen={setIsSidebarOpen} />
        )}
      </AnimatePresence>
      
      <main className="relative flex-1">
        {!isSidebarOpen && (
          <OpenSidebarButton onClick={() => setIsSidebarOpen(true)} />
        )}
        {/* 🎨 Pass the sidebar state down to the ChatView */}
        <ChatView 
          isNewChat={isNewChat} 
          setIsNewChat={setIsNewChat} 
          isSidebarOpen={isSidebarOpen} 
        />
      </main>
    </div>
  );
}