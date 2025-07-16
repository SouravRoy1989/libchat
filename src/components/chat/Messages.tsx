// src/components/chat/Messages.tsx

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Message } from '../../types';
import { useAuth } from '../../contexts/AuthContext';

// A simple avatar for the user
function UserAvatar({ name }: { name: string }) {
  const initial = name ? name.split(' ').map(n => n[0]).join('').toUpperCase() : 'U';
  return (
    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-500 text-white flex-shrink-0">
      <span className="text-xs font-bold">{initial}</span>
    </div>
  );
}

// A simple avatar for the AI
function AiAvatar() {
    return (
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-purple-600 text-white flex-shrink-0">
            <svg stroke="currentColor" fill="none" strokeWidth="1.5" viewBox="0 0 24 24" aria-hidden="true" height="20" width="20" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c.251.023.501.05.75.082a.75.75 0 01.75.75v5.714a2.25 2.25 0 00.659 1.591L14.25 14.5M9.75 3.104a11.932 11.932 0 014.5 0m-4.5 0a11.932 11.932 0 00-4.5 0m1.5 11.41L5.832 15.64a2.25 2.25 0 01-2.15-2.151V9.75a2.25 2.25 0 012.25-2.25h.008a2.25 2.25 0 012.25 2.25v.383m1.5 11.41a11.932 11.932 0 014.5 0m-4.5 0a11.932 11.932 0 00-4.5 0m6.75-11.41L18.168 15.64a2.25 2.25 0 002.15-2.151V9.75a2.25 2.25 0 00-2.25-2.25h-.008a2.25 2.25 0 00-2.25 2.25v.383M14.25 14.5a11.932 11.932 0 014.5 0m-4.5 0a11.932 11.932 0 00-4.5 0"></path></svg>
        </div>
    )
}


interface MessagesProps {
  messages: Message[];
}

export default function Messages({ messages }: MessagesProps) {
  const { user } = useAuth();

  return (
    <div className="p-4 space-y-6">
      <AnimatePresence>
        {messages.map((message, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className={`flex items-start gap-4 ${
              message.role === 'user' ? 'justify-end' : 'justify-start'
            }`}
          >
            {message.role === 'assistant' && <AiAvatar />}
            
            <div
              className={`max-w-xl rounded-lg px-4 py-2.5 ${
                message.role === 'user'
                  ? 'bg-blue-600 text-white'
                  : 'bg-zinc-700 text-white'
              }`}
            >
              <p className="whitespace-pre-wrap">{message.content}</p>
            </div>

            {message.role === 'user' && <UserAvatar name={user?.name ?? 'User'} />}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
