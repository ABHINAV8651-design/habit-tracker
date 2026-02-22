"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Droplets,
  Flame,
  Target,
  Zap,
  Trophy,
  MessageCircle,
  TrendingUp,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ProgressRing } from "@/components/progress-ring";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Cell,
  Tooltip,
} from "recharts";

type DashboardData = {
  user: { name: string | null; xp: number; level: number; disciplineScore: number };
  todayHabits: { id: string; name: string; type: string; completed: boolean; timeSpent?: number; value?: number }[];
  progressRing: number;
  streak: number;
  productivityScore: number;
  fitnessScore: number;
  waterTotal: number;
  waterGoal: number;
  caloriesTotal: number;
  caloriesGoal: number;
  aiMessage: string;
  weekData: { date: string; label: string; completed: number; total: number; pct: number }[];
  heatmapData: { date: string; count: number }[];
};

export function DashboardClient() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/dashboard")
      .then((r) => r.json())
      .then(setData)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading || !data) {
    return (
      <div className="p-8 flex items-center justify-center min-h-[60vh]">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-10 h-10 border-2 border-primary border-t-transparent rounded-full"
        />
      </div>
    );
  }

  const waterPct = Math.min(100, (data.waterTotal / data.waterGoal) * 100);
  const caloriesPct = Math.min(100, (data.caloriesTotal / data.caloriesGoal) * 100);

  return (
    <div className="p-8 space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-wrap items-center justify-between gap-4"
      >
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Hey{data.user.name ? `, ${data.user.name}` : ""}
          </h1>
          <p className="text-muted-foreground mt-1">Here’s your day at a glance.</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Level {data.user.level}</span>
          <span className="rounded-full bg-primary/20 px-3 py-1 text-sm font-medium text-primary">
            {data.user.xp} XP
          </span>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Card className="glass-card overflow-hidden">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Today’s progress</p>
                  <p className="text-2xl font-bold">{data.progressRing}%</p>
                </div>
                <ProgressRing value={data.progressRing} size={64} strokeWidth={5} />
              </div>
            </CardContent>
          </Card>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
          <Card className="glass-card overflow-hidden">
            <CardContent className="pt-6 flex items-center gap-4">
              <div className="rounded-2xl bg-amber-500/20 p-3">
                <Trophy className="h-8 w-8 text-amber-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Streak</p>
                <p className="text-2xl font-bold">{data.streak} days</p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <Card className="glass-card overflow-hidden">
            <CardContent className="pt-6 flex items-center gap-4">
              <div className="rounded-2xl bg-emerald-500/20 p-3">
                <Zap className="h-8 w-8 text-emerald-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Productivity</p>
                <p className="text-2xl font-bold">{data.productivityScore}</p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
          <Card className="glass-card overflow-hidden">
            <CardContent className="pt-6 flex items-center gap-4">
              <div className="rounded-2xl bg-rose-500/20 p-3">
                <TrendingUp className="h-8 w-8 text-rose-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Fitness score</p>
                <p className="text-2xl font-bold">{data.fitnessScore}</p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="lg:col-span-2"
        >
          <Card className="glass-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2">
                <Target className="h-5 w-5" />
                Today’s habits
              </CardTitle>
            </CardHeader>
            <CardContent>
              {data.todayHabits.length === 0 ? (
                <p className="text-muted-foreground text-sm py-4">
                  No habits yet. Add some from the Habits page.
                </p>
              ) : (
                <ul className="space-y-2">
                  {data.todayHabits.map((h, i) => (
                    <li
                      key={h.id}
                      className={`flex items-center justify-between rounded-xl px-4 py-3 transition-colors ${
                        h.completed ? "bg-primary/10" : "bg-muted/50"
                      }`}
                    >
                      <span className="font-medium">{h.name}</span>
                      <span className="text-sm text-muted-foreground">
                        {h.completed ? "Done" : "—"}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
              <Button variant="glass" className="mt-4 w-full rounded-2xl" asChild>
                <a href="/habits">Manage habits</a>
              </Button>
            </CardContent>
          </Card>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
        >
          <Card className="glass-card h-full">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2">
                <MessageCircle className="h-5 w-5 text-primary" />
                AI message
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-relaxed">{data.aiMessage}</p>
              <Button variant="outline" size="sm" className="mt-4 rounded-xl" asChild>
                <a href="/ai-insights">See insights</a>
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
          <Card className="glass-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2">
                <Droplets className="h-5 w-5 text-blue-500" />
                Water
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                {data.waterTotal} / {data.waterGoal} glasses
              </p>
            </CardHeader>
            <CardContent>
              <Progress value={waterPct} className="h-3 rounded-full" />
            </CardContent>
          </Card>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45 }}>
          <Card className="glass-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2">
                <Flame className="h-5 w-5 text-orange-500" />
                Calories
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                {data.caloriesTotal} / {data.caloriesGoal} kcal
              </p>
            </CardHeader>
            <CardContent>
              <Progress value={caloriesPct} className="h-3 rounded-full" />
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="text-lg">Weekly progress</CardTitle>
            <CardDescription>Habit completion by day</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data.weekData}>
                  <XAxis dataKey="label" fontSize={12} />
                  <YAxis fontSize={12} domain={[0, 100]} />
                  <Tooltip
                    formatter={(value: number) => [`${value}%`, "Completion"]}
                    labelFormatter={(_, payload) => payload[0]?.payload?.date}
                  />
                  <Bar dataKey="pct" radius={[4, 4, 0, 0]} fill="hsl(var(--primary))" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.55 }}>
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="text-lg">Consistency heatmap</CardTitle>
            <CardDescription>Last 90 days</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-0.5 justify-start max-w-full">
              {data.heatmapData.map((cell) => (
                <div
                  key={cell.date}
                  className="w-2 h-2 rounded-sm transition-colors flex-shrink-0"
                  style={{
                    backgroundColor:
                      cell.count === 0
                        ? "hsl(var(--muted))"
                        : `hsl(var(--primary) / ${0.2 + (cell.count / 100) * 0.8})`,
                  }}
                  title={`${cell.date}: ${cell.count}%`}
                />
              ))}
            </div>
            <p className="text-xs text-muted-foreground mt-2">Less → More</p>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
