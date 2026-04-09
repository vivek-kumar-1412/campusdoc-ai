import { useState, useCallback, useRef, useEffect } from "react";
import { chatWithAI, analyzeDocument, type ChatMessage as AIChatMessage } from "@/lib/openai";

export interface DisplayMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  isLoading?: boolean;
  isError?: boolean;
}

interface UseChatReturn {
  messages: DisplayMessage[];
  isLoading: boolean;
  error: string | null;
  sendMessage: (content: string) => Promise<void>;
  analyzeDocumentContent: (content: string) => Promise<void>;
  clearChat: () => void;
  retryLast: () => Promise<void>;
}

const WELCOME_MESSAGE: DisplayMessage = {
  id: "welcome",
  role: "assistant",
  content: `👋 **Hello! I'm your DocuGen AI Assistant.**

I can help you with:

- 📄 **Create documents** — MoUs, Invoices, Work Orders, Purchase Orders
- ✏️ **Fix grammar** — Paste any text and I'll correct it
- ⚖️ **Legal review** — I'll check for missing legal clauses
- 📊 **Summarize documents** — Get a structured overview
- ❓ **Answer questions** — About the platform or your documents

Just type your question or use the quick actions below to get started!`,
  timestamp: new Date(),
};

export function useChat(): UseChatReturn {
  const [messages, setMessages] = useState<DisplayMessage[]>([WELCOME_MESSAGE]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const conversationRef = useRef<AIChatMessage[]>([]);
  const lastUserMessageRef = useRef<string>("");

  const addMessage = useCallback(
    (role: "user" | "assistant", content: string, extra?: Partial<DisplayMessage>) => {
      const msg: DisplayMessage = {
        id: crypto.randomUUID(),
        role,
        content,
        timestamp: new Date(),
        ...extra,
      };
      setMessages((prev) => [...prev, msg]);
      return msg.id;
    },
    []
  );

  const updateMessage = useCallback((id: string, updates: Partial<DisplayMessage>) => {
    setMessages((prev) =>
      prev.map((m) => (m.id === id ? { ...m, ...updates } : m))
    );
  }, []);

  const removeMessage = useCallback((id: string) => {
    setMessages((prev) => prev.filter((m) => m.id !== id));
  }, []);

  const sendMessage = useCallback(
    async (content: string) => {
      if (!content.trim() || isLoading) return;

      setError(null);
      lastUserMessageRef.current = content;

      // Add user message
      addMessage("user", content);

      // Add to conversation history
      conversationRef.current.push({ role: "user", content });

      // Add loading placeholder
      const loadingId = addMessage("assistant", "", { isLoading: true });
      setIsLoading(true);

      try {
        const response = await chatWithAI(conversationRef.current);

        // Update loading placeholder with actual response
        updateMessage(loadingId, {
          content: response,
          isLoading: false,
        });

        // Add to conversation history
        conversationRef.current.push({ role: "assistant", content: response });
      } catch (err) {
        const errorMsg =
          err instanceof Error ? err.message : "Something went wrong. Please try again.";
        updateMessage(loadingId, {
          content: `❌ **Error:** ${errorMsg}`,
          isLoading: false,
          isError: true,
        });
        setError(errorMsg);
      } finally {
        setIsLoading(false);
      }
    },
    [isLoading, addMessage, updateMessage]
  );

  const analyzeDocumentContent = useCallback(
    async (content: string) => {
      if (!content.trim() || isLoading) return;

      setError(null);

      addMessage("user", "📄 Please analyze this document for grammar, legal completeness, and provide a summary.");

      const loadingId = addMessage("assistant", "", { isLoading: true });
      setIsLoading(true);

      try {
        const response = await analyzeDocument(content);
        updateMessage(loadingId, {
          content: response,
          isLoading: false,
        });
      } catch (err) {
        const errorMsg =
          err instanceof Error ? err.message : "Failed to analyze document.";
        updateMessage(loadingId, {
          content: `❌ **Error:** ${errorMsg}`,
          isLoading: false,
          isError: true,
        });
        setError(errorMsg);
      } finally {
        setIsLoading(false);
      }
    },
    [isLoading, addMessage, updateMessage]
  );

  const clearChat = useCallback(() => {
    setMessages([WELCOME_MESSAGE]);
    conversationRef.current = [];
    setError(null);
  }, []);

  const retryLast = useCallback(async () => {
    if (!lastUserMessageRef.current) return;

    // Remove the last error message
    setMessages((prev) => {
      const last = prev[prev.length - 1];
      if (last?.isError) return prev.slice(0, -1);
      return prev;
    });

    // Also remove the last failed exchange from conversation history
    if (conversationRef.current.length > 0) {
      conversationRef.current.pop();
    }

    // Re-send the last message
    const lastContent = lastUserMessageRef.current;

    const loadingId = addMessage("assistant", "", { isLoading: true });
    setIsLoading(true);
    setError(null);

    conversationRef.current.push({ role: "user", content: lastContent });

    try {
      const response = await chatWithAI(conversationRef.current);
      updateMessage(loadingId, { content: response, isLoading: false });
      conversationRef.current.push({ role: "assistant", content: response });
    } catch (err) {
      const errorMsg =
        err instanceof Error ? err.message : "Something went wrong.";
      updateMessage(loadingId, {
        content: `❌ **Error:** ${errorMsg}`,
        isLoading: false,
        isError: true,
      });
      setError(errorMsg);
    } finally {
      setIsLoading(false);
    }
  }, [addMessage, updateMessage]);

  return {
    messages,
    isLoading,
    error,
    sendMessage,
    analyzeDocumentContent,
    clearChat,
    retryLast,
  };
}
