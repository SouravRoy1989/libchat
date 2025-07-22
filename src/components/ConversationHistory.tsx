// src/components/ConversationHistory.tsx

import React from 'react';
import type { Conversation } from '../services/chatApi';

// A simple trash can icon for the delete button
function DeleteIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
      <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
    </svg>
  );
}

// Updated props to include the delete handler
interface ConversationHistoryProps {
  conversations: Conversation[];
  onSelectConversation: (id: string) => void;
  onDeleteConversation: (id: string) => void; // New prop
  activeConversationId: string | null;
}

export default function ConversationHistory({
  conversations,
  onSelectConversation,
  onDeleteConversation, // Destructure new prop
  activeConversationId,
}: ConversationHistoryProps) {
  
  const handleDeleteClick = (e: React.MouseEvent, convoId: string) => {
    e.stopPropagation(); // Prevent the conversation from being selected when deleting
    onDeleteConversation(convoId);
  };

  return (
    <div className="flex-1 overflow-y-auto pr-2">
      <div className="flex flex-col gap-2 text-sm text-gray-300">
        {conversations.map((convo) => (
          <div
            key={convo.id}
            onClick={() => onSelectConversation(convo.id)}
            // Use 'group' to show the delete button on hover of the parent div
            className={`group flex items-center justify-between rounded-lg px-3 py-2 text-left transition-colors cursor-pointer hover:bg-zinc-800 ${
              activeConversationId === convo.id ? 'bg-zinc-700' : ''
            }`}
          >
            <span className="truncate flex-1">{convo.title}</span>
            {/* The delete button, visible only on hover */}
            <button
              onClick={(e) => handleDeleteClick(e, convo.id)}
              className="p-1 rounded-md text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-zinc-700 hover:text-white"
              aria-label="Delete conversation"
            >
              <DeleteIcon />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}