import React, { useState } from 'react';

const PaperclipIcon = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"></path></svg>;
const MicIcon = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"></path><path d="M19 10v2a7 7 0 0 1-14 0v-2"></path><line x1="12" y1="19" x2="12" y2="23"></line></svg>;
const ArrowUpIcon = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="19" x2="12" y2="5"></line><polyline points="5 12 12 5 19 12"></polyline></svg>;

interface TextInputProps {
  onSendMessage: (message: string) => void;
}

export default function TextInput({ onSendMessage }: TextInputProps) {
  const [text, setText] = useState('');

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
          <button className="transition-colors hover:text-white"><PaperclipIcon /></button>
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
  );
}
