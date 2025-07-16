// src/components/chat/TextInput.tsx

import React, { useState } from 'react';
import { usePopup } from '../../hooks/usePopup'; // Import the custom hook

// --- Icons (no changes needed here) ---
const PaperclipIcon = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"></path></svg>;
const MicIcon = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"></path><path d="M19 10v2a7 7 0 0 1-14 0v-2"></path><line x1="12" y1="19" x2="12" y2="23"></line></svg>;
const ArrowUpIcon = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="19" x2="12" y2="5"></line><polyline points="5 12 12 5 19 12"></polyline></svg>;
const UploadImageIcon = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg>;
const UploadTextIcon = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line></svg>;
const FileSearchIcon = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><circle cx="15.5" cy="15.5" r="2.5"></circle><line x1="17.5" y1="17.5" x2="21" y2="21"></line></svg>;
const CodeInterpreterIcon = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="16 18 22 12 16 6"></polyline><polyline points="8 6 2 12 8 18"></polyline><line x1="12" y1="4" x2="10" y2="20"></line></svg>;

interface TextInputProps {
  onSendMessage: (message: string) => void;
}

export default function TextInput({ onSendMessage }: TextInputProps) {
  const [text, setText] = useState('');
  // Use the custom hook to manage the upload menu
  const {
    isOpen: isUploadMenuOpen,
    setIsOpen: setIsUploadMenuOpen,
    popupRef: uploadMenuRef,
  } = usePopup();

  const handleSend = () => {
    if (text.trim()) {
      onSendMessage(text);
      setText('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div ref={uploadMenuRef} className="relative">
      {/* --- Upload Menu --- */}
      {isUploadMenuOpen && (
        <div className="absolute bottom-full mb-2 w-64 rounded-xl bg-zinc-900 p-2 text-white shadow-lg">
          <ul>
            <li className="flex cursor-pointer items-center gap-3 rounded-lg p-3 hover:bg-zinc-800">
              <UploadImageIcon />
              <span>Upload Image</span>
            </li>
            <li className="flex cursor-pointer items-center gap-3 rounded-lg p-3 hover:bg-zinc-800">
              <UploadTextIcon />
              <span>Upload as Text</span>
            </li>
            <li className="flex cursor-pointer items-center gap-3 rounded-lg p-3 hover:bg-zinc-800">
              <FileSearchIcon />
              <span>Upload for File Search</span>
            </li>
            <li className="flex cursor-pointer items-center gap-3 rounded-lg p-3 hover:bg-zinc-800">
              <CodeInterpreterIcon />
              <span>Upload for Code Interpreter</span>
            </li>
          </ul>
        </div>
      )}

      {/* --- Text Input Bar --- */}
      <div className="rounded-xl border border-gray-600 bg-gray-700/80 p-2">
        <div className="relative flex items-center">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={handleKeyDown}
            className="w-full resize-none bg-transparent py-2 pl-12 pr-20 text-white placeholder-gray-400 focus:outline-none"
            placeholder="Message GPT-4o..."
            rows={1}
          />
          <div className="absolute left-4 flex items-center gap-2 text-gray-400">
            <button onClick={() => setIsUploadMenuOpen(!isUploadMenuOpen)} className="transition-colors hover:text-white">
              <PaperclipIcon />
            </button>
          </div>
          <div className="absolute right-4 flex items-center gap-2 text-gray-400">
            <button className="transition-colors hover:text-white"><MicIcon /></button>
            <button 
              onClick={handleSend}
              className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 text-white transition-colors hover:bg-blue-700 disabled:bg-gray-600"
              disabled={!text.trim()}
            >
              <ArrowUpIcon />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
