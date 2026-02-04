/**
 * Mock Data for Development
 * 
 * This file provides realistic sample data for development when
 * Supabase is not yet configured. Remove or replace with actual
 * Supabase calls in production.
 * 
 * The data simulates a thoughtful AI dispatch system that considers:
 * - Package weight and quantity
 * - Stair climbs and physical effort
 * - Parking difficulty
 * - Driver workload history
 * - Fair distribution of difficult routes
 */

import { Driver, Route, EffortScore, Assignment, Explanation } from "./supabaseClient";

// Extended driver data with experience and preferences
export const mockDrivers: Driver[] = [
    { id: "d1", name: "Ajith Anand R", email: "ajith.anand@fairroute.ai", avatar_url: undefined },
    { id: "d2", name: "Kathick S", email: "kathick.s@fairroute.ai", avatar_url: undefined },
    { id: "d3", name: "Manikandan S", email: "manikandan.s@fairroute.ai", avatar_url: undefined },
    { id: "d4", name: "Salik S", email: "salik.s@fairroute.ai", avatar_url: undefined },
    { id: "d5", name: "Gokul E", email: "gokul.e@fairroute.ai", avatar_url: undefined },
];

// Driver experience and history data
export interface DriverHistory {
    driverId: string;
    experienceYears: number;
    totalDeliveriesLifetime: number;
    avgDailyEffort: number;
    hardRoutesThisWeek: number;
    easyRoutesThisWeek: number;
    satisfactionScore: number; // 1-5
    lastHardRouteDate: string;
}

export const mockDriverHistory: DriverHistory[] = [
    { driverId: "d1", experienceYears: 3, totalDeliveriesLifetime: 4520, avgDailyEffort: 28, hardRoutesThisWeek: 2, easyRoutesThisWeek: 3, satisfactionScore: 4.2, lastHardRouteDate: "2024-01-15" },
    { driverId: "d2", experienceYears: 5, totalDeliveriesLifetime: 8900, avgDailyEffort: 30, hardRoutesThisWeek: 3, easyRoutesThisWeek: 2, satisfactionScore: 4.5, lastHardRouteDate: "2024-01-16" },
    { driverId: "d3", experienceYears: 2, totalDeliveriesLifetime: 2100, avgDailyEffort: 25, hardRoutesThisWeek: 1, easyRoutesThisWeek: 4, satisfactionScore: 4.0, lastHardRouteDate: "2024-01-10" },
    { driverId: "d4", experienceYears: 4, totalDeliveriesLifetime: 6200, avgDailyEffort: 32, hardRoutesThisWeek: 4, easyRoutesThisWeek: 1, satisfactionScore: 3.8, lastHardRouteDate: "2024-01-17" },
    { driverId: "d5", experienceYears: 1, totalDeliveriesLifetime: 890, avgDailyEffort: 24, hardRoutesThisWeek: 1, easyRoutesThisWeek: 4, satisfactionScore: 4.3, lastHardRouteDate: "2024-01-08" },
];

// Package details for more realistic simulation
export interface Package {
    id: string;
    routeId: string;
    weight_kg: number;
    isFragile: boolean;
    requiresSignature: boolean;
    deliveryType: "residential" | "commercial" | "apartment";
    floor: number;
}

export const mockPackages: Package[] = [
    // Route r1 packages (Downtown - hard parking, apartments)
    { id: "p1", routeId: "r1", weight_kg: 5, isFragile: true, requiresSignature: true, deliveryType: "apartment", floor: 4 },
    { id: "p2", routeId: "r1", weight_kg: 8, isFragile: false, requiresSignature: false, deliveryType: "commercial", floor: 0 },
    { id: "p3", routeId: "r1", weight_kg: 3, isFragile: false, requiresSignature: true, deliveryType: "apartment", floor: 6 },
    { id: "p4", routeId: "r1", weight_kg: 2, isFragile: true, requiresSignature: false, deliveryType: "apartment", floor: 3 },
    // Route r2 packages (Suburban - easy parking, houses)
    { id: "p5", routeId: "r2", weight_kg: 4, isFragile: false, requiresSignature: false, deliveryType: "residential", floor: 0 },
    { id: "p6", routeId: "r2", weight_kg: 6, isFragile: false, requiresSignature: false, deliveryType: "residential", floor: 0 },
    { id: "p7", routeId: "r2", weight_kg: 2, isFragile: false, requiresSignature: false, deliveryType: "residential", floor: 0 },
    // Route r3 packages (Industrial - moderate, bulk)
    { id: "p8", routeId: "r3", weight_kg: 15, isFragile: false, requiresSignature: true, deliveryType: "commercial", floor: 0 },
    { id: "p9", routeId: "r3", weight_kg: 10, isFragile: false, requiresSignature: true, deliveryType: "commercial", floor: 0 },
    // Route r4 packages (Residential Hills - stairs)
    { id: "p10", routeId: "r4", weight_kg: 3, isFragile: true, requiresSignature: false, deliveryType: "residential", floor: 2 },
    { id: "p11", routeId: "r4", weight_kg: 2, isFragile: false, requiresSignature: false, deliveryType: "residential", floor: 3 },
    { id: "p12", routeId: "r4", weight_kg: 3, isFragile: false, requiresSignature: false, deliveryType: "residential", floor: 1 },
    // Route r5 packages (Commercial District)
    { id: "p13", routeId: "r5", weight_kg: 7, isFragile: false, requiresSignature: true, deliveryType: "commercial", floor: 2 },
    { id: "p14", routeId: "r5", weight_kg: 8, isFragile: true, requiresSignature: true, deliveryType: "commercial", floor: 0 },
];

export const mockRoutes: Route[] = [
    {
        id: "r1",
        name: "Redhills Zone A",
        status: "in_progress",
        geometry: {
            type: "LineString",
            coordinates: [
                [80.1833, 13.1900],
                [80.1750, 13.1850],
                [80.1700, 13.1800],
            ],
        },
        weight_kg: 18,
        stairs_count: 4,
        parking_difficulty: "hard",
        assigned_driver_id: "d1",
    },
    {
        id: "r2",
        name: "Ambattur Zone B",
        status: "in_progress",
        geometry: {
            type: "LineString",
            coordinates: [
                [80.1620, 13.1146],
                [80.1550, 13.1100],
                [80.1480, 13.1050],
            ],
        },
        weight_kg: 12,
        stairs_count: 1,
        parking_difficulty: "easy",
        assigned_driver_id: "d2",
    },
    {
        id: "r3",
        name: "Anna Nagar Zone C",
        status: "completed",
        geometry: {
            type: "LineString",
            coordinates: [
                [80.2090, 13.0850],
                [80.2150, 13.0900],
                [80.2200, 13.0950],
            ],
        },
        weight_kg: 25,
        stairs_count: 0,
        parking_difficulty: "moderate",
        assigned_driver_id: "d3",
    },
    {
        id: "r4",
        name: "T.Nagar Zone D",
        status: "pending",
        geometry: {
            type: "LineString",
            coordinates: [
                [80.2340, 13.0400],
                [80.2400, 13.0450],
                [80.2450, 13.0500],
            ],
        },
        weight_kg: 8,
        stairs_count: 6,
        parking_difficulty: "moderate",
        assigned_driver_id: "d4",
    },
    {
        id: "r5",
        name: "Avadi Zone E",
        status: "in_progress",
        geometry: {
            type: "LineString",
            coordinates: [
                [80.1010, 13.1150],
                [80.0950, 13.1100],
                [80.0900, 13.1050],
            ],
        },
        weight_kg: 15,
        stairs_count: 2,
        parking_difficulty: "hard",
        assigned_driver_id: "d5",
    },
];

export const mockEffortScores: EffortScore[] = [
    { id: "es1", driver_id: "d1", route_id: "r1", score: 32, date: new Date().toISOString() },
    { id: "es2", driver_id: "d2", route_id: "r2", score: 18, date: new Date().toISOString() },
    { id: "es3", driver_id: "d3", route_id: "r3", score: 28, date: new Date().toISOString() },
    { id: "es4", driver_id: "d4", route_id: "r4", score: 35, date: new Date().toISOString() },
    { id: "es5", driver_id: "d5", route_id: "r5", score: 26, date: new Date().toISOString() },
];

export const mockAssignments: Assignment[] = [
    { id: "a1", driver_id: "d1", route_id: "r1", assigned_at: new Date().toISOString() },
    { id: "a2", driver_id: "d2", route_id: "r2", assigned_at: new Date().toISOString() },
    { id: "a3", driver_id: "d3", route_id: "r3", assigned_at: new Date().toISOString() },
    { id: "a4", driver_id: "d4", route_id: "r4", assigned_at: new Date().toISOString() },
    { id: "a5", driver_id: "d5", route_id: "r5", assigned_at: new Date().toISOString() },
];

export const mockExplanations: Explanation[] = [
    {
        id: "ex1",
        assignment_id: "a1",
        driver_id: "d1",
        route_id: "r1",
        reason_text:
            "This route was assigned to Ajith Anand R because their cumulative effort today was 18% below the team average, and this route involves heavier packages (18kg) and challenging parking conditions.",
        factors: { weight: 18, stairs: 4, parking: "hard", effort_diff: -18 },
    },
    {
        id: "ex2",
        assignment_id: "a2",
        driver_id: "d2",
        route_id: "r2",
        reason_text:
            "Kathick S was selected because their workload is aligned with the team average, and this route involves convenient parking access.",
        factors: { weight: 12, stairs: 1, parking: "easy", effort_diff: 2 },
    },
    {
        id: "ex3",
        assignment_id: "a3",
        driver_id: "d3",
        route_id: "r3",
        reason_text:
            "Manikandan S was selected because their workload is aligned with the team average, and this route involves heavier packages (25kg).",
        factors: { weight: 25, stairs: 0, parking: "moderate", effort_diff: 5 },
    },
    {
        id: "ex4",
        assignment_id: "a4",
        driver_id: "d4",
        route_id: "r4",
        reason_text:
            "Despite Salik S's effort being 22% above average, this route was the best match based on location and timing, and this route involves multiple stair climbs (6 floors).",
        factors: { weight: 8, stairs: 6, parking: "moderate", effort_diff: 22 },
    },
    {
        id: "ex5",
        assignment_id: "a5",
        driver_id: "d5",
        route_id: "r5",
        reason_text:
            "Gokul E was selected because their workload is aligned with the team average, and this route involves challenging parking conditions.",
        factors: { weight: 15, stairs: 2, parking: "hard", effort_diff: -3 },
    },
];

// Aggregated driver data for the dashboard
export interface DriverWithStats {
    id: string;
    name: string;
    email: string;
    deliveriesCount: number;
    totalEffortScore: number;
    workloadLevel: "Low" | "Medium" | "High";
    assignedRoute: Route | null;
    explanation: Explanation | null;
}

export function getDriversWithStats(): DriverWithStats[] {
    const avgEffort = mockEffortScores.reduce((sum, es) => sum + es.score, 0) / mockEffortScores.length;

    return mockDrivers.map((driver) => {
        const effortScore = mockEffortScores.find((es) => es.driver_id === driver.id);
        const route = mockRoutes.find((r) => r.assigned_driver_id === driver.id);
        const explanation = mockExplanations.find((ex) => ex.driver_id === driver.id);

        const score = effortScore?.score || 0;
        const diff = ((score - avgEffort) / avgEffort) * 100;
        let workloadLevel: "Low" | "Medium" | "High" = "Medium";
        if (diff < -15) workloadLevel = "Low";
        else if (diff > 15) workloadLevel = "High";

        return {
            id: driver.id,
            name: driver.name,
            email: driver.email,
            deliveriesCount: route ? 1 : 0, // Simplified for mock
            totalEffortScore: score,
            workloadLevel,
            assignedRoute: route || null,
            explanation: explanation || null,
        };
    });
}

export function getDashboardStats() {
    const driversWithStats = getDriversWithStats();
    const totalDrivers = mockDrivers.length;
    const totalDeliveries = mockRoutes.filter((r) => r.status !== "pending").length;
    const avgEffort = mockEffortScores.reduce((sum, es) => sum + es.score, 0) / mockEffortScores.length;

    // Calculate Gini coefficient
    const scores = mockEffortScores.map((es) => es.score);
    const sorted = [...scores].sort((a, b) => a - b);
    const n = sorted.length;
    const mean = sorted.reduce((sum, val) => sum + val, 0) / n;
    let sumOfDifferences = 0;
    for (let i = 0; i < n; i++) {
        for (let j = 0; j < n; j++) {
            sumOfDifferences += Math.abs(sorted[i] - sorted[j]);
        }
    }
    const giniCoefficient = mean > 0 ? sumOfDifferences / (2 * n * n * mean) : 0;

    return {
        totalDrivers,
        totalDeliveries,
        averageEffort: Math.round(avgEffort * 10) / 10,
        giniCoefficient: Math.round(giniCoefficient * 1000) / 1000,
        driversWithStats,
    };
}

// Historical fairness data for weekly tracking
export interface FairnessHistory {
    date: string;
    giniCoefficient: number;
    avgEffort: number;
    highWorkloadDrivers: number;
    lowWorkloadDrivers: number;
}

export const mockFairnessHistory: FairnessHistory[] = [
    { date: "2024-01-11", giniCoefficient: 0.22, avgEffort: 26.5, highWorkloadDrivers: 2, lowWorkloadDrivers: 1 },
    { date: "2024-01-12", giniCoefficient: 0.18, avgEffort: 27.2, highWorkloadDrivers: 1, lowWorkloadDrivers: 2 },
    { date: "2024-01-13", giniCoefficient: 0.15, avgEffort: 28.0, highWorkloadDrivers: 1, lowWorkloadDrivers: 1 },
    { date: "2024-01-14", giniCoefficient: 0.12, avgEffort: 27.8, highWorkloadDrivers: 0, lowWorkloadDrivers: 1 },
    { date: "2024-01-15", giniCoefficient: 0.14, avgEffort: 28.5, highWorkloadDrivers: 1, lowWorkloadDrivers: 1 },
    { date: "2024-01-16", giniCoefficient: 0.11, avgEffort: 27.0, highWorkloadDrivers: 0, lowWorkloadDrivers: 0 },
    { date: "2024-01-17", giniCoefficient: 0.19, avgEffort: 27.8, highWorkloadDrivers: 1, lowWorkloadDrivers: 1 },
];

// Pending routes that need assignment - for dispatch simulation
export const mockPendingRoutes: Route[] = [
    {
        id: "pr1",
        name: "Perambur Zone F",
        status: "pending",
        geometry: {
            type: "LineString",
            coordinates: [
                [80.2330, 13.1180],
                [80.2380, 13.1220],
                [80.2430, 13.1260],
            ],
        },
        weight_kg: 22,
        stairs_count: 8,
        parking_difficulty: "hard",
        assigned_driver_id: undefined,
    },
    {
        id: "pr2",
        name: "Velachery Zone G",
        status: "pending",
        geometry: {
            type: "LineString",
            coordinates: [
                [80.2180, 12.9780],
                [80.2230, 12.9820],
                [80.2280, 12.9860],
            ],
        },
        weight_kg: 8,
        stairs_count: 0,
        parking_difficulty: "easy",
        assigned_driver_id: undefined,
    },
    {
        id: "pr3",
        name: "Adyar Zone H",
        status: "pending",
        geometry: {
            type: "LineString",
            coordinates: [
                [80.2570, 13.0060],
                [80.2620, 13.0100],
                [80.2670, 13.0140],
            ],
        },
        weight_kg: 18,
        stairs_count: 3,
        parking_difficulty: "moderate",
        assigned_driver_id: undefined,
    },
];

// Calculate route difficulty score (used by AI dispatcher)
export function calculateRouteDifficulty(route: Route): { score: number; level: "Easy" | "Medium" | "Hard"; factors: string[] } {
    let score = 10; // Base score
    const factors: string[] = [];
    
    // Weight factor
    if (route.weight_kg > 20) {
        score += 15;
        factors.push(`Heavy load (${route.weight_kg}kg)`);
    } else if (route.weight_kg > 15) {
        score += 8;
        factors.push(`Moderate weight (${route.weight_kg}kg)`);
    }
    
    // Stairs factor
    if (route.stairs_count > 5) {
        score += 18;
        factors.push(`Many stairs (${route.stairs_count} floors)`);
    } else if (route.stairs_count > 2) {
        score += 9;
        factors.push(`Some stairs (${route.stairs_count} floors)`);
    }
    
    // Parking factor
    if (route.parking_difficulty === "hard") {
        score += 10;
        factors.push("Difficult parking");
    } else if (route.parking_difficulty === "moderate") {
        score += 5;
        factors.push("Moderate parking");
    }
    
    let level: "Easy" | "Medium" | "Hard" = "Medium";
    if (score < 20) level = "Easy";
    else if (score > 35) level = "Hard";
    
    return { score, level, factors };
}

// Simulate AI dispatcher decision making
export interface DispatchDecision {
    routeId: string;
    recommendedDriverId: string;
    confidence: number;
    reasoning: string[];
    alternativeDrivers: { driverId: string; reason: string }[];
    fairnessImpact: { before: number; after: number };
}

export function simulateAIDispatch(pendingRoute: Route, currentEffortScores: Map<string, number>): DispatchDecision {
    const difficulty = calculateRouteDifficulty(pendingRoute);
    const avgEffort = Array.from(currentEffortScores.values()).reduce((a, b) => a + b, 0) / currentEffortScores.size;
    
    // Find the most suitable driver based on fairness
    let bestDriver = mockDrivers[0];
    let bestScore = Infinity;
    const driverScores: { driver: typeof mockDrivers[0]; score: number; reason: string }[] = [];
    
    for (const driver of mockDrivers) {
        const currentEffort = currentEffortScores.get(driver.id) || 0;
        const history = mockDriverHistory.find(h => h.driverId === driver.id);
        
        // Calculate suitability score (lower is better for fairness)
        let suitabilityScore = currentEffort - avgEffort;
        
        // Bonus for drivers who haven't had hard routes recently
        if (difficulty.level === "Hard" && history) {
            const daysSinceHardRoute = Math.floor((Date.now() - new Date(history.lastHardRouteDate).getTime()) / (1000 * 60 * 60 * 24));
            suitabilityScore -= daysSinceHardRoute * 0.5;
        }
        
        // Penalty for drivers already at high workload
        if (currentEffort > avgEffort * 1.15) {
            suitabilityScore += 20;
        }
        
        let reason = "";
        if (currentEffort < avgEffort * 0.85) {
            reason = "Has lower than average workload today";
        } else if (currentEffort > avgEffort * 1.15) {
            reason = "Already has high workload";
        } else {
            reason = "Balanced workload";
        }
        
        driverScores.push({ driver, score: suitabilityScore, reason });
        
        if (suitabilityScore < bestScore) {
            bestScore = suitabilityScore;
            bestDriver = driver;
        }
    }
    
    // Sort alternatives by score
    const sortedAlternatives = driverScores
        .filter(d => d.driver.id !== bestDriver.id)
        .sort((a, b) => a.score - b.score)
        .slice(0, 2);
    
    // Calculate fairness impact
    const currentScores = Array.from(currentEffortScores.values());
    const currentGini = calculateGiniFromScores(currentScores);
    
    const newScores = [...currentScores];
    const bestDriverIndex = mockDrivers.findIndex(d => d.id === bestDriver.id);
    newScores[bestDriverIndex] += difficulty.score;
    const newGini = calculateGiniFromScores(newScores);
    
    // Generate reasoning
    const reasoning: string[] = [];
    const bestDriverEffort = currentEffortScores.get(bestDriver.id) || 0;
    const diffFromAvg = ((bestDriverEffort - avgEffort) / avgEffort) * 100;
    
    if (diffFromAvg < -10) {
        reasoning.push(`${bestDriver.name}'s current effort (${bestDriverEffort}) is ${Math.abs(Math.round(diffFromAvg))}% below team average`);
    } else if (diffFromAvg > 10) {
        reasoning.push(`Although ${bestDriver.name} is above average, location and timing make this the best match`);
    } else {
        reasoning.push(`${bestDriver.name}'s workload is well-balanced with the team`);
    }
    
    if (difficulty.level === "Hard") {
        const history = mockDriverHistory.find(h => h.driverId === bestDriver.id);
        if (history && history.hardRoutesThisWeek < 3) {
            reasoning.push(`${bestDriver.name} has only had ${history.hardRoutesThisWeek} hard routes this week`);
        }
    }
    
    reasoning.push(...difficulty.factors.map(f => `Route involves: ${f}`));
    
    return {
        routeId: pendingRoute.id,
        recommendedDriverId: bestDriver.id,
        confidence: Math.max(0.7, Math.min(0.98, 1 - Math.abs(bestScore) / 50)),
        reasoning,
        alternativeDrivers: sortedAlternatives.map(a => ({
            driverId: a.driver.id,
            reason: a.reason,
        })),
        fairnessImpact: {
            before: Math.round(currentGini * 1000) / 1000,
            after: Math.round(newGini * 1000) / 1000,
        },
    };
}

function calculateGiniFromScores(scores: number[]): number {
    if (scores.length === 0) return 0;
    const sorted = [...scores].sort((a, b) => a - b);
    const n = sorted.length;
    const mean = sorted.reduce((sum, val) => sum + val, 0) / n;
    if (mean === 0) return 0;
    
    let sumOfDifferences = 0;
    for (let i = 0; i < n; i++) {
        for (let j = 0; j < n; j++) {
            sumOfDifferences += Math.abs(sorted[i] - sorted[j]);
        }
    }
    return sumOfDifferences / (2 * n * n * mean);
}

// Get all routes including pending ones
export function getAllRoutes(): Route[] {
    return [...mockRoutes, ...mockPendingRoutes];
}

// Get driver by ID helper
export function getDriverById(id: string): typeof mockDrivers[0] | undefined {
    return mockDrivers.find(d => d.id === id);
}
