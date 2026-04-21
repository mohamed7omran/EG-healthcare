"use client";
import { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ChatbotMessage } from "@/types";
import { cn } from "@/lib/utils";

export function ChatbotWidget() {
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<ChatbotMessage[]>([
    {
      id: "welcome",
      content:
        "Hello! I'm your EGhealthcare assistant. How can I help you today?",
      isBot: true,
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  const sleep = (ms: number) =>
    new Promise((resolve) => setTimeout(resolve, ms));

  const getErrorMessageForStatus = (status: number) => {
    if (status === 429) {
      return "Rate limit reached. Please wait a few seconds and try again.";
    }
    if (status === 503) {
      return "The AI service is busy right now. Please try again shortly.";
    }
    return "Sorry, the assistant is currently unavailable. Please try again.";
  };

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;
    const messageText = input.trim();

    const userMessage: ChatbotMessage = {
      id: `user-${Date.now()}`,
      content: messageText,
      isBot: false,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const maxRetries = 1;
      let response: Response | null = null;

      for (let attempt = 0; attempt <= maxRetries; attempt++) {
        response = await fetch(`${apiBaseUrl}/ai/chat`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ message: messageText }),
        });

        if (response.ok) {
          break;
        }

        if ((response.status === 429 || response.status === 503) && attempt < maxRetries) {
          await sleep(1200);
          continue;
        }

        const backendError =
          ((await response.json().catch(() => null)) as { message?: string } | null)
            ?.message || getErrorMessageForStatus(response.status);
        throw new Error(backendError);
      }

      if (!response?.ok) {
        throw new Error("Failed to fetch chatbot response");
      }

      const data = (await response.json()) as { reply?: string };
      const botMessage: ChatbotMessage = {
        id: `bot-${Date.now()}`,
        content:
          data.reply?.trim() ||
          "Sorry, I could not generate a response right now.",
        isBot: true,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      const errorText =
        error instanceof Error && error.message
          ? error.message
          : "Sorry, the assistant is currently unavailable. Please try again.";
      const errorMessage: ChatbotMessage = {
        id: `bot-error-${Date.now()}`,
        content: errorText,
        isBot: true,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSend();
    }
  };

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(true)}
        className={cn(
          "fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full shadow-elevated transition-all duration-300 hover:scale-105",
          "gradient-primary",
          isOpen && "scale-0 opacity-0",
        )}
      >
        <MessageCircle className="h-6 w-6 text-primary-foreground" />
      </button>

      {/* Chat Window */}
      <div
        className={cn(
          "fixed bottom-6 right-6 z-50 w-96 overflow-hidden rounded-2xl border border-border bg-card shadow-elevated transition-all duration-300",
          isOpen
            ? "scale-100 opacity-100"
            : "pointer-events-none scale-95 opacity-0",
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between gradient-primary px-4 py-3">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-foreground/20">
              <MessageCircle className="h-4 w-4 text-primary-foreground" />
            </div>
            <div>
              <h3 className="font-semibold text-primary-foreground">
                Help Assistant
              </h3>
              <p className="text-xs text-primary-foreground/80">
                Always here to help
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="rounded-full p-1 text-primary-foreground/80 transition-colors hover:bg-primary-foreground/10 hover:text-primary-foreground"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Messages */}
        <ScrollArea className="h-80 p-4">
          <div className="space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={cn(
                  "flex",
                  message.isBot ? "justify-start" : "justify-end",
                )}
              >
                <div
                  className={cn(
                    "max-w-[80%] rounded-2xl px-4 py-2.5 text-sm",
                    message.isBot
                      ? "bg-secondary text-secondary-foreground rounded-bl-md"
                      : "gradient-primary text-primary-foreground rounded-br-md",
                  )}
                >
                  {message.content}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="max-w-[80%] rounded-2xl rounded-bl-md bg-secondary px-4 py-2.5 text-sm text-secondary-foreground">
                  Thinking...
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>

        {/* Input */}
        <div className="border-t border-border p-4">
          <div className="flex gap-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              disabled={isLoading}
              placeholder="Type your question..."
              className="flex-1"
            />
            <Button
              onClick={handleSend}
              size="icon"
              disabled={isLoading || !input.trim()}
              className="gradient-primary border-0"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
