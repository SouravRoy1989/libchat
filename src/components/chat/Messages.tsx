// src/components/chat/Messages.tsx

import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import type { Message } from '../../services/chatApi';
import { useAuth } from '../../contexts/AuthContext';

// --- Avatar Components ---

// A new, unique SVG icon for the AI avatar
function AiAvatar() {
  return (
    <div className="flex h-8 w-8 items-center justify-center rounded-md bg-purple-600 text-white flex-shrink-0">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="currentColor"
        className="w-5 h-5"
      >
        <path
          fillRule="evenodd"
          d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456z"
          clipRule="evenodd"
        />
      </svg>
    </div>
  );
}

// The avatar for the User, which is working correctly
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
    <div className="flex h-8 w-8 items-center justify-center rounded-md bg-green-600 text-white flex-shrink-0 font-bold">
      <span>{initials}</span>
    </div>
  );
}

// --- Main Messages Component ---

interface MessagesProps {
  messages: Message[];
}

export default function Messages({ messages }: MessagesProps) {
  const { user } = useAuth();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="space-y-6 p-4">
      {messages.map((msg, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
          className={`flex items-start gap-4 ${
            msg.role === 'user' ? 'justify-end' : 'justify-start'
          }`}
        >
          {/* Show the AI avatar for 'ai' role */}
          {msg.role === 'ai' && <AiAvatar />}

          <div
            className={`max-w-xl rounded-lg px-4 py-2 text-white shadow-md ${
              msg.role === 'user' ? 'bg-blue-600' : 'bg-zinc-700'
            }`}
          >
            <p className="whitespace-pre-wrap">{msg.content}</p>
          </div>

          {/* Show the User avatar for 'user' role */}
          {msg.role === 'user' && <UserAvatar name={user?.name ?? ''} />}
        </motion.div>
      ))}
      <div ref={messagesEndRef} />
    </div>
  );
}