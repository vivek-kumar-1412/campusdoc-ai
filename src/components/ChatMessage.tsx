import { motion } from "framer-motion";
import { Bot, User, Copy, Check, RotateCcw } from "lucide-react";
import { useState, useMemo } from "react";
import type { DisplayMessage } from "@/hooks/useChat";

interface ChatMessageProps {
  message: DisplayMessage;
  onRetry?: () => void;
}

/** Simple inline markdown renderer — handles bold, italic, bullets, and headers */
function renderMarkdown(text: string): JSX.Element {
  const lines = text.split("\n");

  const elements = lines.map((line, i) => {
    // Headers
    if (line.startsWith("## ")) {
      return (
        <h3 key={i} className="text-sm font-bold mt-3 mb-1 text-foreground">
          {processInline(line.slice(3))}
        </h3>
      );
    }
    if (line.startsWith("### ")) {
      return (
        <h4 key={i} className="text-xs font-bold mt-2 mb-1 text-foreground">
          {processInline(line.slice(4))}
        </h4>
      );
    }

    // Horizontal rule
    if (line.trim() === "---" || line.trim() === "___") {
      return <hr key={i} className="my-2 border-border/50" />;
    }

    // Bullet points
    if (line.trim().startsWith("- ")) {
      return (
        <li key={i} className="ml-4 text-xs leading-relaxed list-disc">
          {processInline(line.trim().slice(2))}
        </li>
      );
    }

    // Numbered lists
    const numberedMatch = line.trim().match(/^(\d+)\.\s(.+)/);
    if (numberedMatch) {
      return (
        <li key={i} className="ml-4 text-xs leading-relaxed list-decimal">
          {processInline(numberedMatch[2])}
        </li>
      );
    }

    // Empty line
    if (line.trim() === "") {
      return <br key={i} />;
    }

    // Normal paragraph
    return (
      <p key={i} className="text-xs leading-relaxed">
        {processInline(line)}
      </p>
    );
  });

  return <>{elements}</>;
}

/** Process inline markdown: **bold**, *italic*, `code` */
function processInline(text: string): (string | JSX.Element)[] {
  const parts: (string | JSX.Element)[] = [];
  // Match **bold**, *italic*, `code`
  const regex = /(\*\*(.+?)\*\*)|(\*(.+?)\*)|(`(.+?)`)/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;
  let keyIdx = 0;

  while ((match = regex.exec(text)) !== null) {
    // Push text before the match
    if (match.index > lastIndex) {
      parts.push(text.slice(lastIndex, match.index));
    }

    if (match[2]) {
      // Bold
      parts.push(
        <strong key={keyIdx++} className="font-semibold">
          {match[2]}
        </strong>
      );
    } else if (match[4]) {
      // Italic
      parts.push(
        <em key={keyIdx++} className="italic">
          {match[4]}
        </em>
      );
    } else if (match[6]) {
      // Code
      parts.push(
        <code
          key={keyIdx++}
          className="px-1 py-0.5 bg-accent/50 rounded text-[11px] font-mono"
        >
          {match[6]}
        </code>
      );
    }

    lastIndex = match.index + match[0].length;
  }

  // Push remaining text
  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex));
  }

  return parts.length > 0 ? parts : [text];
}

export function ChatMessageComponent({ message, onRetry }: ChatMessageProps) {
  const [copied, setCopied] = useState(false);
  const isUser = message.role === "user";
  const isError = message.isError;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(message.content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback: do nothing
    }
  };

  const formattedTime = useMemo(() => {
    return message.timestamp.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  }, [message.timestamp]);

  // Typing indicator for loading messages
  if (message.isLoading) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-start gap-2 chat-message-enter"
      >
        <div
          className="flex items-center justify-center w-7 h-7 rounded-full shrink-0"
          style={{ background: "hsl(var(--chat-bubble-ai))" }}
          aria-hidden="true"
        >
          <Bot className="w-3.5 h-3.5 text-foreground" />
        </div>
        <div
          className="chat-bubble-ai rounded-2xl rounded-tl-md px-4 py-3"
          role="status"
          aria-label="AI is typing"
        >
          <div className="typing-indicator" aria-hidden="true">
            <span></span>
            <span></span>
            <span></span>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className={`flex items-start gap-2 chat-message-enter ${
        isUser ? "flex-row-reverse" : ""
      }`}
    >
      {/* Avatar */}
      <div
        className={`flex items-center justify-center w-7 h-7 rounded-full shrink-0 ${
          isUser ? "chat-bubble-user" : ""
        }`}
        style={
          isUser
            ? { background: "hsl(var(--chat-bubble-user))" }
            : { background: "hsl(var(--chat-bubble-ai))" }
        }
        aria-hidden="true"
      >
        {isUser ? (
          <User className="w-3.5 h-3.5 text-primary-foreground" />
        ) : (
          <Bot className="w-3.5 h-3.5 text-foreground" />
        )}
      </div>

      {/* Message bubble */}
      <div className="group max-w-[85%] relative">
        <div
          className={`rounded-2xl px-4 py-3 ${
            isUser
              ? "chat-bubble-user rounded-tr-md text-primary-foreground"
              : "chat-bubble-ai rounded-tl-md"
          } ${isError ? "border border-destructive/30" : ""}`}
          style={{
            background: isUser
              ? "hsl(var(--chat-bubble-user))"
              : "hsl(var(--chat-bubble-ai))",
          }}
        >
          {isUser ? (
            <p className="text-xs leading-relaxed">{message.content}</p>
          ) : (
            <div className="chat-markdown">{renderMarkdown(message.content)}</div>
          )}
        </div>

        {/* Meta row: time + actions */}
        <div
          className={`flex items-center gap-2 mt-1 px-1 ${
            isUser ? "justify-end" : "justify-start"
          }`}
        >
          <span className="text-[10px] text-muted-foreground">{formattedTime}</span>

          {!isUser && (
            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                onClick={handleCopy}
                className="p-1 rounded-md hover:bg-accent transition-colors"
                aria-label="Copy message"
                title="Copy message"
              >
                {copied ? (
                  <Check className="w-3 h-3 text-success" />
                ) : (
                  <Copy className="w-3 h-3 text-muted-foreground" />
                )}
              </button>

              {isError && onRetry && (
                <button
                  onClick={onRetry}
                  className="p-1 rounded-md hover:bg-accent transition-colors"
                  aria-label="Retry"
                  title="Retry"
                >
                  <RotateCcw className="w-3 h-3 text-muted-foreground" />
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
