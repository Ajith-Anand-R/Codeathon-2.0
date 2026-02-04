"use client";

import { useState } from "react";
import { RouteMap } from "@/components/RouteMap";
import { getDashboardStats, mockRoutes } from "@/lib/mockData";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Map, Route, Package, Footprints, Car, CheckCircle2, Clock, Loader2 } from "lucide-react";

export default function RoutesPage() {
    const stats = getDashboardStats();
    const [selectedDriverId, setSelectedDriverId] = useState<string | null>(null);

    // Route statistics
    const inProgressRoutes = mockRoutes.filter((r) => r.status === "in_progress").length;
    const completedRoutes = mockRoutes.filter((r) => r.status === "completed").length;
    const pendingRoutes = mockRoutes.filter((r) => r.status === "pending").length;

    const avgWeight = Math.round(
        mockRoutes.reduce((sum, r) => sum + r.weight_kg, 0) / mockRoutes.length
    );
    const avgStairs = Math.round(
        mockRoutes.reduce((sum, r) => sum + r.stairs_count, 0) / mockRoutes.length
    );

    return (
        <div className="space-y-4 sm:space-y-6 md:space-y-8 animate-fade-in">
            {/* Header */}
            <div className="space-y-2">
                <div className="flex items-center gap-2 md:gap-3">
                    <div className="relative shrink-0">
                        <div className="absolute inset-0 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-lg md:rounded-xl blur-sm opacity-75" />
                        <div className="relative p-2 md:p-2.5 rounded-lg md:rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600">
                            <Map className="h-5 w-5 md:h-6 md:w-6 text-white" />
                        </div>
                    </div>
                    <div>
                        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold tracking-tight">Route Visualization</h1>
                        <p className="text-xs sm:text-sm md:text-base text-muted-foreground">
                            Interactive map showing all active routes with difficulty factors.
                        </p>
                    </div>
                </div>
            </div>

            {/* Quick Stats */}
            <div className="grid gap-4 md:grid-cols-5 stagger-children">
                <Card className="border-0 shadow-md bg-card/80 backdrop-blur-sm overflow-hidden card-hover">
                    <div className="h-1 bg-gradient-to-r from-violet-500 to-purple-600" />
                    <CardHeader className="pb-2">
                        <CardDescription className="flex items-center gap-1">
                            <Route className="h-3 w-3" /> Total Routes
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold">{mockRoutes.length}</div>
                    </CardContent>
                </Card>
                <Card className="border-0 shadow-md bg-card/80 backdrop-blur-sm overflow-hidden card-hover">
                    <div className="h-1 bg-gradient-to-r from-blue-500 to-indigo-600" />
                    <CardHeader className="pb-2">
                        <CardDescription>In Progress</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center gap-2">
                            <span className="text-3xl font-bold">{inProgressRoutes}</span>
                            <Badge className="bg-blue-500/15 text-blue-600 dark:text-blue-400 border border-blue-500/30">
                                <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                                Active
                            </Badge>
                        </div>
                    </CardContent>
                </Card>
                <Card className="border-0 shadow-md bg-card/80 backdrop-blur-sm overflow-hidden card-hover">
                    <div className="h-1 bg-gradient-to-r from-emerald-500 to-teal-600" />
                    <CardHeader className="pb-2">
                        <CardDescription>Completed</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center gap-2">
                            <span className="text-3xl font-bold">{completedRoutes}</span>
                            <Badge className="bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
                                <CheckCircle2 className="h-3 w-3 mr-1" />
                                Done
                            </Badge>
                        </div>
                    </CardContent>
                </Card>
                <Card className="border-0 shadow-md bg-card/80 backdrop-blur-sm overflow-hidden card-hover">
                    <div className="h-1 bg-gradient-to-r from-amber-500 to-orange-600" />
                    <CardHeader className="pb-2">
                        <CardDescription className="flex items-center gap-1">
                            <Package className="h-3 w-3" /> Avg Weight
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold font-mono">{avgWeight}kg</div>
                    </CardContent>
                </Card>
                <Card className="border-0 shadow-md bg-card/80 backdrop-blur-sm overflow-hidden card-hover">
                    <div className="h-1 bg-gradient-to-r from-pink-500 to-rose-600" />
                    <CardHeader className="pb-2">
                        <CardDescription className="flex items-center gap-1">
                            <Footprints className="h-3 w-3" /> Avg Stairs
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold font-mono">{avgStairs}</div>
                    </CardContent>
                </Card>
            </div>

            {/* Map */}
            <RouteMap
                routes={mockRoutes}
                drivers={stats.driversWithStats}
                selectedDriverId={selectedDriverId}
            />

            {/* Route List */}
            <Card className="border-0 shadow-md bg-card/80 backdrop-blur-sm overflow-hidden">
                <div className="h-1 bg-gradient-to-r from-violet-500 via-indigo-500 to-purple-500" />
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Route className="h-5 w-5 text-primary" />
                        Route Details
                    </CardTitle>
                    <CardDescription>
                        Click a route to highlight it on the map.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {mockRoutes.map((route) => {
                            const driver = stats.driversWithStats.find(
                                (d) => d.id === route.assigned_driver_id
                            );
                            const isSelected = selectedDriverId === route.assigned_driver_id;

                            return (
                                <button
                                    key={route.id}
                                    onClick={() =>
                                        setSelectedDriverId(
                                            route.assigned_driver_id === selectedDriverId
                                                ? null
                                                : route.assigned_driver_id || null
                                        )
                                    }
                                    className={`p-5 rounded-xl border text-left transition-all duration-200 ${isSelected
                                            ? "border-primary bg-primary/5 ring-2 ring-primary shadow-lg"
                                            : "hover:border-primary/30 hover:bg-muted/50 hover:shadow-md"
                                        }`}
                                >
                                    <div className="flex items-start justify-between">
                                        <div>
                                            <p className="font-semibold text-base">{route.name}</p>
                                            <p className="text-sm text-muted-foreground mt-0.5">
                                                {driver?.name || "Unassigned"}
                                            </p>
                                        </div>
                                        <Badge
                                            className={
                                                route.status === "completed"
                                                    ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30"
                                                    : route.status === "in_progress"
                                                        ? "bg-blue-500/15 text-blue-600 dark:text-blue-400 border border-blue-500/30"
                                                        : "bg-muted text-muted-foreground border"
                                            }
                                        >
                                            {route.status === "completed" && <CheckCircle2 className="h-3 w-3 mr-1" />}
                                            {route.status === "in_progress" && <Loader2 className="h-3 w-3 mr-1 animate-spin" />}
                                            {route.status === "pending" && <Clock className="h-3 w-3 mr-1" />}
                                            {route.status.replace("_", " ")}
                                        </Badge>
                                    </div>
                                    <div className="mt-4 flex gap-4 text-sm">
                                        <div className="flex items-center gap-1.5 text-muted-foreground">
                                            <Package className="h-4 w-4 text-blue-500" />
                                            <span>{route.weight_kg}kg</span>
                                        </div>
                                        <div className="flex items-center gap-1.5 text-muted-foreground">
                                            <Footprints className="h-4 w-4 text-amber-500" />
                                            <span>{route.stairs_count} floors</span>
                                        </div>
                                        <div className="flex items-center gap-1.5 text-muted-foreground capitalize">
                                            <Car className="h-4 w-4 text-emerald-500" />
                                            <span>{route.parking_difficulty}</span>
                                        </div>
                                    </div>
                                </button>
                            );
                        })}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
