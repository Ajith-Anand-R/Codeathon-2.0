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
                <Link href="/" className="flex items-center gap-2 md:gap-3 group">
                    <div className="relative shrink-0">
                        <div className="absolute inset-0 bg-gradient-to-br from-violet-500 to-indigo-600 rounded-lg md:rounded-xl blur-sm opacity-75 group-hover:opacity-100 transition-opacity" />
                        <div className="relative p-2 md:p-2.5 rounded-lg md:rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 group-hover:from-violet-400 group-hover:to-indigo-500 transition-all shadow-lg">
                            <Scale className="h-4 w-4 md:h-5 md:w-5 text-white" />
                        </div>
                    </div>
                    <div className="flex flex-col">
                        <span className="font-bold text-base md:text-lg leading-none tracking-tight flex items-center gap-1 md:gap-1.5">
                            FairRoute
                            <span className="text-primary">AI</span>
                            <Sparkles className="h-3 w-3 md:h-3.5 md:w-3.5 text-amber-500" />
                        </span>
                        <span className="hidden sm:inline text-[10px] text-muted-foreground font-medium tracking-wide">
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
        <nav className="md:hidden fixed bottom-3 left-3 right-3 z-40 rounded-2xl border bg-background/95 backdrop-blur-xl shadow-2xl">
            <div className="flex items-center justify-around px-1 py-2">
                {navItems.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "flex flex-col items-center gap-0.5 px-2 py-1.5 rounded-xl text-[10px] transition-all min-w-0 flex-1",
                                isActive 
                                    ? "text-primary bg-primary/10" 
                                    : "text-muted-foreground hover:text-foreground"
                            )}
                        >
                            <item.icon className={cn("h-4 w-4 shrink-0", isActive && "text-primary")} />
                            <span className="font-medium truncate w-full text-center leading-tight">{item.label}</span>
                        </Link>
                    );
                })}
            </div>
        </nav>
    );
}
