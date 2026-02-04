"use client";

import { ExplanationPanel } from "@/components/ExplanationPanel";
import { TransparencyPanel } from "@/components/TransparencyPanel";
import { getDashboardStats, mockExplanations } from "@/lib/mockData";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageSquareText, Info, Scale, Sparkles, TrendingDown, TrendingUp, Lightbulb, FileText, Target } from "lucide-react";

export default function ExplanationsPage() {
    const stats = getDashboardStats();

    // Build explanations with driver data
    const explanationsWithDrivers = mockExplanations.map((explanation) => {
        const driver = stats.driversWithStats.find((d) => d.id === explanation.driver_id);
        return {
            explanation,
            driver: driver!,
        };
    }).filter((e) => e.driver);

    const belowAvgCount = explanationsWithDrivers.filter(
        (e) => (e.explanation.factors.effort_diff as number) < 0
    ).length;
    const aboveAvgCount = explanationsWithDrivers.filter(
        (e) => (e.explanation.factors.effort_diff as number) > 10
    ).length;

    return (
        <div className="space-y-8 animate-fade-in">
            {/* Header */}
            <div className="space-y-2">
                <div className="flex items-center gap-3">
                    <div className="relative">
                        <div className="absolute inset-0 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl blur-sm opacity-75" />
                        <div className="relative p-2.5 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600">
                            <MessageSquareText className="h-6 w-6 text-white" />
                        </div>
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Explainable Dispatch</h1>
                        <p className="text-muted-foreground">
                            Transparent explanations for every route assignment decision.
                        </p>
                    </div>
                </div>
            </div>

            {/* Info Banner */}
            <Card className="border-0 shadow-md overflow-hidden bg-gradient-to-r from-primary/10 via-primary/5 to-transparent">
                <div className="h-1 bg-gradient-to-r from-primary via-indigo-500 to-purple-500" />
                <CardContent className="pt-6">
                    <div className="flex gap-4">
                        <div className="p-3 rounded-xl bg-primary/10 h-fit">
                            <Lightbulb className="h-6 w-6 text-primary" />
                        </div>
                        <div className="space-y-2">
                            <p className="font-semibold text-lg">Why Explainability Matters</p>
                            <p className="text-sm text-muted-foreground leading-relaxed">
                                Every assignment decision in FairRoute AI comes with a human-readable
                                explanation. This transparency builds trust with drivers and ensures
                                accountability in our dispatch process. Explanations are generated
                                deterministically based on effort scores, route difficulty, and workload
                                balance.
                            </p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Main Content Grid */}
            <div className="grid gap-6 lg:grid-cols-3">
                {/* Explanations List */}
                <div className="lg:col-span-2 space-y-4">
                    <div className="flex items-center gap-2 mb-2">
                        <Sparkles className="h-5 w-5 text-primary" />
                        <h2 className="text-xl font-semibold">Today&apos;s Assignment Decisions</h2>
                    </div>
                    <p className="text-sm text-muted-foreground mb-4">
                        Click each card to expand and see the full explanation.
                    </p>
                    <ExplanationPanel explanations={explanationsWithDrivers} />
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    {/* Stats Card */}
                    <Card className="border-0 shadow-md bg-card/80 backdrop-blur-sm overflow-hidden">
                        <div className="h-1 bg-gradient-to-r from-violet-500 to-purple-600" />
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <FileText className="h-5 w-5 text-primary" />
                                Explanation Stats
                            </CardTitle>
                            <CardDescription>Overview of today&apos;s dispatch decisions</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex justify-between items-center p-3 rounded-xl bg-muted/50">
                                <span className="text-sm text-muted-foreground">Total Explanations</span>
                                <span className="font-bold text-lg">{explanationsWithDrivers.length}</span>
                            </div>
                            <div className="flex justify-between items-center p-3 rounded-xl bg-muted/50">
                                <span className="text-sm text-muted-foreground">Drivers Covered</span>
                                <span className="font-bold text-lg">{stats.totalDrivers}</span>
                            </div>
                            <div className="flex justify-between items-center p-3 rounded-xl bg-emerald-500/10">
                                <span className="text-sm text-muted-foreground flex items-center gap-2">
                                    <TrendingDown className="h-4 w-4 text-emerald-500" />
                                    Below Avg
                                </span>
                                <span className="font-bold text-lg text-emerald-600 dark:text-emerald-400">
                                    {belowAvgCount}
                                </span>
                            </div>
                            <div className="flex justify-between items-center p-3 rounded-xl bg-amber-500/10">
                                <span className="text-sm text-muted-foreground flex items-center gap-2">
                                    <TrendingUp className="h-4 w-4 text-amber-500" />
                                    Above Avg
                                </span>
                                <span className="font-bold text-lg text-amber-600 dark:text-amber-400">
                                    {aboveAvgCount}
                                </span>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Transparency Panel */}
                    <TransparencyPanel />
                </div>
            </div>

            {/* Philosophy Section */}
            <Card className="border-0 shadow-md bg-card/80 backdrop-blur-sm overflow-hidden">
                <div className="h-1 bg-gradient-to-r from-blue-500 via-emerald-500 to-amber-500" />
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Target className="h-5 w-5 text-primary" />
                        Our Explanation Philosophy
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid md:grid-cols-3 gap-6">
                        <div className="p-5 rounded-xl bg-gradient-to-br from-blue-500/10 to-transparent border border-blue-500/20 space-y-3">
                            <div className="p-3 w-fit rounded-xl bg-blue-500/15">
                                <MessageSquareText className="h-6 w-6 text-blue-500" />
                            </div>
                            <h4 className="font-semibold">Plain English</h4>
                            <p className="text-sm text-muted-foreground leading-relaxed">
                                No algorithm names or technical jargon. Explanations read like they came
                                from a thoughtful human dispatcher.
                            </p>
                        </div>
                        <div className="p-5 rounded-xl bg-gradient-to-br from-emerald-500/10 to-transparent border border-emerald-500/20 space-y-3">
                            <div className="p-3 w-fit rounded-xl bg-emerald-500/15">
                                <Scale className="h-6 w-6 text-emerald-500" />
                            </div>
                            <h4 className="font-semibold">Fairness First</h4>
                            <p className="text-sm text-muted-foreground leading-relaxed">
                                Every explanation references workload balance and team averages,
                                reinforcing our commitment to equitable dispatch.
                            </p>
                        </div>
                        <div className="p-5 rounded-xl bg-gradient-to-br from-amber-500/10 to-transparent border border-amber-500/20 space-y-3">
                            <div className="p-3 w-fit rounded-xl bg-amber-500/15">
                                <Info className="h-6 w-6 text-amber-500" />
                            </div>
                            <h4 className="font-semibold">Full Context</h4>
                            <p className="text-sm text-muted-foreground leading-relaxed">
                                Explanations include route difficulty factors so drivers understand
                                the full picture behind each assignment.
                            </p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
