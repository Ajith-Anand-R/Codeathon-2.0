"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, Package, Activity, Scale, TrendingUp, TrendingDown } from "lucide-react";
import { getFairnessStatus } from "@/lib/fairness";

interface SummaryCardsProps {
    totalDrivers: number;
    totalDeliveries: number;
    averageEffort: number;
    giniCoefficient: number;
}

export function SummaryCards({
    totalDrivers,
    totalDeliveries,
    averageEffort,
    giniCoefficient,
}: SummaryCardsProps) {
    const fairnessStatus = getFairnessStatus(giniCoefficient);

    const cards = [
        {
            title: "Total Drivers",
            value: totalDrivers,
            icon: Users,
            description: "Active drivers today",
            color: "violet",
            trend: "+2 from yesterday",
            trendUp: true,
        },
        {
            title: "Total Deliveries",
            value: totalDeliveries,
            icon: Package,
            description: "Completed & in-progress",
            color: "blue",
            trend: "+12% vs last week",
            trendUp: true,
        },
        {
            title: "Avg Effort Score",
            value: averageEffort.toFixed(1),
            icon: Activity,
            description: "Per driver today",
            color: "emerald",
            trend: "Balanced workload",
            trendUp: true,
        },
        {
            title: "Fairness Score",
            value: giniCoefficient.toFixed(3),
            icon: Scale,
            description: fairnessStatus.description,
            badge: fairnessStatus,
            color: fairnessStatus.color === "green" ? "emerald" : fairnessStatus.color === "yellow" ? "amber" : "red",
        },
    ];

    const getColorClasses = (color: string) => {
        const colors: Record<string, { bg: string; icon: string; gradient: string }> = {
            violet: {
                bg: "bg-violet-500/10",
                icon: "text-violet-500",
                gradient: "from-violet-500 to-purple-600",
            },
            blue: {
                bg: "bg-blue-500/10",
                icon: "text-blue-500",
                gradient: "from-blue-500 to-indigo-600",
            },
            emerald: {
                bg: "bg-emerald-500/10",
                icon: "text-emerald-500",
                gradient: "from-emerald-500 to-teal-600",
            },
            amber: {
                bg: "bg-amber-500/10",
                icon: "text-amber-500",
                gradient: "from-amber-500 to-orange-600",
            },
            red: {
                bg: "bg-red-500/10",
                icon: "text-red-500",
                gradient: "from-red-500 to-rose-600",
            },
        };
        return colors[color] || colors.violet;
    };

    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {cards.map((card) => {
                const colorClasses = getColorClasses(card.color);
                return (
                    <Card 
                        key={card.title} 
                        className="relative overflow-hidden card-hover border-0 shadow-md bg-card/80 backdrop-blur-sm"
                    >
                        {/* Top gradient line */}
                        <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${colorClasses.gradient}`} />
                        
                        <CardContent className="pt-6">
                            <div className="flex items-start justify-between">
                                <div className="space-y-3">
                                    <p className="text-sm font-medium text-muted-foreground">
                                        {card.title}
                                    </p>
                                    <div className="flex items-baseline gap-2">
                                        <span className="text-3xl font-bold tracking-tight">
                                            {card.value}
                                        </span>
                                        {card.badge && (
                                            <Badge
                                                className={`
                                                    ${card.badge.color === "green"
                                                        ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30"
                                                        : card.badge.color === "yellow"
                                                            ? "bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30"
                                                            : "bg-red-500/15 text-red-600 dark:text-red-400 border-red-500/30"
                                                    }
                                                    border font-medium
                                                `}
                                            >
                                                {card.badge.label}
                                            </Badge>
                                        )}
                                    </div>
                                    <p className="text-xs text-muted-foreground">
                                        {card.description}
                                    </p>
                                    {card.trend && (
                                        <div className="flex items-center gap-1 text-xs">
                                            {card.trendUp ? (
                                                <TrendingUp className="h-3 w-3 text-emerald-500" />
                                            ) : (
                                                <TrendingDown className="h-3 w-3 text-red-500" />
                                            )}
                                            <span className={card.trendUp ? "text-emerald-600 dark:text-emerald-400" : "text-red-600 dark:text-red-400"}>
                                                {card.trend}
                                            </span>
                                        </div>
                                    )}
                                </div>
                                <div className={`p-3 rounded-xl ${colorClasses.bg}`}>
                                    <card.icon className={`h-5 w-5 ${colorClasses.icon}`} />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                );
            })}
        </div>
    );
}
