"use client";

import {
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    ReferenceLine,
    Area,
    AreaChart,
} from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingDown, TrendingUp, Calendar, Target } from "lucide-react";
import { mockFairnessHistory } from "@/lib/mockData";

interface FairnessTooltipProps {
    active?: boolean;
    payload?: Array<{
        payload: {
            date: string;
            giniCoefficient: number;
            fairnessScore: number;
            avgEffort: number;
            highWorkloadDrivers: number;
        };
    }>;
}

function FairnessHistoryTooltip({ active, payload }: FairnessTooltipProps) {
    if (active && payload && payload.length) {
        const data = payload[0].payload;
        return (
            <div className="bg-card border rounded-xl shadow-lg p-4 backdrop-blur-sm">
                <p className="font-semibold text-base flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-primary" />
                    {data.date}
                </p>
                <div className="mt-2 space-y-1">
                    <p className="text-sm text-muted-foreground flex items-center justify-between gap-4">
                        <span>Gini Coefficient</span>
                        <span className="font-mono font-bold text-foreground">{data.giniCoefficient}</span>
                    </p>
                    <p className="text-sm text-muted-foreground flex items-center justify-between gap-4">
                        <span>Fairness Score</span>
                        <span className={`font-bold ${data.fairnessScore >= 85 ? "text-emerald-500" : data.fairnessScore >= 70 ? "text-amber-500" : "text-red-500"}`}>
                            {data.fairnessScore}%
                        </span>
                    </p>
                    <p className="text-sm text-muted-foreground flex items-center justify-between gap-4">
                        <span>Avg Effort</span>
                        <span className="font-mono text-foreground">{data.avgEffort}</span>
                    </p>
                    <p className="text-sm text-muted-foreground flex items-center justify-between gap-4">
                        <span>High Workload</span>
                        <span className="text-orange-500 font-medium">{data.highWorkloadDrivers}</span>
                    </p>
                </div>
            </div>
        );
    }
    return null;
}

export function FairnessHistoryChart() {
    // Calculate trend
    const firstGini = mockFairnessHistory[0].giniCoefficient;
    const lastGini = mockFairnessHistory[mockFairnessHistory.length - 1].giniCoefficient;
    const trend = ((lastGini - firstGini) / firstGini) * 100;
    const isImproving = trend < 0;

    // Format data for chart
    const chartData = mockFairnessHistory.map((item) => ({
        ...item,
        date: new Date(item.date).toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" }),
        fairnessScore: Math.round((1 - item.giniCoefficient) * 100), // Convert to 0-100 scale
    }));

    return (
        <Card className="border-0 shadow-md bg-card/80 backdrop-blur-sm overflow-hidden">
            <div className="h-1 bg-gradient-to-r from-violet-500 via-indigo-500 to-purple-500" />
            <CardHeader>
                <div className="flex items-center justify-between">
                    <div>
                        <CardTitle className="flex items-center gap-2">
                            <div className="p-2 rounded-xl bg-primary/10">
                                <Target className="h-5 w-5 text-primary" />
                            </div>
                            Weekly Fairness Trend
                        </CardTitle>
                        <CardDescription>
                            Gini coefficient over the past 7 days (lower is fairer)
                        </CardDescription>
                    </div>
                    <Badge className={`${isImproving 
                        ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30' 
                        : 'bg-red-500/15 text-red-600 dark:text-red-400 border-red-500/30'
                    } border`}>
                        {isImproving ? (
                            <TrendingDown className="h-3 w-3 mr-1" />
                        ) : (
                            <TrendingUp className="h-3 w-3 mr-1" />
                        )}
                        {Math.abs(Math.round(trend))}% {isImproving ? 'improvement' : 'increase'}
                    </Badge>
                </div>
            </CardHeader>
            <CardContent>
                <div className="h-[250px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                            <defs>
                                <linearGradient id="colorGini" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                                    <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" className="stroke-muted/50" vertical={false} />
                            <XAxis
                                dataKey="date"
                                tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }}
                                axisLine={false}
                                tickLine={false}
                            />
                            <YAxis
                                domain={[0, 0.35]}
                                tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }}
                                axisLine={false}
                                tickLine={false}
                                tickFormatter={(value) => value.toFixed(2)}
                            />
                            <Tooltip content={<FairnessHistoryTooltip />} />
                            <ReferenceLine
                                y={0.15}
                                stroke="hsl(142.1 76.2% 36.3%)"
                                strokeDasharray="5 5"
                                strokeWidth={2}
                                label={{
                                    value: "Fair (<0.15)",
                                    position: "right",
                                    fill: "hsl(142.1 76.2% 36.3%)",
                                    fontSize: 10,
                                }}
                            />
                            <ReferenceLine
                                y={0.30}
                                stroke="hsl(0 84.2% 60.2%)"
                                strokeDasharray="5 5"
                                strokeWidth={2}
                                label={{
                                    value: "Unfair (>0.30)",
                                    position: "right",
                                    fill: "hsl(0 84.2% 60.2%)",
                                    fontSize: 10,
                                }}
                            />
                            <Area
                                type="monotone"
                                dataKey="giniCoefficient"
                                stroke="hsl(var(--primary))"
                                strokeWidth={3}
                                fill="url(#colorGini)"
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>

                {/* Summary Stats */}
                <div className="grid grid-cols-3 gap-4 mt-6 pt-4 border-t">
                    <div className="text-center">
                        <p className="text-2xl font-bold text-emerald-500">
                            {chartData.filter(d => d.giniCoefficient < 0.15).length}
                        </p>
                        <p className="text-xs text-muted-foreground">Fair Days</p>
                    </div>
                    <div className="text-center">
                        <p className="text-2xl font-bold text-amber-500">
                            {chartData.filter(d => d.giniCoefficient >= 0.15 && d.giniCoefficient < 0.30).length}
                        </p>
                        <p className="text-xs text-muted-foreground">Moderate Days</p>
                    </div>
                    <div className="text-center">
                        <p className="text-2xl font-bold text-red-500">
                            {chartData.filter(d => d.giniCoefficient >= 0.30).length}
                        </p>
                        <p className="text-xs text-muted-foreground">Unfair Days</p>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
