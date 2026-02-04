"use client";

import { useEffect, useState, useRef } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Map } from "lucide-react";
import type { Route as RouteType } from "@/lib/supabaseClient";
import type { DriverWithStats } from "@/lib/mockData";

interface RouteMapProps {
    routes: RouteType[];
    drivers: DriverWithStats[];
    selectedDriverId?: string | null;
}

// Color palette for different drivers
const DRIVER_COLORS = [
    "#ef4444", // red
    "#3b82f6", // blue
    "#10b981", // emerald
    "#f59e0b", // amber
    "#8b5cf6", // violet
    "#ec4899", // pink
    "#06b6d4", // cyan
    "#84cc16", // lime
];

export function RouteMap({ routes, drivers, selectedDriverId }: RouteMapProps) {
    const [isMounted, setIsMounted] = useState(false);
    const mapRef = useRef<HTMLDivElement>(null);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const mapInstanceRef = useRef<any>(null);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const layerGroupRef = useRef<any>(null);

    const getDriverColor = (driverId: string | undefined) => {
        if (!driverId) return "#6b7280";
        const index = drivers.findIndex((d) => d.id === driverId);
        return DRIVER_COLORS[index % DRIVER_COLORS.length];
    };

    const getDriverName = (driverId: string | undefined) => {
        if (!driverId) return "Unassigned";
        return drivers.find((d) => d.id === driverId)?.name || "Unknown";
    };

    useEffect(() => {
        setIsMounted(true);
    }, []);

    useEffect(() => {
        if (!isMounted || !mapRef.current || mapInstanceRef.current) return;

        // Dynamically import Leaflet
        import("leaflet").then((L) => {
            // Fix default marker icon
            delete (L.Icon.Default.prototype as unknown as { _getIconUrl?: unknown })._getIconUrl;
            L.Icon.Default.mergeOptions({
                iconRetinaUrl:
                    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
                iconUrl:
                    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
                shadowUrl:
                    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
            });

            // Initialize map - Centered on Chennai, India
            const map = L.map(mapRef.current!).setView([13.08, 80.18], 11);
            mapInstanceRef.current = map;

            L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
                attribution:
                    '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
            }).addTo(map);

            const layerGroup = L.layerGroup().addTo(map);
            layerGroupRef.current = layerGroup;
        });

        return () => {
            if (mapInstanceRef.current) {
                mapInstanceRef.current.off();
                mapInstanceRef.current.remove();
                mapInstanceRef.current = null;
                layerGroupRef.current = null;
            }
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isMounted]);

    useEffect(() => {
        if (!mapInstanceRef.current || !layerGroupRef.current) return;

        // Clear existing layers
        layerGroupRef.current.clearLayers();

        // Add routes
        import("leaflet").then((L) => {
            routes.forEach((route) => {
                const coords = route.geometry.coordinates.map(
                    (coord) => [coord[1], coord[0]] as [number, number]
                );
                const color = getDriverColor(route.assigned_driver_id);
                const isSelected = selectedDriverId === route.assigned_driver_id;

                const polyline = L.polyline(coords, {
                    color: color,
                    weight: isSelected ? 6 : 4,
                    opacity: selectedDriverId && !isSelected ? 0.3 : 1,
                }).addTo(layerGroupRef.current);

                // Tooltip content
                const getParkingIcon = (difficulty: string) => {
                    switch (difficulty) {
                        case "easy":
                            return "🅿️";
                        case "moderate":
                            return "⚠️";
                        case "hard":
                            return "🚫";
                        default:
                            return "📍";
                    }
                };

                polyline.bindTooltip(
                    `<div style="padding: 4px;">
            <p style="font-weight: 600; margin: 0;">${route.name}</p>
            <p style="font-size: 12px; color: #666; margin: 2px 0;">Driver: ${getDriverName(route.assigned_driver_id)}</p>
            <div style="font-size: 12px; margin-top: 4px;">
              <p style="margin: 2px 0;">📦 Weight: ${route.weight_kg}kg</p>
              <p style="margin: 2px 0;">🏢 Stairs: ${route.stairs_count} floors</p>
              <p style="margin: 2px 0;">${getParkingIcon(route.parking_difficulty)} Parking: ${route.parking_difficulty}</p>
            </div>
          </div>`,
                    { sticky: true }
                );

                // Add start marker
                const startCoord = route.geometry.coordinates[0];
                L.marker([startCoord[1], startCoord[0]]).addTo(layerGroupRef.current);
            });
        });
    }, [routes, selectedDriverId]);

    if (!isMounted) {
        return (
            <Card className="h-[500px] flex items-center justify-center border-0 shadow-md bg-card/80 backdrop-blur-sm">
                <div className="text-center space-y-3">
                    <div className="h-10 w-10 mx-auto rounded-xl bg-primary/10 flex items-center justify-center animate-pulse">
                        <Map className="h-5 w-5 text-primary" />
                    </div>
                    <p className="text-muted-foreground">Loading map...</p>
                </div>
            </Card>
        );
    }

    return (
        <Card className="overflow-hidden border-0 shadow-md bg-card/80 backdrop-blur-sm">
            <div className="h-1 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500" />
            <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2">
                    <div className="p-2 rounded-xl bg-emerald-500/10">
                        <Map className="h-5 w-5 text-emerald-500" />
                    </div>
                    Route Visualization
                </CardTitle>
                <CardDescription>
                    Interactive map showing all driver routes with difficulty indicators
                </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
                <div ref={mapRef} className="h-[500px] relative z-0" />

                {/* Legend */}
                <div className="p-4 border-t bg-muted/20">
                    <div className="flex flex-wrap gap-4 items-center justify-between">
                        <div className="flex flex-wrap gap-3">
                            {drivers.map((driver, index) => (
                                <div 
                                    key={driver.id} 
                                    className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-muted/50 border hover:bg-muted transition-colors cursor-default"
                                >
                                    <div
                                        className="w-3 h-3 rounded-full"
                                        style={{ backgroundColor: DRIVER_COLORS[index % DRIVER_COLORS.length] }}
                                    />
                                    <span className="text-sm font-medium">{driver.name.split(" ")[0]}</span>
                                </div>
                            ))}
                        </div>
                        <div className="flex gap-2 text-xs">
                            <Badge className="bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
                                🅿️ Easy
                            </Badge>
                            <Badge className="bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30">
                                ⚠️ Moderate
                            </Badge>
                            <Badge className="bg-red-500/15 text-red-600 dark:text-red-400 border border-red-500/30">
                                🚫 Hard
                            </Badge>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
