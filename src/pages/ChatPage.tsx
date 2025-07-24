// src/pages/ChatPage.tsx

import React, { useState, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import SideNav from '../components/SideNav';
import ChatView from '../components/ChatView';
import OpenSidebarButton from '../components/OpenSidebarButton';
import SettingsModal from '../components/modals/SettingsModal';
import { useAuth } from '../contexts/AuthContext';
import { fetchUserWithHistory, deleteConversation, Conversation, Message } from '../services/chatApi';

export default function ChatPage() {
  const { user } = useAuth();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isRagActive, setIsRagActive] = useState(false);


  const refreshConversations = () => {
    if (user) {
      fetchUserWithHistory().then(data => {
        setConversations(data.chat_history.reverse());
      });
    }
  };
  useEffect(() => { refreshConversations(); }, [user]);
  useEffect(() => {
    if (activeConversationId) {
      const activeConvo = conversations.find(c => c.id === activeConversationId);
      setMessages(activeConvo ? activeConvo.messages : []);
    } else {
      setMessages([]);
    }
  }, [activeConversationId, conversations]);
  
  const handleConversationUpdate = (newlyCreatedConversation: Conversation | null) => {
    if (newlyCreatedConversation) {
      setActiveConversationId(newlyCreatedConversation.id);
    }
    refreshConversations();
  };
  const handleDeleteConversation = async (conversationId: string) => {
    if (!user) return;
    try {
      await deleteConversation(user.email, conversationId);
      setConversations(prev => prev.filter(c => c.id !== conversationId));
      if (activeConversationId === conversationId) {
        setActiveConversationId(null);
      }
    } catch (error) {
      console.error("Could not delete conversation:", error);
    }
  };
  const handleSendMessage = async (message: string, image?: File, textFile?: File, useRag?: boolean) => {
    if (!user) return;
    const userMessage: Message = { role: 'user', content: message || (image ? "Image uploaded" : "File uploaded") };
    setMessages(prev => [...prev, userMessage]);
    try {
      let data;
      let response;
      const model = 'gpt-4o';
      const textEndpoint = useRag ? 'invoke_rag' : 'invoke';
      const imageEndpoint = useRag ? 'invoke_rag_with_image' : 'invoke_with_image';
      const fileEndpoint = useRag ? 'invoke_rag_with_text_file' : 'invoke_with_text_file';
      if (image) {
        const formData = new FormData();
        formData.append('user_email', user.email);
        formData.append('model_name', model);
        formData.append('user_message', message);
        formData.append('image_file', image);
        if (activeConversationId) formData.append('conversation_id', activeConversationId);
        response = await fetch(`http://localhost:8000/api/chat/${imageEndpoint}`, { method: 'POST', body: formData });
      } else if (textFile) {
        const formData = new FormData();
        formData.append('user_email', user.email);
        formData.append('model_name', model);
        formData.append('user_message', message);
        formData.append('text_file', textFile);
        if (activeConversationId) formData.append('conversation_id', activeConversationId);
        response = await fetch(`http://localhost:8000/api/chat/${fileEndpoint}`, { method: 'POST', body: formData });
      } else {
        const payload = {
          human_text: message,
          user_email: user.email,
          user_model: model,
          conversation_id: activeConversationId,
        };
        response = await fetch(`http://localhost:8000/api/chat/${textEndpoint}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
      }
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      data = await response.json();
      const aiMessage: Message = { role: 'ai', content: data.ai_response };
      setMessages(prev => [...prev, aiMessage]);
      handleConversationUpdate(data.new_conversation || null);
    } catch (error) {
      console.error("Failed to fetch response from backend:", error);
      const errorMessage: Message = { role: 'ai', content: "Sorry, I couldn't connect to the server." };
      setMessages(prev => [...prev, errorMessage]);
    }
  };

  
  const handleNewChat = () => {
    setActiveConversationId(null);
    setMessages([]);
    // Add this line to reset the RAG toggle to its default inactive state
    setIsRagActive(false);
  };

  return (
    <>
      <div className="flex h-screen w-full bg-zinc-800 text-white">
        <AnimatePresence>
          {isSidebarOpen && (
            <SideNav
              setIsSidebarOpen={setIsSidebarOpen}
              onNewChat={handleNewChat}
              conversations={conversations}
              onSelectConversation={setActiveConversationId}
              onDeleteConversation={handleDeleteConversation}
              activeConversationId={activeConversationId}
              onOpenSettings={() => setIsSettingsOpen(true)}
            />
          )}
        </AnimatePresence>
        <main className="relative flex-1">
          {!isSidebarOpen && (
            <OpenSidebarButton onClick={() => setIsSidebarOpen(true)} />
          )}
          <ChatView
            isNewChat={activeConversationId === null && messages.length === 0}
            isSidebarOpen={isSidebarOpen}
            messages={messages}
            onSendMessage={handleSendMessage}
            isRagActive={isRagActive}
            setIsRagActive={setIsRagActive}
          />
        </main>
      </div>
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
      />
    </>
  );
}