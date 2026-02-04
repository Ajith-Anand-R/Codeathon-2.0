"use client";

import { useState } from "react";
import { DriverTable } from "@/components/DriverTable";
import { FairnessChart } from "@/components/FairnessChart";
import { TransparencyPanel } from "@/components/TransparencyPanel";
import { getDashboardStats } from "@/lib/mockData";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, TrendingUp, AlertTriangle, CheckCircle2 } from "lucide-react";

export default function DriversPage() {
    const stats = getDashboardStats();
    const [selectedDriverId, setSelectedDriverId] = useState<string | null>(null);

    // Calculate additional driver statistics
    const highWorkloadCount = stats.driversWithStats.filter(
        (d) => d.workloadLevel === "High"
    ).length;
    const lowWorkloadCount = stats.driversWithStats.filter(
        (d) => d.workloadLevel === "Low"
    ).length;

    return (
        <div className="space-y-4 sm:space-y-6 md:space-y-8 animate-fade-in">
            {/* Header */}
            <div className="space-y-2">
                <div className="flex items-center gap-2 md:gap-3">
                    <div className="relative shrink-0">
                        <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg md:rounded-xl blur-sm opacity-75" />
                        <div className="relative p-2 md:p-2.5 rounded-lg md:rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600">
                            <Users className="h-5 w-5 md:h-6 md:w-6 text-white" />
                        </div>
                    </div>
                    <div>
                        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold tracking-tight">Driver Workload</h1>
                        <p className="text-xs sm:text-sm md:text-base text-muted-foreground">
                            Detailed view of individual driver effort scores and workload distribution.
                        </p>
                    </div>
                </div>
            </div>

            {/* Quick Stats */}
            <div className="grid gap-4 md:grid-cols-4 stagger-children">
                <Card className="border-0 shadow-md bg-card/80 backdrop-blur-sm overflow-hidden card-hover">
                    <div className="h-1 bg-gradient-to-r from-violet-500 to-purple-600" />
                    <CardHeader className="pb-2">
                        <CardDescription>Total Drivers</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold">{stats.totalDrivers}</div>
                    </CardContent>
                </Card>
                <Card className="border-0 shadow-md bg-card/80 backdrop-blur-sm overflow-hidden card-hover">
                    <div className="h-1 bg-gradient-to-r from-blue-500 to-indigo-600" />
                    <CardHeader className="pb-2">
                        <CardDescription>Average Effort</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold font-mono">{stats.averageEffort}</div>
                    </CardContent>
                </Card>
                <Card className="border-0 shadow-md bg-card/80 backdrop-blur-sm overflow-hidden card-hover">
                    <div className="h-1 bg-gradient-to-r from-amber-500 to-orange-600" />
                    <CardHeader className="pb-2">
                        <CardDescription>High Workload</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center gap-2">
                            <span className="text-3xl font-bold">{highWorkloadCount}</span>
                            {highWorkloadCount > 0 && (
                                <Badge className="bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30">
                                    <AlertTriangle className="h-3 w-3 mr-1" />
                                    Attention
                                </Badge>
                            )}
                        </div>
                    </CardContent>
                </Card>
                <Card className="border-0 shadow-md bg-card/80 backdrop-blur-sm overflow-hidden card-hover">
                    <div className="h-1 bg-gradient-to-r from-emerald-500 to-teal-600" />
                    <CardHeader className="pb-2">
                        <CardDescription>Low Workload</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center gap-2">
                            <span className="text-3xl font-bold">{lowWorkloadCount}</span>
                            <Badge className="bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
                                <CheckCircle2 className="h-3 w-3 mr-1" />
                                Available
                            </Badge>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Main Content */}
            <div className="grid gap-6 lg:grid-cols-3">
                <div className="lg:col-span-2 space-y-4">
                    <div className="flex items-center gap-2 mb-2">
                        <TrendingUp className="h-5 w-5 text-primary" />
                        <h2 className="text-xl font-semibold">All Drivers</h2>
                    </div>
                    <p className="text-sm text-muted-foreground mb-4">
                        Sortable table of all active drivers with their current workload status.
                    </p>
                    <DriverTable
                        drivers={stats.driversWithStats}
                        onDriverSelect={(id) =>
                            setSelectedDriverId(id === selectedDriverId ? null : id)
                        }
                    />
                </div>

                <div className="space-y-6">
                    <FairnessChart
                        drivers={stats.driversWithStats}
                        averageEffort={stats.averageEffort}
                    />
                </div>
            </div>

            {/* Transparency Panel */}
            <TransparencyPanel />
        </div>
    );
}
