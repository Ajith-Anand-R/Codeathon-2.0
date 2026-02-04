/**
 * Fairness Logic Module
 * 
 * This module contains core algorithms for calculating effort scores
 * and fairness metrics. The Gini coefficient is used as the primary 
 * measure of workload distribution equality.
 */

/**
 * Calculate the Gini coefficient for a set of effort scores.
 * 
 * The Gini coefficient measures inequality in a distribution:
 * - 0 = perfect equality (all drivers have identical workload)
 * - 1 = perfect inequality (one driver does all work)
 * 
 * For FairRoute AI, we target a Gini < 0.15 as "Fair"
 * 
 * @param scores - Array of effort scores (one per driver)
 * @returns Gini coefficient between 0 and 1
 */
export function calculateGiniCoefficient(scores: number[]): number {
    if (scores.length === 0) return 0;
    if (scores.length === 1) return 0;

    // Sort scores in ascending order
    const sorted = [...scores].sort((a, b) => a - b);
    const n = sorted.length;
    const mean = sorted.reduce((sum, val) => sum + val, 0) / n;

    if (mean === 0) return 0;

    // Calculate Gini using the relative mean absolute difference
    let sumOfDifferences = 0;
    for (let i = 0; i < n; i++) {
        for (let j = 0; j < n; j++) {
            sumOfDifferences += Math.abs(sorted[i] - sorted[j]);
        }
    }

    return sumOfDifferences / (2 * n * n * mean);
}

/**
 * Determine fairness status based on Gini coefficient.
 * 
 * @param gini - Gini coefficient value
 * @returns Status object with label and color
 */
export function getFairnessStatus(gini: number): {
    label: "Fair" | "Moderate" | "Unfair";
    color: "green" | "yellow" | "red";
    description: string;
} {
    if (gini < 0.15) {
        return {
            label: "Fair",
            color: "green",
            description: "Workload is well-distributed across all drivers.",
        };
    } else if (gini < 0.30) {
        return {
            label: "Moderate",
            color: "yellow",
            description: "Some imbalance exists. Consider rebalancing soon.",
        };
    } else {
        return {
            label: "Unfair",
            color: "red",
            description: "Significant workload disparity detected. Action recommended.",
        };
    }
}

/**
 * Categorize driver workload level based on their effort score
 * relative to the team average.
 * 
 * @param driverScore - Individual driver's effort score
 * @param teamAverage - Team's average effort score
 * @returns Workload level category
 */
export function getWorkloadLevel(
    driverScore: number,
    teamAverage: number
): {
    level: "Low" | "Medium" | "High";
    percentageDiff: number;
} {
    if (teamAverage === 0) {
        return { level: "Medium", percentageDiff: 0 };
    }

    const percentageDiff = ((driverScore - teamAverage) / teamAverage) * 100;

    if (percentageDiff < -15) {
        return { level: "Low", percentageDiff };
    } else if (percentageDiff > 15) {
        return { level: "High", percentageDiff };
    } else {
        return { level: "Medium", percentageDiff };
    }
}

/**
 * Calculate total effort score for a route based on its characteristics.
 * 
 * Weight factors:
 * - Base effort: 10 points per delivery
 * - Weight penalty: 0.5 points per kg over 10kg
 * - Stairs penalty: 3 points per stair count
 * - Parking difficulty: easy=0, moderate=5, hard=10
 * 
 * @param route - Route characteristics
 * @returns Calculated effort score
 */
export function calculateRouteEffort(route: {
    weight_kg: number;
    stairs_count: number;
    parking_difficulty: "easy" | "moderate" | "hard";
}): number {
    const baseEffort = 10;
    const weightPenalty = Math.max(0, (route.weight_kg - 10) * 0.5);
    const stairsPenalty = route.stairs_count * 3;

    const parkingPenalties = {
        easy: 0,
        moderate: 5,
        hard: 10,
    };
    const parkingPenalty = parkingPenalties[route.parking_difficulty];

    return baseEffort + weightPenalty + stairsPenalty + parkingPenalty;
}

/**
 * Generate human-readable explanation for a route assignment.
 * 
 * This creates transparent, understandable explanations that sound
 * like they came from a thoughtful human dispatcher, not an algorithm.
 * 
 * @param params - Assignment context
 * @returns Human-readable explanation string
 */
export function generateExplanation(params: {
    driverName: string;
    driverCurrentEffort: number;
    teamAverageEffort: number;
    routeEffort: number;
    routeWeight: number;
    routeStairs: number;
    routeParking: "easy" | "moderate" | "hard";
}): string {
    const {
        driverName,
        driverCurrentEffort,
        teamAverageEffort,
        routeEffort,
        routeWeight,
        routeStairs,
        routeParking,
    } = params;

    const diffFromAverage = ((driverCurrentEffort - teamAverageEffort) / teamAverageEffort) * 100;
    const isBelow = diffFromAverage < 0;
    const diffPercent = Math.abs(Math.round(diffFromAverage));

    const parts: string[] = [];

    // Main reason based on workload balance
    if (isBelow && diffPercent > 10) {
        parts.push(
            `This route was assigned to ${driverName} because their cumulative effort today was ${diffPercent}% below the team average`
        );
    } else if (!isBelow && diffPercent > 10) {
        parts.push(
            `Despite ${driverName}'s effort being ${diffPercent}% above average, this route was the best match based on location and timing`
        );
    } else {
        parts.push(
            `${driverName} was selected because their workload is aligned with the team average`
        );
    }

    // Add route-specific context
    const factors: string[] = [];

    if (routeWeight > 15) {
        factors.push(`heavier packages (${routeWeight}kg)`);
    }
    if (routeStairs > 3) {
        factors.push(`multiple stair climbs (${routeStairs} floors)`);
    }
    if (routeParking === "hard") {
        factors.push("challenging parking conditions");
    } else if (routeParking === "easy") {
        factors.push("convenient parking access");
    }

    if (factors.length > 0) {
        parts.push(`, and this route involves ${factors.join(" and ")}`);
    }

    parts.push(".");

    return parts.join("");
}
