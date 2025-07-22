// src\components\ChatWindow.tsx
import React, { useState, useEffect, useRef } from 'react';
import type { Message } from '../services/chatApi';
import { motion } from 'framer-motion';

// A simple icon for the "Send" button
function SendIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M7 11L12 6L17 11M12 18V7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path>
    </svg>
  );
}

// An avatar for the AI messages
function AiAvatar() {
    return (
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-purple-500 text-white flex-shrink-0 font-bold">
            <span>AI</span>
        </div>
    );
}

// The props this component expects from its parent (e.g., App.tsx)
interface ChatWindowProps {
  messages: Message[];
  onSendMessage: (messageText: string) => void;
  isLoading?: boolean; // Optional: for showing a "typing..." indicator
}

export default function ChatWindow({ messages, onSendMessage, isLoading }: ChatWindowProps) {
  const [inputText, setInputText] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // This effect automatically scrolls to the latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Function to handle sending a message
  const handleSend = () => {
    if (inputText.trim()) {
      onSendMessage(inputText);
      setInputText('');
    }
  };

  // Function to allow sending with the "Enter" key (but not with "Shift+Enter")
  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-col h-screen flex-1 bg-zinc-900">
      {/* Main message display area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {messages.length === 0 ? (
          // Display this when there are no messages (i.e., a new chat)
          <div className="flex flex-col items-center justify-center h-full text-zinc-400">
            <h1 className="text-3xl font-semibold">Gemini Clone</h1>
            <p className="mt-2">How can I help you today?</p>
          </div>
        ) : (
          // Render the list of messages
          messages.map((msg, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              className={`flex items-start gap-4 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {msg.role === 'ai' && <AiAvatar />}
              <div
                className={`max-w-xl rounded-2xl px-5 py-3 text-white ${
                  msg.role === 'user' ? 'bg-blue-600 rounded-br-none' : 'bg-zinc-700 rounded-bl-none'
                }`}
              >
                {/* We use whitespace-pre-wrap to respect newlines in the response */}
                <p className="whitespace-pre-wrap">{msg.content}</p>
              </div>
            </motion.div>
          ))
        )}
        {/* Optional: Show a typing indicator */}
        {isLoading && (
            <div className="flex items-start gap-4 justify-start">
                <AiAvatar />
                <div className="bg-zinc-700 rounded-2xl rounded-bl-none px-5 py-3">
                    <p className="animate-pulse">AI is thinking...</p>
                </div>
            </div>
        )}
        {/* This empty div is the target for our auto-scrolling */}
        <div ref={messagesEndRef} />
      </div>

      {/* Chat input form at the bottom */}
      <div className="px-6 py-4 bg-zinc-900 border-t border-zinc-700">
        <div className="relative mx-auto max-w-3xl">
          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Enter a prompt here..."
            rows={1}
            className="w-full resize-none rounded-xl border border-zinc-600 bg-zinc-800 p-4 pr-16 text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={handleSend}
            disabled={!inputText.trim()}
            className="absolute bottom-3 right-3 flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600 text-white transition-colors disabled:bg-zinc-600 disabled:cursor-not-allowed hover:bg-blue-500"
            aria-label="Send message"
          >
            <SendIcon />
          </button>
        </div>
        <p className="text-center text-xs text-zinc-500 mt-3">
          Gemini clone may display inaccurate info. Always double-check its responses.
        </p>
      </div>
    </div>
  );
}