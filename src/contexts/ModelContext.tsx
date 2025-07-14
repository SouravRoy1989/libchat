import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';

// Define types for our models and endpoints
interface Model {
  name: string;
  // Add other properties like context window, etc., if needed
}

interface Endpoint {
  apiKey: string;
  models: string[];
  // Add other endpoint-specific properties
}

interface EndpointsConfig {
  [key: string]: Endpoint;
}

interface Conversation {
  endpoint: string;
  model: string;
  // Add other conversation settings like temperature, etc.
}

interface ModelContextType {
  endpointsConfig: EndpointsConfig | null;
  conversation: Conversation | null;
  setConversation: React.Dispatch<React.SetStateAction<Conversation | null>>;
}

const ModelContext = createContext<ModelContextType | null>(null);

export function ModelProvider({ children }: { children: ReactNode }) {
  const [endpointsConfig, setEndpointsConfig] = useState<EndpointsConfig | null>(null);
  const [conversation, setConversation] = useState<Conversation | null>(null);

  // Fetch the endpoints config from the backend when the app loads
  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const response = await fetch('/api/config');
        const data = await response.json();
        setEndpointsConfig(data.endpoints);
        // Set a default conversation model
        const firstEndpoint = Object.keys(data.endpoints)[0];
        if (firstEndpoint) {
          setConversation({
            endpoint: firstEndpoint,
            model: data.endpoints[firstEndpoint].models[0],
          });
        }
      } catch (error) {
        console.error('Failed to fetch models config:', error);
      }
    };
    fetchConfig();
  }, []);

  return (
    <ModelContext.Provider value={{ endpointsConfig, conversation, setConversation }}>
      {children}
    </ModelContext.Provider>
  );
}

export const useModel = () => {
  const context = useContext(ModelContext);
  if (!context) {
    throw new Error('useModel must be used within a ModelProvider');
  }
  return context;
};

