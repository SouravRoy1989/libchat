// src/services/chatApi.ts

import axios from 'axios';

const API_URL = 'http://localhost:8000/api';

// --- DATA STRUCTURES ---
export interface Message {
  role: 'user' | 'ai';
  content: string;
}

export interface Conversation {
  id: string;
  title: string;
  messages: Message[];
}

interface ChatResponse {
  ai_response: string;
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

export const postChatMessage = async (
  email: string,
  message: string,
  conversationId: string | null
): Promise<ChatResponse> => {
  const payload = {
    user_email: email,
    human_text: message,
    conversation_id: conversationId,
    user_model: 'gpt-4o',
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
 * NEW FUNCTION: Calls the backend to log the user out.
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