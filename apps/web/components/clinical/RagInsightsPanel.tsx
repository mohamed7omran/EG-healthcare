"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import {
  AlertTriangle,
  Pill,
  Activity,
  Info,
  Bot,
  Send,
  Loader2,
  Clock,
  FileText,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  PatientInsight,
  TimelineEntry,
} from "@/api/medicalHistory";

interface RagMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
}

interface RagInsightsPanelProps {
  insights: PatientInsight[];
  timeline: TimelineEntry[];
  isLoadingInsights: boolean;
  onAsk: (question: string) => Promise<string>;
  isAsking: boolean;
}

const insightIcons: Record<string, typeof AlertTriangle> = {
  allergy: AlertTriangle,
  medication: Pill,
  condition: Activity,
  info: Info,
};

const insightColors: Record<string, string> = {
  allergy: "border-warning/30 bg-warning/5",
  medication: "border-info/30 bg-info/5",
  condition: "border-primary/30 bg-primary/5",
  info: "border-border bg-secondary/30",
};

const suggestedQuestions = [
  "Has the patient complained of knee pain before?",
  "Any drug allergies I should know about?",
  "What was the last diagnosis recorded?",
  "Summarize the last 3 visits.",
];

export function RagInsightsPanel({
  insights,
  timeline,
  isLoadingInsights,
  onAsk,
  isAsking,
}: RagInsightsPanelProps) {
  const [messages, setMessages] = useState<RagMessage[]>([]);
  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isAsking]);

  const handleAsk = async (question: string) => {
    const trimmed = question.trim();
    if (!trimmed || isAsking) return;

    const userMsg: RagMessage = {
      id: `u-${Date.now()}`,
      role: "user",
      content: trimmed,
    };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");

    try {
      const answer = await onAsk(trimmed);
      setMessages((prev) => [
        ...prev,
        { id: `a-${Date.now()}`, role: "assistant", content: answer },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: `e-${Date.now()}`,
          role: "assistant",
          content:
            "Unable to reach the RAG agent. Ensure the backend, LM Studio, and ChromaDB are running.",
        },
      ]);
    }
  };

  return (
    <div className="flex h-full min-h-[600px] flex-col rounded-xl border border-border bg-card">
      <div className="border-b border-border px-5 py-4">
        <div className="flex items-center gap-2">
          <Bot className="h-5 w-5 text-primary" />
          <h2 className="font-display text-lg font-semibold">
            RAG Agent & Insights
          </h2>
        </div>
        <p className="mt-1 text-sm text-muted-foreground">
          Proactive context and patient history chat
        </p>
      </div>

      <ScrollArea className="flex-1">
        <div className="space-y-5 p-5">
          {/* Auto insights */}
          <section>
            <p className="mb-3 text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Auto-Generated Insights
            </p>
            {isLoadingInsights ? (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Loader2 className="h-4 w-4 animate-spin" />
                Analyzing patient records...
              </div>
            ) : insights.length > 0 ? (
              <div className="space-y-2">
                {insights.map((insight) => {
                  const Icon = insightIcons[insight.type] || Info;
                  return (
                    <div
                      key={insight.id}
                      className={cn(
                        "rounded-lg border p-3",
                        insightColors[insight.type] || insightColors.info,
                      )}
                    >
                      <div className="mb-1 flex items-center gap-2">
                        <Icon className="h-4 w-4 shrink-0" />
                        <span className="text-sm font-semibold">
                          {insight.label}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {insight.content}
                      </p>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">
                No insights available yet.
              </p>
            )}
          </section>

          {/* Timeline */}
          <section>
            <p className="mb-3 text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Patient Timeline
            </p>
            {timeline.length > 0 ? (
              <div className="relative space-y-0 pl-4 before:absolute before:left-[7px] before:top-2 before:h-[calc(100%-16px)] before:w-px before:bg-border">
                {timeline.map((entry) => (
                  <div key={entry.id} className="relative pb-4 pl-4">
                    <span className="absolute left-0 top-1.5 h-3.5 w-3.5 rounded-full border-2 border-primary bg-card" />
                    <div className="rounded-lg border border-border bg-secondary/20 p-3">
                      <div className="flex flex-wrap items-center gap-2">
                        <Badge variant="outline" className="text-xs">
                          {entry.type}
                        </Badge>
                        <span className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Clock className="h-3 w-3" />
                          {entry.visitDate}
                        </span>
                      </div>
                      <p className="mt-1 text-sm font-medium">{entry.title}</p>
                      <p className="mt-0.5 line-clamp-2 text-xs text-muted-foreground">
                        {entry.summary}
                      </p>
                      {entry.doctorName && (
                        <p className="mt-1 text-xs text-muted-foreground">
                          Dr. {entry.doctorName}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex items-center gap-2 rounded-lg border border-dashed p-4 text-sm text-muted-foreground">
                <FileText className="h-4 w-4" />
                No prior visits in medical history.
              </div>
            )}
          </section>

          {/* Chat */}
          <section>
            <p className="mb-3 text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Contextual RAG Chat
            </p>
            <div className="mb-3 flex flex-wrap gap-2">
              {suggestedQuestions.map((q) => (
                <Button
                  key={q}
                  type="button"
                  variant="secondary"
                  size="sm"
                  className="h-auto whitespace-normal text-left text-xs"
                  disabled={isAsking}
                  onClick={() => handleAsk(q)}
                >
                  {q}
                </Button>
              ))}
            </div>

            <div className="rounded-lg border border-border bg-secondary/10">
              <div
                ref={scrollRef}
                className="max-h-48 space-y-3 overflow-y-auto p-3"
              >
                {messages.length === 0 && (
                  <p className="text-center text-xs text-muted-foreground py-4">
                    Ask anything about this patient&apos;s history...
                  </p>
                )}
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={cn(
                      "rounded-lg px-3 py-2 text-sm",
                      msg.role === "user"
                        ? "ml-8 bg-primary text-primary-foreground"
                        : "mr-8 bg-card border border-border text-foreground",
                    )}
                  >
                    {msg.content}
                  </div>
                ))}
                {isAsking && (
                  <div className="mr-8 flex items-center gap-2 rounded-lg border border-border bg-card px-3 py-2 text-sm text-muted-foreground">
                    <Loader2 className="h-3 w-3 animate-spin" />
                    Searching records...
                  </div>
                )}
              </div>
              <div className="flex gap-2 border-t border-border p-2">
                <Input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="e.g. Did they report knee pain before?"
                  disabled={isAsking}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      void handleAsk(input);
                    }
                  }}
                />
                <Button
                  size="icon"
                  className="gradient-primary shrink-0 border-0"
                  disabled={!input.trim() || isAsking}
                  onClick={() => void handleAsk(input)}
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </section>
        </div>
      </ScrollArea>
    </div>
  );
}
