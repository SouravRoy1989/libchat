import axios from 'axios';

const API_URL = 'http://localhost:8000/api';

// --- DATA STRUCTURES ---

/**
 * Represents a single source document from a RAG response.
 */
export interface RagSource {
  name: string;
  path: string;
}

/**
 * Represents the structured content of a RAG response.
 */
export interface RagResponse {
  content: string; // The textual answer
  sources: RagSource[]; // The array of source documents
}

/**
 * Represents a single message in a conversation.
 * The 'content' can now be a simple string or a complex RAG object.
 */
export interface Message {
  role: 'user' | 'ai';
  content: string | RagResponse;
}

export interface Conversation {
  id: string;
  title: string;
  messages: Message[];
  rag_mode?: number; // Optional field to track if a conversation is RAG
}

/**
 * The expected response structure from a chat API call.
 * The 'ai_response' can be a string or a RAG object.
 */
interface ChatResponse {
  ai_response: string | RagResponse;
  new_conversation: Conversation | null;
}

// --- API FUNCTIONS ---
export const fetchUserWithHistory = async (): Promise<{ chat_history: Conversation[] }> => {
  try {
    const response = await axios.get<{ chat_history: Conversation[] }>(`${API_URL}/user`, {
      withCredentials: true,
    });
    return response.data?.chat_history ? { chat_history: response.data.chat_history } : { chat_history: [] };
  } catch (error) {
    console.error('Failed to fetch user history:', error);
    return { chat_history: [] };
  }
};

// NOTE: Your ChatPage.tsx builds the fetch request manually.
// This function is here for completeness but is not used in your current setup.
export const postChatMessage = async (
  email: string,
  message: string,
  conversationId: string | null
): Promise<ChatResponse> => {
  const payload = {
    user_email: email,
    human_text: message,
    conversation_id: conversationId,
    user_model: 'gpt-4o', // Model is hardcoded here
  };
  const response = await axios.post<ChatResponse>(`${API_URL}/chat/invoke`, payload, {
    withCredentials: true,
  });
  return response.data;
};

export const deleteConversation = async (email: string, conversationId: string): Promise<void> => {
    try {
        const payload = { user_email: email };
        await axios.delete(`${API_URL}/chats/${conversationId}`, {
            data: payload,
            withCredentials: true,
        });
    } catch (error) {
        console.error("Failed to delete conversation:", error);
        throw error;
    }
};

/**
 * Calls the backend to log the user out.
 * This will clear the server-side session cookie.
 */
export const logoutUser = async (): Promise<void> => {
    try {
        // We send an empty object as the body for the POST request.
        await axios.post(`${API_URL}/auth/logout`, {}, {
            withCredentials: true, // This is crucial to send the cookie
        });
    } catch (error) {
        console.error("Logout API call failed:", error);
        throw error; // Propagate error to be handled by the caller
    }
};