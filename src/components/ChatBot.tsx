"use client";

import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MessageSquareText, Sparkles, X, HelpCircle } from "lucide-react";
import faqs from "@/data/chatbot.json";

interface FAQItem {
  question: string;
  answer: string;
}

export function ChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState<number>(0);

  const items = useMemo(() => faqs as FAQItem[], []);
  const selected = items[selectedIndex];

  return (
    <div className="fixed bottom-20 right-4 md:bottom-4 z-50">
      {isOpen && (
        <Card className="w-[320px] shadow-xl border-0 bg-card/95 backdrop-blur-sm overflow-hidden mb-3">
          <div className="h-1 bg-gradient-to-r from-violet-500 via-indigo-500 to-purple-500" />
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2 text-base">
                <div className="p-1.5 rounded-lg bg-primary/10">
                  <Sparkles className="h-4 w-4 text-primary" />
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
            <p className="text-xs text-muted-foreground">
              Quick answers to common dispatch questions
            </p>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex flex-wrap gap-2">
              {items.map((item, idx) => (
                <Button
                  key={item.question}
                  size="sm"
                  variant={idx === selectedIndex ? "default" : "outline"}
                  className="text-xs"
                  onClick={() => setSelectedIndex(idx)}
                >
                  {item.question}
                </Button>
              ))}
            </div>

            <div className="rounded-xl border bg-muted/40 p-3">
              <div className="flex items-center gap-2 mb-2">
                <HelpCircle className="h-4 w-4 text-primary" />
                <Badge className="bg-primary/10 text-primary border-0">Answer</Badge>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {selected?.answer}
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      <Button
        className="rounded-full shadow-lg bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700"
        onClick={() => setIsOpen((v) => !v)}
        aria-label="Open chatbot"
      >
        <MessageSquareText className="h-4 w-4 mr-2" />
        Help Bot
      </Button>
    </div>
  );
}
