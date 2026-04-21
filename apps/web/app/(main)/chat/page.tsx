"use client";

import { ChatInterface } from "@/components/chat/ChatInterface";

export default function Chat() {
  return (
    <>
      {/* Header */}
      <div className="mb-6">
        <h1 className="font-display text-3xl font-bold text-foreground">
          Messages
        </h1>
        <p className="mt-2 text-muted-foreground">
          Communicate with your healthcare provider
        </p>
      </div>

      {/* Chat Interface */}
      <ChatInterface />
    </>
  );
}
