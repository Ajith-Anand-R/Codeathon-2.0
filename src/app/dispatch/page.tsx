"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
    getDashboardStats,
    mockPendingRoutes,
    mockDrivers,
    mockEffortScores,
    simulateAIDispatch,
    calculateRouteDifficulty,
    getDriverById,
    type DispatchDecision,
} from "@/lib/mockData";
import type { Route } from "@/lib/supabaseClient";
import {
    Sparkles,
    Bot,
    Route as RouteIcon,
    User,
    CheckCircle2,
    ArrowRight,
    Package,
    Footprints,
    Car,
    Brain,
    Zap,
    TrendingDown,
    TrendingUp,
    RefreshCw,
    Clock,
    Target,
    AlertTriangle,
} from "lucide-react";

interface AssignmentState {
    route: Route;
    decision: DispatchDecision | null;
    status: "pending" | "thinking" | "decided" | "assigned";
    assignedDriverId?: string;
}

export default function DispatchPage() {
    const stats = getDashboardStats();
    const [assignments, setAssignments] = useState<AssignmentState[]>([]);
    const [currentEfforts, setCurrentEfforts] = useState<Map<string, number>>(new Map());
    const [isSimulating, setIsSimulating] = useState(false);
    const [thinkingSteps, setThinkingSteps] = useState<string[]>([]);

    // Initialize state
    useEffect(() => {
        // Initialize pending routes
        setAssignments(
            mockPendingRoutes.map((route) => ({
                route,
                decision: null,
                status: "pending",
            }))
        );

        // Initialize current effort scores
        const efforts = new Map<string, number>();
        mockEffortScores.forEach((es) => {
            efforts.set(es.driver_id, es.score);
        });
        setCurrentEfforts(efforts);
    }, []);

    // Simulate AI thinking process
    const simulateThinking = async (route: Route): Promise<DispatchDecision> => {
        const steps = [
            "Analyzing route characteristics...",
            "Calculating package weight impact...",
            "Evaluating stair climb difficulty...",
            "Assessing parking conditions...",
            "Comparing driver workloads...",
            "Checking weekly hard route distribution...",
            "Computing fairness impact...",
            "Generating recommendation...",
        ];

        for (const step of steps) {
            setThinkingSteps((prev) => [...prev, step]);
            await new Promise((r) => setTimeout(r, 400));
        }

        return simulateAIDispatch(route, currentEfforts);
    };

    // Run AI dispatch for a single route
    const runDispatch = async (routeIndex: number) => {
        setIsSimulating(true);
        setThinkingSteps([]);

        // Update status to thinking
        setAssignments((prev) =>
            prev.map((a, i) => (i === routeIndex ? { ...a, status: "thinking" } : a))
        );

        const route = assignments[routeIndex].route;
        const decision = await simulateThinking(route);

        // Update with decision
        setAssignments((prev) =>
            prev.map((a, i) =>
                i === routeIndex ? { ...a, decision, status: "decided" } : a
            )
        );

        setIsSimulating(false);
    };

    // Accept AI recommendation
    const acceptRecommendation = (routeIndex: number) => {
        const assignment = assignments[routeIndex];
        if (!assignment.decision) return;

        const driverId = assignment.decision.recommendedDriverId;
        const difficulty = calculateRouteDifficulty(assignment.route);

        // Update effort scores
        setCurrentEfforts((prev) => {
            const newEfforts = new Map(prev);
            newEfforts.set(driverId, (newEfforts.get(driverId) || 0) + difficulty.score);
            return newEfforts;
        });

        // Update assignment status
        setAssignments((prev) =>
            prev.map((a, i) =>
                i === routeIndex
                    ? { ...a, status: "assigned", assignedDriverId: driverId }
                    : a
            )
        );
    };

    // Assign to alternative driver
    const assignToAlternative = (routeIndex: number, driverId: string) => {
        const assignment = assignments[routeIndex];
        const difficulty = calculateRouteDifficulty(assignment.route);

        // Update effort scores
        setCurrentEfforts((prev) => {
            const newEfforts = new Map(prev);
            newEfforts.set(driverId, (newEfforts.get(driverId) || 0) + difficulty.score);
            return newEfforts;
        });

        // Update assignment status
        setAssignments((prev) =>
            prev.map((a, i) =>
                i === routeIndex
                    ? { ...a, status: "assigned", assignedDriverId: driverId }
                    : a
            )
        );
    };

    // Reset simulation
    const resetSimulation = () => {
        setAssignments(
            mockPendingRoutes.map((route) => ({
                route,
                decision: null,
                status: "pending",
            }))
        );
        const efforts = new Map<string, number>();
        mockEffortScores.forEach((es) => {
            efforts.set(es.driver_id, es.score);
        });
        setCurrentEfforts(efforts);
        setThinkingSteps([]);
    };

    // Calculate current fairness
    const currentScores = Array.from(currentEfforts.values());
    const avgEffort = currentScores.reduce((a, b) => a + b, 0) / currentScores.length;

    const getDifficultyBadge = (level: "Easy" | "Medium" | "Hard") => {
        switch (level) {
            case "Easy":
                return "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30";
            case "Medium":
                return "bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30";
            case "Hard":
                return "bg-red-500/15 text-red-600 dark:text-red-400 border-red-500/30";
        }
    };

    return (
        <div className="space-y-8 animate-fade-in">
            {/* Header */}
            <div className="space-y-2">
                <div className="flex items-center gap-3">
                    <div className="relative">
                        <div className="absolute inset-0 bg-gradient-to-br from-violet-500 to-purple-600 rounded-xl blur-sm opacity-75" />
                        <div className="relative p-2.5 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600">
                            <Bot className="h-6 w-6 text-white" />
                        </div>
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
                            AI Dispatch Simulator
                            <Badge className="bg-primary/10 text-primary border-0">
                                <Sparkles className="h-3 w-3 mr-1" />
                                Interactive
                            </Badge>
                        </h1>
                        <p className="text-muted-foreground">
                            Watch how a thoughtful AI dispatcher assigns routes fairly.
                        </p>
                    </div>
                </div>
            </div>

            {/* Info Banner */}
            <Card className="border-0 shadow-md overflow-hidden bg-gradient-to-r from-violet-500/10 via-purple-500/5 to-transparent">
                <div className="h-1 bg-gradient-to-r from-violet-500 via-purple-500 to-pink-500" />
                <CardContent className="pt-6">
                    <div className="flex gap-4">
                        <div className="p-3 rounded-xl bg-violet-500/10 h-fit">
                            <Brain className="h-6 w-6 text-violet-500" />
                        </div>
                        <div className="space-y-2">
                            <p className="font-semibold text-lg">How the AI Dispatcher Thinks</p>
                            <p className="text-sm text-muted-foreground leading-relaxed">
                                This simulator demonstrates how a fair dispatch system evaluates routes and assigns them
                                to drivers. The AI considers <span className="text-foreground font-medium">current workload</span>,{" "}
                                <span className="text-foreground font-medium">route difficulty</span>, and{" "}
                                <span className="text-foreground font-medium">weekly hard route history</span> to make
                                equitable decisions — just like a thoughtful human dispatcher would.
                            </p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Main Grid */}
            <div className="grid gap-6 lg:grid-cols-3">
                {/* Driver Workloads Panel */}
                <div className="space-y-4">
                    <Card className="border-0 shadow-md bg-card/80 backdrop-blur-sm overflow-hidden">
                        <div className="h-1 bg-gradient-to-r from-blue-500 to-indigo-600" />
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <User className="h-5 w-5 text-primary" />
                                Current Driver Workloads
                            </CardTitle>
                            <CardDescription>Live effort scores for today</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            {mockDrivers.map((driver) => {
                                const effort = currentEfforts.get(driver.id) || 0;
                                const diff = ((effort - avgEffort) / avgEffort) * 100;
                                const isHigh = diff > 15;
                                const isLow = diff < -15;

                                return (
                                    <div
                                        key={driver.id}
                                        className="p-3 rounded-xl bg-muted/30 border flex items-center justify-between"
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-violet-500/20 to-indigo-500/20 flex items-center justify-center text-sm font-semibold text-primary">
                                                {driver.name
                                                    .split(" ")
                                                    .map((n) => n[0])
                                                    .join("")}
                                            </div>
                                            <div>
                                                <p className="font-medium text-sm">{driver.name}</p>
                                                <p className="text-xs text-muted-foreground">
                                                    {isHigh ? "High workload" : isLow ? "Low workload" : "Balanced"}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-mono font-bold text-lg">{effort}</p>
                                            <p
                                                className={`text-xs font-medium ${isHigh
                                                        ? "text-orange-500"
                                                        : isLow
                                                            ? "text-blue-500"
                                                            : "text-emerald-500"
                                                    }`}
                                            >
                                                {diff > 0 ? "+" : ""}
                                                {Math.round(diff)}%
                                            </p>
                                        </div>
                                    </div>
                                );
                            })}
                            <Separator className="my-4" />
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-muted-foreground">Team Average</span>
                                <span className="font-mono font-bold">{avgEffort.toFixed(1)}</span>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Reset Button */}
                    <Button
                        variant="outline"
                        className="w-full"
                        onClick={resetSimulation}
                        disabled={isSimulating}
                    >
                        <RefreshCw className="h-4 w-4 mr-2" />
                        Reset Simulation
                    </Button>
                </div>

                {/* Pending Routes & Decisions */}
                <div className="lg:col-span-2 space-y-4">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-semibold flex items-center gap-2">
                            <RouteIcon className="h-5 w-5 text-primary" />
                            Pending Route Assignments
                        </h2>
                        <Badge variant="outline">
                            {assignments.filter((a) => a.status === "assigned").length} /{" "}
                            {assignments.length} assigned
                        </Badge>
                    </div>

                    {assignments.map((assignment, index) => {
                        const difficulty = calculateRouteDifficulty(assignment.route);
                        const recommendedDriver = assignment.decision
                            ? getDriverById(assignment.decision.recommendedDriverId)
                            : null;
                        const assignedDriver = assignment.assignedDriverId
                            ? getDriverById(assignment.assignedDriverId)
                            : null;

                        return (
                            <Card
                                key={assignment.route.id}
                                className={`border-0 shadow-md bg-card/80 backdrop-blur-sm overflow-hidden transition-all duration-300 ${assignment.status === "assigned"
                                        ? "opacity-75"
                                        : ""
                                    }`}
                            >
                                <div
                                    className={`h-1 ${assignment.status === "assigned"
                                            ? "bg-gradient-to-r from-emerald-500 to-teal-600"
                                            : assignment.status === "thinking"
                                                ? "bg-gradient-to-r from-violet-500 to-purple-600 animate-pulse"
                                                : "bg-gradient-to-r from-amber-500 to-orange-600"
                                        }`}
                                />
                                <CardContent className="pt-5">
                                    <div className="flex items-start justify-between mb-4">
                                        <div>
                                            <h3 className="font-semibold text-lg flex items-center gap-2">
                                                {assignment.route.name}
                                                <Badge
                                                    className={`border ${getDifficultyBadge(
                                                        difficulty.level
                                                    )}`}
                                                >
                                                    {difficulty.level}
                                                </Badge>
                                            </h3>
                                            <div className="flex flex-wrap gap-3 mt-2 text-sm text-muted-foreground">
                                                <span className="flex items-center gap-1">
                                                    <Package className="h-4 w-4 text-blue-500" />
                                                    {assignment.route.weight_kg}kg
                                                </span>
                                                <span className="flex items-center gap-1">
                                                    <Footprints className="h-4 w-4 text-amber-500" />
                                                    {assignment.route.stairs_count} floors
                                                </span>
                                                <span className="flex items-center gap-1">
                                                    <Car className="h-4 w-4 text-emerald-500" />
                                                    {assignment.route.parking_difficulty}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-sm text-muted-foreground">Effort Score</p>
                                            <p className="font-mono font-bold text-2xl">{difficulty.score}</p>
                                        </div>
                                    </div>

                                    {/* Status: Pending */}
                                    {assignment.status === "pending" && (
                                        <Button
                                            onClick={() => runDispatch(index)}
                                            className="w-full bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700"
                                            disabled={isSimulating}
                                        >
                                            <Sparkles className="h-4 w-4 mr-2" />
                                            Run AI Dispatch Analysis
                                        </Button>
                                    )}

                                    {/* Status: Thinking */}
                                    {assignment.status === "thinking" && (
                                        <div className="p-4 rounded-xl bg-violet-500/10 border border-violet-500/30">
                                            <div className="flex items-center gap-2 mb-3">
                                                <Brain className="h-5 w-5 text-violet-500 animate-pulse" />
                                                <span className="font-medium text-violet-600 dark:text-violet-400">
                                                    AI is analyzing...
                                                </span>
                                            </div>
                                            <div className="space-y-1 text-sm text-muted-foreground">
                                                {thinkingSteps.map((step, i) => (
                                                    <p key={i} className="flex items-center gap-2 animate-fade-in">
                                                        <CheckCircle2 className="h-3 w-3 text-emerald-500" />
                                                        {step}
                                                    </p>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* Status: Decided */}
                                    {assignment.status === "decided" && assignment.decision && (
                                        <div className="space-y-4">
                                            {/* AI Recommendation */}
                                            <div className="p-4 rounded-xl bg-gradient-to-r from-emerald-500/10 via-emerald-500/5 to-transparent border border-emerald-500/30">
                                                <div className="flex items-center justify-between mb-3">
                                                    <div className="flex items-center gap-2">
                                                        <Target className="h-5 w-5 text-emerald-500" />
                                                        <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                                                            AI Recommendation
                                                        </span>
                                                    </div>
                                                    <Badge className="bg-emerald-500/15 text-emerald-600 border-emerald-500/30 border">
                                                        {Math.round(assignment.decision.confidence * 100)}% confidence
                                                    </Badge>
                                                </div>

                                                <div className="flex items-center gap-4 mb-4">
                                                    <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-emerald-500/20 to-teal-500/20 flex items-center justify-center text-lg font-bold text-emerald-600">
                                                        {recommendedDriver?.name
                                                            .split(" ")
                                                            .map((n) => n[0])
                                                            .join("")}
                                                    </div>
                                                    <div>
                                                        <p className="font-semibold text-lg">{recommendedDriver?.name}</p>
                                                        <p className="text-sm text-muted-foreground">Best match for fairness</p>
                                                    </div>
                                                </div>

                                                {/* Reasoning */}
                                                <div className="space-y-2 mb-4">
                                                    <p className="text-sm font-medium">Why this driver?</p>
                                                    {assignment.decision.reasoning.map((reason, i) => (
                                                        <p key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                                                            <Zap className="h-4 w-4 text-amber-500 mt-0.5 shrink-0" />
                                                            {reason}
                                                        </p>
                                                    ))}
                                                </div>

                                                {/* Fairness Impact */}
                                                <div className="flex items-center gap-4 p-3 rounded-lg bg-muted/30 mb-4">
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-sm text-muted-foreground">Fairness Impact:</span>
                                                        <span className="font-mono">
                                                            {assignment.decision.fairnessImpact.before}
                                                        </span>
                                                        <ArrowRight className="h-4 w-4 text-muted-foreground" />
                                                        <span
                                                            className={`font-mono font-bold ${assignment.decision.fairnessImpact.after <=
                                                                    assignment.decision.fairnessImpact.before
                                                                    ? "text-emerald-500"
                                                                    : "text-orange-500"
                                                                }`}
                                                        >
                                                            {assignment.decision.fairnessImpact.after}
                                                        </span>
                                                        {assignment.decision.fairnessImpact.after <=
                                                            assignment.decision.fairnessImpact.before ? (
                                                            <TrendingDown className="h-4 w-4 text-emerald-500" />
                                                        ) : (
                                                            <TrendingUp className="h-4 w-4 text-orange-500" />
                                                        )}
                                                    </div>
                                                </div>

                                                <Button
                                                    onClick={() => acceptRecommendation(index)}
                                                    className="w-full bg-emerald-600 hover:bg-emerald-700"
                                                >
                                                    <CheckCircle2 className="h-4 w-4 mr-2" />
                                                    Accept Recommendation
                                                </Button>
                                            </div>

                                            {/* Alternatives */}
                                            {assignment.decision.alternativeDrivers.length > 0 && (
                                                <div className="p-4 rounded-xl bg-muted/30 border">
                                                    <p className="text-sm font-medium mb-3 flex items-center gap-2">
                                                        <AlertTriangle className="h-4 w-4 text-amber-500" />
                                                        Alternative Options (Override AI)
                                                    </p>
                                                    <div className="space-y-2">
                                                        {assignment.decision.alternativeDrivers.map((alt) => {
                                                            const altDriver = getDriverById(alt.driverId);
                                                            return (
                                                                <div
                                                                    key={alt.driverId}
                                                                    className="flex items-center justify-between p-2 rounded-lg hover:bg-muted/50 transition-colors"
                                                                >
                                                                    <div className="flex items-center gap-2">
                                                                        <div className="h-8 w-8 rounded-lg bg-muted flex items-center justify-center text-xs font-semibold">
                                                                            {altDriver?.name
                                                                                .split(" ")
                                                                                .map((n) => n[0])
                                                                                .join("")}
                                                                        </div>
                                                                        <div>
                                                                            <p className="text-sm font-medium">{altDriver?.name}</p>
                                                                            <p className="text-xs text-muted-foreground">{alt.reason}</p>
                                                                        </div>
                                                                    </div>
                                                                    <Button
                                                                        size="sm"
                                                                        variant="outline"
                                                                        onClick={() => assignToAlternative(index, alt.driverId)}
                                                                    >
                                                                        Assign
                                                                    </Button>
                                                                </div>
                                                            );
                                                        })}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    )}

                                    {/* Status: Assigned */}
                                    {assignment.status === "assigned" && (
                                        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30">
                                            <div className="flex items-center gap-3">
                                                <CheckCircle2 className="h-6 w-6 text-emerald-500" />
                                                <div>
                                                    <p className="font-semibold text-emerald-600 dark:text-emerald-400">
                                                        Assigned to {assignedDriver?.name}
                                                    </p>
                                                    <p className="text-sm text-muted-foreground flex items-center gap-1">
                                                        <Clock className="h-3 w-3" />
                                                        Just now
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
