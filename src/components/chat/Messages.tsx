// src/components/chat/Messages.tsx

import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import type { Message, RagResponse, RagSource } from '../../services/chatApi';
import { useAuth } from '../../contexts/AuthContext';

// --- Helper Functions & Components ---

/**
 * Type guard to check if message content is a RAG response object.
 */
const isRagResponse = (content: string | RagResponse): content is RagResponse => {
  return typeof content === 'object' && content !== null && 'sources' in content;
};

const DownloadIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
  </svg>
);

/**
 * A component to render a single source document with a download button.
 */
const SourceLink = ({ source }: { source: RagSource }) => {
  const handleDownload = () => {
    // Construct the download URL pointing to the new backend endpoint
    const url = `http://localhost:8000/api/download?file_path=${encodeURIComponent(source.path)}`;
    window.open(url, '_blank');
  };

  return (
    <div className="flex items-center gap-2 rounded-md bg-zinc-800 px-3 py-1.5">
      <span className="text-xs text-zinc-300">{source.name}</span>
      <button
        onClick={handleDownload}
        className="flex items-center text-zinc-400 hover:text-white transition-colors"
        title={`Download ${source.name}`}
      >
        <DownloadIcon />
      </button>
    </div>
  );
};


// --- Avatar Components (Unchanged) ---
function AiAvatar() {
  return (
    <div className="flex h-8 w-8 items-center justify-center rounded-md bg-purple-600 text-white flex-shrink-0">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
        <path fillRule="evenodd" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456z" clipRule="evenodd" />
      </svg>
    </div>
  );
}

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

// --- Main Messages Component (Updated) ---

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
          className={`flex items-start gap-4 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
        >
          {msg.role === 'ai' && <AiAvatar />}

          <div className={`max-w-xl rounded-lg px-4 py-3 text-white shadow-md ${msg.role === 'user' ? 'bg-blue-600' : 'bg-zinc-700'}`}>
            {isRagResponse(msg.content) ? (
              // --- RENDER RAG RESPONSE ---
              <div className="space-y-4">
                <div className="prose prose-sm prose-invert max-w-none">
                  <ReactMarkdown>{msg.content.content}</ReactMarkdown>
                </div>
                <div className="border-t border-zinc-600 pt-3">
                  <h4 className="text-xs font-semibold text-zinc-400 mb-2">Reference Documents</h4>
                  <div className="flex flex-wrap gap-2">
                    {msg.content.sources.map((source, idx) => (
                      <SourceLink key={idx} source={source} />
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              // --- RENDER STANDARD STRING RESPONSE ---
              <div className="prose prose-sm prose-invert max-w-none whitespace-pre-wrap">
                <ReactMarkdown>{msg.content}</ReactMarkdown>
              </div>
            )}
          </div>

          {msg.role === 'user' && <UserAvatar name={user?.name ?? ''} />}
        </motion.div>
      ))}
      <div ref={messagesEndRef} />
    </div>
  );
}