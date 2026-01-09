'use client';

import { useEffect } from 'react';
import { Header } from '@/components/layout/Header';
import { Sidebar } from '@/components/layout/Sidebar';
import { ChatWindow } from '@/components/chat';
import { useAuth, useRequireAuth } from '@/hooks/useAuth';
import { useChat } from '@/hooks/useChat';
import { Trash2, Plus } from 'lucide-react';

export default function ChatPage() {
  const { isLoading: authLoading } = useRequireAuth();
  const { user, logout } = useAuth();
  const {
    messages,
    isLoading: chatLoading,
    error,
    sendMessage,
    loadHistory,
    clearHistory,
    startNewConversation,
  } = useChat();

  // Load chat history on mount
  useEffect(() => {
    loadHistory().catch(() => {
      // Ignore errors on initial load
    });
  }, [loadHistory]);

  if (authLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#1C1C1C]">
        <div className="text-[#A1A1A1]">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#1C1C1C]">
      <Header user={user} onLogout={logout} />

      <div className="flex">
        <Sidebar />

        <main className="flex-1 lg:ml-64">
          {/* Page header with actions */}
          <div className="flex items-center justify-between p-6 pb-0">
            <div>
              <h1 className="text-2xl font-bold text-white">AI Assistant</h1>
              <p className="text-sm text-[#A1A1A1]">
                Manage tasks in English or Hinglish
              </p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={startNewConversation}
                className="flex items-center gap-2 px-4 py-2 bg-[#2A2A2A] text-gray-300 rounded-lg
                           hover:bg-[#3A3A3A] transition-colors text-sm"
              >
                <Plus className="w-4 h-4" />
                New Chat
              </button>
              <button
                onClick={() => clearHistory()}
                className="flex items-center gap-2 px-4 py-2 bg-[#2A2A2A] text-gray-300 rounded-lg
                           hover:bg-red-600 hover:text-white transition-colors text-sm"
              >
                <Trash2 className="w-4 h-4" />
                Clear
              </button>
            </div>
          </div>

          {/* Error display */}
          {error && (
            <div className="mx-6 mt-4 p-4 bg-red-900/50 border border-red-600 rounded-lg text-red-200 text-sm">
              {error}
            </div>
          )}

          {/* Chat window */}
          <div className="h-[calc(100vh-140px)] p-6">
            <div className="h-full rounded-xl border border-[#3A3A3A] overflow-hidden">
              <ChatWindow
                messages={messages}
                onSendMessage={sendMessage}
                isLoading={chatLoading}
              />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
