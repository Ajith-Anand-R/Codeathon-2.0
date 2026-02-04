"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { LayoutDashboard, Users, Map, MessageSquareText, Scale, Moon, Sun, Sparkles, Bot } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";

const navItems = [
    { href: "/", label: "Dashboard", icon: LayoutDashboard },
    { href: "/drivers", label: "Drivers", icon: Users },
    { href: "/routes", label: "Routes", icon: Map },
    { href: "/dispatch", label: "AI Dispatch", icon: Bot },
    { href: "/explanations", label: "Explanations", icon: MessageSquareText },
];

export function Navigation() {
    const pathname = usePathname();
    const [isDark, setIsDark] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        // Check initial theme
        const isDarkMode = document.documentElement.classList.contains("dark");
        setIsDark(isDarkMode);
        
        // Handle scroll
        const handleScroll = () => {
            setScrolled(window.scrollY > 10);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const toggleTheme = () => {
        const newIsDark = !isDark;
        setIsDark(newIsDark);
        document.documentElement.classList.toggle("dark", newIsDark);
        localStorage.setItem("theme", newIsDark ? "dark" : "light");
    };

    return (
        <header className={cn(
            "sticky top-0 z-50 w-full transition-all duration-300",
            scrolled 
                ? "bg-background/80 backdrop-blur-xl border-b shadow-sm" 
                : "bg-transparent"
        )}>
            <div className="container mx-auto px-4 flex h-16 items-center justify-between">
                {/* Logo */}
                <Link href="/" className="flex items-center gap-3 group">
                    <div className="relative">
                        <div className="absolute inset-0 bg-gradient-to-br from-violet-500 to-indigo-600 rounded-xl blur-sm opacity-75 group-hover:opacity-100 transition-opacity" />
                        <div className="relative p-2.5 rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 group-hover:from-violet-400 group-hover:to-indigo-500 transition-all shadow-lg">
                            <Scale className="h-5 w-5 text-white" />
                        </div>
                    </div>
                    <div className="flex flex-col">
                        <span className="font-bold text-lg leading-none tracking-tight flex items-center gap-1.5">
                            FairRoute
                            <span className="text-primary">AI</span>
                            <Sparkles className="h-3.5 w-3.5 text-amber-500" />
                        </span>
                        <span className="text-[10px] text-muted-foreground font-medium tracking-wide">
                            FAIRNESS-BY-DESIGN DISPATCH
                        </span>
                    </div>
                </Link>

                {/* Navigation */}
                <nav className="hidden md:flex items-center gap-1 p-1 rounded-2xl bg-muted/50 backdrop-blur-sm">
                    {navItems.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={cn(
                                    "flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200",
                                    isActive
                                        ? "bg-background text-foreground shadow-sm"
                                        : "text-muted-foreground hover:text-foreground hover:bg-background/50"
                                )}
                            >
                                <item.icon className={cn("h-4 w-4", isActive && "text-primary")} />
                                {item.label}
                            </Link>
                        );
                    })}
                </nav>

                {/* Actions */}
                <div className="flex items-center gap-2">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={toggleTheme}
                        className="rounded-xl hover:bg-muted/80 transition-colors"
                    >
                        {isDark ? (
                            <Sun className="h-5 w-5 text-amber-500" />
                        ) : (
                            <Moon className="h-5 w-5 text-indigo-500" />
                        )}
                        <span className="sr-only">Toggle theme</span>
                    </Button>
                </div>
            </div>
        </header>
    );
}

// Mobile Navigation (optional bottom nav for smaller screens)
export function MobileNavigation() {
    const pathname = usePathname();

    return (
        <nav className="md:hidden fixed bottom-4 left-4 right-4 z-50 rounded-2xl border bg-background/90 backdrop-blur-xl shadow-lg">
            <div className="flex items-center justify-around h-16">
                {navItems.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "flex flex-col items-center gap-1 px-3 py-2 rounded-xl text-xs transition-all",
                                isActive 
                                    ? "text-primary bg-primary/10" 
                                    : "text-muted-foreground hover:text-foreground"
                            )}
                        >
                            <item.icon className={cn("h-5 w-5", isActive && "text-primary")} />
                            <span className="font-medium">{item.label}</span>
                        </Link>
                    );
                })}
            </div>
        </nav>
    );
}
