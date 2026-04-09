import { useState, useRef, useEffect, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  MessageCircle,
  X,
  Send,
  Trash2,
  FileText,
  Sparkles,
  Scale,
  CheckCircle,
  ClipboardList,
  Minimize2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ChatMessageComponent } from "@/components/ChatMessage";
import { useChat } from "@/hooks/useChat";

const QUICK_ACTIONS = [
  {
    label: "Create an MOU",
    icon: FileText,
    prompt:
      "Help me create a Memorandum of Understanding. Ask me for the required details like party names, project description, date, and amount.",
  },
  {
    label: "Review legal clauses",
    icon: Scale,
    prompt:
      "I want to review a document for missing legal clauses. I'll paste the document content — please analyze it for legal completeness.",
  },
  {
    label: "Fix grammar",
    icon: CheckCircle,
    prompt:
      "I have a document with grammar issues. I'll paste the text — please correct all grammatical errors and improve the language while maintaining the original meaning.",
  },
  {
    label: "Summarize document",
    icon: ClipboardList,
    prompt:
      "I want to summarize a document. I'll paste the content — please provide a structured summary with key parties, purpose, terms, financial details, and risk assessment.",
  },
];

export function ChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [showDocInput, setShowDocInput] = useState(false);
  const [docContent, setDocContent] = useState("");

  const { messages, isLoading, sendMessage, analyzeDocumentContent, clearChat, retryLast } =
    useChat();

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const chatPanelRef = useRef<HTMLElement>(null);

  // Auto-scroll to bottom when new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [isOpen]);

  // Ctrl+K keyboard shortcut
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      }
      if (e.key === "Escape" && isOpen) {
        setIsOpen(false);
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  const handleSend = useCallback(async () => {
    const trimmed = inputValue.trim();
    if (!trimmed || isLoading) return;
    setInputValue("");
    await sendMessage(trimmed);
  }, [inputValue, isLoading, sendMessage]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleQuickAction = async (prompt: string) => {
    await sendMessage(prompt);
  };

  const handleDocAnalysis = async () => {
    if (!docContent.trim()) return;
    setShowDocInput(false);
    await analyzeDocumentContent(docContent);
    setDocContent("");
  };

  const showQuickActions = messages.length <= 1;

  return (
    <>
      {/* Floating Action Button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
            className="fixed bottom-6 right-6 z-50"
          >
            <button
              onClick={() => setIsOpen(true)}
              className="chat-fab group"
              aria-label="Open AI Assistant (Ctrl+K)"
              title="Open AI Assistant (Ctrl+K)"
              id="chat-fab-button"
            >
              <MessageCircle className="w-6 h-6 text-white" />
              <div className="chat-fab-pulse" aria-hidden="true" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Chat Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.aside
            ref={chatPanelRef}
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 400, damping: 30 }}
            className="chat-panel"
            role="complementary"
            aria-label="AI Chat Assistant"
            id="chat-panel"
          >
            {/* Header */}
            <header className="chat-panel-header">
              <div className="flex items-center gap-2">
                <div className="chat-header-icon" aria-hidden="true">
                  <Sparkles className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h2 className="text-sm font-semibold text-foreground">
                    DocuGen AI
                  </h2>
                  <p className="text-[10px] text-muted-foreground">
                    Powered by DeepSeek AI
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={clearChat}
                  className="p-1.5 rounded-lg hover:bg-accent transition-colors"
                  aria-label="Clear chat"
                  title="Clear chat"
                  id="chat-clear-button"
                >
                  <Trash2 className="w-4 h-4 text-muted-foreground" />
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1.5 rounded-lg hover:bg-accent transition-colors"
                  aria-label="Minimize chat (Esc)"
                  title="Minimize chat (Esc)"
                  id="chat-close-button"
                >
                  <Minimize2 className="w-4 h-4 text-muted-foreground" />
                </button>
              </div>
            </header>

            {/* Messages Area */}
            <div className="chat-messages-area" id="chat-messages">
              {messages.map((msg) => (
                <ChatMessageComponent
                  key={msg.id}
                  message={msg}
                  onRetry={msg.isError ? retryLast : undefined}
                />
              ))}

              {/* Quick Actions — shown only for first interaction */}
              {showQuickActions && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="grid grid-cols-2 gap-2 mt-2"
                >
                  {QUICK_ACTIONS.map((action) => (
                    <button
                      key={action.label}
                      onClick={() => handleQuickAction(action.prompt)}
                      disabled={isLoading}
                      className="chat-quick-action"
                      id={`quick-action-${action.label.replace(/\s+/g, "-").toLowerCase()}`}
                    >
                      <action.icon className="w-3.5 h-3.5 shrink-0" />
                      <span className="text-[11px] leading-tight">{action.label}</span>
                    </button>
                  ))}
                </motion.div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Document Input Mode */}
            <AnimatePresence>
              {showDocInput && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="border-t border-border overflow-hidden"
                >
                  <div className="p-3 space-y-2">
                    <p className="text-[11px] font-medium text-muted-foreground">
                      Paste your document content below:
                    </p>
                    <textarea
                      value={docContent}
                      onChange={(e) => setDocContent(e.target.value)}
                      className="w-full h-24 p-2 text-xs rounded-lg border border-border bg-background resize-none focus:outline-none focus:ring-1 focus:ring-ring"
                      placeholder="Paste document text here..."
                      id="doc-analysis-input"
                    />
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setShowDocInput(false);
                          setDocContent("");
                        }}
                        className="flex-1 text-xs h-7"
                      >
                        Cancel
                      </Button>
                      <Button
                        size="sm"
                        onClick={handleDocAnalysis}
                        disabled={!docContent.trim() || isLoading}
                        className="flex-1 text-xs h-7"
                      >
                        Analyze
                      </Button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Input Area */}
            <footer className="chat-input-area">
              <div className="flex items-center gap-1 mb-2">
                <button
                  onClick={() => setShowDocInput(!showDocInput)}
                  className={`p-1.5 rounded-lg transition-colors text-muted-foreground ${
                    showDocInput
                      ? "bg-primary text-primary-foreground"
                      : "hover:bg-accent"
                  }`}
                  aria-label="Analyze document"
                  title="Paste a document for analysis"
                  id="doc-upload-button"
                >
                  <FileText className="w-4 h-4" />
                </button>
                <span className="text-[10px] text-muted-foreground ml-1">
                  {isLoading ? "AI is thinking..." : "Ctrl+K to toggle"}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <input
                  ref={inputRef}
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder={
                    isLoading ? "Wait for response..." : "Ask anything..."
                  }
                  disabled={isLoading}
                  className="flex-1 bg-accent/50 rounded-xl px-4 py-2.5 text-xs placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring transition-all disabled:opacity-50"
                  aria-label="Type your message"
                  id="chat-input"
                />
                <button
                  onClick={handleSend}
                  disabled={!inputValue.trim() || isLoading}
                  className="chat-send-button"
                  aria-label="Send message"
                  id="chat-send-button"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </footer>
          </motion.aside>
        )}
      </AnimatePresence>
    </>
  );
}
