// src/components/MyFilesModal.tsx

import React, { useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// --- Reusable Spinner Component ---
const SpinnerIcon = () => (
    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
);

// --- Type and Props Definitions ---
export interface ManagedFile {
  id: string;
  name: string;
  uploadDate: string;
}

interface MyFilesModalProps {
  isOpen: boolean;
  onClose: () => void;
  files: ManagedFile[];
  onFileUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onDeleteFile: (fileId: string) => void;
  isUploading: boolean;
  uploadError: string | null;
  isRagActive: boolean; // Prop to control the disabled state
}

// --- Icon Components ---
const UploadIcon = () => <svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 mr-2" xmlns="http://www.w3.org/2000/svg"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" y1="3" x2="12" y2="15"></line></svg>;
const TrashIcon = () => <svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4" xmlns="http://www.w3.org/2000/svg"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>;
const CloseIcon = () => <svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6" xmlns="http://www.w3.org/2000/svg"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>;

export default function MyFilesModal({
  isOpen,
  onClose,
  files,
  onFileUpload,
  onDeleteFile,
  isUploading,
  uploadError,
  isRagActive,
}: MyFilesModalProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -50, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="relative flex flex-col w-full max-w-2xl bg-zinc-900 text-white rounded-lg shadow-xl border border-zinc-700"
            onClick={(e) => e.stopPropagation()}
          >
            <header className="flex items-center justify-between p-4 border-b border-zinc-700">
              <h2 className="text-xl font-semibold">My Files</h2>
              <button onClick={onClose} className="p-1 rounded-full text-gray-400 hover:bg-zinc-700 hover:text-white transition-colors">
                <CloseIcon />
              </button>
            </header>

            <main className="p-4 space-y-3 overflow-y-auto max-h-[60vh]">
              {files.length > 0 ? (
                files.map((file) => (
                  <div key={file.id} className="flex items-center justify-between p-3 bg-zinc-800 rounded-md">
                    <div>
                      <p className="font-medium">{file.name}</p>
                      <p className="text-xs text-gray-400">Uploaded: {file.uploadDate}</p>
                    </div>
                    <button onClick={() => onDeleteFile(file.id)} className="text-gray-500 hover:text-red-500 p-2 rounded-full transition-colors" title={`Delete ${file.name}`}>
                      <TrashIcon />
                    </button>
                  </div>
                ))
              ) : (
                <div className="text-center py-12 text-gray-500">
                  <p className="text-lg">No files uploaded yet.</p>
                  <p className="text-sm">Click "Upload File" to get started.</p>
                </div>
              )}
            </main>
            
            <footer className="flex flex-col items-stretch p-4 border-t border-zinc-700">
              {uploadError && (
                <div className="w-full p-3 mb-3 text-center text-red-400 bg-red-900/50 border border-red-500/50 rounded-md">
                  <p><strong>Upload Failed:</strong> {uploadError}</p>
                </div>
              )}
              <div className="relative flex justify-end w-full group">
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={onFileUpload}
                  className="hidden"
                  accept=".pdf,.txt,.md"
                />
                <button
                  onClick={handleUploadClick}
                  disabled={isUploading || isRagActive}
                  className="flex items-center justify-center px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-md font-semibold transition-colors disabled:bg-zinc-600 disabled:cursor-not-allowed w-36"
                >
                  {isUploading ? <SpinnerIcon /> : <UploadIcon />}
                  <span className="ml-2">{isUploading ? 'Processing...' : 'Upload File'}</span>
                </button>
                {isRagActive && (
                    <div className="absolute bottom-full mb-2 hidden group-hover:block px-3 py-2 text-sm font-medium text-white bg-zinc-900 rounded-lg shadow-lg border border-zinc-700 w-max">
                        Disable RAG mode in the chat to upload new files.
                    </div>
                )}
              </div>
            </footer>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
