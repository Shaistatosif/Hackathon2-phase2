'use client';

import { useEffect, useRef } from 'react';
import { MessageBubble } from './MessageBubble';
import { ChatInput } from './ChatInput';
import { TypingIndicator } from './TypingIndicator';
import type { Message, TaskActionResponse } from '@/types';

interface ChatMessage {
  message: Message;
  taskAction?: TaskActionResponse;
}

interface ChatWindowProps {
  messages: ChatMessage[];
  onSendMessage: (message: string) => void;
  isLoading?: boolean;
}

export function ChatWindow({
  messages,
  onSendMessage,
  isLoading = false,
}: ChatWindowProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  return (
    <div className="flex flex-col h-full bg-[#1C1C1C]">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 bg-[#2A2A2A] border-b border-gray-800">
        <div>
          <h2 className="text-lg font-semibold text-white">AI Assistant</h2>
          <p className="text-sm text-gray-400">
            Manage tasks with natural language
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
          <span className="text-sm text-gray-400">Online</span>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-gray-700">
        {messages.length === 0 ? (
          <WelcomeMessage />
        ) : (
          <>
            {messages.map((msg, index) => (
              <MessageBubble
                key={msg.message.id || index}
                message={msg.message}
                taskAction={msg.taskAction}
              />
            ))}
          </>
        )}

        {/* Typing indicator */}
        {isLoading && <TypingIndicator />}

        {/* Scroll anchor */}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <ChatInput onSend={onSendMessage} isLoading={isLoading} />
    </div>
  );
}

function WelcomeMessage() {
  const suggestions = [
    'Add task: Buy groceries',
    'Mujhe pending tasks dikhao',
    'Create high priority task for meeting',
    'Mark grocery task as complete',
  ];

  return (
    <div className="flex flex-col items-center justify-center h-full text-center px-4">
      <div className="w-16 h-16 bg-orange-500 rounded-full flex items-center justify-center mb-4">
        <span className="text-2xl">🤖</span>
      </div>
      <h3 className="text-xl font-semibold text-white mb-2">
        Namaste! Main aapka AI Assistant hoon
      </h3>
      <p className="text-gray-400 mb-6 max-w-md">
        I can help you manage tasks in English or Hinglish. Try saying:
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-w-lg">
        {suggestions.map((suggestion, index) => (
          <button
            key={index}
            className="px-4 py-2 bg-[#2A2A2A] text-gray-300 rounded-lg text-sm
                       hover:bg-[#3A3A3A] transition-colors text-left"
          >
            &ldquo;{suggestion}&rdquo;
          </button>
        ))}
      </div>
    </div>
  );
}
