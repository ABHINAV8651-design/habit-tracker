"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { BarChart3, TrendingUp, TrendingDown } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

type AnalyticsData = {
  weekly: { week: string; completion: number; count: number }[];
  monthly: { month: string; completion: number }[];
  habitStats: { id: string; name: string; type: string; consistencyPct: number; streak: number }[];
  mostConsistent: { name: string; consistencyPct: number } | null;
  weakest: { name: string; consistencyPct: number } | null;
  productivityTrend: number;
};

export default function AnalyticsPage() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/analytics")
      .then((r) => r.json())
      .then(setData)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading || !data) {
    return (
      <div className="p-8 flex justify-center">
        <div className="w-10 h-10 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="p-8 space-y-8">
      <h1 className="text-3xl font-bold tracking-tight">Analytics</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-emerald-500" />
              Most consistent
            </CardTitle>
          </CardHeader>
          <CardContent>
            {data.mostConsistent ? (
              <p className="text-2xl font-bold">{data.mostConsistent.name}</p>
              <p className="text-muted-foreground">{data.mostConsistent.consistencyPct}%</p>
            ) : (
              <p className="text-muted-foreground">No data yet.</p>
            )}
          </CardContent>
        </Card>
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <TrendingDown className="h-5 w-5 text-amber-500" />
              Needs attention
            </CardTitle>
          </CardHeader>
          <CardContent>
            {data.weakest ? (
              <>
                <p className="text-2xl font-bold">{data.weakest.name}</p>
                <p className="text-muted-foreground">{data.weakest.consistencyPct}%</p>
              </>
            ) : (
              <p className="text-muted-foreground">No data yet.</p>
            )}
          </CardContent>
        </Card>
      </div>

      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Weekly completion
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.weekly.slice(-16)}>
                <XAxis dataKey="week" fontSize={10} tickFormatter={(v) => v.slice(5)} />
                <YAxis fontSize={12} domain={[0, 100]} />
                <Tooltip />
                <Bar dataKey="completion" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="text-lg">Monthly trend</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data.monthly}>
                <XAxis dataKey="month" fontSize={12} />
                <YAxis fontSize={12} domain={[0, 100]} />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="completion"
                  stroke="hsl(var(--primary))"
                  strokeWidth={2}
                  dot={{ r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="text-lg">Habit comparison</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {data.habitStats.slice(0, 10).map((h) => (
              <div key={h.id} className="flex items-center gap-4">
                <span className="w-32 truncate text-sm font-medium">{h.name}</span>
                <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary rounded-full transition-all"
                    style={{ width: `${Math.min(100, h.consistencyPct)}%` }}
                  />
                </div>
                <span className="text-sm text-muted-foreground w-12 text-right">
                  {Math.round(h.consistencyPct)}%
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="text-lg">Productivity trend (last 30 days avg)</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold">{Math.round(data.productivityTrend)}</p>
          <p className="text-sm text-muted-foreground">score</p>
        </CardContent>
      </Card>
    </div>
  );
}
