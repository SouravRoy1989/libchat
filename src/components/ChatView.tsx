import React, { useState, useRef, useEffect } from 'react';
import Landing from './chat/Landing';
import Messages from './chat/Messages';
import ModelSelector from './chat/ModelSelector';
import Logo from './Logo';
import { Message } from '../services/chatApi';

// --- Icons (from your original code) ---
const PaperclipIcon = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"></path></svg>;
const MicIcon = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"></path><path d="M19 10v2a7 7 0 0 1-14 0v-2"></path><line x1="12" y1="19" x2="12" y2="23"></line></svg>;
const ArrowUpIcon = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="19" x2="12" y2="5"></line><polyline points="5 12 12 5 19 12"></polyline></svg>;
const UploadImageIcon = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg>;
const UploadTextIcon = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line></svg>;
const CloseIcon = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>;
const FileIcon = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"></path><polyline points="13 2 13 9 20 9"></polyline></svg>;
const DeepResearchIcon = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 14.5L19 19"></path><path d="M11 18C14.866 18 18 14.866 18 11C18 7.13401 14.866 4 11 4C7.13401 4 4 7.13401 4 11C4 14.866 7.13401 18 11 18Z"></path><path d="M2 22L7 17"></path></svg>;

// --- TextInput Component (Restored and Corrected) ---
const TextInput = ({ onSendMessage, isRagActive, onRagToggle }: {
    onSendMessage: (message: string, image?: File, textFile?: File) => void;
    isRagActive: boolean;
    onRagToggle: () => void;
}) => {
    const [text, setText] = useState('');
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [textFile, setTextFile] = useState<File | null>(null);
    const [isUploadMenuOpen, setIsUploadMenuOpen] = useState(false);
    const uploadMenuRef = useRef<HTMLDivElement>(null);
    const imageInputRef = useRef<HTMLInputElement>(null);
    const textFileInputRef = useRef<HTMLInputElement>(null);

    // Effect to handle closing the popup menu when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (uploadMenuRef.current && !uploadMenuRef.current.contains(event.target as Node)) {
                setIsUploadMenuOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [uploadMenuRef]);

    const removeImage = () => {
        setImageFile(null);
        setImagePreview(null);
        if (imageInputRef.current) imageInputRef.current.value = "";
    };

    const removeTextFile = () => {
        setTextFile(null);
        if (textFileInputRef.current) textFileInputRef.current.value = "";
    };

    const handleSend = () => {
        if (text.trim() || imageFile || textFile) {
            onSendMessage(text, imageFile ?? undefined, textFile ?? undefined);
            setText('');
            removeImage();
            removeTextFile();
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    const handleImageUploadClick = () => {
        setIsUploadMenuOpen(false);
        imageInputRef.current?.click();
    };
    
    const handleTextUploadClick = () => {
        setIsUploadMenuOpen(false);
        textFileInputRef.current?.click();
    };

    const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            removeTextFile();
            setImageFile(file);
            setImagePreview(URL.createObjectURL(file));
        }
    };
    
    const handleTextFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            removeImage();
            setTextFile(file);
        }
    };
    
    return (
        <div ref={uploadMenuRef} className="relative">
            {isUploadMenuOpen && (
                <div className="absolute bottom-full mb-2 w-60 rounded-xl bg-zinc-900 p-1 text-white shadow-lg">
                    <ul>
                        <li onClick={handleImageUploadClick} className="flex cursor-pointer items-center gap-3 rounded-lg p-2 hover:bg-zinc-800">
                            <UploadImageIcon />
                            <span className="text-sm">Upload Image</span>
                        </li>
                        <li onClick={handleTextUploadClick} className="flex cursor-pointer items-center gap-3 rounded-lg p-2 hover:bg-zinc-800">
                            <UploadTextIcon />
                            <span className="text-sm">Upload a File</span>
                        </li>
                    </ul>
                </div>
            )}

            <input type="file" ref={imageInputRef} onChange={handleImageChange} className="hidden" accept="image/jpeg, image/png, image/webp, image/gif" />
            <input type="file" ref={textFileInputRef} onChange={handleTextFileChange} className="hidden" accept=".pdf,.doc,.docx,.txt,.md" />

            <div className="rounded-xl border border-gray-600 bg-gray-700/80 p-2">
                <div className="flex flex-wrap gap-2 mb-2">
                    {imagePreview && (
                        <div className="relative w-fit">
                            <img src={imagePreview} alt="Preview" className="h-20 w-20 rounded-lg object-cover" />
                            <button onClick={removeImage} className="absolute -top-2 -right-2 flex h-6 w-6 items-center justify-center rounded-full bg-gray-800 text-white transition-colors hover:bg-gray-600">
                                <CloseIcon />
                            </button>
                        </div>
                    )}
                    {textFile && (
                        <div className="relative flex items-center gap-2 rounded-lg bg-zinc-800 p-2">
                            <FileIcon />
                            <span className="text-sm text-white">{textFile.name}</span>
                            <button onClick={removeTextFile} className="flex h-6 w-6 items-center justify-center rounded-full text-white transition-colors hover:bg-gray-600">
                                <CloseIcon />
                            </button>
                        </div>
                    )}
                </div>

                <div className="relative flex items-center">
                    <div className="absolute left-4 flex items-center gap-3 text-gray-400">
                        <button
                            onClick={onRagToggle}
                            className={`relative transition-colors ${isRagActive ? 'text-blue-400 hover:text-blue-300' : 'hover:text-white'}`}
                            title={isRagActive ? "DB Doc Response Only ON" : "DB Doc Response Only OFF"}
                        >
                            <DeepResearchIcon />
                            {isRagActive && (
                                <span className="absolute -top-1 -right-1 block h-2 w-2 rounded-full bg-blue-500 border border-gray-700/80"></span>
                            )}
                        </button>
                        <button 
                            onClick={() => setIsUploadMenuOpen(!isUploadMenuOpen)} 
                            disabled={isRagActive} // This is the fix
                            className="transition-colors hover:text-white disabled:text-gray-600 disabled:cursor-not-allowed"
                            title={isRagActive ? "Disable RAG mode to attach files" : "Attach file"}
                        >
                            <PaperclipIcon />
                        </button>
                    </div>

                    <textarea
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        onKeyDown={handleKeyDown}
                        className="w-full resize-none bg-transparent py-2 pl-24 pr-20 text-white placeholder-gray-400 focus:outline-none"
                        placeholder="Message..."
                        rows={1}
                    />

                    <div className="absolute right-4 flex items-center gap-2 text-gray-400">
                        <button className="transition-colors hover:text-white"><MicIcon /></button>
                        <button 
                            onClick={handleSend}
                            className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 text-white transition-colors hover:bg-blue-700 disabled:bg-gray-600"
                            disabled={!text.trim() && !imageFile && !textFile}
                        >
                            <ArrowUpIcon />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}


// --- ChatView Component (Restored) ---
interface ChatViewProps {
  isNewChat: boolean;
  isSidebarOpen: boolean;
  messages: Message[];
  onSendMessage: (message: string, model: string, image?: File, textFile?: File, isRagActive?: boolean) => void;
  isRagActive: boolean;
  setIsRagActive: (isActive: boolean) => void;
  selectedModel: string;
  setSelectedModel: (model: string) => void;
}

export default function ChatView({
  isNewChat,
  isSidebarOpen,
  messages,
  onSendMessage,
  isRagActive,
  setIsRagActive,
  selectedModel,
  setSelectedModel,
}: ChatViewProps) {

  const handleLocalSendMessage = (message: string, image?: File, textFile?: File) => {
    onSendMessage(message, selectedModel, image, textFile, isRagActive);
  };

  const headerContent = (
    <div className="flex items-center gap-2">
      <Logo />
      <ModelSelector selectedModel={selectedModel} setSelectedModel={setSelectedModel} />
    </div>
  );

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
