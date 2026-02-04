"use client";

import { useState } from "react";
import { SummaryCards } from "@/components/SummaryCards";
import { DriverTable } from "@/components/DriverTable";
import { FairnessChart } from "@/components/FairnessChart";
import { FairnessHistoryChart } from "@/components/FairnessHistoryChart";
import { getDashboardStats } from "@/lib/mockData";
import { ArrowRight, Sparkles, TrendingUp, Bot } from "lucide-react";
import Link from "next/link";

export default function DashboardPage() {
  const stats = getDashboardStats();
  const [selectedDriverId, setSelectedDriverId] = useState<string | null>(null);

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Hero Header */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-violet-500/10 via-indigo-500/10 to-purple-500/10 border p-8 md:p-10">
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-violet-500/20 to-transparent rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-indigo-500/20 to-transparent rounded-full blur-3xl" />
        
        <div className="relative space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium">
            <Sparkles className="h-3.5 w-3.5" />
            AI-Powered Fairness
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
            Welcome to <span className="gradient-text">FairRoute</span>
          </h1>
          
          <p className="text-lg text-muted-foreground max-w-2xl">
            We don&apos;t make all routes equal — we make the workload{" "}
            <span className="text-foreground font-semibold">fair</span>.
            Monitor driver assignments, track effort distribution, and ensure equitable dispatch decisions.
          </p>
          
          <div className="flex flex-wrap gap-3 pt-2">
            <Link 
              href="/dispatch"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-violet-500 to-purple-600 text-white font-medium hover:from-violet-600 hover:to-purple-700 transition-all hover:gap-3"
            >
              <Bot className="h-4 w-4" />
              Try AI Dispatch
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link 
              href="/drivers"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-all hover:gap-3"
            >
              View Drivers
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link 
              href="/explanations"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-muted text-foreground font-medium hover:bg-muted/80 transition-colors"
            >
              See Explanations
            </Link>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="stagger-children">
        <SummaryCards
          totalDrivers={stats.totalDrivers}
          totalDeliveries={stats.totalDeliveries}
          averageEffort={stats.averageEffort}
          giniCoefficient={stats.giniCoefficient}
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-6 lg:grid-cols-5">
        {/* Driver Workload Table - Takes up more space */}
        <div className="lg:col-span-3 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-primary" />
                Driver Workload
              </h2>
              <p className="text-sm text-muted-foreground">
                Click a row to highlight their route. Click &quot;Explain&quot; for assignment details.
              </p>
            </div>
          </div>
          <DriverTable
            drivers={stats.driversWithStats}
            onDriverSelect={(id) =>
              setSelectedDriverId(id === selectedDriverId ? null : id)
            }
          />
        </div>

        {/* Fairness Chart */}
        <div className="lg:col-span-2">
          <FairnessChart
            drivers={stats.driversWithStats}
            averageEffort={stats.averageEffort}
          />
        </div>
      </div>

      {/* Historical Fairness Chart */}
      <FairnessHistoryChart />

      {/* Quick Stats Footer */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-muted/50 to-muted/30 border backdrop-blur-sm">
        <div className="flex flex-wrap items-center justify-between gap-4 text-sm">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <TrendingUp className="h-5 w-5 text-primary" />
            </div>
            <p className="text-muted-foreground">
              <span className="font-semibold text-foreground">{stats.totalDrivers}</span> drivers
              active today with{" "}
              <span className="font-semibold text-foreground">{stats.totalDeliveries}</span>{" "}
              deliveries in progress
            </p>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-background/80 border">
            <span className="text-muted-foreground">Fairness Score:</span>
            <span className="font-mono font-bold text-primary text-lg">
              {stats.giniCoefficient.toFixed(3)}
            </span>
            <span className="text-xs text-muted-foreground">(lower is better)</span>
          </div>
        </div>
      </div>
    </div>
  );
}
