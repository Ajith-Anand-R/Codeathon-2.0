"use client";

import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    ReferenceLine,
    Cell,
} from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3 } from "lucide-react";
import type { DriverWithStats } from "@/lib/mockData";

interface FairnessChartProps {
    drivers: DriverWithStats[];
    averageEffort: number;
}

export function FairnessChart({ drivers, averageEffort }: FairnessChartProps) {
    const chartData = drivers.map((driver) => ({
        name: driver.name.split(" ")[0], // First name only for chart
        effort: driver.totalEffortScore,
        fullName: driver.name,
        workloadLevel: driver.workloadLevel,
    }));

    const getBarColor = (level: string) => {
        switch (level) {
            case "Low":
                return "#6366f1"; // indigo-500
            case "Medium":
                return "#10b981"; // emerald-500
            case "High":
                return "#f59e0b"; // amber-500
            default:
                return "#6b7280"; // gray-500
        }
    };

    const CustomTooltip = ({ active, payload }: { active?: boolean; payload?: Array<{ payload: typeof chartData[0] }> }) => {
        if (active && payload && payload.length) {
            const data = payload[0].payload;
            return (
                <div className="bg-card border rounded-xl shadow-lg p-4 backdrop-blur-sm">
                    <p className="font-semibold text-base">{data.fullName}</p>
                    <div className="mt-2 space-y-1">
                        <p className="text-sm text-muted-foreground flex items-center justify-between gap-4">
                            <span>Effort Score</span>
                            <span className="font-mono font-bold text-foreground">{data.effort}</span>
                        </p>
                        <p className="text-sm text-muted-foreground flex items-center justify-between gap-4">
                            <span>Workload</span>
                            <span className={`font-medium ${
                                data.workloadLevel === 'Low' ? 'text-indigo-500' :
                                data.workloadLevel === 'Medium' ? 'text-emerald-500' : 'text-amber-500'
                            }`}>{data.workloadLevel}</span>
                        </p>
                    </div>
                </div>
            );
        }
        return null;
    };

    return (
        <Card className="border-0 shadow-md bg-card/80 backdrop-blur-sm overflow-hidden">
            {/* Top gradient line */}
            <div className="h-1 bg-gradient-to-r from-indigo-500 via-emerald-500 to-amber-500" />
            
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <div className="p-2 rounded-xl bg-primary/10">
                        <BarChart3 className="h-5 w-5 text-primary" />
                    </div>
                    Effort Distribution
                </CardTitle>
                <CardDescription>
                    Lower spread indicates more equitable workload distribution across your team.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" className="stroke-muted/50" vertical={false} />
                            <XAxis
                                dataKey="name"
                                tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
                                axisLine={false}
                                tickLine={false}
                            />
                            <YAxis
                                tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
                                axisLine={false}
                                tickLine={false}
                                label={{
                                    value: "Effort Score",
                                    angle: -90,
                                    position: "insideLeft",
                                    fill: "hsl(var(--muted-foreground))",
                                    fontSize: 11,
                                }}
                            />
                            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'hsl(var(--muted))', opacity: 0.3 }} />
                            <ReferenceLine
                                y={averageEffort}
                                stroke="hsl(var(--primary))"
                                strokeDasharray="5 5"
                                strokeWidth={2}
                                label={{
                                    value: `Avg: ${averageEffort.toFixed(1)}`,
                                    position: "right",
                                    fill: "hsl(var(--primary))",
                                    fontSize: 11,
                                    fontWeight: 600,
                                }}
                            />
                            <Bar dataKey="effort" radius={[8, 8, 0, 0]}>
                                {chartData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={getBarColor(entry.workloadLevel)} />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                {/* Legend */}
                <div className="flex items-center justify-center gap-6 mt-6 pt-4 border-t text-sm">
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-indigo-500" />
                        <span className="text-muted-foreground">Low</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-emerald-500" />
                        <span className="text-muted-foreground">Medium</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-amber-500" />
                        <span className="text-muted-foreground">High</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-6 border-t-2 border-dashed border-primary" />
                        <span className="text-muted-foreground">Team Avg</span>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
