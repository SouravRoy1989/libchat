// src/components/chat/ModelSelector.tsx
import React, { useState, useEffect } from 'react';

// Define the props the component will accept
interface ModelSelectorProps {
  selectedModel: string;
  setSelectedModel: (model: string) => void;
}

// Define a type for the model structure
interface Model {
  name: string;
  provider: string;
}

export default function ModelSelector({ selectedModel, setSelectedModel }: ModelSelectorProps) {
  const [models, setModels] = useState<Model[]>([]);

  useEffect(() => {
    // Fetches the model configuration from your backend
    const fetchModels = async () => {
      try {
        const response = await fetch('http://localhost:8000/api/config');
        const config = await response.json();
        
        // Flattens the nested model data into a single array
        const allModels: Model[] = [];
        for (const provider in config.endpoints) {
          if (config.endpoints[provider].models) {
            config.endpoints[provider].models.forEach((modelName: string) => {
              allModels.push({ name: modelName, provider });
            });
          }
        }
        setModels(allModels);

        // If no model is selected yet, set the first one as the default
        if (!selectedModel && allModels.length > 0) {
          setSelectedModel(allModels[0].name);
        }
      } catch (error) {
        console.error("Failed to fetch models:", error);
      }
    };

    fetchModels();
  }, [setSelectedModel, selectedModel]); // Effect runs when the component mounts

  return (
    <select
      value={selectedModel}
      onChange={(e) => setSelectedModel(e.target.value)}
      className="bg-zinc-700 text-white rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
    >
      {models.map((model) => (
        <option key={`${model.provider}-${model.name}`} value={model.name}>
          {model.name}
        </option>
      ))}
    </select>
  );
}
