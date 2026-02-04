"use client";

import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MessageSquareText, Sparkles, X, HelpCircle, Send } from "lucide-react";
import faqs from "@/data/chatbot.json";
import {
  mockDrivers,
  mockRoutes,
  mockPendingRoutes,
  mockExplanations,
  mockFairnessHistory,
  getDashboardStats,
} from "@/lib/mockData";

interface FAQItem {
  question: string;
  answer: string;
}

export function ChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<
    Array<{ role: "user" | "bot"; text: string }>
  >([]);

  const items = useMemo(() => faqs as FAQItem[], []);

  const normalize = (text: string) => text.toLowerCase().trim();

  const handleFaqClick = (item: FAQItem) => {
    setMessages((prev) => [
      ...prev,
      { role: "user", text: item.question },
      { role: "bot", text: item.answer },
    ]);
  };

  const findFaqAnswer = (query: string) => {
    const q = normalize(query);
    return items.find((item) => normalize(item.question).includes(q) || q.includes(normalize(item.question)));
  };

  const answerFromSystem = (query: string) => {
    const q = normalize(query);

    if (q.includes("fairness") || q.includes("gini")) {
      const stats = getDashboardStats();
      return `Current fairness (Gini) is ${stats.giniCoefficient.toFixed(3)} and average effort is ${stats.averageEffort.toFixed(1)}.`;
    }

    if (q.includes("driver")) {
      const match = mockDrivers.find((d) => normalize(d.name).includes(q.replace("driver", "").trim()));
      if (match) return `Driver ${match.name} is active and assigned to route ${mockRoutes.find(r => r.assigned_driver_id === match.id)?.name || "(unassigned)"}.`;
      return `Drivers: ${mockDrivers.map((d) => d.name).join(", ")}.`;
    }

    if (q.includes("route") || q.includes("routes")) {
      const allRoutes = [...mockRoutes, ...mockPendingRoutes];
      const routeMatch = allRoutes.find((r) => normalize(r.name).includes(q.replace("route", "").trim()));
      if (routeMatch) {
        const driver = mockDrivers.find((d) => d.id === routeMatch.assigned_driver_id);
        return `Route ${routeMatch.name} has weight ${routeMatch.weight_kg}kg, stairs ${routeMatch.stairs_count}, parking ${routeMatch.parking_difficulty}${driver ? ", assigned to " + driver.name : ", currently unassigned"}.`;
      }
      return `Active routes: ${mockRoutes.map((r) => r.name).join(", ")}. Pending: ${mockPendingRoutes.map((r) => r.name).join(", ")}.`;
    }

    if (q.includes("explain") || q.includes("why")) {
      const exp = mockExplanations[0];
      return exp?.reason_text || "Explanations are available in the Explanations tab.";
    }

    if (q.includes("pending")) {
      return `Pending routes: ${mockPendingRoutes.map((r) => r.name).join(", ")}.`;
    }

    if (q.includes("history") || q.includes("trend")) {
      const last = mockFairnessHistory[mockFairnessHistory.length - 1];
      return `Latest fairness trend: Gini ${last.giniCoefficient.toFixed(2)} with avg effort ${last.avgEffort.toFixed(1)}.`;
    }

    return "I can answer about drivers, routes, fairness, and assignments in this demo.";
  };

  const handleAsk = () => {
    if (!input.trim()) return;
    const userText = input.trim();
    setInput("");

    const faq = findFaqAnswer(userText);
    const botText = faq?.answer || answerFromSystem(userText);

    setMessages((prev) => [
      ...prev,
      { role: "user", text: userText },
      { role: "bot", text: botText },
    ]);
  };

  return (
    <div className="fixed bottom-24 right-3 md:bottom-4 md:right-4 z-50">
      {isOpen && (
        <Card className="w-[min(340px,calc(100vw-24px))] shadow-2xl border-0 bg-card/95 backdrop-blur-xl overflow-hidden mb-3 ring-1 ring-primary/10">
          <div className="h-1 bg-gradient-to-r from-violet-500 via-indigo-500 to-purple-500" />
          <CardHeader className="pb-2 md:pb-3 px-3 md:px-6 pt-3 md:pt-6">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-1.5 md:gap-2 text-sm md:text-base">
                <div className="p-1.5 md:p-2 rounded-lg md:rounded-xl bg-gradient-to-br from-violet-500/20 to-indigo-500/20 ring-1 ring-primary/20">
                  <Sparkles className="h-3.5 w-3.5 md:h-4 md:w-4 text-primary" />
                </div>
                FairRoute Help
              </CardTitle>
              <Button
                size="icon"
                variant="ghost"
                className="h-7 w-7"
                onClick={() => setIsOpen(false)}
                aria-label="Close chatbot"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            <p className="text-[10px] md:text-xs text-muted-foreground">
              Quick answers to common dispatch questions
            </p>
          </CardHeader>
          <CardContent className="space-y-2 md:space-y-3 px-3 md:px-6 pb-3 md:pb-6">
            <div className="flex flex-wrap gap-1.5 md:gap-2">
              {items.map((item) => (
                <Button
                  key={item.question}
                  size="sm"
                  variant="outline"
                  className="text-[10px] md:text-xs h-7 md:h-8 px-2 md:px-3 rounded-full hover:bg-gradient-to-r hover:from-violet-500/10 hover:to-purple-500/10 hover:border-violet-400 transition-all duration-300"
                  onClick={() => handleFaqClick(item)}
                >
                  <Sparkles className="h-3 w-3 mr-1" />
                  {item.question}
                </Button>
              ))}
            </div>

            <div className="rounded-2xl border bg-gradient-to-b from-background to-muted/30 p-3 space-y-2 shadow-inner">
              {messages.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <MessageSquareText className="h-8 w-8 mx-auto mb-2 opacity-40" />
                  <p className="text-xs">Click a question above or type below</p>
                </div>
              ) : (
                <div className="max-h-40 overflow-auto space-y-2 pr-1">
                  {messages.map((m, i) => (
                    <div
                      key={`${m.role}-${i}`}
                      className={`text-xs leading-relaxed animate-in slide-in-from-bottom-2 duration-300 p-2 rounded-lg ${
                        m.role === "user"
                          ? "bg-gradient-to-r from-violet-500/20 to-purple-500/20 text-foreground border border-violet-500/30 ml-4"
                          : "bg-gradient-to-r from-blue-500/10 to-cyan-500/10 text-foreground border border-blue-500/20 mr-4"
                      }`}
                      style={{ animationDelay: `${i * 100}ms` }}
                    >
                      <span className="font-semibold mr-1 text-xs opacity-70">
                        {m.role === "user" ? "You" : "🤖 Bot"}:
                      </span>
                      {m.text}
                    </div>
                  ))}
                </div>
              )}
              <div className="flex items-center gap-2 mt-2">
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask anything about this demo..."
                  className="w-full rounded-xl border border-violet-500/20 bg-muted/30 px-3 py-2 text-xs outline-none focus:ring-2 focus:ring-violet-500/40 focus:border-violet-500/40 transition-all duration-300"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleAsk();
                  }}
                />
                <Button
                  size="icon"
                  onClick={handleAsk}
                  aria-label="Send"
                  className="rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-violet-500/50"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <Button
        size="icon"
        className="h-11 w-11 md:h-12 md:w-12 rounded-full shadow-xl bg-gradient-to-br from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700 hover:scale-110 transition-all duration-300 animate-pulse hover:animate-none"
        onClick={() => setIsOpen((v) => !v)}
        aria-label="Open chatbot"
      >
        <MessageSquareText className="h-5 w-5" />
      </Button>
    </div>
  );
}
