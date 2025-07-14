import React, { useState } from 'react';
import { useModel } from '../../contexts/ModelContext';
import { Check, Settings, Search } from 'lucide-react';

// You'll need to create this icon map
const endpointIcons = {
    openAI: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0a12 12 0 100 24 12 12 0 000-24zm-2.25 18.69l-3.7-3.7a.75.75 0 011.06-1.06l2.64 2.64 5.8-5.8a.75.75 0 011.06 1.06l-6.86 6.86a.75.75 0 01-1.06 0z"/></svg>,
    google: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M21.35 11.1H12.18V13.83H18.2C17.96 15.45 16.96 16.8 15.27 17.89L15.27 20.34H18.38C20.38 18.47 21.62 15.93 21.62 12.81C21.62 12.21 21.5 11.64 21.35 11.1Z"/></svg>,
    anthropic: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/></svg>,
    groq: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M12,4A8,8 0 0,1 20,12A8,8 0 0,1 12,20A8,8 0 0,1 4,12A8,8 0 0,1 12,4Z"/></svg>
};

interface ModelMenuProps {
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function ModelMenu({ setIsOpen }: ModelMenuProps) {
  const { endpointsConfig, conversation, setConversation } = useModel();
  const [searchTerm, setSearchTerm] = useState('');

  const handleSelect = (endpoint: string, model: string) => {
    setConversation({ endpoint, model });
    setIsOpen(false);
  };

  if (!endpointsConfig) {
    return null;
  }

  const filteredEndpoints = Object.entries(endpointsConfig).filter(([endpointName, endpointData]) => 
    endpointName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    endpointData.models.some(model => model.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="absolute top-full mt-2 w-72 rounded-lg border border-gray-700 bg-gray-800 shadow-lg">
      <div className="p-2">
        <div className="relative">
          <input
            type="text"
            placeholder="Search models..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-md border-gray-600 bg-gray-700 py-2 pl-8 pr-2 text-white focus:outline-none"
          />
          <Search className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
        </div>
      </div>
      <div className="max-h-64 overflow-y-auto p-1">
        {filteredEndpoints.map(([endpointName, endpointData]) => (
          <div key={endpointName}>
            <div className="px-2 py-1.5 text-xs font-semibold text-gray-400">{endpointName.charAt(0).toUpperCase() + endpointName.slice(1)}</div>
            {endpointData.models.map((modelName) => (
              <button
                key={modelName}
                onClick={() => handleSelect(endpointName, modelName)}
                className="flex w-full items-center justify-between rounded-md px-2 py-1.5 text-left text-sm text-white transition-colors hover:bg-gray-700"
              >
                <div className="flex items-center gap-2">
                  {React.createElement(endpointIcons[endpointName] || endpointIcons.groq)}
                  <span>{modelName}</span>
                </div>
                {conversation?.model === modelName && <Check size={16} />}
              </button>
            ))}
          </div>
        ))}
      </div>
      <div className="border-t border-gray-700 p-2">
         <button className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-sm text-white transition-colors hover:bg-gray-700">
           <Settings size={16} />
           <span>Model Settings</span>
         </button>
      </div>
    </div>
  );
}
