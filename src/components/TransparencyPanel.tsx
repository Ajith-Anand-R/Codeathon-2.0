"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Scale, Activity, Gauge, Target, HelpCircle, Equal, Sparkles } from "lucide-react";

export function TransparencyPanel() {
    return (
        <Card className="border-0 shadow-md bg-card/80 backdrop-blur-sm overflow-hidden">
            <div className="h-1 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500" />
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <div className="p-2 rounded-xl bg-primary/10">
                        <HelpCircle className="h-5 w-5 text-primary" />
                    </div>
                    Understanding Fairness
                </CardTitle>
                <CardDescription>
                    How FairRoute AI balances workload across your team
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
                {/* Effort Score */}
                <div className="flex gap-4 p-4 rounded-xl bg-blue-500/5 border border-blue-500/20">
                    <div className="p-2.5 h-fit rounded-xl bg-blue-500/15">
                        <Activity className="h-5 w-5 text-blue-500" />
                    </div>
                    <div className="space-y-1.5">
                        <h4 className="font-semibold">What is an Effort Score?</h4>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                            Measures the <span className="text-foreground font-medium">physical and logistical difficulty</span> of a
                            route, not just distance. It accounts for package weight, stair climbs,
                            and parking difficulty.
                        </p>
                    </div>
                </div>

                <Separator className="bg-muted/50" />

                {/* Factors */}
                <div className="flex gap-4 p-4 rounded-xl bg-amber-500/5 border border-amber-500/20">
                    <div className="p-2.5 h-fit rounded-xl bg-amber-500/15">
                        <Gauge className="h-5 w-5 text-amber-500" />
                    </div>
                    <div className="space-y-2">
                        <h4 className="font-semibold">What factors affect effort?</h4>
                        <ul className="text-sm text-muted-foreground space-y-2">
                            <li className="flex items-center gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                                <span className="text-foreground font-medium">Package Weight</span> – Heavier loads increase strain
                            </li>
                            <li className="flex items-center gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                                <span className="text-foreground font-medium">Stair Climbs</span> – Each floor adds significant effort
                            </li>
                            <li className="flex items-center gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                                <span className="text-foreground font-medium">Parking Difficulty</span> – Time spent finding parking
                            </li>
                        </ul>
                    </div>
                </div>

                <Separator className="bg-muted/50" />

                {/* Fairness Threshold */}
                <div className="flex gap-4 p-4 rounded-xl bg-emerald-500/5 border border-emerald-500/20">
                    <div className="p-2.5 h-fit rounded-xl bg-emerald-500/15">
                        <Target className="h-5 w-5 text-emerald-500" />
                    </div>
                    <div className="space-y-2">
                        <h4 className="font-semibold">Fairness Thresholds</h4>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                            We use the <span className="text-foreground font-medium">Gini Coefficient</span> (0 to 1) to measure workload
                            inequality.
                        </p>
                        <div className="flex items-center gap-3 mt-3">
                            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-500/15 border border-emerald-500/30">
                                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                                <span className="text-xs font-medium">&lt;0.15 Fair</span>
                            </div>
                            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-amber-500/15 border border-amber-500/30">
                                <div className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                                <span className="text-xs font-medium">0.15-0.30</span>
                            </div>
                            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-red-500/15 border border-red-500/30">
                                <div className="w-2.5 h-2.5 rounded-full bg-red-500" />
                                <span className="text-xs font-medium">&gt;0.30 Unfair</span>
                            </div>
                        </div>
                    </div>
                </div>

                <Separator className="bg-muted/50" />

                {/* Why Not Perfect Equality */}
                <div className="flex gap-4 p-4 rounded-xl bg-purple-500/5 border border-purple-500/20">
                    <div className="p-2.5 h-fit rounded-xl bg-purple-500/15">
                        <Equal className="h-5 w-5 text-purple-500" />
                    </div>
                    <div className="space-y-1.5">
                        <h4 className="font-semibold">Why not perfect equality?</h4>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                            Perfect equality is often <span className="text-foreground font-medium">impractical</span>. Route assignments must also consider
                            driver location, route urgency, and operational constraints. We aim for{" "}
                            <span className="text-foreground font-medium">equitable distribution</span>, not identical workloads.
                        </p>
                    </div>
                </div>

                {/* Footer Note */}
                <div className="p-4 rounded-xl bg-gradient-to-r from-primary/10 via-primary/5 to-transparent border border-primary/20">
                    <p className="text-sm text-muted-foreground text-center flex items-center justify-center gap-2">
                        <Sparkles className="h-4 w-4 text-primary" />
                        <span>
                            <span className="font-semibold text-foreground">FairRoute AI</span> — We don&apos;t make all routes equal, we make the workload fair.
                        </span>
                    </p>
                </div>
            </CardContent>
        </Card>
    );
}
