"use client";

import { useState } from "react";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { ArrowUpDown, Info, MapPin, Sparkles, Package, Footprints, Car } from "lucide-react";
import type { DriverWithStats } from "@/lib/mockData";

interface DriverTableProps {
    drivers: DriverWithStats[];
    onDriverSelect?: (driverId: string) => void;
}

type SortKey = "name" | "deliveriesCount" | "totalEffortScore" | "workloadLevel";
type SortDirection = "asc" | "desc";

export function DriverTable({ drivers, onDriverSelect }: DriverTableProps) {
    const [sortKey, setSortKey] = useState<SortKey>("totalEffortScore");
    const [sortDirection, setSortDirection] = useState<SortDirection>("desc");
    const [selectedDriver, setSelectedDriver] = useState<DriverWithStats | null>(null);

    const handleSort = (key: SortKey) => {
        if (sortKey === key) {
            setSortDirection(sortDirection === "asc" ? "desc" : "asc");
        } else {
            setSortKey(key);
            setSortDirection("desc");
        }
    };

    const sortedDrivers = [...drivers].sort((a, b) => {
        let comparison = 0;
        switch (sortKey) {
            case "name":
                comparison = a.name.localeCompare(b.name);
                break;
            case "deliveriesCount":
                comparison = a.deliveriesCount - b.deliveriesCount;
                break;
            case "totalEffortScore":
                comparison = a.totalEffortScore - b.totalEffortScore;
                break;
            case "workloadLevel":
                const levels = { Low: 1, Medium: 2, High: 3 };
                comparison = levels[a.workloadLevel] - levels[b.workloadLevel];
                break;
        }
        return sortDirection === "asc" ? comparison : -comparison;
    });

    const getWorkloadBadgeClass = (level: "Low" | "Medium" | "High"): string => {
        switch (level) {
            case "Low":
                return "bg-blue-500/15 text-blue-600 dark:text-blue-400 border-blue-500/30 border";
            case "Medium":
                return "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30 border";
            case "High":
                return "bg-orange-500/15 text-orange-600 dark:text-orange-400 border-orange-500/30 border";
        }
    };

    const SortableHeader = ({
        label,
        sortKeyValue,
    }: {
        label: string;
        sortKeyValue: SortKey;
    }) => (
        <Button
            variant="ghost"
            onClick={() => handleSort(sortKeyValue)}
            className="h-auto p-0 font-medium hover:bg-transparent hover:text-primary transition-colors"
        >
            {label}
            <ArrowUpDown className={`ml-2 h-3.5 w-3.5 ${sortKey === sortKeyValue ? 'text-primary' : 'text-muted-foreground'}`} />
        </Button>
    );

    return (
        <>
            <div className="rounded-2xl border overflow-hidden bg-card/50 backdrop-blur-sm shadow-sm">
                <Table>
                    <TableHeader>
                        <TableRow className="bg-muted/30 hover:bg-muted/30">
                            <TableHead className="font-semibold">
                                <SortableHeader label="Driver Name" sortKeyValue="name" />
                            </TableHead>
                            <TableHead className="text-center font-semibold">
                                <SortableHeader label="Deliveries" sortKeyValue="deliveriesCount" />
                            </TableHead>
                            <TableHead className="text-center font-semibold">
                                <SortableHeader label="Effort Score" sortKeyValue="totalEffortScore" />
                            </TableHead>
                            <TableHead className="text-center font-semibold">
                                <SortableHeader label="Workload" sortKeyValue="workloadLevel" />
                            </TableHead>
                            <TableHead className="font-semibold">Assigned Route</TableHead>
                            <TableHead className="text-right font-semibold">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {sortedDrivers.map((driver, index) => (
                            <TableRow
                                key={driver.id}
                                className="cursor-pointer hover:bg-primary/5 transition-all duration-200 group"
                                onClick={() => onDriverSelect?.(driver.id)}
                                style={{ animationDelay: `${index * 50}ms` }}
                            >
                                <TableCell className="font-medium">
                                    <div className="flex items-center gap-3">
                                        <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-violet-500/20 to-indigo-500/20 flex items-center justify-center text-sm font-semibold text-primary">
                                            {driver.name.split(' ').map(n => n[0]).join('')}
                                        </div>
                                        <span>{driver.name}</span>
                                    </div>
                                </TableCell>
                                <TableCell className="text-center">
                                    <span className="inline-flex items-center justify-center min-w-[2rem] px-2 py-1 rounded-lg bg-muted font-medium">
                                        {driver.deliveriesCount}
                                    </span>
                                </TableCell>
                                <TableCell className="text-center">
                                    <span className="font-mono font-semibold text-lg">
                                        {driver.totalEffortScore}
                                    </span>
                                </TableCell>
                                <TableCell className="text-center">
                                    <Badge className={getWorkloadBadgeClass(driver.workloadLevel)}>
                                        {driver.workloadLevel}
                                    </Badge>
                                </TableCell>
                                <TableCell>
                                    {driver.assignedRoute ? (
                                        <div className="flex items-center gap-2 text-sm">
                                            <div className="h-6 w-6 rounded-lg bg-primary/10 flex items-center justify-center">
                                                <MapPin className="h-3.5 w-3.5 text-primary" />
                                            </div>
                                            <span className="font-medium">{driver.assignedRoute.name}</span>
                                        </div>
                                    ) : (
                                        <span className="text-muted-foreground text-sm italic">None assigned</span>
                                    )}
                                </TableCell>
                                <TableCell className="text-right">
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setSelectedDriver(driver);
                                        }}
                                        className="rounded-xl hover:bg-primary/10 hover:text-primary transition-colors"
                                    >
                                        <Sparkles className="h-4 w-4 mr-1.5" />
                                        Explain
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>

            {/* Explanation Modal */}
            <Dialog open={!!selectedDriver} onOpenChange={() => setSelectedDriver(null)}>
                <DialogContent className="sm:max-w-[560px] rounded-2xl">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2 text-xl">
                            <div className="p-2 rounded-xl bg-primary/10">
                                <Sparkles className="h-5 w-5 text-primary" />
                            </div>
                            Why this assignment?
                        </DialogTitle>
                        <DialogDescription>
                            AI-powered explanation for {selectedDriver?.name}&apos;s route assignment
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-5 pt-4">
                        {selectedDriver?.explanation ? (
                            <>
                                <div className="p-5 bg-gradient-to-r from-primary/10 via-primary/5 to-transparent rounded-xl border-l-4 border-primary">
                                    <p className="text-sm leading-relaxed">
                                        {selectedDriver.explanation.reason_text}
                                    </p>
                                </div>

                                <div className="space-y-3">
                                    <h4 className="text-sm font-semibold flex items-center gap-2">
                                        <Info className="h-4 w-4 text-muted-foreground" />
                                        Effort Breakdown
                                    </h4>
                                    <div className="grid grid-cols-2 gap-3">
                                        <div className="p-4 rounded-xl border bg-gradient-to-br from-violet-500/10 to-transparent">
                                            <span className="text-xs text-muted-foreground">Driver Effort</span>
                                            <p className="text-2xl font-bold text-violet-600 dark:text-violet-400">{selectedDriver.totalEffortScore}</p>
                                        </div>
                                        <div className="p-4 rounded-xl border bg-gradient-to-br from-indigo-500/10 to-transparent">
                                            <span className="text-xs text-muted-foreground">vs Team Average</span>
                                            <p className={`text-2xl font-bold ${
                                                (selectedDriver.explanation.factors.effort_diff as number) < 0 
                                                    ? 'text-emerald-600 dark:text-emerald-400' 
                                                    : 'text-orange-600 dark:text-orange-400'
                                            }`}>
                                                {(selectedDriver.explanation.factors.effort_diff as number) > 0 ? "+" : ""}
                                                {selectedDriver.explanation.factors.effort_diff as number}%
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {selectedDriver.assignedRoute && (
                                    <div className="space-y-3">
                                        <h4 className="text-sm font-semibold">Route Difficulty Factors</h4>
                                        <div className="grid grid-cols-3 gap-3">
                                            <div className="p-4 rounded-xl border text-center bg-muted/30">
                                                <Package className="h-5 w-5 mx-auto mb-2 text-blue-500" />
                                                <span className="text-xs text-muted-foreground block">Weight</span>
                                                <span className="font-bold text-lg">
                                                    {selectedDriver.assignedRoute.weight_kg}kg
                                                </span>
                                            </div>
                                            <div className="p-4 rounded-xl border text-center bg-muted/30">
                                                <Footprints className="h-5 w-5 mx-auto mb-2 text-amber-500" />
                                                <span className="text-xs text-muted-foreground block">Stairs</span>
                                                <span className="font-bold text-lg">
                                                    {selectedDriver.assignedRoute.stairs_count}
                                                </span>
                                            </div>
                                            <div className="p-4 rounded-xl border text-center bg-muted/30">
                                                <Car className="h-5 w-5 mx-auto mb-2 text-emerald-500" />
                                                <span className="text-xs text-muted-foreground block">Parking</span>
                                                <span className="font-bold text-lg capitalize">
                                                    {selectedDriver.assignedRoute.parking_difficulty}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </>
                        ) : (
                            <div className="p-8 text-center">
                                <div className="h-12 w-12 mx-auto mb-4 rounded-xl bg-muted flex items-center justify-center">
                                    <Info className="h-6 w-6 text-muted-foreground" />
                                </div>
                                <p className="text-sm text-muted-foreground">
                                    No explanation available for this assignment.
                                </p>
                            </div>
                        )}
                    </div>
                </DialogContent>
            </Dialog>
        </>
    );
}
