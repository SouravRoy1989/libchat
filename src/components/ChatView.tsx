// src/components/ChatView.tsx

import React from 'react';
import Landing from './chat/Landing';
import Messages from './chat/Messages';
import TextInput from './chat/TextInput';
import ModelSelector from './chat/ModelSelector';

interface ChatViewProps {
  isNewChat: boolean;
  setIsNewChat: React.Dispatch<React.SetStateAction<boolean>>;
  isSidebarOpen: boolean; // 🎨 Accept the new prop
}

export default function ChatView({ isNewChat, setIsNewChat, isSidebarOpen }: ChatViewProps) {
  const handleSendMessage = (message: string) => {
    console.log('Sending message:', message);
    if (isNewChat) {
      setIsNewChat(false);
    }
  };

  // If it's a new chat, render the centered landing page.
  if (isNewChat) {
    return (
      <div className="relative flex h-full w-full flex-1 flex-col overflow-hidden">
        {/* 🎨 Conditionally add left padding to this header */}
        <header className={`absolute top-0 left-0 z-10 p-4 transition-all duration-300 ${!isSidebarOpen ? 'pl-16' : ''}`}>
          <ModelSelector />
        </header>
        
        <main className="flex flex-1 flex-col items-center justify-center">
          <div className="mx-auto w-full max-w-3xl px-4">
            <Landing ModelSelector={'symbol'} />
            <div className="mt-12">
              <TextInput onSendMessage={handleSendMessage} />
            </div>
          </div>
        </main>
        
        <footer className="w-full shrink-0 px-4 pb-4">
          <p className="text-center text-xs text-gray-500">
            LibreChat - Rebuilt with React & FastAPI
          </p>
        </footer>
      </div>
    );
  }

  // Otherwise, render the standard chat interface.
  return (
    <div className="relative flex h-full w-full flex-1 flex-col overflow-hidden">
      {/* 🎨 Conditionally add left padding here as well */}
      <header className={`flex w-full shrink-0 items-center justify-start p-4 transition-all duration-300 ${!isSidebarOpen ? 'pl-16' : ''}`}>
        <ModelSelector />
      </header>

      <main className="flex-1 overflow-y-auto">
        <Messages />
      </main>
      
      <div className="w-full shrink-0">
        <div className="mx-auto w-full max-w-3xl px-4 pb-4">
          <TextInput onSendMessage={handleSendMessage} />
          <p className="mt-2 text-center text-xs text-gray-500">
            LibreChat - Rebuilt with React & FastAPI
          </p>
        </div>
      </div>
    </div>
  );
}