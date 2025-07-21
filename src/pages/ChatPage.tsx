// src/pages/ChatPage.tsx
import React, { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import SideNav from '../components/SideNav';
import ChatView from '../components/ChatView';
import OpenSidebarButton from '../components/OpenSidebarButton';
import { Message } from '../types'; // Import the Message type

export default function ChatPage() {
  const [isNewChat, setIsNewChat] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  //  Message state is now managed here
  const [messages, setMessages] = useState<Message[]>([]);

  //  Function to clear the chat and reset the view
  const handleNewChat = () => {
    setMessages([]);
    setIsNewChat(true);
  };

  return (
    <div className="flex h-screen w-full bg-zinc-800 text-white">
      <AnimatePresence>
        {isSidebarOpen && (
          //  Pass the handleNewChat function to the SideNav
          <SideNav 
            setIsSidebarOpen={setIsSidebarOpen} 
            onNewChat={handleNewChat} 
          />
        )}
      </AnimatePresence>
      
      <main className="relative flex-1">
        {!isSidebarOpen && (
          <OpenSidebarButton onClick={() => setIsSidebarOpen(true)} />
        )}
        {/*  Pass messages and setMessages down to ChatView */}
        <ChatView 
          isNewChat={isNewChat} 
          setIsNewChat={setIsNewChat} 
          isSidebarOpen={isSidebarOpen}
          messages={messages}
          setMessages={setMessages}
        />
      </main>
    </div>
  );
}
