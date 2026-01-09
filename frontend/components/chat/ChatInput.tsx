'use client';

import { useState, useRef, useEffect } from 'react';
import { Send } from 'lucide-react';

interface ChatInputProps {
  onSend: (message: string) => void;
  isLoading?: boolean;
  placeholder?: string;
}

export function ChatInput({
  onSend,
  isLoading = false,
  placeholder = 'Type a message... (Hindi/Hinglish supported)',
}: ChatInputProps) {
  const [message, setMessage] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [message]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && !isLoading) {
      onSend(message.trim());
      setMessage('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex items-end gap-2 p-4 bg-[#1C1C1C] border-t border-gray-800"
    >
      <div className="flex-1 relative">
        <textarea
          ref={textareaRef}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          disabled={isLoading}
          rows={1}
          className="w-full px-4 py-3 bg-[#2A2A2A] border border-gray-700 rounded-xl
                     text-gray-100 placeholder-gray-500 resize-none
                     focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent
                     disabled:opacity-50 disabled:cursor-not-allowed
                     max-h-32 scrollbar-thin scrollbar-thumb-gray-600"
        />
      </div>
      <button
        type="submit"
        disabled={!message.trim() || isLoading}
        className="flex-shrink-0 p-3 bg-orange-500 text-white rounded-xl
                   hover:bg-orange-600 transition-colors
                   disabled:opacity-50 disabled:cursor-not-allowed
                   focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 focus:ring-offset-[#1C1C1C]"
      >
        <Send className="w-5 h-5" />
      </button>
    </form>
  );
}
