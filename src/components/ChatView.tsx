// src/components/ChatView.tsx

import React, { useState } from 'react';
import Landing from './chat/Landing';
import Messages from './chat/Messages';
import TextInput from './chat/TextInput';
import ModelSelector from './chat/ModelSelector';
import { useAuth } from '../contexts/AuthContext';
// import { useModel } from '../contexts/ModelContext'; // Assuming this will be used later
import { Message } from '../types';

interface ChatViewProps {
  isNewChat: boolean;
  setIsNewChat: React.Dispatch<React.SetStateAction<boolean>>;
  isSidebarOpen: boolean;
}

export default function ChatView({ isNewChat, setIsNewChat, isSidebarOpen }: ChatViewProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const { user } = useAuth();
  // const { selectedModel } = useModel(); // Uncomment when ModelContext is ready

  const handleSendMessage = async (message: string) => {
    // Immediately add the user's message to the UI
    const userMessage: Message = { role: 'user', content: message };
    setMessages(prevMessages => [...prevMessages, userMessage]);

    if (isNewChat) {
      setIsNewChat(false);
    }

    // Ensure we have a user email before sending to the backend
    if (!user?.email) {
      const errorMessage: Message = { role: 'assistant', content: "Error: User not logged in. Please log in to chat." };
      setMessages(prevMessages => [...prevMessages, errorMessage]);
      return;
    }

    // --- Live API Call to FastAPI Backend ---
    const payload = {
      human_text: message,
      user_email: user.email,
      user_model: "gpt-4o-mini", // Using a hardcoded model for now
    };

    try {
      const response = await fetch('http://localhost:8000/api/chat/invoke', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      // Add the AI's response to the UI
      const aiMessage: Message = { role: 'assistant', content: data["ai response"] };
      setMessages(prevMessages => [...prevMessages, aiMessage]);

    } catch (error) {
      console.error("Failed to fetch response from backend:", error);
      const errorMessage: Message = { role: 'assistant', content: "Sorry, I couldn't connect to the server. Please try again later." };
      setMessages(prevMessages => [...prevMessages, errorMessage]);
    }
  };

  // If it's a new chat, render the centered landing page.
  if (isNewChat) {
    return (
      <div className="relative flex h-full w-full flex-1 flex-col overflow-hidden">
        <header className={`absolute top-0 left-0 z-10 p-4 transition-all duration-300 ${!isSidebarOpen ? 'pl-16' : ''}`}>
          <ModelSelector />
        </header>
        
        <main className="flex flex-1 flex-col items-center justify-center">
          <div className="mx-auto w-full max-w-3xl px-4">
            <Landing />
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
      <header className={`flex w-full shrink-0 items-center justify-start p-4 transition-all duration-300 ${!isSidebarOpen ? 'pl-16' : ''}`}>
        <ModelSelector />
      </header>

      <main className="flex-1 overflow-y-auto">
        <Messages messages={messages} />
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
