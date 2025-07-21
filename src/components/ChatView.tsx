//src/components/ChatView.tsx

import React, { useState } from 'react';
import Landing from './chat/Landing';
import Messages from './chat/Messages';
import TextInput from './chat/TextInput';
import ModelSelector from './chat/ModelSelector';
import { useAuth } from '../contexts/AuthContext';
import { Message } from '../types';

//  Updated props to include messages and setMessages
interface ChatViewProps {
  isNewChat: boolean;
  setIsNewChat: React.Dispatch<React.SetStateAction<boolean>>;
  isSidebarOpen: boolean;
  messages: Message[];
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
}

export default function ChatView({ isNewChat, setIsNewChat, isSidebarOpen, messages, setMessages }: ChatViewProps) {
  //  Removed local message state, as it's now managed by ChatPage
  const [selectedModel, setSelectedModel] = useState('gpt-4o-mini');
  const { user } = useAuth();

  const handleSendMessage = async (message: string, image?: File, textFile?: File) => {
    console.log("handleSendMessage in ChatView called. Current user state:", user);

    if (!user || !user.email) {
      const errorMessage: Message = { role: 'assistant', content: "Error: User not logged in or user data is incomplete. Please log in again." };
      setMessages(prevMessages => [...prevMessages, errorMessage]);
      return;
    }

    const userMessage: Message = { role: 'user', content: message || (image ? "Image uploaded" : "File uploaded") };
    setMessages(prevMessages => [...prevMessages, userMessage]);

    if (isNewChat) {
      setIsNewChat(false);
    }

    try {
      let data;
      if (image) {
        const formData = new FormData();
        formData.append('user_email', user.email);
        formData.append('model_name', selectedModel);
        formData.append('user_message', message);
        formData.append('image_file', image);

        const response = await fetch('http://localhost:8000/api/chat/invoke_with_image', {
          method: 'POST',
          body: formData,
        });
        
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        data = await response.json();
        data['ai_response'] = data.ai_response;

      } else if (textFile) {
        const formData = new FormData();
        formData.append('user_email', user.email);
        formData.append('model_name', selectedModel);
        formData.append('user_message', message);
        formData.append('text_file', textFile);

        const response = await fetch('http://localhost:8000/api/chat/invoke_with_text_file', {
          method: 'POST',
          body: formData,
        });
        
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        data = await response.json();
        data['ai_response'] = data.ai_response;

      } else {
        const payload = {
          human_text: message,
          user_email: user.email,
          user_model: selectedModel,
        };

        const response = await fetch('http://localhost:8000/api/chat/invoke', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });

        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        data = await response.json();
      }

      const aiMessage: Message = { role: 'assistant', content: data["ai_response"] };
      setMessages(prevMessages => [...prevMessages, aiMessage]);

    } catch (error) {
      console.error("Failed to fetch response from backend:", error);
      const errorMessage: Message = { role: 'assistant', content: "Sorry, I couldn't connect to the server. Please try again later." };
      setMessages(prevMessages => [...prevMessages, errorMessage]);
    }
  };

  if (isNewChat) {
    return (
      <div className="relative flex h-full w-full flex-1 flex-col overflow-hidden">
        <header className={`absolute top-0 left-0 z-10 p-4 transition-all duration-300 ${!isSidebarOpen ? 'pl-16' : ''}`}>
          <ModelSelector selectedModel={selectedModel} setSelectedModel={setSelectedModel} />
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

  return (
    <div className="relative flex h-full w-full flex-1 flex-col overflow-hidden">
      <header className={`flex w-full shrink-0 items-center justify-start p-4 transition-all duration-300 ${!isSidebarOpen ? 'pl-16' : ''}`}>
        <ModelSelector selectedModel={selectedModel} setSelectedModel={setSelectedModel} />
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
