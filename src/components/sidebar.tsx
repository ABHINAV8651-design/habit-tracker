"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import {
  LayoutDashboard,
  Target,
  Dumbbell,
  Zap,
  BarChart3,
  Sparkles,
  TrendingUp,
  Settings,
  User,
  LogOut,
  Moon,
  Sun,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/components/theme-provider";

const nav = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/habits", label: "Habits", icon: Target },
  { href: "/fitness", label: "Fitness", icon: Dumbbell },
  { href: "/productivity", label: "Productivity", icon: Zap },
  { href: "/analytics", label: "Analytics", icon: BarChart3 },
  { href: "/ai-insights", label: "AI Insights", icon: Sparkles },
  { href: "/future-self", label: "Future Self", icon: TrendingUp },
];

export function Sidebar() {
  const pathname = usePathname();
  const { theme, setTheme, resolvedTheme } = useTheme();

  return (
    <aside className="fixed left-0 top-0 z-40 h-screen w-64 border-r border-border/50 bg-card/80 backdrop-blur-xl flex flex-col">
      <div className="p-6 border-b border-border/50">
        <Link href="/dashboard" className="flex items-center gap-2">
          <span className="text-xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
            FutureMe AI
          </span>
        </Link>
        <p className="text-xs text-muted-foreground mt-1">Life OS</p>
      </div>
      <nav className="flex-1 p-3 space-y-0.5 overflow-y-auto">
        {nav.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link key={item.href} href={item.href}>
              <motion.span
                className={cn(
                  "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-primary/15 text-primary"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
                whileHover={{ x: 2 }}
                whileTap={{ scale: 0.98 }}
              >
                <Icon className="h-5 w-5 shrink-0" />
                {item.label}
              </motion.span>
            </Link>
          );
        })}
      </nav>
      <div className="p-3 border-t border-border/50 space-y-0.5">
        <Link href="/settings">
          <span
            className={cn(
              "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground",
              pathname === "/settings" && "bg-primary/15 text-primary"
            )}
          >
            <Settings className="h-5 w-5" />
            Settings
          </span>
        </Link>
        <Link href="/profile">
          <span
            className={cn(
              "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground",
              pathname === "/profile" && "bg-primary/15 text-primary"
            )}
          >
            <User className="h-5 w-5" />
            Profile
          </span>
        </Link>
        <Button
          variant="ghost"
          size="sm"
          className="w-full justify-start gap-3 rounded-xl text-muted-foreground"
          onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
        >
          {resolvedTheme === "dark" ? (
            <Sun className="h-5 w-5" />
          ) : (
            <Moon className="h-5 w-5" />
          )}
          {resolvedTheme === "dark" ? "Light mode" : "Dark mode"}
        </Button>
        <form action="/api/auth/logout" method="POST">
          <Button
            type="submit"
            variant="ghost"
            size="sm"
            className="w-full justify-start gap-3 rounded-xl text-muted-foreground hover:text-destructive"
          >
            <LogOut className="h-5 w-5" />
            Sign out
          </Button>
        </form>
      </div>
    </aside>
  );
}
