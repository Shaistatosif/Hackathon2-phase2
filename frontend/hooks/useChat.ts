/**
 * Chat hook for AI chatbot interaction
 */
'use client';

import { useCallback, useState } from 'react';
import { api } from '@/lib/api';
import type {
  ChatMessageResponse,
  Message,
  TaskActionResponse,
} from '@/types';

interface ChatMessage {
  message: Message;
  taskAction?: TaskActionResponse;
}

export function useChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sendMessage = useCallback(async (content: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await api.sendMessage({
        message: content,
        conversationId: conversationId || undefined,
      });

      // Add user message
      const userMessage: ChatMessage = {
        message: response.userMessage,
      };

      // Add assistant message with task action
      const assistantMessage: ChatMessage = {
        message: response.assistantMessage,
        taskAction: response.taskAction,
      };

      setMessages((prev) => [...prev, userMessage, assistantMessage]);

      // Update conversation ID for follow-up messages
      if (response.userMessage.conversationId) {
        setConversationId(response.userMessage.conversationId);
      }

      return response;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to send message';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [conversationId]);

  const loadHistory = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await api.getChatHistory();

      if (response.conversations.length > 0) {
        const latestConversation = response.conversations[0];
        setConversationId(latestConversation.id);

        // Load messages from the latest conversation
        if (latestConversation.messages) {
          const loadedMessages: ChatMessage[] = latestConversation.messages.map(
            (msg) => ({
              message: msg,
            })
          );
          setMessages(loadedMessages);
        }
      }

      return response;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load chat history');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const clearHistory = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      await api.clearChatHistory();
      setMessages([]);
      setConversationId(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to clear chat history');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const startNewConversation = useCallback(() => {
    setMessages([]);
    setConversationId(null);
    setError(null);
  }, []);

  return {
    messages,
    conversationId,
    isLoading,
    error,
    sendMessage,
    loadHistory,
    clearHistory,
    startNewConversation,
  };
}
