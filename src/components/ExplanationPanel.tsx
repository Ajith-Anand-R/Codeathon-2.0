"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Badge } from "@/components/ui/badge";
import { ChevronDown, MessageSquareText, Route, User, Package, Footprints, Car } from "lucide-react";
import { useState } from "react";
import type { Explanation } from "@/lib/supabaseClient";
import type { DriverWithStats } from "@/lib/mockData";

interface ExplanationPanelProps {
    explanations: Array<{
        explanation: Explanation;
        driver: DriverWithStats;
    }>;
}

export function ExplanationPanel({ explanations }: ExplanationPanelProps) {
    const [openItems, setOpenItems] = useState<Set<string>>(new Set());

    const toggleItem = (id: string) => {
        const newOpenItems = new Set(openItems);
        if (newOpenItems.has(id)) {
            newOpenItems.delete(id);
        } else {
            newOpenItems.add(id);
        }
        setOpenItems(newOpenItems);
    };

    return (
        <div className="space-y-4">
            {explanations.map(({ explanation, driver }, index) => (
                <Collapsible
                    key={explanation.id}
                    open={openItems.has(explanation.id)}
                    onOpenChange={() => toggleItem(explanation.id)}
                >
                    <Card className="overflow-hidden border-0 shadow-md bg-card/80 backdrop-blur-sm card-hover" style={{ animationDelay: `${index * 50}ms` }}>
                        <CollapsibleTrigger asChild>
                            <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-primary/20 to-indigo-500/20 flex items-center justify-center text-lg font-bold text-primary">
                                            {driver.name.split(' ').map(n => n[0]).join('')}
                                        </div>
                                        <div>
                                            <CardTitle className="text-base flex items-center gap-2">
                                                {driver.name}
                                                <Badge variant="outline" className="font-normal text-xs">
                                                    {driver.assignedRoute?.name || "N/A"}
                                                </Badge>
                                            </CardTitle>
                                            <p className="text-sm text-muted-foreground mt-1">
                                                &quot;Why this route?&quot; — Click to expand
                                            </p>
                                        </div>
                                    </div>
                                    <ChevronDown
                                        className={`h-5 w-5 text-muted-foreground transition-transform duration-200 ${openItems.has(explanation.id) ? "rotate-180" : ""
                                            }`}
                                    />
                                </div>
                            </CardHeader>
                        </CollapsibleTrigger>
                        <CollapsibleContent>
                            <CardContent className="pt-0">
                                {/* Main Explanation */}
                                <div className="p-5 bg-gradient-to-r from-primary/10 via-primary/5 to-transparent rounded-xl border-l-4 border-primary mb-5">
                                    <p className="text-sm leading-relaxed">
                                        {explanation.reason_text}
                                    </p>
                                </div>

                                {/* Breakdown Grid */}
                                <div className="grid md:grid-cols-2 gap-4">
                                    {/* Driver Info */}
                                    <div className="p-4 rounded-xl bg-muted/30 border">
                                        <div className="flex items-center gap-2 mb-4">
                                            <div className="p-2 rounded-lg bg-violet-500/15">
                                                <User className="h-4 w-4 text-violet-500" />
                                            </div>
                                            <span className="text-sm font-semibold">Driver Context</span>
                                        </div>
                                        <div className="space-y-3 text-sm">
                                            <div className="flex justify-between items-center">
                                                <span className="text-muted-foreground">Current Effort</span>
                                                <span className="font-mono font-bold text-lg">{driver.totalEffortScore}</span>
                                            </div>
                                            <div className="flex justify-between items-center">
                                                <span className="text-muted-foreground">vs. Team Avg</span>
                                                <span
                                                    className={`font-mono font-bold text-lg ${(explanation.factors.effort_diff as number) < 0
                                                            ? "text-emerald-600 dark:text-emerald-400"
                                                            : (explanation.factors.effort_diff as number) > 10
                                                                ? "text-orange-600 dark:text-orange-400"
                                                                : ""
                                                        }`}
                                                >
                                                    {(explanation.factors.effort_diff as number) > 0 ? "+" : ""}
                                                    {explanation.factors.effort_diff as number}%
                                                </span>
                                            </div>
                                            <div className="flex justify-between items-center">
                                                <span className="text-muted-foreground">Workload Level</span>
                                                <Badge
                                                    className={
                                                        driver.workloadLevel === "Low"
                                                            ? "bg-blue-500/15 text-blue-600 dark:text-blue-400 border border-blue-500/30"
                                                            : driver.workloadLevel === "High"
                                                                ? "bg-orange-500/15 text-orange-600 dark:text-orange-400 border border-orange-500/30"
                                                                : "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30"
                                                    }
                                                >
                                                    {driver.workloadLevel}
                                                </Badge>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Route Factors */}
                                    <div className="p-4 rounded-xl bg-muted/30 border">
                                        <div className="flex items-center gap-2 mb-4">
                                            <div className="p-2 rounded-lg bg-indigo-500/15">
                                                <Route className="h-4 w-4 text-indigo-500" />
                                            </div>
                                            <span className="text-sm font-semibold">Route Factors</span>
                                        </div>
                                        <div className="space-y-3 text-sm">
                                            <div className="flex justify-between items-center">
                                                <span className="text-muted-foreground flex items-center gap-2">
                                                    <Package className="h-4 w-4 text-blue-500" />
                                                    Weight
                                                </span>
                                                <span className="font-mono font-bold">
                                                    {explanation.factors.weight as number}kg
                                                </span>
                                            </div>
                                            <div className="flex justify-between items-center">
                                                <span className="text-muted-foreground flex items-center gap-2">
                                                    <Footprints className="h-4 w-4 text-amber-500" />
                                                    Stair Climbs
                                                </span>
                                                <span className="font-mono font-bold">
                                                    {explanation.factors.stairs as number} floors
                                                </span>
                                            </div>
                                            <div className="flex justify-between items-center">
                                                <span className="text-muted-foreground flex items-center gap-2">
                                                    <Car className="h-4 w-4 text-emerald-500" />
                                                    Parking
                                                </span>
                                                <span className="capitalize font-bold">
                                                    {explanation.factors.parking as string}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </CollapsibleContent>
                    </Card>
                </Collapsible>
            ))}
        </div>
    );
}
