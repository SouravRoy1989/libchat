// src/components/ChatView.tsx

import React, { useState } from 'react';
import Landing from './chat/Landing';
import Messages from './chat/Messages';
import TextInput from './chat/TextInput';
import ModelSelector from './chat/ModelSelector';
import Logo from './Logo';
import { Message } from '../services/chatApi';

interface ChatViewProps {
  isNewChat: boolean;
  isSidebarOpen: boolean;
  messages: Message[];
  onSendMessage: (message: string, image?: File, textFile?: File, isRagActive?: boolean) => void;
  isRagActive: boolean;
  setIsRagActive: (isActive: boolean) => void;
}

export default function ChatView({
  isNewChat,
  isSidebarOpen,
  messages,
  onSendMessage,
  isRagActive,
  setIsRagActive,
}: ChatViewProps) {
  const [selectedModel, setSelectedModel] = useState('gpt-4o');

  const handleLocalSendMessage = (message: string, image?: File, textFile?: File) => {
    onSendMessage(message, image, textFile, isRagActive);
  };

  const headerContent = (
    <div className="flex items-center gap-2">
      <Logo />
      <ModelSelector selectedModel={selectedModel} setSelectedModel={setSelectedModel} />
    </div>
  );

  // --- JSX Rendering ---
  // We remove the RAGToggle from here and pass its props to TextInput instead
  if (isNewChat) {
    return (
      <div className="relative flex h-full w-full flex-1 flex-col overflow-hidden">
        <header className={`absolute top-0 left-0 z-10 p-4 transition-all duration-300 ${!isSidebarOpen ? 'pl-16' : ''}`}>
          {headerContent}
        </header>
        <main className="flex flex-1 flex-col items-center justify-center">
          <div className="mx-auto w-full max-w-3xl px-4">
            <Landing />
            <div className="mt-12">
              <TextInput
                onSendMessage={handleLocalSendMessage}
                isRagActive={isRagActive}
                onRagToggle={() => setIsRagActive(!isRagActive)}
              />
            </div>
          </div>
        </main>
        <footer className="w-full shrink-0 px-4 pb-4">
          <p className="text-center text-xs text-gray-500">
            PWC OpenChat - Built with React & FastAPI
          </p>
        </footer>
      </div>
    );
  }

  return (
    <div className="relative flex h-full w-full flex-1 flex-col overflow-hidden">
      <header className={`flex w-full shrink-0 items-center justify-start p-4 transition-all duration-300 ${!isSidebarOpen ? 'pl-16' : ''}`}>
        {headerContent}
      </header>
      <main className="flex-1 overflow-y-auto">
        <Messages messages={messages} />
      </main>
      <div className="w-full shrink-0">
        <div className="mx-auto w-full max-w-3xl px-4 pb-4">
          <TextInput
            onSendMessage={handleLocalSendMessage}
            isRagActive={isRagActive}
            onRagToggle={() => setIsRagActive(!isRagActive)}
          />
          <p className="mt-2 text-center text-xs text-gray-500">
            PWC OpenChat - Built with React & FastAPI
          </p>
        </div>
      </div>
    </div>
  );
}